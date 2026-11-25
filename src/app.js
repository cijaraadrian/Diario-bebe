(()=>{
'use strict';
const MIN=60000,H=3600000,DAY=86400000,VERSION='3.0';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ADMIN=location.pathname.replace(/\/+$/,'')==='/admin';

/* ---------- Iconos ---------- */
const P={
 moon:'<path d="M19.5 14.6A7.8 7.8 0 1 1 9.4 4.5a6.2 6.2 0 0 0 10.1 10.1z"/>',
 sun:'<circle cx="12" cy="12" r="3.6"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
 sunrise:'<path d="M7.5 16a4.5 4.5 0 0 1 9 0"/><path d="M3 19h18M12 4v4M9.5 6.5 12 4l2.5 2.5M4.6 12.4l1.4 1M19.4 12.4l-1.4 1"/>',
 drop:'<path d="M12 3.5c3 4 6 7.1 6 10.4a6 6 0 0 1-12 0c0-3.3 3-6.4 6-10.4z"/>',
 bottle:'<path d="M8.5 9h7v10a2.5 2.5 0 0 1-2.5 2.5h-2A2.5 2.5 0 0 1 8.5 19z"/><path d="M10 9V7h4v2M11 7l.4-3h1.2L13 7M8.5 13h3M8.5 16.5h3"/>',
 bowl:'<path d="M3.5 11.5h17a8.5 7 0 0 1-17 0z"/><path d="M8 20h8M9.5 8c0-1.2 1.2-1.6 1.2-3M13.5 8c0-1.2 1.2-1.6 1.2-3"/>',
 diaper:'<path d="M3.5 7h17v2.5a8.5 8.5 0 0 1-17 0z"/><path d="M8 7v2.5M16 7v2.5M9.5 16.5c1.6.9 3.4.9 5 0"/>',
 star:'<path d="M12 3.8l2.4 5 5.4.6-4 3.7 1.1 5.4L12 15.8l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 home:'<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
 book:'<path d="M12 6.5C10.5 5 8 4.5 4 4.5v14c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-14c-4 0-6.5.5-8 2zM12 6.5v14"/>',
 chart:'<path d="M4 20h16M7 16v-4M11 16V8M15 16v-6M19 16V5"/>',
 trend:'<path d="M4 19h16"/><path d="M5 15l4.5-4.5 3.5 3 6-6.5"/><path d="M15 7h4v4"/>',
 note:'<path d="M6 3.5h9l3.5 3.5v13.5H6z"/><path d="M14.5 3.5V7.5h4M9 12h6M9 15.5h6"/>',
 user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
 users:'<circle cx="9" cy="9" r="3.3"/><path d="M3 19.5c.9-3 3.2-4.6 6-4.6s5.1 1.6 6 4.6"/><path d="M15.5 5.9a3.2 3.2 0 0 1 0 6.2M17.5 15.2c1.8.6 3 1.9 3.5 4.3"/>',
 left:'<path d="M14.5 5.5 8 12l6.5 6.5"/>', right:'<path d="M9.5 5.5 16 12l-6.5 6.5"/>', down:'<path d="M6 9.5l6 6 6-6"/>',
 zoom:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5"/>',
 close:'<path d="M6 6l12 12M18 6 6 18"/>', check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 help:'<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.6a2.4 2.4 0 0 1 4.6.9c0 1.7-2.3 2-2.3 3.5M12 16.8v.2"/>',
 shield:'<path d="M12 3.5 19 6v6c0 4.4-3 7.4-7 8.5-4-1.1-7-4.1-7-8.5V6z"/><path d="M9 12l2 2 4-4"/>',
 lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
 bath:'<path d="M3.5 12h17v1.5a5.5 5.5 0 0 1-5.5 5.5H9a5.5 5.5 0 0 1-5.5-5.5z"/><path d="M6 12V6.5a2.5 2.5 0 0 1 5 0M7.5 19l-1 2M16.5 19l1 2"/>',
 ruler:'<path d="M3.5 16.5 16.5 3.5l4 4-13 13z"/><path d="M7 13l1.6 1.6M10 10l1.6 1.6M13 7l1.6 1.6"/>',
 tooth:'<path d="M12 5.2c-1.6-1.3-3.6-1.7-5-1-2 1-2.3 3.8-1.4 6.6.6 1.8.7 3.5 1 5.3.3 2 .9 4.4 2.2 4.4 1.6 0 1.4-4.1 3.2-4.1s1.6 4.1 3.2 4.1c1.3 0 1.9-2.4 2.2-4.4.3-1.8.4-3.5 1-5.3.9-2.8.6-5.6-1.4-6.6-1.4-.7-3.4-.3-5 1z"/>',
 sparkle:'<path d="M12 3.5l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
 report:'<path d="M6 3.5h9l3.5 3.5v13.5H6z"/><path d="M14.5 3.5V7.5h4M9 16v-3M12 16v-5M15 16v-2"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 camera:'<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 gift:'<path d="M4 9.5h16v4H4zM5.5 13.5h13v7h-13zM12 9.5v11"/><path d="M12 9.5c-1.5-3.5-5.5-3.5-5.5-1.2 0 1.2 2 1.2 5.5 1.2zM12 9.5c1.5-3.5 5.5-3.5 5.5-1.2 0 1.2-2 1.2-5.5 1.2z"/>',
 baby:'<circle cx="12" cy="12" r="8.5"/><circle cx="9.3" cy="11" r=".6" fill="currentColor"/><circle cx="14.7" cy="11" r=".6" fill="currentColor"/><path d="M9.5 15c1.4 1 3.6 1 5 0M12 3.5c-1 1-1 2.3 0 3"/>',
 copy:'<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
 out:'<path d="M14 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H14M10 12h10M16.5 8.5 20 12l-3.5 3.5"/>'
};
const ic=(n,c='ic')=>`<svg class="${c}" viewBox="0 0 24 24" aria-hidden="true">${P[n]||''}</svg>`;

/* ---------- Catálogo de módulos ---------- */
const MODS={
 sueno:{name:'Sueño',icon:'moon',bub:'cat-sueno',free:true},
 tomas:{name:'Tomas',icon:'drop',bub:'cat-alim',desc:'Pecho con cronómetro y lado, biberón en ml y aviso de qué pecho toca.',ex:'«Hace 2 h 10 min · Pecho izquierdo». Debajo: «Toca el derecho».'},
 comidas:{name:'Comidas',icon:'bowl',bub:'cat-alim',desc:'Primeros alimentos: qué come, qué le gusta y cómo le sienta.',ex:'«Puré de calabaza · le ha encantado».'},
 panales:{name:'Pañales',icon:'diaper',bub:'cat-panal',desc:'Pis, caca o ambos, con nota, y cuántos lleva cada día.',ex:'«6 pañales hoy · el último hace 1 h».'},
 salud:{name:'Salud',icon:'heart',bub:'cat-salud',desc:'Vacunas, visitas al médico, medicación y temperatura.',ex:'«Paracetamol 2,5 ml · 37,9 °C a las 18:20».'},
 notas:{name:'Notas',icon:'note',bub:'cat-evento',desc:'Notas fechadas, por ejemplo las preguntas para el pediatra.',ex:'«Preguntar por las tomas nocturnas».'},
 analisis:{name:'Análisis',icon:'chart',bub:'cat-sueno',desc:'Gráficas de 7, 14 y 30 días y comparación con el periodo anterior.',ex:'«Despertares por noche 2,7 · −0,5 respecto a la semana pasada».'},
 familia:{name:'Compartir en familia',icon:'users',bub:'cat-desp',desc:'Que tu pareja, los abuelos o la canguro apunten o vean el diario desde su móvil, cada uno con su usuario.',ex:'Papá apunta un pañal a las 4:10 y mamá lo ve al momento en su móvil.'},
 bebes:{name:'Varios bebés',icon:'baby',bub:'cat-desp',desc:'Segundo bebé y siguientes, para gemelos o hermanos, cada uno con su diario.',ex:'Arriba eliges «Lucía» o «Martín» y ves el día de cada uno.'},
 banos:{name:'Baños',icon:'bath',bub:'cat-bano',desc:'Apunta cada baño con la temperatura del agua.',ex:'«Baño a las 20:15 · agua a 37 °C».'},
 siesta:{name:'Próxima siesta',icon:'clock',bub:'cat-sueno',desc:'Calcula a qué hora le toca la siguiente siesta según su edad y cómo está durmiendo estos días.',ex:'«Próxima siesta entre 11:40 y 12:10».'},
 crecimiento:{name:'Crecimiento',icon:'ruler',bub:'cat-crec',desc:'Peso, talla y perímetro de cabeza sobre las curvas de percentiles de la OMS.',ex:'«6,4 kg · percentil 58».'},
 hitos:{name:'Hitos y dientes',icon:'sparkle',bub:'cat-hito',desc:'Primera sonrisa, primeros pasos… con foto, y un mapa de la boca para marcar cada diente.',ex:'«Primer diente · 14 de marzo», con su foto.'},
 informe:{name:'Informe para el pediatra',icon:'report',bub:'cat-evento',desc:'Un resumen de las últimas semanas listo para enseñar en la consulta o guardar en PDF.',ex:'«Últimos 14 días: 14,2 h de sueño al día, 8 tomas y 6 pañales».'}
};
const PAID=Object.keys(MODS).filter(k=>!MODS[k].free);

const TYPES={
 sueno:{label:'Sueño',cat:'sueno',icon:'moon',bub:'cat-sueno',mod:'sueno'},
 despertar:{label:'Despertar nocturno',cat:'sueno',icon:'sun',bub:'cat-desp',mod:'sueno'},
 despertar_def:{label:'Despertar definitivo',cat:'sueno',icon:'sunrise',bub:'cat-desp',mod:'sueno'},
 pecho:{label:'Pecho',cat:'alim',icon:'drop',bub:'cat-alim',mod:'tomas'},
 biberon:{label:'Biberón',cat:'alim',icon:'bottle',bub:'cat-alim',mod:'tomas'},
 comida:{label:'Comida',cat:'alim',icon:'bowl',bub:'cat-alim',mod:'comidas'},
 panal:{label:'Pañal',cat:'panal',icon:'diaper',bub:'cat-panal',mod:'panales'},
 bano:{label:'Baño',cat:'bano',icon:'bath',bub:'cat-bano',mod:'banos'},
 evento:{label:'Salud',cat:'salud',icon:'heart',bub:'cat-salud',mod:'salud'},
 medida:{label:'Peso y talla',cat:'crec',icon:'ruler',bub:'cat-crec',mod:'crecimiento'},
 hito:{label:'Hito',cat:'hitos',icon:'sparkle',bub:'cat-hito',mod:'hitos'},
 diente:{label:'Diente',cat:'hitos',icon:'tooth',bub:'cat-hito',mod:'hitos',hidden:true}
};
const SIDES={izq:'Izquierdo',der:'Derecho',ambos:'Ambos'};
const DIAPER={pis:'Pis',caca:'Caca',ambos:'Pis y caca'};
const MILK={materna:'Leche materna',formula:'Fórmula'};
const ECATS={vacuna:'Vacuna',medico:'Médico',medicacion:'Medicación',temperatura:'Temperatura',otro:'Otro'};
const ECATS_ALL={...ECATS,hito:'Hito'};
const MILESTONES=['Primera sonrisa','Se ríe a carcajadas','Sostiene la cabeza','Se da la vuelta','Se sienta solo','Gatea','Se pone de pie','Primeros pasos','Primera palabra','Duerme toda la noche','Primera papilla','Dice adiós con la mano'];
const TEETH_N={1:'Incisivo central',2:'Incisivo lateral',3:'Canino',4:'Primer molar',5:'Segundo molar'};
const toothName=c=>`${TEETH_N[c[2]]} ${c[0]==='U'?'superior':'inferior'} ${c[1]==='R'?'derecho':'izquierdo'}`;

/* ---------- Tiempo ---------- */
const pad=n=>String(n).padStart(2,'0');
const fmtTime=t=>{const d=new Date(t);return pad(d.getHours())+':'+pad(d.getMinutes())};
function fmtDur(ms){ms=Math.max(0,ms);const m=Math.round(ms/MIN);if(m<1)return'menos de 1 min';const h=Math.floor(m/60),r=m%60;return h?(r?`${h} h ${r} min`:`${h} h`):`${r} min`}
function fmtClock(ms){const s=Math.max(0,Math.floor(ms/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h+':'+pad(m)+':'+pad(x)}
const fmtH=ms=>(ms/H).toLocaleString('es-ES',{maximumFractionDigits:1})+' h';
const num1=v=>Number(v).toLocaleString('es-ES',{maximumFractionDigits:1});
const euros=v=>Number(v).toLocaleString('es-ES',{maximumFractionDigits:2})+' €';
const midnight=t=>{const d=new Date(t);return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime()};
const addDays=(t,n)=>{const d=new Date(t);return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n).getTime()};
const addMonths=(t,n)=>{const d=new Date(t);const day=d.getDate();d.setMonth(d.getMonth()+n);if(d.getDate()<day)d.setDate(0);return d.getTime()};
const atHM=(day,hm)=>{const d=new Date(day);const[h,m]=hm.split(':').map(Number);return new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,m).getTime()};
const toLocalInput=t=>{const d=new Date(t);return`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`};
function fromLocalInput(v){const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(v||'');if(!m)return null;return new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5]).getTime()}
const toDateInput=t=>{const d=new Date(t);return`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
function fromDateInput(v){const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(v||'');return m?new Date(+m[1],m[2]-1,+m[3]).getTime():null}
const DF=new Intl.DateTimeFormat('es-ES',{weekday:'long',day:'numeric',month:'long'});
const DS=new Intl.DateTimeFormat('es-ES',{weekday:'short',day:'numeric',month:'short'});
const DD=new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short',year:'numeric'});
const fmtD=t=>t==null?'—':DD.format(t);
function dayLabel(day){const t=midnight(Date.now());const s=DF.format(day);if(day===t)return'Hoy · '+s;if(day===addDays(t,-1))return'Ayer · '+s;return s.charAt(0).toUpperCase()+s.slice(1)}
const ov=(s,e,a,b)=>Math.max(0,Math.min(e,b)-Math.max(s,a));
const evEnd=e=>e.end==null?Date.now():e.end;
const todayKey=()=>toDateInput(Date.now());

/* ---------- Estado y almacenamiento ---------- */
let S=null;
const ui={view:'inicio',dirty:false,day:midnight(Date.now()),mode:'24h',tl:'ambos',log:'todo',zoom:false,period:7,open:null,sel:{},pendingImport:null,gkind:'peso'};
const defaultSettings=()=>({id:'settings',nightStart:'19:00',nightEnd:'09:00',updated:0});
function blank(){return{v:3,events:[],notes:[],babies:[],settings:defaultSettings(),rev:-1,outbox:[],me:null,block:null}}
const DBN='diario-bebe',ST='kv',LSK='diario-bebe-v3';
/* Ajustes de este móvil */
const DK='diario-bebe-dispositivo-v3';
const D={token:'',adminToken:'',theme:'auto',tourSeen:false,baby:'',upsellDay:''};
try{Object.assign(D,JSON.parse(localStorage.getItem(DK)||'{}'))}catch(e){}
function saveD(){try{localStorage.setItem(DK,JSON.stringify(D))}catch(e){}}
function idb(){return new Promise((res,rej)=>{try{const r=indexedDB.open(DBN,1);r.onupgradeneeded=()=>r.result.createObjectStore(ST);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}})}
async function load(){
  try{const db=await idb();const v=await new Promise((res,rej)=>{const q=db.transaction(ST).objectStore(ST).get('state3');q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});if(v&&v.events)return v}catch(e){}
  try{const s=localStorage.getItem(LSK);if(s){const v=JSON.parse(s);if(v&&v.events)return v}}catch(e){}
  return null;
}
let saveT=null;
function save(){clearTimeout(saveT);saveT=setTimeout(flush,250)}
async function flush(){clearTimeout(saveT);saveT=null;if(!S)return;const snap=JSON.parse(JSON.stringify(S));
  try{localStorage.setItem(LSK,JSON.stringify(snap))}catch(e){}
  try{const db=await idb();await new Promise((res,rej)=>{const t=db.transaction(ST,'readwrite');t.objectStore(ST).put(snap,'state3');t.oncomplete=res;t.onerror=()=>rej(t.error)})}catch(e){}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&saveT)flush()});
window.addEventListener('pagehide',()=>{if(saveT)flush()});
const uid=(p='ev_')=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,7);

/* ---------- Acceso: rol, módulos y bebés ---------- */
const me=()=>S&&S.me;
const role=()=>me()?.user?.role||'member';
const isOwner=()=>role()==='owner';
const canWrite=()=>role()!=='reader';
const has=k=>k==='sueno'||!!me()?.mods?.[k]?.on;
const modInfo=k=>me()?.mods?.[k]||{};
const allOn=()=>PAID.every(has);
const babies=()=>S.babies.filter(b=>!b.deleted&&!b.archived).sort((a,b)=>(a.created||0)-(b.created||0));
function curBaby(){const bs=babies();return bs.find(b=>b.id===D.baby)||bs[0]||null}
const babyWritable=b=>!!b&&(has('bebes')||babies()[0]?.id===b.id);
const evs=()=>{const b=curBaby();return b?S.events.filter(e=>e.baby===b.id):[]};
const notes=()=>{const b=curBaby();return S.notes.filter(n=>!n.baby||!b||n.baby===b.id)};
const settings=()=>S.settings||defaultSettings();
// Devuelve true si se puede apuntar; si no, explica por qué (y ofrece desbloquear).
function guard(mod){
  if(!canWrite()){toast('Tienes acceso de solo lectura');return false}
  if(!has(mod)){openUnlock(mod);return false}
  const b=curBaby();if(!b){toast('Primero añade al bebé en Perfil');return false}
  if(!babyWritable(b)){openUnlock('bebes');return false}
  return true;
}

/* ---------- Cálculos ---------- */
const nightMin=hm=>{const[h,m]=hm.split(':').map(Number);return h*60+m};
function isNight(t){const s=settings(),d=new Date(t),m=d.getHours()*60+d.getMinutes(),a=nightMin(s.nightStart),b=nightMin(s.nightEnd);return a>b?(m>=a||m<b):(m>=a&&m<b)}
function nightWindow(day){const s=settings(),a=nightMin(s.nightStart),b=nightMin(s.nightEnd);
  return a>b?[atHM(addDays(day,-1),s.nightStart),atHM(day,s.nightEnd)]:[atHM(day,s.nightStart),atHM(day,s.nightEnd)]}
const running=()=>evs().filter(e=>e.end==null&&(e.type==='sueno'||e.type==='despertar'||e.type==='pecho')).sort((a,b)=>a.start-b.start);
function nightStats(def){const b=def.start;
  const sl=evs().filter(e=>e.type==='sueno'&&e.sub==='noche'&&e.start<b&&evEnd(e)<=b+MIN&&evEnd(e)>b-16*H).sort((x,y)=>evEnd(y)-evEnd(x));
  let cur=b,used=[];for(const e of sl){if(evEnd(e)>=cur-3*H&&e.start<cur){used.push(e);cur=Math.min(cur,e.start)}else if(evEnd(e)<cur-3*H)break}
  if(!used.length)return null;const slept=used.reduce((s,e)=>s+ov(e.start,evEnd(e),cur,b),0);return{slept,inBed:b-cur}}
function rangeStats(a,b,list){
  let night=0,nap=0,awake=0,wakes=0,feeds=0,ml=0,diapers=0,pis=0,caca=0,breast=0,bottle=0,baths=0;
  for(const e of list||evs()){const en=evEnd(e);const T=TYPES[e.type];if(!T)continue;
    if(e.type==='sueno'){const o=ov(e.start,en,a,b);if(e.sub==='noche')night+=o;else nap+=o}
    else if(e.type==='despertar'){if(e.start>=a&&e.start<b){wakes++;awake+=ov(e.start,en,a,b)}}
    else if(T.cat==='alim'){if(e.start>=a&&e.start<b){feeds++;if(e.type==='biberon'){bottle++;ml+=+e.qty||0}if(e.type==='pecho')breast++}}
    else if(e.type==='panal'){if(e.start>=a&&e.start<b){diapers++;if(e.sub!=='caca')pis++;if(e.sub!=='pis')caca++}}
    else if(e.type==='bano'){if(e.start>=a&&e.start<b)baths++}
  }
  return{night,nap,sleep:night+nap,awake,wakes,feeds,ml,diapers,pis,caca,breast,bottle,baths};
}
function evTitle(e){if(e.type==='sueno')return e.sub==='noche'?'Sueño nocturno':'Siesta';if(e.type==='evento')return ECATS_ALL[e.sub]||'Salud';if(e.type==='hito')return e.title||'Hito';if(e.type==='diente')return'Diente';return TYPES[e.type]?.label||e.type}
function evDetail(e){
  const run=e.end==null;
  switch(e.type){
    case'sueno':return run?`Durmiendo desde las ${fmtTime(e.start)}`:`${fmtTime(e.start)} – ${fmtTime(e.end)} · ${fmtDur(e.end-e.start)}`;
    case'despertar':return run?'Despierto ahora':`despierto ${fmtDur(e.end-e.start)}`;
    case'despertar_def':{const s=nightStats(e);return s?`${fmtDur(s.slept)} dormidos · ${fmtDur(s.inBed)} en cama`:'Fin de la noche'}
    case'pecho':return SIDES[e.sub]+(run?' · en curso':(e.end>e.start?' · '+fmtDur(e.end-e.start):''));
    case'biberon':return`${e.qty} ml · ${MILK[e.sub]||''}`;
    case'comida':return e.note||'';
    case'panal':return DIAPER[e.sub]+(e.note?' · '+e.note:'');
    case'bano':return[e.temp?`Agua a ${num1(e.temp)} °C`:'',e.note||''].filter(Boolean).join(' · ');
    case'evento':return e.note||'';
    case'medida':return[e.peso?`${num1(e.peso)} kg`:'',e.talla?`${num1(e.talla)} cm`:'',e.cabeza?`cabeza ${num1(e.cabeza)} cm`:''].filter(Boolean).join(' · ');
    case'hito':return e.note||'';
    case'diente':return e.tooth?toothName(e.tooth):'';
  }return''}
function ageDays(b,t=Date.now()){const bd=b&&fromDateInput(b.birth);return bd==null?null:Math.floor((midnight(t)-bd)/DAY)}
function ageText(b){const days=ageDays(b);if(days==null||days<0)return'';
  if(days<91){const w=Math.floor(days/7),d=days%7;return w?`${w} ${w===1?'semana':'semanas'}${d?` y ${d} ${d===1?'día':'días'}`:''}`:`${days} ${days===1?'día':'días'}`}
  const bd=new Date(fromDateInput(b.birth)),nd=new Date();let m=(nd.getFullYear()-bd.getFullYear())*12+nd.getMonth()-bd.getMonth();if(nd.getDate()<bd.getDate())m--;return`${m} meses`}

/* ---------- Mutaciones ---------- */
function queue(k,item){const c=JSON.parse(JSON.stringify(item));S.outbox=S.outbox.filter(o=>!(o.k===k&&o.item.id===c.id));S.outbox.push({k,item:c});save();syncSoon()}
function addEv(o){const t=Date.now(),b=curBaby();const e=Object.assign({id:uid(),created:t,updated:t,by:me()?.user?.name||'',baby:b&&b.id},o);S.events.push(e);queue('ev',e);return e}
function upd(e,o){Object.assign(e,o,{updated:Date.now()});queue('ev',e)}
function delEv(id){S.events=S.events.filter(e=>e.id!==id);queue('ev',{id,deleted:true,updated:Date.now()})}
function setSetting(k,v){S.settings={...settings(),[k]:v,updated:Date.now()};queue('settings',S.settings)}

/* ---------- Servidor ---------- */
async function api(path,opts={}){
  const h={'content-type':'application/json'};const tok=opts.admin?D.adminToken:D.token;if(tok)h.authorization='Bearer '+tok;
  const r=await fetch('/api/'+path,{method:opts.method||'GET',headers:h,body:opts.body!==undefined?JSON.stringify(opts.body):undefined,cache:'no-store'});
  let d=null;try{d=await r.json()}catch(e){}
  if(!r.ok){const e=new Error((d&&d.message)||('Error '+r.status));e.status=r.status;e.code=d&&d.error;throw e}
  return d;
}

/* ---------- Sincronización ---------- */
const BATCH=300;
const sy={state:'idle',last:0,busy:false,again:false,fail:0,timer:null,soon:null};
function syncSoon(ms=400){clearTimeout(sy.soon);sy.soon=setTimeout(sync,ms)}
async function sync(){
  if(ADMIN||!D.token)return;
  if(sy.busy){sy.again=true;return}
  sy.busy=true;const ops=S.outbox.slice(0,BATCH);
  try{
    const d=await api('sync?since='+S.rev,ops.length?{method:'POST',body:{ops}}:{});
    if(ops.length)S.outbox=S.outbox.filter(o=>!ops.includes(o));
    let changed=applyRemote(d);
    if(d.me){const before=JSON.stringify(S.me);S.me=d.me;if(JSON.stringify(d.me)!==before)changed=true}
    if(d.rejected&&d.rejected.length){toast('Algún cambio no se guardó porque tu cuenta no lo incluye');S.rev=-1;sy.again=true;changed=true}
    if(S.block){S.block=null;changed=true}
    sy.state='ok';sy.last=Date.now();sy.fail=0;save();
    if(changed)refresh();
    if(S.outbox.length)sy.again=true;
  }catch(e){
    if(e.status===401)sy.state='auth';
    else if(e.status===403){S.block={code:e.code,message:e.message};sy.state='blocked';save();refresh()}
    else sy.state=navigator.onLine===false?'offline':'error';
    sy.fail++}
  sy.busy=false;renderSync();
  if(sy.again&&sy.state==='ok'){sy.again=false;syncSoon(50)}else sy.again=false;
}
function pendingItem(k,id){const o=S.outbox.find(o=>o.k===k&&o.item.id===id);return o?o.item:null}
function mergeInto(list,k,it){
  const mine=pendingItem(k,it.id);if(mine&&mine.updated>it.updated)return false;
  const c={...it};delete c._rev;const i=list.findIndex(x=>x.id===c.id);
  if(c.deleted){if(i>=0){list.splice(i,1);return true}return false}
  if(i>=0){if(list[i].updated===c.updated&&list[i].by===c.by)return false;list[i]=c;return true}
  list.push(c);return true;
}
function applyRemote(d){
  let ch=false;
  if(d.full){
    const keep=(list,k,arr)=>{const ids=new Set(arr.map(x=>x.id));const n=list.length;const out=list.filter(x=>ids.has(x.id)||pendingItem(k,x.id));if(out.length!==n)ch=true;return out};
    S.events=keep(S.events,'ev',d.events||[]);S.notes=keep(S.notes,'note',d.notes||[]);S.babies=keep(S.babies,'baby',d.babies||[]);
  }
  for(const it of d.events||[])ch=mergeInto(S.events,'ev',it)||ch;
  for(const it of d.notes||[])ch=mergeInto(S.notes,'note',it)||ch;
  for(const it of d.babies||[])ch=mergeInto(S.babies,'baby',it)||ch;
  if(d.settings){const mine=pendingItem('settings','settings');if(!mine||mine.updated<=d.settings.updated){const p=Object.assign(defaultSettings(),d.settings);delete p._rev;
    if(JSON.stringify(p)!==JSON.stringify(S.settings)){S.settings=p;ch=true}}}
  if(typeof d.rev==='number')S.rev=d.rev;
  return ch;
}
function busyEditing(){const a=document.activeElement;return a&&a.closest&&a.closest('#view')&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)}
function refresh(){if(ADMIN||!D.token)return;if(tour||!$('#sheet').hidden||!$('#report').hidden||busyEditing()){ui.dirty=true;renderLive();return}ui.dirty=false;render()}
function loop(){clearTimeout(sy.timer);if(!D.token||ADMIN)return;
  const wait=document.visibilityState!=='visible'?60000:sy.fail?Math.min(60000,4000*2**Math.min(sy.fail,4)):8000;
  sy.timer=setTimeout(async()=>{if(document.visibilityState==='visible')await sync();loop()},wait)}
function agoText(t){const s=Math.round((Date.now()-t)/1000);return s<10?'ahora mismo':s<60?`hace ${s} s`:`hace ${fmtDur(Date.now()-t)}`}
function syncPill(){
  const n=S.outbox.length;
  if(sy.state==='auth')return`<div class="syncpill bad"><span class="dot"></span>Tienes que volver a entrar.<button data-act="logout-now">Entrar</button></div>`;
  if((sy.state==='offline'||sy.state==='error')&&n)return`<div class="syncpill"><span class="dot"></span>Sin conexión · ${n} ${n===1?'cambio':'cambios'} por enviar</div>`;
  if(sy.state==='offline'||sy.state==='error')return`<div class="syncpill"><span class="dot"></span>Sin conexión · lo que apunte tu familia llegará al volver la cobertura</div>`;
  return'';
}
function syncLine(){const n=S.outbox.length;
  if(sy.state==='auth')return'Tienes que volver a entrar.';
  if(sy.state==='ok')return`Al día · ${agoText(sy.last)}${n?` · ${n} por enviar`:''}`;
  if(sy.state==='idle'||sy.busy)return'Sincronizando…';
  return`Sin conexión${n?` · ${n} ${n===1?'cambio':'cambios'} por enviar`:''}`}
function renderSync(){const b=$('#syncbox');if(b)b.innerHTML=syncPill();const l=$('#syncline');if(l)l.textContent=syncLine()}
async function doLogin(username,password){
  const d=await api('login',{method:'POST',body:{username,password}});
  D.token=d.token;saveD();S=blank();S.me=d.me;
  const s=await api('sync?since=-1');applyRemote(s);S.me=s.me;sy.state='ok';sy.last=Date.now();await flush();
}
function logout(){D.token='';D.baby='';saveD();S=blank();flush();clearTimeout(sy.timer);sy.state='idle';ui.view='inicio';try{history.replaceState(null,'','#inicio')}catch(e){}render()}

/* ---------- Acciones rápidas ---------- */
function startSleep(){if(!guard('sueno'))return;if(running().some(e=>e.type==='sueno'))return toast('Ya hay un sueño en curso');
  const now=Date.now();running().filter(e=>e.type==='despertar').forEach(e=>upd(e,{end:now}));
  addEv({type:'sueno',sub:isNight(now)?'noche':'siesta',start:now,end:null});ui.open=null;toast(isNight(now)?'Noche en marcha':'Siesta en marcha');render()}
function startBreast(side){if(!guard('tomas'))return;const now=Date.now();const cur=running().find(e=>e.type==='pecho');if(cur){if(cur.sub===side)return toast('Ya está en marcha');upd(cur,{end:now})}
  addEv({type:'pecho',sub:side,start:now,end:null});toast('Pecho '+SIDES[side].toLowerCase()+' en marcha');render()}
function finalWake(at){if(!guard('sueno'))return;at=at||Date.now();running().forEach(e=>{if(e.type!=='pecho')upd(e,{end:at})});addEv({type:'despertar_def',start:at,end:at});ui.open=null;toast('Buenos días');render()}

/* ---------- Banner de actividad ---------- */
function liveTitle(e){if(e.type==='sueno')return e.sub==='noche'?'Noche en curso':'Siesta en curso';if(e.type==='despertar')return'Despierto por la noche';return'Pecho '+SIDES[e.sub].toLowerCase()}
function renderLive(){
  const el=$('#live');if(!D.token||!S||S.block||!curBaby()){el.innerHTML='';return}
  const r=running();
  if(!r.length){el.innerHTML='';return}
  const myName=me()?.user?.name;
  el.innerHTML=r.map(e=>{const open=ui.open===e.id;let acts='';
    if(e.type==='sueno'&&e.sub==='noche')acts=`<button data-act="wake-short" data-id="${e.id}">Se despierta un rato</button><button class="pri" data-act="wake-final">Despertar definitivo</button>`;
    else if(e.type==='sueno')acts=`<button class="pri" data-act="stop" data-id="${e.id}">Se ha despertado</button>`;
    else if(e.type==='despertar')acts=`<button class="pri" data-act="back-sleep" data-id="${e.id}">Vuelve a dormir</button><button data-act="wake-final">Despertar definitivo</button>`;
    else acts=`<button data-act="switch-side" data-id="${e.id}">Cambiar a ${e.sub==='izq'?'derecho':'izquierdo'}</button><button class="pri" data-act="stop" data-id="${e.id}">Terminar</button>`;
    acts+=`<button data-act="edit" data-id="${e.id}">Editar</button>`;
    if(!canWrite())acts='';
    return`<div class="lv ${e.type==='pecho'?'feed':''} ${open?'open':''}"><button class="lv-head" data-act="toggle-live" data-id="${e.id}" aria-expanded="${open}">${ic(TYPES[e.type].icon)}<span class="t">${liveTitle(e)}${e.by&&e.by!==myName?` · ${esc(e.by)}`:''}</span><span class="clock" data-clock="${e.start}">${fmtClock(Date.now()-e.start)}</span><span class="chev">${ic('down')}</span></button>${open&&acts?`<div class="lv-acts">${acts}</div>`:''}</div>`}).join('');
}
function tickClocks(){document.querySelectorAll('[data-clock]').forEach(n=>{n.textContent=fmtClock(Date.now()-+n.dataset.clock)})}

/* ---------- Piezas comunes ---------- */
const lockBadge=(short)=>short?`<span class="lockb dot" aria-label="Premium">${ic('lock')}</span>`:`<span class="lockb">${ic('lock')}Premium</span>`;
function babyBar(){const bs=babies();if(bs.length<2&&!(isOwner()&&bs.length))return'';const cb=curBaby();
  return`<div class="babybar" role="group" aria-label="Bebé">${bs.map(b=>`<button data-act="baby" data-id="${b.id}" aria-pressed="${cb&&cb.id===b.id}">${esc(b.name||'Bebé')}${!babyWritable(b)?ic('lock'):''}</button>`).join('')}${isOwner()?`<button data-act="baby-new" aria-label="Añadir bebé">${ic('plus')}${has('bebes')?'':ic('lock')}</button>`:''}</div>`}
function lockedBlock(mod,preview){const m=MODS[mod];
  return`<div class="locked"><div class="lk-prev" aria-hidden="true">${preview}</div><div class="lk-cta"><div class="lk-card"><span class="pill">${ic('lock')}Premium</span><b>${esc(m.name)}</b><p>${esc(m.desc)}</p><button class="btn pri" data-act="unlock" data-mod="${mod}">Ver cómo conseguirlo</button></div></div></div>`}
function statusChip(k){const m=modInfo(k);if(MODS[k].free)return'<span class="st on">Gratis</span>';
  if(m.on&&m.override==='on'&&!m.until&&!m.from)return'<span class="st on">Activo</span>';
  if(m.on&&m.trial)return`<span class="st trial">Prueba hasta ${fmtD(m.until)}</span>`;
  if(m.on)return`<span class="st on">${m.until?'Hasta '+fmtD(m.until):'Para siempre'}</span>`;
  if(m.from&&m.until&&m.until<=Date.now())return`<span class="st exp">Caducó ${fmtD(m.until)}</span>`;
  return'<span class="st off">No incluido</span>'}

/* ---------- Próxima siesta ---------- */
// Ventanas de vigilia orientativas por edad (minutos). Fuente: tablas publicadas por Napper y Taking Cara Babies.
const WAKE=[[0,28,35,60],[28,84,60,90],[84,150,75,120],[150,225,120,180],[225,320,150,210],[320,440,180,240],[440,99999,240,360]];
function napPrediction(){
  const b=curBaby(),days=ageDays(b);if(days==null||days<0)return{need:'birth'};
  const w=WAKE.find(x=>days>=x[0]&&days<x[1]);const lo=w[2]*MIN,hi=w[3]*MIN;
  const sl=evs().filter(e=>e.type==='sueno').sort((a,c)=>a.start-c.start);
  const cur=sl.find(e=>e.end==null);if(cur)return{sleeping:true,lo,hi};
  const last=sl[sl.length-1];const now=Date.now();
  const gaps=[];for(let i=1;i<sl.length;i++){const a=sl[i-1],c=sl[i];if(a.end==null||c.start<now-3*DAY)continue;const g=c.start-a.end;if(g>20*MIN&&g<6*H&&!isNight(a.end)&&!isNight(c.start))gaps.push(g)}
  const rec=gaps.slice(-6).sort((x,y)=>x-y);const med=rec.length>=3?rec[Math.floor(rec.length/2)]:null;
  const target=med?Math.min(hi,Math.max(lo,med)):(lo+hi)/2;
  if(!last)return{noData:true,lo,hi};
  const wake=last.end;const from=Math.max(now,wake+target-15*MIN),to=Math.max(from+15*MIN,wake+target+15*MIN);
  return{wake,from,to,lo,hi,med,target,awake:now-wake,night:isNight(from)};
}
function siestaCard(){
  if(!has('siesta'))return`<div id="siesta-card" class="card siesta-card lk-mini"><span class="bub cat-sueno">${ic('clock')}</span><div><span class="k">Próxima siesta · Premium</span><b class="tnum blur">11:40 – 12:10</b><span class="d">Te digo a qué hora le toca dormir según su edad y cómo duerme.</span></div><button class="go" data-act="unlock" data-mod="siesta">${ic('lock')}Ver</button></div>`;
  const p=napPrediction();let b='',d='';
  const rng=`${fmtDur(p.lo)} y ${fmtDur(p.hi)}`;
  if(p.need==='birth'){b='Falta la fecha de nacimiento';d='Añádela en Perfil para calcularlo.'}
  else if(p.sleeping){b='Está durmiendo';d='Cuando se despierte calcularé la siguiente.'}
  else if(p.noData){b='Sin datos aún';d=`A su edad suele aguantar entre ${rng} despierto.`}
  else if(p.night){b='Hasta mañana';d='Es la franja de noche; la próxima predicción será al despertar.'}
  else if(p.wake+p.target<Date.now()-5*MIN){b='Ya le toca';d=`Lleva ${fmtDur(p.awake)} despierto, más de lo que suele aguantar a su edad (entre ${rng}). Busca señales de sueño.`}
  else{b=`${fmtTime(p.from)} – ${fmtTime(p.to)}`;d=`Lleva ${fmtDur(p.awake)} despierto. A su edad suele aguantar entre ${rng}${p.med?`; estos días, unos ${fmtDur(p.med)}`:''}.`}
  return`<div id="siesta-card" class="card siesta-card"><span class="bub cat-sueno">${ic('clock')}</span><div><span class="k">Próxima siesta · orientativo</span><b class="tnum">${b}</b><span class="d">${esc(d)}</span></div></div>`;
}

/* ---------- Vistas ---------- */
function quickBtn(act,attrs,mod,icon,bub,label){const lk=!has(mod);return`<button class="qb ${lk?'lk':''}" data-act="${act}" ${attrs} data-mod="${mod}"><span class="bub ${bub}">${ic(icon)}</span>${label}${lk?lockBadge(true):''}</button>`}
function upsellCard(){
  if(allOn()||D.upsellDay===todayKey())return'';
  const locked=PAID.filter(k=>!has(k));const k=locked[Math.floor(Date.now()/DAY)%locked.length];const m=MODS[k];
  return`<div class="card upsell"><span class="bub ${m.bub}">${ic(m.icon)}</span><div><b>${esc(m.name)}</b><span>${esc(m.desc)}</span></div><button class="go" data-act="unlock" data-mod="${k}">Ver</button><button class="x" data-act="upsell-hide" aria-label="Ahora no">${ic('close')}</button></div>`}
function expiryCards(){const soon=PAID.filter(k=>{const m=modInfo(k);return m.on&&m.until&&m.until-Date.now()<3*DAY});
  return soon.slice(0,2).map(k=>{const m=modInfo(k);return`<div class="card warncard">${ic('clock')}<div><b>${m.trial?'Tu prueba de':'Tu módulo'} «${esc(MODS[k].name)}» acaba el ${fmtD(m.until)}</b><span>Después podrás ver lo apuntado, pero no apuntar más.</span></div><button data-act="unlock" data-mod="${k}">Renovar</button></div>`}).join('')}
function vInicio(){
  const now=Date.now(),t0=midnight(now),st=rangeStats(t0,now),b=curBaby();
  const E=evs();
  const feeds=E.filter(e=>TYPES[e.type]?.cat==='alim'&&e.start<=now).sort((a,c)=>c.start-a.start);
  const lf=feeds[0],lb=E.filter(e=>e.type==='pecho').sort((a,c)=>c.start-a.start)[0];
  let feedBox='<b>Sin tomas</b><span>Aún no hay registros</span>';
  if(lf){const ago=lf.end==null?'Ahora':'Hace '+fmtDur(now-(lf.end>lf.start?lf.end:lf.start));
    feedBox=`<b>${ago}</b><span>${evTitle(lf)}${lf.type==='pecho'?' '+SIDES[lf.sub].toLowerCase():lf.type==='biberon'?' · '+lf.qty+' ml':''}${lf.by?' · '+esc(lf.by):''}</span>`;
    if(lb&&lb.sub!=='ambos'&&lb.end!=null)feedBox+=`<span class="hint">Toca el ${lb.sub==='izq'?'derecho':'izquierdo'}</span>`}
  if(!has('tomas')&&!lf)feedBox=`<b class="tnum">—</b><span>Con «Tomas» verás aquí cuánto hace y qué pecho toca</span>`;
  const sl=E.filter(e=>e.type==='sueno').sort((a,c)=>c.start-a.start)[0];
  let sleepBox='<b>Sin datos</b><span>Registra el primer sueño</span>';
  if(sl){if(sl.end==null)sleepBox=`<b>Durmiendo</b><span>${fmtDur(now-sl.start)} · desde las ${fmtTime(sl.start)}</span>`;
    else sleepBox=`<b>Despierto</b><span>${fmtDur(now-sl.end)} · desde las ${fmtTime(sl.end)}</span>`}
  const name=b?.name||'Tu bebé',age=ageText(b);
  const ro=!canWrite();
  const quick=ro?`<p class="card" style="margin:0;color:var(--ink-2)">Tienes acceso de solo lectura: puedes ver el diario, pero no apuntar.</p>`:`<div class="quick">
   ${quickBtn('breast','data-side="izq"','tomas','drop','cat-alim','Pecho izq.')}
   ${quickBtn('breast','data-side="der"','tomas','drop','cat-alim','Pecho der.')}
   ${quickBtn('form','data-type="biberon"','tomas','bottle','cat-alim','Biberón')}
   ${quickBtn('form','data-type="panal"','panales','diaper','cat-panal','Pañal')}
   ${quickBtn('sleep','','sueno','moon','cat-sueno','Dormir')}
   ${quickBtn('wake-final','','sueno','sunrise','cat-desp','Despertar definitivo')}
   ${quickBtn('form','data-type="bano"','banos','bath','cat-bano','Baño')}
   ${quickBtn('form','data-type="comida"','comidas','bowl','cat-alim','Comida')}
   ${quickBtn('form','data-type="evento"','salud','heart','cat-salud','Salud')}
  </div>`;
  const tot=(v,l,mod)=>`<div class="tot"><b>${has(mod)||mod==='sueno'?v:'—'}</b><span>${l}</span></div>`;
  return`<header class="vh"><div><p class="eyebrow">${esc(DF.format(now))}</p><h1>${esc(name)}</h1>${age?`<p class="sub">${age}</p>`:''}</div><button class="help-btn" data-act="tour">${ic('help')}Cómo funciona</button></header>
  ${babyBar()}
  <div id="syncbox">${syncPill()}</div>
  ${b&&!babyWritable(b)?`<div class="card warncard">${ic('lock')}<div><b>Para apuntar en ${esc(b.name)} necesitas «Varios bebés»</b><span>Puedes ver todo lo que ya está apuntado.</span></div><button data-act="unlock" data-mod="bebes">Ver</button></div>`:''}
  ${expiryCards()}
  <section class="now"><div class="card stat"><span class="k">Última toma</span>${feedBox}</div><div class="card stat"><span class="k">Sueño</span>${sleepBox}</div></section>
  ${siestaCard()}
  <h2>Registro rápido</h2>
  ${quick}
  ${upsellCard()}
  <h2>Hoy</h2>
  <div class="totals">${tot(fmtH(st.sleep),'Sueño','sueno')}${tot(st.feeds,'Tomas','tomas')}${tot(st.ml,'ml biberón','tomas')}${tot(st.diapers,'Pañales','panales')}</div>`;
}
function timeline(a,b){
  const span=b-a,pct=t=>((t-a)/span*100).toFixed(3);const E=evs();
  let segs='',icons='';
  for(const e of E){if(e.type!=='sueno'&&e.type!=='despertar')continue;const s=Math.max(e.start,a),en=Math.min(evEnd(e),b);if(en<=s)continue;
    const c=e.type==='despertar'?'desp':e.sub;segs+=`<i class="s-${c}${e.end==null?' on':''}" style="left:${pct(s)}%;width:${Math.max((en-s)/span*100,.5).toFixed(3)}%"></i>`}
  const fe=E.filter(e=>TYPES[e.type]?.cat==='alim'&&e.start>=a&&e.start<b).sort((x,y)=>x.start-y.start);
  const cl=[];for(const e of fe){const l=cl[cl.length-1];if(l&&e.start-l.t<30*MIN&&!ui.zoom)l.n.push(e);else cl.push({t:e.start,n:[e]})}
  icons=cl.map(c=>`<span class="fd" style="left:${pct(c.t)}%" title="${fmtTime(c.t)}">${ic(TYPES[c.n[0].type].icon)}${c.n.length>1?`<em>${c.n.length}</em>`:''}</span>`).join('');
  let ticks=[];
  if(ui.mode==='24h'){const d=new Date(a);ticks=[0,6,12,18,24].map(h=>({t:new Date(d.getFullYear(),d.getMonth(),d.getDate(),h).getTime(),l:pad(h)+':00'}))}
  else{const st=Math.ceil(a/H)*H;for(let t=st;t<b-H;t+=3*H)ticks.push({t,l:fmtTime(t)});ticks.unshift({t:a,l:fmtTime(a)});ticks=ticks.filter((x,i,arr)=>i===0||x.t-arr[i-1].t>=H);ticks.push({t:b,l:fmtTime(b)})}
  if(ui.zoom&&ui.mode==='24h'){const d=new Date(a);ticks=[];for(let h=0;h<=24;h+=2)ticks.push({t:new Date(d.getFullYear(),d.getMonth(),d.getDate(),h).getTime(),l:pad(h)+':00'})}
  const grid=ticks.slice(1,-1).map(x=>`<span class="grid-l" style="left:${pct(x.t)}%"></span>`).join('');
  const now=Date.now(),nowL=now>=a&&now<b?`<span class="now-l" style="left:${pct(now)}%"></span>`:'';
  const showS=ui.tl!=='alim',showF=ui.tl!=='sueno';
  return`<div class="tl-wrap" id="tlwrap"><div class="tl ${ui.zoom?'zoom':''}">
   ${showS?`<span class="lab">Sueño</span><div class="track">${segs}${nowL}</div>`:''}
   ${showF?`<span class="lab" style="display:block">Tomas</span><div class="feeds">${grid}${icons}${nowL}</div>`:''}
   <div class="axis">${ticks.map(x=>`<span style="left:${pct(x.t)}%">${x.l}</span>`).join('')}</div></div></div>`;
}
function logList(items){return items.length?`<ul class="log">${items.map(e=>`<li><button data-act="edit" data-id="${e.id}"><span class="tm">${fmtTime(e.start)}</span><span class="bub ${TYPES[e.type]?.bub||'cat-evento'}">${ic(TYPES[e.type]?.icon||'star')}</span><span class="tx"><b>${esc(evTitle(e))}</b><span>${esc(evDetail(e))}</span>${e.by?`<span class="by">${esc(e.by)}</span>`:''}</span></button></li>`).join('')}</ul>`:''}
function vDiario(){
  const day=ui.day,today=midnight(Date.now());
  const[a,b]=ui.mode==='24h'?[day,addDays(day,1)]:nightWindow(day);
  const r=running().find(e=>e.type==='sueno'),aw=running().find(e=>e.type==='despertar');
  let status='';
  if(day===today){if(r)status=`${r.sub==='noche'?'Noche':'Siesta'} en curso · desde las ${fmtTime(r.start)}`;else if(aw)status=`Despierto desde las ${fmtTime(aw.start)}`;
    else{const l=evs().filter(e=>e.type==='sueno'&&e.end!=null).sort((x,y)=>y.end-x.end)[0];status=l?`Despierto desde las ${fmtTime(l.end)}`:''}}
  else status=ui.mode==='noche'?`Noche del ${DS.format(addDays(day,-1))} al ${DS.format(day)}`:'';
  const st=rangeStats(a,Math.min(b,Date.now()));
  const sum=[`${st.wakes} ${st.wakes===1?'despertar':'despertares'}`,`${fmtDur(st.awake)} despierto`,`noche ${fmtDur(st.night)}`];
  if(ui.mode==='24h')sum.push(`siestas ${fmtDur(st.nap)}`);if(st.feeds)sum.push(`${st.feeds} ${st.feeds===1?'toma':'tomas'}`);
  const items=evs().filter(e=>e.start>=a&&e.start<b&&(ui.log==='todo'||TYPES[e.type]?.cat===ui.log)).sort((x,y)=>x.start-y.start);
  const list=logList(items)||`<p class="empty">No hay registros ${ui.log==='todo'?'':'de este tipo '}en este periodo.${canWrite()?' Pulsa + para añadir uno.':''}</p>`;
  const chip=(k,v,l)=>`<button class="chip" data-act="${k}" data-v="${v}" aria-pressed="${ui[k==='tlf'?'tl':'log']===v}">${l}</button>`;
  return`<header class="vh"><h1>Descanso y tomas</h1><button class="icon-btn" data-act="zoom" aria-pressed="${ui.zoom}" aria-label="Ampliar gráfico">${ic('zoom')}</button></header>
  ${babyBar()}
  <div class="daynav"><button class="icon-btn" data-act="day" data-d="-1" aria-label="Día anterior">${ic('left')}</button><label class="dl">${esc(dayLabel(day))}<input type="date" id="daypick" value="${toDateInput(day)}" max="${toDateInput(today)}" aria-label="Elegir día"></label><button class="icon-btn" data-act="day" data-d="1" aria-label="Día siguiente" ${day>=today?'disabled':''}>${ic('right')}</button></div>
  <div class="seg big" role="radiogroup" aria-label="Vista"><label><input type="radio" name="mode" value="noche" ${ui.mode==='noche'?'checked':''}><span>${ic('moon')}Noche</span></label><label><input type="radio" name="mode" value="24h" ${ui.mode==='24h'?'checked':''}><span>24 horas</span></label></div>
  ${status?`<p class="status">${esc(status)}</p>`:''}
  <div class="chips" style="margin-top:12px">${chip('tlf','sueno','Sueño')}${chip('tlf','alim','Alimentación')}${chip('tlf','ambos','Ambos')}</div>
  ${timeline(a,b)}
  <div class="legend"><span><i class="s-noche"></i>Noche</span><span><i class="s-siesta"></i>Siesta</span><span><i class="s-desp"></i>Despertar</span><span><i style="background:var(--c-none)"></i>Sin información</span><span>${ic('drop')}Pecho</span><span>${ic('bottle')}Biberón</span><span>${ic('bowl')}Comida</span></div>
  <p class="summary tnum">${sum.join(' · ')}</p><p class="tz" style="margin:4px 0 0">Hora local · ${esc(Intl.DateTimeFormat().resolvedOptions().timeZone||'')}</p>
  <h2>Registros del día</h2>
  <div class="chips">${chip('logf','todo','Todo')}${chip('logf','sueno','Sueño')}${chip('logf','alim','Alimentación')}${chip('logf','panal','Pañales')}${chip('logf','bano','Baños')}${chip('logf','salud','Salud')}${chip('logf','crec','Crecimiento')}${chip('logf','hitos','Hitos')}</div>
  ${list}`;
}

/* ---------- Gráficas de barras ---------- */
function bars(id,days,series,fmt,unitMax){
  const W=340,Hh=150,L=30,R=6,T=8,B=22,pw=W-L-R,ph=Hh-T-B,n=days.length;
  const tot=days.map((_,i)=>series.reduce((s,x)=>s+x.vals[i],0));
  let mx=Math.max(unitMax||1,...tot);const step=[1,2,4,5,10,20,25,50,100].find(s=>mx/s<=4)||Math.ceil(mx/4);mx=Math.ceil(mx/step)*step;
  const y=v=>T+ph-v/mx*ph,bw=Math.max(3,Math.min(18,pw/n*.6)),cx=i=>L+pw/n*(i+.5);
  let g='';for(let v=0;v<=mx;v+=step)g+=`<line class="gl" x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L-6}" y="${y(v)+3.5}" text-anchor="end">${v}</text>`;
  const sel=ui.sel[id]??n-1;let m='';
  days.forEach((d,i)=>{let base=0;const x=cx(i)-bw/2;
    if(i===sel)m+=`<rect class="sel" x="${cx(i)-pw/n/2}" y="${T}" width="${pw/n}" height="${ph}" rx="4"/>`;
    series.forEach((s,k)=>{const v=s.vals[i];if(v<=0)return;const top=k===series.length-1||series.slice(k+1).every(z=>z.vals[i]<=0);
      const y0=y(base),y1=y(base+v)+(base>0?2:0),h=Math.max(0,y0-y1);if(h<=0){base+=v;return}
      const r=top?Math.min(4,bw/2,h):0;
      m+=`<path fill="${s.color}" d="M${x},${y0} V${y1+r} Q${x},${y1} ${x+r},${y1} H${x+bw-r} Q${x+bw},${y1} ${x+bw},${y1+r} V${y0} Z"/>`;base+=v});
  });
  const every=n<=7?1:n<=14?2:5;let xl='';days.forEach((d,i)=>{if((n-1-i)%every===0)xl+=`<text class="ax" x="${cx(i)}" y="${Hh-6}" text-anchor="middle">${new Date(d).getDate()}</text>`});
  const hits=days.map((d,i)=>`<rect class="hit" data-act="bar" data-c="${id}" data-i="${i}" x="${cx(i)-pw/n/2}" y="0" width="${pw/n}" height="${Hh}"/>`).join('');
  const d=days[sel],read=`${DS.format(d)} · ${fmt(sel)}`;
  return{svg:`<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Gráfico de barras por día">${g}${m}${xl}${hits}</svg>`,read};
}
function sampleEvents(){ // Datos de ejemplo SOLO para las vistas previas bloqueadas; nunca se guardan.
  const out=[];const today=midnight(Date.now());let r=7;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647};
  for(let k=13;k>=0;k--){const d=addDays(today,-k);
    out.push({type:'sueno',sub:'noche',start:atHM(addDays(d,-1),'20:30'),end:atHM(d,'07:30')+rnd()*40*MIN});
    for(const h of ['09:30','12:45','16:00'])out.push({type:'sueno',sub:'siesta',start:atHM(d,h),end:atHM(d,h)+(50+rnd()*50)*MIN});
    const w=1+Math.floor(rnd()*3);for(let i=0;i<w;i++){const s=atHM(d,'02:00')+i*2*H;out.push({type:'despertar',start:s,end:s+15*MIN})}
    for(let i=0;i<7+Math.floor(rnd()*3);i++)out.push({type:'pecho',sub:'izq',start:d+i*2.6*H,end:d+i*2.6*H+15*MIN});
    for(let i=0;i<5+Math.floor(rnd()*3);i++)out.push({type:'panal',sub:'pis',start:d+i*3*H,end:d+i*3*H});
  }return out}
function analysisHTML(sample){
  const n=ui.period,today=midnight(Date.now()),days=[];for(let i=n-1;i>=0;i--)days.push(addDays(today,-i));
  const list=sample?sampleEvents():evs();
  const per=days.map(d=>rangeStats(d,Math.min(addDays(d,1),Date.now()),list));
  const nights=days.map(d=>{const[a,b]=nightWindow(d);return rangeStats(a,Math.min(b,Date.now()),list)});
  const full=(arr,f)=>{const v=arr.slice(0,-1).map(f);return v.length?v.reduce((s,x)=>s+x,0)/v.length:0};
  const prevDays=[];for(let i=2*n-1;i>=n;i--)prevDays.push(addDays(today,-i));
  const pper=prevDays.map(d=>rangeStats(d,addDays(d,1),list)),pn=prevDays.map(d=>{const[a,b]=nightWindow(d);return rangeStats(a,b,list)});
  const avg=(arr,f)=>arr.length?arr.map(f).reduce((s,x)=>s+x,0)/arr.length:0;
  const hasPrev=pper.some(s=>s.sleep>0||s.feeds>0);
  const cmp=(cur,prev,fmtv)=>{if(!hasPrev)return'Sin periodo anterior';const d=cur-prev;if(Math.abs(d)<1e-9)return'Igual que antes';return`${d>0?'+':'−'}${fmtv(Math.abs(d))} vs ${n} días antes`};
  const sCur=full(per,s=>s.sleep),fCur=full(per,s=>s.feeds),wCur=full(nights,s=>s.wakes),dCur=full(per,s=>s.diapers);
  const kp=(k,v,c)=>`<div class="kpi"><span class="k">${k}</span><b>${v}</b><span>${c}</span></div>`;
  const C=getComputedStyle(document.documentElement),col=v=>C.getPropertyValue(v).trim();
  const c1=bars('sleep',days,[{vals:per.map(s=>s.night/H),color:col('--c-noche')},{vals:per.map(s=>s.nap/H),color:col('--c-siesta')}],i=>`noche ${fmtDur(per[i].night)} · siestas ${fmtDur(per[i].nap)}`,4);
  const c2=bars('feeds',days,[{vals:per.map(s=>s.feeds),color:col('--c-toma')}],i=>`${per[i].feeds} tomas${per[i].ml?` · ${per[i].ml} ml de biberón`:''}`,4);
  const c3=bars('wakes',days,[{vals:nights.map(s=>s.wakes),color:col('--c-desp')}],i=>`${nights[i].wakes} despertares · ${fmtDur(nights[i].awake)} despierto`,3);
  const c4=bars('diap',days,[{vals:per.map(s=>s.diapers),color:col('--c-neutral')}],i=>`${per[i].diapers} pañales`,4);
  return`<div class="seg" role="radiogroup" aria-label="Periodo" style="margin-bottom:14px">${[7,14,30].map(p=>`<label><input type="radio" name="period" value="${p}" ${ui.period===p?'checked':''}><span>${p} días</span></label>`).join('')}</div>
  <div class="kpis">${kp('Sueño al día',fmtH(sCur),cmp(sCur,avg(pper,s=>s.sleep),v=>fmtH(v)))}${kp('Tomas al día',num1(fCur),cmp(fCur,avg(pper,s=>s.feeds),num1))}${kp('Despertares por noche',num1(wCur),cmp(wCur,avg(pn,s=>s.wakes),num1))}${kp('Pañales al día',num1(dCur),cmp(dCur,avg(pper,s=>s.diapers),num1))}</div>
  <p class="foot">Las medias no cuentan el día de hoy porque aún no ha terminado.</p>
  <div class="chart"><h3>Horas de sueño por día</h3><div class="legend" style="margin:2px 4px 6px"><span><i class="s-noche"></i>Noche</span><span><i class="s-siesta"></i>Siestas</span></div><p class="read">${c1.read}</p>${c1.svg}</div>
  <div class="chart"><h3>Tomas por día</h3><p class="read">${c2.read}</p>${c2.svg}</div>
  ${sample?'':`<div class="chart"><h3>Despertares por noche</h3><p class="read">${c3.read}</p>${c3.svg}</div>
  <div class="chart"><h3>Pañales por día</h3><p class="read">${c4.read}</p>${c4.svg}</div>
  <p class="foot">Toca una barra para ver el detalle de ese día. El número bajo cada barra es el día del mes.</p>`}`;
}

/* ---------- Crecimiento (curvas OMS) ---------- */
const ZP={3:-1.880794,15:-1.036433,50:0,85:1.036433,97:1.880794};
function lmsAt(kind,sex,day){const t=WHO_LMS[kind][sex==='f'?'2':'1'];if(day<=0)return t[0].slice(1);if(day>=t[t.length-1][0])return t[t.length-1].slice(1);
  let i=Math.floor(day/7);if(i>=t.length-1)i=t.length-2;const a=t[i],b=t[i+1],f=(day-a[0])/(b[0]-a[0]);return[1,2,3].map(k=>a[k]+(b[k]-a[k])*f)}
const valAtZ=([L,M,Sv],z)=>L?M*Math.pow(1+L*Sv*z,1/L):M*Math.exp(Sv*z);
const zOf=([L,M,Sv],x)=>L?(Math.pow(x/M,L)-1)/(L*Sv):Math.log(x/M)/Sv;
function normCdf(z){const t=1/(1+.3275911*Math.abs(z)/Math.SQRT2),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z/2);return z>=0?(1+y)/2:(1-y)/2}
function pctText(kind,sex,day,x){if(day<0||day>730||!x)return'';const p=normCdf(zOf(lmsAt(kind,sex,day),x))*100;return p<1?'percentil <1':p>99?'percentil >99':`percentil ${Math.round(p)}`}
const GK={peso:{label:'Peso',unit:'kg',field:'peso'},talla:{label:'Talla',unit:'cm',field:'talla'},cabeza:{label:'Cabeza',unit:'cm',field:'cabeza'}};
function growthChart(kind,sex,pts,nowDay){
  const W=340,Hh=210,L=34,R=30,T=10,B=24,pw=W-L-R,ph=Hh-T-B;
  const maxPt=pts.length?Math.max(...pts.map(p=>p.d)):0;
  const xMax=Math.min(730,Math.max(182,Math.ceil((Math.max(maxPt,nowDay||0)+45)/30.4375)*30.4375));
  const xs=[];for(let d=0;d<=xMax;d+=7)xs.push(d);if(xs[xs.length-1]!==xMax)xs.push(xMax);
  const band=z=>xs.map(d=>valAtZ(lmsAt(kind,sex,d),z));
  const p3=band(ZP[3]),p15=band(ZP[15]),p50=band(0),p85=band(ZP[85]),p97=band(ZP[97]);
  let lo=Math.min(...p3,...pts.map(p=>p.v)),hi=Math.max(...p97,...pts.map(p=>p.v));
  const step=[.5,1,2,5,10].find(s=>(hi-lo)/s<=6)||10;lo=Math.floor(lo/step)*step;hi=Math.ceil(hi/step)*step;
  const X=d=>L+d/xMax*pw,Y=v=>T+ph-(v-lo)/(hi-lo)*ph;
  const poly=(top,bot)=>xs.map((d,i)=>`${X(d).toFixed(1)},${Y(top[i]).toFixed(1)}`).join(' ')+' '+xs.map((d,i)=>[d,i]).reverse().map(([d,i])=>`${X(d).toFixed(1)},${Y(bot[i]).toFixed(1)}`).join(' ');
  let g='';for(let v=lo;v<=hi+1e-9;v+=step)g+=`<line class="gl" x1="${L}" x2="${L+pw}" y1="${Y(v)}" y2="${Y(v)}"/><text class="g-lab" x="${L-5}" y="${Y(v)+3.5}" text-anchor="end">${num1(v)}</text>`;
  const months=Math.round(xMax/30.4375),mstep=months<=8?1:months<=16?2:3;
  for(let m=0;m<=months;m+=mstep){const d=m*30.4375;if(d>xMax+1)break;g+=`<text class="g-lab" x="${X(d)}" y="${Hh-6}" text-anchor="middle">${m} m</text>`}
  const line=pts.length>1?`<polyline class="g-line" points="${pts.map(p=>`${X(p.d).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ')}"/>`:'';
  const dots=pts.map(p=>`<circle class="g-pt" cx="${X(p.d).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="4.5"/>`).join('');
  const lastI=xs.length-1;
  const labs=[[p97,'P97'],[p50,'P50'],[p3,'P3']].map(([a,t])=>`<text class="g-labr" x="${L+pw+4}" y="${Y(a[lastI])+3.5}">${t}</text>`).join('');
  return`<svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="${GK[kind].label} sobre las curvas de la OMS">${g}<polygon class="g-band1" points="${poly(p97,p3)}"/><polygon class="g-band2" points="${poly(p85,p15)}"/><polyline class="g-p50" points="${xs.map((d,i)=>`${X(d).toFixed(1)},${Y(p50[i]).toFixed(1)}`).join(' ')}"/>${line}${dots}${labs}</svg>`;
}
function growthHTML(sample){
  const b=curBaby();const sex=sample?'f':b?.sex;const birth=sample?toDateInput(addDays(Date.now(),-150)):b?.birth;
  if(!sample&&(!birth||!sex))return`<div class="card"><p style="margin:0 0 10px;color:var(--ink-2)">Para comparar con las curvas de la OMS necesito la fecha de nacimiento y si es niño o niña.</p>${isOwner()?`<button class="btn" data-act="baby-edit" data-id="${b?.id||''}">Completar datos del bebé</button>`:'<p class="foot" style="margin:0">El titular de la cuenta puede añadirlos en Perfil.</p>'}</div>`;
  const bd=fromDateInput(birth);
  const meds=sample?[[0,3.2,49.5,34],[30,4.3,53.5,36.8],[62,5.3,57,38.5],[95,6.1,60,39.9],[125,6.6,62.3,40.8]].map(([d,p,t,c])=>({start:bd+d*DAY,peso:p,talla:t,cabeza:c})):evs().filter(e=>e.type==='medida').sort((a,c)=>a.start-c.start);
  const k=ui.gkind;const pts=meds.filter(m=>m[k]).map(m=>({d:Math.round((midnight(m.start)-bd)/DAY),v:+m[k]})).filter(p=>p.d>=0&&p.d<=730);
  const nowDay=Math.round((midnight(Date.now())-bd)/DAY);
  const latest=f=>{const m=[...meds].reverse().find(x=>x[f]);if(!m)return`<div class="tot"><b>—</b><span>${GK[f].label}</span></div>`;const d=Math.round((midnight(m.start)-bd)/DAY);return`<div class="tot"><b>${num1(m[f])} ${GK[f].unit}</b><span>${GK[f].label} · ${fmtD(m.start)}</span><em>${pctText(f,sex,d,+m[f])}</em></div>`};
  const tabs=`<div class="chips" style="margin-bottom:8px">${Object.entries(GK).map(([k2,g])=>`<button class="chip" data-act="gkind" data-v="${k2}" aria-pressed="${ui.gkind===k2}">${g.label}</button>`).join('')}</div>`;
  return`<div class="grow-latest">${latest('peso')}${latest('talla')}${latest('cabeza')}</div>${tabs}
  <div class="chart"><h3>${GK[k].label} (${GK[k].unit}) por edad</h3><p class="read">Bandas: percentiles 3–97 y 15–85 de la OMS para ${sex==='f'?'niñas':'niños'}. Línea discontinua: percentil 50.</p>${growthChart(k,sex,pts,nowDay)}</div>
  ${sample?'':`${pts.length?'':`<p class="foot">Aún no hay medidas de ${GK[k].label.toLowerCase()}.</p>`}${canWrite()?`<button class="btn" style="margin-top:10px" data-act="form" data-type="medida">${ic('plus')}Añadir medida</button>`:''}<p class="foot">Referencia: patrones de crecimiento infantil de la OMS (0–2 años). Es orientativo; quien valora el crecimiento es el pediatra.</p>`}`;
}

/* ---------- Hitos y dientes ---------- */
const UP=['UR5','UR4','UR3','UR2','UR1','UL1','UL2','UL3','UL4','UL5'],LOW=['LR5','LR4','LR3','LR2','LR1','LL1','LL2','LL3','LL4','LL5'];
function teethSVG(map){
  const tooth=(c,ang,cx,cy,rx,ry)=>{const a=ang*Math.PI/180,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a),n=+c[2],w=n>=4?13:n===3?10:9,h=n>=4?12:14;
    const on=!!map[c];return`<rect class="tooth ${on?'on':''}" data-act="tooth" data-t="${c}" tabindex="0" role="button" aria-label="${toothName(c)}${on?', salió el '+fmtD(map[c].start):''}" x="${(x-w).toFixed(1)}" y="${(y-h).toFixed(1)}" width="${2*w}" height="${2*h}" rx="${n>=4?6:9}" transform="rotate(${(ang+90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`};
  let s='';UP.forEach((c,i)=>{s+=tooth(c,190+i*160/9,180,148,138,104)});LOW.forEach((c,i)=>{s+=tooth(c,170-i*160/9,180,172,138,104)});
  return`<svg viewBox="0 0 360 300" role="group" aria-label="Mapa de dientes"><text class="t-lab" x="180" y="96" text-anchor="middle">Arriba</text><text class="t-lab" x="180" y="214" text-anchor="middle">Abajo</text><text class="t-lab" x="180" y="152" text-anchor="middle">← su derecha · su izquierda →</text>${s}</svg>`;
}
function hitosHTML(sample){
  const map={};let list=[];
  if(sample){['LL1','LR1','UL1'].forEach((c,i)=>{map[c]={start:addDays(Date.now(),-60+i*20)}});list=[{title:'Primera sonrisa',start:addDays(Date.now(),-120)},{title:'Se da la vuelta',start:addDays(Date.now(),-40)}]}
  else{evs().filter(e=>e.type==='diente'&&e.tooth).forEach(e=>{map[e.tooth]=e});list=evs().filter(e=>e.type==='hito').sort((a,c)=>c.start-a.start)}
  const n=Object.keys(map).length;
  return`<div class="card teeth"><h3 style="margin:0 0 4px;font-size:16px">Dientes · ${n} de 20</h3><p class="foot" style="margin:0 0 6px">${sample?'':'Toca un diente para apuntar cuándo salió. '}Vista de frente: su derecha queda a tu izquierda.</p>${teethSVG(map)}</div>
  ${list.length?`<ul class="milestones">${list.map(e=>`<li><button ${sample?'':`data-act="edit" data-id="${e.id}"`}>${e.photo?`<img class="ph" data-img="${esc(e.photo)}" alt="">`:`<span class="ph">${ic('sparkle')}</span>`}<span><b>${esc(e.title||'Hito')}</b><span>${fmtD(e.start)}${e.note?' · '+esc(e.note):''}</span></span></button></li>`).join('')}</ul>`:`<p class="foot">Aún no hay hitos apuntados.</p>`}
  ${!sample&&canWrite()?`<button class="btn" style="margin-top:10px" data-act="form" data-type="hito">${ic('plus')}Añadir hito</button>`:''}`;
}
function vEvolucion(){
  const sec=(id,mod,title,body)=>`<section id="sec-${id}"><div class="sec-h"><h2>${title}</h2>${has(mod)?'':'<span class="tag">Premium</span>'}</div>${has(mod)?body():lockedBlock(mod,body(true))}</section>`;
  return`<header class="vh"><h1>Evolución</h1></header>${babyBar()}
  ${sec('analisis','analisis','Análisis',s=>analysisHTML(s))}
  ${sec('crecimiento','crecimiento','Crecimiento',s=>growthHTML(s))}
  ${sec('hitos','hitos','Hitos y dientes',s=>hitosHTML(s))}
  ${sec('informe','informe','Informe para el pediatra',s=>`<div class="card"><p style="margin:0 0 12px;color:var(--ink-2)">Resumen de sueño, tomas, pañales, crecimiento, salud y notas de las últimas semanas, listo para enseñar en la consulta o guardar en PDF.</p><button class="btn pri" ${s?'':'data-act="report"'}>${ic('report')}Preparar informe</button></div>`)}`;
}
function vNotas(){
  if(!has('notas'))return`<header class="vh"><h1>Notas</h1></header><div id="notas-main">${lockedBlock('notas',`<ul class="notes"><li><time>Lunes · 10:20 · Mamá</time><p>Preguntar al pediatra por las tomas nocturnas.</p></li><li><time>Sábado · 18:05 · Papá</time><p>La crema del culito va mejor que la anterior.</p></li></ul>`)}</div>`;
  const ns=[...notes()].sort((a,b)=>b.t-a.t);
  return`<header class="vh"><h1>Notas</h1></header><div id="notas-main">
  ${canWrite()?`<label class="field"><span>Nueva nota</span><textarea class="inp" id="note-new" placeholder="Por ejemplo: preguntar al pediatra por las tomas nocturnas"></textarea></label>
  <button class="btn pri wide" data-act="add-note">Guardar nota</button>`:''}
  ${ns.length?`<ul class="notes">${ns.map(n=>`<li><time>${esc(DF.format(n.t))} · ${fmtTime(n.t)}${n.by?' · '+esc(n.by):''}</time><p>${esc(n.text)}</p>${canWrite()?`<button data-act="del-note" data-id="${n.id}" data-confirm="Toca otra vez para borrar">Borrar</button>`:''}</li>`).join('')}</ul>`:'<p class="empty">Aún no hay notas.</p>'}</div>`;
}
function vPerfil(){
  const s=settings(),standalone=window.navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
  const M=me()||{},acc=M.account||{},members=M.members||[];
  const ROLE={owner:'Titular',member:'Miembro',reader:'Solo lectura'};
  const bs=babies();
  return`<header class="vh"><h1>Perfil</h1></header>
  <div class="sect" id="sect-cuenta"><h3>${esc(acc.name||'Tu cuenta')}</h3>
   <p>Entras como <span class="who">${esc(M.user?.name||'')}</span> · ${ROLE[role()]||''}. Código de tu cuenta: <b class="mono">${esc(acc.code||'')}</b>.</p>
   <p style="margin-bottom:6px"><b>Personas con acceso</b></p>
   <ul class="modlist">${members.map(m=>`<li><span class="n">${esc(m.name)}</span><span class="st off">${ROLE[m.role]||''}</span></li>`).join('')}</ul>
   ${has('familia')?'':`<p style="margin-top:10px">¿Quieres que tu pareja o los abuelos también lo vean? <button class="linkbtn" data-act="unlock" data-mod="familia">Compartir en familia</button></p>`}
   <p id="syncline" class="tnum foot">${esc(syncLine())}</p>
   <button class="btn" data-act="sync-now">Sincronizar ahora</button></div>
  <div class="sect" id="sect-bebes"><h3>Bebés</h3>
   ${bs.length?`<ul class="modlist">${bs.map(b=>`<li><span class="n">${esc(b.name)}${b.birth?` <span class="foot">· ${ageText(b)}</span>`:''}</span>${!babyWritable(b)?'<span class="st exp">Solo ver</span>':''}${isOwner()?`<button class="linkbtn" data-act="baby-edit" data-id="${b.id}">Editar</button>`:''}</li>`).join('')}</ul>`:'<p>Aún no hay ningún bebé.</p>'}
   ${isOwner()?`<button class="btn" style="margin-top:10px" data-act="baby-new">${ic('plus')}Añadir bebé${bs.length&&!has('bebes')?' '+ic('lock'):''}</button>`:''}</div>
  <div class="sect" id="sect-mods"><h3>Lo que incluye tu cuenta</h3>
   <ul class="modlist">${Object.keys(MODS).map(k=>`<li>${ic(MODS[k].icon)}<span class="n">${esc(MODS[k].name)}</span>${statusChip(k)}${!has(k)?`<button class="linkbtn" data-act="unlock" data-mod="${k}">Ver</button>`:''}</li>`).join('')}</ul>
   ${allOn()?'':`<button class="btn pri wide" style="margin-top:12px" data-act="unlock" data-mod="all">${ic('gift')}Todo para siempre · ${euros(M.sale?.prices?.all??20)}</button>`}</div>
  <div class="sect"><h3>Franja de noche</h3><p>Se usa en la vista «Noche» y para decidir si un sueño es noche o siesta. Es la misma para toda la familia.</p>
   <div class="two"><label class="field"><span>Empieza</span><input class="inp" type="time" id="p-ns" value="${s.nightStart}" ${canWrite()?'':'disabled'}></label><label class="field"><span>Termina</span><input class="inp" type="time" id="p-ne" value="${s.nightEnd}" ${canWrite()?'':'disabled'}></label></div></div>
  <div class="sect"><h3>Tema de este móvil</h3><div class="seg" role="radiogroup" aria-label="Tema">${[['auto','Automático'],['light','Claro'],['dark','Oscuro']].map(([v,l])=>`<label><input type="radio" name="theme" value="${v}" ${D.theme===v?'checked':''}><span>${l}</span></label>`).join('')}</div></div>
  <div class="sect"><h3>Cambiar contraseña</h3><form id="pwform" novalidate>
   <label class="field"><span>Contraseña actual</span><input class="inp" type="password" id="pw-cur" autocomplete="current-password"></label>
   <label class="field"><span>Nueva contraseña (mínimo 8 caracteres)</span><input class="inp" type="password" id="pw-new" autocomplete="new-password"></label>
   <p class="err" id="pw-err"></p><button class="btn" type="submit">Cambiar contraseña</button></form></div>
  <div class="sect" id="sect-backup"><h3>Copia en archivo</h3>
   <p>Los datos ya están guardados en el servidor. Si además quieres una copia del bebé que tienes seleccionado, expórtala aquí.</p>
   <div class="btns"><button class="btn" data-act="export">Exportar copia</button><button class="btn" data-act="copy">Copiar datos</button></div>
   ${canWrite()?`<p style="margin-top:14px">Para añadir los datos de una copia al bebé seleccionado, elige el archivo:</p>
   <input type="file" id="imp-file" accept="application/json,.json" class="inp">
   <div id="imp-box">${impBox()}</div>`:''}</div>
  <div class="sect"><h3>Instalar en el iPhone</h3>${standalone?`<p><span class="okchip">Instalada</span> La estás usando desde la pantalla de inicio.</p>`:`<ol><li>Abre esta página en Safari.</li><li>Toca Compartir y elige «Añadir a pantalla de inicio».</li><li>Ábrela siempre desde el icono.</li></ol>`}</div>
  <div class="sect"><h3>Ayuda</h3><p>Un recorrido de 2 minutos por la app, con ejemplos de lo que puedes hacer y de lo que puedes añadir.</p><button class="btn pri" data-act="tour">Ver el paseo virtual</button></div>
  <div class="sect"><h3>Salir de este móvil</h3><p>Quita tu sesión y la copia local de este móvil. Los datos siguen guardados en el servidor.</p><button class="btn dan" data-act="logout" data-confirm="Toca otra vez para salir">Salir</button></div>
  <p class="ver">Diario del bebé ${VERSION}</p>`;
}
function vLogin(){
  return`<header class="vh"><div><p class="eyebrow">Diario del bebé</p><h1>Entrar</h1><p class="login-lead">Entra con el usuario y la contraseña que te han dado.</p></div></header>
  <form id="login" class="sect" novalidate>
   <label class="field"><span>Usuario</span><input class="inp" id="l-user" autocomplete="username" autocapitalize="none" spellcheck="false"></label>
   <label class="field"><span>Contraseña</span><input class="inp" id="l-pass" type="password" autocomplete="current-password"></label>
   <p class="err" id="l-err"></p>
   <button class="btn pri wide" type="submit" id="l-go">Entrar</button>
  </form>
  <p class="foot">La primera vez necesitas internet. Después, si te quedas sin cobertura, lo que apuntes se envía al volver la conexión.</p>`;
}
function vForcePassword(){
  return`<header class="vh"><div><p class="eyebrow">Hola, ${esc(me()?.user?.name||'')}</p><h1>Elige tu contraseña</h1><p class="login-lead">La que te dieron era provisional. Elige una nueva que solo sepas tú.</p></div></header>
  <form id="pwform" class="sect" novalidate data-force="1">
   <label class="field"><span>Contraseña provisional</span><input class="inp" type="password" id="pw-cur" autocomplete="current-password"></label>
   <label class="field"><span>Nueva contraseña (mínimo 8 caracteres)</span><input class="inp" type="password" id="pw-new" autocomplete="new-password"></label>
   <label class="field"><span>Repite la nueva contraseña</span><input class="inp" type="password" id="pw-rep" autocomplete="new-password"></label>
   <p class="err" id="pw-err"></p><button class="btn pri wide" type="submit">Guardar y entrar</button></form>`;
}
function vBlocked(){const b=S.block||{};
  return`<header class="vh"><div><p class="eyebrow">Diario del bebé</p><h1>${b.code==='needs_familia'?'Acceso compartido no activo':'No puedes entrar ahora'}</h1></div></header>
  <div class="sect"><p>${esc(b.message||'')}</p>${b.code==='needs_familia'?`<p>Tus datos y los de tu familia siguen guardados. En cuanto el titular renueve «Compartir en familia» podrás volver a entrar.</p>`:''}
  <div class="btns"><button class="btn pri" data-act="retry">Volver a intentarlo</button><button class="btn" data-act="logout-now">Salir</button></div></div>`}
function vNoBaby(){
  return`<header class="vh"><div><p class="eyebrow">Bienvenida, ${esc(me()?.user?.name||'')}</p><h1>Añade a tu bebé</h1></div></header>
  <div class="sect">${isOwner()?`<p>Antes de empezar, dime cómo se llama y cuándo nació. Con la fecha calculo su edad, la próxima siesta y los percentiles.</p><button class="btn pri wide" data-act="baby-new">${ic('plus')}Añadir bebé</button>`:`<p>El titular de tu cuenta todavía no ha añadido al bebé. En cuanto lo haga, lo verás aquí.</p><button class="btn" data-act="retry">Actualizar</button>`}</div>`}
function impBox(){const p=ui.pendingImport;if(!p)return'';if(p.error)return`<p class="err" style="margin-top:12px">${esc(p.error)}</p>`;
  return`<div class="card" style="margin-top:12px;background:var(--surface-2)"><p style="margin:0 0 10px">La copia tiene <b>${p.events.length}</b> registros y <b>${p.notes.length}</b> notas.</p><div class="btns"><button class="btn pri" data-act="imp-merge">Añadir a ${esc(curBaby()?.name||'este bebé')}</button></div></div>`}

/* ---------- Hojas ---------- */
function openSheet(html){$('#panel').innerHTML=`<div class="grab"></div>`+html;$('#sheet').hidden=false;document.body.style.overflow='hidden'}
function closeSheet(){const was=!$('#sheet').hidden;$('#sheet').hidden=true;$('#panel').innerHTML='';document.body.style.overflow='';if(was&&ui.dirty&&!tour){ui.dirty=false;render()}}
const sheetHead=t=>`<div class="panel-h"><h2>${t}</h2><button class="icon-btn" data-act="close" aria-label="Cerrar">${ic('close')}</button></div>`;
function pickType(){
  openSheet(`${sheetHead('Añadir registro')}
  <div class="types">${Object.entries(TYPES).filter(([,t])=>!t.hidden).map(([k,t])=>`<button data-act="form" data-type="${k}"><span class="bub ${t.bub}">${ic(t.icon)}</span>${t.label}${has(t.mod)?'':lockBadge()}</button>`).join('')}</div>`)}
function openUnlock(mod){
  const M=me()||{},sale=M.sale||{prices:{module:1,all:20}},code=M.account?.code||'';
  const isAll=mod==='all',m=isAll?{name:'Todo para siempre',desc:`Los ${PAID.length} módulos de la app, sin cuotas ni renovaciones.`,ex:'Tomas, pañales, baños, salud, notas, análisis, próxima siesta, crecimiento, hitos y dientes, informe para el pediatra, compartir en familia y varios bebés.'}:MODS[mod];
  const pend=(M.payments||[]).filter(p=>p.status==='pending'&&(p.module===mod||p.module==='all'));
  const concept=(k)=>`${code} ${k==='all'?'TODO':MODS[k].name.toUpperCase()}`;
  const howPay=sale.bizum?`<p>Haz un <b>Bizum</b> al <b class="mono">${esc(sale.bizum)}</b>${sale.bizumName?` (${esc(sale.bizumName)})`:''} con el concepto <b class="mono">${esc(concept(isAll?'all':mod))}</b>${isAll?'':` (o <b class="mono">${esc(concept('all'))}</b> si eliges todo)`}.</p><p>En cuanto lo veamos, lo activamos en tu cuenta y te aparecerá aquí.</p>`:`<p>Pregunta a quien te dio acceso cómo hacer el pago.</p>`;
  openSheet(`${sheetHead(esc(m.name))}
   <p class="sub" style="margin:-6px 0 10px">${esc(m.desc)}</p>
   <div class="tour-ex"><b>${isAll?'Incluye':'Así se ve'}</b>${esc(m.ex)}</div>
   <div class="offer">
    <div class="opt rec"><span class="tag">Recomendado</span><b>Todo para siempre</b><span class="price">${euros(sale.prices.all)}</span><p>Los ${PAID.length} módulos, un solo pago.</p></div>
    ${isAll?'':`<div class="opt"><b>Solo «${esc(m.name)}»</b><span class="price">${euros(sale.prices.module)} <small>al mes</small></span><p>Se renueva cada mes.</p></div>`}
   </div>
   ${pend.length?`<div class="pending">${ic('clock')}Has avisado de un pago el ${fmtD(pend[0].created)}. Está pendiente de confirmar.</div>`:''}
   <div class="pay">${sale.payText?`<p>${esc(sale.payText)}</p>`:''}${howPay}</div>
   <div class="btncol">
    <button class="btn pri" data-act="paid" data-mod="all">${ic('check')}Ya he hecho el Bizum de ${euros(sale.prices.all)}</button>
    ${isAll?'':`<button class="btn" data-act="paid" data-mod="${mod}">Ya he hecho el Bizum de ${euros(sale.prices.module)}</button>`}
    ${code?`<button class="btn" data-act="copy-text" data-text="${esc(concept(isAll?'all':mod))}">${ic('copy')}Copiar el concepto</button>`:''}
   </div>`)}
async function notifyPaid(mod){
  try{const r=await api('pay',{method:'POST',body:{module:mod}});toast(r.created?'Aviso enviado. Te lo activamos en cuanto lo veamos':'Ya nos habías avisado; está pendiente');closeSheet();sync()}
  catch(e){toast(e.status?e.message:'Sin conexión. Inténtalo cuando tengas internet')}}
const segH=(name,opts,val)=>`<div class="seg" role="radiogroup">${Object.entries(opts).map(([v,l])=>`<label><input type="radio" name="${name}" value="${v}" ${val===v?'checked':''}><span>${l}</span></label>`).join('')}</div>`;
let editing=null,formType=null,formPhoto=null;
function openForm(type,e){
  const t=TYPES[type];if(!t)return;
  if(!e&&!guard(t.mod))return;
  editing=e||null;formType=type;formPhoto=e?e.photo||null:null;const now=Date.now(),isNew=!e;
  const ro=e&&(!canWrite()||!has(t.mod)||!babyWritable(curBaby()));
  const st=toLocalInput(e?e.start:now),sd=toDateInput(e?e.start:now);
  let f='';const dt=(id,l,v)=>`<label class="field"><span>${l}</span><input class="inp" type="datetime-local" id="${id}" value="${v}"></label>`;
  const dd=(id,l,v)=>`<label class="field"><span>${l}</span><input class="inp" type="date" id="${id}" value="${v}" max="${toDateInput(now)}"></label>`;
  const numf=(id,l,v)=>`<label class="field"><span>${l}</span><input class="inp" type="text" inputmode="decimal" autocomplete="off" id="${id}" value="${v==null?'':String(v).replace('.',',')}"></label>`;
  switch(type){
    case'sueno':f=`<div class="field"><span>Tipo</span>${segH('sub',{siesta:'Siesta',noche:'Noche'},e?e.sub:(isNight(now)?'noche':'siesta'))}</div>${dt('f-start','Se duerme',st)}${dt('f-end','Se despierta (vacío si sigue dormido)',e&&e.end!=null?toLocalInput(e.end):'')}`;break;
    case'despertar':f=`${dt('f-start','Se despierta',st)}<label class="field"><span>Minutos despierto (vacío si sigue despierto)</span><input class="inp" type="number" inputmode="numeric" min="0" id="f-min" value="${e&&e.end!=null?Math.round((e.end-e.start)/MIN):''}"></label>`;break;
    case'despertar_def':f=`${dt('f-start','Hora del despertar',st)}<p class="sub" style="margin:-4px 0 14px;font-size:14px">Cierra la noche y termina el sueño o despertar que siga en curso.</p>`;break;
    case'pecho':f=`<div class="field"><span>Lado</span>${segH('sub',SIDES,e?e.sub:'izq')}</div>${dt('f-start','Empieza',st)}<label class="field"><span>Duración en minutos (opcional)</span><input class="inp" type="number" inputmode="numeric" min="0" id="f-min" value="${e&&e.end!=null&&e.end>e.start?Math.round((e.end-e.start)/MIN):''}"></label>`;break;
    case'biberon':f=`${dt('f-start','Hora',st)}<label class="field"><span>Cantidad (ml)</span><input class="inp" type="number" inputmode="numeric" min="1" id="f-qty" value="${e?e.qty:''}"><div class="amounts">${[60,90,120,150,180].map(v=>`<button type="button" data-act="amt" data-v="${v}">${v} ml</button>`).join('')}</div></label><div class="field"><span>Tipo de leche</span>${segH('sub',MILK,e?e.sub:'materna')}</div>`;break;
    case'comida':f=`${dt('f-start','Hora',st)}<label class="field"><span>Qué ha comido</span><input class="inp" id="f-note" value="${esc(e?e.note:'')}" placeholder="Por ejemplo: puré de calabaza"></label>`;break;
    case'panal':f=`${dt('f-start','Hora',st)}<div class="field"><span>Contenido</span>${segH('sub',DIAPER,e?e.sub:'pis')}</div><label class="field"><span>Nota (opcional)</span><input class="inp" id="f-note" value="${esc(e?e.note||'':'')}"></label>`;break;
    case'bano':f=`${dt('f-start','Hora',st)}${numf('f-temp','Temperatura del agua en °C (opcional)',e?.temp)}<label class="field"><span>Nota (opcional)</span><input class="inp" id="f-note" value="${esc(e?e.note||'':'')}" placeholder="Por ejemplo: con champú"></label>`;break;
    case'evento':f=`${dt('f-start','Fecha y hora',st)}<div class="field"><span>Categoría</span><select class="inp" id="f-cat">${Object.entries(e&&e.sub==='hito'?ECATS_ALL:ECATS).map(([v,l])=>`<option value="${v}" ${e&&e.sub===v?'selected':''}>${l}</option>`).join('')}</select></div><label class="field"><span>Descripción</span><textarea class="inp" id="f-note" placeholder="Por ejemplo: 37,8 °C por la tarde">${esc(e?e.note:'')}</textarea></label>`;break;
    case'medida':f=`${dd('f-date','Fecha',sd)}<div class="three">${numf('f-peso','Peso (kg)',e?.peso)}${numf('f-talla','Talla (cm)',e?.talla)}${numf('f-cabeza','Cabeza (cm)',e?.cabeza)}</div><p class="foot" style="margin:-6px 0 12px">Rellena al menos una medida.</p>`;break;
    case'hito':{const custom=e&&e.title&&!MILESTONES.includes(e.title);
      f=`${dd('f-date','Fecha',sd)}<label class="field"><span>Qué ha pasado</span><select class="inp" id="f-title">${MILESTONES.map(m=>`<option ${e&&e.title===m?'selected':''}>${m}</option>`).join('')}<option value="__otro" ${custom?'selected':''}>Otro…</option></select></label>
      <label class="field" id="f-other-w" ${custom?'':'hidden'}><span>Escribe el hito</span><input class="inp" id="f-other" value="${esc(custom?e.title:'')}"></label>
      <label class="field"><span>Nota (opcional)</span><input class="inp" id="f-note" value="${esc(e?e.note||'':'')}"></label>
      <div class="field"><span>Foto (opcional)</span><div class="photo-pick"><img id="f-ph" alt="" ${formPhoto?`data-img="${esc(formPhoto)}"`:'hidden'}><label class="btn">${ic('camera')}${formPhoto?'Cambiar foto':'Añadir foto'}<input type="file" accept="image/*" id="f-photo" hidden></label></div></div>`;break}
  }
  const timer=['sueno','despertar','pecho'].includes(type)&&isNew;
  openSheet(`${sheetHead(`${isNew?'':ro?'':'Editar · '}${t.label}`)}
   <form id="evform" novalidate>${ro?`<fieldset disabled style="border:0;padding:0;margin:0">${f}</fieldset>`:f}<p class="err" id="f-err"></p>
   ${ro?`<p class="foot">${!canWrite()?'Tienes acceso de solo lectura.':'Puedes ver este registro, pero para cambiarlo necesitas renovar el módulo.'}</p>`:`<div class="btns">${timer?`<button type="button" class="btn" data-act="timer">Empezar cronómetro</button>`:''}<button type="submit" class="btn pri">${isNew?'Guardar':'Guardar cambios'}</button></div>
   ${isNew?'':`<div class="btns" style="margin-top:10px"><button type="button" class="btn dan" data-act="del-ev" data-confirm="Toca otra vez para borrar">Borrar registro</button></div>`}`}</form>`);
  hydrateImages();
}
const val=id=>{const n=document.getElementById(id);return n?n.value.trim():''};
const numv=id=>{const v=val(id).replace(',','.');if(v==='')return null;const n=+v;return Number.isFinite(n)?n:NaN};
const radio=n=>{const x=document.querySelector(`#evform input[name="${n}"]:checked`);return x?x.value:null};
function submitForm(timer){
  const err=m=>{$('#f-err').textContent=m};const type=formType;const T=TYPES[type];
  if(!editing&&!guard(T.mod))return;
  let start;
  if(type==='medida'||type==='hito'){const d=fromDateInput(val('f-date'));if(d==null)return err('Indica la fecha.');start=d+12*H}
  else{start=fromLocalInput(val('f-start'));if(timer)start=Date.now();if(start==null)return err('Indica la hora.')}
  if(start>Date.now()+5*MIN&&type!=='medida'&&type!=='hito')return err('La hora no puede estar en el futuro.');
  if((type==='medida'||type==='hito')&&start-12*H>Date.now())return err('La fecha no puede estar en el futuro.');
  const o={type,start};
  if(type==='sueno'){o.sub=radio('sub');const en=val('f-end');o.end=timer||!en?null:fromLocalInput(en);if(o.end!=null&&o.end<=start)return err('La hora de despertar debe ser posterior a la de dormir.');
    if(o.end==null&&running().some(e=>e.type==='sueno'&&(!editing||e.id!==editing.id)))return err('Ya hay un sueño en curso. Termínalo primero.')}
  else if(type==='despertar'){const m=val('f-min');o.end=timer||m===''?null:start+Math.max(0,+m)*MIN}
  else if(type==='despertar_def'){o.end=start}
  else if(type==='pecho'){o.sub=radio('sub');const m=val('f-min');o.end=timer?null:(m===''?start:start+Math.max(0,+m)*MIN)}
  else if(type==='biberon'){const q=+val('f-qty');if(!(q>0))return err('Indica la cantidad en ml.');o.qty=Math.round(q);o.sub=radio('sub');o.end=start}
  else if(type==='comida'){o.note=val('f-note');if(!o.note)return err('Escribe qué ha comido.');o.end=start}
  else if(type==='panal'){o.sub=radio('sub');o.note=val('f-note');o.end=start}
  else if(type==='bano'){const tp=numv('f-temp');if(Number.isNaN(tp))return err('Escribe la temperatura con números, por ejemplo 37 o 36,5.');if(tp!=null&&(tp<20||tp>45))return err('La temperatura del agua parece incorrecta.');o.temp=tp;o.note=val('f-note');o.end=start}
  else if(type==='evento'){o.sub=val('f-cat');o.note=val('f-note');if(!o.note)return err('Escribe una descripción.');o.end=start}
  else if(type==='medida'){o.peso=numv('f-peso');o.talla=numv('f-talla');o.cabeza=numv('f-cabeza');o.end=start;
    if([o.peso,o.talla,o.cabeza].some(Number.isNaN))return err('Escribe las medidas con números, por ejemplo 5,4.');
    if(o.peso==null&&o.talla==null&&o.cabeza==null)return err('Rellena al menos una medida.');
    if(o.peso!=null&&(o.peso<.5||o.peso>30))return err('El peso va en kilos, por ejemplo 5,4.');
    if(o.talla!=null&&(o.talla<30||o.talla>120))return err('La talla va en centímetros, por ejemplo 58.');
    if(o.cabeza!=null&&(o.cabeza<20||o.cabeza>60))return err('El perímetro de cabeza va en centímetros, por ejemplo 39.')}
  else if(type==='hito'){const sel=val('f-title');o.title=sel==='__otro'?val('f-other'):sel;if(!o.title)return err('Escribe el hito.');o.note=val('f-note');o.photo=formPhoto;o.end=start}
  if(editing){upd(editing,o);toast('Cambios guardados')}
  else{
    if(type==='despertar'&&o.end==null)running().filter(e=>e.type==='sueno').forEach(e=>upd(e,{end:start}));
    if(type==='despertar_def'){running().forEach(e=>{if(e.type!=='pecho'&&e.start<=start)upd(e,{end:start})})}
    if(type==='pecho'&&o.end==null)running().filter(e=>e.type==='pecho').forEach(e=>upd(e,{end:start}));
    addEv(o);toast(timer?'Cronómetro en marcha':'Registro guardado')}
  closeSheet();render();
}
function openToothForm(code){
  const ex=evs().find(e=>e.type==='diente'&&e.tooth===code);
  if(!ex&&!guard('hitos'))return;
  const ro=!canWrite()||!has('hitos');
  openSheet(`${sheetHead('Diente')}<p class="sub" style="margin:-6px 0 12px">${toothName(code)}</p>
   <form id="toothform" novalidate data-t="${code}"><label class="field"><span>¿Cuándo salió?</span><input class="inp" type="date" id="t-date" value="${toDateInput(ex?ex.start:Date.now())}" max="${toDateInput(Date.now())}" ${ro?'disabled':''}></label><p class="err" id="t-err"></p>
   ${ro?'':`<div class="btns"><button class="btn pri" type="submit">Guardar</button>${ex?`<button type="button" class="btn dan" data-act="tooth-del" data-id="${ex.id}" data-confirm="Toca otra vez para quitarlo">Quitar</button>`:''}</div>`}</form>`)}
function openBabyForm(b){
  if(!isOwner())return toast('Solo el titular puede gestionar los bebés');
  if(!b&&babies().length>=1&&!has('bebes'))return openUnlock('bebes');
  openSheet(`${sheetHead(b?'Editar bebé':'Añadir bebé')}<form id="babyform" novalidate data-id="${b?b.id:''}">
   <label class="field"><span>Nombre</span><input class="inp" id="b-name" value="${esc(b?b.name:'')}" autocomplete="off"></label>
   <label class="field"><span>Fecha de nacimiento</span><input class="inp" type="date" id="b-birth" value="${esc(b?b.birth||'':'')}" max="${toDateInput(Date.now())}"></label>
   <div class="field"><span>Para las curvas de crecimiento</span><div class="seg" role="radiogroup">${[['f','Niña'],['m','Niño']].map(([v,l])=>`<label><input type="radio" name="b-sex" value="${v}" ${b&&b.sex===v?'checked':''}><span>${l}</span></label>`).join('')}</div></div>
   <p class="err" id="b-err"></p><div class="btns"><button class="btn pri" type="submit">${b?'Guardar cambios':'Añadir'}</button>${b&&babies().length>1?`<button type="button" class="btn dan" data-act="baby-archive" data-id="${b.id}" data-confirm="Toca otra vez para archivar">Archivar</button>`:''}</div></form>`)}
function saveBaby(form){
  const id=form.dataset.id,name=val('b-name'),birth=val('b-birth'),sx=document.querySelector('#babyform input[name="b-sex"]:checked');
  if(!name){$('#b-err').textContent='Escribe el nombre.';return}
  const t=Date.now();let b=id&&S.babies.find(x=>x.id===id);
  if(b){Object.assign(b,{name,birth,sex:sx?sx.value:b.sex||'',updated:t})}
  else{b={id:uid('bb_'),name,birth,sex:sx?sx.value:'',created:t,updated:t};S.babies.push(b);D.baby=b.id;saveD()}
  const first=!id&&babies().length===1;queue('baby',b);closeSheet();toast(id?'Datos guardados':`${name} añadido`);render();if(first&&!D.tourSeen)setTimeout(startTour,500);
}

/* ---------- Fotos ---------- */
const imgCache=new Map();
async function hydrateImages(){
  for(const el of document.querySelectorAll('img[data-img]')){const id=el.dataset.img;if(!id)continue;
    if(imgCache.has(id)){el.src=imgCache.get(id);el.hidden=false;continue}
    try{const r=await api('img/'+encodeURIComponent(id));imgCache.set(id,r.data);document.querySelectorAll(`img[data-img="${CSS.escape(id)}"]`).forEach(n=>{n.src=r.data;n.hidden=false})}catch(e){}}
}
function resizeImage(file,max=1080,q=.78){return new Promise((res,rej)=>{const url=URL.createObjectURL(file);const im=new Image();
  im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(url);res(c.toDataURL('image/jpeg',q))};
  im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error('img'))};im.src=url})}
async function pickPhoto(file){
  const errEl=$('#f-err');try{
    const data=await resizeImage(file);const id=uid('ph_');errEl.textContent='Subiendo foto…';
    await api('img/'+id,{method:'PUT',body:{data}});imgCache.set(id,data);formPhoto=id;const im=$('#f-ph');im.src=data;im.hidden=false;errEl.textContent='';
  }catch(e){errEl.textContent=e.status?e.message:'No se pudo subir la foto. Necesitas conexión a internet.'}}

/* ---------- Informe para el pediatra ---------- */
function openReport(){
  if(!has('informe'))return openUnlock('informe');
  const b=curBaby();if(!b)return;
  const days=14,today=midnight(Date.now()),from=addDays(today,-days),to=today;
  const per=[];for(let d=from;d<to;d=addDays(d,1))per.push(rangeStats(d,addDays(d,1)));
  const nights=[];for(let d=addDays(from,1);d<=to;d=addDays(d,1)){const[a,c]=nightWindow(d);nights.push(rangeStats(a,c))}
  const av=f=>per.length?per.reduce((s,x)=>s+f(x),0)/per.length:0;const avn=f=>nights.length?nights.reduce((s,x)=>s+f(x),0)/nights.length:0;
  const E=evs();const inRange=e=>e.start>=from&&e.start<addDays(to,1);
  const health=E.filter(e=>e.type==='evento'&&inRange(e)).sort((a,c)=>c.start-a.start);
  const meds=E.filter(e=>e.type==='medida').sort((a,c)=>c.start-a.start).slice(0,4);
  const hit=E.filter(e=>(e.type==='hito'||e.type==='diente')&&e.start>=addDays(today,-60)).sort((a,c)=>c.start-a.start);
  const ns=notes().filter(n=>n.t>=addDays(today,-30)).sort((a,c)=>c.t-a.t).slice(0,10);
  const bd=fromDateInput(b.birth);
  const row=(k,v)=>`<tr><th scope="row">${k}</th><td>${v}</td></tr>`;
  const sleepRows=row('Sueño total al día',fmtH(av(s=>s.sleep)))+row('Noche',fmtH(av(s=>s.night)))+row('Siestas',fmtH(av(s=>s.nap)))+row('Despertares por noche',num1(avn(s=>s.wakes))+` (${fmtDur(avn(s=>s.awake))} despierto)`);
  const feedRows=row('Tomas al día',num1(av(s=>s.feeds)))+row('Pecho al día',num1(av(s=>s.breast)))+row('Biberones al día',num1(av(s=>s.bottle))+(av(s=>s.ml)?` · ${Math.round(av(s=>s.ml))} ml`:''));
  const diaperRows=row('Pañales al día',num1(av(s=>s.diapers)))+row('Con pis',num1(av(s=>s.pis)))+row('Con caca',num1(av(s=>s.caca)));
  $('#report').innerHTML=`<div class="rp"><div class="rp-bar no-print"><button class="btn" data-act="report-close">${ic('close')}Cerrar</button><button class="btn pri" data-act="print">${ic('report')}Imprimir o guardar PDF</button></div>
   <h1>${esc(b.name)}</h1><p class="rp-meta">${b.birth?`Nacimiento: ${fmtD(bd)} · ${ageText(b)} · `:''}Del ${fmtD(from)} al ${fmtD(addDays(to,-1))} (${days} días)</p>
   <h3>Sueño · media diaria</h3><table>${sleepRows}</table>
   ${has('tomas')||E.some(e=>e.type==='pecho'||e.type==='biberon')?`<h3>Alimentación · media diaria</h3><table>${feedRows}</table>`:''}
   ${has('panales')||E.some(e=>e.type==='panal')?`<h3>Pañales · media diaria</h3><table>${diaperRows}</table>`:''}
   ${meds.length?`<h3>Crecimiento</h3><table><tr><th>Fecha</th><th>Peso</th><th>Talla</th><th>Cabeza</th></tr>${meds.map(m=>{const d=Math.round((midnight(m.start)-bd)/DAY);const p=(f,u)=>m[f]?`${num1(m[f])} ${u}${b.sex&&bd?`<br><small>${pctText(f,b.sex,d,+m[f])}</small>`:''}`:'—';return`<tr><td>${fmtD(m.start)}</td><td>${p('peso','kg')}</td><td>${p('talla','cm')}</td><td>${p('cabeza','cm')}</td></tr>`}).join('')}</table>`:''}
   ${health.length?`<h3>Salud en el periodo</h3><table>${health.map(e=>`<tr><td>${fmtD(e.start)} ${fmtTime(e.start)}</td><td><b>${esc(ECATS_ALL[e.sub]||'Salud')}</b> · ${esc(e.note||'')}</td></tr>`).join('')}</table>`:''}
   ${hit.length?`<h3>Hitos recientes</h3><table>${hit.map(e=>`<tr><td>${fmtD(e.start)}</td><td>${esc(e.type==='diente'?'Diente: '+toothName(e.tooth):e.title)}</td></tr>`).join('')}</table>`:''}
   ${ns.length?`<h3>Notas y preguntas</h3><table>${ns.map(n=>`<tr><td>${fmtD(n.t)}</td><td>${esc(n.text)}</td></tr>`).join('')}</table>`:''}
   <p class="rp-foot">Generado con Diario del bebé el ${fmtD(Date.now())}. Datos apuntados por la familia; las medias excluyen el día de hoy. Percentiles según los patrones de crecimiento de la OMS.</p></div>`;
  $('#report').hidden=false;document.body.style.overflow='hidden';
}
function closeReport(){$('#report').hidden=true;$('#report').innerHTML='';document.body.style.overflow='';if(ui.dirty){ui.dirty=false;render()}}

/* ---------- Copias ---------- */
function exportData(){const b=curBaby();return JSON.stringify({app:'diario-bebe',version:3,exported:new Date().toISOString(),baby:b,events:evs(),notes:notes()},null,1)}
async function doExport(){
  const txt=exportData(),name=`diario-bebe-${(curBaby()?.name||'bebe').toLowerCase().replace(/[^a-z0-9]+/gi,'-')}-${todayKey()}.json`;
  try{const file=new File([txt],name,{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Copia Diario del bebé'});toast('Copia guardada');return}}catch(e){if(e&&e.name==='AbortError')return}
  try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'application/json'}));a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
    toast('Copia descargada. Si no aparece, usa «Copiar datos».')}catch(e){toast('No se pudo exportar. Usa «Copiar datos».')}
}
async function copyText(txt,okMsg){try{await navigator.clipboard.writeText(txt);toast(okMsg||'Copiado')}catch(e){
  openSheet(`${sheetHead('Copiar')}<p class="sub">Selecciona el texto y cópialo.</p><textarea class="inp" id="copy-area" style="min-height:160px;font-family:var(--f-mono);font-size:12px" readonly>${esc(txt)}</textarea>`);
  const t=$('#copy-area');t.focus();t.select()}}
function parseImport(txt){try{const d=JSON.parse(txt);if(!d||!Array.isArray(d.events))throw 0;
  const evs2=d.events.filter(e=>e&&e.id&&TYPES[e.type]&&typeof e.start==='number');
  ui.pendingImport={events:evs2,notes:Array.isArray(d.notes)?d.notes.filter(n=>n&&n.id&&n.text):[]}}
  catch(e){ui.pendingImport={error:'El archivo no es una copia válida de Diario del bebé.'}}
  const b=$('#imp-box');if(b)b.innerHTML=impBox()}
function applyImport(){const p=ui.pendingImport,b=curBaby();if(!p||p.error||!b)return;const now=Date.now();let n=0,skip=0;
  for(const e of p.events){if(S.events.some(x=>x.id===e.id))continue;if(!has(TYPES[e.type].mod)){skip++;continue}const it={...e,baby:b.id,updated:e.updated||now};delete it.demo;delete it._rev;delete it.by;delete it.uid;S.events.push(it);S.outbox.push({k:'ev',item:it});n++}
  if(has('notas'))for(const x of p.notes){if(S.notes.some(y=>y.id===x.id))continue;const it={...x,baby:b.id,updated:x.updated||now};delete it._rev;S.notes.push(it);S.outbox.push({k:'note',item:it});n++}
  ui.pendingImport=null;save();syncSoon(50);toast(n?`${n} registros añadidos${skip?` · ${skip} necesitan módulos que no tienes`:''}`:'No había nada nuevo');render()}

/* ---------- Utilidades ---------- */
let toastT;function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,2600)}
function applyTheme(){const th=D.theme;if(th==='light'||th==='dark')document.documentElement.setAttribute('data-theme',th);else document.documentElement.removeAttribute('data-theme')}
function armed(btn){if(btn.dataset.armed==='1')return true;const orig=btn.innerHTML;btn.dataset.armed='1';btn.textContent=btn.dataset.confirm;setTimeout(()=>{if(btn.isConnected){btn.dataset.armed='';btn.innerHTML=orig}},4000);return false}

/* ---------- Paseo virtual ---------- */
function buildTour(){
  const steps=[
   {title:'Bienvenida al Diario del bebé',text:'Aquí apuntáis cuándo duerme, come y se cambia el pañal. Te enseño en 2 minutos qué puedes hacer y qué más puedes añadir.',
    yes:['Cada persona entra con su usuario y ve al momento lo que apuntan los demás','Sin cobertura también puedes apuntar: se envía al volver la conexión']},
   {view:'inicio',sel:'.quick',title:'Apuntar con un toque',text:'Los botones grandes registran al momento lo que más se repite. Los que llevan candado son Premium: tócalos y verás qué incluyen.',
    ex:'Se queda dormido: toca «Dormir». El cronómetro arranca solo y lo verás arriba.'},
   {view:'inicio',sel:'#live .lv',optional:true,title:'Lo que está pasando ahora',text:'Esta barra aparece mientras duerme o toma el pecho. Tócala para ver qué puedes hacer.',
    ex:'A las 3:00 se despierta: barra, «Se despierta un rato». Cuando se vuelve a dormir: «Vuelve a dormir». Por la mañana: «Despertar definitivo».'},
   {view:'diario',sel:'.tl-wrap',title:'El día de un vistazo',text:'Cada franja es un rato de sueño. La raya oscura marca la hora actual. Con las flechas de arriba vas a días anteriores.',
    ex:'Azul es la noche, turquesa las siestas y rosa los ratos despierto por la noche. Toca «Noche» para ver solo de 19:00 a 9:00.'},
   {view:'diario',sel:'.log',optional:true,title:'Corregir o borrar',text:'Toca cualquier registro de la lista para cambiarlo o borrarlo.',
    ex:'Apuntaste que se durmió a las 10:15 pero fue a las 9:45: tócalo, cambia la hora y guarda.'},
   {title:allOn()?'Todo lo que incluye tu cuenta':'Y con Premium…',text:allOn()?'Tu cuenta tiene todos los módulos. Te enseño dónde está cada uno.':`Esto es lo que puedes añadir. Cada módulo cuesta ${euros(me()?.sale?.prices?.module??1)} al mes, o todo para siempre por ${euros(me()?.sale?.prices?.all??20)}.`}
  ];
  const prem=[
   {mods:['tomas','comidas'],view:'inicio',sel:'.qb[data-mod="tomas"]',title:'Tomas y comidas',text:MODS.tomas.desc,ex:MODS.tomas.ex},
   {mods:['siesta'],view:'inicio',sel:'#siesta-card',title:'Próxima siesta',text:MODS.siesta.desc,ex:MODS.siesta.ex,no:['Es una orientación por edad, no una norma: cada bebé es distinto']},
   {mods:['panales','banos','salud'],view:'inicio',sel:'.qb[data-mod="panales"]',title:'Pañales, baños y salud',text:'Pis y caca, cada baño con la temperatura del agua, y vacunas, medicación o fiebre.',ex:MODS.salud.ex},
   {mods:['analisis'],view:'evolucion',sel:'#sec-analisis',title:'Análisis',text:MODS.analisis.desc,ex:MODS.analisis.ex},
   {mods:['crecimiento'],view:'evolucion',sel:'#sec-crecimiento',title:'Crecimiento',text:MODS.crecimiento.desc,ex:MODS.crecimiento.ex,no:['No da diagnósticos: quien valora el crecimiento es el pediatra']},
   {mods:['hitos'],view:'evolucion',sel:'#sec-hitos',title:'Hitos y dientes',text:MODS.hitos.desc,ex:MODS.hitos.ex},
   {mods:['informe'],view:'evolucion',sel:'#sec-informe',title:'Informe para el pediatra',text:MODS.informe.desc,ex:MODS.informe.ex},
   {mods:['notas'],view:'notas',sel:'#notas-main',title:'Notas',text:MODS.notas.desc,ex:MODS.notas.ex},
   {mods:['familia','bebes'],view:'perfil',sel:'#sect-cuenta',title:'Compartir en familia y varios bebés',text:MODS.familia.desc+' Y si tenéis gemelos o hermanos, cada uno con su diario.',ex:MODS.familia.ex}
  ];
  steps.push(...prem);
  steps.push({title:'Lo que esta app no hace',text:'Para que no haya sorpresas:',
    no:['No envía avisos: para ver lo que apunta tu familia hay que abrir la app','Si dos personas apuntan la misma toma, saldrá dos veces: borrad una','Sin internet no ves lo que apuntan los demás hasta que vuelve la conexión','No sustituye al pediatra']});
  steps.push({view:'inicio',title:'¡Listo!',text:'Puedes repetir este paseo cuando quieras con «Cómo funciona» en Inicio o en Perfil.',
    ex:'Empieza con el próximo sueño: toca «Dormir» en Inicio.',offer:!allOn()});
  return steps;
}
let tour=null,TOUR=[];
function startTour(){closeSheet();D.tourSeen=true;saveD();TOUR=buildTour();tour={i:0,dir:1};$('#tour').hidden=false;document.body.style.overflow='hidden';showStep()}
function endTour(){tour=null;$('#tour').hidden=true;document.body.style.overflow='';ui.dirty=false;render()}
function tourGo(d){const n=tour.i+d;if(n<0)return;if(n>=TOUR.length)return endTour();tour.i=n;tour.dir=d;showStep()}
function showStep(){
  const st=TOUR[tour.i];
  if(st.view&&ui.view!==st.view){ui.view=st.view;try{history.replaceState(null,'','#'+st.view)}catch(e){}render()}
  const el=st.sel?document.querySelector(st.sel):null;
  if(st.sel&&!el&&st.optional)return tourGo(tour.dir);
  const li=(arr,c,i)=>arr&&arr.length?`<ul class="tour-li">${arr.map(t=>`<li class="${c}">${ic(i)}<span>${esc(t)}</span></li>`).join('')}</ul>`:'';
  const ex=st.ex?`<div class="tour-ex"><b>Ejemplo</b>${esc(st.ex)}</div>`:'';
  const last=tour.i===TOUR.length-1;
  let want='';
  if(st.mods){const locked=st.mods.filter(k=>!has(k));want=locked.length?`<div class="tour-want"><span class="st trial">${ic('lock')}Premium · ${euros(me()?.sale?.prices?.module??1)}/mes cada uno</span></div>`:`<div class="tour-want"><span class="st on">${ic('check')}Incluido en tu cuenta</span></div>`}
  const wantBtn=st.mods&&st.mods.some(k=>!has(k))?`<button class="btn" data-act="tour-want" data-mod="${st.mods.find(k=>!has(k))}">Lo quiero</button>`:st.offer?`<button class="btn" data-act="tour-want" data-mod="all">Todo por ${euros(me()?.sale?.prices?.all??20)}</button>`:'';
  $('#tour-card').innerHTML=`<span class="tour-step">Paso ${tour.i+1} de ${TOUR.length}</span><div class="tour-dots" aria-hidden="true">${TOUR.map((_,k)=>`<i class="${k<=tour.i?'on':''}"></i>`).join('')}</div>
   <h2 id="tour-t">${esc(st.title)}</h2>${want}<p>${esc(st.text)}</p>${ex}${li(st.yes,'y','check')}${li(st.no,'n','close')}
   <div class="tour-nav">${last?'':'<button class="skip" data-act="tour-end">Saltar</button>'}${tour.i&&!wantBtn?'<button class="btn" data-act="tour-prev">Atrás</button>':''}${wantBtn}<button class="btn pri" data-act="tour-next">${last?'Empezar a usarla':tour.i?'Siguiente':'Empezar el paseo'}</button></div>`;
  if(last)$('#tour-card .tour-nav').style.justifyContent='flex-end';
  if(el&&getComputedStyle(el).position!=='fixed'){const r=el.getBoundingClientRect(),lv=$('#live').getBoundingClientRect().height||0;window.scrollTo(0,Math.max(0,scrollY+r.top-lv-10))}
  requestAnimationFrame(()=>placeTour(el));
}
function placeTour(el){
  if(!tour)return;const spot=$('#tour-spot'),card=$('#tour-card');card.classList.remove('top','bottom','mid');
  if(!el){spot.style.cssText='top:50%;left:50%;width:0;height:0';card.classList.add('mid');return}
  const r=el.getBoundingClientRect(),p=6,hh=Math.min(r.height,innerHeight*.6);
  spot.style.cssText=`top:${r.top-p}px;left:${r.left-p}px;width:${r.width+2*p}px;height:${hh+2*p}px;border-radius:${el.id==='fab'?'50%':'18px'}`;
  const ch=card.offsetHeight;card.classList.add(r.top+hh+p+ch+24<=innerHeight||r.top<innerHeight/2?'bottom':'top');
}
window.addEventListener('resize',()=>{if(tour)placeTour(TOUR[tour.i].sel?document.querySelector(TOUR[tour.i].sel):null)});

/* ============================================================
   Panel del superadministrador (/admin)
   No muestra ningún dato de los bebés: solo cuentas, usuarios, módulos y pagos.
   ============================================================ */
const A={data:null,err:'',creds:null,loading:false,open:{}};
const WORDS=['luna','pato','sol','mar','nube','lobo','rio','pino','gato','oso','faro','miel','lima','coco','tigre','koala'];
const genPass=()=>{const r=n=>WORDS[Math.floor(Math.random()*WORDS.length)];return`${r()}-${r()}-${10+Math.floor(Math.random()*90)}`};
async function adminLoad(){A.loading=true;try{A.data=await api('admin/state',{admin:true});A.err=''}catch(e){if(e.status===401){D.adminToken='';saveD()}A.err=e.message}A.loading=false;render()}
async function aop(op,body={},ok){try{const r=await api('admin/op',{method:'POST',admin:true,body:{op,...body}});if(ok)toast(ok);await adminLoad();return r}catch(e){toast(e.message);return null}}
const modName=k=>k==='all'?'Todo para siempre':(A.data?.modules?.[k]||k);
const activeM=m=>!!m&&(m.from??0)<=Date.now()&&(m.until==null||m.until>Date.now());
function admStatus(m){if(activeM(m))return m.trial?`<span class="st trial">Prueba hasta ${fmtD(m.until)}</span>`:`<span class="st on">${m.until?'Hasta '+fmtD(m.until):'Para siempre'}</span>`;
  if(m&&m.until)return`<span class="st exp">Caducó ${fmtD(m.until)}</span>`;return'<span class="st off">No contratado</span>'}
function vAdminLogin(){return`<header class="vh"><div><p class="eyebrow">Diario del bebé</p><h1>Administración</h1></div></header>
  <form id="adminlogin" class="sect" novalidate><label class="field"><span>Usuario</span><input class="inp" id="a-user" autocomplete="username" autocapitalize="none"></label>
  <label class="field"><span>Contraseña</span><input class="inp" type="password" id="a-pass" autocomplete="current-password"></label><p class="err" id="a-err"></p>
  <button class="btn pri wide" type="submit" id="a-go">Entrar</button></form><p class="foot">Son el usuario y la contraseña que pusiste en Netlify (ADMIN_USER y ADMIN_PASSWORD).</p>`}
function vAdmin(){
  if(!D.adminToken)return vAdminLogin();
  const d=A.data;if(!d)return`<header class="vh"><h1>Administración</h1></header><p class="empty">${A.err?esc(A.err):'Cargando…'}</p>`;
  const cfg=d.config||{},prices=cfg.prices||{module:1,all:20};
  const pend=d.payments.filter(p=>p.status==='pending');
  const accName=id=>d.accounts.find(a=>a.id===id)?.name||'—';
  const mods=Object.keys(d.modules).filter(k=>k!=='sueno');
  const accHTML=a=>{const us=d.users.filter(u=>u.accountId===a.id);const ownerless=!us.some(u=>u.role==='owner');
    return`<details class="acc" data-acc="${a.id}" ${A.open[a.id]?'open':''}><summary><b>${esc(a.name)}</b>${a.blocked?'<span class="st exp">Bloqueada</span>':''}<span class="mono">${esc(a.code)}</span>${ic('down')}</summary><div class="in">
     <p class="foot" style="margin:0 0 6px">${us.length} ${us.length===1?'usuario':'usuarios'} · creada ${fmtD(a.created)}${ownerless?' · <b style="color:var(--danger)">sin titular</b>':''}</p>
     <div class="row" style="margin-bottom:6px"><button class="sbtn pri" data-act="a-act" data-acc="${a.id}" data-mod="all" data-n="forever">${ic('gift')}Todo para siempre · ${euros(prices.all)}</button><button class="sbtn" data-act="a-act" data-acc="${a.id}" data-mod="all" data-n="trial">Prueba de todo · ${cfg.trialDays||7} días</button></div>
     ${mods.map(k=>{const m=a.mods[k];return`<div class="mrow"><span class="n">${esc(d.modules[k])}</span>${admStatus(m)}<div class="acts"><button class="sbtn" data-act="a-act" data-acc="${a.id}" data-mod="${k}" data-n="1">+1 mes</button><button class="sbtn" data-act="a-act" data-acc="${a.id}" data-mod="${k}" data-n="3">+3</button><button class="sbtn" data-act="a-act" data-acc="${a.id}" data-mod="${k}" data-n="12">+12</button><button class="sbtn" data-act="a-act" data-acc="${a.id}" data-mod="${k}" data-n="trial">Prueba</button>${activeM(m)?`<button class="sbtn dan" data-act="a-deact" data-acc="${a.id}" data-mod="${k}" data-confirm="¿Quitar? Toca otra vez">Quitar</button>`:''}</div></div>`}).join('')}
     <details style="margin-top:12px"><summary>Registrar un pago con otras fechas</summary><form class="a-pay" data-acc="${a.id}" novalidate style="margin-top:8px">
      <div class="two"><label class="field"><span>Módulo</span><select class="inp" name="module"><option value="all">Todo</option>${mods.map(k=>`<option value="${k}">${esc(d.modules[k])}</option>`).join('')}</select></label><label class="field"><span>Importe (€)</span><input class="inp" name="amount" type="number" step="0.01" min="0" value="${prices.module}"></label></div>
      <div class="two"><label class="field"><span>Desde</span><input class="inp" name="from" type="date" value="${todayKey()}"></label><label class="field"><span>Hasta (vacío = sin fin)</span><input class="inp" name="until" type="date"></label></div>
      <div class="two"><label class="field"><span>Tipo</span><select class="inp" name="kind"><option value="pago">Pago</option><option value="prueba">Prueba</option><option value="regalo">Regalo</option></select></label><label class="field"><span>Nota</span><input class="inp" name="note"></label></div>
      <button class="btn pri" type="submit">Registrar y activar</button></form></details>
     <h3 style="margin:18px 0 0;font-size:16px">Usuarios</h3>
     ${us.map(u=>`<div class="urow"><div class="top"><b>${esc(u.name)}</b><span class="mono">${esc(u.username)}</span>${u.blocked?'<span class="st exp">Bloqueado</span>':''}${u.mustChange?'<span class="st trial">Contraseña provisional</span>':''}${u.lockedUntil?'<span class="st exp">Bloqueado por intentos</span>':''}</div>
       <div class="row" style="margin-top:8px"><select class="inp" style="width:auto;min-height:36px" data-act-change="a-role" data-id="${u.id}">${[['owner','Titular'],['member','Miembro'],['reader','Solo lectura']].map(([v,l])=>`<option value="${v}" ${u.role===v?'selected':''}>${l}</option>`).join('')}</select>
       <button class="sbtn" data-act="a-reset" data-id="${u.id}" data-u="${esc(u.username)}">Nueva contraseña</button>
       <button class="sbtn" data-act="a-block" data-id="${u.id}" data-v="${u.blocked?0:1}">${u.blocked?'Desbloquear':'Bloquear'}</button>${u.lockedUntil?`<button class="sbtn" data-act="a-unlock" data-id="${u.id}">Quitar bloqueo por intentos</button>`:''}
       <button class="sbtn dan" data-act="a-deluser" data-id="${u.id}" data-confirm="¿Borrar usuario? Toca otra vez">Borrar</button></div>
       <details style="margin-top:6px"><summary>Módulos solo para ${esc(u.name)}</summary><div class="ovr">${mods.map(k=>`<span>${esc(d.modules[k])}</span><select data-act-change="a-umod" data-id="${u.id}" data-mod="${k}"><option value="inherit" ${!u.mods[k]?'selected':''}>Como la cuenta</option><option value="on" ${u.mods[k]==='on'?'selected':''}>Activado</option><option value="off" ${u.mods[k]==='off'?'selected':''}>Desactivado</option></select>`).join('')}</div></details></div>`).join('')||'<p class="foot">Sin usuarios.</p>'}
     <details style="margin-top:12px"><summary>Añadir usuario a esta familia</summary><form class="a-user" data-acc="${a.id}" novalidate style="margin-top:8px">
      <div class="two"><label class="field"><span>Nombre que verá la familia</span><input class="inp" name="name" placeholder="Mamá"></label><label class="field"><span>Usuario para entrar</span><input class="inp" name="username" autocapitalize="none" placeholder="lucia.mama"></label></div>
      <div class="two"><label class="field"><span>Rol</span><select class="inp" name="role"><option value="member">Miembro</option><option value="owner" ${ownerless?'selected':''}>Titular</option><option value="reader">Solo lectura</option></select></label><label class="field"><span>Contraseña provisional</span><input class="inp" name="password" value="${genPass()}"></label></div>
      ${!activeM(a.mods.familia)&&us.length?`<p class="foot" style="margin:-4px 0 10px">Ojo: esta familia no tiene «Compartir en familia»; solo podrá entrar el titular.</p>`:''}
      <button class="btn pri" type="submit">Crear usuario</button></form></details>
     <div class="row" style="margin-top:14px"><button class="sbtn" data-act="a-rename" data-acc="${a.id}" data-name="${esc(a.name)}">Renombrar</button><button class="sbtn ${a.blocked?'':'dan'}" data-act="a-blockacc" data-acc="${a.id}" data-v="${a.blocked?0:1}" ${a.blocked?'':'data-confirm="¿Bloquear la cuenta? Toca otra vez"'}>${a.blocked?'Desbloquear cuenta':'Bloquear cuenta'}</button></div>
    </div></details>`};
  const kindL={pago:'Pago',prueba:'Prueba',regalo:'Regalo'},stL={pending:'Pendiente',confirmed:'Confirmado',rejected:'Rechazado'};
  return`<div class="adm"><header class="vh"><div><p class="eyebrow">Diario del bebé</p><h1>Administración</h1></div><button class="help-btn" data-act="a-logout">${ic('out')}Salir</button></header>
   ${A.creds?`<div class="creds"><p><b>Pásale estos datos a ${esc(A.creds.name)}:</b></p><p>Web: <b class="mono">${esc(location.origin)}</b><br>Usuario: <b class="mono">${esc(A.creds.username)}</b><br>Contraseña provisional: <b class="mono">${esc(A.creds.password)}</b></p><p class="foot">La primera vez que entre tendrá que elegir su propia contraseña.</p><div class="row"><button class="sbtn pri" data-act="a-copycreds">${ic('copy')}Copiar</button><button class="sbtn" data-act="a-hidecreds">Hecho</button></div></div>`:''}
   ${d.legacy.pending?`<div class="sect"><h3>Datos de la versión anterior</h3><p>Hay registros de la v2 (la del código compartido). Pásalos a una cuenta nueva con todo activado para siempre. Antes se guarda una copia.</p><form id="a-migrate" novalidate><label class="field"><span>Nombre de la cuenta</span><input class="inp" id="a-mname" value="Casa"></label><button class="btn pri" type="submit">Migrar datos</button></form></div>`:''}
   <h2>Pagos pendientes${pend.length?` · ${pend.length}`:''}</h2>
   ${pend.length?pend.map(p=>{const acc=d.accounts.find(a=>a.id===p.accountId);const cur=acc&&p.module!=='all'?acc.mods[p.module]:null;
     return`<div class="pend"><p><b>${esc(p.accountName||accName(p.accountId))}</b> · ${esc(p.userName||'')} avisa de un Bizum de <b>${euros(p.amount)}</b> por <b>${esc(modName(p.module))}</b> el ${fmtD(p.created)} a las ${fmtTime(p.created)}. Concepto esperado: <span class="mono">${esc((acc?.code||'')+' '+(p.module==='all'?'TODO':modName(p.module).toUpperCase()))}</span></p>
     <div class="row">${p.module==='all'?`<button class="sbtn pri" data-act="a-confirm" data-id="${p.id}" data-n="forever">Confirmar · para siempre</button>`:`<button class="sbtn pri" data-act="a-confirm" data-id="${p.id}" data-n="1">Confirmar 1 mes</button><button class="sbtn" data-act="a-confirm" data-id="${p.id}" data-n="3">3 meses</button><button class="sbtn" data-act="a-confirm" data-id="${p.id}" data-n="12">12 meses</button>`}<button class="sbtn dan" data-act="a-reject" data-id="${p.id}" data-confirm="¿Rechazar? Toca otra vez">Rechazar</button></div>${cur&&activeM(cur)&&cur.until?`<p class="foot" style="margin:6px 0 0">Ya lo tiene hasta ${fmtD(cur.until)}: se sumará a partir de esa fecha.</p>`:''}</div>`}).join(''):'<p class="foot">No hay avisos de pago pendientes.</p>'}
   <h2>Nueva familia</h2>
   <form id="a-newfam" class="sect" novalidate><div class="two"><label class="field"><span>Nombre de la familia</span><input class="inp" name="acc" placeholder="Familia García"></label><label class="field"><span>Nombre del titular</span><input class="inp" name="name" placeholder="Laura"></label></div>
    <div class="two"><label class="field"><span>Usuario para entrar</span><input class="inp" name="username" autocapitalize="none" placeholder="laura.garcia"></label><label class="field"><span>Contraseña provisional</span><input class="inp" name="password" value="${genPass()}"></label></div>
    <p class="foot" style="margin:-4px 0 10px">Empieza solo con el sueño. Desde la ficha de la familia activas lo que pague.</p><p class="err" id="a-nferr"></p><button class="btn pri" type="submit">Crear familia y titular</button></form>
   <h2>Familias · ${d.accounts.length}</h2>
   ${d.accounts.map(accHTML).join('')||'<p class="foot">Aún no hay familias.</p>'}
   <h2>Historial de pagos</h2>
   <div class="tbl"><table><thead><tr><th>Fecha</th><th>Familia</th><th>Qué</th><th>Importe</th><th>Desde</th><th>Hasta</th><th>Tipo</th><th>Estado</th></tr></thead><tbody>
   ${d.payments.slice(0,200).map(p=>`<tr><td>${fmtD(p.created)}</td><td>${esc(p.accountName||accName(p.accountId))}</td><td>${esc(modName(p.module))}</td><td>${euros(p.amount||0)}</td><td>${p.from?fmtD(p.from):'—'}</td><td>${p.status==='confirmed'?(p.until?fmtD(p.until):'Sin fin'):'—'}</td><td>${kindL[p.kind]||'—'}</td><td>${stL[p.status]||p.status}</td></tr>`).join('')||'<tr><td colspan="8">Sin pagos.</td></tr>'}</tbody></table></div>
   <h2>Ajustes de venta</h2>
   <form id="a-cfg" class="sect" novalidate><div class="two"><label class="field"><span>Tu número de Bizum</span><input class="inp" name="bizum" inputmode="tel" value="${esc(cfg.bizum||'')}"></label><label class="field"><span>Nombre que verán</span><input class="inp" name="bizumName" value="${esc(cfg.bizumName||'')}"></label></div>
    <div class="three"><label class="field"><span>Módulo (€/mes)</span><input class="inp" name="pm" type="number" step="0.01" min="0" value="${prices.module}"></label><label class="field"><span>Todo para siempre (€)</span><input class="inp" name="pa" type="number" step="0.01" min="0" value="${prices.all}"></label><label class="field"><span>Días de prueba</span><input class="inp" name="td" type="number" min="1" max="60" value="${cfg.trialDays||7}"></label></div>
    <label class="field"><span>Texto extra en la pantalla de pago (opcional)</span><textarea class="inp" name="payText">${esc(cfg.payText||'')}</textarea></label><button class="btn pri" type="submit">Guardar ajustes</button></form>
   <details class="sect"><summary>Registro de cambios</summary><div class="tbl"><table><tbody>${(d.audit||[]).map(x=>`<tr><td>${fmtD(x.t)} ${fmtTime(x.t)}</td><td>${esc(x.op)}</td><td>${esc(JSON.stringify(x.detail||{}))}</td></tr>`).join('')}</tbody></table></div></details>
   <p class="ver">Panel de administración · no muestra ningún dato de los bebés.</p></div>`;
}
async function adminActivate(accId,mod,n,paymentId){
  const d=A.data,cfg=d.config,prices=cfg.prices||{module:1,all:20};const acc=d.accounts.find(a=>a.id===accId);const now=Date.now();
  if(n==='forever')return aop('activate',{accountId:accId,module:mod,from:now,until:null,amount:prices.all,kind:'pago',paymentId},'Activado para siempre');
  if(n==='trial'){const until=addDays(now,cfg.trialDays||7);return aop('activate',{accountId:accId,module:mod,from:now,until,amount:0,kind:'prueba',paymentId},'Prueba activada')}
  const months=+n;const cur=mod!=='all'&&acc.mods[mod];const from=cur&&activeM(cur)&&cur.until?cur.until:now;
  return aop('activate',{accountId:accId,module:mod,from,until:addMonths(from,months),amount:prices.module*months,kind:'pago',paymentId},`Activado hasta ${fmtD(addMonths(from,months))}`);
}

/* ---------- Render principal ---------- */
const VIEWS={inicio:['Inicio','home',vInicio],diario:['Diario','book',vDiario],evolucion:['Evolución','trend',vEvolucion],notas:['Notas','note',vNotas],perfil:['Perfil','user',vPerfil]};
function render(){
  const nav=$('nav.tabs');
  if(ADMIN){$('#live').innerHTML='';$('#tabs').innerHTML='';nav.hidden=true;$('#fab').hidden=true;$('#view').innerHTML=vAdmin();return}
  const bare=v=>{$('#live').innerHTML='';$('#view').innerHTML=v;$('#tabs').innerHTML='';nav.hidden=true;$('#fab').hidden=true};
  if(!D.token)return bare(vLogin());
  if(S.block)return bare(vBlocked());
  if(me()?.user?.mustChange)return bare(vForcePassword());
  if(!curBaby())return bare(vNoBaby());
  nav.hidden=false;$('#fab').hidden=!canWrite();
  renderLive();
  const sx=$('#tlwrap')?$('#tlwrap').scrollLeft:0;
  $('#view').innerHTML=VIEWS[ui.view][2]();
  if($('#tlwrap')){$('#tlwrap').scrollLeft=ui.zoom&&!sx?Math.max(0,($('#tlwrap').scrollWidth*(new Date().getHours()/24))-120):sx}
  $('#tabs').innerHTML=Object.entries(VIEWS).map(([k,[l,i]])=>`<a href="#${k}" ${ui.view===k?'aria-current="page"':''}>${ic(i)}${l}</a>`).join('');
  hydrateImages();
}
function route(){if(tour)return;const h=location.hash.slice(1);ui.view=VIEWS[h]?h:'inicio';closeSheet();render();window.scrollTo(0,0)}

/* ---------- Eventos ---------- */
document.addEventListener('click',ev=>{
  const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act,id=b.dataset.id,find=()=>S.events.find(e=>e.id===id);
  if(b.dataset.confirm&&!armed(b))return;
  switch(a){
    case'toggle-live':ui.open=ui.open===id?null:id;renderLive();break;
    case'stop':{const e=find();if(e&&guard(TYPES[e.type].mod)){upd(e,{end:Date.now()});ui.open=null;toast(e.type==='pecho'?'Toma terminada':'Sueño terminado');render()}break}
    case'wake-short':{if(!guard('sueno'))break;const now=Date.now(),e=find();if(e)upd(e,{end:now});addEv({type:'despertar',start:now,end:null});ui.open=null;render();break}
    case'back-sleep':{if(!guard('sueno'))break;const now=Date.now(),e=find();if(e)upd(e,{end:now});addEv({type:'sueno',sub:'noche',start:now,end:null});ui.open=null;toast('Vuelve a dormir');render();break}
    case'wake-final':finalWake();break;
    case'switch-side':{const e=find();if(e)startBreast(e.sub==='izq'?'der':'izq');ui.open=null;render();break}
    case'edit':{const e=find();if(e)openForm(e.type,e);break}
    case'breast':startBreast(b.dataset.side);break;
    case'sleep':startSleep();break;
    case'form':openForm(b.dataset.type);break;
    case'close':closeSheet();break;
    case'timer':submitForm(true);break;
    case'amt':$('#f-qty').value=b.dataset.v;break;
    case'del-ev':if(editing){delEv(editing.id);closeSheet();toast('Registro borrado');render()}break;
    case'day':{const n=addDays(ui.day,+b.dataset.d);if(n<=midnight(Date.now())){ui.day=n;render()}break}
    case'zoom':ui.zoom=!ui.zoom;render();break;
    case'tlf':ui.tl=b.dataset.v;render();break;
    case'logf':ui.log=b.dataset.v;render();break;
    case'bar':ui.sel[b.dataset.c]=+b.dataset.i;render();break;
    case'gkind':ui.gkind=b.dataset.v;render();break;
    case'baby':D.baby=id;saveD();render();break;
    case'baby-new':openBabyForm(null);break;
    case'baby-edit':{const bb=S.babies.find(x=>x.id===id);if(bb)openBabyForm(bb);break}
    case'baby-archive':{const bb=S.babies.find(x=>x.id===id);if(bb){bb.archived=true;bb.updated=Date.now();queue('baby',bb);if(D.baby===id){D.baby='';saveD()}closeSheet();toast('Bebé archivado');render()}break}
    case'tooth':openToothForm(b.dataset.t);break;
    case'tooth-del':delEv(id);closeSheet();toast('Diente quitado');render();break;
    case'report':openReport();break;
    case'report-close':closeReport();break;
    case'print':try{window.print()}catch(e){toast('Usa Compartir → Imprimir para guardarlo en PDF')}break;
    case'unlock':openUnlock(b.dataset.mod);break;
    case'paid':notifyPaid(b.dataset.mod);break;
    case'copy-text':copyText(b.dataset.text,'Concepto copiado');break;
    case'upsell-hide':D.upsellDay=todayKey();saveD();render();break;
    case'add-note':{if(!guard('notas'))break;const t=val('note-new');if(!t)return toast('Escribe algo antes de guardar');const now=Date.now(),n={id:uid(),t:now,text:t,by:me()?.user?.name||'',baby:curBaby()?.id,updated:now};S.notes.push(n);queue('note',n);toast('Nota guardada');render();break}
    case'del-note':if(!guard('notas'))break;S.notes=S.notes.filter(n=>n.id!==id);queue('note',{id,deleted:true,updated:Date.now()});render();break;
    case'export':doExport();break;
    case'copy':copyText(exportData(),'Datos copiados. Pégalos en Notas o en un correo.');break;
    case'imp-merge':applyImport();break;
    case'tour':startTour();break;
    case'tour-next':tourGo(1);break;
    case'tour-prev':tourGo(-1);break;
    case'tour-end':endTour();break;
    case'tour-want':{const m=b.dataset.mod;endTour();openUnlock(m);break}
    case'sync-now':sy.fail=0;sync().then(()=>toast(sy.state==='ok'?'Al día':'Sin conexión'));break;
    case'retry':sy.fail=0;sync().then(()=>render());break;
    case'logout':case'logout-now':logout();break;
    /* administración */
    case'a-logout':D.adminToken='';saveD();A.data=null;render();break;
    case'a-act':adminActivate(b.dataset.acc,b.dataset.mod,b.dataset.n);break;
    case'a-deact':aop('deactivate',{accountId:b.dataset.acc,module:b.dataset.mod},'Módulo quitado');break;
    case'a-confirm':{const p=A.data.payments.find(x=>x.id===id);if(p)adminActivate(p.accountId,p.module,b.dataset.n,p.id);break}
    case'a-reject':aop('rejectPayment',{id},'Solicitud rechazada');break;
    case'a-reset':{const pw=genPass();aop('resetPassword',{id,password:pw}).then(r=>{if(r){const u=A.data.users.find(x=>x.id===id);A.creds={name:u?.name||'',username:b.dataset.u,password:pw};render();window.scrollTo(0,0)}});break}
    case'a-block':aop('updateUser',{id,blocked:b.dataset.v==='1'},b.dataset.v==='1'?'Usuario bloqueado':'Usuario desbloqueado');break;
    case'a-unlock':aop('updateUser',{id,unlock:true},'Bloqueo quitado');break;
    case'a-deluser':aop('deleteUser',{id},'Usuario borrado');break;
    case'a-blockacc':aop('updateAccount',{id:b.dataset.acc,blocked:b.dataset.v==='1'},b.dataset.v==='1'?'Cuenta bloqueada':'Cuenta desbloqueada');break;
    case'a-rename':{openSheet(`${sheetHead('Renombrar familia')}<form id="a-renform" data-acc="${b.dataset.acc}" novalidate><label class="field"><span>Nombre</span><input class="inp" id="a-ren" value="${esc(b.dataset.name)}"></label><button class="btn pri" type="submit">Guardar</button></form>`);break}
    case'a-copycreds':{const c=A.creds;copyText(`Diario del bebé\nWeb: ${location.origin}\nUsuario: ${c.username}\nContraseña provisional: ${c.password}\n(La primera vez tendrás que elegir tu propia contraseña.)`,'Datos copiados');break}
    case'a-hidecreds':A.creds=null;render();break;
  }
});
document.addEventListener('toggle',e=>{const t=e.target;if(t.matches&&t.matches('details.acc')){A.open[t.dataset.acc]=t.open}},true);
$('#fab').innerHTML=ic('plus');$('#fab').addEventListener('click',()=>{if(canWrite())pickType()});
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet')closeSheet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(tour)endTour();else if(!$('#report').hidden)closeReport();else if(!$('#sheet').hidden)closeSheet()}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('rect.tooth')){e.preventDefault();openToothForm(e.target.dataset.t)}});
document.addEventListener('submit',async e=>{
  const f=e.target;e.preventDefault();
  if(f.id==='evform')return submitForm(false);
  if(f.id==='babyform')return saveBaby(f);
  if(f.id==='toothform'){const d=fromDateInput(val('t-date'));if(d==null){$('#t-err').textContent='Indica la fecha.';return}
    const code=f.dataset.t,ex=evs().find(x=>x.type==='diente'&&x.tooth===code);if(ex)upd(ex,{start:d+12*H,end:d+12*H});else{if(!guard('hitos'))return;addEv({type:'diente',tooth:code,start:d+12*H,end:d+12*H})}
    closeSheet();toast('Diente guardado');render();return}
  if(f.id==='login'){const u=val('l-user'),p=$('#l-pass').value,err=$('#l-err'),go=$('#l-go');
    if(!u||!p){err.textContent='Escribe tu usuario y tu contraseña.';return}
    err.textContent='';go.disabled=true;go.textContent='Entrando…';
    try{await doLogin(u,p);ui.view='inicio';try{history.replaceState(null,'','#inicio')}catch(x){}render();loop();if(!D.tourSeen&&!me()?.user?.mustChange&&curBaby())setTimeout(startTour,400)}
    catch(x){err.textContent=x instanceof TypeError?'No hay conexión. La primera vez necesitas internet.':x.message;go.disabled=false;go.textContent='Entrar'}
    return}
  if(f.id==='pwform'){const cur=$('#pw-cur').value,nx=$('#pw-new').value,rep=$('#pw-rep'),err=$('#pw-err');
    if(nx.length<8){err.textContent='La nueva contraseña necesita al menos 8 caracteres.';return}
    if(rep&&rep.value!==nx){err.textContent='Las dos contraseñas nuevas no coinciden.';return}
    try{const r=await api('password',{method:'POST',body:{current:cur,next:nx}});D.token=r.token;saveD();if(S.me?.user)S.me.user.mustChange=false;save();toast('Contraseña cambiada');render();
      if(f.dataset.force&&!D.tourSeen&&curBaby())setTimeout(startTour,400)}
    catch(x){err.textContent=x.status?x.message:'Sin conexión. Inténtalo con internet.'}
    return}
  /* administración */
  if(f.id==='adminlogin'){const err=$('#a-err'),go=$('#a-go');go.disabled=true;
    try{const r=await api('admin/login',{method:'POST',body:{username:val('a-user'),password:$('#a-pass').value}});D.adminToken=r.token;saveD();await adminLoad()}
    catch(x){err.textContent=x.message;go.disabled=false}return}
  if(f.id==='a-newfam'){const F=new FormData(f),err=$('#a-nferr');const acc=String(F.get('acc')||'').trim(),name=String(F.get('name')||'').trim(),username=String(F.get('username')||'').trim().toLowerCase(),password=String(F.get('password')||'');
    if(!acc||!name||!username){err.textContent='Rellena la familia, el titular y su usuario.';return}
    try{const r=await api('admin/op',{method:'POST',admin:true,body:{op:'createAccount',name:acc}});
      await api('admin/op',{method:'POST',admin:true,body:{op:'createUser',accountId:r.account.id,username,name,password,role:'owner'}});
      A.creds={name,username,password};A.open[r.account.id]=true;toast('Familia creada');await adminLoad();window.scrollTo(0,0)}
    catch(x){err.textContent=x.message}return}
  if(f.classList.contains('a-user')){const F=new FormData(f);const body={accountId:f.dataset.acc,name:String(F.get('name')||'').trim(),username:String(F.get('username')||'').trim().toLowerCase(),role:F.get('role'),password:String(F.get('password')||'')};
    const r=await aop('createUser',body,'Usuario creado');if(r){A.creds={name:body.name,username:body.username,password:body.password};render();window.scrollTo(0,0)}return}
  if(f.classList.contains('a-pay')){const F=new FormData(f);const from=fromDateInput(F.get('from'))??Date.now(),u=F.get('until')?fromDateInput(F.get('until'))+DAY-1:null;
    await aop('activate',{accountId:f.dataset.acc,module:F.get('module'),from,until:u,amount:+(F.get('amount')||0),kind:F.get('kind'),note:F.get('note')},'Pago registrado');return}
  if(f.id==='a-cfg'){const F=new FormData(f);await aop('setConfig',{bizum:F.get('bizum'),bizumName:F.get('bizumName'),payText:F.get('payText'),prices:{module:+F.get('pm'),all:+F.get('pa')},trialDays:+F.get('td')},'Ajustes guardados');return}
  if(f.id==='a-renform'){await aop('updateAccount',{id:f.dataset.acc,name:val('a-ren')},'Nombre cambiado');closeSheet();return}
  if(f.id==='a-migrate'){const r=await aop('migrateLegacy',{name:val('a-mname')});if(r){toast(`Migrados ${r.events} registros y ${r.notes} notas`);A.open[r.account.id]=true;render()}return}
});
document.addEventListener('focusout',()=>{setTimeout(()=>{if(ui.dirty&&!busyEditing())refresh()},0)});
document.addEventListener('change',e=>{const t=e.target;
  if(t.dataset.actChange==='a-role')return aop('updateUser',{id:t.dataset.id,role:t.value},'Rol cambiado');
  if(t.dataset.actChange==='a-umod')return aop('setUserMod',{id:t.dataset.id,module:t.dataset.mod,value:t.value},'Ajuste guardado');
  if(t.name==='mode'){ui.mode=t.value;render()}
  else if(t.name==='period'){ui.period=+t.value;ui.sel={};render()}
  else if(t.id==='daypick'){const d=fromDateInput(t.value);if(d&&d<=midnight(Date.now())){ui.day=d;render()}}
  else if(t.id==='p-ns'&&t.value){setSetting('nightStart',t.value)}
  else if(t.id==='p-ne'&&t.value){setSetting('nightEnd',t.value)}
  else if(t.name==='theme'){D.theme=t.value;saveD();applyTheme();render()}
  else if(t.id==='imp-file'&&t.files&&t.files[0]){const r=new FileReader();r.onload=()=>parseImport(String(r.result));r.readAsText(t.files[0])}
  else if(t.id==='f-title'){const w=$('#f-other-w');if(w)w.hidden=t.value!=='__otro'}
  else if(t.id==='f-photo'&&t.files&&t.files[0]){pickPhoto(t.files[0])}
});
window.addEventListener('hashchange',route);
setInterval(()=>{tickClocks()},1000);
setInterval(()=>{if(!ADMIN&&D.token&&!tour&&$('#sheet').hidden&&$('#report').hidden&&!busyEditing()&&(ui.view==='inicio'||ui.view==='diario'))render();else renderSync()},30000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&S&&D.token&&!ADMIN){sy.fail=0;sync();loop();if(!tour&&$('#sheet').hidden&&$('#report').hidden&&!busyEditing())render()}});
window.addEventListener('online',()=>{if(S&&D.token){sy.fail=0;sync()}});

/* ---------- Arranque ---------- */
(async()=>{
  S=await load();
  if(!S||S.v!==3)S=blank();
  S.settings=Object.assign(defaultSettings(),S.settings||{});['events','notes','babies','outbox'].forEach(k=>{S[k]=S[k]||[]});if(typeof S.rev!=='number')S.rev=-1;
  try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
  applyTheme();
  if(ADMIN){document.title='Administración · Diario del bebé';render();if(D.adminToken)adminLoad();}
  else{route();if(D.token){sync();loop();if(!D.tourSeen&&curBaby()&&!me()?.user?.mustChange)setTimeout(startTour,600)}}
  if('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('/sw.js').catch(()=>{})}
})();
})();
