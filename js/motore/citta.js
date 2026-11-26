// Dimensioni della scena e città vista dalle finestre.

const VH = 180,
  LANE = 137,
  ROWY = [121, 154],
  DOORX = 18,
  DOORY = 136,
  DAYLEN = 300;
let VW = 320,
  W = 320,
  S = 2,
  DPR = 1,
  camX = 0,
  counterX = 0,
  colX = [],
  cols = 1,
  WY0 = 22,
  WY1 = 84,
  signBox = null,
  angX = 36,
  angW = 30,
  cityKey = '',
  city = null;
const slots = [];
for (let i = 0; i < 14; i++)
  slots.push({
    k: i >> 1,
    row: i & 1,
    x: 0,
    y: 0,
    seats: [-1, 1].map(sd => ({ side: sd, x: 0, y: 0, occ: null, dirty: false, res: null, tgt: null }))
  });
function layout() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.round(innerWidth * DPR);
  cv.height = Math.round(innerHeight * DPR);
  S = cv.height / VH;
  VW = Math.ceil(cv.width / S);
  lo.width = VW;
  lo.height = VH;
  g.imageSmoothingEnabled = false;
  const oldW = W,
    oldOff = W - VW - camX;
  cols = Math.min(st.space + 1, 7);
  W = Math.max(VW, 36 + 34 + cols * 52 + 4 + 86);
  counterX = W - 86;
  colX = [];
  for (let k = 0; k < cols; k++) colX.push(counterX - 30 - k * 52);
  angX = 36;
  angW = colX[cols - 1] - 26 - angX;
  slots.forEach(sl => {
    if (sl.k < cols) {
      sl.x = colX[sl.k];
      sl.y = ROWY[sl.row];
    } else {
      sl.x = -999;
      sl.y = -999;
    }
    sl.seats.forEach(s => {
      s.x = sl.x + s.side * 13;
      s.y = sl.y;
      if (s.occ && s.occ.state === 'sit') {
        s.occ.x = s.x;
        s.occ.y = s.y;
      }
    });
  });
  camX = clamp(W - VW - (isFinite(oldOff) ? Math.max(0, oldOff) : 0), 0, W - VW);
  const key = W + '|' + st.district;
  if (key !== cityKey) {
    cityKey = key;
    city = genCity(W, WY1 - WY0, st.district);
  }
}
function genCity(w, h, dist) {
  const mk = () => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  };
  const out = {
    day: mk(),
    night: mk(),
    dayFar: mk(),
    nightFar: mk(),
    lights: mk(),
    neons: [],
    blink: [],
    tanks: [],
    sea: null,
    lh: null,
    stars: [],
    palms: []
  };
  const P = {
    day: {
      far: '#9fb2d8',
      near: '#6f80a8',
      edge: '#c3d0ee',
      g1: '#5a8f6c',
      g2: '#41725a',
      m1: '#8aa0c8',
      m2: '#b3c4e2',
      sn: '#f4f8ff',
      tr: '#3f6b50'
    },
    night: {
      far: '#241d55',
      near: '#140f30',
      edge: '#2a2260',
      g1: '#15223a',
      g2: '#0e1a2c',
      m1: '#1c1a48',
      m2: '#2b2868',
      sn: '#8a90c8',
      tr: '#0c1424'
    }
  };
  const SR = srand(w * 7 + dist.length * 131);
  for (let i = 0; i < w / 5; i++) out.stars.push([SR() * w, SR() * h * 0.45, SR()]);
  for (const mode of ['day', 'night']) {
    let c = out[mode].getContext('2d');
    const f = out[mode + 'Far'].getContext('2d'),
      p = P[mode],
      R = srand(w * 13 + dist.charCodeAt(0) * 977),
      L = mode === 'night' ? out.lights.getContext('2d') : null,
      N = mode === 'night';
    const litF = (x, y, pr, col) => {
      const a = R();
      if (a < pr && N) {
        f.fillStyle = col;
        f.fillRect(x, y, 1, 1);
      }
    };
    const lit = (x, y, pr, cols) => {
      const a = R(),
        b = R();
      if (a < pr && L) {
        L.fillStyle = cols[Math.floor(b * cols.length)];
        L.fillRect(x, y, 1, 1);
      }
    };
    const WC = ['#ffcf7a', '#ffb36b', '#ffe6a8', '#8fd7ff'];
    if (dist === 'centro') {
      let x = -3;
      while (x < w) {
        const bw = 5 + ((R() * 8) | 0),
          bh = (h * (0.45 + R() * 0.4)) | 0;
        f.fillStyle = N ? '#1c1748' : '#b4c2e2';
        f.fillRect(x, h - bh, bw, bh);
        if (R() < 0.3) {
          f.fillRect(x + (bw >> 1), h - bh - 5, 1, 5);
        }
        x += bw + ((R() * 3) | 0);
      }
      x = -2;
      while (x < w) {
        const bw = 6 + ((R() * 9) | 0),
          bh = (h * (0.3 + R() * 0.35)) | 0;
        f.fillStyle = p.far;
        f.fillRect(x, h - bh, bw, bh);
        for (let yy = h - bh + 2; yy < h; yy += 3)
          for (let xx = x + 1; xx < x + bw - 1; xx += 2) litF(xx, yy, 0.2, 'rgba(255,200,120,.55)');
        x += bw + ((R() * 2) | 0);
      }
      x = -4;
      while (x < w) {
        const bw = 10 + ((R() * 13) | 0),
          bh = (h * (0.42 + R() * 0.5)) | 0;
        c.fillStyle = p.near;
        c.fillRect(x, h - bh, bw, bh);
        c.fillStyle = p.edge;
        c.fillRect(x, h - bh, bw, 1);
        c.fillStyle = N ? '#1b1540' : '#8090b6';
        c.fillRect(x + bw - 2, h - bh + 1, 2, bh - 1);
        const rr = R();
        if (rr < 0.4) {
          const ax = x + ((R() * (bw - 3)) | 0) + 1,
            ah = 4 + ((R() * 5) | 0);
          c.fillStyle = p.near;
          c.fillRect(ax, h - bh - ah, 1, ah);
          if (N) out.blink.push({ x: ax, y: h - bh - ah, ph: R() * 6 });
        } else if (rr < 0.62) {
          const tx = x + 2;
          c.fillStyle = p.near;
          c.fillRect(tx, h - bh - 2, 1, 2);
          c.fillRect(tx + 4, h - bh - 2, 1, 2);
          c.fillStyle = N ? '#241c4c' : '#7a6a6a';
          c.fillRect(tx - 1, h - bh - 6, 7, 4);
          c.fillRect(tx, h - bh - 7, 5, 1);
          c.fillStyle = N ? '#2e2560' : '#9a8478';
          c.fillRect(tx - 1, h - bh - 5, 7, 1);
        } else if (rr < 0.72 && bw >= 12 && N) {
          out.neons.push({
            x: x + 1,
            y: h - bh - 7,
            w: Math.min(bw - 2, 14),
            h: 5,
            col: ['#ff4fa3', '#4ff0ff', '#ffd24f', '#b46bff'][(R() * 4) | 0],
            ph: R() * 9,
            big: 1,
            seed: (R() * 99) | 0
          });
          c.fillStyle = p.near;
          c.fillRect(x + 3, h - bh - 2, 1, 2);
          c.fillRect(x + bw - 4, h - bh - 2, 1, 2);
        }
        for (let yy = h - bh + 3; yy < h; yy += 3) for (let xx = x + 2; xx < x + bw - 2; xx += 2) lit(xx, yy, 0.32, WC);
        const nn = R(),
          nx = x + 1 + ((R() * Math.max(1, bw - 6)) | 0),
          ny = h - bh + 3 + ((R() * Math.max(1, bh * 0.5)) | 0),
          nw = 3 + ((R() * 4) | 0),
          nh = 2 + ((R() * 4) | 0),
          nc = ['#ff4fa3', '#4ff0ff', '#ffd24f', '#b46bff', '#ff6b6b'][(R() * 5) | 0];
        if (N && nn < 0.55) out.neons.push({ x: nx, y: ny, w: nw, h: nh, col: nc, ph: R() * 9 });
        x += bw + 1 + ((R() * 3) | 0);
      }
    } else if (dist === 'porto') {
      const sea = Math.round(h * 0.6);
      out.sea = sea;
      let x = -2;
      while (x < w) {
        const bw = 5 + ((R() * 10) | 0),
          bh = 4 + ((R() * 10) | 0);
        c.fillStyle = p.far;
        c.fillRect(x, sea - bh, bw, bh);
        for (let yy = sea - bh + 2; yy < sea; yy += 3) for (let xx = x + 1; xx < x + bw - 1; xx += 2) lit(xx, yy, 0.3, WC);
        if (x % 3 === 0) {
          f.fillStyle = N ? '#1a1640' : '#a8b8d8';
          f.fillRect(x, sea - bh - 8 - ((R() * 6) | 0), bw + 3, bh + 8);
        }
        if (R() < 0.15) {
          c.fillStyle = p.near;
          c.fillRect(x + 2, sea - bh - 14, 1, 14);
          c.fillRect(x + 2, sea - bh - 14, 9, 1);
          c.fillRect(x + 10, sea - bh - 14, 1, 4);
        }
        x += bw + ((R() * 6) | 0);
      }
      const lx = Math.round(w * 0.72);
      out.lh = { x: lx, y: sea - 17 };
      c.fillStyle = p.near;
      c.fillRect(lx - 4, sea - 3, 9, 3);
      c.fillStyle = N ? '#3a3070' : '#e8e0d0';
      c.fillRect(lx - 1, sea - 16, 3, 13);
      c.fillStyle = N ? '#552a40' : '#d04040';
      c.fillRect(lx - 1, sea - 12, 3, 2);
      c.fillRect(lx - 1, sea - 7, 3, 2);
      c.fillStyle = p.near;
      c.fillRect(lx - 2, sea - 18, 5, 2);
    } else if (dist === 'montagna') {
      const ridge = (base, amp, col, snow) => {
        let y = base;
        for (let x = 0; x < w; x++) {
          if (x % 14 === 0) y = base - ((R() * amp) | 0);
          const pk = Math.abs(((x + ((R() * 3) | 0)) % 28) - 14);
          const yy = y + pk;
          c.fillStyle = col;
          c.fillRect(x, yy, 1, h - yy);
          if (snow && pk < 4) {
            c.fillStyle = p.sn;
            c.fillRect(x, yy, 1, 2);
          }
        }
      };
      {
        const cc = c;
        c = f;
        ridge(h * 0.18, h * 0.15, p.m2, true);
        c = cc;
      }
      ridge(h * 0.38, h * 0.12, p.m1, true);
      for (let x = 0; x < w; x += 3) {
        const th = 6 + ((R() * 8) | 0);
        c.fillStyle = p.tr;
        for (let i = 0; i < th; i++) {
          const ww = Math.max(1, Math.round((th - i) / 2.6));
          c.fillRect(x - ww + 1, h - 6 - i, ww * 2 - 1, 1);
        }
      }
      for (let x = 10; x < w; x += 40 + ((R() * 30) | 0)) {
        const cx = x;
        c.fillStyle = p.near;
        c.fillRect(cx, h - 16, 12, 10);
        c.fillRect(cx - 1, h - 17, 14, 1);
        c.fillRect(cx + 1, h - 18, 10, 1);
        c.fillRect(cx + 3, h - 19, 6, 1);
        if (L) {
          L.fillStyle = '#ffcf7a';
          L.fillRect(cx + 2, h - 13, 2, 2);
          L.fillRect(cx + 8, h - 13, 2, 2);
        }
      }
    } else {
      const sea = Math.round(h * 0.55);
      out.sea = sea;
      c.fillStyle = p.far;
      c.fillRect(Math.round(w * 0.15), sea - 5, 30, 5);
      c.fillRect(Math.round(w * 0.15) + 6, sea - 8, 14, 3);
      for (let x = 0; x < w; x += 60 + ((R() * 50) | 0)) {
        const bw = 16 + ((R() * 14) | 0),
          bh = 10 + ((R() * 10) | 0);
        c.fillStyle = p.near;
        c.fillRect(x, h - bh - 6, bw, bh);
        for (let yy = h - bh - 4; yy < h - 6; yy += 3) for (let xx = x + 2; xx < x + bw - 2; xx += 3) lit(xx, yy, 0.35, WC);
      }
      for (let x = 20; x < w; x += 34 + ((R() * 26) | 0)) {
        const ph = 14 + ((R() * 8) | 0);
        out.palms.push([x, ph]);
        c.fillStyle = p.near;
        for (let i = 0; i < ph; i++) c.fillRect(x + Math.round(Math.sin(i * 0.15) * 2), h - 6 - i, 1, 1);
        const tx = x + Math.round(Math.sin(ph * 0.15) * 2),
          ty = h - 6 - ph;
        c.fillStyle = p.g2;
        [
          [-5, 1],
          [-4, 0],
          [-3, -1],
          [-2, -1],
          [-1, -1],
          [1, -1],
          [2, -1],
          [3, -1],
          [4, 0],
          [5, 1],
          [-6, 2],
          [6, 2]
        ].forEach(([dx, dy]) => c.fillRect(tx + dx, ty + dy, 1, 1));
        c.fillRect(tx - 1, ty - 2, 3, 1);
      }
    }
  }
  return out;
}
const SKY = [
  [7, '#8fb8ff', '#ffd2a6'],
  [9, '#5aa8ff', '#cfe9ff'],
  [16, '#5aa0f0', '#d8ecff'],
  [18, '#5b7fd0', '#ffc27a'],
  [19.5, '#40387a', '#ff7a59'],
  [21, '#1a1c55', '#9a4590'],
  [23, '#0a0f30', '#4a2a6e'],
  [26.1, '#070a24', '#3a2060']
];
function skyCols() {
  const h = hour();
  let a = SKY[0],
    b = SKY[SKY.length - 1];
  for (let i = 0; i < SKY.length - 1; i++)
    if (h >= SKY[i][0] && h < SKY[i + 1][0]) {
      a = SKY[i];
      b = SKY[i + 1];
      break;
    }
  const t = (h - a[0]) / Math.max(0.01, b[0] - a[0]);
  let top = mixc(a[1], b[1], t),
    bot = mixc(a[2], b[2], t);
  const w = curWx(),
    n = nightF();
  if (w === 'pioggia' || w === 'temporale') {
    top = mixc(top, n > 0.5 ? '#121628' : '#5a6378', 0.6);
    bot = mixc(bot, n > 0.5 ? '#2a2440' : '#8a92a6', 0.55);
  } else if (w === 'nuvoloso') {
    top = mixc(top, n > 0.5 ? '#181a30' : '#8a96b0', 0.35);
    bot = mixc(bot, '#b0b6c8', 0.25);
  } else if (w === 'nebbia') {
    top = mixc(top, '#9aa0b0', 0.5);
    bot = mixc(bot, '#c8ccd6', 0.5);
  } else if (w === 'neve') {
    top = mixc(top, n > 0.5 ? '#1a1e3a' : '#a8b4cc', 0.45);
    bot = mixc(bot, '#dde3ee', 0.4);
  }
  return [top, bot];
}
