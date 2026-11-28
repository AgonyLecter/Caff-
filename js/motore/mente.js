// La mente dei personaggi.
// Ogni persona ha un carattere (8 manopole), un umore che dura nei giorni, una memoria di quello che le è successo
// e di quello che ha saputo. I legami tra due persone non sono più solo un'etichetta: hanno affetto, fiducia,
// attrazione e tensione, che cambiano a ogni incontro secondo come vanno d'accordo e di cosa parlano.
// Le conversazioni si costruiscono sul momento (saluto, argomenti, chiusura), le notizie girano di bocca in bocca,
// chi è nel locale reagisce a quello che succede, e nessuno ripete la stessa frase finché ne ha di nuove.
// Le parole sono in js/dati/voci.js. Per un personaggio chiave nuovo basta aggiungerlo a MENTI_K.

/* ---------- 1. Niente ripetizioni ---------- */
function hT(t) {
  let h = 7;
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
// Sceglie da una lista una frase che non si è sentita di recente nel locale (st.vu) e che chi parla (own.ud)
// non ha ancora detto. Quando le ha dette tutte, ripete quella detta più tempo fa.
const HCACHE = new WeakMap();
function hashes(pool) {
  let hs = HCACHE.get(pool);
  if (!hs || hs.length !== pool.length) HCACHE.set(pool, (hs = pool.map(x => hT(typeof x === 'string' ? x : JSON.stringify(x)))));
  return hs;
}
// quanto di una lista è ancora «nuovo» per chi parla e per il locale: 0.1 (già sentito tutto) … 1 (tutto nuovo)
function fresco(pool, key, own) {
  if (!pool || !pool.length) return 0;
  const hs = hashes(pool),
    rec = (st.vu && st.vu[key]) || [],
    ud = (own && own.ud) || [];
  return 0.1 + (0.9 * hs.filter(h => !rec.includes(h) && !ud.includes(h)).length) / hs.length;
}
function scegli(pool, key, own) {
  if (!pool || !pool.length) return null;
  if (pool.length === 1) return pool[0];
  st.vu = st.vu || {};
  const rec = st.vu[key] || (st.vu[key] = []),
    ud = own ? (own.ud = own.ud || []) : null,
    hs = hashes(pool),
    idx = pool.map((_, i) => i),
    ua = i => (ud ? ud.lastIndexOf(hs[i]) : -1),
    ra = i => rec.lastIndexOf(hs[i]);
  let ok = idx.filter(i => ua(i) < 0 && ra(i) < 0);
  if (!ok.length) ok = idx.filter(i => ua(i) < 0);
  if (!ok.length) {
    // tutte già dette da questa persona: la più lontana nel tempo
    const m = Math.min(...idx.map(i => Math.max(ua(i), ra(i) - 1000)));
    ok = idx.filter(i => Math.max(ua(i), ra(i) - 1000) === m);
  }
  const i = pick(ok);
  rec.push(hs[i]);
  while (rec.length > Math.ceil(pool.length * 0.75)) rec.shift();
  if (ud) {
    ud.push(hs[i]);
    while (ud.length > 60) ud.shift();
  }
  return pool[i];
}

/* ---------- 2. Carattere ---------- */
const P0 = { soc: 0.5, cal: 0.55, iro: 0.4, sens: 0.5, ape: 0.5, rom: 0.3, bro: 0.2, ene: 0.5 };
const PCACHE = new WeakMap();
const MENTE_K = o => (o && o.key && MENTI_K[o.key]) || null;
// i tratti di una persona: quelli dell'habitué, o (per un cliente di passaggio) quelli presi all'ingresso
const trattiDi = o => (o && (o.tr || [])) || [];
function pers(o) {
  let p = PCACHE.get(o);
  if (p) return p;
  p = {};
  const add = [TIPO_P[o.type]].concat(trattiDi(o).map(t => TRATTI_P[t])).filter(Boolean),
    K = MENTE_K(o);
  for (const k in P0) {
    // la base pesa 1, ogni tratto 1.6: due tratti forti spostano molto, ma non del tutto
    let s = P0[k],
      w = 1;
    add.forEach(a => {
      if (a[k] != null) {
        s += a[k] * 1.6;
        w += 1.6;
      }
    });
    const seed = parseInt(hT(String(o.id || o.n || o.name || '') + k), 36) % 1000;
    p[k] = clamp(s / w + (seed / 1000 - 0.5) * 0.16, 0, 1);
    if (K && K.p && K.p[k] != null) p[k] = K.p[k];
  }
  PCACHE.set(o, p);
  return p;
}
function interessi(o) {
  const s = new Set();
  trattiDi(o).forEach(t => (TRATTI_INT[t] || []).forEach(x => s.add(x)));
  (TIPO_INT[o.type] || []).forEach(x => s.add(x));
  const K = MENTE_K(o);
  if (K && K.int) K.int.forEach(x => s.add(x));
  return [...s];
}
// lo stile con cui risponde: caldo, ironico, timido, brontolone, entusiasta
function stileDi(o) {
  const p = pers(o);
  if (p.bro > 0.55) return 'brontolone';
  if (p.soc < 0.36) return 'timido';
  if (p.iro > 0.58) return 'ironico';
  if (p.ene > 0.62 || p.soc > 0.72) return 'entusiasta';
  return 'caldo';
}
// quanto due persone vanno d'accordo, da -1 a 1
function affinita(A, B) {
  const a = pers(A),
    b = pers(B),
    ia = interessi(A),
    ib = interessi(B);
  let s = Math.min(0.45, ia.filter(x => ib.includes(x)).length * 0.15);
  s += (0.3 - Math.abs(a.iro - b.iro)) * 0.6; // ridere delle stesse cose
  s += (a.cal + b.cal - 1.1) * 0.45; // il calore aiuta sempre
  s -= Math.max(0, a.bro + b.bro - 0.9) * 0.7; // due musoni si pestano i piedi
  if ((a.soc > 0.7 && b.soc < 0.3) || (b.soc > 0.7 && a.soc < 0.3)) s += (a.cal + b.cal) * 0.12; // il chiacchierone e il timido, se c'è affetto
  trattiDi(A).forEach(x => trattiDi(B).forEach(y => (s += AFF_TR[[x, y].sort().join('|')] || 0)));
  return clamp(s, -1, 1);
}
function carattereN(r) {
  const p = pers(r);
  // le due cose in cui si distingue di più dalla media
  const ks = Object.keys(P0).sort((x, y) => Math.abs(p[y] - P0[y]) - Math.abs(p[x] - P0[x]));
  return gO(
    ks
      .slice(0, 2)
      .map(k => CAR_N[k][p[k] >= P0[k] ? 1 : 0])
      .join(' e ')
      .replace(/ e (?=[eE])/, ' ed '),
    r
  );
}

/* ---------- 3. Umore e memoria ---------- */
function mn(r) {
  if (!r.mn) r.mn = { u: 0, mem: [], k: [] };
  return r.mn;
}
// Un ricordo: k = cosa (conosciuto, amici, cotta, coppia, fidanzati, litigio, chiarito, pace, visto, saputo,
// consolato, perfetto, attesa…), w = con chi, x = altro (es. «id|id» di chi si è fidanzato), v = quanto pesa (-2..2)
function memo(r, k, o) {
  if (!r) return;
  o = o || {};
  const M = mn(r);
  if (M.mem.some(m => m.k === k && m.w === (o.w || '') && m.x === (o.x || '') && m.d === st.day)) return;
  M.mem.push({ k, w: o.w || '', x: o.x || '', v: o.v || 0, d: st.day });
  if (M.mem.length > 24) {
    // si dimentica la cosa meno importante e più vecchia (i ricordi forti restano)
    let j = 0,
      lo = 1e9;
    M.mem.forEach((m, i) => {
      const s = (1 + Math.abs(m.v)) / (1 + (st.day - m.d) / 5);
      if (s < lo) {
        lo = s;
        j = i;
      }
    });
    M.mem.splice(j, 1);
  }
  M.u = clamp(M.u + (o.v || 0) * 0.08, -1, 1);
}
const nomeDi = id => {
  const r = st.regs.find(x => x.id === id);
  return r ? r.n : '';
};
function ricordoDi(r, filt) {
  const L = mn(r).mem.filter(m => (!filt || filt(m)) && (!m.w || nomeDi(m.w)) && (!m.x || m.x.split('|').every(nomeDi)));
  if (!L.length) return null;
  return wpick(L, m => (1 + Math.abs(m.v)) / (1 + (st.day - m.d) / 6));
}
// umore del momento, da -1 a 1: quello della visita (c.mood) più quello che si porta dietro dai giorni passati
const umoreOra = c => clamp((c.mood - 62) / 35 + (c.reg ? mn(c.reg).u : 0), -1, 1);
function umoreN(r, c) {
  const u = c ? umoreOra(c) : mn(r).u;
  return gO(UMORE_N[u < -0.45 ? 0 : u < -0.15 ? 1 : u < 0.2 ? 2 : u < 0.5 ? 3 : 4], r);
}
// all'ingresso: quanto tempo è passato, e l'umore dei giorni scorsi colora la visita
function menteArrivo(c, o) {
  if (!o.reg) {
    // anche chi passa una volta sola ha un carattere
    if (Math.random() < 0.8) c.tr = [pick(TRAITS)];
    return;
  }
  const r = o.reg,
    M = mn(r);
  r.gap = r.vd ? st.day - r.vd : 0;
  r.vd = st.day;
  M.u *= 0.9 * Math.pow(0.85, r.gap); // l'umore dei giorni scorsi sbiadisce piano
  c.mood = clamp(c.mood + M.u * 15, 10, 100);
  mondoArrivo(c, r); // progetti personali
}
// all'uscita: la visita diventa un ricordo (un caffè perfetto, un'attesa lunga) e sposta l'umore
function menteCongedo(c, stelle) {
  const r = c.reg;
  if (!r) return;
  if (c.q === 2) memo(r, 'perfetto', { v: 1 });
  if (c.why === 'attesa') memo(r, 'attesa', { v: -0.6 });
  mn(r).u = clamp(mn(r).u + (stelle - 3) * 0.05, -1, 1);
}

/* ---------- 4. Notizie che girano ---------- */
function notizia(k, A, B) {
  st.news = st.news || [];
  const id = k + ':' + relKey(A, B) + ':' + st.day;
  if (st.news.some(n => n.id === id)) return;
  st.news.push({ id, k, a: A.id, b: B.id, d: st.day });
  while (st.news.length > 40) st.news.shift();
  impara(A, id);
  impara(B, id);
}
function impara(r, id) {
  const M = mn(r);
  if (!M.k.includes(id)) M.k.push(id);
  while (M.k.length > 30) M.k.shift();
}
const conosce = (r, id) => mn(r).k.includes(id);
// una notizia che S sa, L no, e che a L interessa (conosce qualcuno dei due, o è S a raccontare la sua)
function notiziaPer(S, L) {
  const N = (st.news || []).filter(
    n =>
      st.day - n.d <= 12 &&
      NOTIZIE[n.k] &&
      conosce(S, n.id) &&
      !conosce(L, n.id) &&
      n.a !== L.id &&
      n.b !== L.id &&
      (n.a === S.id || n.b === S.id || st.rel[[n.a, L.id].sort().join('|')] || st.rel[[n.b, L.id].sort().join('|')]) &&
      nomeDi(n.a) &&
      nomeDi(n.b)
  );
  return N.length ? N[N.length - 1] : null;
}

/* ---------- 5. Legami ---------- */
// affetto (a), fiducia (fi), attrazione (at), tensione (te): da 0 a 100. Per i salvataggi vecchi, si parte dall'etichetta.
const REL0 = {
  conoscenti: [25, 20, 5, 5],
  amici: [50, 40, 5, 5],
  migliori: [78, 65, 5, 5],
  cotta: [40, 25, 45, 5],
  coppia: [70, 55, 70, 5],
  fidanzati: [80, 70, 80, 5],
  sposati: [85, 80, 75, 5],
  famiglia: [80, 80, 0, 5],
  rivali: [15, 10, 0, 55]
};
function rv(R) {
  if (R.a == null) {
    const z = REL0[R.k] || REL0.conoscenti;
    R.a = z[0];
    R.fi = z[1];
    R.at = z[2];
    R.te = z[3];
    R.n = R.n || R.lv || 0;
  }
  return R;
}
const AMORE = ['cotta', 'coppia', 'fidanzati', 'sposati'];
const GRP = k =>
  k === 'cotta'
    ? 'cotta'
    : AMORE.includes(k)
      ? 'amore'
      : ['amici', 'migliori'].includes(k)
        ? 'amici'
        : k === 'rivali'
          ? 'rivali'
          : k === 'famiglia'
            ? 'famiglia'
            : 'cono';
const METEO_P = {
  sereno: 'C’era il sole',
  nuvoloso: 'Era nuvoloso',
  pioggia: 'Pioveva',
  temporale: 'C’era un temporale',
  nebbia: 'C’era la nebbia',
  neve: 'Nevicava'
};
// Il primo incontro e ogni incontro dopo: i numeri cambiano secondo il carattere e com'è andata (es: l'esito della conversazione).
function relCresce(A, B, es) {
  const k = relKey(A, B);
  let r = st.rel[k];
  const pa = pers(A),
    pb = pers(B),
    af = affinita(A, B),
    cal = (pa.cal + pb.cal) / 2,
    rom = (pa.rom + pb.rom) / 2,
    bro = (pa.bro + pb.bro) / 2;
  es = es || {};
  if (!r) {
    r = st.rel[k] = { k: 'conoscenti', lv: 0, d: st.day, ld: st.day, n: 1, wx: typeof curWx === 'function' ? curWx() : '' };
    r.a = clamp(22 + af * 15 + (es.a || 0), 5, 60);
    r.fi = clamp(15 + af * 8 + (es.fi || 0), 0, 60);
    r.at = Math.random() < rom * 0.9 ? rnd(18, 38) : rnd(0, 10); // la scintilla, o niente
    r.te = clamp(5 + Math.max(0, bro - 0.4) * 60 * Math.random() - af * 10 + (es.te || 0), 0, 60);
    logB(`${A.n} e ${B.n} si sono conosciuti`);
    memo(A, 'conosciuto', { w: B.id, v: 0.8 });
    memo(B, 'conosciuto', { w: A.id, v: 0.8 });
    return r;
  }
  rv(r);
  const lontani = st.day - (r.ld || r.d || st.day);
  r.lv++;
  r.n = (r.n || 0) + 1;
  r.ld = st.day;
  // più il legame è forte, più cresce piano (gli ultimi passi sono i più preziosi)
  if (lontani >= 8 && CLOSE.includes(r.k)) r.a -= Math.min(10, lontani - 6); // chi non si vede da tanto si è un po' raffreddato
  r.a = clamp(r.a + (6 + af * 9 + cal * 5 + rnd(-3, 4) + (es.a || 0)) * (1 - r.a / 120), 0, 100);
  r.fi = clamp(r.fi + (4 + af * 4 + (es.fi || 0)) * (1 - r.fi / 120), 0, 100);
  let dat = (es.at || 0) + rom * rnd(0, 14) * (1 + af);
  if (AMORE.includes(r.k)) dat += 6 + rom * 8;
  if (r.k === 'famiglia' || r.k === 'rivali') dat = 0;
  r.at = clamp(r.at + dat, 0, 100);
  let dte = (es.te || 0) + bro * rnd(0, 16) - cal * 6 - af * 5 + rnd(-2, 2);
  if (r.k === 'rivali') dte -= 7; // anche ai rivali, piano piano, ci si abitua
  r.te = clamp(r.te + dte, 0, 100);
  const K = r.k,
    to = (kk, log, tst, v) => {
      r.k = kk;
      r.lv = 0;
      r.cd = st.day;
      logB(log);
      if (tst) toast(tst);
      memo(A, kk, { w: B.id, v });
      memo(B, kk, { w: A.id, v });
      if (NOTIZIE[kk]) notizia(kk, A, B);
    };
  if (K === 'conoscenti' && r.lv >= 2) {
    if (r.te >= 40 && r.te > r.a * 0.8) to('rivali', `${A.n} e ${B.n} non si sopportano`, '', -1);
    else if (r.at >= 35) to('cotta', `${A.n} ha una cotta per ${B.n}`, `Qualcosa nasce tra ${A.n} e ${B.n}...`, 1);
    else if (r.a >= 40) to('amici', `${A.n} e ${B.n} sono diventati amici`, `${A.n} e ${B.n} sono diventati amici`, 1);
  } else if (K === 'amici' && r.lv >= 2 && r.at >= 55)
    to('cotta', `${A.n} e ${B.n}: da amici a qualcosa di più`, `Tra ${A.n} e ${B.n} l’amicizia sta diventando qualcos’altro...`, 1.2);
  else if (K === 'amici' && r.lv >= 4 && r.a >= 80 && r.fi >= 60) to('migliori', `${A.n} e ${B.n} sono migliori amici`, '', 1.2);
  else if (K === 'cotta' && r.lv >= 2 && r.at >= 50) {
    to('coppia', `${A.n} e ${B.n} si sono messi insieme ♥`, `${A.n} e ${B.n} si sono messi insieme ♥`, 2);
    evento('coppia', A, B);
  } else if (K === 'coppia' && r.lv >= 5 && !r.prop && r.a >= 65 && r.fi >= 50) r.prop = 1;
  else if (K === 'rivali' && r.lv >= 3 && r.te <= 30) r.peace = 1;
  // anche chi si vuole bene ogni tanto litiga: la volta dopo si chiarisce, e il legame esce più forte
  if (CLOSE.includes(r.k) && r.k !== 'cotta' && !r.lit && !r.prop && r.lv >= 1 && (r.te >= 50 || Math.random() < 0.03)) r.lit = 1;
  return r;
}

/* ---------- 6. Riempire le frasi ---------- */
const gX = (t, n) => t.replace(/\{X:o\}/g, typeof donna === 'function' && donna({ n }) ? 'a' : 'o');
// ctx: sp chi parla (cliente), ot l'altra persona, X Y altri nomi, R il legame, giorni, v
function riempi(t, ctx) {
  if (!t) return t;
  const sp = ctx.sp,
    R = ctx.R,
    it = (sp && sp.order) || MENU[0];
  t = gX(t, ctx.X || '')
    .replace(/\{A\}/g, sp ? sp.name || sp.n : '')
    .replace(/\{B\}/g, ctx.ot ? ctx.ot.name || ctx.ot.n : '')
    .replace(/\{X\}/g, ctx.X || '')
    .replace(/\{Y\}/g, ctx.Y || '')
    .replace(/\{item\}/g, it.n)
    .replace(/\{giorni\}/g, String(ctx.giorni != null ? ctx.giorni : R ? st.day - (R.d || st.day) : 0))
    .replace(/\{meteo\}/g, (R && METEO_P[R.wx]) || 'Pioveva')
    .replace(/\{nome\}/g, st.name || 'questo posto')
    .replace(/\{v\}/g, String((sp && sp.reg && sp.reg.v) || 1));
  // «Pioveva» a inizio frase, «pioveva» dentro la frase
  t = t.replace(/([a-zà-ù,] )(C’era|Pioveva|Nevicava|Era nuvoloso)/g, (m, a, b) => a + b.charAt(0).toLowerCase() + b.slice(1));
  return gO(t, (sp && (sp.reg || sp)) || {});
}

/* ---------- 7. Conversazioni costruite sul momento ---------- */
// Restituisce { L: battute [chi, testo], es: com'è andata (per relCresce), mood, dopo: cosa fare alla fine }
function conversa(a, b, R) {
  rv(R);
  const A = a.reg,
    B = b.reg,
    pa = pers(A),
    pb = pers(B),
    sty = [stileDi(A), stileDi(B)],
    gap = st.day - (R.ld || R.d || st.day),
    g = GRP(R.k),
    L = [],
    es = { a: 0, fi: 0, at: 0, te: 0 },
    dopo = [];
  const own = w => (w ? B : A),
    di = (w, t, ex) => t && L.push([w, riempi(t, Object.assign({ sp: w ? b : a, ot: w ? a : b, R }, ex || {}))]);
  // saluto
  const ap = (APRI[gap >= 8 ? 'lontani' : 'spesso'] || {})[g === 'cotta' ? 'amore' : g] || APRI.spesso.cono;
  di(0, scegli(ap, 'ap:' + g, A), { giorni: gap });
  if (g === 'rivali') {
    di(0, scegli(PUNGE.a, 'pu', A));
    di(1, scegli(PUNGE.r[sty[1]], 'pur:' + sty[1], B));
    es.te += pb.cal > 0.6 ? -8 : 2; // una risposta gentile disarma
    es.a += pb.cal * 6 + pa.iro * 3;
    return { L, es, mood: 'angry', dopo };
  }
  if (gap >= 8) es.a += 4;
  const vic = CLOSE.includes(R.k) ? 'vicini' : 'cono';
  di(1, scegli(APRI_R[vic][sty[1]], 'apr:' + vic + sty[1], B));
  // gli argomenti possibili, ognuno con quanto ha voglia di parlarne ciascuno
  const C = [],
    top = R.top || [],
    cs = [a, b];
  const sopra = (w, k) => !top.includes(k) || w > 3.5;
  [0, 1].forEach(x => {
    const S = own(x),
      O = own(1 - x),
      c = cs[x];
    // chi è giù si confida
    if (umoreOra(c) < -0.25)
      C.push({
        k: 'confida',
        w: 4 + pers(S).sens * 2,
        run: () => {
          di(x, scegli(CONFIDA.a, 'cfa', S));
          di(1 - x, scegli(CONFIDA.r[sty[1 - x]], 'cfr:' + sty[1 - x], O));
          di(x, scegli(CONFIDA.g, 'cfg', S));
          es.fi += 8 + pers(O).cal * 10;
          es.a += 5;
          dopo.push(() => {
            memo(S, 'consolato', { w: O.id, v: 1 });
            mn(S).u = clamp(mn(S).u + 0.25, -1, 1);
            c.mood = Math.min(100, c.mood + 15);
          });
        }
      });
    // una notizia da raccontare (anche la propria)
    const N = notiziaPer(S, O);
    if (N)
      C.push({
        k: 'notizia',
        w: 3.5 + (interessi(S).includes('pettegolezzi') ? 2 : 0) + pers(S).soc,
        run: () => {
          const mia = N.a === S.id || N.b === S.id,
            altro = nomeDi(N.a === S.id ? N.b : N.a);
          di(
            x,
            scegli(NOTIZIE[N.k][mia ? 'io' : 'a'], 'nz:' + N.k + (mia ? 'i' : ''), S),
            mia ? { Y: altro, X: altro } : { X: nomeDi(N.a), Y: nomeDi(N.b) }
          );
          di(1 - x, scegli(NOTIZIE_R[sty[1 - x]], 'nzr:' + sty[1 - x], O));
          es.a += 3;
          es.fi += mia ? 6 : 1;
          dopo.push(() => {
            impara(O, N.id);
            memo(O, 'saputo', { x: N.a + '|' + N.b, v: 0.4 });
          });
        }
      });
    // un ricordo in comune
    const M = ricordoDi(S, m => (m.w === O.id && RICORDO_A[m.k]) || (m.k === 'visto' && m.x && !m.x.includes(O.id)));
    if (M && sopra(2, 'ricordo'))
      C.push({
        k: 'ricordo',
        w: 1.4 + (CLOSE.includes(R.k) ? 1 : 0) + (R.n >= 6 ? 0.6 : 0),
        run: () => {
          const xy = M.x ? M.x.split('|').map(nomeDi) : [];
          di(x, scegli(RICORDO_A[M.k], 'ra:' + M.k, S), { X: xy[0], Y: xy[1] });
          di(1 - x, scegli(RICORDO_R[sty[1 - x]], 'rr:' + sty[1 - x], O));
          es.a += 4;
          es.fi += 3;
        }
      });
    // gli interessi: in comune (molta voglia) o solo propri (un po' meno, e l'altro magari non ci sta)
    interessi(S).forEach(t => {
      if (!TEMI[t] || t === 'pettegolezzi' || (t === 'amore' && !AMORE.includes(R.k) && R.k !== 'migliori')) return;
      const both = interessi(O).includes(t);
      if (!sopra(2, t)) return;
      C.push({
        k: t,
        w: (both ? 2.4 : 0.8) * (0.6 + pers(S).soc) * fresco(TEMI[t].a, 'ta:' + t, S),
        run: () => {
          di(x, scegli(TEMI[t].a, 'ta:' + t, S));
          if (both) {
            di(1 - x, Math.random() < 0.6 ? scegli(TEMI[t].si, 'tsi:' + t, O) : scegli(RISP.si[sty[1 - x]], 'rsi:' + sty[1 - x], O));
            es.a += 7;
            es.at += AMORE.includes(R.k) || R.k === 'conoscenti' ? 3 : 0;
          } else {
            di(1 - x, scegli(RISP.no[sty[1 - x]], 'rno:' + sty[1 - x], O));
            es.a += pers(O).cal * 4 - pers(O).bro * 3;
            es.te += pers(O).bro * 4;
          }
        }
      });
    });
    // progetti per il futuro, per chi è molto legato
    if ((R.k === 'migliori' || AMORE.includes(R.k)) && R.a >= 60 && sopra(2, 'futuro'))
      C.push({
        k: 'futuro',
        w: 1.2,
        run: () => {
          di(x, scegli(FUTURO.a, 'fua', S));
          const si = pers(O).ape > 0.4 || R.a > 75;
          di(1 - x, scegli(FUTURO[si ? 'si' : 'no'], 'fu' + (si ? 's' : 'n'), O));
          es.fi += si ? 6 : 2;
        }
      });
  });
  [0, 1].forEach(x => mondoTemi(C, x, own(x), own(1 - x), di, es, dopo, sty)); // progetti e quartiere
  const n = pa.soc + pb.soc > 1.1 && Math.random() < 0.6 ? 2 : 1;
  for (let i = 0; i < n && C.length; i++) {
    const o = wpick(C, x => x.w);
    o.run();
    R.top = top.concat(o.k).slice(-6);
    for (let j = C.length - 1; j >= 0; j--) if (C[j].k === o.k) C.splice(j, 1);
  }
  const w = Math.random() < 0.5 ? 0 : 1;
  if (Math.random() < 0.45 && fresco(CHIUDI[sty[w]], 'ch:' + sty[w], own(w)) > 0.4) {
    di(w, scegli(CHIUDI[sty[w]], 'ch:' + sty[w], own(w)));
  }
  return { L, es, mood: g === 'cotta' || g === 'amore' ? 'love' : 'chat', dopo };
}
// La prima volta che due persone si parlano
function primaConv(a, b) {
  const sa = stileDi(a.reg),
    sb = stileDi(b.reg);
  return [
    [0, riempi(scegli(PRIMA.a[sa], 'pra:' + sa, a.reg), { sp: a, ot: b })],
    [1, riempi(scegli(PRIMA.r[sb], 'prr:' + sb, b.reg), { sp: b, ot: a })]
  ];
}
// litigio e chiarimento: scenette scritte, riempite per i due
const scenaDue = (L, a, b, R) => L.map(l => [l[0], riempi(l[1], { sp: l[0] ? b : a, ot: l[0] ? a : b, R })]);

/* ---------- 8. Pensieri ad alta voce ---------- */
function pensiero(c) {
  // una cosa che ha appena da raccontare (una tappa del suo progetto) viene prima di tutto
  if (c.pq) {
    const t = c.pq;
    c.pq = null;
    return t;
  }
  const r = c.reg,
    own = r || c,
    sty = stileDi(own),
    vis = c.vis || (c.vis = {}),
    C = [],
    add = (w, f) => w > 0 && C.push({ w, f }),
    T = (pool, key, ex) => riempi(scegli(pool, key, own), Object.assign({ sp: c }, ex || {})),
    // un gruppo di pensieri pesa meno quando chi parla l'ha già detto quasi tutto: così cambia argomento
    addP = (w, pool, key, ex, pre) => pool && pool.length && add(w * fresco(pool, key, own), () => (pre && pre(), T(pool, key, ex)));
  if (c.why === 'attesa' && !vis.at) add(3, () => ((vis.at = 1), T(PENSA.attesa[sty], 'pat:' + sty)));
  if (c.why === 'sporco' && !vis.sp) add(3, () => ((vis.sp = 1), T(PENSA.sporco[sty], 'psp:' + sty)));
  if (c.q === 2 && !vis.q) add(3.5, () => ((vis.q = 1), T(PENSA.perfetto[sty], 'ppf:' + sty)));
  if (r && r.gap >= 3 && !vis.rt) add(4, () => ((vis.rt = 1), T(PENSA.ritorno, 'prt', { giorni: r.gap })));
  if (r && [10, 25, 50, 100, 200].includes(r.v) && !vis.tg) add(4, () => ((vis.tg = 1), T(PENSA.traguardo, 'ptg')));
  if (r && r.key) {
    const K = KEYS[r.key],
      ok = K ? K.l.filter(x => typeof x === 'string' || fl(x[1])) : [];
    if (ok.length)
      add(3, () => {
        const x = scegli(ok, 'key:' + r.key, own);
        return typeof x === 'string' ? x : x[0];
      });
  }
  const u = umoreOra(c);
  if (u > 0.45) addP(1.2, PENSA.felice, 'pfe');
  if (u < -0.3) addP(1.6, PENSA.giu, 'pgi');
  if (r && !vis.ri) {
    const M = ricordoDi(r, m => PENSA.ric[m.k]);
    if (M)
      add(1.8 * fresco(PENSA.ric[M.k], 'pri:' + M.k, own), () => {
        vis.ri = 1;
        const xy = M.x ? M.x.split('|').map(nomeDi) : [];
        return T(PENSA.ric[M.k], 'pri:' + M.k, {
          X: M.w ? nomeDi(M.w) : xy[0],
          Y: xy[1],
          R: M.w ? st.rel[[r.id, M.w].sort().join('|')] : null
        });
      });
  }
  interessi(own).forEach(t => TEMI[t] && addP(0.7, TEMI[t].solo, 'tso:' + t));
  trattiDi(own).forEach(t => PENSA_TR[t] && addP(1.1, PENSA_TR[t], 'ptr:' + t));
  // chi c'è nel locale
  if (r) {
    const qui = people.filter(o => o !== c && !o.dead && o.reg && o.state === 'sit' && o.seat && slotOf(o.seat) !== slotOf(c.seat));
    qui.forEach(o => {
      const R = st.rel[relKey(r, o.reg)];
      if (!R) return;
      if (R.lit === 2) addP(3, PENSA.imbarazzo, 'pim', { X: o.name });
      else if (R.k === 'rivali') addP(1.6, PENSA.rivale, 'priv', { X: o.name });
      else if (R.k === 'cotta') addP(2.5, PENSA.cotta, 'pco', { X: o.name });
    });
    const lontano = Object.entries(st.rel).filter(
      ([k, R]) =>
        k.split('|').includes(r.id) &&
        CLOSE.includes(R.k) &&
        (R.a || 50) >= 60 &&
        !people.some(p => !p.dead && p.reg && p.reg.id === k.split('|').find(i => i !== r.id))
    );
    if (lontano.length)
      add(0.5, () => {
        const [k] = pick(lontano);
        return T(PENSA.manca, 'pma', { X: nomeDi(k.split('|').find(i => i !== r.id)) });
      });
  }
  if (scenes.some(s => s.mood === 'love' && !s.mem.includes(c))) addP(0.8, PENSA.coppiaVicina, 'pcv');
  if (musicianOn && c.act !== 'guitar') addP(0.8, PENSA.musica, 'pmu');
  if (st.cat) addP(0.35, PENSA.gatto, 'pga');
  const seduti = people.filter(p => !p.dead && p.state === 'sit').length;
  if (seduti >= st.tables * 2 - 1 && seduti >= 4) addP(0.6, PENSA.pieno, 'ppi');
  if (seduti === 1) addP(0.8, PENSA.vuoto, 'pvu');
  // i soliti pensieri, l'ora, il tempo
  const h = hour(),
    w = curWx(),
    oh =
      h < 10
        ? SOLOH.m
        : h > 22
          ? SOLOH.n
          : rainy()
            ? SOLOH.r
            : w === 'sereno'
              ? SOLOH.s
              : w === 'neve'
                ? SOLOH.w
                : w === 'nebbia'
                  ? SOLOH.f
                  : null;
  if (oh) addP(1, oh, 'soloh:' + oh[0]);
  addP(1.2, SOLO, 'solo');
  if (r && (r.hn || 0) >= 3) addP(0.9, REGL, 'regl');
  if (st.chalk)
    add(0.25, () =>
      pick([
        `«${st.chalk}». Bella frase.`,
        'Chi ha scritto sulla lavagna? Mi ha fatto sorridere.',
        'Quella frase sulla lavagna è proprio vera.'
      ])
    );
  if (r) mondoPensieri(c, add, addP);
  const o = C.length ? wpick(C, x => x.w) : null;
  return o ? o.f() : null;
}
// quanto spesso pensa ad alta voce: i timidi meno, i chiacchieroni di più
const parlaP = c => 0.35 + pers(c.reg || c).soc * 0.4;

/* ---------- 9. Saluti tra tavoli ---------- */
function salutaTavoli(c) {
  if (!c.reg || !c.seat) return false;
  const vis = c.vis || (c.vis = {});
  vis.gr = vis.gr || [];
  const cand = people.filter(
    o =>
      o !== c &&
      !o.dead &&
      o.reg &&
      o.state === 'sit' &&
      o.seat &&
      slotOf(o.seat) !== slotOf(c.seat) &&
      !vis.gr.includes(o.reg.id) &&
      st.rel[relKey(c.reg, o.reg)]
  );
  if (!cand.length) return false;
  const o = pick(cand),
    R = st.rel[relKey(c.reg, o.reg)];
  vis.gr.push(o.reg.id);
  o.vis = o.vis || {};
  o.vis.gr = (o.vis.gr || []).concat(c.reg.id);
  if (Math.random() > 0.35 + pers(c.reg).soc * 0.5 + (CLOSE.includes(R.k) ? 0.2 : 0)) return false;
  const g = R.lit === 2 ? 'lite' : GRP(R.k);
  say(c, riempi(scegli(SALUTA[g], 'sal:' + g, c.reg), { sp: c, X: o.name }), 2.6, c.name);
  if (R.k !== 'rivali' && R.lit !== 2)
    timers.push({
      t: 1.6,
      fn: () => {
        if (o.dead || o.state !== 'sit' || o.bub || o.scene) return;
        const s = stileDi(o.reg);
        say(o, riempi(scegli(SALUTA_R[s], 'salr:' + s, o.reg), { sp: o, X: c.name }), 2.2, o.name);
      }
    });
  return true;
}

/* ---------- 10. Chi è nel locale reagisce ---------- */
function evento(k, A, B) {
  const pool = REAZ[k];
  if (!pool || typeof people === 'undefined') return;
  const W = people
    .filter(p => !p.dead && p.state === 'sit' && !p.scene && !p.bub && !p.tut && (!A || p.reg !== A) && (!B || p.reg !== B))
    .sort(() => Math.random() - 0.5)
    .slice(0, k === 'fidanzati' ? 3 : 2);
  W.forEach((w, i) =>
    timers.push({
      t: 1.2 + i * 1.1 + rnd(0, 0.5),
      fn: () => {
        if (w.dead || w.bub || w.scene || w.state !== 'sit') return;
        const own = w.reg || w,
          s = stileDi(own);
        say(w, riempi(scegli(pool[s], 'rz:' + k + ':' + s, own), { sp: w, X: A ? A.n : '', Y: B ? B.n : '' }), 2.6, w.reg ? w.name : '');
        if (w.reg && A && B) {
          memo(w.reg, k === 'fidanzati' ? 'visto' : 'saputo', { x: A.id + '|' + B.id, v: k === 'fidanzati' ? 1.5 : 0.5 });
          (st.news || []).filter(n => n.a === A.id && n.b === B.id && n.d === st.day).forEach(n => impara(w.reg, n.id));
        }
      }
    })
  );
}

/* ---------- 11. Quando lo tocchi ---------- */
function tocco(c) {
  const own = c.reg || c,
    s = stileDi(own),
    vis = c.vis || (c.vis = {});
  let pool, key;
  const P = pjDi(c.reg);
  if (P && !vis.tp && Math.random() < 0.4) {
    // ti racconta del suo progetto
    vis.tp = 1;
    return gO(scegli(P[c.reg.pj.ult === 'giu' ? 'dubbio' : 'su'], 'pjtc:' + P.id, own), own);
  }
  if (c.why === 'attesa' && !vis.ta) {
    vis.ta = 1;
    [pool, key] = [TOCCO.attesa, 'tca'];
  } else if (c.q === 2 && !vis.tq) {
    vis.tq = 1;
    [pool, key] = [TOCCO.perfetto, 'tcq'];
  } else if (umoreOra(c) < -0.35) [pool, key] = [TOCCO.giu, 'tcg'];
  else if (Math.random() < 0.25) [pool, key] = [TAPL, 'tapl'];
  else {
    const f = c.reg ? c.reg.f : 0,
      liv = f >= 8 ? 'tanto' : f >= 4 ? 'medio' : 'poco';
    [pool, key] = [TOCCO[liv][s], 'tc:' + liv + s];
  }
  return riempi(scegli(pool, key, own), { sp: c });
}

/* ---------- 12. Nel Diario ---------- */
function ricordoN(r) {
  const M = ricordoDi(r, m => RIC_N[m.k] && Math.abs(m.v) >= 0.5);
  if (!M) return '';
  const xy = M.x ? M.x.split('|').map(nomeDi) : [];
  const X = M.w ? nomeDi(M.w) : xy[0];
  return gO(
    gX(RIC_N[M.k], X || '')
      .replace(/\{X\}/g, X || '')
      .replace(/\{Y\}/g, xy[1] || ''),
    r
  );
}
function relN(R) {
  rv(R);
  if (R.lit) return 'hanno litigato';
  if (R.k === 'rivali') return R.te > 45 ? 'scintille' : 'si stanno addolcendo';
  const t = REL_N.find(x => R.a >= x[0])[1];
  return R.ld && st.day - R.ld >= 8 && CLOSE.includes(R.k) ? t + ', ma non si vedono da un po’' : t;
}
