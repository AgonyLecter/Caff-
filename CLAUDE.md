# Appunti per Claude — «Caffè sotto la pioggia»

Questo file viene letto automaticamente all'inizio di ogni sessione. Serve per riprendere il lavoro esattamente da dove era rimasto.

## Il progetto e la visione

Gioco **cozy incrementale in pixel art** ambientato in un caffè notturno sotto la pioggia, con **storie potenzialmente infinite** create dai clienti e da come il giocatore interagisce con loro. Deve **toccare il cuore**: anche temi forti e attuali (depressione, perdita del lavoro, lutto…) trattati con delicatezza. Grafica caruccia e curata, gioco attivo (non un semplice clicker).

Preferenze dell'utente:

- Comunicare **in italiano**, in modo chiaro e senza gergo.
- Ogni blocco di lavoro va **messo online**: PR verso `main` e merge (GitHub Pages pubblica da `main`).
- Finire sempre il lavoro iniziato: **non lasciare niente rotto** (test verdi prima di consegnare).
- Gli screenshot del risultato sono graditi.
- Nome del gioco: **«Caffè sotto la pioggia»** (anche nel titolo della schermata iniziale).

## Struttura (sito statico, nessuna build)

Script classici (non moduli ES) che condividono lo scope globale: funziona da `file://` e su GitHub Pages. Ordine di caricamento in `index.html`:

1. `js/motore/base.js`
2. `js/dati/`: personaggi, storie, mondo, frasi, animali, vite, intrecci, segreti (solo contenuti)
3. `js/motore/`: stato, citta, audio, simulazione, disegno-persone, disegno-locale, animali, vita, regia, attivo, atmosfera, interfaccia, risultati, guida, avvio

Altri file: `css/stile.css`, `sw.js` (service worker), `manifest.webmanifest`, `icone/`, `docs/come-aggiungere-contenuti.md` (guida per aggiungere personaggi/storie/vite/incroci/frasi), `README.md`, `tools/` (simulazione del ritmo).

## Come si lavora

- Formattazione: `npx prettier --write <file>` (config in `.prettierrc.json`: printWidth 140, singleQuote, arrowParens avoid, trailingComma none).
- Test veloce dei contenuti: `node tests/dati.js` (coerenza storie, fili, incroci, ricette, e che ogni script sia nella lista `FILE` di `sw.js`).
- Test completo nel browser: `NODE_PATH=$(npm root -g) node tests/smoke.js` (Playwright e Chromium sono già installati).
- Simulazione del ritmo: `NODE_PATH=$(npm root -g) node tools/ritmo-bot.js <attivo|rilassato> <ore> out.json` e poi `node tools/ritmo-report.js out.json`.
- Git: lavorare sul ramo indicato dalla sessione; aprire PR verso `main`, fare merge, poi riallineare il ramo (`git fetch origin main && git merge --ff-only origin/main && git push`).

## Trappole già scoperte

- La regola CSS `canvas{position:fixed;inset:0;...}` vale per tutti i canvas: quelli dentro i pannelli (`#mcan`, `#mdraw`) devono avere `position:static`.
- **Ogni nuovo file** va aggiunto anche alla lista `FILE` di `sw.js` (il test lo controlla), e quando cambia molto conviene aumentare `VERSIONE`.
- Nomi globali: evitare collisioni con `window` (es. `moveTo` è stato rinominato `walkTo`).
- Nei test il salvataggio include `tutOff:1, introDone:1` e `incT=1e12; machTilt=0`, altrimenti guida, intro e incidenti casuali interferiscono. Lo splash viene saltato con `navigator.webdriver` (a meno di `?splash`).
- `CHAP_PER_DAY=3`: massimo 3 capitoli al giorno, uno per storia. Nei test azzerare `st.ds.chap`. Per l'ora di punta, azzerare `st.ds.rushPlan=[]`.
- **Regia nei test**: `startGame` mette `regia.off = true` (altrimenti un racconto in corso mette in pausa ciò che si prova). La regia si accende solo nel suo test e nel gioco accelerato. `clear()` chiama `regiaReset()`. Se un test svuota `scenes`, la regia lo capisce da sola (`!scenes.includes(regia.live)`).
- Durante un racconto (`regia.live`): niente nuovi clienti, la fila non perde pazienza, niente ora di punta, bisogni o imprevisti, l'orologio si ferma, le altre scene aspettano. Con un pannello aperto il racconto si ferma.
- **Vite uniche**: `st.fU` / `st.f2U` sono le vite (FILI / FILI2) già prese da qualcuno; una vita non si ripete mai per un'altra persona. Quando finiscono, servono vite nuove.
- `storyNote` deve aspettare che non ci siano finestre di scelta aperte.
- `present()` deve ignorare le persone morte.
- `offsetParent` è null per gli elementi fixed: usare `getClientRects`.
- Ricominciare usa `location.replace(location.pathname+'?nuova=1')` più il flag `resetting` (corsa di scrittura di localStorage in Chromium).
- Le modifiche con sostituzioni di testo possono fallire in silenzio su codice formattato: verificare sempre che siano avvenute.
- Storia di Davide (depressione): approccio di messaggistica sicura. Niente dettagli sui metodi, finale con speranza possibile, `nota` finale con aiuto concreto (numeri di supporto). Mantenere questo approccio per tutti i temi forti.

## Mappa dei sistemi

- **Storie** (`js/dati/storie.js`, ARCS): capitoli con `req` (anche `'a|b'`), flag `end`, `rand:{from,p}` (inizio in un giorno casuale), `gap` (giorni tra capitoli), `calc:{flag,values,fn}` (finale calcolato da più scelte), `whoBy` (chi compare in base a un flag), `nota` (finestra di aiuto alla fine). Ricompensa con `reward(sec)` basata su `incomeRef()`.
- **Personaggi chiave** (`intrecci.js`): KEYS/KSEED diventano clienti abituali speciali (`ensureKeyRegs`). Ci sono gli incroci XS (`tryCross`) e gli epiloghi XEPI. Le vite autonome sono FILI e FILI2 (coppie, `startDuo`), più `socialAI`, `ritual()` e gli amici reciproci.
- **Regia** (`regia.js`): un momento importante alla volta (scene con `story`, cioè `big`). Chi aspetta mostra la stellina (`invite`, `drawInvite`); parte se lo tocchi (`regiaTap`), se il bancone è libero o dopo `REGIA_WAIT`. Testo grande in alto (`#regia`, tocca per avanzare: `regiaNext`), luce abbassata intorno (`regiaDraw`), respiro `REGIA_REST`, limiti al giorno `MOM_DAY` (vite 4 visite, incontri 2), capitoli e vite a turno (`capTurno`, `regiaVita`). Fine giornata: «Stasera ti hanno raccontato qualcosa: …» (`st.ds.mlog`).
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
  - **tutorial a passi** (`TUT`, stato `tut`): Nonna Rosa resta nel locale (`TUT_STAY`) e fa provare tutto: primo cliente, toccare chi è seduto, un bisogno, un ordine speciale, cocci, tavolo sporco, monete, barista, macchina in tilt, il primo racconto (il signor Aldo, `ALDO`, scena `noAuto` che parte solo toccando la stellina; poi diventa l'habitué `r_aldo` con la storia «Il forno di Ines» nel Diario), Diario, Atmosfera, saluto. I clienti di prova hanno `c.tut` (pazienza infinita, si siedono sempre, `forceSpecial`, `noDirty`). Durante `tut` niente clienti normali, storie, imprevisti casuali, e l'orologio è fermo. «Salta il tutorial» chiude tutto (`tutEnd(true)`). Parte solo nelle partite nuove (giorno 1, meno di 10 serviti);
  - consigli sulle novità (`GUIDA`, anello `#gring`), che scattano quando serve dopo il tutorial.
- **PWA**: installabile; il service worker legge prima dalla rete e usa la cache se manca la connessione.

## Contenuti attuali

22 personaggi, 24 storie (79 capitoli), 31 vite, 9 vite di coppia, 24 incroci, 13 epiloghi, 12 ricette, 14 insegne al neon.

Ritmo con la regia (simulazione «attivo», 3 ore, il bot non tocca le stelline): circa 2 capitoli al giorno, 40 capitoli verso i 160 minuti (prima a 57), le vite partono verso l'ora di gioco; i potenziamenti arrivano ancora fino a circa 3 ore. Le storie ora durano di più apposta, per gustarle; se sembra troppo lento, alzare `MOM_DAY` o abbassare `REGIA_REST`/`REGIA_WAIT`. Il gioco avanzato si regge su vite infinite e relazioni; il calendario (fase 2) serve a dargli più struttura.

## Fatto finora (PR #6 → #24)

- Minigiochi solo dal pulsante.
- Grafica più curata.
- Animali che interagiscono tra loro.
- Fase 1 corposa: frasi, intrecci, vite autonome dei personaggi.
- Codice diviso in file.
- Storie di Davide (depressione e perdita del lavoro) e di Yusuf.
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
- Tutorial vero con Nonna Rosa (16 passi, il primo racconto del signor Aldo).
- Vite uniche (niente testi uguali per persone diverse) e regia dei racconti (un momento alla volta).

## Prossimi passi (in ordine)

1. **Comodità e suoni** — da fare per primo:
   - volume separato per musica ed effetti;
   - velocità del testo;
   - testo grande;
   - qualche suono più bello (pioggia, tazzine, porta).

   **NON** fare l'opzione «grafica leggera» per telefoni: l'utente non la vuole.
2. **Calendario interno (fase 2)**:
   - anno di 40 giorni, con 4 stagioni da 10 giorni;
   - feste, compleanni e anniversari dei personaggi;
   - eventualmente un richiamo alla data reale.
3. Altre idee già discusse:
   - versione in inglese;
   - altre storie forti trattate con cura (anziano solo, bullismo, madre single…);
   - un finale per chi completa tutto.

   Suggerire anche una prova del gioco con persone vere.

Prima di iniziare qualsiasi blocco, leggere i file coinvolti, poi lavorare, far passare i test, aprire la PR e fare il merge. Alla fine raccontare all'utente in italiano cosa è cambiato.
