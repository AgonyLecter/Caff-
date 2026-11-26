// Personaggi chiave che restano (KEYS), legami di partenza (KSEED), incontri tra storie (XS) ed epiloghi (XEPI).

// Finita la loro storia, i personaggi chiave diventano habitué speciali: tornano da soli o in compagnia,
// hanno abitudini, frasi proprie, animali, legami già nati nelle storie, vite nuove e incontri tra storie diverse.
const fl = f => checkFlag(f);
const KEYS = {
  davide: {
    type: 'normale',
    fav: 'caffe',
    tr: ['timido', 'brontolone'],
    // nel finale più duro torna anche lui, ma qualche giorno dopo: è stato in reparto
    ok: () => arcDone('davide') && (!fl('davide=crisi') || st.day >= ((st.arcDay || {}).davide || 0) + 4),
    l: [
      'Il caffè semplice. Ma oggi lo bevo caldo.',
      '*guarda la pioggia, stavolta con calma*',
      'Mia moglie dice che ho ricominciato a fischiettare. Non me ne ero accorto.',
      'Elena mi ha chiesto di insegnarle a impaginare. Dice che è per la tesi. Secondo me è una scusa per vedermi.',
      ['Giovedì dalla dottoressa. Ho imparato che ci si può arrabbiare anche con la tristezza.', 'davide=salvo'],
      ['I ragazzi del corso mi chiamano «maestro». Io faccio finta che mi dia fastidio.', 'davide=salvo'],
      ['Oggi è una giornata media. Le giornate medie sono una conquista.', 'davide=fragile'],
      ['Uno alla volta. I giorni, dico. Uno alla volta.', 'davide=fragile'],
      ['In reparto ho imparato una cosa: chiedere aiuto non è perdere.', 'davide=crisi'],
      ['Mi hanno detto che mi avete tenuto il tavolo. Non sapete cosa vuol dire.', 'davide=crisi']
    ]
  },
  yusuf: {
    type: 'nottambulo',
    fav: 'corn',
    tr: ['sognatore', 'chiacchierone'],
    ok: () => arcDone('yusuf'),
    l: [
      '*analizza il cornetto controluce* Ventotto strati. Migliorate.',
      'Stanotte ho inventato un dolce col baobab e la ricotta. Il capo ha urlato. Poi ne ha mangiati tre.',
      'Mia madre ha visto la foto con voi. Ora chiede di Nonna Rosa ogni mattina.',
      'Studio per la patente. Le precedenze italiane sono un mistero più grande del mare.',
      ['Quando qualcuno mi guarda storto, penso a quel giorno al bancone. E sto dritto.', 'yusuf=difendi'],
      ['Ho smesso di lasciar perdere. Ora rispondo. Con educazione, ma rispondo.', 'yusuf=lascia']
    ]
  },
  mia: {
    type: 'artista',
    fav: 'capp',
    tr: ['artista', 'romantico'],
    ok: () => arcDone('pioggia'),
    l: [
      'Oggi disegno solo mani. Le mani dicono tutto.',
      '*schizza la pioggia sul vetro*',
      'Luca dice che disegno più lui che la città. Ha ragione.',
      'Questo tavolo ha visto più disegni miei che il mio studio.',
      '*mordicchia la matita*',
      'Il gatto del bancone non sta mai fermo. Modello pessimo.',
      ['Ho ancora la macchia del caffè di Luca sul quaderno. Non la cancellerò mai.', 'pioggia=adesso'],
      ['Ogni tanto canticchio la canzone che mi ha scritto. Di nascosto.', 'pioggia=canzone'],
      ['Stesso tavolo per sempre. Lo abbiamo promesso davanti a tutti.', 'nozze=canzone'],
      ["Ho incorniciato l'omino con l'anello. È il disegno più brutto e più bello che ho.", 'nozze=disegno']
    ]
  },
  luca: {
    type: 'musicista',
    fav: 'caffe',
    tr: ['sognatore', 'romantico'],
    ok: () => arcDone('pioggia'),
    l: [
      '*batte il ritmo sul tavolo con le dita*',
      'Ho una melodia in testa da tre giorni. Non se ne va.',
      'Il rumore della macchina del caffè è in La. Lo giuro.',
      'Mia mi ha disegnato mentre dormivo. Di nuovo.',
      '*scrive note su un tovagliolo*',
      'Le canzoni migliori le ho scritte con la pioggia fuori.',
      ['Tommy vuole una canzone sul ramen. Ci sto pensando seriamente.', 'band=macinati'],
      ['Doppio Ristretto, primo album. Un giorno.', 'band=doppio']
    ]
  },
  marta: {
    type: 'normale',
    fav: 'capp',
    tr: ['chiacchierone', 'sportivo'],
    w: () => (fl('valigie=vai') ? 0.25 : 1),
    ok: () => (fl('valigie=vai') ? arcDone('tokyo') : arcDone('lettere')),
    l: [
      ['Tokyo è bellissima. Ma il cappuccino è questo.', 'valigie=vai'],
      ['Tre giorni di ferie e siamo corsi qui. Gio voleva vedere il gatto del bancone.', 'valigie=vai'],
      ['Un anno lontana. Adesso non mi muovo più da questo tavolo.', 'valigie=resta'],
      ['Gio mi ha mostrato il calendario. Tutte le croci. Una per ogni caffè.', 'valigie=resta'],
      "*controlla l'orologio, poi si ricorda che non ha fretta*",
      'Ho imparato a dire «buongiorno» in giapponese. Lo dico a tutti.'
    ]
  },
  gio: {
    type: 'normale',
    fav: 'capp',
    tr: ['brontolone', 'romantico'],
    w: () => (fl('valigie=vai') ? 0.25 : 1),
    ok: () => arcDone('valigie') && (fl('valigie=resta') || arcDone('tokyo')),
    l: [
      ['Il calendario è finito. Ne ho comprato un altro. Per segnare i giorni belli.', 'valigie=resta'],
      ['Lì il cappuccino costa il triplo. Lo ripeterò finché vivo.', 'valigie=vai'],
      '*sfoglia il giornale e brontola*',
      'Questo posto non cambia mai. È per questo che torno.',
      'Marta dice che sono un brontolone. Ha ragione, ma non deve dirlo.'
    ]
  },
  bruni: {
    type: 'lettore',
    fav: 'caffe',
    tr: ['nerd', 'brontolone'],
    ok: () => arcDone('romanzo'),
    l: [
      'Capitolo dodici. Pioveva, ovviamente.',
      '*corregge una bozza con la penna rossa*',
      'Mi scrivono lettori da tutta Italia. Uno da Tokyo.',
      'Il segreto di un buon romanzo è un buon caffè. E il silenzio.',
      '*osserva i clienti sopra gli occhiali e prende appunti*',
      ['Il barista del mio libro ha più fan di me. Sono geloso.', 'romanzo=eroe'],
      ['Il personaggio che non si vede mai... i lettori mi chiedono chi sia. Non lo dirò.', 'romanzo=quinte']
    ]
  },
  sara: {
    type: 'nottambulo',
    fav: 'caffe',
    tr: ['timido', 'sportivo'],
    ok: () => arcDone('romanzo'),
    l: [
      'Dodici ore di turno. Questo caffè me lo sono meritato.',
      '*si toglie le scarpe sotto il tavolo*',
      'Stanotte è nata una bambina. Ha urlato più di tutti noi messi insieme.',
      "Il professore mi ha fatto diventare famosa. In reparto mi chiamano «l'eroina».",
      '*si addormenta un secondo, poi si sveglia di colpo*',
      'Pietro ormai mi corregge le flebo. Sono fiera e offesa.'
    ]
  },
  pietro: {
    type: 'nottambulo',
    fav: 'caffe',
    tr: ['timido', 'sportivo'],
    ok: () => arcDone('notturno'),
    l: [
      'Turno finito. Nessuno è peggiorato. Notte buona.',
      '*ripassa un manuale di anatomia*',
      'Sara dice che sono pronto per formare i nuovi. Io non mi sento pronto.',
      'Ho le mani che non tremano più. Quasi mai.',
      ['Ogni tanto mi siedo al tavolo di quella notte. Dove mi sono addormentato.', 'notturno=resta'],
      ['Il giorno dopo sono tornato in reparto. E quello dopo. Non ho più smesso.', 'notturno=coraggio']
    ]
  },
  kenji: {
    type: 'nottambulo',
    fav: 'ramen',
    tr: ['sognatore', 'chiacchierone'],
    ok: () => arcDone('consegne'),
    l: [
      '*annusa la tazza come se fosse un brodo*',
      'Il segreto del brodo è la pazienza. Del caffè pure.',
      'Nonna Rosa mi ha chiamato tre volte oggi. Per sapere se ho mangiato.',
      ["Dopo il turno in cucina mi siedo dall'altra parte. È strano. È bello.", 'consegne=qui'],
      ['Il mio locale è pieno. Ma il caffè lo prendo sempre qui.', 'consegne=suo'],
      ['Nora dice che cucino come un veterinario: con troppa cura.', 'cuore=nora'],
      ["Bianca mi ruba il cappello ogni sera. Gliel'ho regalato.", 'cuore=bianca'],
      ['Espresso ha rovesciato la salsa di soia sul letto. Di nuovo.', 'randagio=espresso'],
      ['Pioggia dorme sul mio cuscino. Io dormo sul bordo.', 'randagio=pioggia']
    ]
  },
  rosa: {
    type: 'nonno',
    fav: 'cake',
    tr: ['chiacchierone', 'brontolone'],
    ok: () => arcDone('consegne'),
    l: [
      '*lavora a maglia una sciarpa lunghissima*',
      'Questa sciarpa è per Kenji. Non lo sa. Non deve saperlo.',
      "I giovani d'oggi non mangiano. Li vedo, sai.",
      'Ciuffo stanotte ha dormito sui miei piedi. Ho i piedi caldi e il cuore pure.',
      "Sessant'anni fa questo era un forno. Si stava bene anche allora.",
      ['Ugo passa a prendermi alle sei. Puntuale come la posta.', 'postino=subito'],
      ['Quella lettera la tengo sotto il cuscino. Non ditelo a Ugo.', 'postino=casa']
    ]
  },
  dario: {
    type: 'nonno',
    fav: 'caffe',
    tr: ['brontolone', 'sportivo'],
    ok: () => arcDone('scacchi'),
    l: [
      'Cavallo in f3. No. Sì. No.',
      '*sistema i pezzi sulla scacchiera, anche se è da solo*',
      'Elio è in ritardo. Come nel 1982.',
      'Re, stai fermo. Re! Il cane, non il pezzo.',
      ['Il torneo di questo mese ha trenta iscritti. Trenta! Io ho perso al secondo turno.', 'scacchi=torneo'],
      ['Ogni tanto accarezzo la targhetta. Elio non deve vedermi.', 'scacchi=tavolo']
    ]
  },
  elio: {
    type: 'nonno',
    fav: 'matcha',
    tr: ['nerd', 'timido'],
    ok: () => arcDone('scacchi'),
    l: [
      '*legge un libro di aperture scacchistiche*',
      "Il dottore dice che il cuore va bene. Dario dice che non ce l'ho.",
      "Gioco da sessant'anni. Dario da sessant'anni perde.",
      '*sorride guardando la scacchiera vuota*',
      ['Aldo migliora ogni giovedì. Tra poco ci batte tutti e due.', 'club=giovedi'],
      ["Tre alfieri. Il nome l'ho preso dal barista. Gran nome.", 'club=alfieri']
    ]
  },
  aldo: {
    type: 'nonno',
    fav: 'caffe',
    tr: ['romantico', 'timido'],
    ok: () => arcDone('tazze'),
    l: [
      'Un caffè solo. Adesso va bene così.',
      '*guarda la sedia di fronte, poi sorride*',
      'Lidia avrebbe adorato questa musica.',
      'Giada viene il giovedì. Il giovedì è il giorno più bello della settimana.',
      ['Il disegno di Giada è appeso sopra il nostro tavolo. Lo guardo ogni volta.', 'lezioni=nonno'],
      ['Sto imparando gli scacchi. Lidia rideva sempre quando perdevo.', 'club=giovedi']
    ]
  },
  giada: {
    type: 'studente',
    fav: 'bubble',
    tr: ['artista', 'timido'],
    ok: () => arcDone('tazze'),
    l: [
      '*disegna di nascosto i clienti*',
      "Domani ho l'esame di storia dell'arte. Ho ripassato disegnando.",
      'Il nonno è più felice. Si vede da come mescola lo zucchero.',
      'Fragola ha mangiato il mio cappello. Di nuovo.',
      ['Mia dice che tra poco la supero. Mente, ma è gentile.', 'lezioni=pioggia'],
      ["La nonna Lidia disegnava anche lei. L'ho scoperto da poco.", 'lezioni=nonno']
    ]
  },
  tommy: {
    type: 'musicista',
    fav: 'smooth',
    tr: ['chiacchierone', 'sognatore'],
    ok: () => arcDone('comico'),
    l: [
      'Perché il barista non gioca a nascondino? Perché lo trovano sempre al bancone!',
      '*prova una battuta sottovoce e ride da solo*',
      'Ho un pezzo nuovo sulla pioggia. Fa piangere. Dal ridere, spero.',
      "Una signora mi ha riconosciuto al supermercato! Voleva sapere dov'è il pane.",
      ['Irene ha riso due volte questa settimana. Record.', 'comico=irene'],
      ['Il pezzo sul barista e il caffè finito è diventato famoso. Scusa.', 'comico=bar']
    ]
  },
  irene: {
    type: 'lettore',
    fav: 'affo',
    tr: ['timido', 'nerd'],
    ok: () => arcDone('comico'),
    l: [
      '*legge senza alzare gli occhi*',
      'Non sto sorridendo. È la luce.',
      'Tommy mi manda battute alle tre di notte. Rispondo con un punto.',
      '*scrive qualcosa su un quaderno nero, poi lo nasconde*',
      ['Siamo andati a cena. Ha fatto una battuta sul menù. Sono rimasta.', 'comico=irene'],
      ['Ho riso in pubblico, quella sera. Non succederà più. Forse.', 'comico=bar']
    ]
  },
  nora: {
    type: 'nottambulo',
    fav: 'tira',
    tr: ['sportivo', 'romantico'],
    ok: () => arcDone('randagio'),
    l: [
      'Turno al canile. Tre cuccioli adottati. Giornata perfetta.',
      '*ha peli di gatto ovunque sul cappotto*',
      'Pio canta solo quando piove. Come certi musicisti.',
      "Ogni gatto del quartiere mi conosce. Ogni gatto del quartiere mi odia un po'.",
      ['Espresso pesa sei chili. Kenji gli dà il ramen, lo so.', 'randagio=espresso'],
      ['Pioggia ha imparato ad aprire il frigo. Kenji è disperato.', 'randagio=pioggia'],
      ['Kenji mi prepara la cena ogni sera. La prescrizione funziona.', 'cuore=nora']
    ]
  },
  ugo: {
    type: 'normale',
    fav: 'corn',
    tr: ['chiacchierone', 'romantico'],
    ok: () => arcDone('lettere') || arcDone('tokyo'),
    l: [
      "Trent'anni di posta. Conosco ogni cassetta della città.",
      '*conta le cartoline sul muro*',
      'Il nuovo postino corre troppo. Non saluta nessuno.',
      "Le lettere d'amore pesano di più. È scienza postale.",
      ['In pensione cammino lo stesso. Ma senza la borsa, e con Rosa.', 'postino=subito'],
      ['Rosa non mi ha ancora detto cosa pensa della lettera. Ma mi fa trovare il tè.', 'postino=casa']
    ]
  },
  vittoria: {
    type: 'normale',
    fav: 'affo',
    tr: ['brontolone', 'artista'],
    ok: () => arcDone('rivale'),
    l: [
      '*occhiali da sole, anche se è notte*',
      'Il mio locale ha i tavoli più belli. Questo ha la gente più bella.',
      'Ho copiato la vostra lavagna. Non ditelo.',
      'Mia nonna aveva un caffè, una volta. Era piccolo come questo.',
      ['Tavoli grandi, gente vicina. Il consiglio migliore che abbia mai ricevuto.', 'rivale=gente'],
      ['Prego ancora per i temporali. Funziona sempre.', 'rivale=pioggia']
    ]
  }
};
// legami che esistono già dalle storie
const KSEED = [
  ['yusuf', 'rosa', () => arcDone('yusuf'), () => 'famiglia'],
  ['mia', 'luca', () => arcDone('pioggia'), () => (arcDone('nozze') ? 'sposati' : 'coppia')],
  ['marta', 'gio', () => arcDone('valigie'), () => 'coppia'],
  ['luca', 'tommy', () => arcDone('band'), () => 'migliori'],
  ['tommy', 'irene', () => arcDone('comico'), () => (fl('comico=irene') ? 'coppia' : 'amici')],
  ['kenji', 'rosa', () => arcDone('consegne'), () => 'famiglia'],
  ['kenji', 'nora', () => arcDone('randagio'), () => (arcDone('cuore') ? (fl('cuore=nora') ? 'coppia' : 'amici') : 'cotta')],
  ['dario', 'elio', () => arcDone('scacchi'), () => 'migliori'],
  ['aldo', 'dario', () => arcDone('club'), () => 'amici'],
  ['aldo', 'elio', () => arcDone('club'), () => 'amici'],
  ['aldo', 'giada', () => arcDone('tazze'), () => 'famiglia'],
  ['giada', 'mia', () => arcDone('lezioni'), () => 'amici'],
  ['sara', 'bruni', () => arcDone('romanzo'), () => 'amici'],
  ['sara', 'pietro', () => arcDone('notturno'), () => 'amici'],
  ['bruni', 'mia', () => arcDone('seguito'), () => 'amici'],
  ['gio', 'ugo', () => arcDone('lettere'), () => 'amici'],
  ['ugo', 'rosa', () => arcDone('postino'), () => 'coppia'],
  ['vittoria', 'tommy', () => arcDone('festa'), () => 'amici'],
  ['vittoria', 'luca', () => arcDone('festa'), () => 'amici']
];
/* ----- incroci tra storie diverse (una volta sola) e epiloghi ----- */
const XS = [
  {
    id: 'x_yusuf_kenji',
    w: ['yusuf', 'kenji'],
    req: () => arcDone('yusuf') && arcDone('consegne'),
    l: [
      [1, 'Tu sei quello dei cornetti di notte? Li sento profumare quando chiudo la cucina.'],
      [0, 'E tu quello del ramen. Nonna Rosa parla di te come di un nipote.'],
      [1, 'Anche di te. Ci ha adottati tutti e due, a quanto pare.'],
      [0, 'Tu sei nato qui?'],
      [1, 'Sì. Mia madre è arrivata da Osaka con una valigia e una ricetta. Il ramen è la valigia che si è portata dietro.'],
      [0, 'Io ho portato la ricetta del pane di mia nonna. Nella testa. La valigia era nel mare.'],
      [1, 'Allora facciamo un piatto insieme. Ramen e pane gambiano.'],
      [0, 'Nonna Rosa dirà che è troppo salato.'],
      [1, 'Lo dice sempre. È il suo modo di dire «ti voglio bene».']
    ]
  },
  {
    id: 'x_davide_yusuf',
    w: ['davide', 'yusuf'],
    req: () => arcDone('davide') && arcDone('yusuf'),
    l: [
      [1, 'Signore, lei è sempre qui la mattina. Assaggi, cornetto appena sfornato.'],
      [0, '...È ancora caldo. Grazie, ragazzo.'],
      [1, "Mi hanno detto che lei stampava libri. Io non so leggere bene l'italiano. Ancora."],
      [0, "Io non sapevo più chi ero, senza lavoro. Ancora un po' non lo so."],
      [1, 'Sulla barca pensavo di non valere niente. Una cosa da buttare in mare per alleggerire.'],
      [1, 'Poi qualcuno mi ha dato un cornetto secco. E ho pensato: allora valgo un cornetto. Si comincia da lì.'],
      [0, '*ride, per la prima volta da tanto*'],
      [0, 'Ti insegno a leggere i caratteri. Tu mi insegni i cornetti. Affare?'],
      [1, 'Affare. Ma il burro lo porto io.']
    ]
  },
  {
    id: 'x_davide_dario',
    w: ['davide', 'dario'],
    req: () => arcDone('davide') && arcDone('scacchi'),
    l: [
      [1, 'Lei. Sì, lei. Sa giocare a scacchi?'],
      [0, "Da ragazzo. In tipografia, nelle pause. Non ci gioco da trent'anni."],
      [1, 'Elio è dal dottore e io ho bisogno di battere qualcuno.'],
      [0, '*sposta un pedone, piano*'],
      [1, 'Hm. Lei pensa prima di muovere. Mi piace.'],
      [0, 'Ultimamente penso troppo. Sto imparando a farlo meglio.'],
      [1, 'Allora il martedì venga qui. Gli scacchi sono la medicina dei vecchi testardi.'],
      [0, 'Non sono vecchio.'],
      [1, 'Ma testardo sì. Si vede da come tiene la torre.']
    ]
  },
  {
    id: 'x_davide_ugo',
    w: ['davide', 'ugo'],
    req: () => arcDone('davide') && (arcDone('lettere') || arcDone('tokyo')),
    l: [
      [1, "Lei è quello della tipografia Ferrari? Vi portavo la posta. Trent'anni."],
      [0, 'Ugo! Il postino che fischiava La Traviata!'],
      [1, 'Quando avete chiuso, la mia borsa è diventata più leggera. E più triste.'],
      [0, "Anch'io. Più leggero e più triste."],
      [1, 'Io sono andato in pensione e per un mese non sapevo cosa fare delle mani.'],
      [1, 'Poi ho capito: le persone. Non la posta. Mi mancavano le persone.'],
      [0, 'Le persone. Sì. Credo sia lo stesso per me.'],
      [1, 'Allora domani facciamo il mio vecchio giro. Passiamo davanti alla tipografia. Ci fermiamo e la salutiamo.']
    ]
  },
  {
    id: 'x_rosa_mia',
    w: ['rosa', 'mia'],
    req: () => arcDone('consegne') && arcDone('pioggia'),
    l: [
      [0, 'Tu sei la ragazza del quaderno. Quella del musicista.'],
      [1, 'Mia. Piacere, signora Rosa.'],
      [0, 'Quel ragazzo con le cuffie... mangia abbastanza?'],
      [1, 'Mangia biscotti. Tanti biscotti.'],
      [0, 'Biscotti! Non è mangiare. Portamelo domenica, gli faccio le polpette.'],
      [1, '*ride* Non so se sopravvivrà.'],
      [0, 'Kenji è sopravvissuto. Ed era più magro.']
    ]
  },
  {
    id: 'x_kenji_luca',
    w: ['kenji', 'luca'],
    req: () => arcDone('consegne') && arcDone('pioggia'),
    l: [
      [0, 'Ehi, io ti conosco! Ti portavo il ramen alle tre di notte.'],
      [1, 'Lo studio di registrazione sopra la lavanderia!'],
      [0, 'Mancia sempre in monetine. E una volta in plettri.'],
      [1, 'Erano plettri buoni!'],
      [0, 'Li ho ancora. Ne uso uno per mescolare il brodo.'],
      [1, 'Allora la mia musica è nel tuo ramen. Mi sembra giusto.']
    ]
  },
  {
    id: 'x_tommy_dario',
    w: ['tommy', 'dario'],
    req: () => arcDone('comico') && arcDone('scacchi'),
    l: [
      [0, 'Signore! Sa perché il re degli scacchi è sempre stanco?'],
      [1, 'No. E non voglio saperlo.'],
      [0, 'Perché si muove sempre di una casella... alla volta!'],
      [1, '...'],
      [1, 'Questa era davvero brutta, ragazzo.'],
      [0, 'Ma ha sorriso!'],
      [1, 'Era una smorfia di dolore. Siediti, ti insegno a perdere con dignità.']
    ]
  },
  {
    id: 'x_irene_bruni',
    w: ['irene', 'bruni'],
    req: () => arcDone('comico') && arcDone('romanzo'),
    l: [
      [0, 'Professore. Ho letto il suo libro. Tre volte.'],
      [1, 'Tre! E le è piaciuto?'],
      [0, "C'è una cliente che non ride mai. Al tavolo vicino alla finestra."],
      [1, 'Ah. Sì.'],
      [0, 'Sono io, vero?'],
      [1, '...Ho cambiato il colore dei capelli. Per discrezione.'],
      [0, '*ride. Davvero, per un secondo*'],
      [1, 'Oh. Adesso devo riscrivere il capitolo.']
    ]
  },
  {
    id: 'x_nora_rosa',
    w: ['nora', 'rosa'],
    req: () => arcDone('randagio') && arcDone('consegne'),
    l: [
      [1, 'Tu sei la dottoressa dei gatti. Quella del ragazzo.'],
      [0, 'Nora. E lui è... Kenji è Kenji.'],
      [1, 'Gli dai da mangiare?'],
      [0, 'Lui dà da mangiare a me. E al gatto. E a mezzo quartiere.'],
      [1, 'Bene. Allora sei approvata.'],
      [0, 'Approvata per cosa?'],
      [1, 'Lo saprai. Le nonne sanno le cose prima.']
    ]
  },
  {
    id: 'x_sara_kenji',
    w: ['sara', 'kenji'],
    req: () => arcDone('romanzo') && arcDone('consegne'),
    l: [
      [1, 'Il pronto soccorso! Vi portavo i ravioli alle quattro del mattino.'],
      [0, 'Il ragazzo dei ravioli! Ci hai salvato più turni tu dei medici.'],
      [1, 'Ne mettevo sempre due in più. Per chi aveva pianto.'],
      [0, 'Lo sapevamo. Li chiamavamo «i ravioli della consolazione».'],
      [1, 'Adesso li cucino anche qui. Stessa ricetta.'],
      [0, 'Allora passo più spesso. Per le notti difficili.']
    ]
  },
  {
    id: 'x_vittoria_aldo',
    w: ['vittoria', 'aldo'],
    req: () => arcDone('rivale') && arcDone('tazze'),
    l: [
      [1, 'Signorina, lei mi ricorda qualcuno. Il naso, la voce...'],
      [0, 'Mi dicono che somiglio a mia nonna. Aveva un caffè in centro, negli anni settanta.'],
      [1, 'Il Caffè Aurora? Con le tende verdi?'],
      [0, '...Come lo sa?'],
      [1, 'È lì che ho conosciuto Lidia. Nel 1974. Mi rovesciò il latte sui pantaloni.'],
      [0, 'Nel locale di mia nonna?'],
      [1, "Senza sua nonna non avrei avuto cinquant'anni di felicità."],
      [0, '*si toglie gli occhiali da sole. Ha gli occhi lucidi*'],
      [0, 'Allora il caffè oggi glielo offro io. Debito di famiglia.']
    ]
  },
  {
    id: 'x_ugo_mia',
    w: ['ugo', 'mia'],
    req: () => (arcDone('lettere') || arcDone('tokyo')) && arcDone('pioggia'),
    l: [
      [0, "Mia! Ti ricordi il plico che ho consegnato a quell'editore, l'anno scorso?"],
      [1, 'I miei disegni! Non mi hanno mai risposto.'],
      [0, "Hanno risposto adesso. Ce l'ho in borsa. L'ultima lettera da postino, giuro."],
      [1, '*apre la busta con le mani che tremano*'],
      [1, 'Vogliono un libro illustrato. UN LIBRO.'],
      [0, "Le buste buone si riconoscono dal peso. Te l'avevo detto."]
    ]
  },
  {
    id: 'x_giada_tommy',
    w: ['giada', 'tommy'],
    req: () => arcDone('tazze') && arcDone('comico'),
    l: [
      [1, 'Perché il cornetto non va mai in palestra? Perché è già... sfogliato!'],
      [0, '*scoppia a ridere fortissimo*'],
      [1, '...Ha riso. HAI RISO! Nessuno ride mai!'],
      [0, 'Era bellissima! Ne hai altre?'],
      [1, 'Ne ho trecento. Tu sei il mio nuovo pubblico preferito.'],
      [0, 'Il nonno dice che le tue battute sono terribili.'],
      [1, 'Il nonno ha ragione. Ma tu ridi lo stesso. È questo il segreto.']
    ]
  },
  {
    id: 'x_pietro_luca',
    w: ['pietro', 'luca'],
    req: () => arcDone('notturno') && arcDone('pioggia'),
    l: [
      [0, 'Tu sei Luca? Quello di «Tavolo vicino alla finestra»?'],
      [1, 'Sì... la conosci?'],
      [0, 'La ascolto in pausa, alle quattro, in reparto. Tutte le notti.'],
      [1, 'Davvero? Nel tuo reparto?'],
      [0, "L'ho fatta sentire a un signore che non dormiva. Si è addormentato al secondo ritornello."],
      [1, 'È la recensione più bella che abbia mai avuto.']
    ]
  },
  {
    id: 'x_marta_mia',
    w: ['marta', 'mia'],
    req: () => arcDone('valigie') && arcDone('pioggia') && keyReg('marta'),
    l: [
      [0, 'Tu sei Mia. Mi hai disegnata il giorno del litigio, vero?'],
      [1, 'Oddio. Te ne sei accorta?'],
      [0, 'Gio mi ha mandato la foto del disegno. A Tokyo.', 'valigie=vai'],
      [0, "Gio me l'ha fatto vedere quando sono tornata. Era sul calendario.", 'valigie=resta'],
      [1, 'Eravate così arrabbiati. E così innamorati. Non potevo non disegnarvi.'],
      [0, 'Ce lo regali? Per il nostro tavolo.'],
      [1, 'Solo se mi raccontate come è finita. Per il prossimo disegno.']
    ]
  },
  {
    id: 'x_gio_dario',
    w: ['gio', 'dario'],
    req: () => arcDone('valigie') && arcDone('scacchi'),
    l: [
      [1, 'Ragazzo, giochi a scacchi?'],
      [0, 'Ho imparato per passare il tempo. Quando Marta era lontana.', 'valigie=resta'],
      [0, 'Gioco per corrispondenza con un signore di Osaka. Da Tokyo.', 'valigie=vai'],
      [1, 'Allora siediti. Vediamo cosa ti hanno insegnato la nostalgia e la distanza.'],
      [0, '*apre con il pedone del re*'],
      [1, 'Apertura da innamorato. Si vede subito.']
    ]
  },
  {
    id: 'x_vittoria_kenji',
    w: ['vittoria', 'kenji'],
    req: () => arcDone('rivale') && arcDone('consegne'),
    l: [
      [0, 'Tu sei il ragazzo del ramen. Lo voglio nel mio menù.'],
      [1, 'Il ramen di Nonna Rosa non si vende a chiunque.'],
      [0, 'Non sono chiunque. Sono la tua vicina più elegante.'],
      [1, 'Il tuo locale è a due strade dal mio! Facciamo uno scambio?', 'consegne=suo'],
      [1, 'Si cucina qui. Se lo vuoi, vieni a mangiarlo qui.', 'consegne=qui'],
      [0, "*sospira* Sempre tutti qui. Cos'ha questo posto?"],
      [1, 'La pioggia. E il barista.']
    ]
  },
  {
    id: 'x_aldo_rosa',
    w: ['aldo', 'rosa'],
    req: () => arcDone('tazze') && arcDone('consegne'),
    l: [
      [1, 'Aldo! Sei Aldo, il marito di Lidia?'],
      [0, 'Rosa... Rosa del forno?'],
      [1, 'Lidia veniva a prendere il pane da me. Ogni mattina. Mi raccontava di te.'],
      [0, 'Cosa ti raccontava?'],
      [1, 'Che eri timido, e lento, e che le avevi rovinato i pantaloni nuovi.'],
      [0, 'Era lei! Era lei che mi aveva rovesciato il latte!'],
      [1, "Lo so. Me l'ha detto ridendo. Diceva che era la bugia più bella della sua vita."],
      [0, '*ride e piange insieme*']
    ]
  },
  {
    id: 'x_pietro_tommy',
    w: ['pietro', 'tommy'],
    req: () => arcDone('notturno') && arcDone('comico'),
    l: [
      [0, 'Tommy? Ti serve un pubblico difficile?'],
      [1, 'Il più difficile del mondo è seduto di fronte a me tutte le sere. Si chiama Irene.'],
      [0, 'Pediatria. Venti bambini con la febbre, sabato pomeriggio.'],
      [1, '...Venti bambini?'],
      [0, 'Ridono di tutto. Anche delle tue battute.'],
      [1, 'Ci sto. Porto i cucchiaini per fare la batteria.'],
      [0, 'Niente cucchiaini, sono contagiosi. Porta solo te stesso.']
    ]
  },
  {
    id: 'x_sara_aldo',
    w: ['sara', 'aldo'],
    req: () => arcDone('romanzo') && arcDone('tazze'),
    l: [
      [0, 'Lei è... il signor Aldo? Il marito della signora Lidia?'],
      [1, 'Ci conosciamo?'],
      [0, "Ero di turno, quell'inverno. Lei parlava sempre di un caffè del giovedì."],
      [1, "...Lei c'era."],
      [0, 'Mi disse: «Quando non ci sarò, qualcuno gli porti un biscotto».'],
      [1, '*resta in silenzio a lungo*'],
      [1, "Qualcuno l'ha fatto. Proprio qui."],
      [0, 'Lo sapevo che glielo avrebbero portato.']
    ]
  },
  {
    id: 'x_luca_bruni',
    w: ['luca', 'bruni'],
    req: () => arcDone('pioggia') && arcDone('romanzo'),
    l: [
      [1, 'Giovanotto. Ho sentito la sua canzone. «Tavolo vicino alla finestra».'],
      [0, 'Professore! Ho letto il suo libro in una notte.'],
      [1, 'Allora siamo pari. Lei mi ha tenuto sveglio con la musica.'],
      [0, 'Ho scritto una canzone sul suo libro. Si chiama «Chi resta sveglio».'],
      [1, 'Questo è il titolo del mio seguito!'],
      [0, '...Davvero? Allora dobbiamo uscire lo stesso giorno.']
    ]
  },
  {
    id: 'x_ugo_dario',
    w: ['ugo', 'dario'],
    req: () => (arcDone('lettere') || arcDone('tokyo')) && arcDone('scacchi'),
    l: [
      [0, 'Dario! Ti ricordi le partite per posta? Una mossa a settimana.'],
      [1, 'Con quel tizio di Genova. Durò quattro anni.'],
      [0, 'Le portavo io. Leggevo le mosse sulla busta e facevo il tifo per te.'],
      [1, 'Ho perso.'],
      [0, 'Lo so. Ho pianto in bicicletta.'],
      [1, 'Questa non la sapevo. Siediti, ti offro un caffè per il disturbo.']
    ]
  },
  {
    id: 'x_elio_nora',
    w: ['elio', 'nora'],
    req: () => arcDone('scacchi') && arcDone('randagio'),
    l: [
      [1, 'Lei è la veterinaria nuova? Avevo un gatto. Si chiamava Alfiere.'],
      [0, 'Bel nome. Che fine ha fatto?'],
      [1, 'Diciotto anni felici. Dormiva sulla scacchiera e io perdevo le partite.'],
      [0, "Al canile c'è un vecchio gatto grigio. Nessuno lo vuole perché ha dodici anni."],
      [1, 'Dodici anni? Siamo coetanei, in gatti.'],
      [0, 'Venga domani. Si chiama Torre.'],
      [1, "*ride* Il destino ha senso dell'umorismo."]
    ]
  },
  {
    id: 'x_irene_nora',
    w: ['irene', 'nora'],
    req: () => arcDone('comico') && arcDone('randagio'),
    l: [
      [1, 'Leggi sempre gli stessi tre libri?'],
      [0, 'Sono tre libri molto buoni.'],
      [1, 'Io guardo sempre lo stesso gatto. Al canile. Da un mese.'],
      [0, 'Perché non lo adotti?'],
      [1, 'E tu perché non dici a Tommy che ti fa ridere?'],
      [0, '...Touché.'],
      [1, 'Facciamo un patto: tu glielo dici, io adotto il gatto.'],
      [0, 'Affare fatto. Ma lo dico la settimana prossima.']
    ]
  }
];
const XEPI = [
  {
    id: 'e_davide',
    w: ['davide'],
    req: () => arcDone('davide'),
    l: [
      [0, 'Volevo dirle una cosa, adesso che riesco a dirla.', 'davide=salvo'],
      [0, 'Quella sera, se lei non me lo avesse chiesto, non so dove sarei.', 'davide=salvo'],
      [0, 'Ci sono ancora giorni pesanti. Ma ho imparato a dirlo, quando arrivano.', 'davide=fragile'],
      [0, 'E lei mi ha tenuto il tavolo. Sembra niente. Non è niente.', 'davide=fragile'],
      [0, 'Sono tornato. Mia figlia mi ha detto che mi avete tenuto il tavolo.', 'davide=crisi'],
      [
        0,
        "In reparto c'era un ragazzo di vent'anni. Gli ho detto: c'è un bar dove non devi fingere. Gli ho dato l'indirizzo.",
        'davide=crisi'
      ],
      [0, 'Un caffè semplice, per favore. Ma oggi lo bevo caldo.']
    ]
  },
  {
    id: 'e_yusuf',
    w: ['yusuf'],
    req: () => arcDone('yusuf'),
    l: [
      [0, "Ho una notizia: mia sorella si sposa a dicembre. E io ci vado. Col passaporto, sull'aereo."],
      [0, 'Ho portato i miei dolci per la vetrina. Quelli col cocco sono per Nonna Rosa: li conta.'],
      [0, 'Quel giorno al bancone mi hai fatto sentire a casa. Non lo dimentico.', 'yusuf=difendi'],
      [0, "Ho smesso di lasciar perdere. Me l'ha insegnato quel giorno, e Nonna Rosa.", 'yusuf=lascia'],
      [0, "Tre anni fa non sapevo cos'era un cornetto. Adesso li faccio per mezza città."]
    ]
  },
  // epiloghi da soli: dipendono dal finale scelto
  {
    id: 'e_bruni',
    w: ['bruni'],
    req: () => arcDone('romanzo'),
    l: [
      [0, 'Sa, ricevo lettere da lettori. Chiedono tutti del barista.', 'romanzo=eroe'],
      [0, 'Rispondo sempre: «È più simpatico dal vero».', 'romanzo=eroe'],
      [0, 'Sa, i lettori chiedono chi sia il personaggio che non compare mai.', 'romanzo=quinte'],
      [0, 'Rispondo sempre: «Qualcuno che fa un ottimo caffè».', 'romanzo=quinte'],
      [0, "*le fa l'occhiolino da sopra gli occhiali*"]
    ]
  },
  {
    id: 'e_kenji',
    w: ['kenji'],
    req: () => arcDone('consegne'),
    l: [
      [0, 'Strano, sedermi qui dopo il turno. Di solito sono di là, ai fornelli.', 'consegne=qui'],
      [0, 'Grazie per avermi dato quella cucina. E il grembiule.', 'consegne=qui'],
      [0, "Il mio locale è pieno ogni sera. Ho dovuto mettere una lista d'attesa!", 'consegne=suo'],
      [0, "E ad ogni cliente dico: per il caffè, c'è un posto solo. Questo.", 'consegne=suo'],
      [0, 'Nonna Rosa ha pianto il primo giorno. Ha detto che era il fumo.']
    ]
  },
  {
    id: 'e_vittoria',
    w: ['vittoria'],
    req: () => arcDone('rivale'),
    l: [
      [0, 'Volevo dirtelo: ho messo tavoli lunghi, dove la gente si siede vicina.', 'rivale=gente'],
      [0, 'Due sconosciuti si sono messi insieme al mio tavolo grande. Mi hanno invitata alle nozze.', 'rivale=gente'],
      [0, "L'altra sera un temporale ha riempito il mio locale. Sessanta ombrelli all'ingresso.", 'rivale=pioggia'],
      [0, "Ho messo un portaombrelli enorme. È il pezzo d'arredo più fotografato.", 'rivale=pioggia'],
      [0, 'Non dirlo in giro, ma sei il mio concorrente preferito.']
    ]
  },
  {
    id: 'e_aldo',
    w: ['aldo'],
    req: () => arcDone('tazze'),
    l: [
      [0, 'Ogni tanto mi siedo e guardo la sedia di fronte. Ma non ordino più due caffè.'],
      [0, "Quella sera ti sei seduto lì. Proprio lì. Non l'ho mai dimenticato.", 'tazze=siedi'],
      [0, 'Quel biscotto, quella sera. Era proprio il suo preferito. Come facevi a saperlo?', 'tazze=biscotto'],
      [0, 'Lidia diceva che i baristi sanno sempre tutto. Aveva ragione.']
    ]
  },
  {
    id: 'e_irene',
    w: ['irene'],
    req: () => arcDone('comico'),
    l: [
      [0, 'Siamo andati a cena, io e Tommy.', 'comico=irene'],
      [0, 'Ha fatto una battuta sul menù. Non me ne sono andata.', 'comico=irene'],
      [0, 'Da quella sera Tommy racconta a tutti che ho riso. In pubblico.', 'comico=bar'],
      [0, 'Non è vero. Ho tossito con molta allegria.', 'comico=bar'],
      [0, '*nasconde un sorriso dietro il libro*']
    ]
  },
  {
    id: 'e_pietro',
    w: ['pietro'],
    req: () => arcDone('notturno'),
    l: [
      [0, "Quella notte mi hai lasciato dormire qui. Non te l'ho mai detto, ma mi ha salvato.", 'notturno=resta'],
      [0, "Quella notte mi hai detto che ce l'avrei fatta. Ci ripenso ogni volta che entro in reparto.", 'notturno=coraggio'],
      [0, 'Adesso sono io a dirlo ai nuovi. Con un caffè, come Sara.']
    ]
  },
  {
    id: 'e_dario',
    w: ['dario'],
    req: () => arcDone('scacchi'),
    l: [
      [0, 'Il torneo è diventato famoso. Vengono da fuori città per perdere contro Elio.', 'scacchi=torneo'],
      [0, 'La bambina di nove anni adesso ne ha dieci. Ci batte tutti e due.', 'scacchi=torneo'],
      [0, 'Hanno provato a sedersi al nostro tavolo. Ho indicato la targhetta. Con orgoglio.', 'scacchi=tavolo'],
      [0, 'Riservato. Il martedì, e quando vogliamo. È la frase più bella che abbia mai letto.', 'scacchi=tavolo'],
      [0, 'Non dite a Elio che sono felice. Ha già troppa autostima.']
    ]
  },
  {
    id: 'e_luca',
    w: ['luca'],
    req: () => arcDone('band'),
    l: [
      [0, 'I Doppio Ristretto hanno un concerto in un vero teatro!', 'band=doppio'],
      [0, 'I Macinati suonano al festival del quartiere. Tommy ha fatto stampare le magliette.', 'band=macinati'],
      [0, 'Tutto è cominciato a questo bancone. Con due cucchiaini e un batterista improvvisato.']
    ]
  },
  {
    id: 'e_nora',
    w: ['nora'],
    req: () => arcDone('randagio'),
    l: [
      [0, "Espresso ha fatto un anno. Gli abbiamo fatto la torta. L'ha distrutta.", 'randagio=espresso'],
      [0, 'Pioggia ha fatto un anno. Ha festeggiato rovesciando un vaso.', 'randagio=pioggia'],
      [0, "Tutto per una scatola che miagolava, sotto la pioggia. Pensa un po'."]
    ]
  },
  {
    id: 'e_marta',
    w: ['marta'],
    req: () => keyReg('marta') && arcDone('valigie'),
    l: [
      [0, 'Siamo qui per una settimana. Gio voleva solo questo: un cappuccino al vostro bancone.', 'valigie=vai'],
      [0, "A Tokyo raccontiamo di voi. C'è un giapponese che vuole venire a vedervi.", 'valigie=vai'],
      [0, 'Un anno intero lontana. Ogni lettera di Gio parlava di questo posto.', 'valigie=resta'],
      [0, 'Ora sono tornata. E il calendario lo teniamo appeso, finito, per ricordo.', 'valigie=resta']
    ]
  },
  {
    id: 'e_rosa',
    w: ['rosa'],
    req: () => arcDone('postino'),
    l: [
      [0, 'Ugo mi porta a passeggio tutte le sere. Fa il suo vecchio giro.'],
      [0, 'Ci fermiamo davanti a ogni cassetta. Lui mi racconta chi ci abita.', 'postino=subito'],
      [0, 'La sua lettera la rileggo prima di dormire. Ormai la so a memoria.', 'postino=casa'],
      [0, "Alla mia età. Chi l'avrebbe detto."]
    ]
  }
];
