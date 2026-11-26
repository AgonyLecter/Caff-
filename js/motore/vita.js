// Vite degli habitué, personaggi chiave, incontri, routine e vita autonoma.

function fFlag(r) {
  return 'fl_' + r.id;
}
function filoLines(lines, r) {
  const k = fFlag(r);
  return lines.map(l => {
    if (Array.isArray(l)) return l[2] && l[2][0] === '@' ? [l[0], l[1], k + '=' + l[2].slice(1)] : l;
    return { c: { q: l.c.q.replace(/\{A\}/g, r.n), o: l.c.o.map(o => ({ t: o.t, f: k + '=' + o.f.slice(1), r: o.r })) } };
  });
}
function filoReady(r) {
  if (r.f < 3) return false;
  if (r.fl) return r.fl.day !== st.day || r.fl.s === 0;
  return (r.fn || 0) <= st.day && filoLibero(r);
}
// Ogni vita (FILI e FILI2) la vive una persona sola (o una coppia sola): così non capita mai di leggere
// la stessa storia, con le stesse parole, per due persone diverse. st.fU e st.f2U sono le vite già prese.
function vitePrese() {
  if (!st.fU) {
    // salvataggi vecchi: raccoglie le vite già vissute o in corso
    const a = new Set(),
      b = new Set();
    st.regs.forEach(r => {
      (r.fd || []).forEach(id => a.add(id));
      if (r.fl) a.add(r.fl.id);
    });
    Object.values(st.rel || {}).forEach(R => {
      (R.fd || []).forEach(id => b.add(id));
      if (R.fl) b.add(R.fl.id);
    });
    st.fU = [...a];
    st.f2U = [...b];
  }
  st.f2U = st.f2U || [];
  return st;
}
const filoPreso = id => vitePrese().fU.includes(id);
const duoPreso = id => vitePrese().f2U.includes(id);
function filoLibero(r) {
  return FILI.some(f => !filoPreso(f.id) && (f.ok(r) || (!f.p && !(r.type === 'nonno' && ['bici', 'compleanno'].includes(f.id)))));
}
function startFilo(c) {
  const r = c.reg;
  if (!r.fl) {
    const opts = FILI.filter(f => !filoPreso(f.id) && f.ok(r)),
      pri = opts.filter(f => f.p);
    const any = FILI.filter(f => !f.p && !filoPreso(f.id) && !(r.type === 'nonno' && ['bici', 'compleanno'].includes(f.id)));
    if (!opts.length && !any.length) return false;
    const F = pick(pri.length ? pri : opts.length ? opts : any);
    r.fl = { id: F.id, s: 0, day: -1, log: [] };
    st.fU.push(F.id);
  }
  const F = FILI.find(f => f.id === r.fl.id);
  if (!F) {
    r.fl = null;
    return false;
  }
  const step = r.fl.s,
    lines = fillT(filoLines(F.b[step], r), c, null);
  momCount('vita');
  startScene([c], lines, {
    story: 'filo',
    onEnd: () => {
      const sc = c._fsc;
      let ch = null;
      F.b[step].forEach(l => {
        if (l && l.c)
          l.c.o.forEach(o => {
            if (st.flags[fFlag(r)] === o.f.slice(1)) ch = o.t;
          });
      });
      if (sc)
        r.fl.log.push({
          l: sc.lines.filter(Array.isArray).map(x => x[1]),
          ch,
          at: ch ? sc.lines.indexOf(sc.lines.find(x => !Array.isArray(x))) : 0
        });
      r.fl.s++;
      r.fl.day = st.day;
      if (r.fl.s >= F.b.length) {
        const end = st.flags[fFlag(r)] || 'a',
          E = F.e[end] || F.e.a;
        delete st.flags[fFlag(r)];
        if (F.id === 'cane' && end === 'a' && !r.pet) {
          r.pet = { k: 'cane', n: 'Chicco', c: '#c98a4a', c2: '#8a5a3a', s: '' };
          r.petR = 1;
        }
        st.fdone = st.fdone || [];
        st.fdone.unshift({ n: r.n, rid: r.id, t: F.t, e: E, d: st.day, log: r.fl.log, look: r.look });
        if (st.fdone.length > 60) st.fdone.pop();
        (r.fd = r.fd || []).push(F.id);
        r.fl = null;
        r.fn = st.day + 2;
        r.f = Math.min(10, r.f + 1);
        r.ns = (r.ns || 0) + 1;
        st.hearts++;
        const b = reward(75);
        addCoins(b, c.x, c.y - 26);
        floats.push({ x: c.x, y: c.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
        toast(`Storia di ${r.n} conclusa: ${E}`);
        logB(`${r.n} ${E}`);
        sfx('story');
        st.newStory = 1;
        if (st.ds) st.ds.stories++;
      } else {
        toast(`${r.n}: «${F.t}» continua nel Diario`);
        st.newStory = 1;
      }
      save();
    }
  });
  c._fsc = scenes[scenes.length - 1];
  return true;
}
const keyReg = k => st.regs.find(r => r.key === k);
function ensureKeyRegs() {
  let added = [];
  for (const k in KEYS) {
    const K = KEYS[k];
    if (keyReg(k) || !K.ok()) continue;
    const C = CH[k];
    const r = {
      id: 'k_' + k,
      key: k,
      n: C.n,
      look: C.l,
      type: K.type,
      fav: K.fav,
      v: 0,
      f: 6,
      tr: K.tr.slice(),
      petR: 1,
      pet: C.l.pet || null,
      hr: 0,
      hn: 0,
      tb: {}
    };
    st.regs.push(r);
    added.push(C.n);
  }
  if (added.length) {
    toast(
      added.length > 1
        ? `${added.slice(0, -1).join(', ')} e ${added[added.length - 1]} ora sono di casa: torneranno spesso`
        : `${added[0]} ora è di casa: tornerà spesso`
    );
    logB(`Ora sono di casa: ${added.join(', ')}`);
  }
  for (const [a, b, ok, kf] of KSEED) {
    const A = keyReg(a),
      B = keyReg(b);
    if (!A || !B || !ok()) continue;
    const k = relKey(A, B),
      kind = kf(),
      r = st.rel[k];
    if (!r) st.rel[k] = { k: kind, lv: 0, d: st.day, seed: 1 };
    else if (r.seed && r.k !== kind) {
      r.k = kind;
      r.lv = 0;
    }
  }
}
function keyBusy(k) {
  return people.some(p => !p.dead && (p.key === k || (p.reg && p.reg.key === k)));
}
function keyLine(c) {
  const K = KEYS[c.reg && c.reg.key];
  if (!K) return null;
  const ok = K.l.filter(x => typeof x === 'string' || fl(x[1]));
  if (!ok.length) return null;
  const x = pick(ok);
  return typeof x === 'string' ? x : x[0];
}
function xsFor(mem) {
  const ks = mem.map(c => c.reg && c.reg.key);
  if (ks.some(k => !k)) return null;
  st.xs = st.xs || {};
  const L = (mem.length === 1 ? XEPI : XS).filter(
    x => !st.xs[x.id] && x.w.length === mem.length && x.w.every(k => ks.includes(k)) && x.req()
  );
  return L[0] || null;
}
function playXS(mem, x) {
  st.xs[x.id] = 1;
  momCount('incontro');
  const ord = x.w.map(k => mem.find(c => c.reg.key === k));
  startScene(ord, x.l, {
    story: 'filo',
    mood: 'chat',
    onEnd: () => {
      st.hearts++;
      const c = ord[0],
        b = reward(60);
      addCoins(b, c.x, c.y - 26);
      floats.push({ x: c.x, y: c.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
      st.xlog = st.xlog || [];
      st.xlog.unshift({ id: x.id, d: st.day });
      toast(ord.length > 1 ? `Incontro: ${ord[0].name} e ${ord[1].name}` : `${ord[0].name} ti racconta com'è andata`);
      sfx('story');
      st.newStory = 1;
      save();
    }
  });
}
function tryCross() {
  if (!regiaFree() || !momOk('incontro')) return false;
  st.xs = st.xs || {};
  const L = XS.filter(
    x =>
      !st.xs[x.id] &&
      x.req() &&
      x.w.every(k => {
        const r = keyReg(k);
        return r && !present(r) && regWeight(r) > 0;
      })
  );
  if (!L.length) return false;
  const x = pick(L),
    [a, b] = x.w.map(keyReg);
  return spawnGroup({ look: a.look, name: a.n, reg: a, type: a.type }, { look: b.look, name: b.n, reg: b, type: b.type }, { rel: 1 });
}
function keyRt(a, b) {
  const ka = a.reg.key,
    kb = b.reg.key;
  const arcs = ARCS.filter(x => arcDone(x.id) && x.rt && x.rt.length);
  for (const arc of arcs) {
    const w = arc.ch[arc.ch.length - 1].who || arc.who;
    if (w.length === 2 && w.includes(ka) && w.includes(kb)) {
      const L = pick(arc.rt);
      return w[0] === ka ? [L, [a, b]] : [L, [b, a]];
    }
  }
  return null;
}
// Ogni habitué impara le sue abitudini (ora, tavolo), le coppie e gli amici hanno un giorno fisso della settimana,
// e chi è seduto da solo a volte si alza per andare a sedersi vicino a qualcuno: così nascono nuove conoscenze.
const CLOSE = ['amici', 'migliori', 'coppia', 'fidanzati', 'famiglia', 'sposati', 'cotta'];
const WD = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
const wday = d => WD[((d || st.day) - 1) % 7];
function learnRoutine(r) {
  const h = hour();
  r.hr = r.hn ? (r.hr * Math.min(r.hn, 8) + h) / (Math.min(r.hn, 8) + 1) : h;
  r.hn = (r.hn || 0) + 1;
}
function favTable(r) {
  if (!r.tb) return -1;
  let b = -1,
    bv = 1;
  for (const k in r.tb)
    if (r.tb[k] > bv) {
      bv = r.tb[k];
      b = +k;
    }
  return b;
}
function regWeight(r) {
  if (r.key) {
    const K = KEYS[r.key];
    if (!K || !K.ok() || keyBusy(r.key)) return 0;
  }
  let w = r.key ? 1.6 * ((KEYS[r.key].w && KEYS[r.key].w()) || 1) : 1;
  if ((r.hn || 0) >= 3) {
    const d = hour() - r.hr;
    w *= 0.35 + 2.4 * Math.exp(-(d * d) / 3);
  }
  return w;
}
function pickReg() {
  const L = st.regs.filter(x => !present(x));
  if (!L.length) return null;
  const r = wpick(L, regWeight);
  return regWeight(r) > 0 ? r : null;
}
function ritual() {
  const h = hour();
  if (h < 9 || h > 23) return false;
  for (const [k, v] of Object.entries(st.rel)) {
    if (!CLOSE.includes(v.k) || v.k === 'cotta') continue;
    if (v.rit == null) v.rit = (st.day + Object.keys(st.rel).indexOf(k)) % 7;
    if (v.rit !== (st.day - 1) % 7 || v.ritD === st.day) continue;
    const [a, b] = k.split('|').map(id => st.regs.find(r => r.id === id));
    if (!a || !b || present(a) || present(b) || !regWeight(a) || !regWeight(b)) continue;
    if (Math.random() > 0.5) continue;
    if (spawnGroup({ look: a.look, name: a.n, reg: a, type: a.type }, { look: b.look, name: b.n, reg: b, type: b.type }, { rel: 1 })) {
      v.ritD = st.day;
      if (!v.ritN) {
        v.ritN = 1;
        toast(`Di ${wday()} ${a.n} e ${b.n} vengono sempre insieme`);
        logB(`${a.n} e ${b.n}: il ${wday()} è il loro giorno`);
      }
      return true;
    }
  }
  return false;
}
let aiT = 6;
function socialAI(dt) {
  aiT -= dt;
  if (aiT > 0) return;
  aiT = rnd(5, 9);
  const alone = people.filter(
    c =>
      c.reg &&
      c.state === 'sit' &&
      c.seat &&
      !c.scene &&
      !c.group &&
      !c.story &&
      !c.bub &&
      c.sitT > 8 &&
      !c.join &&
      (() => {
        const o = slotOf(c.seat).seats.find(s => s !== c.seat);
        return !o.occ && !o.res && !o.dirty;
      })()
  );
  if (alone.length < 2) return;
  const c = pick(alone),
    others = alone.filter(o => o !== c && slotOf(o.seat) !== slotOf(c.seat));
  if (!others.length) return;
  const scored = others
    .map(o => {
      const r = st.rel[relKey(c.reg, o.reg)];
      let w = 0.3;
      if (r) {
        if (r.k === 'rivali') w = 0;
        else if (['cotta', 'coppia', 'fidanzati', 'sposati'].includes(r.k)) w = 3;
        else if (CLOSE.includes(r.k)) w = 2;
        else w = 1;
      }
      const tr = c.reg.tr || [];
      if (tr.includes('chiacchierone')) w *= 1.8;
      if (tr.includes('romantico') && (!r || r.k === 'cotta')) w *= 1.4;
      if (tr.includes('timido')) w *= 0.35;
      if (mutual(c.reg, o.reg)) w *= 1.6;
      if (c.reg.key && o.reg.key && xsFor([c, o])) w = Math.max(w, 1) * 3;
      return { o, w };
    })
    .filter(x => x.w > 0);
  if (!scored.length) return;
  const t = wpick(scored, x => x.w);
  if (Math.random() > Math.min(0.85, t.w * 0.35)) return;
  const o = t.o,
    seat = slotOf(o.seat).seats.find(s => s !== o.seat);
  const r = st.rel[relKey(c.reg, o.reg)];
  c.seat.occ = null;
  c.keepSit = c.sitT;
  seat.occ = c;
  c.seat = seat;
  c.state = 'toSeat';
  c.join = o;
  c.path = [
    { x: c.x, y: LANE },
    { x: seat.x, y: LANE },
    { x: seat.x, y: seat.y }
  ];
  say(c, r && CLOSE.includes(r.k) ? pick(JOINF) : pick(JOINL), 2.6, c.name);
}
function mutual(A, B) {
  for (const [k, v] of Object.entries(st.rel)) {
    if (!CLOSE.includes(v.k)) continue;
    const ids = k.split('|');
    let m = null;
    if (ids.includes(A.id)) m = ids.find(x => x !== A.id);
    else continue;
    const r2 = st.rel[[m, B.id].sort().join('|')];
    if (r2 && CLOSE.includes(r2.k)) return st.regs.find(x => x.id === m) || null;
  }
  return null;
}
function duoLines(lines, k, A, B) {
  const it = (A && A.order) || MENU[0],
    f = t =>
      t
        .replace(/\{A\}/g, A.name)
        .replace(/\{B\}/g, B.name)
        .replace(/\{item\}/g, it.n);
  return lines.map(l => {
    if (Array.isArray(l)) return [l[0], f(l[1]), l[2] && l[2][0] === '@' ? k + '=' + l[2].slice(1) : l[2]];
    return { c: { q: f(l.c.q), o: l.c.o.map(o => ({ t: f(o.t), f: k + '=' + o.f.slice(1), r: o.r.map(x => [x[0], f(x[1])]) })) } };
  });
}
function duoReady(r) {
  if (!r || r.prop === 1 || r.peace) return false;
  if (r.fl) return r.fl.day !== st.day;
  return (r.fn || 0) <= st.day && FILI2.some(F => F.k.includes(r.k) && !duoPreso(F.id));
}
function startDuo(a, b) {
  const R = st.rel[relKey(a.reg, b.reg)];
  if (!R) return false;
  const key = 'f2_' + relKey(a.reg, b.reg);
  if (!R.fl) {
    const opts = FILI2.filter(F => F.k.includes(R.k) && !duoPreso(F.id));
    if (!opts.length) return false;
    R.fl = { id: pick(opts).id, s: 0, day: -1, log: [], a: a.reg.id };
    st.f2U.push(R.fl.id);
  }
  const F = FILI2.find(f => f.id === R.fl.id);
  if (!F) {
    R.fl = null;
    return false;
  }
  const A = R.fl.a === a.reg.id ? a : b,
    B = A === a ? b : a,
    step = R.fl.s;
  momCount('vita');
  startScene([A, B], duoLines(F.b[step], key, A, B), {
    story: 'filo',
    mood: ['coppia', 'fidanzati', 'sposati', 'cotta'].includes(R.k) ? 'love' : 'chat',
    onEnd: () => {
      const sc = A._dsc;
      let ch = null;
      F.b[step].forEach(l => {
        if (l && l.c)
          l.c.o.forEach(o => {
            if (st.flags[key] === o.f.slice(1)) ch = o.t.replace(/\{A\}/g, A.name).replace(/\{B\}/g, B.name);
          });
      });
      if (sc)
        R.fl.log.push({
          l: sc.lines.filter(Array.isArray).map(x => [(sc.mem[x[0]] || A).name, x[1]]),
          ch,
          at: ch ? sc.lines.indexOf(sc.lines.find(x => !Array.isArray(x))) : 0
        });
      R.fl.s++;
      R.fl.day = st.day;
      if (R.fl.s >= F.b.length) {
        const end = st.flags[key] || 'a',
          E = F.e[end] || F.e.a;
        delete st.flags[key];
        st.fdone = st.fdone || [];
        st.fdone.unshift({
          n: `${A.name} e ${B.name}`,
          t: F.t,
          e: E,
          d: st.day,
          log: R.fl.log,
          look: A.look,
          look2: B.look,
          n1: A.name,
          n2: B.name,
          duo: 1
        });
        if (st.fdone.length > 60) st.fdone.pop();
        (R.fd = R.fd || []).push(F.id);
        R.fl = null;
        R.fn = st.day + 3;
        if (F.fx) {
          R.k = F.fx;
          R.lv = 0;
          R.peace = 0;
        }
        if (F.id === 'gattino' && !A.reg.pet) {
          A.reg.pet = {
            k: 'gatto',
            n: end === 'a' ? 'Ciambella' : 'Zucchero',
            c: end === 'a' ? '#e8a060' : '#f4f1de',
            c2: end === 'a' ? '#b8703a' : '#e8a060'
          };
          A.reg.petR = 1;
        }
        st.hearts++;
        const bb = reward(90);
        addCoins(bb, A.x, A.y - 26);
        floats.push({ x: A.x, y: A.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
        toast(`${A.name} e ${B.name} ${E}`);
        logB(`${A.name} e ${B.name} ${E}`);
        sfx('story');
        st.newStory = 1;
      } else {
        toast(`${A.name} e ${B.name}: «${F.t}» continua nel Diario`);
        st.newStory = 1;
      }
      advanceRel(A.reg, B.reg);
      save();
    }
  });
  A._dsc = scenes[scenes.length - 1];
  return true;
}
