// Personaggi: aspetto dei clienti casuali, tratti, tipi di cliente e i personaggi delle storie (CH).

const SKIN = ['#f6d2b0', '#eab88f', '#c98d63', '#9a633f', '#6b4129', '#f9e0c9', '#d9a07a'];
const HAIR = [
  '#1b1420',
  '#3b2418',
  '#7a4a22',
  '#d9a441',
  '#ece3d2',
  '#ff7eb6',
  '#6ad1ff',
  '#b44a2a',
  '#8a8aa0',
  '#9b6bff',
  '#2d2a3a',
  '#c46b3a'
];
const TOPS = [
  '#ffd166',
  '#ef476f',
  '#06d6a0',
  '#118ab2',
  '#8e7dff',
  '#ff9f43',
  '#2ec4b6',
  '#e76f51',
  '#f4f1de',
  '#5b6190',
  '#c77dff',
  '#7bd389',
  '#3d405b',
  '#ff8fab',
  '#90be6d'
];
const BOTS = ['#2b2d42', '#3d3a50', '#5c4b51', '#1f3b4d', '#4a4e69', '#3a2f2a', '#6d597a', '#264653'];
const NAMES = [
  'Giulia',
  'Marco',
  'Aiko',
  'Omar',
  'Chiara',
  'Léa',
  'Pietro',
  'Yuki',
  'Nadia',
  'Samuele',
  'Irene',
  'Tariq',
  'Bea',
  'Hiro',
  'Elena',
  'Matteo',
  'Zoe',
  'Ravi',
  'Nina',
  'Ettore',
  'Lin',
  'Greta',
  'Kofi',
  'Alma',
  'Bruno',
  'Sofia',
  'Diego',
  'Mei',
  'Ivan',
  'Lucia',
  'Amir',
  'Vera',
  'Tobia',
  'Noemi',
  'Kai',
  'Sara B.',
  'Oscar',
  'Emma',
  'Joon',
  'Marisa',
  'Filippo',
  'Ada',
  'Ugo',
  'Selin',
  'Nico',
  'Livia',
  'Teo',
  'Frida',
  'Rocco',
  'Ines',
  'Arturo',
  'Dalia',
  'Luca R.',
  'Wen',
  'Pablo',
  'Clara',
  'Mattia',
  'Rin',
  'Gaia',
  'Elia'
];
const CH = {
  corrado: {
    n: 'Corrado',
    l: { s: '#e8c0a0', h: '#b8b8c8', hs: 3, o: 1, c1: '#6a5a48', c2: '#3a3430', a: 'barba', act: 'news', sh: '#2a2018' }
  },
  davide: {
    n: 'Davide',
    l: { s: '#eab88f', h: '#6a5a50', hs: 0, o: 2, c1: '#5a6070', c2: '#3a3a48', a: 'barba', act: 'sip', sh: '#2a2430' }
  },
  elena: { n: 'Elena', l: { s: '#eab88f', h: '#6a4a3a', hs: 6, o: 1, c1: '#ef476f', c2: '#2b2d42', a: 'orecchino', act: 'phone' } },
  yusuf: {
    n: 'Yusuf',
    l: { s: '#6b4129', h: '#1b1420', hs: 4, o: 1, c1: '#e8e0d0', c2: '#2b2d42', a: 'orecchino', ac: '#ffd166', sh: '#ffd166', act: 'phone' }
  },
  mia: {
    n: 'Mia',
    l: {
      s: '#f6d2b0',
      h: '#ff7eb6',
      hs: 10,
      o: 1,
      c1: '#ffd166',
      c2: '#2b2d42',
      a: 'lentiggini',
      ac: '#4ff0ff',
      sh: '#ff4fa3',
      act: 'sketch'
    }
  },
  luca: {
    n: 'Luca',
    l: { s: '#eab88f', h: '#1b1420', hs: 0, o: 1, c1: '#118ab2', c2: '#3d3a50', a: 'cuffie', ac: '#ffd166', sh: '#f4f1de', act: 'phone' }
  },
  marta: {
    n: 'Marta',
    l: { s: '#f9e0c9', h: '#b44a2a', hs: 2, o: 2, c1: '#2ec4b6', c2: '#3d3a50', a: 'orecchino lentiggini', ac: '#ffd166', act: 'book' }
  },
  gio: { n: 'Gio', l: { s: '#c98d63', h: '#3b2418', hs: 4, o: 0, c1: '#e76f51', c2: '#2b2d42', a: 'barba', sh: '#f4f1de' } },
  bruni: {
    n: 'Prof. Bruni',
    l: {
      s: '#f9e0c9',
      h: '#ece3d2',
      hs: 5,
      o: 4,
      c1: '#3d6b4f',
      c2: '#9a3a3a',
      a: 'occhiali barba farfallino',
      ac: '#9a3a3a',
      act: 'news',
      pet: { k: 'cane', n: 'Virgilio', c: '#f4e8d0', c2: '#c9a27a' }
    }
  },
  sara: { n: 'Sara', l: { s: '#9a633f', h: '#3b2418', hs: 6, o: 0, c1: '#9ad7e8', c2: '#5b6190', a: 'infermiera', sh: '#f4f1de' } },
  kenji: { n: 'Kenji', l: { s: '#f6d2b0', h: '#1b1420', hs: 8, o: 1, c1: '#ff9f43', c2: '#1f3b4d', hc: '#ffd166', a: '', act: 'phone' } },
  rosa: {
    n: 'Nonna Rosa',
    l: {
      s: '#f6d2b0',
      h: '#d8d8e4',
      hs: 3,
      o: 3,
      c1: '#8e5ea2',
      c2: '#3d3a50',
      a: 'occhiali sciarpa',
      ac: '#ffd166',
      act: 'knit',
      pet: { k: 'gatto', n: 'Ciuffo', c: '#e8a060', c2: '#b8703a' }
    }
  },
  dario: {
    n: 'Dario',
    l: {
      s: '#eab88f',
      h: '#8a8aa0',
      hs: 12,
      o: 2,
      c1: '#5b6190',
      c2: '#3a2f2a',
      hc: '#6a4a3a',
      a: 'barba',
      act: 'news',
      pet: { k: 'cane', n: 'Re', c: '#8a5a3a', c2: '#5a3a22', s: 's' }
    }
  },
  elio: {
    n: 'Elio',
    l: { s: '#6b4129', h: '#ece3d2', hs: 5, o: 0, c1: '#a3b18a', c2: '#3a2f2a', a: 'occhiali farfallino', ac: '#e63946', act: 'book' }
  },
  bianca: { n: 'Bianca', l: { s: '#f9e0c9', h: '#d9a441', hs: 13, o: 3, c1: '#fffaf2', c2: '#e8e0d0', a: 'orecchino', sh: '#ff9fc8' } },
  aldo: {
    n: 'Aldo',
    l: {
      s: '#eab88f',
      h: '#e8e4dc',
      hs: 5,
      o: 2,
      c1: '#6d597a',
      c2: '#3a2f2a',
      hc: '#3d3a50',
      a: 'occhiali sciarpa cappello',
      ac: '#c9a227',
      act: 'news'
    }
  },
  giada: {
    n: 'Giada',
    l: {
      s: '#eab88f',
      h: '#3b2418',
      hs: 11,
      o: 3,
      c1: '#90be6d',
      c2: '#264653',
      a: 'lentiggini',
      ac: '#ffd166',
      act: 'book',
      pet: { k: 'coniglio', n: 'Fragola', c: '#f4f1de', c2: '#ffc0d0' }
    }
  },
  tommy: {
    n: 'Tommy',
    l: { s: '#c98d63', h: '#ff9f43', hs: 7, o: 1, c1: '#c77dff', c2: '#2b2d42', a: 'orecchino', sh: '#4ff0ff', act: 'guitar' }
  },
  irene: {
    n: 'Irene',
    l: { s: '#f6d2b0', h: '#1b1420', hs: 6, o: 4, c1: '#3d405b', c2: '#f4f1de', a: 'occhiali rossetto', ac: '#ff4fa3', act: 'sketch' }
  },
  nora: {
    n: 'Nora',
    l: {
      s: '#c98d63',
      h: '#6ad1ff',
      hs: 1,
      o: 3,
      c1: '#7bd389',
      c2: '#264653',
      a: 'fiore orecchino',
      act: 'camera',
      pet: { k: 'uccellino', n: 'Pio', c: '#4fb8ff', c2: '#2a7ad0' }
    }
  },
  ugo: { n: 'Ugo', l: { s: '#eab88f', h: '#7a4a22', hs: 9, o: 2, c1: '#118ab2', c2: '#2b2d42', hc: '#e63946', a: 'barba' } },
  vittoria: {
    n: 'Vittoria',
    l: { s: '#f9e0c9', h: '#1b1420', hs: 1, o: 4, c1: '#e63946', c2: '#1b1420', a: 'occhiali orecchino rossetto', ac: '#1b1420' }
  },
  leo: {
    n: 'Leo',
    l: { s: '#e0ac85', h: '#2b1d16', hs: 7, o: 1, c1: '#3d5a4c', c2: '#2b2d42', ac: '#e63946', a: 'cuffie', act: 'phone', sh: '#f4f1de' }
  },
  alice: {
    n: 'Alice',
    l: {
      s: '#f1c6a7',
      h: '#5a3a28',
      hs: 12,
      o: 2,
      c1: '#e8b4b8',
      c2: '#4a4e69',
      hc: '#7b9acc',
      ac: '#f4d35e',
      a: 'sciarpa',
      act: 'book',
      sh: '#5a3a28'
    }
  },
  pietro: {
    n: 'Pietro',
    l: { s: '#9a633f', h: '#1b1420', hs: 4, o: 0, c1: '#ffd166', c2: '#3d3a50', a: 'cuffie', ac: '#4ff0ff', sh: '#e63946', act: 'phone' }
  }
};
const TRAITS = ['romantico', 'chiacchierone', 'timido', 'brontolone', 'artista', 'sportivo', 'sognatore', 'nerd'];
const TYPES = {
  normale: { n: 'Cliente', w: 10 },
  studente: { n: 'Studente', w: 3, stay: 2, act: 'laptop', h: [9, 25.5] },
  fretta: { n: 'Di corsa', w: 3, take: 0.85, pat: 0.55, spd: 1.35, h: [7, 19] },
  turista: { n: 'Turista', w: 1.5, tip: 2.2, act: 'camera', h: [9, 22] },
  nonno: { n: 'Pensionato', w: 2, spd: 0.65, stay: 1.5, act: 'news', h: [7, 18], old: 1 },
  lettore: { n: 'Lettore', w: 2, stay: 1.7, act: 'book' },
  nottambulo: { n: 'Nottambulo', w: 3, act: 'phone', h: [21.5, 26] },
  artista: { n: 'Artista', w: 1, stay: 1.5, act: 'sketch' },
  musicista: { n: 'Musicista', w: 0.5, stay: 1.4, act: 'guitar' },
  influencer: { n: 'Influencer', w: 0.5, act: 'camera', tip: 1.5 },
  critico: { n: 'Critico', w: 0, act: 'news' }
};
