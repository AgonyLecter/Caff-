# Appunti per Claude — «Caffè sotto la pioggia»

Questo file viene letto automaticamente all'inizio di ogni sessione. Serve per riprendere il lavoro esattamente da dove era rimasto.

## Il progetto e la visione

Gioco **cozy incrementale in pixel art** ambientato in un caffè notturno sotto la pioggia, con **storie potenzialmente infinite** create dai clienti e da come il giocatore interagisce con loro. Deve **toccare il cuore**: anche temi forti e attuali (depressione, perdita del lavoro, lutto…) trattati con delicatezza. Grafica caruccia e curata, gioco attivo (non un semplice clicker).

Preferenze dell'utente:

- Comunicare **in italiano**, in modo chiaro e senza gergo.
- Ogni blocco di lavoro va **messo online**: PR verso `main` e merge (GitHub Pages pubblica da `main`).
- Finire sempre il lavoro iniziato: **non lasciare niente rotto** (test verdi prima di consegnare).
- Gli screenshot del risultato sono graditi.
- **Ogni aggiornamento che interessa al giocatore va annunciato da Nonna Rosa**: aggiungere una riga in fondo a `NOVITA` (`js/dati/novita.js`), con un id nuovo e un testo nella voce di Rosa. Le cose tecniche nostre (test, codice, correzioni invisibili) no. Mai cambiare l'ordine o gli id: `st.nov` conta quante novità il giocatore ha già sentito.
- Nome del gioco: **«Caffè sotto la pioggia»** (anche nel titolo della schermata iniziale).

## Struttura (sito statico, nessuna build)

Script classici (non moduli ES) che condividono lo scope globale: funziona da `file://` e su GitHub Pages. Ordine di caricamento in `index.html`:

1. `js/motore/base.js` (e `js/motore/icone.js`, che però si carica dopo base e prima dei dati)
2. `js/dati/`: personaggi, storie, mondo, frasi, animali, vite, vite-nuove, calendario, novita, intrecci, segreti, voci, trame, cortesie, giornale (solo contenuti)
3. `js/motore/`: icone (subito dopo base.js), stato, citta, audio, simulazione, disegno-persone, disegno-locale, animali, vita, mente, trame, cortesie, giornale, regia, calendario, attivo, atmosfera, interfaccia, risultati, guida, ritorno, avvio, aggiorna

Altri file: `css/stile.css`, `sw.js` (service worker), `manifest.webmanifest`, `icone/`, `docs/come-aggiungere-contenuti.md` (guida per aggiungere personaggi/storie/vite/incroci/frasi), `README.md`, `tools/` (simulazione del ritmo).

## Come si lavora

- Formattazione: `npx prettier --write <file>` (config in `.prettierrc.json`: printWidth 140, singleQuote, arrowParens avoid, trailingComma none).
- Test veloce dei contenuti: `node tests/dati.js` (coerenza storie, fili, incroci, ricette, e che ogni script sia nella lista `FILE` di `sw.js`).
- Test completo nel browser: `NODE_PATH=$(npm root -g) node tests/smoke.js` (Playwright e Chromium sono già installati).
- Simulazione del ritmo: `NODE_PATH=$(npm root -g) node tools/ritmo-bot.js <attivo|rilassato> <ore> out.json` e poi `node tools/ritmo-report.js out.json`.
- Git: lavorare sul ramo indicato dalla sessione; aprire PR verso `main`, fare merge, poi riallineare il ramo (`git fetch origin main && git merge --ff-only origin/main && git push`).

## Trappole già scoperte

- La regola CSS `canvas{position:fixed;inset:0;...}` vale per tutti i canvas: quelli dentro i pannelli (`#mcan`, `#mdraw`) devono avere `position:static`.
- **Ogni nuovo file** va aggiunto anche alla lista `FILE` di `sw.js` (il test lo controlla).
- **A OGNI PUBBLICAZIONE aumentare `VERSIONE` in `sw.js`**: è il segnale con cui chi sta giocando riceve subito la versione nuova (`aggiorna.js`). Senza, l'aggiornamento arriva solo a chi riapre il gioco.
- Nomi globali: evitare collisioni con `window` (es. `moveTo` è stato rinominato `walkTo`) e tra file (tutti gli script condividono lo stesso spazio: un `const` ripetuto blocca tutto il gioco all'avvio; es. `burst` esiste in atmosfera.js, in audio.js si usa `noiseHit`). Dopo aver aggiunto funzioni globali, aprire la pagina e controllare che non ci siano errori.
- Nei test il salvataggio include `tutOff:1, introDone:1` e `incT=1e12; machTilt=0`, altrimenti guida, intro e incidenti casuali interferiscono. Lo splash viene saltato con `navigator.webdriver` (a meno di `?splash`).
- `CHAP_PER_DAY=3`: massimo 3 capitoli al giorno, uno per storia. Nei test azzerare `st.ds.chap`. Per l'ora di punta, azzerare `st.ds.rushPlan=[]`.
- **Regia nei test**: `startGame` mette `regia.off = true` (altrimenti un racconto in corso mette in pausa ciò che si prova). La regia si accende solo nel suo test e nel gioco accelerato. `clear()` chiama `regiaReset()`. Se un test svuota `scenes`, la regia lo capisce da sola (`!scenes.includes(regia.live)`).
- Durante un racconto (`regia.live`): niente nuovi clienti, la fila non perde pazienza, niente ora di punta, bisogni o imprevisti, l'orologio si ferma, le altre scene aspettano. Con un pannello aperto il racconto si ferma.
- **Vite uniche**: `st.fU` / `st.f2U` sono le vite (FILI / FILI2) già prese da qualcuno; una vita non si ripete mai per un'altra persona. Quando finiscono, servono vite nuove.
- **Vite per le persone giuste** (`vite-nuove.js`): `solo: 1` = la vita capita solo a chi passa `ok` (mai a caso: temi delicati, mamme, papà). `{o}` nelle battute delle vite singole diventa «o»/«a» secondo il nome (`donna(r)`, lista `NOMI_F`; `gO` in `vita.js`). Le vite a due restano neutre (usare `{B}` invece di lui/lei).
- `storyNote` deve aspettare che non ci siano finestre di scelta aperte.
- `present()` deve ignorare le persone morte.
- `offsetParent` è null per gli elementi fixed: usare `getClientRects`.
- Ricominciare usa `location.replace(location.pathname+'?nuova=1')` più il flag `resetting` (corsa di scrittura di localStorage in Chromium).
- Le modifiche con sostituzioni di testo possono fallire in silenzio su codice formattato: verificare sempre che siano avvenute. Succede anche copiando un test da un altro (es. il test di Leo ricavato da quello di Alice): dopo la copia cercare con grep che non resti niente del vecchio.
- Nel tutorial il primo cliente resta seduto finché non arriva il passo dei cocci (altrimenti, con un giocatore lento, il passo veniva saltato).
- Mente: nelle frasi a due `{B}` è sempre «l'altra persona rispetto a chi parla in quella riga»; `{o}` è il genere di chi parla, `{X:o}` quello di `{X}`. Mai lui/lei per l'altra persona. Nei test con `page.evaluate` su stringa, mai commenti `//` su una riga che continua (usare `/* */`).
- Storia di Davide (depressione): approccio di messaggistica sicura. Niente dettagli sui metodi, finale con speranza possibile, `nota` finale con aiuto concreto (numeri di supporto). Mantenere questo approccio per tutti i temi forti.

## Mappa dei sistemi

- **Mente dei personaggi** (`motore/mente.js` + `dati/voci.js`): il cuore di come i clienti parlano e si legano.
  - Carattere: 8 manopole 0–1 (`pers(o)`: soc, cal, iro, sens, ape, rom, bro, ene) da tratti (`TRATTI_P`), tipo (`TIPO_P`) e personaggi chiave (`MENTI_K`, obbligatorio per ogni KEYS: il test lo controlla), più uno scarto fisso per persona. Ne viene lo stile di risposta (`stileDi`: caldo, ironico, timido, brontolone, entusiasta) e gli interessi (`interessi` → argomenti di `TEMI`). Anche i clienti di passaggio hanno un tratto (`c.tr`, `menteArrivo`), che passa all'habitué in `makeReg`.
  - Umore e memoria nel salvataggio: `reg.mn = { u, mem[24], k[] }` (`memo`, `ricordoDi`, `umoreOra`). `menteArrivo`/`menteCongedo` all'ingresso e all'uscita (`reg.vd` ultimo giorno, `reg.gap`).
  - Legami: `st.rel[k]` ha anche `a` affetto, `fi` fiducia, `at` attrazione, `te` tensione, `n`, `ld`, `top` (argomenti recenti), `lit` (1 = litigheranno, 2 = arrabbiati). `rv(R)` inizializza i vecchi salvataggi. `advanceRel(A, B, es)` gestisce proposta e pace, poi `relCresce` fa crescere i numeri (con l'esito `es` della conversazione) e decide i passaggi (conoscenti → amici/cotta/rivali, amici → migliori o cotta, cotta → coppia, coppia → proposta, rivali → pace, litigio → chiarimento).
  - Conversazioni: `relScene` → a volte una scenetta di `REL` (con `scegli` per coppia), di solito `conversa(a, b, R)` (saluto `APRI`/`APRI_R`, argomenti scelti per voglia: interessi, ricordi, notizie, chi è giù si confida, futuro; `CHIUDI`). Prima volta: `REL.intro` o `primaConv`. Litigi `LITE` e chiarimenti `CHIARO`.
  - Notizie: `st.news` (max 40), `notizia(k, A, B)`, chi sa cosa in `mn.k`; si raccontano in conversazione (`notiziaPer`) se chi ascolta conosce uno dei due.
  - Pensieri: `pensiero(c)` (attesa, tavolo sporco, caffè perfetto, ritorno dopo giorni, traguardi, umore, ricordi, interessi, tratti, chi c'è nel locale, ora e tempo, frasi dei personaggi chiave). Saluti tra tavoli `salutaTavoli`. Reazioni dei presenti `evento(k, A, B)` (fidanzati, coppia, pace, litigio, cocci). Tocco `tocco(c)` per affetto e stile.
  - **Niente ripetizioni**: `scegli(pool, chiave, chi)` ricorda le frasi sentite nel locale (`st.vu`) e quelle dette da ognuno (`.ud`); `fresco()` fa preferire gli argomenti con frasi ancora nuove. Usare sempre `scegli` al posto di `pick` per le frasi.
  - Diario: carattere, umore e ricordo nella scheda Habitué (`carattereN`, `umoreN`, `ricordoN`); stato del legame in Legami (`relN`).

- **Mondo che va avanti da solo** (`motore/trame.js` + `dati/trame.js`):
  - Progetti (`PROGETTI`, `reg.pj = {id, s, d, ok, ult, cf, par, pronto}`, finiti in `reg.pjF` e `st.pjLog`): al massimo `1 + regs/6` (max 4) insieme, a chi ha `f>=3` e `v>=5`; una tappa per visita (`mondoArrivo`, chiamata da `menteArrivo`), traguardo con `pjFine` (dipende da umore, tifo degli amici, il tuo parere). Ciò che hanno da raccontare va in `c.pq` e `pensiero()` lo dice per primo (`daDire`).
  - Parere: `parereScena(c)` (in `onSit`): ti chiedono un consiglio (consola/sprona/scherza, `PARERE`); se va bene per il carattere (`parereVa`) aiuta il progetto; al traguardo te lo ricordano (`PARERE_DOPO`).
  - Quartiere: `st.qz` (evento in corso), `quartiereGiorno()` in `startDay`; se ne parla in `pensiero`/`conversa` (`mondoPensieri`, `mondoTemi`, che aggiunge anche i progetti degli amici).
  - Storie nate da sole: `TRAME` + `TRAME_CAST` (chi può viverle), `st.tr` in corso (max 2, una nuova al giorno, `trameNuova`), `st.trF` finite (Diario › Vite, rileggibili), `st.trFatte` (mai la stessa per gli stessi). `trameTick` → `trConvoca` (già seduti insieme, uno raggiunge l'altro con `trRaggiungi`, o li fa arrivare: `newCust`/`spawnGroup` con `trU`) → `trAvvia` (scena `story: 'trama'`, passa dalla regia, `MOM_DAY.trama = 3`). Segnalini delle scelte: `st.flags['tr<u>_<valore>'] = '1'`. `updScene` chiama `onEnd(sc)`.
- **Gentilezze** (`motore/cortesie.js` + `dati/cortesie.js`): `cortesiaOrdine` (quando un habitué arriva al bancone, un conoscente seduto offre; chi ha ricevuto ricambia; promesse `R.pr`), `cortesiaPosto` (in `serve`, tavoli pieni: un amico cede il posto, se no un amico stretto che non si alza = memoria `sgarbo`), `cortesiaUscita` (pioggia: ombrello prestato `R.omb`, poi `cortesieTick` lo fa restituire o chiedere). Conto dei favori `R.fav[id]`, `saldo`; chi offre sempre senza ricevere: memoria `sbilancio`. Nel Diario dei legami: `cortN`.
- **Giornale del caffè** (`motore/giornale.js` + `dati/giornale.js`): dopo la storia di Corrado (`arcDone('corrado')`, nome in `st.flags.corrado4` → `GZ_NOMI`), `giornaleGiorno()` in `startDay` fa uscire un numero ogni 3 giorni (`st.gz = {n, next, ed[max 8], d, served}`, `gzEsci`). Pezzi: prima pagina e cronaca (`GZ_PESO`), smentite, risposta all'annuncio (`relCresce` tra chi ha la stessa passione), dicerie (`ed.dic`, vere o false), sogni, curiosità, annuncio, meteo, corsivo. `gzLegge(c, r)` (da `menteArrivo`): chi arriva lo legge (`r.gzL`), impara le notizie (`ed.ids`), reagisce (citato, smentisce, arrossisce). Diario › Giornale (`giornaleHTML`, archivio `data-gz`).
- **Storie** (`js/dati/storie.js`, ARCS): capitoli con `req` (anche `'a|b'`), flag `end`, `rand:{from,p}` (inizio in un giorno casuale), `gap` (giorni tra capitoli), `calc:{flag,values,fn}` (finale calcolato da più scelte), `whoBy` (chi compare in base a un flag), `nota` (finestra di aiuto alla fine). Ricompensa con `reward(sec)` basata su `incomeRef()`.
- **Personaggi chiave** (`intrecci.js`): KEYS/KSEED diventano clienti abituali speciali (`ensureKeyRegs`). Ci sono gli incroci XS (`tryCross`) e gli epiloghi XEPI. Le vite autonome sono FILI e FILI2 (coppie, `startDuo`), più `socialAI`, `ritual()` e gli amici reciproci.
- **Regia** (`regia.js`): un momento importante alla volta (scene con `story`, cioè `big`). Chi aspetta mostra la stellina (`invite`, `drawInvite`); parte se lo tocchi (`regiaTap`), se il bancone è libero o dopo `REGIA_WAIT`. Testo grande in alto (`#regia`, tocca per avanzare: `regiaNext`), luce abbassata intorno (`regiaDraw`), respiro `REGIA_REST`, limiti al giorno `MOM_DAY` (vite 4 visite, incontri 2), capitoli e vite a turno (`capTurno`, `regiaVita`). Fine giornata: «Stasera ti hanno raccontato qualcosa: …» (`st.ds.mlog`).
- **Calendario** (`dati/calendario.js` + `motore/calendario.js`): anno di 40 giorni, 4 stagioni da 10 (`cal(d)` → anno, i, s, g; `CAL0=20`: il giorno 1 è il primo d'autunno, l'anno comincia a primavera; `dataN`). Il tempo segue la stagione (`STAGIONI[].wx` in `rollWx(d)`). 13 `FESTE` fisse (`ev` riusa EVENTS, `wx`, `atm`, `tipi`, `regali`, frasi `l`); nome mostrato con `giornoEv`. Compleanni: fissi per i personaggi chiave (`COMPLEANNI`, frase `COMPL_L`, scena con scelta `compleanno()`, il festeggiato passa da solo con `calTick`), «a caso ma fisso» per gli altri (`complI`, festa piccola in `calOnSit`). Anniversari delle coppie 40 giorni dopo `rel.d` (`calAnniv` in relScene, `calRitoAnniv` in ritual). Ultima sera dell'anno: riepilogo `calFineAnno` (foto di inizio anno `st.yr`). Pannello Giorno: `calHTML` (striscia dei 10 giorni, prossime feste/compleanni/anniversari). Fuori dalla finestra foglie, petali, lucciole (`calParts`/`calDraw`). Orologio: «7 aut · 12:00».
- **Gioco attivo** (`attivo.js`):
  - ora di punta (`rush`, moltiplicatore fino a x3);
  - bisogni ai tavoli (`NEEDS`, `tapNeed`);
  - incidenti (macchina storta, ombrelli dimenticati).
- **Minigiochi** (`risultati.js`):
  - possono partire solo dal pulsante;
  - risultato animato;
  - latte art a mano libera (`manoScore`: F1 su griglia 48, soglie .72/.45).
- **Laboratorio ricette** (`INGR`, `RICETTE`, `labTry`): le ricette scoperte entrano nel menu (`availMenu`, `itemOf`).
- **Personalizzazioni**:
  - macchina del caffè (`MACH`, `drawMachine`);
  - insegne al neon sui muri (`NEONS`, `wallSlots`, `drawNeons` dopo `lighting()`).
- **Accoglienza** (`guida.js`):
  - scena d'introduzione (`INTRO`): Nonna Rosa spiega che contano le storie, non solo le monete;
  - **tutorial a passi** (`TUT`, stato `tut`): Nonna Rosa resta nel locale (`TUT_STAY`) e fa provare tutto: primo cliente, toccare chi è seduto, un bisogno, un ordine speciale, cocci, tavolo sporco, monete, barista, macchina in tilt, il primo racconto (Gino, il garzone del vecchio forno, `GINO`, scena `noAuto` che parte solo toccando la stellina; poi diventa l'habitué `r_gino` con la storia «Il garzone del forno» nel Diario; non usare nomi dei personaggi chiave, es. Aldo esiste già), Diario, Atmosfera, saluto. I clienti di prova hanno `c.tut` (pazienza infinita, si siedono sempre, `forceSpecial`, `noDirty`). Durante `tut` niente clienti normali, storie, imprevisti casuali, e l'orologio è fermo. «Salta il tutorial» chiude tutto (`tutEnd(true)`). Parte solo nelle partite nuove (giorno 1, meno di 10 serviti);
  - consigli sulle novità (`GUIDA`, anello `#gring`), che scattano quando serve dopo il tutorial.
- **Comodità e suoni**: tre volumi separati (`st.vol = {m, s, a}` 0–100: musica `musG`, effetti `sfxG`, ambiente `ambG` con pioggia e voci; `applyVol`, `VOL0`), velocità del testo (`st.txtV` lenta/normale/veloce → `TXTV` in `sayDur`), «i racconti vanno avanti quando tocco io» (`st.txtTap` → `sc.waitTap`, sblocca `regiaNext`), testo grande (`st.bigTxt` → classe `grande` su `<html>`, `applyBig`; fumetti ×1.3). Suoni nuovi in `audio.js`: campanello della porta (`bell` + `thud`), tazzina (`cup`), piatti (`piatti`, pulizia), cocci (`crash`), gocce sul vetro e raffiche di pioggia (`drip`). Durante un racconto gli avvisi vanno in basso (`body.racconto`).
- **Tutto a tema** (`icone.js`): un'icona in pixel art per ogni miglioramento (`PXU` → `UPI`, anche nel «Consiglio») e per ogni scheda (`PXT` → `TABI`); frecce e stellina disegnate (`ICO.dx/sx/stella`, `pxText` converte › ‹ ✦; sul canvas `ctxPx('frdx'|'frsx')`); cursore a tazzina e chicco sui pulsanti (`--cur`, `--cur2`, solo `pointer: fine`); cursori del volume a chicco di caffè (`--bean`); barre di scorrimento, selezione e contorno della tastiera a tema. Un miglioramento nuovo vuole anche la sua icona in `PXU` (il test lo controlla).
- **Ritorno al caffè** (`ritorno.js` + `dati/novita.js`): mentre il gioco è chiuso si guadagna una parte delle monete (`offline`, max 8 ore) e **nient'altro va avanti** (storie, vite, giorno: succedono solo davanti al giocatore). Al ritorno, dopo almeno 10 minuti, il «diario della notte» (`diarioNotte`, testi `NOTTE`): 1-3 piccole notizie senza effetti (gatto, biglietti degli habitué, coppie sotto la tettoia, frasi dei personaggi di casa). Poi Nonna Rosa racconta le novità non ancora sentite (`novitaInizio`, al massimo 4); in una partita nuova vengono segnate come già sentite.
- **Aggiornamenti in diretta** (`aggiorna.js`): ogni 3 minuti e al ritorno sulla scheda il gioco legge `VERSIONE` da `sw.js` (senza cache); se è cambiata salva, aspetta un momento tranquillo (`momentoTranquillo`: niente racconti, scelte, minigiochi, finestre, pannelli, tutorial) e si ricarica, rientrando subito nel locale (`sessionStorage cafe_agg`). Il service worker chiede sempre al server se i file sono cambiati (`cache: 'no-cache'`). Funziona solo da http/https (GitHub Pages, itch.io); il test usa un piccolo server locale.
- **PWA**: installabile; il service worker legge prima dalla rete e usa la cache se manca la connessione.

## Contenuti attuali

25 personaggi, 27 storie (94 capitoli), 59 vite, 19 vite di coppia, 13 feste, 22 compleanni, 26 incroci, 15 epiloghi, 12 ricette, 14 insegne al neon, 15 argomenti di conversazione e circa 670 frasi della mente, 18 progetti, 10 eventi di quartiere, 11 storie che nascono da sole, gentilezze (caffè, posto, ombrello).

Ritmo con la regia (simulazione «attivo», 3 ore, il bot non tocca le stelline): circa 2 capitoli al giorno, 40 capitoli verso i 160 minuti (prima a 57), le vite partono verso l'ora di gioco; i potenziamenti arrivano ancora fino a circa 3 ore. Le storie ora durano di più apposta, per gustarle; se sembra troppo lento, alzare `MOM_DAY` o abbassare `REGIA_REST`/`REGIA_WAIT`. Il gioco avanzato si regge su vite infinite e relazioni; il calendario (fase 2) serve a dargli più struttura.

## Fatto finora (PR #6 → #37)

- Minigiochi solo dal pulsante.
- Grafica più curata.
- Animali che interagiscono tra loro.
- Fase 1 corposa: frasi, intrecci, vite autonome dei personaggi.
- Codice diviso in file.
- Storie di Davide (depressione e perdita del lavoro) e di Yusuf.
- Storia di Alice («Ricominciare», dopo un tumore): 5 capitoli, si intreccia con Sara (l'infermiera del day hospital) e Davide, `nota` con SOS LILT 800 998877 e AIMaC 840 503579; diventa habitué con vita personale «La recita», epilogo e compleanno.
- Storia di Leo («Un nonno in prestito», lutto per il nonno a 15 anni): 5 capitoli dopo la storia di Aldo (`req: ['tazze']`), gli scacchi di nonno Nino, Aldo diventa il suo nonno acquisito (legame `famiglia`), incontro con Giada, `nota` con Telefono Azzurro 19696; vita personale «Il primo torneo».
- Analisi e ribilanciamento del ritmo.
- Gioco più attivo: ora di punta, bisogni, incidenti.
- Risultati animati dei minigiochi.
- Menu a griglia invece che a scorrimento laterale.
- Schermata d'avvio con il titolo al neon.
- Personalizzazione della macchina.
- Neon sui muri.
- Latte art a mano libera.
- Laboratorio ricette.
- PWA.
- Guida e intro con Nonna Rosa.
- Tutorial vero con Nonna Rosa (16 passi, il primo racconto di Gino).
- Vite uniche (niente testi uguali per persone diverse) e regia dei racconti (un momento alla volta).
- Decorazioni stagionali nel locale (ghirlanda, bancone), monete col chicco, iconcine negli avvisi.
- Aggiornamenti in diretta: chi sta giocando riceve subito la versione nuova, senza perdere niente.
- Diario «mentre eri via» e novità raccontate da Nonna Rosa all'apertura.
- Tutto a tema: icone pixel per miglioramenti e schede, frecce disegnate, cursore a tazzina, volume a chicco di caffè, barre di scorrimento.
- Comodità e suoni: volumi separati, velocità del testo, racconti a tocco, testo grande, suoni nuovi (porta, tazzine, piatti, cocci, pioggia).
- Calendario: stagioni, 13 feste, compleanni, anniversari, riepilogo di fine anno, foglie/petali/lucciole.
- Mente dei personaggi: carattere, umore, memoria, legami con affetto/fiducia/attrazione/tensione, conversazioni costruite sul momento, notizie che girano, litigi e chiarimenti, saluti tra tavoli, reazioni, niente frasi ripetute.
- Mondo che va avanti da solo: progetti personali, pareri chiesti a te, eventi di quartiere, storie che nascono da sole; gentilezze tra clienti con conto dei favori.
- Storia di Corrado («L’ultima edizione», giornalista rimasto senza giornale; dopo Davide, con Nonna Rosa e Davide impaginatore): poi fonda il giornale del caffè.
- 25 vite nuove e 10 vite a due nuove (anche temi forti: un genitore che dimentica, solitudine, bullismo, mamma sola, separazione, coming out, lutto per un animale, panico, esaurimento).

## Prossimi passi (in ordine)

0. Mente dei personaggi: fatto (prima base). Idee per dopo: più frasi per ogni stile e argomento (più ce ne sono, più sembrano vivi), argomenti nuovi, gelosia e triangoli delicati, amici che presentano amici ad altri amici, i personaggi chiave che raccontano le loro storie agli altri.
1. Comodità e suoni: fatto. **NON** fare l'opzione «grafica leggera» per telefoni: l'utente non la vuole.
   **Prossimo blocco chiesto dall'utente: versione inglese completa** (scelta della lingua nel menu e nella schermata d'avvio) **e pacchetto per itch.io**. Piano: dizionario EN con chiavi = hash del testo italiano, traduzione dei dati all'avvio, `L()` per i testi del codice, test di copertura che segnala le frasi senza traduzione.
   Blocco precedente: **nuovi personaggi con storie lunghe**, uno alla volta (ognuno 4-5 capitoli intrecciati con quelli esistenti). Fatto: Alice (dopo una malattia), Leo (lutto per il nonno, con Aldo nonno acquisito). Da fare: un rider che manda soldi a casa, un uomo appena uscito di prigione, un'insegnante vicina alla pensione. Per ogni personaggio: `CH`, arco in `ARCS` (con `nota` se il tema è forte), `KEYS`, `KSEED`, un `XS` e un `XEPI`, `COMPLEANNI` + `COMPL_L` (i test lo pretendono, mai in un giorno di festa), vita personale `k_<id>` in `vite-nuove.js`, eventuale `perkAtm`, e un test nel browser che gioca tutta la storia (nel test abbassare `rand.from` e far uscire i personaggi già seduti: le storie aspettano se uno dei loro personaggi è nel locale). Poi un **finale per chi completa tutto** (serata con tutti i personaggi e lettera di Nonna Rosa).
2. Calendario: fatto. Idee per dopo: un richiamo alla data reale (Natale, Capodanno…), decorazioni stagionali dentro il locale, ricette di stagione.
3. Altre idee già discusse:
   - versione in inglese;
   - altre storie forti trattate con cura (anziano solo, bullismo, madre single…);
   - un finale per chi completa tutto.

   Suggerire anche una prova del gioco con persone vere.

Prima di iniziare qualsiasi blocco, leggere i file coinvolti, poi lavorare, far passare i test, aprire la PR e fare il merge. Alla fine raccontare all'utente in italiano cosa è cambiato.
