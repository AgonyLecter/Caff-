// «Gocce», il social del quartiere (il motore è in js/motore/social.js).
// I clienti decidono da soli se scattare una foto (da soli, con un amico che può anche dire di no, al caffè perfetto,
// alla pioggia, al gatto, a un momento speciale) e la postano. Gli altri mettono cuori, commentano, condividono e a
// volte rifanno la foto a modo loro. Tu sfogli il feed nel Diario, metti cuori e commenti.
// Segnaposti: {X} l'altra persona (o l'autore), {o} «o/a» di chi parla, {item} quello che beve.
// Le didascalie sono frasi costruite a pezzi: GRAM.didascalia_<tipo> (con le circostanze, in fondo a questo file).

const SO_NOME = 'Gocce';
// i tipi di foto: cosa fa mentre scatta (g), gli hashtag (h)
const SO_TIPI = {
  selfie: {
    g: ['*alza il telefono e si fa un selfie con la tazza*', '*si sistema i capelli e scatta un selfie*'],
    h: ['#selfie', '#iolatazzaelapioggia']
  },
  insieme: {
    g: ['*avvicina la testa a quella di {X} e scatta*', '*«Sorridi!» e scatta una foto con {X}*'],
    h: ['#insieme', '#amicizia', '#tavolodeltreno']
  },
  tazza: {
    g: ['*fotografa la tazza dall’alto, con attenzione*', '*gira il piattino per avere la luce giusta, poi scatta*'],
    h: ['#latteart', '#caffèperfetto', '#tazzinadautore']
  },
  pioggia: {
    g: ['*fotografa le gocce sul vetro*', '*inquadra la strada bagnata dalla vetrina*'],
    h: ['#pioggia', '#vetrina', '#cittàchenondorme']
  },
  gatto: {
    g: ['*si avvicina piano al gatto e scatta*', '*fotografa il gatto addormentato sul bancone*'],
    h: ['#gattodelbancone', '#gattichegiudicano']
  },
  evento: { g: ['*fotografa la scena, emozionat{o}*'], h: ['#momentidelcaffè', '#auguri'] },
  rifatta: { g: ['*prova a rifare la stessa foto, con il suo stile*'], h: ['#sfida', '#rifatta'] }
};
// chi viene invitato in una foto può dire di no
const SO_INVITO = ['Facciamo una foto, {X}?', 'Vieni qui, foto insieme!', 'Una foto per ricordare la serata?'];
const SO_SI = {
  caldo: ['Volentieri!', 'Certo, vieni qui.'],
  ironico: ['Solo se mi prendi dal lato buono. Quale? Tutti e due.', 'Va bene, ma niente filtri. Sono già perfett{o}.'],
  timido: ['Oh... va bene. *sorride appena*', 'Se proprio vuoi... *si nasconde un po’ dietro la tazza*'],
  brontolone: ['Mh. Una sola.', 'Va bene. Ma non la mettere ovunque.'],
  entusiasta: ['SÌ! Aspetta, mi metto in posa!', 'Foto! Foto! Facciamone dieci!']
};
const SO_NO = {
  caldo: ['Oggi no, scusa: ho una faccia stanchissima.', 'Magari la prossima volta, va bene?'],
  ironico: ['Non sono nel mio profilo migliore. Ne ho uno?', 'No, grazie. Il mio avvocato sconsiglia.'],
  timido: ['No no... non mi piaccio in foto.', '*fa no con la testa, arrossendo*'],
  brontolone: ['Niente foto. Non sono un monumento.', 'No. E metti via quel telefono.'],
  entusiasta: ['Aspetta, sono spettinat{o}! Dopo, dopo!', 'Non adesso, ho la schiuma sul naso!']
};
// commenti degli altri, secondo il carattere
const SO_COMMENTI = {
  caldo: ['Che bella foto, {X}!', 'Mi hai fatto venire voglia di passare.', 'Questa la incornicerei.', 'Si vede che stavi bene.'],
  ironico: [
    'Il vero protagonista è il cucchiaino.',
    'Bella. Ma il gatto è venuto meglio di te.',
    'Qualcuno chiami un fotografo. No, va bene così.',
    'Hai copiato la mia foto. Ma meglio.'
  ],
  timido: ['Bella...', '❤', 'Mi piace tanto.', '*ha messo un cuore e poi è scappat{o}*'],
  brontolone: [
    'Mah. Il caffè si beve, non si fotografa.',
    'Carina. Un po’ storta.',
    'Ai miei tempi le foto si stampavano.',
    'Va bene, metto il cuore. Content{X:o}?'
  ],
  entusiasta: ['STUPENDA!!!', 'La voglio come sfondo!', 'Siete bellissimi!', 'Domani ne facciamo una tutti insieme!']
};
// l'autore risponde quando commenti tu
const SO_RISPOSTA = {
  caldo: ['Grazie! Il merito è anche del tuo caffè.', 'Sei gentile come sempre.'],
  ironico: ['Lo so. Sono un talento sprecato.', 'Grazie. Il mio agente ti contatterà.'],
  timido: ['Oh... grazie. *arrossisce davanti al telefono*', 'Grazie... davvero.'],
  brontolone: ['Mh. Grazie. Non farci l’abitudine.', 'Contento che piaccia a qualcuno.'],
  entusiasta: ['GRAZIEEE! Sei il migliore!', 'Ahh grazie! La prossima la facciamo insieme!']
};
// i commenti che puoi lasciare tu
const SO_MIEI = [
  'Che bella! ☕',
  'Ti aspetto domani al solito tavolo.',
  'Questa foto mi ha fatto sorridere.',
  'Il caffè era mio, la bellezza tua.'
];
// cosa pensano dopo
const SO_PENSA = {
  cuori: [
    'La mia foto ha preso {n} cuori. Non che li conti. Li conto.',
    '*guarda il telefono e sorride: {n} cuori*',
    '{n} cuori alla mia foto! Forse dovrei farne un’altra.'
  ],
  pochi: ['Nessuno ha messo un cuore alla mia foto. Vabbè, piaceva a me.', '*guarda il telefono, poi lo mette via*'],
  vista: ['Hai visto la foto di {X} su Gocce? Bellissima.', 'Ho messo un cuore alla foto di {X}. Se lo meritava.'],
  tuo: ['Il barista ha messo un cuore alla mia foto! Il barista!', 'Mi hai lasciato un commento su Gocce! Grazie!']
};
// la foto della settimana, sul giornale
const SO_GIORNALE = [
  'La foto più amata su Gocce: quella di {X}, con {n} cuori. «{C}»',
  'Da Gocce: {X} conquista il quartiere con {n} cuori. «{C}»'
];

/* ---------- didascalie costruite a pezzi ---------- */
Object.assign(GRAM, {
  didascalia_selfie: [
    '{momento}, io e il mio {item}.',
    'Io, la pioggia, e {pace}.',
    '{momento}. {pace_cap}.',
    'Selfie di una persona felice. Più o meno.'
  ],
  didascalia_insieme: ['{momento} con {X}. {pace_cap}.', 'Io e {X}: {legame}.', 'Con {X}, {momento_min}.', '{legame_cap}. Io e {X}.'],
  didascalia_tazza: [
    'Opera d’arte o caffè? Entrambi.',
    'Il barista ha superato se stesso.',
    '{momento}: il {item} perfetto.',
    'Non ho il coraggio di berlo.'
  ],
  didascalia_pioggia: [
    '{momento}, la città dalla vetrina.',
    'La pioggia è più bella vista da qui.',
    'Gocce sul vetro, caffè in mano. {pace_cap}.',
    'Nessun filtro. Solo pioggia.'
  ],
  didascalia_gatto: [
    'Il vero padrone del locale.',
    'Mi ha guardat{o} come se dovessi pagare io l’affitto.',
    'Diciannovesima ora di sonno della giornata.',
    'Il gatto non approva le foto. Ma è venuto bene.'
  ],
  didascalia_evento: ['Che emozione, stasera al caffè.', 'Certe serate vanno ricordate.', 'Io c’ero. ❤'],
  didascalia_rifatta: [
    'Ci ho provato anch’io, come {X}. Giudicate voi.',
    'Sfida accettata, {X}!',
    'La mia versione. Quella di {X} era meglio, lo so.'
  ],
  momento: ['Stasera', 'Fine giornata', 'Pausa meritata', 'Momento perfetto', 'Ora del caffè'],
  momento_min: ['stasera', 'a fine giornata', 'nella pausa', 'sotto la pioggia', 'come sempre'],
  pace: ['un po’ di pace', 'niente fretta', 'il mio angolo preferito', 'tutto quello che mi serve', 'la serata giusta'],
  legame: ['la mia persona preferita', 'compagnia di tazza', 'squadra che vince', 'amicizia certificata', 'due tazze e mille chiacchiere'],
  'momento@notte': ['A notte fonda', 'Insonni al caffè'],
  'momento@mattina': ['Primo caffè', 'Buongiorno'],
  'momento@neve': ['Nevica', 'Giornata di neve'],
  'momento@sereno': ['Giornata di sole', 'Con il sole fuori'],
  'pace@pioggia': ['pioggia fuori, calma dentro', 'il rumore della pioggia'],
  'pace@inverno': ['una cioccolata e una sciarpa', 'il caldo dopo il freddo'],
  'legame@festa': ['si festeggia insieme', 'buona festa a noi']
});

// il ricordo del tuo cuore su Gocce
Object.assign(PENSA.ric, { cuore: ['Il barista ha messo un cuore alla mia foto. Me lo ricordo ancora.'] });
Object.assign(RIC_N, { cuore: 'il tuo cuore alla sua foto su Gocce' });
