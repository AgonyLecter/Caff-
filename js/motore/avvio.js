// Tocchi, avvio della partita e ciclo dei fotogrammi. Caricato per ultimo.

let ptr = null;
cv.addEventListener('pointerdown', e => {
  if (cine) {
    cineNext();
    return;
  }
  if (!started) return;
  const hit = !paused && inCounter(e) && tapCounter();
  ptr = { x: e.clientX, y: e.clientY, cx: camX, drag: false, done: hit };
  try {
    cv.setPointerCapture(e.pointerId);
  } catch (err) {}
});
cv.addEventListener('pointermove', e => {
  if (!ptr) return;
  const dx = e.clientX - ptr.x;
  if (Math.abs(dx) > 10) ptr.drag = true;
  if (ptr.drag) camX = clamp(ptr.cx - (dx * DPR) / S, 0, W - VW);
});
cv.addEventListener('pointerup', e => {
  if (!ptr) return;
  const p = ptr;
  ptr = null;
  if (!p.drag && !p.done) tap(e);
});
cv.addEventListener('pointercancel', () => (ptr = null));
function tap(e) {
  initAudio();
  const r = cv.getBoundingClientRect();
  const x = ((e.clientX - r.left) * DPR) / S + camX,
    y = ((e.clientY - r.top) * DPR) / S;
  if (st.cat && Math.abs(x - (counterX + 37)) < 7 && y > 86 && y < 99) {
    sfx('meow');
    for (let i = 0; i < 3; i++) parts.push({ x: counterX + 37 + rnd(-3, 3), y: 88, vx: rnd(-3, 3), vy: -8, t: 1.4, max: 1.4, k: 'heart' });
    catTaps++;
    if (catTaps >= 10) {
      catTaps = 0;
      catRoll = 5;
      egg('gatto');
    }
    return;
  }
  if (tapPet(x, y)) return;
  if (tapExtra(x, y)) return;
  for (let i = 0; i < 14; i++) {
    const sl = slots[i];
    if (sl.k >= cols) continue;
    if (Math.abs(x - sl.x) < 18 && y > sl.y - 26 && y < sl.y + 5) {
      if (sl.k >= st.space || i >= st.tables) {
        if (panel !== 'up') {
          openPanel('up');
        }
        return;
      }
      if (sl.seats.some(s => s.dirty)) {
        sl.seats.forEach(s => {
          if (s.dirty) cleanSeat(s, 1);
        });
        sfx('tap');
        return;
      }
      const c = sl.seats
        .map(s => s.occ)
        .filter(c => c && c.state === 'sit' && !c.scene && !c.bub)
        .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x))[0];
      if (c) {
        const info = c.reg ? `${TYPES[c.type] ? TYPES[c.type].n : ''} · habitué, affetto ${c.reg.f}/10` : (TYPES[c.type] || {}).n || '';
        say(c, pick(TAPL).replace('{item}', (c.order || MENU[0]).n), 2.6, `${c.name}${info ? ' · ' + info : ''}`);
        if (c.sleep) {
          c.sleep = 0;
          say(c, 'Eh?! Non dormivo!', 2, c.name);
        }
        return;
      }
    }
  }
  if (x > counterX - 50) tapCounter();
}
function inCounter(e) {
  const r = cv.getBoundingClientRect();
  const x = ((e.clientX - r.left) * DPR) / S + camX,
    y = ((e.clientY - r.top) * DPR) / S;
  if (slots.some((sl, i) => sl.k < cols && Math.abs(x - sl.x) < 18 && y > sl.y - 26 && y < sl.y + 5)) return false;
  return x > counterX - 8 && !(st.cat && Math.abs(x - (counterX + 37)) < 7 && y > 86 && y < 99);
}
function tapCounter() {
  initAudio();
  const q = queue[0];
  if (!q || q.state !== 'order') return false;
  if (q.special) {
    openMini(q);
    return true;
  }
  q.prog += tapPow();
  st.tapServe++;
  sfx('tap');
  for (let i = 0; i < 3; i++)
    parts.push({ x: W - 20 + rnd(-3, 3), y: 86, vx: rnd(-10, 10), vy: rnd(-16, -6), t: 0.6, max: 0.6, k: 'spark' });
  if (q.prog >= q.order.t) serve(q, 0);
  return true;
}
const sBtn = $('#serve');
sBtn.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (!started || paused) return;
  if (tapCounter()) {
    sBtn.classList.add('pop');
    setTimeout(() => sBtn.classList.remove('pop'), 70);
  }
});
sBtn.addEventListener('contextmenu', e => e.preventDefault());
let lastSrv = '';
function serveUI() {
  const q = queue[0];
  const on = !!(q && q.state === 'order');
  const p = on ? Math.min(100, Math.round((q.prog / q.order.t) * 100)) : 0;
  const rush = on && q.req && q.req.dl ? Math.max(0, Math.ceil(q.req.dl - T)) : -1;
  const lab = !on ? 'Servi' : rush >= 0 ? ICO.clock + ' ' + rush + 's' : q.special ? (q.req ? q.req.t : 'Speciale') : 'Servi';
  const k = on + '|' + p + '|' + lab;
  if (k === lastSrv) return;
  lastSrv = k;
  sBtn.classList.toggle('on', on);
  sBtn.classList.toggle('idle', !on);
  sBtn.classList.toggle('rush', rush >= 0);
  sBtn.style.setProperty('--p', p + '%');
  sBtn.querySelector('span').innerHTML = lab;
}
function goFS() {
  const d = document.documentElement,
    rq = d.requestFullscreen || d.webkitRequestFullscreen;
  if (rq && !document.fullscreenElement && !document.webkitFullscreenElement) {
    try {
      const p = rq.call(d, { navigationUI: 'hide' });
      if (p && p.then) p.then(lockO).catch(() => {});
    } catch (e) {}
  } else lockO();
}
function lockO() {
  try {
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
  } catch (e) {}
}
function offline() {
  if (!st.last) return;
  const el = Math.min(8 * 3600, (Date.now() - st.last) / 1000);
  if (el < 60) return;
  const f = baristaLv() > 0 ? (st.waiter > 0 ? 0.45 : 0.25) : 0.05;
  const v = Math.round((st.ips || 0) * el * f * (st.manager ? 1.2 : 1));
  if (v > 0) {
    st.coins += v;
    st.earned += v;
    st.runEarned += v;
    setTimeout(() => toast(`Mentre eri via: +${fmt(v)} monete`), 900);
  }
}
function begin() {
  $('#start').hidden = true;
  $('#hud').hidden = false;
  $('#serve').hidden = false;
  started = true;
  layout();
  if (!st.ds) startDay();
  else toast(`Bentornato · Giorno ${st.day}`);
  setTimeout(ensureKeyRegs, 2500);
  if (st.migrated) {
    st.migrated = 0;
    setTimeout(() => toast('Ho portato qui la tua partita precedente'), 1500);
  }
  offline();
  save();
  hud();
  if (st.served === 0) setTimeout(() => toast('Tocca il pulsante Servi (o il bancone) per servire. Trascina per guardarti intorno.'), 4200);
}
function showNaming() {
  $('#intro').hidden = true;
  $('#naming').hidden = false;
  $('#chips').innerHTML = '';
  SUGG.forEach(n => {
    const b = document.createElement('button');
    b.textContent = n;
    b.onclick = () => {
      $('#nameIn').value = n;
    };
    $('#chips').appendChild(b);
  });
}
$('#start').addEventListener('click', () => {
  if (!$('#intro').hidden) {
    goFS();
    initAudio();
    if (st.name) begin();
    else
      startCine(() => {
        $('#start').hidden = false;
        showNaming();
      });
  }
});
$('#dice').addEventListener('click', () => {
  $('#nameIn').value = pick(SUGG);
});
$('#openBtn').addEventListener('click', () => {
  st.name = $('#nameIn').value.trim() || pick(SUGG);
  goFS();
  begin();
  signFlick = 1.6;
  sfx('buzz');
  nameEgg(st.name);
});
$('#nameIn').addEventListener('keydown', e => {
  if (e.key === 'Enter') $('#openBtn').click();
});
if (st.name) $('#go').textContent = 'Continua';
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    save();
    if (AC) AC.suspend().catch(() => {});
  } else if (AC && started) AC.resume().catch(() => {});
});
addEventListener('pagehide', save);
addEventListener('resize', layout);
layout();
$('#icoH').innerHTML = ICO.heart;
$('#icoS').innerHTML = ICO.star;
$('#icoA').innerHTML = ICO.lamp;
$('#bSet').innerHTML = ICO.menu;
[
  ['bUp', 'up', 'Migliora'],
  ['bCli', 'book', 'Clienti'],
  ['bDay', 'cal', 'Giorno']
].forEach(([id, ic, l]) => ($('#' + id).innerHTML = `<span class="bi">${ICO[ic]}</span><span class="lbl">${l}</span>`));
$('#pclose').innerHTML = ICO.close;
$('#dice').innerHTML = ICO.dice;
window.__cafe = {
  ritual,
  FILI2,
  XS,
  XEPI,
  KEYS,
  ensureKeyRegs,
  socialAI,
  relScene,
  startDuo,
  playXS,
  xsFor,
  keyReg,
  FILI,
  startFilo,
  portrait,
  randPet,
  tapPet,
  newCust,
  petSocial,
  get catHissT() {
    return catHissT;
  },
  get people() {
    return people;
  },
  get scenes() {
    return scenes;
  },
  get st() {
    return st;
  },
  speed: 1,
  ARCS,
  CH,
  MENU,
  UP,
  slots,
  get cols() {
    return cols;
  },
  get counterX() {
    return counterX;
  },
  get camX() {
    return camX;
  },
  set camX(v) {
    camX = v;
  },
  get S() {
    return S;
  },
  get DPR() {
    return DPR;
  },
  get queue() {
    return queue;
  },
  get mini() {
    return mini;
  },
  openMini,
  miniDown,
  miniUp,
  finishMini,
  checkFlag,
  arcEnd,
  arcReq,
  EGGS,
  RARE,
  get cine() {
    return cine;
  },
  tryRare,
  get boostT() {
    return boostT;
  },
  get W() {
    return W;
  },
  panes,
  get CB() {
    return CB;
  },
  get signBox() {
    return signBox;
  }
};
let last = performance.now();
function frame(now) {
  let dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (cine) {
    cine.t += dt;
    T += dt;
    ambient(dt);
    if (cine.t >= CINE_T) endCine();
    if (cine) {
      drawCine();
      requestAnimationFrame(frame);
      return;
    }
  }
  const sp = window.__cafe.speed || 1;
  for (let i = 0; i < sp; i++) {
    T += dt;
    if (started) update(dt);
    else ambient(dt);
  }
  render();
  if (started) serveUI();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
