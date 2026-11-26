// Comportamento degli animali da compagnia.

function randPet(type) {
  const k = wpick(Object.keys(PETC), x => ({ cane: type === 'nonno' ? 5 : 3, gatto: 2, uccellino: 1, coniglio: 1 })[x]);
  const cc = pick(PETC[k]);
  return { k, n: pick(PETN), c: cc[0], c2: cc[1], s: k === 'cane' && Math.random() < 0.35 ? 's' : '' };
}
function petOf(c) {
  if (c.reg && c.reg.petR === undefined) {
    c.reg.petR = 1;
    if (Math.random() < 0.2) c.reg.pet = randPet(c.reg.type);
  }
  const d = (c.reg && c.reg.pet) || (c.look && c.look.pet);
  if (!d) return null;
  return Object.assign({ x: c.x - 6, y: c.y, face: 1, wt: 0, moving: false, t: rnd(3, 8), mode: '', hop: 0, heart: 0 }, d);
}
function updPet(c, dt) {
  const p = c.pet;
  if (!p) return;
  if (p.emo) {
    p.emo.t -= dt;
    if (p.emo.t <= 0) p.emo = null;
  }
  if (p.k === 'uccellino') return;
  p.heart = Math.max(0, p.heart - dt);
  p.flee = Math.max(0, (p.flee || 0) - dt);
  let tx, ty;
  if (c.state === 'sit' && c.seat) {
    tx = c.seat.x + c.seat.side * 8;
    ty = c.seat.y + 2;
  } else {
    tx = c.x - (c.face || 1) * 7;
    ty = c.y + 1;
  }
  if (p.flee > 0) tx -= 16;
  const v = p.visit;
  if (v) {
    const b = v.to,
      q = b && b.pet;
    if (!q || b.dead || b.state !== 'sit' || c.state !== 'sit') {
      p.visit = null;
    } else {
      if (v.ph === 'go') {
        const sd = p.x < q.x ? -1 : 1;
        tx = q.x + sd * 7;
        ty = q.y;
        if (Math.hypot(tx - p.x, ty - p.y) < 1.5) {
          p.face = -sd;
          q.face = sd;
          petMeet(c, b);
        }
      } else if (v.ph === 'meet') {
        v.t -= dt;
        if (v.play) {
          const an = T * 4;
          tx = q.x + Math.cos(an) * 9;
          ty = q.y + Math.sin(an) * 3;
        } else {
          tx = p.x;
          ty = p.y;
          p.face = p.x < q.x ? 1 : -1;
          q.face = -p.face;
        }
        if (v.t <= 0) {
          p.visit = null;
          if (q.mode === 'sleep' || q.mode === 'groom') q.mode = '';
        }
      }
    }
  }
  const dx = tx - p.x,
    dy = ty - p.y,
    d = Math.hypot(dx, dy);
  p.moving = false;
  if (d > 1.2) {
    const sp = Math.max(30, (c.spd || 28) * 1.25) * (d > 20 ? 1.6 : 1),
      s = Math.min(d, sp * dt);
    p.x += (dx / d) * s;
    p.y += (dy / d) * s;
    if (Math.abs(dx) > 0.3) p.face = dx > 0 ? 1 : -1;
    p.moving = true;
    p.wt += dt;
    p.mode = '';
  } else {
    p.t -= dt;
    if (c.state === 'sit' && c.seat && !p.visit) p.face = -c.seat.side;
    if (p.t <= 0) {
      p.t = rnd(4, 9);
      p.mode = c.state === 'sit' ? pick(['', 'wag', 'sleep', 'sleep', 'groom']) : pick(['', 'wag']);
    }
    if (p.mode === 'sleep' && Math.random() < dt * 0.5) parts.push({ x: p.x + 2, y: p.y - 6, vx: 2, vy: -5, t: 2, max: 2, k: 'z' });
  }
  if (p.k === 'coniglio' && p.moving) p.hop = Math.abs(Math.sin(p.wt * 10)) * 2;
  else p.hop = 0;
}
function drawPet(p, c) {
  if (p.emo) drawEmote(Math.round(p.x) - 2 - p.face * 3, Math.round(p.y) - (p.k === 'coniglio' ? 21 : 18), p.emo.k);
  const f = p.face,
    x = Math.round(p.x),
    y = Math.round(p.y - p.hop),
    P = (dx, dy, w, h, col) => {
      g.fillStyle = col;
      g.fillRect(f > 0 ? x + dx : x - dx - w, y + dy, w, h);
    };
  const a = p.c,
    b = p.c2,
    step = p.moving ? Math.floor(p.wt * 10) % 2 : 0,
    sl = p.mode === 'sleep',
    wag = (p.mode === 'wag' || p.heart > 0 || (c && c.mood > 80)) && Math.floor(T * 8) % 2;
  g.fillStyle = 'rgba(0,0,0,.25)';
  g.fillRect(x - 4, Math.round(p.y), 9, 1);
  if (p.k === 'cane') {
    const sm = p.s === 's';
    if (sl) {
      P(-4, -3, 8, 2, a);
      P(2, -4, 4, 3, a);
      P(2, -4, 1, 3, b);
      P(4, -3, 1, 1, DK);
      P(5, -2, 1, 1, DK);
      P(-5, -2, 1, 1, b);
      return;
    }
    if (sm) {
      P(-5, -4, 9, 2, a);
      P(-5, -4, 9, 1, shade(a, 1.15));
      [-4, -2, 1, 3].forEach((lx, i) => P(lx, -2, 1, (i + step) % 2 ? 1 : 2, shade(a, 0.8)));
    } else {
      P(-4, -5, 7, 3, a);
      P(-4, -5, 7, 1, shade(a, 1.15));
      [-4, -2, 1, 2].forEach((lx, i) => P(lx, -2, 1, (i + step) % 2 ? 1 : 2, shade(a, 0.8)));
    }
    const hy = sm ? -7 : -8;
    P(2, hy, 4, 4, a);
    P(5, hy + 2, 2, 2, shade(a, 1.2));
    P(6, hy + 2, 1, 1, DK);
    P(2, hy, 1, 3, b);
    P(4, hy + 1, 1, 1, DK);
    P(3, hy + 3, 1, 1, '#ff8fab');
    P(2, hy + 4, 3, 1, '#e63946');
    P(sm ? -6 : -5, (sm ? -5 : -6) - (wag ? 1 : 0), 1, 2, b);
  } else if (p.k === 'gatto') {
    if (sl) {
      P(-3, -3, 7, 2, a);
      P(-4, -2, 2, 1, b);
      P(2, -4, 3, 2, a);
      P(2, -5, 1, 1, a);
      P(4, -5, 1, 1, a);
      P(3, -3, 2, 1, shade(a, 0.7));
      return;
    }
    P(-3, -4, 6, 3, a);
    P(-3, -4, 6, 1, shade(a, 1.15));
    [-3, -1, 1, 2].forEach((lx, i) => P(lx, -1, 1, (i + step) % 2 ? 1 : 1, shade(a, 0.8)));
    P(2, -7, 4, 4, a);
    P(2, -8, 1, 1, a);
    P(5, -8, 1, 1, a);
    P(2, -8, 1, 1, a);
    P(3, -6, 1, 1, '#3fbf6a');
    P(5, -6, 1, 1, '#3fbf6a');
    P(4, -5, 1, 1, '#ff8fab');
    P(3, -4, 1, 1, b);
    if (p.mode === 'groom') P(5, -4, 1, 2, a);
    const sw = Math.round(Math.sin(T * 2 + p.wt));
    P(-4, -6, 1, 3, b);
    P(-5 + sw, -7, 1, 1, b);
  } else if (p.k === 'coniglio') {
    if (sl) {
      P(-3, -3, 6, 3, a);
      P(1, -4, 4, 3, a);
      P(-1, -5, 3, 1, a);
      P(4, -3, 1, 1, DK);
      P(-4, -2, 1, 1, '#fffaf2');
      return;
    }
    P(-3, -4, 6, 4, a);
    P(-2, -5, 4, 1, a);
    P(1, -6, 4, 3, a);
    P(2, -10, 1, 4, a);
    P(4, -10, 1, 4, a);
    P(2, -9, 1, 2, b);
    P(4, -9, 1, 2, b);
    P(4, -5, 1, 1, DK);
    P(5, -4, 1, 1, '#ff8fab');
    P(-4, -3, 1, 1, '#fffaf2');
    P(2, -4, 1, 1, '#ffb0c8');
  }
}
function drawBird(c, x, y) {
  const p = c.pet,
    f = c.face || 1,
    hop = Math.floor(T * 1.3 + c.id) % 7 === 0 ? 1 : 0,
    P = (dx, dy, w, h, col) => {
      g.fillStyle = col;
      g.fillRect(f > 0 ? x + dx : x - dx - w, y + dy - hop, w, h);
    };
  P(-1, -2, 3, 2, p.c);
  P(0, -4, 2, 2, p.c);
  P(2, -3, 1, 1, '#ff9f43');
  P(1, -3, 1, 1, DK);
  P(-2, -1, 1, 1, p.c2);
  P(-1, -1, 2, 1, p.c2);
  p.x = x;
  p.y = y;
  if (p.emo) drawEmote(x - 2, y - 14, p.emo.k);
}
function tapPet(x, y) {
  for (const c of people) {
    const p = c.pet;
    if (!p || c.dead) continue;
    if (Math.abs(x - p.x) < 6 && y > p.y - (p.k === 'uccellino' ? 6 : 10) && y < p.y + 3) {
      p.heart = 2.5;
      if (p.k === 'cane' || p.k === 'coniglio') {
        p.mode = 'wag';
        p.t = 4;
      }
      for (let i = 0; i < 3; i++) parts.push({ x: p.x + rnd(-3, 3), y: p.y - 8, vx: rnd(-3, 3), vy: -8, t: 1.4, max: 1.4, k: 'heart' });
      sfx(p.k === 'gatto' ? 'meow' : p.k === 'cane' ? 'woof' : 'pop');
      if (!c.bub && Math.random() < 0.5)
        say(
          c,
          pick([`${p.n} ti adora.`, `Le coccole a ${p.n}? Grazie!`, `Visto, ${p.n}? Qui sei di casa.`, `${p.n} non vuole più andare via.`]),
          2.6,
          c.name
        );
      st.petted = st.petted || {};
      st.petted[p.k + p.n] = 1;
      if (Object.keys(st.petted).length >= 5) egg('cuccioli');
      return true;
    }
  }
  return false;
}
/* ----- gli animali tra loro ----- */
let petT = rnd(6, 12),
  catHissT = 0;
function petEmo(p, k, t) {
  p.emo = { k, t: t || 2 };
}
function petKey(a, b) {
  return [a.k + a.n, b.k + b.n].sort().join('|');
}
function petSocial(dt) {
  catHissT = Math.max(0, catHissT - dt);
  // il gatto del locale non sopporta i cani vicino al bancone
  if (st.cat && catHissT <= 0)
    for (const c of people) {
      const p = c.pet;
      if (p && p.k === 'cane' && !p.visit && p.x > counterX - 20 && Math.random() < dt * 0.25) {
        catHissT = 2.2;
        petEmo(p, 'sweat', 2);
        p.flee = 1.2;
        sfx('soffio');
        if (!c.bub) say(c, pick([`${p.n}, lascia stare il gatto!`, `Scusate, ${p.n} voleva solo salutare.`]), 2.4, c.reg ? c.name : '');
        if (egg('soffio')) logB(`Il gatto del locale ha soffiato a ${p.n}`);
        break;
      }
    }
  petT -= dt;
  if (petT > 0) return;
  petT = rnd(7, 14);
  const sit = people.filter(
    c =>
      c.pet &&
      c.state === 'sit' &&
      c.seat &&
      !c.dead &&
      !c.pet.visit &&
      !c.pet.moving &&
      !people.some(o => o.pet && o.pet.visit && o.pet.visit.to === c)
  );
  // due uccellini nella sala cantano insieme
  const birds = sit.filter(c => c.pet.k === 'uccellino');
  if (birds.length >= 2 && Math.random() < 0.5) {
    const [a, b] = birds;
    for (const c of [a, b])
      for (let i = 0; i < 3; i++)
        timers.push({
          t: i * 0.5,
          fn: () => parts.push({ x: c.pet.x, y: c.pet.y - 5, vx: rnd(-3, 3), vy: -7, t: 1.6, max: 1.6, k: 'note' })
        });
    sfx('bells');
    befriend(a, b, 'cantano in duetto');
    return;
  }
  const walk = sit.filter(c => c.pet.k !== 'uccellino');
  const pairs = [];
  for (let i = 0; i < walk.length; i++)
    for (let j = 0; j < walk.length; j++) if (i !== j && Math.abs(walk[i].pet.x - walk[j].pet.x) < 110) pairs.push([walk[i], walk[j]]);
  if (!pairs.length) return;
  const [a, b] = pick(pairs);
  a.pet.visit = { to: b, ph: 'go', t: 0 };
  a.pet.mode = '';
}
function petMeet(a, b) {
  const p = a.pet,
    q = b.pet,
    ks = [p.k, q.k].sort().join('+');
  let ok = true,
    txt = '';
  p.visit.ph = 'meet';
  p.visit.t = ks === 'cane+cane' ? 4.5 : 3;
  if (ks === 'cane+cane') {
    p.visit.play = 1;
    petEmo(p, 'heart');
    petEmo(q, 'heart');
    q.mode = 'wag';
    sfx('woof');
    txt = 'giocano a rincorrersi';
  } else if (ks === 'cane+gatto') {
    const cat = p.k === 'gatto' ? p : q,
      dog = cat === p ? q : p;
    if (Math.random() < 0.6) {
      ok = false;
      petEmo(cat, 'angry');
      petEmo(dog, 'sweat');
      sfx('soffio');
      p.visit.t = 1.2;
      txt = '';
    } else {
      petEmo(cat, 'heart');
      petEmo(dog, 'heart');
      cat.mode = 'sleep';
      dog.mode = 'sleep';
      p.visit.t = 5;
      txt = 'si sono accoccolati insieme';
    }
  } else if (ks === 'gatto+gatto') {
    petEmo(p, 'heart');
    petEmo(q, 'heart');
    sfx('meow');
    p.mode = 'groom';
    q.mode = 'groom';
    txt = 'si strusciano';
  } else {
    petEmo(p, 'heart');
    petEmo(q, 'star');
    sfx('pop');
    txt = 'si toccano il naso';
  }
  for (let i = 0; i < (ok ? 3 : 0); i++)
    parts.push({ x: (p.x + q.x) / 2 + rnd(-3, 3), y: p.y - 9, vx: rnd(-3, 3), vy: -7, t: 1.4, max: 1.4, k: 'heart' });
  if (ok) befriend(a, b, txt);
  else if (!a.bub && Math.random() < 0.6)
    say(a, pick([`${p.n}! Torna qui!`, `Ehm... scusate, ${p.n} è un po' invadente.`]), 2.4, a.reg ? a.name : '');
}
function befriend(a, b, txt) {
  const p = a.pet,
    q = b.pet;
  st.petf = st.petf || {};
  const k = petKey(p, q);
  st.petf[k] = (st.petf[k] || 0) + 1;
  if (!a.bub && Math.random() < 0.6)
    say(a, pick([`Guarda, ${p.n} e ${q.n} ${txt}!`, `${p.n} si è fatto un amico.`, `Che teneri...`]), 2.6, a.reg ? a.name : '');
  if (st.petf[k] === 2) {
    toast(`${p.n} e ${q.n} sono diventati amici!`);
    logB(`${p.n} e ${q.n} sono amici a quattro zampe`);
    egg('zampe');
  }
  // i padroni si conoscono grazie ai loro animali
  if (a.reg && b.reg && !st.rel[relKey(a.reg, b.reg)]) {
    advanceRel(a.reg, b.reg);
    logB(`${a.reg.n} e ${b.reg.n} si sono conosciuti grazie a ${p.n} e ${q.n}`);
    toast(`${a.reg.n} e ${b.reg.n} si conoscono grazie ai loro animali`);
    timers.push({
      t: 1.2,
      fn: () => {
        if (!b.bub && !b.dead) say(b, `Piacere! Io sono ${b.name}, e lui è ${q.n}.`, 2.8, b.name);
      }
    });
  }
}
