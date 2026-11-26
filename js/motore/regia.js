// Regia: i momenti importanti (capitoli delle storie, vite degli habitué, incontri, visitatori rari) arrivano uno alla volta.
// - Un solo momento alla volta: gli altri aspettano il loro turno.
// - Chi vuole raccontare ti fa segno con una stellina ✦ e aspetta: toccalo quando sei pronto
//   (oppure comincia da solo quando il bancone è libero, o dopo un po').
// - Mentre racconta il locale si calma: non entra nessuno, la fila non perde la pazienza, niente ora di punta o imprevisti.
// - Il testo compare grande in basso: toccalo per andare avanti.
// - Dopo ogni momento c'è un respiro, e ogni giorno ha un numero massimo di momenti (oltre ai capitoli, CHAP_PER_DAY).

const REGIA_REST = 6; // secondi di respiro tra due momenti
const REGIA_WAIT = 10; // dopo quanto chi ti ha fatto segno comincia da solo
const MOM_DAY = { vita: 4, incontro: 2 }; // visite delle vite (anche a due) e incontri al giorno
// Mentre qualcuno racconta, anche l'orologio della giornata si ferma: ascoltare non toglie tempo al locale.
const regia = { live: null, hold: 0, rest: 0, cap: '', off: false, vt: 3, last: '' }; // off: solo per i test che provano altro

// c'è spazio per un nuovo momento? (nessuno in corso, nessuno in arrivo, respiro finito)
function regiaFree() {
  if (regia.off) return !intro;
  return !intro && !rush && !regia.live && regia.hold <= 0 && regia.rest <= 0 && !scenes.some(s => s.big && !s.done && !s.on);
}
function momOk(k) {
  if (regia.off) return true;
  const m = (st.ds && st.ds.mom) || {};
  return (m[k] || 0) < MOM_DAY[k];
}
function momCount(k) {
  if (!st.ds) return;
  st.ds.mom = st.ds.mom || {};
  st.ds.mom[k] = (st.ds.mom[k] || 0) + 1;
}
// ricomincia da zero (nuovo giorno di prova nei test, o quando si svuota il locale)
function regiaReset() {
  regia.live = null;
  regia.hold = 0;
  regia.rest = 0;
  regia.last = '';
  if (st.ds) st.ds.mom = {};
}
// un momento sta arrivando (i personaggi entrano dalla porta): nel frattempo non ne parte un altro
function regiaTake() {
  regia.hold = 40;
}
// chiamata da updScene per le scene importanti non ancora cominciate: true quando può partire
function regiaStart(sc, dt) {
  if (regia.off) return (sc.on = 1);
  // la stellina compare subito, anche se tocca ancora a qualcun altro: «dopo vorrei parlarti»
  if (!sc.inv) {
    sc.inv = 0.001;
    sc.mem.forEach(m => (m.invite = 1));
  }
  if (regia.live && regia.live !== sc) return false;
  // il respiro dopo un racconto si salta solo se sei tu a scegliere di ascoltare
  if ((regia.rest > 0 && !sc.tap) || rush) return false;
  if (!sc.told) {
    sc.told = 1;
    const n = sc.mem.map(m => m.name).filter(Boolean);
    if (!regiaQuiet())
      toast(`✦ ${n.length > 1 ? n.join(' e ') + ' vogliono' : n[0] + ' vuole'} raccontarti qualcosa: tocca quando sei pronto`);
  }
  sc.inv += dt;
  if (!sc.tap && !(sc.inv > 1.2 && regiaQuiet()) && sc.inv < REGIA_WAIT) return false;
  regia.live = sc;
  regia.hold = 0;
  sc.on = 1;
  sc.t = 0.5;
  sc.mem.forEach(m => (m.invite = 0));
  regia.last = sc.story === true ? 'cap' : 'altro';
  if (st.ds) {
    const n = sc.mem.map(m => m.name).join(' e ');
    st.ds.mlog = st.ds.mlog || [];
    if (n && !st.ds.mlog.includes(n)) st.ds.mlog.push(n);
  }
  sfx('chime');
  return true;
}
// il bancone è tranquillo: nessuno da servire
const regiaQuiet = () => !queue.some(q => q.state === 'order' || q.state === 'queue');
function regiaTick(dt) {
  if (regia.hold > 0) regia.hold -= dt;
  if (regia.live && (regia.live.done || !scenes.includes(regia.live))) {
    regia.live = null;
    regia.rest = REGIA_REST;
  }
  if (!regia.live && regia.rest > 0) regia.rest -= dt;
  regia.vt -= dt;
  if (regia.vt <= 0) {
    regia.vt = 2.5;
    regiaVita();
  }
  regiaCaption();
}
// le battute del momento in corso durano un po' di più: tanto il locale aspetta (e un tocco le fa andare avanti)
const regiaDur = (sc, d) => (sc === regia.live ? d * 1.15 + 0.4 : d);

/* ----- capitoli e vite si danno il turno ----- */
// un habitué seduto che ha una vita pronta da raccontare (da solo o con chi gli siede accanto)
function vitaPronta() {
  for (const c of people) {
    if (!c.reg || c.dead || c.state !== 'sit' || c.scene || c.story || c.group || c.rare || !c.seat) continue;
    const o = slotOf(c.seat).seats.find(s => s !== c.seat).occ;
    if (o && o.reg && o.state === 'sit' && !o.scene && !o.dead) {
      const R = st.rel[relKey(c.reg, o.reg)];
      if (R && duoReady(R)) return { c, o };
    }
    if (filoReady(c.reg)) return { c };
  }
  return null;
}
// quando la regia è libera e l'ultimo momento era un capitolo, tocca a una vita
function regiaVita() {
  if (regia.off || !regiaFree() || !momOk('vita')) return;
  const v = vitaPronta();
  if (!v) return;
  if (v.o) startDuo(v.c, v.o);
  else startFilo(v.c);
}
// tryStory chiede: posso far partire un capitolo? Non subito dopo un altro, se una vita sta aspettando
const capTurno = () => regia.off || regia.last !== 'cap' || !momOk('vita') || !vitaPronta();

/* ----- il testo in basso ----- */
function regiaCaption() {
  const el = $('#regia');
  if (!el) return;
  const sc = regia.live;
  const sp = sc && !sc.wait && sc.mem.find(m => m.bub && m.bub.t > 0);
  const show = sp && !panel && $('#modal').hidden && $('#reader').hidden && !mini;
  regia.capOn = !!show;
  if (!show) {
    if (!el.hidden) el.hidden = true;
    return;
  }
  const key = sp.id + '|' + sp.bub.txt;
  if (key !== regia.cap) {
    regia.cap = key;
    const look = sp.look || (sp.reg && sp.reg.look);
    el.innerHTML = `${look ? `<img alt="" src="${portrait(look)}">` : ''}<div><b>${esc(sp.name || '')}</b><p>${esc(sp.bub.txt)}</p><small>tocca per continuare ›</small></div>`;
  }
  el.hidden = false;
}
function regiaNext() {
  const sc = regia.live;
  if (!sc || sc.wait) return;
  sc.mem.forEach(m => {
    if (m.bub) m.bub.t = Math.min(m.bub.t, 0.15);
  });
  sc.t = Math.min(sc.t, 0.15);
}
$('#regia').addEventListener('pointerdown', e => {
  e.preventDefault();
  initAudio();
  regiaNext();
});

/* ----- i tocchi sul locale ----- */
// tocchi chi ti ha fatto segno: comincia a raccontare
function regiaTap(x, y) {
  const c = people.find(p => p.invite && p.scene && !p.dead && Math.abs(p.x - x) < 10 && y > p.y - 34 && y < p.y + 6);
  if (!c) return false;
  c.scene.tap = 1;
  sfx('tap');
  return true;
}

/* ----- disegno ----- */
// la stellina sopra chi vuole raccontare
const STELLA = ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '.#...#.'];
function drawInvite(x, y) {
  const yy = y - Math.round(Math.abs(Math.sin(T * 3)) * 2);
  g.fillStyle = 'rgba(27,20,32,.35)';
  g.fillRect(x - 3, yy + 1, 11, 9);
  g.fillStyle = '#fffaf2';
  g.fillRect(x - 3, yy - 1, 11, 9);
  g.fillRect(x - 2, yy - 2, 9, 11);
  g.fillStyle = Math.floor(T * 2.5) % 2 ? '#ffd166' : '#ffb703';
  STELLA.forEach((r, j) => {
    for (let i = 0; i < 7; i++) if (r[i] === '#') g.fillRect(x - 2 + i, yy - 1 + j, 1, 1);
  });
}
// mentre qualcuno racconta, il resto del locale si abbassa un po' di luce
let regiaFade = 0;
function regiaDraw() {
  const sc = regia.live;
  regiaFade = clamp(regiaFade + (sc && !sc.done ? 0.04 : -0.06), 0, 1);
  if (regiaFade <= 0 || !sc) return;
  const mem = sc.mem.filter(m => !m.dead);
  if (!mem.length) return;
  const cx = mem.reduce((s, m) => s + m.x, 0) / mem.length,
    cy = mem.reduce((s, m) => s + m.y, 0) / mem.length - 12;
  const gr = g.createRadialGradient(cx, cy, 22, cx, cy, 90);
  gr.addColorStop(0, 'rgba(5,2,12,0)');
  gr.addColorStop(1, `rgba(5,2,12,${(0.5 * regiaFade).toFixed(3)})`);
  g.fillStyle = gr;
  g.fillRect(camX - 10, -10, VW + 20, VH + 20);
}
