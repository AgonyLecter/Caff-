// Controllo veloce dei contenuti, senza browser. Uso:  node tests/dati.js
// Carica i file di js/dati/ e verifica che storie, personaggi, vite, incontri e frasi siano coerenti:
// personaggi esistenti, scelte che portano da qualche parte, condizioni raggiungibili, finali con battute proprie.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]).filter(f => f.includes('/dati/') || f.endsWith('base.js'));

// il browser non c'è: bastano finti document e canvas per caricare base.js
const fake = () => ({ getContext: () => ({}), addEventListener() {}, style: {}, classList: { add() {}, remove() {}, toggle() {} } });
const ctx = vm.createContext({
  document: { querySelector: fake, createElement: fake, addEventListener() {} },
  window: {},
  console,
  Math,
  JSON
});
for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
const D = vm.runInContext(
  '({ CH, ARCS, MENU, FILI, FILI2, KEYS, KSEED, XS, XEPI, REL, PETC, RICETTE, INGR, STAGIONI, FESTE, COMPLEANNI, COMPL_L, ANNIV, EVENTS, WXN })',
  ctx
);

const problems = [];
const bad = msg => problems.push(msg);
const produced = new Set();
D.ARCS.forEach(a =>
  a.ch.forEach(c =>
    c.l.forEach(l => {
      if (l && l.c) l.c.o.forEach(o => produced.add(o.f));
    })
  )
);
// finali calcolati da più scelte (calc): i valori possibili contano come «scelti»
D.ARCS.forEach(a => a.ch.forEach(c => c.calc && c.calc.values.forEach(v => produced.add(c.calc.flag + '=' + v))));
const arcIds = new Set(D.ARCS.map(a => a.id));

// --- personaggi
for (const [k, c] of Object.entries(D.CH)) {
  if (!c.n || !c.l) bad(`personaggio ${k}: servono n (nome) e l (aspetto)`);
  else {
    if (!(c.l.hs >= 0 && c.l.hs <= 14)) bad(`personaggio ${k}: pettinatura hs ${c.l.hs} fuori da 0-14`);
    if (!(c.l.o >= 0 && c.l.o <= 4)) bad(`personaggio ${k}: vestito o ${c.l.o} fuori da 0-4`);
    for (const col of ['s', 'h', 'c1', 'c2'])
      if (!/^#[0-9a-f]{6}$/i.test(c.l[col] || '')) bad(`personaggio ${k}: colore ${col} mancante o non valido`);
    if (c.l.pet && !D.PETC[c.l.pet.k]) bad(`personaggio ${k}: animale di tipo ${c.l.pet.k} sconosciuto`);
  }
}

// --- storie principali
const ids = new Set();
for (const a of D.ARCS) {
  if (ids.has(a.id)) bad(`storia ${a.id}: id doppio`);
  ids.add(a.id);
  const line = (l, who, where) => {
    if (Array.isArray(l)) {
      if (!(l[0] >= 0 && l[0] < who.length)) bad(`${where}: chi parla (${l[0]}) non esiste`);
      if (typeof l[1] !== 'string' || !l[1].trim()) bad(`${where}: battuta vuota`);
      if (l[2] && !produced.has(l[2])) bad(`${where}: condizione ${l[2]} mai scelta da nessuna parte`);
    } else if (l && l.c) {
      if (!l.c.q || l.c.o.length < 2) bad(`${where}: scelta incompleta`);
      l.c.o.forEach(o => {
        if (!/^\w+=\w+$/.test(o.f)) bad(`${where}: flag ${o.f} malformato (serve storia=valore)`);
        o.r.forEach(x => line(x, who, where + ' (risposta)'));
      });
    } else bad(`${where}: riga sconosciuta`);
  };
  a.ch.forEach((c, i) => {
    const who = c.who || a.who;
    who.forEach(w => {
      if (!D.CH[w]) bad(`${a.id}/${i}: personaggio ${w} mancante`);
    });
    if (who.length > 2) bad(`${a.id}/${i}: più di 2 personaggi a un tavolo`);
    if (c.whoBy)
      Object.entries(c.whoBy).forEach(([f, w]) => {
        if (!produced.has(f)) bad(`${a.id}/${i}: whoBy usa ${f}, mai scelto`);
        w.forEach(x => !D.CH[x] && bad(`${a.id}/${i}: personaggio ${x} mancante`));
        c.l.forEach(
          (l, j) =>
            Array.isArray(l) && l[2] === f && !(l[0] < w.length) && bad(`${a.id}/${i}/${j}: con ${f} al tavolo c'è solo ${w.join(', ')}`)
        );
      });
    if (c.calc && (typeof c.calc.fn !== 'function' || !c.calc.flag || !c.calc.values.length)) bad(`${a.id}/${i}: calc incompleto`);
    if (i && c.r < a.ch[i - 1].r) bad(`${a.id}/${i}: soglia di atmosfera più bassa del capitolo prima`);
    c.l.forEach((l, j) => line(l, who, `${a.id}/${i}/${j}`));
    const here = new Set();
    c.l.forEach(l => {
      if (l && l.c) l.c.o.forEach(o => here.add(o.f));
    });
    c.l.forEach(l => {
      if (Array.isArray(l) && l[2] && here.has(l[2])) bad(`${a.id}/${i}: condizione ${l[2]} nello stesso capitolo della scelta`);
    });
  });
  const lastWho = a.ch[a.ch.length - 1].who || a.who;
  (a.rt || []).forEach((r, i) => r.forEach((l, j) => line(l, lastWho, `${a.id}/rt${i}/${j}`)));
  [].concat(a.req || []).forEach(rr =>
    rr.split('|').forEach(r => {
      const [id] = r.split('=');
      if (!arcIds.has(id)) bad(`${a.id}: requisito ${id} inesistente`);
      if (r.includes('=') && !produced.has(r)) bad(`${a.id}: requisito ${r} mai scelto`);
    })
  );
  if (a.end)
    Object.keys(a.end).forEach(f => {
      if (!produced.has(f)) bad(`${a.id}: finale ${f} irraggiungibile`);
      const last = a.ch[a.ch.length - 1];
      if (!last.l.some(l => (Array.isArray(l) && l[2] === f) || (l && l.c && l.c.o.some(o => o.f === f))))
        bad(`${a.id}: il finale ${f} non ha battute proprie nell'ultimo capitolo`);
    });
}

// --- vite (singole e a due)
const vita = (F, speakers, where) => {
  if (F.b.length !== 3) bad(`${where} ${F.id}: servono 3 visite`);
  const ch = F.b[1] && F.b[1].find(l => l && l.c);
  if (!ch || ch.c.o.length !== 2) bad(`${where} ${F.id}: manca la scelta nella seconda visita`);
  const fl = ch ? ch.c.o.map(o => o.f) : [];
  ['@a', '@b'].forEach(f => {
    if (!fl.includes(f)) bad(`${where} ${F.id}: scelta ${f} mancante`);
    if (!F.b[2] || !F.b[2].some(l => Array.isArray(l) && l[2] === f))
      bad(`${where} ${F.id}: il finale ${f} non ha battute nella terza visita`);
    if (!F.e || !F.e[f.slice(1)]) bad(`${where} ${F.id}: testo del finale ${f.slice(1)} mancante`);
  });
  F.b.forEach((b, i) =>
    b.forEach(l => {
      if (Array.isArray(l) && (!speakers.includes(l[0]) || !l[1])) bad(`${where} ${F.id}/${i}: battuta non valida`);
    })
  );
};
const vids = new Set();
D.FILI.forEach(F => {
  if (vids.has(F.id)) bad(`vita ${F.id}: id doppio`);
  vids.add(F.id);
  vita(F, [0], 'vita');
});
D.FILI2.forEach(F => {
  if (vids.has(F.id)) bad(`vita a due ${F.id}: id doppio`);
  vids.add(F.id);
  vita(F, [0, 1], 'vita a due');
  F.k.forEach(k => {
    if (!['amici', 'migliori', 'coppia', 'fidanzati', 'sposati', 'cotta', 'rivali', 'famiglia', 'conoscenti'].includes(k))
      bad(`vita a due ${F.id}: legame ${k} sconosciuto`);
  });
});

// segnaposto conosciuti: {A} {B} {item} in tutte le vite, {o} (accordo maschile/femminile) solo nelle vite singole
const testi = x =>
  Array.isArray(x) ? x.flatMap(testi) : x && typeof x === 'object' ? Object.values(x).flatMap(testi) : typeof x === 'string' ? [x] : [];
D.FILI.forEach(F =>
  testi(F.b).forEach(t =>
    (t.match(/\{[^}]*\}/g) || []).forEach(m => !['{A}', '{item}', '{o}'].includes(m) && bad(`vita ${F.id}: segnaposto ${m} sconosciuto`))
  )
);
D.FILI2.forEach(F =>
  testi(F.b).forEach(t =>
    (t.match(/\{[^}]*\}/g) || []).forEach(
      m => !['{A}', '{B}', '{item}'].includes(m) && bad(`vita a due ${F.id}: segnaposto ${m} sconosciuto`)
    )
  )
);

// --- calendario: stagioni, feste, compleanni
if (D.STAGIONI.length !== 4) bad('calendario: servono 4 stagioni');
const giorniFesta = new Set();
D.FESTE.forEach(f => {
  if (!(f.s >= 0 && f.s < 4 && f.g >= 1 && f.g <= 10)) bad(`festa ${f.id}: giorno ${f.s}/${f.g} fuori dal calendario`);
  if (giorniFesta.has(f.s * 10 + f.g)) bad(`festa ${f.id}: due feste nello stesso giorno`);
  giorniFesta.add(f.s * 10 + f.g);
  if (f.ev && !D.EVENTS[f.ev]) bad(`festa ${f.id}: evento ${f.ev} sconosciuto`);
  if (f.wx && !D.WXN[f.wx]) bad(`festa ${f.id}: tempo ${f.wx} sconosciuto`);
  if (!f.n || !f.d) bad(`festa ${f.id}: manca nome o descrizione`);
});
for (const [k, [s, g]] of Object.entries(D.COMPLEANNI)) {
  if (!D.KEYS[k]) bad(`compleanno di ${k}: non è un personaggio che diventa habitué`);
  if (giorniFesta.has(s * 10 + g)) bad(`compleanno di ${k}: cade in un giorno di festa`);
  if (!D.COMPL_L[k]) bad(`compleanno di ${k}: manca la sua frase`);
}
Object.keys(D.KEYS).forEach(k => !D.COMPLEANNI[k] && bad(`${k}: manca il compleanno`));
D.ANNIV.forEach((a, i) => a.forEach(l => (!(l[0] === 0 || l[0] === 1) || !l[1]) && bad(`anniversario ${i}: battuta non valida`)));

// --- personaggi chiave, legami di partenza, incontri ed epiloghi
for (const [k, K] of Object.entries(D.KEYS)) {
  if (!D.CH[k]) bad(`KEYS ${k}: non esiste in CH`);
  if (!D.MENU.find(m => m.id === K.fav)) bad(`KEYS ${k}: ordine preferito ${K.fav} non è nel menu`);
  K.l.forEach(x => {
    if (Array.isArray(x) && !produced.has(x[1])) bad(`KEYS ${k}: condizione ${x[1]} mai scelta`);
  });
}
D.KSEED.forEach(([a, b]) => {
  if (!D.KEYS[a] || !D.KEYS[b]) bad(`KSEED ${a}-${b}: entrambi devono essere in KEYS`);
});
const xids = new Set();
D.XS.concat(D.XEPI).forEach(x => {
  if (xids.has(x.id)) bad(`incontro ${x.id}: id doppio`);
  xids.add(x.id);
  x.w.forEach(k => {
    if (!D.KEYS[k]) bad(`incontro ${x.id}: ${k} non è in KEYS, non tornerebbe mai`);
  });
  x.l.forEach((l, i) => {
    if (!(l[0] >= 0 && l[0] < x.w.length) || !l[1]) bad(`incontro ${x.id}/${i}: battuta non valida`);
    if (l[2] && !produced.has(l[2])) bad(`incontro ${x.id}/${i}: condizione ${l[2]} mai scelta`);
  });
});
for (const [k, L] of Object.entries(D.REL))
  L.forEach((s, i) =>
    s.forEach(l => {
      if (!Array.isArray(l) || !(l[0] === 0 || l[0] === 1)) bad(`frasi REL.${k}/${i}: battuta non valida`);
    })
  );

// --- ricette del laboratorio
const combos = new Set();
D.RICETTE.forEach(r => {
  r.ing.forEach(k => {
    if (!D.INGR[k]) bad(`ricetta ${r.id}: ingrediente ${k} sconosciuto`);
  });
  if (r.ing.length < 2 || r.ing.length > 3) bad(`ricetta ${r.id}: servono 2 o 3 ingredienti`);
  const key = r.ing.slice().sort().join('+');
  if (combos.has(key)) bad(`ricetta ${r.id}: stessa combinazione di un'altra`);
  combos.add(key);
  if (!['m', 'b', 'v', 'k'].includes(r.s) || !(r.p > 0) || !r.n || !r.a) bad(`ricetta ${r.id}: campi mancanti`);
  if (D.MENU.some(m => m.id === r.id)) bad(`ricetta ${r.id}: id già usato nel menu`);
});

// --- app offline: ogni file del gioco deve essere nella lista del servizio offline (sw.js)
// La mente dei personaggi (voci.js): ogni personaggio chiave ha il suo profilo, ogni argomento esiste
// e ha tutte le parti, ogni stile di risposta c'è dappertutto, e nelle frasi solo segnaposti conosciuti.
const V = vm.runInContext(
  '({ MENTI_K, TEMI, TRAITS, TRATTI_P, TRATTI_INT, TIPO_INT, TIPO_P, TYPES, RISP, APRI, APRI_R, PRIMA, CHIUDI, CONFIDA, NOTIZIE, NOTIZIE_R, RICORDO_A, RICORDO_R, FUTURO, PUNGE, LITE, CHIARO, PENSA, PENSA_TR, SALUTA, SALUTA_R, REAZ, TOCCO, RIC_N, CAR_N, AFF_TR })',
  ctx
);
const STILI = ['caldo', 'ironico', 'timido', 'brontolone', 'entusiasta'];
Object.keys(D.KEYS).forEach(k => {
  if (!V.MENTI_K[k]) bad(`voci: il personaggio chiave ${k} non ha il suo profilo in MENTI_K`);
});
Object.entries(V.MENTI_K).forEach(([k, m]) => {
  if (!D.KEYS[k]) bad(`voci: MENTI_K.${k} non è un personaggio chiave`);
  (m.int || []).forEach(t => V.TEMI[t] || bad(`voci: ${k} ama parlare di «${t}», ma l'argomento non esiste in TEMI`));
  Object.keys(m.p || {}).forEach(
    x => ['soc', 'cal', 'iro', 'sens', 'ape', 'rom', 'bro', 'ene'].includes(x) || bad(`voci: ${k} ha la manopola sconosciuta ${x}`)
  );
});
V.TRAITS.forEach(t => {
  if (!V.TRATTI_P[t]) bad(`voci: il tratto ${t} non ha il carattere in TRATTI_P`);
  if (!V.PENSA_TR[t]) bad(`voci: il tratto ${t} non ha pensieri in PENSA_TR`);
  (V.TRATTI_INT[t] || []).forEach(x => V.TEMI[x] || bad(`voci: TRATTI_INT.${t} usa «${x}», che non è in TEMI`));
});
Object.entries(V.TIPO_INT).forEach(([k, l]) => l.forEach(x => V.TEMI[x] || bad(`voci: TIPO_INT.${k} usa «${x}», che non è in TEMI`)));
Object.keys(V.TIPO_P).forEach(k => V.TYPES[k] || bad(`voci: TIPO_P.${k} non è un tipo di cliente`));
Object.keys(V.AFF_TR).forEach(k => {
  const [a, b] = k.split('|');
  if (!V.TRAITS.includes(a) || !V.TRAITS.includes(b) || [a, b].sort().join('|') !== k)
    bad(`voci: AFF_TR «${k}» (tratti in ordine alfabetico)`);
});
Object.entries(V.TEMI).forEach(([k, T]) => ['a', 'si', 'solo'].forEach(x => (T[x] && T[x].length) || bad(`voci: TEMI.${k} senza «${x}»`)));
const perStile = (o, nome) => STILI.forEach(s => (o[s] && o[s].length) || bad(`voci: ${nome} senza lo stile ${s}`));
[
  [V.RISP.si, 'RISP.si'],
  [V.RISP.no, 'RISP.no'],
  [V.APRI_R.cono, 'APRI_R.cono'],
  [V.APRI_R.vicini, 'APRI_R.vicini'],
  [V.PRIMA.a, 'PRIMA.a'],
  [V.PRIMA.r, 'PRIMA.r'],
  [V.CHIUDI, 'CHIUDI'],
  [V.CONFIDA.r, 'CONFIDA.r'],
  [V.NOTIZIE_R, 'NOTIZIE_R'],
  [V.RICORDO_R, 'RICORDO_R'],
  [V.PUNGE.r, 'PUNGE.r'],
  [V.SALUTA_R, 'SALUTA_R'],
  [V.PENSA.attesa, 'PENSA.attesa'],
  [V.PENSA.sporco, 'PENSA.sporco'],
  [V.PENSA.perfetto, 'PENSA.perfetto'],
  ...Object.entries(V.REAZ).map(([k, o]) => [o, 'REAZ.' + k]),
  ...['poco', 'medio', 'tanto'].map(k => [V.TOCCO[k], 'TOCCO.' + k])
].forEach(([o, n]) => perStile(o, n));
['spesso', 'lontani'].forEach(g =>
  ['amici', 'amore', 'cono', 'rivali', 'famiglia'].forEach(k => (V.APRI[g][k] || []).length || bad(`voci: APRI.${g}.${k} vuoto`))
);
['amici', 'amore', 'cotta', 'cono', 'rivali', 'famiglia', 'lite'].forEach(
  k => (V.SALUTA[k] || []).length || bad(`voci: SALUTA.${k} vuoto`)
);
Object.entries(V.NOTIZIE).forEach(
  ([k, N]) => (N.a && N.a.length && N.io && N.io.length) || bad(`voci: NOTIZIE.${k} deve avere «a» e «io»`)
);
// i segnaposti: solo quelli che il motore sa riempire
const SEGN = new Set(['{A}', '{B}', '{X}', '{Y}', '{item}', '{giorni}', '{meteo}', '{nome}', '{v}', '{o}', '{X:o}']);
const testiM = [];
const raccogli = (x, dove) => {
  if (typeof x === 'string') testiM.push([x, dove]);
  else if (Array.isArray(x)) x.forEach((y, i) => raccogli(y, dove));
  else if (x && typeof x === 'object') Object.entries(x).forEach(([k, y]) => raccogli(y, dove + '.' + k));
};
Object.entries(V).forEach(
  ([k, x]) => !['TRAITS', 'TYPES', 'TRATTI_P', 'TIPO_P', 'AFF_TR', 'MENTI_K', 'TRATTI_INT', 'TIPO_INT'].includes(k) && raccogli(x, k)
);
testiM.forEach(([t, dove]) =>
  (t.match(/\{[^}]*\}/g) || []).forEach(m => SEGN.has(m) || bad(`voci: ${dove}: segnaposto sconosciuto ${m} in «${t}»`))
);
// le scenette di litigio e chiarimento: battute di 0 o 1
[...V.LITE, ...V.CHIARO].forEach((L, i) => L.forEach(l => [0, 1].includes(l[0]) || bad(`voci: LITE/CHIARO ${i}: chi parla?`)));

// Il mondo che va avanti da solo (trame.js): progetti, quartiere, storie che nascono da sole
const M = vm.runInContext('({ PROGETTI, QUARTIERE, TRAME, PJ_CHIEDI, PJ_TIFO, PARERE, PARERE_DOPO, QZ_R, CORTESIA, CORT_PENSA })', ctx);
// gentilezze: tutti gli stili, e solo segnaposti conosciuti
['offre', 'ricambia', 'si', 'no', 'posto', 'postoSi', 'postoNo'].forEach(k => perStile(M.CORTESIA[k], 'CORTESIA.' + k));
const segC = (x, dove) =>
  typeof x === 'string'
    ? (x.match(/\{[^}]*\}/g) || []).forEach(
        m => ['{X}', '{X:o}', '{o}', '{item}'].includes(m) || bad(`cortesie: ${dove}: segnaposto sconosciuto ${m}`)
      )
    : Object.entries(x).forEach(([k, y]) => segC(y, dove + '.' + k));
segC(M.CORTESIA, 'CORTESIA');
segC(M.CORT_PENSA, 'CORT_PENSA');
// il giornale del caffè: segnaposti conosciuti, un titolo per ogni tipo di notizia
const GZ = vm.runInContext(
  '({ GZ_PEZZI, GZ_PESO, GZ_DICERIE, GZ_SMENTITA, GZ_LETTORI, GZ_CURIOSITA, GZ_ANNUNCI, GZ_RISPOSTA, GZ_METEO, GZ_CORSIVO, WXN, TEMI })',
  ctx
);
const segG = (x, dove) =>
  typeof x === 'string'
    ? (x.match(/\{[^}]*\}/g) || []).forEach(
        m =>
          ['{X}', '{Y}', '{P}', '{T}', '{Q}', '{n}', '{g}', '{v}', '{o}', '{X:o}'].includes(m) ||
          bad(`giornale: ${dove}: segnaposto sconosciuto ${m}`)
      )
    : Object.entries(x).forEach(([k, y]) => segG(y, dove + '.' + k));
Object.entries(GZ).forEach(([k, x]) => !['GZ_PESO', 'WXN', 'TEMI'].includes(k) && segG(x, k));
Object.keys(GZ.GZ_PEZZI).forEach(k => (GZ.GZ_PEZZI[k].t.length && GZ.GZ_PESO[k]) || bad(`giornale: ${k} senza titoli o senza peso`));
Object.keys(GZ.WXN).forEach(w => GZ.GZ_METEO[w] || bad(`giornale: manca il meteo per ${w}`));
Object.keys(GZ.GZ_ANNUNCI).forEach(i => GZ.TEMI[i] || bad(`giornale: annuncio per «${i}», che non è in TEMI`));
const CASTS = ['giu', 'rivali', 'lontani', 'cotta', 'segreto', 'nuovo', 'gelosia', 'grande', 'mano', 'adozione', 'festa'];
const segnaM = (t, ok, dove) =>
  (t.match(/\{[^}]*\}/g) || []).forEach(m => ok.includes(m) || bad(`trame: ${dove}: segnaposto sconosciuto ${m} in «${t}»`));
const SEG_PJ = ['{o}', '{P}'],
  SEG_TR = ['{a}', '{b}', '{c}', '{a:o}', '{b:o}', '{c:o}', '{o}', '{P}', '{Q}', '{item}'];
const pjIds = new Set();
M.PROGETTI.forEach(P => {
  if (pjIds.has(P.id)) bad(`trame: progetto ${P.id} doppio`);
  pjIds.add(P.id);
  if (!(P.passi >= 2)) bad(`trame: progetto ${P.id} con meno di 2 tappe`);
  ['an', 'su', 'giu', 'si', 'no', 'dubbio'].forEach(k => (P[k] && P[k].length) || bad(`trame: progetto ${P.id} senza «${k}»`));
  P.int.forEach(t => V.TEMI[t] || bad(`trame: progetto ${P.id}: argomento «${t}» non in TEMI`));
  ['an', 'su', 'giu', 'si', 'no', 'dubbio'].forEach(k => (P[k] || []).forEach(t => segnaM(t, SEG_PJ, 'progetto ' + P.id)));
});
M.PJ_CHIEDI.forEach(t => segnaM(t, ['{P}'], 'PJ_CHIEDI'));
perStile(M.PJ_TIFO, 'PJ_TIFO');
perStile(M.QZ_R, 'QZ_R');
['consola', 'sprona', 'scherza'].forEach(k => {
  if (!M.PARERE.o[k] || !(M.PARERE.bene[k] || []).length || !(M.PARERE.male[k] || []).length) bad(`trame: PARERE incompleto per ${k}`);
  if (!M.PARERE_DOPO.si[k] || !M.PARERE_DOPO.no[k]) bad(`trame: PARERE_DOPO incompleto per ${k}`);
});
const trIds = new Set(M.TRAME.map(T => T.id));
const qIds = new Set(M.QUARTIERE.map(q => q.id));
M.QUARTIERE.forEach(q => {
  if (!q.l || !q.l.length || !q.n || !q.dur) bad(`trame: quartiere ${q.id} incompleto`);
  if (q.trama && !trIds.has(q.trama)) bad(`trame: quartiere ${q.id}: la storia ${q.trama} non esiste`);
  if (q.dopo && (!qIds.has(q.dopo) || !M.QUARTIERE.find(x => x.id === q.dopo).solo))
    bad(`trame: quartiere ${q.id}: «dopo» deve essere un evento con solo: 1`);
  q.l.forEach(t => segnaM(t, ['{o}'], 'quartiere ' + q.id));
});
M.TRAME.forEach(T => {
  if (!CASTS.includes(T.cast)) bad(`trame: ${T.id}: cast «${T.cast}» sconosciuto (aggiungerlo anche a TRAME_CAST)`);
  if (!T.t || !T.d || !T.passi.length) bad(`trame: ${T.id} incompleta`);
  segnaM(T.d, SEG_TR, T.id + ' (diario)');
  const scelte = new Set();
  T.passi.forEach((P, i) => {
    const dove = `${T.id}/${i}`;
    if (!/^[abc]{1,2}$/.test(P.who)) bad(`trame: ${dove}: who «${P.who}» (lettere a, b, c; al massimo due)`);
    const n = P.who.length,
      qui = new Set(P.calc ? ['@si', '@no'] : []);
    const riga = l => {
      if (!(l[0] >= 0 && l[0] < n)) bad(`trame: ${dove}: chi parla (${l[0]}) non c'è`);
      segnaM(l[1], SEG_TR, dove);
      if (l[2] && !scelte.has(l[2]) && !qui.has(l[2]))
        bad(`trame: ${dove}: la condizione ${l[2]} non viene da una scelta di un passo precedente o da calc`);
    };
    const nuove = [];
    P.l.forEach(l => {
      if (Array.isArray(l)) riga(l);
      else if (l && l.c) {
        segnaM(l.c.q, SEG_TR, dove);
        if (l.c.o.length < 2) bad(`trame: ${dove}: una scelta vuole almeno due risposte`);
        l.c.o.forEach(o => {
          if (!/^@\w+$/.test(o.f)) bad(`trame: ${dove}: scelta «${o.f}» (deve essere @parola)`);
          segnaM(o.t, SEG_TR, dove);
          o.r.forEach(riga);
          nuove.push(o.f);
        });
      } else bad(`trame: ${dove}: riga sconosciuta`);
    });
    nuove.forEach(f => scelte.add(f));
    qui.forEach(f => scelte.add(f)); // gli esiti calcolati valgono anche per i passi dopo
  });
});

// Gocce, il social del quartiere: tutti gli stili, ogni tipo di foto ha le sue didascalie
const SO = vm.runInContext('({ SO_TIPI, SO_SI, SO_NO, SO_COMMENTI, SO_RISPOSTA, SO_PENSA, SO_GIORNALE, SO_MIEI, SO_INVITO })', ctx);
['SO_SI', 'SO_NO', 'SO_COMMENTI', 'SO_RISPOSTA'].forEach(k => perStile(SO[k], k));
Object.keys(SO.SO_TIPI).forEach(k => {
  if (!vm.runInContext('GRAM', ctx)['didascalia_' + k]) bad(`social: il tipo di foto ${k} non ha didascalie (GRAM.didascalia_${k})`);
  if (!SO.SO_TIPI[k].g.length || !SO.SO_TIPI[k].h.length) bad(`social: il tipo di foto ${k} senza gesti o hashtag`);
});
const segS = (x, dove) =>
  typeof x === 'string'
    ? (x.match(/\{[^}]*\}/g) || []).forEach(
        m => ['{X}', '{X:o}', '{o}', '{item}', '{n}', '{C}'].includes(m) || bad(`social: ${dove}: segnaposto sconosciuto ${m}`)
      )
    : Object.entries(x).forEach(([k, y]) => segS(y, dove + '.' + k));
Object.entries(SO).forEach(([k, x]) => segS(x, k));

// frasi costruite a pezzi (grammatica.js): ogni {pezzo} esiste, e si contano le combinazioni possibili
const GRAM = vm.runInContext('GRAM', ctx);
const contaG = {};
const quante = (k, d) => {
  if (d > 6) return 1;
  if (contaG[k] != null) return contaG[k];
  // tutti i pezzi possibili di un nome: i suoi più quelli delle circostanze (nome@...)
  const tutti = Object.keys(GRAM)
    .filter(x => x === k || x.startsWith(k + '@'))
    .flatMap(x => GRAM[x]);
  const n = tutti.reduce(
    (s, t) =>
      s +
      (t.match(/\{([a-z_]+)\}/g) || []).reduce((p, m) => {
        let x = m.slice(1, -1);
        if (x.endsWith('_cap')) x = x.slice(0, -4);
        return GRAM[x] ? p * quante(x, d + 1) : p;
      }, 1),
    0
  );
  return (contaG[k] = n);
};
Object.entries(GRAM).forEach(([k, L]) => {
  if (!Array.isArray(L) || !L.length) bad(`grammatica: ${k} vuoto`);
  L.forEach(t =>
    (t.match(/\{[^}]*\}/g) || []).forEach(m => {
      let x = m.slice(1, -1);
      if (/^[A-Z]$/.test(x) || ['item', 'o', 'X:o'].includes(x)) return;
      if (x.endsWith('_cap')) x = x.slice(0, -4);
      if (!GRAM[x]) bad(`grammatica: ${k}: il pezzo ${m} non esiste`);
    })
  );
  if (k.includes('@') && !GRAM[k.split('@')[0]]) bad(`grammatica: ${k}: manca il pezzo base ${k.split('@')[0]}`);
  if (
    k.includes('@') &&
    ![
      'pioggia',
      'temporale',
      'sereno',
      'nuvoloso',
      'nebbia',
      'neve',
      'mattina',
      'pomeriggio',
      'sera',
      'notte',
      'primavera',
      'estate',
      'autunno',
      'inverno',
      'felice',
      'giu',
      'pieno',
      'vuoto',
      'festa'
    ].includes(k.split('@')[1])
  )
    bad(`grammatica: ${k}: circostanza sconosciuta`);
});
const combG = Object.keys(GRAM)
  .filter(k => /^(pensiero|domanda|risposta|breve|diceria)/.test(k) && !k.includes('@'))
  .reduce((s, k) => s + (GRAM[k] ? quante(k, 0) : 0), 0);

const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
[...html.matchAll(/<script src="([^"]+)"/g)]
  .map(m => m[1])
  .concat(['css/stile.css', 'manifest.webmanifest'])
  .forEach(f => {
    if (!sw.includes(`'${f}'`)) bad(`sw.js: manca ${f} nella lista dei file offline`);
  });

const n = (a, b) => `${a} ${b}`;
console.log(
  [
    n(Object.keys(D.CH).length, 'personaggi'),
    n(D.ARCS.length, 'storie'),
    n(
      D.ARCS.reduce((s, a) => s + a.ch.length, 0),
      'capitoli'
    ),
    n(D.FILI.length, 'vite'),
    n(D.FILI2.length, 'vite a due'),
    n(D.FESTE.length, 'feste'),
    n(D.XS.length, 'incontri'),
    n(D.XEPI.length, 'epiloghi'),
    n(testiM.length, 'frasi della mente'),
    n(M.PROGETTI.length, 'progetti'),
    n(M.QUARTIERE.length, 'eventi di quartiere'),
    n(M.TRAME.length, 'storie che nascono da sole'),
    n(combG.toLocaleString('it-IT'), 'frasi possibili costruite a pezzi')
  ].join(' · ')
);
if (problems.length) {
  problems.forEach(p => console.log('  ✗ ' + p));
  console.log(`\n${problems.length} problemi nei contenuti`);
  process.exit(1);
}
console.log('✓ Contenuti coerenti');
