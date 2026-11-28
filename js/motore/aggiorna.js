// Aggiornamenti in diretta: chi sta già giocando riceve subito la versione nuova.
// Ogni 3 minuti (e quando si torna sulla scheda) il gioco legge l'etichetta VERSIONE in sw.js.
// Se è cambiata, salva, aspetta un momento tranquillo (nessun racconto, scelta, minigioco, finestra o pannello),
// e si ricarica rientrando direttamente nel locale. Poi Nonna Rosa racconta le novità.
// Per questo, a ogni aggiornamento pubblicato va aumentata VERSIONE in sw.js.

const AGG_OGNI = 3 * 60 * 1000;
let versioneMia = null,
  aggPronto = false;
const aggWeb = /^https?:$/.test(location.protocol);
function leggiVersione() {
  return fetch('sw.js?v=' + Date.now(), { cache: 'no-store' })
    .then(r => (r.ok ? r.text() : ''))
    .then(t => (t.match(/VERSIONE = '([^']+)'/) || [])[1] || null)
    .catch(() => null);
}
function controllaVersione() {
  if (!aggWeb || aggPronto) return;
  leggiVersione().then(v => {
    if (!v) return;
    if (!versioneMia) versioneMia = v;
    else if (v !== versioneMia) aggPronto = true;
  });
}
// un momento in cui ricaricare non disturba nessuno
function momentoTranquillo() {
  if (!started) return true;
  return (
    !regia.live &&
    !scenes.some(s => s.big && s.on && !s.done) &&
    !choiceOpen &&
    !mini &&
    !cine &&
    !tut &&
    !intro &&
    !novita &&
    !panel &&
    $('#modal').hidden &&
    $('#reader').hidden
  );
}
function aggiornaOra() {
  aggPronto = false;
  toast('Nonna Rosa ha portato delle novità: un attimo…');
  save();
  try {
    sessionStorage.setItem('cafe_agg', '1');
  } catch (e) {}
  setTimeout(() => location.reload(), 1800);
}
if (aggWeb) {
  controllaVersione();
  setInterval(controllaVersione, AGG_OGNI);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) controllaVersione();
  });
}
setInterval(() => {
  if (aggPronto && momentoTranquillo()) aggiornaOra();
}, 1000);
// dopo un aggiornamento si rientra subito nel locale, senza la schermata iniziale
(function rientro() {
  let flag = null;
  try {
    flag = sessionStorage.getItem('cafe_agg');
    sessionStorage.removeItem('cafe_agg');
  } catch (e) {}
  if (flag && st.name)
    setTimeout(() => {
      if (!started) begin();
    }, 200);
})();
