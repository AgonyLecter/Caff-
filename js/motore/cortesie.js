// Gentilezze tra clienti: offrire il caffè, cedere il posto, prestare l'ombrello (le frasi sono in js/dati/cortesie.js).
// Chi riceve può accettare o rifiutare, e ogni legame tiene il conto dei favori (R.fav): chi ha ricevuto tende a
// ricambiare, chi promette («la prossima tocca a me», R.pr) può mantenere o dimenticarsi, chi dà sempre senza ricevere
// ci resta male, e l'amico che non si alza quando potrebbe... se lo ricordano.

const favDi = (R, id) => (R.fav && R.fav[id]) || 0;
function favore(A, B, R) {
  R.fav = R.fav || {};
  R.fav[A.id] = favDi(R, A.id) + 1;
}
// >0: A ha dato più di B
const saldo = (R, A, B) => favDi(R, A.id) - favDi(R, B.id);
const stCli = c => stileDi(c.reg || c);
// riempie una frase di cortesia: chi parla (sp), l'altra persona (ot)
const cTxt = (t, sp, ot) =>
  gO(
    gX(t, ot.name)
      .replace(/\{X\}/g, ot.name)
      .replace(/\{item\}/g, (ot.order || sp.order || MENU[0] || {}).n || 'caffè'),
    sp.reg || sp
  );
const dice = (c, t, dopo) => timers.push({ t: dopo || 0.01, fn: () => !c.dead && say(c, t, sayDur(t), c.reg ? c.name : '') });
// chi è seduto, libero e conosce c
function amiciSeduti(c) {
  return people
    .filter(a => a !== c && !a.dead && a.reg && a.state === 'sit' && !a.scene && !a.story && !a.tut)
    .map(a => ({ a, R: st.rel[relKey(a.reg, c.reg)] }))
    .filter(x => x.R && x.R.k !== 'rivali' && x.R.lit !== 2)
    .map(x => ({ a: x.a, R: rv(x.R) }));
}
const cuore = c => floats.push({ x: c.x, y: c.y - 34, txt: '♥', t: 1.4, col: '#ff8fb8' });

/* ---------- Offrire il caffè (quando un conoscente arriva al bancone) ---------- */
function cortesiaOrdine(c) {
  if (mondoOff || !c.reg || c.tut || c.story || regia.live || (c.vis && c.vis.of)) return;
  c.vis = c.vis || {};
  c.vis.of = 1;
  const L = amiciSeduti(c);
  if (!L.length) return;
  // una promessa da mantenere viene prima di tutto
  const prom = L.find(x => x.R.pr === x.a.reg.id);
  if (prom) {
    const { a, R } = prom;
    R.pr = 0;
    if (Math.random() < 0.45 + pers(a.reg).cal * 0.45) return offri(a, c, R, scegli(CORTESIA.mantiene, 'c:mant', a.reg), true);
    // dimenticata: chi aspettava se lo ricorda
    dice(a, cTxt(pick(CORTESIA.dimentica), a, c), 0.6);
    memo(c.reg, 'promessa', { w: a.reg.id, v: -0.6 });
    R.te = clamp(R.te + 4, 0, 100);
    return;
  }
  const scored = L.map(({ a, R }) => {
    let w = pers(a.reg).cal * 0.5 + R.a / 200;
    if (saldo(R, c.reg, a.reg) > 0) w += 0.35; // gli deve un caffè
    if (saldo(R, a.reg, c.reg) >= 3) w *= 0.15; // offre sempre lui: si è stufato
    return { a, R, w };
  });
  const o = wpick(scored, x => x.w);
  if (!o || Math.random() > clamp(o.w * 0.55, 0, 0.7)) return;
  const deve = saldo(o.R, c.reg, o.a.reg) > 0,
    s = stCli(o.a);
  offri(o.a, c, o.R, scegli(CORTESIA[deve ? 'ricambia' : 'offre'][s], 'c:of' + (deve ? 'r' : '') + s, o.a.reg), deve);
}
function offri(a, c, R, frase, ricambio) {
  const A = a.reg,
    B = c.reg,
    sb = stCli(c);
  dice(a, cTxt(frase, a, c));
  // accetta o no: i brontoloni e i timidi rifiutano più spesso; chi deve già molto preferisce pagare
  let p = 0.75 + R.a / 300 - (sb === 'brontolone' ? 0.3 : 0) - (sb === 'timido' ? 0.15 : 0);
  if (saldo(R, A, B) >= 2) p -= 0.4;
  if (ricambio) p += 0.2;
  if (Math.random() < p) {
    const promessa = !ricambio && saldo(R, A, B) >= 1 && pers(B).cal >= 0.5 && Math.random() < 0.5;
    dice(c, cTxt(promessa ? scegli(CORTESIA.promette, 'c:prom', B) : scegli(CORTESIA.si[sb], 'c:si' + sb, B), c, a), 1.6);
    if (promessa) R.pr = B.id;
    favore(A, B, R);
    R.a = clamp(R.a + 3, 0, 100);
    R.fi = clamp(R.fi + (ricambio ? 5 : 2), 0, 100);
    memo(B, 'offerto', { w: A.id, v: 0.6 });
    mn(B).u = clamp(mn(B).u + 0.05, -1, 1);
    c.mood = Math.min(100, c.mood + 8);
    timers.push({ t: 1.7, fn: () => cuore(c) });
    if (saldo(R, A, B) >= 3) {
      memo(A, 'sbilancio', { w: B.id, v: -0.6 });
      R.te = clamp(R.te + 4, 0, 100);
    }
  } else {
    dice(c, cTxt(scegli(CORTESIA.no[sb], 'c:no' + sb, B), c, a), 1.6);
    if (sb === 'brontolone') R.a = clamp(R.a - 1, 0, 100);
  }
}

/* ---------- Cedere il posto (tavoli pieni) ---------- */
// restituisce il posto liberato per c, oppure null
function cortesiaPosto(c) {
  if (mondoOff) return null;
  const L = amiciSeduti(c).filter(x => !x.a.group);
  if (!L.length) return null;
  const scored = L.map(({ a, R }) => ({
    a,
    R,
    w: pers(a.reg).cal * 0.5 + R.a / 150 + (a.sitT < 8 ? 0.4 : 0) + (saldo(R, c.reg, a.reg) > 0 ? 0.2 : 0)
  })).sort((x, y) => y.w - x.w);
  const o = scored[0];
  if (Math.random() < clamp(o.w * 0.6, 0, 0.85)) {
    const sa = stCli(o.a),
      sb = stCli(c);
    dice(o.a, cTxt(scegli(CORTESIA.posto[sa], 'c:po' + sa, o.a.reg), o.a, c));
    if (Math.random() < (sb === 'timido' ? 0.65 : 0.8)) {
      dice(c, cTxt(scegli(CORTESIA.postoSi[sb], 'c:pos' + sb, c.reg), c, o.a), 1.5);
      const seat = o.a.seat;
      o.a.noDirty = 1; // porta la tazza al bancone, da persona educata
      o.a.noUmb = 1;
      leaveSeat(o.a);
      favore(o.a.reg, c.reg, o.R);
      o.R.a = clamp(o.R.a + 4, 0, 100);
      o.R.fi = clamp(o.R.fi + 3, 0, 100);
      memo(c.reg, 'posto', { w: o.a.reg.id, v: 0.8 });
      timers.push({ t: 1.6, fn: () => cuore(c) });
      return seat;
    }
    dice(c, cTxt(scegli(CORTESIA.postoNo[sb], 'c:pon' + sb, c.reg), c, o.a), 1.5);
    o.R.a = clamp(o.R.a + 1, 0, 100); // il pensiero conta
    return null;
  }
  // nessuno si alza: se un amico stretto poteva farlo, la cosa si incrina un po'
  const vicino = scored.find(x => CLOSE.includes(x.R.k) && x.R.k !== 'cotta');
  if (vicino && Math.random() < 0.5) {
    memo(c.reg, 'sgarbo', { w: vicino.a.reg.id, v: -0.8 });
    vicino.R.te = clamp(vicino.R.te + 5, 0, 100);
    vicino.R.a = clamp(vicino.R.a - 3, 0, 100);
    dice(c, cTxt(scegli(CORT_PENSA.sgarbo, 'c:sg', c.reg), c, vicino.a), 0.8);
  }
  return null;
}

/* ---------- L'ombrello (piove e qualcuno l'ha dimenticato) ---------- */
function cortesiaUscita(c) {
  if (mondoOff || !c.reg || c.story || c.tut || c.noUmb || !rainy() || Math.random() > 0.2) return;
  const L = amiciSeduti(c).filter(x => !x.R.omb);
  if (!L.length) return;
  const o = wpick(L, x => pers(x.a.reg).cal + x.R.a / 100);
  dice(c, cTxt(scegli(CORTESIA.dimenticato, 'c:dim', c.reg), c, o.a));
  dice(o.a, cTxt(scegli(CORTESIA.ombrello, 'c:om', o.a.reg), o.a, c), 1.3);
  if (Math.random() < 0.8) {
    dice(c, cTxt(scegli(CORTESIA.ombrelloSi, 'c:oms', c.reg), c, o.a), 2.6);
    o.R.omb = { da: o.a.reg.id, d: st.day, n: 0 };
    favore(o.a.reg, c.reg, o.R);
    o.R.a = clamp(o.R.a + 3, 0, 100);
  } else dice(c, cTxt(scegli(CORTESIA.ombrelloNo, 'c:omn', c.reg), c, o.a), 2.6);
}
// restituire l'ombrello (o dimenticarsene), quando sono tutti e due nel locale
let cortT = 5;
function cortesieTick(dt) {
  cortT -= dt;
  if (cortT > 0 || regia.live || intro || tut || mondoOff) return;
  cortT = rnd(4, 7);
  for (const [k, R] of Object.entries(st.rel)) {
    if (!R.omb || R.omb.d >= st.day || R.omb.t === st.day) continue;
    const ids = k.split('|'),
      chi = ids.find(i => i !== R.omb.da);
    const ow = people.find(p => !p.dead && p.reg && p.reg.id === R.omb.da && libero(p)),
      ho = people.find(p => !p.dead && p.reg && p.reg.id === chi && libero(p));
    if (!ow || !ho) continue;
    R.omb.t = st.day;
    if (Math.random() < 0.55 + pers(ho.reg).cal * 0.4) {
      dice(ho, cTxt(scegli(CORTESIA.rende, 'c:re', ho.reg), ho, ow));
      dice(ow, cTxt(scegli(CORTESIA.rendeR, 'c:rer', ow.reg), ow, ho), 1.6);
      R.omb = null;
      favore(ho.reg, ow.reg, R); // il cornetto conta
      R.a = clamp(R.a + 4, 0, 100);
      R.fi = clamp(R.fi + 5, 0, 100);
      timers.push({ t: 1.8, fn: () => cuore(ow) });
    } else {
      dice(ow, cTxt(scegli(CORTESIA.chiede, 'c:ch', ow.reg), ow, ho));
      dice(ho, cTxt(scegli(CORTESIA.scusa, 'c:sc', ho.reg), ho, ow), 1.6);
      R.omb.n++;
      R.te = clamp(R.te + 3, 0, 100);
      if (R.omb.n >= 3) memo(ow.reg, 'ombrello', { w: ho.reg.id, v: -1 });
    }
    return;
  }
}
// nel Diario, pagina dei Legami: come stanno con i favori
function cortN(k, R) {
  if (!R.fav) return '';
  const [a, b] = k.split('|'),
    fa = R.fav[a] || 0,
    fb = R.fav[b] || 0,
    nm = id => (st.regs.find(r => r.id === id) || {}).n || '?';
  if (fa >= 1 && fb >= 1 && Math.abs(fa - fb) <= 1) return ' · si offrono le cose a turno';
  if (Math.abs(fa - fb) >= 3) return ` · offre quasi sempre ${nm(fa > fb ? a : b)}`;
  return '';
}
