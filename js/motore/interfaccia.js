// Interfaccia: avvisi, minigiochi, Diario, pannelli e HUD.

let toastQ = [],
  toastOn = false;
function toast(t) {
  if (toastQ.length > 4) toastQ.shift();
  toastQ.push(t);
  if (!toastOn) nextToast();
}
function nextToast() {
  const t = toastQ.shift(),
    el = $('#toast');
  if (!t) {
    toastOn = false;
    el.classList.remove('on');
    return;
  }
  toastOn = true;
  el.innerHTML = toastIco(t) + pxText(esc(t));
  el.classList.add('on');
  setTimeout(() => {
    el.classList.remove('on');
    setTimeout(nextToast, 350);
  }, 3000);
}
function showModal(html, btns) {
  const b = $('#mbox');
  b.innerHTML = pxText(html) + '<div class="btns"></div>';
  const bw = b.querySelector('.btns');
  btns.forEach(o => {
    const e = document.createElement('button');
    e.textContent = o.t;
    if (o.id) e.id = o.id;
    if (o.big) e.className = 'big';
    e.onclick = o.fn;
    bw.appendChild(e);
  });
  $('#modal').hidden = false;
}
function hideModal() {
  $('#modal').hidden = true;
  paused = false;
}
function openChoice(c, sc) {
  choiceOpen = true;
  paused = true;
  const b = $('#mbox');
  b.innerHTML = `<h2>Cosa fai?</h2><p>${esc(c.q)}</p><div class="choice"></div>`;
  const w = b.querySelector('.choice');
  c.o.forEach(o => {
    const e = document.createElement('button');
    e.textContent = o.t;
    e.onclick = () => {
      const [k, v] = o.f.split('=');
      st.flags[k] = v;
      sc.lines.splice(sc.i, 0, ...o.r);
      sc.wait = false;
      sc.t = 0.3;
      choiceOpen = false;
      hideModal();
      save();
    };
    w.appendChild(e);
  });
  $('#modal').hidden = false;
}
// minigioco
let mini = null;
function mgKind(c) {
  if (c.req && c.req.mg) return c.req.mg;
  if (c.type === 'critico') return 'latte';
  const it = c.order,
    s = it.s;
  if (s === 'm') return it.id === 'capp' ? (Math.random() < 0.5 ? 'latte' : 'monta') : it.id === 'iced' ? 'shaker' : 'monta';
  if (s === 'v') return 'vetrina';
  if (s === 'k') return 'padella';
  return 'shaker';
}
function mgInfo(k, c) {
  const id = c.order.id;
  if (k === 'monta' && (id === 'caffe' || id === 'affo'))
    return {
      t: "Estrai l'espresso",
      x: 'Tieni premuto per estrarre, lascia quando la crema è nel verde. Tre tazzine.',
      b: 'Tieni premuto'
    };
  if (k === 'shaker') {
    const t = { matcha: 'Frusta il matcha', choc: 'Mescola la cioccolata', smooth: 'Frulla!', iced: 'Shakera il latte' }[id];
    if (t) return Object.assign({}, MGI.shaker, { t });
  }
  return MGI[k];
}
function openMini(c) {
  const k = mgKind(c),
    I = mgInfo(k, c);
  paused = true;
  mini = { c, k, round: 0, score: [], pos: 0, dir: 1, spd: 0.9, zone: [0, 0], raf: 0, done: false, hold: false, lock: false, arm: false };
  miniLast = 0;
  $('#mini').hidden = false;
  $('#mcan').hidden = true;
  $('#mopts').hidden = true;
  $('#mmeter').hidden = false;
  $('#mmeter').className = 'meter' + (k === 'padella' ? ' cook' : k === 'monta' ? ' heat' : '');
  $('#mfill').style.width = '0';
  $('#mneedle').hidden = k === 'shaker';
  $('#mtxt').textContent = I.x;
  $('#mtitle').textContent = (c.type === 'critico' ? I.t + ' per il critico' : I.t) + (c.req ? ' · ' + c.req.t : '');
  $('#mbtn').hidden = !I.b;
  document.querySelectorAll('#mdots i').forEach(i => (i.className = ''));
  $('#mdots').hidden = k === 'shaker';
  // pausa di "Pronto?": i tocchi che stavi facendo per servire non contano
  const mb = $('#mbtn'),
    m = mini;
  mb.textContent = 'Pronto…';
  mb.classList.add('wait');
  if (k === 'vetrina') {
    mb.classList.remove('wait');
    m.arm = true;
    vetrinaStart();
    return;
  }
  if (k === 'mano') {
    mb.classList.remove('wait');
    mb.textContent = I.b;
    manoStart(m);
    return;
  }
  newRound();
  $('#mneedle').style.left = 'calc(0% - 2px)';
  $('#mfill').style.width = '0';
  setTimeout(() => {
    if (mini !== m || m.done) return;
    m.arm = true;
    mb.classList.remove('wait');
    mb.textContent = I.b;
    sfx('tap');
    if (k === 'shaker') m.tEnd = performance.now() + 4000;
    miniLast = 0;
    miniLoop();
  }, 900);
}
function setZone() {
  const [a, b] = mini.zone;
  $('#mzone').style.left = a * 100 + '%';
  $('#mzone').style.width = (b - a) * 100 + '%';
}
function newRound() {
  const m = mini,
    k = m.k;
  m.pos = 0;
  m.dir = 1;
  m.hold = false;
  if (k === 'latte') {
    const zw = [0.3, 0.22, 0.15][m.round];
    const z0 = rnd(0.05, 0.95 - zw);
    m.zone = [z0, z0 + zw];
    m.spd = 0.9 + m.round * 0.35;
  } else if (k === 'monta') {
    const zw = [0.17, 0.13, 0.1][m.round];
    const z0 = rnd(0.45, 0.86 - zw);
    m.zone = [z0, z0 + zw];
    m.spd = 0;
  } else if (k === 'padella') {
    const zw = [0.17, 0.14, 0.11][m.round];
    const z0 = rnd(0.5, 0.7);
    m.zone = [z0, z0 + zw];
    m.spd = rnd(0.3, 0.38) + m.round * 0.09;
  } else if (k === 'shaker') {
    m.zone = [0.6, 0.8];
    m.tEnd = performance.now() + 4000;
  }
  setZone();
}
let miniLast = 0;
function miniLoop() {
  const m = mini;
  if (!m || m.done) return;
  const now = performance.now(),
    dt = Math.min(0.05, (now - (miniLast || now)) / 1000);
  miniLast = now;
  if (m.k === 'latte') {
    m.pos += m.dir * m.spd * dt;
    if (m.pos > 1) {
      m.pos = 1;
      m.dir = -1;
    }
    if (m.pos < 0) {
      m.pos = 0;
      m.dir = 1;
    }
  } else if (m.k === 'monta') {
    if (m.hold && !m.lock) {
      m.spd += dt * 0.55;
      m.pos += (0.16 + m.spd) * dt;
      if (m.pos >= 1) {
        m.pos = 1;
        m.hold = false;
        miniScore(0, 'Troppo! È bruciato.');
      }
    }
  } else if (m.k === 'padella') {
    if (!m.lock) {
      m.pos += m.spd * dt;
      if (m.pos >= 1) {
        m.pos = 1;
        miniScore(0, 'Bruciato!');
      }
    }
  } else if (m.k === 'shaker') {
    m.pos = Math.max(0, m.pos - dt * 0.22);
    const left = (m.tEnd - now) / 1000;
    if (left > 0) $('#mbtn').textContent = `Shake! ${left.toFixed(1).replace('.', ',')}s`;
    else {
      const p = m.pos,
        [a, b] = m.zone;
      miniEnd(p >= a && p <= b ? 2 : p >= a - 0.1 && p <= b + 0.1 ? 1 : 0);
      return;
    }
  }
  if (mini !== m || m.done) return;
  $('#mneedle').style.left = `calc(${m.pos * 100}% - 2px)`;
  $('#mfill').style.width = (m.k === 'padella' || m.k === 'latte' ? 0 : Math.min(100, m.pos * 100)) + '%';
  m.raf = requestAnimationFrame(miniLoop);
}
function miniScore(sc, msg) {
  const m = mini;
  m.score.push(sc);
  const dot = document.querySelectorAll('#mdots i')[m.round];
  if (dot) dot.className = sc === 2 ? 'ok' : sc === 1 ? 'mid' : '';
  sfx(sc === 2 ? 'good' : sc ? 'tap' : 'meh');
  if (msg) $('#mtxt').textContent = msg;
  m.round++;
  if (m.round < 3) {
    if (m.k === 'latte') newRound();
    else {
      m.lock = true;
      setTimeout(() => {
        if (mini === m && !m.done) {
          m.lock = false;
          newRound();
          $('#mtxt').textContent = mgInfo(m.k, m.c).x;
        }
      }, 500);
    }
    return;
  }
  const tot = m.score.reduce((x, y) => x + y, 0);
  miniEnd(tot >= 5 ? 2 : tot >= 3 ? 1 : 0);
}
function miniEnd(q) {
  const m = mini;
  m.done = true;
  $('#mbtn').classList.add('wait');
  setTimeout(() => $('#mbtn').classList.remove('wait'), 700);
  m.q = q;
  m.endT = performance.now();
  cancelAnimationFrame(m.raf);
  $('#mmeter').hidden = true;
  $('#mopts').hidden = true;
  $('#mbtn').hidden = false;
  if (m.k === 'mano') $('#mdraw').hidden = true;
  startResult(m); // animazione di quello che hai preparato
  $('#mtxt').innerHTML = pxText(q === 2 ? '★★★ ' : q === 1 ? '★★☆ ' : '★☆☆ ') + ' ' + esc(MGEND[m.k][q]);
  $('#mbtn').textContent = 'Servi';
}
function miniDown(e) {
  const m = mini;
  if (!m) return;
  initAudio();
  if (m.done) {
    if (performance.now() - m.endT > 700) finishMini();
    return;
  }
  if (m.k === 'mano') return manoDone();
  if (m.lock || !m.arm) return;
  const p = m.pos,
    [a, b] = m.zone;
  if (m.k === 'latte') miniScore(p >= a && p <= b ? 2 : p >= a - 0.07 && p <= b + 0.07 ? 1 : 0);
  else if (m.k === 'monta') {
    m.hold = true;
    m.spd = 0;
  } else if (m.k === 'padella') {
    const sc = p >= a && p <= b ? 2 : p >= a - 0.08 && p <= b + 0.05 ? 1 : 0;
    miniScore(sc, sc === 2 ? 'Perfetto!' : sc ? 'Quasi!' : p < a ? 'Ancora crudo...' : 'Troppo cotto...');
  } else if (m.k === 'shaker') {
    m.pos = Math.min(1.05, m.pos + 0.075);
    if (Math.random() < 0.4) sfx('tap');
  } else if (m.k === 'vetrina') {
    const bt = e.target.closest && e.target.closest('#mopts button');
    if (bt && m.phase === 'pick') vetrinaPick(+bt.dataset.i);
  }
}
function miniUp() {
  const m = mini;
  if (!m || m.done || m.k !== 'monta' || !m.hold || m.lock) return;
  m.hold = false;
  const p = m.pos,
    [a, b] = m.zone;
  const sc = p >= a && p <= b ? 2 : p >= a - 0.07 && p <= b + 0.07 ? 1 : 0;
  miniScore(sc, sc === 2 ? 'Perfetto!' : sc ? 'Quasi!' : p < a ? 'Troppo presto...' : 'Troppo tardi...');
}
function vetrinaStart() {
  const m = mini;
  $('#mmeter').hidden = true;
  m.seq = [];
  while (m.seq.length < 3) {
    const i = ri(0, SWEETS.length - 1);
    if (i !== m.seq[m.seq.length - 1]) m.seq.push(i);
  }
  m.phase = 'show';
  m.pi = 0;
  const o = $('#mopts');
  o.innerHTML = SWEETS.map((x, i) => `<button data-i="${i}">${x[0]}<small>${x[1]}</small></button>`).join('');
  let i = 0;
  const step = () => {
    if (mini !== m) return;
    if (i < m.seq.length) {
      const x = SWEETS[m.seq[i]];
      $('#mtxt').innerHTML = `<span class="big-ic">${x[0]}</span>${i + 1}/3 · ${x[1]}`;
      sfx('tap');
      i++;
      setTimeout(step, 950);
    } else {
      m.phase = 'pick';
      $('#mtxt').textContent = 'Ora tocca i dolci nello stesso ordine.';
      o.hidden = false;
    }
  };
  setTimeout(step, 700);
}
function vetrinaPick(i) {
  const m = mini,
    ok = m.seq[m.pi] === i;
  const dot = document.querySelectorAll('#mdots i')[m.pi];
  if (dot) dot.className = ok ? 'ok' : '';
  sfx(ok ? 'good' : 'meh');
  m.score.push(ok ? 1 : 0);
  m.pi++;
  if (!ok || m.pi >= 3) {
    const n = m.score.filter(x => x).length;
    miniEnd(n >= 3 ? 2 : n >= 2 ? 1 : 0);
  }
}
function finishMini() {
  const m = mini;
  stopResult();
  manoStop();
  mini = null;
  miniLast = 0;
  $('#mini').hidden = true;
  paused = false;
  if (m.c && queue[0] === m.c) {
    m.c.prog = m.c.order.t;
    serve(m.c, m.q);
  }
}
// solo il pulsante del minigioco (o i dolci della vetrina) accetta i tocchi: niente errori per un tocco a caso sullo schermo
$('#mini').addEventListener('pointerdown', e => {
  e.preventDefault();
  const t = e.target.closest && e.target.closest('#mbtn,#mopts button');
  if (!t || t.classList.contains('wait')) return;
  miniDown(e);
});
['pointerup', 'pointercancel'].forEach(ev => window.addEventListener(ev, miniUp));
/* ----- ritratti e lettore del Diario ----- */
const PORT = {};
function portrait(look) {
  const k = JSON.stringify(look);
  if (PORT[k]) return PORT[k];
  const c = document.createElement('canvas');
  c.width = 12;
  c.height = 22;
  const old = g;
  g = c.getContext('2d');
  try {
    drawPerson({ look, face: 1, state: 'stand', x: 6, y: 21, moving: false, wt: 0, act: '', bub: null, emo: null });
  } catch (e) {}
  g = old;
  return (PORT[k] = c.toDataURL());
}
let rd = null;
function arcPages(arc) {
  const k = st.story[arc.id] || 0;
  return arc.ch.slice(0, k).map((ch, i) => {
    const who = chapterWho(arc, ch);
    const out = [];
    ch.l.forEach(l => {
      if (Array.isArray(l)) {
        if (!l[2] || checkFlag(l[2])) out.push([CH[who[l[0]]].n, l[1]]);
      } else if (l && l.c) {
        const o = l.c.o.find(o => checkFlag(o.f));
        if (o) {
          out.push({ you: o.t });
          o.r.forEach(x => out.push([CH[who[x[0]]].n, x[1]]));
        }
      }
    });
    const last = i === arc.ch.length - 1 && k >= arc.ch.length;
    return {
      t: ch.t,
      who: who.map(w => ({ n: CH[w].n, look: CH[w].l })),
      lines: out,
      end: last
        ? (() => {
            const E = arcEnd(arc);
            return (E.n ? 'Finale «' + E.n + '» · ' : 'Storia completata · ') + E.pt;
          })()
        : ''
    };
  });
}
function filoPages(e) {
  return e.log.map((b, i) => ({
    t: e.t + (e.log.length > 1 ? ' · ' + (i + 1) : ''),
    who: e.look2
      ? [
          { n: e.n1, look: e.look },
          { n: e.n2, look: e.look2 }
        ]
      : [{ n: e.n, look: e.look }],
    lines: (() => {
      const L = b.l.map(x => (Array.isArray(x) ? x : [e.n, x]));
      if (b.ch) L.splice(b.at > 0 ? b.at : L.length, 0, { you: b.ch });
      return L;
    })(),
    end: i === e.log.length - 1 && e.e ? e.n + ' ' + e.e + '.' : ''
  }));
}
function openReader(title, sub, pages, i) {
  if (!pages.length) return;
  rd = { title, sub, pages, i: clamp(i || 0, 0, pages.length - 1) };
  $('#reader').hidden = false;
  paused = true;
  renderReader();
}
function renderReader() {
  const P = rd.pages[rd.i];
  $('#rport').innerHTML = P.who
    .map(w => `<figure><img alt="" src="${portrait(w.look)}"><figcaption>${esc(w.n)}</figcaption></figure>`)
    .join('');
  $('#rtitle').textContent = P.t;
  $('#rsub').textContent = rd.title + (rd.sub ? ' · ' + rd.sub : '');
  $('#rdots').innerHTML = rd.pages.length > 1 ? rd.pages.map((_, j) => `<i class="${j === rd.i ? 'on' : ''}"></i>`).join('') : '';
  $('#rtext').innerHTML =
    P.lines
      .map(l =>
        l.you
          ? `<div class="you">Tu: ${esc(l.you)}</div>`
          : `<p class="${l[1][0] === '*' ? 'act' : ''}"><b>${esc(l[0])}</b><span>${esc(l[1])}</span></p>`
      )
      .join('') + (P.end ? `<div class="end">${pxText(esc(P.end))}</div>` : '');
  $('#rtext').parentElement.scrollTop = 0;
  $('#rprev').disabled = rd.i <= 0;
  $('#rnext').disabled = rd.i >= rd.pages.length - 1;
}
function closeReader() {
  rd = null;
  $('#reader').hidden = true;
  paused = false;
}
$('#rprev').addEventListener('click', () => {
  if (rd && rd.i > 0) {
    rd.i--;
    renderReader();
    sfx('tap');
  }
});
$('#rnext').addEventListener('click', () => {
  if (rd && rd.i < rd.pages.length - 1) {
    rd.i++;
    renderReader();
    sfx('tap');
  }
});
$('#rclose').addEventListener('click', closeReader);
$('#reader').addEventListener('click', e => {
  if (e.target.id === 'reader') closeReader();
});
let rdX = null;
$('#reader').addEventListener('pointerdown', e => {
  rdX = e.clientX;
});
$('#reader').addEventListener('pointerup', e => {
  if (rdX == null || !rd) return;
  const dx = e.clientX - rdX;
  rdX = null;
  if (Math.abs(dx) > 60) {
    if (dx < 0) $('#rnext').click();
    else $('#rprev').click();
  }
});
/* ----- consigli: il pannello Migliora suggerisce cosa serve davvero ----- */
function nextChapter() {
  let best = null;
  for (const arc of ARCS) {
    if (!arcReq(arc)) continue;
    const k = st.story[arc.id] || 0;
    if (k >= arc.ch.length) continue;
    const r = arc.ch[k].r;
    if (!best || r < best.r) best = { arc, r };
  }
  return best;
}
function canUp(u) {
  return !u.max() && !(u.lock && u.lock());
}
function advice() {
  const U = id => UP.find(u => u.id === id),
    ok = u => u && canUp(u),
    a = atm(),
    nc = nextChapter();
  const dirty = allSeats().filter(x => x.dirty).length,
    free = freeSeats().length;
  if (queue.length >= 3 && ok(U('barista'))) return { u: U('barista'), why: 'La fila al bancone è lunga: serve un barista in più.' };
  if (dirty >= 3 && ok(U('waiter'))) return { u: U('waiter'), why: 'Ci sono tavoli sporchi: un cameriere li pulisce da solo.' };
  if (free === 0 && queue.length >= 2) {
    if (ok(U('tables'))) return { u: U('tables'), why: 'Tutti i posti sono occupati: aggiungi un tavolo.' };
    if (ok(U('space'))) return { u: U('space'), why: 'Il locale è pieno: è ora di espandere la sala.' };
  }
  if (nc && nc.r > a) {
    const cands = ['decor', 'chairs', 'music', 'stove', 'cat']
      .map(U)
      .filter(ok)
      .sort((x, y) => x.c() - y.c());
    if (cands[0]) return { u: cands[0], why: `Mancano ${nc.r - a} di Atmosfera per il prossimo capitolo di «${nc.arc.t}».` };
  }
  if (baristaLv() === 0 && ok(U('barista'))) return { u: U('barista'), why: 'Un barista serve i clienti anche quando non tocchi.' };
  const cheap = UP.filter(ok).sort((x, y) => x.c() - y.c())[0];
  return cheap ? { u: cheap, why: 'Il miglioramento più conveniente adesso.' } : null;
}
function tipHTML() {
  const A = advice();
  if (!A) return '';
  const c = A.u.c(),
    can = st.coins >= c;
  return `<div class="card2 tip"><h3>Consiglio<small>${A.u.tab}</small></h3><p class="ad">${esc(A.why)}</p><div class="who" style="justify-content:space-between"><b style="font-weight:500">${UPI[A.u.id] ? `<i class="ui">${UPI[A.u.id]}</i>` : ''}${A.u.n()}</b><button data-go="${A.u.id}">${can ? 'Compra ' + coinB(c) : 'Vai · ' + coinB(c)}</button></div></div>`;
}
let recId = null;
/* ----- pannelli ----- */
const UP = [
  {
    tab: 'Locale',
    id: 'tables',
    n: () => 'Nuovo tavolo',
    d: () => `${st.tables} tavoli · ${st.tables * 2} posti`,
    c: () => Math.round(15 * Math.pow(1.7, st.tables - 1)),
    max: () => st.tables >= 14,
    lock: () => (st.tables >= st.space * 2 ? 'Espandi' : ''),
    b: () => st.tables++
  },
  {
    tab: 'Locale',
    id: 'space',
    n: () => 'Espandi il locale',
    d: () => `Sala ${st.space}/7 · sgombera altri 2 tavoli`,
    c: () => [0, 120, 700, 3500, 15000, 60000, 220000][st.space] || 0,
    max: () => st.space >= 7,
    b: () => {
      st.space++;
      layout();
    }
  },
  {
    tab: 'Locale',
    id: 'chairs',
    n: () => CHAIRN[st.chairs + 1] || CHAIRN[6],
    lv: () => st.chairs,
    d: () => 'Restano di più, sono più felici, +Atmosfera',
    c: () => Math.round(40 * Math.pow(3, st.chairs)),
    max: () => st.chairs >= 6,
    b: () => st.chairs++
  },
  {
    tab: 'Locale',
    id: 'neon',
    n: () => 'Insegna più luminosa',
    lv: () => st.neon,
    d: () => 'Arrivano clienti più spesso',
    c: () => Math.round(50 * Math.pow(2.3, st.neon)),
    max: () => st.neon >= 10,
    b: () => st.neon++
  },
  {
    tab: 'Locale',
    id: 'wifi',
    n: () => ['Wi-fi gratis', 'Wi-fi veloce', 'Fibra ottica'][st.wifi] || 'Wi-fi al massimo',
    lv: () => st.wifi,
    d: () => 'Più studenti, che restano (e ordinano) più a lungo',
    c: () => Math.round(300 * Math.pow(4, st.wifi)),
    max: () => st.wifi >= 3,
    b: () => st.wifi++
  },
  {
    tab: 'Arredo',
    id: 'decor',
    n: () => DECN[st.decor] || 'Arredamento completo',
    lv: () => st.decor,
    d: () => '+Atmosfera, mance più alte',
    c: () => Math.round(70 * Math.pow(2.6, st.decor)),
    max: () => st.decor >= 8,
    b: () => st.decor++
  },
  {
    tab: 'Arredo',
    id: 'music',
    n: () => ['Giradischi lofi', 'Vinili jazz', 'Vinili city pop', 'Impianto vintage'][st.music] || 'Musica completa',
    lv: () => st.music,
    d: () => (st.music ? 'Più melodia, clienti più felici' : 'Accende la musica lofi'),
    c: () => Math.round(180 * Math.pow(3.2, st.music)),
    max: () => st.music >= 4,
    b: () => {
      st.music++;
      if (st.music === 1) toast('Il giradischi gira: musica lofi accesa');
    }
  },
  {
    tab: 'Arredo',
    id: 'stove',
    n: () => 'Stufa a legna',
    d: () => '+6 Atmosfera. Con pioggia, neve e di sera i clienti sono più felici',
    c: () => 1200,
    max: () => st.stove >= 1,
    b: () => {
      st.stove = 1;
      toast('La stufa scoppietta: si sta benissimo');
    }
  },
  {
    tab: 'Arredo',
    id: 'umbr',
    n: () => 'Portaombrelli e asciugamani',
    d: () => 'Quando piove o nevica i clienti aspettano in fila molto più a lungo',
    c: () => 350,
    max: () => st.umbr >= 1,
    b: () => (st.umbr = 1)
  },
  {
    tab: 'Arredo',
    id: 'cat',
    n: () => 'Adotta un gatto',
    d: () => 'Dorme sul bancone. Toccalo! +8 Atmosfera',
    c: () => 450,
    max: () => st.cat >= 1,
    b: () => {
      st.cat = 1;
      toast('Il gatto ha scelto il suo posto sul bancone');
    }
  },
  {
    tab: 'Staff',
    id: 'barista',
    n: () => (baristaLv() ? 'Barista più esperti' : 'Assumi un barista'),
    lv: () => st.barista,
    d: () => `Servono da soli · ${baristaRate().toFixed(1).replace('.', ',')} ordini/s`,
    c: () => Math.round(60 * Math.pow(2.05, st.barista)),
    max: () => st.barista >= 15,
    b: () => st.barista++
  },
  {
    tab: 'Staff',
    id: 'waiter',
    n: () => (st.waiter ? 'Camerieri più veloci' : 'Assumi un cameriere'),
    lv: () => st.waiter,
    d: () => 'Puliscono i tavoli, +mance',
    c: () => Math.round(90 * Math.pow(2.15, st.waiter)),
    max: () => st.waiter >= 10,
    b: () => st.waiter++
  },
  {
    tab: 'Staff',
    id: 'cook',
    n: () => (st.cook ? 'Cuoco più bravo' : 'Assumi un cuoco'),
    lv: () => st.cook,
    d: () => (st.cook ? 'Prepara i piatti della cucina più in fretta' : 'Apre la cucina: toast, pancake, ramen'),
    c: () => Math.round(1500 * Math.pow(2.3, st.cook)),
    max: () => st.cook >= 8,
    b: () => {
      st.cook++;
      if (st.cook === 1) toast('La cucina è aperta!');
    }
  },
  {
    tab: 'Staff',
    id: 'manager',
    n: () => ['Assumi una manager', 'Manager: acquisti automatici', 'Manager esperta'][st.manager] || 'Manager al massimo',
    lv: () => st.manager,
    d: () =>
      [
        'Riscuote gli obiettivi e fa aspettare di più chi vuole un ordine speciale',
        'Compra da sola i miglioramenti più economici',
        'Compra più spesso'
      ][st.manager] || 'Gestisce tutto lei',
    c: () => [3000, 25000, 150000][st.manager] || 0,
    max: () => st.manager >= 3,
    b: () => st.manager++
  },
  {
    tab: 'Staff',
    id: 'grinder',
    n: () =>
      ['Macinino a mano', 'Macinino elettrico', 'Macinino professionale', 'Macinino da campionato'][st.grinder] || 'Macinino perfetto',
    lv: () => st.grinder,
    d: () => 'Ogni tuo tocco al bancone vale il 25% in più',
    c: () => Math.round(120 * Math.pow(3, st.grinder)),
    max: () => st.grinder >= 4,
    b: () => st.grinder++
  },
  {
    tab: 'Staff',
    id: 'machine',
    n: () => 'Macchina espresso',
    lv: () => st.machine,
    d: () => 'Tocchi e baristi servono più in fretta',
    c: () => Math.round(30 * Math.pow(2, st.machine)),
    max: () => st.machine >= 12,
    b: () => st.machine++
  },
  {
    tab: 'Menu',
    id: 'menu',
    n: () => (MENU[st.menu] ? 'Nel menu: ' + MENU[st.menu].n : 'Menu completo'),
    d: () =>
      MENU[st.menu]
        ? `Si vende a ${fmt(priceOf(MENU[st.menu]))} monete${MENU[st.menu].s === 'k' ? ' · piatto di cucina' : ''}`
        : 'Hai tutto, dal caffè al ramen',
    c: () => (MENU[st.menu] ? MENU[st.menu].c : 0),
    max: () => st.menu >= MENU.length,
    lock: () => (MENU[st.menu] && MENU[st.menu].s === 'k' && !st.cook ? 'Serve un cuoco' : ''),
    b: () => st.menu++
  },
  {
    tab: 'Menu',
    id: 'vetrina',
    n: () => ['Vetrina dei dolci', 'Vetrina refrigerata', 'Pasticceria di lusso'][st.vetrina] || 'Vetrina al completo',
    lv: () => st.vetrina,
    d: () => 'Cornetti, torte e tiramisù costano il 15% in più',
    c: () => Math.round(800 * Math.pow(4, st.vetrina)),
    max: () => st.vetrina >= 3,
    lock: () => (st.menu < 3 ? 'Serve il cornetto' : ''),
    b: () => st.vetrina++
  },
  {
    tab: 'Menu',
    id: 'lav',
    n: () => 'Lavagna del piatto del giorno',
    d: () => {
      const d = dailyItem();
      return st.lav ? `Oggi: ${d ? d.n : '—'} (+60% sul prezzo)` : 'Ogni giorno un prodotto del menu costa il 60% in più';
    },
    c: () => 2500,
    max: () => st.lav >= 1,
    lock: () => (st.menu < 3 ? 'Servono 3 prodotti' : ''),
    b: () => {
      st.lav = 1;
      const d = dailyItem();
      if (d) toast(`Piatto del giorno: ${d.n}`);
    }
  }
];
const TABS = {
  up: ['Locale', 'Arredo', 'Staff', 'Menu', 'Stili', 'Franchising'],
  cli: ['Storie', 'Vite', 'Habitué', 'Legami', 'Giornale', 'Recensioni', 'Segreti']
};
let panel = null,
  tab = null;
function openPanel(p) {
  if (panel === p) {
    closePanel();
    return;
  }
  panel = p;
  tab = TABS[p] ? TABS[p][0] : null;
  if (p === 'cli' && st.newStory) {
    st.newStory = 0;
  }
  $('#panel').classList.add('open');
  renderPanel();
}
function closePanel() {
  panel = null;
  $('#panel').classList.remove('open');
}
const coinB = c => `<i class="coin"></i>${fmt(c)}`;
function upRow(u) {
  const mx = u.max(),
    lk = u.lock ? u.lock() : '',
    c = u.c(),
    lv = u.lv ? `<span class="lv">Liv. ${u.lv()}</span>` : '';
  const ic = UPI[u.id] ? `<i class="ui">${UPI[u.id]}</i>` : '';
  return `<div class="row${ic ? ' ico' : ''}${u.id === recId ? ' rec' : ''}">${ic}<b>${u.n()}${lv}</b><span>${u.d()}</span><button data-u="${u.id}" ${mx || lk || st.coins < c ? 'disabled' : ''}>${mx ? 'Fatto' : lk ? lk : coinB(c)}</button></div>`;
}
// scheda Stili: personalizzazione della macchina del caffè, con anteprima
function machHTML() {
  const row = (id, n, d, own, on, c, kind) =>
    `<div class="row"><b>${n}</b><span>${d}</span><button data-${kind}="${id}" ${on && kind !== 'ma' ? 'disabled' : !own && st.coins < c ? 'disabled' : ''}>${
      own ? (kind === 'ma' ? (on ? 'Nascondi' : 'Mostra') : on ? 'In uso' : 'Usa') : coinB(c)
    }</button></div>`;
  const cfg = machCfg();
  return (
    `<div class="card2 mach"><h3>La tua macchina del caffè<small>+${machAtm()} Atmosfera</small></h3><img alt="Anteprima della macchina" src="${machPreview(cfg)}"><p class="ad">Finiture, adesivi e accessori. Ogni oggetto comprato dà +1 Atmosfera.</p></div>` +
    `<p class="note">Finitura</p>` +
    MACH.fin
      .map(f =>
        row(f.id, f.n, f.c ? 'Una nuova veste' : 'Quella di sempre', (st.mfinOwn || []).includes(f.id), st.mfin === f.id, f.c, 'mf')
      )
      .join('') +
    `<p class="note">Adesivo</p>` +
    row('', 'Nessun adesivo', 'Macchina pulita', true, !st.mdec, 0, 'md') +
    MACH.dec
      .map(f => row(f.id, f.n, 'Sul fianco della macchina', (st.mdecOwn || []).includes(f.id), st.mdec === f.id, f.c, 'md'))
      .join('') +
    `<p class="note">Accessori</p>` +
    MACH.acc.map(f => row(f.id, f.n, f.d, (st.macc || []).includes(f.id), !(st.maccOff || []).includes(f.id), f.c, 'ma')).join('')
  );
}
// scheda Stili: insegne al neon da comprare e installare sui muri
function neonHTML() {
  const slots = wallSlots(),
    at = st.neonAt || {},
    where = id => Object.keys(at).find(k => at[k] === id && slots.some(s => s.id === k));
  return (
    `<p class="note">Insegne al neon da parete. Comprale e scegli dove installarle: +1 Atmosfera ognuna, +1 in più quando è accesa sul muro. Toccale per farle ronzare.</p>` +
    NEONS.map(N => {
      const own = (st.neonOwn || []).includes(N.id),
        sz = neonSize(N),
        w = where(N.id);
      const opts = slots
        .filter(S => neonFit(N, S))
        .map(S => {
          const busy = at[S.id] && at[S.id] !== N.id ? NEONS.find(x => x.id === at[S.id]) : null;
          return `<option value="${S.id}" ${w === S.id ? 'selected' : ''}>${S.n}${busy ? ' (al posto di: ' + busy.n + ')' : ''}</option>`;
        })
        .join('');
      return `<div class="row neon"><b><img alt="" src="${neonImg(N)}" style="filter:drop-shadow(0 0 4px ${N.col})">${N.n}</b><span>${own ? (w ? 'Accesa sul muro' : 'In magazzino') : 'Insegna al neon'}</span>${
        own
          ? `<select data-ns="${N.id}" aria-label="Dove installare ${N.n}"><option value="">In magazzino</option>${opts}</select>`
          : `<button data-nb="${N.id}" ${st.coins < N.c ? 'disabled' : ''}>${coinB(N.c)}</button>`
      }</div>`;
    }).join('')
  );
}
function tabHTML() {
  if (tab === 'Stili')
    return (
      `<p class="note">Cambia lo stile del locale. Ogni stile comprato dà +2 Atmosfera per sempre.</p>` +
      Object.entries(THEMES)
        .map(([k, t]) => {
          const own = st.themes.includes(k),
            on = st.theme === k;
          return `<div class="row"><b>${t.n}</b><span>${on ? 'In uso' : own ? 'Comprato' : 'Nuovo stile'}</span><button data-th="${k}" ${on || (!own && st.coins < t.c) ? 'disabled' : ''}>${on ? 'In uso' : own ? 'Usa' : coinB(t.c)}</button></div>`;
        })
        .join('') +
      machHTML() +
      neonHTML()
    );
  if (tab === 'Franchising') {
    const ok = st.space >= 7 && st.runEarned >= 500000,
      stars = Math.max(1, Math.floor(Math.sqrt(st.runEarned / 250000)));
    return (
      `<p class="note">Apri una nuova caffetteria in un altro quartiere. Ricominci da un locale piccolo, ma tieni cuori, storie, habitué, stili, e guadagni stelle che aumentano per sempre incassi e clienti (+50% a stella).</p><div class="card2"><h3>Stelle franchising<small>${st.frStars} ★</small></h3><p class="ad">Quartiere attuale: ${DIST[st.district].n}. Guadagnato in questo locale: ${fmt(st.runEarned)} / 500k. Sala: ${st.space}/7.</p></div>` +
      Object.entries(DIST)
        .filter(([k]) => k !== st.district)
        .map(
          ([k, d]) =>
            `<div class="row"><b>${d.n}</b><span>${d.d}</span><button data-fr="${k}" ${ok ? '' : 'disabled'}>${ok ? `+${stars} ★` : 'Non ancora'}</button></div>`
        )
        .join('')
    );
  }
  const A = advice();
  recId = A ? A.u.id : null;
  return (
    (['Locale', 'Arredo', 'Staff', 'Menu'].includes(tab) ? tipHTML() : '') +
    (st.manager >= 2 && tab === 'Staff'
      ? `<div class="row"><b>Acquisti automatici</b><span>La manager compra il miglioramento più economico</span><button data-auto="1">${st.autoBuy ? 'Attivi' : 'Spenti'}</button></div>`
      : '') +
    UP.filter(u => u.tab === tab)
      .map(upRow)
      .join('') +
    (tab === 'Menu' ? labHTML() : '')
  );
}
// laboratorio delle ricette: scegli fino a tre ingredienti e prova
let labSel = [];
const labCost = () => Math.round(Math.max(25, incomeRef() * 25));
const labOpen = () => st.menu >= 3;
function labHTML() {
  if (!labOpen())
    return `<div class="card2"><h3>Laboratorio<small>chiuso</small></h3><p class="ad">Si apre quando nel menu c'è il cappuccino.</p></div>`;
  const got = st.recipes || [],
    c = labCost();
  return (
    `<div class="card2 lab"><h3>Laboratorio<small>${got.length}/${RICETTE.length} ricette</small></h3><p class="ad">Scegli fino a tre ingredienti e prova. Se la combinazione è giusta, la bevanda entra nel menu e i clienti la ordinano. Se sbagli, ti do un indizio.</p><div class="ingr">` +
    Object.entries(INGR)
      .map(([k, g]) => `<button data-ing="${k}" class="${labSel.includes(k) ? 'on' : ''}">${pxSvg(g.r, g.p)}<small>${g.n}</small></button>`)
      .join('') +
    `</div><div class="who" style="justify-content:space-between;margin-top:8px"><span class="ad" style="margin:0">${labSel.length ? labSel.map(k => INGR[k].n).join(' + ') : 'Nessun ingrediente'}</span><button data-lab="1" ${!labSel.length || st.coins < c ? 'disabled' : ''}>Prova · ${coinB(c)}</button></div></div>` +
    `<p class="note">Ricettario</p>` +
    RICETTE.map(r =>
      got.includes(r.id)
        ? `<div class="row"><b>${r.n.charAt(0).toUpperCase() + r.n.slice(1)}</b><span>${r.ing.map(k => INGR[k].n).join(' + ')} · si vende a ${fmt(priceOf(r))}</span><button disabled>Nel menu</button></div>`
        : ''
    ).join('') +
    (got.length < RICETTE.length
      ? `<div class="lock"><span>Ancora ${RICETTE.length - got.length} ricette da scoprire</span><small>???</small></div>`
      : '')
  );
}
function labTry() {
  const c = labCost();
  if (!labSel.length || st.coins < c) return;
  st.coins -= c;
  const sel = labSel.slice().sort(),
    same = r =>
      r.ing.length === sel.length &&
      r.ing
        .slice()
        .sort()
        .every((x, i) => x === sel[i]),
    hit = RICETTE.find(same),
    got = (st.recipes = st.recipes || []);
  let html;
  if (hit && !got.includes(hit.id)) {
    got.push(hit.id);
    st.hearts++;
    sfx('story');
    logB(`Nuova ricetta del laboratorio: ${hit.n}`);
    html = `<h2>Nuova ricetta!</h2><p><b>${hit.a} ${hit.n}</b>. Da adesso è nel menu: si vende a ${fmt(priceOf(hit))} monete. ♥ +1</p>`;
    if (got.length >= RICETTE.length) egg('ricettario');
    labSel = [];
  } else if (hit) {
    sfx('tap');
    html = `<h2>La conosci già</h2><p>È il tuo ${hit.n}: lo hai già nel menu.</p>`;
  } else {
    sfx('meh');
    // l'indizio: la ricetta non ancora scoperta più vicina a quello che hai provato
    const near = RICETTE.filter(r => !got.includes(r.id))
      .map(r => ({ r, inn: sel.filter(x => r.ing.includes(x)).length }))
      .map(o => Object.assign(o, { miss: o.r.ing.length - o.inn }))
      .sort((a, b) => b.inn - a.inn || a.miss - b.miss)[0];
    let hint = "Mmh... non sa di niente di speciale. Prova un'altra combinazione.";
    if (near && near.inn >= 1) {
      const miss = near.r.ing.filter(x => !sel.includes(x)),
        extra = sel.filter(x => !near.r.ing.includes(x));
      if (!miss.length && extra.length) hint = "Ci sei quasi, ma c'è un ingrediente di troppo.";
      else if (miss.length === 1 && !extra.length) hint = `Ci sei quasi! Manca qualcosa ${INGR[miss[0]].h}.`;
      else if (miss.length === 1) hint = `Sei sulla buona strada: togli qualcosa e aggiungi qualcosa ${INGR[miss[0]].h}.`;
      else {
        const good = sel.filter(x => near.r.ing.includes(x)).map(k2 => INGR[k2].n.toLowerCase());
        hint =
          good.length > 1
            ? `Qualcosa di buono c'è: ${good.join(' e ')} stanno bene insieme.`
            : `Con ${good[0]} si può fare qualcosa di buono... ma non così.`;
      }
    }
    html = `<h2>Non ancora...</h2><p>${hint}</p>`;
  }
  showModal(html, [{ t: 'Ok', big: 1, fn: () => (hideModal(), renderPanel()) }]);
  save();
}
function cliHTML() {
  const a = atm();
  if (tab === 'Storie') {
    const nc = nextChapter();
    return (
      `<p class="note">Atmosfera: <b>${a}</b>${nc ? ` · prossimo capitolo a <b>${nc.r}</b> («${nc.arc.t}»)` : ''}. Tocca un capitolo per rileggerlo come un libro.</p>` +
      ARCS.map(arc => {
        const k = st.story[arc.id] || 0;
        if (!arcReq(arc)) {
          const need = []
            .concat(arc.req)
            .map(r =>
              r
                .split('|')
                .map(x => {
                  const [id, v] = x.split('=');
                  return '«' + ARCS.find(y => y.id === id).t + '»' + (v ? ' con un certo finale' : '');
                })
                .join(' o ')
            )
            .join(' e ');
          return `<div class="card2"><h3>???<small>bloccata</small></h3><p class="ad">Completa prima ${need}.</p></div>`;
        }
        const who = [...new Set(arc.ch.slice(0, Math.max(1, k)).flatMap(c => c.who || arc.who))].slice(0, 3);
        return (
          `<div class="card2"><h3><span class="who">${k ? who.map(w => `<img alt="" src="${portrait(CH[w].l)}">`).join('') : ''}${arc.t}</span><small>${k}/${arc.ch.length}</small></h3><p class="ad">${arc.d}</p>${arc.nota && k ? `<p class="ad" style="color:var(--cyan)">${esc(arc.nota)}</p>` : ''}<div class="bar"><i style="width:${(k / arc.ch.length) * 100}%"></i></div>` +
          arc.ch
            .map((ch, i) => {
              if (i < k)
                return `<button class="chap" data-rd="${arc.id}" data-i="${i}"><span>${i + 1}. ${ch.t}</span><small>Leggi ${ICO.dx}</small></button>`;
              if (i === k)
                return `<div class="lock"><span>${i + 1}. ???</span><small>${arc.rand && i === 0 ? "Un giorno qualunque, all'improvviso" : arc.rand || arc.gap ? 'Tra qualche giorno…' : a >= ch.r ? 'Succederà presto…' : 'Atmosfera ' + a + '/' + ch.r}</small></div>`;
              return `<div class="lock"><span>${i + 1}. ???</span></div>`;
            })
            .join('') +
          (k >= arc.ch.length
            ? (() => {
                const E = arcEnd(arc);
                return `<div class="done">Completata${E.n ? ' · finale «' + E.n + '»' : ''} · ${E.pt}</div>`;
              })()
            : `<div class="note" style="margin:6px 0 0;font-size:12px">Premio finale: ${arc.end ? 'dipende dalle tue scelte (' + Object.keys(arc.end).length + ' finali)' : arc.pt}</div>`) +
          '</div>'
        );
      }).join('')
    );
  }
  if (tab === 'Vite') {
    const act = st.regs.filter(r => r.fl && r.fl.log && r.fl.log.length),
      // il mondo che va avanti da solo: quartiere, storie nate da sole, sogni inseguiti
      mondo = (() => {
        const Q = qzDi(),
          TA = (st.tr || []).filter(T => T.log.length),
          TF = st.trF || [],
          PJ = st.pjLog || [];
        const tn = T => (TRAME.find(x => x.id === T.id) || {}).t || '';
        return (
          (Q ? `<p class="note">Nel quartiere: <b>${esc(Q.t)}</b>. ${esc(Q.n)}</p>` : '') +
          (TA.length || TF.length
            ? `<div class="card2"><h3>Storie nate da sole<small>${TF.length}</small></h3>${TA.map(
                T =>
                  `<button class="chap" data-tra="${T.u}"><span class="who">${T.log[0].who.map(w => `<img alt="" src="${portrait(w.look)}">`).join('')}${esc(tn(T))}</span><small>continua… ›</small></button>`
              ).join('')}${TF.map(
                (T, i) =>
                  `<button class="chap" data-trf="${i}"><span class="who">${(T.log[0] ? T.log[0].who : []).map(w => `<img alt="" src="${portrait(w.look)}">`).join('')}${esc(T.t)}</span><small>giorno ${T.d} ›</small></button>`
              ).join('')}</div>`
            : '') +
          (PJ.length
            ? `<div class="card2"><h3>Sogni inseguiti<small>${PJ.length}</small></h3>${PJ.map(
                p =>
                  `<div class="rev">${esc(p.n)} · ${esc(p.t)} <small>· ${p.ok ? 'ce l’ha fatta ♥' : 'non è andata, per ora'} · giorno ${p.d}</small></div>`
              ).join('')}</div>`
            : '')
        );
      })(),
      done = st.fdone || [],
      ready = st.regs.filter(r => !r.fl && r.f >= 3).length;
    return (
      `<p class="note">Le vite dei tuoi habitué. Quando un cliente si affeziona (affetto 3), ti racconta qualcosa di sé in tre visite, e a metà ti chiede un consiglio. Anche le coppie, gli amici e i rivali vivono storie a due. E quando i personaggi delle storie si incontrano, succedono cose. Ogni vita è unica: la vive una persona sola.</p>` +
      mondo +
      (act.length
        ? `<div class="card2"><h3>In corso<small>${act.length}</small></h3>${act
            .map(r => {
              const F = FILI.find(f => f.id === r.fl.id);
              return `<button class="chap" data-fl="${r.id}"><span class="who"><img alt="" src="${portrait(r.look)}">${esc(r.n)} · ${F ? F.t : ''}</span><small>${r.fl.s}/3 ›</small></button>`;
            })
            .join('')}</div>`
        : '') +
      (() => {
        const D = Object.entries(st.rel).filter(([, v]) => v.fl && v.fl.log && v.fl.log.length);
        if (!D.length) return '';
        const nm = id => {
          const r = st.regs.find(x => x.id === id);
          return r || { n: '?', look: CH.mia.l };
        };
        return `<div class="card2"><h3>Vite a due, in corso<small>${D.length}</small></h3>${D.map(([k, v]) => {
          const [a, b] = k.split('|').map(nm),
            F = FILI2.find(f => f.id === v.fl.id);
          return `<button class="chap" data-fl2="${k}"><span class="who"><img alt="" src="${portrait(a.look)}"><img alt="" src="${portrait(b.look)}">${esc(a.n)} e ${esc(b.n)} · ${F ? F.t : ''}</span><small>${v.fl.s}/3 ›</small></button>`;
        }).join('')}</div>`;
      })() +
      ((st.xlog || []).length
        ? `<div class="card2"><h3>Incontri tra storie<small>${st.xlog.length}</small></h3>${st.xlog
            .map((x, i) => {
              const X = XS.concat(XEPI).find(y => y.id === x.id);
              if (!X) return '';
              return `<button class="chap" data-xs="${x.id}"><span class="who">${X.w.map(w => `<img alt="" src="${portrait(CH[w].l)}">`).join('')}${X.w.map(w => CH[w].n).join(' e ')}</span><small>G${x.d} ›</small></button>`;
            })
            .join('')}</div>`
        : '') +
      (done.length
        ? `<div class="card2"><h3>Concluse<small>${done.length}</small></h3>${done.map((e, i) => `<button class="chap" data-fd="${i}"><span class="who"><img alt="" src="${portrait(e.look)}">${e.look2 ? `<img alt="" src="${portrait(e.look2)}">` : ''}<span>${esc(e.n)} · ${esc(e.t)}<br><small style="white-space:normal">${esc(e.e)}</small></span></span><small>G${e.d} ›</small></button>`).join('')}</div>`
        : '') +
      (!act.length && !done.length
        ? `<p class="note">${st.regs.length ? (ready ? `${ready} habitué sono pronti a raccontarti qualcosa: aspetta che tornino a sedersi.` : 'I tuoi habitué non si sono ancora affezionati abbastanza. Servili bene e tornano.') : 'Ancora nessun habitué: i clienti molto soddisfatti a volte decidono di tornare sempre.'}</p>`
        : '')
    );
  }
  if (tab === 'Habitué') {
    if (!st.regs.length)
      return '<p class="note">Ancora nessun habitué. I clienti molto soddisfatti a volte decidono di tornare sempre: qui vedrai chi sono, cosa ordinano e quanto si sono affezionati.</p>';
    return (
      `<p class="note">${st.regs.length} habitué. Si siedono vicini, si conoscono, diventano amici, rivali o coppie.</p>` +
      st.regs
        .slice()
        .sort((x, y) => (y.key ? 1 : 0) - (x.key ? 1 : 0) || y.f - x.f)
        .map(r => {
          const fav = itemOf(r.fav);
          const rels = Object.entries(st.rel).filter(([k]) => k.includes(r.id)).length;
          const ft = favTable(r),
            hh = r.hn >= 3 ? Math.floor(r.hr) % 24 : -1,
            rit = Object.entries(st.rel).find(([k, v]) => k.includes(r.id) && v.ritN);
          const ritW = rit ? st.regs.find(x => x.id === rit[0].split('|').find(i => i !== r.id)) : null;
          const rout = [
            hh >= 0 ? `di solito verso le ${hh}` : '',
            ft >= 0 ? `tavolo ${ft + 1}` : '',
            ritW ? `il ${WD[rit[1].rit]} con ${esc(ritW.n)}` : ''
          ]
            .filter(Boolean)
            .join(' · ');
          return `<div class="card2"><h3><span class="who"><img alt="" src="${portrait(r.look)}">${esc(r.n)}${r.key ? ' <span class="tag">storia</span>' : ''}</span><small>${r.v} visite</small></h3>${rout ? `<p class="ad">${rout}</p>` : ''}<p class="ad">${TYPES[r.type] ? TYPES[r.type].n : 'Cliente'} · ordina ${fav ? fav.n : 'caffè'}${r.pet ? ' · con ' + PETA[r.pet.k] + ' ' + esc(r.pet.n) : ''} · ${rels} legami</p>${r.tr.map(t => `<span class="tag">${t}</span>`).join('')}<p class="ad">${esc(carattereN(r))} · umore ${esc(umoreN(r))}${(m => (m ? ' · ricorda ' + esc(m) : ''))(ricordoN(r))}${(P => (P ? `<br>insegue ${esc(P.t)} (${r.pj.s}/${P.passi})` : ''))(pjDi(r))}${(r.pjF || []).length ? ` · ${r.pjF.length} sogni inseguiti` : ''}</p><div class="bar"><i style="width:${r.f * 10}%"></i></div></div>`;
        })
        .join('')
    );
  }
  if (tab === 'Legami') {
    const L = Object.entries(st.rel);
    const IC = {
      famiglia: 'famiglia',
      sposati: 'sposati ♥♥♥',
      conoscenti: 'conoscenti',
      amici: 'amici',
      migliori: 'migliori amici',
      cotta: 'cotta ♥',
      coppia: 'coppia ♥',
      fidanzati: 'fidanzati ♥♥',
      rivali: 'rivali'
    };
    const nm = id => {
      const r = st.regs.find(x => x.id === id);
      return r ? esc(r.n) : '?';
    };
    return (
      `<p class="note">Legami nati nel tuo locale. Gli amici e le coppie iniziano a venire insieme, come una routine.</p>` +
      (L.length
        ? L.map(([k, v]) => {
            const [a, b] = k.split('|');
            return `<div class="row"><b>${nm(a)} e ${nm(b)}</b><span>${IC[v.k] || v.k} · ${relN(v)}${cortN(k, v)} · dal giorno ${v.d}</span></div>`;
          }).join('')
        : '<p class="note">Nessun legame per ora.</p>') +
      (() => {
        const P = Object.entries(st.petf || {}).filter(([, v]) => v >= 2);
        if (!P.length) return '';
        const nm = k => k.replace(/^(cane|gatto|coniglio|uccellino)/, '');
        return `<div class="card2"><h3>Amici a quattro zampe<small>${P.length}</small></h3>${P.map(([k, v]) => {
          const [a, b] = k.split('|');
          return `<div class="rev">${esc(nm(a))} e ${esc(nm(b))} <small>· ${v} incontri</small></div>`;
        }).join('')}</div>`;
      })() +
      (st.log.length
        ? `<div class="card2"><h3>Bacheca</h3>${st.log
            .slice(0, 15)
            .map(l => `<div class="rev"><small>Giorno ${l.d}</small> ${esc(l.t)}</div>`)
            .join('')}</div>`
        : '')
    );
  }
  if (tab === 'Segreti') {
    const f = st.found || {},
      n = EGGS.filter(e => f[e.id]).length;
    return (
      `<p class="note">Segreti scoperti: <b>${n}/${EGGS.length}</b>. Il locale è pieno di piccole sorprese: tocca le cose, guarda fuori dalla finestra, resta aperto fino a tardi.</p>` +
      EGGS.map(e =>
        f[e.id]
          ? `<div class="row"><b>${e.n}</b><span>Scoperto · ${e.h}</span></div>`
          : `<div class="row"><b>???</b><span>${e.h}</span></div>`
      ).join('')
    );
  }
  if (tab === 'Giornale') return giornaleHTML();
  if (tab === 'Recensioni') {
    const r = st.reviews.slice().reverse();
    return (
      `<p class="note">Media: <b>${rating().toFixed(1).replace('.', ',')} ★</b> (ultime ${r.length}). Le stelle fanno arrivare più clienti. Attese lunghe e tavoli sporchi le abbassano.</p>` +
      (r.length
        ? r
            .map(
              x =>
                `<div class="rev"><em>${'★'.repeat(x.s)}${'☆'.repeat(5 - x.s)}</em>${esc(x.t)} <small>— ${esc(x.n)}${x.c ? ' (critico)' : ''}, giorno ${x.d}</small></div>`
            )
            .join('')
        : '<p class="note">Nessuna recensione ancora.</p>')
    );
  }
  return '';
}
function dayHTML() {
  const h = hour(),
    hh = Math.floor(h) % 24,
    mm = Math.floor((h % 1) * 60);
  return (
    calHTML() +
    `<div class="card2"><h3>Giorno ${st.day}<small>${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}</small></h3><p class="ad">Meteo: ${WXN[curWx()]}${st.wx2 && st.tod < 0.5 ? ' (poi ' + WXN[st.wx2].toLowerCase() + ')' : ''}${(E => (E ? ` · <b>${E.n}</b>: ${E.d}` : ''))(giornoEv(st.day, st.ev))}</p><p class="ad">Domani: ${WXN[st.nwx] || '?'}${(E => (E ? ' · ' + E.n : ''))(giornoEv(st.day + 1, st.nev))}</p></div>` +
    `<p class="note">Obiettivi di oggi${st.manager ? ' (la manager li riscuote da sola)' : ''}. Completali tutti per un ♥.</p>` +
    st.quests
      .map(
        (q, i) =>
          `<div class="row"><b>${q.t.replace('{n}', fmt(q.n))}</b><span>${fmt(q.p)}/${fmt(q.n)} · premio ${fmt(q.r)} monete</span><button data-q="${i}" ${q.done && !q.cl ? '' : 'disabled'}>${q.cl ? 'Fatto' : q.done ? 'Riscuoti' : coinB(q.r)}</button></div>`
      )
      .join('') +
    (st.ds
      ? `<div class="card2"><h3>Finora oggi</h3><p class="ad">${st.ds.served} clienti · ${fmt(st.ds.earned)} monete · ${st.ds.couples} coppie · ${st.ds.stars.length} recensioni</p></div>`
      : '')
  );
}
// salvataggio su file: lo stesso contenuto del codice, ma in un file da tenere da parte
function saveCode() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(st))));
}
function parseSave(text) {
  text = (text || '').trim();
  try {
    return JSON.parse(text); // file JSON
  } catch (e) {}
  return JSON.parse(decodeURIComponent(escape(atob(text)))); // codice esportato
}
function downloadSave() {
  save();
  const blob = new Blob([JSON.stringify(st)], { type: 'application/json' }),
    a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `caffe-sotto-la-pioggia-giorno-${st.day}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 1000);
  toast('Salvataggio scaricato');
}
document.addEventListener('change', e => {
  if (e.target.id !== 'savefile' || !e.target.files[0]) return;
  e.target.files[0].text().then(t => {
    $('#savein').value = t;
    toast('File caricato: tocca Carica');
  });
});
function setHTML() {
  return `<div class="set"><label class="note" for="rn">Nome della caffetteria</label><div class="line"><input id="rn" maxlength="22"><button id="rnb">Salva</button></div>
 <div class="card2"><h3>Suoni</h3><div class="line"><button id="snd" style="flex:1">Suoni: ${st.sound ? 'sì' : 'no'}</button><button id="mus" style="flex:1">Musica: ${st.musicOn ? 'sì' : 'no'}${st.music ? '' : ' (serve il giradischi)'}</button></div>
 ${[
   ['m', 'Musica'],
   ['s', 'Effetti'],
   ['a', 'Pioggia e voci']
 ]
   .map(
     ([k, n]) =>
       `<label class="vol">${n}<input type="range" min="0" max="100" step="5" data-vol="${k}" value="${st.vol && st.vol[k] != null ? st.vol[k] : VOL0[k]}"><b>${st.vol && st.vol[k] != null ? st.vol[k] : VOL0[k]}</b></label>`
   )
   .join('')}</div>
 <div class="card2"><h3>Lettura</h3><div class="seg"><span>Velocità del testo</span>${['lenta', 'normale', 'veloce']
   .map(v => `<button data-tv="${v}" class="${(st.txtV || 'normale') === v ? 'on' : ''}">${v[0].toUpperCase() + v.slice(1)}</button>`)
   .join('')}</div>
 <button id="ttap">I racconti vanno avanti: ${st.txtTap ? 'quando tocco io' : 'da soli'}</button><button id="bigt">Testo grande: ${st.bigTxt ? 'sì' : 'no'}</button></div>
 ${isApp() ? '' : `<button id="inst" class="big">Installa il gioco sul telefono</button>`}
 <div class="line"><button id="gtog" style="flex:1">Consigli di Nonna Rosa: ${st.tutOff ? 'no' : 'sì'}</button><button id="grst" style="flex:1">Rivedi i consigli</button></div>
 <button id="fsb">Schermo intero</button><div class="line"><button id="pho" style="flex:1">Scatta una foto</button><button id="cin" style="flex:1">Rivedi l'introduzione</button></div><div class="line"><button id="exp" style="flex:1">Esporta salvataggio</button><button id="imp" style="flex:1">Importa salvataggio</button></div><button id="rst">Ricomincia da capo</button>
 <p class="note">Clienti serviti: ${st.served} · Monete totali: ${fmt(st.earned)} · Giornate perfette: ${st.perfect}<br>Trascina la sala a destra e a sinistra quando diventa grande.<br>Il gioco si salva da solo su questo dispositivo (con una copia di riserva). Esporta il salvataggio in un file per non perderlo se cambi telefono o cancelli i dati del browser.<br>Creato da GlitchCraft</p></div>`;
}
function renderPanel() {
  const b = $('#pbody'),
    h = $('#ptitle'),
    tb = $('#tabs');
  const sc = b.scrollTop;
  const T2 = { up: 'Migliora', cli: 'Clienti', day: 'La giornata', set: 'Impostazioni' };
  h.textContent = T2[panel] || '';
  const badge = t => {
    if (panel === 'up') {
      const n = UP.filter(u => u.tab === t && canUp(u) && st.coins >= u.c()).length;
      return n ? `<i class="n">${n}</i>` : '';
    }
    if (panel === 'cli' && t === 'Vite') {
      const n = st.regs.filter(r => r.fl && r.fl.log && r.fl.log.length).length;
      return n ? `<i class="n">${n}</i>` : '';
    }
    return '';
  };
  tb.innerHTML = (TABS[panel] || [])
    .map(t => `<button data-tab="${t}" class="${t === tab ? 'on' : ''}">${TABI[t] || ''}${t}${badge(t)}</button>`)
    .join('');
  tb.hidden = !TABS[panel];
  if (panel === 'up') b.innerHTML = pxText(tabHTML());
  else if (panel === 'cli') b.innerHTML = pxText(cliHTML());
  else if (panel === 'day') b.innerHTML = pxText(dayHTML());
  else if (panel === 'set') {
    b.innerHTML = setHTML();
    $('#rn').value = st.name;
  }
  b.scrollTop = sc;
}
$('#tabs').addEventListener('click', e => {
  const bt = e.target.closest('button');
  if (!bt) return;
  tab = bt.dataset.tab;
  $('#pbody').scrollTop = 0;
  renderPanel();
});
let rstArm = 0;
function buyUp(u) {
  const c = u.c();
  if (u.max() || (u.lock && u.lock()) || st.coins < c) return false;
  st.coins -= c;
  u.b();
  return true;
}
function autoBuy() {
  let best = null,
    bc = Infinity;
  for (const u of UP) {
    if (u.max() || (u.lock && u.lock())) continue;
    const c = u.c();
    if (c < bc) {
      bc = c;
      best = u;
    }
  }
  if (best && st.coins >= bc) {
    buyUp(best);
    if (panel === 'up') renderPanel();
  }
}
$('#pbody').addEventListener('click', e => {
  const bt = e.target.closest('button');
  if (!bt) return;
  initAudio();
  if (bt.dataset.rd) {
    const arc = ARCS.find(x => x.id === bt.dataset.rd);
    openReader(arc.t, '', arcPages(arc), +bt.dataset.i);
    return;
  }
  if (bt.dataset.fl) {
    const r = st.regs.find(x => x.id === bt.dataset.fl);
    if (r && r.fl) {
      const F = FILI.find(f => f.id === r.fl.id);
      openReader(r.n, 'continua…', filoPages({ n: r.n, t: F ? F.t : '', log: r.fl.log, look: r.look, e: '' }), r.fl.log.length - 1);
    }
    return;
  }
  if (bt.dataset.gz) {
    gzSel = +bt.dataset.gz;
    renderPanel();
    return;
  }
  if (bt.dataset.tra || bt.dataset.trf) {
    const T = bt.dataset.tra ? (st.tr || []).find(x => String(x.u) === bt.dataset.tra) : (st.trF || [])[+bt.dataset.trf];
    if (T) {
      const t = T.t || (TRAME.find(x => x.id === T.id) || {}).t || '';
      openReader(
        t,
        T.e ? 'storia nata da sola' : 'continua…',
        T.log.map((b, i) => ({
          t: t + (T.log.length > 1 ? ' · ' + (i + 1) : ''),
          who: b.who,
          lines: b.lines,
          end: i === T.log.length - 1 && T.e ? T.e : ''
        })),
        T.log.length - 1
      );
    }
    return;
  }
  if (bt.dataset.fl2) {
    const R = st.rel[bt.dataset.fl2];
    if (R && R.fl) {
      const F = FILI2.find(f => f.id === R.fl.id),
        [a, b] = bt.dataset.fl2.split('|').map(id => st.regs.find(r => r.id === id));
      if (a && b)
        openReader(
          `${a.n} e ${b.n}`,
          'continua…',
          filoPages({ n: a.n, t: F ? F.t : '', log: R.fl.log, look: a.look, look2: b.look, n1: a.n, n2: b.n, e: '' }),
          R.fl.log.length - 1
        );
    }
    return;
  }
  if (bt.dataset.xs) {
    const X = XS.concat(XEPI).find(y => y.id === bt.dataset.xs);
    if (X) {
      const lines = X.l.filter(l => !l[2] || checkFlag(l[2])).map(l => [CH[X.w[l[0]]].n, l[1]]);
      openReader(
        X.w.map(w => CH[w].n).join(' e '),
        X.w.length > 1 ? 'incontro' : 'epilogo',
        [{ t: X.w.length > 1 ? 'Un incontro' : "Com'è andata", who: X.w.map(w => ({ n: CH[w].n, look: CH[w].l })), lines, end: '' }],
        0
      );
    }
    return;
  }
  if (bt.dataset.fd) {
    const e = st.fdone[+bt.dataset.fd];
    if (e) openReader(e.n, 'Giorno ' + e.d, filoPages(e), 0);
    return;
  }
  if (bt.dataset.go) {
    const u = UP.find(x => x.id === bt.dataset.go);
    if (st.coins >= u.c() && buyUp(u)) {
      sfx('buy');
      renderPanel();
      save();
      return;
    }
    tab = u.tab;
    recId = u.id;
    renderPanel();
    const row = $('#pbody').querySelector(`button[data-u="${u.id}"]`);
    if (row) {
      row.closest('.row').classList.add('flash');
      row.scrollIntoView({ block: 'center' });
    }
    return;
  }
  if (bt.dataset.u) {
    const u = UP.find(x => x.id === bt.dataset.u);
    if (buyUp(u)) {
      sfx('buy');
      renderPanel();
      save();
    }
    return;
  }
  if (bt.dataset.ing) {
    const k = bt.dataset.ing;
    labSel = labSel.includes(k) ? labSel.filter(x => x !== k) : labSel.length < 3 ? labSel.concat(k) : labSel;
    sfx('tap');
    renderPanel();
    return;
  }
  if (bt.dataset.lab) {
    labTry();
    return;
  }
  if (bt.dataset.nb) {
    const N = NEONS.find(x => x.id === bt.dataset.nb);
    if (!N || st.coins < N.c || st.neonOwn.includes(N.id)) return;
    st.coins -= N.c;
    st.neonOwn.push(N.id);
    // si accende subito nel primo punto libero dove ci sta
    const sz = neonSize(N),
      free = wallSlots().find(S => !st.neonAt[S.id] && neonFit(N, S));
    if (free) {
      st.neonAt[free.id] = N.id;
      toast(`${N.n} acceso: ${free.n.toLowerCase()}`);
    }
    sfx('buzz');
    if (st.neonOwn.length >= NEONS.length) egg('neon');
    renderPanel();
    save();
    return;
  }
  if (bt.dataset.mf !== undefined || bt.dataset.md !== undefined || bt.dataset.ma !== undefined) {
    const buy = c => {
      if (st.coins < c) return false;
      st.coins -= c;
      sfx('buy');
      return true;
    };
    if (bt.dataset.mf !== undefined) {
      const f = MACH.fin.find(x => x.id === bt.dataset.mf);
      if (!st.mfinOwn.includes(f.id)) {
        if (!buy(f.c)) return;
        st.mfinOwn.push(f.id);
      }
      st.mfin = f.id;
    } else if (bt.dataset.md !== undefined) {
      const id = bt.dataset.md,
        f = MACH.dec.find(x => x.id === id);
      if (f && !st.mdecOwn.includes(id)) {
        if (!buy(f.c)) return;
        st.mdecOwn.push(id);
      }
      st.mdec = id;
    } else {
      const id = bt.dataset.ma,
        f = MACH.acc.find(x => x.id === id);
      if (!st.macc.includes(id)) {
        if (!buy(f.c)) return;
        st.macc.push(id);
        st.maccOff = st.maccOff.filter(x => x !== id);
      } else st.maccOff = st.maccOff.includes(id) ? st.maccOff.filter(x => x !== id) : st.maccOff.concat(id);
    }
    if (machAtm() >= MACH.fin.length - 1 + MACH.dec.length + MACH.acc.length) egg('macchina');
    renderPanel();
    save();
    return;
  }
  if (bt.dataset.th) {
    const k = bt.dataset.th,
      t = THEMES[k];
    if (!st.themes.includes(k)) {
      if (st.coins < t.c) return;
      st.coins -= t.c;
      st.themes.push(k);
    }
    st.theme = k;
    sfx('buy');
    renderPanel();
    save();
    return;
  }
  if (bt.dataset.fr) {
    franchise(bt.dataset.fr);
    return;
  }
  if (bt.dataset.q) {
    claimQ(st.quests[+bt.dataset.q]);
    renderPanel();
    save();
    return;
  }
  if (bt.dataset.auto) {
    st.autoBuy = st.autoBuy ? 0 : 1;
    renderPanel();
    return;
  }
  if (bt.id === 'rnb') {
    const v = $('#rn').value.trim();
    if (v) {
      st.name = v;
      save();
      toast('Nuova insegna accesa');
      signFlick = 1.2;
      nameEgg(v);
    }
  }
  if (bt.id === 'snd') {
    st.sound = st.sound ? 0 : 1;
    applyVol();
    renderPanel();
  }
  if (bt.dataset.tv) {
    st.txtV = bt.dataset.tv;
    toast(
      st.txtV === 'lenta' ? 'Testo lento: le battute restano di più' : st.txtV === 'veloce' ? 'Testo veloce' : 'Testo a velocità normale'
    );
    renderPanel();
    save();
  }
  if (bt.id === 'ttap') {
    st.txtTap = st.txtTap ? 0 : 1;
    toast(st.txtTap ? 'I racconti aspettano il tuo tocco per andare avanti' : 'I racconti vanno avanti da soli (un tocco li accelera)');
    renderPanel();
    save();
  }
  if (bt.id === 'bigt') {
    st.bigTxt = st.bigTxt ? 0 : 1;
    applyBig();
    renderPanel();
    save();
  }
  if (bt.id === 'mus') {
    st.musicOn = st.musicOn ? 0 : 1;
    renderPanel();
  }
  if (bt.id === 'fsb') goFS();
  if (bt.id === 'pho') {
    closePanel();
    setTimeout(photo, 380);
    return;
  }
  if (bt.id === 'cin') {
    startCine(() => {
      $('#hud').hidden = false;
      $('#serve').hidden = false;
    });
    return;
  }
  if (bt.id === 'gtog') {
    st.tutOff = st.tutOff ? 0 : 1;
    renderPanel();
    save();
    return;
  }
  if (bt.id === 'grst') {
    st.tut = {};
    st.tutOff = 0;
    toast('Nonna Rosa ti rispiegherà tutto, un passo alla volta');
    renderPanel();
    save();
    return;
  }
  if (bt.id === 'inst') {
    installApp();
    return;
  }
  if (bt.id === 'exp') {
    save();
    const code = btoa(unescape(encodeURIComponent(JSON.stringify(st))));
    showModal(
      `<h2>Esporta salvataggio</h2><p>Copia questo codice e conservalo. Per riprendere la partita: Impostazioni, poi Importa.</p><textarea class="savebox" id="savecode" readonly>${code}</textarea>`,
      [
        { t: 'Chiudi', fn: hideModal },
        { t: 'Scarica file', fn: () => downloadSave() },
        {
          t: 'Copia',
          big: 1,
          fn: () => {
            const ta = $('#savecode');
            ta.select();
            let ok = false;
            try {
              ok = document.execCommand('copy');
            } catch (err) {}
            if (navigator.clipboard)
              navigator.clipboard.writeText(code).then(
                () => toast('Codice copiato'),
                () => {}
              );
            else if (ok) toast('Codice copiato');
          }
        }
      ]
    );
    return;
  }
  if (bt.id === 'imp') {
    showModal(
      `<h2>Importa salvataggio</h2><p>Scegli il file del salvataggio, oppure incolla qui il codice esportato. La partita attuale verrà sostituita.</p><input type="file" id="savefile" accept=".json,.txt,application/json,text/plain"><textarea class="savebox" id="savein"></textarea>`,
      [
        { t: 'Annulla', fn: hideModal },
        {
          t: 'Carica',
          big: 1,
          fn: () => {
            try {
              const o = parseSave($('#savein').value);
              if (!o || typeof o !== 'object' || !o.name || typeof o.coins !== 'number') throw 0;
              localStorage.setItem(KEY + '_bak', localStorage.getItem(KEY) || '');
              localStorage.setItem(KEY, JSON.stringify(o));
              st.name = '';
              location.reload();
            } catch (err) {
              toast('Codice non valido');
            }
          }
        }
      ]
    );
    return;
  }
  if (bt.id === 'rst') {
    if (Date.now() - rstArm < 3000) {
      st.name = '';
      started = false;
      resetting = true;
      try {
        [KEY, KEY1, KEY + '_bak'].forEach(k => localStorage.removeItem(k));
      } catch (err) {}
      location.replace(location.pathname + '?nuova=1');
      return;
    } else {
      rstArm = Date.now();
      bt.textContent = 'Tocca ancora per cancellare tutto';
    }
  }
  save();
});
function franchise(d) {
  const stars = Math.max(1, Math.floor(Math.sqrt(st.runEarned / 250000)));
  showModal(
    `<h2>Nuovo locale: ${DIST[d].n}</h2><p>Lasci questo locale in buone mani e ne apri uno nuovo. Tieni cuori, storie, habitué, legami e stili. Guadagni <b>${stars} ★</b> di franchising.</p>`,
    [
      { t: 'Annulla', fn: hideModal },
      {
        t: 'Apri il nuovo locale',
        big: 1,
        fn: () => {
          Object.assign(st, {
            coins: 0,
            space: 1,
            tables: 1,
            chairs: 0,
            decor: 0,
            music: 0,
            neon: 0,
            wifi: 0,
            cat: 0,
            barista: 0,
            waiter: 0,
            cook: 0,
            manager: 0,
            machine: 0,
            menu: 1,
            grinder: 0,
            stove: 0,
            umbr: 0,
            vetrina: 0,
            lav: 0,
            runEarned: 0,
            reviews: [],
            district: d
          });
          st.frStars += stars;
          people = [];
          queue = [];
          scenes = [];
          timers = [];
          groups = {};
          activeArcs.clear();
          baristas = [];
          waiters = [];
          managerS = null;
          slots.forEach(s =>
            s.seats.forEach(q => {
              q.occ = null;
              q.dirty = false;
              q.res = null;
              q.tgt = null;
            })
          );
          hideModal();
          closePanel();
          st.day++;
          layout();
          startDay();
          save();
          toast(`Benvenuto a ${DIST[d].n}! ★ ${st.frStars}`);
        }
      }
    ]
  );
}
$('#pclose').addEventListener('click', closePanel);
$('#skip').addEventListener('click', e => {
  e.stopPropagation();
  endCine();
});
document.querySelectorAll('#hud button[data-p]').forEach(b =>
  b.addEventListener('click', () => {
    initAudio();
    openPanel(b.dataset.p);
  })
);
let lastHud = '';
let lastW = '',
  lastCoins = 0;
function hud() {
  const h = hour(),
    hh = Math.floor(h) % 24,
    mm = Math.floor((h % 1) * 6) * 10;
  const cc = cal(),
    clock = `${cc.g} ${STAGIONI[cc.s].sig} · ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  const wk = curWx() === 'sereno' && nightF() > 0.5 ? 'luna' : curWx();
  if (wk !== lastW) {
    lastW = wk;
    $('#icoW').innerHTML = WICO(wk);
    $('#clockc').title = WXN[curWx()];
  }
  $('#dayp').style.width = (st.tod * 100).toFixed(1) + '%';
  if (st.coins > lastCoins + 0.5) {
    const c = $('#chC');
    c.classList.add('pop');
    setTimeout(() => c.classList.remove('pop'), 140);
  }
  lastCoins = st.coins;
  const s = `${fmt(st.coins)}|${st.hearts}|${rating().toFixed(1)}|${atm()}|${fmt(ips())}|${clock}`;
  if (s !== lastHud) {
    lastHud = s;
    $('#coins').textContent = fmt(st.coins);
    $('#hearts').textContent = st.hearts;
    $('#rate').textContent = rating().toFixed(1).replace('.', ',');
    {
      const nc = nextChapter(),
        A = atm();
      $('#atm').textContent = nc && nc.r > A ? A + '/' + nc.r : A;
      $('#atm').parentElement.title = nc && nc.r > A ? `Atmosfera: prossimo capitolo di «${nc.arc.t}» a ${nc.r}` : 'Atmosfera';
    }
    const i = ips();
    $('#ips').textContent = i > 0 ? `${fmt(i)}/s` : '';
    $('#clock').textContent = clock;
  }
  const any = UP.some(u => !u.max() && !(u.lock && u.lock()) && st.coins >= u.c());
  $('#bUp').classList.toggle('hot', any && panel !== 'up');
  $('#bDay').classList.toggle(
    'dot',
    st.quests.some(q => q.done && !q.cl)
  );
  $('#bCli').classList.toggle('dot', !!st.newStory);
  if (panel === 'up')
    document.querySelectorAll('#pbody button[data-u]').forEach(b => {
      const u = UP.find(x => x.id === b.dataset.u);
      const dis = u.max() || !!(u.lock && u.lock()) || st.coins < u.c();
      if (b.disabled !== dis) renderPanel();
    });
  if (panel === 'day' && Math.random() < 0.3) renderPanel();
}
setInterval(() => {
  if (started) hud();
}, 300);

// dove installare un'insegna al neon: il menu a tendina nella scheda Stili
$('#pbody').addEventListener('change', e => {
  const sel = e.target.closest && e.target.closest('select[data-ns]');
  if (!sel) return;
  const id = sel.dataset.ns,
    to = sel.value;
  for (const k of Object.keys(st.neonAt)) if (st.neonAt[k] === id) delete st.neonAt[k];
  if (to) {
    st.neonAt[to] = id; // se il posto era occupato, l'altra insegna torna in magazzino
    neonZap[to] = T + 0.6;
    sfx('buzz');
  }
  renderPanel();
  save();
});

// volumi: si sentono mentre trascini, si salvano quando lasci
document.addEventListener('input', e => {
  const k = e.target.dataset && e.target.dataset.vol;
  if (!k) return;
  st.vol = st.vol || {};
  st.vol[k] = +e.target.value;
  const b = e.target.nextElementSibling;
  if (b) b.textContent = e.target.value;
  initAudio();
  applyVol();
});
document.addEventListener('change', e => {
  const k = e.target.dataset && e.target.dataset.vol;
  if (!k) return;
  if (k === 's') sfx('cup');
  if (k === 'a') sfx('door');
  save();
});
// testo grande: pannelli, finestre, racconti, consigli e fumetti
function applyBig() {
  document.documentElement.classList.toggle('grande', !!st.bigTxt);
}
