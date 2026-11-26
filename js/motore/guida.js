// Primo giorno guidato: Nonna Rosa, la vicina di sopra, ti accompagna e ti mostra le cose una alla volta.
// Ogni consiglio scatta quando serve (when), indica un pulsante o un punto del locale (target) e sparisce
// quando l'hai fatto (done) o quando tocchi «Ok». I salvataggi già avanzati vedono solo i consigli sulle novità.

const GUIDA = [
  {
    id: 'servi',
    base: 1,
    when: () => st.served === 0 && queue[0] && queue[0].state === 'order' && !queue[0].special,
    text: 'Ciao, cara! Sono Rosa, abito qui sopra. Vedi il cliente al bancone? Tocca «Servi» tante volte, finché la tazza è pronta.',
    target: '#serve',
    done: () => st.served > 0
  },
  {
    id: 'barista',
    base: 1,
    when: () => st.barista === 0 && st.coins >= 60 && st.served >= 3,
    text: 'Con queste monete puoi assumere un barista: servirà anche quando non tocchi. Apri «Migliora».',
    target: '#bUp',
    done: () => panel === 'up' || st.barista > 0
  },
  {
    id: 'barista2',
    base: 1,
    when: () => st.barista === 0 && panel === 'up',
    text: "In alto c'è sempre un consiglio su cosa comprare. Tocca «Compra».",
    target: '.tip button',
    done: () => st.barista > 0 || panel !== 'up'
  },
  {
    id: 'pulisci',
    base: 1,
    when: () => st.waiter === 0 && st.cleaned === 0 && dirtySeat(),
    text: 'Quel tavolo è sporco. Toccalo per pulirlo, se no i clienti si lamentano.',
    world: () => dirtySeat(),
    done: () => st.cleaned > 0
  },
  {
    id: 'speciale',
    base: 1,
    when: () => !st.specials && queue[0] && queue[0].state === 'order' && queue[0].special && !mini,
    text: 'La stellina vuol dire «ordine speciale»: quello lo prepari tu, con le tue mani. Tocca «Servi» e poi solo il pulsante grande.',
    target: '#serve',
    done: () => !!mini || st.specials > 0
  },
  {
    id: 'trascina',
    base: 1,
    when: () => W > VW + 30 && !st.dragged,
    text: 'Il locale è cresciuto! Trascina col dito a destra e a sinistra per guardarti intorno.',
    done: () => st.dragged
  },
  {
    id: 'atm',
    base: 1,
    when: () => atm() >= 8,
    text: "Vedi la lampadina qui sotto? È l'Atmosfera: sedie comode, musica, piante, un gatto... Più è alta, più storie entrano dalla porta.",
    target: '#atm',
    time: 9
  },
  {
    id: 'storia',
    base: 1,
    when: () => Object.values(st.story).some(v => v > 0) && !scenes.length,
    text: 'Hai sentito? Qualcuno ha cominciato a raccontarsi. In «Clienti» trovi il Diario: lo rileggi come un libro.',
    target: '#bCli',
    done: () => panel === 'cli'
  },
  {
    id: 'bisogno',
    when: () => !st.needs && people.some(c => c.need && c.state === 'sit'),
    text: 'Quel cliente ha bisogno di qualcosa: vedi il fumetto? Toccalo per aiutarlo. Le piccole attenzioni fanno tornare la gente.',
    world: () => people.find(c => c.need && c.state === 'sit'),
    done: () => st.needs > 0 || !people.some(c => c.need && c.state === 'sit')
  },
  {
    id: 'obiettivo',
    base: 1,
    when: () => !st.manager && st.quests.some(q => q.done && !q.cl),
    text: 'Hai completato un obiettivo del giorno! Lo riscuoti in «Giorno».',
    target: '#bDay',
    done: () => panel === 'day' || !st.quests.some(q => q.done && !q.cl)
  },
  {
    id: 'habitue',
    base: 1,
    when: () => st.regs.some(r => !r.key),
    text: 'Qualcuno ha deciso che questo è il suo posto: è un habitué. Tornerà alla sua ora, conoscerà altra gente... In «Clienti» trovi le loro vite.',
    target: '#bCli',
    done: () => panel === 'cli'
  },
  {
    id: 'imprevisto',
    when: () => incid.length > 0 || machTilt > 0,
    text: () =>
      machTilt
        ? 'La macchina fa i capricci e i baristi sono fermi! Dalle qualche colpetto: toccala finché riparte.'
        : 'Vedi il punto esclamativo? Qualcosa non va: un ombrello dimenticato, dei cocci, una pozzanghera. Toccalo e sistemi.',
    world: () => (machTilt ? { x: W - 20, y: 96 } : incid[0]),
    done: () => !incid.length && !machTilt
  },
  {
    id: 'punta',
    when: () => !!rush,
    text: 'Ora di punta! La macchina non regge: tocca «Servi» più veloce che puoi. Più clienti servi di fila, più guadagni.',
    target: '#serve',
    done: () => !rush || rush.combo >= 3
  },
  {
    id: 'stili',
    when: () => st.coins >= 1500 && st.served >= 60,
    text: 'Hai messo da parte qualcosa? In «Migliora», scheda Stili, puoi personalizzare la macchina del caffè e appendere insegne al neon.',
    target: '#bUp',
    done: () => panel === 'up',
    time: 12
  },
  {
    id: 'installa',
    when: () => st.day >= 2 && !isApp() && /^https?:$/.test(location.protocol),
    text: "Lo sai che puoi installare il locale sul telefono, come un'app? Funziona anche senza internet. È nel menu qui sotto.",
    target: '#bSet',
    done: () => panel === 'set',
    time: 12
  }
];
function dirtySeat() {
  return allSeats().find(s => s.dirty) || null;
}

let gCur = null,
  gT = 0;
function guideTick(dt) {
  if (!started || cine) return hideGuide();
  st.tut = st.tut || {};
  if (st.tutOff) return hideGuide();
  if (gCur) {
    gT += dt;
    if ((gCur.done && gCur.done()) || (gCur.time && gT > gCur.time) || (!gCur.done && !gCur.time && gT > 10)) finishGuide();
    else placeRing();
    return;
  }
  if (paused) return;
  const s = GUIDA.find(x => !st.tut[x.id] && x.when());
  if (s) showGuide(s);
}
function showGuide(s) {
  gCur = s;
  gT = 0;
  const el = $('#guide');
  el.innerHTML = `<img alt="" src="${portrait(CH.rosa.l)}"><div><b>Nonna Rosa</b><p>${esc(typeof s.text === 'function' ? s.text() : s.text)}</p><div class="gb"><button id="gok">Ok</button><button id="goff">Niente consigli</button></div></div>`;
  el.hidden = false;
  sfx('pop');
  placeRing();
}
function finishGuide() {
  if (gCur) st.tut[gCur.id] = 1;
  gCur = null;
  hideGuide();
  save();
}
function hideGuide() {
  const el = $('#guide');
  if (el && !el.hidden) el.hidden = true;
  const r = $('#gring');
  if (r && !r.hidden) r.hidden = true;
}
// il cerchio luminoso: su un pulsante, oppure su un punto del locale (un tavolo, un cliente)
function placeRing() {
  const r = $('#gring');
  let box = null;
  if (gCur.target) {
    const t = document.querySelector(gCur.target);
    if (t && !t.closest('[hidden]') && t.getClientRects().length) {
      const b = (t.closest('.chip, button') || t).getBoundingClientRect();
      box = { x: b.left + b.width / 2, y: b.top + b.height / 2, r: Math.max(b.width, b.height) / 2 + 8 };
    }
  } else if (gCur.world) {
    const w = gCur.world();
    if (w) {
      const cr = cv.getBoundingClientRect();
      box = { x: ((w.x - camX) * S) / DPR + cr.left, y: ((w.y - 12) * S) / DPR + cr.top, r: (16 * S) / DPR };
    }
  }
  if (!box) {
    r.hidden = true;
    return;
  }
  r.hidden = false;
  r.style.left = box.x - box.r + 'px';
  r.style.top = box.y - box.r + 'px';
  r.style.width = r.style.height = box.r * 2 + 'px';
}
document.addEventListener('click', e => {
  if (e.target.id === 'gok') finishGuide();
  if (e.target.id === 'goff') {
    st.tutOff = 1;
    finishGuide();
    toast('Va bene, niente consigli. Li riaccendi dalle impostazioni.');
  }
});
// i salvataggi già avanzati non rivedono i consigli di base: solo quelli sulle novità
function guideForOldSaves() {
  if (st.tut || st.served < 80) return;
  st.tut = {};
  GUIDA.forEach(s => {
    if (s.base) st.tut[s.id] = 1;
  });
}
setInterval(() => guideTick(0.3), 300);
