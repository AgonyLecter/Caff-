# Come aggiungere contenuti

Tutti i contenuti del gioco stanno in `js/dati/`. Il motore (`js/motore/`) li legge da solo:
per un personaggio, una storia, una vita o un incontro nuovi **non serve toccare il motore**.

Dopo ogni modifica:

```bash
node tests/dati.js     # un secondo: controlla che i contenuti siano coerenti
node tests/smoke.js    # qualche minuto: gioca davvero nel browser (serve Playwright)
```

`tests/dati.js` dice in italiano cosa non va e dove (per esempio `pioggia/0/2: chi parla (3) non esiste`).

## Dove sta cosa

| File | Contenuto |
| --- | --- |
| `js/dati/personaggi.js` | `CH` personaggi delle storie, `TYPES` tipi di cliente, colori e nomi dei clienti casuali |
| `js/dati/storie.js` | `ARCS` storie principali a capitoli, `CINE` testo del filmato iniziale |
| `js/dati/vite.js` | `FILI` vite in tre visite di un habitué, `FILI2` vite a due (coppie, amici, rivali, famiglie) |
| `js/dati/intrecci.js` | `KEYS` personaggi che restano dopo la storia, `KSEED` legami di partenza, `XS` incontri tra storie, `XEPI` epiloghi |
| `js/dati/frasi.js` | `REL` frasi per ogni tipo di legame, `PAIRS` coppie di passaggio, `SOLO` battute da soli, recensioni, battute di Tommy |
| `js/dati/animali.js` | colori, nomi e frasi degli animali da compagnia |
| `js/dati/mondo.js` | menu, stili, quartieri, meteo, eventi, richieste speciali, radio, minigiochi |
| `js/dati/segreti.js` | `EGGS` segreti, `RARE` visitatori rari |

## Le battute

Quasi tutto è fatto di battute nello stesso formato:

```js
[0, 'Ciao, posso sedermi?']              // parla il personaggio 0 (il primo dell'elenco "who")
[1, '*sorride*']                          // tra asterischi: è un'azione, appare in corsivo
[0, 'Che bello rivederti.', 'pioggia=adesso']  // solo se il giocatore aveva scelto "adesso" nella storia "pioggia"
```

Una **scelta del giocatore** si scrive così (in mezzo alle battute):

```js
{ c: {
  q: 'Mia ti guarda: «Che faccio?»',          // la domanda nella finestra
  o: [
    { t: '«Chiedile di uscire.»', f: 'pioggia=adesso', r: [[1, 'Sabato?'], [0, 'Sabato.']] },
    { t: '«Prima la canzone.»',   f: 'pioggia=canzone', r: [[1, 'Ci lavoro stanotte.']] }
  ]
} }
```

`f` è il segno che resta nella partita (`storia=valore`); `r` sono le risposte che seguono subito.
Le battute con condizione funzionano dai **capitoli successivi** a quello della scelta.

## Un personaggio nuovo (`CH`)

```js
lina: { n: 'Lina', l: {
  s: '#f6d2b0',   // pelle
  h: '#3b2418',   // capelli
  hs: 11,         // pettinatura: 0 corti, 1 lunghi, 2 coda, 3 chignon, 4 ricci, 5 pochi capelli, 6 caschetto,
                  // 7 a punte, 8 cappellino, 9 berretto col pon pon, 10 due chignon, 11 codini, 12 basco, 13 lunghi col fiore, 14 fiocco
  o: 1,           // vestito: 0 maglietta, 1 felpa, 2 cappotto, 3 vestito, 4 camicia e cravatta
  c1: '#90be6d',  // colore sopra
  c2: '#264653',  // colore sotto
  hc: '#e63946',  // colore di cappellino, berretto, basco o cappello (facoltativo)
  ac: '#ffd166',  // colore di sciarpa, cuffie, fiocco, libro... (facoltativo)
  sh: '#f4f1de',  // scarpe (facoltativo)
  a: 'occhiali lentiggini',  // accessori: occhiali barba cuffie orecchino sciarpa lentiggini fiore rossetto
                             //            farfallino cappello infermiera cuoco grembiule gilet
  act: 'book',    // cosa fa seduta: book phone news sketch guitar knit camera (facoltativo)
  pet: { k: 'gatto', n: 'Miso', c: '#e8a060', c2: '#b8703a' }  // animale: cane gatto coniglio uccellino (facoltativo)
} }
```

## Una storia nuova (`ARCS`)

```js
{ id: 'serra', t: 'La serra sul tetto', d: 'Descrizione nel Diario.',
  who: ['lina', 'elio'],        // chi c'è (al massimo 2 per tavolo)
  req: ['scacchi'],             // facoltativo: storie da finire prima; 'scacchi=torneo' vuole anche un finale;
                                // 'lettere|tokyo' vuol dire «una delle due»
  perk: 'serra', pt: 'Premio scritto nel Diario',
  end: {                        // facoltativo: finali diversi secondo una scelta
    'serra=rose':   { n: 'Le rose',   perk: 'serra', pt: '...' },
    'serra=limoni': { n: 'I limoni',  perk: 'serra', pt: '...' }
  },
  ch: [                         // capitoli: r è l'Atmosfera minima, sempre crescente
    { t: 'Titolo', r: 30, l: [ /* battute */ ] },
    { t: 'Altro', r: 45, who: ['lina', 'rosa'], l: [ /* chi c'è può cambiare per capitolo */ ] }
  ],
  rt: [ [[0, 'Battuta di routine'], [1, 'Risposta']] ]  // scambi brevi dopo la fine (personaggi dell'ultimo capitolo)
}
```

- Se la storia ha `end`, ogni finale deve avere almeno una battuta propria nell'ultimo capitolo.
- Un `perk` nuovo vale solo come testo finché non gli si dà un effetto nel motore (per esempio Atmosfera in `perkAtm`, in `js/motore/stato.js`).
- Perché i personaggi **restino** dopo la storia, aggiungili anche a `KEYS` (vedi sotto).

## Un personaggio che resta (`KEYS`)

Finita la sua storia, diventa un habitué speciale che torna da solo o in compagnia.

```js
lina: {
  type: 'artista',             // normale studente fretta turista nonno lettore nottambulo artista musicista influencer
  fav: 'matcha',               // cosa ordina di solito (id del menu)
  tr: ['timido', 'artista'],   // tratti: romantico chiacchierone timido brontolone artista sportivo sognatore nerd
  ok: () => arcDone('serra'),  // da quando torna
  w: () => 1,                  // facoltativo: quanto spesso (0.25 = di rado)
  l: [                         // battute da sola al tavolo
    'Le rose hanno fatto il primo bocciolo.',
    ['Ho piantato i limoni come mi avevi detto.', 'serra=limoni']   // solo con quel finale
  ]
}
```

Legami già esistenti tra personaggi che restano (`KSEED`):

```js
['lina', 'elio', () => arcDone('serra'), () => 'amici']   // amici migliori coppia sposati famiglia cotta rivali
```

## Incontri tra storie (`XS`) ed epiloghi (`XEPI`)

Un **incontro** succede una sola volta, quando due personaggi che restano si trovano allo stesso tavolo
(il gioco li fa anche arrivare insieme ogni tanto). Un **epilogo** è lo stesso, ma con un personaggio solo.

```js
{ id: 'x_lina_rosa', w: ['lina', 'rosa'], req: () => arcDone('serra') && arcDone('consegne'),
  l: [[0, 'Lei è Nonna Rosa?'], [1, 'Dipende da chi lo chiede.'], [0, 'Le ho portato dei limoni.', 'serra=limoni']] }
```

## Vite degli habitué (`FILI`) e vite a due (`FILI2`)

Tre visite; nella seconda c'è una scelta con due risposte, `@a` e `@b`, e la terza cambia di conseguenza.

**Ogni vita la vive una persona sola** (e ogni vita a due una coppia sola): così il giocatore non legge mai la stessa
storia con le stesse parole per due persone diverse. Quando tutte le vite sono state vissute, gli habitué continuano
con legami, incontri e rituali; per avere altre vite bisogna scriverne di nuove (più ce ne sono, meglio è).
Le vite nuove si possono mettere in `js/dati/vite-nuove.js` (con `FILI.push(...)` e `FILI2.push(...)`).

- `solo: 1` → la vita capita **solo** a chi passa il controllo `ok`, mai a caso a un altro habitué. Usalo per i temi delicati
  e per le vite legate a un ruolo (una mamma, un papà, un pensionato).
- `{o}` → nelle vite singole diventa «o» o «a» secondo il nome dell'habitué: `'Sono andat{o}'` → «Sono andato» / «Sono andata».
  `donna(r)` dice se il nome è femminile (lista `NOMI_F`), utile anche dentro `ok`.
- Nelle vite a due niente lui/lei: usa `{A}` e `{B}`.
- I temi forti seguono l'approccio della storia di Davide: delicatezza, niente dettagli crudi, una via d'uscita, chiedere aiuto è normale.

```js
{ id: 'serra2', t: 'Titolo nel Diario',
  ok: r => r.tr.includes('sognatore'),   // a chi può capitare (r è l'habitué: r.type, r.tr, r.key, r.pet...)
  p: 1,                                   // facoltativo: precedenza (per le vite dei personaggi chiave)
  b: [
    [[0, 'Prima visita...']],
    [[0, 'Seconda visita...'], { c: { q: 'Domanda', o: [
      { t: 'Risposta A', f: '@a', r: [[0, '...']] },
      { t: 'Risposta B', f: '@b', r: [[0, '...']] } ] } }],
    [[0, 'Finale A', '@a'], [0, 'Finale B', '@b'], [0, 'Chiusura comune']]
  ],
  e: { a: 'ha fatto la cosa A', b: 'ha fatto la cosa B' }   // compare come «Nome ha fatto la cosa A»
}
```

Nelle **vite a due** parlano `0` e `1`, si può usare `{A}` e `{B}` per i nomi, e si indica per quali legami valgono:
`k: ['coppia', 'fidanzati']`. Con `fx: 'sposati'` il legame cambia alla fine.
In tutte le battute `{item}` diventa quello che il cliente sta bevendo.

## Frasi (`REL`)

`REL.amici`, `REL.coppia`, `REL.rivali`… sono elenchi di piccoli scambi tra due habitué con quel legame.
Per aggiungerne basta un altro elemento: `[[0, 'Ciao {B}!'], [1, 'Ciao {A}.']]`.
