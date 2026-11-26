// Clienti, ordini, tavoli, storie, giornate e ciclo di aggiornamento.

let people = [],
  queue = [],
  scenes = [],
  floats = [],
  parts = [],
  baristas = [],
  waiters = [],
  timers = [],
  groups = {},
  activeArcs = new Set(),
  uid = 0,
  earnLog = [],
  peds = [],
  cars = [],
  boats = [],
  clouds = [],
  drops = [],
  performer = null,
  managerS = null;
let T = 0,
  started = false,
  spawnT = 2,
  storyT = 15,
  flash = 0,
  thunderT = rnd(20, 50),
  doorOpen = 0,
  saveT = 8,
  choiceOpen = false;
const allSeats = () => slots.slice(0, st.tables).flatMap(s => s.seats);
const freeSeats = () => allSeats().filter(s => !s.occ && !s.dirty && !s.res);
const freeTable = () => slots.slice(0, st.tables).find(sl => sl.seats.every(s => !s.occ && !s.dirty && !s.res));
const slotOf = seat => slots.find(x => x.seats.includes(seat));
function findSeat(c) {
  const f = freeSeats();
  if (!f.length) return null;
  if (c && c.reg) {
    const ft = favTable(c.reg);
    if (ft >= 0 && ft < st.tables && Math.random() < 0.65) {
      const fs = f.find(s => slots.indexOf(slotOf(s)) === ft);
      if (fs) return fs;
    }
    const near = f.find(s => {
      const o = slotOf(s).seats.find(q => q !== s).occ;
      return o && o.reg && o.state === 'sit' && !o.scene && !o.group;
    });
    if (near && Math.random() < 0.65) return near;
  }
  const solo = f.filter(s => slotOf(s).seats.every(q => !q.occ && !q.res));
  return pick(solo.length ? solo : f);
}
const sayDur = t => clamp(1.8 + t.length * 0.055, 2.2, 5.5);
function say(c, txt, d, name) {
  c.bub = { txt, t: d || sayDur(txt), max: d || sayDur(txt), name: name || '' };
}
const bubCount = () => people.filter(p => p.bub).length;
function emo(c, k, t) {
  c.emo = { k, t: t || 1.6 };
}
function randLook(type) {
  const old = TYPES[type] && TYPES[type].old;
  return {
    s: pick(SKIN),
    h: old ? pick(['#e8e4dc', '#b8b8c8', '#d0ccc4']) : pick(HAIR),
    hs: old ? pick([0, 3, 5, 6, 12]) : ri(0, 14),
    o: type === 'critico' ? 4 : type === 'fretta' && Math.random() < 0.5 ? 4 : ri(0, 3),
    c1: type === 'critico' ? '#2b2d42' : pick(TOPS),
    c2: type === 'critico' ? '#9a1b2a' : pick(BOTS),
    hc: pick(['#e63946', '#3a86ff', '#2ec4b6', '#ffd166', '#8e7dff', '#1b1420']),
    uc: pick(['#e63946', '#ffd166', '#3a86ff', '#ff4fa3', '#2ec4b6', '#1b1420', '#f4f1de']),
    ac: pick(['#e63946', '#ffd166', '#2ec4b6', '#c77dff']),
    a: [
      type === 'critico' || Math.random() < 0.18 ? 'occhiali' : '',
      Math.random() < 0.12 ? 'cuffie' : '',
      Math.random() < 0.1 ? 'barba' : '',
      Math.random() < 0.15 ? 'sciarpa' : '',
      Math.random() < 0.12 ? 'orecchino' : '',
      Math.random() < 0.14 ? 'lentiggini' : '',
      Math.random() < 0.08 ? 'fiore' : '',
      type === 'nonno' && Math.random() < 0.3 ? 'cappello' : '',
      Math.random() < 0.06 ? 'farfallino' : ''
    ]
      .filter(Boolean)
      .join(' '),
    tl: Math.random() < 0.35 ? 1 : 0
  };
}
function pickType() {
  const h = hour();
  return wpick(Object.keys(TYPES), k => {
    const t = TYPES[k];
    let w = t.w;
    if (k === 'nonno' && st.perks.torneo) w *= 2.5;
    if (t.h && (h < t.h[0] || h > t.h[1])) w *= 0.06;
    const e = st.ev;
    if (e === 'studenti' && k === 'studente') w *= 5;
    if (e === 'turisti' && k === 'turista') w *= 6;
    if (e === 'concerto' && k === 'musicista') w *= 10;
    if (k === 'studente') w *= 1 + st.wifi * 0.5;
    if (k === 'influencer' && rating() < 3.5) w *= 0.3;
    return w;
  });
}
function newCust(o) {
  o = o || {};
  const type = o.type || (o.look ? 'normale' : pickType());
  const T_ = TYPES[type] || TYPES.normale;
  const c = {
    id: ++uid,
    look: o.look || randLook(type),
    name: o.name || pick(NAMES),
    type,
    reg: o.reg || null,
    x: DOORX,
    y: DOORY,
    face: 1,
    spd: rnd(27, 33) * (T_.spd || 1),
    path: [{ x: DOORX + 4, y: LANE }],
    state: 'enter',
    wt: 0,
    moving: false,
    seat: null,
    order: null,
    prog: 0,
    pat: o.group ? 1e9 : (30 + atm() * 0.25) * (T_.pat || 1) * (st.umbr && (rainy() || curWx() === 'neve') ? 1.4 : 1),
    mood: 60 + Math.min(25, atm() * 0.3) + (o.reg ? 8 : 0),
    sitT: 0,
    bub: null,
    thinkT: rnd(5, 11),
    story: o.story || null,
    group: o.group || null,
    gi: o.gi || 0,
    res: o.res || null,
    talked: false,
    scene: null,
    waitScene: false,
    umb: rainy() ? 1.3 : 0,
    emo: null,
    act: (o.look && o.look.act) || T_.act || pick(['', '', 'sip', 'book', 'phone']),
    special: false,
    why: '',
    waited: 0,
    sipT: rnd(2, 5)
  };
  c.key = o.key || (o.reg && o.reg.key) || null;
  incidentOnArrive(c);
  if (o.reg) learnRoutine(o.reg);
  c.pet = petOf(c);
  people.push(c);
  queue.push(c);
  doorOpen = 1;
  sfx('door');
  return c;
}
function makeReq(c) {
  const ok = REQS.filter(r => r.ok(c));
  if (!ok.length) return;
  const r = wpick(ok, x => x.w);
  c.req = { k: r.k, t: r.t, mg: r.mg || null };
  c.reqLine = pick(r.lines);
  if (r.k === 'fretta') {
    c.req.len = Math.max(5, (c.order.t / tapPow()) * 0.9 + 3.5);
    c.req.dl = T + c.req.len;
  }
  if (r.k === 'doppio') c.order = Object.assign({}, c.order, { t: c.order.t * 1.8, p: c.order.p * 2, n: c.order.n + ' doppio' });
  if (r.mg) c.special = true;
}
function pickOrder(c) {
  if (c.rare === 'babbo') {
    const ch = availMenu().find(i => i.id === 'choc');
    if (ch) return ch;
  }
  const av = availMenu();
  if (c.reg && Math.random() < 0.6) {
    const f = av.find(i => i.id === c.reg.fav);
    if (f) return f;
  }
  const h = hour(),
    w = curWx();
  return wpick(av, it => {
    let x = 1 + av.indexOf(it) * 0.12;
    const p = it.pr || {};
    if (h < 11 && p.m) x *= p.m;
    if (h >= 13 && h < 18 && p.a) x *= p.a;
    if (h >= 21 && p.n) x *= p.n;
    if (h < 19 && p.early) x *= p.early;
    if (w === 'sereno' && p.sun) x *= p.sun;
    if (rainy() && p.rain) x *= p.rain;
    if (w === 'neve' && p.snow) x *= p.snow;
    if (c.type === 'studente' && it.id === 'caffe') x *= 3;
    return x;
  });
}
function walkTo(c, tx, ty, dt) {
  const dx = tx - c.x,
    dy = ty - c.y,
    d = Math.hypot(dx, dy);
  if (d < 0.5) {
    c.x = tx;
    c.y = ty;
    return true;
  }
  const s = Math.min(d, c.spd * dt);
  c.x += (dx / d) * s;
  c.y += (dy / d) * s;
  if (Math.abs(dx) > 0.3) c.face = dx > 0 ? 1 : -1;
  c.moving = true;
  c.wt += dt;
  return false;
}
function follow(c, dt) {
  if (!c.path.length) return true;
  const p = c.path[0];
  if (walkTo(c, p.x, p.y, dt)) {
    c.path.shift();
    return !c.path.length;
  }
  return false;
}
function exitC(c) {
  c.state = 'leave';
  c.path = [
    { x: c.x, y: LANE },
    { x: DOORX + 4, y: LANE },
    { x: DOORX, y: DOORY }
  ];
}
function addCoins(n, x, y) {
  st.coins += n;
  st.earned += n;
  st.runEarned += n;
  if (st.ds) st.ds.earned += n;
  earnLog.push([T, n]);
  if (x != null) floats.push({ x, y, txt: '+' + fmt(n), t: 1.3, col: '#ffd166' });
  qProgress('earned');
}
// Incasso «vero» del locale (vendite e mance, non premi): serve a dare premi proporzionati al momento della partita
let salesLog = [];
function logSale(n) {
  salesLog.push([T, n]);
  while (salesLog.length && salesLog[0][0] < T - 180) salesLog.shift();
}
function incomeRef() {
  const s = salesLog.reduce((a, e) => a + e[1], 0),
    span = Math.max(60, Math.min(180, T - (salesLog[0] ? salesLog[0][0] : T)));
  return Math.max(1.5, s / span);
}
// premio pari a qualche decina di secondi di incasso (con un minimo che cresce con i giorni)
function reward(sec) {
  return Math.round(Math.max(40 + st.day * 10, incomeRef() * sec));
}
function serve(c, quality) {
  queue.shift();
  const it = c.order,
    price = priceOf(it);
  addCoins(price, c.x, c.y - 24);
  logSale(price);
  rushServe(c, price);
  st.served++;
  sfx('coin');
  if (st.ds) {
    st.ds.served++;
    st.ds.items[it.id] = (st.ds.items[it.id] || 0) + 1;
  }
  qProgress('served');
  qProgress('item', it.id);
  c.q = quality || 0;
  if (quality === 2) {
    c.mood += 25;
    emo(c, 'star');
  } else if (quality === 1) c.mood += 12;
  if (c.req) {
    if (c.req.k === 'fretta') {
      if (T <= c.req.dl) {
        c.tipx = 2.5;
        c.mood += 18;
        emo(c, 'star');
        floats.push({ x: c.x, y: c.y - 34, txt: 'In tempo!', t: 1.6, col: '#ffd166' });
        say(c, pick(['Mi hai salvato la vita!', 'Grazie, volo!', 'Sei un fulmine!']), 2);
      } else {
        c.mood -= 6;
        say(c, 'Ok... perderò il treno.', 2);
      }
    } else if (c.req.mg) {
      if (quality >= 1) {
        c.tipx = 1.5;
        say(c, pick(['Esattamente come lo volevo!', 'Wow. Proprio così.', 'Sei bravissimo!']), 2);
      } else say(c, 'Mh. Non proprio come chiedevo.', 2);
    } else if (c.req.k === 'doppio') c.mood += 6;
  }
  if (quality >= 1) {
    st.specials++;
    if (st.ds) st.ds.specials++;
    qProgress('special');
  }
  for (let i = 0; i < 4; i++) parts.push({ x: W - 19 + rnd(-1, 1), y: 84, vx: rnd(-3, 3), vy: rnd(-10, -6), t: 1.2, max: 1.2, k: 'steam' });
  let seat = null;
  const tp = TYPES[c.type] || {};
  if (c.res) seat = allSeats().find(s => s.res === c.res) || null;
  else if (c.rare || Math.random() > (tp.take || 0.18)) seat = findSeat(c);
  if (seat) {
    seat.occ = c;
    seat.res = null;
    c.seat = seat;
    c.state = 'toSeat';
    c.path = [
      { x: c.x, y: LANE },
      { x: seat.x, y: LANE },
      { x: seat.x, y: seat.y }
    ];
  } else {
    if (Math.random() < 0.3) say(c, pick(['Da portare via, grazie!', 'Lo bevo per strada.', 'Corro, ciao!']), 2);
    c.takeaway = true;
    finishVisit(c);
    exitC(c);
  }
}
function stars(c) {
  if (c.left) return 1;
  return clamp(Math.round((c.mood - 10) / 18), 1, 5);
}
function finishVisit(c) {
  const s = stars(c),
    it = c.order || MENU[0];
  let txt;
  const tt = REVT[c.type] && REVT[c.type][s];
  if (tt && Math.random() < 0.6) txt = tt;
  else if (s <= 2 && c.why && REVW[c.why]) txt = pick(REVW[c.why]);
  else txt = pick(REV[s]).replace('{item}', it.n);
  txt = txt.charAt(0).toUpperCase() + txt.slice(1);
  const w = c.type === 'critico' ? 6 : 1;
  st.reviews.push({ s, t: txt, n: c.name, d: st.day, w, c: c.type === 'critico' ? 1 : 0 });
  if (st.reviews.length > 40) st.reviews.shift();
  if (st.ds) st.ds.stars.push(s);
  if (s === 5) qProgress('five');
  if (c.type === 'critico') {
    if (s >= 4) {
      const b = Math.round(200 * mult() * (1 + st.day * 0.2));
      st.hearts++;
      addCoins(b, c.x, c.y - 30);
      toast(`Il critico scrive: «${txt}» ♥ +1`);
    } else toast(`Il critico scrive: «${txt}»`);
  }
  if (c.type === 'influencer' && s >= 4) {
    hypeT = 60;
    toast(`${c.name} ha postato il locale: arrivano più clienti!`);
  }
  if (c.reg) {
    c.reg.v++;
    if (s >= 3) c.reg.f = Math.min(10, c.reg.f + 1);
    if (c.reg.f >= 10 && !c.reg.gift && Math.random() < 0.3) {
      c.reg.gift = 1;
      const b = Math.round(150 * mult());
      addCoins(b, c.x, c.y - 30);
      toast(`${c.reg.n} ti lascia un regalo: «Grazie di tutto»`);
    }
  } else if (!c.story && s >= 4 && st.regs.filter(r => !r.key).length < 40 && Math.random() < 0.2 + (c.type === 'nonno' ? 0.1 : 0))
    makeReg(c);
}
function makeReg(c) {
  let n = c.name;
  if (st.regs.some(r => r.n === n)) n = n + ' ' + String.fromCharCode(65 + ri(0, 25)) + '.';
  const r = {
    id: 'r' + Date.now().toString(36) + ri(0, 999),
    n,
    look: c.look,
    type: c.type === 'critico' ? 'normale' : c.type,
    fav: (c.order || MENU[0]).id,
    v: 1,
    f: 1,
    tr: [pick(TRAITS), pick(TRAITS)].filter((x, i, a) => a.indexOf(x) === i)
  };
  st.regs.push(r);
  c.reg = r;
  toast(`${n} ora è un habitué!`);
  logB(`${n} ora è un habitué`);
}
function leaveSeat(c) {
  const s = c.seat;
  incidentOnLeave(c, s);
  if (s) {
    s.occ = null;
    s.dirty = true;
  }
  c.seat = null;
  const tp = TYPES[c.type] || {};
  const sm = stars(c);
  let tip =
    c.order.p *
    mult() *
    (0.1 + 0.05 * st.chairs + 0.04 * st.waiter + 0.02 * st.decor) *
    (c.story ? 2 : 1) *
    (tp.tip || 1) *
    (sm / 3.5) *
    (c.q === 2 ? 3 : c.q === 1 ? 1.8 : 1) *
    (c.group && st.perks.finestra ? 1.5 : 1) *
    (st.perks.notturni && hour() >= 24 ? 2 : 1) *
    (c.reg ? 1 + c.reg.f * 0.05 : 1) *
    (c.tipx || 1);
  tip = Math.round(tip);
  if (tip > 0) {
    addCoins(tip, c.x, c.y - 22);
    logSale(tip);
  }
  finishVisit(c);
  if (Math.random() < 0.15 && !c.story) say(c, pick(['Grazie, a domani!', 'Buonanotte!', 'Torno presto.', 'Ciao ciao!']), 2);
  exitC(c);
}
function cleanSeat(s, byPlayer) {
  s.dirty = false;
  st.cleaned++;
  if (st.ds) st.ds.cleaned++;
  qProgress('cleaned');
  for (let i = 0; i < 5; i++)
    parts.push({ x: s.x + rnd(-4, 4), y: s.y - 13 + rnd(-3, 2), vx: rnd(-6, 6), vy: rnd(-14, -4), t: 0.7, max: 0.7, k: 'spark' });
}
function relKey(a, b) {
  return [a.id, b.id].sort().join('|');
}
function fillT(lines, A, B) {
  const it = (A && A.order) || MENU[0];
  return lines.map(l => {
    if (!Array.isArray(l)) return l;
    const t = l[1]
      .replace(/\{A\}/g, A ? A.name : '')
      .replace(/\{B\}/g, B ? B.name : '')
      .replace(/\{item\}/g, it.n);
    return [l[0], t, l[2]];
  });
}
function startScene(mem, lines, o) {
  o = o || {};
  const sc = {
    mem,
    lines: lines.filter(l => !Array.isArray(l) || !l[2] || checkFlag(l[2])),
    i: 0,
    t: 0.9,
    onEnd: o.onEnd,
    story: o.story,
    mood: o.mood || ''
  };
  mem.forEach(m => {
    m.scene = sc;
    m.talked = true;
    m.waitScene = false;
  });
  scenes.push(sc);
}
function checkFlag(c) {
  const [k, v] = c.split('=');
  return st.flags[k] === v;
}
function relScene(a, b) {
  const k = relKey(a.reg, b.reg);
  let r = st.rel[k];
  let lines,
    mood = 'chat';
  const x = xsFor([a, b]);
  if (x) {
    if (!r) advanceRel(a.reg, b.reg);
    playXS([a, b], x);
    return;
  }
  if (r && duoReady(r) && Math.random() < 0.55 && startDuo(a, b)) return;
  if (r && a.reg.key && b.reg.key && Math.random() < 0.5) {
    const kr = keyRt(a, b);
    if (kr) {
      startScene(kr[1], kr[0], {
        mood: ['coppia', 'sposati', 'fidanzati', 'cotta'].includes(r.k) ? 'love' : 'chat',
        onEnd: () => advanceRel(a.reg, b.reg)
      });
      return;
    }
  }
  const M = !r && mutual(a.reg, b.reg);
  if (M) {
    const L = pick(RELM).map(l => [l[0], l[1].replace(/\{M\}/g, M.n)]);
    startScene([a, b], fillT(L, a, b), {
      mood: 'chat',
      onEnd: () => {
        advanceRel(a.reg, b.reg);
        logB(`${a.reg.n} e ${b.reg.n} si sono conosciuti grazie a ${M.n}`);
        if (Math.random() < 0.5) toast(`${a.reg.n} e ${b.reg.n} si conoscono grazie a ${M.n}`);
      }
    });
    return;
  }
  if (!r) {
    lines = pick(REL.intro);
    mood = 'chat';
  } else if (r.prop === 1) {
    lines = REL.proposta[0];
    mood = 'love';
  } else if (r.peace) {
    lines = REL.pace[0];
    mood = 'chat';
  } else {
    lines = pick(REL[r.k] || REL.conoscenti);
    mood = ['cotta', 'coppia', 'fidanzati', 'sposati'].includes(r.k) ? 'love' : r.k === 'rivali' ? 'angry' : 'chat';
  }
  startScene([a, b], fillT(lines, a, b), { mood, onEnd: () => advanceRel(a.reg, b.reg) });
}
function advanceRel(A, B) {
  const k = [A.id, B.id].sort().join('|');
  let r = st.rel[k];
  if (!r) {
    r = st.rel[k] = { k: 'conoscenti', lv: 0, d: st.day };
    logB(`${A.n} e ${B.n} si sono conosciuti`);
    return;
  }
  if (r.prop === 1) {
    r.k = 'fidanzati';
    r.prop = 2;
    r.lv = 0;
    st.hearts++;
    logB(`${A.n} e ${B.n} si sono fidanzati qui! ♥`);
    toast(`${A.n} e ${B.n} si sono fidanzati nel tuo locale! ♥ +1`);
    sfx('story');
    return;
  }
  if (r.peace) {
    r.peace = 0;
    r.k = 'amici';
    r.lv = 1;
    logB(`${A.n} e ${B.n}: da rivali ad amici`);
    toast(`${A.n} e ${B.n} hanno fatto pace`);
    return;
  }
  r.lv++;
  if (r.k === 'conoscenti' && r.lv >= 2) {
    const rom = A.tr.includes('romantico') || B.tr.includes('romantico') ? 0.55 : 0.22,
      gr = A.tr.includes('brontolone') || B.tr.includes('brontolone') ? 0.35 : 0.08,
      x = Math.random();
    if (x < rom) {
      r.k = 'cotta';
      r.lv = 0;
      logB(`${A.n} ha una cotta per ${B.n}`);
      toast(`Qualcosa nasce tra ${A.n} e ${B.n}...`);
    } else if (x < rom + gr) {
      r.k = 'rivali';
      r.lv = 0;
      logB(`${A.n} e ${B.n} non si sopportano`);
    } else {
      r.k = 'amici';
      r.lv = 0;
      logB(`${A.n} e ${B.n} sono diventati amici`);
      toast(`${A.n} e ${B.n} sono diventati amici`);
    }
  } else if (r.k === 'amici' && r.lv >= 4) {
    r.k = 'migliori';
    r.lv = 0;
    logB(`${A.n} e ${B.n} sono migliori amici`);
  } else if (r.k === 'cotta' && r.lv >= 2) {
    r.k = 'coppia';
    r.lv = 0;
    logB(`${A.n} e ${B.n} si sono messi insieme ♥`);
    toast(`${A.n} e ${B.n} si sono messi insieme ♥`);
  } else if (r.k === 'coppia' && r.lv >= 5 && !r.prop) r.prop = 1;
  else if (r.k === 'rivali' && r.lv >= 3) r.peace = 1;
}
function logB(t) {
  st.log.unshift({ d: st.day, t });
  if (st.log.length > 40) st.log.pop();
}
function onSit(c) {
  if (c.rare) {
    const R = RARE[c.rare];
    startScene([c], R.l, {
      story: 'raro',
      onEnd: () => {
        if (egg('v_' + c.rare)) {
          st.hearts++;
          floats.push({ x: c.x, y: c.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
        }
      }
    });
    return;
  }
  if (c.group) {
    const G = groups[c.group];
    const mem = people.filter(p => p.group === c.group && !p.dead).sort((a, b) => a.gi - b.gi);
    if (G && mem.length >= G.n && mem.every(p => p.state === 'sit')) {
      if (G.rel) relScene(mem[0], mem[1]);
      else startScene(mem, G.lines, { onEnd: G.onEnd, story: G.story, mood: G.mood });
      if (G.n === 2 && !G.story && st.ds) {
        st.ds.couples++;
        qProgress('couples');
      }
    } else c.waitScene = true;
    return;
  }
  if (c.reg) {
    const ti = slots.indexOf(slotOf(c.seat));
    c.reg.tb = c.reg.tb || {};
    c.reg.tb[ti] = (c.reg.tb[ti] || 0) + 1;
  }
  if (c.join) {
    const o = c.join;
    c.join = null;
    if (o.state === 'sit' && !o.scene && !o.dead && o.reg && slotOf(o.seat) === slotOf(c.seat)) relScene(o, c);
    return;
  }
  if (c.reg && c.reg.key) {
    const x = xsFor([c]);
    if (x && Math.random() < 0.85) {
      playXS([c], x);
      return;
    }
  }
  if (c.reg && !c.story && filoReady(c.reg) && Math.random() < 0.65 && startFilo(c)) return;
  if (c.reg && (c.reg.hn || 0) >= 4 && Math.random() < 0.25) {
    const ft = favTable(c.reg),
      cur = slots.indexOf(slotOf(c.seat));
    if (ft >= 0 && ft !== cur && slots[ft].seats.some(s => s.occ && s.occ.state === 'sit' && !s.occ.reg))
      timers.push({
        t: 1.2,
        fn: () => {
          if (!c.bub && c.state === 'sit')
            say(
              c,
              pick([
                'Qualcuno si è seduto al mio tavolo...',
                'Il mio solito posto è occupato. Uffa.',
                'Oggi mi tocca il tavolo degli altri.'
              ]),
              2.6,
              c.name
            );
        }
      });
  }
  const other = slotOf(c.seat).seats.find(s => s !== c.seat).occ;
  if (other && other.state === 'sit' && !other.scene && !other.group && !other.talked) {
    if (c.reg && other.reg) relScene(other, c);
    else if (Math.random() < 0.55) startScene([other, c], fillT(pick(REL.intro), other, c));
  }
}
function spawnGroup(a, b, o) {
  const sl = freeTable();
  if (!sl) return false;
  const gid = 'g' + ++uid;
  groups[gid] = Object.assign({ n: 2 }, o);
  sl.seats.forEach((s, i) => (s.res = gid + i));
  newCust(Object.assign({ group: gid, gi: 0, res: gid + 0 }, a));
  timers.push({ t: 0.9, fn: () => newCust(Object.assign({ group: gid, gi: 1, res: gid + 1 }, b)) });
  return true;
}
function present(r) {
  return people.some(p => p.reg === r && !p.dead);
}
function trySpawn() {
  if (queue.length >= 5) return;
  if (!freeSeats().length && queue.length >= 2) return;
  if (st.regs.length && Math.random() < Math.min(0.4, 0.1 + st.regs.length * 0.02)) {
    if (Math.random() < 0.35 && queue.length <= 2 && ritual()) return;
    if (Math.random() < 0.3 && queue.length <= 2 && tryCross()) return;
    const r = pickReg();
    if (r) {
      const rels = Object.entries(st.rel).filter(([k, v]) => k.includes(r.id) && CLOSE.includes(v.k));
      if (rels.length && Math.random() < 0.55 && queue.length <= 2) {
        const [k] = pick(rels);
        const oid = k.split('|').find(x => x !== r.id);
        const o = st.regs.find(x => x.id === oid);
        if (
          o &&
          !present(o) &&
          regWeight(o) > 0 &&
          spawnGroup({ look: r.look, name: r.n, reg: r, type: r.type }, { look: o.look, name: o.n, reg: o, type: o.type }, { rel: 1 })
        )
          return;
      }
      newCust({ look: r.look, name: r.n, reg: r, type: r.type });
      return;
    }
  }
  const gc = st.ev === 'innamorati' ? 0.55 : 0.3;
  if (Math.random() < gc && queue.length <= 2 && spawnGroup({}, {}, { lines: pick(PAIRS), mood: Math.random() < 0.4 ? 'love' : 'chat' }))
    return;
  newCust();
}
// Storie che arrivano in un giorno qualunque (rand) e che lasciano passare dei giorni tra un capitolo e l'altro (gap)
const CHAP_PER_DAY = 3; // capitoli delle storie principali al massimo in una giornata
function storyDayOk(arc, k) {
  if (st.ds && (st.ds.chap || 0) >= CHAP_PER_DAY) return false;
  if ((st.arcDay || {})[arc.id] === st.day) return false; // un capitolo per storia al giorno
  if (arc.rand && k === 0) {
    if (st.day < arc.rand.from) return false;
    st.rolls = st.rolls || {};
    const r = st.rolls[arc.id];
    if (!r || r.d !== st.day) st.rolls[arc.id] = { d: st.day, v: Math.random() < arc.rand.p };
    if (!st.rolls[arc.id].v) return false;
  }
  const gap = (arc.ch[k] && arc.ch[k].gap) || arc.gap || 0;
  if (k > 0 && gap && ((st.arcDay || {})[arc.id] || 0) > st.day - gap) return false;
  return true;
}
// chi entra in un capitolo può dipendere dal finale (whoBy: { 'storia=valore': [...] })
function chapterWho(arc, ch) {
  if (ch.whoBy) {
    const e = Object.entries(ch.whoBy).find(([f]) => checkFlag(f));
    if (e) return e[1];
  }
  return ch.who || arc.who;
}
function storyNote(arc) {
  // aspetta che non ci siano altre finestre aperte (una scelta, la fine della giornata, un minigioco): non le deve coprire
  if (!$('#modal').hidden || choiceOpen || mini || !$('#reader').hidden) return setTimeout(() => storyNote(arc), 1000);
  showModal(`<h2>${esc(arc.t)}</h2><p>${esc(arc.nota)}</p>`, [{ t: 'Ho capito', big: 1, fn: hideModal }]);
}
function tryStory() {
  const a = atm(),
    c = [];
  for (const arc of ARCS) {
    if (activeArcs.has(arc.id) || !arcReq(arc)) continue;
    const k = st.story[arc.id] || 0;
    if (arc.ch.some(c => chapterWho(arc, c).some(keyBusy))) continue;
    if (k >= arc.ch.length && arc.who.every(w => keyReg(w))) continue;
    if (k < arc.ch.length) {
      if (!storyDayOk(arc, k)) continue;
      if (a >= arc.ch[k].r) c.push({ arc, k, ch: arc.ch[k] }, { arc, k, ch: arc.ch[k] });
    } else if (arc.rt.length && (st.rt[arc.id] || 0) < Date.now()) c.push({ arc, rt: 1 });
  }
  if (!c.length) return;
  const o = pick(c),
    arc = o.arc,
    ch = o.ch || null;
  // finale calcolato da tutte le scelte fatte (es. Davide): si decide prima che i personaggi entrino
  if (ch && ch.calc) st.flags[ch.calc.flag] = ch.calc.fn();
  const who = ch ? chapterWho(arc, ch) : arc.ch[arc.ch.length - 1].who || arc.who;
  let seats;
  if (who.length === 2) {
    const sl = freeTable();
    if (!sl) return;
    seats = sl.seats;
  } else {
    const s = findSeat();
    if (!s) return;
    seats = [s];
  }
  const gid = 's' + ++uid;
  activeArcs.add(arc.id);
  groups[gid] = {
    n: who.length,
    story: true,
    lines: ch ? ch.l : pick(arc.rt),
    onEnd: () => {
      activeArcs.delete(arc.id);
      if (ch) {
        const bonus = reward(120);
        st.story[arc.id] = o.k + 1;
        (st.arcDay = st.arcDay || {})[arc.id] = st.day;
        st.hearts++;
        st.newStory = 1;
        if (st.ds) {
          st.ds.stories++;
          st.ds.chap = (st.ds.chap || 0) + 1;
        }
        const m = people.find(p => p.group === gid);
        addCoins(bonus, m ? m.x : W / 2, m ? m.y - 26 : 90);
        floats.push({ x: m ? m.x : W / 2, y: (m ? m.y : 110) - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
        toast(`Nuovo capitolo nel Diario · «${ch.t}»`);
        sfx('story');
        if (o.k + 1 >= arc.ch.length && arc.perk) {
          const E = arcEnd(arc);
          st.perks[E.perk] = 1;
          setTimeout(() => toast(`Storia completata${E.n ? ' · finale «' + E.n + '»' : ''}! ${E.pt}`), 3600);
          logB(`Storia completata: ${arc.t}${E.n ? ' (finale: ' + E.n + ')' : ''}`);
          setTimeout(ensureKeyRegs, 7000);
          if (arc.nota) setTimeout(() => storyNote(arc), 4800);
        }
        save();
      } else st.rt[arc.id] = Date.now() + 90000;
    }
  };
  who.forEach((id, i) => {
    seats[i].res = gid + i;
    timers.push({
      t: 0.1 + i * 1.4,
      fn: () => newCust({ look: CH[id].l, name: CH[id].n, group: gid, gi: i, story: arc.id, res: gid + i, key: id })
    });
  });
}
function updCust(c, dt) {
  c.moving = false;
  if (c.bub) {
    c.bub.t -= dt;
    if (c.bub.t <= 0) c.bub = null;
  }
  if (c.emo) {
    c.emo.t -= dt;
    if (c.emo.t <= 0) c.emo = null;
  }
  if (c.umb > 0) c.umb -= dt;
  const inQ = c.state === 'queue' || c.state === 'order';
  if (inQ) {
    c.waited += dt;
    if (c.waited > 6) c.mood -= dt * (1 / ((TYPES[c.type] || {}).pat || 1));
    if (c.waited > 20) c.why = 'attesa';
    if (c.pat < 1e8) {
      c.pat -= dt;
      if (c.pat < 6 && !c.warned) {
        c.warned = true;
        emo(c, 'sweat', 3);
      }
      if (c.pat <= 0) {
        rushMiss();
        queue.splice(queue.indexOf(c), 1);
        say(c, pick(['Troppa attesa...', 'Uff, ripasso domani.', 'Niente, vado.']), 2.5);
        emo(c, 'angry');
        c.left = true;
        c.why = 'attesa';
        c.order = c.order || MENU[0];
        finishVisit(c);
        exitC(c);
        return;
      }
    }
  }
  switch (c.state) {
    case 'enter':
      if (follow(c, dt)) c.state = 'queue';
      break;
    case 'queue': {
      const i = queue.indexOf(c),
        tx = counterX - 8 - i * 12;
      if (walkTo(c, tx, LANE, dt)) {
        c.face = 1;
        if (i === 0) {
          c.state = 'order';
          c.order = pickOrder(c);
          c.special = c.type === 'critico' || (!rush && Math.random() < (c.type === 'influencer' ? 0.5 : 0.07)); // nell'ora di punta niente speciali
          c.req = null;
          if (!c.special && !c.story && !rush && Math.random() < 0.17) makeReq(c);
          const o = c.order;
          const line =
            c.reg && c.order.id === c.reg.fav && Math.random() < 0.6
              ? pick([`Il solito: ${o.n}!`, `Ciao! Il mio ${o.n}, grazie.`])
              : pick([`${o.a} ${o.n}, per favore.`, `Per me ${o.a.toLowerCase()} ${o.n}.`, `${o.a} ${o.n}, grazie!`]);
          say(c, c.req ? line + ' ' + c.reqLine : line, c.req ? 3.6 : 2.4, c.story || c.reg ? c.name : '');
        }
      }
      break;
    }
    case 'order':
      break;
    case 'toSeat':
      if (follow(c, dt)) {
        c.state = 'sit';
        c.face = -c.seat.side;
        c.sitT =
          rnd(13, 18) * ((TYPES[c.type] || {}).stay || 1) + st.chairs * 3 + st.decor * 0.8 + (c.type === 'studente' ? st.wifi * 8 : 0);
        if (c.keepSit) {
          c.sitT = Math.max(c.keepSit, 12) + 6;
          c.keepSit = 0;
        }
        onSit(c);
      }
      break;
    case 'sit': {
      const tbl = slotOf(c.seat);
      c.mood = Math.min(
        100,
        c.mood +
          dt *
            (0.3 +
              st.chairs * 0.08 +
              (st.music && st.musicOn ? 0.15 : 0) +
              (st.stove && (rainy() || curWx() === 'neve' || hour() > 21) ? 0.15 : 0) +
              (musicianOn ? 0.2 : 0))
      );
      if (tbl.seats.some(s => s.dirty)) {
        c.mood -= dt * 0.8;
        c.why = 'sporco';
      }
      c.sipT -= dt;
      if (c.sipT < 0) {
        c.sipT = rnd(3, 7);
        c.sip = 0.9;
      }
      if (c.sip > 0) c.sip -= dt;
      if (c.act === 'guitar' && Math.random() < dt * 1.5)
        parts.push({ x: c.x + c.face * 3, y: c.y - 16, vx: rnd(-3, 3), vy: -8, t: 1.6, max: 1.6, k: 'note' });
      if (c.act === 'camera' && Math.random() < dt * 0.15) c.flash = 0.15;
      if (c.flash > 0) c.flash -= dt;
      if (c.act === 'laptop' && hour() > 24 && Math.random() < dt * 0.02) c.sleep = 1;
      if (c.sleep && Math.random() < dt * 0.5) parts.push({ x: c.x, y: c.y - 20, vx: 2, vy: -5, t: 2, max: 2, k: 'z' });
      if (c.scene && c.scene.mood === 'love' && Math.random() < dt * 0.8)
        parts.push({ x: tbl.x + rnd(-4, 4), y: c.y - 20, vx: rnd(-2, 2), vy: -7, t: 1.6, max: 1.6, k: 'heart' });
      if (!c.scene && !c.waitScene) {
        c.sitT -= dt;
        c.thinkT -= dt;
        if (c.thinkT <= 0 && c.reg && c.reg.key && bubCount() < 4 && Math.random() < 0.65) {
          const kl = keyLine(c);
          if (kl) {
            c.thinkT = rnd(9, 16);
            say(c, kl, sayDur(kl) + 0.6, c.name);
          }
        }
        if (c.thinkT <= 0 && c.reg && !c.reg.key && (c.reg.hn || 0) >= 3 && bubCount() < 4 && Math.random() < 0.22) {
          c.thinkT = rnd(10, 18);
          say(c, pick(REGL).replace('{item}', (c.order || MENU[0]).n), 3, c.name);
        }
        if (c.thinkT <= 0 && c.pet && Math.random() < 0.3 && bubCount() < 4) {
          c.thinkT = rnd(10, 20);
          say(c, pick(PETL).replace(/\{P\}/g, c.pet.n), 3, c.reg ? c.name : '');
        }
        if (c.thinkT <= 0) {
          c.thinkT = rnd(10, 20);
          if (bubCount() < 4 && Math.random() < 0.55) {
            const h = hour(),
              w = curWx();
            let pool = SOLO;
            const r = Math.random();
            if (r < 0.35) {
              if (h < 10) pool = SOLOH.m;
              else if (h > 22) pool = SOLOH.n;
              else if (rainy()) pool = SOLOH.r;
              else if (w === 'sereno') pool = SOLOH.s;
              else if (w === 'neve') pool = SOLOH.w;
              else if (w === 'nebbia') pool = SOLOH.f;
            }
            say(
              c,
              st.chalk && Math.random() < 0.12
                ? pick([
                    `«${st.chalk}». Bella frase.`,
                    'Chi ha scritto sulla lavagna? Mi ha fatto sorridere.',
                    'Quella frase sulla lavagna è proprio vera.'
                  ])
                : pick(pool),
              3
            );
          }
        }
        if (Math.random() < dt * 0.4)
          parts.push({ x: tbl.x + c.seat.side * 6, y: c.y - 15, vx: rnd(-1, 1), vy: -5, t: 1.4, max: 1.4, k: 'steam' });
        if (c.sitT <= 0) {
          c.sleep = 0;
          leaveSeat(c);
        }
      }
      break;
    }
    case 'leave':
      if (rainy() && c.x < DOORX + 14 && !c.umbOut) {
        c.umbOut = 1;
      }
      if (follow(c, dt)) {
        c.dead = true;
        doorOpen = 1;
      }
      break;
  }
}
function updScene(sc, dt) {
  if (sc.mem.some(m => m.dead || m.state !== 'sit')) {
    sc.done = true;
    sc.mem.forEach(m => (m.scene = null));
    return;
  }
  if (sc.wait) return;
  sc.t -= dt;
  if (sc.t > 0) return;
  if (sc.i < sc.lines.length) {
    const ln = sc.lines[sc.i++];
    if (!Array.isArray(ln) && ln.c) {
      sc.wait = true;
      openChoice(ln.c, sc);
      return;
    }
    const sp = sc.mem[ln[0]] || sc.mem[0],
      d = sayDur(ln[1]);
    say(sp, ln[1], d, sc.story || sp.reg ? sp.name : '');
    sc.t = d + 0.35;
    if (sc.mood === 'angry' && Math.random() < 0.5) emo(sp, 'angry');
    if (sc.mood === 'love' && Math.random() < 0.35) emo(sp, 'heart');
    if (sc.mood === 'chat' && /!|\?/.test(ln[1]) && Math.random() < 0.3) emo(sp, 'note');
    sc.mem.forEach(m => {
      if (m !== sp && m.seat) m.face = -m.seat.side;
    });
  } else {
    sc.done = true;
    sc.mem.forEach(m => {
      m.scene = null;
      m.sitT = rnd(2.5, 5);
    });
    if (sc.onEnd) sc.onEnd();
  }
}
function syncStaff() {
  const nb = baristaLv() ? 1 + (baristaLv() >= 4) + (baristaLv() >= 9) : 0,
    nw = st.waiter ? 1 + (st.waiter >= 4) + (st.waiter >= 8) : 0;
  while (baristas.length > nb) baristas.pop();
  while (waiters.length > nw) waiters.pop();
  while (baristas.length < nb) {
    const isB = st.perks.bianca && !baristas.some(b => b.bianca);
    baristas.push({
      id: ++uid,
      bianca: isB,
      look: isB
        ? Object.assign({}, CH.bianca.l, { c1: '#f4f1de', o: 0, a: 'grembiule orecchino' })
        : { s: pick(SKIN), h: pick(HAIR), hs: ri(0, 7), o: 0, c1: '#f4f1de', c2: '#2b2d42', a: 'grembiule' },
      x: counterX + 20 + baristas.length * 12,
      y: 105,
      face: -1,
      wt: 0,
      moving: false,
      state: 'staff',
      tx: counterX + 20,
      tt: 0,
      spd: 22
    });
  }
  while (waiters.length < nw)
    waiters.push({
      id: ++uid,
      look: { s: pick(SKIN), h: pick(HAIR), hs: ri(0, 7), o: 0, c1: '#f4f1de', c2: '#1b1420', a: 'gilet' },
      x: counterX - 10,
      y: 152,
      face: -1,
      wt: 0,
      moving: false,
      state: 'idle',
      path: [],
      seat: null,
      ct: 0,
      spd: 26
    });
  if (st.manager && !managerS)
    managerS = {
      id: ++uid,
      look: { s: pick(SKIN), h: pick(HAIR), hs: 6, o: 4, c1: '#3d405b', c2: '#ffd166', a: 'occhiali' },
      x: counterX - 20,
      y: 150,
      face: -1,
      wt: 0,
      moving: false,
      state: 'idle',
      tx: counterX - 20,
      ty: 150,
      tt: 3,
      spd: 16
    };
}
function updBarista(b, i, dt) {
  b.moving = false;
  b.tt -= dt;
  const busy = queue[0] && queue[0].state === 'order';
  if (i === 0 && busy) b.tx = queue[0].order.s === 'v' ? counterX + 22 : W - 20;
  else if (b.tt <= 0) {
    b.tt = rnd(1.5, 4);
    b.tx = pick([counterX + 10, counterX + 30, W - 20, W - 34]);
  }
  if (walkTo(b, b.tx, 105, dt)) b.face = b.tx > W - 26 ? 1 : -1;
}
function updWaiter(w, dt) {
  w.moving = false;
  w.spd = 24 + 3 * st.waiter;
  if (w.state === 'idle') {
    const s = allSeats()
      .filter(s => s.dirty && !s.tgt)
      .sort((a, b) => Math.abs(a.x - w.x) - Math.abs(b.x - w.x))[0];
    if (s) {
      s.tgt = w;
      w.seat = s;
      w.state = 'go';
      const tx = s.x + s.side * 6;
      w.path = [
        { x: w.x, y: LANE + 6 },
        { x: tx, y: LANE + 6 },
        { x: tx, y: s.y + 1 }
      ];
    } else walkTo(w, counterX - 10 - waiters.indexOf(w) * 10, 152, dt);
  } else if (w.state === 'go') {
    if (!w.seat.dirty) {
      w.seat.tgt = null;
      w.seat = null;
      w.state = 'idle';
      return;
    }
    if (follow(w, dt)) {
      w.state = 'clean';
      w.ct = 2.2 / (1 + 0.3 * st.waiter);
      w.face = -w.seat.side;
    }
  } else if (w.state === 'clean') {
    w.ct -= dt;
    if (w.ct <= 0) {
      if (w.seat.dirty) cleanSeat(w.seat);
      w.seat.tgt = null;
      w.seat = null;
      w.state = 'idle';
    }
  }
}
function updManager(m, dt) {
  m.moving = false;
  m.tt -= dt;
  if (m.tt <= 0) {
    m.tt = rnd(4, 9);
    m.tx = clamp(rnd(colX[Math.min(cols - 1, st.space - 1)], counterX - 10), 40, counterX - 8);
    m.ty = pick([LANE + 4, LANE - 2, 148]);
  }
  walkTo(m, m.tx, m.ty, dt);
}
function mkCloud(x) {
  const r = rnd(7, 15),
    n = ri(3, 6),
    p = [];
  for (let i = 0; i < n; i++) {
    const pr = r * rnd(0.45, 0.85);
    p.push([
      Math.round((i - (n - 1) / 2) * r * 0.55 + rnd(-2, 2)),
      Math.round(rnd(-r * 0.25, r * 0.1) - (i % 2 ? pr * 0.3 : 0)),
      Math.round(pr)
    ]);
  }
  return { x, y: rnd(4, 24), r, spd: rnd(1.5, 4), p };
}
function updStreet(dt) {
  const h = hour(),
    w = curWx(),
    busy = (h > 8 && h < 23 ? 1 : 0.35) * (w === 'temporale' ? 0.4 : rainy() ? 0.7 : 1);
  if (Math.random() < dt * 0.5 * busy)
    peds.push({
      x: Math.random() < 0.5 ? -6 : W + 6,
      d: 0,
      spd: rnd(6, 12),
      c: pick(TOPS),
      u: rainy() ? pick(['#e63946', '#ffd166', '#3a86ff', '#ff4fa3', '#1b1420', '#2ec4b6']) : null,
      ph: rnd(0, 9)
    });
  peds.forEach(p => {
    if (!p.d) p.d = p.x < 0 ? 1 : -1;
    p.x += p.d * p.spd * dt;
    if (p.wave > 0) p.wave -= dt;
  });
  peds = peds.filter(p => p.x > -10 && p.x < W + 10);
  if (st.district !== 'montagna' && Math.random() < dt * 0.25 * busy)
    cars.push({
      x: Math.random() < 0.5 ? -14 : W + 14,
      d: 0,
      spd: rnd(30, 55),
      c: pick(['#e63946', '#f4f1de', '#3a86ff', '#2b2d42', '#ffd166', '#8e7dff'])
    });
  cars.forEach(c => {
    if (!c.d) c.d = c.x < 0 ? 1 : -1;
    c.x += c.d * c.spd * dt;
  });
  cars = cars.filter(c => c.x > -20 && c.x < W + 20);
  if (city && city.sea != null) {
    if (boats.length < 3 && Math.random() < dt * 0.05) boats.push({ x: Math.random() < 0.5 ? -10 : W + 10, d: 0, spd: rnd(2, 5) });
    boats.forEach(b => {
      if (!b.d) b.d = b.x < 0 ? 1 : -1;
      b.x += b.d * b.spd * dt;
    });
    boats = boats.filter(b => b.x > -14 && b.x < W + 14);
  }
  const cn = w === 'sereno' ? 2 : w === 'nuvoloso' ? 7 : rainy() || w === 'neve' ? 6 : 4;
  if (!clouds.length && cn) for (let i = 0; i < Math.ceil(cn / 2); i++) clouds.push(mkCloud(rnd(0, W)));
  if (clouds.length < cn && Math.random() < dt * 0.2) clouds.push(mkCloud(-34));
  clouds.forEach(c => (c.x += c.spd * dt));
  clouds = clouds.filter(c => c.x < W + 40);
  const hh = WY1 - WY0,
    want = w === 'pioggia' ? W * 0.45 : w === 'temporale' ? W * 0.75 : w === 'neve' ? W * 0.25 : 0;
  while (drops.length < want) drops.push({ x: rnd(0, W), y: rnd(0, hh), v: w === 'neve' ? rnd(6, 12) : rnd(90, 140), ph: rnd(0, 6) });
  if (drops.length > want) drops.length = Math.floor(want);
  const snow = w === 'neve';
  for (const d of drops) {
    d.y += d.v * dt;
    d.x += snow ? Math.sin(T + d.ph) * 4 * dt : -d.v * 0.22 * dt;
    if (d.y > hh) {
      d.y = -3;
      d.x = rnd(0, W + 20);
    }
  }
}
function rollWx() {
  const ws = WXW[st.district] || WXW.centro;
  return wpick(Object.keys(ws), k => ws[k]);
}
function rollEv() {
  if (Math.random() > 0.45) return null;
  const e = { festival: 2, studenti: 1.5, critico: rating() >= 3 ? 1.6 : 0.3, blackout: 1, turisti: 1.5, concerto: 1, innamorati: 1 };
  if (st.perks.openmic) e.openmic = 2.5;
  if (st.perks.band) e.concerto = 2.5;
  return wpick(Object.keys(e), k => e[k]);
}
function startDay() {
  st.tod = 0;
  try {
    ensureKeyRegs();
  } catch (e) {}
  st.wx = st.nwx || rollWx();
  st.ev = st.day < 2 ? null : st.nev !== undefined && st.nev !== null ? st.nev : rollEv();
  st.wx2 = Math.random() < 0.35 ? rollWx() : null;
  if (st.wx2 === st.wx) st.wx2 = null;
  st.wxShown = 0;
  st.evT = rnd(0.2, 0.65);
  st.evDone = 0;
  st.nwx = rollWx();
  st.nev = rollEv();
  st.ds = { served: 0, earned: 0, stars: [], couples: 0, cleaned: 0, items: {}, specials: 0, stories: 0 };
  genQuests();
  toast(`Giorno ${st.day} · ${WXN[st.wx]}${st.ev ? ' · ' + EVENTS[st.ev].n : ''}`);
  if (st.ev) setTimeout(() => toast(EVENTS[st.ev].d), 3700);
  drops.length = 0;
}
function genQuests() {
  const d = st.day,
    inc = Math.max(0.6, st.ips || 0.6);
  const pool = [
    () => ({ k: 'served', n: 12 + d * 2, t: 'Servi {n} clienti' }),
    () => ({ k: 'earned', n: Math.max(60, Math.round(inc * 150)), t: 'Incassa {n} monete' }),
    () => {
      const it = pick(availMenu());
      return { k: 'item', id: it.id, n: 4 + Math.min(10, d), t: `Servi {n} × ${it.n}` };
    },
    () => ({ k: 'five', n: 2 + Math.min(6, d >> 1), t: 'Ricevi {n} recensioni da 5 stelle' }),
    () => ({ k: 'couples', n: 2 + Math.min(5, d >> 1), t: 'Fai sedere {n} coppie' }),
    () => ({ k: 'cleaned', n: 6 + d, t: 'Pulisci {n} tavoli' }),
    () => ({ k: 'special', n: 1 + Math.min(3, d >> 2), t: 'Ordini speciali completati: {n}' }),
    () => ({ k: 'needs', n: 2 + Math.min(5, d >> 1), t: 'Aiuta {n} clienti ai tavoli' })
  ];
  const qs = [],
    used = new Set();
  while (qs.length < 3) {
    const i = ri(0, pool.length - 1);
    if (used.has(i)) continue;
    used.add(i);
    const q = pool[i]();
    q.p = 0;
    q.done = false;
    q.cl = false;
    q.r = Math.max(40, Math.round(inc * 100 * (1 + qs.length * 0.4)));
    qs.push(q);
  }
  st.quests = qs;
}
function qProgress(k, id) {
  if (!st.ds) return;
  for (const q of st.quests) {
    if (q.k !== k || q.done) continue;
    if (k === 'item' && q.id !== id) continue;
    if (k === 'earned') q.p = st.ds.earned;
    else q.p++;
    if (q.p >= q.n) {
      q.p = q.n;
      q.done = true;
      toast(`Obiettivo completato: ${q.t.replace('{n}', fmt(q.n))}`);
    }
  }
}
function claimQ(q) {
  if (!q.done || q.cl) return;
  q.cl = true;
  addCoins(q.r, null, null);
  sfx('buy');
  if (st.quests.every(x => x.cl)) {
    st.hearts++;
    st.perfect++;
    toast('Giornata perfetta! ♥ +1');
  }
}
function endDay() {
  paused = true;
  const ds = st.ds || { served: 0, earned: 0, stars: [], couples: 0, stories: 0 };
  const avg = ds.stars.length ? ds.stars.reduce((a, b) => a + b, 0) / ds.stars.length : 0;
  const best = st.reviews.filter(r => r.d === st.day && r.s >= 4).slice(-1)[0];
  if (st.manager) st.quests.forEach(claimQ);
  let n = 12;
  const html = `<h2>Fine del giorno ${st.day}</h2><div class="sum"><div><b>${ds.served}</b><span>clienti serviti</span></div><div><b>${fmt(ds.earned)}</b><span>monete</span></div><div><b>${avg ? avg.toFixed(1).replace('.', ',') : '–'} ★</b><span>recensioni</span></div><div><b>${ds.couples}</b><span>coppie</span></div><div><b>${ds.stories}</b><span>capitoli</span></div><div><b>${st.quests.filter(q => q.done).length}/3</b><span>obiettivi</span></div></div>
 ${best ? `<p>«${esc(best.t)}» <small>— ${esc(best.n)}</small></p>` : ''}<p>Domani: <b>${WXN[st.nwx]}</b>${st.nev ? ' · ' + EVENTS[st.nev].n : ''}</p>${st.quests.some(q => q.done && !q.cl) ? '<p>Hai obiettivi da riscuotere nel pannello Giorno: li riscuoto io per te.</p>' : ''}`;
  st.quests.forEach(claimQ);
  showModal(html, [{ t: `Apri il giorno ${st.day + 1}`, id: 'nd', big: 1, fn: next }]);
  const iv = setInterval(() => {
    n--;
    const b = $('#nd');
    if (!b || $('#modal').hidden) {
      clearInterval(iv);
      return;
    }
    b.textContent = `Apri il giorno ${st.day + 1} (${n})`;
    if (n <= 0) {
      clearInterval(iv);
      next();
    }
  }, 1000);
  function next() {
    clearInterval(iv);
    hideModal();
    st.day++;
    startDay();
    save();
  }
}
function ambient(dt) {
  flash = Math.max(0, flash - dt * 2.2);
  if (curWx() === 'temporale') {
    thunderT -= dt;
    if (thunderT <= 0) {
      thunderT = rnd(14, 40);
      flash = 1;
      setTimeout(() => sfx('thunder'), 350);
    }
  }
  doorOpen = Math.max(0, doorOpen - dt * 1.4);
  for (const p of parts) {
    p.t -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
  parts = parts.filter(p => p.t > 0);
  for (const f of floats) {
    f.t -= dt;
    f.y -= 12 * dt;
  }
  floats = floats.filter(f => f.t > 0);
  updStreet(dt);
  updExtra(dt);
}
function update(dt) {
  ambient(dt);
  if (paused) return;
  st.tod += dt / DAYLEN;
  if (st.wx2 && st.tod >= 0.5 && !st.wxShown) {
    st.wxShown = 1;
    toast(
      st.wx2 === 'sereno'
        ? 'Esce il sole!'
        : st.wx2 === 'pioggia'
          ? 'Inizia a piovere'
          : st.wx2 === 'neve'
            ? 'Inizia a nevicare!'
            : st.wx2 === 'temporale'
              ? 'Arriva un temporale'
              : 'Il tempo cambia: ' + WXN[st.wx2]
    );
  }
  if (st.ev === 'critico' && !st.evDone && st.tod >= st.evT) {
    st.evDone = 1;
    newCust({ type: 'critico', name: 'Sig. Ferri (critico)' });
    toast('È entrato il critico gastronomico!');
  }
  if (st.tod >= 1) {
    st.tod = 1;
    endDay();
    return;
  }
  hypeT = Math.max(0, hypeT - dt);
  boostT = Math.max(0, boostT - dt);
  machCd = Math.max(0, machCd - dt);
  if (hour() >= 24 && st.midDay !== st.day) {
    st.midDay = st.day;
    sfx('chime');
    toast('Mezzanotte. La città rallenta, il caffè no.');
    egg('mezzanotte');
  }
  if (Math.random() < dt * 0.05 && !people.some(p => p.rare) && st.rareDay !== st.day && st.day >= 2) tryRare();
  for (const t of timers) t.t -= dt;
  const due = timers.filter(t => t.t <= 0);
  timers = timers.filter(t => t.t > 0);
  due.forEach(t => t.fn());
  spawnT -= dt;
  if (spawnT <= 0) {
    if (hour() < 25.7) trySpawn();
    spawnT = arrival() * rnd(0.6, 1.4);
  }
  storyT -= dt;
  if (storyT <= 0) {
    tryStory();
    storyT = rnd(18, 34);
  }
  const q = queue[0];
  if (q && q.state === 'order' && q.special && q.waited > (st.manager ? 30 : 20) + (q.type === 'critico' ? 25 : 0)) {
    q.special = false;
    if (q.req && q.req.mg) q.req = null;
    say(q, pick(['Va bene, fammelo normale.', 'Niente di speciale, allora. Pazienza.', 'Ok, va bene anche semplice.']), 2.4);
    emo(q, 'sweat', 2);
  }
  if (q && q.state === 'order' && !q.special) {
    const r = q.order.s === 'k' ? cookRate() + baristaRate() * 0.3 : q.order.s === 'v' ? baristaRate() * 1.6 : baristaRate();
    q.prog += rushStaff(r) * dt;
    if (q.prog >= q.order.t) serve(q, 0);
  }
  people.forEach(c => {
    updCust(c, dt);
    if (c.pet) updPet(c, dt);
  });
  petSocial(dt);
  activeTick(dt);
  socialAI(dt);
  people = people.filter(c => !c.dead);
  musicianOn = people.some(p => p.state === 'sit' && p.act === 'guitar');
  scenes.forEach(s => updScene(s, dt));
  scenes = scenes.filter(s => !s.done);
  for (const k in groups) if (!people.some(p => p.group === k) && !timers.length) delete groups[k];
  syncStaff();
  baristas.forEach((b, i) => updBarista(b, i, dt));
  waiters.forEach(w => updWaiter(w, dt));
  if (managerS) updManager(managerS, dt);
  const h = hour();
  if (st.ev === 'openmic' && h >= 20.5 && h < 23.5) {
    if (!performer) {
      performer = {
        id: ++uid,
        look: CH.tommy.l,
        name: 'Tommy',
        x: Math.max(angX + 12, colX[cols - 1] - 30),
        y: 128,
        face: 1,
        wt: 0,
        state: 'perf',
        jt: 2,
        bub: null
      };
    }
    performer.jt -= dt;
    if (performer.bub) {
      performer.bub.t -= dt;
      if (performer.bub.t <= 0) performer.bub = null;
    }
    if (performer.jt <= 0) {
      performer.jt = rnd(7, 11);
      say(performer, pick(JOKES), 4, 'Tommy');
      setTimeout(
        () =>
          people
            .filter(p => p.state === 'sit')
            .forEach(p => {
              if (Math.random() < 0.6) emo(p, 'laugh', 2);
            }),
        3500
      );
    }
  } else performer = null;
  if (st.cat && Math.random() < dt * 0.4) parts.push({ x: counterX + 40, y: 88, vx: 2, vy: -5, t: 2, max: 2, k: 'z' });
  if (st.music && !blackout() && Math.random() < dt * 0.7)
    parts.push({ x: angX + 8, y: 118, vx: rnd(2, 5), vy: -6, t: 2, max: 2, k: 'note' });
  autoBuyT -= dt;
  if (st.manager >= 2 && st.autoBuy && autoBuyT <= 0) {
    autoBuyT = st.manager >= 3 ? 3 : 8;
    autoBuy();
  }
  if (st.manager)
    st.quests.forEach(q => {
      if (q.done && !q.cl) claimQ(q);
    });
  saveT -= dt;
  if (saveT <= 0) {
    saveT = 8;
    save();
  }
}
let autoBuyT = 5;
