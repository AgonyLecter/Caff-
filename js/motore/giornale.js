// Il giornale del caffè: finita la storia di Corrado, ogni tre giorni esce un numero, scritto guardando il mondo
// (notizie, storie nate da sole, sogni, quartiere, dicerie vere e false, curiosità, annunci, meteo). Le frasi sono in
// js/dati/giornale.js. I clienti lo leggono all'arrivo: imparano le notizie (e le fanno girare), reagiscono se ci sono
// dentro, smentiscono le dicerie false, e chi risponde a un annuncio conosce qualcuno di nuovo.

const gzNome = () => GZ_NOMI[st.flags.corrado4] || 'Il giornale del caffè';
const gzAttivo = () => !mondoOff && typeof arcDone === 'function' && arcDone('corrado');
const gzF = (t, o) =>
  gX(t, o.X || '')
    .replace(/\{X\}/g, o.X || '')
    .replace(/\{Y\}/g, o.Y || '')
    .replace(/\{P\}/g, o.P || '')
    .replace(/\{T\}/g, o.T || '')
    .replace(/\{Q\}/g, o.Q || '')
    .replace(/\{n\}/g, String(o.n != null ? o.n : ''))
    .replace(/\{g\}/g, String(o.g != null ? o.g : ''))
    .replace(/\{v\}/g, String(o.v != null ? o.v : ''));
// all'inizio di ogni giornata: esce un numero nuovo ogni tre giorni
function giornaleGiorno() {
  if (!gzAttivo()) return;
  st.gz = st.gz || { n: 0, next: st.day, ed: [], d: st.day, served: st.served || 0 };
  if (st.day >= st.gz.next) {
    gzEsci();
    st.gz.next = st.day + 3;
  }
}
function gzEsci() {
  const G = st.gz,
    dal = G.n ? G.d : st.day - 5,
    pezzi = [],
    ids = [],
    cit = new Set(),
    nm = id => nomeDi(id),
    titolo = (k, o) => gzF(scegli(GZ_PEZZI[k].t, 'gzt:' + k), o),
    testo = (k, o) => (GZ_PEZZI[k].x.length ? gzF(scegli(GZ_PEZZI[k].x, 'gzx:' + k), o) : '');
  const cand = [];
  // notizie dal caffè
  (st.news || [])
    .filter(n => n.d >= dal && GZ_PEZZI[n.k] && n.a !== n.b && nm(n.a) && nm(n.b))
    .forEach(n => {
      const o = { X: nm(n.a), Y: nm(n.b) };
      cand.push({ k: n.k, t: titolo(n.k, o), x: testo(n.k, o), who: [n.a, n.b] });
      ids.push(n.id);
    });
  // sogni arrivati al traguardo (o no)
  (st.pjLog || [])
    .filter(p => p.d >= dal)
    .forEach(p => {
      const k = p.ok ? 'successo' : 'delusione',
        r = st.regs.find(x => x.n === p.n),
        o = { X: p.n, P: p.t };
      cand.push({ k, t: titolo(k, o), x: testo(k, o), who: r ? [r.id] : [] });
    });
  // storie nate da sole, finite di recente
  (st.trF || []).filter(T => T.d >= dal).forEach(T => cand.push({ k: 'trama', t: titolo('trama', { T: T.t }), x: T.e, who: [] }));
  // storie principali concluse e nuovi habitué (dal registro)
  (st.log || [])
    .filter(l => l.d >= dal)
    .forEach(l => {
      let m = /^Storia completata: (.+?)( \(|$)/.exec(l.t);
      if (m) cand.push({ k: 'storia', t: titolo('storia', { T: m[1] }), x: testo('storia', {}), who: [] });
      m = /^(.+) ora è un habitué$/.exec(l.t);
      if (m) cand.push({ k: 'habitue', t: titolo('habitue', { X: m[1] }), x: testo('habitue', {}), who: [] });
    });
  // il quartiere
  const Q = typeof qzDi === 'function' ? qzDi() : null;
  if (Q) cand.push({ k: 'quartiere', t: titolo('quartiere', { Q: Q.t }), x: Q.n, who: [] });
  // la notizia più importante in prima pagina, poi la cronaca (al massimo quattro)
  cand.sort((a, b) => (GZ_PESO[b.k] || 1) - (GZ_PESO[a.k] || 1));
  cand.slice(0, 5).forEach((c, i) => {
    pezzi.push({ s: i ? 'Cronaca del caffè' : 'Prima pagina', t: c.t, x: c.x });
    c.who.forEach(id => cit.add(id));
  });
  // smentite delle dicerie false del numero scorso
  const prima = G.ed[0];
  (prima ? prima.dic || [] : [])
    .filter(d => !d.vero && nm(d.a) && nm(d.b))
    .forEach(d => pezzi.push({ s: 'Smentite', t: gzF(scegli(GZ_SMENTITA, 'gzsm'), { X: nm(d.a), Y: nm(d.b) }), x: '' }));
  // risposta all'annuncio del numero scorso: qualcuno con la stessa passione si fa vivo
  if (prima && prima.ann) {
    const A = regDi(prima.ann.a),
      B = A && st.regs.find(b => b !== A && !relDi(A, b) && interessi(b).includes(prima.ann.int));
    if (A && B) {
      relCresce(A, B, { a: 12, fi: 6 });
      memo(A, 'annuncio', { w: B.id, v: 0.8 });
      memo(B, 'annuncio', { w: A.id, v: 0.8 });
      logB(`${B.n} ha risposto all’annuncio di ${A.n} sul giornale`);
      pezzi.push({ s: 'Annunci', t: gzF(scegli(GZ_RISPOSTA, 'gzri'), { X: A.n, Y: B.n }), x: '' });
      cit.add(A.id);
      cit.add(B.id);
    }
  }
  // dicerie: una vera (se c'è), a volte una falsa
  const dic = [];
  const vere = [];
  for (const [k, R] of Object.entries(st.rel)) {
    const [a, b] = k.split('|');
    if (!nm(a) || !nm(b)) continue;
    rv(R);
    if (['conoscenti', 'amici'].includes(R.k) && R.at >= 35) vere.push({ k: 'cotta', a, b });
    if (R.lit) vere.push({ k: 'litigio', a, b });
  }
  if (vere.length) {
    const d = pick(vere);
    dic.push({ a: d.a, b: d.b, vero: 1, k: d.k });
  }
  if (Math.random() < 0.45 && st.regs.length >= 4) {
    const [A, B] = st.regs.slice().sort(() => Math.random() - 0.5);
    const R = st.rel[relKey(A, B)];
    if (!R || (R.k === 'conoscenti' && (R.at || 0) < 20)) dic.push({ a: A.id, b: B.id, vero: 0, k: 'falsa' });
  }
  dic.forEach(d =>
    pezzi.push({ s: 'Dicerie dal bancone', t: gzF(scegli(GZ_DICERIE[d.k], 'gzd:' + d.k), { X: nm(d.a), Y: nm(d.b) }), x: '' })
  );
  // sogni in corso
  st.regs
    .filter(r => r.pj && pjDi(r))
    .slice(0, 3)
    .forEach(r => pezzi.push({ s: 'Sogni in corso', t: `${r.n} insegue ${pjDi(r).t} (${r.pj.s}/${pjDi(r).passi}). Forza!`, x: '' }));
  // curiosità coi numeri
  const servito = (st.served || 0) - (G.served || 0);
  const cur = [];
  if (servito > 0) cur.push(gzF(scegli(GZ_CURIOSITA.serviti, 'gzc1'), { n: servito }));
  const fed = st.regs.slice().sort((a, b) => b.v - a.v)[0];
  if (fed) cur.push(gzF(scegli(GZ_CURIOSITA.fedele, 'gzc2'), { X: fed.n, v: fed.v }));
  const R = Object.values(st.rel);
  if (R.length)
    cur.push(gzF(scegli(GZ_CURIOSITA.coppie, 'gzc3'), { n: R.length, g: R.filter(r => AMORE.includes(r.k) && r.k !== 'cotta').length }));
  if (st.cat) cur.push(scegli(GZ_CURIOSITA.gatto, 'gzc4'));
  const vecchia = Object.entries(st.rel)
    .filter(([k]) => k.split('|').every(nm))
    .sort((a, b) => (a[1].d || 0) - (b[1].d || 0))[0];
  if (vecchia) {
    const [a, b] = vecchia[0].split('|');
    cur.push(gzF(scegli(GZ_CURIOSITA.anziana, 'gzc5'), { X: nm(a), Y: nm(b), g: st.day - (vecchia[1].d || st.day) }));
  }
  cur
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .forEach(t => pezzi.push({ s: 'Curiosità', t, x: '' }));
  // un annuncio nuovo, da chi insegue un sogno
  let ann = null;
  const chi = st.regs.filter(r => r.pj && pjDi(r) && pjDi(r).int.some(i => GZ_ANNUNCI[i]));
  if (chi.length) {
    const A = pick(chi),
      i = pjDi(A).int.find(x => GZ_ANNUNCI[x]);
    ann = { a: A.id, int: i };
    pezzi.push({ s: 'Annunci', t: gzF(GZ_ANNUNCI[i], { X: A.n }), x: '' });
  }
  pezzi.push({ s: 'Il meteo di Corrado', t: GZ_METEO[st.nwx] || GZ_METEO.pioggia, x: '' });
  pezzi.push({ s: 'Il corsivo', t: scegli(GZ_CORSIVO, 'gzcors'), x: '' });
  G.n++;
  const ed = { n: G.n, d: st.day, nome: gzNome(), pezzi, ids, cit: [...cit], dic, ann };
  G.ed.unshift(ed);
  if (G.ed.length > 8) G.ed.pop();
  G.d = st.day;
  G.served = st.served || 0;
  toast(`È uscito il numero ${G.n} di «${ed.nome}». Lo trovi nel Diario.`);
  logB(`Esce il numero ${G.n} di «${ed.nome}»`);
  st.newStory = 1;
  return ed;
}
// chi arriva al caffè e non l'ha ancora letto, a volte lo legge: impara le notizie e reagisce
function gzLegge(c, r) {
  const G = st.gz,
    ed = G && G.ed[0];
  if (!ed || c.pq || !gzAttivo() || (r.gzL || 0) >= ed.n || r.key === 'corrado' || Math.random() > 0.6) return;
  r.gzL = ed.n;
  ed.ids.forEach(id => impara(r, id));
  c.act = 'news';
  const altro = d => nomeDi(d.a === r.id ? d.b : d.a);
  const falsa = (ed.dic || []).find(d => !d.vero && (d.a === r.id || d.b === r.id)),
    vera = (ed.dic || []).find(d => d.vero && d.k === 'cotta' && (d.a === r.id || d.b === r.id));
  let t;
  if (falsa) {
    t = gzF(scegli(GZ_LETTORI.smentisce, 'gzl:sm', r), { Y: altro(falsa) });
    const K = typeof keyReg === 'function' && keyReg('corrado');
    if (K) {
      const RK = rv(st.rel[relKey(r, K)] || relCresce(r, K));
      RK.te = clamp(RK.te + 6, 0, 100);
      memo(r, 'diceria', { w: K.id, v: -0.5 });
    }
  } else if (vera) t = gzF(scegli(GZ_LETTORI.arrossisce, 'gzl:ar', r), { Y: altro(vera) });
  else if (ed.cit.includes(r.id)) {
    t = scegli(GZ_LETTORI.citato, 'gzl:ci', r);
    mn(r).u = clamp(mn(r).u + 0.1, -1, 1);
  } else t = gzF(scegli(GZ_LETTORI.legge, 'gzl:le', r), { T: (ed.pezzi[0] || {}).t || ed.nome });
  daDire(c, gO(t, r));
}
// la pagina del giornale nel Diario
let gzSel = 0;
function giornaleHTML() {
  const G = st.gz;
  if (!G || !G.ed.length)
    return '<p class="note">Ancora nessun giornale. Il quartiere aspetta qualcuno che racconti le sue storie… magari un signore con un taccuino.</p>';
  const ed = G.ed[Math.min(gzSel, G.ed.length - 1)];
  let sez = '';
  const corpo = ed.pezzi
    .map(p => {
      const h = p.s !== sez ? `<h3>${esc(p.s)}</h3>` : '';
      sez = p.s;
      return `${h}<div class="rev"><b>${esc(p.t)}</b>${p.x ? `<br><small>${esc(p.x)}</small>` : ''}</div>`;
    })
    .join('');
  return (
    `<div class="card2 giornale"><h2 style="text-align:center;margin:0">${esc(ed.nome)}</h2><p class="note" style="text-align:center">Numero ${ed.n} · ${esc(
      typeof dataN === 'function' ? dataN(ed.d) : 'giorno ' + ed.d
    )} · di Corrado</p>${corpo}</div>` +
    (G.ed.length > 1
      ? `<div class="card2"><h3>Numeri precedenti<small>${G.ed.length}</small></h3>${G.ed
          .map(
            (e, i) => `<button class="chap" data-gz="${i}"><span class="who">Numero ${e.n}</span><small>giorno ${e.d} ›</small></button>`
          )
          .join('')}</div>`
      : '')
  );
}
