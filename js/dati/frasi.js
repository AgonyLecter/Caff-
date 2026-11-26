// Frasi: legami tra habitué (REL), coppie, battute da soli, tocchi, recensioni, battute di Tommy.

const REL = {
  intro: [
    [
      [1, 'Scusa, ti dispiace se mi siedo?'],
      [0, 'Figurati. Io sono {A}.'],
      [1, '{B}. Piacere.']
    ],
    [
      [0, 'Anche tu qui tutti i giorni?'],
      [1, 'Quasi. Il {item} qui è una droga.'],
      [0, 'Allora ci vedremo spesso, {B}.']
    ],
    [
      [1, 'Bel libro. Letto tre volte.'],
      [0, 'Non dirmi il finale!'],
      [1, 'Mai. ...Il maggiordomo.'],
      [0, 'NO.']
    ],
    [
      [0, 'Anche tu non riesci a dormire?'],
      [1, 'Mai prima delle due.'],
      [0, 'Club degli insonni, allora.']
    ]
  ],
  conoscenti: [
    [
      [0, 'Ehi, {B}! Di nuovo qui?'],
      [1, 'Non riesco a stare lontano da questo {item}.']
    ],
    [
      [1, "Com'è andata la giornata, {A}?"],
      [0, 'Lunga. Ma adesso va meglio.']
    ],
    [
      [0, 'Ti ho visto passare ieri. Ti ho salutato!'],
      [1, 'Ah, eri tu? Pensavo fosse un vigile.']
    ]
  ],
  amici: [
    [
      [0, 'Ti ho tenuto il posto.'],
      [1, 'Sei il migliore, {A}.']
    ],
    [
      [1, "Allora, com'è andata?"],
      [0, 'Malissimo. Raccontami qualcosa di bello.'],
      [1, 'Ho visto un cane con gli stivaletti.'],
      [0, '...Grazie, mi serviva.']
    ],
    [
      [0, 'Sabato mi aiuti col trasloco?'],
      [1, 'Solo se mi offri il {item}.'],
      [0, 'Affare fatto.']
    ],
    [
      [1, '*ride fortissimo*'],
      [0, 'Shh! Ci guardano tutti!']
    ]
  ],
  migliori: [
    [
      [0, 'Senza di te questa città sarebbe grigia, {B}.'],
      [1, 'È grigia comunque. Ma insieme è un bel grigio.']
    ],
    [
      [1, 'Ho ordinato per te. Il solito.'],
      [0, 'Come fai a sapere sempre cosa voglio?'],
      [1, 'Dieci anni di {item}... cioè, dieci settimane.']
    ],
    [
      [0, 'Ricordi la prima volta qui?'],
      [1, 'Mi hai rubato la sedia.'],
      [0, "Te l'ho prestata. Per sempre."]
    ]
  ],
  cotta: [
    [
      [0, '*arrossisce*'],
      [1, 'Hai... schiuma sul naso.'],
      [0, 'Oh no.'],
      [1, 'Ti sta bene, in realtà.']
    ],
    [
      [1, 'Mi piace come ridi, {A}.'],
      [0, 'Allora fammi ridere più spesso.']
    ],
    [
      [0, 'Stavo pensando...'],
      [1, 'Sì?'],
      [0, '...niente. Bel tempo, eh?'],
      [1, 'Sta diluviando.']
    ]
  ],
  coppia: [
    [
      [0, 'Stesso tavolo del nostro primo caffè.'],
      [1, 'Lo pretendo ogni volta.']
    ],
    [
      [1, 'Mi passi lo zucchero, amore?'],
      [0, 'Solo se mi dai un bacio.'],
      [1, '*gli dà un bacio sulla guancia*']
    ],
    [
      [0, 'Domenica pranzo dai miei.'],
      [1, '...Devo preoccuparmi?'],
      [0, 'Mia madre ti adorerà. Mio padre ti interrogherà.']
    ],
    [
      [1, 'Ti ho preso un {item}. Il tuo preferito.'],
      [0, 'Ecco perché ti amo.']
    ]
  ],
  proposta: [
    [
      [0, '{B}... devo chiederti una cosa.'],
      [0, '*si inginocchia accanto al tavolo*'],
      [1, 'Oh. Oh!'],
      [0, 'Vuoi...'],
      [1, 'SÌ!'],
      [0, 'Non avevo ancora finito la domanda.'],
      [1, 'Sì lo stesso!']
    ]
  ],
  fidanzati: [
    [
      [0, 'Il matrimonio lo facciamo qui?'],
      [1, 'Con la torta al posto del {item}.']
    ],
    [
      [1, 'Abbiamo scelto la data!'],
      [0, 'Un giorno di pioggia, ovviamente.']
    ]
  ],
  rivali: [
    [
      [0, 'Di nuovo tu.'],
      [1, 'Il locale non è tuo, {A}.']
    ],
    [
      [1, 'Il mio {item} è meglio del tuo.'],
      [0, 'Sono uguali.'],
      [1, 'Il mio è meglio.']
    ],
    [
      [0, 'Hai preso il mio tavolo.'],
      [1, 'Ci sono 30 tavoli.'],
      [0, 'Ma questo è il MIO.']
    ]
  ],
  pace: [
    [
      [0, 'Sai, {B}... non sei così male.'],
      [1, 'Neanche tu. Non dirlo a nessuno.']
    ]
  ]
};
const PAIRS = [
  [
    [0, 'Ti ho mai detto che ordini sempre la cosa più dolce?'],
    [1, 'E tu la più amara. Ci compensiamo.']
  ],
  [
    [0, 'Hai guardato la serie senza di me.'],
    [1, 'Solo un episodio!'],
    [0, 'Erano quattro. Ho visto la cronologia.']
  ],
  [
    [0, 'Stavolta paghi tu.'],
    [1, "Ho pagato io l'ultima volta!"],
    [0, "L'ultima volta era a marzo."]
  ],
  [
    [0, 'Non mi ascolti mai.'],
    [1, 'Cosa?'],
    [0, 'Appunto.']
  ],
  [
    [0, 'Fuori sembra un film di fantascienza.'],
    [1, 'Manca solo un robot che serve il caffè.']
  ],
  [
    [0, 'Aspetto un bambino.'],
    [1, '...'],
    [1, '*rovescia il cappuccino*'],
    [0, 'Lo prendo come un sì entusiasta.']
  ],
  [
    [0, 'Mi sono licenziato.'],
    [1, 'Finalmente!'],
    [0, 'E apro una libreria.'],
    [1, 'Ancora più finalmente!']
  ],
  [
    [0, 'Sei arrabbiata?'],
    [1, 'No.'],
    [0, 'Sei arrabbiata.'],
    [1, 'Ho detto di no. Passami lo zucchero.']
  ],
  [
    [0, 'Ricordi quando venivamo qui a studiare?'],
    [1, 'Tu dormivi sul libro.'],
    [0, 'Studiavo per osmosi.']
  ],
  [
    [0, 'Ho una cosa da chiederti.'],
    [1, 'Se è il mio cornetto, no.'],
    [0, '*ride* Non è il cornetto.']
  ],
  [
    [0, 'Mio fratello si sposa.'],
    [1, 'Quello che ha perso le chiavi della macchina nel lago?'],
    [0, 'Due volte.']
  ],
  [
    [0, 'Vado a vivere da sola!'],
    [1, 'Ti porto le piante.'],
    [0, 'Le uccideresti.'],
    [1, 'Le ucciderai tu. Io le porto.']
  ]
];
const SOLO = [
  'Che pace...',
  '*sorseggia*',
  'Mmh, perfetto.',
  'Ancora cinque minuti e torno a lavorare.',
  '*guarda fuori dalla finestra*',
  'Devo richiamare mia madre.',
  'Domani inizio la palestra. Domani.',
  'Il profumo del caffè...',
  'Quasi quasi prendo un dolce.',
  '*scrive qualcosa sul telefono*',
  '*sospira contento*',
  'Questa canzone mi piace.',
  'Sto bene qui.'
];
const SOLOH = {
  m: ['Primo caffè della giornata. Il migliore.', 'Ok, sono sveglio. Quasi.'],
  n: ['Non riesco a dormire...', 'Le due di notte sono più belle qui.', 'La città di notte è bellissima.'],
  r: ['Adoro il rumore della pioggia.', "Ho dimenticato l'ombrello. Ovviamente."],
  s: ['Che sole oggi!', 'Dopo vado al parco.'],
  w: ['Nevica! Sembra un film.', 'Cioccolata e neve. Perfetto.'],
  f: ['Non si vede niente là fuori.', 'Questa nebbia è quasi poetica.']
};
const TAPL = [
  'Ottimo caffè!',
  'Grazie, sto bene qui.',
  'Mi piace questo posto.',
  'Ancora un attimo...',
  'Il barista è bravissimo.',
  'Che bella atmosfera.'
];
const JOKES = [
  "Il mio caffè ha l'ansia: è troppo ristretto.",
  'Ho chiesto un decaffeinato. Mi hanno dato un abbraccio.',
  'Perché il cornetto è triste? Si sente sempre in mezzo.',
  'Ho provato lo yoga. Ora sono come un espresso: piccolo e nervoso.',
  'Questo locale è così accogliente che ci ho spostato la residenza.',
  'Mia nonna beve caffè alle due di notte. Poi dorme. Io no.'
];
const REV = {
  5: [
    'Il posto più accogliente della città.',
    'Tornerò domani. E dopodomani.',
    '{item} perfetto, atmosfera da sogno.',
    'Ho trovato il mio angolo di pace.',
    'La musica, la luce, il {item}... tutto giusto.',
    'Cinque stelle e un abbraccio al barista.'
  ],
  4: [
    'Molto carino, {item} buono.',
    'Bella atmosfera, tornerò.',
    'Personale gentile, posto rilassante.',
    'Ottimo per una pausa tranquilla.'
  ],
  3: ['Nella media. Il {item} era ok.', 'Carino, niente di speciale.', 'Si sta bene, ma si può migliorare.'],
  2: ["Ho aspettato un bel po'.", 'Il {item} era tiepido.', 'Troppa confusione.'],
  1: ['Ho fatto in tempo a invecchiare in fila.', 'Mai più.', 'Me ne sono andato senza bere niente.']
};
const REVW = {
  attesa: ['Fila infinita, servono più baristi.', 'Ho aspettato troppo.'],
  sporco: ['Tavoli sporchi ovunque.', 'Nessuno pulisce i tavoli?']
};
const REVT = {
  studente: { 5: 'Wi-fi ottimo, ho scritto mezza tesi qui.' },
  turista: { 5: 'Da non perdere se passate in città!' },
  nonno: { 5: 'Come i caffè di una volta.' },
  nottambulo: { 5: 'Il mio rifugio delle due di notte.' },
  critico: {
    5: 'Un piccolo capolavoro di accoglienza. Imperdibile.',
    4: 'Ottima sorpresa, qualche dettaglio da limare.',
    3: 'Promettente, ma non ancora memorabile.',
    2: 'Lento e disordinato. Peccato.',
    1: 'Esperienza da dimenticare.'
  }
};
const JOINL = [
  "Posso sedermi qui? Di là c'è troppa corrente.",
  'Ciao! Ti dispiace se mi siedo con te?',
  'Ti vedo sempre qui. Posso?',
  "Scusa, è libero? Mi sento un po' sola là in fondo.",
  'Posso? Prometto di non disturbare. Troppo.'
];
const JOINF = ['Eccoti! Mi siedo con te.', 'Ti ho visto da lontano. Spostati, arrivo!', 'Che ci fai qui da solo? Vengo io.'];
/* ----- più frasi ----- */
REL.famiglia = [
  [
    [0, 'Hai mangiato, {B}?'],
    [1, 'Sì.'],
    [0, 'Cosa?'],
    [1, '...Un {item}.'],
    [0, 'Non è mangiare.']
  ],
  [
    [1, 'Ti ho portato una cosa. Non dirlo agli altri.'],
    [0, '*sorride e la nasconde in tasca*']
  ],
  [
    [0, 'Ti ricordi quando eri piccolo e piangevi per la pioggia?'],
    [1, 'Non ero piccolo. Era ieri.']
  ],
  [
    [1, 'Sei stanco, {A}. Si vede.'],
    [0, 'Sono vecchio, {B}. È diverso.'],
    [1, 'Sei tutti e due.']
  ]
];
REL.sposati = [
  [
    [0, 'Buon anniversario di caffè.'],
    [1, 'Ogni giorno è un anniversario, qui.']
  ],
  [
    [1, 'Hai lasciato la tazza nel lavandino.'],
    [0, 'Ti amo.'],
    [1, 'Non cambiare discorso.'],
    [0, 'Ti amo tantissimo.']
  ],
  [
    [0, 'Stesso tavolo?'],
    [1, 'Stesso tavolo. Per sempre, avevamo detto.']
  ],
  [
    [1, '*gli sistema il colletto*'],
    [0, '*le ruba un sorso di {item}*']
  ]
];
REL.amici.push(
  [
    [0, 'Ho una notizia.'],
    [1, 'Bella o brutta?'],
    [0, 'Ho comprato una pianta. È già morta.'],
    [1, 'Brutta, allora.'],
    [0, "Ne ho comprata un'altra."],
    [1, 'Bella!']
  ],
  [
    [1, 'Facciamo qualcosa sabato?'],
    [0, 'Tipo stare qui?'],
    [1, 'Esatto. Tipo stare qui.']
  ],
  [
    [0, '*gli ruba una patatina immaginaria*'],
    [1, 'Ehi!'],
    [0, 'Era immaginaria.'],
    [1, 'Anche la mia rabbia allora.']
  ]
);
REL.migliori.push(
  [
    [0, 'Se un giorno mi trasferisco, vieni con me?'],
    [1, "Dipende. C'è un bar così?"],
    [0, 'No.'],
    [1, 'Allora resti tu.']
  ],
  [
    [1, 'Sai cosa mi piace di te, {A}?'],
    [0, 'Tutto?'],
    [1, 'Il fatto che lo pensi davvero.']
  ],
  [
    [0, 'Ti ricordi il giorno che ci siamo conosciuti?'],
    [1, 'Pioveva.'],
    [0, 'Piove sempre.'],
    [1, 'Ma quel giorno di più.']
  ]
);
REL.cotta.push(
  [
    [0, 'Hai... qualcosa qui.'],
    [1, 'Dove?'],
    [0, '*gli toglie una briciola dalla guancia, poi ritira la mano di scatto*'],
    [1, '...Grazie.']
  ],
  [
    [1, 'Mi presti la penna?'],
    [0, 'Tienila. Cioè... sì. Tienila.']
  ],
  [
    [0, 'Che musica bella, eh?'],
    [1, 'È la macchina del caffè.'],
    [0, '...Bella lo stesso.']
  ]
);
REL.coppia.push(
  [
    [0, 'Dove andiamo in vacanza?'],
    [1, 'Qui.'],
    [0, 'Non è una vacanza.'],
    [1, 'Con te sì.']
  ],
  [
    [1, 'Ho sognato che ci perdevamo a Tokyo.'],
    [0, 'E poi?'],
    [1, 'Ci ritrovavamo in un bar uguale a questo.']
  ],
  [
    [0, '*le prende la mano sotto il tavolo*'],
    [1, '*fa finta di niente, ma sorride alla tazza*']
  ],
  [
    [1, 'Facciamo una foto? Per la mamma.'],
    [0, 'Con la schiuma sul naso?'],
    [1, 'Soprattutto con la schiuma sul naso.']
  ]
);
REL.rivali.push(
  [
    [0, 'Hai cambiato pettinatura.'],
    [1, 'E tu no. Peccato.']
  ],
  [
    [1, 'Ti ho visto ordinare il mio {item}.'],
    [0, 'Non è tuo. È del menù.'],
    [1, 'È mio dal 2019.']
  ]
);
REL.conoscenti.push(
  [
    [0, 'Tu sei quello che legge sempre?'],
    [1, 'E tu quella che ride sempre al telefono.'],
    [0, 'Allora ci conosciamo da mesi.']
  ],
  [
    [1, 'Anche tu aspetti che smetta di piovere?'],
    [0, 'No. Aspetto che inizi a piovere di più.']
  ]
);
const RELM = [
  [
    [0, 'Tu sei {B}? {M} mi parla sempre di te.'],
    [1, 'Oh no. Cosa ti ha detto?'],
    [0, 'Solo cose belle. Quasi tutte.'],
    [1, 'Allora siamo già amici. Per forza.']
  ],
  [
    [1, "Aspetta... sei l'amico di {M}?"],
    [0, 'Colpevole.'],
    [1, 'Mi ha detto che ordini sempre {item}. Ti stavo aspettando.']
  ],
  [
    [0, '{M} ha detto che dovevamo conoscerci. Eccoci.'],
    [1, '{M} ha sempre ragione. È irritante.'],
    [0, 'Molto irritante.']
  ]
];
PAIRS.push(
  [
    [0, 'Hai sentito? Hanno aperto un negozio di soli ombrelli.'],
    [1, 'In questa città diventeranno ricchissimi.']
  ],
  [
    [0, 'Facciamo a metà del cornetto?'],
    [1, 'La metà più grande a me.'],
    [0, 'Allora la tagli tu.']
  ],
  [
    [1, 'Sei di nuovo al telefono.'],
    [0, 'Ti stavo cercando una foto di gatti.'],
    [1, '...Fammela vedere.']
  ],
  [
    [0, 'Hai visto quanta gente stasera?'],
    [1, 'Si sta bene quando piove. Tutti dentro, vicini.']
  ],
  [
    [1, 'Dimmi una cosa che non ti ho mai chiesto.'],
    [0, 'Ho paura dei piccioni.'],
    [1, 'Lo sapevo, in realtà.']
  ],
  [
    [0, 'Sai che il barista ci guarda?'],
    [1, 'Ci guarda perché siamo i clienti migliori.'],
    [0, 'Oppure perché parli troppo forte.']
  ],
  [
    [1, 'Questo {item} sa di casa.'],
    [0, 'Allora siamo a casa.']
  ],
  [
    [0, 'Promettimi che torniamo qui anche quando saremo vecchi.'],
    [1, 'Quando saremo vecchi giocheremo a scacchi con quei due signori.']
  ]
);
SOLO.push(
  '*guarda le gocce che corrono sul vetro, come in una gara*',
  'Questo posto ha un profumo che non so descrivere.',
  '*disegna una faccina sulla schiuma con il cucchiaino*',
  'Chissà se il gatto del bancone mi riconosce.',
  'Dovrei tornare a lavorare. Ancora un sorso.',
  '*sbadiglia e si stiracchia*',
  'Oggi è una giornata da cappuccino doppio.',
  '*ascolta la musica a occhi chiusi*',
  "Ho lasciato l'ombrello a casa. Classico.",
  'Che bello quando qualcuno ride al tavolo accanto.',
  '*scrive una lista di cose da fare, poi la gira e ci disegna sopra*',
  'Mi siedo sempre qui. Non so perché. Anzi, lo so.'
);
TAPL.push(
  'Ciao! Sempre gentile, tu.',
  'Il {item} è perfetto, grazie.',
  'Mi hai fatto venire voglia di restare ancora.',
  'Bel posto. Ci porto i miei amici.',
  'Hai visto che pioggia?',
  'Grazie, stavo pensando proprio a te. Al caffè, cioè.',
  '*ti fa un sorriso enorme*',
  'Sai che vengo qui da quando hai aperto?'
);
const REGL = [
  'Il mio solito tavolo era occupato. Pazienza.',
  'Sempre alla stessa ora, sempre lo stesso {item}. Sono prevedibile.',
  'Qui mi conoscono tutti. È una bella sensazione.',
  "*saluta qualcuno dall'altra parte della sala*",
  'Vengo qui da così tanto che il barista sa già cosa ordino.',
  "Questo è il mio angolo. Qualcuno l'ha capito.",
  'Il gatto del bancone mi ha fatto le fusa. Siamo amici, ufficialmente.',
  'Oggi è il mio giorno libero, e lo passo qui. Ovvio.'
];
