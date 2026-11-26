# Caffè sotto la pioggia

Un cozy game incrementale in pixel art: un piccolo caffè in una città dove piove sempre,
clienti che tornano, si conoscono, si innamorano e vivono le loro storie.

**Si gioca aprendo `index.html` nel browser** (in orizzontale sul telefono). Non serve compilare niente:
è un sito statico che funziona anche su GitHub Pages. Da GitHub Pages si può **installare sul telefono**
come un'app (Impostazioni → «Installa il gioco sul telefono») e funziona anche **senza connessione**.

## Struttura

```
index.html          la pagina (solo HTML)
css/stile.css       lo stile dell'interfaccia
js/motore/          il gioco: simulazione, disegno, audio, interfaccia
js/dati/            i contenuti: personaggi, storie, vite, incontri, frasi
tests/dati.js       controllo veloce dei contenuti (senza browser)
tests/smoke.js      prova completa nel browser
docs/               guida per aggiungere contenuti
manifest.webmanifest, sw.js, icone/   app installabile e funzionamento offline
```

Se aggiungi un file al gioco, aggiungilo anche alla lista `FILE` in `sw.js` (il controllo `node tests/dati.js` te lo ricorda).

I file si caricano nell'ordine scritto in fondo a `index.html`: prima `js/motore/base.js`,
poi i contenuti, poi il resto del motore. Sono script normali (non moduli), così il gioco funziona
anche aprendo il file direttamente.

## La regia dei racconti

I momenti importanti (capitoli, vite degli habitué, incontri, visitatori rari) arrivano **uno alla volta**
(`js/motore/regia.js`). Chi vuole raccontare fa segno con una stellina e aspetta che il giocatore lo tocchi
(o che il bancone si liberi); mentre racconta il locale si calma e l'orologio si ferma, e il testo compare
grande in alto. Dopo ogni racconto c'è un breve respiro, e ogni giorno ha un numero massimo di momenti.

## Aggiungere personaggi e storie

Vedi [docs/come-aggiungere-contenuti.md](docs/come-aggiungere-contenuti.md).

## Controlli

```bash
node tests/dati.js     # contenuti coerenti (un secondo)
node tests/smoke.js    # partita automatica nel browser (serve Playwright con Chromium)
prettier --write "js/**/*.js" css tests   # impaginazione uniforme
```
