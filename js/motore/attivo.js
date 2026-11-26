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
  if (machTilt) return 0; // macchina in tilt: lo staff è fermo
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
  introTick(dt);
  if (intro) return; // finché parla Nonna Rosa non succede altro
  incidentTick(dt);
  rushTick(dt);
  needsTick(dt);
  rushUI();
}

/* ----- imprevisti ----- */
// Tazza rotta, pozzanghera all'ingresso, macchina in tilt, ombrello dimenticato.
// Ognuno ha un punto esclamativo che lampeggia: toccalo per sistemare. Se li ignori, i clienti ne risentono.
let incid = [],
  incT = 40,
  machTilt = 0;
function incidentTick(dt) {
  // conseguenze degli imprevisti ancora aperti
  for (const I of incid) {
    I.t -= dt;
    if (I.k === 'cocci' || I.k === 'pozza')
      for (const c of people)
        if (!c.dead && !c.hurt && c.moving && Math.abs(c.x - I.x) < 9 && Math.abs(c.y - I.y) < 7) {
          c.hurt = 1;
          c.mood -= I.k === 'cocci' ? 10 : 6;
          emo(c, 'sweat', 1.6);
          if (!c.bub && Math.random() < 0.6)
            say(
              c,
              pick(
                I.k === 'cocci'
                  ? ['Ahi! Cocci per terra!', 'Attenzione, vetri!', 'Qualcuno ha rotto una tazza...']
                  : ['Whoa! Si scivola!', 'Quasi cado...', 'Che pozzanghera!']
              ),
              2
            );
        }
  }
  incid = incid.filter(I => I.t > 0);
  if (machTilt) {
    if (Math.random() < dt * 2) parts.push({ x: W - 20 + rnd(-6, 6), y: 82, vx: rnd(-8, 8), vy: rnd(-14, -6), t: 1, max: 1, k: 'steam' });
  }
  incT -= dt;
  if (incT > 0 || incid.length >= 2 || rush || st.served < 40) return;
  incT = rnd(45, 90);
  const r = Math.random();
  if (r < 0.3 && (rainy() || curWx() === 'neve') && !incid.some(I => I.k === 'pozza')) newIncident('pozza', rnd(34, 60), LANE + rnd(-2, 4));
  else if (r < 0.5 && !machTilt && baristaLv() > 0 && st.ds && !st.ds.tilt) {
    machTilt = 5; // servono cinque colpetti
    st.ds.tilt = 1;
    sfx('hiss');
    toast('La macchina fa i capricci! I baristi sono fermi: dalle qualche colpetto');
  }
}
function newIncident(k, x, y, o) {
  incid.push(Object.assign({ k, x, y, t: k === 'ombrello' ? 70 : 60, id: ++uid }, o || {}));
}
// chiamata quando un cliente si alza: a volte rompe la tazza, a volte dimentica l'ombrello
function incidentOnLeave(c, seat) {
  if (!seat || st.served < 40 || incid.length >= 2) return;
  const r = Math.random();
  if (r < 0.03) newIncident('cocci', seat.x + seat.side * 3, seat.y + 4);
  else if (r < 0.07 && (rainy() || c.umb))
    newIncident('ombrello', seat.x + seat.side * 7, seat.y, {
      col: (c.look && c.look.uc) || '#e63946',
      owner: c.reg ? c.reg.id : null,
      name: c.name
    });
}
function drawIncidents() {
  for (const I of incid) {
    const x = Math.round(I.x),
      y = Math.round(I.y);
    if (I.k === 'cocci') {
      g.fillStyle = '#fffaf2';
      [
        [-3, 0],
        [-1, -1],
        [1, 0],
        [3, -1],
        [0, 1],
        [2, 1]
      ].forEach(([dx, dy]) => g.fillRect(x + dx, y + dy, 1, 1));
      g.fillStyle = '#7a4a2a';
      g.fillRect(x - 2, y + 1, 2, 1);
    } else if (I.k === 'pozza') {
      g.fillStyle = 'rgba(140,180,255,.55)';
      g.fillRect(x - 8, y, 17, 3);
      g.fillRect(x - 5, y - 1, 11, 1);
      g.fillRect(x - 5, y + 3, 11, 1);
      g.fillStyle = 'rgba(230,240,255,.7)';
      g.fillRect(x - 3 + Math.floor((T * 2) % 6), y, 2, 1);
    } else if (I.k === 'ombrello') {
      g.fillStyle = '#333';
      g.fillRect(x, y - 9, 1, 9);
      g.fillStyle = I.col;
      g.fillRect(x - 1, y - 9, 3, 7);
      g.fillRect(x - 2, y - 8, 5, 4);
      g.fillStyle = '#333';
      g.fillRect(x + 1, y - 1, 2, 1);
    }
    drawEmote(x - 2, y - (I.k === 'ombrello' ? 22 : 14) - Math.round(Math.abs(Math.sin(T * 5)) * 2), 'excl');
  }
  if (machTilt) drawEmote(W - 22, 66 - Math.round(Math.abs(Math.sin(T * 6)) * 2), 'excl');
}
function tapIncident(x, y) {
  if (machTilt && x > W - 30 && x < W - 8 && y > 70 && y < 100) {
    machTilt--;
    sfx('knock');
    for (let i = 0; i < 3; i++)
      parts.push({ x: W - 20 + rnd(-4, 4), y: 88, vx: rnd(-6, 6), vy: rnd(-10, -4), t: 0.6, max: 0.6, k: 'spark' });
    if (!machTilt)
      incidentDone(W - 20, 84, pick(['Riparata! Si riparte.', 'Un colpetto al punto giusto. Come faceva il vecchio barista.']));
    return true;
  }
  const I = incid.find(I => Math.abs(x - I.x) < 9 && y > I.y - 18 && y < I.y + 5);
  if (!I) return false;
  incid = incid.filter(o => o !== I);
  if (I.k === 'ombrello') {
    st.lost = (st.lost || []).filter(l => l.owner !== I.owner || !I.owner).concat({ owner: I.owner, name: I.name, col: I.col, d: st.day });
    if (st.lost.length > 12) st.lost.shift();
    incidentDone(I.x, I.y - 10, `Ombrello di ${I.name} messo da parte${I.owner ? ': quando torna glielo ridai' : ''}`);
  } else incidentDone(I.x, I.y, I.k === 'cocci' ? 'Cocci raccolti' : 'Pavimento asciutto');
  return true;
}
function incidentDone(x, y, msg) {
  for (let i = 0; i < 6; i++)
    parts.push({ x: x + rnd(-5, 5), y: y + rnd(-4, 2), vx: rnd(-8, 8), vy: rnd(-14, -4), t: 0.8, max: 0.8, k: 'spark' });
  addCoins(reward(15), x, y - 10);
  st.incid = (st.incid || 0) + 1;
  if (st.incid >= 20) egg('tuttofare');
  sfx('good');
  toast(msg);
}
// un habitué che torna e ritrova il suo ombrello
function incidentOnArrive(c) {
  if (!c.reg || !st.lost) return;
  const L = st.lost.find(l => l.owner === c.reg.id);
  if (!L) return;
  st.lost = st.lost.filter(l => l !== L);
  c.reg.f = Math.min(10, c.reg.f + 1);
  setTimeout(() => {
    if (!c.dead) {
      say(
        c,
        pick([
          'Il mio ombrello! Lo avevo dato per perso. Grazie!',
          'Me lo avete tenuto? Siete un tesoro.',
          'Il mio ombrello preferito! Grazie mille.'
        ]),
        3,
        c.name
      );
      emo(c, 'heart', 2);
    }
  }, 2500);
}
