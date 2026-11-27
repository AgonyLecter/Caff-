// Il calendario: stagioni, feste, compleanni e anniversari (i contenuti sono in js/dati/calendario.js).
// Un anno dura 40 giorni: primavera, estate, autunno, inverno, 10 giorni ciascuna.
// La partita comincia il primo giorno d'autunno, così il primo anno finisce presto (dopo l'inverno) con il riepilogo.

const ANNO = 40,
  STAG = 10,
  CAL0 = 20; // il giorno 1 della partita è il giorno 21 dell'anno: il primo d'autunno
function cal(d) {
  const k = (d || st.day) - 1 + CAL0,
    i = k % ANNO;
  return { anno: Math.floor(k / ANNO) + 1, i, s: Math.floor(i / STAG), g: (i % STAG) + 1 };
}
const stagione = d => STAGIONI[cal(d).s];
function dataN(d) {
  const c = cal(d);
  return `${c.g} ${STAGIONI[c.s].de}`;
}
function festa(d) {
  const c = cal(d);
  return FESTE.find(f => f.s === c.s && f.g === c.g) || null;
}
const festaOggi = () => (st && st.day ? festa(st.day) : null);
const calAtm = () => {
  const F = festaOggi();
  return F && F.atm ? F.atm : 0;
};
// nome e descrizione di cosa succede in un giorno: la festa, se c'è, se no l'evento estratto
function giornoEv(d, ev) {
  const F = festa(d);
  if (F) return { n: F.n, d: F.d };
  return ev && EVENTS[ev] ? EVENTS[ev] : null;
}

/* ----- compleanni ----- */
function hashN(t) {
  let h = 7;
  for (const ch of String(t)) h = (h * 31 + ch.charCodeAt(0)) % 100003;
  return h;
}
// il giorno del compleanno (0..39): fisso per i personaggi chiave, «a caso ma sempre uguale» per gli altri
function complI(r) {
  if (r.key && COMPLEANNI[r.key]) return COMPLEANNI[r.key][0] * STAG + COMPLEANNI[r.key][1] - 1;
  return hashN(r.id) % ANNO;
}
const complOggi = r => complI(r) === cal().i;
const complDi = d => st.regs.filter(r => complI(r) === cal(d).i);

/* ----- anniversari ----- */
const COPPIE = ['coppia', 'fidanzati', 'sposati'];
// un anno (40 giorni) da quando si sono conosciuti qui
const annOggi = r => r && COPPIE.includes(r.k) && r.d && st.day > r.d && (st.day - r.d) % ANNO === 0 && r.annY !== cal().anno;

/* ----- inizio giornata ----- */
function calStartDay() {
  const c = cal();
  // il tempo segue la stagione, e certe feste lo decidono loro
  const F = festaOggi();
  if (F && F.wx) {
    st.wx = F.wx;
    st.wx2 = null;
  }
  if (F && F.ev) st.ev = F.ev;
  const F2 = festa(st.day + 1);
  if (F2 && F2.wx) st.nwx = F2.wx;
  if (F2 && F2.ev) st.nev = F2.ev;
  else if (F2) st.nev = null;
  // la fotografia di inizio anno, per il riepilogo dell'ultima sera
  // (un salvataggio che non l'aveva ancora conta da quando il locale ha aperto)
  if (!st.yr) st.yr = { anno: c.anno, served: 0, hearts: 0, cap: 0, vite: 0, coppie: 0, regs: [] };
  else if (st.yr.anno !== c.anno) st.yr = calFoto(c.anno);
  if (c.g === 1 && st.day > 1)
    setTimeout(
      () =>
        toast(
          c.s === 0
            ? `Buon anno! Comincia la primavera dell’anno ${c.anno}`
            : `È arrivat${c.s === 1 ? 'a l’' : 'o l’'}${STAGIONI[c.s].n.toLowerCase()}`
        ),
      7400
    );
}
function calFoto(anno) {
  return {
    anno,
    served: st.served,
    hearts: st.hearts,
    cap: Object.values(st.story).reduce((a, b) => a + b, 0),
    vite: (st.fU || []).length + (st.f2U || []).length,
    coppie: Object.values(st.rel).filter(r => COPPIE.includes(r.k)).length,
    regs: st.regs.map(r => r.id)
  };
}

/* ----- durante la giornata ----- */
let calT = 0;
function calTick(dt) {
  calT -= dt;
  if (calT > 0) return;
  calT = 2;
  if (tut || intro || rush || regia.live) return;
  // il festeggiato passa a trovarti, nel suo giorno
  if (st.tod < 0.12 || st.tod > 0.85 || queue.length >= 4 || !freeSeats().length) return;
  const anno = cal().anno;
  const r = st.regs.find(r => r.key && complOggi(r) && r.bdY !== anno && r.bdS !== st.day && !present(r) && regWeight(r) > 0);
  if (r) {
    r.bdS = st.day;
    newCust({ look: r.look, name: r.n, reg: r, type: r.type });
  }
}
// una frase di festa, ogni tanto, da chi è seduto
function calLine(c) {
  const F = festaOggi();
  if (!F || !F.l || bubCount() >= 3 || Math.random() > 0.2) return null;
  return pick(F.l).replace('{item}', (c.order || MENU[0]).n);
}
// più clienti di un certo tipo, nei giorni di festa
const calTipo = k => {
  const F = festaOggi();
  return F && F.tipi && F.tipi[k] ? F.tipi[k] : 1;
};
// chiamata quando un habitué si siede: compleanni e pensierini della notte delle luci. true se ha avviato qualcosa
function calOnSit(c) {
  const r = c.reg;
  if (!r || c.story) return false;
  const anno = cal().anno;
  if (complOggi(r) && r.bdY !== anno) {
    r.bdY = anno;
    if (r.key) return (compleanno(c), true);
    // gli habitué senza storia festeggiano in piccolo
    say(c, pick(COMPL_R).replace('{item}', (c.order || MENU[0]).n), 3, c.name);
    emo(c, 'heart', 2);
    const o = people.find(p => p !== c && p.state === 'sit' && !p.dead && !p.bub && Math.abs(p.x - c.x) < 60);
    if (o) timers.push({ t: 2.6, fn: () => !o.dead && say(o, pick(['Auguri!', 'Tanti auguri!', 'Buon compleanno!']), 2) });
    r.f = Math.min(10, r.f + 1);
    toast(`Oggi è il compleanno di ${r.n}`);
    logB(`Compleanno di ${r.n}`);
    return false;
  }
  const F = festaOggi();
  if (F && F.regali && r.luci !== anno) {
    r.luci = anno;
    timers.push({
      t: 1.5,
      fn: () => {
        if (c.dead || c.state !== 'sit') return;
        say(
          c,
          pick([
            'Ti ho portato un pensierino. Non aprirlo adesso!',
            'Per te. Biscotti fatti da me. Più o meno.',
            'Buona notte delle luci! Questo è per il locale.'
          ]),
          3,
          c.name
        );
        addCoins(reward(12), c.x, c.y - 26);
        if (!st.ds.luci) {
          st.ds.luci = 1;
          st.hearts++;
          floats.push({ x: c.x, y: c.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
        }
      }
    });
  }
  return false;
}
// il compleanno di un personaggio chiave: un momento vero, con una scelta
function compleanno(c) {
  const r = c.reg,
    k = 'bd_' + r.id;
  const lines = [
    [0, pick(COMPL_A)],
    [0, COMPL_L[r.key] || 'Non mi aspettavo niente. E invece eccomi qui.'],
    {
      c: {
        q: `Oggi è il compleanno di ${c.name}. Cosa fai?`,
        o: [
          {
            t: 'Porta una fetta di torta con la candelina',
            f: k + '=torta',
            r: [[0, 'Una candelina... *la guarda a lungo*  Esprimo un desiderio. Non te lo dico, se no non vale.']]
          },
          {
            t: 'Fai cantare «Tanti auguri» a tutto il locale',
            f: k + '=coro',
            r: [
              [0, 'Ma no, che vergogna! ...*ride, rosso fino alle orecchie*'],
              [0, 'Nessuno mi cantava gli auguri così da anni.']
            ]
          }
        ]
      }
    },
    [0, 'Grazie. Davvero. È un bel compleanno.']
  ];
  startScene([c], fillT(lines, c, null), {
    story: 'compleanno',
    mood: 'love',
    onEnd: () => {
      const coro = st.flags[k] === 'coro';
      delete st.flags[k];
      if (coro)
        people
          .filter(p => p !== c && p.state === 'sit' && !p.dead && !p.bub)
          .slice(0, 4)
          .forEach((p, i) =>
            timers.push({ t: 0.3 + i * 0.5, fn: () => !p.dead && say(p, pick(['Tanti auguri a te!', 'Auguri!', '♪ Tanti auguri ♪']), 2.2) })
          );
      st.hearts++;
      r.f = Math.min(10, r.f + 1);
      floats.push({ x: c.x, y: c.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
      for (let i = 0; i < 6; i++)
        parts.push({ x: c.x + rnd(-4, 4), y: c.y - 22, vx: rnd(-6, 6), vy: rnd(-12, -5), t: 1.4, max: 1.4, k: 'heart' });
      addCoins(reward(40), c.x, c.y - 26);
      toast(`Compleanno di ${c.name}: ${coro ? 'tutto il locale ha cantato gli auguri' : 'una candelina e un desiderio'}`);
      logB(`Compleanno di ${c.name}: ${coro ? 'gli auguri cantati da tutto il locale' : 'una fetta di torta con la candelina'}`);
      sfx('story');
      save();
    }
  });
}
// l'anniversario di una coppia: chiamata da relScene. true se è partita la scena
function calAnniv(a, b, R) {
  if (!annOggi(R)) return false;
  R.annY = cal().anno;
  startScene([a, b], fillT(pick(ANNIV), a, b), {
    story: 'anniversario',
    mood: 'love',
    onEnd: () => {
      st.hearts++;
      floats.push({ x: a.x, y: a.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
      toast(`Anniversario: ${a.name} e ${b.name} si sono conosciuti qui un anno fa`);
      logB(`Anniversario di ${a.name} e ${b.name}: un anno dal primo incontro`);
      sfx('story');
      advanceRel(a.reg, b.reg);
      save();
    }
  });
  return true;
}
// nel loro giorno, le coppie vengono insieme (chiamata da ritual)
function calRitoAnniv() {
  for (const [k, R] of Object.entries(st.rel)) {
    if (!annOggi(R) || R.annS === st.day) continue;
    const [a, b] = k.split('|').map(id => st.regs.find(r => r.id === id));
    if (!a || !b || present(a) || present(b) || !regWeight(a) || !regWeight(b)) continue;
    if (spawnGroup({ look: a.look, name: a.n, reg: a, type: a.type }, { look: b.look, name: b.n, reg: b, type: b.type }, { rel: 1 })) {
      R.annS = st.day;
      return true;
    }
  }
  return false;
}

/* ----- l'ultima sera dell'anno ----- */
// chiamata da endDay: true se mostra il riepilogo (poi endDay riparte da sola)
function calFineAnno() {
  const F = festaOggi(),
    c = cal();
  if (!F || F.id !== 'fineanno' || st.yrShown === c.anno) return false;
  const y = st.yr || calFoto(c.anno);
  const nuovi = st.regs.filter(r => !y.regs.includes(r.id));
  const cap = Object.values(st.story).reduce((a, b) => a + b, 0) - y.cap,
    vite = (st.fU || []).length + (st.f2U || []).length - y.vite,
    coppie = Math.max(0, Object.values(st.rel).filter(r => COPPIE.includes(r.k)).length - y.coppie);
  const nomi = nuovi.slice(-8).map(r => r.n);
  const chi = nomi.length
    ? `<p>Chi è entrato nella tua vita quest’anno: <b>${esc(nomi.join(', '))}</b>${nuovi.length > nomi.length ? ` e altri ${nuovi.length - nomi.length}` : ''}.</p>`
    : '';
  paused = true;
  showModal(
    `<h2>L’anno del caffè${c.anno > 1 ? ' · ' + c.anno : ''}</h2><p class="note">Domani è primavera. Prima di voltare pagina, guarda cosa è successo qui dentro.</p>` +
      `<div class="sum"><div><b>${fmt(st.served - y.served)}</b><span>clienti serviti</span></div><div><b>${cap}</b><span>capitoli di storie</span></div><div><b>${vite}</b><span>vite raccontate</span></div><div><b>${nuovi.length}</b><span>nuovi habitué</span></div><div><b>${coppie}</b><span>coppie nate</span></div><div><b>${st.hearts - y.hearts}</b><span>cuori</span></div></div>` +
      chi +
      `<p><i>«Le monete le hai contate tutti i giorni. Ma guarda quante persone. È questo il conto che conta.»</i> <small>— Nonna Rosa</small></p>`,
    [
      {
        t: 'Buon anno!',
        big: 1,
        fn: () => {
          st.yrShown = c.anno;
          hideModal();
          save();
        }
      }
    ]
  );
  sfx('bells');
  return true;
}

/* ----- il pannello Giorno ----- */
function calHTML() {
  const c = cal(),
    S = STAGIONI[c.s];
  let strip = '';
  for (let g = 1; g <= STAG; g++) {
    const d = st.day + (g - c.g),
      F = festa(d),
      co = complDi(d).length;
    strip += `<i class="${g === c.g ? 'oggi' : ''}${F ? ' fe' : ''}${co ? ' co' : ''}${g < c.g ? ' pas' : ''}" title="${esc(F ? F.n : '')}">${F ? '★' : g}</i>`;
  }
  const prossimi = [];
  for (let k = 1; k <= 7 && prossimi.length < 5; k++) {
    const d = st.day + k,
      quando = k === 1 ? 'Domani' : `Fra ${k} giorni`,
      F = festa(d);
    if (F) prossimi.push(`<li><b>${quando}</b> · ${esc(F.n)}</li>`);
    complDi(d)
      .filter(r => r.key || r.f >= 3)
      .slice(0, 2)
      .forEach(r => prossimi.push(`<li><b>${quando}</b> · Compleanno di ${esc(r.n)}</li>`));
    Object.entries(st.rel).forEach(([key, R]) => {
      if (!COPPIE.includes(R.k) || !R.d || d <= R.d || (d - R.d) % ANNO) return;
      const [a, b] = key.split('|').map(id => st.regs.find(r => r.id === id));
      if (a && b) prossimi.push(`<li><b>${quando}</b> · Anniversario di ${esc(a.n)} e ${esc(b.n)}</li>`);
    });
  }
  const F = festaOggi(),
    oggi = st.regs.filter(r => complOggi(r) && (r.key || r.f >= 3));
  return (
    `<div class="card2 cal"><h3>${esc(dataN())}<small>${S.n} · anno ${c.anno}</small></h3><div class="calstrip">${strip}</div>` +
    (F ? `<p class="ad"><b>Oggi: ${esc(F.n)}</b> · ${esc(F.d)}</p>` : '') +
    (oggi.length ? `<p class="ad">Oggi compie gli anni: <b>${esc(oggi.map(r => r.n).join(', '))}</b></p>` : '') +
    (prossimi.length
      ? `<ul class="calnext">${prossimi.join('')}</ul>`
      : '<p class="ad">Nei prossimi giorni, niente feste: giornate tranquille.</p>') +
    `</div>`
  );
}

/* ----- le stagioni fuori dalla finestra: foglie, petali, lucciole ----- */
let sparts = [];
function calParts(dt) {
  const S = stagione(),
    w = curWx(),
    hh = WY1 - WY0,
    n = nightF();
  const kind =
    S.id === 'autunno' && w !== 'neve'
      ? 'foglia'
      : S.id === 'primavera' && w !== 'temporale'
        ? 'petalo'
        : S.id === 'estate' && n > 0.45
          ? 'lucciola'
          : '';
  const want = kind ? Math.round(W * (kind === 'lucciola' ? 0.05 : 0.1)) : 0;
  sparts = sparts.filter(p => p.k === kind);
  while (sparts.length < want)
    sparts.push({
      k: kind,
      x: rnd(0, W),
      y: kind === 'lucciola' ? rnd(hh * 0.45, hh - 2) : rnd(-hh, hh),
      v: rnd(5, 11),
      ph: rnd(0, 6),
      c: kind === 'foglia' ? pick(['#e07a3a', '#c94f2a', '#e8b04a', '#a8562a']) : pick(['#ffc4dc', '#fff0f5', '#ff9ec4'])
    });
  if (sparts.length > want) sparts.length = want;
  for (const p of sparts) {
    if (p.k === 'lucciola') {
      p.x += Math.sin(T * 0.7 + p.ph) * 3 * dt;
      p.y += Math.cos(T * 0.9 + p.ph) * 2 * dt;
      continue;
    }
    p.y += p.v * dt;
    p.x += (Math.sin(T * 1.3 + p.ph) * 6 - 3) * dt;
    if (p.y > hh) {
      p.y = -2;
      p.x = rnd(0, W + 10);
    }
  }
}
function calDraw() {
  for (const p of sparts) {
    const x = Math.round(p.x),
      y = WY0 + Math.round(p.y);
    if (p.k === 'lucciola') {
      const a = 0.5 + 0.5 * Math.sin(T * 3 + p.ph * 3);
      if (a < 0.25) continue;
      g.fillStyle = `rgba(255,243,160,${a.toFixed(2)})`;
      g.fillRect(x, y, 1, 1);
      glowAt(x, y, 3, '255,240,150', 0.25 * a);
    } else {
      g.fillStyle = p.c;
      // una foglia (o un petalo) che gira su se stessa mentre cade
      const f = Math.sin(T * 2.4 + p.ph);
      g.fillRect(x, y, f > -0.3 ? 2 : 1, f > 0.4 ? 2 : 1);
    }
  }
}

/* ----- le stagioni dentro il locale: una ghirlanda lungo i muri e qualcosa sul bancone ----- */
// la ghirlanda: foglie d'autunno, lucine d'inverno, fiori in primavera, bandierine d'estate
const decoY = x => 21 + Math.round(4 * Math.sin((Math.PI * (x % 40)) / 40));
function calDecoStanza() {
  const S = stagione().id;
  g.fillStyle = '#2a1a2a';
  for (let x = 0; x < W; x++) g.fillRect(x, decoY(x), 1, 1);
  for (let k = 0, x = 4; x < W - 2; k++, x += 8) {
    const y = decoY(x) + 1;
    if (S === 'autunno') {
      g.fillStyle = ['#e07a3a', '#c94f2a', '#e8b04a', '#a8562a'][k % 4];
      g.fillRect(x - 1, y, 3, 2);
      g.fillRect(x, y + 2, 1, 1);
    } else if (S === 'inverno') {
      const on = Math.floor(T * 1.6 + k * 0.7) % 3 !== 0;
      g.fillStyle = on ? ['#ff4f6a', '#ffd166', '#4ff0ff', '#7bd389'][k % 4] : '#3a2a3a';
      g.fillRect(x, y, 2, 2);
    } else if (S === 'primavera') {
      g.fillStyle = k % 2 ? '#ffc4dc' : '#fff0f5';
      g.fillRect(x - 1, y + 1, 3, 1);
      g.fillRect(x, y, 1, 3);
      g.fillStyle = '#ffd166';
      g.fillRect(x, y + 1, 1, 1);
    } else {
      g.fillStyle = ['#e63946', '#ffd166', '#4ff0ff', '#7bd389', '#ff4fa3'][k % 5];
      g.fillRect(x - 1, y, 4, 1);
      g.fillRect(x, y + 1, 2, 1);
      g.fillRect(x, y + 2, 1, 1);
    }
  }
}
// d'inverno le lucine brillano davvero, anche di notte (dopo le luci della stanza)
function calDecoLuci() {
  if (stagione().id !== 'inverno') return;
  for (let k = 0, x = 4; x < W - 2; k++, x += 8)
    if (Math.floor(T * 1.6 + k * 0.7) % 3 !== 0)
      glowAt(x + 1, decoY(x) + 2, 4, ['255,90,110', '255,210,100', '80,240,255', '120,220,140'][k % 4], 0.35);
}
// sul bancone: zucche, una candela, un vasetto di fiori, una ciotola di limoni
function calDecoBancone() {
  const S = stagione().id,
    x = counterX + 34,
    y = 96;
  if (S === 'autunno') {
    g.fillStyle = '#e07a3a';
    g.fillRect(x, y - 3, 6, 4);
    g.fillRect(x + 1, y - 4, 4, 1);
    g.fillStyle = '#b8562a';
    g.fillRect(x + 2, y - 3, 1, 4);
    g.fillStyle = '#5a7a3a';
    g.fillRect(x + 3, y - 5, 1, 1);
    g.fillStyle = '#e8a040';
    g.fillRect(x + 8, y - 2, 4, 3);
    g.fillStyle = '#5a7a3a';
    g.fillRect(x + 10, y - 3, 1, 1);
  } else if (S === 'inverno') {
    g.fillStyle = '#2e7d45';
    g.fillRect(x, y - 1, 8, 2);
    g.fillStyle = '#e63946';
    g.fillRect(x + 1, y - 2, 1, 1);
    g.fillRect(x + 6, y - 2, 1, 1);
    g.fillStyle = '#fffaf2';
    g.fillRect(x + 3, y - 5, 2, 4);
    g.fillStyle = Math.sin(T * 9) > 0 ? '#ffd166' : '#ff9a3a';
    g.fillRect(x + 3, y - 7, 2, 2);
  } else if (S === 'primavera') {
    g.fillStyle = '#7bd389';
    g.fillRect(x + 2, y - 6, 1, 4);
    g.fillRect(x + 4, y - 7, 1, 5);
    g.fillStyle = '#ff9ec4';
    g.fillRect(x + 1, y - 8, 3, 2);
    g.fillStyle = '#fff0f5';
    g.fillRect(x + 4, y - 9, 2, 2);
    g.fillStyle = '#5b8fd8';
    g.fillRect(x + 1, y - 2, 5, 3);
  } else {
    g.fillStyle = '#f4f1de';
    g.fillRect(x, y - 1, 9, 2);
    g.fillStyle = '#ffd84a';
    g.fillRect(x + 1, y - 3, 3, 2);
    g.fillRect(x + 4, y - 4, 3, 3);
    g.fillRect(x + 6, y - 2, 2, 1);
    g.fillStyle = '#7bd389';
    g.fillRect(x + 5, y - 5, 1, 1);
  }
}
