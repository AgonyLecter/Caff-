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
const D = vm.runInContext('({ CH, ARCS, MENU, FILI, FILI2, KEYS, KSEED, XS, XEPI, REL, PETC, RICETTE, INGR })', ctx);

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
    n(D.XS.length, 'incontri'),
    n(D.XEPI.length, 'epiloghi')
  ].join(' · ')
);
if (problems.length) {
  problems.forEach(p => console.log('  ✗ ' + p));
  console.log(`\n${problems.length} problemi nei contenuti`);
  process.exit(1);
}
console.log('✓ Contenuti coerenti');
