// Dettagli vivi della scena, segreti, visitatori rari e filmato iniziale.

function egg(id) {
  if (!st.found) st.found = {};
  if (st.found[id]) return false;
  st.found[id] = 1;
  const e = EGGS.find(x => x.id === id);
  if (e) {
    setTimeout(() => toast(`Segreto scoperto · ${e.n}`), 350);
    setTimeout(() => sfx('secret'), 300);
  }
  save();
  return true;
}
function tryRare() {
  const ids = Object.keys(RARE).filter(k => RARE[k].w());
  if (!ids.length || queue.length >= 4) return;
  const f = st.found || {};
  const id = wpick(ids, k => (f['v_' + k] ? 1 : 5));
  if (Math.random() > 0.35) return;
  const R = RARE[id];
  st.rareDay = st.day;
  const c = newCust({ look: Object.assign(randLook('normale'), R.look, { tl: 0 }), name: R.n, type: 'normale', story: 'raro' });
  c.rare = id;
  c.pat = 1e9;
  setTimeout(() => toast(`Visita rara · ${R.n}`), 600);
}
function nameEgg(n) {
  const l = n.toLowerCase();
  if (/glitch/.test(l)) {
    st.rainbow = 1;
    egg('nome');
    toast('Il neon impazzisce di gioia: arcobaleno per sempre.');
  } else if (/miao|gatt|micio/.test(l)) {
    if (!st.cat) {
      st.cat = 1;
      toast('Con un nome così, un gatto doveva arrivare per forza.');
    }
    egg('nome');
  } else if (/luna|moon/.test(l)) {
    st.bigMoon = 1;
    egg('nome');
    toast('Stanotte la luna sembra più grande...');
  } else if (/pioggia|rain|insonnia/.test(l)) {
    egg('nome');
    toast('Bel nome. Qui piove spesso, sai?');
  }
}
let moonPos = null,
  moonTaps = 0,
  moonWink = 0,
  shoot = null,
  shootT = rnd(25, 60),
  birds = [],
  plane = null,
  glass = [],
  fogMarks = [],
  signFlick = 0,
  signTaps = [],
  rainbowT = 0,
  openTaps = [],
  napT = 0,
  doorTaps = [],
  lampSw = [],
  plantW = 0,
  fishFeed = 0,
  machTaps = [],
  boostT = 0,
  machCd = 0,
  catTaps = 0,
  catRoll = 0,
  umbT = 0,
  strayCat = null,
  CB = {};
const fogOn = () => {
  const w = curWx();
  return rainy() || w === 'neve' || w === 'nebbia';
};
const inB = (x, y, b) => !!b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
const burst = (arr, t) => {
  arr.push(T);
  while (arr.length && T - arr[0] > t) arr.shift();
  return arr.length;
};
function tapExtra(x, y) {
  for (let k = 0; k < st.space; k++)
    if (Math.abs(x - colX[k]) < 6 && y >= 22 && y <= 33) {
      lampSw[k] = 1;
      sfx('tap');
      if (lampSw.filter((v, i) => i < st.space && v > 0.25).length >= Math.min(3, st.space)) egg('lampada');
      return true;
    }
  if (signBox && inB(x, y, signBox)) {
    signFlick = 0.5;
    sfx('buzz');
    if (burst(signTaps, 4) >= 8) {
      signTaps.length = 0;
      rainbowT = 20;
      egg('insegna');
    }
    return true;
  }
  if (x >= 4 && x <= 32 && y >= 33 && y < 44) {
    if (burst(openTaps, 2.5) >= 3) {
      openTaps.length = 0;
      napT = 10;
      sfx('pop');
      egg('aperto');
      toast('Il cartello si è girato da solo. Anche lui ha sonno.');
    } else sfx('tap');
    return true;
  }
  for (const p of panes()) {
    if (p.locked || x < p.x || x > p.x + p.w || y < WY0 || y > WY1) continue;
    if (shoot && Math.hypot(x - shoot.x, y - (WY0 + shoot.y)) < 14) {
      wish(x, y);
      return true;
    }
    if (moonPos && Math.hypot(x - moonPos.x, y - moonPos.y) < 9) {
      moonTaps++;
      sfx('tap');
      if (moonTaps >= 5) {
        moonTaps = 0;
        moonWink = 4;
        egg('luna');
      }
      return true;
    }
    if (strayCat && Math.abs(x - strayCat.x) < 7 && y > WY1 - 16) {
      sfx('meow');
      strayCat.t = Math.min(strayCat.t, 3);
      egg('randagio');
      toast('Il gatto ti fissa dal davanzale. Forse vorrebbe entrare...');
      return true;
    }
    if (fogOn() && y > WY1 - 20) {
      fogMarks.push({ x: Math.round(x), y: Math.round(y), k: pick(['heart', 'star', 'smile']), t: 80 });
      if (fogMarks.length > 14) fogMarks.shift();
      sfx('tap');
      egg('disegno');
      return true;
    }
    const pd = peds.find(q => Math.abs(q.x - x) < 9);
    sfx('knock');
    if (pd) {
      pd.wave = 2.4;
      egg('saluto');
    }
    return true;
  }
  if (x >= 3 && x <= 33 && y >= 44 && y <= 105) {
    doorOpen = 1;
    sfx('door');
    if (burst(doorTaps, 3) >= 6) {
      doorTaps.length = 0;
      sfx('bells');
      egg('campanello');
    }
    return true;
  }
  if ((rainy() || st.decor >= 1) && x >= 30 && x <= 41 && y >= 113 && y <= 135) {
    umbT = 2;
    sfx('pop');
    egg('ombrello');
    return true;
  }
  if (inB(x, y, CB.chalk)) {
    chalkEdit();
    return true;
  }
  if (inB(x, y, CB.rec) || inB(x, y, CB.juke)) {
    changeStation();
    return true;
  }
  if (inB(x, y, CB.plant)) {
    waterPlant();
    return true;
  }
  if (inB(x, y, CB.fish)) {
    fishFeed = 5;
    for (let i = 0; i < 6; i++) parts.push({ x: CB.fish.x + rnd(3, 13), y: 105, vx: 0, vy: rnd(2, 4), t: 2.5, max: 2.5, k: 'food' });
    sfx('pop');
    egg('pesci');
    return true;
  }
  const mx = W - 27;
  if (x >= mx - 2 && x <= mx + 16 && y >= 82 && y <= 98) {
    machineTap();
    return true;
  }
  return false;
}
function wish(x, y) {
  shoot = null;
  sfx('secret');
  if (egg('stella')) {
    st.hearts++;
    floats.push({ x, y: y - 6, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
  } else addCoins(Math.round(25 + (st.ips || 1) * 40), x, y);
  toast('Hai espresso un desiderio. Non dirlo a nessuno.');
}
function machineTap() {
  const mx = W - 27;
  for (let i = 0; i < 5; i++) parts.push({ x: mx + 7 + rnd(-2, 2), y: 88, vx: rnd(-4, 4), vy: rnd(-12, -6), t: 1, max: 1, k: 'steam' });
  sfx('hiss');
  if (burst(machTaps, 4) >= 12) {
    machTaps.length = 0;
    for (let i = 0; i < 34; i++) parts.push({ x: mx + 7, y: 86, vx: rnd(-26, 26), vy: rnd(-30, -4), t: 1.6, max: 1.6, k: 'steam' });
    toast("La macchina sbuffa offesa: «Un po' di rispetto!»");
    egg('sbuffo');
    return;
  }
  if (machCd <= 0) {
    machCd = 90;
    boostT = 20;
    toast('Pausa caffè! Per 20 secondi i tuoi tocchi valgono il doppio.');
    egg('pausa');
  }
}
function changeStation() {
  st.station = ((st.station || 0) + 1) % STATIONS.length;
  const S0 = STATIONS[st.station];
  st.heard = (st.heard || 1) | (1 << st.station);
  if (!st.musicOn) st.musicOn = 1;
  toast(`♪ ${S0.n} · «${pick(S0.songs)}»`);
  sfx('tap');
  for (let i = 0; i < 3; i++) parts.push({ x: angX + 8, y: 110, vx: rnd(-3, 3), vy: -8, t: 1.5, max: 1.5, k: 'note' });
  if (st.heard === (1 << STATIONS.length) - 1) egg('radio');
  save();
}
function waterPlant() {
  plantW++;
  const b = CB.plant;
  for (let i = 0; i < 6; i++) parts.push({ x: b.x + rnd(1, 8), y: b.y - 2, vx: rnd(-2, 2), vy: rnd(10, 18), t: 0.9, max: 0.9, k: 'drop' });
  sfx('water');
  if (plantW === 3 && !st.flower) {
    st.flower = 1;
    toast('La pianta ti ringrazia: è sbocciato un fiore!');
    egg('fiore');
  } else if (plantW > 7) {
    plantW = 4;
    toast('Basta così, la pianta sta imparando a nuotare.');
  }
}
function chalkEdit() {
  showModal(
    `<h2>Lavagna</h2><p>Scrivi la frase del giorno. I clienti la leggeranno.</p><input id="chIn" maxlength="40" autocomplete="off">`,
    [
      {
        t: 'Cancella',
        fn: () => {
          st.chalk = '';
          hideModal();
          save();
        }
      },
      {
        t: 'Scrivi',
        big: 1,
        fn: () => {
          const v = $('#chIn').value.trim();
          st.chalk = v;
          hideModal();
          save();
          if (v) {
            egg('lavagna');
            toast('Frase scritta sulla lavagna');
          }
        }
      }
    ]
  );
  const i = $('#chIn');
  i.value = st.chalk || '';
  setTimeout(() => i.focus(), 50);
  i.addEventListener('keydown', e => {
    if (e.key === 'Enter') $('#mbox .btns .big').click();
  });
}
function updExtra(dt) {
  signFlick = Math.max(0, signFlick - dt);
  rainbowT = Math.max(0, rainbowT - dt);
  napT = Math.max(0, napT - dt);
  moonWink = Math.max(0, moonWink - dt);
  catRoll = Math.max(0, catRoll - dt);
  umbT = Math.max(0, umbT - dt);
  fishFeed = Math.max(0, fishFeed - dt);
  for (let k = 0; k < lampSw.length; k++) if (lampSw[k]) lampSw[k] = Math.max(0, lampSw[k] - dt * 0.35);
  for (const f of fogMarks) f.t -= dt;
  fogMarks = fogMarks.filter(f => f.t > 0);
  const n = nightF(),
    w = curWx(),
    clear = !rainy() && w !== 'nebbia' && w !== 'nuvoloso';
  if (shoot) {
    shoot.t -= dt;
    shoot.x += shoot.vx * dt;
    shoot.y += shoot.vy * dt;
    if (shoot.t <= 0) shoot = null;
  } else if (n > 0.6 && clear) {
    shootT -= dt;
    if (shootT <= 0) {
      shootT = rnd(35, 90);
      const ps = panes().filter(p => !p.locked);
      if (ps.length) {
        const p = pick(ps);
        shoot = { x: p.x + rnd(14, p.w + 6), y: rnd(3, 13), vx: -rnd(34, 50), vy: rnd(12, 20), t: 1 };
      }
    }
  }
  if (n < 0.4 && !rainy() && w !== 'neve' && birds.length < 2 && Math.random() < dt * 0.05) {
    const d = Math.random() < 0.5 ? 1 : -1;
    birds.push({ x: d > 0 ? -10 : W + 10, y: rnd(4, 18), d, spd: rnd(10, 16), n: ri(2, 5) });
  }
  for (const b of birds) b.x += b.d * b.spd * dt;
  birds = birds.filter(b => b.x > -24 && b.x < W + 24);
  if (!plane && n > 0.6 && Math.random() < dt * 0.02) plane = { x: -6, y: rnd(3, 9), spd: rnd(5, 8) };
  if (plane) {
    plane.x += plane.spd * dt;
    if (plane.x > W + 6) plane = null;
  }
  if (strayCat) {
    strayCat.t -= dt;
    if (strayCat.t <= 0) strayCat = null;
  } else if (!st.cat && n > 0.5 && Math.random() < dt * 0.012) {
    const ps = panes().filter(p => !p.locked);
    if (ps.length) {
      const p = pick(ps);
      strayCat = { x: Math.round(p.x + rnd(12, p.w - 12)), t: 25 };
    }
  }
  const want = rainy() ? Math.round(W * (w === 'temporale' ? 0.16 : 0.1)) : 0;
  while (glass.length < want) glass.push({ x: rnd(0, W), y: rnd(0, WY1 - WY0), v: 0, tr: 0 });
  if (glass.length > want) glass.length = want;
  for (const d of glass) {
    if (!d.v && Math.random() < dt * 0.08) d.v = rnd(6, 16);
    if (d.v) {
      d.y += d.v * dt;
      d.tr = Math.min(10, d.tr + d.v * dt);
      if (d.y > WY1 - WY0) {
        d.y = rnd(-4, 10);
        d.x = rnd(0, W);
        d.v = 0;
        d.tr = 0;
      }
    }
  }
  if (st.space && !blackout() && Math.random() < dt * 1.2) {
    const k = ri(0, st.space - 1);
    parts.push({ x: colX[k] + rnd(-16, 16), y: rnd(36, 96), vx: rnd(-1.2, 1.2), vy: rnd(-1.6, -0.4), t: 6, max: 6, k: 'mote' });
  }
}
function drawSky2(n) {
  for (const b of birds)
    for (let i = 0; i < b.n; i++) {
      const bx = Math.round(b.x - b.d * i * 4),
        by = WY0 + Math.round(b.y + (i % 2) * 2),
        fl = Math.floor(T * 6 + i) % 2;
      g.fillStyle = n > 0.3 ? '#1a1830' : '#3a3550';
      g.fillRect(bx - 1, by - fl, 1, 1);
      g.fillRect(bx, by, 1, 1);
      g.fillRect(bx + 1, by - fl, 1, 1);
    }
  if (plane) {
    const px = Math.round(plane.x),
      py = WY0 + Math.round(plane.y);
    g.fillStyle = 'rgba(255,255,255,.7)';
    g.fillRect(px, py, 1, 1);
    if (Math.floor(T * 2) % 2) {
      g.fillStyle = '#ff4040';
      g.fillRect(px + 2, py, 1, 1);
    }
  }
  if (shoot) {
    const sx = shoot.x,
      sy = WY0 + shoot.y,
      a = Math.min(1, shoot.t * 2);
    for (let i = 0; i < 9; i++) {
      g.fillStyle = `rgba(255,250,220,${a * (1 - i / 9)})`;
      g.fillRect(Math.round(sx - shoot.vx * i * 0.012), Math.round(sy - shoot.vy * i * 0.012), 1, 1);
    }
    glowAt(sx, sy, 5, '255,250,220', 0.7 * a);
  }
}
function drawGlass(n) {
  if (strayCat) {
    const cx = strayCat.x,
      cy = WY1 - 1;
    g.fillStyle = '#0c0a14';
    g.fillRect(cx - 2, cy - 4, 5, 4);
    g.fillRect(cx - 1, cy - 7, 4, 3);
    g.fillRect(cx - 1, cy - 8, 1, 1);
    g.fillRect(cx + 2, cy - 8, 1, 1);
    g.fillRect(cx + 3, cy - 1, 3, 1);
    g.fillRect(cx + 5, cy - 3, 1, 2);
    if (Math.floor(T * 0.8) % 5) {
      g.fillStyle = '#ffd166';
      g.fillRect(cx, cy - 6, 1, 1);
      g.fillRect(cx + 2, cy - 6, 1, 1);
    }
  }
  if (n > 0.3 && !blackout()) for (let k = 0; k < st.space; k++) glowAt(colX[k] + 3, WY0 + 34, 10, '255,200,140', 0.07 * n);
  for (const d of glass) {
    const x = Math.round(d.x),
      y = WY0 + Math.round(d.y);
    if (d.tr > 1) {
      g.fillStyle = 'rgba(200,220,255,.12)';
      g.fillRect(x, y - Math.round(d.tr), 1, Math.round(d.tr));
    }
    g.fillStyle = 'rgba(205,225,255,.4)';
    g.fillRect(x, y, 1, 2);
    g.fillStyle = 'rgba(255,255,255,.45)';
    g.fillRect(x, y, 1, 1);
  }
  if (fogOn()) {
    const fg = g.createLinearGradient(0, WY1 - 22, 0, WY1);
    fg.addColorStop(0, 'rgba(215,222,240,0)');
    fg.addColorStop(1, `rgba(215,222,240,${curWx() === 'neve' ? 0.34 : 0.24})`);
    g.fillStyle = fg;
    g.fillRect(0, WY1 - 22, W, 22);
    for (const f of fogMarks) {
      const r = PXI[f.k];
      g.fillStyle = `rgba(25,25,60,${Math.min(0.45, f.t / 20)})`;
      r.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) if (row[i] === '#') g.fillRect(f.x - 3 + i, f.y - 3 + j, 1, 1);
      });
    }
  }
}
function sill(p) {
  if (st.decor >= 1) {
    g.fillStyle = '#c0704a';
    g.fillRect(p.x + 4, WY1 - 3, 4, 3);
    g.fillStyle = '#3f9a5c';
    g.fillRect(p.x + 5, WY1 - 6, 1, 3);
    g.fillRect(p.x + 6, WY1 - 5, 1, 2);
    g.fillRect(p.x + 4, WY1 - 5, 1, 1);
  }
  if (st.decor >= 2 && nightF() > 0.4) {
    const cx = p.x + p.w - 8;
    g.fillStyle = '#f4f1de';
    g.fillRect(cx, WY1 - 4, 2, 4);
    g.fillStyle = Math.random() < 0.5 ? '#ffd166' : '#ff9f43';
    g.fillRect(cx + (Math.random() < 0.2 ? 1 : 0), WY1 - 6, 1, 2);
  }
}
/* ----- foto del locale ----- */
function photo() {
  render();
  const c = document.createElement('canvas');
  c.width = cv.width;
  c.height = cv.height;
  const x = c.getContext('2d');
  x.drawImage(cv, 0, 0);
  x.font = `700 ${Math.round(15 * DPR)}px ${FONT}`;
  x.textAlign = 'right';
  x.textBaseline = 'bottom';
  x.shadowColor = '#ff4fa3';
  x.shadowBlur = 10 * DPR;
  x.fillStyle = '#fff3f9';
  x.fillText(`${st.name} · Giorno ${st.day}`, c.width - 16 * DPR, c.height - 14 * DPR);
  try {
    const a = document.createElement('a');
    a.download = `${(st.name || 'caffe').replace(/[^\w]+/g, '-').toLowerCase()}-giorno-${st.day}.png`;
    a.href = c.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    a.remove();
    sfx('secret');
    flash = 0.5;
    toast('Foto scattata!');
  } catch (e) {
    toast('Non riesco a salvare la foto su questo dispositivo');
  }
}
/* ----- filmato iniziale ----- */
let cine = null,
  cineSign = null;
const CINE_T = CINE.reduce((a, c) => a + c.d, 0);
function startCine(onEnd) {
  closePanel();
  cine = { t: 0, onEnd, thunder: false, g: null };
  paused = true;
  ['#start', '#hud', '#serve', '#mini'].forEach(q => ($(q).hidden = true));
  $('#skip').hidden = false;
  if (AC) {
    cine.g = AC.createGain();
    cine.g.gain.value = st.sound ? 1 : 0;
    cine.g.connect(master);
    const t0 = AC.currentTime + 0.3;
    [
      [57, 60, 64, 67],
      [53, 57, 60, 64],
      [48, 52, 55, 59],
      [55, 59, 62, 65]
    ].forEach((ch, i) =>
      ch.forEach((m, k) => {
        tone(cine.g, mtof(m), t0 + i * 5.6 + k * 0.55, 3.4, 0.03, 'sine');
        tone(cine.g, mtof(m + 12), t0 + i * 5.6 + k * 0.55 + 2, 2, 0.012, 'sine');
      })
    );
  }
}
function endCine() {
  const c = cine;
  if (!c) return;
  cine = null;
  $('#skip').hidden = true;
  paused = false;
  if (c.g && AC) c.g.gain.setTargetAtTime(0, AC.currentTime, 0.4);
  if (c.onEnd) c.onEnd();
}
function cineNext() {
  if (!cine) return;
  let acc = 0;
  for (const sc of CINE) {
    acc += sc.d;
    if (cine.t < acc - 0.75) {
      cine.t = acc - 0.7;
      return;
    }
  }
  endCine();
}
function cGrad(a, b) {
  const gr = g.createLinearGradient(0, 0, 0, VH);
  gr.addColorStop(0, a);
  gr.addColorStop(1, b);
  g.fillStyle = gr;
  g.fillRect(0, 0, VW, VH);
}
function cRain(a, n, len) {
  g.fillStyle = `rgba(175,200,255,${a})`;
  for (let i = 0; i < n; i++) {
    let x = (i * 97.31 - T * 28) % (VW + 30);
    if (x < 0) x += VW + 30;
    const y = ((i * 53.77 + T * 150) % (VH + 10)) - 5;
    g.fillRect(Math.round(x), Math.round(y), 1, len || 3);
  }
}
function cFig(x, y, umb, walk) {
  x = Math.round(x);
  y = Math.round(y);
  const s2 = walk ? Math.floor(T * 6) % 2 : 0;
  g.fillStyle = '#0c0814';
  g.fillRect(x - 2, y - 14, 5, 8);
  g.fillRect(x - 1, y - 18, 3, 4);
  g.fillRect(x - 2 + (s2 ? 0 : 1), y - 6, 2, 6);
  g.fillRect(x + 1 - (s2 ? 0 : 1), y - 6, 2, 6);
  if (umb) {
    g.fillStyle = umb;
    g.fillRect(x - 7, y - 24, 15, 2);
    g.fillRect(x - 5, y - 26, 11, 2);
    g.fillRect(x - 2, y - 27, 5, 1);
    g.fillStyle = '#0c0814';
    g.fillRect(x, y - 22, 1, 5);
  }
}
function cFacade(boards, glow) {
  cGrad('#0a0820', '#1a1236');
  const cx = Math.round(VW / 2);
  g.fillStyle = '#24163a';
  g.fillRect(0, 20, VW, 124);
  g.fillStyle = '#2c1c46';
  for (let y = 24; y < 144; y += 6) for (let x = ((y / 6) % 2) * 8 - 8; x < VW; x += 16) g.fillRect(x, y, 15, 5);
  g.fillStyle = '#2a2238';
  g.fillRect(0, 144, VW, 8);
  g.fillStyle = '#3a3050';
  g.fillRect(0, 144, VW, 1);
  g.fillStyle = '#120e22';
  g.fillRect(0, 152, VW, 28);
  const wx = cx - 62,
    wy = 64,
    ww = 74,
    wh = 72;
  g.fillStyle = '#160c22';
  g.fillRect(wx - 3, wy - 3, ww + 6, wh + 6);
  if (glow > 0) {
    const wg = g.createLinearGradient(0, wy, 0, wy + wh);
    wg.addColorStop(0, mixc('#0e0a1c', '#e8a868', glow * 0.55));
    wg.addColorStop(1, mixc('#0e0a1c', '#7a4a3a', glow * 0.7));
    g.fillStyle = wg;
  } else g.fillStyle = '#0e0a1c';
  g.fillRect(wx, wy, ww, wh);
  if (glow > 0) {
    glowAt(wx + 18, wy + 18, 22, '255,220,160', 0.45 * glow);
    glowAt(wx + 52, wy + 18, 22, '255,220,160', 0.45 * glow);
  }
  if (glow > 0) {
    g.globalAlpha = glow;
    g.fillStyle = '#5a3424';
    g.fillRect(wx + 10, wy + 50, 16, 2);
    g.fillRect(wx + 17, wy + 52, 2, 12);
    g.fillRect(wx + 44, wy + 50, 16, 2);
    g.fillRect(wx + 51, wy + 52, 2, 12);
    g.fillStyle = '#2a1a14';
    g.fillRect(wx + 18, wy, 1, 14);
    g.fillRect(wx + 52, wy, 1, 14);
    g.fillStyle = '#fff2c0';
    g.fillRect(wx + 16, wy + 14, 5, 2);
    g.fillRect(wx + 50, wy + 14, 5, 2);
    g.globalAlpha = 1;
  }
  g.fillStyle = 'rgba(255,255,255,.07)';
  g.fillRect(wx + 4, wy + 4, 2, wh - 8);
  g.fillRect(wx + 8, wy + 4, 1, 20);
  for (const b of boards) {
    if (b.a <= 0) continue;
    g.globalAlpha = b.a;
    const by = Math.round(b.y);
    g.fillStyle = '#6b4a30';
    g.fillRect(wx - 4, by, ww + 8, 8);
    g.fillStyle = '#8a6440';
    g.fillRect(wx - 4, by, ww + 8, 1);
    g.fillStyle = '#c0c0c0';
    g.fillRect(wx, by + 3, 1, 1);
    g.fillRect(wx + ww - 1, by + 3, 1, 1);
    g.globalAlpha = 1;
  }
  const dx = cx + 20;
  g.fillStyle = '#160c22';
  g.fillRect(dx - 2, 74, 30, 70);
  g.fillStyle = glow > 0 ? mixc('#1a1030', '#c88a5a', glow * 0.6) : '#1a1030';
  g.fillRect(dx, 76, 26, 68);
  g.fillStyle = '#3a2a50';
  g.fillRect(dx + 3, 80, 20, 26);
  g.fillStyle = '#e8c49a';
  g.fillRect(dx + 21, 112, 1, 3);
  g.fillStyle = '#160c22';
  g.fillRect(wx - 4, 46, ww + 40, 13);
  g.fillStyle = '#3d2760';
  g.fillRect(wx - 4, 46, ww + 40, 1);
  g.fillRect(wx - 4, 58, ww + 40, 1);
  cineSign = { x: wx - 4 + (ww + 40) / 2, y: 52.5 };
  const lx = cx + 96;
  g.fillStyle = '#0c0a1a';
  g.fillRect(lx, 40, 2, 104);
  g.fillRect(lx - 6, 40, 8, 2);
  g.fillStyle = '#ffe2a0';
  g.fillRect(lx - 7, 42, 4, 2);
  glowAt(lx - 5, 44, 34, '255,215,150', 0.35);
  for (let j = 0; j < 6; j++)
    if (Math.sin(T * 8 + j) > -0.4) {
      g.fillStyle = 'rgba(255,215,150,.3)';
      g.fillRect(lx - 6 + (j % 2), 154 + j * 3, 2, 1);
    }
  if (glow > 0) {
    g.fillStyle = `rgba(255,200,130,${0.3 * glow})`;
    for (let j = 0; j < 5; j++) g.fillRect(wx + 10 + j * 12, 154 + (j % 3) * 3, 8, 1);
    glowAt(cx - 25, 150, 60, '255,190,120', 0.18 * glow);
    glowAt(cx - 25, 100, 70, '255,190,120', 0.12 * glow);
  }
}
function cS1(lt) {
  cGrad('#05071c', '#3a2060');
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(255,255,255,${0.3 + 0.3 * Math.sin(T * 2 + i)})`;
    g.fillRect(Math.round((i * 71.3) % VW), Math.round(((i * 37.1) % 60) + 12), 1, 1);
  }
  const mx = VW * 0.78,
    my = 40;
  glowAt(mx, my, 24, '220,220,255', 0.3);
  g.fillStyle = '#f4f1de';
  g.beginPath();
  g.arc(mx, my, 6, 0, 7);
  g.fill();
  g.fillStyle = '#0b0d2c';
  g.beginPath();
  g.arc(mx + 2.6, my - 1.5, 5.2, 0, 7);
  g.fill();
  if (city) {
    const ch = city.night.height,
      sw = Math.min(city.night.width, Math.ceil(VW / 2)),
      sx = Math.round(Math.min(Math.max(0, city.night.width - sw), lt * 7)),
      y0 = VH - 12 - ch * 2 - 16;
    g.drawImage(city.night, sx, 0, sw, ch, 0, y0, sw * 2, ch * 2);
    g.globalAlpha = 0.95;
    g.drawImage(city.lights, sx, 0, sw, ch, 0, y0, sw * 2, ch * 2);
    g.globalAlpha = 1;
    for (const ne of city.neons) {
      const x = (ne.x - sx) * 2;
      if (x < -10 || x > VW || Math.sin(T * 3 + ne.ph) < -0.85) continue;
      g.fillStyle = ne.col;
      g.fillRect(x, y0 + ne.y * 2, ne.w * 2, ne.h * 2);
      glowAt(x + ne.w, y0 + ne.y * 2 + ne.h, 8, rgb(ne.col).join(','), 0.35);
    }
  }
  g.fillStyle = '#0a0818';
  g.fillRect(0, VH - 28, VW, 16);
  for (let x = 10; x < VW; x += 46)
    if (Math.sin(T * 7 + x) > -0.5) {
      g.fillStyle = 'rgba(255,215,150,.25)';
      g.fillRect(x, VH - 24, 2, 1);
    }
  cRain(0.5, Math.round(VW * 0.9), 4);
  if (lt > 2.6 && lt < 2.9) {
    g.fillStyle = 'rgba(230,230,255,.55)';
    g.fillRect(0, 0, VW, VH);
  }
  if (lt > 2.6 && !cine.thunder) {
    cine.thunder = true;
    setTimeout(() => sfx('thunder'), 300);
  }
}
function cS2(lt) {
  cFacade(
    [0, 1, 2, 3].map(i => ({ y: 68 + i * 17, a: 1 })),
    0
  );
  const cx = VW / 2,
    x = lt < 4.2 ? lerp(-12, cx + 30, lt / 4.2) : cx + 30;
  cFig(x, 144, '#ffd166', lt < 4.2);
  cRain(0.45, Math.round(VW * 0.7), 4);
}
function cS3(lt) {
  const boards = [0, 1, 2, 3].map(i => {
    const tt = Math.max(0, lt - 1.2 - i * 0.25);
    return { y: 68 + i * 17 + tt * tt * 140, a: 1 - Math.min(1, tt / 1.1) };
  });
  const glow = clamp((lt - 2) / 1.6, 0, 1);
  cFacade(boards, glow);
  const cx = VW / 2;
  if (lt < 1.3) {
    cFig(cx + 30, 144, null, false);
    if (Math.floor(T * 8) % 2) {
      g.fillStyle = '#ffd166';
      g.fillRect(cx + 40, 112, 1, 1);
      g.fillRect(cx + 39, 113, 3, 1);
      g.fillRect(cx + 40, 114, 1, 1);
    }
  } else if (lt < 3.6) {
    g.globalAlpha = clamp(1 - (lt - 2.6), 0, 1);
    cFig(cx + 30, 144, null, false);
    g.globalAlpha = 1;
  }
  cRain(0.4, Math.round(VW * 0.6), 4);
}
function cS4(lt) {
  cGrad('#2a1a3c', '#1a1028');
  const wx = Math.round(VW / 2) - 70,
    wy = 22,
    ww = 140,
    wh = 70;
  g.fillStyle = '#160c22';
  g.fillRect(wx - 3, wy - 3, ww + 6, wh + 6);
  const gr = g.createLinearGradient(0, wy, 0, wy + wh);
  gr.addColorStop(0, '#0a0f30');
  gr.addColorStop(1, '#4a2a6e');
  g.fillStyle = gr;
  g.fillRect(wx, wy, ww, wh);
  if (city) {
    const ch = city.night.height,
      cw = Math.min(ww, city.night.width);
    g.drawImage(city.night, 0, 0, cw, ch, wx, wy + wh - ch, cw, ch);
    g.drawImage(city.lights, 0, 0, cw, ch, wx, wy + wh - ch, cw, ch);
  }
  g.save();
  g.beginPath();
  g.rect(wx, wy, ww, wh);
  g.clip();
  cRain(0.35, 90, 3);
  for (let i = 0; i < 26; i++) {
    g.fillStyle = 'rgba(210,225,255,.35)';
    g.fillRect(Math.round(wx + ((i * 37.7) % ww)), Math.round(wy + ((i * 23.3 + T * (4 + (i % 5))) % wh)), 1, 2);
  }
  g.restore();
  g.fillStyle = '#3d2760';
  g.fillRect(wx + ww / 2 - 1, wy, 2, wh);
  g.fillRect(wx, wy + wh / 2 - 1, ww, 2);
  glowAt(VW / 2, 40, 90, '255,180,110', 0.22);
  g.fillStyle = '#a8714a';
  g.fillRect(0, 128, VW, 40);
  g.fillStyle = '#c98f5e';
  g.fillRect(0, 128, VW, 2);
  g.fillStyle = '#8a5a38';
  for (let x = 0; x < VW; x += 40) g.fillRect(x, 134, 30, 1);
  const CUP = [
      '.wwwwwwwwwwwwww...',
      'wccccchhchhccccw..',
      'wcccccchhhcccccw..',
      'wwccccccchccccww..',
      'swwwwwwwwwwwwwwwww',
      'swwwwwwwwwwwwwww.w',
      '.swwwwwwwwwwwwwwww',
      '..swwwwwwwwwwwws..',
      '...sswwwwwwwwss...',
      'pppppppppppppppppp',
      '.pppppppppppppppp.'
    ],
    CP = { w: '#f4f1de', c: '#6a3a22', h: '#f6e0c4', s: '#cfc6b6', p: '#b9a3cf' };
  const sc = 5,
    cw = 18 * sc,
    cx = Math.round(VW / 2 - cw / 2),
    cy = 128 - 11 * sc + 6;
  CUP.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '.') continue;
      g.fillStyle = CP[ch];
      g.fillRect(cx + i * sc, cy + j * sc, sc, sc);
    }
  });
  for (let k = 0; k < 3; k++)
    for (let j = 0; j < 14; j++) {
      const yy = cy - 6 - j * 4 - ((T * 10) % 4),
        xx = cx + cw * 0.25 + k * 13 + Math.sin(T * 1.5 + j * 0.5 + k * 2) * 4;
      g.fillStyle = `rgba(240,240,255,${0.3 * (1 - j / 14)})`;
      g.fillRect(Math.round(xx), Math.round(yy), 2, 2);
    }
  g.fillStyle = 'rgba(255,200,130,.08)';
  g.fillRect(0, 0, VW, VH);
}
function drawCine() {
  let i = 0,
    acc = 0;
  while (i < CINE.length - 1 && cine.t >= acc + CINE[i].d) {
    acc += CINE[i].d;
    i++;
  }
  const sc = CINE[i],
    lt = cine.t - acc;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, VW, VH);
  [cS1, cS2, cS3, cS4][i](lt);
  const v = g.createRadialGradient(VW / 2, 90, VH * 0.3, VW / 2, 90, VW * 0.7);
  v.addColorStop(0, 'rgba(5,2,12,0)');
  v.addColorStop(1, 'rgba(5,2,12,.6)');
  g.fillStyle = v;
  g.fillRect(0, 0, VW, VH);
  g.fillStyle = '#000';
  g.fillRect(0, 0, VW, 12);
  g.fillRect(0, VH - 12, VW, 12);
  const fa = 1 - Math.min(1, lt / 0.7, (sc.d - lt) / 0.7);
  if (fa > 0) {
    g.fillStyle = `rgba(0,0,0,${fa})`;
    g.fillRect(0, 0, VW, VH);
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(lo, 0, 0, VW, VH, 0, 0, VW * S, VH * S);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (cineSign && (i === 1 || i === 2)) {
    const x = cineSign.x * S,
      y = cineSign.y * S;
    ctx.globalAlpha = 1 - fa;
    if (i === 1 || lt < 3.4) {
      ctx.font = `700 ${Math.round(7 * S)}px ${FONT}`;
      ctx.fillStyle = '#6a5a7a';
      ctx.fillText('AFFITTASI', x, y);
    } else if (lt > 4.1 || Math.random() < 0.5) {
      ctx.font = `700 ${Math.round(8 * S)}px ${FONT}`;
      ctx.shadowColor = '#ff4fa3';
      ctx.shadowBlur = 16 * DPR;
      ctx.fillStyle = '#ff4fa3';
      ctx.fillText('CAFFÈ', x, y);
      ctx.shadowBlur = 4 * DPR;
      ctx.fillStyle = '#fff3f9';
      ctx.fillText('CAFFÈ', x, y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }
  const txt = sc.txt.slice(0, Math.max(0, Math.floor((lt - 0.5) * 30)));
  ctx.globalAlpha = clamp((sc.d - lt) / 0.6, 0, 1);
  ctx.font = `500 ${Math.round(15 * DPR)}px ${FONT}`;
  ctx.fillStyle = '#000';
  ctx.fillText(txt, cv.width / 2 + DPR, cv.height - 6 * S + DPR * 1.5);
  ctx.fillStyle = '#fbe9ff';
  ctx.fillText(txt, cv.width / 2, cv.height - 6 * S);
  ctx.globalAlpha = 1;
}
