// Il calendario del caffè: un anno di 40 giorni, 4 stagioni da 10 giorni.
// L'anno comincia con la primavera; la prima partita si apre il primo giorno d'autunno.
// FESTE: giorni speciali che tornano ogni anno (s = stagione 0..3, g = giorno 1..10).
//   ev: usa gli effetti di un evento esistente (EVENTS), wx: tempo fisso, atm: Atmosfera in più quel giorno,
//   tipi: più clienti di un certo tipo, l: frasi che i clienti dicono quel giorno.
// COMPLEANNI: il giorno dei personaggi chiave ([stagione, giorno]); gli altri habitué lo hanno a caso, ma fisso.

const STAGIONI = [
  { id: 'primavera', n: 'Primavera', de: 'di primavera', sig: 'pri', wx: { sereno: 1.3, pioggia: 1.1, nebbia: 0.8, neve: 0.1 } },
  {
    id: 'estate',
    n: 'Estate',
    de: 'd’estate',
    sig: 'est',
    wx: { sereno: 1.9, nuvoloso: 0.8, pioggia: 0.6, temporale: 1.6, nebbia: 0.3, neve: 0 }
  },
  { id: 'autunno', n: 'Autunno', de: 'd’autunno', sig: 'aut', wx: { sereno: 0.8, pioggia: 1.5, nebbia: 1.6, neve: 0.2 } },
  { id: 'inverno', n: 'Inverno', de: 'd’inverno', sig: 'inv', wx: { sereno: 0.7, pioggia: 0.9, temporale: 0.5, neve: 4 } }
];

const FESTE = [
  {
    id: 'capodanno',
    s: 0,
    g: 1,
    n: 'Il primo giorno dell’anno',
    d: 'Qui l’anno comincia quando fioriscono i ciliegi. Buon anno!',
    atm: 6,
    l: [
      'Buon anno! Qui si festeggia in primavera, che è più giusto.',
      'Anno nuovo, caffè nuovo.',
      'Quest’anno mi prometto di venire più spesso.'
    ]
  },
  {
    id: 'innamorati',
    s: 0,
    g: 4,
    n: 'La festa degli innamorati',
    d: 'Coppie a ogni tavolo',
    ev: 'innamorati',
    l: ['Oggi tutti si tengono per mano. Anche i pensionati.', 'Due cuori sulla schiuma, per favore.']
  },
  {
    id: 'fiori',
    s: 0,
    g: 8,
    n: 'Il mercato dei fiori',
    d: 'Le bancarelle riempiono la via: tanta gente e profumo di fiori',
    ev: 'festival',
    atm: 4,
    l: [
      'Ho comprato un geranio. Non so dove metterlo, ma è bellissimo.',
      'Tutta la via profuma di fiori.',
      'Le margherite le porto a mia madre.'
    ]
  },
  {
    id: 'musica',
    s: 1,
    g: 3,
    n: 'La notte dei musicisti',
    d: 'Musicisti di strada passano a suonare',
    ev: 'concerto',
    l: ['Senti che musica, là fuori!', 'Stasera la città suona.']
  },
  {
    id: 'stelle',
    s: 1,
    g: 7,
    n: 'La notte delle stelle cadenti',
    d: 'Cielo sereno: stasera si esprimono i desideri',
    wx: 'sereno',
    atm: 5,
    l: ['Ne ho vista una! Ho espresso un desiderio.', 'Stasera esco a guardare il cielo.', 'Il mio desiderio? Un altro {item}.']
  },
  {
    id: 'quartiere',
    s: 1,
    g: 10,
    n: 'La festa del quartiere',
    d: 'Lucine, tavolate in strada, tutti fuori: tantissimi clienti',
    ev: 'festival',
    l: ['C’è la tombolata in piazza!', 'Tutto il quartiere è in strada stasera.', 'Ho ballato con il fornaio.']
  },
  {
    id: 'castagne',
    s: 2,
    g: 3,
    n: 'La castagnata',
    d: 'Profumo di caldarroste dalla piazza (+5 Atmosfera)',
    atm: 5,
    l: ['Ho le mani nere di castagne. Felice.', 'Le caldarroste in piazza sono le migliori.', 'Autunno vero, finalmente.']
  },
  {
    id: 'libri',
    s: 2,
    g: 6,
    n: 'La notte dei libri',
    d: 'La biblioteca resta aperta fino a tardi: arrivano tanti lettori',
    tipi: { lettore: 6 },
    l: ['Ho preso in prestito sei libri. Il massimo.', 'Stasera si legge fino a tardi.', 'Mi consigli un libro da leggere col caffè?']
  },
  {
    id: 'lanterne',
    s: 2,
    g: 10,
    n: 'La notte delle lanterne',
    d: 'I bambini girano con le lanterne di carta (+8 Atmosfera)',
    ev: 'festival',
    atm: 8,
    l: ['Ho visto passare cento lanterne. Che meraviglia.', 'Mia nipote ha fatto la lanterna a forma di gatto.']
  },
  {
    id: 'neve',
    s: 3,
    g: 1,
    n: 'La prima neve',
    d: 'Stanotte è arrivata la neve',
    wx: 'neve',
    l: ['La prima neve! Sembra di essere bambini.', 'Ho fatto un pupazzo davanti al portone.', 'Con la neve il caffè è più buono.']
  },
  {
    id: 'cioccolata',
    s: 3,
    g: 5,
    n: 'La festa della cioccolata',
    d: 'Fa freddo, e tutti vogliono qualcosa di caldo (+4 Atmosfera)',
    atm: 4,
    l: ['Cioccolata densa, di quella che sta in piedi il cucchiaino.', 'Fa un freddo… ci voleva proprio.']
  },
  {
    id: 'luci',
    s: 3,
    g: 9,
    n: 'La notte delle luci',
    d: 'Tutta la città si accende. Gli habitué passano con un pensierino',
    atm: 10,
    regali: 1,
    l: ['Guarda le luci sui balconi!', 'Stasera sembra tutto più gentile.', 'Ho portato i biscotti per tutti.']
  },
  {
    id: 'fineanno',
    s: 3,
    g: 10,
    n: 'L’ultima sera dell’anno',
    d: 'Domani comincia la primavera. Stasera si fanno i conti con il cuore',
    atm: 6,
    l: ['Che anno, eh?', 'Domani è primavera. Si ricomincia.', 'Quest’anno è passato in fretta, qui dentro.']
  }
];

const COMPLEANNI = {
  mia: [0, 2],
  luca: [0, 6],
  giada: [0, 9],
  tommy: [0, 10],
  marta: [1, 1],
  sara: [1, 2],
  gio: [1, 5],
  kenji: [1, 8],
  yusuf: [1, 9],
  bruni: [2, 2],
  irene: [2, 4],
  dario: [2, 5],
  davide: [2, 7],
  pietro: [2, 8],
  aldo: [3, 2],
  elio: [3, 3],
  nora: [3, 4],
  ugo: [3, 6],
  rosa: [3, 7],
  vittoria: [3, 8]
};

// una frase tutta loro, il giorno del compleanno
const COMPL_L = {
  mia: 'Mi sono regalata un pennello nuovo. Costava troppo. Non me ne pento.',
  luca: 'Mia madre mi ha chiamato alle sette e mi ha cantato gli auguri. Stonata. Bellissimo.',
  giada: 'Ho studiato fino a mezzanotte e poi mi sono accorta che era il mio compleanno.',
  tommy: 'Ho preparato una battuta sui compleanni. Non fa ridere. La dico lo stesso?',
  marta: 'Gio mi ha lasciato un biglietto sul cuscino. C’era scritto solo «ancora».',
  sara: 'Ho preso un giorno di ferie. Il primo dell’anno. Per me.',
  gio: 'Marta dice che non dimostro la mia età. Io dico che mi sento il doppio, ma felice.',
  kenji: 'A Tokyo si mangia una torta con le fragole. Qui proverò il vostro modo.',
  yusuf: 'Mia sorella mi ha mandato una foto da casa. Tutta la famiglia con un cartello.',
  bruni: 'Ho compiuto gli anni. Li ho anche corretti, ma non sono migliorati.',
  irene: 'Mi sono regalata un libro che avevo già. Così so che mi piace.',
  dario: 'Alla mia età i compleanni si contano con calma. Uno alla volta.',
  davide: 'L’anno scorso non avevo voglia di festeggiare. Quest’anno sì. È già tanto.',
  pietro: 'Sono uscito presto dal turno. Per una volta, il caffè lo bevo seduto.',
  aldo: 'Lei mi faceva sempre la torta di mele. Quest’anno l’ho fatta io. È venuta così così.',
  elio: 'I miei nipoti mi hanno fatto un disegno. Sono io, con un cappello enorme.',
  nora: 'Di solito il compleanno lo passo da sola, al lavoro. Quest’anno sono venuta qui.',
  ugo: 'Mi hanno scritto in tanti. Anche persone che non sentivo da anni.',
  rosa: 'Ciuffo mi ha portato una lucertola. Il suo regalo. Gliel’ho rimessa in giardino.',
  vittoria: 'Oggi ho spento il telefono. Il regalo più bello che potessi farmi.'
};

const COMPL_A = [
  'Oggi compio gli anni. Non l’ho detto a nessuno.',
  'Sai che giorno è oggi? Il mio compleanno.',
  'Un anno in più. E sono qui, con un {item}.'
];

// gli habitué senza storia, il giorno del loro compleanno
const COMPL_R = [
  'Oggi è il mio compleanno! Mi offro un {item}.',
  'Compio gli anni. Ho deciso di festeggiare qui.',
  'Un anno in più, oggi. Si sente?'
];

// anniversari: un anno fa (40 giorni nel calendario del caffè) si sono conosciuti qui
const ANNIV = [
  [
    [0, 'Sai che giorno è oggi?'],
    [1, 'Martedì?'],
    [0, 'Un anno fa, proprio a questo tavolo, ci siamo conosciuti.'],
    [1, '...Lo so. Facevo finta, per vedere se te lo ricordavi.'],
    [0, '*tira fuori un biglietto piegato in quattro*'],
    [1, 'Al prossimo anno. Qui.']
  ],
  [
    [1, 'Un anno. Un anno fa mi hai rubato il tavolo.'],
    [0, 'Te l’ho rubato e poi ti ho invitato a sederti. È diverso.'],
    [1, 'Ho ancora lo scontrino di quel giorno. Nel portafoglio.'],
    [0, 'Io ho ancora la tazza. Il barista non lo sa.'],
    [1, '*ride*  Buon anniversario.']
  ],
  [
    [0, 'Ho fatto i conti. Da quando ci conosciamo abbiamo bevuto qui più di cento caffè.'],
    [1, 'E litigato almeno dieci volte.'],
    [0, 'E fatto pace undici.'],
    [1, 'Undici?'],
    [0, 'Una volta abbiamo fatto pace prima di litigare. Per sicurezza.'],
    [1, 'Buon anno insieme, allora.']
  ]
];
