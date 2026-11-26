// Servizio offline: il gioco si apre anche senza connessione.
// Prima prova la rete (così gli aggiornamenti arrivano subito), se non c'è usa la copia salvata.
// Quando cambiano i file del gioco basta aumentare VERSIONE: la vecchia copia viene buttata.
const VERSIONE = 'caffe-v1';
const FILE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/stile.css',
  'js/motore/base.js',
  'js/dati/personaggi.js',
  'js/dati/storie.js',
  'js/dati/mondo.js',
  'js/dati/frasi.js',
  'js/dati/animali.js',
  'js/dati/vite.js',
  'js/dati/intrecci.js',
  'js/dati/segreti.js',
  'js/motore/stato.js',
  'js/motore/citta.js',
  'js/motore/audio.js',
  'js/motore/simulazione.js',
  'js/motore/disegno-persone.js',
  'js/motore/disegno-locale.js',
  'js/motore/animali.js',
  'js/motore/vita.js',
  'js/motore/attivo.js',
  'js/motore/atmosfera.js',
  'js/motore/interfaccia.js',
  'js/motore/risultati.js',
  'js/motore/guida.js',
  'js/motore/avvio.js',
  'icone/apple-touch-icon.png',
  'icone/favicon-48.png',
  'icone/icona-192.png',
  'icone/icona-512.png',
  'icone/icona-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(VERSIONE)
      .then(c => c.addAll(FILE))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !font) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(VERSIONE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
  );
});
