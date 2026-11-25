// Diario del bebé v3 · lógica del servidor (independiente de Netlify para poder probarla).
// Datos en un almacén clave-valor con etags (Netlify Blobs en producción).

import crypto from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(crypto.scrypt);

/* ---------- Catálogo ---------- */
export const MODULES = {
  sueno: { name: 'Sueño', free: true },
  tomas: { name: 'Tomas' }, comidas: { name: 'Comidas' }, panales: { name: 'Pañales' },
  salud: { name: 'Salud' }, notas: { name: 'Notas' }, analisis: { name: 'Análisis' },
  familia: { name: 'Compartir en familia' }, bebes: { name: 'Varios bebés' },
  banos: { name: 'Baños' }, siesta: { name: 'Próxima siesta' }, crecimiento: { name: 'Crecimiento' },
  hitos: { name: 'Hitos y dientes' }, informe: { name: 'Informe para el pediatra' },
};
export const PAID = Object.keys(MODULES).filter((k) => !MODULES[k].free);
export const TYPE_MODULE = {
  sueno: 'sueno', despertar: 'sueno', despertar_def: 'sueno', pecho: 'tomas', biberon: 'tomas',
  comida: 'comidas', panal: 'panales', evento: 'salud', bano: 'banos', medida: 'crecimiento',
  hito: 'hitos', diente: 'hitos',
};
const ROLES = ['owner', 'member', 'reader'];
const MAX_OPS = 400, MAX_BODY = 1024 * 1024, MAX_IMG = 450 * 1024;
const TOKEN_DAYS = 90, ADMIN_TOKEN_DAYS = 30, LOCK_MIN = 15, MAX_FAILS = 5;

/* ---------- Utilidades ---------- */
const json = (status, body) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});
const err = (status, error, message, extra = {}) => json(status, { error, message, ...extra });
const now = () => Date.now();
const rid = (p, n = 10) => p + crypto.randomBytes(n).toString('base64url').replace(/[-_]/g, '').slice(0, n);
const b64u = (s) => Buffer.from(s).toString('base64url');
const isStr = (s, max = 200) => typeof s === 'string' && s.length > 0 && s.length <= max;
const num = (n) => typeof n === 'number' && Number.isFinite(n);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (s, max = 2000) => (typeof s === 'string' ? s.slice(0, max) : '');

function safeEq(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}
async function hashPass(pw) {
  const salt = crypto.randomBytes(16);
  const h = await scrypt(pw, salt, 32);
  return `s1$${salt.toString('hex')}$${h.toString('hex')}`;
}
async function checkPass(pw, stored) {
  if (typeof stored !== 'string') return false;
  const [v, salt, hex] = stored.split('$');
  if (v !== 's1' || !salt || !hex) return false;
  const h = await scrypt(String(pw), Buffer.from(salt, 'hex'), 32);
  return crypto.timingSafeEqual(h, Buffer.from(hex, 'hex'));
}

/* ---------- Almacén ---------- */
async function read(store, key, fallback) {
  const v = await store.get(key, { type: 'json' });
  return v == null ? fallback() : v;
}
// Lee, aplica fn y guarda solo si nadie ha escrito entre medias. fn devuelve el nuevo valor o undefined (sin cambios).
async function mutate(store, key, fallback, fn) {
  for (let i = 0; i < 8; i++) {
    const cur = await store.getWithMetadata(key, { type: 'json' });
    const data = cur?.data ?? fallback();
    const res = await fn(data);
    if (res && res.__abort) return res;
    if (res === undefined) return { data, changed: false };
    const w = cur ? await store.setJSON(key, res, { onlyIfMatch: cur.etag }) : await store.setJSON(key, res, { onlyIfNew: true });
    if (w.modified) return { data: res, changed: true };
    await sleep(30 + Math.random() * 120);
  }
  throw Object.assign(new Error('busy'), { status: 409 });
}
const abort = (status, error, message) => ({ __abort: true, status, error, message });

const K = {
  config: 'config', users: 'users', accounts: 'accounts', payments: 'payments', audit: 'audit',
  acc: (id) => `acc/${id}`, accrev: (id) => `accrev/${id}`, img: (acc, id) => `img/${acc}/${id}`,
};
const emptyConfig = () => ({ v: 3, secret: null, bizum: '', bizumName: '', payText: '', prices: { module: 1, all: 20 }, trialDays: 7, adminTv: 0, adminFails: [], adminLockUntil: 0, migrated: false });
const emptyUsers = () => ({ users: {} });
const emptyAccounts = () => ({ accounts: {} });
const emptyPayments = () => ({ list: [] });
const emptyAcc = () => ({ v: 3, rev: 0, events: {}, notes: {}, babies: {}, settings: null });

async function getSecret(store) {
  const cfg = await read(store, K.config, emptyConfig);
  if (cfg.secret) return cfg.secret;
  const { data } = await mutate(store, K.config, emptyConfig, (c) => (c.secret ? undefined : { ...c, secret: crypto.randomBytes(32).toString('hex') }));
  return data.secret;
}
function sign(secret, payload) {
  const body = b64u(JSON.stringify(payload));
  const mac = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${mac}`;
}
function verify(secret, token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, mac] = token.split('.');
  const good = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (!mac || mac.length !== good.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good))) return null;
  try { const p = JSON.parse(Buffer.from(body, 'base64url').toString()); return p.exp > now() ? p : null; } catch { return null; }
}
async function audit(store, who, op, detail) {
  try {
    await mutate(store, K.audit, () => ({ list: [] }), (a) => ({ list: [{ t: now(), who, op, detail }, ...a.list].slice(0, 400) }));
  } catch { /* el registro nunca bloquea la operación */ }
}

/* ---------- Módulos activos ---------- */
const active = (m, t = now()) => !!m && (m.from ?? 0) <= t && (m.until == null || m.until > t);
export function entitlements(user, acc, t = now()) {
  const mods = {};
  for (const k of Object.keys(MODULES)) {
    if (MODULES[k].free) { mods[k] = { on: true, free: true }; continue; }
    const am = acc?.mods?.[k];
    const ov = user?.mods?.[k];
    const accOn = active(am, t);
    const on = ov === 'on' ? true : ov === 'off' ? false : accOn;
    mods[k] = { on, until: accOn ? am.until ?? null : null, from: am?.from ?? null, override: ov || null, trial: !!(am && am.trial && accOn) };
  }
  return mods;
}
const publicUser = (u) => ({ id: u.id, username: u.username, name: u.name, role: u.role, accountId: u.accountId, mods: u.mods || {}, blocked: !!u.blocked, mustChange: !!u.mustChange, created: u.created, lockedUntil: u.lockUntil > now() ? u.lockUntil : 0 });
const publicAccount = (a) => ({ id: a.id, name: a.name, code: a.code, blocked: !!a.blocked, created: a.created, mods: a.mods || {} });

/* ---------- Autenticación ---------- */
async function authUser(req, store) {
  const tok = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const secret = await getSecret(store);
  const p = verify(secret, tok);
  if (!p || p.u === 'admin') return { error: err(401, 'auth', 'Tienes que volver a entrar.') };
  const { users } = await read(store, K.users, emptyUsers);
  const u = users[p.u];
  if (!u || (u.tv || 0) !== p.v) return { error: err(401, 'auth', 'Tienes que volver a entrar.') };
  if (u.blocked) return { error: err(403, 'blocked', 'Tu usuario está bloqueado. Habla con quien te dio el acceso.') };
  const { accounts } = await read(store, K.accounts, emptyAccounts);
  const acc = accounts[u.accountId];
  if (!acc) return { error: err(403, 'no_account', 'Tu usuario no tiene una cuenta asignada.') };
  if (acc.blocked) return { error: err(403, 'account_blocked', 'Esta cuenta está bloqueada. Habla con quien te dio el acceso.') };
  const ent = entitlements(u, acc);
  if (u.role !== 'owner' && !ent.familia.on) return { error: err(403, 'needs_familia', 'El acceso compartido de tu familia no está activo. El titular de la cuenta puede renovarlo.') };
  return { u, acc, ent, users, accounts };
}
async function authAdmin(req, store) {
  const tok = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const secret = await getSecret(store);
  const p = verify(secret, tok);
  const cfg = await read(store, K.config, emptyConfig);
  if (!p || p.u !== 'admin' || p.v !== (cfg.adminTv || 0)) return { error: err(401, 'auth', 'Tienes que volver a entrar como administrador.') };
  return { cfg };
}

async function login(req, store) {
  const body = await req.json().catch(() => ({}));
  const username = String(body.username || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!username || !password) return err(400, 'missing', 'Escribe tu usuario y tu contraseña.');
  const { users } = await read(store, K.users, emptyUsers);
  const u = Object.values(users).find((x) => x.username === username);
  if (!u) { await sleep(350); return err(401, 'auth', 'Usuario o contraseña incorrectos.'); }
  if (u.lockUntil > now()) return err(429, 'locked', 'Demasiados intentos. Prueba de nuevo en unos minutos.', { until: u.lockUntil });
  const ok = await checkPass(password, u.hash);
  if (!ok) {
    await mutate(store, K.users, emptyUsers, (d) => {
      const x = d.users[u.id]; if (!x) return undefined;
      const fails = (x.fails || []).filter((t) => t > now() - LOCK_MIN * 60000).concat(now());
      if (fails.length >= MAX_FAILS) { x.lockUntil = now() + LOCK_MIN * 60000; x.fails = []; } else x.fails = fails;
      return d;
    });
    return err(401, 'auth', 'Usuario o contraseña incorrectos.');
  }
  if (u.fails?.length) await mutate(store, K.users, emptyUsers, (d) => { if (!d.users[u.id]) return undefined; d.users[u.id].fails = []; return d; });
  const secret = await getSecret(store);
  const token = sign(secret, { u: u.id, v: u.tv || 0, exp: now() + TOKEN_DAYS * 864e5 });
  // Comprobar la cuenta con el pase recién creado
  const fake = new Request('http://x', { headers: { authorization: 'Bearer ' + token } });
  const a = await authUser(fake, store);
  if (a.error) return a.error;
  return json(200, { token, me: meInfo(a) });
}

async function changePassword(req, store) {
  const a = await authUser(req, store); if (a.error) return a.error;
  const body = await req.json().catch(() => ({}));
  const next = String(body.next || '');
  if (next.length < 8) return err(400, 'weak', 'La contraseña nueva necesita al menos 8 caracteres.');
  if (!(await checkPass(String(body.current || ''), a.u.hash))) return err(401, 'wrong', 'La contraseña actual no es correcta.');
  const hash = await hashPass(next);
  const { data } = await mutate(store, K.users, emptyUsers, (d) => {
    const x = d.users[a.u.id]; if (!x) return undefined;
    x.hash = hash; x.mustChange = false; x.tv = (x.tv || 0) + 1; return d;
  });
  const u = data.users[a.u.id];
  const token = sign(await getSecret(store), { u: u.id, v: u.tv, exp: now() + TOKEN_DAYS * 864e5 });
  return json(200, { token });
}

/* ---------- Sincronización ---------- */
function changesSince(data, since) {
  const full = !(since >= 0) || since > data.rev;
  const pick = (map) => Object.values(map).filter((x) => full || x._rev > since);
  return {
    rev: data.rev, full, events: pick(data.events), notes: pick(data.notes), babies: pick(data.babies),
    settings: data.settings && (full || data.settings._rev > since) ? data.settings : null,
  };
}
function meInfo({ u, acc, ent, users }, cfg, payments) {
  const members = Object.values(users || {}).filter((x) => x.accountId === acc.id && !x.blocked).map((x) => ({ id: x.id, name: x.name, role: x.role }));
  return {
    user: { id: u.id, name: u.name, username: u.username, role: u.role, mustChange: !!u.mustChange },
    account: { id: acc.id, name: acc.name, code: acc.code }, mods: ent, members,
    sale: cfg ? { bizum: cfg.bizum || '', bizumName: cfg.bizumName || '', payText: cfg.payText || '', prices: cfg.prices || { module: 1, all: 20 }, trialDays: cfg.trialDays || 7 } : undefined,
    payments: payments ? payments.list.filter((p) => p.accountId === acc.id).slice(0, 30).map((p) => ({ id: p.id, module: p.module, status: p.status, created: p.created, from: p.from ?? null, until: p.until ?? null })) : undefined,
  };
}
function cleanItem(item, extra = []) {
  if (!item || typeof item !== 'object' || !isStr(item.id, 80) || !num(item.updated)) return null;
  const out = {};
  for (const [k, v] of Object.entries(item)) {
    if (k === '_rev' || k === 'demo' || extra.includes(k)) continue;
    if (v === null || ['number', 'boolean'].includes(typeof v)) out[k] = v;
    else if (typeof v === 'string') out[k] = v.slice(0, 2000);
  }
  return out;
}
const primaryBaby = (data) => Object.values(data.babies).filter((b) => !b.deleted && !b.archived).sort((a, b) => (a.created || 0) - (b.created || 0))[0];
function canWriteBaby(data, babyId, ent) {
  const b = data.babies[babyId];
  if (!b || b.deleted) return false;
  if (ent.bebes.on) return true;
  const p = primaryBaby(data);
  return p && p.id === babyId;
}
function applyOps(data, ops, a) {
  const rev = data.rev + 1, rejected = [];
  let changed = false;
  const reject = (op, why) => rejected.push({ k: op?.k, id: op?.item?.id, why });
  for (const op of ops) {
    if (!op || typeof op !== 'object') continue;
    if (a.u.role === 'reader') { reject(op, 'reader'); continue; }
    if (op.k === 'settings') {
      const s = cleanItem({ ...op.item, id: 'settings' });
      if (!s) { reject(op, 'invalid'); continue; }
      if (!data.settings || s.updated >= data.settings.updated) { data.settings = { ...s, _rev: rev }; changed = true; }
      continue;
    }
    if (op.k === 'baby') {
      const b = cleanItem(op.item);
      if (!b) { reject(op, 'invalid'); continue; }
      if (a.u.role !== 'owner') { reject(op, 'owner_only'); continue; }
      const cur = data.babies[b.id];
      const activeCount = Object.values(data.babies).filter((x) => !x.deleted && !x.archived).length;
      if (!cur && activeCount >= 1 && !a.ent.bebes.on) { reject(op, 'module'); continue; }
      if (cur && b.updated < cur.updated) continue;
      data.babies[b.id] = { ...cur, ...b, created: cur?.created || b.created || now(), _rev: rev };
      changed = true; continue;
    }
    const map = op.k === 'ev' ? data.events : op.k === 'note' ? data.notes : null;
    const item = map && cleanItem(op.item, ['by', 'uid']);
    if (!item) { reject(op, 'invalid'); continue; }
    const cur = map[item.id];
    const type = item.deleted ? cur?.type : item.type;
    if (op.k === 'ev') {
      if (!item.deleted && !TYPE_MODULE[type]) { reject(op, 'invalid'); continue; }
      if (type && !a.ent[TYPE_MODULE[type]]?.on) { reject(op, 'module'); continue; }
      const baby = item.deleted ? cur?.baby : item.baby;
      if (baby && !canWriteBaby(data, baby, a.ent)) { reject(op, 'baby'); continue; }
      if (!item.deleted && !baby) { reject(op, 'invalid'); continue; }
    } else if (!a.ent.notas.on) { reject(op, 'module'); continue; }
    if (cur && item.updated < cur.updated) continue;
    const by = cur ? { by: cur.by, uid: cur.uid } : { by: a.u.name, uid: a.u.id };
    map[item.id] = { ...item, ...by, _rev: rev };
    changed = true;
  }
  if (changed) data.rev = rev;
  return { changed, rejected };
}

async function sync(req, store) {
  const a = await authUser(req, store); if (a.error) return a.error;
  const url = new URL(req.url);
  const sinceRaw = url.searchParams.get('since');
  const since = sinceRaw === null || sinceRaw === '' ? -1 : Number(sinceRaw);
  const [cfg, payments] = await Promise.all([read(store, K.config, emptyConfig), read(store, K.payments, emptyPayments)]);
  const me = meInfo(a, cfg, payments);
  if (req.method === 'GET') {
    const rev = await store.get(K.accrev(a.acc.id), { type: 'json' });
    if (num(rev) && since === rev) return json(200, { rev, full: false, events: [], notes: [], babies: [], settings: null, me });
    const data = await read(store, K.acc(a.acc.id), emptyAcc);
    return json(200, { ...changesSince(data, since), me });
  }
  const text = await req.text();
  if (text.length > MAX_BODY) return err(413, 'too_large', 'Demasiados cambios a la vez.');
  let body; try { body = JSON.parse(text || '{}'); } catch { return err(400, 'bad_json', 'Petición no válida.'); }
  const ops = Array.isArray(body.ops) ? body.ops.slice(0, MAX_OPS) : [];
  let rejected = [];
  const res = await mutate(store, K.acc(a.acc.id), emptyAcc, (data) => {
    const r = applyOps(data, ops, a); rejected = r.rejected;
    return r.changed ? data : undefined;
  });
  if (res.changed) await store.setJSON(K.accrev(a.acc.id), res.data.rev);
  return json(200, { ...changesSince(res.data, since), rejected, me });
}

async function payRequest(req, store) {
  const a = await authUser(req, store); if (a.error) return a.error;
  const body = await req.json().catch(() => ({}));
  const module = body.module === 'all' ? 'all' : PAID.includes(body.module) ? body.module : null;
  if (!module) return err(400, 'module', 'Módulo no válido.');
  const cfg = await read(store, K.config, emptyConfig);
  const amount = module === 'all' ? cfg.prices?.all ?? 20 : cfg.prices?.module ?? 1;
  let created = null;
  await mutate(store, K.payments, emptyPayments, (p) => {
    if (p.list.some((x) => x.accountId === a.acc.id && x.module === module && x.status === 'pending')) return undefined;
    created = { id: rid('pay_'), accountId: a.acc.id, accountName: a.acc.name, userId: a.u.id, userName: a.u.name, module, amount, status: 'pending', created: now(), source: 'app' };
    return { list: [created, ...p.list].slice(0, 2000) };
  });
  return json(200, { ok: true, created: !!created });
}

/* ---------- Fotos (hitos) ---------- */
async function image(req, store, id) {
  const a = await authUser(req, store); if (a.error) return a.error;
  if (!/^[A-Za-z0-9_-]{4,60}$/.test(id || '')) return err(400, 'id', 'Foto no válida.');
  if (req.method === 'GET') {
    const v = await store.get(K.img(a.acc.id, id), { type: 'json' });
    if (!v) return err(404, 'not_found', 'No existe esa foto.');
    return json(200, v);
  }
  if (req.method === 'PUT') {
    if (a.u.role === 'reader' || !a.ent.hitos.on) return err(403, 'module', 'Necesitas el módulo Hitos y dientes.');
    const text = await req.text();
    if (text.length > MAX_IMG * 1.4) return err(413, 'too_large', 'La foto es demasiado grande.');
    let body; try { body = JSON.parse(text); } catch { return err(400, 'bad_json', 'Foto no válida.'); }
    if (typeof body.data !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(body.data)) return err(400, 'type', 'Formato de foto no válido.');
    await store.setJSON(K.img(a.acc.id, id), { data: body.data, t: now() });
    return json(200, { ok: true });
  }
  return err(405, 'method', 'Método no permitido.');
}

/* ---------- Administración ---------- */
async function adminLogin(req, store, env) {
  const user = env.ADMIN_USER, pass = env.ADMIN_PASSWORD;
  if (!user || !pass) return err(500, 'config', 'Faltan las variables ADMIN_USER y ADMIN_PASSWORD en Netlify.');
  const cfg = await read(store, K.config, emptyConfig);
  if (cfg.adminLockUntil > now()) return err(429, 'locked', 'Demasiados intentos. Prueba de nuevo en unos minutos.');
  const body = await req.json().catch(() => ({}));
  const ok = safeEq(String(body.username || '').trim().toLowerCase(), String(user).trim().toLowerCase()) & safeEq(String(body.password || ''), String(pass));
  if (!ok) {
    await mutate(store, K.config, emptyConfig, (c) => {
      const fails = (c.adminFails || []).filter((t) => t > now() - LOCK_MIN * 60000).concat(now());
      if (fails.length >= MAX_FAILS) return { ...c, adminFails: [], adminLockUntil: now() + LOCK_MIN * 60000 };
      return { ...c, adminFails: fails };
    });
    await sleep(350);
    return err(401, 'auth', 'Usuario o contraseña incorrectos.');
  }
  const secret = await getSecret(store);
  const c2 = await read(store, K.config, emptyConfig);
  return json(200, { token: sign(secret, { u: 'admin', v: c2.adminTv || 0, exp: now() + ADMIN_TOKEN_DAYS * 864e5 }) });
}

async function adminState(store, legacyStore) {
  const [cfg, { users }, { accounts }, payments, aud] = await Promise.all([
    read(store, K.config, emptyConfig), read(store, K.users, emptyUsers), read(store, K.accounts, emptyAccounts),
    read(store, K.payments, emptyPayments), read(store, K.audit, () => ({ list: [] })),
  ]);
  let legacy = false;
  try { legacy = !cfg.migrated && !!(await legacyStore.get('data', { type: 'json' })); } catch { legacy = false; }
  return json(200, {
    accounts: Object.values(accounts).map(publicAccount).sort((a, b) => b.created - a.created),
    users: Object.values(users).map(publicUser).sort((a, b) => b.created - a.created),
    payments: payments.list.slice(0, 500), audit: aud.list.slice(0, 100),
    config: { bizum: cfg.bizum, bizumName: cfg.bizumName, payText: cfg.payText, prices: cfg.prices, trialDays: cfg.trialDays },
    modules: Object.fromEntries(Object.entries(MODULES).map(([k, v]) => [k, v.name])),
    legacy: { pending: legacy, migrated: !!cfg.migrated },
  });
}

const USERNAME_RE = /^[a-z0-9._-]{3,32}$/;
async function setMods(store, accountId, modules, from, until, extra = {}) {
  return mutate(store, K.accounts, emptyAccounts, (d) => {
    const acc = d.accounts[accountId]; if (!acc) return abort(404, 'not_found', 'No existe esa cuenta.');
    acc.mods = acc.mods || {};
    for (const m of modules) acc.mods[m] = { from, until, ...extra };
    return d;
  });
}

async function adminOp(req, store, legacyStore) {
  const body = await req.json().catch(() => ({}));
  const op = body.op;
  const fail = (s, e, m) => err(s, e, m);
  const out = (r) => (r && r.__abort ? fail(r.status, r.error, r.message) : null);
  const t = now();
  switch (op) {
    case 'createAccount': {
      const name = clean(body.name, 80).trim(); if (!name) return fail(400, 'name', 'Pon un nombre a la cuenta.');
      const acc = { id: rid('acc_'), name, code: 'DB-' + crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4), created: t, blocked: false, mods: {} };
      await mutate(store, K.accounts, emptyAccounts, (d) => { d.accounts[acc.id] = acc; return d; });
      await audit(store, 'admin', op, { account: acc.id, name });
      return json(200, { ok: true, account: publicAccount(acc) });
    }
    case 'updateAccount': {
      const r = await mutate(store, K.accounts, emptyAccounts, (d) => {
        const acc = d.accounts[body.id]; if (!acc) return abort(404, 'not_found', 'No existe esa cuenta.');
        if (typeof body.name === 'string' && body.name.trim()) acc.name = clean(body.name, 80).trim();
        if (typeof body.blocked === 'boolean') acc.blocked = body.blocked;
        return d;
      });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { account: body.id, name: body.name, blocked: body.blocked });
      return json(200, { ok: true });
    }
    case 'createUser': {
      const username = String(body.username || '').trim().toLowerCase();
      const name = clean(body.name, 60).trim();
      const role = ROLES.includes(body.role) ? body.role : 'member';
      if (!USERNAME_RE.test(username)) return fail(400, 'username', 'El usuario debe tener de 3 a 32 letras minúsculas, números, punto, guion o guion bajo.');
      if (!name) return fail(400, 'name', 'Escribe el nombre que verá la familia.');
      if (String(body.password || '').length < 8) return fail(400, 'weak', 'La contraseña inicial necesita al menos 8 caracteres.');
      const { accounts } = await read(store, K.accounts, emptyAccounts);
      if (!accounts[body.accountId]) return fail(404, 'not_found', 'Elige una cuenta.');
      const hash = await hashPass(String(body.password));
      const u = { id: rid('usr_'), username, name, role, accountId: body.accountId, hash, tv: 0, mustChange: true, blocked: false, mods: {}, created: t };
      const r = await mutate(store, K.users, emptyUsers, (d) => {
        if (Object.values(d.users).some((x) => x.username === username)) return abort(409, 'taken', 'Ese nombre de usuario ya existe.');
        d.users[u.id] = u; return d;
      });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { user: u.id, username, account: body.accountId, role });
      return json(200, { ok: true, user: publicUser(u) });
    }
    case 'updateUser': {
      const r = await mutate(store, K.users, emptyUsers, (d) => {
        const u = d.users[body.id]; if (!u) return abort(404, 'not_found', 'No existe ese usuario.');
        if (typeof body.name === 'string' && body.name.trim()) u.name = clean(body.name, 60).trim();
        if (ROLES.includes(body.role) && body.role !== u.role) { u.role = body.role; }
        if (typeof body.accountId === 'string' && body.accountId !== u.accountId) { u.accountId = body.accountId; u.tv = (u.tv || 0) + 1; }
        if (typeof body.blocked === 'boolean' && body.blocked !== !!u.blocked) { u.blocked = body.blocked; u.tv = (u.tv || 0) + 1; }
        if (body.unlock) { u.lockUntil = 0; u.fails = []; }
        return d;
      });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { user: body.id, name: body.name, role: body.role, blocked: body.blocked, account: body.accountId });
      return json(200, { ok: true });
    }
    case 'resetPassword': {
      if (String(body.password || '').length < 8) return fail(400, 'weak', 'La contraseña necesita al menos 8 caracteres.');
      const hash = await hashPass(String(body.password));
      const r = await mutate(store, K.users, emptyUsers, (d) => {
        const u = d.users[body.id]; if (!u) return abort(404, 'not_found', 'No existe ese usuario.');
        u.hash = hash; u.mustChange = true; u.tv = (u.tv || 0) + 1; u.lockUntil = 0; u.fails = []; return d;
      });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { user: body.id });
      return json(200, { ok: true });
    }
    case 'deleteUser': {
      const r = await mutate(store, K.users, emptyUsers, (d) => { if (!d.users[body.id]) return abort(404, 'not_found', 'No existe ese usuario.'); delete d.users[body.id]; return d; });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { user: body.id });
      return json(200, { ok: true });
    }
    case 'setUserMod': {
      if (!PAID.includes(body.module)) return fail(400, 'module', 'Módulo no válido.');
      const v = ['on', 'off'].includes(body.value) ? body.value : null;
      const r = await mutate(store, K.users, emptyUsers, (d) => {
        const u = d.users[body.id]; if (!u) return abort(404, 'not_found', 'No existe ese usuario.');
        u.mods = u.mods || {}; if (v) u.mods[body.module] = v; else delete u.mods[body.module]; return d;
      });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { user: body.id, module: body.module, value: v || 'inherit' });
      return json(200, { ok: true });
    }
    case 'activate': {
      // Registrar un pago (o una prueba / regalo) y activar módulos con sus fechas.
      const modules = body.module === 'all' ? PAID : PAID.includes(body.module) ? [body.module] : null;
      if (!modules) return fail(400, 'module', 'Módulo no válido.');
      const from = num(body.from) ? body.from : t;
      const until = body.until == null ? null : num(body.until) ? body.until : NaN;
      if (Number.isNaN(until) || (until != null && until <= from)) return fail(400, 'dates', 'La fecha de fin debe ser posterior a la de inicio.');
      const { accounts } = await read(store, K.accounts, emptyAccounts);
      const acc = accounts[body.accountId]; if (!acc) return fail(404, 'not_found', 'No existe esa cuenta.');
      const kind = ['pago', 'prueba', 'regalo'].includes(body.kind) ? body.kind : 'pago';
      const amount = num(body.amount) ? body.amount : 0;
      let payId = body.paymentId || null;
      await mutate(store, K.payments, emptyPayments, (p) => {
        const pend = payId && p.list.find((x) => x.id === payId);
        if (pend) Object.assign(pend, { status: 'confirmed', from, until, amount, kind, confirmed: t, note: clean(body.note, 200) });
        else { payId = rid('pay_'); p.list.unshift({ id: payId, accountId: acc.id, accountName: acc.name, module: body.module, amount, kind, status: 'confirmed', from, until, created: t, confirmed: t, note: clean(body.note, 200), source: 'admin' }); }
        return { list: p.list.slice(0, 2000) };
      });
      await setMods(store, acc.id, modules, from, until, { payment: payId, trial: kind === 'prueba' });
      await audit(store, 'admin', op, { account: acc.id, module: body.module, from, until, amount, kind, payment: payId });
      return json(200, { ok: true, paymentId: payId });
    }
    case 'deactivate': {
      const modules = body.module === 'all' ? PAID : PAID.includes(body.module) ? [body.module] : null;
      if (!modules) return fail(400, 'module', 'Módulo no válido.');
      const r = await mutate(store, K.accounts, emptyAccounts, (d) => {
        const acc = d.accounts[body.accountId]; if (!acc) return abort(404, 'not_found', 'No existe esa cuenta.');
        acc.mods = acc.mods || {};
        for (const m of modules) if (acc.mods[m]) acc.mods[m].until = t;
        return d;
      });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { account: body.accountId, module: body.module });
      return json(200, { ok: true });
    }
    case 'rejectPayment': {
      const r = await mutate(store, K.payments, emptyPayments, (p) => {
        const x = p.list.find((y) => y.id === body.id); if (!x) return abort(404, 'not_found', 'No existe esa solicitud.');
        x.status = 'rejected'; x.rejected = t; return p;
      });
      if (out(r)) return out(r);
      await audit(store, 'admin', op, { payment: body.id });
      return json(200, { ok: true });
    }
    case 'setConfig': {
      await mutate(store, K.config, emptyConfig, (c) => {
        if (typeof body.bizum === 'string') c.bizum = clean(body.bizum, 30).trim();
        if (typeof body.bizumName === 'string') c.bizumName = clean(body.bizumName, 60).trim();
        if (typeof body.payText === 'string') c.payText = clean(body.payText, 500);
        if (body.prices && num(body.prices.module) && num(body.prices.all)) c.prices = { module: body.prices.module, all: body.prices.all };
        if (num(body.trialDays) && body.trialDays >= 1 && body.trialDays <= 60) c.trialDays = Math.round(body.trialDays);
        return c;
      });
      await audit(store, 'admin', op, { bizum: body.bizum ? 'cambiado' : undefined, prices: body.prices, trialDays: body.trialDays });
      return json(200, { ok: true });
    }
    case 'logoutAll': {
      await mutate(store, K.config, emptyConfig, (c) => ({ ...c, adminTv: (c.adminTv || 0) + 1 }));
      return json(200, { ok: true });
    }
    case 'migrateLegacy': {
      const cfg = await read(store, K.config, emptyConfig);
      if (cfg.migrated) return fail(409, 'done', 'Los datos antiguos ya se migraron.');
      const legacy = await legacyStore.get('data', { type: 'json' });
      if (!legacy) return fail(404, 'none', 'No hay datos de la versión anterior.');
      const name = clean(body.name, 80).trim() || 'Casa';
      const acc = { id: rid('acc_'), name, code: 'DB-' + crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4), created: t, blocked: false, mods: {} };
      for (const m of PAID) acc.mods[m] = { from: t, until: null, payment: 'migracion' };
      const babyId = rid('bb_');
      const p = legacy.profile || {};
      const data = emptyAcc();
      data.rev = 1;
      data.babies[babyId] = { id: babyId, name: clean(p.name, 60) || 'Bebé', birth: clean(p.birth, 10), sex: '', created: t, updated: t, _rev: 1 };
      data.settings = { id: 'settings', nightStart: p.nightStart || '19:00', nightEnd: p.nightEnd || '09:00', updated: t, _rev: 1 };
      for (const e of Object.values(legacy.events || {})) { if (!e || e.deleted || !TYPE_MODULE[e.type]) continue; data.events[e.id] = { ...e, baby: babyId, _rev: 1 }; }
      for (const n of Object.values(legacy.notes || {})) { if (!n || n.deleted) continue; data.notes[n.id] = { ...n, _rev: 1 }; }
      await store.setJSON(`backup/legacy-${t}`, legacy);
      await store.setJSON(K.acc(acc.id), data);
      await store.setJSON(K.accrev(acc.id), 1);
      await mutate(store, K.accounts, emptyAccounts, (d) => { d.accounts[acc.id] = acc; return d; });
      await mutate(store, K.payments, emptyPayments, (pp) => ({ list: [{ id: rid('pay_'), accountId: acc.id, accountName: name, module: 'all', amount: 0, kind: 'regalo', status: 'confirmed', from: t, until: null, created: t, confirmed: t, note: 'Migración de la versión anterior', source: 'admin' }, ...pp.list] }));
      await mutate(store, K.config, emptyConfig, (c) => ({ ...c, migrated: true }));
      await audit(store, 'admin', op, { account: acc.id, events: Object.keys(data.events).length, notes: Object.keys(data.notes).length });
      return json(200, { ok: true, account: publicAccount(acc), events: Object.keys(data.events).length, notes: Object.keys(data.notes).length });
    }
    default:
      return fail(400, 'op', 'Operación no válida.');
  }
}

/* ---------- Entrada ---------- */
export async function handle(req, { store, legacyStore, env = {}, deployContext = '' }) {
  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
    if (path === 'health') return json(200, { ok: true, context: deployContext || 'desconocido', test: deployContext !== 'production', version: 3 });
    if (path === 'login' && req.method === 'POST') return await login(req, store);
    if (path === 'password' && req.method === 'POST') return await changePassword(req, store);
    if (path === 'sync') return await sync(req, store);
    if (path === 'pay' && req.method === 'POST') return await payRequest(req, store);
    if (path.startsWith('img/')) return await image(req, store, path.slice(4));
    if (path === 'admin/login' && req.method === 'POST') return await adminLogin(req, store, env);
    if (path.startsWith('admin/')) {
      const a = await authAdmin(req, store); if (a.error) return a.error;
      if (path === 'admin/state' && req.method === 'GET') return await adminState(store, legacyStore);
      if (path === 'admin/op' && req.method === 'POST') return await adminOp(req, store, legacyStore);
    }
    return err(404, 'not_found', 'Ruta no encontrada.');
  } catch (e) {
    if (e?.status === 409) return err(409, 'busy', 'El servidor está ocupado. Prueba otra vez.');
    console.error(e);
    return err(500, 'server', 'Error del servidor.');
  }
}
