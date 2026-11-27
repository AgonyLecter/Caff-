// Test automatico del gioco. Uso:  node tests/smoke.js
// Serve Playwright con Chromium (npm i -D playwright && npx playwright install chromium).
// Controlla: coerenza dei dati delle storie, minigiochi, pulsante Servi, pulizia tavoli,
// pannelli, esporta/importa salvataggio e qualche minuto di gioco accelerato senza errori.
const path = require('path');
const { chromium } = require('playwright');
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const KEY = 'cafe_pioggia_v2';
let fails = 0;
const ok = (cond, msg) => {
  console.log((cond ? '  ✓ ' : '  ✗ ') + msg);
  if (!cond) fails++;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const SAVE = {
  v: 2,
  name: 'Test Bar',
  coins: 5e6,
  hearts: 20,
  space: 3,
  tables: 6,
  chairs: 4,
  decor: 6,
  music: 3,
  cat: 1,
  barista: 1,
  waiter: 1,
  cook: 1,
  machine: 3,
  menu: 14,
  wifi: 2,
  story: {},
  perks: {},
  flags: {},
  tutOff: 1, // i consigli di Nonna Rosa hanno il loro test
  introDone: 1 // anche la scena d'apertura
};

async function startGame(page, save) {
  await page.addInitScript(
    ([k, s]) => {
      if (!localStorage.getItem('__test_seeded')) {
        localStorage.setItem(k, JSON.stringify(s));
        localStorage.setItem('__test_seeded', '1');
      }
    },
    [KEY, save]
  );
  await page.goto(FILE);
  await page.waitForTimeout(400);
  await page.click('#go');
  await page.waitForTimeout(800);
  // gli imprevisti casuali (macchina in tilt, cocci...) hanno il loro test: qui non devono capitare a caso
  await page.evaluate(() => {
    incT = 1e12;
    machTilt = 0;
    // la regia (un racconto alla volta) ha i suoi test: negli altri non deve mettere in pausa ciò che si sta provando
    window.__cafe.regia.off = true;
  });
}

function validateData(D) {
  console.log('Dati delle storie');
  const { ARCS, CH } = D;
  const produced = new Set();
  ARCS.forEach(a =>
    a.ch.forEach(c =>
      c.l.forEach(l => {
        if (l && l.c) l.c.o.forEach(o => produced.add(o.f));
      })
    )
  );
  ARCS.forEach(a => a.ch.forEach(c => c.calc && c.calc.values.forEach(v => produced.add(c.calc.flag + '=' + v))));
  const ids = new Set(ARCS.map(a => a.id));
  let problems = [];
  const chkLine = (l, who, where) => {
    if (Array.isArray(l)) {
      if (!(l[0] >= 0 && l[0] < who.length)) problems.push(`${where}: chi parla (${l[0]}) non esiste`);
      if (typeof l[1] !== 'string' || !l[1].trim()) problems.push(`${where}: battuta vuota`);
      if (l[2] && !produced.has(l[2])) problems.push(`${where}: condizione ${l[2]} mai scelta da nessuna parte`);
    } else if (l && l.c) {
      if (!l.c.q || l.c.o.length < 2) problems.push(`${where}: scelta incompleta`);
      l.c.o.forEach(o => {
        if (!/^\w+=\w+$/.test(o.f)) problems.push(`${where}: flag ${o.f} malformato`);
        o.r.forEach(x => chkLine(x, who, where + ' (risposta)'));
      });
    } else problems.push(`${where}: riga sconosciuta`);
  };
  for (const a of ARCS) {
    a.who.forEach(w => {
      if (!CH[w]) problems.push(`${a.id}: personaggio ${w} mancante`);
    });
    a.ch.forEach((c, i) => {
      const who = c.who || a.who;
      who.forEach(w => {
        if (!CH[w]) problems.push(`${a.id}/${i}: personaggio ${w} mancante`);
      });
      if (who.length > 2) problems.push(`${a.id}/${i}: più di 2 personaggi a un tavolo`);
      if (i && c.r < a.ch[i - 1].r) problems.push(`${a.id}/${i}: soglia di atmosfera più bassa del capitolo prima`);
      c.l.forEach((l, j) => chkLine(l, who, `${a.id}/${i}/${j}`));
      // le condizioni nello stesso capitolo della scelta non funzionerebbero (sono filtrate a inizio scena)
      const here = new Set();
      c.l.forEach(l => {
        if (l && l.c) l.c.o.forEach(o => here.add(o.f));
      });
      c.l.forEach(l => {
        if (Array.isArray(l) && l[2] && here.has(l[2]))
          problems.push(`${a.id}/${i}: condizione ${l[2]} nello stesso capitolo della scelta`);
      });
    });
    const lastWho = a.ch[a.ch.length - 1].who || a.who;
    (a.rt || []).forEach((r, i) => r.forEach((l, j) => chkLine(l, lastWho, `${a.id}/rt${i}/${j}`)));
    [].concat(a.req || []).forEach(rr =>
      rr.split('|').forEach(r => {
        const [id] = r.split('=');
        if (!ids.has(id)) problems.push(`${a.id}: requisito ${id} inesistente`);
        if (r.includes('=') && !produced.has(r)) problems.push(`${a.id}: requisito ${r} mai scelto`);
      })
    );
    if (a.end)
      Object.keys(a.end).forEach(f => {
        if (!produced.has(f)) problems.push(`${a.id}: finale ${f} irraggiungibile`);
      });
    // ogni finale deve avere almeno una battuta dedicata nel capitolo finale o nelle risposte
    if (a.end)
      Object.keys(a.end).forEach(f => {
        const last = a.ch[a.ch.length - 1];
        const has = last.l.some(l => (Array.isArray(l) && l[2] === f) || (l && l.c && l.c.o.some(o => o.f === f)));
        if (!has) problems.push(`${a.id}: il finale ${f} non ha battute proprie nell'ultimo capitolo`);
      });
  }
  problems.forEach(p => console.log('    - ' + p));
  ok(!problems.length, `${ARCS.length} storie, ${Object.keys(CH).length} personaggi, ${produced.size} scelte: nessuna incoerenza`);
}

async function tapWorld(page, wx, wy) {
  const pt = await page.evaluate(
    ([wx, wy]) => {
      const C = window.__cafe,
        cv = document.querySelector('#c'),
        r = cv.getBoundingClientRect();
      if (((wx - C.camX) * C.S) / C.DPR < 10 || ((wx - C.camX) * C.S) / C.DPR > innerWidth - 10)
        C.camX = Math.max(0, Math.min(C.W - Math.ceil(cv.width / C.S), wx - Math.ceil(cv.width / C.S) / 2));
      return { x: ((wx - C.camX) * C.S) / C.DPR + r.left, y: (wy * C.S) / C.DPR + r.top };
    },
    [wx, wy]
  );
  await page.mouse.click(pt.x, pt.y);
}

async function playMini(page, kind, itemId) {
  await page.evaluate(
    ([kind, itemId]) => {
      const C = window.__cafe;
      const it = C.MENU.find(m => m.id === itemId);
      C.openMini({ order: it, type: 'normale', req: { mg: kind, t: 'Test' }, x: 0, y: 0 });
    },
    [kind, itemId]
  );
  const mini = () =>
    page.evaluate(() => {
      const m = window.__cafe.mini;
      return (
        m && { pos: m.pos, zone: m.zone, done: m.done, q: m.q, lock: m.lock, arm: m.arm, phase: m.phase, seq: m.seq, hold: m.hold, k: m.k }
      );
    });
  const t0 = Date.now();
  let holding = false;
  while (Date.now() - t0 < 15000) {
    const m = await mini();
    if (!m || m.done) break;
    if (m.lock || !m.arm) {
      await sleep(30);
      continue;
    }
    const mid = (m.zone[0] + m.zone[1]) / 2,
      inZ = m.pos >= m.zone[0] + 0.01 && m.pos <= m.zone[1] - 0.01;
    if (kind === 'latte' || kind === 'padella') {
      if (Math.abs(m.pos - mid) < 0.03) await page.evaluate(() => window.__cafe.miniDown({ target: document.body }));
    } else if (kind === 'monta') {
      if (!m.hold && !holding) {
        await page.evaluate(() => window.__cafe.miniDown({ target: document.body }));
        holding = true;
      } else if (m.hold && m.pos >= mid - 0.02) {
        await page.evaluate(() => window.__cafe.miniUp());
        holding = false;
      } else if (!m.hold) holding = false;
    } else if (kind === 'shaker') {
      if (m.pos < mid) await page.evaluate(() => window.__cafe.miniDown({ target: document.body }));
    } else if (kind === 'vetrina') {
      if (m.phase === 'pick') {
        for (const i of m.seq) {
          await page.click(`#mopts button[data-i="${i}"]`);
          await sleep(60);
        }
      }
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

  {
    const bad = await page.evaluate(() => {
      const C = window.__cafe,
        out = [];
      C.FILI.forEach(F => {
        if (F.b.length !== 3) out.push(F.id + ': servono 3 visite');
        const ch = F.b[1].find(l => l && l.c);
        if (!ch || ch.c.o.length !== 2) out.push(F.id + ': manca la scelta a metà');
        const fl = ch ? ch.c.o.map(o => o.f) : [];
        ['@a', '@b'].forEach(f => {
          if (!fl.includes(f)) out.push(F.id + ': scelta ' + f + ' mancante');
          if (!F.b[2].some(l => Array.isArray(l) && l[2] === f)) out.push(F.id + ': il finale ' + f + ' non ha battute');
          if (!F.e[f.slice(1)]) out.push(F.id + ': testo del finale ' + f + ' mancante');
        });
        F.b.forEach((b, i) =>
          b.forEach(l => {
            if (Array.isArray(l) && (l[0] !== 0 || !l[1])) out.push(F.id + '/' + i + ': battuta non valida');
          })
        );
      });
      return out;
    });
    bad.forEach(b => console.log('    - ' + b));
    ok(!bad.length, `vite degli habitué: ${await page.evaluate(() => window.__cafe.FILI.length)} storie coerenti`);
    const bad2 = await page.evaluate(() => {
      const C = window.__cafe,
        out = [],
        produced = new Set();
      C.ARCS.forEach(a =>
        a.ch.forEach(c =>
          c.l.forEach(l => {
            if (l && l.c) l.c.o.forEach(o => produced.add(o.f));
          })
        )
      );
      C.ARCS.forEach(a => a.ch.forEach(c => c.calc && c.calc.values.forEach(v => produced.add(c.calc.flag + '=' + v))));
      const ids = new Set();
      C.XS.concat(C.XEPI).forEach(x => {
        if (ids.has(x.id)) out.push(x.id + ': id doppio');
        ids.add(x.id);
        x.w.forEach(k => {
          if (!C.CH[k]) out.push(x.id + ': personaggio ' + k + ' mancante');
          if (!C.KEYS[k]) out.push(x.id + ': ' + k + ' non diventa mai habitué');
        });
        x.l.forEach((l, i) => {
          if (!(l[0] >= 0 && l[0] < x.w.length) || !l[1]) out.push(x.id + '/' + i + ': battuta non valida');
          if (l[2] && !produced.has(l[2])) out.push(x.id + '/' + i + ': condizione ' + l[2] + ' mai scelta');
        });
      });
      C.FILI2.forEach(F => {
        if (F.b.length !== 3) out.push(F.id + ': servono 3 visite');
        const ch = F.b[1].find(l => l && l.c);
        if (!ch || ch.c.o.length !== 2) out.push(F.id + ': manca la scelta');
        ['@a', '@b'].forEach(f => {
          if (!F.b[2].some(l => Array.isArray(l) && l[2] === f)) out.push(F.id + ': finale ' + f + ' senza battute');
          if (!F.e[f.slice(1)]) out.push(F.id + ': testo finale ' + f);
        });
        F.b.forEach((b, i) =>
          b.forEach(l => {
            if (Array.isArray(l) && (!(l[0] === 0 || l[0] === 1) || !l[1])) out.push(F.id + '/' + i + ': battuta non valida');
          })
        );
      });
      Object.entries(C.KEYS).forEach(([k, K]) => {
        if (!C.CH[k]) out.push('KEYS ' + k + ' senza personaggio');
        if (!C.MENU.find(m => m.id === K.fav)) out.push('KEYS ' + k + ': ordine ' + K.fav);
        K.l.forEach(x => {
          if (Array.isArray(x) && !produced.has(x[1])) out.push('KEYS ' + k + ': condizione ' + x[1]);
        });
      });
      return out;
    });
    bad2.forEach(b => console.log('    - ' + b));
    ok(
      !bad2.length,
      `intrecci: ${await page.evaluate(() => window.__cafe.XS.length + ' incontri, ' + window.__cafe.XEPI.length + ' epiloghi, ' + window.__cafe.FILI2.length + ' vite a due')} coerenti`
    );
  }
  {
    // i tocchi sullo schermo fuori dal pulsante, e quelli durante il «Pronto…», non contano
    await page.evaluate(() => {
      const C = window.__cafe;
      C.openMini({ order: C.MENU.find(m => m.id === 'capp'), type: 'normale', req: { mg: 'latte', t: 'Test' }, x: 0, y: 0 });
    });
    await sleep(100);
    for (let i = 0; i < 6; i++) {
      await page.mouse.click(30, 30 + i * 10);
      await page.locator('#mbtn').dispatchEvent('pointerdown');
      await sleep(40);
    }
    const early = await page.evaluate(() => window.__cafe.mini.score.length);
    await sleep(1000);
    for (let i = 0; i < 5; i++) {
      await page.mouse.click(20, 20);
      await sleep(30);
    }
    const outside = await page.evaluate(() => window.__cafe.mini.score.length);
    await page.locator('#mbtn').dispatchEvent('pointerdown');
    await sleep(50);
    const onBtn = await page.evaluate(() => window.__cafe.mini.score.length);
    ok(
      early === 0 && outside === 0 && onBtn === 1,
      `minigioco: ignorati i tocchi durante «Pronto» (${early}) e fuori dal pulsante (${outside}), il pulsante conta (${onBtn})`
    );
    await page.evaluate(() => {
      const C = window.__cafe,
        m = C.mini;
      m.done = true;
      C.finishMini();
    });
  }
  for (const [k, id] of [
    ['latte', 'capp'],
    ['monta', 'capp'],
    ['monta', 'caffe'],
    ['padella', 'toast'],
    ['shaker', 'smooth'],
    ['vetrina', 'cake']
  ])
    await playMini(page, k, id);

  {
    // latte art a mano: ricalcare la forma vale tre stelle, uno scarabocchio no; il disegno finisce sulla tazza
    const res = {};
    for (const [shape, mode] of [
      ['cuore', 'bene'],
      ['gatto', 'bene'],
      ['stella', 'male']
    ]) {
      await page.evaluate(shape => {
        const C = window.__cafe;
        C.openMini({ order: C.MENU.find(m => m.id === 'capp'), type: 'normale', req: { mg: 'mano', t: 'Prova', shape }, x: 0, y: 0 });
      }, shape);
      await sleep(300);
      const box = await page.locator('#mdraw').boundingBox();
      const strokes =
        mode === 'bene'
          ? await page.evaluate(() => mano.tpl)
          : [
              [
                [0.15, 0.85],
                [0.3, 0.7],
                [0.45, 0.6],
                [0.6, 0.45],
                [0.75, 0.3],
                [0.85, 0.2]
              ]
            ];
      for (const st0 of strokes) {
        await page.mouse.move(box.x + st0[0][0] * box.width, box.y + st0[0][1] * box.height);
        await page.mouse.down();
        for (const [a, b] of st0.slice(1)) await page.mouse.move(box.x + a * box.width, box.y + b * box.height, { steps: 3 });
        await page.mouse.up();
      }
      await page.locator('#mbtn').dispatchEvent('pointerdown');
      await sleep(200);
      res[shape] = await page.evaluate(() => ({ q: mini && mini.q, px: mini && (mini.drawPx || []).length }));
      await page.evaluate(() => {
        mini.done = true;
        finishMini();
      });
      await sleep(100);
    }
    ok(
      res.cuore.q === 2 && res.gatto.q === 2 && res.stella.q === 0 && res.cuore.px > 10,
      `latte art a mano: forme ricalcate ★★★, scarabocchio ★ (${JSON.stringify(res)})`
    );
  }

  console.log('Bancone e tavoli');
  await page.evaluate(() => (window.__cafe.speed = 1));
  const coins0 = await page.evaluate(() => window.__cafe.st.coins);
  // aspetta un cliente al bancone e servilo col pulsante
  for (let i = 0; i < 200; i++) {
    const q = await page.evaluate(() => {
      const q = window.__cafe.queue[0];
      return q && q.state === 'order' && !q.special;
    });
    if (q) break;
    await sleep(100);
  }
  const noSpecial = () =>
    page.evaluate(() => {
      const C = window.__cafe;
      C.queue.forEach(q => {
        q.special = false;
        q.req = null;
      });
      if (C.mini) {
        C.mini.done = true;
        C.finishMini();
      }
    });
  for (let i = 0; i < 30; i++) {
    await noSpecial();
    await page.locator('#serve').dispatchEvent('pointerdown');
    await sleep(40);
  }
  await noSpecial();
  ok(await page.evaluate(c => window.__cafe.st.coins > c, coins0), 'il pulsante Servi serve i clienti');
  const pts = await page.evaluate(() => {
    const C = window.__cafe,
      cv = document.querySelector('#c'),
      r = cv.getBoundingClientRect();
    C.camX = Math.max(0, C.counterX + 86 - Math.ceil(cv.width / C.S));
    const out = [];
    C.slots.forEach(sl => {
      if (sl.k < C.cols && sl.k < C.st.space) {
        sl.seats.forEach(s => {
          if (!s.occ) {
            s.dirty = true;
            s._t = 1;
          }
        });
        out.push({ x: ((sl.x - C.camX) * C.S) / C.DPR + r.left, y: ((sl.y - 8) * C.S) / C.DPR + r.top });
      }
    });
    return out.filter(p => p.x > 0 && p.x < innerWidth);
  });
  for (const p of pts) {
    await page.mouse.click(p.x, p.y);
    await sleep(60);
  }
  const dirty = await page.evaluate(() =>
    window.__cafe.slots.some(sl =>
      sl.seats.some(s => {
        const d = s._t && s.dirty;
        delete s._t;
        return d;
      })
    )
  );
  ok(pts.length > 0 && !dirty, `toccando i tavoli (${pts.length}) si puliscono, anche vicino al bancone`);

  console.log('Pannelli');
  for (const p of ['up', 'cli', 'day', 'set']) {
    await page.click(`#hud button[data-p="${p}"]`);
    await sleep(150);
    const tabs = await page.$$eval('#tabs button', b => b.map(x => x.textContent));
    for (const t of tabs) {
      await page.click(`#tabs button:has-text("${t}")`);
      await sleep(60);
    }
    ok(true, `pannello ${p} (${tabs.join(', ') || 'senza schede'})`);
    await page.click('#pclose');
    await sleep(250);
  }
  await page.click('#hud button[data-p="up"]');
  await sleep(150);
  await page.click('#tabs button:has-text("Staff")');
  await sleep(100);
  const g0 = await page.evaluate(() => window.__cafe.st.grinder);
  await page.click('button[data-u="grinder"]');
  await sleep(100);
  ok(await page.evaluate(g => window.__cafe.st.grinder === g + 1, g0), 'si può comprare un miglioramento (macinino)');
  await page.click('#pclose');
  await sleep(250);

  console.log('Vite degli habitué');
  {
    await page.evaluate(() => {
      const C = window.__cafe;
      C.speed = 8;
      C.st.regs.push({ id: 'rtest', n: 'Tester', look: C.CH.mia.l, type: 'studente', fav: 'caffe', v: 5, f: 5, tr: ['nerd'] });
    });
    let ok3 = true;
    for (let step = 0; step < 3; step++) {
      await page.evaluate(step => {
        const C = window.__cafe,
          r = C.st.regs.find(x => x.id === 'rtest');
        if (r.fl) r.fl.day = -5;
        const seat =
          C.slots
            .slice(0, C.st.tables)
            .flatMap(sl => sl.seats)
            .find(q => !q.occ && !q.res) || C.slots[0].seats[0];
        const c = {
          id: 9e6 + step,
          look: r.look,
          name: r.n,
          reg: r,
          type: 'studente',
          x: seat.x,
          y: seat.y,
          state: 'sit',
          face: 1,
          order: C.MENU[0],
          seat,
          mood: 80,
          sitT: 999,
          thinkT: 999,
          sipT: 9,
          act: ''
        };
        seat.occ = c;
        seat.dirty = false;
        C.people.push(c);
        C.startFilo(c);
      }, step);
      for (let i = 0; i < 150; i++) {
        if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=1');
        const left = await page.evaluate(() => window.__cafe.scenes.some(s => s.story === 'filo'));
        if (!left) break;
        await sleep(100);
      }
      await page.evaluate(() => {
        const C = window.__cafe;
        C.people
          .filter(p => p.id >= 9e6)
          .forEach(p => {
            p.dead = true;
            if (p.seat) p.seat.occ = null;
          });
      });
    }
    const res = await page.evaluate(() => {
      const C = window.__cafe,
        r = C.st.regs.find(x => x.id === 'rtest');
      return { fl: r.fl, done: (C.st.fdone || [])[0] };
    });
    ok(
      !res.fl && res.done && res.done.n === 'Tester' && res.done.log.length === 3 && res.done.log[1].ch,
      `una vita completa in 3 visite con una scelta: «${res.done && res.done.t}» → ${res.done && res.done.e}`
    );
    await page.evaluate(() => (window.__cafe.speed = 1));
    await page.click('#hud button[data-p="cli"]');
    await sleep(150);
    await page.click('#tabs button:has-text("Vite")');
    await sleep(100);
    await page.click('button[data-fd="0"]');
    await sleep(150);
    const rtxt = await page.textContent('#rtext');
    await page.click('#rnext');
    await sleep(80);
    await page.click('#rnext');
    await sleep(80);
    const endTxt = await page.textContent('#rtext .end').catch(() => '');
    ok(
      rtxt.length > 40 && endTxt.length > 10 && (await page.isVisible('#rport img')),
      'il Diario si legge come un libro, con ritratti e finale'
    );
    await page.click('#rclose');
    await sleep(100);
    await page.click('#tabs button:has-text("Storie")');
    await sleep(100);
    const chap = await page.$('button[data-rd]');
    if (chap) {
      await chap.click();
      await sleep(120);
      ok((await page.textContent('#rtext')).length > 20, 'si rilegge un capitolo delle storie principali');
      await page.click('#rclose');
      await sleep(80);
    }
    await page.click('#pclose');
    await sleep(250);
  }

  console.log('Animali da compagnia');
  {
    const r = await page.evaluate(async () => {
      const C = window.__cafe;
      C.st.petted = {};
      delete C.st.found.cuccioli;
      const kinds = ['cane', 'gatto', 'coniglio', 'uccellino', 'cane'],
        out = { follow: true, hearts: 0 };
      for (let i = 0; i < 5; i++) {
        const reg = {
          id: 'rp' + i,
          n: 'Pet' + i,
          look: C.CH.mia.l,
          type: 'normale',
          fav: 'caffe',
          v: 3,
          f: 2,
          tr: [],
          petR: 1,
          pet: Object.assign(C.randPet('normale'), { k: kinds[i], n: 'Bestiolina' + i })
        };
        C.st.regs.push(reg);
        const c = C.newCust({ look: reg.look, name: reg.n, reg, type: 'normale' });
        if (!c.pet || c.pet.n !== 'Bestiolina' + i) out.follow = false;
      }
      await new Promise(r => setTimeout(r, 1500));
      const mine = C.people.filter(p => p.pet && /^Bestiolina/.test(p.pet.n));
      mine.forEach(c => {
        if (c.pet.k !== 'uccellino' && Math.hypot(c.pet.x - c.x, c.pet.y - c.y) > 14) out.follow = false;
      });
      mine.forEach((c, i) => {
        c.pet.x = 500 + i * 40;
        c.pet.y = 170;
      });
      mine.forEach(c => {
        if (C.tapPet(c.pet.x, c.pet.y - 2)) out.hearts++;
      });
      out.egg = !!C.st.found.cuccioli;
      return out;
    });
    ok(r.follow, 'gli animali entrano col padrone e lo seguono');
    ok(r.hearts === 5 && r.egg, `si accarezzano (${r.hearts}/5) e cinque animali diversi svelano un segreto`);
  }

  {
    // due cani con i padroni seduti vicini: si incontrano, diventano amici e fanno conoscere i padroni
    await page.evaluate(() => {
      const C = window.__cafe;
      C.speed = 1;
      C.people.forEach(p => {
        p.dead = true;
        if (p.seat) p.seat.occ = null;
      });
      C.queue.length = 0;
      C.st.petf = {};
      const seats = C.slots[0].seats.concat(C.slots[2].seats);
      [
        ['rd1', 'Uno', 'Rex'],
        ['rd2', 'Due', 'Fido']
      ].forEach(([id, n, pn], i) => {
        const reg = {
          id,
          n,
          look: C.CH.luca.l,
          type: 'normale',
          fav: 'caffe',
          v: 3,
          f: 2,
          tr: [],
          petR: 1,
          pet: { k: 'cane', n: pn, c: '#c98a4a', c2: '#8a5a3a', s: '' }
        };
        C.st.regs.push(reg);
        const seat = seats[i];
        seat.dirty = false;
        seat.res = null;
        const c = C.newCust({ look: reg.look, name: n, reg, type: 'normale' });
        C.queue.splice(C.queue.indexOf(c), 1);
        Object.assign(c, { state: 'sit', seat, x: seat.x, y: seat.y, sitT: 999, thinkT: 999, order: C.MENU[0], mood: 80 });
        seat.occ = c;
        c.pet.x = seat.x + seat.side * 8;
        c.pet.y = seat.y + 2;
      });
    });
    for (let round = 0; round < 2; round++) {
      await page.evaluate(() => window.__cafe.petSocial(30));
      for (let i = 0; i < 120; i++) {
        const busy = await page.evaluate(() => window.__cafe.people.some(p => p.pet && (p.pet.visit || p.pet.moving)));
        if (!busy && i > 3) break;
        await sleep(100);
      }
    }
    const r = await page.evaluate(() => {
      const C = window.__cafe;
      return { f: (C.st.petf || {})['caneFido|caneRex'], rel: !!C.st.rel['rd1|rd2'], egg: !!C.st.found.zampe };
    });
    ok(r.f >= 2 && r.rel && r.egg, `due cani si incontrano ${r.f || 0} volte, diventano amici e i padroni si conoscono`);
    const hiss = await page.evaluate(() => {
      const C = window.__cafe;
      C.st.cat = 1;
      const c = C.people.find(p => p.pet && p.pet.n === 'Rex');
      c.pet.visit = null;
      c.pet.x = C.counterX - 5;
      for (let i = 0; i < 80 && !C.catHissT; i++) C.petSocial(0.5);
      return C.catHissT > 0 && !!C.st.found.soffio;
    });
    ok(hiss, 'il gatto del locale soffia al cane vicino al bancone');
    if (!hiss)
      console.log(
        await page.evaluate(() => {
          const C = window.__cafe;
          const c = C.people.find(p => p.pet && p.pet.n === 'Rex');
          return JSON.stringify({
            c: !!c,
            dead: c && c.dead,
            x: c && c.pet.x,
            cx: C.counterX,
            visit: c && !!c.pet.visit,
            cat: C.st.cat,
            t: C.catHissT,
            found: C.st.found.soffio
          });
        })
      );
    await page.evaluate(() => {
      const C = window.__cafe;
      C.people.forEach(p => {
        if (p.reg && /^rd/.test(p.reg.id)) {
          p.dead = true;
          if (p.seat) p.seat.occ = null;
        }
      });
    });
  }

  console.log('Personaggi chiave, intrecci e vita autonoma');
  {
    const seatPair = `(C, a, b, si) => { const sl = C.slots[si]; sl.seats.forEach(q => { q.occ = null; q.dirty = false; q.res = null; });
      return [a, b].map((r, i) => { const seat = sl.seats[i]; const c = C.newCust({ look: r.look, name: r.n, reg: r, type: r.type }); C.queue.splice(C.queue.indexOf(c), 1);
        Object.assign(c, { state: 'sit', seat, x: seat.x, y: seat.y, sitT: 999, thinkT: 999, order: C.MENU[0], mood: 80, face: -seat.side }); seat.occ = c; if (c.pet) { c.pet.x = seat.x; c.pet.y = seat.y + 2; } return c; }); }`;
    const clear = () =>
      page.evaluate(() => {
        const C = window.__cafe;
        C.people.forEach(p => {
          p.dead = true;
          if (p.seat) p.seat.occ = null;
        });
        C.queue.length = 0;
        C.scenes.length = 0;
        C.regiaReset(); // ogni prova parte con la regia libera
      });
    await clear();
    const k1 = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st;
      st.story.pioggia = 4;
      st.story.consegne = 3;
      st.flags.pioggia = 'adesso';
      st.flags.consegne = 'qui';
      C.ensureKeyRegs();
      const m = C.keyReg('mia'),
        l = C.keyReg('luca'),
        r = C.keyReg('rosa');
      return {
        ok: !!(m && l && r && C.keyReg('kenji')),
        rel: m && l && st.rel[[m.id, l.id].sort().join('|')],
        bianca: !!C.keyReg('bianca')
      };
    });
    ok(
      k1.ok && k1.rel && k1.rel.k === 'coppia' && !k1.bianca,
      `finita la storia, i personaggi chiave diventano habitué con i loro legami (Mia e Luca: ${k1.rel && k1.rel.k})`
    );
    // incontro tra storie diverse: Nonna Rosa e Mia allo stesso tavolo
    await page.evaluate(
      `(() => { const C = window.__cafe; C.regiaReset(); const [a, b] = (${seatPair})(C, C.keyReg('rosa'), C.keyReg('mia'), 4); C.relScene(a, b); })()`
    );
    for (let i = 0; i < 200; i++) {
      const busy = await page.evaluate(() => window.__cafe.scenes.length > 0);
      if (!busy) break;
      await sleep(100);
    }
    ok(
      await page.evaluate(() => !!(window.__cafe.st.xs || {}).x_rosa_mia),
      'incontro tra storie: Nonna Rosa e Mia si conoscono, una volta sola'
    );
    await clear();
    // vita a due completa: tre incontri, una scelta, finale nel Diario
    await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st;
      st.regs.push(
        { id: 'ra', n: 'Ada', look: C.CH.irene.l, type: 'normale', fav: 'caffe', v: 5, f: 5, tr: [], petR: 1 },
        { id: 'rb', n: 'Bruno', look: C.CH.gio.l, type: 'normale', fav: 'caffe', v: 5, f: 5, tr: [], petR: 1 }
      );
      st.rel['ra|rb'] = { k: 'coppia', lv: 1, d: 1 };
      C.speed = 6;
    });
    for (let step = 0; step < 3; step++) {
      await page.evaluate(
        `(() => { const C = window.__cafe, R = C.st.rel['ra|rb']; C.regiaReset(); if (R.fl) R.fl.day = -9; R.fn = 0; const [a, b] = (${seatPair})(C, C.st.regs.find(r => r.id === 'ra'), C.st.regs.find(r => r.id === 'rb'), 4); C.startDuo(a, b); })()`
      );
      for (let i = 0; i < 200; i++) {
        if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=0');
        if (!(await page.evaluate(() => window.__cafe.scenes.length))) break;
        await sleep(80);
      }
      await clear();
    }
    const duo = await page.evaluate(() => {
      const C = window.__cafe,
        R = C.st.rel['ra|rb'],
        e = (C.st.fdone || []).find(x => x.duo);
      return { fl: R.fl, e: e && e.e, n: e && e.n, log: e && e.log.length };
    });
    ok(!duo.fl && duo.e && duo.log === 3, `vita a due completa: ${duo.n} ${duo.e}`);
    // vite per le persone giuste: le parole si accordano al nome, le vite delicate non capitano a caso
    const giuste = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st;
      const acc = [gO('Sono andat{o}', { n: 'Giulia' }), gO('Sono andat{o}', { n: 'Marco R.' })].join('|');
      const keep = st.fU.slice();
      st.fU = C.FILI.map(f => f.id).filter(id => id !== 'turni');
      const mk = (id, n) => ({ id, n, look: C.CH.irene.l, type: 'nottambulo', fav: 'caffe', v: 5, f: 5, tr: [], petR: 1 });
      const giulia = mk('rg1', 'Giulia'),
        marco = mk('rg2', 'Marco');
      st.regs.push(giulia, marco);
      const okM = !filoLibero(marco),
        okG = filoLibero(giulia);
      st.fU = keep;
      st.regs = st.regs.filter(r => r !== giulia && r !== marco);
      return { acc, okM, okG };
    });
    ok(
      giuste.acc === 'Sono andata|Sono andato' && giuste.okM && giuste.okG,
      'vite per le persone giuste: «andato/andata» secondo il nome, e la vita di una mamma sola non capita a Marco'
    );
    // calendario: stagioni, feste, compleanni, anniversari
    const cal1 = await page.evaluate(() => {
      const d = [1, 11, 20, 21].map(x => cal(x));
      return {
        date: [dataN(1), dataN(11), dataN(21)].join(' | '),
        anni: d.map(c => c.anno).join(''),
        neve: festa(11) && festa(11).id,
        fine: festa(20) && festa(20).id
      };
    });
    ok(
      cal1.date === '1 d’autunno | 1 d’inverno | 1 di primavera' &&
        cal1.anni === '1112' &&
        cal1.neve === 'neve' &&
        cal1.fine === 'fineanno',
      `calendario: 40 giorni, 4 stagioni (${cal1.date}), l’anno nuovo comincia a primavera`
    );
    const neve = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st,
        d0 = st.day;
      st.day = 11; // la prima neve
      startDay();
      const r = { wx: st.wx, atm: calAtm(), html: calHTML() };
      st.day = d0;
      startDay();
      return r;
    });
    ok(
      neve.wx === 'neve' && /calstrip/.test(neve.html) && /La prima neve/.test(neve.html),
      'feste: la prima neve fa nevicare davvero e il pannello Giorno mostra il calendario'
    );
    const bd = await page.evaluate(`(() => { const C = window.__cafe, st = C.st; const mia = C.keyReg('mia'); if (!mia) return null;
      const d0 = st.day; let d = st.day; while (cal(d).i !== complI(mia)) d++; st.day = d; mia.bdY = 0;
      const [a] = (${seatPair})(C, mia, mia, 0); C.people.filter(p => p.reg === mia && p !== a).forEach(p => { p.dead = true; if (p.seat) p.seat.occ = null; });
      const h0 = st.hearts; calOnSit(a); const sc = C.scenes.find(s => s.story === 'compleanno'); window.__bd = { d0, h0 }; return !!sc; })()`);
    for (let i = 0; i < 200; i++) {
      if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=1');
      if (!(await page.evaluate(() => window.__cafe.scenes.some(s => s.story === 'compleanno')))) break;
      await sleep(80);
    }
    const bd2 = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st,
        r = { hearts: st.hearts > window.__bd.h0, log: st.log[0] && st.log[0].t };
      st.day = window.__bd.d0;
      return r;
    });
    ok(
      bd && bd2.hearts && /Compleanno di Mia/.test(bd2.log),
      `compleanni: Mia festeggia al locale e tutti cantano gli auguri («${bd2.log}»)`
    );
    await clear();
    const ann = await page.evaluate(`(() => { const C = window.__cafe, st = C.st;
      const R = st.rel['ra|rb']; R.k = 'coppia'; R.d = st.day - 40; R.annY = 0;
      const [a, b] = (${seatPair})(C, st.regs.find(r => r.id === 'ra'), st.regs.find(r => r.id === 'rb'), 4);
      C.relScene(a, b); return !!C.scenes.find(s => s.story === 'anniversario'); })()`);
    ok(ann, 'anniversari: un anno dopo essersi conosciuti, la coppia lo festeggia al loro tavolo');
    await clear();
    const fine = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st,
        d0 = st.day;
      st.day = 20;
      st.yrShown = 0;
      st.tod = 0.99;
      const shown = calFineAnno();
      const txt = document.querySelector('#mbox').textContent;
      return { shown, txt, d0 };
    });
    await page.click('#mbox button.big');
    await sleep(600);
    const fine2 = await page.evaluate(d0 => {
      const st = window.__cafe.st,
        r = { again: calFineAnno(), shownYear: st.yrShown };
      st.day = d0;
      st.tod = 0.3;
      hideModal();
      return r;
    }, fine.d0);
    ok(
      fine.shown && /L’anno del caffè/.test(fine.txt) && /nuovi habitué/.test(fine.txt) && !fine2.again && fine2.shownYear === 1,
      'l’ultima sera dell’anno mostra il riepilogo: storie, vite, habitué, coppie (una volta sola)'
    );
    // vite uniche e regia: un momento alla volta, chi aspetta fa segno, il locale si calma, il testo va avanti col tocco
    await clear();
    await page.evaluate(() => (window.__cafe.regia.off = false));
    const rg = await page.evaluate(`(() => { const C = window.__cafe, st = C.st;
      st.regs.push({ id: 'rc', n: 'Carla', look: C.CH.irene.l, type: 'normale', fav: 'caffe', v: 5, f: 5, tr: [], petR: 1 },
        { id: 'rd', n: 'Dario', look: C.CH.gio.l, type: 'normale', fav: 'caffe', v: 5, f: 5, tr: [], petR: 1 });
      const rc = st.regs.find(r => r.id === 'rc'), rd = st.regs.find(r => r.id === 'rd');
      const [a] = (${seatPair})(C, rc, rc, 0); C.people.filter(p => p.reg === rc && p !== a).forEach(p => { p.dead = true; if (p.seat) p.seat.occ = null; });
      const [b] = (${seatPair})(C, rd, rd, 4); C.people.filter(p => p.reg === rd && p !== b).forEach(p => { p.dead = true; if (p.seat) p.seat.occ = null; });
      C.startFilo(a); C.startFilo(b);
      return { ia: rc.fl && rc.fl.id, ib: rd.fl && rd.fl.id, n: C.scenes.filter(s => s.big).length };
    })()`);
    ok(rg.ia && rg.ib && rg.ia !== rg.ib && rg.n === 2, `vite uniche: due habitué non vivono mai la stessa storia (${rg.ia} / ${rg.ib})`);
    let r1 = null;
    for (let i = 0; i < 100 && !r1; i++) {
      r1 = await page.evaluate(() => {
        const C = window.__cafe,
          big = C.scenes.filter(s => s.big);
        if (!C.regia.live) return null;
        const wait = big.find(s => s !== C.regia.live);
        return {
          on: big.filter(s => s.on).length,
          inv: !!(wait && wait.mem.every(m => m.invite)),
          n: C.people.filter(p => !p.dead).length
        };
      });
      if (!r1) await sleep(60);
    }
    await sleep(700);
    const r2 = await page.evaluate(() => ({
      n: window.__cafe.people.filter(p => !p.dead).length,
      cap: !document.querySelector('#regia').hidden && document.querySelector('#regia').textContent
    }));
    ok(
      r1 && r1.on === 1 && r1.inv && r2.n <= r1.n && r2.cap,
      'regia: un solo racconto alla volta, l’altro fa segno con la stellina, non entra nessuno e il testo compare in basso'
    );
    const t0 = await page.evaluate(() => window.__cafe.regia.live && window.__cafe.regia.live.i);
    await page.click('#regia');
    await sleep(350);
    const t1 = await page.evaluate(() => window.__cafe.regia.live && window.__cafe.regia.live.i);
    ok(t1 > t0, `regia: toccando il testo si va avanti (battuta ${t0} → ${t1})`);
    let r3 = null;
    for (let i = 0; i < 300 && !r3; i++) {
      r3 = await page.evaluate(() => {
        const C = window.__cafe;
        if (C.regia.live) {
          C.regiaNext();
          return null;
        }
        const w = C.scenes.find(s => s.big && !s.done);
        return w ? { rest: C.regia.rest > 0, on: !!w.on } : null;
      });
      if (!r3) await sleep(60);
    }
    ok(r3 && r3.rest && !r3.on, 'regia: dopo un racconto c’è un respiro prima del successivo');
    const r4 = await page.evaluate(() => {
      const C = window.__cafe,
        w = C.scenes.find(s => s.big && !s.done);
      C.regia.rest = 0;
      w.inv = 0.5;
      const m = w.mem[0];
      return C.regiaTap(m.x, m.y - 10);
    });
    let r5 = false;
    for (let i = 0; i < 30 && !r5; i++) {
      r5 = await page.evaluate(() => !!window.__cafe.regia.live);
      if (!r5) await sleep(60);
    }
    ok(r4 && r5, 'regia: toccando chi fa segno, comincia a raccontare');
    // «i racconti vanno avanti quando tocco io»: la battuta resta finché non tocchi
    await page.evaluate(() => (window.__cafe.st.txtTap = 1));
    await sleep(1500);
    const tp0 = await page.evaluate(() => window.__cafe.regia.live && window.__cafe.regia.live.i);
    await sleep(2500);
    const tp1 = await page.evaluate(() => window.__cafe.regia.live && window.__cafe.regia.live.i);
    await page.evaluate(() => window.__cafe.regiaNext());
    await sleep(700);
    const tp2 = await page.evaluate(() => window.__cafe.regia.live && window.__cafe.regia.live.i);
    await page.evaluate(() => (window.__cafe.st.txtTap = 0));
    ok(
      tp0 && tp0 === tp1 && tp2 > tp1,
      `lettura: con «quando tocco io» il racconto aspetta (battuta ${tp0} → ${tp1} → ${tp2} dopo il tocco)`
    );
    await clear();
    await page.evaluate(() => (window.__cafe.regia.off = true));
    await page.evaluate(() => (window.__cafe.speed = 1));
    // vita autonoma: chi è seduto da solo va a sedersi vicino a un amico
    const moved =
      await page.evaluate(`(() => { const C = window.__cafe; const ra = C.st.regs.find(r => r.id === 'ra'), rb = C.st.regs.find(r => r.id === 'rb');
      const [a] = (${seatPair})(C, ra, ra, 0); C.people.filter(p => p.reg === ra && p !== a).forEach(p => { p.dead = true; if (p.seat) p.seat.occ = null; });
      const [b] = (${seatPair})(C, rb, rb, 4); C.people.filter(p => p.reg === rb && p !== b).forEach(p => { p.dead = true; if (p.seat) p.seat.occ = null; });
      a.sitT = b.sitT = 60; let n = 0; for (let i = 0; i < 60 && !n; i++) { C.socialAI(10); n = C.people.filter(p => !p.dead && p.join).length; } return n; })()`);
    ok(moved > 0, 'vita autonoma: un habitué si alza e va a sedersi vicino al suo amore');
    await clear();
    // rituale settimanale: il loro giorno arrivano insieme
    const rit = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st;
      st.tod = 0.4;
      const R = st.rel['ra|rb'];
      R.rit = (st.day - 1) % 7;
      R.ritD = 0;
      let ok = false;
      for (let i = 0; i < 30 && !ok; i++) {
        R.ritD = 0;
        ok = C.ritual();
      }
      return ok && C.people.some(p => !p.dead && p.reg && p.reg.id === 'ra');
    });
    ok(rit, 'rituali: nel loro giorno della settimana due habitué arrivano insieme');
    if (!rit)
      console.log(
        await page.evaluate(() => {
          const C = window.__cafe,
            st = C.st,
            R = st.rel['ra|rb'];
          return JSON.stringify({
            R: { k: R.k, rit: R.rit, ritD: R.ritD, prop: R.prop },
            day: st.day,
            tod: st.tod,
            pres: C.people.filter(p => p.reg && ['ra', 'rb'].includes(p.reg.id)).map(p => p.dead),
            free: C.slots.slice(0, st.tables).filter(sl => sl.seats.every(s => !s.occ && !s.dirty && !s.res)).length,
            w: [C.st.regs.find(r => r.id === 'ra')].map(r => r.hn)
          });
        })
      );
    await clear();
  }

  console.log('Primo giorno guidato');
  {
    const newGame = async () => {
      const gp = await browser.newPage({ viewport: { width: 1000, height: 450 } });
      gp.on('pageerror', e => errors.push(e.message));
      await gp.goto(FILE);
      await gp.evaluate(() => localStorage.clear());
      await gp.reload();
      await gp.waitForTimeout(300);
      await gp.click('#go');
      await gp.waitForTimeout(800);
      await gp.click('#skip');
      await gp.waitForTimeout(300);
      await gp.fill('#nameIn', 'Guida');
      await gp.click('#openBtn');
      return gp;
    };
    const gp = await newGame();
    // prima apre Nonna Rosa: locale vuoto, spiega che contano le storie
    let talking = false;
    for (let i = 0; i < 80 && !talking; i++) {
      talking = await gp.evaluate(() => !!intro && intro.phase === 'talk' && !document.querySelector('#guide').hidden);
      await gp.waitForTimeout(200);
    }
    const empty = await gp.evaluate(() => people.filter(c => !c.dead && c.state !== 'intro').length === 0);
    const storyText = await gp.evaluate(() => INTRO.join(' '));
    for (let i = 0; i < 10 && (await gp.isVisible('#iok')); i++) {
      await gp.click('#iok');
      await gp.waitForTimeout(120);
    }
    ok(
      talking && empty && /storia/.test(storyText) && (await gp.evaluate(() => !!tut && TUT[tut.i].id === 'cliente')),
      'Nonna Rosa apre il primo giorno a locale vuoto, spiega che contano le storie e comincia il tutorial'
    );
    // tutto il tutorial, passo per passo, facendo quello che chiede
    const step = () => gp.evaluate(() => (tut ? TUT[tut.i].id : 'fine-tutorial'));
    const seen = [];
    let ringOk = true,
      clockOk = true,
      calm = true;
    const tod0 = await gp.evaluate(() => st.tod);
    for (let k = 0; k < 1500; k++) {
      const s = await step();
      if (s !== seen[seen.length - 1]) {
        seen.push(s);
        if (['cliente', 'bisogno', 'cocci', 'macchina'].includes(s)) {
          await gp.waitForTimeout(700);
          if (await gp.evaluate(() => !!tut && !tutAside() && document.querySelector('#gring').hidden)) ringOk = false;
        }
      }
      if (s === 'fine-tutorial') break;
      const r = await gp.evaluate(() => {
        const s = TUT[tut.i].id,
          q = queue[0];
        if (['cliente', 'speciale', 'ospite'].includes(s) && q && q.state === 'order' && !mini) tapCounter();
        if (mini && !mini.done) {
          mini.done = true;
          mini.q = 2;
          mini.endT = 0;
          finishMini();
        }
        if (s === 'ascolta' && tut.c1.state === 'sit') tut.c1.tapped = 1;
        if (s === 'bisogno' && tut.c1.need) tapNeed(tut.c1.x, tut.c1.y - 10);
        if (s === 'cocci' && incid[0]) tapIncident(incid[0].x, incid[0].y);
        if (s === 'pulisci') {
          const d = dirtySeat();
          if (d) cleanSeat(d, 1);
        }
        if (s === 'macchina' && machTilt) tapIncident(W - 20, 84);
        if (s === 'stella' && tut.ospite.invite) regiaTap(tut.ospite.x, tut.ospite.y - 10);
        if (regia.live) regiaNext();
        // durante il tutorial entrano solo i clienti mandati da Nonna Rosa
        return people.filter(p => !p.dead && p.state !== 'intro' && !p.tut).length;
      });
      if (r) calm = false;
      if (await gp.isVisible('.choice button')) await gp.click('.choice button >> nth=0');
      const s2 = await step();
      if (s2 === 'barista') {
        if (await gp.evaluate(() => panel !== 'up')) await gp.click('#bUp');
        else if (await gp.evaluate(() => tab !== 'Staff')) await gp.click('#tabs button[data-tab="Staff"]');
        else await gp.click('button[data-u="barista"]');
      }
      if (s2 === 'diario' && (await gp.evaluate(() => panel !== 'cli'))) await gp.click('#bCli');
      if (s2 !== 'fine-tutorial' && s2 !== 'ascolta' && s2 !== 'cuore' && (await gp.isVisible('#tnext'))) await gp.click('#tnext');
      if (s2 === 'cuore' && (await gp.isVisible('#tnext'))) {
        if ((await gp.evaluate(() => st.tod)) !== tod0) clockOk = false;
        await gp.click('#tnext');
      }
      await gp.waitForTimeout(80);
    }
    const want =
      'cliente ascolta bisogno speciale cocci pulisci monete barista macchina ospite stella cuore diario diario2 atm fine fine-tutorial';
    ok(seen.join(' ') === want, `tutorial completo: ${seen.length - 1} passi (${seen.slice(0, -1).join(' › ')})`);
    ok(ringOk && calm && clockOk, 'il cerchio indica cosa toccare, entrano solo i clienti di Nonna Rosa e l’orologio è fermo');
    const gino = await gp.evaluate(() => ({
      reg: !!st.regs.find(r => r.id === 'r_gino'),
      fd: (st.fdone || []).find(f => f.rid === 'r_gino'),
      barista: st.barista
    }));
    ok(
      gino.reg && gino.fd && gino.fd.log.length === 1 && gino.barista === 1,
      `il primo racconto: Gino diventa habitué e la sua storia è nel Diario («${gino.fd && gino.fd.e}»)`
    );
    for (let i = 0; i < 60 && (await gp.evaluate(() => people.some(p => p.name === 'Nonna Rosa' && !p.dead))); i++)
      await gp.waitForTimeout(200);
    let back = false;
    for (let i = 0; i < 60 && !back; i++) {
      back = await gp.evaluate(() => people.some(p => !p.dead && !p.tut));
      await gp.waitForTimeout(200);
    }
    const end = await gp.evaluate(() => ({
      done: st.introDone === 1 && st.tutDone === 1,
      rosa: people.some(p => p.name === 'Nonna Rosa' && !p.dead)
    }));
    ok(end.done && !end.rosa && back, 'finito il tutorial Nonna Rosa se ne va e il locale si riempie');
    await gp.close();
    // chi vuole, salta tutto
    const gs = await newGame();
    for (let i = 0; i < 80 && !(await gs.isVisible('#iskip')); i++) await gs.waitForTimeout(200);
    await gs.click('#iskip');
    await gs.waitForTimeout(300);
    const sk = await gs.evaluate(() => ({ tut: !!tut, intro: !!intro, done: st.introDone === 1, tips: !!st.tut.servi && !st.tut.punta }));
    ok(!sk.tut && !sk.intro && sk.done && sk.tips, 'si può saltare il tutorial: restano solo i consigli sulle novità');
    const old = await gs.evaluate(() => {
      st.tut = undefined;
      st.served = 500;
      guideForOldSaves();
      return GUIDA.filter(g => g.base).every(g => st.tut[g.id]) && !st.tut.bisogno;
    });
    ok(old, 'i salvataggi avanzati vedono solo i consigli sulle novità');
    await gs.close();
  }

  console.log('Macchina del caffè e schermata di caricamento');
  {
    await page.evaluate(() => (window.__cafe.st.coins += 1e5));
    await page.click('#hud button[data-p="up"]');
    await sleep(150);
    await page.click('#tabs button:has-text("Stili")');
    await sleep(100);
    const a0 = await page.evaluate(() => atm());
    for (const sel of ['button[data-mf="rame"]', 'button[data-md="cuore"]', 'button[data-ma="tazze"]', 'button[data-ma="lattiera"]']) {
      await page.click(sel);
      await sleep(60);
    }
    const m = await page.evaluate(() => ({
      fin: st.mfin,
      dec: st.mdec,
      acc: st.macc.join(','),
      atm: atm(),
      img: !!document.querySelector('.mach img')
    }));
    ok(
      m.fin === 'rame' && m.dec === 'cuore' && m.acc === 'tazze,lattiera' && m.atm >= a0 + 4 && m.img,
      `macchina personalizzata (${m.fin}, ${m.dec}, ${m.acc}) con anteprima e +Atmosfera`
    );
    await page.click('button[data-ma="tazze"]');
    await sleep(60);
    ok(
      await page.evaluate(() => st.maccOff.includes('tazze') && !machCfg().acc.includes('tazze')),
      'un accessorio comprato si può nascondere'
    );
    // insegne al neon: si comprano, si accendono da sole in un punto libero, si spostano o si mettono in magazzino
    const a1 = await page.evaluate(() => atm());
    await page.click('button[data-nb="cuore"]');
    await sleep(60);
    await page.click('button[data-nb="w_caffe"]');
    await sleep(60);
    const n1 = await page.evaluate(() => ({ own: st.neonOwn.join(','), at: Object.values(st.neonAt).sort().join(','), atm: atm() }));
    const slot = await page.evaluate(() => wallSlots().find(S => !st.neonAt[S.id] && neonFit(NEONS[0], S)));
    if (slot) await page.selectOption('select[data-ns="cuore"]', slot.id);
    await sleep(60);
    const moved = await page.evaluate(id => st.neonAt[id] === 'cuore', slot && slot.id);
    await page.selectOption('select[data-ns="w_caffe"]', '');
    await sleep(60);
    const stored = await page.evaluate(() => !Object.values(st.neonAt).includes('w_caffe'));
    ok(
      n1.own === 'cuore,w_caffe' && n1.at === 'cuore,w_caffe' && n1.atm >= a1 + 4 && (!slot || moved) && stored,
      `insegne al neon: comprate e accese (${n1.at}), spostate e rimesse in magazzino, +Atmosfera`
    );
    // laboratorio: una combinazione sbagliata dà un indizio, quella giusta mette la ricetta nel menu
    await page.click('#tabs button:has-text("Menu")');
    await sleep(100);
    const lab = async ks => {
      await page.evaluate(() => {
        labSel = [];
        renderPanel();
      });
      for (const k of ks) {
        await page.click(`button[data-ing="${k}"]`);
        await sleep(30);
      }
      await page.click('button[data-lab]');
      await sleep(120);
      const t = await page.textContent('#mbox');
      await page.click('#mbox .btns button');
      await sleep(80);
      return t;
    };
    const t1 = await lab(['cioccolato', 'menta']);
    const t2 = await lab(['cioccolato', 'menta', 'latte']);
    const inMenu = await page.evaluate(() => availMenu().some(i => i.id === 'r_mentacioc'));
    ok(
      /Manca qualcosa di morbido/.test(t1) && /Nuova ricetta/.test(t2) && inMenu,
      'laboratorio: indizio per la combinazione sbagliata, la ricetta giusta entra nel menu'
    );
    await page.click('#pclose');
    await sleep(250);
    const sp = await browser.newPage();
    await sp.goto(FILE + '?splash');
    const shown = await sp.evaluate(() => !!document.getElementById('splash'));
    await sp.waitForTimeout(2500);
    const gone = await sp.evaluate(() => !document.getElementById('splash'));
    await sp.close();
    ok(shown && gone, 'schermata di caricamento «Caffè sotto la pioggia»: compare e poi sparisce');
  }

  console.log('Gioco attivo: ora di punta e bisogni ai tavoli');
  {
    await page.evaluate(() => {
      const C = window.__cafe;
      C.people.forEach(p => {
        p.dead = true;
        if (p.seat) p.seat.occ = null;
      });
      C.queue.length = 0;
      C.speed = 1;
      if (C.mini) {
        C.mini.done = true;
        C.finishMini();
      }
      startRush();
    });
    // chi tocca Servi durante l'ora di punta fa salire la combo (clienti messi già al bancone: il test non dipende dai tempi)
    for (let n = 0; n < 4; n++) {
      await page.evaluate(() => {
        const C = window.__cafe;
        C.queue.forEach(q => (q.dead = true));
        C.queue.length = 0;
        const c = C.newCust({ type: 'normale' });
        Object.assign(c, { state: 'order', x: C.counterX - 8, y: 137, order: C.MENU[0], prog: 0, special: false, req: null, path: [] });
      });
      for (let i = 0; i < 30 && (await page.evaluate(() => window.__cafe.queue.length > 0)); i++) {
        await page.locator('#serve').dispatchEvent('pointerdown');
        await sleep(30);
      }
    }
    const r = await page.evaluate(() => ({
      combo: rush && rush.combo,
      ui: !document.querySelector('#rush').hidden,
      mult: rush && rushMult()
    }));
    if (!(r.combo >= 3))
      console.log(
        '    diagnosi:',
        await page.evaluate(() =>
          JSON.stringify({
            paused,
            modal: !document.querySelector('#modal').hidden,
            mini: !!mini,
            reader: !document.querySelector('#reader').hidden,
            panel,
            q: queue.map(q => q.state + (q.special ? '*' : '') + ' ' + q.waited.toFixed(0)),
            people: people.filter(p => !p.dead).length,
            t: rush && rush.t,
            staff: baristaRate()
          })
        )
      );
    ok(
      r.combo >= 3 && r.ui && r.mult > 1,
      `ora di punta: combo ${r.combo}, moltiplicatore x${r.mult && r.mult.toFixed(1)}, banner visibile`
    );
    await page.evaluate(() => {
      window.__cafe.speed = 1;
      if (st.ds) st.ds.rushPlan = []; // niente altre ore di punta in programma oggi
      endRush();
    });
    await sleep(100);
    ok(await page.evaluate(() => !rush && document.querySelector('#rush').hidden), "l'ora di punta finisce e il banner sparisce");
    // un cliente seduto chiede qualcosa: toccandolo lo aiuti
    const helped = await page.evaluate(() => {
      const C = window.__cafe,
        seat = C.slots[0].seats[0];
      Object.assign(seat, { occ: null, dirty: false, res: null });
      const c = C.newCust({ type: 'normale' });
      C.queue.splice(C.queue.indexOf(c), 1);
      Object.assign(c, { state: 'sit', seat, x: seat.x, y: seat.y, sitT: 99, thinkT: 99, order: C.MENU[0], mood: 50 });
      seat.occ = c;
      c.need = { k: 'zucchero', t: 25 };
      const n0 = st.needs || 0,
        m0 = c.mood;
      const ok1 = tapNeed(c.x, c.y - 14);
      return { ok: ok1 && !c.need && (st.needs || 0) === n0 + 1 && c.mood > m0 && c.tipx > 1 };
    });
    ok(helped.ok, 'bisogni ai tavoli: toccando il cliente lo aiuti (umore e mancia salgono)');
    const expired = await page.evaluate(() => {
      const c = window.__cafe.people.find(p => !p.dead && p.state === 'sit');
      c.need = { k: 'acqua', t: 0.05 };
      const m0 = c.mood;
      needsTick(0.1);
      return !c.need && c.mood < m0;
    });
    ok(expired, 'un bisogno ignorato passa, ma il cliente è meno contento');
  }

  console.log('Imprevisti');
  {
    const r = await page.evaluate(() => {
      const out = {};
      // macchina in tilt: lo staff si ferma finché non le dai cinque colpetti
      machTilt = 5;
      out.ferma = rushStaff(1) === 0;
      for (let i = 0; i < 5; i++) tapIncident(W - 20, 88);
      out.riparte = machTilt === 0 && rushStaff(1) > 0;
      // cocci: chi ci passa sopra ci resta male, toccandoli si raccolgono
      newIncident('cocci', 200, LANE);
      const c = window.__cafe.newCust({ type: 'normale' });
      Object.assign(c, { x: 200, y: LANE, moving: true, mood: 60 });
      incidentTick(0.1);
      out.lamenta = c.mood < 60 && c.hurt;
      out.raccolti = tapIncident(200, LANE - 3) && !incid.some(i => i.k === 'cocci');
      // ombrello dimenticato da un habitué: glielo ridai quando torna
      const reg = { id: 'rumb', n: 'Pia', look: window.__cafe.CH.mia.l, type: 'normale', fav: 'caffe', v: 3, f: 3, tr: [], petR: 1 };
      st.regs.push(reg);
      newIncident('ombrello', 300, 120, { col: '#ffd166', owner: 'rumb', name: 'Pia' });
      tapIncident(300, 115);
      out.messo = (st.lost || []).some(l => l.owner === 'rumb');
      window.__cafe.newCust({ look: reg.look, name: reg.n, reg, type: 'normale' });
      out.ridato = !(st.lost || []).some(l => l.owner === 'rumb') && reg.f === 4;
      return out;
    });
    ok(r.ferma && r.riparte, 'macchina in tilt: i baristi si fermano e ripartono dopo i colpetti');
    ok(r.lamenta && r.raccolti, 'cocci per terra: chi passa si lamenta, toccandoli si raccolgono');
    ok(r.messo && r.ridato, "ombrello dimenticato: lo metti da parte e l'habitué lo ritrova (affetto +1)");
  }

  console.log('Davide e Yusuf');
  {
    // il finale di Davide dipende da tutte le scelte: soprattutto dal chiedergli apertamente se pensa di togliersi la vita
    const calc = await page.evaluate(() => {
      const C = window.__cafe,
        ch = C.ARCS.find(a => a.id === 'davide').ch[3],
        out = {};
      for (const [k, a, b, c] of [
        ['salvo', 'caldo', 'lavagna', 'chiedi'],
        ['fragile1', 'nulla', 'coraggio', 'chiedi'],
        ['fragile2', 'domanda', 'parla', 'rassicura'],
        ['crisi1', 'caldo', 'coraggio', 'rassicura'],
        ['crisi2', 'caldo', 'lavagna', 'evita']
      ]) {
        Object.assign(C.st.flags, { davide1: a, davide2: b, davide3: c });
        out[k] = ch.calc.fn();
      }
      C.st.flags.davide = 'crisi';
      out.who = C.chapterWho(
        C.ARCS.find(a => a.id === 'davide'),
        ch
      ).join(',');
      return out;
    });
    ok(
      calc.salvo === 'salvo' &&
        calc.fragile1 === 'fragile' &&
        calc.fragile2 === 'fragile' &&
        calc.crisi1 === 'crisi' &&
        calc.crisi2 === 'crisi' &&
        calc.who === 'elena',
      `finale di Davide calcolato dalle scelte (${Object.values(calc).join(' · ')})`
    );
    // una partita vera: quattro incontri in giorni diversi, scegliendo la prima risposta ogni volta
    await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st;
      C.people.forEach(p => {
        p.dead = true;
        if (p.seat) p.seat.occ = null;
      });
      C.queue.length = 0;
      ['davide1', 'davide2', 'davide3', 'davide'].forEach(k => delete st.flags[k]);
      delete st.story.davide;
      st.arcDay = {};
      st.rolls = {};
      C.ARCS.forEach(a => {
        if (a.id !== 'davide') {
          st.rt[a.id] = Date.now() + 1e9;
        }
      });
      st.day = Math.max(st.day, 4);
      st.tod = 0.3;
      C.speed = 6;
    });
    const seen = [];
    for (let k = 0; k < 4; k++) {
      await page.evaluate(k => {
        const C = window.__cafe,
          st = C.st;
        C.people.forEach(p => (p.dead = true));
        C.queue.length = 0;
        C.slots.forEach(sl => sl.seats.forEach(q => Object.assign(q, { occ: null, dirty: false, res: null })));
        st.rolls.davide = { d: st.day, v: true };
        if (st.ds) st.ds.chap = 0;
        C.scenes.length = 0;
        C.regiaReset();
        if (k) st.arcDay.davide = st.day - 5;
        // solo la storia di Davide è disponibile in questo momento
        C.ARCS.forEach(a => {
          if (a.id !== 'davide') ((a._r = a.ch.map(c => c.r)), a.ch.forEach(c => (c.r = 1e9)));
        });
      }, k);
      let got = false;
      for (let i = 0; i < 120 && !got; i++) {
        await page.evaluate(() => window.__cafe.tryStory());
        got = await page.evaluate(() => window.__cafe.people.some(p => !p.dead && p.story === 'davide'));
        if (!got) await sleep(50);
      }
      for (let i = 0; i < 400; i++) {
        if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=0');
        const done = await page.evaluate(k => (window.__cafe.st.story.davide || 0) > k, k);
        if (done) break;
        await sleep(80);
      }
      seen.push(await page.evaluate(() => window.__cafe.st.story.davide || 0));
      await page.evaluate(() => {
        const C = window.__cafe;
        C.people.forEach(p => {
          if (p.story === 'davide') {
            p.dead = true;
            if (p.seat) p.seat.occ = null;
          }
        });
        C.ARCS.forEach(a => {
          if (a._r) {
            a.ch.forEach((c, i) => (c.r = a._r[i]));
            delete a._r;
          }
        });
      });
    }
    // la nota arriva qualche secondo dopo, quando non ci sono altre finestre aperte: rispondiamo a quelle che compaiono nel frattempo
    for (let i = 0; i < 150; i++) {
      if (
        await page.evaluate(
          () => /Telefono Amico/.test((document.querySelector('#mbox') || {}).textContent || '') && !document.querySelector('#modal').hidden
        )
      )
        break;
      if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=0');
      else if (await page.isVisible('#nd')) await page.click('#nd');
      await sleep(100);
    }
    const end = await page.evaluate(() => ({
      flag: window.__cafe.st.flags.davide,
      note: document.querySelector('#mbox') && !document.querySelector('#modal').hidden ? document.querySelector('#mbox').textContent : ''
    }));
    ok(
      seen.join(',') === '1,2,3,4' && end.flag === 'salvo' && /Telefono Amico/.test(end.note),
      `Davide: quattro incontri in giorni diversi (${seen.join(',')}), finale «${end.flag}» e nota con i numeri di aiuto`
    );
    if (await page.isVisible('#modal .btns button')) await page.click('#modal .btns button >> nth=0');
    await page.evaluate(() => {
      const C = window.__cafe;
      C.speed = 1;
      C.ARCS.forEach(a => {
        delete C.st.rt[a.id];
      });
    });
  }

  console.log('Alice (ricominciare dopo una malattia)');
  {
    await page.evaluate(() => (window.__cafe.speed = 6));
    const seen = [];
    let saraC4 = false;
    for (let k = 0; k < 5; k++) {
      await page.evaluate(k => {
        const C = window.__cafe,
          st = C.st;
        C.people.forEach(p => (p.dead = true));
        C.queue.length = 0;
        C.scenes.length = 0;
        C.regiaReset();
        C.slots.forEach(sl => sl.seats.forEach(q => Object.assign(q, { occ: null, dirty: false, res: null })));
        st.rolls = st.rolls || {};
        st.rolls.alice = { d: st.day, v: true };
        C.ARCS.find(a => a.id === 'alice').rand.from = 0; // nella partita vera comincia dal giorno 6
        st.arcDay = st.arcDay || {};
        if (st.ds) st.ds.chap = 0;
        if (k) st.arcDay.alice = st.day - 5;
        C.ARCS.forEach(a => {
          if (a.id !== 'alice') ((a._r = a.ch.map(c => c.r)), a.ch.forEach(c => (c.r = 1e9)));
        });
      }, k);
      let got = false;
      for (let i = 0; i < 120 && !got; i++) {
        await page.evaluate(() => {
          const C = window.__cafe;
          // se Sara è già seduta nel locale come habitué, le storie con lei aspettano: la facciamo uscire
          C.people.forEach(p => {
            if (!p.story && p.reg && ['sara', 'alice'].includes(p.reg.key)) {
              p.dead = true;
              if (p.seat) p.seat.occ = null;
            }
          });
          C.tryStory();
        });
        got = await page.evaluate(() => window.__cafe.people.some(p => !p.dead && p.story === 'alice'));
        if (!got) await sleep(50);
      }
      for (let i = 0; i < 700; i++) {
        if (k === 3 && (await page.evaluate(() => window.__cafe.people.some(p => !p.dead && p.story === 'alice' && p.key === 'sara'))))
          saraC4 = true;
        if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=0');
        if (await page.evaluate(k => (window.__cafe.st.story.alice || 0) > k, k)) break;
        if (i % 5 === 4) await page.evaluate(() => window.__cafe.regiaNext()); // come un giocatore che tocca il testo
        await sleep(80);
      }
      seen.push(await page.evaluate(() => window.__cafe.st.story.alice || 0));
      await page.evaluate(() => {
        const C = window.__cafe;
        C.people.forEach(p => {
          if (p.story === 'alice') {
            p.dead = true;
            if (p.seat) p.seat.occ = null;
          }
        });
        C.ARCS.forEach(a => {
          if (a._r) {
            a.ch.forEach((c, i) => (c.r = a._r[i]));
            delete a._r;
          }
        });
      });
    }
    for (let i = 0; i < 150; i++) {
      if (
        await page.evaluate(
          () => /LILT/.test((document.querySelector('#mbox') || {}).textContent || '') && !document.querySelector('#modal').hidden
        )
      )
        break;
      if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=0');
      else if (await page.isVisible('#nd')) await page.click('#nd');
      await sleep(100);
    }
    const end = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st;
      return {
        flags: ['alice1', 'alice2', 'alice3', 'alice4'].map(k => st.flags[k]).join(','),
        perk: !!st.perks.alice,
        note: !document.querySelector('#modal').hidden ? document.querySelector('#mbox').textContent : '',
        key: C.KEYS.alice.ok()
      };
    });
    ok(
      seen.join(',') === '1,2,3,4,5' &&
        end.flags === 'stare,scuola,sara,amica' &&
        end.perk &&
        end.key &&
        saraC4 &&
        /800 998877/.test(end.note),
      `Alice: cinque capitoli (${seen.join(',')}), scelte ${end.flags}, Sara la accompagna ai risultati (${saraC4}), premio ${end.perk}, resta ${end.key}, nota con i numeri di aiuto (${/800 998877/.test(end.note)})`
    );
    if (await page.isVisible('#modal .btns button')) await page.click('#modal .btns button >> nth=0');
    await page.evaluate(() => {
      const C = window.__cafe;
      C.speed = 1;
      C.people.forEach(p => (p.dead = true));
      C.queue.length = 0;
      C.scenes.length = 0;
      C.regiaReset();
      C.ARCS.forEach(a => delete C.st.rt[a.id]);
      C.ARCS.find(a => a.id === 'alice').rand.from = 6;
    });
  }

  console.log('Leo (un nonno in prestito)');
  {
    await page.evaluate(() => (window.__cafe.speed = 6));
    const seen = [];
    let aldoC4 = false;
    for (let k = 0; k < 5; k++) {
      await page.evaluate(k => {
        const C = window.__cafe,
          st = C.st;
        C.people.forEach(p => (p.dead = true));
        C.queue.length = 0;
        C.scenes.length = 0;
        C.regiaReset();
        C.slots.forEach(sl => sl.seats.forEach(q => Object.assign(q, { occ: null, dirty: false, res: null })));
        st.rolls = st.rolls || {};
        st.rolls.leo = { d: st.day, v: true };
        st.story.tazze = 4; // Leo arriva dopo la storia di Aldo
        C.ARCS.find(a => a.id === 'leo').rand.from = 0; // nella partita vera comincia dal giorno 8
        st.arcDay = st.arcDay || {};
        if (st.ds) st.ds.chap = 0;
        if (k) st.arcDay.leo = st.day - 5;
        C.ARCS.forEach(a => {
          if (a.id !== 'leo') ((a._r = a.ch.map(c => c.r)), a.ch.forEach(c => (c.r = 1e9)));
        });
      }, k);
      let got = false;
      for (let i = 0; i < 120 && !got; i++) {
        await page.evaluate(() => {
          const C = window.__cafe;
          // se Aldo è già seduto nel locale come habitué, le storie con lui aspettano: lo facciamo uscire
          C.people.forEach(p => {
            if (!p.story && p.reg && ['aldo', 'leo', 'giada'].includes(p.reg.key)) {
              p.dead = true;
              if (p.seat) p.seat.occ = null;
            }
          });
          C.tryStory();
        });
        got = await page.evaluate(() => window.__cafe.people.some(p => !p.dead && p.story === 'leo'));
        if (!got) await sleep(50);
      }
      if (!got)
        console.log(
          '    (capitolo ' +
            (k + 1) +
            ' non partito: ' +
            (await page.evaluate(() => {
              const arc = ARCS.find(a => a.id === 'leo'),
                k = st.story.leo || 0;
              return JSON.stringify({
                giorno: storyDayOk(arc, k),
                atm: atm() + '/' + arc.ch[k].r,
                occupati: chapterWho(arc, arc.ch[k]).filter(keyBusy),
                tutti: arc.ch.map(c => chapterWho(arc, c).filter(keyBusy)).flat(),
                attivo: activeArcs.has('leo'),
                regia: regiaFree(),
                turno: capTurno(),
                tavolo: !!freeTable()
              });
            })) +
            ')'
        );
      for (let i = 0; i < 700; i++) {
        if (k === 3 && (await page.evaluate(() => window.__cafe.people.some(p => !p.dead && p.story === 'leo' && p.key === 'aldo'))))
          aldoC4 = true;
        if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=0');
        if (await page.evaluate(k => (window.__cafe.st.story.leo || 0) > k, k)) break;
        if (i % 5 === 4) await page.evaluate(() => window.__cafe.regiaNext()); // come un giocatore che tocca il testo
        await sleep(80);
      }
      seen.push(await page.evaluate(() => window.__cafe.st.story.leo || 0));
      await page.evaluate(() => {
        const C = window.__cafe;
        C.people.forEach(p => {
          if (p.story === 'leo') {
            p.dead = true;
            if (p.seat) p.seat.occ = null;
          }
        });
        C.ARCS.forEach(a => {
          if (a._r) {
            a.ch.forEach((c, i) => (c.r = a._r[i]));
            delete a._r;
          }
        });
      });
    }
    for (let i = 0; i < 150; i++) {
      if (
        await page.evaluate(
          () => /19696/.test((document.querySelector('#mbox') || {}).textContent || '') && !document.querySelector('#modal').hidden
        )
      )
        break;
      if (await page.isVisible('.choice button')) await page.click('.choice button >> nth=0');
      else if (await page.isVisible('#nd')) await page.click('#nd');
      await sleep(100);
    }
    const end = await page.evaluate(() => {
      const C = window.__cafe,
        st = C.st;
      return {
        flags: ['leo1', 'leo2', 'leo3', 'leo4'].map(k => st.flags[k]).join(','),
        perk: !!st.perks.leo,
        note: !document.querySelector('#modal').hidden ? document.querySelector('#mbox').textContent : '',
        key: C.KEYS.leo.ok()
      };
    });
    ok(
      seen.join(',') === '1,2,3,4,5' && end.flags === 'resta,mossa,colpa,qui' && end.perk && end.key && aldoC4 && /19696/.test(end.note),
      `Leo: cinque capitoli (${seen.join(',')}), scelte ${end.flags}, Aldo gioca con lui il giovedì (${aldoC4}), premio ${end.perk}, resta ${end.key}, nota con Telefono Azzurro (${/19696/.test(end.note)})`
    );
    if (await page.isVisible('#modal .btns button')) await page.click('#modal .btns button >> nth=0');
    await page.evaluate(() => {
      const C = window.__cafe;
      C.speed = 1;
      C.people.forEach(p => (p.dead = true));
      C.queue.length = 0;
      C.scenes.length = 0;
      C.regiaReset();
      C.ARCS.forEach(a => delete C.st.rt[a.id]);
      C.ARCS.find(a => a.id === 'leo').rand.from = 8;
    });
  }

  console.log('Segreti e interazioni');
  await page.evaluate(() => {
    window.__cafe.speed = 1;
    const st = window.__cafe.st;
    st.found = {};
  });
  for (let i = 0; i < 6; i++) {
    await tapWorld(page, 18, 70);
    await sleep(60);
  }
  ok(await page.evaluate(() => !!window.__cafe.st.found.campanello), 'campanello della porta (6 tocchi) → segreto');
  await page.evaluate(() => {
    window.__cafe.queue.length = 0;
  });
  const W = await page.evaluate(() => window.__cafe.W);
  await tapWorld(page, W - 20, 90);
  await sleep(80);
  ok(
    await page.evaluate(() => !!window.__cafe.st.found.pausa && window.__cafe.boostT > 0),
    'macchina del caffè senza clienti → pausa caffè e tocchi doppi'
  );
  const sb = await page.evaluate(() => window.__cafe.signBox);
  for (let i = 0; i < 8; i++) {
    await tapWorld(page, sb.x + sb.w / 2, sb.y + 7);
    await sleep(50);
  }
  ok(await page.evaluate(() => !!window.__cafe.st.found.insegna), 'insegna toccata 8 volte → neon arcobaleno');
  const cb = await page.evaluate(() => window.__cafe.CB);
  if (cb.chalk) {
    await tapWorld(page, cb.chalk.x + 10, cb.chalk.y + 10);
    await sleep(150);
    await page.fill('#chIn', 'Oggi piove, resta qui');
    await page.click('#mbox .btns .big');
    await sleep(100);
    ok(
      await page.evaluate(() => window.__cafe.st.chalk === 'Oggi piove, resta qui' && !!window.__cafe.st.found.lavagna),
      'si scrive sulla lavagna'
    );
  }
  if (cb.rec) {
    for (let i = 0; i < 3; i++) {
      await tapWorld(page, cb.rec.x + 6, cb.rec.y + 9);
      await sleep(80);
    }
    ok(await page.evaluate(() => !!window.__cafe.st.found.radio), 'giradischi: tutte le stazioni → segreto');
  }
  if (cb.plant) {
    for (let i = 0; i < 3; i++) {
      await tapWorld(page, cb.plant.x + 4, cb.plant.y + 10);
      await sleep(80);
    }
    ok(await page.evaluate(() => !!window.__cafe.st.flower), 'annaffiando la pianta sboccia un fiore');
  }
  const pane = await page.evaluate(() => window.__cafe.panes().find(p => !p.locked));
  await page.evaluate(() => {
    window.__cafe.st.wx = 'pioggia';
    window.__cafe.st.wx2 = null;
  });
  await tapWorld(page, pane.x + 20, 78);
  await sleep(80);
  ok(await page.evaluate(() => !!window.__cafe.st.found.disegno), 'disegno sul vetro appannato quando piove');
  await page.evaluate(() => {
    const C = window.__cafe;
    C.st.wx = 'pioggia';
    C.st.tod = 0.9;
    C.st.rareDay = 0;
    // con quattro persone in fila il visitatore raro non entra: la svuotiamo
    C.queue.forEach(p => (p.dead = true));
    C.queue.length = 0;
    for (let i = 0; i < 80 && !C.queue.some(p => p.rare); i++) C.tryRare();
  });
  const rare = await page.evaluate(() => {
    const p = window.__cafe.queue.find(p => p.rare);
    return p && p.rare;
  });
  ok(!!rare, `arriva un visitatore raro (${rare})`);
  await page.evaluate(() => {
    window.__cafe.st.tod = 0.3;
  });

  console.log('Gioco accelerato (storie, richieste speciali, scelte)');
  await page.evaluate(() => {
    const st = window.__cafe.st;
    st.decor = 8;
    st.chairs = 6;
    st.music = 4;
    window.__cafe.speed = 6;
    window.__cafe.regia.off = false; // qui si gioca davvero, con la regia accesa
  });
  const t0 = Date.now();
  let choices = 0,
    minis = 0;
  while (Date.now() - t0 < 45000) {
    if (await page.isVisible('.choice button')) {
      await page.click('.choice button >> nth=0');
      choices++;
    }
    if (await page.isVisible('#mini')) {
      await page.evaluate(() => {
        const C = window.__cafe;
        const m = C.mini;
        if (m && !m.done) {
          m.done = true;
          m.q = 1;
          m.endT = 0;
        }
        C.finishMini();
      });
      minis++;
    }
    if ((await page.isVisible('#modal')) && !(await page.isVisible('.choice button'))) {
      const b = page.locator('#modal .btns button').last();
      if (await b.count()) await b.click();
    }
    await page.locator('#serve').dispatchEvent('pointerdown');
    await sleep(120);
  }
  const st = await page.evaluate(() => {
    const s = window.__cafe.st;
    return { served: s.served, story: Object.values(s.story).reduce((a, b) => a + b, 0) };
  });
  ok(st.served > 20, `gioco accelerato: ${st.served} clienti serviti, ${st.story} capitoli, ${choices} scelte, ${minis} speciali`);
  // l'ultimo «Servi» può aver aperto un minigioco: chiudiamolo prima di andare avanti
  await page.evaluate(() => {
    const C = window.__cafe;
    C.queue.forEach(q => (q.special = false));
    if (C.mini) {
      C.mini.done = true;
      C.finishMini();
    }
  });
  await sleep(200);
  if (await page.isVisible('#modal')) {
    const b = page.locator('#modal .btns button').last();
    if (await b.count()) await b.click();
  }
  await page.evaluate(() => (window.__cafe.speed = 1));

  console.log('Comodità e suoni');
  {
    await page.evaluate(() => (window.__cafe.st.coins += 0));
    await page.click('#hud button[data-p="set"]');
    await sleep(200);
    const n = await page.locator('#pbody input[data-vol]').count();
    await page.locator('#pbody input[data-vol="m"]').fill('30');
    await page.locator('#pbody input[data-vol="s"]').fill('55');
    await page.click('#pbody button[data-tv="lenta"]');
    await sleep(100);
    const d1 = await page.evaluate(() => ({ vol: window.__cafe.st.vol, dur: sayDur('Una frase di prova per misurare.') }));
    await page.click('#pbody button[data-tv="normale"]');
    const d0 = await page.evaluate(() => sayDur('Una frase di prova per misurare.'));
    ok(
      n === 3 && d1.vol.m === 30 && d1.vol.s === 55 && d1.dur > d0 * 1.3,
      `impostazioni: tre volumi separati (musica ${d1.vol.m}, effetti ${d1.vol.s}) e velocità del testo (lenta ${d1.dur.toFixed(1)}s, normale ${d0.toFixed(1)}s)`
    );
    await page.click('#pbody #bigt');
    await sleep(150);
    const big = await page.evaluate(() => ({
      cls: document.documentElement.classList.contains('grande'),
      z: getComputedStyle(document.querySelector('#pbody')).zoom
    }));
    await page.click('#pbody #bigt');
    await sleep(100);
    const small = await page.evaluate(() => document.documentElement.classList.contains('grande'));
    ok(big.cls && String(big.z) !== '1' && !small, 'testo grande: si accende e si spegne dalle impostazioni');
    const snd = await page.evaluate(() => {
      initAudio();
      const err = [];
      ['door', 'cup', 'piatti', 'crash', 'coin', 'story'].forEach(k => {
        try {
          sfx(k);
        } catch (e) {
          err.push(k + ': ' + e.message);
        }
      });
      try {
        audioTick();
      } catch (e) {
        err.push('pioggia: ' + e.message);
      }
      return { err, ok: !!(typeof sfxG !== 'undefined' && sfxG && ambG) };
    });
    ok(
      snd.ok && !snd.err.length,
      `suoni nuovi (porta, tazzina, piatti, cocci, gocce di pioggia) senza errori${snd.err.length ? ': ' + snd.err.join(', ') : ''}`
    );
    await page.click('#pclose');
    await sleep(200);
    // tutto a tema: icone dei miglioramenti e delle schede, frecce disegnate, cursori e chicco del volume
    await page.click('#hud button[data-p="up"]');
    await sleep(200);
    const tema = await page.evaluate(() => ({
      righe: document.querySelectorAll('#pbody .row.ico .ui svg').length,
      schede: document.querySelectorAll('#tabs button svg.tab').length,
      tutte: UP.every(u => UPI[u.id]),
      cur: getComputedStyle(document.documentElement).getPropertyValue('--cur').includes('data:image/png'),
      bean: getComputedStyle(document.documentElement).getPropertyValue('--bean').includes('svg'),
      frecce: pxText('Avanti ›').includes('<svg')
    }));
    await page.click('#pclose');
    await sleep(200);
    ok(
      tema.righe >= 3 && tema.schede === 6 && tema.tutte && tema.cur && tema.bean && tema.frecce,
      `tutto a tema: un'icona per ogni miglioramento (${tema.righe} in questa scheda) e scheda, frecce disegnate, cursore a tazzina, chicco del volume`
    );
  }

  console.log('Salvataggio');
  await page.click('#hud button[data-p="set"]');
  await sleep(150);
  await page.click('#exp');
  await sleep(150);
  const code = await page.inputValue('#savecode');
  const name = await page.evaluate(() => window.__cafe.st.name);
  ok(code.length > 100, 'esporta produce un codice');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#modal .btns button:has-text("Scarica file")')]);
  const dlPath = await dl.path();
  const fileOk = JSON.parse(require('fs').readFileSync(dlPath, 'utf8')).name === name;
  ok(
    fileOk && /caffe-sotto-la-pioggia-giorno-\d+\.json/.test(dl.suggestedFilename()),
    `il salvataggio si scarica in un file (${dl.suggestedFilename()})`
  );
  await page.click('#modal .btns button >> nth=0');
  await sleep(100);
  await page.evaluate(k => {
    const s = JSON.parse(localStorage.getItem(k));
    s.name = 'Altro';
    localStorage.setItem(k, JSON.stringify(s));
  }, KEY);
  await page.click('#imp');
  await sleep(150);
  // si ricarica dal file scaricato
  await page.setInputFiles('#savefile', dlPath);
  await page.waitForFunction(() => document.querySelector('#savein').value.length > 100);
  await Promise.all([page.waitForEvent('load'), page.click('#modal .btns button >> nth=1')]);
  await page.waitForTimeout(300);
  ok(await page.evaluate(([k, n]) => JSON.parse(localStorage.getItem(k)).name === n, [KEY, name]), 'importa ripristina la partita');
  await page.evaluate(k => localStorage.setItem(k, '{rotto'), KEY);
  await page.reload();
  await page.waitForTimeout(300);
  ok(await page.evaluate(() => !!window.__cafe.st.name), 'con il salvataggio rovinato riparte dalla copia di riserva');

  console.log('Ricomincia e filmato');
  await page.click('#go');
  await sleep(700);
  // a metà giornata e senza finestre aperte: la fine del giorno non deve coprire il pannello durante il test
  await page.evaluate(() => {
    const C = window.__cafe;
    C.st.tod = 0.3;
  });
  if (await page.isVisible('#modal')) {
    const b = page.locator('#modal .btns button').last();
    if (await b.count()) await b.click();
    await sleep(200);
  }
  await page.click('#hud button[data-p="set"]');
  await sleep(150);
  await page.click('#rst');
  await sleep(100);
  await Promise.all([page.waitForEvent('load'), page.click('#rst')]);
  await page.waitForTimeout(400);
  const after = await page.evaluate(
    k => ({
      ls: localStorage.getItem(k),
      bak: localStorage.getItem(k + '_bak'),
      name: window.__cafe.st.name,
      day: window.__cafe.st.day,
      tables: window.__cafe.st.tables
    }),
    KEY
  );
  if (after.ls || after.bak || after.tables !== 1)
    console.log('    diagnosi:', JSON.stringify({ salvataggio: !!after.ls, riserva: !!after.bak, nome: after.name, tavoli: after.tables }));
  ok(
    !after.ls && !after.bak && !after.name && after.day === 1 && after.tables === 1,
    `Ricomincia azzera tutto (giorno ${after.day}, tavoli ${after.tables})`
  );
  await page.click('#go');
  await sleep(1500);
  ok(await page.evaluate(() => !!window.__cafe.cine), 'nuova partita: parte il filmato iniziale');
  await page.click('#skip');
  await sleep(300);
  ok(await page.isVisible('#naming'), 'il filmato si può saltare e poi si sceglie il nome');
  await page.fill('#nameIn', 'Bar Luna');
  await page.click('#openBtn');
  await sleep(600);
  ok(
    await page.evaluate(() => window.__cafe.st.name === 'Bar Luna' && !!window.__cafe.st.found.nome && window.__cafe.st.day === 1),
    'si apre il nuovo locale (e il nome «Luna» è un segreto)'
  );

  ok(!errors.length, 'nessun errore JavaScript' + (errors.length ? ': ' + [...new Set(errors)].join(' | ') : ''));
  await browser.close();
  console.log(fails ? `\n${fails} controlli FALLITI` : '\nTutto ok');
  process.exit(fails ? 1 : 0);
})();
