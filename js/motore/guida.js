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
  if (intro || tut) return; // durante la scena e il tutorial di Nonna Rosa la scheda è sua
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
function placeRing(s) {
  s = s || gCur;
  const r = $('#gring');
  let box = null;
  const tg = typeof s.target === 'function' ? s.target() : s.target;
  if (tg) {
    const t = document.querySelector(tg);
    if (t && !t.closest('[hidden]') && t.getClientRects().length) {
      const b = (t.closest('.chip, button') || t).getBoundingClientRect();
      box = { x: b.left + b.width / 2, y: b.top + b.height / 2, r: Math.max(b.width, b.height) / 2 + 8 };
    }
  } else if (s.world) {
    const w = s.world();
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

/* ----- il primo giorno: Nonna Rosa apre il locale e ti insegna il mestiere ----- */
// Dopo il filmato e il nome entra Nonna Rosa col suo gatto e spiega che qui contano le persone e le loro storie.
// Poi resta in piedi accanto a te e ti fa provare tutto, una cosa alla volta: il primo cliente, un bisogno,
// un ordine speciale, i cocci, il tavolo sporco, il barista, la macchina in tilt... e il primo racconto (il signor Aldo).
// Intanto non entra nessun altro e l'orologio è fermo. Alla fine se ne va, e da lì in poi dà solo consigli sulle novità.
const INTRO = [
  "Oh! Le luci sono accese! Finalmente. Io sono Rosa, abito qui sopra da sessant'anni. Lui è Ciuffo.",
  "Quando ero giovane qui c'era un forno. Poi è rimasto chiuso tanto tempo, e la via si era fatta triste.",
  'Ti dico un segreto: questo non sarà un posto dove si fanno solo caffè. Chi entra da quella porta porta con sé una storia.',
  'Le monete servono, certo. Ma il tesoro di {nome} saranno le persone: ascoltale, ricordati di loro. Quello che dirai cambierà le loro vite.',
  "Oggi resto un po' qui con te e ti faccio vedere come si fa. Apri le porte: arriva il primo cliente!"
];
let intro = null;
function startIntro() {
  if (intro || tut || st.introDone) return;
  const c = {
    id: ++uid,
    look: CH.rosa.l,
    name: 'Nonna Rosa',
    type: 'nonno',
    x: DOORX,
    y: DOORY,
    face: 1,
    spd: 30,
    state: 'intro',
    // si ferma al centro di quello che si vede sullo schermo
    path: [
      { x: DOORX + 4, y: LANE },
      { x: clamp(camX + VW * 0.45, DOORX + 30, counterX - 46), y: LANE + 6 }
    ],
    moving: false,
    wt: 0,
    bub: null,
    emo: null,
    act: '',
    mood: 90,
    key: 'rosa',
    sitT: 0
  };
  c.pet = petOf(c);
  people.push(c);
  doorOpen = 1;
  sfx('door');
  intro = { c, i: -1, phase: 'walk' };
  hideGuide();
}
function introTick(dt) {
  if (!intro) return;
  const c = intro.c;
  if (intro.phase === 'walk' && follow(c, dt)) {
    intro.phase = 'talk';
    c.face = 1;
    emo(c, 'heart', 1.6);
    introShow(0);
  }
}
function introShow(i) {
  intro.i = i;
  const el = $('#guide'),
    last = i >= INTRO.length - 1;
  el.innerHTML = `<img alt="" src="${portrait(CH.rosa.l)}"><div><b>Nonna Rosa</b><p>${esc(INTRO[i].replace('{nome}', st.name || 'questo posto'))}</p><div class="gb"><button id="iok">${
    last ? 'Apri le porte' : 'Avanti ›'
  }</button><button id="iskip">Salta il tutorial</button></div></div>`;
  el.hidden = false;
  sfx('pop');
}
document.addEventListener('click', e => {
  if (!intro || intro.phase !== 'talk') return;
  if (e.target.id === 'iok') {
    if (intro.i < INTRO.length - 1) introShow(intro.i + 1);
    else {
      const c = intro.c;
      intro = null;
      tutStart(c);
    }
  }
  if (e.target.id === 'iskip') {
    const c = intro.c;
    intro = null;
    tut = { c, i: 0, t: 0 };
    tutEnd(true);
  }
});

/* ----- il tutorial a passi ----- */
let tut = null; // { c: Nonna Rosa, i: passo, t: tempo nel passo, ...i clienti di prova }
const TUT_STAY = { x: 172, y: LANE + 14 }; // dove resta Nonna Rosa: davanti, fuori dal passaggio e non sotto la sua scheda
// un cliente mandato da Nonna Rosa: non perde la pazienza e si siede sempre
function tutCust(o) {
  const c = newCust(o);
  c.tut = 1;
  c.pat = 1e9;
  c.talked = true; // niente chiacchiere col vicino: deve restare libero per la lezione
  if (o.forceSpecial) c.forceSpecial = 1;
  return c;
}
const tutGone = c => !c || c.dead || c.state === 'leave';
const tutServed = c => c && !['enter', 'queue', 'order'].includes(c.state);
const ALDO = [
  [0, 'Scusi... è aperto davvero? Non ci credevo, quando ho visto la luce.'],
  [0, "Qui una volta c'era il forno. Mia moglie Ines veniva ogni mattina alle sette."],
  [0, '*gira il cucchiaino, piano piano*'],
  [0, 'È mancata in primavera. Da allora esco poco. La casa è troppo silenziosa.'],
  {
    c: {
      q: 'Aldo guarda la tazza. Non sa se ha fatto bene a entrare.',
      o: [
        {
          t: '«Mi racconti di Ines.»',
          f: 'tut_aldo=ines',
          r: [
            [0, 'Rideva forte, sa? La sentivano fino in piazza.'],
            [0, 'Prendeva sempre due cornetti. Uno per me, anche se dicevo di no.'],
            [0, '...Grazie. Era tanto che nessuno me lo chiedeva.']
          ]
        },
        {
          t: '«Torni quando vuole. Questo può essere il suo tavolo.»',
          f: 'tut_aldo=tavolo',
          r: [
            [0, 'Un tavolo mio? Alla mia età?'],
            [0, '*sorride, per la prima volta*'],
            [0, 'Va bene. Allora domani torno. Alle sette, come lei.']
          ]
        }
      ]
    }
  },
  [0, 'Il caffè era buono. Grazie, davvero.']
];
const TUT = [
  {
    id: 'cliente',
    start: () => (tut.c1 = tutCust({})),
    text: 'Ecco il primo cliente! Aspetta che arrivi al bancone, poi tocca «Servi» tante volte, finché la tazza è pronta.',
    target: '#serve',
    done: () => st.served > tut.s0
  },
  {
    id: 'ascolta',
    text: 'Bravissima! Ora si siede. Mentre bevono, i clienti pensano e chiacchierano: tocca il suo tavolo per sentire cosa dice.',
    world: () => (tut.c1.state === 'sit' ? tut.c1 : null),
    done: () => tut.c1.tapped || tutGone(tut.c1)
  },
  {
    id: 'bisogno',
    start: () => {
      const c = tut.c1;
      if (c.state !== 'sit') return;
      c.need = { k: 'acqua', t: 1e9 };
      c.bub = null;
      say(c, pick(NEEDS.acqua.ask), 2.8);
    },
    text: 'Vedi il fumetto sopra di lui? Ha bisogno di qualcosa. Toccalo: sono le piccole attenzioni che fanno sentire le persone a casa.',
    world: () => (tut.c1.need ? tut.c1 : null),
    done: () => !tut.c1.need
  },
  {
    id: 'speciale',
    start: () => (tut.c2 = tutCust({ forceSpecial: 1 })),
    text: 'Questa signora vuole qualcosa di speciale: vedi la stellina sul suo ordine? Quando è al bancone tocca «Servi» e preparalo tu, con le tue mani.',
    target: '#serve',
    done: () => tutServed(tut.c2)
  },
  {
    id: 'cocci',
    start: () => {
      const c = tut.c1,
        s = c.seat;
      if (s && c.state === 'sit') {
        newIncident('cocci', s.x + s.side * 3, s.y + 4);
        sfx('pop');
        c.sitT = 0;
        say(c, 'Oh no, scusate! Che sbadato...', 2.4);
      }
    },
    text: 'Ops! Mentre si alzava gli è scivolata la tazza. Tocca i cocci per raccoglierli, prima che qualcuno si faccia male.',
    world: () => incid[0] || null,
    done: () => !incid.length
  },
  {
    id: 'pulisci',
    text: 'E il tavolo è rimasto sporco. Toccalo per pulirlo: nessuno si siede volentieri tra le briciole.',
    world: () => dirtySeat(),
    done: () => tutGone(tut.c1) && !dirtySeat()
  },
  {
    id: 'monete',
    start: () => {
      if (tut.c2) {
        tut.c2.noDirty = 1;
        tut.c2.sitT = Math.min(tut.c2.sitT, 6);
      }
      const need = UP.find(u => u.id === 'barista').c() - st.coins;
      if (need > 0) {
        st.coins += need;
        floats.push({ x: TUT_STAY.x, y: TUT_STAY.y - 30, txt: '+' + need, t: 2, col: '#ffd166' });
      }
    },
    text: 'Le monete servono a far crescere il locale: più tavoli, più persone, più storie da ascoltare. Ti ho messo qualcosa nel cassetto per cominciare.'
  },
  {
    id: 'barista',
    text: 'Apri «Migliora» e assumi un barista: preparerà i caffè anche quando sei occupata ad ascoltare qualcuno.',
    target: () => (panel !== 'up' ? '#bUp' : tab !== 'Staff' ? '#tabs button[data-tab="Staff"]' : 'button[data-u="barista"]'),
    done: () => st.barista > 0
  },
  {
    id: 'macchina',
    start: () => {
      closePanel();
      machTilt = 5;
      sfx('hiss');
    },
    text: 'Ahi, la macchina fa i capricci e il barista è fermo! Dalle qualche colpetto: toccala finché riparte.',
    world: () => (machTilt ? { x: W - 20, y: 96 } : null),
    done: () => !machTilt
  },
  {
    id: 'aldo',
    start: () => (tut.aldo = tutCust({ type: 'nonno', name: 'Aldo', look: randLook('nonno') })),
    text: 'Guarda chi entra... È il signor Aldo! Veniva al forno tutte le mattine. Servilo pure (o lascia fare al barista), poi vediamo.',
    world: () => (tut.aldo.state === 'sit' ? null : tut.aldo),
    done: () => !!tut.aldo.scene
  },
  {
    id: 'stella',
    text: 'Vedi la stellina sopra di lui? Vuol dire che ha qualcosa da raccontarti. Toccalo quando sei pronta: il locale ti aspetta.',
    world: () => (tut.aldo.invite ? tut.aldo : null),
    done: () => tut.aldoDone
  },
  {
    id: 'cuore',
    text: 'Hai visto? Questo è il cuore del locale. Le persone ti affidano la loro vita, e quello che rispondi la cambia davvero. Aldo tornerà: ora è uno dei tuoi habitué.'
  },
  {
    id: 'diario',
    text: 'Le storie non si perdono: restano nel Diario. Apri «Clienti», c’è già quella di Aldo.',
    target: '#bCli',
    done: () => panel === 'cli'
  },
  {
    id: 'diario2',
    start: () => {
      // apre la pagina delle vite, dove c'è la storia di Aldo
      if (panel === 'cli') {
        tab = 'Vite';
        renderPanel();
      }
    },
    text: 'Qui ritrovi le storie e le vite dei tuoi habitué: chi diventa amico, chi si innamora, chi litiga, chi ha bisogno di una mano. Puoi rileggere tutto, come un libro.'
  },
  {
    id: 'atm',
    start: () => closePanel(),
    text: 'Ultima cosa: la lampadina qui sotto è l’Atmosfera. Più il locale è accogliente, più storie entrano da quella porta.',
    target: '#atm'
  },
  {
    id: 'fine',
    text: 'Ricorda, cara: qui non conta quanto guadagni. Conta chi entra, cosa si porta dentro, e cosa trova qui. Io vado, Ciuffo ha fame. Quando capita qualcosa di nuovo, passo a darti un consiglio.',
    btn: 'Apri le porte'
  }
];
function tutStart(c) {
  tut = { c, i: -1, t: 0, s0: st.served };
  c.path = [{ x: TUT_STAY.x, y: TUT_STAY.y }];
  tutGo(0);
}
function tutGo(i) {
  tut.i = i;
  tut.t = 0;
  tut.shown = false;
  const s = TUT[i];
  if (!s) return tutEnd();
  if (s.start) s.start();
  save();
}
function tutShow(s) {
  const el = $('#guide');
  const txt = typeof s.text === 'function' ? s.text() : s.text;
  el.innerHTML = `<img alt="" src="${portrait(CH.rosa.l)}"><div><b>Nonna Rosa <small class="tstep">${tut.i + 1}/${TUT.length}</small></b><p>${esc(
    txt
  )}</p><div class="gb">${s.done ? '' : `<button id="tnext">${s.btn || 'Avanti ›'}</button>`}<button id="tskip">Salta il tutorial</button></div></div>`;
  el.hidden = false;
  tut.shown = true;
  sfx('pop');
}
// la scheda si fa da parte quando c'è qualcos'altro in primo piano: un racconto, un minigioco, una finestra
const tutAside = () => regia.live || mini || !$('#modal').hidden || !$('#reader').hidden;
function tutTick(dt) {
  rosaTick(dt);
  if (!tut) return;
  const c = tut.c,
    s = TUT[tut.i];
  if (c.path.length && follow(c, dt)) c.face = 1;
  tut.t += dt;
  // il signor Aldo, appena seduto, vuole raccontare: la scena aspetta che tu lo tocchi
  const A = tut.aldo;
  if (A && A.state === 'sit' && !A.scene && !A.told) {
    A.told = 1;
    startScene([A], fillT(ALDO, A, null), { story: 'tut', noAuto: true, onEnd: () => tutAldoEnd(A) });
    A._sc = scenes[scenes.length - 1];
  }
  if (!s) return;
  if (s.done && s.done()) return tutGo(tut.i + 1);
  if (tutAside()) {
    hideGuide();
    tut.shown = false;
    return;
  }
  if (!tut.shown) tutShow(s);
  placeRing(s);
}
// Aldo diventa il primo habitué, e la sua storia entra nel Diario
function tutAldoEnd(A) {
  const ines = st.flags.tut_aldo === 'ines';
  delete st.flags.tut_aldo;
  const r = {
    id: 'r_aldo',
    n: 'Aldo',
    look: A.look,
    type: 'nonno',
    fav: (A.order || MENU[0]).id,
    v: 1,
    f: 4,
    fn: st.day + 2, // la sua prossima storia, tra qualche giorno
    tr: ['nostalgico', 'gentile']
  };
  if (!st.regs.some(x => x.id === r.id)) st.regs.push(r);
  A.reg = r;
  const sc = A._sc,
    ch = sc && sc.lines.find(x => !Array.isArray(x));
  st.fdone = (st.fdone || []).filter(f => f.rid !== 'r_aldo'); // se il tutorial è ricominciato a metà
  st.fdone.unshift({
    n: 'Aldo',
    rid: r.id,
    t: 'Il forno di Ines',
    e: ines ? 'ti ha raccontato di Ines, e ha sorriso' : 'ha trovato il suo tavolo, alle sette come lei',
    d: st.day,
    log: sc
      ? [
          {
            l: sc.lines.filter(Array.isArray).map(x => x[1]),
            ch: ch ? ch.c.o.find(o => o.f === 'tut_aldo=' + (ines ? 'ines' : 'tavolo')).t : null,
            at: ch ? sc.lines.indexOf(ch) : 0
          }
        ]
      : [],
    look: A.look
  });
  st.hearts++;
  floats.push({ x: A.x, y: A.y - 36, txt: '♥ +1', t: 1.8, col: '#ff4fa3' });
  sfx('story');
  st.newStory = 1;
  toast('Aldo ora è un habitué · la sua storia è nel Diario');
  logB('Aldo ora è un habitué');
  tut.aldoDone = 1;
  save();
}
function tutEnd(skipped) {
  if (!tut) return;
  hideGuide();
  const c = tut.c;
  tut = null;
  st.introDone = 1;
  st.tutDone = 1;
  // i consigli di base li hai già visti (o hai scelto di saltarli): restano solo quelli sulle novità
  st.tut = st.tut || {};
  ['servi', 'barista', 'barista2', 'pulisci', 'speciale', 'atm', 'storia', 'bisogno', 'imprevisto', 'habitue'].forEach(
    k => (st.tut[k] = 1)
  );
  if (machTilt && skipped) machTilt = 0;
  rosaOut = c;
  say(
    c,
    skipped ? 'Va bene, cara. In bocca al lupo!' : pick(['A domani, cara!', 'Torno a trovarti, eh!', 'Ciuffo, andiamo.']),
    2.4,
    'Nonna Rosa'
  );
  c.path = [
    { x: c.x, y: LANE },
    { x: DOORX + 4, y: LANE },
    { x: DOORX, y: DOORY }
  ];
  spawnT = 1.5;
  save();
}
// Nonna Rosa che esce dalla porta, finito il tutorial
let rosaOut = null;
function rosaTick(dt) {
  if (!rosaOut) return;
  if (follow(rosaOut, dt)) {
    rosaOut.dead = true;
    doorOpen = 1;
    rosaOut = null;
  }
}
document.addEventListener('click', e => {
  if (!tut) return;
  if (e.target.id === 'tnext') tutGo(tut.i + 1);
  if (e.target.id === 'tskip') tutEnd(true);
});
