// Gioco attivo: momenti in cui serve il giocatore, anche quando lo staff fa già tutto da solo.
// - Ora di punta: entra una folla, la macchina non regge e lo staff rallenta; chi serve a ritmo fa crescere la combo.
// - Piccoli bisogni ai tavoli: un cliente seduto chiede qualcosa (zucchero, una coperta, il wifi...). Toccalo per aiutarlo.

/* ----- ora di punta ----- */
const RUSH_LEN = 60; // secondi di gioco
let rush = null;

function rushPlan() {
  // una o due ore di punta al giorno, dopo i primi clienti
  if (!st.ds || st.ds.rushPlan || st.served < 30) return;
  const n = Math.random() < 0.45 ? 2 : 1;
  st.ds.rushPlan = Array.from({ length: n }, () => +rnd(0.18, 0.85).toFixed(3)).sort((a, b) => a - b);
}
function rushTick(dt) {
  rushPlan();
  if (!rush && st.ds && st.ds.rushPlan && st.ds.rushPlan.length && st.tod >= st.ds.rushPlan[0] && hour() < 25) {
    st.ds.rushPlan.shift();
    startRush();
  }
  if (!rush) return;
  rush.t -= dt;
  if (rush.t <= 0) endRush();
}
function startRush() {
  rush = { t: RUSH_LEN, combo: 0, best: 0, served: 0, extra: 0 };
  spawnT = 0.3;
  toast('Ora di punta! Entra una folla: la macchina non regge, servi tu!');
  sfx('bells');
  doorOpen = 1;
  rushUI();
}
function endRush() {
  const r = rush;
  rush = null;
  rushUI();
  let msg = `Fine dell'ora di punta: ${r.served} clienti serviti da te, combo massima ${r.best}`;
  if (r.extra) msg += ` · +${fmt(r.extra)} monete`;
  if (r.best >= 10) {
    st.hearts++;
    msg += ' · ♥ +1';
  }
  if (r.best >= 20) egg('punta');
  toast(msg);
  sfx(r.best >= 10 ? 'good' : 'tap');
  st.rushBest = Math.max(st.rushBest || 0, r.best);
  save();
}
const rushMult = () => 1 + Math.min(2, rush.combo * 0.1); // fino a x3
// arrivi durante l'ora di punta
function rushArrival(m) {
  return rush ? m * 3 : m;
}
// lo staff rallenta: la macchina è una sola
function rushStaff(r) {
  return rush ? r * 0.35 : r;
}
// chiamata da serve(): se l'hai servito tu (tocco recente), la combo cresce e l'incasso si moltiplica
function rushServe(c, price) {
  if (!rush) return;
  if (c.tapT && T - c.tapT < 2) {
    rush.combo++;
    rush.best = Math.max(rush.best, rush.combo);
    rush.served++;
    const extra = Math.round(price * (rushMult() - 1));
    if (extra > 0) {
      addCoins(extra, c.x, c.y - 32);
      rush.extra += extra;
    }
    if (rush.combo % 5 === 0) sfx('good');
  }
  rushUI();
}
// un cliente se ne va spazientito: la combo si azzera
function rushMiss() {
  if (rush && rush.combo) {
    rush.combo = 0;
    rushUI();
  }
}
let rushLast = '';
function rushUI() {
  const el = $('#rush');
  if (!el) return;
  if (!rush) {
    el.hidden = true;
    rushLast = '';
    return;
  }
  const s = `${Math.ceil(rush.t)}|${rush.combo}`;
  if (s === rushLast) return;
  rushLast = s;
  el.hidden = false;
  el.innerHTML = `<b>Ora di punta</b><span>${Math.ceil(rush.t)}s</span><i class="combo${rush.combo >= 10 ? ' hot' : ''}">combo ${rush.combo} · x${rushMult().toFixed(1).replace('.', ',')}</i>`;
}

/* ----- piccoli bisogni ai tavoli ----- */
const NEEDS = {
  zucchero: {
    ok: c => ['m', 'b'].includes(c.order && c.order.s),
    ask: ['Scusi, avrebbe dello zucchero?', 'Mi manca lo zucchero...'],
    ty: ['Perfetto, grazie!', 'Ora sì che è buono.']
  },
  coperta: {
    ok: c => rainy() || curWx() === 'neve' || nightF() > 0.6,
    ask: ['Brr, che freddo stasera...', 'Avete una copertina? Sono fradicio.'],
    ty: ['Che meraviglia, grazie!', 'Come a casa. Grazie.']
  },
  wifi: {
    ok: c => c.type === 'studente' || c.act === 'laptop',
    ask: ['Qual è la password del wifi?', 'Il wifi non mi va...'],
    ty: ['Connesso! Grazie mille.', 'Salvata la tesi. Mi hai salvato.']
  },
  acqua: {
    ok: c => true,
    ask: ["Mi porterebbe un bicchiere d'acqua?", "Un po' d'acqua, per favore?"],
    ty: ['Grazie, gentilissimo.', 'Ci voleva.']
  },
  presa: {
    ok: c => ['phone', 'laptop', 'camera'].includes(c.act),
    ask: ["C'è una presa? Ho il telefono scarico.", "Batteria all'uno per cento..."],
    ty: ['Salvo! Grazie.', 'Tornato in vita. Il telefono, dico.']
  },
  giornale: {
    ok: c => c.type === 'nonno' || c.type === 'lettore',
    ask: ['Avete il giornale di oggi?', 'Niente da leggere?'],
    ty: ['Ah, ecco. Grazie.', 'Vediamo cosa combinano...']
  },
  ciotola: {
    ok: c => c.pet && c.pet.k !== 'uccellino',
    ask: ["Avreste dell'acqua per il mio cane?", 'Lui ha sete, povero.'],
    ty: ['Guarda come beve! Grazie.', 'Ti adora già.']
  },
  tovagliolo: {
    ok: c => ['k', 'v'].includes(c.order && c.order.s),
    ask: ['Mi servirebbe un tovagliolo...', 'Ops, ho fatto un disastro.'],
    ty: ['Grazie, salvato!', 'Nessuno ha visto niente.']
  }
};
let needT = 4;
function needsTick(dt) {
  for (const c of people) if (c.need && c.state !== 'sit') c.need = null; // chi si alza non chiede più niente
  const seated = people.filter(c => c.state === 'sit' && !c.dead);
  for (const c of seated) {
    if (!c.need) continue;
    c.need.t -= dt;
    if (c.need.t <= 0) {
      c.mood -= 15;
      if (!c.bub && !c.scene) say(c, pick(['Lascia stare, faccio da solo.', 'Niente... pazienza.', 'Nessuno mi vede, qui.']), 2.4);
      emo(c, 'sweat', 2);
      c.need = null;
    }
  }
  needT -= dt;
  if (needT > 0) return;
  needT = rnd(6, 12);
  if (seated.filter(c => c.need).length >= 3) return;
  const cand = seated.filter(c => !c.need && !c.scene && !c.group && !c.story && !c.rare && !c.needDone && c.sitT > 12);
  if (!cand.length) return;
  const c = pick(cand),
    ks = Object.keys(NEEDS).filter(k => NEEDS[k].ok(c));
  if (!ks.length) return;
  const k = pick(ks);
  c.need = { k, t: 25 };
  if (!c.bub && Math.random() < 0.6) say(c, pick(NEEDS[k].ask), 2.6, c.reg ? c.name : '');
}
// tocco vicino a un cliente con un bisogno: lo aiuti
function tapNeed(x, y) {
  const c = people.find(p => p.need && p.state === 'sit' && Math.abs(x - p.x) < 9 && y > p.y - 34 && y < p.y + 3);
  if (!c) return false;
  const k = c.need.k;
  c.need = null;
  c.needDone = 1;
  c.mood = Math.min(100, c.mood + 18);
  c.tipx = (c.tipx || 1) * 1.35;
  say(c, pick(NEEDS[k].ty), 2.4, c.reg ? c.name : '');
  emo(c, 'heart', 1.6);
  for (let i = 0; i < 4; i++)
    parts.push({ x: c.x + rnd(-3, 3), y: c.y - 22, vx: rnd(-4, 4), vy: rnd(-10, -5), t: 1.2, max: 1.2, k: 'heart' });
  if (k === 'ciotola' && c.pet) {
    c.pet.heart = 2.5;
    c.pet.mode = 'wag';
  }
  if (c.reg && Math.random() < 0.5) c.reg.f = Math.min(10, c.reg.f + 1);
  st.needs = (st.needs || 0) + 1;
  if (st.ds) st.ds.needs = (st.ds.needs || 0) + 1;
  qProgress('needs');
  if (st.needs >= 50) egg('premura');
  sfx('good');
  return true;
}

function activeTick(dt) {
  rushTick(dt);
  needsTick(dt);
  rushUI();
}
