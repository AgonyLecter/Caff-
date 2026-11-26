// Salvataggio, stato della partita e formule (atmosfera, incassi, prezzi).

const arcDone = id => {
  const a = ARCS.find(x => x.id === id);
  return !!a && (st.story[id] || 0) >= a.ch.length;
};
const arcReq = arc =>
  !arc.req ||
  [].concat(arc.req).every(r => r.split('|').some(x => (x.includes('=') ? arcDone(x.split('=')[0]) && checkFlag(x) : arcDone(x))));
const arcEnd = arc => {
  if (arc.end) {
    const e = Object.entries(arc.end).find(([f]) => checkFlag(f));
    if (e) return e[1];
  }
  return { perk: arc.perk, pt: arc.pt };
};
const KEY = 'cafe_pioggia_v2',
  KEY1 = 'cafe_pioggia_v1';
const DEF = {
  v: 2,
  name: '',
  found: {},
  chalk: '',
  station: 0,
  heard: 1,
  flower: 0,
  rainbow: 0,
  bigMoon: 0,
  midDay: 0,
  rareDay: 0,
  coins: 0,
  hearts: 0,
  space: 1,
  tables: 1,
  chairs: 0,
  decor: 0,
  music: 0,
  neon: 0,
  wifi: 0,
  cat: 0,
  barista: 0,
  waiter: 0,
  cook: 0,
  manager: 0,
  machine: 0,
  menu: 1,
  theme: 'neon',
  themes: ['neon'],
  district: 'centro',
  frStars: 0,
  runEarned: 0,
  story: {},
  rt: {},
  flags: {},
  fdone: [],
  perks: {},
  regs: [],
  rel: {},
  reviews: [],
  log: [],
  day: 1,
  tod: 0,
  wx: 'pioggia',
  wx2: null,
  ev: null,
  evT: 0,
  evDone: 0,
  nwx: null,
  nev: null,
  ds: null,
  quests: [],
  perfect: 0,
  grinder: 0,
  stove: 0,
  umbr: 0,
  vetrina: 0,
  lav: 0,
  served: 0,
  earned: 0,
  cleaned: 0,
  tapServe: 0,
  specials: 0,
  last: 0,
  ips: 0,
  sound: 1,
  musicOn: 1,
  autoBuy: 1,
  newStory: 0
};
let st = JSON.parse(JSON.stringify(DEF));
function load() {
  // «Ricomincia» ricarica con ?nuova=1: si riparte da zero anche se il browser non ha ancora scritto su disco la cancellazione
  try {
    if (new URLSearchParams(location.search).has('nuova')) {
      [KEY, KEY1, KEY + '_bak'].forEach(k => localStorage.removeItem(k));
      history.replaceState(null, '', location.pathname);
      return;
    }
  } catch (e) {}
  for (const k of [KEY, KEY + '_bak']) {
    try {
      const s = JSON.parse(localStorage.getItem(k));
      if (s && typeof s === 'object' && s.name) {
        st = Object.assign(JSON.parse(JSON.stringify(DEF)), s);
        return;
      }
    } catch (e) {}
  }
  try {
    const o = JSON.parse(localStorage.getItem(KEY1));
    if (o && o.name) {
      ['name', 'coins', 'hearts', 'chairs', 'neon', 'barista', 'waiter', 'machine', 'cat'].forEach(k => {
        if (o[k] != null) st[k] = o[k];
      });
      st.space = clamp(o.space || 1, 1, 4);
      st.tables = clamp(o.tables || 1, 1, st.space * 2);
      st.decor = Math.min(o.decor || 0, 6);
      st.music = Math.min(o.music || 0, 4);
      st.menu = clamp(o.menu || 1, 1, 7);
      st.story = o.story || {};
      st.migrated = 1;
    }
  } catch (e) {}
}
let bakT = 0,
  resetting = false; // dopo «Ricomincia» non si salva più nulla, anche se qualcosa prova a farlo prima del ricaricamento
function save() {
  if (!st.name || resetting) return;
  try {
    st.last = Date.now();
    st.ips = ips();
    const j = JSON.stringify(st);
    localStorage.setItem(KEY, j);
    if (Date.now() - bakT > 120000) {
      bakT = Date.now();
      localStorage.setItem(KEY + '_bak', j);
    }
  } catch (e) {}
}
load();
const TH = () => THEMES[st.theme] || THEMES.neon;
const hour = () => 7 + st.tod * 19;
function nightF() {
  const h = hour();
  if (h < 8) return lerp(0.55, 0, h - 7);
  if (h < 18) return 0;
  if (h < 21) return (h - 18) / 3;
  return 1;
}
const curWx = () => (st.wx2 && st.tod >= 0.5 ? st.wx2 : st.wx);
const rainy = () => {
  const w = curWx();
  return w === 'pioggia' || w === 'temporale';
};
const blackout = () => st.ev === 'blackout' && hour() >= 19.5;
let musicianOn = false,
  hypeT = 0,
  paused = false;
function perkAtm() {
  let a = 0;
  if (st.perks.libro) a += 5;
  if (st.perks.scacchi) a += 3;
  if (st.perks.giovedi) a += 4;
  if (st.perks.valigie) a += 2;
  if (st.perks.veterinaria) a += 6;
  if (st.perks.band) a += 5;
  if (st.perks.cartoline) a += 4;
  if (st.perks.calendario) a += 3;
  if (st.perks.torneo) a += 3;
  if (st.perks.targa) a += 7;
  if (st.perks.cuore) a += 4;
  if (st.perks.festa) a += 6;
  if (st.perks.nozze) a += 5;
  if (st.perks.lezioni) a += 3;
  if (st.perks.club) a += 3;
  if (st.perks.postino) a += 4;
  if (st.perks.seguito) a += 4;
  if (st.perks.davide && !checkFlag('davide=crisi')) a += 3;
  if (st.perks.yusuf) a += 4;
  return a;
}
function atm() {
  return (
    st.chairs * 4 +
    st.decor * 4 +
    st.music * 5 +
    st.cat * 8 +
    Math.min(st.tables, 14) +
    (st.space - 1) * 2 +
    Math.min(15, st.hearts) +
    (st.themes.length - 1) * 2 +
    st.wifi * 2 +
    st.stove * 6 +
    st.umbr * 2 +
    st.lav * 3 +
    st.vetrina * 2 +
    perkAtm() +
    (blackout() ? 10 : 0) +
    (musicianOn ? 5 : 0)
  );
}
function rating() {
  const r = st.reviews;
  if (!r.length) return 3.5;
  let s = 0,
    w = 0;
  for (const x of r) {
    s += x.s * (x.w || 1);
    w += x.w || 1;
  }
  return clamp(s / w + (st.perks.giovedi ? 0.15 : 0), 1, 5);
}
const mult = () => (1 + 0.04 * st.hearts) * (1 + 0.5 * st.frStars);
const tapPow = () => (0.34 + 0.12 * st.machine) * (1 + 0.25 * st.grinder) * (boostT > 0 ? 2 : 1);
const baristaLv = () => st.barista + (st.perks.bianca ? 1 : 0);
const baristaRate = () => {
  const l = baristaLv();
  return l ? 0.3 * l * (1 + 0.06 * st.machine) : 0;
};
const cookRate = () => (st.cook ? 0.4 * st.cook * (st.perks.cucina ? 1.3 : 1) : 0);
function arrival() {
  let m =
    (1 + 0.18 * st.neon + 0.1 * st.music + 0.03 * Math.min(30, st.hearts) + 0.02 * st.decor + 0.25 * st.frStars) * (0.7 + 0.12 * rating());
  const e = st.ev,
    h = hour();
  if (e === 'festival') m *= 1.6;
  if (e === 'turisti') m *= 1.3;
  if (e === 'innamorati') m *= 1.2;
  if (e === 'openmic' && h >= 20.5) m *= 1.4;
  if (hypeT > 0) m *= 1.5;
  m *= { sereno: 1.05, nuvoloso: 1, pioggia: 1.1, temporale: 0.8, nebbia: 0.9, neve: 0.95 }[curWx()] || 1;
  m *= h < 8.5 ? 0.75 : h > 24.5 ? 0.6 : 1;
  if (st.perks.kenjiShop && h >= 19) m *= 1.25;
  return 7 / m;
}
const availMenu = () => MENU.slice(0, st.menu).filter(it => it.s !== 'k' || st.cook > 0);
const dailyItem = () => {
  const m = availMenu();
  return st.lav && m.length > 1 ? m[(st.day * 7 + 3) % m.length] : null;
};
const priceOf = it => {
  const d = dailyItem();
  return Math.round(
    it.p *
      mult() *
      (it.id === 'ramen' && st.perks.ramen ? 1.5 : 1) *
      (it.s === 'v' ? 1 + 0.15 * st.vetrina : 1) *
      (d && d.id === it.id ? 1.6 : 1) *
      (st.perks.alleanza ? 1.1 : 1)
  );
};
function ips() {
  const cut = T - 40;
  while (earnLog.length && earnLog[0][0] < cut) earnLog.shift();
  const s = earnLog.reduce((a, e) => a + e[1], 0);
  return started && T > 15 ? s / Math.min(40, T) : st.ips || 0;
}
