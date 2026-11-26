// Animazione del risultato dei minigiochi: alla fine compare quello che hai preparato, diverso a seconda di com'è venuto.
// Latte art vista dall'alto, tazzina che fuma con la crema, toast/pancake/ramen dorati o bruciati,
// bicchiere con bolle, i dolci della vetrina che saltellano sul piatto. q: 2 perfetto, 1 buono, 0 andato male.

const RES_N = 32; // il disegno è 32x32 pixel, ingrandito dal CSS
let resRaf = 0;

function startResult(m) {
  const cv = $('#mcan');
  cv.width = cv.height = RES_N;
  cv.hidden = false;
  const t0 = performance.now(),
    item = (m.c && m.c.order) || MENU[0],
    seed = Math.random() * 99;
  cancelAnimationFrame(resRaf);
  const loop = () => {
    if (mini !== m || !m.done) return;
    drawResult(cv.getContext('2d'), m.k, item, m.q, (performance.now() - t0) / 1000, m.seq || [], seed, m.drawPx);
    resRaf = requestAnimationFrame(loop);
  };
  loop();
}
function stopResult() {
  cancelAnimationFrame(resRaf);
}

function drawResult(x, kind, item, q, t, seq, seed, drawPx) {
  x.clearRect(0, 0, RES_N, RES_N);
  const R = (px, py, w, h, c) => {
      x.fillStyle = c;
      x.fillRect(Math.round(px), Math.round(py), w, h);
    },
    disc = (cx, cy, r, c, sy) => {
      x.fillStyle = c;
      for (let dy = -r; dy <= r; dy++) {
        const w = Math.round(Math.sqrt(r * r - dy * dy) / (sy || 1)) || 0;
        if (w) x.fillRect(cx - w, Math.round(cy + dy * (sy ? 1 : 1)), w * 2, 1);
      }
    },
    ellipse = (cx, cy, rx, ry, c) => {
      x.fillStyle = c;
      for (let dy = -ry; dy <= ry; dy++) {
        const w = Math.round(rx * Math.sqrt(1 - (dy * dy) / (ry * ry)));
        if (w) x.fillRect(cx - w, cy + dy, w * 2, 1);
      }
    },
    steam = (cx, top, n, col) => {
      for (let i = 0; i < n; i++) {
        const ph = (t * 0.9 + i / n) % 1,
          sx = cx + (i - (n - 1) / 2) * 4 + Math.sin(ph * 6 + i) * 1.5,
          sy = top - ph * 12;
        x.globalAlpha = (1 - ph) * 0.7;
        R(sx, sy, 1, 2, col || '#ffffff');
      }
      x.globalAlpha = 1;
    },
    sparkles = () => {
      if (q < 2) return;
      [
        [4, 5],
        [27, 7],
        [26, 25],
        [5, 24]
      ].forEach(([sx, sy], i) => {
        const a = (Math.sin(t * 5 + i * 1.7) + 1) / 2;
        x.globalAlpha = a;
        R(sx, sy - 1, 1, 3, '#ffd166');
        R(sx - 1, sy, 3, 1, '#ffd166');
        x.globalAlpha = 1;
      });
    },
    smoke = (cx, top) => {
      if (q > 0) return;
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.6 + i / 3) % 1;
        x.globalAlpha = (1 - ph) * 0.6;
        disc(Math.round(cx + Math.sin(ph * 5 + i) * 3), Math.round(top - ph * 10), 1 + Math.round(ph * 2), '#a89cb8');
      }
      x.globalAlpha = 1;
    },
    bob = Math.round(Math.sin(t * 2.4) * 0.6);

  if (kind === 'mano') {
    disc(16, 16, 14, '#e8dcf0');
    disc(16, 16, 12, '#fffaf2');
    disc(16, 16, 10, '#8a5230');
    disc(16, 16, 9, '#a8663a');
    const open = Math.min(1, t * 1.2);
    x.globalAlpha = open;
    for (const v of drawPx || []) {
      const px = v % RES_N,
        py = (v / RES_N) | 0;
      if (Math.hypot(px - 16, py - 16) < 10) R(px, py, 1, 1, '#f8ecd8');
    }
    x.globalAlpha = 1;
    R(27, 14, 3, 4, '#fffaf2');
    steam(16, 6, 3);
    sparkles();
  } else if (kind === 'latte') {
    // tazza vista dall'alto, con il disegno che si "apre" piano
    disc(16, 16, 14, '#e8dcf0');
    disc(16, 16, 12, '#fffaf2');
    disc(16, 16, 10, '#8a5230');
    disc(16, 16, 9, '#a8663a');
    const open = Math.min(1, t * 1.4),
      foam = '#f8ecd8';
    if (q === 2) {
      // cuore
      const H = ['.##...##.', '####.####', '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'];
      x.globalAlpha = open;
      H.forEach((row, j) => [...row].forEach((ch, i) => ch === '#' && R(12 + i, 12 + j, 1, 1, foam)));
      x.globalAlpha = 1;
    } else if (q === 1) {
      // rosetta: stelo e foglie
      x.globalAlpha = open;
      R(16, 9, 1, 14, foam);
      for (let i = 0; i < 6; i++) {
        const w = 5 - Math.abs(i - 2);
        R(16 - w, 10 + i * 2, w, 1, foam);
        R(17, 10 + i * 2, w, 1, foam);
      }
      x.globalAlpha = 1;
    } else {
      // macchia
      disc(14, 17, Math.round(2 + open * 2), foam);
      disc(18, 14, Math.round(1 + open), foam);
    }
    R(27, 14, 3, 4, '#fffaf2');
    steam(16, 6, 3);
    sparkles();
  } else if (kind === 'monta') {
    const espresso = item.id === 'caffe' || item.id === 'affo';
    ellipse(16, 27, 12, 2, '#e8dcf0'); // piattino
    if (espresso) {
      // tazzina: crema dorata (q2), chiara (q1) o bruciata (q0)
      R(9, 16 + bob, 14, 10, '#fffaf2');
      R(10, 25 + bob, 12, 1, '#d8cce0');
      R(23, 18 + bob, 3, 1, '#fffaf2');
      R(25, 18 + bob, 1, 4, '#fffaf2');
      R(23, 21 + bob, 3, 1, '#fffaf2');
      const crema = q === 2 ? '#c98a4a' : q === 1 ? '#dcb888' : '#3a2018';
      R(10, 16 + bob, 12, 2, crema);
      if (q === 2) for (let i = 0; i < 4; i++) R(11 + ((i * 3 + Math.floor(t * 2)) % 10), 16 + bob, 1, 1, '#e8b070');
      steam(16, 12 + bob, q === 0 ? 1 : 3);
      smoke(16, 12);
    } else {
      // cappuccino: cupola di schiuma alta (q2), normale (q1), sgonfia con una goccia che cola (q0)
      R(9, 14 + bob, 14, 12, '#fffaf2');
      R(10, 25 + bob, 12, 1, '#d8cce0');
      R(23, 16 + bob, 3, 1, '#fffaf2');
      R(25, 16 + bob, 1, 5, '#fffaf2');
      R(23, 20 + bob, 3, 1, '#fffaf2');
      R(9, 18 + bob, 14, 1, '#ff9fc8');
      const h = q === 2 ? 5 : q === 1 ? 3 : 1;
      for (let i = 0; i < h; i++) R(10 + i, 14 + bob - i, 12 - i * 2, 1, i === h - 1 && q === 2 ? '#ffffff' : '#f8ecd8');
      if (q === 2) R(15, 14 + bob - h, 2, 1, '#ff9fc8');
      if (q === 0) R(12, 15 + bob + Math.floor((t * 4) % 6), 1, 2, '#f8ecd8');
      steam(16, 10 + bob - h, 3);
    }
    sparkles();
  } else if (kind === 'padella') {
    ellipse(16, 24, 14, 4, '#e8dcf0');
    ellipse(16, 24, 12, 3, '#fffaf2');
    const col = q === 2 ? '#e0a848' : q === 1 ? '#f0c878' : '#3a2418',
      edge = q === 0 ? '#1a1010' : '#a86a28';
    if (item.i === 'bowl') {
      // ramen
      R(7, 16, 18, 6, '#e63946');
      R(8, 22, 16, 2, '#c02a36');
      R(7, 15, 18, 2, q === 0 ? '#5a3a20' : '#f4e0a0');
      for (let i = 0; i < 6; i++) R(9 + i * 2 + ((Math.floor(t * 3) + i) % 2), 14, 1, 2, q === 0 ? '#4a2a18' : '#f8e8b0');
      R(18, 14, 3, 2, '#f4f1de');
      R(19, 14, 1, 1, q === 0 ? '#8a5020' : '#ffd166');
      R(10, 14, 2, 1, '#7bd389');
      R(22, 4, 1, 11, '#d9b98a');
      R(24, 4, 1, 11, '#d9b98a');
      steam(16, 11, q === 0 ? 1 : 4);
    } else if (item.i === 'pancake') {
      for (let i = 0; i < 3; i++) {
        R(9, 19 - i * 3 + bob, 14, 3, col);
        R(9, 21 - i * 3 + bob, 14, 1, edge);
      }
      if (q > 0) {
        R(14, 11 + bob, 4, 2, '#fff3d0');
        R(15, 13 + bob, 1, 2 + Math.floor((t * 2) % 3), '#ffd166');
      }
      steam(16, 9, q === 0 ? 0 : 2);
    } else {
      // toast
      for (let i = 0; i < 2; i++) {
        const ox = 8 + i * 9;
        R(ox, 13 + bob - i, 8, 8, col);
        R(ox, 13 + bob - i, 8, 1, edge);
        R(ox, 13 + bob - i, 1, 8, edge);
        R(ox + 7, 13 + bob - i, 1, 8, edge);
        if (q > 0) R(ox + 2, 16 + bob - i, 3, 2, '#7bd389');
      }
      steam(16, 9, q === 0 ? 0 : 2);
    }
    smoke(16, 10);
    sparkles();
  } else if (kind === 'shaker') {
    // bicchiere alto con la bevanda del colore giusto
    const C = { smooth: '#ff6fa0', iced: '#c9a27a', matcha: '#7bd389', choc: '#7a4a2a', bubble: '#e8c8a0' }[item.id] || '#ff6fa0';
    R(10, 6, 12, 21, 'rgba(220,235,255,.55)');
    R(10, 26, 12, 1, '#c8d8f0');
    const lvl = q === 0 ? 12 : 16;
    if (q === 0) {
      // separato: due strati
      R(11, 26 - lvl, 10, lvl / 2, shade(C, 1.25));
      R(11, 26 - lvl / 2, 10, lvl / 2, shade(C, 0.7));
      R(21, 12 + Math.floor((t * 4) % 10), 1, 2, C);
    } else {
      R(11, 26 - lvl, 10, lvl, C);
      R(11, 26 - lvl, 10, 2, q === 2 ? '#ffffff' : shade(C, 1.3));
      for (let i = 0; i < 4; i++) {
        const ph = (t * 0.7 + i / 4) % 1;
        R(12 + ((i * 3) % 8), 25 - ph * (lvl - 3), 1, 1, 'rgba(255,255,255,.8)');
      }
    }
    if (item.id === 'bubble') for (let i = 0; i < 5; i++) R(12 + i * 2, 24 - (i % 2), 1, 1, '#3a2020');
    if (item.id === 'iced' || item.id === 'smooth')
      for (let i = 0; i < 3; i++) R(12 + i * 3, 14 + (i % 2) * 3, 2, 2, 'rgba(255,255,255,.7)');
    R(18, 2, 1, 10, '#ff4fa3');
    R(18, 2, 3, 1, '#ff4fa3');
    if (q === 2) disc(10, 9, 2, '#ff6f6f');
    sparkles();
  } else {
    // vetrina: i tre dolci scelti saltellano sul piatto, uno dopo l'altro
    ellipse(16, 26, 14, 3, '#e8dcf0');
    ellipse(16, 26, 12, 2, '#fffaf2');
    const keys = ['croissant', 'cake', 'donut', 'muffin', 'cookie'];
    (seq.length ? seq : [0, 1, 2]).slice(0, 3).forEach((si, i) => {
      const P = PXS[keys[si]];
      if (!P) return;
      const jump = Math.max(0, Math.sin(t * 4 - i * 1.1)) * 3,
        tip = q === 0 && i === 2;
      P.r.forEach((row, j) =>
        [...row].forEach((ch, k) => {
          if (ch === '.' || ch === ' ') return;
          const px = 1 + i * 10 + (tip ? j * 0.3 : 0) + k * 0.75,
            py = 14 + j * 0.75 - jump + (tip ? 2 : 0);
          R(px, py, 1, 1, P.p[ch]);
        })
      );
    });
    if (q === 0) for (let i = 0; i < 4; i++) R(22 + i * 2, 25, 1, 1, '#c98030');
    sparkles();
  }
}

/* ----- latte art a mano libera ----- */
// Disegni col dito sulla schiuma. La forma si vede chiara per un attimo e poi resta appena accennata.
// Il punteggio confronta il disegno con la forma su una griglia 48x48 (con un po' di tolleranza):
// quanta parte del disegno sta sulla forma e quanta parte della forma hai coperto.
const MANO_N = 96;
let mano = null;
function manoStart(m) {
  const shape = (m.c.req && m.c.req.shape) || 'cuore',
    cv = $('#mdraw');
  mano = { m, shape, strokes: [], cur: null, t0: performance.now(), tpl: SHAPES[shape]() };
  cv.width = cv.height = MANO_N;
  cv.hidden = false;
  $('#mmeter').hidden = true;
  $('#mdots').hidden = true;
  $('#mtxt').textContent = `Disegna ${SHAPEN[shape]} sulla schiuma, poi tocca «Fatto!».`;
  m.arm = true;
  const loop = () => {
    if (!mano || mano.m !== m || m.done) return;
    manoDraw();
    m.raf = requestAnimationFrame(loop);
  };
  loop();
}
function manoDraw() {
  const x = $('#mdraw').getContext('2d'),
    N = MANO_N,
    age = (performance.now() - mano.t0) / 1000;
  x.clearRect(0, 0, N, N);
  x.fillStyle = '#e8dcf0';
  x.beginPath();
  x.arc(N / 2, N / 2, N / 2, 0, 7);
  x.fill();
  x.fillStyle = '#8a5230';
  x.beginPath();
  x.arc(N / 2, N / 2, N * 0.44, 0, 7);
  x.fill();
  x.fillStyle = '#a8663a';
  x.beginPath();
  x.arc(N / 2, N / 2, N * 0.4, 0, 7);
  x.fill();
  // la forma: chiara all'inizio, poi solo un'ombra
  const show = age < 1.4 ? 0.6 : Math.max(0.12, 0.6 - (age - 1.4) * 0.8);
  x.strokeStyle = `rgba(255,255,255,${show})`;
  x.lineWidth = 2;
  x.setLineDash([3, 3]);
  x.lineCap = x.lineJoin = 'round';
  for (const s of mano.tpl) {
    x.beginPath();
    s.forEach(([a, b], i) => (i ? x.lineTo(a * N, b * N) : x.moveTo(a * N, b * N)));
    x.stroke();
  }
  x.setLineDash([]);
  x.strokeStyle = '#f8ecd8';
  x.lineWidth = 5;
  for (const s of mano.strokes.concat(mano.cur ? [mano.cur] : [])) {
    x.beginPath();
    s.forEach(([a, b], i) => (i ? x.lineTo(a * N, b * N) : x.moveTo(a * N, b * N)));
    if (s.length === 1) x.lineTo(s[0][0] * N + 0.1, s[0][1] * N);
    x.stroke();
  }
}
function manoPoint(e) {
  const r = $('#mdraw').getBoundingClientRect();
  return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
}
$('#mdraw').addEventListener('pointerdown', e => {
  if (!mano || mano.m.done) return;
  e.preventDefault();
  try {
    $('#mdraw').setPointerCapture(e.pointerId);
  } catch (err) {}
  mano.cur = [manoPoint(e)];
});
$('#mdraw').addEventListener('pointermove', e => {
  if (!mano || !mano.cur) return;
  const p = manoPoint(e),
    l = mano.cur[mano.cur.length - 1];
  if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 0.008) mano.cur.push(p);
});
['pointerup', 'pointercancel'].forEach(ev =>
  $('#mdraw').addEventListener(ev, () => {
    if (mano && mano.cur) {
      mano.strokes.push(mano.cur);
      mano.cur = null;
    }
  })
);
// trasforma dei tratti in un insieme di caselle su una griglia GxG
function manoGrid(strokes, G) {
  const set = new Set();
  for (const s of strokes)
    for (let i = 0; i < s.length; i++) {
      const a = s[i],
        b = s[i + 1] || a,
        n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * G * 2));
      for (let k = 0; k <= n; k++) {
        const gx = Math.floor((a[0] + ((b[0] - a[0]) * k) / n) * G),
          gy = Math.floor((a[1] + ((b[1] - a[1]) * k) / n) * G);
        if (gx >= 0 && gy >= 0 && gx < G && gy < G) set.add(gy * G + gx);
      }
    }
  return set;
}
function manoGrow(set, G) {
  const out = new Set(set);
  for (const v of set) {
    const x = v % G,
      y = (v / G) | 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) if (x + dx >= 0 && y + dy >= 0 && x + dx < G && y + dy < G) out.add((y + dy) * G + x + dx);
  }
  return out;
}
// punteggio 0..1: media fra «quanto del disegno è sulla forma» e «quanto della forma hai disegnato»
function manoScore(strokes, tpl) {
  const G = 48,
    A = manoGrid(tpl, G),
    B = manoGrid(strokes, G);
  if (B.size < 4) return 0;
  const A2 = manoGrow(A, G),
    B2 = manoGrow(B, G);
  let inA = 0,
    cov = 0;
  for (const v of B) if (A2.has(v)) inA++;
  for (const v of A) if (B2.has(v)) cov++;
  const p = inA / B.size,
    r = cov / A.size;
  return p + r ? (2 * p * r) / (p + r) : 0;
}
// tocco su «Fatto!»
function manoDone() {
  if (!mano) return;
  if (mano.cur) (mano.strokes.push(mano.cur), (mano.cur = null));
  const pts = mano.strokes.reduce((a, s) => a + s.length, 0);
  if (pts < 6) {
    $('#mtxt').textContent = `Prima disegna ${SHAPEN[mano.shape]} col dito sulla schiuma!`;
    sfx('meh');
    return;
  }
  const f = manoScore(mano.strokes, mano.tpl);
  // il caffè nell'animazione finale ha raggio 10 su 32: riportiamo il disegno a quella scala
  const k = 10 / RES_N / 0.44;
  mano.m.drawPx = [
    ...manoGrid(
      mano.strokes.map(st2 => st2.map(([a, b]) => [0.5 + (a - 0.5) * k, 0.5 + (b - 0.5) * k])),
      RES_N
    )
  ];
  mano.m.score = [f];
  miniEnd(f >= 0.72 ? 2 : f >= 0.45 ? 1 : 0);
}
function manoStop() {
  mano = null;
  const cv = $('#mdraw');
  if (cv) cv.hidden = true;
}
