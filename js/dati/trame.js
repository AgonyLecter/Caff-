// Il mondo che va avanti da solo (il motore è in js/motore/trame.js).
// PROGETTI: ognuno insegue qualcosa (la patente, un esame, fare pace con il padre...): va avanti a ogni visita,
//   con alti e bassi, gli amici chiedono come va, e a volte ti chiedono un parere.
// QUARTIERE: cose che succedono nel quartiere; tutti ne parlano, e qualcuna fa nascere una storia.
// TRAME: storie che nascono da sole quando il mondo crea la situazione giusta (chi è giù, chi è innamorato,
//   chi non si vede da tanto...). Ogni storia ha i suoi personaggi (a, b, c), tre passi, e spesso una tua scelta.
//
// Segnaposti: {a} {b} {c} i nomi dei personaggi della storia, {P} il progetto di chi parla (o di «a» nelle storie),
// {o} «o/a» di chi parla, {item} quello che beve, {Q} l'evento del quartiere.

/* ---------------- Progetti ---------------- */
// int: a chi piace di più (argomenti di TEMI); passi: quante tappe; premio: 'cane' = poi viene con il suo cane.
// an: lo annuncia; su: è andata bene; giu: un intoppo; si: ce l'ha fatta; no: non ce l'ha fatta; dubbio: lo confida a te.
const PROGETTI = [
  {
    id: 'patente',
    t: 'la patente',
    int: ['viaggi', 'sport'],
    passi: 4,
    an: ['Mi sono iscritt{o} a scuola guida. Alla mia età. Non ridete.', 'Ho deciso: prendo la patente. Il mondo è avvisato.'],
    su: ['Oggi ho fatto una rotonda perfetta. Una sola, ma perfetta.', 'L’istruttore ha detto «non male». Da lui è un’ovazione.'],
    giu: [
      'Ho spento la macchina sei volte allo stesso semaforo.',
      'Parcheggio in parallelo: io contro il marciapiede. Ha vinto il marciapiede.'
    ],
    si: ['PATENTE! Ce l’ho! Vi porto tutti al mare. Uno alla volta, ma vi porto.'],
    no: ['Bocciat{o} all’esame di guida. Mi riscrivo domani. Non mollo.'],
    dubbio: ['Domani ho la guida in città. E se investo un piccione?']
  },
  {
    id: 'esame',
    t: 'l’esame più difficile del corso',
    int: ['studio', 'libri'],
    passi: 4,
    an: [
      'Ho un esame che tutti chiamano «il muro». Lo preparo qui, se non vi dispiace.',
      'Quest’anno lo passo, quell’esame. Ho comprato tre evidenziatori.'
    ],
    su: ['Ho capito un capitolo intero. Senza piangere.', 'Ho fatto la simulazione: ventisei. Ventisei!'],
    giu: ['Ho studiato tutta la notte e non mi ricordo niente.', 'Il professore ha cambiato il programma. Di nuovo.'],
    si: ['Trenta. TRENTA. Ho abbracciato il bidello.'],
    no: ['Non è andata. Ma ho capito dove sbaglio. Si riparte.'],
    dubbio: ['Mancano dieci giorni all’esame e mi sembra di non sapere niente.']
  },
  {
    id: 'colloquio',
    t: 'il colloquio di lavoro',
    int: ['lavoro'],
    passi: 3,
    an: [
      'Mi hanno chiamat{o} per un colloquio. Un lavoro vero, di quelli con la scrivania.',
      'Ho mandato il curriculum a un posto che mi piace davvero.'
    ],
    su: ['Primo colloquio andato. Mi hanno richiamat{o}.', 'Mi hanno fatto una domanda difficile e ho risposto bene. Credo.'],
    giu: ['Al colloquio mi è venuto il singhiozzo. Per venti minuti.', 'Hanno detto «le faremo sapere». Lo dicono a tutti, vero?'],
    si: ['Mi hanno pres{o}. Comincio lunedì. Lunedì!'],
    no: ['Hanno preso un’altra persona. Pazienza. Ne arriverà un altro.'],
    dubbio: ['Domani ho l’ultimo colloquio. Non so se metto la cravatta o se sembro un pinguino.']
  },
  {
    id: 'trasloco',
    t: 'il trasloco nella casa nuova',
    int: [],
    passi: 3,
    an: [
      'Ho trovato casa! Piccola, con una finestra che dà sui tetti.',
      'Cambio casa. Ho già comprato cento scatoloni e un rotolo di nastro.'
    ],
    su: ['Ho montato il letto da sol{o}. Avanzano tre viti. Non chiedetemi perché.', 'La casa nuova comincia a sapere di me.'],
    giu: [
      'Il divano non passa dalla porta. Vive sul pianerottolo, per ora.',
      'Ho perso lo scatolone con le tazze. Bevo dal barattolo della marmellata.'
    ],
    si: ['Ultimo scatolone svuotato. Sono a casa. Venite a vederla!'],
    no: ['Il padrone di casa ha cambiato idea. Ricomincio a cercare. Con calma.'],
    dubbio: ['Lasciare la casa vecchia mi fa più male di quanto pensassi.']
  },
  {
    id: 'fumo',
    t: 'smettere di fumare',
    int: ['sport'],
    passi: 4,
    an: [
      'Ho fumato l’ultima sigaretta. Ufficialmente. Ditemelo se mi vedete con una in mano.',
      'Smetto di fumare. Questa volta per davvero.'
    ],
    su: [
      'Una settimana senza. Sento i profumi. Questo caffè ha un profumo pazzesco.',
      'Ho fatto le scale senza fermarmi. Piccole vittorie.'
    ],
    giu: ['Oggi ne ho fumata una. Una. Mi sento in colpa.', 'Sono nervos{o} come un gatto sotto la pioggia.'],
    si: ['Un mese senza. Con i soldi risparmiati vi offro un giro. A tutti.'],
    no: ['Ci sono ricascat{o}. Ma ho già fissato la nuova data. Non mollo.'],
    dubbio: ['Ho una voglia di fumare che mi mangio le unghie.']
  },
  {
    id: 'maratona',
    t: 'la mezza maratona',
    int: ['sport'],
    passi: 4,
    an: ['Mi sono iscritt{o} alla mezza maratona. Ventuno chilometri. Io. Sì.'],
    su: ['Dieci chilometri senza fermarmi! Poi mi sono sdraiat{o} sull’erba per mezz’ora.', 'Le gambe fanno male ma la testa vola.'],
    giu: ['Mi sono storto una caviglia. Una settimana di pausa.', 'Ho corso sotto il diluvio e ho preso il raffreddore.'],
    si: ['Arrivat{o}! Ultimo dei penultimi, ma arrivat{o}! Ho la medaglia!'],
    no: ['Mi sono fermat{o} al quindicesimo. Il prossimo anno ci arrivo, al traguardo.'],
    dubbio: ['La gara è tra poco e ho paura di non arrivare in fondo.']
  },
  {
    id: 'romanzo',
    t: 'il romanzo nel cassetto',
    int: ['libri', 'arte'],
    passi: 5,
    an: [
      'Sto scrivendo un romanzo. C’è un caffè, la pioggia e un gatto. Vi suona familiare?',
      'Ho ripreso in mano il romanzo che tenevo nel cassetto.'
    ],
    su: [
      'Ho finito il capitolo otto. I personaggi fanno quello che vogliono, io prendo appunti.',
      'Ho scritto una frase così bella che l’ho letta ad alta voce al mio gatto.'
    ],
    giu: ['Ho riletto tutto e ho buttato via trenta pagine.', 'Pagina bianca da una settimana. Mi fissa.'],
    si: ['Ho finito il romanzo. E una piccola casa editrice vuole leggerlo!'],
    no: ['L’editore ha detto no. Ma sono arrivat{o} alla parola «fine». Era la cosa più difficile.'],
    dubbio: ['Secondo te uno come me può davvero scrivere un libro?']
  },
  {
    id: 'bottega',
    t: 'aprire una piccola bottega',
    int: ['lavoro', 'cibo'],
    passi: 5,
    an: ['Ho un sogno: una bottega di biscotti, qui nel quartiere. Ci sto lavorando.'],
    su: [
      'Ho trovato il locale! Ha una vetrina piccola ma vede il sole del mattino.',
      'La banca ha detto sì. Ho fatto un balletto in strada.'
    ],
    giu: [
      'I permessi sono un labirinto. Ho un timbro in meno e un mal di testa in più.',
      'Il forno nuovo costa il doppio. Devo rifare i conti.'
    ],
    si: ['La bottega apre sabato! Siete tutti invitati. I primi biscotti sono per voi.'],
    no: ['Per ora la bottega aspetta. Faccio i biscotti a casa e li porto qui. Si comincia così.'],
    dubbio: ['Ho messo tutti i miei risparmi in questa bottega. E se va male?']
  },
  {
    id: 'piano',
    t: 'imparare il pianoforte',
    int: ['musica'],
    passi: 4,
    an: ['Ho comprato una tastiera usata. Imparo il pianoforte. I vicini sono preoccupati.'],
    su: [
      'Ho suonato un pezzo intero con due mani. Lentissimo, ma intero.',
      'La mia maestra ha detto che ho «orecchio». Me lo sono fatto ripetere.'
    ],
    giu: ['Le dita si incrociano da sole. Sembra un nodo.', 'Il vicino ha battuto sul muro. A tempo, almeno.'],
    si: ['Ho suonato al saggio! Mi sono tremate le mani ma è andata. È andata!'],
    no: ['Al saggio mi sono bloccat{o}. Però continuo. La musica non scappa.'],
    dubbio: ['Al saggio ci sarà un sacco di gente. Non so se ce la faccio.']
  },
  {
    id: 'amico',
    t: 'ritrovare un vecchio amico',
    int: ['ricordi'],
    passi: 3,
    an: ['Sto cercando un amico d’infanzia. Ci siamo persi di vista vent’anni fa.'],
    su: ['Ho trovato sua sorella! Mi ha dato un numero.', 'Ho scritto una lettera. Di carta. Con il francobollo.'],
    giu: ['Il numero era sbagliato. Ho parlato dieci minuti con una signora gentilissima, però.', 'Nessuna risposta, ancora.'],
    si: ['Mi ha risposto! Sabato ci vediamo. Qui. Gli ho detto che è il posto più bello della città.'],
    no: ['Non l’ho trovato. Ma ho ritrovato un sacco di ricordi. Non è poco.'],
    dubbio: ['E se non si ricordasse di me?']
  },
  {
    id: 'orto',
    t: 'l’orto sul balcone',
    int: ['cibo', 'animali'],
    passi: 3,
    an: ['Ho piantato pomodori sul balcone. Ho dato un nome a ognuno.'],
    su: ['È spuntato il primo basilico! Gli ho fatto una foto.', 'Le fragole stanno diventando rosse. Le sorveglio.'],
    giu: ['I piccioni hanno mangiato tutti i semi. Tutti.', 'Troppa pioggia: i pomodori nuotano.'],
    si: ['Ho raccolto i primi pomodori! Li ho portati: assaggiate!'],
    no: ['L’orto non ce l’ha fatta. Riproverò a primavera, con una rete anti-piccione.'],
    dubbio: ['Le piantine sono gialle. Sto sbagliando tutto?']
  },
  {
    id: 'mostra',
    t: 'una piccola mostra di quadri',
    int: ['arte'],
    passi: 4,
    an: ['Una galleria piccola piccola vuole i miei quadri. Una mostra. Mia.'],
    su: ['Ho finito il quadro più grande. C’è questo caffè, di notte.', 'Ho scelto le cornici. Sembrano vere opere d’arte. Lo sono?'],
    giu: ['Ho rovesciato il caffè su una tela. Ora è un quadro astratto.', 'Non mi piace più niente di quello che ho dipinto.'],
    si: ['La mostra è stata un successo! Hanno comprato due quadri. DUE!'],
    no: ['Alla mostra sono venute dieci persone. Ma una ha pianto davanti a un quadro. Mi basta.'],
    dubbio: ['E se la gente guarda i miei quadri e non sente niente?']
  },
  {
    id: 'concorso',
    t: 'il concorso pubblico',
    int: ['lavoro', 'studio'],
    passi: 4,
    an: ['Ho fatto domanda per un concorso. Tremila iscritti, venti posti. Ci provo.'],
    su: ['Passato lo scritto! Ora c’è l’orale.', 'Ho studiato con un gruppo. Ci interroghiamo a vicenda. Funziona.'],
    giu: ['Il manuale pesa quattro chili e io ne ricordo due etti.', 'Hanno spostato la data. Altri due mesi di ansia.'],
    si: ['Vint{o}! Il concorso! Ho chiamato mia madre e ha pianto lei per tutti e due.'],
    no: ['Non ce l’ho fatta per un punto. Un punto. Al prossimo concorso.'],
    dubbio: ['Studio da mesi e non so se serve a qualcosa.']
  },
  {
    id: 'ballo',
    t: 'il corso di ballo',
    int: ['musica', 'amore'],
    passi: 3,
    an: ['Mi sono iscritt{o} a un corso di tango. Ho due piedi sinistri, ma ci credo.'],
    su: ['Ho fatto un giro completo senza pestare nessuno!', 'La maestra ha detto che ho «presenza». Credo fosse un complimento.'],
    giu: ['Ho pestato il piede alla maestra. Due volte.', 'Il mio compagno di ballo si è trasferito. Ballo con una sedia.'],
    si: ['Abbiamo ballato alla serata finale. Applausi! Veri!'],
    no: ['Il corso è finito e io sono ancora un disastro. Ma un disastro felice.'],
    dubbio: ['Alla serata finale balliamo davanti a tutti. Mi viene da scappare.']
  },
  {
    id: 'padre',
    t: 'fare pace con suo padre',
    int: ['ricordi'],
    passi: 3,
    sens: 0.5, // solo per chi è sensibile: è un tema delicato
    an: ['Non parlo con mio padre da tre anni. Ho deciso di scrivergli.'],
    su: [
      'Gli ho scritto. Ha risposto con tre righe. Ma ha risposto.',
      'Abbiamo parlato al telefono. Dieci minuti. Del tempo, soprattutto. Ma abbiamo parlato.'
    ],
    giu: ['Non ha risposto. Forse ho sbagliato a scrivere.', 'Abbiamo litigato di nuovo, per una cosa vecchia.'],
    si: ['Ci siamo visti. Mi ha abbracciat{o}. Non lo faceva da quando ero bambin{o}.'],
    no: ['Non è pronto, forse. Io la porta l’ho lasciata aperta. Questo conta.'],
    dubbio: ['Ho paura di andare da lui e di trovare la stessa rabbia di tre anni fa.']
  },
  {
    id: 'telescopio',
    t: 'il telescopio costruito a mano',
    int: ['stelle', 'giochi'],
    passi: 3,
    an: ['Mi costruisco un telescopio. Con un tubo, due lenti e tanta pazienza.'],
    su: ['Ho visto i crateri della Luna. Con il MIO telescopio.', 'Ho lucidato lo specchio per sei ore. Brilla come un lago.'],
    giu: ['Nuvole. Da due settimane. Il cielo mi odia.', 'Una lente si è incrinata. Ricomincio.'],
    si: ['Ho visto gli anelli di Saturno! Mi sono mess{o} a ridere da sol{o} sul tetto.'],
    no: ['Il telescopio non mette a fuoco. Ma ho imparato un sacco. Ne costruisco un altro.'],
    dubbio: ['E se è tutto un tubo con dentro niente?']
  },
  {
    id: 'lingua',
    t: 'imparare il giapponese',
    int: ['viaggi', 'film'],
    passi: 4,
    an: ['Imparo il giapponese. Per andare a Kyoto, un giorno. Arigatō!'],
    su: ['Ho letto un cartello in giapponese! Diceva «uscita». Ma l’ho letto!', 'Ho scritto il mio nome in katakana. Sembra un disegno.'],
    giu: ['Ci sono tremila caratteri. Ne so dodici.', 'Ho confuso «grazie» con «gatto». Al corso ridevano tutti.'],
    si: ['Ho passato il primo esame di giapponese! Kyoto, arrivo. Tra qualche anno.'],
    no: ['L’esame non è andato. Ma ho un’amica di penna a Osaka. Le scrivo ogni settimana.'],
    dubbio: ['Studio tutte le sere ma mi sembra di stare fermo.']
  },
  {
    id: 'cane',
    t: 'convincere il padrone di casa a tenere un cane',
    int: ['animali'],
    passi: 3,
    premio: 'cane',
    an: ['Al canile c’è un cane che mi guarda come se mi conoscesse. Devo convincere il padrone di casa.'],
    su: ['Il padrone di casa ha detto «forse». Forse è quasi sì.', 'Sono andat{o} a trovarlo al canile. Mi ha portato la pallina.'],
    giu: [
      'Il padrone di casa ha detto «vedremo». Vedremo è quasi no.',
      'Al canile c’era un’altra famiglia che lo guardava. Ho avuto paura.'
    ],
    si: ['Ha detto sì! Il cane viene a casa con me! La prossima volta ve lo porto.'],
    no: ['Non si può. Ma vado al canile ogni sabato a portarlo a spasso. È un po’ mio lo stesso.'],
    dubbio: ['Se il padrone di casa dice no, quel cane resta lì. Non ci dormo.']
  }
];
// Quando gli amici chiedono come va, e come rispondono secondo il carattere
const PJ_CHIEDI = ['Allora, come va con {P}?', 'E {P}? Racconta!', 'Ci pensavo stamattina: a che punto sei con {P}?', 'Novità su {P}?'];
const PJ_TIFO = {
  caldo: ['Sono fier{o} di te, lo sai?', 'Vedrai che ce la fai. Io ci credo.'],
  ironico: ['Quando sarai famos{o}, ricordati di me.', 'Ottimo. Ti dedico il prossimo sorso.'],
  timido: ['*sorride* Fai il tifo per te. Cioè, io faccio il tifo per te.', 'Che bello... davvero.'],
  brontolone: ['Mh. Non mollare, eh. Che poi te ne penti.', 'Bene. Ma dormi, ogni tanto.'],
  entusiasta: ['Ce la farai! Lo sento!', 'Quando ce l’hai fatta facciamo festa, eh!']
};
// Quando ti chiedono un parere: le tre risposte che puoi dare (consola, sprona, scherza),
// e come reagisce chi ascolta, se la risposta gli va a genio (bene) o no (male).
const PARERE = {
  q: '{a} ti racconta i suoi dubbi su {P}. Cosa rispondi?',
  o: {
    consola: 'È normale avere paura. Prenditi il tuo tempo.',
    sprona: 'Ce la puoi fare. Un passo alla volta, ma vai.',
    scherza: 'Se va male, il primo caffè lo offro io.'
  },
  bene: {
    consola: ['Grazie. Avevo bisogno che qualcuno me lo dicesse.', '*respira piano* Sì. Un po’ alla volta.'],
    sprona: ['Hai ragione. Domani ci provo. Anzi, oggi.', 'Ok. Vado. Cioè, finisco il caffè e vado.'],
    scherza: ['*ride* Allora mi conviene che vada male! No, scherzo.', 'Affare fatto. Ma spero di non dovertelo chiedere.']
  },
  male: {
    consola: ['Sì... forse. Ma il tempo stringe.', 'Mh. Speravo in una spinta, più che in una carezza.'],
    sprona: ['Facile a dirsi...', 'Lo so, lo so. È che oggi non ce la faccio.'],
    scherza: ['*sorride appena* Grazie. Credo.', 'Ah. Sì. Molto divertente.']
  }
};
// Quando tornano a raccontarti com'è finita, ricordando quello che gli avevi detto
const PARERE_DOPO = {
  si: {
    consola: 'Mi avevi detto di prendermi il mio tempo. L’ho fatto. E ce l’ho fatta.',
    sprona: 'Mi avevi detto «un passo alla volta». Te lo ricordi? Ce l’ho fatta.',
    scherza: 'Ti ricordi il caffè offerto se andava male? Non ti serve offrirlo: è andata bene!'
  },
  no: {
    consola: 'Non è andata. Ma mi è tornato in mente quello che mi avevi detto: c’è tempo. Grazie.',
    sprona: 'Non è andata. Però ci ho provato davvero, come mi avevi detto. Non mi pento.',
    scherza: 'Non è andata. Mi devi un caffè, ricordi? Mi tira su già l’idea.'
  }
};

/* ---------------- Il quartiere ---------------- */
// Cose che succedono in città: durano qualche giorno, tutti ne parlano (l), e qualcuna fa nascere una storia (trama).
const QUARTIERE = [
  {
    id: 'cane',
    t: 'Un cane senza collare',
    n: 'Gira per il quartiere un cane senza collare, con un orecchio su e uno giù.',
    dur: 5,
    trama: 'adozione',
    l: [
      'Avete visto il cane con l’orecchio storto? Mi ha seguito fino a qui.',
      'Qualcuno dovrebbe prendersi quel cane. Qualcuno con un divano grande.'
    ]
  },
  {
    id: 'forno',
    t: 'Il forno chiude',
    n: 'Il vecchio forno all’angolo abbassa la serranda: il fornaio va in pensione.',
    dur: 6,
    l: ['Il forno chiude. Ci compravo il pane da quando ero bambin{o}.', 'Senza il forno l’angolo sembra più buio.'],
    dopo: 'forno2'
  },
  {
    id: 'forno2',
    t: 'Il forno riapre',
    n: 'Il forno all’angolo riapre: lo ha preso la nipote del fornaio, con le stesse ricette.',
    dur: 4,
    solo: 1, // arriva solo dopo «Il forno chiude»
    l: ['Il forno ha riaperto! Stesso profumo, stessi cornetti.', 'La nipote del fornaio ha le mani del nonno. Si sente nel pane.']
  },
  {
    id: 'concerto',
    t: 'Concerto in piazza',
    n: 'Sabato c’è un concerto in piazza: una banda di ottoni e una cantante col cappello.',
    dur: 3,
    l: ['Andate al concerto in piazza? Io porto l’ombrello. Non si sa mai.', 'Ho sentito le prove del concerto dalla finestra. Bellissimo.']
  },
  {
    id: 'mercatino',
    t: 'Il mercatino delle cose vecchie',
    n: 'Domenica, nella via dietro il caffè, c’è il mercatino delle cose vecchie.',
    dur: 3,
    l: [
      'Al mercatino ho trovato un giradischi a cinque euro. Funziona!',
      'Ho comprato un libro usato con una dedica dentro. «Per Anna, per sempre». Chi sarà Anna?'
    ]
  },
  {
    id: 'cantine',
    t: 'Le cantine allagate',
    n: 'Con tutta questa pioggia si sono allagate le cantine della via: i vicini si aiutano a svuotarle.',
    dur: 3,
    l: [
      'Ho passato la mattina a svuotare cantine con i vicini. Mai parlato tanto con loro.',
      'Nella cantina del terzo piano hanno trovato una bici degli anni Cinquanta.'
    ]
  },
  {
    id: 'libreria',
    t: 'Una libreria nuova',
    n: 'Ha aperto una libreria minuscola, con un gatto che dorme in vetrina.',
    dur: 5,
    l: [
      'Nella libreria nuova il gatto dorme sui gialli. Solo sui gialli.',
      'La libraia mi ha consigliato un libro guardandomi in faccia. Ci ha preso.'
    ]
  },
  {
    id: 'festa',
    t: 'La festa della via',
    n: 'I vicini organizzano una festa nella via: tavoli lunghi, lucine, e ognuno porta qualcosa.',
    dur: 3,
    trama: 'festa',
    l: [
      'Alla festa della via porto la torta di mia nonna. L’unica cosa che so fare.',
      'Una festa con tutti i vicini... vuol dire che dovrò salutare quello del quarto piano.'
    ]
  },
  {
    id: 'lavori',
    t: 'Lavori in strada',
    n: 'Hanno aperto la strada davanti al caffè: ruspe, transenne e un operaio che canta.',
    dur: 4,
    l: ['L’operaio dei lavori canta l’opera. Bene, anche.', 'Per arrivare qui ho fatto il giro dell’isolato. Ne valeva la pena.']
  },
  {
    id: 'gatto',
    t: 'Il gatto smarrito',
    n: 'Sui pali della luce ci sono i cartelli di un gatto smarrito: si chiama Biscotto.',
    dur: 4,
    l: [
      'Avete visto Biscotto? È il gatto dei cartelli. Lo cerco anch’io quando passo.',
      'Povera la padrona di Biscotto. Ho guardato sotto tutte le macchine.'
    ],
    fine: 'Biscotto è tornato a casa: dormiva nella libreria, sui gialli.'
  }
];

// come rispondono quando qualcuno parla del quartiere
const QZ_R = {
  caldo: ['Ho sentito anch’io. Il quartiere è come una famiglia, a volte.', 'Che bello quando succede qualcosa qui intorno.'],
  ironico: ['Il nostro quartiere: più notizie di un telegiornale.', 'Ecco perché non serve la televisione.'],
  timido: ['Davvero? Non lo sapevo...', '*annuisce* Ci passo davanti ogni giorno.'],
  brontolone: ['Mah. Ai miei tempi succedevano le stesse cose. Ma più forte.', 'Speriamo non facciano troppo rumore.'],
  entusiasta: ['Ma dai! Andiamo a vedere insieme!', 'Che bello! Non vedo l’ora!']
};

/* ---------------- Storie che nascono da sole ---------------- */
// cast: chi può viverla (lo trova il motore: vedi TRAME_CAST in js/motore/trame.js).
// passi: chi c'è (who, lettere dei ruoli; se c'è uno solo parla con te), quanti giorni dopo (gap),
//   le battute (0 = il primo di who, 1 = il secondo; una scelta {c:{q, o:[{t, f:'@valore', r:[battute]}]}};
//   una battuta con '@valore' in terza posizione compare solo se prima hai scelto quello),
//   calc: un esito calcolato dal mondo prima del passo ('@valore'), fine: cosa cambia nel mondo.
// d: come la storia si chiude nel Diario.
const TRAME = [
  {
    id: 'pensiero',
    t: 'Un amico in pensiero',
    cast: 'giu',
    passi: [
      {
        who: 'b',
        l: [
          [0, 'Posso dirti una cosa? Sono preoccupat{o} per {a}.'],
          [0, 'Da qualche giorno è spent{a:o}. Ride poco, guarda la tazza. Non è da {a}.'],
          {
            c: {
              q: '{b} è in pensiero per {a}. Cosa consigli?',
              o: [
                {
                  t: 'Parla tu con {a}, stasera. Senza fretta.',
                  f: '@parla',
                  r: [[0, 'Hai ragione. A volte basta chiedere «come stai» e aspettare la risposta vera.']]
                },
                {
                  t: 'Porta {a} qui. Il primo caffè lo offro io.',
                  f: '@offro',
                  r: [[0, 'Davvero? Grazie. Qui si sta bene, magari si apre.']]
                },
                {
                  t: 'Lascia spazio a {a}, ma fatti sentire.',
                  f: '@spazio',
                  r: [[0, 'Un messaggio ogni tanto, senza pretese. Sì. Posso farlo.']]
                }
              ]
            }
          }
        ]
      },
      {
        who: 'ab',
        gap: 1,
        l: [
          [1, 'Ehi. Come stai? Ma come stai davvero.', '@parla'],
          [1, 'Ti ho portato qui perché qui si offre. Lo dice il barista.', '@offro'],
          [1, 'Non volevo disturbarti. Ma ci tenevo a vederti.', '@spazio'],
          [0, '...Non tanto bene, a dire il vero.'],
          [0, 'È un periodo in cui mi sembra tutto più pesante.'],
          [1, 'Allora lo portiamo in due, questo peso. Va bene?'],
          [0, '*annuisce, e per la prima volta da giorni sorride*']
        ],
        fine: W => {
          W.rel('a', 'b', { a: 12, fi: 15 });
          W.umore('a', 0.35);
          W.ricordo('a', 'consolato', 'b', 1.5);
        }
      },
      {
        who: 'a',
        gap: 2,
        l: [
          [0, 'Sai che {b} mi ha portato qui apposta, l’altra sera?'],
          [0, 'Sto un po’ meglio. Non di colpo. Ma meglio.'],
          [0, 'Grazie anche a te. Questo posto aiuta più di quanto pensi.']
        ],
        fine: W => W.affetto('a', 1)
      }
    ],
    d: '{b} si è accort{b:o} che {a} stava male, e insieme ne sono usciti un po’.'
  },
  {
    id: 'rivali',
    t: 'Lo stesso tavolo',
    cast: 'rivali',
    passi: [
      {
        who: 'ab',
        l: [
          [0, 'Oh, no. Proprio con te devo dividere il tavolo.'],
          [1, 'Il locale è pieno. Non l’ho scelto io.'],
          [0, '*sbuffa e gira la sedia di tre centimetri*'],
          {
            c: {
              q: '{a} e {b} non si sopportano, ma sono allo stesso tavolo. Fai qualcosa?',
              o: [
                {
                  t: 'Porto due biscotti. Offre la casa.',
                  f: '@biscotti',
                  r: [
                    [1, '...Grazie.'],
                    [0, '*prende il biscotto, poi borbotta un grazie anche {a}*']
                  ]
                },
                {
                  t: 'Lascio che se la sbrighino da soli.',
                  f: '@niente',
                  r: [
                    [1, 'Bene. Silenzio, allora.'],
                    [0, 'Perfetto.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        who: 'ab',
        gap: 1,
        l: [
          [1, 'Di nuovo tu.'],
          [0, 'Di nuovo io. Che stai leggendo?'],
          [1, 'Non ti interessa.'],
          [0, 'È il libro che sto leggendo anch’io.'],
          [1, '...Davvero? A che capitolo sei?'],
          [0, 'Al dodici. Non dirmi niente.'],
          [1, '*per la prima volta, quasi sorride*']
        ],
        fine: W => W.rel('a', 'b', { te: -20, a: 10 })
      },
      {
        who: 'ab',
        gap: 1,
        l: [
          [0, 'Ti ho tenuto il posto. Non farci l’abitudine.'],
          [1, 'Grazie. Ti ho preso un {item}. Non farci l’abitudine nemmeno tu.'],
          [0, 'Tregua?'],
          [1, 'Tregua. Ma il tavolo vicino alla finestra resta mio.']
        ],
        fine: W => {
          W.rel('a', 'b', { te: -30, a: 12, fi: 10 });
          W.pace('a', 'b');
        }
      }
    ],
    d: '{a} e {b} non si sopportavano. Un tavolo diviso per forza, un libro in comune, e adesso c’è una tregua.'
  },
  {
    id: 'lontani',
    t: 'Persi di vista',
    cast: 'lontani',
    passi: [
      {
        who: 'a',
        l: [
          [0, 'Hai visto {b}, ultimamente? Non ci sentiamo da un sacco di tempo.'],
          [0, 'Non abbiamo litigato. È che la vita... corre.'],
          {
            c: {
              q: '{a} e {b} si sono persi di vista. Cosa fai?',
              o: [
                {
                  t: 'Se passa, dico a {b} che l’hai cercat{b:o}.',
                  f: '@messaggio',
                  r: [[0, 'Lo faresti? Grazie. Di’ a {b}... che mi manca.']]
                },
                {
                  t: 'Scrivigli tu. Adesso, prima di ripensarci.',
                  f: '@scrivi',
                  r: [
                    [0, '*prende il telefono, scrive, cancella, riscrive, invia*'],
                    [0, 'Fatto. Oddio. Fatto.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        who: 'b',
        gap: 1,
        l: [
          [0, 'Mi hanno detto che {a} mi ha cercato. È vero?', '@messaggio'],
          [0, '{a} mi ha scritto! Dopo tutto questo tempo.', '@scrivi'],
          [0, 'Credevo si fosse dimenticat{a:o} di me.'],
          [0, 'Domani torno qui. Spero di trovarl{a:o}.']
        ]
      },
      {
        who: 'ab',
        gap: 1,
        l: [
          [1, '{a}!'],
          [0, '{b}! Quanto tempo.'],
          [1, 'Troppo. Mi sei mancat{a:o}.'],
          [0, 'Anche tu. Promettimi che non ci perdiamo più.'],
          [1, 'Promesso. Un caffè a settimana. Qui.']
        ],
        fine: W => {
          W.rel('a', 'b', { a: 15, fi: 8 });
          W.ritrovati('a', 'b');
        }
      }
    ],
    d: '{a} e {b} si erano persi di vista. Un messaggio, un caffè, e adesso si vedono ogni settimana.'
  },
  {
    id: 'cupido',
    t: 'Il coraggio di dirlo',
    cast: 'cotta',
    passi: [
      {
        who: 'a',
        l: [
          [0, 'Ti posso confessare una cosa? Però non ridere.'],
          [0, 'Mi piace {b}. Tanto. E ogni volta che passa divento un pomodoro.'],
          {
            c: {
              q: '{a} ha una cotta per {b}. Cosa consigli?',
              o: [
                {
                  t: 'Diglielo. Il peggio che può succedere è un no gentile.',
                  f: '@dillo',
                  r: [[0, 'Un no gentile... sì, quello lo posso sopportare. Forse.']]
                },
                {
                  t: 'Scrivi un biglietto. Glielo porto io con il caffè.',
                  f: '@biglietto',
                  r: [[0, '*scrive qualcosa su un tovagliolo, lo piega quattro volte e te lo dà*']]
                },
                {
                  t: 'Aspetta il momento giusto. Arriverà.',
                  f: '@aspetta',
                  r: [[0, 'Il momento giusto. Speriamo che arrivi prima che io diventi vecchi{o}.']]
                }
              ]
            }
          }
        ]
      },
      {
        who: 'ab',
        gap: 1,
        calc: W => (W.attrazione('b', 'a') >= 30 || Math.random() < 0.35 ? '@si' : '@no'),
        l: [
          [0, '{b}, ti devo dire una cosa. Da un po’.', '@dillo'],
          [1, 'Il barista mi ha portato questo biglietto con il caffè. È tuo?', '@biglietto'],
          [0, '*rovescia lo zucchero, e tutti e due ridono*', '@aspetta'],
          [0, 'Mi piaci. Ecco. L’ho detto.'],
          [1, '...Anche tu. Da quella volta che hai riso con la schiuma sul naso.', '@si'],
          [0, 'Davvero?', '@si'],
          [1, 'Davvero. Mi sa che il momento giusto era adesso.', '@si'],
          [1, 'Oh... sei una persona bellissima. Ma per me sei un’amicizia preziosa.', '@no'],
          [0, '*annuisce, ross{o} fino alle orecchie* Va bene. Grazie per essere sincer{b:o}.', '@no'],
          [1, 'Restiamo amici? Davvero amici?', '@no']
        ],
        fine: W => (W.scelta('si') ? W.insieme('a', 'b') : W.rel('a', 'b', { at: -30, a: 8, fi: 10 }))
      },
      {
        who: 'a',
        gap: 1,
        l: [
          [0, 'Ce l’ho fatta. Ci siamo messi insieme. Mi tremano ancora le gambe.', '@si'],
          [0, 'Grazie. Senza di te non avrei mai avuto il coraggio.', '@si'],
          [0, 'Mi ha detto di no. Con una gentilezza che quasi mi ha fatto piacere.', '@no'],
          [0, 'Fa male un po’. Ma sono content{o} di averlo detto. Non avrò rimpianti.', '@no']
        ],
        fine: W => W.affetto('a', 1)
      }
    ],
    d: '{a} ha trovato il coraggio di dire a {b} quello che provava.'
  },
  {
    id: 'segreto',
    t: 'Il segreto',
    cast: 'segreto',
    passi: [
      {
        who: 'c',
        l: [
          [0, 'Senti, tu che sai tutto: {a} ha un debole per qualcuno, vero?'],
          [0, 'Dai, dimmi chi è. Non lo dico a nessuno. Giuro. Più o meno.'],
          {
            c: {
              q: '{c} vuole sapere il segreto di {a}. Tu lo sai: è {b}.',
              o: [
                { t: 'Non sono cose mie da raccontare.', f: '@zitto', r: [[0, 'Uffa. Sei una tomba. ...Però hai ragione.']] },
                {
                  t: 'Va bene... è {b}. Ma acqua in bocca.',
                  f: '@dico',
                  r: [[0, '{b}?! Lo sapevo! Cioè, non lo sapevo. Acqua in bocca. Promesso.']]
                }
              ]
            }
          }
        ]
      },
      {
        who: 'a',
        gap: 1,
        l: [
          [0, 'Sai che {c} ha cercato di farmi dire una cosa? Non ci è riuscit{c:o}.', '@zitto'],
          [0, 'Ho capito che tu non hai detto niente. Grazie. Di te mi fido.', '@zitto'],
          [0, '{c} sa di {b}. Lo sa tutto il quartiere, ormai.', '@dico'],
          [0, 'Non ti chiedo come l’ha saputo. Però mi dispiace.', '@dico']
        ],
        fine: W => {
          if (W.scelta('zitto')) W.affetto('a', 2);
          else {
            W.affetto('a', -2);
            W.rel('a', 'c', { fi: -15 });
            W.notizia('cotta', 'a', 'b');
          }
        }
      }
    ],
    d: '{c} voleva sapere il segreto di {a}. Il resto lo hai deciso tu.'
  },
  {
    id: 'nuovo',
    t: 'Il nuovo arrivato',
    cast: 'nuovo',
    passi: [
      {
        who: 'b',
        l: [
          [0, 'Hai notato {a}? Si siede sempre da sol{a:o}, in fondo.'],
          [0, 'Mi ricorda me quando sono arrivat{o} in città.'],
          {
            c: {
              q: '{b} vorrebbe fare amicizia con {a}, che è sempre da sol{a:o}.',
              o: [
                {
                  t: 'Vai a presentarti. Il peggio è un sorriso imbarazzato.',
                  f: '@vai',
                  r: [[0, 'Hai ragione. La prossima volta vado. Giuro.']]
                },
                { t: 'Te lo presento io, la prossima volta.', f: '@presento', r: [[0, 'Lo faresti? Che bello. Grazie.']] }
              ]
            }
          }
        ]
      },
      {
        who: 'ab',
        gap: 1,
        l: [
          [1, 'Ciao! Io sono {b}. Ti vedo sempre qui, ma non ci siamo mai parlati.', '@vai'],
          [1, 'Il barista mi ha detto che dovevamo conoscerci. Io sono {b}.', '@presento'],
          [0, 'Oh... ciao. Io sono {a}. Sono in città da poco.'],
          [1, 'Allora ti serve una guida. Il posto migliore ce l’hai già trovato.'],
          [0, '*sorride, per la prima volta un sorriso largo*']
        ],
        fine: W => W.rel('a', 'b', { a: 18, fi: 10 })
      },
      {
        who: 'ab',
        gap: 2,
        l: [
          [1, 'Vieni al nostro tavolo: ti presento {c}, e poi tutti gli altri.'],
          [0, 'Sabato al mercatino con voi? Volentieri.'],
          [0, 'Sai, quando sono arrivat{o} non conoscevo nessuno. Adesso ho un tavolo.']
        ],
        fine: W => {
          W.rel('a', 'b', { a: 10 });
          W.presenta('a', 'c');
        }
      }
    ],
    d: '{a} era nuov{a:o} in città e sempre da sol{a:o}. {b} l’ha accolt{a:o}, e ora ha una compagnia.'
  },
  {
    id: 'gelosia',
    t: 'Un’ombra',
    cast: 'gelosia',
    passi: [
      {
        who: 'a',
        l: [
          [0, 'Ti sembra che {b} passi tanto tempo con {c}?'],
          [0, 'Lo so, sono sciocchezze. Ma mi viene un nodo qui.'],
          {
            c: {
              q: '{a} è gelos{a:o} di {c}. Cosa dici?',
              o: [
                { t: 'Parlane con {b}. Con calma, senza accusare.', f: '@parla', r: [[0, 'Senza accusare. Ok. Respiro e glielo dico.']] },
                {
                  t: 'Fidati. Si vede da lontano quanto ti vuole bene.',
                  f: '@fidati',
                  r: [[0, 'Si vede? Davvero? ...Allora forse sono io che vedo ombre.']]
                }
              ]
            }
          }
        ]
      },
      {
        who: 'ab',
        gap: 1,
        l: [
          [0, '{b}, posso dirti una cosa che mi pesa?', '@parla'],
          [0, 'Mi sento un po’ gelos{o} di {c}. Lo so, è stupido.', '@parla'],
          [1, 'Non è stupido. Grazie di avermelo detto. {c} è un’amicizia. Tu sei casa.', '@parla'],
          [0, 'Sai, ho deciso di fidarmi. Di te. Di noi.', '@fidati'],
          [1, 'Che cosa bella da dire, così, a metà cappuccino.', '@fidati'],
          [0, '*prende la mano di {b} sopra il tavolo*']
        ],
        fine: W => W.rel('a', 'b', { fi: 18, a: 8, te: -15 })
      }
    ],
    d: 'Un’ombra di gelosia tra {a} e {b}. L’hanno guardata insieme, e si è sciolta.'
  },
  {
    id: 'grande',
    t: 'Il grande giorno',
    cast: 'grande',
    passi: [
      {
        who: 'ab',
        l: [
          [0, 'Domani è il grande giorno. {P}. Non dormirò.'],
          [1, 'Ce la farai. E se no, ci riprovi. Io sono qui comunque.'],
          [0, 'Mi accompagni?'],
          [1, 'Ti aspetto qui, con il tuo {item} pronto.']
        ]
      },
      {
        who: 'ab',
        gap: 1,
        calc: W => (W.progettoFine('a') ? '@si' : '@no'),
        l: [
          [1, 'Allora?! Racconta!'],
          [0, 'Ce l’ho fatta. Ce l’ho fatta davvero.', '@si'],
          [1, '*si alza e abbraccia {a} in mezzo al locale*', '@si'],
          [0, 'Non è andata.', '@no'],
          [1, 'Vieni qui. Sono fier{o} di te lo stesso. Ci hai provato con tutto te stess{a:o}.', '@no'],
          [0, '*appoggia la testa sulla sua spalla*', '@no']
        ],
        fine: W => W.rel('a', 'b', { a: 10, fi: 12 })
      }
    ],
    d: 'Il grande giorno di {a}: {P}. {b} c’era.'
  },
  {
    id: 'mano',
    t: 'Una mano',
    cast: 'mano',
    passi: [
      {
        who: 'ab',
        l: [
          [0, 'Con {P} non è andata. Mi sento al punto di partenza.'],
          [1, 'Al punto di partenza ma con un sacco di cose imparate. Non è lo stesso punto.'],
          [1, 'Senti: ti va se ci proviamo insieme? Ti do una mano io.'],
          [0, '...Davvero lo faresti?']
        ],
        fine: W => {
          W.rel('a', 'b', { a: 12, fi: 15 });
          W.aiuto('a');
        }
      }
    ],
    d: 'Quando a {a} è andata male, {b} ha teso una mano.'
  },
  {
    id: 'adozione',
    t: 'L’orecchio storto',
    cast: 'adozione',
    passi: [
      {
        who: 'a',
        l: [
          [0, 'Quel cane con l’orecchio storto mi ha seguit{o} di nuovo fino alla porta.'],
          [0, 'Mi guarda come se mi aspettasse da sempre.'],
          {
            c: {
              q: '{a} pensa di adottare il cane del quartiere.',
              o: [
                { t: 'Un cane così ti ha già scelto. Prendilo.', f: '@prendi', r: [[0, 'Mi ha già scelto... sì. Ha ragione lui.']] },
                { t: 'È un impegno grande. Pensaci bene.', f: '@pensa', r: [[0, 'Hai ragione. Ci penso stanotte. Ma so già cosa dirò.']] }
              ]
            }
          }
        ]
      },
      {
        who: 'a',
        gap: 1,
        l: [
          [0, 'L’ho preso. L’ho chiamato Orecchio. Non ho fantasia, ma lui è contento.'],
          [0, 'La prossima volta te lo porto. Si siede composto. Più o meno.']
        ],
        fine: W => W.cane('a', 'Orecchio')
      }
    ],
    d: 'Il cane senza collare del quartiere ha trovato casa da {a}. Si chiama Orecchio.'
  },
  {
    id: 'festa',
    t: 'La festa della via',
    cast: 'festa',
    passi: [
      {
        who: 'ab',
        l: [
          [0, 'Alla festa della via vieni? Ci saranno tutti.'],
          [1, 'Vengo. Porto la torta. Quella che si affloscia sempre.'],
          [0, 'La torta che si affloscia è la mia preferita.'],
          [1, 'Ballerai?'],
          [0, 'Se balli anche tu.']
        ],
        fine: W => W.rel('a', 'b', { a: 10, at: 6 })
      },
      {
        who: 'ab',
        gap: 1,
        l: [
          [0, 'Che serata, ieri. Le lucine, i tavoli lunghi, la torta afflosciata.'],
          [1, 'Hai ballato con la signora del quarto piano per un’ora.'],
          [0, 'Ha novant’anni e un ritmo pazzesco.'],
          [1, 'Mi piace questo quartiere. Mi piace quando ci si ricorda di essere vicini.']
        ],
        fine: W => {
          W.rel('a', 'b', { a: 8, fi: 8 });
          W.umore('a', 0.2);
          W.umore('b', 0.2);
        }
      }
    ],
    d: 'Alla festa della via {a} e {b} hanno ballato, mangiato torta afflosciata e conosciuto i vicini.'
  }
];
