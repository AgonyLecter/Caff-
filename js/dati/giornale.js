// Il giornale del caffè (il motore è in js/motore/giornale.js): finita la storia di Corrado, ogni tre giorni esce
// un numero scritto guardando il mondo: prima pagina, cronaca, dicerie (non sempre vere), sogni, quartiere,
// curiosità, annunci (a cui qualcuno risponde), meteo e il corsivo di Corrado. I clienti lo leggono e ne parlano.
// Segnaposti: {X} {Y} persone, {P} un progetto, {T} titolo di una storia, {Q} il quartiere, {n} {g} {v} numeri.

const GZ_NOMI = { pioggia: 'La Gazzetta della Pioggia', bancone: 'Il Bancone', tazzina: 'La Tazzina' };

// titoli per tipo di notizia (t) e due righe di pezzo (x)
const GZ_PEZZI = {
  fidanzati: {
    t: ['«Sì!» tra un cappuccino e l’altro: {X} e {Y} si sposano', 'Fiori d’arancio al tavolo vicino alla finestra'],
    x: ['Testimoni oculari parlano di un ginocchio a terra e di una tazzina rovesciata per l’emozione. Auguri da tutta la redazione.']
  },
  coppia: {
    t: ['Amore al caffè: {X} e {Y} fanno coppia', 'Due tazze, un tavolo, un cuore: {X} e {Y}'],
    x: ['Da qualche giorno arrivano insieme e ordinano senza guardare il menu. La redazione approva.']
  },
  pace: {
    t: ['Fine delle ostilità tra {X} e {Y}', 'Pace fatta: {X} e {Y} ora si salutano'],
    x: ['Dopo settimane di sguardi storti, una tregua firmata con un biscotto. Il quartiere tira un sospiro di sollievo.']
  },
  migliori: {
    t: ['Inseparabili: {X} e {Y}', '{X} e {Y}, amicizia da prima pagina'],
    x: ['Si finiscono le frasi a vicenda e si rubano i biscotti senza chiedere. Segno inequivocabile.']
  },
  successo: {
    t: ['{X} ce l’ha fatta: {P}, missione compiuta', 'Traguardo per {X}: {P}'],
    x: ['Chi frequenta il caffè lo sapeva da settimane. Adesso è ufficiale. Brindiamo, con moderazione.']
  },
  delusione: {
    t: ['{X} non molla: «{P}, ci riprovo»', 'Una battuta d’arresto per {X}, non una sconfitta'],
    x: ['Questa volta non è andata. Ma chi conosce {X} sa che il prossimo capitolo è già cominciato.']
  },
  trama: {
    t: ['{T}: una storia nata al caffè', 'Dal nostro tavolo: «{T}»'],
    x: []
  },
  habitue: {
    t: ['Benvenuti tra i fedelissimi: {X}', 'Nuovi volti di casa: {X}'],
    x: ['Lo si riconosce dal fatto che il barista prepara l’ordine prima che apra bocca.']
  },
  storia: {
    t: ['Si chiude un capitolo: «{T}»', 'Il finale che aspettavamo: «{T}»'],
    x: ['Chi c’era ne parlerà a lungo. Chi non c’era, chieda al barista: sa tutto, ma non dice niente.']
  },
  quartiere: {
    t: ['Dal quartiere: {Q}'],
    x: []
  }
};
// in prima pagina va la notizia più importante
const GZ_PESO = { fidanzati: 9, successo: 7, storia: 7, coppia: 6, trama: 6, pace: 5, migliori: 4, delusione: 3, quartiere: 3, habitue: 2 };

// dicerie: vere (dai legami veri) o no (inventate dal bancone); le false vengono smentite
const GZ_DICERIE = {
  cotta: [
    'Si mormora che {X} arrossisca ogni volta che entra {Y}. Noi non diciamo niente. Quasi.',
    'Fonti vicine allo zuccheriero riferiscono di sguardi tra {X} e {Y}.'
  ],
  litigio: [
    'Aria tesa tra {X} e {Y}, l’altra sera. Speriamo nel prossimo cornetto.',
    'Si dice che {X} e {Y} abbiano bisticciato. Il motivo? Un cornetto, pare. O forse no.'
  ],
  falsa: [
    'Qualcuno giura di aver visto {X} e {Y} dividere un cornetto. Sarà vero?',
    'Voci di corridoio (il corridoio è quello del bagno): {X} e {Y} partono insieme per Parigi.',
    'Pare che {X} abbia regalato a {Y} un mazzo di fiori. Gialli. Indagheremo.'
  ]
};
const GZ_SMENTITA = [
  'Smentita: {X} ci scrive che con {Y} «non c’è niente, figuriamoci». Ne prendiamo atto, con un sorriso.',
  'Rettifica: tra {X} e {Y} non c’è nessuna storia. Ce lo ha detto {X}, piuttosto offes{X:o}.'
];
// cosa dice chi legge
const GZ_LETTORI = {
  legge: [
    '*legge il giornale del caffè, ridacchiando*',
    'Questo Corrado scrive bene. Peccato le virgole.',
    '*ritaglia un pezzo del giornale e se lo mette in tasca*',
    'Hai visto il giornale? «{T}». Lo sapevo!'
  ],
  citato: [
    'Sono finit{o} sul giornale! Mia madre lo incornicia.',
    'Hanno scritto di me! Corrado, ti devo un caffè.',
    '*rilegge tre volte il pezzo su di sé, tutt{o} ross{o}*'
  ],
  smentisce: [
    'Io e {Y}? Ma figuriamoci! Corrado deve cambiare occhiali.',
    'Chi ha messo in giro quella storia su me e {Y}? Voglio una smentita!'
  ],
  arrossisce: ['Come fa Corrado a sapere di me e {Y}? Non l’ho detto a nessuno!', '*nasconde la faccia dietro il giornale*'],
  annuncio: [
    'Ho risposto all’annuncio di {Y} sul giornale. Ci vediamo sabato!',
    'Grazie al giornale ho conosciuto {Y}. Chi l’avrebbe detto.'
  ]
};
// curiosità coi numeri del caffè
const GZ_CURIOSITA = {
  serviti: ['Dall’ultimo numero il bancone ha servito {n} tra caffè, dolci e altre meraviglie.'],
  fedele: ['Il cliente più fedele: {X}, con {v} visite. Ha già un posto col suo nome? Non ancora, ma ci stiamo pensando.'],
  coppie: ['Legami nati qui dentro: {n}. Coppie: {g}. Il caffè, si sa, avvicina.'],
  gatto: ['Il gatto del bancone ha dormito, a nostra stima, diciannove ore al giorno. Nessun commento.'],
  anziana: ['L’amicizia più antica del locale: {X} e {Y}, che si conoscono da {g} giorni.']
};
// annunci: chi insegue un progetto cerca qualcuno con la stessa passione
const GZ_ANNUNCI = {
  sport: 'Cercasi compagno o compagna di corsa, ritmo lento, chiacchiere veloci. Rivolgersi a {X}.',
  studio: 'Cercasi compagni di studio per serate tranquille al tavolo in fondo. Chiedere di {X}.',
  libri: 'Cercasi lettori per un piccolo gruppo di lettura. Il primo libro lo sceglie {X}.',
  musica: 'Cercasi qualcuno con cui suonare, anche male. Firmato: {X}.',
  viaggi: 'Cercasi compagni di viaggio per un treno a caso, una domenica qualsiasi. Info da {X}.',
  arte: 'Cercasi modelli pazienti per ritratti al tavolo. Paga in biscotti. {X}.',
  cibo: 'Cercasi assaggiatori coraggiosi per ricette sperimentali. Contattare {X}.',
  animali: 'Cercasi qualcuno che ami i cani quanto {X}, per passeggiate al parco.',
  lavoro: 'Cercasi consigli e incoraggiamenti per un nuovo inizio. Offre il caffè {X}.',
  ricordi: 'Cercasi chi si ricordi il quartiere di una volta, per due chiacchiere con {X}.',
  stelle: 'Cercasi compagni per guardare le stelle dal tetto, nuvole permettendo. {X}.',
  giochi: 'Cercasi avversari per partite a carte e scacchi. Si perde con dignità. {X}.',
  film: 'Cercasi compagnia per il cinema dell’angolo, primo spettacolo. {X}.',
  amore: 'Cercasi... no, questo è un annuncio troppo personale. {X} ci ha ripensato.',
  pettegolezzi: 'Cercasi orecchie attente per le novità del quartiere. Chiedere a {X}.'
};
const GZ_RISPOSTA = [
  'All’annuncio di {X} ha risposto {Y}. Pare che si siano già dati appuntamento.',
  'Annuncio riuscito: {X} e {Y} si sono conosciuti grazie a queste pagine.'
];
// il meteo di domani, secondo Corrado
const GZ_METEO = {
  sereno: 'Domani sole. Portate gli occhiali scuri e una scusa per restare al caffè lo stesso.',
  nuvoloso: 'Domani nuvole. Niente di grave: il caffè le scioglie.',
  pioggia: 'Domani pioggia. Che notizia, direte voi. Ombrello e buonumore.',
  temporale: 'Domani temporale. I tuoni li sentiamo noi, voi restate al caldo.',
  nebbia: 'Domani nebbia. Se non trovate la porta, seguite il profumo del caffè.',
  neve: 'Domani neve! Cioccolata calda per tutti, e un pupazzo davanti alla vetrina.'
};
// il corsivo di Corrado: una riga in fondo, ogni numero diversa
const GZ_CORSIVO = [
  'Ho fatto il giornalista per trentacinque anni. Non ho mai scritto così tante notizie belle come in questo caffè.',
  'Una città si misura da quante persone si salutano per nome. Qui dentro siamo a buon punto.',
  'Le dicerie sono il dolce del giornale: si leggono per ultime, e non fanno bene. Ma una ogni tanto...',
  'Mia moglie dice che passo più tempo qui che a casa. Le ho risposto che qui c’è più da raccontare. Stasera dormo sul divano.',
  'Se avete una notizia, lasciatela nel barattolo delle mance. Se avete una mancia, anche.',
  'La pioggia è il miglior caporedattore: tiene tutti al chiuso, a raccontarsi le cose.'
];

// i ricordi legati al giornale
Object.assign(PENSA.ric, {
  annuncio: ['Ho conosciuto {X} grazie a un annuncio sul giornale. Il mondo è piccolo, il quartiere ancora di più.'],
  diceria: ['Quel giornale ha scritto una sciocchezza su di me. Corrado mi deve un caffè.']
});
Object.assign(RIC_N, { annuncio: 'quando ha conosciuto {X} grazie al giornale', diceria: 'la diceria di {X} sul giornale' });
