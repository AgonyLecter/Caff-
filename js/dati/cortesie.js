// Gentilezze tra clienti (il motore è in js/motore/cortesie.js).
// Offrire il caffè a chi è al bancone, cedere il posto quando i tavoli sono pieni, prestare l'ombrello sotto la pioggia.
// Chi riceve può accettare o rifiutare (a modo suo), e ognuno tiene il conto: chi riceve tende a ricambiare,
// chi promette può mantenere o dimenticarsi, chi dà sempre senza ricevere alla fine ci resta male.
// Segnaposti: {X} l'altra persona, {item} quello che ordina chi riceve, {o} «o/a» di chi parla, {X:o} «o/a» di {X}.
// Ogni lista per stile: caldo, ironico, timido, brontolone, entusiasta.

const CORTESIA = {
  // offrire il caffè a chi è al bancone
  offre: {
    caldo: ['Questo lo offro io, {X}!', 'Metti il {item} di {X} sul mio conto, per favore.'],
    ironico: ['Il {item} di {X} lo pago io. Così poi mi devi un favore.', 'Offro io. Non abituarti, {X}.'],
    timido: ['*fa un cenno al barista: il {item} di {X} è offerto*', 'Ehm... {X}... lo offro io. Se vuoi.'],
    brontolone: ['Lascia stare il portafoglio, {X}. Pago io.', 'Mh. Offro io. Non farne un caso.'],
    entusiasta: ['{X}! Fermati! Offro io!', 'Questo è mio! Cioè, lo pago io! Per {X}!']
  },
  // ricambiare: «l'altra volta hai offerto tu»
  ricambia: {
    caldo: ['L’altra volta hai offerto tu, {X}. Oggi tocca a me.', 'Il tuo {item} lo pago io. Te lo dovevo.'],
    ironico: ['Ti devo un caffè dall’altra volta. Ecco, siamo pari. Per ora.', 'Pago io, {X}. Odio avere debiti.'],
    timido: ['*paga anche per {X}, e poi arrossisce*', 'Oggi... offro io. L’altra volta sei stat{X:o} così gentile.'],
    brontolone: ['Oggi pago io. Siamo pari, {X}.', 'Lascia, lascia. Ti dovevo un caffè.'],
    entusiasta: ['Tocca a me! L’altra volta hai pagato tu! Giro mio!', 'Oggi offro io, {X}! Promessa mantenuta!']
  },
  // accettare
  si: {
    caldo: ['Grazie, {X}. Sei un tesoro.', 'Che pensiero gentile. Grazie davvero.'],
    ironico: ['Accetto. Ma solo perché insisti.', 'Grazie. Ti metto nel testamento.'],
    timido: ['Oh... grazie. *sorride, imbarazzat{o}*', 'Davvero? Grazie, {X}...'],
    brontolone: ['Mh. Grazie. Non dovevi.', 'Va bene, va bene. Grazie.'],
    entusiasta: ['Ma che carin{X:o}! Grazie!', 'Grazie {X}! Mi hai fatto la giornata!']
  },
  // rifiutare con gentilezza
  no: {
    caldo: ['No, figurati, {X}. Ma grazie del pensiero.', 'Grazie, ma oggi pago io. Davvero.'],
    ironico: ['No, grazie: poi dovrei esserti riconoscente.', 'Troppo gentile. Sospetto. Pago io.'],
    timido: ['No, no... non serve, grazie...', '*fa no con la testa, gentilmente*'],
    brontolone: ['Pago io. Non ho bisogno di elemosina.', 'No, grazie. Ognuno il suo.'],
    entusiasta: ['No dai, oggi offro io a te! Il prossimo!', 'Che dolce! Ma no, pago io!']
  },
  // «la prossima volta tocca a me»: una promessa
  promette: ['Grazie! Però la prossima volta offro io, eh. Promesso.', 'Accetto, ma la prossima è mia. Segnatelo.'],
  mantiene: ['Promessa è promessa, {X}: questo lo pago io.', 'Te l’avevo promesso: oggi offro io!'],
  dimentica: ['*paga solo per sé, senza accorgersi di {X}*'],
  // cedere il posto quando i tavoli sono pieni
  posto: {
    caldo: ['{X}! Siediti qui, io stavo per andare.', 'Prendi il mio posto, {X}. Io ho finito.'],
    ironico: ['{X}, ti cedo il trono. Trattalo bene.', 'Siediti, {X}. Tanto il mio caffè l’ho finito tre ore fa.'],
    timido: ['*si alza e indica la sedia a {X}*', 'Se vuoi... il mio posto... io vado.'],
    brontolone: ['Siediti, {X}. Io devo andare comunque.', 'Prendi la sedia. E non dire niente.'],
    entusiasta: ['{X}! Il mio posto è tuo! Vai, vai!', 'Siediti qui! Io corro via, ciao!']
  },
  postoSi: {
    caldo: ['Grazie, sei un angelo.', 'Che gentile. Grazie, davvero.'],
    ironico: ['Accetto il trono. Il regno è mio.', 'Grazie. Ti dedico il primo sorso.'],
    timido: ['Grazie... *si siede piano piano*', 'Oh... grazie mille.'],
    brontolone: ['Mh. Grazie. Le mie gambe ringraziano.', 'Grazie. Non era necessario. Ma grazie.'],
    entusiasta: ['Grazie! Sei il migliore!', 'Ma dai! Grazie grazie grazie!']
  },
  postoNo: {
    caldo: ['No, resta pure! Lo prendo da portare via.', 'Figurati, resta seduto tu. Grazie lo stesso.'],
    ironico: ['Resta, resta. Il mio caffè sa viaggiare.', 'Non ti scomodare. Bevo in piedi, come i cavalli.'],
    timido: ['No, no... resta tu... grazie...', '*fa no con la mano, sorridendo*'],
    brontolone: ['Resta lì. Non sono mica vecchio.', 'Non serve. Lo prendo da portare via.'],
    entusiasta: ['No dai! Resta! Ci vediamo dopo!', 'Tranquill{X:o}! Lo bevo camminando!']
  },
  // ombrello sotto la pioggia
  ombrello: ['Prendi il mio ombrello, {X}. Me lo ridai la prossima volta.', 'Con questo diluvio? Tieni il mio ombrello, {X}.'],
  ombrelloSi: ['Grazie! Te lo riporto, giuro.', 'Mi salvi la vita. Te lo ridò presto.'],
  ombrelloNo: ['No, grazie, corro. Mi piace la pioggia.', 'Tienilo tu, ti serve più che a me.'],
  dimenticato: ['Accidenti, ho dimenticato l’ombrello. E diluvia.', 'L’ombrello! L’ho lasciato a casa. Di nuovo.'],
  rende: ['Ecco il tuo ombrello, {X}. E un cornetto, per il disturbo.', 'Ti ho riportato l’ombrello. Asciutto e piegato bene.'],
  rendeR: ['Grazie! Non ci pensavo nemmeno più.', 'Il cornetto è il benvenuto. Grazie!'],
  chiede: ['{X}... il mio ombrello?', 'Ehi, {X}, ce l’hai ancora il mio ombrello?'],
  scusa: ['Oddio, l’ombrello! Domani te lo porto, giuro.', 'L’ho lasciato a casa! Che figura. Domani.']
};
// cosa pensano dopo (ad alta voce, da soli)
const CORT_PENSA = {
  grato: ['{X} mi ha offerto il caffè, l’altra volta. Che persona.', 'La prossima volta che vedo {X} offro io.'],
  sbilancio: ['Offro sempre io, con {X}. Sempre io.', 'Con {X} pago sempre io. Comincia a pesarmi un po’.'],
  sgarbo: [
    '{X} mi ha vist{o} in piedi e non si è nemmeno spostat{X:o}.',
    'Bah. Ci sono amici e amici. {X} non si è moss{X:o} di un millimetro.'
  ],
  ombrello: ['{X} ha ancora il mio ombrello.', 'Chissà se {X} si ricorda del mio ombrello.'],
  promessa: ['{X} mi aveva promesso un caffè. Lo sto ancora aspettando.']
};

// i ricordi delle gentilezze: cosa pensano dopo, e come compaiono nel Diario
Object.assign(PENSA.ric, {
  offerto: CORT_PENSA.grato,
  posto: ['{X} mi ha ceduto il posto, l’altra sera. Chi lo fa più, oggi?'],
  sbilancio: CORT_PENSA.sbilancio,
  sgarbo: CORT_PENSA.sgarbo,
  promessa: CORT_PENSA.promessa,
  ombrello: CORT_PENSA.ombrello
});
Object.assign(RIC_N, {
  offerto: 'il caffè offerto da {X}',
  posto: 'il posto ceduto da {X}',
  sbilancio: 'i caffè sempre offerti a {X}',
  sgarbo: 'quando {X} non si è spostat{X:o}',
  promessa: 'una promessa di {X} non mantenuta',
  ombrello: 'l’ombrello prestato a {X}'
});
