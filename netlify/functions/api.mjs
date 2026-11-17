// Diario del bebé: API de sincronización entre dispositivos.
// Guarda todo en Netlify Blobs (almacenamiento incluido en Netlify, sin base de datos externa).
//
//   GET  /api/sync?since=<rev>         -> cambios posteriores a <rev>
//   POST /api/sync?since=<rev>  {ops}  -> aplica los cambios del móvil y devuelve lo nuevo
//
// Acceso: cabecera "x-code" igual a la variable de entorno ACCESS_CODE.

import { getStore } from "@netlify/blobs";

const STORE = "diario-bebe";
const MAX_OPS = 500;
const MAX_BODY = 512 * 1024;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const emptyData = () => ({ v: 1, rev: 0, events: {}, notes: {}, profile: null });

function changesSince(data, since) {
  const full = !(since >= 0) || since > data.rev;
  const pick = (map) => Object.values(map).filter((x) => full || x._rev > since);
  return {
    rev: data.rev,
    full,
    events: pick(data.events),
    notes: pick(data.notes),
    profile: data.profile && (full || data.profile._rev > since) ? data.profile : null,
  };
}

const isId = (s) => typeof s === "string" && s.length > 0 && s.length <= 80;
const num = (n) => typeof n === "number" && Number.isFinite(n);

function cleanItem(item) {
  if (!item || typeof item !== "object" || !isId(item.id) || !num(item.updated)) return null;
  const out = {};
  for (const [k, v] of Object.entries(item)) {
    if (k === "_rev" || k === "demo") continue;
    if (v === null || ["string", "number", "boolean"].includes(typeof v)) {
      out[k] = typeof v === "string" ? v.slice(0, 2000) : v;
    }
  }
  return out;
}

function applyOps(data, ops) {
  const rev = data.rev + 1;
  let changed = false;
  for (const op of ops) {
    if (!op || typeof op !== "object") continue;
    if (op.k === "profile") {
      const p = cleanItem({ ...op.item, id: "profile" });
      if (p && (!data.profile || p.updated >= data.profile.updated)) {
        data.profile = { ...p, _rev: rev };
        changed = true;
      }
      continue;
    }
    const map = op.k === "ev" ? data.events : op.k === "note" ? data.notes : null;
    const item = map && cleanItem(op.item);
    if (!item) continue;
    const cur = map[item.id];
    if (!cur || item.updated >= cur.updated) {
      map[item.id] = { ...item, _rev: rev };
      changed = true;
    }
  }
  if (changed) data.rev = rev;
  return changed;
}

export default async (req) => {
  const expected = (globalThis.Netlify?.env?.get?.("ACCESS_CODE") ?? process.env.ACCESS_CODE ?? "").trim();
  if (!expected) return json(500, { error: "config", message: "Falta la variable ACCESS_CODE en Netlify." });
  if ((req.headers.get("x-code") || "").trim() !== expected) return json(401, { error: "auth" });

  const url = new URL(req.url);
  const sinceRaw = url.searchParams.get("since");
  const since = sinceRaw === null || sinceRaw === "" ? -1 : Number(sinceRaw);
  const store = getStore({ name: STORE, consistency: "strong" });

  if (req.method === "GET") {
    // Camino rápido: si nada ha cambiado, solo se lee un número.
    const rev = await store.get("rev", { type: "json" });
    if (num(rev) && since === rev) return json(200, { rev, full: false, events: [], notes: [], profile: null });
    const data = (await store.get("data", { type: "json" })) || emptyData();
    return json(200, changesSince(data, since));
  }

  if (req.method !== "POST") return json(405, { error: "method" });

  const text = await req.text();
  if (text.length > MAX_BODY) return json(413, { error: "too_large" });
  let body;
  try { body = JSON.parse(text || "{}"); } catch { return json(400, { error: "bad_json" }); }
  const ops = Array.isArray(body.ops) ? body.ops.slice(0, MAX_OPS) : [];

  // Leer, aplicar y guardar solo si nadie ha escrito entre medias; si no, reintentar.
  for (let attempt = 0; attempt < 6; attempt++) {
    const cur = await store.getWithMetadata("data", { type: "json" });
    const data = cur?.data || emptyData();
    const changed = ops.length ? applyOps(data, ops) : false;
    if (!changed) return json(200, changesSince(data, since));
    const res = cur
      ? await store.setJSON("data", data, { onlyIfMatch: cur.etag })
      : await store.setJSON("data", data, { onlyIfNew: true });
    if (res.modified) {
      await store.setJSON("rev", data.rev);
      return json(200, changesSince(data, since));
    }
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 120));
  }
  return json(409, { error: "busy" });
};

export const config = { path: "/api/sync" };
