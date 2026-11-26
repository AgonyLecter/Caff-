// Simulazione del ritmo: un giocatore automatico gioca da zero (a 60x) e registra cosa succede minuto per minuto.
// Uso: NODE_PATH=$(npm root -g) node tools/ritmo-bot.js <attivo|rilassato> <ore di gioco> <file.json>
// Poi: node tools/ritmo-report.js <file.json>
// «attivo» tocca Servi ~3 volte al secondo e compra il consiglio ogni 5 s; «rilassato» gioca attivo 10 minuti e poi torna ogni 15.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
const [, , prof = 'attivo', ore = '4', out = 'ritmo.json'] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 450 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(FILE);
  await p.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('cafe_pioggia_v2', JSON.stringify({ v: 2, name: 'Sim', tutOff: 1, introDone: 1 }));
  });
  await p.reload();
  await p.waitForTimeout(300);
  await p.click('#go');
  await p.waitForTimeout(500);
  await p.evaluate(prof => {
    const L = { prof, snap: [], ev: [], taps: 0, minis: 0, choices: 0 };
    window._L = L;
    const lvl = () => Object.fromEntries(UP.map(u => [u.id, u.lv ? u.lv() : st[u.id] || 0]));
    let prevLv = lvl(),
      prevCh = 0,
      prevRegs = 0,
      lastT = T,
      lastBuy = 0,
      lastSnap = 0,
      coinsFromTaps = 0;
    const ev = (k, d) => L.ev.push({ t: Math.round(T), day: st.day, k, d });
    const buyAll = () => {
      let n = 0;
      for (let i = 0; i < 30; i++) {
        const A = advice();
        if (!A) break;
        const c = A.u.c();
        if (st.coins < c) break;
        if (!buyUp(A.u)) break;
        n++;
      }
      // franchising quando possibile
      if (st.space >= 7 && st.runEarned >= 500000 && !L.frOk) {
        L.frOk = 1;
        ev('franchising possibile', 0);
      }
      st.quests.forEach(q => {
        if (q.done && !q.cl) claimQ(q);
      });
      return n;
    };
    setInterval(() => {
      const dT = T - lastT;
      lastT = T;
      // finestre: scelte, fine giornata, avvisi
      const vis = !document.querySelector('#modal').hidden;
      const ch = vis && document.querySelector('.choice button');
      if (ch) {
        ch.click();
        L.choices++;
      }
      const nd = document.querySelector('#nd');
      if (nd && vis) nd.click();
      else if (!document.querySelector('#modal').hidden && !ch) {
        const bs = document.querySelectorAll('#modal .btns button');
        if (bs.length) bs[bs.length - 1].click();
      }
      if (!document.querySelector('#reader').hidden) closeReader();
      if (mini) {
        if (!mini.done) {
          mini.done = true;
          mini.q = Math.random() < 0.55 ? 2 : 1;
          mini.endT = 0;
        }
        finishMini();
        L.minis++;
      }
      if (prof === 'attivo' || T < 600) {
        // ~3 tocchi al secondo quando c'è qualcuno da servire
        let n = Math.round(dT * 3);
        while (n-- > 0) {
          const q = queue[0];
          if (!q || q.state !== 'order') break;
          if (q.special) {
            tapCounter();
            break;
          }
          const c0 = st.coins;
          tapCounter();
          L.taps++;
        }
        if (T - lastBuy > 5) {
          lastBuy = T;
          buyAll();
        }
      } else {
        if (T - lastBuy > 900) {
          lastBuy = T;
          buyAll();
        }
        if (mini) {
          mini.done = true;
          mini.q = 1;
          finishMini();
        } // torna ogni 15 minuti
      }
      // eventi
      const lv = lvl();
      for (const k in lv) if (lv[k] !== prevLv[k]) ev('acquisto', k + ' ' + lv[k]);
      prevLv = lv;
      const chN = Object.values(st.story).reduce((a, b) => a + b, 0);
      if (chN !== prevCh) {
        ev('capitolo', chN);
        prevCh = chN;
      }
      if (st.regs.length !== prevRegs) {
        prevRegs = st.regs.length;
      }
      if (T - lastSnap >= 60) {
        lastSnap = T;
        const aff = UP.filter(u => canUp(u) && st.coins >= u.c()).length,
          next =
            UP.filter(canUp)
              .map(u => u.c())
              .sort((a, b) => a - b)[0] || 0;
        L.snap.push({
          t: Math.round(T),
          day: st.day,
          coins: Math.round(st.coins),
          ips: Math.round(ips()),
          atm: atm(),
          hearts: st.hearts,
          rate: +rating().toFixed(2),
          ch: chN,
          regs: st.regs.length,
          rel: Object.keys(st.rel).length,
          fili: (st.fdone || []).length,
          served: st.served,
          aff,
          next,
          wait: next > st.coins && ips() > 0 ? Math.round((next - st.coins) / ips()) : null,
          nc: (() => {
            const n = nextChapter();
            return n ? n.r : null;
          })(),
          queue: queue.length,
          space: st.space,
          tables: st.tables,
          barista: st.barista,
          menu: st.menu
        });
      }
    }, 30);
  }, prof);
  await p.evaluate(() => (window.__cafe.speed = 60));
  const total = +ore * 3600;
  let lastLog = 0;
  while (true) {
    await p.waitForTimeout(5000);
    const t = await p.evaluate(() => T);
    if (t - lastLog > 1800) {
      lastLog = t;
      const s = await p.evaluate(() => {
        const x = _L.snap[_L.snap.length - 1] || {};
        return `giorno ${st.day} monete ${Math.round(st.coins)} ips ${x.ips} atm ${x.atm} capitoli ${x.ch}`;
      });
      console.log(prof, Math.round(t / 60) + ' min', s);
    }
    if (t >= total) break;
  }
  const L = await p.evaluate(() => _L);
  L.errors = errs;
  fs.writeFileSync(out, JSON.stringify(L));
  console.log('fatto', prof, 'errori', errs.length);
  await b.close();
})();
