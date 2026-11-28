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
| `js/dati/trame.js` | il mondo che va avanti da solo: `PROGETTI` (sogni personali), `QUARTIERE` (eventi in città), `TRAME` (storie che nascono da sole), `PARERE` (quando chiedono un consiglio a te) |
| `js/dati/cortesie.js` | gentilezze tra clienti: caffè offerto e ricambiato, posto ceduto, ombrello prestato |
| `js/dati/giornale.js` | il giornale del caffè di Corrado: titoli per tipo di notizia, dicerie e smentite, curiosità, annunci, meteo, corsivo, reazioni di chi legge |
| `js/dati/grammatica.js` | frasi costruite a pezzi (`GRAM`): pensieri, chiacchiere, brevi e dicerie del giornale, con varianti per carattere e per circostanza |
| `js/dati/social.js` | Gocce, il social del quartiere: tipi di foto (`SO_TIPI`, con le didascalie in `GRAM.didascalia_<tipo>`), risposte agli inviti, commenti per stile, pensieri, foto della settimana |
| `js/dati/voci.js` | la «mente» dei personaggi: carattere, interessi, argomenti di conversazione, risposte per stile, notizie, litigi, pensieri, saluti, reazioni (il motore è `js/motore/mente.js`) |

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
- Perché i personaggi **restino** dopo la storia, aggiungili anche a `KEYS` (vedi sotto). Ogni personaggio in `KEYS` deve avere anche un compleanno (`COMPLEANNI` e `COMPL_L` in `js/dati/calendario.js`).
- Se la storia tocca un tema forte, aggiungi `nota`: alla fine compare una finestra con un aiuto concreto (numeri di supporto).

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

**Ogni personaggio che resta va aggiunto anche a `MENTI_K` in `js/dati/voci.js`** (il controllo lo pretende): di cosa ama parlare e, se serve, il carattere.

```js
lina: { int: ['arte', 'animali', 'viaggi'], p: { cal: 0.8 } }   // int: argomenti di TEMI; p: manopole da 0 a 1 (facoltativo)
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

## Calendario: feste e compleanni (`js/dati/calendario.js`)

L'anno del caffè dura 40 giorni: primavera (`s: 0`), estate (`1`), autunno (`2`), inverno (`3`), 10 giorni ciascuna (`g: 1…10`).

```js
{ id: 'castagne', s: 2, g: 3, n: 'La castagnata', d: 'Profumo di caldarroste (+5 Atmosfera)',
  atm: 5,                       // facoltativo: Atmosfera in più quel giorno
  ev: 'festival',               // facoltativo: usa gli effetti di un evento (più clienti, coppie, musicisti...)
  wx: 'neve',                   // facoltativo: il tempo di quel giorno
  tipi: { lettore: 6 },         // facoltativo: più clienti di un tipo
  l: ['Frasi che i clienti dicono quel giorno', 'Si può usare {item}'] }
```

Due feste non possono cadere nello stesso giorno, e i compleanni dei personaggi (`COMPLEANNI: { mia: [0, 2] }`, con la frase in `COMPL_L`) non cadono nei giorni di festa: il controllo `node tests/dati.js` lo verifica.

## La mente dei personaggi (`js/dati/voci.js`)

Ogni persona (habitué, personaggio chiave, e anche chi passa una volta sola) ha:

- un **carattere**: 8 manopole da 0 a 1 (`soc` socievolezza, `cal` calore, `iro` ironia, `sens` sensibilità, `ape` curiosità, `rom` romanticismo, `bro` brontolio, `ene` energia). Vengono dai tratti (`TRATTI_P`) e dal tipo di cliente (`TIPO_P`), più un piccolo scarto personale fisso. Dal carattere viene lo **stile** con cui risponde: `caldo`, `ironico`, `timido`, `brontolone`, `entusiasta`;
- degli **interessi** (`TRATTI_INT`, `TIPO_INT`, `MENTI_K`): gli argomenti di `TEMI` di cui ama parlare;
- un **umore** che dura nei giorni e una **memoria** (gli ultimi 24 ricordi: chi ha conosciuto, litigi, fidanzamenti visti, notizie sapute, un caffè perfetto…);
- le **notizie** che conosce: quando succede qualcosa (una coppia, un fidanzamento, una pace, un litigio), lo sanno i due e chi era presente; poi lo raccontano agli amici.

Ogni legame ha affetto, fiducia, attrazione e tensione (da 0 a 100). Crescono a ogni incontro secondo quanto i due vanno d'accordo (carattere, ironia, interessi in comune, `AFF_TR`) e secondo com'è andata la conversazione. Da lì nascono amicizie, cotte, rivalità, coppie; e ogni tanto un piccolo litigio (`LITE`), che la volta dopo si chiarisce (`CHIARO`) e rende il legame più forte.

Le conversazioni si costruiscono sul momento: un saluto (`APRI`, secondo da quanto non si vedono), la risposta (`APRI_R`), uno o due argomenti scelti tra interessi, ricordi in comune, notizie, chi è giù e si confida, progetti per il futuro, e a volte una chiusura (`CHIUDI`). Le scenette scritte di `REL` restano, ogni tanto.

**Aggiungere un argomento**: in `TEMI` con `a` (come lo tira fuori chi parla), `si` (risposte di chi è appassionato) e `solo` (pensieri da soli). Poi metterlo negli interessi di qualche tratto, tipo o personaggio.

**Aggiungere frasi**: basta allungare le liste. Le liste per stile vanno scritte per tutti e cinque gli stili. Nessuno ripete una frase finché ne ha di nuove, quindi più frasi ci sono, più tutto sembra vivo.

Segnaposti: `{B}` l'altra persona della conversazione (rispetto a chi parla in quella riga), `{X}` `{Y}` le persone di cui si parla, `{item}`, `{giorni}`, `{meteo}` («Pioveva»…), `{nome}` del locale, `{v}` visite, `{o}` per «o/a» di chi parla, `{X:o}` per «o/a» di `{X}`. Nelle frasi a due non usare lui/lei per l'altra persona. Il controllo `node tests/dati.js` segnala segnaposti sconosciuti, stili mancanti, argomenti inesistenti.

## Il mondo che va avanti da solo (`js/dati/trame.js`)

**Progetti** (`PROGETTI`): un sogno che un habitué insegue per qualche giorno, una tappa per visita, con alti e bassi.

```js
{ id: 'patente', t: 'la patente', int: ['viaggi'], passi: 4,
  an: ['Mi sono iscritt{o} a scuola guida.'],        // lo annuncia
  su: ['Oggi rotonda perfetta.'], giu: ['Ho spento la macchina sei volte.'],   // tappe
  si: ['PATENTE!'], no: ['Bocciat{o}. Mi riscrivo.'], // il traguardo
  dubbio: ['E se investo un piccione?'],              // quando chiede un parere a te
  sens: 0.5,          // facoltativo: solo per chi è sensibile (temi delicati)
  premio: 'cane' }    // facoltativo: poi viene con il suo cane
```

**Quartiere** (`QUARTIERE`): `{ id, t, n (l'avviso), dur (giorni), l: [frasi dei clienti], trama: 'id' (fa nascere una storia), dopo: 'id' (evento che segue, con solo: 1), fine: 'avviso alla fine' }`.

**Storie che nascono da sole** (`TRAME`): `cast` dice chi può viverle (`giu`, `rivali`, `lontani`, `cotta`, `segreto`, `nuovo`, `gelosia`, `grande`, `mano`, `adozione`, `festa`: il motore le trova in `TRAME_CAST`, in `js/motore/trame.js`; per un tipo nuovo va aggiunta lì una funzione). Ogni passo:

```js
{ who: 'ab',            // chi c'è: lettere dei ruoli (a solo = parla con te)
  gap: 1,               // giorni dopo il passo precedente
  calc: W => (W.attrazione('b', 'a') >= 30 ? '@si' : '@no'),   // facoltativo: un esito deciso dal mondo
  l: [ [0, 'battuta di a'], [1, 'battuta di b', '@si'],         // '@si': solo con quell'esito o scelta
       { c: { q: 'Domanda per te', o: [{ t: 'Risposta', f: '@parla', r: [[0, 'reazione']] }] } } ],
  fine: W => W.rel('a', 'b', { a: 10, fi: 10 }) }               // cosa cambia
```

Strumenti di `W`: `rel(x, y, {a, fi, at, te})`, `umore(x, v)`, `ricordo(x, tipo, y, peso)`, `affetto(x, n)` (verso di te), `attrazione(x, y)`, `scelta('valore')`, `notizia(tipo, x, y)`, `pace(x, y)`, `insieme(x, y)`, `presenta(x, y)`, `ritrovati(x, y)`, `progettoFine(x)`, `aiuto(x)`, `cane(x, nome)`. Segnaposti: `{a}` `{b}` `{c}`, `{a:o}` (o/a di a), `{o}` (di chi parla), `{P}` (il progetto di a), `{Q}`, `{item}`. `node tests/dati.js` controlla tutto.

## Gentilezze (`js/dati/cortesie.js`)

Frasi per stile per offrire il caffè (`offre`, `ricambia`), accettare o no (`si`, `no`), promettere e mantenere (`promette`, `mantiene`, `dimentica`), cedere il posto (`posto`, `postoSi`, `postoNo`), l'ombrello (`ombrello`, `rende`, `chiede`, `scusa`…), e i pensieri dopo (`CORT_PENSA`). Il motore (`js/motore/cortesie.js`) tiene il conto dei favori di ogni legame.

## Il giornale del caffè (`js/dati/giornale.js`)

Finita la storia di Corrado («L’ultima edizione»), ogni tre giorni esce un numero (`js/motore/giornale.js`, `gzEsci`), con il nome scelto dal giocatore (`GZ_NOMI`). Si scrive da solo guardando il mondo: notizie (`st.news`), sogni arrivati (`st.pjLog`), storie nate da sole (`st.trF`), storie concluse e nuovi habitué (dal registro), il quartiere; poi dicerie (vere dai legami, a volte false: il numero dopo arriva la smentita), sogni in corso, curiosità coi numeri, un annuncio (al numero dopo qualcuno con la stessa passione risponde, e si conoscono), meteo e corsivo. Per aggiungere: titoli in `GZ_PEZZI[tipo].t` (con il suo peso in `GZ_PESO` per la prima pagina), frasi in `GZ_DICERIE`, `GZ_CURIOSITA`, `GZ_ANNUNCI` (una per argomento di `TEMI`), `GZ_METEO` (uno per ogni tempo), `GZ_CORSIVO`, reazioni in `GZ_LETTORI`.

## Frasi costruite a pezzi (`js/dati/grammatica.js`)

Un modello come `'{ora}, {scena}. {sensazione}.'` sceglie un pezzo per ogni `{nome}` dalla lista `GRAM.nome` (i pezzi possono contenere altri `{nome}`; `{nome_cap}` mette la maiuscola). Varianti:

- **per carattere**: `pensiero_brontolone`, `risposta_timido`… (se esiste, si usa al posto di quella base per chi ha quello stile);
- **per circostanza**: `scena@neve`, `ora@notte`, `sensazione@giu`, `fatto_buffo@festa`… si aggiungono alla lista base quando quella circostanza è vera (e pesano il doppio). Circostanze: `pioggia temporale sereno nuvoloso nebbia neve`, `mattina pomeriggio sera notte`, `primavera estate autunno inverno`, `felice giu` (umore di chi parla), `pieno vuoto` (il locale), `festa`. `pensiero@giu` e `pensiero@felice` cambiano tutto il tono.

Regola d'oro: ogni pezzo deve stare bene con tutti gli altri della stessa lista. Niente lui/lei per gli altri; `{o}` per chi parla. `node tests/dati.js` controlla che ogni pezzo esista e conta le frasi possibili.
