// Utilità comuni e icone in pixel art. Caricato per primo.

const $ = s => document.querySelector(s);
const cv = $('#c'),
  ctx = cv.getContext('2d');
const lo = document.createElement('canvas');
let g = lo.getContext('2d');
const rnd = (a, b) => a + Math.random() * (b - a),
  ri = (a, b) => Math.floor(rnd(a, b + 1)),
  pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
  lerp = (a, b, t) => a + (b - a) * t;
function rgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
function mixc(a, b, t) {
  const A = rgb(a),
    B = rgb(b);
  return (
    '#' +
    A.map((v, i) =>
      Math.round(lerp(v, B[i], clamp(t, 0, 1)))
        .toString(16)
        .padStart(2, '0')
    ).join('')
  );
}
function shade(h, k) {
  const A = rgb(h);
  return (
    '#' +
    A.map(v =>
      clamp(Math.round(v * k), 0, 255)
        .toString(16)
        .padStart(2, '0')
    ).join('')
  );
}
function wpick(arr, fn) {
  let s = 0;
  const ws = arr.map(x => {
    const w = Math.max(0, fn(x));
    s += w;
    return w;
  });
  if (s <= 0) return arr[0];
  let r = Math.random() * s;
  for (let i = 0; i < arr.length; i++) {
    r -= ws[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}
function srand(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function fmt(n) {
  n = Math.floor(n);
  if (n < 1000) return '' + n;
  const u = ['k', 'M', 'G', 'T', 'P'];
  let i = -1,
    v = n;
  while (v >= 1000 && i < 4) {
    v /= 1000;
    i++;
  }
  return (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : '' + Math.floor(v)).replace('.', ',') + u[i];
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const PXI = {
  heart: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
  star: ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '.#...#.'],
  menu: ['#######', '.......', '.......', '#######', '.......', '.......', '#######'],
  close: ['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#'],
  dice: ['#######', '#.....#', '#.#...#', '#..#..#', '#...#.#', '#.....#', '#######'],
  clock: ['..###..', '.#.#.#.', '#..#..#', '#..##.#', '#.....#', '.#...#.', '..###..'],
  up: ['...#...', '..###..', '.#####.', '#######', '..###..', '..###..', '..###..'],
  book: ['.##.##.', '#..#..#', '#..#..#', '#..#..#', '#..#..#', '.##.##.', '...#...'],
  cal: ['.#...#.', '#######', '#.....#', '#.#.#.#', '#.....#', '#.#.#.#', '#######'],
  lamp: ['...#...', '..###..', '.#####.', '#######', '...#...', '..###..', '.......'],
  note: ['..####.', '..#..#.', '..#..#.', '..#..#.', '##.##..', '##.##..', '.......'],
  smile: ['.#...#.', '.#...#.', '.......', '#.....#', '.#...#.', '..###..']
};
const WI = {
  sereno: { p: { y: '#ffd166' }, r: ['y..y..y', '.yyyyy.', '.yyyyy.', 'yyyyyyy', '.yyyyy.', '.yyyyy.', 'y..y..y'] },
  luna: { p: { m: '#f4f1de' }, r: ['..mmm..', '.mm....', 'mm.....', 'mm.....', 'mm.....', '.mm....', '..mmm..'] },
  nuvoloso: { p: { w: '#dfe6f5' }, r: ['.......', '..ww...', '.wwww..', 'wwwwww.', 'wwwwwww', '.......', '.......'] },
  pioggia: { p: { w: '#c8d2ea', b: '#6ad1ff' }, r: ['..ww...', '.wwww..', 'wwwwwww', '.......', 'b.b.b..', '.b.b.b.', 'b.b.b..'] },
  temporale: { p: { w: '#a8b2ca', y: '#ffd166' }, r: ['..ww...', '.wwww..', 'wwwwwww', '...y...', '..y....', '.yyy...', '..y....'] },
  nebbia: { p: { w: '#c8ccd6' }, r: ['.......', 'wwwww..', '.......', '.wwwwww', '.......', 'wwwww..', '.......'] },
  neve: { p: { w: '#ffffff' }, r: ['w..w..w', '.w.w.w.', '..www..', 'wwwwwww', '..www..', '.w.w.w.', 'w..w..w'] }
};
const PXS = {
  croissant: {
    p: { a: '#f0b050', b: '#c98030', c: '#8a5020', d: '#ffe0a0' },
    r: [
      '............',
      '....aaaa....',
      '..aaddddaa..',
      '.abaddddaba.',
      'abbaabbaabba',
      'bbcbbccbbcbb',
      '.cc.cbbc.cc.',
      '.....cc.....',
      '............'
    ]
  },
  cake: {
    p: { r: '#e63946', p: '#ff6fa0', w: '#fff3d0', j: '#c94f7c', s: '#b9a3cf' },
    r: ['.....r....', '....ppp...', '..ppppppp.', '.pppppppp.', 'wwwwwwwwww', 'jjjjjjjjjj', 'wwwwwwwwww', 'wwwwwwwwww', 'ssssssssss']
  },
  donut: {
    p: { p: '#ff6fa0', k: '#7bd389', c: '#4ff0ff', o: '#e0a050' },
    r: ['...pppp...', '.pkpppcpp.', 'pppp..pkpp', 'pcp....ppp', 'ppp....pcp', 'opkp..pppo', 'oopppkppoo', '.oooooooo.', '...oooo...']
  },
  muffin: {
    p: { t: '#d9a060', c: '#5a3020', m: '#c77dff', n: '#8e5ea2' },
    r: ['...tttt...', '.ttcttttt.', 'tttttttctt', 'ttcttttttt', 'mmmmmmmmmm', '.mnmnmnmn.', '.mnmnmnmn.', '..mnmnmn..', '..mmmmmm..']
  },
  cookie: {
    p: { b: '#d9a441', c: '#5a3020', l: '#b07a2a' },
    r: ['...bbbb...', '.bbcbbbbb.', 'bbbbbbcbbb', 'bcbbbbbbbb', 'bbbbcbbbcb', 'bbbbbbbbbb', 'bcbbbbcbbl', '.bbbcbbbl.', '...llll...']
  }
};
function pxSvg(rows, pal, cls) {
  const h = rows.length,
    w = Math.max(...rows.map(r => r.length));
  let r = '';
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      r += `<rect x="${x}" y="${y}" width="1" height="1" fill="${typeof pal === 'string' ? pal : pal[ch]}"/>`;
    }
  });
  return `<svg class="pxi ${cls || ''}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
}
const ICO = {
  heart: pxSvg(PXI.heart, '#ff4fa3'),
  star: pxSvg(PXI.star, '#ffd166'),
  star0: pxSvg(PXI.star, '#4a3a62'),
  menu: pxSvg(PXI.menu, 'currentColor'),
  close: pxSvg(PXI.close, 'currentColor'),
  dice: pxSvg(PXI.dice, 'currentColor'),
  clock: pxSvg(PXI.clock, 'currentColor'),
  up: pxSvg(PXI.up, 'currentColor'),
  book: pxSvg(PXI.book, 'currentColor'),
  cal: pxSvg(PXI.cal, 'currentColor'),
  lamp: pxSvg(PXI.lamp, '#ffd166'),
  note: pxSvg(PXI.note, '#4ff0ff')
};
const WICO = k => {
  const x = WI[k] || WI.sereno;
  return pxSvg(x.r, x.p);
};
const pxText = h => String(h).replace(/♥/g, ICO.heart).replace(/★/g, ICO.star).replace(/☆/g, ICO.star0).replace(/♪/g, ICO.note);
function ctxPx(name, x, y, size, col) {
  const r = PXI[name],
    u = size / r.length;
  ctx.fillStyle = col;
  r.forEach((row, j) => {
    for (let i = 0; i < row.length; i++)
      if (row[i] === '#') ctx.fillRect(Math.round(x + i * u), Math.round(y + j * u), Math.ceil(u), Math.ceil(u));
  });
}
