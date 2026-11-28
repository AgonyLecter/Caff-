// Voci della «mente» dei personaggi (il motore è in js/motore/mente.js).
// Qui ci sono solo contenuti: com'è fatto ogni carattere, di cosa gli piace parlare, e le parole che usa.
//
// Segnaposti nelle frasi:
//   {B}     l'altra persona della conversazione (rispetto a chi sta parlando in quella riga)
//   {X} {Y} altre persone (di cui si parla, o chi si saluta)
//   {item}  quello che sta bevendo chi parla      {giorni}  giorni passati (da quando si sono visti / conosciuti)
//   {meteo} il tempo del giorno in cui si sono conosciuti («pioveva», «nevicava»…)
//   {nome}  il nome del locale      {v}  quante volte è venuto      {o}  «o» o «a» secondo il nome di chi parla
// Le frasi tra *asterischi* sono gesti.
// Nelle frasi a due (conversazioni) non usare lui/lei per l'altra persona: il nome, o frasi neutre.

/* ---------------- Carattere ---------------- */
// Ogni persona ha 8 «manopole» da 0 a 1:
// soc socievolezza, cal calore, iro ironia, sens sensibilità, ape curiosità, rom romanticismo, bro brontolio, ene energia.
// I tratti (TRAITS) e il tipo di cliente spostano le manopole; ogni persona poi ha un suo piccolo scarto fisso.
const TRATTI_P = {
  romantico: { rom: 0.85, cal: 0.65, sens: 0.65 },
  chiacchierone: { soc: 0.9, ene: 0.7, iro: 0.55 },
  timido: { soc: 0.15, sens: 0.7, ene: 0.35 },
  brontolone: { bro: 0.95, cal: 0.35, iro: 0.6 },
  artista: { ape: 0.85, sens: 0.7 },
  sportivo: { ene: 0.9, soc: 0.65 },
  sognatore: { ape: 0.75, rom: 0.6, sens: 0.6, ene: 0.4 },
  nerd: { ape: 0.7, soc: 0.35, iro: 0.65 }
};
const TIPO_P = {
  studente: { ape: 0.6, ene: 0.55 },
  fretta: { ene: 0.8, cal: 0.4 },
  turista: { ape: 0.75, ene: 0.65 },
  nonno: { cal: 0.65, ene: 0.3, bro: 0.35 },
  lettore: { soc: 0.35, ape: 0.6 },
  nottambulo: { sens: 0.6, ene: 0.4 },
  artista: { ape: 0.8 },
  musicista: { ape: 0.7, soc: 0.6 },
  influencer: { soc: 0.85, ene: 0.75 },
  critico: { bro: 0.5, iro: 0.6 }
};
// di cosa ama parlare: dai tratti e dal tipo
const TRATTI_INT = {
  romantico: ['amore', 'film'],
  chiacchierone: ['pettegolezzi', 'cibo'],
  timido: ['libri', 'animali'],
  brontolone: ['lavoro', 'calcio'],
  artista: ['arte', 'musica'],
  sportivo: ['sport', 'cibo'],
  sognatore: ['viaggi', 'stelle'],
  nerd: ['giochi', 'libri']
};
const TIPO_INT = {
  studente: ['studio'],
  fretta: ['lavoro'],
  turista: ['viaggi'],
  nonno: ['ricordi', 'calcio'],
  lettore: ['libri'],
  nottambulo: ['stelle'],
  artista: ['arte'],
  musicista: ['musica'],
  influencer: ['film']
};
// Coppie di tratti che vanno particolarmente d'accordo (positivo) o si pestano i piedi (negativo).
const AFF_TR = {
  'artista|sognatore': 0.35,
  'nerd|nerd': 0.3,
  'romantico|sognatore': 0.3,
  'chiacchierone|timido': 0.15,
  'brontolone|brontolone': -0.15,
  'brontolone|chiacchierone': -0.3,
  'brontolone|sognatore': -0.15,
  'sportivo|sportivo': 0.25,
  'nerd|sportivo': -0.1,
  'artista|artista': 0.2,
  'timido|timido': 0.1
};
// Come parlano i personaggi chiave: tratti in più rispetto a KEYS, interessi propri e (facoltativo) le manopole.
// OGNI personaggio chiave nuovo va aggiunto qui (il test lo controlla).
const MENTI_K = {
  corrado: { int: ['pettegolezzi', 'libri', 'ricordi'], p: { ape: 0.9, soc: 0.7, cal: 0.7 } },
  leo: { int: ['giochi', 'ricordi', 'studio'] },
  alice: { int: ['libri', 'studio', 'stelle'], p: { cal: 0.8 } },
  davide: { int: ['lavoro', 'libri'], p: { sens: 0.85 } },
  yusuf: { int: ['cibo', 'viaggi', 'lavoro'], p: { cal: 0.8 } },
  mia: { int: ['arte', 'amore', 'musica'] },
  luca: { int: ['musica', 'amore', 'stelle'] },
  marta: { int: ['sport', 'cibo', 'pettegolezzi'] },
  gio: { int: ['ricordi', 'calcio', 'amore'] },
  bruni: { int: ['libri', 'ricordi', 'giochi'] },
  sara: { int: ['lavoro', 'sport', 'animali'], p: { cal: 0.85 } },
  pietro: { int: ['sport', 'animali', 'lavoro'] },
  kenji: { int: ['viaggi', 'cibo', 'arte'] },
  rosa: { int: ['ricordi', 'cibo', 'pettegolezzi'], p: { cal: 0.95, iro: 0.6 } },
  dario: { int: ['lavoro', 'sport', 'calcio'] },
  elio: { int: ['libri', 'stelle', 'giochi'] },
  aldo: { int: ['giochi', 'ricordi', 'calcio'], p: { cal: 0.8 } },
  giada: { int: ['arte', 'giochi', 'animali'] },
  tommy: { int: ['film', 'musica', 'pettegolezzi'], p: { iro: 0.95 } },
  irene: { int: ['libri', 'studio', 'animali'] },
  nora: { int: ['sport', 'viaggi', 'amore'] },
  ugo: { int: ['pettegolezzi', 'amore', 'cibo'] },
  vittoria: { int: ['arte', 'ricordi', 'musica'] }
};
// come descrivere il carattere nel Diario (la manopola più alta di ognuna)
const CAR_N = {
  soc: ['solitari{o}', 'socievole'],
  cal: ['riservat{o}', 'affettuos{o}'],
  iro: ['seri{o}', 'spiritos{o}'],
  sens: ['tranquill{o}', 'sensibile'],
  ape: ['abitudinari{o}', 'curios{o}'],
  rom: ['concret{o}', 'romantic{o}'],
  bro: ['gentile', 'brontolone'],
  ene: ['calm{o}', 'energic{o}']
};
const UMORE_N = ['giù di morale', 'pensieros{o}', 'tranquill{o}', 'seren{o}', 'felice'];

/* ---------------- Stili di risposta ---------------- */
// Ogni persona risponde con uno di questi stili (dal carattere): caldo, ironico, timido, brontolone, entusiasta.
// Risposte generiche, quando l'argomento interessa (si) o non interessa (no).
const RISP = {
  si: {
    caldo: [
      'Mi piace quando parli di queste cose, {B}.',
      'Dimmi di più. Davvero.',
      'Lo sai che la penso come te?',
      'Mi hai fatto venire voglia di parlarne per ore.',
      'Che bello avere qualcuno con cui condividerlo.'
    ],
    ironico: [
      'Finalmente un argomento serio.',
      'Ecco. Adesso sì che si ragiona.',
      'Va bene, mi hai preso. Continua.',
      'Sei una persona pericolosa. Mi capisci troppo.',
      'Mi hai convinto. Ed è difficile.'
    ],
    timido: [
      '*annuisce, e si avvicina un po’*',
      'Anche a me... piace tanto.',
      '*sorride alla tazza* Sì.',
      '*si illumina* Davvero?',
      'Non lo dico mai a nessuno, ma... anche io.'
    ],
    brontolone: [
      'Hmpf. Su questo hai ragione.',
      'Per una volta siamo d’accordo. Segnatelo.',
      'Non dirlo in giro, ma mi interessa.',
      'Mh. Finalmente qualcuno con un po’ di sale in zucca.',
      'Va bene. Questo argomento lo approvo.'
    ],
    entusiasta: [
      'Ma dai! Io ADORO questa cosa!',
      'Sìììì, parliamone per ore!',
      'Lo sapevo che eri dei nostri, {B}!',
      'Abbiamo un sacco di cose in comune!',
      'Ecco perché mi stai simpatic{o}!'
    ]
  },
  no: {
    caldo: [
      'Non ne so niente, ma mi piace sentirti.',
      'Spiegamelo, che voglio capire.',
      'Non è il mio campo. Però dimmi.',
      'Non ci avevo mai pensato. Mi incuriosisci.',
      'Mi piace come ti brillano gli occhi quando ne parli.'
    ],
    ironico: [
      'Affascinante. Credo.',
      'Annuisco, così sembro competente.',
      'Ti seguo. Più o meno. Meno.',
      'Prendo appunti. Mentalmente. Forse.',
      'Interessantissimo. Quasi quanto le istruzioni del frigo.'
    ],
    timido: [
      'Ah... sì?',
      '*fa sì con la testa, un po’ persa*',
      'Non me ne intendo, scusa.',
      '*sorride, senza sapere cosa dire*',
      'Mi... mi spieghi meglio?'
    ],
    brontolone: [
      'Mah.',
      'E a me cosa dovrebbe importare?',
      'Cambiamo argomento, ti prego.',
      'Questa roba non fa per me. Ma tu continua.',
      'Ne parli come se fosse importante. Mah.'
    ],
    entusiasta: [
      'Non ci capisco niente ma che bello!',
      'Insegnami! Subito!',
      'Wow. Cioè... cos’è?',
      'Ok, da domani mi appassiono anch’io!',
      'Non ne so niente ma adesso voglio saperlo!'
    ]
  }
};
// Saluti di apertura: a quanti giorni dall'ultima volta, e a che punto è il legame.
const APRI = {
  spesso: {
    amici: ['Eccoti, {B}.', 'Sempre qui, eh?', 'Ti stavo aspettando, {B}.', 'Il solito tavolo, la solita compagnia.'],
    amore: ['Ciao, tu.', '*si illumina appena vede {B}*', 'Ti ho tenuto il posto.', 'Ciao... ti trovo bene.'],
    cono: ['Oh, ciao {B}!', 'Ci si rivede!', 'Ehi, ancora qui anche tu?'],
    rivali: ['Ah. Sei tu.', 'Di nuovo tu, {B}.', 'Che sorpresa. Non piacevole.'],
    famiglia: ['Hai mangiato, {B}?', 'Ti vedo stanc{o}... no, sono io che sono stanc{o}.', 'Eccoti. Siediti, su.']
  },
  lontani: {
    amici: [
      '{B}! Quanto tempo! Saranno {giorni} giorni!',
      'Ma dov’eri finit{o}? Mi sei mancat{o}.',
      'Pensavo ti fossi dimenticat{o} di noi.'
    ],
    amore: ['{giorni} giorni senza vederti. Li ho contati.', 'Finalmente. Mi mancavi, {B}.', 'Non sparire più così, va bene?'],
    cono: ['Tu sei {B}, vero? Quanto tempo!', 'Ehi, ti ricordavo! Che bello rivederti.'],
    rivali: ['Speravo te ne fossi andat{o} dalla città.', '{giorni} giorni di pace. Finiti.'],
    famiglia: ['Non ti fai mai sentire, {B}.', 'Finalmente! Stavo per chiamare la polizia.']
  }
};
// la risposta al saluto: tra chi si conosce poco (cono) e tra chi si vuole bene (vicini)
const APRI_R = {
  cono: {
    caldo: ['Ciao! Che piacere.', 'Ciao, {B}! Siediti pure.', 'Oh, che bello vederti.', 'Ciao! Com’è andata oggi?'],
    ironico: [
      'Ci rivediamo. Il destino o il caffè?',
      'Sempre più spesso, noi due. Sospetto.',
      'Ciao. Ti avverto, oggi sono brillante.',
      'Eccoci. I soliti sospetti.'
    ],
    timido: ['Ciao... *sorride*', 'Oh, ciao {B}.', '*fa un piccolo cenno con la mano*', 'Ciao... sì, anch’io qui.'],
    brontolone: ['Sì, sì. Ciao.', 'Mh. Ciao anche a te.', 'Ciao. Ma piano con le chiacchiere.', 'Oh. Ciao.'],
    entusiasta: [
      'Ciao! Che bello rivederti!',
      'Ehi, {B}! Sapevo che saresti passat{o} anche tu!',
      'Ciaoo! Siediti, siediti!',
      'Che coincidenza! Cioè, non proprio, ma che bello!'
    ]
  },
  vicini: {
    caldo: [
      'Ciao! Che bello vederti.',
      'Mi fa piacere, davvero.',
      'Anche tu mi sei mancat{o}.',
      'Eccoti. Adesso la giornata è completa.',
      'Ti ho pensato oggi, sai?'
    ],
    ironico: [
      'Purtroppo per te, sì.',
      'Non riesci a stare senza di me, eh?',
      'Sono un’abitudine difficile da perdere.',
      'Puntuale come le tasse.',
      'Ti ho tenuto il broncio per un minuto. Ora basta.'
    ],
    timido: [
      '*sorride tanto, senza dire niente*',
      'Ciao... sono content{o} che sei qui.',
      '*si sposta per fare spazio*',
      'Speravo di vederti.'
    ],
    brontolone: [
      'Era ora. Ti stavo aspettando. Cioè, no. Sì.',
      'Non farla lunga. Siediti.',
      'Mh. Il tuo posto è libero. Per caso.',
      'Ciao, testone.'
    ],
    entusiasta: [
      '{B}!!! Vieni qui!',
      'La mia persona preferita!',
      'Che bello! Ti devo raccontare un sacco di cose!',
      'Finalmente! Ti aspettavo da tutto il giorno!',
      'Ciaooo! Abbraccio! Subito!'
    ]
  }
};
// prima volta che due persone si parlano (in aggiunta alle scenette di REL.intro)
const PRIMA = {
  a: {
    caldo: ['Scusa, ti vedo sempre qui. Posso farti compagnia?', 'Ciao! Io sono {A}. Ti dispiace se scambiamo due parole?'],
    ironico: [
      'Statisticamente, prima o poi dovevamo parlarci. Io sono {A}.',
      'Ti ho visto ordinare il {item}. Persona di gusto. Sono {A}.'
    ],
    timido: ['Ehm... scusa... è libero qui?', '*si siede, poi si accorge di non aver chiesto* Oh. Scusa. Sono {A}.'],
    brontolone: ['Gli altri tavoli sono pieni. Non è niente di personale.', 'Mi siedo qui. Non parlo molto, avverto.'],
    entusiasta: ['Ciao! Che bel posto, vero? Io sono {A}, tu?', 'Ehi! Ci vediamo sempre e non ci siamo mai presentati!']
  },
  r: {
    caldo: ['Ma certo. Io sono {A}, piacere.', 'Con piacere. Mi chiamo {A}.'],
    ironico: ['Ammiro la sincerità. {A}, piacere.', 'Era ora. Io sono {A}, e il tavolo è mio. Scherzo.'],
    timido: ['*arrossisce* Io sono {A}...', 'Oh... sì, certo. {A}. Piacere.'],
    brontolone: ['Meglio. Nemmeno io. {A}.', 'Mh. {A}. Basta che non mi rubi lo zucchero.'],
    entusiasta: ['{A}! Piacerissimo!', 'Finalmente! Io sono {A}, e sapevo che saremmo andati d’accordo!']
  }
};
const CHIUDI = {
  caldo: ['È sempre bello parlare con te.', 'Grazie, {B}. Mi serviva.', 'Mi fai stare bene, lo sai?', 'Dobbiamo farlo più spesso.'],
  ironico: [
    'Bene. Abbiamo risolto il mondo. Ora il caffè.',
    'Questa conversazione verrà ricordata nei libri.',
    'Ok, basta essere profondi. Mi viene il mal di testa.',
    'Segno tutto sul diario segreto.'
  ],
  timido: [
    '*sorride, e beve un sorso per nascondersi*',
    'Grazie... per avermi ascoltat{o}.',
    '*annuisce, con le mani strette attorno alla tazza*',
    'Mi piace parlare con te. Non lo dico a tutti.'
  ],
  brontolone: [
    'Va bene. Basta parlare, si raffredda.',
    'Mh. Non è stato male.',
    'Comunque avevo ragione io. Su tutto.',
    'Ecco. Adesso lasciami bere in pace. Ma resta.'
  ],
  entusiasta: [
    'La prossima volta continuiamo, eh!',
    'Che bello! Facciamolo più spesso!',
    'Ho già voglia di rivederti!',
    'Questa è stata la parte migliore della giornata!'
  ]
};

/* ---------------- Argomenti ---------------- */
// Per ogni argomento: a = come lo tira fuori chi parla, si = risposte di chi ne è appassionato,
// solo = cosa pensa ad alta voce quando è da solo. Le risposte di chi non è interessato sono in RISP.no.
const TEMI = {
  amore: {
    a: [
      'Credi nei colpi di fulmine, {B}?',
      'Ieri ho visto due vecchietti tenersi per mano alla fermata. Mi ha fatto bene.',
      'Secondo te come si capisce che è la persona giusta?'
    ],
    si: [
      'Io sì. Ma solo ai colpi di fulmine lenti.',
      'Si capisce quando anche il silenzio è comodo.',
      'Che belli. Io voglio diventare così.'
    ],
    solo: [
      '*guarda una coppia passare sotto la pioggia, con un ombrello solo*',
      'Chissà se anche a me capiterà un amore da film. Magari meno drammatico.'
    ]
  },
  film: {
    a: [
      'Hai visto il film nuovo al cinema dell’angolo?',
      'Dimmi il tuo film preferito e ti dico chi sei.',
      'Ieri ho pianto alla fine di un cartone animato. Senza vergogna.'
    ],
    si: [
      'Visto due volte. La seconda ho capito il finale.',
      'Il mio cambia ogni settimana. Questa settimana è una commedia.',
      'Anche io! Quello col cane, vero? Distrutt{o}.'
    ],
    solo: ['Questa pioggia sembra la scena finale di un film.', 'Se la mia vita fosse un film, questa sarebbe la scena del caffè.']
  },
  pettegolezzi: {
    a: [
      'Hai notato che il barista sorride di più ultimamente?',
      'Secondo me quei due al tavolo in fondo si piacciono.',
      'Ho sentito delle cose al mercato... ma non posso dire niente. Va bene, dico.'
    ],
    si: ['Racconta. Subito. Tutto.', 'Lo sapevo! Lo sapevo!', 'Non dirmelo... no, dimmelo.'],
    solo: ['*ascolta il tavolo accanto facendo finta di leggere*', 'In questo locale succedono più cose che in una telenovela.']
  },
  cibo: {
    a: [
      'Ho provato a fare il pane in casa. È venuto un mattone. Buono, però.',
      'Qual è il dolce perfetto per una sera di pioggia?',
      'Secondo me il cornetto va inzuppato. Sempre.'
    ],
    si: [
      'Torta di mele. Calda. Non si discute.',
      'Inzuppato, ovvio. Chi non inzuppa non ha un’anima.',
      'Mi mandi la ricetta? Prometto di bruciarla con amore.'
    ],
    solo: ['Quasi quasi prendo un dolce. Quasi.', '*annusa l’aria* Qualcuno sta sfornando qualcosa, qui intorno.']
  },
  libri: {
    a: [
      'Sto leggendo un libro che non riesco a mettere giù. Neanche per dormire.',
      'Hai mai pianto per un personaggio che non esiste?',
      'Mi consigli qualcosa da leggere?'
    ],
    si: [
      'Sempre. E ne vado fier{o}.',
      'Ho una lista di cento libri. Ne aggiungo due al giorno.',
      'Te lo presto, il mio. Ma voglio sapere cosa ne pensi.'
    ],
    solo: ['*gira una pagina e sorride da sol{o}*', 'Ancora un capitolo. Poi vado. Forse.', 'Questo libro sa di pioggia. In senso buono.']
  },
  animali: {
    a: [
      'Il gatto del bancone mi ha guardato come se sapesse tutto di me.',
      'Se fossi un animale, che animale saresti?',
      'Sotto casa mia c’è un merlo che fischia sempre la stessa canzone.'
    ],
    si: [
      'Un gatto. Pigro, ma con dignità.',
      'Gli animali capiscono tutto. È inquietante e bellissimo.',
      'Il mio cane mi aspetta alla finestra. Ogni giorno.'
    ],
    solo: ['*cerca con lo sguardo il gatto del bancone*', 'Vorrei avere la calma di un gatto davanti alla pioggia.']
  },
  lavoro: {
    a: [
      'Oggi in ufficio una riunione di due ore per decidere la data di un’altra riunione.',
      'Certe settimane il lavoro mi mangia vivo.',
      'Sto pensando di cambiare lavoro. Ma ho paura.'
    ],
    si: [
      'Ti capisco. Il lunedì dovrebbe essere illegale.',
      'La paura è il segnale che ti importa. Pensaci con calma.',
      'Due ore? Fortunat{o}. Da noi tre.'
    ],
    solo: ['*guarda il telefono, sospira, lo gira a faccia in giù*', 'Domani si torna al lavoro. Stasera no.']
  },
  calcio: {
    a: ['Hai visto la partita ieri? Che disastro.', 'Quel rigore... non ci dormo ancora.', 'Una volta il calcio era un’altra cosa.'],
    si: [
      'Disastro è poco. Ci vuole un allenatore nuovo. E un portiere. E un miracolo.',
      'Era fuori! Era fuori di un metro!',
      'Una volta si giocava col cuore. E coi calzettoni bassi.'
    ],
    solo: ['*controlla i risultati sul telefono e scuote la testa*', 'Se vincono domenica offro io. Tanto non vincono.']
  },
  arte: {
    a: [
      'Guarda come la luce del neon cambia colore sul vetro bagnato. Vorrei dipingerla.',
      'Sono stat{o} a una mostra. Non ho capito niente, ma mi ha commoss{o}.',
      'Secondo te l’arte serve a qualcosa?'
    ],
    si: [
      'Serve a guardare meglio. Che non è poco.',
      'Anche io voglio provarci, a dipingere la pioggia.',
      'Non serve capire. Basta sentire.'
    ],
    solo: ['*fa uno schizzo veloce sul tovagliolo*', 'Quel riflesso sul vetro... se avessi i colori adesso.']
  },
  musica: {
    a: [
      'Questa canzone mi ricorda un’estate di tanti anni fa.',
      'Sto imparando a suonare la chitarra. Le mie dita mi odiano.',
      'Che musica ascolti quando sei triste?'
    ],
    si: [
      'Anche io ho una canzone così. Non la ascolto mai da sol{o}.',
      'Le dita ti odiano solo il primo mese. Poi diventate amici.',
      'Musica allegra. Per fare dispetto alla tristezza.'
    ],
    solo: ['*tamburella il ritmo della canzone sul tavolo*', 'Questa canzone... la conosco. Come si chiama?']
  },
  sport: {
    a: [
      'Stamattina ho corso sotto la pioggia. Mi sentivo un eroe. Bagnato.',
      'Domani ho la partita di calcetto. Siamo scarsissimi ma ci divertiamo.',
      'Dovrei fare più movimento. Il cucchiaino conta?'
    ],
    si: [
      'Correre sotto la pioggia è la cosa più bella del mondo. Dopo il caffè.',
      'Vengo a fare il tifo! Porto i cartelli.',
      'Il cucchiaino conta. Ho deciso io.'
    ],
    solo: ['*fa stretching sulla sedia, discretamente*', 'Domani corro. Domani. Promesso a me stess{o}.']
  },
  viaggi: {
    a: [
      'Se potessi partire domani, dove andresti?',
      'Sono stat{o} a Lisbona. C’era un caffè uguale a questo, ma col mare.',
      'Un giorno prendo un treno a caso e vedo dove arrivo.'
    ],
    si: ['In Islanda. A guardare le luci nel cielo.', 'Portami con te. Porto io i panini.', 'Al mare d’inverno. Quando non c’è nessuno.'],
    solo: ['*guarda una mappa sul telefono, con gli occhi lontani*', 'Un giorno partirò. Ma prima finisco il {item}.']
  },
  stelle: {
    a: [
      'Stanotte si vedeva una stella, una sola, tra le nuvole.',
      'Ti sei mai chiest{o} cosa c’è oltre?',
      'Da piccol{o} volevo fare l’astronauta.'
    ],
    si: [
      'Una basta. Se sai dove guardare.',
      'Me lo chiedo ogni notte. Poi mi addormento.',
      'Anche io! Poi ho scoperto che bisogna studiare matematica.'
    ],
    solo: ['*guarda il cielo oltre la finestra, cercando un buco tra le nuvole*', 'Da qualche parte, sopra la pioggia, ci sono le stelle.']
  },
  giochi: {
    a: [
      'Ti va una partita a carte, una di queste sere?',
      'Sto finendo un videogioco da quaranta ore. Mi mancherà.',
      'Aldo dice che gli scacchi sono come la vita. Io perdo a tutti e due.'
    ],
    si: [
      'Ci sto. Ma ti avverto: barò solo un pochino.',
      'La fine di un gioco lungo è come la fine di un’estate.',
      'Gli scacchi te li insegno io. Con pazienza. Tanta.'
    ],
    solo: ['*fa una mossa immaginaria su una scacchiera immaginaria*', 'Chissà se il tavolo degli scacchi è libero.']
  },
  studio: {
    a: [
      'Ho un esame tra tre giorni e ho studiato mezzo capitolo.',
      'Studiare qui è meglio che in biblioteca. Si può respirare.',
      'A volte mi chiedo se sto studiando la cosa giusta.'
    ],
    si: [
      'Mezzo capitolo è già un inizio. Io ne ho letto il titolo.',
      'Anch’io vengo qui a studiare. Il rumore della pioggia aiuta.',
      'Se ti fa venire le domande, è la cosa giusta.'
    ],
    solo: ['*evidenzia una riga, poi tutta la pagina*', 'Ancora un paragrafo. Poi un sorso. Poi un paragrafo.']
  },
  ricordi: {
    a: [
      'Quando ero giovane, qui c’era una latteria. Ci veniva mia madre.',
      'Ti ricordi le estati da bambini? Duravano un’eternità.',
      'Certi profumi ti riportano indietro di quarant’anni in un secondo.'
    ],
    si: [
      'Me la ricordo! Il latte col pane, la sera.',
      'Adesso un’estate dura un pomeriggio.',
      'Il profumo del caffè, per me, è la cucina di mia nonna.'
    ],
    solo: ['*sorride a un ricordo che nessun altro vede*', 'Una volta questa strada era tutta diversa. Ma la pioggia era la stessa.']
  }
};

/* ---------------- Momenti delle conversazioni ---------------- */
// Chi sta giù si confida; l'altro risponde secondo il suo carattere.
const CONFIDA = {
  a: [
    'Oggi è una giornata storta, {B}.',
    'Non so, mi sento un po’ giù. Senza un motivo preciso.',
    'Posso dirti una cosa? Sono stanc{o}. Stanc{o} dentro.',
    'A volte mi sembra di non farcela a stare dietro a tutto.'
  ],
  r: {
    caldo: [
      'Vieni qui. Non devi spiegare niente.',
      'Allora stasera stiamo qui, tranquilli. Io non vado da nessuna parte.',
      'Grazie di avermelo detto. Davvero.'
    ],
    ironico: [
      'Allora ci vuole un dolce. È scienza.',
      'Le giornate storte si raddrizzano col caffè. Ti offro il secondo.',
      'Ti presto il mio buonumore. Me lo ridai domani.'
    ],
    timido: [
      '*avvicina a {B} il piattino con il biscotto*',
      'Anche a me capita... Ti tengo compagnia, se vuoi.',
      '*non dice niente, ma resta lì vicino*'
    ],
    brontolone: [
      'Mh. Il mondo è complicato. Ma tu vai bene così.',
      'Chi ti ha fatto arrabbiare? Gli parlo io.',
      'Bevi. Poi ne parliamo. Se vuoi.'
    ],
    entusiasta: [
      'Domani andrà meglio, me lo sento!',
      'Facciamo una cosa bella, sabato? Ti porto io.',
      'Sei una persona fantastica, lo sai? Te lo ricordo io.'
    ]
  },
  g: ['*sorride, un po’ meno stanc{o}*', 'Grazie. Mi serviva.', 'Già va meglio, sai?']
};
// Notizie e pettegolezzi: di chi si parla, per tipo di notizia. {X} e {Y} sono le persone della notizia.
const NOTIZIE = {
  coppia: {
    a: [
      'Lo sai che {X} e {Y} si sono messi insieme?',
      'Ho visto {X} e {Y} uscire sotto lo stesso ombrello...',
      'Novità: {X} e {Y}. Insieme. Ufficiale.'
    ],
    io: ['{B}, ti devo dire una cosa: io e {Y} stiamo insieme.', 'Sai che io e {Y}... sì. Ci siamo messi insieme.']
  },
  fidanzati: {
    a: ['{X} e {Y} si sono fidanzati! Qui dentro!', 'Hai saputo? {X} ha chiesto a {Y} di sposarl{X:o}. E ha detto sì!'],
    io: ['Io e {Y} ci sposiamo. Lo sto dicendo a tutti, scusa.', 'Ti devo dire una cosa grande: io e {Y} ci siamo fidanzati!']
  },
  migliori: {
    a: ['{X} e {Y} ormai sono inseparabili.', 'Hai visto {X} e {Y}? Sembrano fratelli.'],
    io: ['Sai che {Y} ormai è la mia persona? Quella da chiamare alle tre di notte.']
  },
  pace: {
    a: ['Pensa: {X} e {Y} hanno fatto pace. Dopo tutto quel muso!', '{X} e {Y} adesso si salutano. Non ci credevo.'],
    io: ['Io e {Y} abbiamo fatto pace. Non era poi così terribile.']
  },
  rivali: {
    a: ['{X} e {Y} non si sopportano. Guai a metterli allo stesso tavolo.', 'Hai notato come si guardano {X} e {Y}? Scintille. Brutte.'],
    io: ['Se vedi {Y}, dimmelo. Così mi siedo dall’altra parte.']
  },
  litigio: {
    a: ['Mi sa che {X} e {Y} hanno litigato. Erano tutti e due col muso.', '{X} e {Y} hanno discusso, l’altra sera. Spero si chiariscano.'],
    io: ['Ho litigato con {Y}. Per una stupidaggine. Ma mi pesa.']
  }
};
// notizie che nascono dal mondo: progetti riusciti o no, cotte segrete (vedi js/motore/trame.js)
NOTIZIE.successo = {
  a: ['Hai saputo di {X}? Ce l’ha fatta! Quella cosa che inseguiva da settimane.', '{X} ce l’ha fatta. Sono così content{o}.'],
  io: ['Ho una bella notizia: ce l’ho fatta! Sono ancora emozionat{o}.', 'Te lo devo dire: ci sono riuscit{o}!']
};
NOTIZIE.delusione = {
  a: [
    'A {X} non è andata bene, con quel progetto. Diamogli un po’ di affetto.',
    'Hai sentito di {X}? Non è andata. Ma non molla, lo conosco.'
  ],
  io: ['Non è andata, quella cosa che inseguivo. Ma ci riprovo.']
};
NOTIZIE.cotta = {
  a: ['Lo sapevi che {X} ha un debole per {Y}? Non dirlo a nessuno.', 'Dicono che {X} arrossisca ogni volta che passa {Y}.'],
  io: ['Posso dirti un segreto? Mi piace {Y}. Tanto.']
};
const NOTIZIE_R = {
  caldo: ['Che bello. Sono content{o} per loro.', 'Davvero? Mi fa piacere.', 'Ah... speriamo bene.'],
  ironico: [
    'E io lo vengo a sapere per ultim{o}. Come sempre.',
    'Lo sapevo prima di loro, secondo me.',
    'Questo locale è meglio di una soap opera.'
  ],
  timido: ['Oh! *si copre la bocca*', 'Non lo sapevo...', 'Davvero? *sgrana gli occhi*'],
  brontolone: ['Mah. Contenti loro.', 'Non sono affari miei. Però raccontami tutto.', 'Era ora, direi.'],
  entusiasta: ['NO! Ma è stupendo!', 'Raccontami tutto, subito!', 'Lo sapevo! Lo sapevo!']
};
// Ricordi in comune (dai loro ricordi veri: il giorno in cui si sono conosciuti, il tempo che faceva…)
const RICORDO_A = {
  conosciuto: [
    'Ti ricordi il giorno che ci siamo conosciuti? {meteo}.',
    'Sono passati {giorni} giorni da quando ci siamo parlati la prima volta. Sembra di più. In senso buono.',
    'La prima volta che ti ho vist{o} ordinavi un {item}. Non sei cambiat{o}.'
  ],
  litigio: [
    'Ti ricordi quando abbiamo litigato? Che stupidi.',
    'Quella volta che abbiamo discusso... mi è servita. Ci conosciamo meglio, adesso.'
  ],
  chiarito: ['Da quando abbiamo chiarito, mi sento più legger{o}.', 'Sai che dopo quella discussione ti voglio più bene di prima?'],
  coppia: [
    'Ricordi la sera che ci siamo messi insieme? Qui, a questo tavolo.',
    'Tutto è cominciato qui. Con un caffè e un po’ di coraggio.'
  ],
  fidanzati: ['Ogni volta che entro qui, ripenso a quel sì.', 'Chi l’avrebbe detto che ci saremmo fidanzati in un bar.'],
  amici: ['Quando siamo diventati amici, esattamente? Non me lo ricordo. Mi sembra da sempre.'],
  visto: ['Ti ricordi quando {X} e {Y} si sono fidanzati qui davanti a tutti? Ho pianto.', 'Quella sera con {X} e {Y}... che emozione, eh?']
};
const RICORDO_R = {
  caldo: ['Come potrei dimenticarlo.', 'Me lo ricordo benissimo. Anche io ci penso.'],
  ironico: ['Io ricordo solo che mi hai rubato lo zucchero.', 'Ricordo tutto. Soprattutto le cose imbarazzanti.'],
  timido: ['*arrossisce* Sì... me lo ricordo.', 'Sì. Ci penso spesso.'],
  brontolone: ['Sì, sì. Che nostalgia, eh?', 'Me lo ricordo. Non te lo dico, ma me lo ricordo.'],
  entusiasta: ['Certo! È stato il giorno più bello!', 'Ma certo! Rifacciamolo, tutto uguale!']
};
// Progetti per il futuro (per chi è molto legato)
const FUTURO = {
  a: [
    'E se un giorno facessimo un viaggio insieme?',
    'Tra dieci anni, secondo te, saremo ancora qui?',
    'Ho un’idea: il primo giorno di primavera facciamo colazione al parco.'
  ],
  si: ['Ci sto. Scegli tu dove, io porto l’ombrello.', 'Qui. Più vecchi, ma qui.', 'Segnato. Non ti libererai di me.'],
  no: ['Vediamo... un passo alla volta, va bene?', 'Mi fa un po’ paura pensare così avanti. Ma mi piace.']
};
// Tra rivali: frecciatine (a) e risposte (r)
const PUNGE = {
  a: [
    'Hai di nuovo preso il tavolo migliore.',
    'Il tuo {item} ha un odore strano. Come te.',
    'Parli sempre così forte?',
    'Bel maglione. Per un divano.'
  ],
  r: {
    caldo: ['Stai bene anche tu, grazie.', 'Ti offro un biscotto. Magari ti addolcisce.'],
    ironico: ['Grazie, l’ho scelto apposta per te.', 'Sempre un piacere, {B}. Quasi.'],
    timido: ['*fa finta di non aver sentito*', '...scusa.'],
    brontolone: ['Senti chi parla.', 'Bevi e taci, {B}.'],
    entusiasta: ['Anche tu mi stai simpatic{o}! Ah no, aspetta.', 'Lo prendo come un complimento!']
  }
};
// Piccoli litigi tra persone legate: una scenetta per volta. {A} e {B} sono i due.
const LITE = [
  [
    [0, 'Ieri ti ho aspettato mezz’ora, {B}.'],
    [1, 'Mi ero dimenticat{o}. Scusa, avevo mille cose.'],
    [0, 'Sempre mille cose. E io sono la millesima e una.'],
    [1, '*abbassa lo sguardo sulla tazza*']
  ],
  [
    [1, 'Hai raccontato a tutti quella cosa che ti avevo detto in segreto.'],
    [0, 'Solo a una persona!'],
    [1, 'Era un segreto, {B}.'],
    [0, '...Hai ragione. Sono un disastro.']
  ],
  [
    [0, 'Non mi hai fatto gli auguri.'],
    [1, 'Il tuo compleanno è la settimana prossima.'],
    [0, 'Era la settimana scorsa.'],
    [1, 'Oh no.']
  ],
  [
    [0, 'Perché non mi hai risposto per tre giorni?'],
    [1, 'Avevo bisogno di stare un po’ da sol{o}. Non c’entri tu.'],
    [0, 'Potevi dirmelo. Mi sono preoccupat{o}.'],
    [1, '...Lo so.']
  ],
  [
    [1, 'Ti ho chiesto un consiglio e tu ti sei mess{o} a ridere.'],
    [0, 'Non ridevo di te! Ridevo della situazione!'],
    [1, 'Era la mia situazione, {B}.']
  ],
  [
    [0, 'Hai finito l’ultimo cornetto. Il mio.'],
    [1, 'Non c’era scritto il tuo nome.'],
    [0, 'C’era scritto nel mio cuore.'],
    [1, '*sbuffa* Non è solo per il cornetto, vero?'],
    [0, 'No. È che ultimamente mi sembri lontan{o}.']
  ]
];
// Chiarirsi (la volta dopo un litigio): si vuole più bene di prima.
const CHIARO = [
  [
    [0, '{B}... sull’altra volta.'],
    [1, 'Anche io ci ho pensato.'],
    [0, 'Scusa. Ci tengo troppo a te per fare l’offes{o}.'],
    [1, '*tende la mano sul tavolo* Pace?'],
    [0, 'Pace.']
  ],
  [
    [1, 'Ti ho portato un {item}. È un modo per dire scusa.'],
    [0, 'Funziona. Funziona molto.'],
    [1, 'Non voglio litigare con te. Sei importante.'],
    [0, 'Anche tu. Tanto.']
  ],
  [
    [0, 'Ho fatto la figura dello stupido, l’altra volta.'],
    [1, 'Un po’. Ma anche io.'],
    [0, 'Allora siamo due stupidi.'],
    [1, 'Due stupidi che si vogliono bene.']
  ],
  [
    [1, 'Ci ho dormito sopra. Avevi ragione tu. In parte.'],
    [0, 'In parte è già tantissimo, detto da te.'],
    [1, '*ride* Non ti ci abituare.']
  ]
];

/* ---------------- Pensieri ad alta voce (da soli) ---------------- */
// Per stile: le reazioni a quello che succede intorno o a loro.
const PENSA = {
  attesa: {
    caldo: ['C’è tanta gente stasera. Aspetto, non c’è fretta.', 'Poverini, al bancone corrono tutti.'],
    ironico: ['Sto invecchiando in questa fila. Con eleganza.', 'Quando arriva il mio {item} avrò la barba bianca.'],
    timido: ['*guarda il bancone, poi guarda le mani*', 'Forse si sono dimenticati di me...'],
    brontolone: ['Ai miei tempi il caffè arrivava prima di sedersi.', 'Ancora niente. Bah.'],
    entusiasta: ['Va bene! Aspettare fa parte del divertimento!', 'Il mio {item} arriverà e sarà bellissimo!']
  },
  sporco: {
    caldo: ['Qualcuno ha lasciato le tazze. Le metto in fila, almeno.'],
    ironico: ['Il tavolo accanto ha una collezione di tazze sporche. Arte moderna.'],
    timido: ['*sposta piano una tazza sporca più in là*'],
    brontolone: ['Ma questo tavolo lo pulisce qualcuno?', 'Briciole ovunque. Bah.'],
    entusiasta: ['Ehi, qui c’è un piccolo disordine! Niente di grave!']
  },
  perfetto: {
    caldo: ['Questo {item} è fatto con amore. Si sente.', 'Grazie. Davvero, è perfetto.'],
    ironico: ['Ok. Questo {item} mi ha cambiato la vita. Nessuno lo dica in giro.', 'Lo voglio sposare, questo {item}.'],
    timido: ['*guarda il disegno nella schiuma e non ha il coraggio di berlo*', 'È... bellissimo.'],
    brontolone: ['Hmpf. Fatto bene. Non lo dirò ad alta voce. Ops.', 'Finalmente un {item} come si deve.'],
    entusiasta: ['Ma hai visto che meraviglia?! Faccio una foto!', 'Il {item} più bello della mia vita!']
  },
  ritorno: [
    'Quanto mi era mancato questo posto. {giorni} giorni sono tanti.',
    'Ci voleva. Mi sei mancato, caffè.',
    'Sono stat{o} via un po’. Tutto uguale qui. Per fortuna.',
    '*si guarda intorno contento, come chi torna a casa*'
  ],
  traguardo: [
    'È la mia {v}ª volta qui. Le ho contate, sì.',
    '{v} volte in questo locale. Dovrebbero darmi una tessera.',
    '{v} caffè qui. E nessuno uguale all’altro.'
  ],
  felice: [
    'Oggi sto bene. Bene davvero.',
    '*canticchia piano*',
    'Ultimamente le cose girano per il verso giusto.',
    'Mi sento legger{o}. Sarà la pioggia.'
  ],
  giu: [
    '*fissa la tazza senza bere*',
    'È un periodo così. Passerà.',
    'Mi fa bene stare qui, anche senza parlare.',
    '*appoggia la testa alla mano e guarda fuori*'
  ],
  rivale: ['C’è anche {X}. Che serata.', '*lancia un’occhiata storta verso {X}*', 'Se {X} si avvicina, io me ne vado. Dopo il dolce.'],
  cotta: [
    '*guarda {X}, poi fa finta di leggere il menu*',
    'Secondo te {X} mi ha vist{o}? No, non guardare!',
    '*si sistema i capelli, poi si vergogna di averlo fatto*',
    'Oggi {X} è ancora più... no, niente.'
  ],
  imbarazzo: [
    'C’è {X}. Dopo l’altra volta... non so se salutare.',
    '*guarda {X} di sfuggita, poi abbassa gli occhi*',
    'Con {X} ho esagerato. Domani le... gli... parlo. Domani.'
  ],
  manca: ['{X} oggi non c’è. Il tavolo sembra più grande.', 'Chissà cosa sta facendo {X}.', 'Mi manca un po’ {X}, stasera.'],
  coppiaVicina: ['*guarda di nascosto la coppia al tavolo vicino, e sorride*', 'Che belli quei due. Ti fanno credere nelle cose.'],
  musica: ['Questa musica dal vivo... non me l’aspettavo.', '*batte il piede a tempo con la chitarra*'],
  gatto: ['Il gatto mi ha guardat{o}. Credo di essere stat{o} giudicat{o}.', 'Quel gatto dorme meglio di me.'],
  pieno: ['Che pienone stasera. Mi piace la gente vicina.', 'Tutta la città si è rifugiata qui, stasera.'],
  vuoto: ['Siamo rimasti in pochi. Mi piace così.', 'Che silenzio. Si sente solo la pioggia.'],
  // ricordi da soli (dai loro ricordi veri)
  ric: {
    conosciuto: ['Qui ho conosciuto {X}. Sembra ieri.', 'La prima volta che ho parlato con {X} {meteo}. Me lo ricordo ancora.'],
    amici: ['Prima non conoscevo nessuno in città. Poi è arrivato {X}.'],
    coppia: ['*guarda il tavolo dove si è mess{o} insieme a {X}, e sorride*', 'Da quando c’è {X} anche la pioggia è più bella.'],
    fidanzati: ['*gira l’anello sul dito, pensando a {X}*', 'Mi sposo. Con {X}. Ogni tanto me lo ripeto per crederci.'],
    litigio: ['Ho ancora in testa la discussione con {X}.', 'Forse dovrei chiamare {X}. Forse.'],
    chiarito: ['Sono content{o} di aver fatto pace con {X}.'],
    visto: ['Quella sera di {X} e {Y}... ho ancora i brividi.', 'Ogni volta che entro penso al fidanzamento di {X} e {Y}.'],
    saputo: ['{X} e {Y}, eh? Chi l’avrebbe detto.', 'Ancora non ci credo, a quella notizia su {X}.'],
    perfetto: ['L’altra volta mi hanno fatto un {item} perfetto. Spero oggi lo stesso.'],
    attesa: ['L’ultima volta ho aspettato tanto. Oggi va meglio, dai.']
  }
};
// Voce di ogni tratto quando pensa da solo
const PENSA_TR = {
  romantico: [
    '*disegna un cuoricino sulla condensa del vetro*',
    'Le sere di pioggia sono fatte per innamorarsi.',
    'Chissà chi sta pensando a me, adesso.'
  ],
  chiacchierone: [
    'Nessuno con cui parlare... strano. Quasi quasi parlo col gatto.',
    'Ho così tante cose da raccontare e nessuno a cui raccontarle!',
    '*cerca con gli occhi qualcuno che conosce*'
  ],
  timido: [
    '*si fa piccol{o} sulla sedia, al calduccio*',
    'Mi piace stare qui. Nessuno mi chiede niente.',
    '*scrive qualcosa e poi lo cancella*'
  ],
  brontolone: [
    'Troppa pioggia. Troppo poca pioggia. Insomma, il tempo è sbagliato.',
    'La musica è troppo alta. No, troppo bassa.',
    'Bah. Però si sta bene.'
  ],
  artista: ['Il vapore della tazza fa delle forme bellissime.', '*guarda le luci come se volesse ricordarsele per sempre*'],
  sportivo: ['Dopo il caffè faccio il giro dell’isolato. Di corsa. Forse.', '*fa ruotare le spalle, una alla volta*'],
  sognatore: [
    'E se dietro quella porta ci fosse un altro mondo?',
    '*guarda la pioggia come se ci leggesse dentro qualcosa*',
    'Un giorno farò una cosa grande. Non so ancora cosa.'
  ],
  nerd: [
    'Statisticamente, questa è la dodicesima goccia che scende sul vetro di sinistra.',
    '*risolve un rompicapo sul telefono, soddisfatt{o}*',
    'Se il caffè fosse un livello, questo sarebbe il boss finale.'
  ]
};

/* ---------------- Saluti tra tavoli ---------------- */
const SALUTA = {
  amici: ['Ehi, {X}! Ciao!', '*saluta {X} con la mano, da lontano*', '{X}! Dopo vengo da te!'],
  amore: ['*manda un bacio a {X}, da lontano*', 'Ciao, {X}... *sorriso enorme*'],
  cotta: ['*vede {X}, saluta, poi si nasconde dietro la tazza*', 'Ciao {X}! Cioè... ciao.'],
  cono: ['Ciao {X}!', '*fa un cenno con la testa a {X}*'],
  rivali: ['*fa un cenno freddo a {X}*', 'Oh. {X}. Ciao.'],
  famiglia: ['{X}! Hai preso la sciarpa? Fa freddo!', '*fa ciao a {X} come si fa ai bambini*'],
  lite: ['*vede {X}, esita, poi fa un piccolo cenno*']
};
const SALUTA_R = {
  caldo: ['Ciao, {X}!', '*ricambia il saluto con un sorriso*'],
  ironico: ['*alza la tazza come per un brindisi*', 'Ciao {X}, non far casino!'],
  timido: ['*fa ciao con due dita*', '*arrossisce e ricambia*'],
  brontolone: ['*alza appena la mano*', 'Sì, sì. Ciao.'],
  entusiasta: ['{X}!!! Ciaooo!', '*saluta con tutte e due le braccia*']
};

/* ---------------- Reazioni a quello che succede nel locale ---------------- */
// Chi è nel locale (e non è coinvolto) reagisce secondo il suo carattere. {X} e {Y} sono i protagonisti.
const REAZ = {
  fidanzati: {
    caldo: ['Che bello... mi sono commoss{o}.', 'Auguri, ragazzi!'],
    ironico: ['Bene, adesso tutti si aspettano che faccia una proposta anch’io.', 'E io che volevo solo un caffè tranquillo. Auguri!'],
    timido: ['*applaude piano, con gli occhi lucidi*', '*si asciuga una lacrima di nascosto*'],
    brontolone: ['Bah. Auguri. *si soffia il naso*', 'Mh. Mi è entrato qualcosa nell’occhio.'],
    entusiasta: ['EVVIVA! Viva gli sposi!', '*si alza e applaude fortissimo*']
  },
  coppia: {
    caldo: ['Hai visto {X} e {Y}? Si tengono per mano.', 'Che teneri.'],
    ironico: ['Ecco, un’altra coppia. Il locale dell’amore.', 'Prima o poi ci mettono una targa su quel tavolo.'],
    timido: ['*guarda {X} e {Y} e sorride da sol{o}*'],
    brontolone: ['Si sono messi insieme, eh? Era ora.'],
    entusiasta: ['Siete bellissimi, voi due!']
  },
  pace: {
    caldo: ['Hanno fatto pace. Che sollievo.'],
    ironico: ['Pace fatta. Il quartiere torna sicuro.'],
    timido: ['*sospira sollevat{o}*'],
    brontolone: ['Era ora che la smettessero.'],
    entusiasta: ['Evviva la pace!']
  },
  litigio: {
    caldo: ['*finge di leggere, per lasciarli tranquilli*'],
    ironico: ['*fa finta di niente, con molta attenzione*'],
    timido: ['*si fa piccol{o} piccol{o}*'],
    brontolone: ['Le coppie di oggi... ai miei tempi si litigava più forte.'],
    entusiasta: ['*vorrebbe dire qualcosa, ma si trattiene. A fatica*']
  },
  cocci: {
    caldo: ['Tutto bene? Ti sei fatto male?', 'Capita a tutti!'],
    ironico: ['Applausi per il barista!', 'Tre punti per lo stile.'],
    timido: ['*sobbalza sulla sedia*'],
    brontolone: ['Ecco. La mia tazzina preferita, scommetto.', 'Che fracasso.'],
    entusiasta: ['Porta fortuna! Si dice così, no?']
  }
};

/* ---------------- Quando tocchi qualcuno ---------------- */
// Secondo quanto si è affezionato a te (pochi, abbastanza, tanto) e secondo il carattere.
const TOCCO = {
  poco: {
    caldo: ['Grazie, è tutto buonissimo.', 'Che posto accogliente.'],
    ironico: ['Il {item} è promosso. Il resto è sotto esame.', 'Ci sto prendendo gusto. Pericoloso.'],
    timido: ['Oh! Sì... tutto bene, grazie.', '*sorride, un po’ sorpres{o}*'],
    brontolone: ['Sì? Tutto a posto. Più o meno.', 'Il {item} va bene. Per ora.'],
    entusiasta: ['Ciao! Che bel posto!', 'Tornerò, sicuro!']
  },
  medio: {
    caldo: ['Sempre gentile, tu. Grazie.', 'Mi sento a casa, qui.'],
    ironico: ['Ormai sai il mio ordine meglio di me.', 'Se smetti di farmi il {item} io smetto di vivere.'],
    timido: ['Ciao... grazie di chiedere.', '*fa un piccolo cenno felice*'],
    brontolone: ['Il tuo {item} è l’unica cosa che funziona in questa città.', 'Mh. Sei bravo. Non dirlo in giro che te l’ho detto.'],
    entusiasta: ['Il mio barista preferito!', 'Ogni volta è più buono, come fai?']
  },
  tanto: {
    caldo: [
      'Lo sai che questo posto mi ha cambiato le giornate? Anche grazie a te.',
      'Se un giorno chiudi, io vengo a piangere sulla porta.'
    ],
    ironico: [
      'Ti voglio bene. Ecco, l’ho detto. Ora fammi un altro {item}.',
      'Sei il motivo per cui non ho ancora comprato una macchinetta.'
    ],
    timido: ['Grazie... per tutto. Davvero.', '*ti stringe la mano per un secondo*'],
    brontolone: ['Sei una brava persona. Ecco. Basta smancerie.', 'Qui è l’unico posto dove non mi lamento. Quasi mai.'],
    entusiasta: ['Sei la persona più bella del quartiere!', 'Ti porto i biscotti di mia zia, domani! Giuro!']
  },
  attesa: ['Finalmente! Pensavo di essere invisibile.', 'Ah, eccoti. C’è tanto da fare stasera, eh?'],
  perfetto: ['Hai visto il disegno? Non ho il coraggio di berlo.', 'È il {item} più buono che abbia mai bevuto. Te lo giuro.'],
  giu: ['Grazie di chiedere. Oggi non è una gran giornata.', '*fa un sorriso stanco* Sto qui un po’, se posso.']
};

/* ---------------- Nel Diario ---------------- */
// il ricordo più forte di un habitué, nella sua scheda
const RIC_N = {
  conosciuto: 'quando ha conosciuto {X}',
  amici: 'quando è diventat{o} amic{o} di {X}',
  migliori: 'il giorno in cui {X} è diventat{X:o} la sua persona',
  cotta: 'la prima volta che ha guardato {X} in quel modo',
  coppia: 'la sera in cui si è mess{o} con {X}',
  fidanzati: 'il sì con {X}',
  rivali: 'il primo battibecco con {X}',
  litigio: 'la discussione con {X}',
  chiarito: 'quando ha chiarito con {X}',
  pace: 'la pace con {X}',
  visto: 'il fidanzamento di {X} e {Y}',
  saputo: 'la notizia su {X} e {Y}',
  consolato: 'quando {X} l’ha consolat{o}',
  perfetto: 'un caffè perfetto, fatto da te',
  attesa: 'una lunga attesa al bancone'
};
// come stanno due persone, nella pagina dei Legami
const REL_N = [
  [80, 'si vogliono un gran bene'],
  [60, 'si vogliono bene'],
  [40, 'si stanno simpatici'],
  [0, 'si conoscono appena']
];

/* ---------------- Più pensieri per l'ora e il tempo ---------------- */
SOLOH.m.push(
  'Il caffè del mattino è una promessa.',
  '*si stropiccia gli occhi*',
  'Ancora mezz’ora e poi affronto il mondo.',
  'La città si sveglia piano, come me.'
);
SOLOH.n.push(
  'A quest’ora si pensa a tutto. Anche troppo.',
  '*guarda le luci delle finestre accese di fronte*',
  'Chi sarà sveglio come me, adesso?',
  'La notte qui dentro è più morbida.'
);
SOLOH.r.push(
  '*ascolta la pioggia sul tetto, a occhi chiusi*',
  'Che bello essere all’asciutto mentre fuori diluvia.',
  'Le gocce sul vetro fanno a gara. Tifo per quella a sinistra.',
  'Con questa pioggia, nessuno ha fretta.'
);
SOLOH.s.push(
  'Oggi il sole entra fino al bancone.',
  'Con questo sole verrebbe voglia di fare tutto. Dopo il caffè.',
  '*chiude gli occhi al sole come un gatto*'
);
SOLOH.w.push(
  '*guarda i fiocchi che si posano sul davanzale*',
  'La neve rende tutto silenzioso. Anche me.',
  'Domani pupazzo di neve. Me lo prometto.'
);
SOLOH.f.push(
  'Dalla nebbia esce gente come dai sogni.',
  'Non si vede l’altro lato della strada. Siamo un’isola.',
  '*disegna un cerchio sul vetro appannato*'
);
