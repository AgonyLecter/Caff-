// Il mondo che va avanti da solo: progetti personali, pareri chiesti a te, il quartiere, e storie che nascono da sole.
// I contenuti sono in js/dati/trame.js. Tutto succede solo mentre si gioca (come il resto del mondo).

// mondoOff: solo per i test che provano altro (come regia.off): niente progetti, pareri, quartiere e storie nate da sole
let mondoOff = false;
const regDi = id => st.regs.find(r => r.id === id);
const inLocale = r => people.find(p => !p.dead && p.reg === r) || null;
// seduto, libero, senza altro in corso
const libero = c => !!c && !c.dead && c.state === 'sit' && !!c.seat && !c.scene && !c.story && !c.tut && !c.rare && !c.waitScene;
const genO = (t, k, n) => t.replace(new RegExp('\\{' + k + ':o\\}', 'g'), typeof donna === 'function' && donna({ n: n || '' }) ? 'a' : 'o');

/* ---------- Progetti ---------- */
const pjDi = r => (r && r.pj && PROGETTI.find(p => p.id === r.pj.id)) || null;
function pjNuovo(r, bonus) {
  const fatti = r.pjF || [],
    attivi = st.regs.filter(x => x.pj).map(x => x.pj.id),
    p = pers(r),
    ints = interessi(r);
  const L = PROGETTI.filter(P => !fatti.includes(P.id) && !attivi.includes(P.id) && (!P.sens || p.sens >= P.sens));
  if (!L.length) return null;
  const P = wpick(L, P => 1 + 3 * P.int.filter(i => ints.includes(i)).length);
  r.pj = { id: P.id, s: 0, d: st.day, ok: bonus || 0, ult: '', cf: 0, par: '' };
  impara(r, 'pj:' + r.id + ':' + P.id);
  logB(`${r.n} insegue un sogno: ${P.t}`);
  return P;
}
// riempie le frasi di un progetto per chi parla
const pjT = (t, r, P) => gO(t.replace(/\{P\}/g, P ? P.t : ''), r);
// un pensiero da dire appena possibile (c.pq): pensiero() lo dice per primo
function daDire(c, t) {
  c.pq = t;
  c.thinkT = Math.min(c.thinkT || 9, rnd(2, 4));
}
// a ogni visita: un progetto nuovo, o una tappa (con alti e bassi), o il traguardo
function mondoArrivo(c, r) {
  if (mondoOff) return;
  let P = pjDi(r);
  if (!P) {
    // non tutti insieme: qualche sogno alla volta, a chi è di casa da un po'
    const attivi = st.regs.filter(x => x.pj).length,
      max = clamp(1 + Math.floor(st.regs.length / 6), 1, 4);
    if (r.f >= 3 && r.v >= 5 && attivi < max && (r.pjD || 0) <= st.day && Math.random() < 0.25) {
      P = pjNuovo(r);
      if (P) daDire(c, pjT(scegli(P.an, 'pjan:' + P.id, r), r, P));
    }
    return;
  }
  if (r.pj.s >= P.passi) {
    // il grande giorno: se nessuna storia l'ha raccontato con un amico, arriva da solo dopo un paio di giorni
    if (!st.tr || !st.tr.some(T => T.id === 'grande' && T.cast.a === r.id)) {
      if (st.day >= (r.pj.pronto || st.day) + 2) {
        const ok = pjFine(r);
        const P2 = PROGETTI.find(p => p.id === (r.pjF || []).slice(-1)[0]);
        if (P2) daDire(c, pjT(scegli(P2[ok ? 'si' : 'no'], 'pjf:' + P2.id, r), r, P2));
      }
    }
    return;
  }
  if (r.pj.d >= st.day) return; // una tappa al giorno, al massimo
  r.pj.d = st.day;
  const pr = clamp(0.5 + mn(r).u * 0.2 + r.pj.ok, 0.15, 0.9);
  if (Math.random() < pr) {
    r.pj.s++;
    r.pj.ult = 'su';
    daDire(c, pjT(scegli(P.su, 'pjsu:' + P.id, r), r, P));
    mn(r).u = clamp(mn(r).u + 0.08, -1, 1);
  } else {
    r.pj.ult = 'giu';
    daDire(c, pjT(scegli(P.giu, 'pjgiu:' + P.id, r), r, P));
    mn(r).u = clamp(mn(r).u - 0.1, -1, 1);
  }
  if (r.pj.s >= P.passi) r.pj.pronto = st.day;
}
// com'è finita: dipende dall'umore, da chi l'ha sostenuto e da cosa gli hai detto tu
function pjFine(r) {
  const P = pjDi(r);
  if (!P) return false;
  const ok = Math.random() < clamp(0.5 + r.pj.ok + mn(r).u * 0.15, 0.2, 0.92);
  const par = r.pj.par;
  r.pjF = (r.pjF || []).concat(P.id);
  r.pjD = st.day + ri(3, 6);
  r.pj = null;
  memo(r, ok ? 'traguardo' : 'delusione', { v: ok ? 2 : -1.2 });
  mn(r).u = clamp(mn(r).u + (ok ? 0.4 : -0.25), -1, 1);
  notizia(ok ? 'successo' : 'delusione', r, r);
  logB(`${r.n}: ${P.t} — ${ok ? 'ce l’ha fatta!' : 'non è andata, per ora'}`);
  toast(`${r.n}: ${P.t} — ${ok ? 'ce l’ha fatta! ♥' : 'non è andata, ma non molla'}`);
  if (ok) {
    st.hearts++;
    if (P.premio === 'cane') mondoW({ a: r }).cane('a', pick(PETN));
  }
  st.pjLog = st.pjLog || [];
  st.pjLog.unshift({ n: r.n, t: P.t, ok, d: st.day });
  if (st.pjLog.length > 30) st.pjLog.pop();
  // se ti aveva chiesto un parere, torna a dirtelo
  if (par) {
    const c = inLocale(r),
      t = PARERE_DOPO[ok ? 'si' : 'no'][par];
    if (c && t) timers.push({ t: 4.5, fn: () => c.state === 'sit' && !c.scene && say(c, gO(t, r), sayDur(t), r.n) });
  }
  return ok;
}
// quando dici qualcosa a chi ti chiede un parere: va bene se si adatta al suo carattere
function parereVa(r, k) {
  const p = pers(r),
    u = mn(r).u;
  if (k === 'consola') return p.sens >= 0.55 || u < -0.2;
  if (k === 'sprona') return (p.ene >= 0.55 || p.soc >= 0.6) && u > -0.3;
  return p.iro >= 0.5 && u > -0.4;
}
function parereScena(c) {
  const r = c.reg,
    P = pjDi(r);
  if (mondoOff || !P || r.pj.cf || r.f < 3 || !(r.pj.ult === 'giu' || r.pj.s >= P.passi - 1)) return false;
  if (!regiaFree() || !momOk('trama')) return false;
  r.pj.cf = 1;
  const key = 'pj_' + r.id,
    fill = t => gO(t.replace(/\{a\}/g, r.n).replace(/\{P\}/g, P.t), r);
  const lines = [
    [0, fill(scegli(P.dubbio, 'pjdub:' + P.id, r))],
    {
      c: {
        q: fill(PARERE.q),
        o: Object.keys(PARERE.o).map(k => ({
          t: PARERE.o[k],
          f: key + '=' + k,
          r: [[0, fill(scegli(PARERE[parereVa(r, k) ? 'bene' : 'male'][k], 'par:' + k, r))]]
        }))
      }
    }
  ];
  momCount('trama');
  startScene([c], lines, {
    story: 'trama',
    mood: 'chat',
    onEnd: () => {
      const k = st.flags[key];
      delete st.flags[key];
      if (!k || !r.pj) return;
      r.pj.par = k;
      if (parereVa(r, k)) {
        r.pj.ok += 0.15;
        r.f = Math.min(10, r.f + 1);
        memo(r, 'parere', { v: 1 });
      } else r.pj.ok += 0.03;
    }
  });
  return true;
}

/* ---------- Il quartiere ---------- */
const qzDi = () => (st.qz && QUARTIERE.find(q => q.id === st.qz.id)) || null;
function quartiereGiorno() {
  if (mondoOff) return;
  const Q = qzDi();
  if (Q && st.day > st.qz.fine) {
    if (Q.fine) toast('Nel quartiere: ' + Q.fine);
    st.qzF = (st.qzF || []).concat(Q.id).slice(-8);
    st.qz = null;
    if (Q.dopo) return quartiereAvvia(QUARTIERE.find(q => q.id === Q.dopo));
    return;
  }
  if (Q || st.day < 3 || Math.random() > 0.3) return;
  const L = QUARTIERE.filter(q => !q.solo && !(st.qzF || []).slice(-6).includes(q.id));
  if (L.length) quartiereAvvia(pick(L));
}
function quartiereAvvia(Q) {
  if (!Q) return;
  st.qz = { id: Q.id, d: st.day, fine: st.day + Q.dur };
  toast('Nel quartiere: ' + Q.n);
  logB('Nel quartiere: ' + Q.t);
}

/* ---------- Storie che nascono da sole ---------- */
// chi può vivere una storia: coppie e terzetti trovati guardando il mondo (legami, umori, progetti, quartiere)
const relDi = (A, B) => A && B && st.rel[relKey(A, B)];
function vicini(A, kinds) {
  return Object.entries(st.rel)
    .filter(([k, R]) => k.split('|').includes(A.id) && (kinds || CLOSE).includes(R.k))
    .map(([k]) => regDi(k.split('|').find(i => i !== A.id)))
    .filter(Boolean);
}
function coppieDove(f) {
  const out = [];
  for (const [k, R] of Object.entries(st.rel)) {
    const [a, b] = k.split('|').map(regDi);
    if (!a || !b) continue;
    rv(R);
    if (f(R, a, b)) out.push([a, b]);
    if (f(R, b, a)) out.push([b, a]);
  }
  return out;
}
const TRAME_CAST = {
  giu: () =>
    st.regs
      .filter(a => mn(a).u < -0.25)
      .flatMap(a => vicini(a, ['amici', 'migliori', 'famiglia', 'coppia', 'fidanzati', 'sposati']).map(b => ({ a, b }))),
  rivali: () => coppieDove((R, a, b) => R.k === 'rivali' && R.te >= 35 && !R.peace && a.id < b.id).map(([a, b]) => ({ a, b })),
  lontani: () =>
    coppieDove((R, a, b) => CLOSE.includes(R.k) && R.k !== 'cotta' && st.day - (R.ld || R.d || st.day) >= 8 && a.id < b.id).map(
      ([a, b]) => ({ a, b })
    ),
  cotta: () =>
    coppieDove((R, a) => ['conoscenti', 'amici', 'cotta'].includes(R.k) && R.at >= 35 && pers(a).soc < 0.65).map(([a, b]) => ({ a, b })),
  segreto: () =>
    coppieDove((R, a) => ['conoscenti', 'amici', 'cotta'].includes(R.k) && R.at >= 35).flatMap(([a, b]) =>
      vicini(a, ['amici', 'migliori'])
        .filter(c => c !== b && (pers(c).soc >= 0.6 || interessi(c).includes('pettegolezzi')))
        .map(c => ({ a, b, c }))
    ),
  nuovo: () =>
    st.regs
      .filter(a => a.v <= 6 && vicini(a, null).length <= 1 && pers(a).soc < 0.55)
      .flatMap(a =>
        st.regs
          .filter(b => b !== a && pers(b).cal >= 0.55 && pers(b).soc >= 0.5 && !relDi(a, b))
          .flatMap(b =>
            vicini(b, ['amici', 'migliori'])
              .filter(c => c !== a && !relDi(a, c))
              .map(c => ({ a, b, c }))
          )
      ),
  gelosia: () =>
    coppieDove((R, a) => ['coppia', 'fidanzati', 'sposati'].includes(R.k)).flatMap(([a, b]) =>
      vicini(b, ['amici', 'migliori'])
        .filter(c => c !== a)
        .map(c => ({ a, b, c }))
    ),
  grande: () => st.regs.filter(a => pjDi(a) && a.pj.s >= pjDi(a).passi).flatMap(a => vicini(a).map(b => ({ a, b }))),
  mano: () =>
    st.regs
      .filter(a => !a.pj && mn(a).mem.some(m => m.k === 'delusione' && st.day - m.d <= 6))
      .flatMap(a =>
        vicini(a)
          .filter(b => pers(b).cal >= 0.5)
          .map(b => ({ a, b }))
      ),
  adozione: () => (st.qz && st.qz.id === 'cane' ? st.regs.filter(a => !a.pet && interessi(a).includes('animali')).map(a => ({ a })) : []),
  festa: () =>
    st.qz && st.qz.id === 'festa' ? coppieDove((R, a, b) => CLOSE.includes(R.k) && a.id < b.id).map(([a, b]) => ({ a, b })) : []
};
// le storie che dipendono da un fatto (un progetto al traguardo, il quartiere) hanno la precedenza
const TRAME_PESO = { grande: 6, adozione: 5, festa: 4, mano: 3, giu: 3, cotta: 2, lontani: 2, rivali: 2, nuovo: 2, gelosia: 1, segreto: 1 };
const occupato = r => (st.tr || []).some(T => Object.values(T.cast).includes(r.id));
const disponibile = r => r && !occupato(r) && regWeight(r) > 0;
function trameNuova() {
  st.tr = st.tr || [];
  st.trFatte = st.trFatte || {};
  const C = [];
  TRAME.forEach(TR => {
    const f = TRAME_CAST[TR.cast];
    if (!f || st.tr.some(T => T.id === TR.id)) return; // la stessa storia non gira due volte insieme
    f().forEach(cast => {
      const rs = Object.values(cast);
      if (!rs.every(disponibile)) return;
      const firma = TR.id + ':' + rs.map(r => r.id).join('|') + (TR.id === 'grande' ? ':' + cast.a.pj.id : '');
      if (st.trFatte[firma]) return;
      C.push({ TR, cast, firma });
    });
  });
  if (!C.length) return null;
  const o = wpick(C, x => TRAME_PESO[x.TR.cast] || 1);
  st.trN = (st.trN || 0) + 1;
  st.trFatte[o.firma] = st.day;
  const T = { u: st.trN, id: o.TR.id, cast: {}, s: 0, d: st.day, log: [] };
  for (const k in o.cast) T.cast[k] = o.cast[k].id;
  st.tr.push(T);
  st.trD = st.day;
  return T;
}
const castDi = T => {
  const o = {};
  for (const k in T.cast) o[k] = regDi(T.cast[k]);
  return o;
};
// gli strumenti con cui una storia cambia il mondo (usati da fine e calc in js/dati/trame.js)
function mondoW(cast, pref) {
  const R = x => cast[x];
  const legame = (x, y) => {
    const A = R(x),
      B = R(y);
    if (!A || !B) return null;
    return rv(st.rel[relKey(A, B)] || relCresce(A, B));
  };
  return {
    rel(x, y, d) {
      const r = legame(x, y);
      if (!r) return;
      for (const k in d) r[k] = clamp((r[k] || 0) + d[k], 0, 100);
      r.ld = st.day;
    },
    umore: (x, v) => R(x) && (mn(R(x)).u = clamp(mn(R(x)).u + v, -1, 1)),
    ricordo: (x, k, y, v) => R(x) && memo(R(x), k, { w: R(y) ? R(y).id : '', v }),
    affetto: (x, n) => R(x) && (R(x).f = clamp(R(x).f + n, 0, 10)),
    attrazione: (x, y) => (legame(x, y) || {}).at || 0,
    scelta: v => !!pref && st.flags[pref + '_' + v] === '1',
    notizia: (k, x, y) => R(x) && R(y) && notizia(k, R(x), R(y)),
    ritrovati(x, y) {
      const r = legame(x, y);
      if (r) r.ld = st.day;
    },
    pace(x, y) {
      const r = legame(x, y);
      if (!r || r.k !== 'rivali') return;
      r.k = 'amici';
      r.lv = 1;
      r.peace = 0;
      r.cd = st.day;
      notizia('pace', R(x), R(y));
      logB(`${R(x).n} e ${R(y).n}: da rivali ad amici`);
    },
    insieme(x, y) {
      const r = legame(x, y);
      if (!r) return;
      r.k = 'coppia';
      r.lv = 0;
      r.cd = st.day;
      r.at = Math.max(r.at, 60);
      memo(R(x), 'coppia', { w: R(y).id, v: 2 });
      memo(R(y), 'coppia', { w: R(x).id, v: 2 });
      notizia('coppia', R(x), R(y));
      evento('coppia', R(x), R(y));
      logB(`${R(x).n} e ${R(y).n} si sono messi insieme ♥`);
      toast(`${R(x).n} e ${R(y).n} si sono messi insieme ♥`);
    },
    presenta(x, y) {
      if (R(x) && R(y) && !relDi(R(x), R(y))) relCresce(R(x), R(y), { a: 10, fi: 6 });
    },
    progettoFine: x => pjFine(R(x)),
    aiuto(x) {
      const A = R(x);
      if (A && !A.pj) {
        A.pjD = 0;
        pjNuovo(A, 0.2);
      }
    },
    cane(x, n) {
      const A = R(x);
      if (!A) return;
      const cc = pick(PETC.cane);
      A.pet = { k: 'cane', n: n || pick(PETN), c: cc[0], c2: cc[1], s: '' };
      A.petR = 1;
      logB(`${A.n} ha adottato un cane: ${A.pet.n}`);
    }
  };
}
// riempie le battute di una storia: {a} {b} {c}, {x:o}, {P}, {Q}, {o} di chi parla, {item}
function trFill(t, cast, sp) {
  if (!t) return t;
  for (const k of ['a', 'b', 'c']) {
    const r = cast[k];
    t = genO(t, k, r && r.n).replace(new RegExp('\\{' + k + '\\}', 'g'), r ? r.n : '');
  }
  const P = pjDi(cast.a) || PROGETTI.find(p => p.id === ((cast.a && cast.a.pjF) || []).slice(-1)[0]),
    Q = qzDi();
  t = t
    .replace(/\{P\}/g, P ? P.t : 'quello che inseguiva')
    .replace(/\{Q\}/g, Q ? Q.t.toLowerCase() : '')
    .replace(/\{item\}/g, ((sp && sp.order) || MENU[0]).n);
  return gO(t, (sp && sp.reg) || {});
}
// fa partire un passo con i personaggi già seduti (mem, nell'ordine di who)
function trAvvia(T, mem) {
  const TR = TRAME.find(x => x.id === T.id),
    step = TR && TR.passi[T.s];
  if (!step) return false;
  const cast = castDi(T),
    pref = 'tr' + T.u,
    W = mondoW(cast, pref);
  // ogni scelta e ogni esito calcolato ha il suo segnalino: trN_valore=1
  if (step.calc) st.flags[pref + '_' + step.calc(W).slice(1)] = '1';
  const cond = c => (c && c[0] === '@' ? pref + '_' + c.slice(1) + '=1' : c);
  const lines = step.l.map(l => {
    if (Array.isArray(l)) return [l[0], trFill(l[1], cast, mem[l[0]]), cond(l[2])];
    return {
      c: {
        q: trFill(l.c.q, cast, mem[0]),
        o: l.c.o.map(o => ({ t: trFill(o.t, cast, mem[0]), f: cond(o.f), r: o.r.map(x => [x[0], trFill(x[1], cast, mem[x[0]])]) }))
      }
    };
  });
  momCount('trama');
  T.on = 1;
  startScene(mem, lines, {
    story: 'trama',
    mood: TR.id === 'rivali' && T.s === 0 ? 'angry' : TR.id === 'cupido' || TR.id === 'gelosia' ? 'love' : 'chat',
    onEnd: sc => trFinePasso(T, sc, mondoW(castDi(T), pref))
  });
  return true;
}
function trFinePasso(T, sc, W) {
  const TR = TRAME.find(x => x.id === T.id),
    step = TR.passi[T.s];
  T.on = 0;
  T.log.push({
    lines: sc.lines.filter(l => Array.isArray(l)).map(l => [(sc.mem[l[0]] || sc.mem[0]).name, l[1]]),
    who: sc.mem.map(m => ({ n: m.name, look: m.look }))
  });
  if (step.fine) step.fine(W);
  T.s++;
  T.d = st.day;
  if (T.s < TR.passi.length) return save();
  // la storia è finita: entra nel Diario
  const cast = castDi(T);
  st.trF = st.trF || [];
  st.trF.unshift({ id: T.id, t: TR.t, d: st.day, e: trFill(TR.d, cast, null), log: T.log });
  if (st.trF.length > 30) st.trF.pop();
  st.tr = st.tr.filter(x => x !== T);
  Object.keys(st.flags).forEach(k => k.startsWith('tr' + T.u + '_') && delete st.flags[k]);
  st.hearts++;
  const c = sc.mem[0];
  if (c) {
    addCoins(reward(45), c.x, c.y - 26);
    floats.push({ x: c.x, y: c.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
  }
  toast(`Una storia nata da sola: «${TR.t}». La trovi nel Diario.`);
  logB(`Storia nata da sola: ${TR.t}`);
  st.newStory = 1;
  save();
}
// cerca di mettere insieme i personaggi del prossimo passo: già seduti, o li fa arrivare
function trConvoca(T) {
  const TR = TRAME.find(x => x.id === T.id),
    step = TR && TR.passi[T.s];
  if (!step) return false;
  const cast = castDi(T),
    rs = step.who.split('').map(k => cast[k]);
  if (rs.some(r => !r)) {
    st.tr = st.tr.filter(x => x !== T); // qualcuno non c'è più: la storia si perde
    return false;
  }
  const cs = rs.map(inLocale);
  if (cs.every(libero) && (cs.length === 1 || slotOf(cs[0].seat) === slotOf(cs[1].seat))) return trAvvia(T, cs);
  if (cs.some(c => c && !libero(c))) return false; // qualcuno è impegnato (sta entrando, parla, racconta): si aspetta
  if (!rs.every((r, i) => cs[i] || regWeight(r) > 0)) return false;
  // tutti e due nel locale, a tavoli diversi: uno si alza e va a sedersi vicino all'altro
  if (cs.length === 2 && cs[0] && cs[1]) return trRaggiungi(T, cs[1], cs[0]) || trRaggiungi(T, cs[0], cs[1]);
  if (queue.length > 4) return false;
  // chi manca arriva (insieme, se mancano tutti e due)
  if (cs.length === 1 || cs[0] || cs[1]) {
    const i = cs[0] ? 1 : 0;
    if (!freeSeats().length) return false;
    const c = newCust({ look: rs[i].look, name: rs[i].n, reg: rs[i], type: rs[i].type });
    c.trU = T.u;
    T.on = 1;
    return true;
  }
  const ok = spawnGroup(...rs.map(r => ({ look: r.look, name: r.n, reg: r, type: r.type })), { trU: T.u });
  if (ok) T.on = 1;
  return ok;
}
// si alza e va a sedersi al tavolo dell'altro, se c'è posto
function trRaggiungi(T, c, o) {
  const seat = slotOf(o.seat).seats.find(s => s !== o.seat);
  if (!seat || seat.occ || seat.dirty || seat.res) return false;
  c.seat.occ = null;
  c.keepSit = c.sitT;
  seat.occ = c;
  c.seat = seat;
  c.state = 'toSeat';
  c.path = [
    { x: c.x, y: LANE },
    { x: seat.x, y: LANE },
    { x: seat.x, y: seat.y }
  ];
  c.trU = T.u;
  T.on = 1;
  say(c, gO(scegli(JOINF, 'joinf', c.reg), c.reg), 2.4, c.name);
  return true;
}
// quando arriva qualcuno convocato da una storia (da solo o in compagnia)
function tramaOnSit(c, mem) {
  const u = mem ? groups[mem[0].group] && groups[mem[0].group].trU : c.trU;
  if (!u) return false;
  const T = (st.tr || []).find(x => x.u === u);
  if (!T) return false;
  if (c) c.trU = 0;
  if (mem) return trAvvia(T, mem);
  // arrivato da solo: se il passo è a due, parte solo se l'altro è già al suo tavolo (se no ci pensa trameTick)
  const TR = TRAME.find(x => x.id === T.id),
    step = TR && TR.passi[T.s];
  if (!step) return false;
  const cs = step.who.split('').map(k => inLocale(castDi(T)[k]));
  if (cs.length === 2 && !(cs.every(Boolean) && cs.every(x => x === c || libero(x)) && slotOf(cs[0].seat) === slotOf(cs[1].seat))) {
    T.on = 0;
    return false;
  }
  return trAvvia(T, cs.length === 2 ? cs : [c]);
}
let trT = 4;
function trameTick(dt) {
  trT -= dt;
  if (trT > 0 || intro || tut || mondoOff) return;
  trT = 3;
  st.tr = st.tr || [];
  // un passo per volta, quando la regia è libera; le storie bloccate da troppo tempo si perdono
  st.tr = st.tr.filter(T => st.day - T.d <= 14);
  if (!regiaFree() || !momOk('trama') || scenes.some(s => s.story === 'trama')) return;
  for (const T of st.tr) {
    const TR = TRAME.find(x => x.id === T.id);
    if (!TR) continue;
    if (T.on) {
      // qualcuno sta arrivando: si aspetta che si sieda (se non arriva più, si riprova)
      const cs = Object.values(T.cast)
        .map(id => inLocale(regDi(id)))
        .filter(Boolean);
      if (cs.some(c => c.state !== 'sit')) continue;
      T.on = 0;
    }
    const gap = (TR.passi[T.s] && TR.passi[T.s].gap) || 0;
    if (T.s > 0 && st.day < T.d + gap) continue;
    if (trConvoca(T)) return;
  }
  // una storia nuova al giorno, al massimo due in corso
  if (st.tr.length < 2 && (st.trD || 0) < st.day && st.regs.length >= 3) trameNuova();
}

/* ---------- Il mondo nelle chiacchiere e nei pensieri ---------- */
// argomenti in più per conversa(): i progetti degli altri, il quartiere
function mondoTemi(C, x, S, O, di, es, dopo, sty) {
  const P = pjDi(S);
  if (P) {
    const nota = 'pj:' + S.id + ':' + P.id,
      sa = conosce(O, nota);
    C.push({
      k: 'progetto',
      w: sa ? 3 : 2.5,
      run: () => {
        if (sa) {
          di(1 - x, scegli(PJ_CHIEDI, 'pjch', O).replace(/\{P\}/g, P.t));
          di(x, pjT(scegli(P[S.pj.ult === 'giu' ? 'giu' : 'su'], 'pjst:' + P.id, S), S, P));
        } else {
          di(x, pjT(scegli(P.an, 'pjan:' + P.id, S), S, P));
          dopo.push(() => impara(O, nota));
        }
        di(1 - x, scegli(PJ_TIFO[sty[1 - x]], 'pjt:' + sty[1 - x], O));
        es.a += 5;
        es.fi += 4;
        dopo.push(() => S.pj && (S.pj.ok = Math.min(0.4, S.pj.ok + 0.03))); // chi ha chi fa il tifo ce la fa più spesso
      }
    });
  }
  const Q = qzDi();
  if (Q && x === 0)
    C.push({
      k: 'quartiere',
      w: 1.6,
      run: () => {
        di(x, scegli(Q.l, 'qz:' + Q.id, S));
        di(1 - x, scegli(QZ_R[sty[1 - x]], 'qzr:' + sty[1 - x], O));
        es.a += 3;
      }
    });
}
// pensieri in più: il progetto, il quartiere
function mondoPensieri(c, add, addP) {
  const r = c.reg,
    P = pjDi(r);
  if (P) addP(1.2, P[r.pj.ult === 'giu' ? 'giu' : 'su'], 'pjst:' + P.id);
  const Q = qzDi();
  if (Q) addP(1.4, Q.l, 'qz:' + Q.id);
}
