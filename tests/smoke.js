// Test automatico del gioco. Uso:  node tests/smoke.js
// Serve Playwright con Chromium (npm i -D playwright && npx playwright install chromium).
// Controlla: coerenza dei dati delle storie, minigiochi, pulsante Servi, pulizia tavoli,
// pannelli, esporta/importa salvataggio e qualche minuto di gioco accelerato senza errori.
const path = require('path');
const { chromium } = require('playwright');
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const KEY = 'cafe_pioggia_v2';
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

const SAVE = {
  v: 2, name: 'Test Bar', coins: 5e6, hearts: 20, space: 3, tables: 6, chairs: 4, decor: 6, music: 3, cat: 1,
  barista: 1, waiter: 1, cook: 1, machine: 3, menu: 14, wifi: 2,
  story: {}, perks: {}, flags: {}
};

async function startGame(page, save) {
  await page.addInitScript(([k, s]) => { if (!localStorage.getItem('__test_seeded')) { localStorage.setItem(k, JSON.stringify(s)); localStorage.setItem('__test_seeded', '1'); } }, [KEY, save]);
  await page.goto(FILE);
  await page.waitForTimeout(400);
  await page.click('#go');
  await page.waitForTimeout(800);
}

function validateData(D) {
  console.log('Dati delle storie');
  const { ARCS, CH } = D;
  const produced = new Set();
  ARCS.forEach(a => a.ch.forEach(c => c.l.forEach(l => { if (l && l.c) l.c.o.forEach(o => produced.add(o.f)); })));
  const ids = new Set(ARCS.map(a => a.id));
  let problems = [];
  const chkLine = (l, who, where) => {
    if (Array.isArray(l)) {
      if (!(l[0] >= 0 && l[0] < who.length)) problems.push(`${where}: chi parla (${l[0]}) non esiste`);
      if (typeof l[1] !== 'string' || !l[1].trim()) problems.push(`${where}: battuta vuota`);
      if (l[2] && !produced.has(l[2])) problems.push(`${where}: condizione ${l[2]} mai scelta da nessuna parte`);
    } else if (l && l.c) {
      if (!l.c.q || l.c.o.length < 2) problems.push(`${where}: scelta incompleta`);
      l.c.o.forEach(o => { if (!/^\w+=\w+$/.test(o.f)) problems.push(`${where}: flag ${o.f} malformato`); o.r.forEach(x => chkLine(x, who, where + ' (risposta)')); });
    } else problems.push(`${where}: riga sconosciuta`);
  };
  for (const a of ARCS) {
    a.who.forEach(w => { if (!CH[w]) problems.push(`${a.id}: personaggio ${w} mancante`); });
    a.ch.forEach((c, i) => {
      const who = c.who || a.who;
      who.forEach(w => { if (!CH[w]) problems.push(`${a.id}/${i}: personaggio ${w} mancante`); });
      if (who.length > 2) problems.push(`${a.id}/${i}: più di 2 personaggi a un tavolo`);
      if (i && c.r < a.ch[i - 1].r) problems.push(`${a.id}/${i}: soglia di atmosfera più bassa del capitolo prima`);
      c.l.forEach((l, j) => chkLine(l, who, `${a.id}/${i}/${j}`));
      // le condizioni nello stesso capitolo della scelta non funzionerebbero (sono filtrate a inizio scena)
      const here = new Set(); c.l.forEach(l => { if (l && l.c) l.c.o.forEach(o => here.add(o.f)); });
      c.l.forEach(l => { if (Array.isArray(l) && l[2] && here.has(l[2])) problems.push(`${a.id}/${i}: condizione ${l[2]} nello stesso capitolo della scelta`); });
    });
    const lastWho = a.ch[a.ch.length - 1].who || a.who;
    (a.rt || []).forEach((r, i) => r.forEach((l, j) => chkLine(l, lastWho, `${a.id}/rt${i}/${j}`)));
    [].concat(a.req || []).forEach(r => { const [id] = r.split('='); if (!ids.has(id)) problems.push(`${a.id}: requisito ${id} inesistente`); if (r.includes('=') && !produced.has(r)) problems.push(`${a.id}: requisito ${r} mai scelto`); });
    if (a.end) Object.keys(a.end).forEach(f => { if (!produced.has(f)) problems.push(`${a.id}: finale ${f} irraggiungibile`); });
    // ogni finale deve avere almeno una battuta dedicata nel capitolo finale o nelle risposte
    if (a.end) Object.keys(a.end).forEach(f => {
      const last = a.ch[a.ch.length - 1];
      const has = last.l.some(l => (Array.isArray(l) && l[2] === f) || (l && l.c && l.c.o.some(o => o.f === f)));
      if (!has) problems.push(`${a.id}: il finale ${f} non ha battute proprie nell'ultimo capitolo`);
    });
  }
  problems.forEach(p => console.log('    - ' + p));
  ok(!problems.length, `${ARCS.length} storie, ${Object.keys(CH).length} personaggi, ${produced.size} scelte: nessuna incoerenza`);
}


async function tapWorld(page, wx, wy) {
  const pt = await page.evaluate(([wx, wy]) => { const C = window.__cafe, cv = document.querySelector('#c'), r = cv.getBoundingClientRect();
    if ((wx - C.camX) * C.S / C.DPR < 10 || (wx - C.camX) * C.S / C.DPR > innerWidth - 10) C.camX = Math.max(0, Math.min(C.W - Math.ceil(cv.width / C.S), wx - Math.ceil(cv.width / C.S) / 2));
    return { x: (wx - C.camX) * C.S / C.DPR + r.left, y: wy * C.S / C.DPR + r.top }; }, [wx, wy]);
  await page.mouse.click(pt.x, pt.y);
}

async function playMini(page, kind, itemId) {
  await page.evaluate(([kind, itemId]) => {
    const C = window.__cafe; const it = C.MENU.find(m => m.id === itemId);
    C.openMini({ order: it, type: 'normale', req: { mg: kind, t: 'Test' }, x: 0, y: 0 });
  }, [kind, itemId]);
  const mini = () => page.evaluate(() => { const m = window.__cafe.mini; return m && { pos: m.pos, zone: m.zone, done: m.done, q: m.q, lock: m.lock, phase: m.phase, seq: m.seq, hold: m.hold, k: m.k }; });
  const t0 = Date.now();
  let holding = false;
  while (Date.now() - t0 < 15000) {
    const m = await mini();
    if (!m || m.done) break;
    if (m.lock) { await sleep(30); continue; }
    const mid = (m.zone[0] + m.zone[1]) / 2, inZ = m.pos >= m.zone[0] + .01 && m.pos <= m.zone[1] - .01;
    if (kind === 'latte' || kind === 'padella') { if (Math.abs(m.pos - mid) < .03) await page.evaluate(() => window.__cafe.miniDown({ target: document.body })); }
    else if (kind === 'monta') {
      if (!m.hold && !holding) { await page.evaluate(() => window.__cafe.miniDown({ target: document.body })); holding = true; }
      else if (m.hold && m.pos >= mid - .02) { await page.evaluate(() => window.__cafe.miniUp()); holding = false; }
      else if (!m.hold) holding = false;
    }
    else if (kind === 'shaker') { if (m.pos < mid) await page.evaluate(() => window.__cafe.miniDown({ target: document.body })); }
    else if (kind === 'vetrina') {
      if (m.phase === 'pick') { for (const i of m.seq) { await page.click(`#mopts button[data-i="${i}"]`); await sleep(60); } }
    }
    await sleep(8);
  }
  const m = await mini();
  ok(m && m.done && m.q === 2, `minigioco ${kind} (${itemId}) giocato perfetto → ${m ? m.q : 'chiuso'} su 2`);
  await sleep(500);
  await page.evaluate(() => window.__cafe.finishMini());
  ok(await page.isHidden('#mini'), `minigioco ${kind} si chiude`);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 450 }, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await startGame(page, SAVE);

  validateData(await page.evaluate(() => ({ ARCS: window.__cafe.ARCS, CH: window.__cafe.CH })));

  console.log('Minigiochi');
  for (const [k, id] of [['latte', 'capp'], ['monta', 'capp'], ['monta', 'caffe'], ['padella', 'toast'], ['shaker', 'smooth'], ['vetrina', 'cake']]) await playMini(page, k, id);

  console.log('Bancone e tavoli');
  await page.evaluate(() => window.__cafe.speed = 1);
  const coins0 = await page.evaluate(() => window.__cafe.st.coins);
  // aspetta un cliente al bancone e servilo col pulsante
  for (let i = 0; i < 200; i++) { const q = await page.evaluate(() => { const q = window.__cafe.queue[0]; return q && q.state === 'order' && !q.special; }); if (q) break; await sleep(100); }
  for (let i = 0; i < 30; i++) { await page.locator('#serve').dispatchEvent('pointerdown'); await sleep(40); }
  ok(await page.evaluate(c => window.__cafe.st.coins > c, coins0), 'il pulsante Servi serve i clienti');
  const pts = await page.evaluate(() => {
    const C = window.__cafe, cv = document.querySelector('#c'), r = cv.getBoundingClientRect();
    C.camX = Math.max(0, C.counterX + 86 - Math.ceil(cv.width / C.S));
    const out = [];
    C.slots.forEach(sl => { if (sl.k < C.cols && sl.k < C.st.space) { sl.seats.forEach(s => { if (!s.occ) { s.dirty = true; s._t = 1; } }); out.push({ x: (sl.x - C.camX) * C.S / C.DPR + r.left, y: (sl.y - 8) * C.S / C.DPR + r.top }); } });
    return out.filter(p => p.x > 0 && p.x < innerWidth);
  });
  for (const p of pts) { await page.mouse.click(p.x, p.y); await sleep(60); }
  const dirty = await page.evaluate(() => window.__cafe.slots.some(sl => sl.seats.some(s => { const d = s._t && s.dirty; delete s._t; return d; })));
  ok(pts.length > 0 && !dirty, `toccando i tavoli (${pts.length}) si puliscono, anche vicino al bancone`);

  console.log('Pannelli');
  for (const p of ['up', 'cli', 'day', 'set']) {
    await page.click(`#hud button[data-p="${p}"]`); await sleep(150);
    const tabs = await page.$$eval('#tabs button', b => b.map(x => x.textContent));
    for (const t of tabs) { await page.click(`#tabs button:has-text("${t}")`); await sleep(60); }
    ok(true, `pannello ${p} (${tabs.join(', ') || 'senza schede'})`);
    await page.click('#pclose'); await sleep(250);
  }
  await page.click('#hud button[data-p="up"]'); await sleep(150);
  await page.click('#tabs button:has-text("Staff")'); await sleep(100);
  const g0 = await page.evaluate(() => window.__cafe.st.grinder);
  await page.click('button[data-u="grinder"]'); await sleep(100);
  ok(await page.evaluate(g => window.__cafe.st.grinder === g + 1, g0), 'si può comprare un miglioramento (macinino)');
  await page.click('#pclose'); await sleep(250);


  console.log('Segreti e interazioni');
  await page.evaluate(() => { window.__cafe.speed = 1; const st = window.__cafe.st; st.found = {}; });
  for (let i = 0; i < 6; i++) { await tapWorld(page, 18, 70); await sleep(60); }
  ok(await page.evaluate(() => !!window.__cafe.st.found.campanello), 'campanello della porta (6 tocchi) → segreto');
  await page.evaluate(() => { window.__cafe.queue.length = 0; });
  const W = await page.evaluate(() => window.__cafe.W);
  await tapWorld(page, W - 20, 90); await sleep(80);
  ok(await page.evaluate(() => !!window.__cafe.st.found.pausa && window.__cafe.boostT > 0), 'macchina del caffè senza clienti → pausa caffè e tocchi doppi');
  const sb = await page.evaluate(() => window.__cafe.signBox);
  for (let i = 0; i < 8; i++) { await tapWorld(page, sb.x + sb.w / 2, sb.y + 7); await sleep(50); }
  ok(await page.evaluate(() => !!window.__cafe.st.found.insegna), 'insegna toccata 8 volte → neon arcobaleno');
  const cb = await page.evaluate(() => window.__cafe.CB);
  if (cb.chalk) {
    await tapWorld(page, cb.chalk.x + 10, cb.chalk.y + 10); await sleep(150);
    await page.fill('#chIn', 'Oggi piove, resta qui'); await page.click('#mbox .btns .big'); await sleep(100);
    ok(await page.evaluate(() => window.__cafe.st.chalk === 'Oggi piove, resta qui' && !!window.__cafe.st.found.lavagna), 'si scrive sulla lavagna');
  }
  if (cb.rec) { for (let i = 0; i < 3; i++) { await tapWorld(page, cb.rec.x + 6, cb.rec.y + 9); await sleep(80); } ok(await page.evaluate(() => !!window.__cafe.st.found.radio), 'giradischi: tutte le stazioni → segreto'); }
  if (cb.plant) { for (let i = 0; i < 3; i++) { await tapWorld(page, cb.plant.x + 4, cb.plant.y + 10); await sleep(80); } ok(await page.evaluate(() => !!window.__cafe.st.flower), 'annaffiando la pianta sboccia un fiore'); }
  const pane = await page.evaluate(() => window.__cafe.panes().find(p => !p.locked));
  await page.evaluate(() => { window.__cafe.st.wx = 'pioggia'; window.__cafe.st.wx2 = null; });
  await tapWorld(page, pane.x + 20, 78); await sleep(80);
  ok(await page.evaluate(() => !!window.__cafe.st.found.disegno), 'disegno sul vetro appannato quando piove');
  await page.evaluate(() => { const C = window.__cafe; C.st.wx = 'pioggia'; C.st.tod = .9; C.st.rareDay = 0; for (let i = 0; i < 40 && !C.queue.some(p => p.rare); i++) C.tryRare(); });
  const rare = await page.evaluate(() => { const p = window.__cafe.queue.find(p => p.rare); return p && p.rare; });
  ok(!!rare, `arriva un visitatore raro (${rare})`);
  await page.evaluate(() => { window.__cafe.st.tod = .3; });

  console.log('Gioco accelerato (storie, richieste speciali, scelte)');
  await page.evaluate(() => { const st = window.__cafe.st; st.decor = 8; st.chairs = 6; st.music = 4; window.__cafe.speed = 6; });
  const t0 = Date.now(); let choices = 0, minis = 0;
  while (Date.now() - t0 < 45000) {
    if (await page.isVisible('.choice button')) { await page.click('.choice button >> nth=0'); choices++; }
    if (await page.isVisible('#mini')) { await page.evaluate(() => { const C = window.__cafe; const m = C.mini; if (m && !m.done) { m.done = true; m.q = 1; m.endT = 0; } C.finishMini(); }); minis++; }
    if (await page.isVisible('#modal') && !(await page.isVisible('.choice button'))) { const b = page.locator('#modal .btns button').last(); if (await b.count()) await b.click(); }
    await page.locator('#serve').dispatchEvent('pointerdown');
    await sleep(120);
  }
  const st = await page.evaluate(() => { const s = window.__cafe.st; return { served: s.served, story: Object.values(s.story).reduce((a, b) => a + b, 0) }; });
  ok(st.served > 20, `gioco accelerato: ${st.served} clienti serviti, ${st.story} capitoli, ${choices} scelte, ${minis} speciali`);
  await page.evaluate(() => window.__cafe.speed = 1);

  console.log('Salvataggio');
  await page.click('#hud button[data-p="set"]'); await sleep(150);
  await page.click('#exp'); await sleep(150);
  const code = await page.inputValue('#savecode');
  const name = await page.evaluate(() => window.__cafe.st.name);
  ok(code.length > 100, 'esporta produce un codice');
  await page.click('#modal .btns button >> nth=0'); await sleep(100);
  await page.evaluate(k => { const s = JSON.parse(localStorage.getItem(k)); s.name = 'Altro'; localStorage.setItem(k, JSON.stringify(s)); }, KEY);
  await page.click('#imp'); await sleep(150);
  await page.fill('#savein', code);
  await Promise.all([page.waitForEvent('load'), page.click('#modal .btns button >> nth=1')]);
  await page.waitForTimeout(300);
  ok(await page.evaluate(([k, n]) => JSON.parse(localStorage.getItem(k)).name === n, [KEY, name]), 'importa ripristina la partita');
  await page.evaluate(k => localStorage.setItem(k, '{rotto'), KEY);
  await page.reload(); await page.waitForTimeout(300);
  ok(await page.evaluate(() => !!window.__cafe.st.name), 'con il salvataggio rovinato riparte dalla copia di riserva');


  console.log('Ricomincia e filmato');
  await page.click('#go'); await sleep(700);
  await page.click('#hud button[data-p="set"]'); await sleep(150);
  await page.click('#rst'); await sleep(100);
  await Promise.all([page.waitForEvent('load'), page.click('#rst')]);
  await page.waitForTimeout(400);
  const after = await page.evaluate(k => ({ ls: localStorage.getItem(k), bak: localStorage.getItem(k + '_bak'), name: window.__cafe.st.name, day: window.__cafe.st.day, tables: window.__cafe.st.tables }), KEY);
  ok(!after.ls && !after.bak && !after.name && after.day === 1 && after.tables === 1, `Ricomincia azzera tutto (giorno ${after.day}, tavoli ${after.tables})`);
  await page.click('#go'); await sleep(1500);
  ok(await page.evaluate(() => !!window.__cafe.cine), 'nuova partita: parte il filmato iniziale');
  await page.click('#skip'); await sleep(300);
  ok(await page.isVisible('#naming'), 'il filmato si può saltare e poi si sceglie il nome');
  await page.fill('#nameIn', 'Bar Luna'); await page.click('#openBtn'); await sleep(600);
  ok(await page.evaluate(() => window.__cafe.st.name === 'Bar Luna' && !!window.__cafe.st.found.nome && window.__cafe.st.day === 1), 'si apre il nuovo locale (e il nome «Luna» è un segreto)');

  ok(!errors.length, 'nessun errore JavaScript' + (errors.length ? ': ' + [...new Set(errors)].join(' | ') : ''));
  await browser.close();
  console.log(fails ? `\n${fails} controlli FALLITI` : '\nTutto ok');
  process.exit(fails ? 1 : 0);
})();
