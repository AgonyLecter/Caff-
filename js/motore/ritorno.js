// Il ritorno al caffè: il diario della notte (cosa è successo mentre il gioco era chiuso)
// e le novità del gioco raccontate da Nonna Rosa. I contenuti sono in js/dati/novita.js.
// Il diario non ha effetti sul gioco: le storie e le vite succedono solo davanti al giocatore.

// le piccole cose successe mentre eri via (el = secondi di assenza)
function diarioNotte(el) {
  if (el < 600) return [];
  const quante = el < 3600 ? 1 : el < 4 * 3600 ? 2 : 3;
  const pool = NOTTE.sempre.slice();
  if (st.cat) pool.push(...NOTTE.gatto);
  const amici = st.regs.filter(r => !r.key && (r.f || 0) >= 3);
  if (amici.length)
    NOTTE.habitue.forEach(t => {
      const r = pick(amici),
        fav = (MENU.find(m => m.id === r.fav) || MENU[0]).n;
      pool.push(gO(t.replace(/\{n\}/g, r.n).replace(/\{fav\}/g, fav), r));
    });
  const coppie = Object.entries(st.rel).filter(([, R]) => COPPIE.includes(R.k));
  if (coppie.length)
    NOTTE.coppia.forEach(t => {
      const [a, b] = pick(coppie)[0]
        .split('|')
        .map(id => st.regs.find(r => r.id === id));
      if (a && b) pool.push(t.replace(/\{A\}/g, a.n).replace(/\{B\}/g, b.n));
    });
  // i personaggi di casa hanno più probabilità di lasciare un segno
  st.regs.forEach(r => {
    if (r.key && NOTTE.chiave[r.key]) pool.push(NOTTE.chiave[r.key], NOTTE.chiave[r.key]);
  });
  const out = [];
  while (out.length < quante && pool.length) {
    const t = pool.splice(ri(0, pool.length - 1), 1)[0];
    if (!out.includes(t)) out.push(t);
  }
  return out;
}
const durataN = el => {
  const h = Math.floor(el / 3600),
    m = Math.round((el % 3600) / 60);
  return h >= 8 ? 'tutta la notte' : h ? `${h} or${h === 1 ? 'a' : 'e'}${m >= 10 ? ' e ' + m + ' minuti' : ''}` : `${m} minuti`;
};
// all'apertura del gioco: prima il diario della notte, poi le novità di Nonna Rosa
function ritorno(el, monete) {
  const voci = diarioNotte(el);
  if (!voci.length) {
    if (monete > 0) setTimeout(() => toast(`Mentre eri via: +${fmt(monete)} monete`), 900);
    setTimeout(novitaInizio, 2600);
    return;
  }
  voci.forEach(t => logB('Di notte: ' + t));
  setTimeout(() => {
    showModal(
      `<h2>Mentre eri via</h2><p class="note">Il caffè è rimasto chiuso per ${durataN(el)}. Ecco cosa è successo, intanto.</p><ul class="notte">${voci
        .map(t => `<li>${esc(t)}</li>`)
        .join('')}</ul>${monete > 0 ? `<p>In cassa ti aspettano <b>${fmt(monete)}</b> monete.</p>` : ''}`,
      [
        {
          t: hour() < 12 ? 'Buongiorno!' : 'Apri il caffè',
          big: 1,
          fn: () => {
            hideModal();
            setTimeout(novitaInizio, 900);
          }
        }
      ]
    );
  }, 900);
}

/* ----- le novità, raccontate da Nonna Rosa ----- */
// st.nov = quante novità il giocatore ha già sentito (l'elenco cresce solo in fondo)
let novita = null;
function novitaDaDire() {
  if (st.nov == null) {
    // partita nuova: le novità le scopre giocando. Salvataggio di prima: le ultime quattro
    st.nov = st.day === 1 && st.served < 10 ? NOVITA.length : Math.max(0, NOVITA.length - 4);
  }
  const L = NOVITA.slice(st.nov).slice(-4);
  st.nov = NOVITA.length;
  return L;
}
function novitaInizio() {
  if (novita) return;
  const L = novitaDaDire(); // anche in una partita nuova: così le novità di oggi risultano già «sentite»
  save();
  if (!L.length || intro || tut) return;
  novita = { L, i: 0 };
  novitaShow();
}
function novitaShow() {
  const el = $('#guide'),
    N = novita.L[novita.i],
    last = novita.i >= novita.L.length - 1;
  el.innerHTML = `<img alt="" src="${portrait(CH.rosa.l)}"><div><b>Nonna Rosa <small class="tstep">novità ${novita.i + 1}/${novita.L.length}</small></b><p>${esc(
    novita.i === 0 ? 'Bentornata, cara! Mentre non c’eri ho sistemato qualche cosa. ' + N.t : N.t
  )}</p><div class="gb"><button id="nok">${last ? 'Grazie, Rosa' : 'Avanti ' + ICO.dx}</button></div></div>`;
  el.hidden = false;
  sfx('pop');
}
document.addEventListener('click', e => {
  if (!novita || e.target.closest('button') == null || e.target.closest('button').id !== 'nok') return;
  if (novita.i < novita.L.length - 1) {
    novita.i++;
    novitaShow();
  } else {
    novita = null;
    hideGuide();
  }
});
