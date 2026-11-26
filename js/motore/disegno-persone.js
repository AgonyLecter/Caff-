// Disegno dei personaggi in pixel art.

const DK = '#1b1420';
// Personaggi "chibi": testa grande e tonda, due occhi, guanciotte, capelli con riflesso.
// Le coordinate di testa e capelli sono locali (testa 8x7, faccia rivolta a destra) e vengono specchiate quando guardano a sinistra.
let HX = 0,
  HY = 0,
  HF = 1;
function hp(c, r, w, h) {
  g.fillRect(HF > 0 ? HX + c : HX + 8 - c - w, HY + r, w, h);
}
function drawHair(L) {
  const H = L.h,
    hi = shade(H, 1.35),
    lo = shade(H, 0.72),
    hc = L.hc || '#e63946',
    cap = () => {
      g.fillStyle = H;
      hp(1, -2, 6, 1);
      hp(0, -1, 8, 2);
      hp(0, 1, 2, 2);
      g.fillStyle = lo;
      hp(0, 2, 1, 1);
      g.fillStyle = hi;
      hp(3, -2, 2, 1);
      hp(2, -1, 1, 1);
    };
  switch (L.hs) {
    case 0:
      cap();
      g.fillStyle = H;
      hp(5, 1, 2, 1);
      break; // corti
    case 1:
      cap();
      g.fillStyle = H;
      hp(-1, 0, 3, 9);
      hp(6, 1, 1, 1);
      g.fillStyle = lo;
      hp(-1, 6, 2, 3);
      break; // lunghi
    case 2:
      cap();
      g.fillStyle = H;
      hp(-3, 0, 3, 2);
      hp(-3, 2, 2, 4);
      g.fillStyle = lo;
      hp(-3, 5, 1, 1);
      g.fillStyle = L.ac || '#ff4fa3';
      hp(-1, 0, 1, 2);
      break; // coda
    case 3:
      cap();
      g.fillStyle = H;
      hp(-1, -4, 4, 3);
      hp(0, -5, 2, 1);
      g.fillStyle = hi;
      hp(0, -4, 1, 1);
      break; // chignon
    case 4:
      g.fillStyle = H;
      hp(-1, -3, 10, 4);
      hp(0, -4, 8, 1);
      hp(-1, 1, 2, 4);
      hp(8, 1, 1, 1);
      g.fillStyle = hi;
      [
        [1, -3],
        [4, -4],
        [6, -2],
        [2, -1],
        [-1, 2]
      ].forEach(p => hp(p[0], p[1], 1, 1));
      g.fillStyle = lo;
      [
        [0, 0],
        [3, -2],
        [7, 0],
        [0, 4]
      ].forEach(p => hp(p[0], p[1], 1, 1));
      break; // ricci
    case 5:
      g.fillStyle = H;
      hp(0, 1, 1, 4);
      hp(1, 0, 1, 2);
      hp(1, -1, 2, 1);
      g.fillStyle = lo;
      hp(0, 4, 1, 1);
      break; // pochi capelli
    case 6:
      cap();
      g.fillStyle = H;
      hp(-1, 0, 2, 6);
      hp(5, 0, 3, 1);
      hp(7, 1, 1, 1);
      g.fillStyle = lo;
      hp(-1, 5, 2, 1);
      break; // caschetto
    case 7:
      cap();
      g.fillStyle = H;
      hp(1, -4, 1, 2);
      hp(3, -5, 1, 3);
      hp(5, -4, 1, 2);
      hp(6, -3, 2, 1);
      g.fillStyle = hi;
      hp(3, -5, 1, 1);
      break; // a punte
    case 8:
      g.fillStyle = H;
      hp(0, 1, 2, 2);
      g.fillStyle = hc;
      hp(0, -2, 8, 3);
      hp(1, -3, 6, 1);
      hp(7, 0, 3, 1);
      g.fillStyle = shade(hc, 1.3);
      hp(2, -3, 2, 1);
      g.fillStyle = shade(hc, 0.7);
      hp(0, 0, 7, 1);
      break; // cappellino
    case 9:
      g.fillStyle = H;
      hp(0, 1, 2, 2);
      hp(6, 1, 1, 1);
      g.fillStyle = hc;
      hp(0, -3, 8, 3);
      hp(1, -4, 6, 1);
      g.fillStyle = shade(hc, 1.3);
      hp(0, -1, 8, 1);
      g.fillStyle = '#f4f1de';
      hp(3, -6, 2, 2);
      break; // berretto col pon pon
    case 10:
      cap();
      g.fillStyle = H;
      hp(-1, -4, 3, 3);
      hp(5, -4, 3, 3);
      g.fillStyle = hi;
      hp(-1, -4, 1, 1);
      hp(5, -4, 1, 1);
      g.fillStyle = L.ac || '#ff4fa3';
      hp(1, -2, 1, 1);
      hp(5, -2, 1, 1);
      break; // due chignon
    case 11:
      cap();
      g.fillStyle = H;
      hp(-2, 1, 2, 5);
      hp(-3, 4, 2, 3);
      g.fillStyle = L.ac || '#ff4fa3';
      hp(-1, 1, 1, 1);
      g.fillStyle = lo;
      hp(-3, 6, 1, 1);
      break; // codini
    case 12:
      cap();
      g.fillStyle = hc;
      hp(-1, -3, 9, 2);
      hp(0, -4, 6, 1);
      hp(3, -5, 1, 1);
      g.fillStyle = shade(hc, 1.3);
      hp(1, -4, 2, 1);
      break; // basco
    case 13:
      cap();
      g.fillStyle = H;
      hp(-1, 0, 3, 8);
      hp(-2, 4, 2, 5);
      hp(6, 1, 1, 2);
      g.fillStyle = lo;
      hp(-2, 7, 2, 2);
      g.fillStyle = '#ff9fc8';
      hp(1, -1, 2, 2);
      g.fillStyle = '#ffd166';
      hp(1, -1, 1, 1);
      break; // lunghi mossi con fiore
    case 14:
      cap();
      g.fillStyle = L.ac || '#ff4fa3';
      hp(1, -4, 2, 2);
      hp(4, -4, 2, 2);
      hp(3, -3, 1, 1);
      g.fillStyle = shade(L.ac || '#ff4fa3', 1.3);
      hp(1, -4, 1, 1);
      break; // fiocco
  }
}
function drawEmote(x, y, k) {
  // nuvoletta bianca con icona
  g.fillStyle = 'rgba(27,20,32,.35)';
  g.fillRect(x - 3, y + 1, 9, 7);
  g.fillStyle = '#fffaf2';
  g.fillRect(x - 3, y - 1, 9, 7);
  g.fillRect(x - 2, y - 2, 7, 9);
  g.fillRect(x, y + 7, 2, 1);
  g.fillRect(x + 1, y + 8, 1, 1);
  const P = (c, a) => {
    g.fillStyle = c;
    a.forEach(p => g.fillRect(x + p[0], y + p[1], 1, 1));
  };
  if (k === 'heart')
    P('#ff4fa3', [
      [0, 1],
      [1, 0],
      [3, 0],
      [4, 1],
      [0, 2],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [2, 4]
    ]);
  else if (k === 'angry')
    P('#ff3b3b', [
      [0, 0],
      [1, 1],
      [3, 1],
      [4, 0],
      [1, 3],
      [0, 4],
      [3, 3],
      [4, 4],
      [2, 2]
    ]);
  else if (k === 'sweat')
    P('#4fb8ff', [
      [2, 0],
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [2, 4]
    ]);
  else if (k === 'star')
    P('#ffc43d', [
      [2, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [1, 3],
      [3, 3],
      [0, 4],
      [4, 4]
    ]);
  else if (k === 'note')
    P('#2ac0d8', [
      [2, 0],
      [3, 0],
      [4, 1],
      [2, 1],
      [2, 2],
      [2, 3],
      [1, 3],
      [0, 4],
      [1, 4]
    ]);
  else if (k === 'laugh')
    P('#ffb020', [
      [0, 1],
      [1, 0],
      [3, 0],
      [4, 1],
      [1, 3],
      [2, 4],
      [3, 3],
      [2, 3]
    ]);
  else if (k === 'n_zucchero') {
    P('#ffffff', [
      [0, 2],
      [1, 2],
      [0, 3],
      [1, 3],
      [3, 2],
      [4, 2],
      [3, 3],
      [4, 3],
      [1, 0],
      [2, 0],
      [3, 0],
      [2, 1]
    ]);
    P('#8ab8ff', [
      [0, 4],
      [1, 4],
      [3, 4],
      [4, 4]
    ]);
  } else if (k === 'n_coperta') {
    P('#ff6f9f', [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4]
    ]);
    P('#ffd166', [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 3]
    ]);
  } else if (k === 'n_wifi')
    P('#2ac0d8', [
      [0, 1],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 1],
      [1, 2],
      [2, 2 - 0],
      [3, 2],
      [2, 4]
    ]);
  else if (k === 'n_acqua') {
    P('#8ab8ff', [
      [0, 0],
      [4, 0],
      [0, 1],
      [4, 1],
      [0, 2],
      [4, 2],
      [1, 4],
      [2, 4],
      [3, 4],
      [0, 3],
      [4, 3]
    ]);
    P('#4fb8ff', [
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3]
    ]);
  } else if (k === 'n_presa') {
    P('#3a2448', [
      [1, 0],
      [3, 0],
      [1, 1],
      [3, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [2, 4]
    ]);
    P('#ffd166', [[2, 1]]);
  } else if (k === 'n_giornale') {
    P('#c9b8dc', [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 4],
      [0, 1],
      [0, 2],
      [0, 3],
      [4, 1],
      [4, 2],
      [4, 3]
    ]);
    P('#3a2448', [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [3, 3],
      [1, 3],
      [2, 3]
    ]);
  } else if (k === 'n_ciotola') {
    P('#e63946', [
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 3],
      [4, 2],
      [1, 4],
      [2, 4],
      [3, 4]
    ]);
    P('#4fb8ff', [
      [1, 2],
      [2, 2],
      [3, 2],
      [2, 0],
      [2, 1]
    ]);
  } else if (k === 'n_tovagliolo') {
    P('#ffffff', [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [0, 3]
    ]);
    P('#c9b8dc', [
      [3, 1],
      [2, 2],
      [1, 3],
      [0, 4]
    ]);
  } else if (k === 'zzz')
    P('#8a7aaa', [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 3],
      [4, 3],
      [4, 4],
      [3, 4]
    ]);
}
function drawPerson(c) {
  const L = c.look,
    f = c.face || 1,
    sit = c.state === 'sit',
    A = L.a || '';
  const x = Math.round(c.x),
    y = Math.round(c.y),
    tl = L.tl || 0,
    ph = c.moving ? Math.floor(c.wt * 9) % 4 : 0,
    bob = c.moving && ph % 2 ? 1 : 0;
  g.fillStyle = 'rgba(0,0,0,.28)';
  g.fillRect(x - 4, y, 9, 1);
  g.fillRect(x - 3, y + 1, 7, 1);
  const legC = L.o === 3 ? L.s : L.c2,
    shoe = L.sh || shade(L.c2, 0.45);
  let wy;
  if (sit) {
    wy = y - 7;
    g.fillStyle = L.o === 3 ? L.c1 : L.c2;
    g.fillRect(f > 0 ? x - 2 : x - 3, wy, 6, 2);
    g.fillStyle = legC;
    g.fillRect(f > 0 ? x + 2 : x - 3, wy + 2, 2, 3);
    g.fillStyle = shoe;
    g.fillRect(f > 0 ? x + 2 : x - 4, wy + 5, 3, 1);
  } else {
    wy = y - 5 - tl;
    const lh = 5 + tl,
      o1 = ph === 1 ? f : ph === 3 ? -f : 0,
      lift = ph % 2 ? 1 : 0;
    g.fillStyle = legC;
    g.fillRect(x - 2 - o1, wy, 2, lh);
    g.fillRect(x + 1 + o1, wy, 2, lh - lift);
    g.fillStyle = shoe;
    g.fillRect(x - 2 - o1 - (f < 0 ? 1 : 0), wy + lh - 1, 3, 1);
    g.fillRect(x + 1 + o1 - (f < 0 ? 1 : 0), wy + lh - 1 - lift, 3, 1);
  }
  const ty = wy - 6 - bob;
  // busto arrotondato con ombra sul lato della schiena
  g.fillStyle = L.c1;
  g.fillRect(x - 3, ty + 1, 7, 5);
  g.fillRect(x - 2, ty, 5, 1);
  g.fillStyle = shade(L.c1, 0.82);
  g.fillRect(f > 0 ? x - 3 : x + 3, ty + 1, 1, 5);
  g.fillStyle = shade(L.c1, 1.15);
  g.fillRect(f > 0 ? x + 1 : x - 2, ty, 2, 1);
  switch (L.o) {
    case 1:
      g.fillStyle = shade(L.c1, 0.78);
      g.fillRect(f > 0 ? x - 3 : x + 2, ty - 1, 2, 3);
      g.fillRect(x - 2, ty + 4, 5, 1);
      break; // felpa con cappuccio
    case 2:
      g.fillStyle = L.c1;
      if (!sit) g.fillRect(x - 3, wy, 7, 2);
      g.fillStyle = shade(L.c1, 0.68);
      g.fillRect(x, ty + 1, 1, 5);
      g.fillStyle = '#f4f1de';
      g.fillRect(x - 1, ty, 3, 1);
      break; // cappotto
    case 3:
      g.fillStyle = L.c1;
      if (!sit) {
        g.fillRect(x - 4, wy, 9, 2);
        g.fillStyle = shade(L.c1, 0.8);
        g.fillRect(x - 4, wy + 1, 9, 1);
      }
      g.fillStyle = '#f4f1de';
      g.fillRect(f > 0 ? x + 1 : x - 1, ty + 1, 1, 1);
      break; // vestito
    case 4:
      g.fillStyle = '#f4f1de';
      g.fillRect(f > 0 ? x + 1 : x - 1, ty, 2, 2);
      g.fillStyle = L.ac || L.c2;
      g.fillRect(f > 0 ? x + 1 : x, ty + 1, 1, 3);
      break; // camicia e cravatta
    default:
      g.fillStyle = shade(L.c1, 1.25);
      g.fillRect(x - 1, ty + 2, 3, 1); // maglietta con righina
  }
  if (A.includes('grembiule')) {
    g.fillStyle = '#3a2b55';
    g.fillRect(x - 2, ty + 2, 5, 4);
    if (!sit) g.fillRect(x - 2, wy, 5, 2);
    g.fillStyle = '#ff4fa3';
    g.fillRect(x, ty + 3, 1, 1);
  }
  if (A.includes('gilet')) {
    g.fillStyle = DK;
    g.fillRect(x - 3, ty + 1, 2, 5);
    g.fillRect(x + 2, ty + 1, 2, 5);
    g.fillStyle = '#e63946';
    g.fillRect(x, ty, 1, 1);
  }
  if (A.includes('farfallino')) {
    g.fillStyle = L.ac || '#e63946';
    g.fillRect(x - 1, ty, 3, 1);
    g.fillRect(x, ty + 1, 1, 1);
  }
  if (A.includes('sciarpa')) {
    g.fillStyle = L.ac || '#e63946';
    g.fillRect(x - 3, ty, 7, 2);
    g.fillRect(f > 0 ? x - 3 : x + 2, ty + 2, 2, 3);
    g.fillStyle = shade(L.ac || '#e63946', 0.75);
    g.fillRect(f > 0 ? x - 3 : x + 3, ty + 4, 1, 1);
  }
  // testa tonda
  const sleep = c.sleep,
    dz = sleep ? 1 : 0;
  HF = f;
  HX = f > 0 ? x - 3 : x - 4;
  HY = ty - 7 + dz;
  const sk = L.s,
    sd = shade(sk, 0.84);
  g.fillStyle = sk;
  hp(1, 0, 6, 7);
  hp(0, 1, 8, 5);
  g.fillStyle = sd;
  hp(0, 4, 1, 1);
  hp(1, 6, 6, 1);
  hp(0, 1, 1, 3);
  if (A.includes('cuffie')) {
    g.fillStyle = '#2a2238';
    hp(1, -2, 6, 1);
  }
  drawHair(L);
  // faccia: occhi, guanciotte, bocca
  const blink = (c.id * 7 + Math.floor(T * 2)) % 17 === 0,
    love = (c.emo && c.emo.k === 'heart') || (c.scene && c.scene.mood === 'love'),
    happy = c.mood > 72 || love || c.state === 'perf';
  g.fillStyle = DK;
  if (sleep || blink) {
    hp(3, 4, 2, 1);
    hp(6, 4, 1, 1);
  } else {
    hp(3, 3, 1, 2);
    hp(6, 3, 1, 2);
    g.fillStyle = '#ffffff';
    hp(3, 3, 1, 1);
    hp(6, 3, 1, 1);
    g.fillStyle = DK;
    hp(3, 4, 1, 1);
    hp(6, 4, 1, 1);
  }
  g.fillStyle = love ? '#ff6f9f' : 'rgba(255,120,150,.55)';
  hp(2, 5, 1, 1);
  hp(7, 5, 1, 1);
  if (A.includes('lentiggini')) {
    g.fillStyle = shade(sk, 0.7);
    hp(2, 4, 1, 1);
    hp(7, 4, 1, 1);
  }
  if (happy && !sleep) {
    g.fillStyle = A.includes('rossetto') ? '#d6245a' : shade(sk, 0.5);
    hp(4, 5, 2, 1);
  } else if (A.includes('rossetto')) {
    g.fillStyle = '#d6245a';
    hp(5, 5, 1, 1);
  }
  if (A.includes('occhiali')) {
    g.fillStyle = '#2a2238';
    hp(2, 2, 3, 1);
    hp(5, 2, 3, 1);
    hp(2, 3, 1, 1);
    hp(4, 3, 2, 1);
    hp(7, 3, 1, 1);
    hp(0, 3, 2, 1);
  }
  if (A.includes('barba')) {
    g.fillStyle = L.h;
    hp(2, 6, 6, 1);
    hp(3, 7, 4, 1);
    hp(1, 4, 1, 2);
    g.fillStyle = shade(L.h, 1.3);
    hp(4, 7, 1, 1);
  }
  if (A.includes('cuffie')) {
    g.fillStyle = L.ac || '#ff4fa3';
    hp(0, 2, 2, 3);
    g.fillStyle = shade(L.ac || '#ff4fa3', 1.3);
    hp(0, 2, 1, 1);
  }
  if (A.includes('orecchino')) {
    g.fillStyle = '#ffd166';
    hp(1, 5, 1, 1);
  }
  if (A.includes('fiore') && L.hs !== 13) {
    g.fillStyle = '#ff9fc8';
    hp(1, -1, 2, 2);
    g.fillStyle = '#ffd166';
    hp(1, -1, 1, 1);
  }
  if (A.includes('infermiera')) {
    g.fillStyle = '#fffaf2';
    hp(1, -3, 6, 2);
    hp(2, -4, 4, 1);
    g.fillStyle = '#e63946';
    hp(3, -3, 2, 1);
  }
  if (A.includes('cappello')) {
    g.fillStyle = L.hc || '#3d3a50';
    hp(-1, -2, 10, 1);
    hp(1, -5, 6, 3);
    g.fillStyle = L.ac || '#c9a227';
    hp(1, -3, 6, 1);
  }
  if (A.includes('cuoco')) {
    g.fillStyle = '#fffaf2';
    hp(1, -2, 6, 1);
    hp(0, -5, 8, 3);
    hp(1, -6, 6, 1);
    g.fillStyle = '#e8e0d0';
    hp(0, -3, 8, 1);
  }
  if (c.pet && c.pet.k === 'uccellino') drawBird(c, f > 0 ? x - 2 : x + 2, ty);
  // braccio e oggetti
  const ax = f > 0 ? x : x - 1,
    ey = HY;
  if (c.state === 'perf') {
    g.fillStyle = shade(L.c1, 0.75);
    g.fillRect(ax + f, ty + 1, 2, 3);
    g.fillStyle = '#555';
    g.fillRect(x + f * 4, ty - 2, 1, 14);
    g.fillStyle = '#222';
    g.fillRect(x + f * 4 - 1, ty - 3, 3, 2);
  } else if (sit && c.sip > 0 && c.act !== 'laptop' && c.act !== 'guitar' && c.act !== 'knit') {
    g.fillStyle = shade(L.c1, 0.75);
    g.fillRect(ax, ty + 1, 2, 2);
    g.fillRect(f > 0 ? x + 3 : x - 4, ey + 5, 2, 2);
    g.fillStyle = '#fffaf2';
    g.fillRect(f > 0 ? x + 5 : x - 6, ey + 4, 2, 3);
    g.fillStyle = '#ff9fc8';
    g.fillRect(f > 0 ? x + 5 : x - 6, ey + 5, 2, 1);
  } else {
    const sw = c.moving ? (ph === 1 ? f : ph === 3 ? -f : 0) : 0;
    g.fillStyle = shade(L.c1, 0.75);
    g.fillRect(ax + sw, ty + 1, 2, sit ? 3 : 4);
    g.fillStyle = L.s;
    g.fillRect(ax + sw + (f > 0 ? 1 : 0), ty + (sit ? 4 : 5), 1, 1);
  }
  if (sit && !sleep) {
    const px = x + f * 3;
    if (c.act === 'book') {
      const bc = L.ac || '#e63946';
      g.fillStyle = bc;
      g.fillRect(px - 1, ty + 1, 4, 4);
      g.fillStyle = '#fffaf2';
      g.fillRect(px, ty + 1, 2, 3);
      g.fillStyle = shade(bc, 0.7);
      g.fillRect(px + (f > 0 ? -1 : 2), ty + 1, 1, 4);
    } else if (c.act === 'phone') {
      g.fillStyle = '#2a2238';
      g.fillRect(px, ty, 2, 4);
      g.fillStyle = nightF() > 0.4 ? '#9ff' : '#b8c8ff';
      g.fillRect(px + (f > 0 ? 0 : 1), ty + 1, 1, 2);
    } else if (c.act === 'news') {
      g.fillStyle = '#ece6d6';
      g.fillRect(f > 0 ? x + 2 : x - 6, ty - 2, 5, 7);
      g.fillStyle = '#8a8090';
      g.fillRect(f > 0 ? x + 3 : x - 5, ty, 3, 1);
      g.fillRect(f > 0 ? x + 3 : x - 5, ty + 2, 3, 1);
      g.fillStyle = '#e63946';
      g.fillRect(f > 0 ? x + 3 : x - 5, ty - 1, 2, 1);
    } else if (c.act === 'sketch') {
      g.fillStyle = '#fffaf2';
      g.fillRect(px - 1, ty, 4, 5);
      g.fillStyle = '#ff4fa3';
      g.fillRect(px, ty + 1, 1, 1);
      g.fillStyle = '#4ff0ff';
      g.fillRect(px + 1, ty + 3, 1, 1);
      g.fillStyle = '#ffd166';
      g.fillRect(px + f * 3, ty - 1, 1, 3);
    } else if (c.act === 'guitar') {
      g.fillStyle = '#c0703a';
      g.fillRect(x - 2, wy - 3, 5, 3);
      g.fillStyle = '#5a3020';
      g.fillRect(x, wy - 2, 1, 1);
      g.fillStyle = '#7a4020';
      g.fillRect(x + f * 3, wy - 7, 1, 5);
      g.fillRect(x + f * 4, wy - 8, 1, 2);
    } else if (c.act === 'knit') {
      g.fillStyle = L.ac || '#ff9fc8';
      g.fillRect(px - 1, ty + 2, 4, 3);
      g.fillStyle = shade(L.ac || '#ff9fc8', 1.25);
      g.fillRect(px, ty + 3, 2, 1);
      g.fillStyle = '#d9b98a';
      g.fillRect(px - 2, ty + 1, 1, 3);
      g.fillRect(px + 3, ty + 1, 1, 3);
      if (Math.floor(T * 3) % 2) {
        g.fillStyle = L.ac || '#ff9fc8';
        g.fillRect(px + 1, ty + 5, 1, 2);
      }
    } else if (c.act === 'camera') {
      g.fillStyle = '#2a2238';
      g.fillRect(f > 0 ? x + 4 : x - 7, ey + 3, 4, 3);
      g.fillStyle = '#8ab8ff';
      g.fillRect(f > 0 ? x + 6 : x - 6, ey + 4, 1, 1);
      if (c.flash > 0) {
        g.fillStyle = '#fff';
        g.fillRect(f > 0 ? x + 8 : x - 9, ey + 2, 2, 2);
      }
    }
  }
  if (!sit && (c.umb > 0 || (c.umbOut && c.state === 'leave'))) {
    const ux = x + f * 2,
      uy = ey - 6,
      uc = L.uc || '#e63946';
    g.fillStyle = '#333';
    g.fillRect(ux, uy + 2, 1, ty - uy);
    g.fillStyle = uc;
    g.fillRect(ux - 5, uy, 11, 2);
    g.fillRect(ux - 4, uy - 1, 9, 1);
    g.fillRect(ux - 2, uy - 2, 5, 1);
    g.fillStyle = shade(uc, 1.3);
    g.fillRect(ux - 3, uy - 1, 2, 1);
    g.fillStyle = shade(uc, 0.7);
    g.fillRect(ux - 5, uy + 2, 1, 1);
    g.fillRect(ux - 1, uy + 2, 1, 1);
    g.fillRect(ux + 3, uy + 2, 1, 1);
    g.fillStyle = '#ffd166';
    g.fillRect(ux, uy - 3, 1, 1);
  }
  if (c.req && c.req.dl && c.state === 'order') {
    const f2 = clamp((c.req.dl - T) / c.req.len, 0, 1);
    g.fillStyle = '#120a20';
    g.fillRect(x - 6, ey - 13, 13, 3);
    g.fillStyle = f2 > 0.35 ? '#ffd166' : '#ff3b3b';
    g.fillRect(x - 5, ey - 12, Math.round(11 * f2), 1);
  }
  if (c.need && (c.need.t > 8 || Math.floor(T * 4) % 2))
    drawEmote(x - 2, ey - 13 - Math.round(Math.abs(Math.sin(T * 6)) * 2), 'n_' + c.need.k);
  else if (c.emo) drawEmote(x - 2, ey - 12 - Math.round(Math.abs(Math.sin(T * 5)) * 1.5), c.emo.k);
  else if (c.state === 'order' && c.order && !c.bub) {
    const by = y - 39 + Math.round(Math.sin(T * 3 + c.id));
    g.fillStyle = 'rgba(27,20,32,.3)';
    g.fillRect(x - 5, by + 2, 11, 9);
    g.fillStyle = '#fffaf2';
    g.fillRect(x - 5, by, 11, 9);
    g.fillRect(x - 4, by - 1, 9, 11);
    g.fillStyle = c.special ? '#ffd166' : '#e8dcf0';
    g.fillRect(x - 4, by + 10, 9, 1);
    g.fillStyle = '#fffaf2';
    g.fillRect(x - 1, by + 11, 2, 1);
    drawItem(c.order.id, x, by + 6);
  }
}
