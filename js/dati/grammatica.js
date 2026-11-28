// Frasi costruite a pezzi (il motore è gram() in js/motore/mente.js).
// Un modello come '{ora}, {scena}. {sensazione}.' sceglie un pezzo per ogni {nome} da questa lista, e i pezzi a loro
// volta possono contenere altri {nome}. Così poche decine di pezzi fanno migliaia di frasi diverse, tutte scritte da noi.
// Se esiste «nome_stile» (es. pensiero_brontolone) si usa quella per chi ha quello stile, altrimenti «nome».
// I segnaposti degli altri sistemi restano: {o} (o/a di chi parla), {X}, {Y}, {item}, {B}.
// Regola: ogni pezzo deve stare bene con tutti gli altri della sua lista. Niente lui/lei per gli altri.

const GRAM = {
  /* ---------- pensieri ad alta voce, da soli ---------- */
  pensiero: [
    '{ora}, {scena}. {sensazione}.',
    '{scena_cap}. {sensazione}.',
    '{sensazione}: {motivo}.',
    '{ora} {desiderio}.',
    '*{gesto}* {sensazione}.',
    '{scena_cap}, e {pensierino}.'
  ],
  pensiero_brontolone: ['{ora}, {scena}. {lamento}.', '*{gesto}* {lamento}. Però si sta bene.', '{lamento}. {scena_cap}, almeno.'],
  pensiero_entusiasta: ['{ora}, {scena}! {gioia}!', '*{gesto}* {gioia}!', '{scena_cap}! {gioia}!'],
  pensiero_timido: ['*{gesto}*', '{ora}, {scena}... {sensazione_piano}.', '*{gesto}* ...{sensazione_piano}.'],
  pensiero_ironico: ['{ora}, {scena}. {battuta}.', '{scena_cap}. {battuta}.', '*{gesto}* {battuta}.'],
  ora: [
    'Stasera',
    'A quest’ora',
    'Con questa pioggia',
    'Dopo una giornata così',
    'Ogni volta che entro',
    'Quando si accendono le luci',
    'Mentre fuori corrono tutti',
    'Proprio adesso',
    'Questa sera',
    'Con il vento che c’è fuori',
    'Mentre aspetto il {item}',
    'Adesso che la pioggia rallenta',
    'Dopo il lavoro',
    'Prima di tornare a casa'
  ],
  scena: [
    'la vetrina è piena di gocce che fanno a gara',
    'il vapore della tazza disegna ghirigori',
    'la macchina del caffè canta piano',
    'qualcuno ride al tavolo in fondo',
    'il gatto si è acciambellato sul bancone',
    'le luci si riflettono nelle pozzanghere',
    'il profumo del {item} riempie tutto',
    'la strada luccica come un fiume',
    'la musica arriva a pezzetti tra le chiacchiere',
    'un ombrello rosso passa davanti alla vetrina',
    'la tazza mi scalda le mani',
    'la pioggia batte piano sul tetto',
    'il barista fischietta qualcosa',
    'una coppia si divide l’ultimo biscotto',
    'le sedie scricchiolano come vecchie amiche',
    'la condensa scende piano sul vetro',
    'un bambino schiaccia il naso contro la vetrina',
    'le tazze tintinnano sul vassoio',
    'fuori un tram passa illuminato',
    'la lampada fa un cerchio caldo sul tavolo'
  ],
  sensazione: [
    'Mi sento a casa',
    'Si sta proprio bene',
    'Il mondo sembra più gentile',
    'Mi viene da sorridere senza motivo',
    'Tutto rallenta, finalmente',
    'Non ho fretta di andare da nessuna parte',
    'Mi torna la voglia di fare le cose',
    'È una di quelle sere da ricordare',
    'Mi sento più legger{o}',
    'Ho il cuore tranquillo',
    'Mi sembra di respirare meglio',
    'Va tutto bene, almeno per un po’',
    'Mi viene voglia di restare fino alla chiusura',
    'Mi sento fortunat{o}'
  ],
  sensazione_piano: ['si sta bene qui', 'nessuno mi guarda, e va bene così', 'mi piace questo silenzio', 'forse resto ancora un po’'],
  motivo: [
    'qui nessuno mi chiede niente',
    'la gente si saluta per nome',
    'il {item} è caldo al punto giusto',
    'fuori piove e dentro no',
    'c’è sempre qualcuno che ride',
    'ogni sedia ha la sua storia',
    'la pioggia mette tutti d’accordo',
    'il barista si ricorda il mio nome',
    'il tempo qui dentro va più piano',
    'ci si sente meno soli'
  ],
  desiderio: [
    'avrei voglia di scrivere una lettera a qualcuno',
    'chiamerei mia madre, solo per sentirla',
    'mi prenderei un altro {item}, ma non lo dico a nessuno',
    'vorrei che il tempo si fermasse un pochino',
    'farei una passeggiata sotto la pioggia, senza ombrello',
    'imparerei a disegnare, solo per disegnare questo posto'
  ],
  gesto: [
    'soffia sulla tazza',
    'guarda fuori, con il mento appoggiato alla mano',
    'gira il cucchiaino tre volte, poi altre tre',
    'disegna un cuore sulla condensa del vetro',
    'si stiracchia piano',
    'chiude gli occhi per un momento',
    'conta le gocce sul vetro',
    'si sistema la sciarpa',
    'appoggia la testa al vetro',
    'sorride guardando la tazza',
    'sfoglia un tovagliolo come fosse un libro',
    'tamburella con le dita sul tavolo',
    'si scalda le mani attorno alla tazza',
    'guarda la porta ogni volta che si apre'
  ],
  pensierino: [
    'mi viene in mente una canzone di quando ero piccol{o}',
    'penso che dovrei venire qui più spesso',
    'mi ricordo che domani è un altro giorno',
    'mi accorgo che sto sorridendo da sol{o}',
    'decido che stasera non guardo il telefono'
  ],
  lamento: [
    'Il {item} era più caldo l’altra volta',
    'Troppa gente, troppo rumore. Ma va bene',
    'Ai miei tempi pioveva meno. O forse di più',
    'Questa sedia scricchiola. Come me',
    'Il mondo corre troppo. Qui almeno no',
    'Tutti con il telefono in mano. Bah'
  ],
  gioia: [
    'Che bello!',
    'Adoro questo posto',
    'Oggi è una giornata perfetta',
    'Mi viene da abbracciare tutti',
    'Il {item} più buono della settimana',
    'Che serata!'
  ],
  battuta: [
    'Se il caffè fosse una persona, sarebbe la mia migliore amica',
    'Sono qui da così tanto che dovrei pagare l’affitto',
    'La pioggia è il modo della città di dire «resta ancora»',
    'Il gatto mi ignora con grande professionalità',
    'Il mio piano per la serata: questo. Esattamente questo',
    'Il cucchiaino è l’unico che mi ascolta senza interrompere'
  ],

  /* ---------- due chiacchiere tra due persone ---------- */
  domanda: [
    'Hai visto {cosa_vista}?',
    'Sai cosa mi è successo {quando}? {aneddoto_cap}.',
    'Secondo te {dilemma}?',
    'Ti è mai capitato che {capitato}?',
    '{quando_cap} ho pensato a te: {aneddoto}.'
  ],
  quando: ['stamattina', 'ieri sera', 'l’altro giorno', 'mentre venivo qui', 'in autobus', 'al mercato'],
  cosa_vista: [
    'il cane col cappottino giallo qui fuori',
    'quanta gente c’era al mercato stamattina',
    'il tramonto di ieri, tutto arancione',
    'la vetrina nuova della libreria',
    'il signore che balla alla fermata dell’autobus',
    'che fila c’era davanti al forno',
    'l’arcobaleno sopra i tetti, ieri',
    'il nuovo murale dietro la stazione',
    'la luna enorme dell’altra sera',
    'il gatto della libreria che dorme sui gialli'
  ],
  aneddoto: [
    'ho salutato uno sconosciuto convinto che fosse mio cugino',
    'ho perso l’autobus e ne ho trovato uno più bello',
    'una bambina mi ha regalato un sasso a forma di cuore',
    'ho fatto una torta e il forno ha deciso di fare di testa sua',
    'un piccione mi ha seguito per tre isolati',
    'ho trovato dieci euro nel cappotto dell’anno scorso',
    'mia nonna mi ha chiamato per chiedermi come si accende la radio',
    'ho visto due anziani ballare alla fermata',
    'il vicino mi ha regalato i pomodori del suo balcone',
    'ho sbagliato strada e ho scoperto un giardino nascosto',
    'mi hanno fermato per chiedermi la strada e l’ho sbagliata anch’io'
  ],
  dilemma: [
    'è meglio la pioggia di notte o quella di mattina',
    'il cornetto va inzuppato o no',
    'si può essere felici con poco',
    'esiste davvero il colpo di fulmine',
    'il gatto del bancone ci giudica',
    'è più bello partire o tornare'
  ],
  capitato: [
    'una canzone ti mettesse di buonumore senza motivo',
    'un profumo ti riportasse indietro di vent’anni',
    'ti venisse voglia di cambiare tutto, di colpo',
    'qualcuno ti dicesse proprio la cosa che avevi bisogno di sentire'
  ],
  risposta: ['Davvero? {reazione}.', '{reazione}. Raccontami meglio.', 'Ahah! {reazione}.'],
  risposta_caldo: ['{reazione}. Mi piace quando mi racconti queste cose.', 'Che bello. {reazione}.'],
  risposta_ironico: ['{reazione}. Solo a te succedono queste cose.', 'Ovviamente. {reazione}.'],
  risposta_timido: ['*sorride* {reazione}.', 'Oh... {reazione}.'],
  risposta_brontolone: ['Mah. {reazione}. Però fa ridere.', 'Tipico. {reazione}.'],
  risposta_entusiasta: ['NO! {reazione}!', 'Ma dai! {reazione}!'],
  reazione: [
    'Anche a me è capitata una cosa così',
    'Questa la devo raccontare a casa',
    'Non ci posso credere',
    'Secondo me è un segno',
    'Il mondo è pieno di sorprese',
    'Me lo segno, questa è da ricordare',
    'Mi hai fatto venire il buonumore',
    'È proprio da te',
    'Racconti le cose più belle'
  ],

  /* ---------- il giornale: brevi e dicerie ---------- */
  breve: [
    'Al tavolo {tavolo} {fatto_buffo}.',
    '{testimone_cap} riferisce che {fatto_buffo}.',
    'Segnalato {oggetto} dimenticato {luogo}. Il proprietario è pregato di passare al bancone.',
    'Record della settimana: {record}.'
  ],
  tavolo: ['vicino alla finestra', 'in fondo', 'sotto la lampada', 'accanto alla pianta', 'del giovedì'],
  fatto_buffo: [
    'qualcuno ha fatto una torre di zollette alta dodici piani',
    'si è discusso per un’ora su quale sia il biscotto migliore',
    'un cliente ha chiesto il bis del bis',
    'due sconosciuti hanno scoperto di avere lo stesso ombrello',
    'il gatto ha rubato un tovagliolo e l’ha portato in trionfo',
    'qualcuno ha cantato a bassa voce tutto un album',
    'un signore ha chiesto un caffè «senza caffè»',
    'una bambina ha battezzato la macchina del caffè «Gigi»',
    'qualcuno ha lasciato una poesia sotto la tazza',
    'due amici hanno giocato a tris sul tovagliolo per un’ora'
  ],
  testimone: [
    'il nostro inviato al bancone',
    'una fonte vicina allo zuccheriero',
    'un cliente che preferisce restare anonimo',
    'la pianta del tavolo tre'
  ],
  oggetto: [
    'un ombrello a pois',
    'un libro con la dedica',
    'una sciarpa arancione',
    'un mazzo di chiavi con un portachiavi a forma di tazzina',
    'un guanto spaiato'
  ],
  luogo: ['sotto il tavolo in fondo', 'vicino alla porta', 'sul davanzale', 'accanto alla cassa'],
  record: [
    'tre cappuccini ordinati nello stesso minuto',
    'il silenzio più lungo, durante un temporale',
    'la risata più forte, al tavolo vicino alla finestra',
    'il cornetto inzuppato più a lungo, quasi un minuto'
  ],
  diceria: [
    '{testimone_cap} giura di aver visto {X} e {Y} {insieme}. Sarà vero?',
    'Voci dal bancone: {X} e {Y} {insieme}. Indagheremo.',
    'Pare che {X} abbia {regalo} a {Y}. Noi non diciamo niente. Quasi.'
  ],
  insieme: [
    'dividere un cornetto',
    'ridere sotto lo stesso ombrello',
    'scegliere un libro insieme in libreria',
    'fare la fila al cinema dell’angolo',
    'passeggiare al mercato con un sacchetto di mandarini',
    'guardare la pioggia dalla stessa finestra',
    'comprare due biglietti per lo stesso concerto',
    'dare da mangiare ai piccioni al parco'
  ],
  regalo: [
    'lasciato un biglietto sotto la tazza',
    'regalato un mazzo di fiori gialli',
    'portato una fetta di torta',
    'prestato la sciarpa preferita'
  ]
};

/* ---------- Pezzi legati alle circostanze ---------- */
// «nome@circostanza» si aggiunge a «nome» quando la circostanza è vera (e pesa il doppio): il tempo (pioggia, temporale,
// sereno, nuvoloso, nebbia, neve), l'ora (mattina, pomeriggio, sera, notte), la stagione (primavera, estate, autunno,
// inverno), l'umore di chi parla (felice, giu), il locale (pieno, vuoto), i giorni di festa (festa).
Object.assign(GRAM, {
  /* il tempo */
  'scena@pioggia': [
    'la pioggia disegna righe storte sul vetro',
    'gli ombrelli gocciolano nel portaombrelli',
    'fuori la gente corre con il giornale sulla testa',
    'le grondaie cantano tutte insieme',
    'una goccia scende dal mio ombrello e fa una piccola pozza'
  ],
  'sensazione@pioggia': [
    'Con la pioggia fuori, qui dentro è ancora più caldo',
    'La pioggia mette pace',
    'Mi piace sentirla senza bagnarmi'
  ],
  'gesto@pioggia': [
    'strizza la sciarpa bagnata',
    'segue una goccia sul vetro con il dito',
    'appoggia l’ombrello gocciolante vicino alla sedia'
  ],
  'desiderio@pioggia': ['resterei qui finché non smette. Cioè, per sempre', 'mi comprerei degli stivali gialli, come da bambin{o}'],
  'lamento@pioggia': ['Ho le scarpe che fanno «ciac» a ogni passo', 'Ombrello rotto, di nuovo. Il terzo del mese'],
  'gioia@pioggia': ['Pioggia vera, finalmente', 'Che bello il rumore della pioggia'],
  'battuta@pioggia': ['In questa città si nasce con l’ombrello in mano', 'La pioggia mi ha seguito fin qui. Ora mi aspetta fuori'],
  'scena@temporale': ['un tuono fa tremare le tazzine', 'i lampi illuminano la strada a scatti', 'il vento sbatte la tenda della vetrina'],
  'sensazione@temporale': ['Col temporale fuori, questo posto sembra una nave sicura', 'Ogni tuono mi fa stringere la tazza'],
  'gesto@temporale': ['sobbalza a un tuono, poi ride', 'conta i secondi tra il lampo e il tuono'],
  'scena@sereno': [
    'il sole entra di sbieco e scalda il tavolo',
    'la vetrina brilla come appena lavata',
    'fuori il cielo è di un azzurro sfacciato'
  ],
  'sensazione@sereno': ['Con questo sole viene voglia di fare progetti', 'Il sole mi mette di buonumore'],
  'gesto@sereno': ['chiude gli occhi al sole, come un gatto', 'si toglie la giacca e la appoggia sulla sedia'],
  'desiderio@sereno': ['andrei a fare un giro al parco, dopo', 'mangerei un gelato, anche se è presto'],
  'scena@nuvoloso': ['il cielo è grigio come la schiuma del {item}', 'le nuvole passano basse sopra i tetti'],
  'sensazione@nuvoloso': ['Una giornata grigia, ma qui dentro è colorata', 'Con le nuvole basse si pensa meglio'],
  'scena@nebbia': [
    'la nebbia ha mangiato l’altro lato della strada',
    'i lampioni sembrano lune nella nebbia',
    'la gente esce dalla nebbia come in un sogno'
  ],
  'sensazione@nebbia': ['Con questa nebbia il caffè sembra un’isola', 'La nebbia rende tutto più misterioso'],
  'gesto@nebbia': ['pulisce il vetro appannato con la manica', 'scruta la nebbia cercando qualcuno'],
  'scena@neve': [
    'la neve si posa piano sul davanzale',
    'fuori i bambini fanno a palle di neve',
    'la strada è tutta bianca e silenziosa',
    'un fiocco si attacca al vetro e si scioglie'
  ],
  'sensazione@neve': ['La neve mi fa tornare bambin{o}', 'Con la neve il mondo fa meno rumore'],
  'gesto@neve': ['si scrolla la neve dal cappello', 'si soffia sulle dita fredde'],
  'desiderio@neve': ['farei un pupazzo di neve davanti alla vetrina', 'berrei una cioccolata densa come il budino'],
  'gioia@neve': ['Nevica! Nevica davvero', 'Che magia, la neve'],

  /* l'ora del giorno */
  'ora@mattina': ['Di prima mattina', 'Con il primo caffè della giornata', 'Mentre la città si sveglia'],
  'scena@mattina': [
    'il pane caldo profuma da dietro il bancone',
    'la luce del mattino è ancora timida',
    'i primi clienti hanno ancora il cuscino in faccia'
  ],
  'sensazione@mattina': ['La giornata può ancora andare in qualsiasi direzione', 'Mi sveglio un sorso alla volta'],
  'lamento@mattina': ['Troppo presto per parlare. Troppo presto per tutto', 'La sveglia ha suonato due volte. Io l’ho ignorata tre'],
  'ora@pomeriggio': ['A metà pomeriggio', 'Nella pausa del pomeriggio', 'Quando il pomeriggio si allunga'],
  'scena@pomeriggio': ['il locale ha la calma del dopo pranzo', 'qualcuno sonnecchia sul libro aperto'],
  'sensazione@pomeriggio': ['Il pomeriggio qui dentro dura il doppio, ed è un bene', 'Ci voleva una pausa così'],
  'ora@sera': ['A fine giornata', 'Con le luci della sera', 'Quando fuori si accendono le finestre'],
  'scena@sera': [
    'le finestre di fronte si accendono una a una',
    'il neon dell’insegna si specchia nella strada bagnata',
    'arrivano tutti con la stanchezza addosso'
  ],
  'sensazione@sera': ['La sera qui è il momento migliore', 'Finalmente posso tirare il fiato'],
  'ora@notte': ['A notte fonda', 'Mentre la città dorme', 'A quest’ora strana'],
  'scena@notte': [
    'siamo rimasti in pochi, come una piccola famiglia',
    'la strada è deserta e luccica',
    'il gatto è l’unico ancora sveglio, oltre a noi'
  ],
  'sensazione@notte': ['Di notte i pensieri fanno meno paura, qui', 'La notte qui dentro è gentile'],
  'desiderio@notte': ['vorrei che questa notte non finisse', 'scriverei a qualcuno, ma è troppo tardi. O troppo presto'],
  'battuta@notte': ['Sono le due di notte e il mio cervello ha deciso di essere brillante', 'Club degli insonni: seduta aperta'],

  /* la stagione */
  'scena@primavera': [
    'fuori i ciliegi hanno messo i fiori',
    'dalla porta entra un’aria che sa di erba',
    'un petalo è rimasto attaccato alla vetrina'
  ],
  'sensazione@primavera': ['La primavera mi fa venire voglia di ricominciare', 'Mi sento come un albero con le gemme'],
  'desiderio@primavera': ['pianterei qualcosa sul balcone', 'farei un picnic, se smettesse di piovere'],
  'scena@estate': [
    'il ventilatore gira pigro sul soffitto',
    'fuori l’asfalto sa di caldo e di pioggia',
    'qualcuno ordina tutto ghiacciato'
  ],
  'sensazione@estate': ['Le sere d’estate non finiscono mai', 'D’estate qui c’è un’aria da vacanza'],
  'desiderio@estate': ['andrei al mare anche solo per un pomeriggio', 'dormirei con la finestra aperta, ad ascoltare i grilli'],
  'scena@autunno': [
    'le foglie arancioni si incollano al marciapiede',
    'fuori il vento fa girare le foglie in tondo',
    'il profumo di caldarroste arriva dall’angolo'
  ],
  'sensazione@autunno': ['L’autunno mi fa venire voglia di maglioni e libri', 'C’è una malinconia dolce, in autunno'],
  'desiderio@autunno': ['comprerei un sacchetto di castagne calde', 'rileggerei il mio libro preferito sotto una coperta'],
  'scena@inverno': [
    'i vetri sono appannati dal freddo',
    'tutti entrano soffiandosi sulle mani',
    'le sciarpe pendono dagli schienali come bandiere'
  ],
  'sensazione@inverno': ['D’inverno questo posto è un abbraccio', 'Con il freddo fuori si apprezza ogni sorso'],
  'desiderio@inverno': ['mi farei una cioccolata con la panna doppia', 'starei sotto una coperta fino a primavera'],

  /* l'umore di chi parla */
  'pensiero@giu': ['*{gesto_giu}*', '{ora}, {scena}. {conforto}.', '{pesantezza}. {conforto}.'],
  gesto_giu: [
    'fissa la tazza senza bere',
    'appoggia la fronte alla mano',
    'guarda la pioggia per un tempo lunghissimo',
    'si stringe nel cappotto'
  ],
  pesantezza: [
    'È stata una giornata pesante',
    'Certi giorni pesano più degli altri',
    'Oggi mi sento un po’ spent{o}',
    'Ho la testa piena di pensieri'
  ],
  conforto: [
    'Ma qui si respira',
    'Almeno qui posso stare in silenzio',
    'Un sorso alla volta, va meglio',
    'Domani sarà un altro giorno, dicono'
  ],
  'pensiero@felice': ['{ora}, {scena}. {euforia}!', '*{gesto}* {euforia}!', '{euforia}: {motivo_felice}.'],
  euforia: ['Che giornata', 'Mi sento benissimo', 'Oggi va tutto per il verso giusto', 'Ho voglia di offrire da bere a tutti'],
  motivo_felice: ['è andato tutto bene', 'ho ricevuto una bella notizia', 'mi hanno detto una cosa gentile', 'il mondo oggi mi sorride'],

  /* il locale */
  'scena@pieno': ['non c’è un tavolo libero', 'le chiacchiere si mescolano in un unico brusio', 'il barista corre come un ballerino'],
  'sensazione@pieno': ['Mi piace quando c’è tanta gente', 'Tutta la città sembra essere qui stasera'],
  'lamento@pieno': ['Non si sente niente con tutto questo chiasso', 'Ho dovuto aspettare per sedermi. Ai miei tempi...'],
  'scena@vuoto': ['siamo rimasti in pochissimi', 'il locale è silenzioso come una biblioteca', 'si sente solo la macchina del caffè'],
  'sensazione@vuoto': ['Mi piace il locale così, mezzo vuoto', 'Sembra tutto per me'],

  /* i giorni di festa */
  'scena@festa': [
    'le ghirlande dondolano sopra il bancone',
    'tutti hanno l’aria di chi festeggia',
    'qualcuno ha portato dei dolci da dividere'
  ],
  'sensazione@festa': ['Oggi c’è aria di festa', 'Nei giorni di festa qui si sta ancora meglio'],
  'gioia@festa': ['Auguri a tutti', 'Che festa bellissima'],

  /* chiacchiere legate al momento */
  'cosa_vista@pioggia': ['quanto è salita l’acqua nel canale', 'il signore che passa con tre ombrelli insieme'],
  'cosa_vista@neve': ['il pupazzo di neve davanti al forno', 'i bambini che scivolano sul marciapiede'],
  'cosa_vista@sereno': ['quanta gente c’è al parco oggi', 'il cielo azzurro sopra i tetti'],
  'cosa_vista@nebbia': ['il tram che spunta dalla nebbia come un fantasma'],
  'dilemma@pioggia': ['è meglio un ombrello grande o due piccoli', 'la pioggia la si ama o la si odia'],
  'dilemma@notte': ['si pensa meglio di notte o di giorno', 'chi va a letto presto si perde qualcosa'],
  'dilemma@inverno': ['è meglio la neve o il sole d’inverno', 'la cioccolata va con la panna o senza'],
  'dilemma@estate': ['è meglio il mare o la montagna', 'il caffè freddo è ancora caffè'],
  'aneddoto@pioggia': ['l’ombrello mi si è girato al contrario davanti a tutti', 'ho saltato una pozzanghera e ci sono atterrat{o} dentro'],
  'aneddoto@mattina': ['ho messo il sale nel caffè, invece dello zucchero', 'sono uscit{o} con due scarpe diverse'],
  'aneddoto@autunno': [
    'una foglia mi è entrata nel colletto e l’ho portata fin qui',
    'ho comprato le castagne e le ho mangiate tutte per strada'
  ],
  'aneddoto@primavera': ['un’ape mi ha seguito per mezzo isolato', 'ho starnutito quaranta volte. Il polline mi odia'],

  /* il giornale */
  'fatto_buffo@pioggia': ['un cliente ha fatto asciugare i calzini sul termosifone', 'si è formata una fila per il portaombrelli'],
  'fatto_buffo@neve': [
    'qualcuno ha portato dentro una palla di neve per farla vedere al gatto',
    'un pupazzo di neve ha avuto la sciarpa del barista'
  ],
  'fatto_buffo@notte': ['alle tre di notte si è formato un coro spontaneo', 'un nottambulo ha chiesto la colazione a mezzanotte'],
  'fatto_buffo@festa': [
    'qualcuno ha appeso una ghirlanda storta e nessuno ha avuto il coraggio di dirglielo',
    'si sono mangiate quattro torte in un’ora'
  ]
});
