// Icone in pixel art per l'interfaccia: ogni miglioramento, ogni scheda, frecce e stelline,
// il cursore a tazzina, il chicco di caffè dei cursori del volume. Tutto disegnato qui, niente immagini esterne.

const PXU = {
  tables: {
    p: { w: '#c98a4a', d: '#8a5a3a' },
    r: ['..........', '..........', '.wwwwwwww.', '.dddddddd.', '..d....d..', '..d....d..', '..d....d..', '.dd....dd.']
  },
  space: {
    p: { a: '#4ff0ff', k: '#b9a3cf' },
    r: ['k........k', 'k..a..a..k', 'k.aa..aa.k', 'kaaaaaaaak', 'kaaaaaaaak', 'k.aa..aa.k', 'k..a..a..k', 'k........k']
  },
  chairs: {
    p: { r: '#c94f7c', R: '#ff6fa0', d: '#5a3a28' },
    r: ['..rrrrrr..', '..rRRRRr..', '..rRRRRr..', '.rrrrrrrr.', '.rRRRRRRr.', '.rrrrrrrr.', '.d......d.', '.d......d.']
  },
  neon: {
    p: { p: '#ff4fa3', c: '#4ff0ff', k: '#6a5a7a' },
    r: ['pppppppppp', 'p........p', 'p.cc.c.c.p', 'p.c..cc.cp', 'p.cc.c.ccp', 'p........p', 'pppppppppp', '...k..k...']
  },
  wifi: { p: { c: '#4ff0ff', d: '#2a8a9a' }, r: ['..cccccc..', '.c......c.', 'c..dddd..c', '..d....d..', '....cc....', '....cc....'] },
  decor: {
    p: { g: '#7bd389', G: '#3a8a4a', t: '#c96a3a', T: '#e08a4a' },
    r: ['...g..g...', '..ggggg...', '.gg.gg.gg.', '..ggGgg...', '...gGg....', '....G.....', '..tttttt..', '..tTTTTt..', '...tttt...']
  },
  music: {
    p: { k: '#1b1420', K: '#4a3a5a', p: '#ff4fa3', w: '#fffaf2' },
    r: [
      '...kkkk...',
      '.kkkkkkkk.',
      '.kkKKKKkk.',
      'kkKkppkKkk',
      'kkKpwwpKkk',
      'kkKpwwpKkk',
      'kkKkppkKkk',
      '.kkKKKKkk.',
      '.kkkkkkkk.',
      '...kkkk...'
    ]
  },
  stove: {
    p: { d: '#6a6a7a', k: '#1b1420', o: '#ff7a30', y: '#ffd166' },
    r: ['....dd....', '....dd....', '.dddddddd.', '.dkkkkkkd.', '.dkoyyokd.', '.dkoyyokd.', '.dkkookkd.', '.dddddddd.', '.d......d.']
  },
  umbr: {
    p: { r: '#e63946', R: '#ff8a8a', k: '#9a9aaa' },
    r: ['....r.....', '..rrrrr...', '.rrRrrRr..', 'rrrrrrrrr.', 'r..r.r..r.', '....k.....', '....k.....', '....k..k..', '.....kk...']
  },
  cat: {
    p: { o: '#e8a060', g: '#2b2d42', p: '#ff9ec4' },
    r: ['.o....o...', '.oo..oo...', '.oooooo...', '.ogoogo...', '.oooooo...', '..oppo....', '.oooooo..o', '.oooooooo.', '.oooooo...']
  },
  barista: {
    p: { h: '#5a3a28', s: '#eab88f', g: '#1b1420', w: '#f4f1de', b: '#2b2d42' },
    r: ['...hhhh...', '..hhhhhh..', '..hssssh..', '..sgssgs..', '...ssss...', '..wwwwww..', '.wwbbbbww.', '.ss.bb.ss.', '....bb....']
  },
  waiter: {
    p: { s: '#b9a3cf', w: '#f4f1de', k: '#c0c0d0', K: '#8a8aa0' },
    r: ['....s.s...', '.....s....', '...wwww...', '...wwwwk..', '...wwwwk..', '...wwww...', 'kkkkkkkkkk', '.KKKKKKKK.']
  },
  cook: {
    p: { w: '#ffffff', W: '#d8d8e8' },
    r: ['..wwwwww..', '.wwwwwwww.', 'wwwwwwwwww', 'wwwwwwwwww', '.wwwwwwww.', '..wWWWWw..', '..wWWWWw..', '..wwwwww..']
  },
  manager: {
    p: { d: '#8a5a3a', k: '#2b2d42', w: '#f4f1de' },
    r: ['...kkkk...', '..dkkkkd..', '.dddddddd.', '.dwwwwwwd.', '.dwkkwwwd.', '.dwwwwwwd.', '.dwkkkkwd.', '.dwwwwwwd.', '.dddddddd.']
  },
  grinder: {
    p: { k: '#6a6a7a', b: '#8a5a3a', B: '#c98a4a', c: '#3a2418', w: '#4a4a5a' },
    r: ['....kk....', '..kkkkkk..', '....kk....', '..bbbbbb..', '..bBBBBb..', '..bBccBb..', '..bbbbbb..', '..wwwwww..', '.wwwwwwww.']
  },
  machine: {
    p: { k: '#c0c0d0', K: '#8a8aa0', s: '#ff4fa3', c: '#3a2418', w: '#f4f1de' },
    r: ['.kkkkkkkk.', '.kssssssk.', '.kkkkkkkk.', '.kKKkkKKk.', '.k..KK..k.', '.k..cc..k.', '.k..ww..k.', '.kkkkkkkk.', 'KKKKKKKKKK']
  },
  menu: {
    p: { p: '#c94f7c', w: '#f4f1de', k: '#5a3a28' },
    r: ['.pppppppp.', '.pwwwwwwp.', '.pwkkkkwp.', '.pwwwwwwp.', '.pwkkwkwp.', '.pwkkwkwp.', '.pwwwwwwp.', '.pwkkkkwp.', '.pppppppp.']
  },
  vetrina: {
    p: { c: '#4ff0ff', p: '#ff6fa0', w: '#fff3d0', j: '#c94f7c', o: '#e0a050', d: '#8a5a3a' },
    r: ['.cccccccc.', 'c........c', 'c.pp..oo.c', 'c.ww..oo.c', 'c.jj.....c', 'cccccccccc', '.dddddddd.', '.d......d.']
  },
  lav: {
    p: { d: '#8a5a3a', k: '#2a3a2a', w: '#f4f1de' },
    r: ['dddddddddd', 'dkkkkkkkkd', 'dkwwkwwkkd', 'dkkkkkkkkd', 'dkwkwwwkkd', 'dkkkkkkkkd', 'dddddddddd', '..d....d..', '.d......d.']
  }
};
// icone delle schede dei pannelli
const PXT = {
  Locale: {
    p: { r: '#ff4fa3', w: '#f4f1de', d: '#8a5a3a', y: '#ffd166' },
    r: ['....rr....', '...rrrr...', '..rrrrrr..', '.rrrrrrrr.', '..wwwwww..', '..wyywdw..', '..wyywdw..', '..wwwwdw..']
  },
  Arredo: PXU.decor,
  Staff: PXU.barista,
  Menu: PXU.menu,
  Stili: {
    p: { b: '#c98a4a', k: '#9a9aaa', p: '#ff4fa3', c: '#4ff0ff', y: '#ffd166' },
    r: ['........pp', '.......ppc', '......pcc.', '.....kcc..', '....kk....', '...bb.....', '..bb......', '.yb.......', 'yy........']
  },
  Franchising: {
    p: { b: '#4ff0ff', d: '#2a6a8a', y: '#ffd166' },
    r: ['...bb.....', '...bb.dd..', '.bbbb.dd..', '.bybb.dddd', '.bbbb.dydd', '.bybb.dddd', '.bbbb.dydd', '.bbbb.dddd']
  },
  Storie: {
    p: { b: '#c94f7c', w: '#f4f1de', k: '#8a6a9a' },
    r: ['.bbbbbbbb.', '.bwwwwwwb.', '.bwkkkkwb.', '.bwwwwwwb.', '.bwkkkwwb.', '.bwwwwwwb.', '.bbbbbbbb.', '..b....b..']
  },
  Vite: {
    p: { r: '#ff4fa3', R: '#ffb3d1' },
    r: ['.rr...rr..', 'rRrr.rrrr.', 'rRrrrrrrr.', 'rrrrrrrrr.', '.rrrrrrr..', '..rrrrr...', '...rrr....', '....r.....']
  },
  Habitué: {
    p: { w: '#f4f1de', c: '#5a3020', s: '#b9a3cf', p: '#ff4fa3' },
    r: ['..s.s.....', '...s......', '.wwwwww...', '.wccccwww.', '.wwwwwww.w', '.wppppwww.', '.wwwwww...', 'ssssssss..']
  },
  Legami: { p: { r: '#ff4fa3', y: '#ffd166' }, r: ['rr.rr.....', 'rrrrr.....', '.rrr.yy.yy', '..r..yyyyy', '......yyy.', '.......y..'] },
  Recensioni: {
    p: { y: '#ffd166', o: '#e0a040' },
    r: ['....y.....', '....y.....', '...yyy....', 'yyyyyyyyy.', '.yyyyyyy..', '..yyyyy...', '..yy.yy...', '.yo...oy..']
  },
  Gocce: {
    p: { b: '#7ec8ff', w: '#f4f1de', d: '#3a86ff' },
    r: ['....b.....', '...bbb....', '..bbbbb...', '.bbwbbbb..', '.bwbbbbb..', '.bbbbbbd..', '..bbbbd...', '...ddd....']
  },
  Giornale: {
    p: { w: '#f4f1de', k: '#2b2d42', g: '#9a9aa8' },
    r: ['wwwwwwwww.', 'wkkkkkkkw.', 'wwwwwwwwwg', 'wkkkw.ggwg', 'wkkkw.ggwg', 'wwwww.ggwg', 'wgggggggwg', 'wwwwwwwww.']
  },
  Segreti: {
    p: { y: '#ffd166', o: '#c9922a' },
    r: ['..yyy.....', '.y...y....', '.y...y....', '..yyy.....', '...y......', '...yyy....', '...y......', '...yy.....']
  }
};
const UPI = {};
for (const k in PXU) UPI[k] = pxSvg(PXU[k].r, PXU[k].p, 'up');
const TABI = {};
for (const k in PXT) TABI[k] = pxSvg(PXT[k].r, PXT[k].p, 'tab');
// frecce e stellina, al posto dei caratteri del browser
const PXA = {
  dx: ['#...', '##..', '###.', '##..', '#...'],
  sx: ['...#', '..##', '.###', '..##', '...#'],
  stella: ['..#..', '.###.', '#####', '.###.', '..#..']
};
PXI.frdx = PXA.dx;
PXI.frsx = PXA.sx;
ICO.dx = pxSvg(PXA.dx, 'currentColor', 'freccia');
ICO.sx = pxSvg(PXA.sx, 'currentColor', 'freccia');
ICO.stella = pxSvg(PXA.stella, '#ffd166', 'freccia');

// cursori: una tazzina (puntatore) e un chicco di caffè (sui pulsanti). Solo con il mouse.
const CURS = {
  tazza: {
    p: { k: '#1b1420', w: '#fffaf2', c: '#5a3020', p: '#ff4fa3' },
    r: [
      'k.........',
      'kk........',
      'kwk.......',
      'kwwk......',
      'kwwwk.....',
      'kwwwwk....',
      'kwwkkkk...',
      'kwk.......',
      'kk..kkkkk.',
      'k..kcccck.',
      '...kwwwwkk',
      '...kppppkk',
      '...kwwwwk.',
      '....kkkk..'
    ]
  },
  chicco: {
    p: { k: '#1b1420', b: '#8a5a3a', B: '#c98a4a', d: '#3a2418' },
    r: [
      'k.........',
      'kk........',
      'kBk.......',
      'kBBk......',
      'kBBBk.....',
      'kBkkk.....',
      'kk.kbbbk..',
      '..kbBdbbk.',
      '..kbbdbbk.',
      '..kbbdBbk.',
      '...kbdbk..',
      '....kkk...'
    ]
  }
};
function pxPng(rows, pal, scale) {
  const h = rows.length,
    w = Math.max(...rows.map(r => r.length)),
    c = document.createElement('canvas');
  c.width = w * scale;
  c.height = h * scale;
  const x = c.getContext('2d');
  rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '.' || ch === ' ') continue;
      x.fillStyle = pal[ch];
      x.fillRect(i * scale, j * scale, scale, scale);
    }
  });
  return c.toDataURL();
}
function temaCursori() {
  try {
    const s = document.documentElement.style;
    s.setProperty('--cur', `url(${pxPng(CURS.tazza.r, CURS.tazza.p, 2)}) 0 0, auto`);
    s.setProperty('--cur2', `url(${pxPng(CURS.chicco.r, CURS.chicco.p, 2)}) 0 0, pointer`);
    // il chicco di caffè dei cursori del volume
    const bean = pxSvg(['..kkkk..', '.kbbBBk.', 'kbbdBBBk', 'kbbdbBBk', 'kbbdbbBk', 'kbbdbbbk', '.kbdbbk.', '..kkkk..'], {
      k: '#1b1420',
      b: '#8a5a3a',
      B: '#c98a4a',
      d: '#3a2418'
    }).replace('aria-hidden="true"', 'xmlns="http://www.w3.org/2000/svg"');
    s.setProperty('--bean', `url("data:image/svg+xml,${encodeURIComponent(bean)}")`);
  } catch (e) {}
}
temaCursori();
// la moneta: oro, con un chicco di caffè inciso
(function () {
  try {
    const coin = pxSvg(
      ['..yyyyy..', '.yYYYYYy.', 'yYYoooYYy', 'yYoYdYoYy', 'yYoYdYoYy', 'yYoYdYoYy', 'yYYoooYYy', '.yYYYYYy.', '..yyyyy..'],
      {
        y: '#c9902a',
        Y: '#ffd166',
        o: '#e8b040',
        d: '#8a5a1a'
      }
    ).replace('aria-hidden="true"', 'xmlns="http://www.w3.org/2000/svg"');
    document.documentElement.style.setProperty('--coin', `url("data:image/svg+xml,${encodeURIComponent(coin)}")`);
  } catch (e) {}
})();
// un'iconcina davanti agli avvisi, secondo di cosa parlano (in italiano e in inglese)
const TOASTI = [
  [/compleann|auguri|birthday/i, 'cake'],
  [/ora di punta|rush hour/i, 'bell'],
  [/segret|secret/i, 'key'],
  [/habitué|regular/i, 'cup'],
  [/capitol|diario|storia|racconta|chapter|diary|story/i, 'book'],
  [/giorno \d|^day \d|primavera|estate|autunno|inverno|spring|summer|autumn|winter|anno|year/i, 'cal'],
  [/anniversari|innamor|coppia|insieme|couple|together|love/i, 'love']
];
const TOASTP = {
  cake: {
    p: { w: '#fff3d0', p: '#ff6fa0', y: '#ffd166', j: '#c94f7c' },
    r: ['...y...', '...p...', '.wwwww.', '.ppppp.', '.wwwww.', '.jjjjj.']
  },
  bell: { p: { y: '#ffd166', o: '#c9902a' }, r: ['...y...', '..yyy..', '.yyyyy.', '.yyyyy.', 'yyyyyyy', '...o...'] },
  key: PXT.Segreti,
  cup: PXT.Habitué,
  book: PXT.Storie,
  cal: {
    p: { r: '#ff4fa3', w: '#f4f1de', k: '#5a3a6a' },
    r: ['.r...r.', 'rrrrrrr', 'wwwwwww', 'wkwkwkw', 'wwwwwww', 'wkwkwww', 'wwwwwww']
  },
  love: PXT.Vite
};
function toastIco(t) {
  if (/♥/.test(t)) return '';
  const m = TOASTI.find(([re]) => re.test(t));
  return m ? pxSvg(TOASTP[m[1]].r, TOASTP[m[1]].p, 'tico') : '';
}
