// «Gocce», il social del quartiere: i clienti scattano foto (vere: un ritaglio della scena) e le postano;
// gli altri mettono cuori, commentano, condividono e rifanno le foto più amate. Tu sfogli, metti cuori e commenti.
// Le frasi sono in js/dati/social.js. Tutto succede solo mentre si gioca.
// st.so = { n, posts: [{ id, a, w[], k, cap, h, d, img, like[], com[{a, t}], sh[], pl, da }] }

const soDi = () => st.so || (st.so = { n: 0, posts: [] });
// la foto: un ritaglio del mondo disegnato in pixel (la tela «lo»), attorno a chi è in posa
function soScatta(cs) {
  try {
    const xs = cs.map(c => c.x),
      cx = (Math.min(...xs) + Math.max(...xs)) / 2 - camX,
      cy = Math.min(...cs.map(c => c.y)) - 6,
      w = 64,
      h = 48;
    const sx = Math.round(clamp(cx - w / 2, 0, lo.width - w)),
      sy = Math.round(clamp(cy - h / 2, 0, lo.height - h));
    if (cx < 0 || cx > lo.width) return null; // fuori dall'inquadratura: niente foto vera
    const f = document.createElement('canvas');
    f.width = w;
    f.height = h;
    f.getContext('2d').drawImage(lo, sx, sy, w, h, 0, 0, w, h);
    return f.toDataURL('image/png');
  } catch (e) {
    return null;
  }
}
// scatta e posta: chi (c), con chi (o), che tipo, e su cosa (da: il post rifatto)
function soPosta(c, k, o, da) {
  const S = soDi(),
    r = c.reg,
    sty = stileDi(r),
    T = SO_TIPI[k];
  c.act = 'camera';
  c.flash = 0.3;
  if (o) o.flash = 0.3;
  const X = o ? o.name : da ? nomeDi(da.a) : '';
  say(c, riempi(gX(scegli(T.g, 'sog:' + k, r), X).replace(/\{X\}/g, X), { sp: c }), 2.4, c.name);
  const cap = riempi(gX(gram('didascalia', r, k, circostanze(c)) || '', X).replace(/\{X\}/g, X), { sp: c });
  const img = soScatta(o ? [c, o] : [c]);
  S.n++;
  const p = {
    id: S.n,
    a: r.id,
    w: o && o.reg ? [o.reg.id] : [],
    k,
    cap,
    h: pick(T.h),
    d: st.day,
    img,
    like: [],
    com: [],
    sh: [],
    pl: 0,
    da: da ? da.id : 0
  };
  S.posts.unshift(p);
  // le foto vecchie perdono l'immagine (resta la cornice con i ritratti), e il feed tiene le ultime 30
  S.posts.forEach((q, i) => i >= 14 && (q.img = null));
  if (S.posts.length > 30) S.posts.pop();
  r.soP = (r.soP || 0) + 1;
  logB(`${r.n} ha postato una foto su ${SO_NOME}`);
  return p;
}
// voglia di fare una foto: i socievoli e i curiosi di più, chi ha il telefono in mano anche
const soVoglia = c => {
  const p = pers(c.reg);
  return 0.04 + p.soc * 0.08 + p.ape * 0.05 + (c.act === 'camera' || c.act === 'phone' ? 0.06 : 0) + (c.type === 'influencer' ? 0.2 : 0);
};
let soT = 7;
function socialeTick(dt) {
  soT -= dt;
  if (soT > 0 || regia.live || intro || tut || mondoOff) return;
  soT = rnd(6, 10);
  const S = soDi();
  // 1. qualcuno seduto decide di fare una foto
  const seduti = people.filter(c => c.reg && libero(c) && !c.bub && !c.group);
  const c = seduti.length ? pick(seduti) : null;
  if (c && Math.random() < soVoglia(c) && (c.soD || 0) < 1) {
    c.soD = 1; // una foto per visita
    const o = slotOf(c.seat)
      .seats.map(s => s.occ)
      .find(x => x && x !== c && x.reg && libero(x));
    const R = o && st.rel[relKey(c.reg, o.reg)];
    const popolare = S.posts.find(p => p.like.length >= 3 && p.a !== c.reg.id && !p.da && st.day - p.d <= 3);
    const opz = [
      ['selfie', 1],
      ['pioggia', rainy() || curWx() === 'neve' ? 1.5 : 0.5]
    ];
    if (o && R && R.k !== 'rivali') opz.push(['insieme', 1 + R.a / 50]);
    if (c.q === 2) opz.push(['tazza', 3]);
    if (st.cat) opz.push(['gatto', 0.6]);
    if (popolare) opz.push(['rifatta', 1.5]);
    const k = wpick(opz, x => x[1])[0];
    if (k === 'insieme') {
      // l'altro può dire di no
      const so = stileDi(o.reg);
      say(c, gX(scegli(SO_INVITO, 'soinv', c.reg), o.name).replace(/\{X\}/g, o.name), 2, c.name);
      const si = Math.random() < 0.55 + R.a / 250 - (so === 'timido' ? 0.25 : 0) - (so === 'brontolone' ? 0.15 : 0);
      timers.push({
        t: 1.4,
        fn: () => {
          if (c.dead || o.dead || c.state !== 'sit') return;
          say(o, gO(scegli((si ? SO_SI : SO_NO)[so], 'so' + (si ? 's' : 'n') + so, o.reg), o.reg), 2.2, o.name);
          if (si) timers.push({ t: 1.6, fn: () => !c.dead && !o.dead && soPosta(c, 'insieme', o) && (R.a = clamp(R.a + 2, 0, 100)) });
        }
      });
    } else soPosta(c, k, null, k === 'rifatta' ? popolare : null);
    return;
  }
  // 2. qualcuno guarda il feed (anche da casa: il mondo va avanti mentre giochi) e reagisce
  const recenti = S.posts.filter(p => st.day - p.d <= 4);
  if (!recenti.length || !st.regs.length) return;
  const p = pick(recenti),
    A = regDi(p.a),
    L = st.regs.filter(r => r !== A && !p.like.includes(r.id));
  if (!A || !L.length) return;
  const r = wpick(L, x => {
    const R = st.rel[relKey(x, A)];
    return 0.3 + (R ? rv(R).a / 40 : 0) + pers(x).soc;
  });
  soReagisce(r, p);
}
// una persona vede un post: cuore, a volte un commento, a volte lo condivide
function soReagisce(r, p) {
  const A = regDi(p.a);
  if (!A || r === A) return;
  const R = st.rel[relKey(r, A)],
    a = R ? rv(R).a : 15;
  if (R && (R.k === 'rivali' || R.lit === 2) && Math.random() < 0.7) return; // tra rivali, niente cuori (quasi)
  if (Math.random() < 0.45 + a / 200) {
    p.like.push(r.id);
    if (R) R.a = clamp(R.a + 1, 0, 100);
    mn(A).u = clamp(mn(A).u + 0.02 * (0.5 + pers(A).soc), -1, 1);
  }
  if (Math.random() < 0.25 + pers(r).soc * 0.2) {
    const s = stileDi(r);
    p.com.push({ a: r.id, t: gO(gX(scegli(SO_COMMENTI[s], 'soc:' + s, r), A.n).replace(/\{X\}/g, A.n), r) });
    if (p.com.length > 6) p.com.shift();
    if (R) R.a = clamp(R.a + 2, 0, 100);
  }
  if (R && CLOSE.includes(R.k) && Math.random() < 0.2 && !p.sh.includes(r.id)) p.sh.push(r.id);
  impara(r, 'so:' + p.id);
}
// chi arriva al caffè a volte pensa alla sua foto o a quella di un amico
function soPensieri(c, add) {
  const r = c.reg,
    S = st.so;
  if (!r || !S) return;
  const mio = S.posts.find(p => p.a === r.id && st.day - p.d <= 2);
  if (mio && !(c.vis || {}).so) {
    const n = mio.like.length + (mio.pl ? 1 : 0);
    add(mio.pl ? 3 : 1.6, () => {
      c.vis = c.vis || {};
      c.vis.so = 1;
      if (mio.pl) return gO(scegli(SO_PENSA.tuo, 'sotu', r), r);
      return gO(scegli(SO_PENSA[n ? 'cuori' : 'pochi'], 'sop:' + (n ? 'c' : 'p'), r).replace(/\{n\}/g, n), r);
    });
  }
  const amico = S.posts.find(p => p.a !== r.id && p.like.includes(r.id) && st.day - p.d <= 2);
  if (amico) add(0.8, () => scegli(SO_PENSA.vista, 'sov', r).replace(/\{X\}/g, nomeDi(amico.a)));
}
// la foto più amata degli ultimi giorni, per il giornale di Corrado
function soFotoSettimana() {
  const L = (st.so ? st.so.posts : []).filter(p => st.day - p.d <= 4 && nomeDi(p.a));
  if (!L.length) return null;
  const p = L.slice().sort((a, b) => b.like.length + b.sh.length * 2 - (a.like.length + a.sh.length * 2))[0];
  const n = p.like.length + (p.pl ? 1 : 0);
  return n ? scegli(SO_GIORNALE, 'sogz').replace(/\{X\}/g, nomeDi(p.a)).replace(/\{n\}/g, n).replace(/\{C\}/g, p.cap) : null;
}

/* ---------- il feed nel Diario ---------- */
function soFotoHTML(p) {
  if (p.img) return `<img class="sofoto" alt="La foto di ${esc(nomeDi(p.a))}" src="${p.img}">`;
  // senza la foto vera: una cornice con i ritratti di chi c'era
  const chi = [p.a].concat(p.w).map(regDi).filter(Boolean);
  return `<div class="sofoto sofinta">${chi.map(r => `<img alt="" src="${portrait(r.look)}">`).join('')}</div>`;
}
function socialHTML() {
  const S = st.so;
  if (!S || !S.posts.length)
    return `<p class="note">${SO_NOME} è il social del quartiere: quando i tuoi clienti avranno voglia di fare una foto, la troverai qui.</p>`;
  return (
    `<p class="note">${SO_NOME}, il social del quartiere. I tuoi clienti fotografano quello che vogliono, quando vogliono. Metti un cuore o lascia un commento: lo vedranno.</p>` +
    S.posts
      .map(p => {
        const A = regDi(p.a);
        if (!A) return '';
        const con = p.w.map(nomeDi).filter(Boolean);
        const cuori = p.like.length + (p.pl ? 1 : 0);
        return `<div class="card2 sopost"><h3><span class="who"><img alt="" src="${portrait(A.look)}">${esc(A.n)}${
          con.length ? ' <small>con ' + esc(con.join(', ')) + '</small>' : ''
        }</span><small>giorno ${p.d}</small></h3>${soFotoHTML(p)}<p class="ad">${esc(p.cap)} <small>${esc(p.h)}</small>${
          p.da ? ` <small>· rifatta da una foto di ${esc(nomeDi((S.posts.find(q => q.id === p.da) || {}).a) || '...')}</small>` : ''
        }</p><p class="ad"><button class="small" data-sol="${p.id}">${p.pl ? '♥' : '♡'} ${cuori}</button> ${
          p.sh.length ? `<small>condivisa da ${p.sh.length}</small>` : ''
        } <button class="small" data-soc="${p.id}">Commenta</button></p>${p.com
          .map(c => `<div class="rev"><b>${esc(c.a === 'tu' ? 'Tu' : nomeDi(c.a) || '?')}</b> ${esc(c.t)}</div>`)
          .join('')}</div>`;
      })
      .join('')
  );
}
// il tuo cuore: chi l'ha postata si affeziona un po' a te (una volta per foto)
function soMioCuore(id) {
  const p = st.so && st.so.posts.find(x => x.id === +id);
  if (!p) return;
  p.pl = p.pl ? 0 : 1;
  const A = regDi(p.a);
  if (A && p.pl && !p.plF) {
    p.plF = 1;
    A.f = Math.min(10, A.f + 1);
    mn(A).u = clamp(mn(A).u + 0.1, -1, 1);
    memo(A, 'cuore', { v: 0.6 });
  }
}
// il tuo commento (uno di quelli pronti), e l'autore ti risponde
function soMioCommento(id) {
  const p = st.so && st.so.posts.find(x => x.id === +id),
    A = p && regDi(p.a);
  if (!A) return;
  const usati = p.com.filter(c => c.a === 'tu').map(c => c.t);
  const t = SO_MIEI.find(x => !usati.includes(x)) || SO_MIEI[0];
  p.com.push({ a: 'tu', t });
  const s = stileDi(A);
  p.com.push({ a: A.id, t: gO(scegli(SO_RISPOSTA[s], 'sor:' + s, A), A) });
  while (p.com.length > 8) p.com.shift();
  if (!p.cmF) {
    p.cmF = 1;
    A.f = Math.min(10, A.f + 1);
    p.pl = p.pl || 0;
    memo(A, 'cuore', { v: 0.6 });
  }
}
