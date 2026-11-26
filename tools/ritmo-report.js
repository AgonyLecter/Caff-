// Riassunto di una simulazione del ritmo. Uso: node tools/ritmo-report.js <file.json>
const path = require('path');
const f = process.argv[2];
const L = require(path.resolve(f));
const m = t => (t / 60).toFixed(0) + 'm';
const last = {};
for (const e of L.ev)
  if (e.k === 'acquisto') {
    const [id, lv] = e.d.split(' ');
    last[id] = { t: e.t, lv };
  }
const tmax = Math.max(...Object.values(last).map(v => v.t));
const chs = L.ev.filter(e => e.k === 'capitolo');
console.log(
  '==',
  f,
  '== ultimo acquisto a',
  m(tmax),
  '| capitoli: 10 a',
  chs[9] ? m(chs[9].t) : '-',
  ' 40 a',
  chs[39] ? m(chs[39].t) : '-',
  ' 70 a',
  chs[69] ? m(chs[69].t) : '-',
  ' ultimo',
  chs.length ? chs[chs.length - 1].d + ' a ' + m(chs[chs.length - 1].t) : '-',
  '| franchising possibile a',
  (((L.ev.find(e => e.k === 'franchising possibile') || {}).t / 60) | 0) + 'm',
  '| errori',
  L.errors.length
);
const maxed = UPN => 0;
console.log(
  'ultimi acquisti:',
  Object.entries(last)
    .sort((a, b) => a[1].t - b[1].t)
    .slice(-6)
    .map(([k, v]) => k + ' ' + v.lv + '@' + m(v.t))
    .join(', ')
);
console.log('minuto | giorno | monete | incasso/s | atm | cuori | capitoli | habitue | legami | vite | comprabili | attesa prossimo');
L.snap
  .filter((s, i) => [5, 10, 15, 20, 30, 45, 60, 90, 120, 150, 180, 210, 239].includes(i + 1))
  .forEach(s => console.log([m(s.t), s.day, s.coins, s.ips, s.atm, s.hearts, s.ch, s.regs, s.rel, s.fili, s.aff, s.wait].join(' | ')));
