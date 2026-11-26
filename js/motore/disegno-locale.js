// Disegno del locale, luci, oggetti e testi sopra la scena.

function panes() {
  const out = [];
  for (let k = 0; k < cols; k++) out.push({ x: colX[k] - 22, w: 44, k, locked: k >= st.space });
  return out;
}
function drawWindow() {
  const th = TH(),
    hh = WY1 - WY0,
    n = nightF(),
    [top, bot] = skyCols(),
    ps = panes();
  moonPos = null;
  g.save();
  g.beginPath();
  ps.forEach(p => g.rect(p.x, WY0, p.w, hh));
  g.clip();
  const gr = g.createLinearGradient(0, WY0, 0, WY1);
  gr.addColorStop(0, top);
  gr.addColorStop(1, bot);
  g.fillStyle = gr;
  g.fillRect(0, WY0, W, hh);
  if (n > 0.2 && !['nuvoloso', 'pioggia', 'temporale', 'nebbia'].includes(curWx())) {
    for (const s of city.stars) {
      g.fillStyle = `rgba(255,255,255,${(n - 0.2) * s[2] * (0.6 + 0.4 * Math.sin(T * 2 + s[0]))})`;
      g.fillRect(Math.round(s[0]), WY0 + Math.round(s[1]), 1, 1);
    }
  }
  const h = hour();
  if (h < 20 && !rainy() && curWx() !== 'nebbia') {
    const t = (h - 7) / 12.5,
      sx = lerp(colX[cols - 1] - 10, colX[0] + 10, t),
      sy = WY0 + hh * 0.75 - Math.sin(t * Math.PI) * hh * 0.6;
    glowAt(sx, sy, 14, '255,230,160', 0.35);
    g.fillStyle = h > 18 ? '#ffb070' : '#fff3c4';
    g.beginPath();
    g.arc(sx, sy, 4, 0, 7);
    g.fill();
  }
  if (h > 20.5 && !rainy()) {
    const t = (h - 20.5) / 5.5,
      mx = lerp(colX[cols - 1], colX[0], t),
      my = WY0 + hh * 0.6 - Math.sin(t * Math.PI) * hh * 0.45;
    moonPos = { x: mx, y: my };
    const mr = st.bigMoon ? 5.5 : 3.5;
    glowAt(mx, my, mr * 3, '220,220,255', 0.25);
    g.fillStyle = '#f4f1de';
    g.beginPath();
    g.arc(mx, my, mr, 0, 7);
    g.fill();
    if (moonWink > 0) {
      g.fillStyle = '#8a8aa0';
      g.fillRect(Math.round(mx - 2), Math.round(my - 1), 1, 1);
      g.fillRect(Math.round(mx + 1), Math.round(my - 1), 2, 1);
      g.fillRect(Math.round(mx - 1), Math.round(my + 1), 3, 1);
    } else {
      g.fillStyle = top;
      g.beginPath();
      g.arc(mx + mr * 0.46, my - 1, mr * 0.86, 0, 7);
      g.fill();
    }
  }
  drawClouds(n, h);
  drawSky2(n);
  g.globalAlpha = 1 - n;
  g.drawImage(city.dayFar, 0, WY0);
  g.globalAlpha = n;
  g.drawImage(city.nightFar, 0, WY0);
  g.globalAlpha = 1;
  {
    const hz = g.createLinearGradient(0, WY0 + hh * 0.25, 0, WY1);
    const hc = rgb(bot).join(',');
    hz.addColorStop(0, `rgba(${hc},0)`);
    hz.addColorStop(1, `rgba(${hc},${curWx() === 'nebbia' ? 0.7 : 0.45})`);
    g.fillStyle = hz;
    g.fillRect(0, WY0, W, hh);
  }
  g.globalAlpha = 1 - n;
  g.drawImage(city.day, 0, WY0);
  g.globalAlpha = n;
  g.drawImage(city.night, 0, WY0);
  g.globalAlpha = Math.min(1, 0.15 + n * 0.95);
  g.drawImage(city.lights, 0, WY0);
  g.globalAlpha = 1;
  if (city.sea != null) {
    const sy = WY0 + city.sea,
      sh = hh - city.sea - 8;
    g.fillStyle = mixc(bot, '#0a1a3a', 0.45);
    g.fillRect(0, sy, W, sh);
    g.fillStyle = mixc(bot, '#ffffff', 0.3);
    for (let i = 0; i < W / 6; i++) {
      const xx = (i * 37 + Math.floor(T * 3) * 7) % W;
      g.globalAlpha = 0.25 + 0.25 * Math.sin(T * 2 + i);
      g.fillRect(xx, sy + 1 + ((i * 5) % Math.max(1, sh - 1)), 2, 1);
    }
    g.globalAlpha = 1;
    for (const b of boats) {
      const bx = Math.round(b.x),
        by = sy + Math.round(sh * 0.4);
      g.fillStyle = n > 0.5 ? '#1a1438' : '#f4f1de';
      g.fillRect(bx - 4, by, 9, 2);
      g.fillRect(bx - 2, by - 1, 5, 1);
      g.fillStyle = n > 0.5 ? '#2a2050' : '#c94040';
      g.fillRect(bx, by - 6, 1, 5);
      g.fillStyle = n > 0.5 ? '#ffcf7a' : '#ffffff';
      g.fillRect(bx + 1, by - 5, 3, 3);
    }
  }
  if (city.lh && n > 0.3) {
    const a = (Math.sin(T * 2) + 1) / 2;
    glowAt(city.lh.x, WY0 + city.lh.y, 18 * a + 4, '255,240,180', 0.5 * n);
  }
  if (n > 0.3 && !blackout())
    for (const ne of city.neons) {
      if (Math.sin(T * 3 + ne.ph) < -0.85 && Math.random() < 0.6) continue;
      const ny = WY0 + ne.y;
      if (ne.big) {
        glowAt(ne.x + ne.w / 2, ny + ne.h / 2, ne.w * 0.9, rgb(ne.col).join(','), 0.35 * n);
        g.globalAlpha = n;
        g.fillStyle = '#120a20';
        g.fillRect(ne.x, ny, ne.w, ne.h);
        g.fillStyle = ne.col;
        g.fillRect(ne.x, ny, ne.w, 1);
        g.fillRect(ne.x, ny + ne.h - 1, ne.w, 1);
        g.fillRect(ne.x, ny, 1, ne.h);
        g.fillRect(ne.x + ne.w - 1, ny, 1, ne.h);
        const on = Math.floor(T * 1.5 + ne.ph) % 4;
        for (let i = 2; i < ne.w - 2; i++) if ((ne.seed * (i + 3)) % 5 > 1 && (on || i < ne.w / 2)) g.fillRect(ne.x + i, ny + 2, 1, 1);
        g.globalAlpha = 1;
        continue;
      }
      g.globalAlpha = 0.3 * n;
      g.fillStyle = ne.col;
      g.fillRect(ne.x - 1, ny - 1, ne.w + 2, ne.h + 2);
      g.globalAlpha = n;
      g.fillRect(ne.x, ny, ne.w, ne.h);
      g.globalAlpha = 1;
    }
  if (n > 0.3)
    for (const b of city.blink) {
      if (Math.sin(T * 2.2 + b.ph) > 0.55) {
        g.fillStyle = '#ff3b3b';
        g.fillRect(b.x, WY0 + b.y - 1, 1, 1);
        glowAt(b.x, WY0 + b.y - 1, 3, '255,60,60', 0.5 * n);
      }
    }
  const ry = WY1 - 8;
  g.fillStyle = mixc('#4a4f63', '#1a1830', n);
  g.fillRect(0, ry, W, 4);
  g.fillStyle = mixc('#8a8fa3', '#2a2640', n);
  g.fillRect(0, ry + 4, W, 4);
  g.fillStyle = mixc('#d8d8e0', '#3a3658', n);
  for (let x = 0; x < W; x += 10) g.fillRect(x, ry + 2, 5, 1);
  for (let x = 20; x < W; x += 64) {
    g.fillStyle = n > 0.5 ? '#0e0c20' : '#3a3d4e';
    g.fillRect(x, ry - 10, 1, 14);
    g.fillRect(x, ry - 10, 3, 1);
    if (n > 0.3) {
      g.fillStyle = '#ffe2a0';
      g.fillRect(x + 2, ry - 9, 1, 1);
      glowAt(x + 2, ry - 8, 8, '255,220,150', 0.35 * n);
    }
  }
  if (rainy()) {
    for (let x = 22; x < W; x += 64) {
      g.fillStyle = `rgba(255,220,150,${0.12 + 0.25 * n})`;
      for (let j = 0; j < 4; j++) if (Math.sin(T * 9 + j * 1.7 + x) > -0.3) g.fillRect(x + (j % 2), ry + 4 + j, 1, 1);
    }
    g.fillStyle = 'rgba(200,220,255,.5)';
    for (let i = 0; i < W / 30; i++) if (Math.random() < 0.3) g.fillRect(Math.round(rnd(0, W)), ry + ri(1, 7), 1, 1);
  }
  for (const c of cars) {
    const cx = Math.round(c.x),
      cy = ry + 1;
    g.fillStyle = n > 0.5 ? shade(c.c, 0.4) : c.c;
    g.fillRect(cx - 6, cy - 1, 12, 3);
    g.fillRect(cx - 3, cy - 3, 7, 2);
    g.fillStyle = n > 0.5 ? '#ffd27a' : '#bfe3ff';
    g.fillRect(cx - 2, cy - 2, 2, 1);
    g.fillRect(cx + 1, cy - 2, 2, 1);
    g.fillStyle = DK;
    g.fillRect(cx - 4, cy + 2, 2, 1);
    g.fillRect(cx + 3, cy + 2, 2, 1);
    if (n > 0.3) {
      g.fillStyle = '#fff7c0';
      g.fillRect(c.d > 0 ? cx + 6 : cx - 7, cy, 1, 1);
      glowAt(c.d > 0 ? cx + 10 : cx - 11, cy, 7, '255,240,180', 0.4);
      g.fillStyle = '#ff4040';
      g.fillRect(c.d > 0 ? cx - 7 : cx + 6, cy, 1, 1);
    }
  }
  for (const p of peds) {
    const px = Math.round(p.x),
      py = ry + 7,
      st2 = Math.floor(T * 6 + p.ph) % 2;
    g.fillStyle = n > 0.5 ? '#0c0a1a' : shade(p.c, 0.6);
    g.fillRect(px, py - 5, 2, 3);
    g.fillRect(px + (st2 ? 0 : 1), py - 2, 1, 2);
    g.fillRect(px + (st2 ? 1 : 0), py - 2, 1, 2);
    g.fillRect(px, py - 7, 2, 2);
    if (p.wave > 0) g.fillRect(px + 2, py - (Math.floor(T * 8) % 2 ? 10 : 8), 1, 3);
    if (p.u) {
      g.fillStyle = n > 0.5 ? shade(p.u, 0.5) : p.u;
      g.fillRect(px - 2, py - 10, 6, 2);
      g.fillRect(px - 1, py - 11, 4, 1);
      g.fillStyle = '#333';
      g.fillRect(px + 1, py - 8, 1, 1);
    }
  }
  const w = curWx();
  if (w === 'neve') {
    g.fillStyle = 'rgba(255,255,255,.9)';
    for (const d of drops) g.fillRect(Math.round(d.x), WY0 + Math.round(d.y), 1, 1);
  } else if (drops.length) {
    g.fillStyle = 'rgba(180,205,255,.45)';
    for (const d of drops) g.fillRect(Math.round(d.x), WY0 + Math.round(d.y), 1, 3);
  }
  if (w === 'nebbia') {
    g.fillStyle = 'rgba(210,214,224,.38)';
    g.fillRect(0, WY0, W, hh);
    g.fillStyle = 'rgba(210,214,224,.25)';
    g.fillRect(0, WY1 - 20, W, 20);
  }
  drawGlass(n);
  if (flash > 0) {
    g.fillStyle = `rgba(225,225,255,${flash * 0.65})`;
    g.fillRect(0, WY0, W, hh);
  }
  g.restore();
  for (const p of ps) {
    g.fillStyle = '#160c22';
    g.fillRect(p.x - 2, WY0 - 2, p.w + 4, 2);
    g.fillRect(p.x - 2, WY0, 2, hh);
    g.fillRect(p.x + p.w, WY0, 2, hh);
    g.fillStyle = shade(th.trim, 0.6);
    g.fillRect(p.x + p.w / 2 - 1, WY0, 1, hh);
    g.fillRect(p.x, WY0 + Math.round(hh * 0.42), p.w, 1);
    g.fillStyle = 'rgba(255,255,255,.06)';
    g.fillRect(p.x, WY0, p.w, 2);
    g.fillStyle = th.trim;
    g.fillRect(p.x - 4, WY1, p.w + 8, 3);
    g.fillStyle = shade(th.trim, 1.25);
    g.fillRect(p.x - 4, WY1, p.w + 8, 1);
    if (p.locked) {
      g.fillStyle = '#6b4a30';
      for (let i = 0; i < 4; i++) g.fillRect(p.x - 1, WY0 + 6 + i * 16, p.w + 2, 7);
      g.fillStyle = '#8a6440';
      for (let i = 0; i < 4; i++) g.fillRect(p.x - 1, WY0 + 6 + i * 16, p.w + 2, 1);
      g.fillStyle = '#c0c0c0';
      for (let i = 0; i < 4; i++) {
        g.fillRect(p.x + 3, WY0 + 9 + i * 16, 1, 1);
        g.fillRect(p.x + p.w - 4, WY0 + 9 + i * 16, 1, 1);
      }
    } else sill(p);
  }
}
function cloudCols(n, h) {
  const w = curWx(),
    wet = rainy() || w === 'nebbia';
  const set = (b, l, s) => ({ b, l, s });
  let c;
  if (h < 6.5 || h >= 21.5) c = set('#2a2452', '#4a4088', '#1c1838');
  else if (h < 9) c = set('#e8b8c8', '#fff0d8', '#a888b0');
  else if (h < 17) c = set('#e8eef8', '#ffffff', '#b8c4dc');
  else if (h < 20) c = set('#d87a8a', '#ffc070', '#7a4a7a');
  else c = set('#5a3a70', '#c0608a', '#2e2450');
  if (wet) {
    const k = n > 0.5 ? 0.55 : 0.65;
    c = {
      b: mixc(c.b, n > 0.5 ? '#22223a' : '#7a8094', k),
      l: mixc(c.l, n > 0.5 ? '#34345a' : '#a0a6b8', k),
      s: mixc(c.s, n > 0.5 ? '#16162a' : '#585e72', k)
    };
  }
  return c;
}
function pxDisc(x, y, r) {
  x = Math.round(x);
  y = Math.round(y);
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.round(Math.sqrt(r * r - dy * dy));
    if (w > 0) g.fillRect(x - w, y + dy, w * 2, 1);
  }
}
function drawClouds(n, h) {
  if (!clouds.length) return;
  const C = cloudCols(n, h),
    wet = rainy();
  g.globalAlpha = wet ? 0.92 : 0.85;
  for (const c of clouds) {
    if (!c.p) continue;
    const cx = c.x,
      cy = WY0 + c.y;
    g.fillStyle = C.s;
    for (const q of c.p) pxDisc(cx + q[0], cy + q[1] + 2, q[2]);
    g.fillStyle = C.b;
    for (const q of c.p) pxDisc(cx + q[0], cy + q[1], q[2]);
    g.fillStyle = C.l;
    for (const q of c.p) pxDisc(cx + q[0] - 1, cy + q[1] - Math.ceil(q[2] * 0.45), Math.max(1, Math.round(q[2] * 0.5)));
  }
  g.globalAlpha = 1;
}
function glowAt(x, y, r, col, a) {
  const rg = g.createRadialGradient(x, y, 0, x, y, r);
  rg.addColorStop(0, `rgba(${col},${a})`);
  rg.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = rg;
  g.fillRect(x - r, y - r, r * 2, r * 2);
}
let wallC = null,
  wallK = '';
function wallTex(th) {
  const k = st.theme + '|' + W;
  if (k === wallK) return wallC;
  wallK = k;
  wallC = document.createElement('canvas');
  wallC.width = W;
  wallC.height = 104;
  const x = wallC.getContext('2d'),
    R = srand(W * 31 + st.theme.length);
  x.fillStyle = th.wall;
  x.fillRect(0, 0, W, 104);
  x.fillStyle = th.str;
  for (let i = 2; i < W; i += 8) x.fillRect(i, 0, 1, 78);
  for (let i = 0; i < W * 3; i++) {
    const px = (R() * W) | 0,
      py = (R() * 78) | 0;
    x.fillStyle = R() < 0.5 ? shade(th.wall, 1.1) : shade(th.wall, 0.9);
    x.fillRect(px, py, 1 + (R() < 0.3 ? 1 : 0), 1);
  }
  const tg = x.createLinearGradient(0, 0, 0, 30);
  tg.addColorStop(0, 'rgba(5,2,12,.45)');
  tg.addColorStop(1, 'rgba(5,2,12,0)');
  x.fillStyle = tg;
  x.fillRect(0, 0, W, 30);
  x.fillStyle = th.wai;
  x.fillRect(0, 78, W, 26);
  x.fillStyle = th.trim;
  x.fillRect(0, 78, W, 2);
  x.fillStyle = shade(th.trim, 1.3);
  x.fillRect(0, 78, W, 1);
  x.fillStyle = shade(th.wai, 0.85);
  for (let i = 6; i < W; i += 14) {
    x.fillRect(i, 84, 10, 15);
    x.fillStyle = shade(th.wai, 1.12);
    x.fillRect(i, 84, 10, 1);
    x.fillStyle = shade(th.wai, 0.85);
  }
  x.fillStyle = shade(th.wai, 0.6);
  x.fillRect(0, 102, W, 2);
  return wallC;
}
function hangPlant(x, y0, sw) {
  g.fillStyle = '#120a1c';
  g.fillRect(x, y0, 1, 5);
  g.fillStyle = '#b8603a';
  g.fillRect(x - 3, y0 + 5, 7, 4);
  g.fillStyle = '#d8804a';
  g.fillRect(x - 3, y0 + 5, 7, 1);
  g.fillStyle = '#8a4428';
  g.fillRect(x - 2, y0 + 9, 5, 1);
  const L = ['#2f7a4a', '#3f9a5c', '#5cc07a'];
  [
    [-3, 7, 0],
    [-1, 13, 1],
    [1, 9, 2],
    [3, 15, 0],
    [0, 5, 1],
    [2, 4, 2]
  ].forEach(([dx, len, ci], i) => {
    for (let j = 0; j < len; j++) {
      const xx = x + dx + Math.round(Math.sin(j * 0.45 + T * 0.5 + i + sw) * 1.3);
      g.fillStyle = L[(ci + j) % 3];
      g.fillRect(xx, y0 + 7 + j, j % 3 === 1 ? 2 : 1, 1);
    }
  });
}
function drawRoom() {
  const th = TH();
  g.drawImage(wallTex(th), 0, 0);
  if (st.theme === 'retro') {
    g.fillStyle = '#ff6fb5';
    g.fillRect(0, 70, W, 2);
    g.fillStyle = '#4ff0ff';
    g.fillRect(0, 74, W, 1);
  }
  if (st.theme === 'natale') {
    for (let x = 0; x < W; x += 4) {
      const yy = 80 + Math.round(Math.sin(x * 0.25) * 1.5);
      g.fillStyle = '#2e7d45';
      g.fillRect(x, yy, 4, 2);
      if (x % 12 === 0) {
        g.fillStyle = ['#e63946', '#ffd166', '#4ff0ff'][((x / 12) | 0) % 3];
        g.fillRect(x + 1, yy + 2, 1, 1);
      }
    }
  }
  if (st.theme === 'sakura') {
    for (let x = 8; x < W; x += 90) {
      g.fillStyle = '#5a3a2a';
      g.fillRect(x, 8, 30, 1);
      g.fillRect(x + 10, 6, 12, 1);
      g.fillStyle = '#ff9fc8';
      [
        [2, 7],
        [6, 9],
        [12, 5],
        [17, 7],
        [24, 9],
        [28, 7],
        [20, 4]
      ].forEach(p => g.fillRect(x + p[0], p[1], 2, 2));
    }
  }
  // insegna
  const right = colX[0] + 22,
    sw = Math.min(170, right - (colX[cols - 1] - 22)),
    sx = Math.round(right - sw);
  signBox = { x: sx, y: 4, w: sw, h: 15 };
  g.fillStyle = '#160c22';
  g.fillRect(sx, 4, sw, 15);
  g.fillStyle = '#3d2760';
  g.fillRect(sx, 4, sw, 1);
  g.fillRect(sx, 18, sw, 1);
  g.fillRect(sx + 6, 0, 1, 4);
  g.fillRect(sx + sw - 7, 0, 1, 4);
  drawWindow();
  if (st.decor >= 1)
    panes().forEach((p, k) => {
      if (!p.locked && k % 2 === (st.decor >= 4 ? k % 2 : 1)) hangPlant(k % 2 ? p.x + 6 : p.x + p.w - 7, WY0, k);
    });
  // quadri tra le finestre
  if (st.decor >= 5)
    for (let k = 0; k < cols - 1; k++) {
      const x = colX[k] - 26 - 3;
      g.fillStyle = '#d9b441';
      g.fillRect(x - 2, 34, 6, 8);
      g.fillStyle = ['#4ff0ff', '#ff4fa3', '#7bd389', '#ffd166'][k % 4];
      g.fillRect(x - 1, 35, 4, 6);
    }
  if (st.perks.valigie) {
    const x = colX[Math.min(cols - 1, 1)] - 26 - 3;
    g.fillStyle = '#f4f1de';
    g.fillRect(x - 2, 50, 6, 4);
    g.fillStyle = '#e63946';
    g.fillRect(x + 1, 51, 2, 2);
  }
  // scaffali e cucina dietro al bancone
  g.fillStyle = shade(th.wall, 0.8);
  g.fillRect(counterX + 2, 24, W - counterX - 8, 72);
  if (st.cook) {
    const hx = counterX + 6;
    g.fillStyle = '#1a1018';
    g.fillRect(hx, 30, 28, 22);
    g.fillStyle = '#ffb36b';
    g.globalAlpha = 0.25;
    g.fillRect(hx, 30, 28, 22);
    g.globalAlpha = 1;
    const cx = hx + 8 + Math.round(Math.sin(T * 0.8) * 6);
    g.fillStyle = '#f4f1de';
    g.fillRect(cx - 2, 38, 6, 8);
    g.fillRect(cx - 1, 33, 4, 3);
    g.fillRect(cx - 2, 35, 6, 1);
    g.fillStyle = '#eab88f';
    g.fillRect(cx - 2, 36, 5, 4);
    g.fillStyle = DK;
    g.fillRect(cx + 1, 37, 1, 1);
    g.fillStyle = '#555';
    g.fillRect(hx + 2, 48, 24, 4);
    for (let i = 0; i < 3; i++) {
      g.fillStyle = Math.random() < 0.5 ? '#ff6b2b' : '#ffd166';
      g.fillRect(hx + 5 + i * 8, 47 - ri(0, 1), 3, 1);
    }
    g.fillStyle = th.trim;
    g.fillRect(hx - 1, 52, 30, 2);
  }
  const shX = st.cook ? counterX + 38 : counterX + 6;
  g.fillStyle = shade(th.trim, 0.8);
  g.fillRect(shX, 38, W - shX - 8, 2);
  g.fillRect(shX, 60, W - shX - 8, 2);
  for (let x = shX + 3, i = 0; x < W - 10; x += 5, i++) {
    g.fillStyle = i % 3 === 2 ? '#c98f5e' : '#f4f1de';
    g.fillRect(x, 35, 3, 3);
    g.fillStyle = ['#7bd389', '#ffd166', '#c77dff', '#ef476f'][i % 4];
    g.fillRect(x, 55, 3, 5);
  }
  if (st.decor >= 4) {
    const bc = ['#ef476f', '#118ab2', '#ffd166', '#06d6a0', '#8e7dff', '#e76f51'];
    for (let x = shX + 2, i = 0; x < W - 10; x += 2, i++) {
      g.fillStyle = bc[(i * 7) % 6];
      g.fillRect(x, 63 + (i % 3 === 0 ? 1 : 0), 1, 7 - (i % 3 === 0 ? 1 : 0));
    }
    g.fillStyle = shade(th.trim, 0.8);
    g.fillRect(shX, 70, W - shX - 8, 2);
  }
  if (st.decor >= 5 || st.theme === 'neon') {
    g.fillStyle = blackout() ? '#553040' : th.acc;
    const cx = W - 30;
    [
      [0, 0, 9, 1],
      [0, 0, 1, 7],
      [8, 0, 1, 7],
      [1, 7, 7, 1],
      [9, 2, 2, 1],
      [11, 2, 1, 3],
      [9, 5, 2, 1],
      [2, -4, 1, 2],
      [5, -5, 1, 3]
    ].forEach(r => g.fillRect(cx + r[0], 12 + r[1], r[2], r[3]));
  }
  // pavimento
  const f1 = th.f1,
    f2 = th.f2;
  g.fillStyle = f1;
  g.fillRect(0, 104, W, 76);
  if (th.ft === 'p') {
    for (let y = 104, i = 0; y < 180; y += 7, i++) {
      g.fillStyle = f2;
      g.fillRect(0, y, W, 1);
      for (let x = (i % 2) * 17; x < W; x += 34) g.fillRect(x, y, 1, 7);
    }
  } else if (th.ft === 'c') {
    g.fillStyle = f2;
    for (let y = 104, i = 0; y < 180; y += 6, i++) for (let x = (i % 2) * 6; x < W; x += 12) g.fillRect(x, y, 6, 6);
  } else {
    g.fillStyle = f2;
    for (let y = 104; y < 180; y += 12) {
      g.fillRect(0, y, W, 1);
      for (let x = (((y / 12) | 0) % 2) * 24; x < W; x += 48) g.fillRect(x, y, 1, 12);
    }
  }
  const lg = g.createLinearGradient(0, 104, 0, 170);
  lg.addColorStop(0, `rgba(${nightF() > 0.5 ? '130,90,255' : '255,250,230'},.12)`);
  lg.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = lg;
  g.fillRect(colX[cols - 1] - 22, 104, colX[0] - colX[cols - 1] + 44, 70);
  floorShine();
  if (st.decor >= 3) {
    const rx = colX[st.space - 1] - 26,
      rw = colX[0] + 20 - rx;
    g.fillStyle = '#5a2448';
    g.fillRect(rx, 110, rw, 52);
    g.fillStyle = '#8a3a62';
    g.fillRect(rx, 110, rw, 1);
    g.fillRect(rx, 161, rw, 1);
    g.fillRect(rx + 2, 112, rw - 4, 1);
    g.fillRect(rx + 2, 159, rw - 4, 1);
    g.fillStyle = '#d9a441';
    for (let x = rx + 6; x < rx + rw - 4; x += 8) g.fillRect(x, 139, 2, 1);
  }
  if (rainy()) {
    g.fillStyle = 'rgba(150,180,230,.15)';
    g.fillRect(4, 136, 24, 4);
    g.fillRect(28, 138, 10, 2);
  }
  // porta
  g.fillStyle = '#160c22';
  g.fillRect(3, 44, 30, 61);
  g.fillStyle = mixc('#8ab0e0', '#141238', nightF());
  g.fillRect(5, 46, 26, 58);
  if (drops.length) {
    g.fillStyle = curWx() === 'neve' ? '#fff' : 'rgba(170,200,255,.5)';
    for (let i = 0; i < 8; i++) {
      const ry = 46 + ((T * (curWx() === 'neve' ? 12 : 110) + i * 23) % 56);
      g.fillRect(6 + ((i * 7) % 24), Math.round(ry), 1, curWx() === 'neve' ? 1 : 3);
    }
  }
  const pw = Math.max(5, Math.round(26 * (1 - doorOpen * 0.78)));
  g.fillStyle = th.trim;
  g.fillRect(5, 46, pw, 58);
  if (pw > 9) {
    g.fillStyle = mixc('#9cc4f0', '#24306a', nightF());
    g.fillRect(8, 50, pw - 6, 28);
    g.fillStyle = 'rgba(255,255,255,.3)';
    g.fillRect(9, 51, 1, 6);
  }
  g.fillStyle = '#e8c49a';
  g.fillRect(5 + pw - 4, 80, 1, 2);
  if (rainy() || st.decor >= 1) {
    g.fillStyle = '#2a2a33';
    g.fillRect(34, 124, 4, 10);
    g.fillStyle = '#e63946';
    g.fillRect(34, 118, 1, 7);
    g.fillStyle = '#3a86ff';
    g.fillRect(36, 117, 1, 8);
    if (umbT > 0) {
      const sp = Math.round(Math.sin(umbT * 9));
      g.fillStyle = '#e63946';
      g.fillRect(30 + sp, 108, 13, 2);
      g.fillRect(32 + sp, 106, 9, 2);
      g.fillRect(35 + sp, 105, 3, 1);
      g.fillStyle = '#ffd166';
      g.fillRect(36 + sp, 104, 1, 1);
      g.fillStyle = '#2a2a33';
      g.fillRect(36, 110, 1, 8);
    }
  }
  // angolo
  drawCorner();
  // lampade
  for (let k = 0; k < st.space; k++) {
    const x = colX[k] + (lampSw[k] ? Math.round(Math.sin(T * 7) * lampSw[k] * 2.5) : 0);
    g.fillStyle = '#120a1c';
    g.fillRect(x, 0, 1, 26);
    if (blackout()) {
      continue;
    }
    if (st.theme === 'sakura') {
      g.fillStyle = '#fff2dc';
      g.fillRect(x - 3, 26, 7, 6);
      g.fillStyle = '#e8c8a8';
      g.fillRect(x - 3, 28, 7, 1);
    } else if (st.theme === 'retro') {
      g.fillStyle = '#4ff0ff';
      g.fillRect(x - 5, 26, 11, 1);
      g.fillStyle = '#ff6fb5';
      g.fillRect(x - 4, 28, 9, 1);
    } else {
      g.fillStyle = shade(th.lamp, 0.7);
      g.fillRect(x - 1, 25, 3, 1);
      g.fillStyle = th.lamp;
      g.fillRect(x - 2, 26, 5, 1);
      g.fillRect(x - 3, 27, 7, 1);
      g.fillRect(x - 4, 28, 9, 2);
      g.fillStyle = shade(th.lamp, 1.25);
      g.fillRect(x - 2, 26, 1, 1);
      g.fillRect(x - 3, 28, 1, 1);
      g.fillStyle = shade(th.lamp, 0.6);
      g.fillRect(x - 4, 30, 9, 1);
      g.fillStyle = '#fff6d0';
      g.fillRect(x - 1, 31, 3, 1);
    }
  }
  if (st.decor >= 6 && !blackout())
    for (let k = 0; k < st.space - 1; k++) {
      const x = Math.round((colX[k] + colX[k + 1]) / 2);
      g.fillStyle = '#120a1c';
      g.fillRect(x, 0, 1, 12);
      g.fillStyle = '#e8553f';
      g.fillRect(x - 2, 12, 5, 6);
      g.fillStyle = '#ff8a5c';
      g.fillRect(x - 1, 13, 3, 4);
    }
  if (st.decor >= 2 && !blackout())
    for (let x = 3; x < W; x += 7) {
      const y = 21 + Math.round(2 * Math.sin(x * 0.35));
      const on = (Math.floor(T * 2) + x) % 3 !== 0;
      g.fillStyle = on ? ['#ff4fa3', '#4ff0ff', '#ffd166', '#7bd389'][((x / 7) | 0) % 4] : '#3a2a4a';
      g.fillRect(x, y, 1, 1);
    }
}
function floorShine() {
  const n = nightF(),
    bo = blackout(),
    [, bot] = skyCols();
  // il pavimento lucido riflette finestre, lampade e insegne
  for (const p of panes()) {
    if (p.locked) continue;
    const c = rgb(mixc(bot, '#ffffff', 0.2)).join(',');
    for (let y = 106; y < 126; y += 2) {
      const a = (0.13 - (y - 106) * 0.006) * (rainy() ? 1.2 : 1);
      if (a <= 0) break;
      g.fillStyle = `rgba(${c},${a})`;
      g.fillRect(p.x + 2 + ((y >> 1) % 2), y, p.w - 4, 1);
    }
  }
  if (!bo) {
    const lc = st.theme === 'retro' ? '120,240,255' : '255,200,130';
    for (let k = 0; k < st.space; k++) {
      const x = colX[k];
      for (let y = 108; y < 170; y += 2) {
        const a = (0.05 + 0.09 * n) * (1 - (y - 108) / 62);
        g.fillStyle = `rgba(${lc},${a})`;
        g.fillRect(x - 1 + (((y >> 1) + k) % 3 === 0 ? 1 : 0), y, 2, 1);
      }
    }
  }
  if (n > 0.3 && !bo && (st.decor >= 5 || st.theme === 'neon')) {
    const c = rgb(TH().acc).join(',');
    for (let y = 106; y < 120; y += 2) {
      g.fillStyle = `rgba(${c},${0.12 * n * (1 - (y - 106) / 14)})`;
      g.fillRect(W - 31, y, 12, 1);
    }
  }
}
function drawCorner() {
  CB = {};
  const x0 = angX,
    w = angW;
  if (w < 10) return;
  let cx = x0 + 2;
  if (w > 40) {
    const bx = x0 + Math.round(w / 2) - 12;
    CB.chalk = { x: bx - 1, y: 33, w: 26, h: 22 };
    g.fillStyle = '#6a4a30';
    g.fillRect(bx - 1, 33, 26, 22);
    g.fillStyle = '#1e2a24';
    g.fillRect(bx, 34, 24, 20);
    if (!st.chalk) {
      g.fillStyle = '#e8e4dc';
      g.fillRect(bx + 3, 37, 10, 1);
      g.fillStyle = '#cfc8bc';
      for (let i = 0; i < Math.min(5, st.menu); i++) {
        g.fillRect(bx + 3, 40 + i * 3, 8 + ((i * 3) % 6), 1);
        g.fillRect(bx + 18, 40 + i * 3, 3, 1);
      }
    }
    g.fillStyle = '#ff9fc8';
    g.fillRect(bx + 19, 36, 2, 2);
    const rx = x0 + w - 8;
    g.fillStyle = '#4a2c22';
    g.fillRect(rx, 104, 1, 30);
    g.fillRect(rx - 3, 133, 7, 1);
    g.fillRect(rx - 3, 105, 7, 1);
    g.fillStyle = rainy() ? '#3a86ff' : '#c0704a';
    g.fillRect(rx - 3, 106, 2, 8);
    g.fillStyle = '#e63946';
    g.fillRect(rx + 2, 106, 2, 6);
  }
  if (st.music) {
    CB.rec = { x: cx - 1, y: 105, w: 14, h: 18 };
    g.fillStyle = '#5a3446';
    g.fillRect(cx, 112, 12, 10);
    g.fillStyle = '#3a2233';
    g.fillRect(cx + 1, 114, 10, 6);
    g.fillStyle = '#111';
    g.fillRect(cx + 1, 110, 9, 2);
    g.fillStyle = blackout() ? '#333' : Math.floor(T * 6) % 2 ? '#ff4fa3' : '#4ff0ff';
    g.fillRect(cx + 5, 110, 1, 1);
    g.fillStyle = '#cfcfd8';
    g.fillRect(cx + 10, 107, 1, 4);
    cx += 15;
  }
  if (st.decor >= 7 && cx + 14 < x0 + w) {
    CB.juke = { x: cx, y: 103, w: 13, h: 21 };
    g.fillStyle = '#3a2b55';
    g.fillRect(cx, 104, 13, 20);
    g.fillStyle = blackout() ? '#442233' : ['#ff4fa3', '#ffd166', '#4ff0ff'][Math.floor(T * 2) % 3];
    g.fillRect(cx + 1, 105, 11, 3);
    g.fillStyle = '#1b1020';
    g.fillRect(cx + 2, 109, 9, 6);
    g.fillStyle = '#ffd166';
    g.fillRect(cx + 3, 117, 7, 1);
    cx += 16;
  }
  if (st.decor >= 8 && cx + 16 < x0 + w) {
    CB.fish = { x: cx, y: 103, w: 16, h: 21 };
    g.fillStyle = '#4a2c22';
    g.fillRect(cx, 116, 16, 8);
    g.fillStyle = '#2a6ab0';
    g.fillRect(cx, 104, 16, 12);
    g.fillStyle = '#4aa0e0';
    g.fillRect(cx, 105, 16, 1);
    g.fillStyle = '#3f9a5c';
    g.fillRect(cx + 2, 110, 1, 6);
    g.fillRect(cx + 12, 111, 1, 5);
    const fx = cx + 3 + Math.round((Math.sin(T * (fishFeed > 0 ? 2.5 : 0.7)) + 1) * 4.5),
      fy = fishFeed > 0 ? 106 : 109;
    g.fillStyle = '#ff9f43';
    g.fillRect(fx, fy, 3, 2);
    g.fillRect(fx + (Math.cos(T * 0.7) > 0 ? -1 : 3), fy, 1, 1);
    if (Math.random() < 0.05) parts.push({ x: cx + rnd(2, 14), y: 114, vx: 0, vy: -6, t: 1.2, max: 1.2, k: 'bubble' });
    cx += 19;
  }
  if (st.decor >= 1 && cx + 6 < x0 + w) {
    const px = cx + 3,
      y = 122;
    CB.plant = { x: px - 4, y: 104, w: 9, h: 19 };
    g.fillStyle = '#c0704a';
    g.fillRect(px - 2, y - 5, 6, 5);
    g.fillStyle = '#3f9a5c';
    [
      [0, -14, 1, 9],
      [-2, -11, 1, 6],
      [2, -12, 1, 7],
      [-3, -8, 2, 1],
      [3, -9, 2, 1],
      [1, -16, 1, 3]
    ].forEach(r => g.fillRect(px + r[0], y + r[1], r[2], r[3]));
    if (st.flower) {
      g.fillStyle = '#ff6fa0';
      g.fillRect(px, y - 18, 3, 2);
      g.fillRect(px + 1, y - 19, 1, 1);
      g.fillStyle = '#ffd166';
      g.fillRect(px + 1, y - 18, 1, 1);
    }
    cx += 10;
  }
  if (st.theme === 'natale' && cx + 14 < x0 + w) {
    const tx = cx + 7;
    for (let i = 0; i < 16; i++) {
      const ww = Math.round((16 - i) / 2.2);
      g.fillStyle = '#2e7d45';
      g.fillRect(tx - ww, 122 - i, ww * 2 + 1, 1);
    }
    g.fillStyle = '#ffd166';
    g.fillRect(tx, 104, 1, 2);
    for (let i = 0; i < 5; i++) {
      g.fillStyle = ['#e63946', '#4ff0ff', '#ffd166'][(i + Math.floor(T * 2)) % 3];
      g.fillRect(tx - 5 + i * 2 + (i % 2), 112 + i * 2 - (i % 3), 1, 1);
    }
  }
}
function drawChair(se) {
  const x = se.x,
    y = se.y,
    lv = Math.min(6, st.chairs);
  const col = ['#6b4630', '#7a4a3a', '#b8405a', '#3f8f6b', '#6a4fb0', '#d08a3a', '#9a1b4a'][lv];
  g.fillStyle = 'rgba(0,0,0,.3)';
  g.fillRect(x - 4, y, 9, 1);
  g.fillStyle = '#4a2c22';
  g.fillRect(x - 3, y - 5, 1, 5);
  g.fillRect(x + 3, y - 5, 1, 5);
  g.fillStyle = col;
  g.fillRect(x - 4, y - 7, 9, 2);
  const bh = lv >= 3 ? 11 : 9;
  g.fillRect(se.side < 0 ? x - 4 : x + 3, y - 7 - bh, 2, bh);
  if (lv >= 3) {
    g.fillRect(x - 5, y - 9, 1, 3);
    g.fillRect(x + 5, y - 9, 1, 3);
  }
  if (lv >= 1) {
    g.fillStyle = shade(col, 1.3);
    g.fillRect(x - 4, y - 7, 9, 1);
    g.fillRect(se.side < 0 ? x - 4 : x + 3, y - 7 - bh, 2, 1);
  }
}
function drawItem(id, x, y) {
  const it = MENU.find(m => m.id === id);
  const i = it ? it.i : 'cup';
  const R = (c, a) => {
      g.fillStyle = c;
      a.forEach(r => g.fillRect(x + r[0], y + r[1], r[2] || 1, r[3] || 1));
    },
    plate = () =>
      R('#fffaf2', [
        [-3, 0, 7],
        [-2, 1, 5]
      ]),
    plS = () => R('#d8c8e0', [[-2, 1, 5]]);
  switch (i) {
    case 'cup':
      plate();
      plS();
      R('#fffaf2', [
        [-2, -3, 5, 3],
        [3, -2, 1, 1]
      ]);
      R('#ff9fc8', [[-2, -3, 5]]);
      R('#7a4a2a', [[-1, -3, 3]]);
      R('#fff3e0', [[0, -3]]);
      break;
    case 'teacup':
      plate();
      plS();
      R('#fffaf2', [
        [-2, -3, 5, 3],
        [3, -2, 1, 1]
      ]);
      R('#7bd389', [[-1, -3, 3]]);
      R('#5cc07a', [[-2, -2, 5]]);
      R('#fffaf2', [[-2, -2, 5]]);
      R('#ff9fc8', [
        [-1, -1, 1],
        [1, -1, 1]
      ]);
      break;
    case 'glass':
      R('rgba(210,235,255,.85)', [[-1, -5, 4, 6]]);
      R('#d9b48a', [[-1, -3, 4, 3]]);
      R('#f4f1de', [[-1, -4, 4, 1]]);
      R('#ffffff', [[2, -5, 1, 2]]);
      R('#ff4fa3', [[1, -7, 1, 3]]);
      break;
    case 'mug':
      R('#ff6f9f', [
        [-2, -3, 4, 4],
        [2, -2, 1, 2]
      ]);
      R('#fffaf2', [[-2, -4, 4, 1]]);
      R('#ffd1e3', [[-1, -1, 1, 1]]);
      R('#ffffff', [
        [-1, -5, 1, 1],
        [1, -6, 1, 1]
      ]);
      break;
    case 'croissant':
      plate();
      R('#e0a040', [
        [-2, -1, 5],
        [-3, 0, 1],
        [3, 0, 1]
      ]);
      R('#f0c060', [[-1, -2, 3]]);
      R('#b87020', [
        [-1, -1, 1],
        [1, -1, 1]
      ]);
      break;
    case 'cake':
      plate();
      R('#fff3d0', [[-2, -2, 4, 2]]);
      R('#ffd166', [[-2, -1, 4]]);
      R('#ff6fa0', [[-2, -3, 4]]);
      R('#e63946', [[0, -4]]);
      break;
    case 'toast':
      plate();
      R('#d9a441', [[-2, -3, 5, 3]]);
      R('#f0c870', [[-1, -2, 3, 1]]);
      R('#7bd389', [[-1, -3, 2]]);
      R('#ff6f6f', [[1, -3, 1]]);
      break;
    case 'smoothie':
      R('rgba(220,230,255,.85)', [[-1, -5, 4, 6]]);
      R('#ff6fa0', [[-1, -4, 4, 5]]);
      R('#ffb0d0', [[-1, -4, 4, 1]]);
      R('#ffffff', [[1, -7, 1, 3]]);
      R('#7bd389', [[-1, -5, 1]]);
      break;
    case 'pancake':
      plate();
      R('#e0a858', [[-2, -3, 5, 3]]);
      R('#8a4a20', [
        [-2, -3, 5],
        [-2, -1, 5]
      ]);
      R('#fff3d0', [[-1, -4, 3]]);
      R('#ffd166', [[0, -4]]);
      break;
    case 'bubble':
      R('#f0d8b8', [[-1, -5, 4, 6]]);
      R('#3a2020', [
        [-1, 0],
        [1, -1],
        [2, 0],
        [0, -1]
      ]);
      R('#fffaf2', [[-1, -5, 4, 1]]);
      R('#ff4fa3', [[1, -8, 1, 4]]);
      break;
    case 'tira':
      plate();
      R('#f4e8d0', [[-2, -3, 4, 3]]);
      R('#6a4028', [
        [-2, -3, 4],
        [-2, -1, 4]
      ]);
      R('#3a2018', [
        [-1, -3],
        [1, -3]
      ]);
      break;
    case 'bowl':
      R('#e63946', [
        [-3, -2, 7, 2],
        [-2, 0, 5, 1]
      ]);
      R('#ffffff', [[-2, -1, 1]]);
      R('#f4e0a0', [[-2, -3, 5]]);
      R('#f4f1de', [[0, -3]]);
      R('#7bd389', [[-1, -3]]);
      R('#ffb0a0', [[2, -3]]);
      R('#d9b98a', [
        [2, -6, 1, 3],
        [3, -6, 1, 3]
      ]);
      if (Math.random() < 0.05) parts.push({ x, y: y - 5, vx: rnd(-1, 1), vy: -5, t: 1, max: 1, k: 'steam' });
      break;
    case 'affo':
      R('rgba(220,230,255,.85)', [[-1, -4, 4, 5]]);
      R('#fffaf2', [[-1, -4, 4, 2]]);
      R('#5a3020', [[-1, -2, 4, 2]]);
      R('#e63946', [[1, -5]]);
      break;
  }
}
function drawTable(sl) {
  const th = TH(),
    x = sl.x,
    y = sl.y;
  g.fillStyle = 'rgba(0,0,0,.35)';
  g.fillRect(x - 7, y, 15, 1);
  g.fillStyle = shade(th.wd, 0.7);
  g.fillRect(x - 1, y - 9, 2, 9);
  g.fillRect(x - 5, y - 1, 10, 1);
  g.fillStyle = th.wd;
  g.fillRect(x - 10, y - 11, 20, 2);
  g.fillStyle = th.wt;
  g.fillRect(x - 10, y - 11, 20, 1);
  if (st.perks.scacchi && sl === slots[0]) {
    for (let i = 0; i < 4; i++) {
      g.fillStyle = i % 2 ? '#f4f1de' : '#1b1420';
      g.fillRect(x - 4 + i * 2, y - 12, 2, 1);
    }
  }
  if (blackout()) {
    g.fillStyle = '#f4f1de';
    g.fillRect(x, y - 14, 1, 3);
    g.fillStyle = Math.random() < 0.5 ? '#ffd166' : '#ff9f43';
    g.fillRect(x, y - 15, 1, 1);
  }
  let dirty = false;
  sl.seats.forEach(s => {
    const cx = x + s.side * 6;
    if (s.occ && s.occ.state === 'sit') {
      const c = s.occ;
      if (c.act === 'laptop' && !c.sleep) {
        g.fillStyle = '#8a8fa8';
        g.fillRect(cx - 3, y - 12, 6, 1);
        g.fillStyle = '#3d405b';
        g.fillRect(s.side < 0 ? cx + 1 : cx - 3, y - 16, 1, 4);
        g.fillStyle = '#9ff';
        g.globalAlpha = 0.6 + 0.3 * nightF();
        g.fillRect(s.side < 0 ? cx + 1 : cx - 3, y - 15, 1, 2);
        g.globalAlpha = 1;
      } else if (c.order) drawItem(c.order.id, cx, y - 12);
    } else if (s.dirty) {
      dirty = true;
      g.fillStyle = '#9a8a9a';
      g.fillRect(cx - 1, y - 12, 3, 1);
      g.fillStyle = '#d9a441';
      g.fillRect(cx + 2, y - 12, 1, 1);
      g.fillRect(cx - 3, y - 12, 1, 1);
    }
  });
  if (dirty && Math.floor(T * 3) % 2) {
    g.fillStyle = '#ffd166';
    g.fillRect(x, y - 28, 1, 3);
    g.fillRect(x, y - 24, 1, 1);
  }
}
function drawLocked(sl) {
  const x = sl.x,
    y = sl.y;
  g.fillStyle = '#8a6a4a';
  g.fillRect(x - 12, y - 10, 10, 10);
  g.fillRect(x + 1, y - 8, 11, 8);
  g.fillStyle = '#a8845e';
  g.fillRect(x - 6, y - 18, 9, 8);
  g.fillStyle = '#d9b98a';
  g.fillRect(x - 12, y - 6, 10, 1);
  g.fillRect(x + 1, y - 5, 11, 1);
  g.fillRect(x - 6, y - 15, 9, 1);
  if (sl.row === 0) {
    g.fillStyle = '#ffd166';
    g.fillRect(x - 8, y - 30, 17, 7);
    g.fillStyle = '#1b1420';
    g.fillRect(x - 7, y - 29, 15, 5);
    g.fillStyle = '#ffd166';
    for (let i = 0; i < 3; i++) g.fillRect(x - 5 + i * 5, y - 28, 3, 3);
  }
}
function drawEmpty(sl) {
  const x = sl.x,
    y = sl.y,
    a = 0.35 + 0.25 * Math.sin(T * 3);
  g.globalAlpha = a;
  g.fillStyle = '#ffd1ea';
  for (let i = -11; i <= 11; i += 3) {
    g.fillRect(x + i, y - 15, 1, 1);
    g.fillRect(x + i, y + 1, 1, 1);
  }
  for (let j = -15; j <= 1; j += 3) {
    g.fillRect(x - 12, y + j, 1, 1);
    g.fillRect(x + 12, y + j, 1, 1);
  }
  g.fillRect(x - 2, y - 7, 5, 1);
  g.fillRect(x, y - 9, 1, 5);
  g.globalAlpha = 1;
}
function drawCounter() {
  const th = TH(),
    x = counterX,
    w = W - 4 - x;
  g.fillStyle = th.cn;
  g.fillRect(x, 100, w, 40);
  g.fillStyle = shade(th.cn, 0.85);
  for (let i = x + 4; i < x + w - 4; i += 12) g.fillRect(i, 104, 9, 32);
  g.fillStyle = shade(th.cn, 0.5);
  g.fillRect(x, 139, w, 1);
  g.fillStyle = th.ct;
  g.fillRect(x - 2, 97, w + 4, 3);
  g.fillStyle = shade(th.ct, 1.15);
  g.fillRect(x - 2, 97, w + 4, 1);
  g.fillStyle = '#3d405b';
  g.fillRect(x + 4, 89, 10, 8);
  g.fillStyle = '#4ff0ff';
  g.fillRect(x + 6, 90, 6, 2);
  g.fillStyle = '#2b2d42';
  g.fillRect(x + 5, 94, 8, 1);
  if (MENU.slice(0, st.menu).some(m => m.s === 'v')) {
    g.fillStyle = '#f4f1de';
    g.fillRect(x + 16, 95, 12, 1);
    g.fillStyle = '#e0a040';
    g.fillRect(x + 17, 93, 3, 2);
    g.fillStyle = '#ff9fc8';
    g.fillRect(x + 21, 92, 3, 3);
    g.fillStyle = '#6a4028';
    g.fillRect(x + 25, 93, 2, 2);
    g.fillStyle = 'rgba(200,230,255,.3)';
    g.fillRect(x + 16, 87, 12, 8);
    g.fillStyle = 'rgba(255,255,255,.5)';
    g.fillRect(x + 17, 88, 1, 3);
  }
  if (st.perks.libro) {
    g.fillStyle = '#3d6b4f';
    g.fillRect(x + 30, 94, 5, 3);
    g.fillStyle = '#f4f1de';
    g.fillRect(x + 30, 96, 5, 1);
  }
  if (st.cat && catRoll > 0) {
    const cx = x + 33,
      cy = 96,
      wg = Math.floor(T * 6) % 2;
    g.fillStyle = '#2a2238';
    g.fillRect(cx, cy - 3, 8, 3);
    g.fillRect(cx + 6, cy - 4, 3, 3);
    g.fillStyle = '#4a3e5c';
    g.fillRect(cx + 1, cy - 3, 5, 1);
    g.fillStyle = '#2a2238';
    g.fillRect(cx + 1, cy - 5 - wg, 1, 2);
    g.fillRect(cx + 4, cy - 4 - (1 - wg), 1, 2);
    g.fillRect(cx - 2, cy - 2, 2, 1);
    g.fillStyle = '#ffd166';
    g.fillRect(cx + 7, cy - 3, 1, 1);
  } else if (st.cat && catHissT > 0) {
    const cx = x + 33,
      cy = 96;
    g.fillStyle = '#2a2238';
    g.fillRect(cx, cy - 5, 8, 2);
    g.fillRect(cx + 1, cy - 6, 6, 1);
    g.fillRect(cx, cy - 3, 1, 3);
    g.fillRect(cx + 7, cy - 3, 1, 3);
    g.fillRect(cx - 2, cy - 8, 4, 4);
    g.fillRect(cx - 2, cy - 9, 1, 1);
    g.fillRect(cx + 1, cy - 9, 1, 1);
    g.fillRect(cx + 8, cy - 8, 1, 4);
    g.fillRect(cx + 9, cy - 9, 1, 2);
    g.fillStyle = '#ffd166';
    g.fillRect(cx - 2, cy - 7, 1, 1);
    g.fillRect(cx, cy - 7, 1, 1);
    g.fillStyle = '#ff8fab';
    g.fillRect(cx - 1, cy - 5, 1, 1);
    drawEmote(cx - 3, cy - 20, 'angry');
  } else if (st.cat) {
    const cx = x + 33,
      cy = 96,
      tw = Math.round(Math.sin(T * 2));
    g.fillStyle = '#2a2238';
    g.fillRect(cx, cy - 3, 8, 3);
    g.fillRect(cx + 6, cy - 5, 3, 3);
    g.fillRect(cx + 6, cy - 6, 1, 1);
    g.fillRect(cx + 8, cy - 6, 1, 1);
    g.fillRect(cx - 2, cy - 2 + tw, 2, 1);
    g.fillStyle = '#ffd166';
    g.fillRect(cx + 8, cy - 4, 1, 1);
  }
  if (MENU.slice(0, st.menu).some(m => m.s === 'b')) {
    g.fillStyle = '#c0c0d0';
    g.fillRect(x + 45, 91, 5, 6);
    g.fillRect(x + 44, 92, 1, 3);
    g.fillStyle = '#222';
    g.fillRect(x + 46, 90, 3, 1);
  }
  const mx = W - 27;
  g.fillStyle = '#8a8fa8';
  g.fillRect(mx, 84, 15, 13);
  g.fillStyle = '#5a5f78';
  g.fillRect(mx, 84, 15, 2);
  g.fillStyle = '#2a2d3a';
  g.fillRect(mx + 3, 90, 9, 4);
  g.fillStyle = '#cfd3e6';
  g.fillRect(mx + 7, 94, 1, 1);
  g.fillStyle = Math.floor(T * 2) % 2 ? '#ff4fa3' : '#7a2a55';
  g.fillRect(mx + 12, 87, 1, 1);
  if (st.machine >= 5) {
    g.fillStyle = '#d9b441';
    g.fillRect(mx, 84, 15, 1);
    g.fillRect(mx, 96, 15, 1);
  }
  if (queue[0] && queue[0].state === 'order') {
    g.fillStyle = '#f4f1de';
    g.fillRect(mx + 6, 95, 3, 2);
    if (Math.random() < 0.3) parts.push({ x: mx + 7, y: 92, vx: rnd(-2, 2), vy: -8, t: 0.9, max: 0.9, k: 'steam' });
  }
}
function drawParts() {
  for (const p of parts) {
    const a = p.t / p.max,
      x = Math.round(p.x),
      y = Math.round(p.y);
    if (p.k === 'steam') {
      g.fillStyle = `rgba(230,230,245,${a * 0.45})`;
      g.fillRect(x, y, 1, 1);
    } else if (p.k === 'spark') {
      g.fillStyle = `rgba(255,230,140,${a})`;
      g.fillRect(x, y, 1, 1);
      if (a > 0.5) {
        g.fillRect(x - 1, y, 3, 1);
        g.fillRect(x, y - 1, 1, 3);
      }
    } else if (p.k === 'note') {
      g.fillStyle = `rgba(79,240,255,${a})`;
      g.fillRect(x, y, 2, 1);
      g.fillRect(x + 1, y - 3, 1, 3);
    } else if (p.k === 'heart') {
      g.fillStyle = `rgba(255,79,163,${a})`;
      g.fillRect(x, y, 1, 1);
      g.fillRect(x + 2, y, 1, 1);
      g.fillRect(x, y + 1, 3, 1);
      g.fillRect(x + 1, y + 2, 1, 1);
    } else if (p.k === 'bubble') {
      g.fillStyle = `rgba(200,240,255,${a})`;
      g.fillRect(x, y, 1, 1);
    } else if (p.k === 'mote') {
      g.fillStyle = `rgba(255,230,180,${Math.min(a, 1 - a) * 0.7})`;
      g.fillRect(x, y, 1, 1);
    } else if (p.k === 'drop') {
      g.fillStyle = `rgba(110,200,255,${a})`;
      g.fillRect(x, y, 1, 2);
    } else if (p.k === 'food') {
      g.fillStyle = `rgba(217,164,65,${a})`;
      g.fillRect(x, y, 1, 1);
    } else if (p.k === 'z') {
      g.fillStyle = `rgba(255,255,255,${a * 0.8})`;
      g.fillRect(x, y, 3, 1);
      g.fillRect(x + 1, y + 1, 1, 1);
      g.fillRect(x, y + 2, 3, 1);
    }
  }
}
function lightCone(x, y, lc, a) {
  const gr = g.createLinearGradient(0, y, 0, 158);
  gr.addColorStop(0, `rgba(${lc},${a})`);
  gr.addColorStop(0.7, `rgba(${lc},${a * 0.35})`);
  gr.addColorStop(1, `rgba(${lc},0)`);
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x - 3, y);
  g.lineTo(x + 4, y);
  g.lineTo(x + 24, 158);
  g.lineTo(x - 23, 158);
  g.closePath();
  g.fill();
  g.beginPath();
  g.moveTo(x - 1, y);
  g.lineTo(x + 2, y);
  g.lineTo(x + 13, 150);
  g.lineTo(x - 12, 150);
  g.closePath();
  g.fill();
}
function windowRays(n) {
  const h = hour();
  let col = null,
    a = 0;
  if (rainy() || curWx() === 'nebbia') {
    if (n < 0.5) {
      col = '170,190,230';
      a = 0.05 * (1 - n);
    }
  } else if (h >= 7 && h < 10) {
    col = '255,220,150';
    a = 0.11 * (1 - n);
  } else if (h >= 16.5 && h < 20) {
    col = '255,150,90';
    a = 0.14 * (1 - n * 0.7);
  } else if (n < 0.5) {
    col = '255,250,230';
    a = 0.06;
  } else {
    col = '130,140,255';
    a = 0.05 * n;
  }
  if (!col) return;
  const dx = h < 13 ? -26 : 26;
  for (const p of panes()) {
    if (p.locked) continue;
    const gr = g.createLinearGradient(0, WY0, 0, 170);
    gr.addColorStop(0, `rgba(${col},${a})`);
    gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(p.x, WY0);
    g.lineTo(p.x + p.w, WY0);
    g.lineTo(p.x + p.w + dx * 1.6, 170);
    g.lineTo(p.x + dx * 1.6, 170);
    g.closePath();
    g.fill();
  }
}
function grade() {
  const n = nightF();
  if (n < 0.05) return;
  g.save();
  g.globalCompositeOperation = 'soft-light';
  const gr = g.createLinearGradient(0, 0, 0, VH);
  gr.addColorStop(0, `rgba(40,220,255,${0.22 * n})`);
  gr.addColorStop(0.55, `rgba(150,60,255,${0.18 * n})`);
  gr.addColorStop(1, `rgba(255,60,170,${0.2 * n})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, VW, VH);
  g.restore();
}
function lighting() {
  const n = nightF(),
    th = TH(),
    bo = blackout();
  g.fillStyle = `rgba(12,6,30,${0.04 + n * (bo ? 0.55 : 0.36) + (rainy() ? 0.06 : 0)})`;
  g.fillRect(0, 0, W, VH);
  g.globalCompositeOperation = 'lighter';
  const lc = st.theme === 'retro' ? '120,240,255' : st.theme === 'sakura' ? '255,235,210' : '255,185,105';
  windowRays(n);
  if (!bo)
    for (let k = 0; k < st.space; k++) {
      const x = colX[k];
      glowAt(x, 32, 42, lc, 0.1 + 0.2 * n);
      glowAt(x, 140, 34, lc, 0.04 + 0.07 * n);
      lightCone(x, 31, lc, 0.025 + 0.07 * n);
    }
  else
    for (let k = 0; k < st.tables; k++) {
      const sl = slots[k];
      glowAt(sl.x, sl.y - 14, 22, '255,180,90', 0.35);
    }
  if (n < 0.6)
    for (const p of panes()) {
      if (!p.locked) glowAt(p.x + 22, WY1 + 24, 40, '255,250,235', (1 - n) * 0.1);
    }
  glowAt(counterX + 38, 92, 46, '255,190,120', bo ? 0.08 : 0.14);
  if (st.cook) glowAt(counterX + 20, 42, 18, '255,150,70', 0.25);
  if (flash > 0) glowAt(W / 2, 110, W * 0.6, '200,200,255', flash * 0.25);
  if ((st.decor >= 5 || st.theme === 'neon') && !bo) glowAt(W - 25, 16, 16, rgb(th.acc).join(','), 0.35);
  if (st.decor >= 6 && !bo) for (let k = 0; k < st.space - 1; k++) glowAt((colX[k] + colX[k + 1]) / 2, 15, 14, '255,110,70', 0.3);
  glowAt(18, 40, 12, '79,240,255', bo ? 0.05 : 0.25);
  if (st.decor >= 2 && n > 0.4) for (const p of panes()) if (!p.locked) glowAt(p.x + p.w - 7, WY1 - 5, 9, '255,170,80', 0.3 * n);
  g.globalCompositeOperation = 'source-over';
}
const FONT = "'Pixelify Sans', ui-monospace, monospace";
const SX = wx => (wx - camX) * S,
  SY = wy => wy * S;
function wrap(t, maxW) {
  const w = t.split(' '),
    out = [];
  let cur = '';
  for (const x of w) {
    const tt = cur ? cur + ' ' + x : x;
    if (ctx.measureText(tt).width > maxW && cur) {
      out.push(cur);
      cur = x;
    } else cur = tt;
  }
  if (cur) out.push(cur);
  return out;
}
function hiRes() {
  if (signBox) {
    const b = signBox,
      name = st.name || 'Caffè sotto la pioggia',
      cx = SX(b.x + b.w / 2),
      cy = SY(b.y + b.h / 2 + 0.6);
    let fs = Math.round(b.h * S * 0.62);
    ctx.font = `700 ${fs}px ${FONT}`;
    const w = ctx.measureText(name).width,
      maxW = (b.w - 8) * S;
    if (w > maxW) {
      fs = Math.floor((fs * maxW) / w);
      ctx.font = `700 ${fs}px ${FONT}`;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bo = blackout();
    ctx.globalAlpha = bo
      ? 0.5
      : signFlick > 0
        ? Math.random() < 0.45
          ? 0.15
          : 1
        : Math.sin(T * 11) > 0.96 && Math.random() < 0.5
          ? 0.35
          : 1;
    const ac = rainbowT > 0 || st.rainbow ? `hsl(${Math.round(T * 90) % 360},100%,66%)` : TH().acc;
    if (!bo) {
      ctx.shadowColor = ac;
      ctx.shadowBlur = 14 * DPR;
      ctx.fillStyle = ac;
      ctx.fillText(name, cx, cy);
      ctx.shadowBlur = 4 * DPR;
      ctx.fillStyle = '#fff3f9';
    } else ctx.fillStyle = '#6a5a7a';
    ctx.fillText(name, cx, cy);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
  ctx.font = `700 ${Math.round(5.5 * S)}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const op = hour() < 25.8;
  ctx.shadowColor = op ? '#4ff0ff' : '#ff4040';
  ctx.shadowBlur = 8 * DPR;
  ctx.fillStyle = op ? '#c8fbff' : '#ffb0b0';
  ctx.fillText(napT > 0 ? 'PISOLINO' : op ? 'APERTO' : 'CHIUSO', SX(18), SY(39));
  ctx.shadowBlur = 0;
  if (st.chalk && CB.chalk) {
    const b = CB.chalk;
    ctx.font = `500 ${Math.round(3.3 * S)}px ${FONT}`;
    ctx.fillStyle = '#e8e4dc';
    ctx.shadowBlur = 0;
    const ls = wrap(st.chalk, (b.w - 4) * S).slice(0, 3);
    ls.forEach((l, i) => ctx.fillText(l, SX(b.x + b.w / 2), SY(b.y + b.h / 2) + (i - (ls.length - 1) / 2) * 3.9 * S));
  }
  const fs = Math.round(12 * DPR),
    lh = fs * 1.22,
    pad = 6 * DPR,
    list = [];
  const talkers = performer ? people.concat([performer]) : people;
  for (const c of talkers) {
    if (!c.bub) continue;
    ctx.font = `500 ${fs}px ${FONT}`;
    const maxW = Math.min(175 * DPR, cv.width * 0.3),
      lines = wrap(c.bub.txt, maxW);
    let lw = Math.max(...lines.map(l => ctx.measureText(l).width));
    if (c.bub.name) {
      ctx.font = `700 ${Math.round(fs * 0.85)}px ${FONT}`;
      lw = Math.max(lw, ctx.measureText(c.bub.name).width);
    }
    const nh = c.bub.name ? lh * 0.75 : 0,
      w = lw + pad * 2,
      h = lines.length * lh + nh + pad * 1.3,
      ax = SX(c.x);
    if (ax < -60 || ax > cv.width + 60) continue;
    const ty = SY(c.y - (c.state === 'sit' ? 21 : 24));
    list.push({ c, x: clamp(ax - w / 2, 4 * DPR, cv.width - w - 4 * DPR), y: ty - h - 5 * DPR, w, h, lines, nh, ax, ty });
  }
  list.sort((a, b) => b.y - a.y);
  const placed = [];
  for (const b of list) {
    for (let n = 0; n < 8; n++) {
      let hit = false;
      for (const p of placed)
        if (b.x < p.x + p.w && b.x + b.w > p.x && b.y < p.y + p.h && b.y + b.h > p.y) {
          b.y = p.y - b.h - (b.nh ? 10 : 4) * DPR;
          hit = true;
        }
      if (!hit) break;
    }
    b.y = Math.max(2 * DPR, b.y);
    placed.push(b);
  }
  for (const b of placed) {
    const bub = b.c.bub,
      a = Math.min(1, bub.t * 3, (bub.max - bub.t) * 6 + 0.2);
    ctx.globalAlpha = a;
    const named = !!bub.name,
      act = bub.txt[0] === '*',
      story = b.c.story || b.c.state === 'perf' || (b.c.scene && b.c.scene.story === 'filo');
    const pop = Math.min(1, (bub.max - bub.t) * 8),
      sc2 = 0.85 + 0.15 * pop,
      cx0 = b.x + b.w / 2,
      cy0 = b.y + b.h;
    ctx.save();
    ctx.translate(cx0, cy0);
    ctx.scale(sc2, sc2);
    ctx.translate(-cx0, -cy0);
    const R = 7 * DPR,
      edge = story ? '#ff6fae' : named ? '#5fd8e8' : '#c9b8dc',
      fill = story ? '#fff1f7' : named ? '#f2fdff' : '#fffaf2';
    const tx = clamp(b.ax, b.x + 10 * DPR, b.x + b.w - 10 * DPR),
      tail = b.y + b.h < b.ty - 2 * DPR;
    const shape = (dx, dy) => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(b.x + dx, b.y + dy, b.w, b.h, R);
      else ctx.rect(b.x + dx, b.y + dy, b.w, b.h);
      if (tail) {
        ctx.moveTo(tx - 5 * DPR + dx, b.y + b.h + dy - 1);
        ctx.lineTo(tx + (b.ax > tx ? 6 : -1) * DPR + dx, Math.min(b.ty, b.y + b.h + 7 * DPR) + dy);
        ctx.lineTo(tx + 4 * DPR + dx, b.y + b.h + dy - 1);
      }
    };
    ctx.fillStyle = 'rgba(20,8,36,.35)';
    shape(0, 3 * DPR);
    ctx.fill();
    ctx.fillStyle = fill;
    ctx.strokeStyle = edge;
    ctx.lineWidth = 2 * DPR;
    shape(0, 0);
    ctx.stroke();
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let yy = b.y + pad * 0.65;
    if (named) {
      ctx.font = `700 ${Math.round(fs * 0.85)}px ${FONT}`;
      const nw = ctx.measureText(bub.name).width + 10 * DPR,
        nx = b.x + pad - 4 * DPR,
        ny = b.y - 7 * DPR;
      ctx.fillStyle = story ? '#ff4fa3' : '#2ab8cc';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(nx, ny, nw, lh * 0.95, lh * 0.45);
      else ctx.rect(nx, ny, nw, lh * 0.95);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText(bub.name, nx + 5 * DPR, ny + lh * 0.08);
      if (story) {
        ctxPx('heart', nx + nw - 2 * DPR, ny - 3 * DPR, Math.round(9 * DPR), '#ff4fa3');
      }
      yy += b.nh * 0.55;
    }
    ctx.font = `${act ? 'italic ' : ''}500 ${fs}px ${FONT}`;
    ctx.fillStyle = act ? '#8a6a9a' : '#3a2448';
    for (const l of b.lines) {
      ctx.fillText(l, b.x + pad, yy);
      yy += lh;
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const f of floats) {
    ctx.globalAlpha = Math.min(1, f.t * 2);
    ctx.font = `700 ${Math.round(13 * DPR)}px ${FONT}`;
    const hi = f.txt[0] === '♥',
      tx = hi ? f.txt.slice(1).trim() : f.txt,
      isz = Math.round(11 * DPR),
      tw = ctx.measureText(tx).width,
      gap = hi ? 3 * DPR : 0,
      x0 = SX(f.x) - (tw + (hi ? isz + gap : 0)) / 2,
      cx = x0 + (hi ? isz + gap : 0) + tw / 2,
      yy = SY(f.y);
    if (hi) {
      ctxPx('heart', x0 + DPR, yy - isz / 2 + DPR * 1.5, isz, '#1b0f2a');
      ctxPx('heart', x0, yy - isz / 2, isz, f.col);
    }
    ctx.fillStyle = '#1b0f2a';
    ctx.fillText(tx, cx + DPR, yy + DPR * 1.5);
    ctx.fillStyle = f.col;
    ctx.fillText(tx, cx, yy);
  }
  ctx.globalAlpha = 1;
  if (!started) return;
  const p = 0.5 + 0.5 * Math.sin(T * 5),
    q = queue[0];
  ctx.font = `700 ${Math.round(13 * DPR)}px ${FONT}`;
  if (q && q.state === 'order') {
    const bx = SX(q.x - 7),
      by = SY(q.y - 27);
    ctx.fillStyle = '#1b0f2a';
    ctx.fillRect(bx, by, 14 * S, 2.2 * S);
    ctx.fillStyle = '#7bd389';
    ctx.fillRect(bx + S * 0.4, by + S * 0.4, 13.2 * S * Math.min(1, q.prog / q.order.t), 1.4 * S);
    if (q.special) {
      const sx = SX(q.x + 9),
        sy = SY(q.y - 38);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(Math.sin(T * 3) * 0.2);
      ctx.fillStyle = '#ffd166';
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 10 * DPR;
      const zs = Math.round(15 * DPR);
      ctxPx('star', -zs / 2, -zs / 2, zs, '#ffd166');
      ctx.restore();
      ctx.shadowBlur = 0;
    }
    if ((baristaLv() === 0 && st.tapServe < 12) || q.special) {
      const x = SX(counterX + 30),
        y = SY(76),
        txt = q.special ? 'Ordine speciale! Tocca' : 'Tocca il bancone!';
      const tw = ctx.measureText(txt).width + 20 * DPR;
      ctx.globalAlpha = 0.6 + 0.4 * p;
      ctx.fillStyle = '#1b0f2a';
      ctx.fillRect(x - tw / 2, y - 12 * DPR, tw, 24 * DPR);
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2 * DPR;
      ctx.strokeRect(x - tw / 2, y - 12 * DPR, tw, 24 * DPR);
      ctx.fillStyle = '#ffd166';
      ctx.fillText(txt, x, y);
      ctx.globalAlpha = 1;
    }
  }
  if (st.waiter === 0 && st.cleaned < 6) {
    const sl = slots.slice(0, st.tables).find(s => s.seats.some(se => se.dirty));
    if (sl) {
      ctx.globalAlpha = 0.6 + 0.4 * p;
      ctx.fillStyle = '#ffd166';
      ctx.fillText('Tocca per pulire', SX(sl.x), SY(sl.y - 33));
      ctx.globalAlpha = 1;
    }
  }
  if (st.space < 7 && st.space >= 1) {
    const sl = slots[st.space * 2];
    if (sl && sl.x > 0) {
      ctx.globalAlpha = 0.75;
      ctx.font = `700 ${Math.round(10 * DPR)}px ${FONT}`;
      ctx.fillStyle = '#ffd166';
      ctx.fillText('Espandi', SX(sl.x), SY(sl.y - 36));
      ctx.globalAlpha = 1;
    }
  }
  if (camX > 4) {
    ctx.globalAlpha = 0.5 + 0.3 * p;
    ctx.fillStyle = '#fff';
    ctx.font = `700 ${Math.round(22 * DPR)}px ${FONT}`;
    ctx.fillText('‹', 14 * DPR, cv.height * 0.5);
    ctx.globalAlpha = 1;
  }
  if (camX < W - VW - 4) {
    ctx.globalAlpha = 0.5 + 0.3 * p;
    ctx.fillStyle = '#fff';
    ctx.font = `700 ${Math.round(22 * DPR)}px ${FONT}`;
    ctx.fillText('›', cv.width - 14 * DPR, cv.height * 0.5);
    ctx.globalAlpha = 1;
  }
}
function render() {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, VW, VH);
  g.setTransform(1, 0, 0, 1, -Math.round(camX), 0);
  drawRoom();
  const items = [];
  for (let i = 0; i < 14; i++) {
    const sl = slots[i];
    if (sl.k >= cols) continue;
    if (sl.k >= st.space) {
      items.push({ y: sl.y, f: () => drawLocked(sl) });
      continue;
    }
    if (i >= st.tables) {
      items.push({ y: sl.y - 20, f: () => drawEmpty(sl) });
      continue;
    }
    sl.seats.forEach(se => items.push({ y: se.y - 0.2, f: () => drawChair(se) }));
    items.push({ y: sl.y + 0.3, f: () => drawTable(sl) });
  }
  people.forEach(c => {
    items.push({ y: c.y + 0.1, f: () => drawPerson(c) });
    if (c.pet && c.pet.k !== 'uccellino') items.push({ y: c.pet.y, f: () => drawPet(c.pet, c) });
  });
  baristas.forEach(b => items.push({ y: b.y, f: () => drawPerson(b) }));
  waiters.forEach(w => items.push({ y: w.y + 0.15, f: () => drawPerson(w) }));
  if (managerS) items.push({ y: managerS.y + 0.12, f: () => drawPerson(managerS) });
  if (performer) items.push({ y: performer.y, f: () => drawPerson(performer) });
  items.push({ y: 141, f: drawCounter });
  items.sort((a, b) => a.y - b.y).forEach(o => o.f());
  drawParts();
  lighting();
  g.setTransform(1, 0, 0, 1, 0, 0);
  grade();
  const v = g.createRadialGradient(VW / 2, 90, VH * 0.35, VW / 2, 90, VW * 0.7);
  v.addColorStop(0, 'rgba(5,2,12,0)');
  v.addColorStop(1, 'rgba(5,2,12,.5)');
  g.fillStyle = v;
  g.fillRect(0, 0, VW, VH);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(lo, 0, 0, VW, VH, 0, 0, VW * S, VH * S);
  hiRes();
}
