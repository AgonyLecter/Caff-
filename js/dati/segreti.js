// Segreti da scoprire (EGGS) e visitatori rari (RARE).

const EGGS = [
  { id: 'macchina', n: 'Una macchina da sogno', h: "Personalizza la macchina del caffè con tutto quello che c'è nel negozio." },
  { id: 'punta', n: "Mani d'oro", h: "Nell'ora di punta, servi tu venti clienti di fila senza farne scappare nessuno." },
  { id: 'premura', n: 'Sempre presente', h: 'Accorgiti di quello che serve ai tuoi clienti. Cinquanta volte.' },
  { id: 'luna', n: "La luna fa l'occhiolino", h: 'Di notte guarda bene la luna. E insisti.' },
  { id: 'zampe', n: 'Amici a quattro zampe', h: 'Quando i padroni si siedono, gli animali vanno a conoscersi. Lasciali fare.' },
  { id: 'soffio', n: 'Il re del bancone', h: 'Il gatto del locale ha un carattere. Prova a fargli conoscere un cane.' },
  { id: 'cuccioli', n: 'Amico degli animali', h: 'Alcuni clienti non vengono da soli. Fagli una carezza... a cinque diversi.' },
  { id: 'stella', n: 'Un desiderio', h: 'Nelle notti serene passa una stella cadente. Prendila al volo.' },
  { id: 'disegno', n: 'Disegni sul vetro', h: 'Quando il vetro è appannato, prova a toccarlo in basso.' },
  { id: 'saluto', n: 'Ciao, passante!', h: 'Bussa al vetro proprio quando passa qualcuno.' },
  { id: 'insegna', n: 'Neon arcobaleno', h: "L'insegna non ama essere toccata. Troppe volte di fila." },
  { id: 'aperto', n: 'Chiuso per pisolino', h: 'Il cartello sopra la porta nasconde un segreto.' },
  { id: 'campanello', n: 'Concerto di campanelli', h: 'Il campanello della porta suona benissimo. Tante volte.' },
  { id: 'lavagna', n: 'Il pensiero del giorno', h: 'La lavagna aspetta una frase scritta da te.' },
  { id: 'radio', n: 'Tutte le stazioni', h: 'Tocca il giradischi finché non hai sentito ogni stazione.' },
  { id: 'fiore', n: 'Pollice verde', h: 'Anche le piante hanno sete.' },
  { id: 'pausa', n: 'Pausa caffè', h: "Quando non c'è nessuno al bancone, tocca la macchina del caffè." },
  { id: 'sbuffo', n: 'Macchina offesa', h: 'Non maltrattare la macchina del caffè...' },
  { id: 'gatto', n: "Pancia all'aria", h: 'Il gatto adora le coccole. Tante coccole.' },
  { id: 'randagio', n: 'Il gatto alla finestra', h: 'Certe notti qualcuno ti guarda dal davanzale.' },
  { id: 'lampada', n: 'Lampadari danzanti', h: 'Le lampade oscillano, se le tocchi. Tutte.' },
  { id: 'ombrello', n: 'Ombrello ribelle', h: 'Il portaombrelli vicino alla porta ha voglia di giocare.' },
  { id: 'pesci', n: 'Ora di pranzo', h: "I pesci dell'acquario hanno fame." },
  { id: 'nome', n: 'Nome speciale', h: "Certi nomi sull'insegna fanno succedere cose." },
  { id: 'mezzanotte', n: 'Mezzanotte', h: 'Resta aperto fino a mezzanotte.' },
  { id: 'v_detective', n: 'Il detective', h: 'Una visita rara, nelle notti di pioggia.' },
  { id: 'v_viaggiatore', n: 'Il viaggiatore', h: 'Una visita rara. Da dove arriva? Anzi: da quando?' },
  { id: 'v_astronauta', n: "L'astronauta", h: 'Una visita rara, nelle notti serene.' },
  { id: 'v_strega', n: 'La strega gentile', h: "Una visita rara, quando c'è nebbia." },
  { id: 'v_babbo', n: 'Il signore con la barba bianca', h: 'Una visita rara, quando nevica.' },
  { id: 'v_fantasma', n: 'Il fantasma', h: 'Una visita rara, quando va via la luce.' }
];
const RARE = {
  detective: {
    n: 'Il detective',
    w: () => rainy() && nightF() > 0.5,
    look: { s: '#eab88f', h: '#3b2418', hs: 0, o: 4, c1: '#8a6a4a', c2: '#3a2f2a', a: 'barba' },
    l: [
      [0, '*si scrolla la pioggia dal cappotto*'],
      [0, 'Tre giorni che piove. Tre giorni che cerco la stessa persona.'],
      [0, 'Ma stanotte no. Stanotte solo un caffè. Nero, come il mio umore.'],
      [0, "...Anzi, mettici un po' di latte. Sono stanco di fare il duro."]
    ]
  },
  viaggiatore: {
    n: 'Il viaggiatore',
    w: () => true,
    look: { s: '#f6d2b0', h: '#ece3d2', hs: 7, o: 2, c1: '#4ff0ff', c2: '#2b2d42', a: 'occhiali' },
    l: [
      [0, 'Scusi... che anno è?'],
      [0, '...Ah. Allora sono in anticipo. Di parecchio.'],
      [0, "Da dove vengo io questo locale è famosissimo. C'è perfino una targa, fuori."],
      [0, 'Non posso dire altro. Però ascolti me: prenda più tavoli.']
    ]
  },
  astronauta: {
    n: "L'astronauta",
    w: () => !rainy() && curWx() !== 'nebbia' && nightF() > 0.5,
    look: { s: '#c98d63', h: '#1b1420', hs: 1, o: 3, c1: '#f4f1de', c2: '#c0c0d0', a: '' },
    l: [
      [0, 'Sei mesi in orbita. Sapete cosa mi mancava di più?'],
      [0, 'La famiglia, certo. Ma subito dopo: questo.'],
      [0, '*annusa il caffè con gli occhi chiusi*'],
      [0, 'Lassù il caffè galleggia in bolle. Qui sta fermo nella tazza. Che lusso.']
    ]
  },
  strega: {
    n: 'La strega gentile',
    w: () => curWx() === 'nebbia',
    look: { s: '#f9e0c9', h: '#9b6bff', hs: 6, o: 3, c1: '#2b2d42', c2: '#6d597a', a: 'orecchino' },
    l: [
      [0, '*appoggia un cappello a punta sulla sedia accanto*'],
      [0, 'Tranquilli, niente incantesimi. Non il martedì.'],
      [0, 'Ho letto i fondi del caffè. Dicono che questo posto porterà fortuna a molti.'],
      [0, 'E che il vero proprietario è il gatto. Ma questo lo sapevate già.']
    ]
  },
  babbo: {
    n: 'Il signore con la barba bianca',
    w: () => curWx() === 'neve',
    look: { s: '#f6d2b0', h: '#f4f1de', hs: 5, o: 4, c1: '#e63946', c2: '#e63946', a: 'barba' },
    l: [
      [0, 'Oh oh... cioè, buonasera.'],
      [0, 'Una cioccolata calda, per favore. Anzi nove: otto da portare via.'],
      [0, 'Sono per dei colleghi che aspettano fuori. Hanno le corna, ma sono simpatici.'],
      [0, "*lascia un pacchetto sul tavolo* Per il locale. Siete stati bravi, quest'anno."]
    ]
  },
  fantasma: {
    n: 'Il fantasma',
    w: () => blackout(),
    look: { s: '#e8f0ff', h: '#e8f0ff', hs: 4, o: 1, c1: '#e8f0ff', c2: '#d0dcf0', a: '' },
    l: [
      [0, '*la candela sul tavolo trema*'],
      [0, 'Non abbiate paura. Venivo qui nel 1952, quando era una latteria.'],
      [0, 'Ogni volta che va via la luce torno a vedere cosa è diventato.'],
      [0, "*sorride* Molto meglio. Ma la panna di allora... quella era un'altra cosa."]
    ]
  }
};
