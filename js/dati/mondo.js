// Menu, stili del locale, quartieri, meteo, eventi, arredi, richieste speciali, radio e minigiochi.

const MENU = [
  { id: 'caffe', n: 'caffè', a: 'Un', p: 3, c: 0, s: 'm', t: 1, i: 'cup' },
  { id: 'capp', n: 'cappuccino', a: 'Un', p: 5, c: 50, s: 'm', t: 1.1, i: 'cup', pr: { m: 2.2 } },
  { id: 'corn', n: 'cornetto', a: 'Un', p: 6, c: 150, s: 'v', t: 0.6, i: 'croissant', pr: { m: 2.5 } },
  { id: 'matcha', n: 'tè matcha', a: 'Un', p: 8, c: 400, s: 'b', t: 1.2, i: 'teacup' },
  { id: 'iced', n: 'iced latte', a: 'Un', p: 9, c: 900, s: 'm', t: 1.1, i: 'glass', pr: { sun: 3, rain: 0.3, snow: 0.1 } },
  { id: 'cake', n: 'cheesecake', a: 'Una', p: 14, c: 2000, s: 'v', t: 0.7, i: 'cake', pr: { a: 1.8 } },
  { id: 'choc', n: 'cioccolata calda', a: 'Una', p: 15, c: 4000, s: 'b', t: 1.3, i: 'mug', pr: { rain: 2, snow: 3.5, sun: 0.3 } },
  { id: 'toast', n: 'toast', a: 'Un', p: 17, c: 7000, s: 'k', t: 1.6, i: 'toast', pr: { a: 2 } },
  { id: 'smooth', n: 'smoothie', a: 'Uno', p: 19, c: 12000, s: 'b', t: 1.2, i: 'smoothie', pr: { sun: 3, snow: 0.2 } },
  { id: 'pancake', n: 'pancake', a: 'Dei', p: 22, c: 20000, s: 'k', t: 1.7, i: 'pancake', pr: { m: 2.5 } },
  { id: 'bubble', n: 'bubble tea', a: 'Un', p: 25, c: 32000, s: 'b', t: 1.3, i: 'bubble' },
  { id: 'tira', n: 'tiramisù', a: 'Un', p: 29, c: 50000, s: 'v', t: 0.7, i: 'tira', pr: { n: 1.6 } },
  { id: 'ramen', n: 'ramen di mezzanotte', a: 'Un', p: 46, c: 90000, s: 'k', t: 2, i: 'bowl', pr: { n: 3.5, early: 0.1 } },
  { id: 'affo', n: 'affogato', a: 'Un', p: 38, c: 150000, s: 'm', t: 1.2, i: 'affo', pr: { sun: 1.8 } }
];
const THEMES = {
  neon: {
    n: 'Lofi neon',
    c: 0,
    wall: '#2a1a3c',
    str: '#2f1e44',
    wai: '#3a2233',
    trim: '#5a3446',
    f1: '#3b2428',
    f2: '#321e22',
    ft: 'p',
    wd: '#a8714a',
    wt: '#c98f5e',
    cn: '#4b2a3a',
    ct: '#c9a27a',
    lamp: '#d98b3a',
    acc: '#ff4fa3'
  },
  bosco: {
    n: 'Baita nel bosco',
    c: 2500,
    wall: '#3d2b1f',
    str: '#45311f',
    wai: '#5a3d24',
    trim: '#7a5530',
    f1: '#6b4a2e',
    f2: '#5a3d25',
    ft: 'p',
    wd: '#8a5a32',
    wt: '#b07a45',
    cn: '#5a3a22',
    ct: '#d9b07a',
    lamp: '#e0a84a',
    acc: '#7bd389'
  },
  sakura: {
    n: 'Sala da tè sakura',
    c: 9000,
    wall: '#e3d0bc',
    str: '#dbc6b0',
    wai: '#7a4a3a',
    trim: '#a8604a',
    f1: '#c9b07a',
    f2: '#9e8550',
    ft: 't',
    wd: '#5a3a2a',
    wt: '#7a503a',
    cn: '#6a3a2a',
    ct: '#d9b48a',
    lamp: '#fff2dc',
    acc: '#ff9fc8'
  },
  retro: {
    n: "Diner anni '80",
    c: 25000,
    wall: '#1d5f6a',
    str: '#21697a',
    wai: '#e86a92',
    trim: '#ffd1e0',
    f1: '#ece4d4',
    f2: '#2b2d42',
    ft: 'c',
    wd: '#c8c8d6',
    wt: '#ffffff',
    cn: '#e86a92',
    ct: '#d9d9e6',
    lamp: '#4ff0ff',
    acc: '#4ff0ff'
  },
  natale: {
    n: 'Natale in baita',
    c: 60000,
    wall: '#5a1e24',
    str: '#621f27',
    wai: '#2c4a33',
    trim: '#d9b441',
    f1: '#5e3a26',
    f2: '#4e2f1e',
    ft: 'p',
    wd: '#8a5a32',
    wt: '#b07a45',
    cn: '#2c4a33',
    ct: '#d9b441',
    lamp: '#ffcf6a',
    acc: '#2ec46b'
  }
};
const DIST = {
  centro: { n: 'Centro al neon', d: 'Grattacieli, insegne e pioggia' },
  porto: { n: 'Porto vecchio', d: 'Nebbia, barche e un faro' },
  montagna: { n: 'Borgo di montagna', d: 'Neve, baite e camini accesi' },
  spiaggia: { n: 'Lungomare', d: 'Tramonti, palme e salsedine' }
};
const WXW = {
  centro: { sereno: 3, nuvoloso: 2, pioggia: 4, temporale: 1.2, nebbia: 1, neve: 0.6 },
  porto: { sereno: 3, nuvoloso: 2, pioggia: 3, temporale: 1.5, nebbia: 2.5, neve: 0.3 },
  montagna: { sereno: 3, nuvoloso: 2, pioggia: 1.5, temporale: 0.8, nebbia: 1.5, neve: 4 },
  spiaggia: { sereno: 6, nuvoloso: 2, pioggia: 1.5, temporale: 1, nebbia: 0.5, neve: 0 }
};
const WXN = { sereno: 'Sereno', nuvoloso: 'Nuvoloso', pioggia: 'Pioggia', temporale: 'Temporale', nebbia: 'Nebbia', neve: 'Neve' };
const EVENTS = {
  festival: { n: 'Festival in città', d: 'Molti più clienti oggi' },
  studenti: { n: 'Settimana degli esami', d: 'Arrivano tantissimi studenti' },
  critico: { n: 'Visita del critico', d: 'Oggi passa un critico gastronomico: trattalo bene!' },
  blackout: { n: 'Blackout serale', d: 'Dalle 19:30 solo candele (+10 Atmosfera)' },
  turisti: { n: 'Pullman di turisti', d: 'Turisti curiosi e mance generose' },
  concerto: { n: 'Notte dei musicisti', d: 'Musicisti di strada passano a suonare' },
  innamorati: { n: 'Festa degli innamorati', d: 'Coppie ovunque' },
  openmic: { n: 'Serata comica', d: 'Tommy si esibisce dalle 20:30' }
};
const CHAIRN = [
  'Sedie di legno',
  'Sedie imbottite',
  'Cuscini di velluto',
  'Poltroncine',
  'Poltrone vintage',
  'Divanetti di lusso',
  'Troni di velluto'
];
const DECN = ['Piante', 'Lucine colorate', 'Tappeto', 'Libreria', 'Quadri', 'Lanterne di carta', 'Jukebox', 'Acquario'];
const SUGG = [
  'Caffè sotto la pioggia',
  'Neon Bean',
  'Il Gatto Nero',
  'Lofi Latte',
  'Tazza di Luna',
  'Mezzanotte & Crema',
  'Pioggia Dolce',
  'Bar Insonnia',
  'Chicco Felice',
  'La Tana'
];
const REQS = [
  {
    k: 'fretta',
    t: 'Di corsa!',
    w: 3,
    ok: c => true,
    lines: [
      'Ho un treno tra cinque minuti, velocissimo ti prego!',
      'Sono in ritardo pazzesco. Mi salvi?',
      'Ho dieci minuti di pausa. Ce la facciamo?'
    ]
  },
  {
    k: 'doppio',
    t: 'Doppio',
    w: 2,
    ok: c => ['caffe', 'capp', 'iced'].includes(c.order.id),
    lines: ['Stanotte non ho dormito.', 'È una di quelle giornate.']
  },
  {
    k: 'schiuma',
    t: 'Extra schiuma',
    w: 2,
    mg: 'monta',
    ok: c => c.order.id === 'capp',
    lines: ['Con tantissima schiuma, tipo nuvola.', 'Il latte bello caldo, mi raccomando!']
  },
  {
    k: 'forma',
    t: 'Disegno a mano',
    w: 1.6,
    mg: 'mano',
    ok: c => ['capp', 'choc'].includes(c.order.id),
    lines: ['Mi disegni {forma} sulla schiuma?', 'Sulla schiuma vorrei {forma}. Si può?', 'È per una persona speciale: mi fai {forma}?']
  },
  {
    k: 'dedica',
    t: 'Con un disegno',
    w: 1.5,
    mg: 'latte',
    ok: c => c.order.id === 'capp',
    lines: ['Mi fai un cuoricino sopra? È per una persona speciale.', 'È il mio compleanno... un disegno sulla schiuma?']
  },
  {
    k: 'crema',
    t: 'Crema perfetta',
    w: 1.5,
    mg: 'monta',
    ok: c => c.order.id === 'caffe' || c.order.id === 'affo',
    lines: ['Lo voglio con la crema perfetta, come a Napoli.', 'Sono di Napoli. Non deludermi.']
  },
  {
    k: 'cotto',
    t: 'Ben cotto',
    w: 2,
    mg: 'padella',
    ok: c => c.order.s === 'k',
    lines: ['Ben cotto e croccante, sono esigente.', 'Dorato, come lo faceva mia nonna.']
  },
  {
    k: 'sorpresa',
    t: 'Sorprendimi',
    w: 2,
    mg: 'vetrina',
    ok: c => c.order.s === 'v',
    lines: ['E aggiungi tre dolcetti misti per i colleghi. Scegli tu!', 'E un piattino di dolci a sorpresa, per festeggiare.']
  },
  {
    k: 'fresco',
    t: 'Bello freddo',
    w: 2,
    mg: 'shaker',
    ok: c => ['smooth', 'bubble', 'iced'].includes(c.order.id),
    lines: ['Bello freddo e cremoso, per favore.', 'Con tanto ghiaccio, mi devo svegliare.']
  }
];
const STATIONS = [
  { n: 'Lofi sotto la pioggia', B: 2.8, songs: ['Gocce sul vetro', 'Tazza calda', 'Ore 2:47', 'Ombrelli gialli'] },
  { n: 'Jazz di mezzanotte', B: 2.4, jazz: 1, songs: ['Blue espresso', 'Fumo e velluto', 'Il sassofono del vicino', 'Taxi alle tre'] },
  { n: 'Bossa sotto la pioggia', B: 2.2, bossa: 1, songs: ['Saudade di cappuccino', 'Spiaggia in tazza', 'Rio, ore sei'] },
  { n: 'City pop', B: 2, pop: 1, songs: ['Neon love', 'Tokyo drive', 'Luci sulla tangenziale'] }
];
const MGI = {
  mano: { t: 'Latte art a mano', x: 'Disegna col dito sulla schiuma la forma che vedi, poi tocca «Fatto!».', b: 'Fatto!' },
  latte: { t: 'Latte art', x: 'Tocca quando la lancetta è nel verde. Tre versate.', b: 'Versa!' },
  monta: { t: 'Monta il latte', x: 'Tieni premuto per scaldare il latte, lascia quando è nel verde. Tre lattiere.', b: 'Tieni premuto' },
  padella: { t: 'Ai fornelli', x: 'Tocca quando è dorato, prima che bruci. Tre pezzi.', b: 'Gira!' },
  shaker: { t: 'Shakera!', x: 'Tocca velocissimo per riempire, ma quando scade il tempo devi essere nel verde.', b: 'Shake!' },
  vetrina: { t: 'Dalla vetrina', x: "Guarda bene l'ordine dei dolci: poi toccali nella stessa sequenza.", b: '' }
};
const MGEND = {
  mano: ['Diciamo che è... arte moderna.', 'Si riconosce! Mancia extra.', 'Un capolavoro sulla schiuma! Mancia tripla.'],
  latte: ['Una macchia di latte... pazienza.', 'Una bella rosetta. Mancia extra.', 'Un cuore perfetto! Mancia tripla.'],
  monta: ["Un po' bruciato... pazienza.", 'Quasi perfetto. Mancia extra.', 'Perfetto! Mancia tripla.'],
  padella: ["Un po' bruciacchiato... si mangia lo stesso.", 'Ben cotto. Mancia extra.', 'Dorato alla perfezione! Mancia tripla.'],
  shaker: ['Troppo poco... o troppo!', 'Bello cremoso. Mancia extra.', 'Consistenza perfetta! Mancia tripla.'],
  vetrina: ['Hai sbagliato dolce...', 'Quasi tutto giusto. Mancia extra.', 'Memoria perfetta! Mancia tripla.']
};
const SWEETS = [
  ['croissant', 'Cornetto'],
  ['cake', 'Torta'],
  ['donut', 'Ciambella'],
  ['muffin', 'Muffin'],
  ['cookie', 'Biscotto']
].map(([k, n]) => [pxSvg(PXS[k].r, PXS[k].p), n]);

// Personalizzazione della macchina del caffè (scheda Stili). Ogni oggetto comprato dà +1 Atmosfera.
// fin: finiture (una alla volta) con colori corpo/ombra/riflesso; dec: adesivi (uno alla volta); acc: accessori (si possono avere tutti)
const MACH = {
  fin: [
    { id: 'acciaio', n: 'Acciaio', c: 0, b: '#8a8fa8', d: '#5a5f78', t: '#cfd3e6' },
    { id: 'rame', n: 'Rame', c: 800, b: '#c87a4a', d: '#8a4a2a', t: '#ffd0a0' },
    { id: 'rosa', n: 'Rosa pastello', c: 2500, b: '#f4a0c0', d: '#c06a8a', t: '#fff0f6' },
    { id: 'menta', n: 'Verde menta', c: 6000, b: '#8ad8c0', d: '#4a9a8a', t: '#e8fff8' },
    { id: 'nera', n: 'Nera opaca', c: 12000, b: '#3a3842', d: '#1e1c24', t: '#8a8fa8' },
    { id: 'oro', n: 'Oro', c: 40000, b: '#d9b441', d: '#a8822a', t: '#fff3c4' }
  ],
  dec: [
    { id: 'cuore', n: 'Adesivo a cuore', c: 300 },
    { id: 'stella', n: 'Adesivo a stella', c: 600 },
    { id: 'gatto', n: 'Adesivo col gatto', c: 1200 },
    { id: 'fulmine', n: 'Fulmine al neon', c: 3000 }
  ],
  acc: [
    { id: 'tazze', n: 'Tazzine impilate', d: 'Una pila di tazzine calde sopra la macchina', c: 400 },
    { id: 'lattiera', n: 'Lattiera', d: "Una lattiera d'acciaio accanto alla macchina", c: 900 },
    { id: 'piantina', n: 'Piantina', d: "Un vasetto con una piantina, per un po' di verde", c: 1500 },
    { id: 'manometro', n: 'Manometro', d: "L'orologio della pressione, con la lancetta che balla", c: 2500 },
    { id: 'lucine', n: 'Lucine', d: 'Un filo di lucine colorate sopra la macchina', c: 5000 },
    { id: 'insegna', n: 'Insegna «Espresso»', d: 'Una piccola insegna al neon sopra la macchina', c: 9000 }
  ]
};

// Insegne al neon da parete (scheda Stili). '#' colore principale, '+' secondo colore.
// Le scritte usano un carattere in pixel 3x5 (NEONFONT). Si installano in punti fissi dei muri (vedi wallSlots).
const NEONS = [
  { id: 'cuore', n: 'Cuore', c: 500, col: '#ff4fa3', r: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'] },
  {
    id: 'tazzina',
    n: 'Tazzina',
    c: 800,
    col: '#4ff0ff',
    col2: '#ffffff',
    r: ['..+.+...', '.+.+....', '........', '#######.', '#.....##', '#.....#.', '.#...#..', '..###...']
  },
  {
    id: 'ciambella',
    n: 'Ciambella',
    c: 1200,
    col: '#ff9fc8',
    col2: '#ffd166',
    r: ['..###..', '.#+#+#.', '#+#.#+#', '##...##', '#+#.#+#', '.#+#+#.', '..###..']
  },
  { id: 'stella', n: 'Stella', c: 1500, col: '#ffd166', r: ['...#...', '...#...', '#######', '.#####.', '..###..', '.##.##.', '##...##'] },
  {
    id: 'luna',
    n: 'Luna',
    c: 2000,
    col: '#c8b6ff',
    col2: '#ffd166',
    r: ['..###..+', '.##....', '##......', '##..+...', '##......', '.##....', '..###...']
  },
  { id: 'nota', n: 'Nota musicale', c: 2500, col: '#7bd389', r: ['..####', '..#..#', '..#..#', '..#..#', '###.##', '###.##'] },
  {
    id: 'gatto',
    n: 'Gatto',
    c: 3500,
    col: '#ff9f43',
    col2: '#4ff0ff',
    r: ['#.....#', '##...##', '#######', '#.+.+.#', '#..#..#', '.#####.']
  },
  { id: 'fulmine', n: 'Fulmine', c: 4000, col: '#ffd166', r: ['..###', '.##..', '####.', '..##.', '.##..', '##...', '#....'] },
  {
    id: 'cactus',
    n: 'Cactus',
    c: 5000,
    col: '#7bd389',
    col2: '#ff4fa3',
    r: ['...#...', '#..#...', '#..#..#', '####..#', '...####', '...#...', '.+++++.', '..+++..']
  },
  { id: 'w_caffe', n: 'Scritta «CAFFÈ»', c: 6000, col: '#ffd166', word: 'CAFFÈ' },
  { id: 'w_amore', n: 'Scritta «AMORE»', c: 8000, col: '#ff4fa3', word: 'AMORE' },
  { id: 'w_notte', n: 'Scritta «NOTTE»', c: 10000, col: '#4ff0ff', word: 'NOTTE' },
  { id: 'w_piove', n: 'Scritta «PIOVE»', c: 12000, col: '#8ab8ff', word: 'PIOVE' },
  { id: 'w_ciao', n: 'Scritta «CIAO»', c: 15000, col: '#ff6fa0', word: 'CIAO' }
];
const NEONFONT = {
  A: ['###', '#.#', '###', '#.#', '#.#'],
  C: ['###', '#..', '#..', '#..', '###'],
  E: ['###', '#..', '##.', '#..', '###'],
  È: ['.#.', '###', '#..', '##.', '###'],
  F: ['###', '#..', '##.', '#..', '#..'],
  I: ['#', '#', '#', '#', '#'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  N: ['#..#', '##.#', '#.##', '#..#', '#..#'],
  O: ['###', '#.#', '#.#', '#.#', '###'],
  P: ['###', '#.#', '###', '#..', '#..'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  V: ['#.#', '#.#', '#.#', '#.#', '.#.']
};

// Forme per la latte art a mano: tratti in coordinate 0..1 (il centro della tazza è 0.5, 0.5)
const SHAPEN = {
  cuore: 'un cuore',
  foglia: 'una foglia',
  stella: 'una stella',
  sole: 'un sole',
  gatto: 'un gatto',
  spirale: 'una spirale'
};
const SHAPES = {
  cuore: () => [
    Array.from({ length: 41 }, (_, i) => {
      const t = (i / 40) * Math.PI * 2;
      return [
        0.5 + (16 * Math.sin(t) ** 3) / 48,
        0.47 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 48
      ];
    })
  ],
  foglia: () => [
    [
      [0.5, 0.2],
      [0.5, 0.82]
    ],
    ...[0.3, 0.42, 0.54, 0.66].map(y => [
      [0.5 - 0.22 + y * 0.12, y - 0.08],
      [0.5, y + 0.04],
      [0.5 + 0.22 - y * 0.12, y - 0.08]
    ])
  ],
  stella: () => [
    Array.from({ length: 11 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5,
        r = i % 2 ? 0.14 : 0.32;
      return [0.5 + Math.cos(a) * r, 0.52 + Math.sin(a) * r];
    })
  ],
  sole: () => [
    Array.from({ length: 21 }, (_, i) => [0.5 + Math.cos((i / 20) * Math.PI * 2) * 0.13, 0.5 + Math.sin((i / 20) * Math.PI * 2) * 0.13]),
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return [
        [0.5 + Math.cos(a) * 0.2, 0.5 + Math.sin(a) * 0.2],
        [0.5 + Math.cos(a) * 0.32, 0.5 + Math.sin(a) * 0.32]
      ];
    })
  ],
  gatto: () => [
    Array.from({ length: 25 }, (_, i) => [0.5 + Math.cos((i / 24) * Math.PI * 2) * 0.22, 0.55 + Math.sin((i / 24) * Math.PI * 2) * 0.19]),
    [
      [0.32, 0.43],
      [0.3, 0.22],
      [0.43, 0.37]
    ],
    [
      [0.68, 0.43],
      [0.7, 0.22],
      [0.57, 0.37]
    ]
  ],
  spirale: () => [
    Array.from({ length: 50 }, (_, i) => [0.5 + Math.cos(i * 0.36) * (0.02 + i * 0.0062), 0.5 + Math.sin(i * 0.36) * (0.02 + i * 0.0062)])
  ]
};
