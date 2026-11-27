// Altre vite degli habitué (si aggiungono a FILI e FILI2 di vite.js).
// Stesse regole: tre visite, nella seconda una scelta (@a / @b), la terza cambia di conseguenza.
// solo: 1 → questa vita capita solo a chi passa il controllo «ok», mai a caso a un altro habitué
// (serve per i temi delicati o molto legati a un tipo di persona).
// {o} nelle battute diventa «o» o «a» secondo il nome dell'habitué (sono andat{o} → andato / andata).
// I temi forti seguono lo stesso approccio della storia di Davide: delicatezza, nessun dettaglio crudo,
// una via d'uscita possibile, e l'idea che chiedere aiuto sia una cosa normale.

// nomi femminili tra quelli dei clienti (per accordare le parole e per le vite di mamme e papà)
const NOMI_F = [
  'Giulia',
  'Aiko',
  'Chiara',
  'Léa',
  'Yuki',
  'Nadia',
  'Irene',
  'Bea',
  'Elena',
  'Zoe',
  'Nina',
  'Lin',
  'Greta',
  'Alma',
  'Sofia',
  'Mei',
  'Lucia',
  'Vera',
  'Noemi',
  'Sara',
  'Emma',
  'Marisa',
  'Ada',
  'Selin',
  'Livia',
  'Frida',
  'Ines',
  'Dalia',
  'Wen',
  'Clara',
  'Rin',
  'Gaia',
  'Mia',
  'Marta',
  'Lina',
  'Rosa',
  'Vittoria',
  'Giada',
  'Bianca'
];
const donna = r => !!r && NOMI_F.includes(String(r.n || r.name || '').split(' ')[0]);

FILI.push(
  {
    id: 'k_leo',
    p: 1,
    t: 'Il primo torneo',
    ok: r => r.key === 'leo',
    b: [
      [
        [0, 'Nonno Aldo mi ha iscritto a un torneo. Un torneo vero, con l’orologio e tutto.'],
        [0, 'Io non volevo. Poi ho pensato a nonno Nino: lui ci teneva tantissimo, che un giorno giocassi un torneo.'],
        [0, 'Sabato. Ho paura di bloccarmi.']
      ],
      [
        [0, 'Domani è il giorno. Ho portato la scacchiera del nonno per allenarmi un’ultima volta.'],
        [0, 'Posso portare un suo pezzo in tasca? È stupido?'],
        {
          c: {
            q: 'Leo stringe la regina col naso storto. «La porto con me?»',
            o: [
              { t: '«Portala. Così gioca un po’ anche lui.»', f: '@a', r: [[0, 'Così gioca anche lui. Sì. In tasca, vicino al cuore.']] },
              {
                t: '«Lasciala qui. La troverai ad aspettarti, comunque vada.»',
                f: '@b',
                r: [[0, 'Ad aspettarmi... Va bene. Così ho un motivo per tornare a raccontare.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Terzo! Su ventiquattro! Ho stretto la regina in tasca a ogni partita.', '@a'],
        [0, 'Nonno Aldo ha urlato così forte che l’arbitro l’ha ammonito. Io ridevo e piangevo insieme.', '@a'],
        [0, 'Ho perso la finale. Ma ci sono arrivato. In finale!', '@b'],
        [0, 'Sono venuto subito qui a riprendere la regina. Le ho raccontato tutto, sottovoce. Stupido, lo so.', '@b'],
        [0, 'Nonno Nino sarebbe stato contento. Lo so perché lo sono anch’io. Un po’ è la stessa cosa.']
      ]
    ],
    e: { a: 'è arrivato terzo al suo primo torneo, con la regina di nonno Nino in tasca', b: 'è arrivato in finale al suo primo torneo' }
  },
  {
    id: 'k_alice',
    p: 1,
    t: 'La recita',
    ok: r => r.key === 'alice',
    b: [
      [
        [0, 'A fine anno i bambini fanno la recita. E indovina chi la deve organizzare? Io.'],
        [0, 'Ventidue bambini, una storia, un palco che è la palestra con le tende.'],
        [0, 'Un anno fa non riuscivo a salire le scale. Adesso devo dirigere uno spettacolo.']
      ],
      [
        [0, 'C’è un problema. Tommaso, il più timido, vuole fare l’albero. Solo l’albero. Senza battute.'],
        [0, 'Gli altri ridono di lui. E io so cosa vuol dire, voler sparire.'],
        {
          c: {
            q: '«Lo lascio fare l’albero o lo incoraggio a dire qualcosa?»',
            o: [
              {
                t: '«Lascialo fare l’albero. Il più bello che si sia mai visto.»',
                f: '@a',
                r: [[0, 'L’albero più bello del mondo. Gli faccio le foglie una per una.']]
              },
              {
                t: '«Dagli una battuta sola. Piccola. Sua.»',
                f: '@b',
                r: [[0, 'Una battuta sola... «Anche gli alberi ascoltano». La scrivo stasera.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Tommaso era un albero meraviglioso. Fermo, fierissimo. Alla fine tutti hanno applaudito l’albero.', '@a'],
        [0, 'Sua madre mi ha abbracciata e piangeva. Ha detto che non l’aveva mai visto così contento.', '@a'],
        [0, 'Tommaso ha detto la sua battuta. Piano, ma l’hanno sentita tutti: «Anche gli alberi ascoltano».', '@b'],
        [0, 'Poi ha fatto un inchino che non era previsto. Il pubblico è impazzito.', '@b'],
        [0, 'Sai cosa ho pensato, dietro le tende? Che sono contenta di essere qui. Proprio qui, adesso.']
      ]
    ],
    e: {
      a: 'ha diretto la recita, con l’albero più bello del mondo',
      b: 'ha diretto la recita, e il bambino più timido ha detto la sua battuta'
    }
  },
  {
    id: 'dimentica',
    t: 'La mamma che dimentica',
    solo: 1,
    ok: r => ['normale', 'lettore', 'nottambulo'].includes(r.type),
    b: [
      [
        [0, 'Mia madre stamattina mi ha chiesto chi fossi. Poi si è ricordata. Poi no.'],
        [0, '*stringe la tazza con tutte e due le mani*'],
        [0, 'Il medico dice che andrà così. A giorni sì, a giorni no.']
      ],
      [
        [0, 'Oggi era un giorno sì. Abbiamo riso tanto. Poi mi ha chiamato col nome di suo fratello.'],
        [0, 'Non so più come starle vicino senza piangere davanti a lei.'],
        {
          c: {
            q: '{A} ti guarda come se tu potessi avere la risposta.',
            o: [
              {
                t: '«Portale le sue canzoni. La musica resta, quando il resto va.»',
                f: '@a',
                r: [[0, 'Le canzoni... Cantava sempre mentre cucinava. Ci provo.']]
              },
              {
                t: '«Non devi farcela da sol{o}. Ci sono gruppi per chi assiste un genitore.»',
                f: '@b',
                r: [[0, 'Pensavo che chiedere aiuto volesse dire arrendersi. Forse è il contrario.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Le ho messo un disco vecchio. Ha cantato tutta la canzone, parola per parola.', '@a'],
        [0, 'Alla fine mi ha preso la mano e ha detto: «Eccoti, tesoro mio». Era lei. Era proprio lei.', '@a'],
        [0, 'Sono andat{o} al gruppo. Eravamo dodici, tutti con la stessa stanchezza negli occhi.', '@b'],
        [0, 'Una signora mi ha detto: «Arrabbiarsi è normale. Ridere anche». Mi sono sentit{o} meno sol{o}.', '@b'],
        [0, 'Non so quanti giorni sì ci restano. Ma adesso li riconosco, e me li tengo stretti.']
      ]
    ],
    e: { a: 'ha ritrovato sua madre in una vecchia canzone', b: 'ha trovato chi lo aiuta a stare vicino a sua madre' }
  },
  {
    id: 'telefono',
    t: 'Il telefono che non squilla',
    solo: 1,
    ok: r => r.type === 'nonno',
    b: [
      [
        [0, 'I miei figli abitano lontano. Uno a Milano, una in Germania.'],
        [0, 'Chiamano la domenica. Quando si ricordano.'],
        [0, '*guarda il telefono appoggiato sul tavolo, a faccia in su*']
      ],
      [
        [0, 'Questa domenica non ha chiamato nessuno. Ho apparecchiato per uno, come sempre.'],
        [0, 'Vengo qui perché almeno sento delle voci. Scusi se lo dico.'],
        {
          c: {
            q: '{A} abbassa gli occhi, quasi vergognandosi di averlo detto.',
            o: [
              {
                t: '«Le insegno a fare le videochiamate. Così li vede, e li chiama lei.»',
                f: '@a',
                r: [[0, 'Io con quegli aggeggi? ...Va bene. Ma lei ha pazienza, eh.']]
              },
              {
                t: '«Il giovedì qui si gioca a carte. Manca sempre il quarto.»',
                f: '@b',
                r: [[0, 'A carte? Ero il terrore del circolo, una volta. Giovedì vengo.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Ho chiamato mia figlia. In video! Ha pianto. Ho pianto anch’io. Poi ha pianto il nipotino perché piangevamo.', '@a'],
        [0, 'Adesso li chiamo io, il mercoledì. Non aspetto più la domenica.', '@a'],
        [0, 'Abbiamo perso tre partite e vinto una. Ma che risate.', '@b'],
        [0, 'Il Bruno mi ha invitato a cena. Io non vado a cena da qualcuno da sei anni.', '@b'],
        [0, 'Il telefono adesso lo tengo in tasca. Non mi serve più guardarlo.']
      ]
    ],
    e: { a: 'ha imparato a videochiamare i figli lontani', b: 'ha trovato una tavolata di amici per le carte del giovedì' }
  },
  {
    id: 'fratellino',
    t: 'Il fratellino',
    solo: 1,
    ok: r => r.type === 'studente' || r.tr.includes('timido') || r.tr.includes('nerd'),
    b: [
      [
        [0, 'Mio fratello piccolo non vuole più andare a scuola. Dice che ha mal di pancia. Tutti i giorni.'],
        [0, 'Ieri ho visto i messaggi sul suo telefono. Lo prendono in giro. In tanti.'],
        [0, '*la voce si incrina*  Ha dodici anni.']
      ],
      [
        [0, 'Non l’ho detto ai miei. Lui mi ha pregato di non farlo. Si vergogna.'],
        [0, 'Ma io non so come aiutarlo da solo.'],
        {
          c: {
            q: '«Che faccio? Tradisco la sua fiducia o lo lascio solo?»',
            o: [
              {
                t: '«Dillo ai tuoi, insieme a lui. Non è tradirlo: è proteggerlo.»',
                f: '@a',
                r: [[0, 'Insieme a lui... Sì. Non da solo, non alle sue spalle. Insieme.']]
              },
              {
                t: '«Intanto stagli vicino. Digli che non è colpa sua. Poi chiedete aiuto a un insegnante.»',
                f: '@b',
                r: [[0, 'Non è colpa sua. Non gliel’ho mai detto chiaramente. Stasera glielo dico.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Gliel’abbiamo detto insieme. Mia madre l’ha abbracciato per dieci minuti senza dire niente.', '@a'],
        [0, 'La scuola è intervenuta. Non è tutto risolto, ma non è più solo. E lo sa.', '@a'],
        [0, 'Gli ho detto che non era colpa sua. Si è messo a piangere e poi mi ha raccontato tutto.', '@b'],
        [0, 'La sua professoressa ci ha ascoltati. Ha cambiato i banchi, ha parlato con la classe. Oggi è tornato sorridendo.', '@b'],
        [0, 'Sabato lo porto qui. Gli ho promesso la cioccolata più grande che avete.']
      ]
    ],
    e: { a: 'ha aiutato il fratellino a parlarne con la famiglia', b: 'è stato vicino al fratellino finché non è tornato a sorridere' }
  },
  {
    id: 'turni',
    t: 'Turni di notte',
    solo: 1,
    ok: r => donna(r) && !r.key && ['nottambulo', 'normale', 'fretta'].includes(r.type),
    b: [
      [
        [0, 'Esco dal turno all’ospedale e vengo qui. Venti minuti solo per me, poi corro a casa.'],
        [0, 'Mia figlia ha sei anni. Dorme dalla vicina quando lavoro di notte.'],
        [0, 'Siamo solo noi due. Da quando il padre se n’è andato.']
      ],
      [
        [0, 'Ieri ha disegnato la famiglia. C’ero io, lei e... la vicina. Col grembiule.'],
        [0, 'Mi sento in colpa in ogni momento. Al lavoro per lei, a casa per il lavoro.'],
        {
          c: {
            q: '{A} ride, ma ha gli occhi lucidi. «Sono una brava mamma, secondo te?»',
            o: [
              {
                t: '«Sei una mamma stanca. Che non è il contrario di brava.»',
                f: '@a',
                r: [[0, 'Stanca e brava. Me lo scrivo sul frigo.']]
              },
              {
                t: '«Chiedi i turni di giorno. Male che vada, ti dicono di no.»',
                f: '@b',
                r: [[0, 'Non l’ho mai chiesto. Avevo paura di sembrare debole. Domani chiedo.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Ho scritto «stanca e brava» sul frigo. Mia figlia ha aggiunto «e bella». Con tre errori.', '@a'],
        [0, 'La vicina ormai è famiglia. Domenica pranziamo tutte e tre insieme.', '@a'],
        [0, 'Mi hanno dato i turni di giorno. Tre giorni su cinque, ma è tantissimo.', '@b'],
        [0, 'Stasera la metto a letto io. Le leggo una storia. Una lunga.', '@b'],
        [0, 'Un giorno la porto qui. Le dirò: «Questo è il posto dove la mamma si riposava».']
      ]
    ],
    e: { a: 'ha smesso di sentirsi in colpa per essere stanca', b: 'ha ottenuto i turni di giorno per stare con sua figlia' }
  },
  {
    id: 'secondo',
    t: 'Una tazza sola',
    solo: 1,
    ok: r => r.type !== 'studente',
    b: [
      [
        [0, 'Al mercato ho comprato una tazza. Una sola. Dopo vent’anni di servizi da sei.'],
        [0, 'Adesso a casa ci sono troppe sedie.'],
        [0, 'Ci siamo separati a marzo. In modo civile, dicono tutti. Civile.']
      ],
      [
        [0, 'Ho ancora il suo spazzolino in bagno. Non riesco a buttarlo.'],
        [0, 'Non siamo arrabbiati. Siamo solo... finiti. E non so chi sono, da sol{o}.'],
        {
          c: {
            q: '«Lei come farebbe, a ricominciare?»',
            o: [
              {
                t: '«Fai una cosa che rimandavi da vent’anni.»',
                f: '@a',
                r: [[0, 'Da vent’anni... Volevo imparare a ballare. In casa nessuno voleva.']]
              },
              {
                t: '«Dalle tempo, a questa tristezza. Non devi già stare bene.»',
                f: '@b',
                r: [[0, 'Non devo già stare bene. Nessuno me l’aveva detto. Che sollievo.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Faccio un corso di tango. Sono la persona peggiore della classe. Mi diverto come a quindici anni.', '@a'],
        [0, 'Gliel’ho scritto. Mi ha risposto: «Finalmente». Ci siamo fatti una risata.', '@a'],
        [0, 'Ho buttato lo spazzolino. Ci ho messo un mese. Ma l’ho fatto io, quando ero pront{o}.', '@b'],
        [0, 'Certi giorni sono ancora grigi. Ma sono miei, i giorni. Me li riprendo.', '@b'],
        [0, 'Un caffè, per favore. Nella tazza più bella che avete.']
      ]
    ],
    e: { a: 'ha ricominciato da un corso di tango', b: 'si è dato il tempo di essere triste, e poi di ripartire' }
  },
  {
    id: 'domenica',
    t: 'Domenica a pranzo',
    solo: 1,
    ok: r =>
      !donna(r) && !r.key && (r.tr.includes('romantico') || r.tr.includes('timido') || r.tr.includes('artista') || r.type === 'artista'),
    b: [
      [
        [0, 'Domenica porto Marco a pranzo dai miei. Il mio ragazzo.'],
        [0, 'Loro non sanno niente. Pensano che sia «un amico che vive con me».'],
        [0, '*ride nervoso*  Ho trentadue anni e tremo come a sedici.']
      ],
      [
        [0, 'Mio padre è all’antica. Mia madre ha capito tutto da anni, credo. Ma non l’ha mai detto.'],
        [0, 'E se va male? Se mio padre si alza e se ne va?'],
        {
          c: {
            q: '{A} gira e rigira il cucchiaino. «Lo dico a tavola o prima, solo a loro?»',
            o: [
              {
                t: '«Prima a tua madre. Una persona alla volta.»',
                f: '@a',
                r: [[0, 'Una alla volta. Comincio da chi mi conosce meglio. Ha senso.']]
              },
              {
                t: '«A tavola, con Marco accanto. È la tua famiglia anche lui.»',
                f: '@b',
                r: [[0, 'Con lui accanto... Sì. Non voglio più presentarlo come «un amico».']]
              }
            ]
          }
        }
      ],
      [
        [0, 'L’ho detto a mia madre. Ha detto: «Lo so, tesoro. Aspettavo che fossi pronto tu».', '@a'],
        [0, 'Poi l’ha detto lei a papà. Lui è stato zitto tre giorni. Il quarto ha chiamato Marco per sapere che vino porta.', '@a'],
        [0, 'L’ho detto tra il primo e il secondo. Silenzio. Poi mio padre ha passato le patate a Marco.', '@b'],
        [0, 'E gli ha detto: «Mangia, che sei magro». Da lui è una dichiarazione d’amore.', '@b'],
        [0, 'Domenica prossima pranziamo di nuovo da loro. Tutti e due. Come una famiglia.']
      ]
    ],
    e: {
      a: 'ha parlato del suo amore prima alla madre, poi a tutta la famiglia',
      b: 'ha presentato il suo ragazzo alla famiglia, a tavola'
    }
  },
  {
    id: 'casa_lontana',
    t: 'Il sapore di casa',
    ok: r => r.type === 'turista' || r.type === 'normale' || r.type === 'studente',
    b: [
      [
        [0, 'Sono qui da un anno, per lavoro. Il mio paese è a quattromila chilometri.'],
        [0, 'Tutto bene, davvero. Solo che qui niente sa di casa.'],
        [0, 'Mia madre faceva un pane dolce con il cardamomo. Ogni venerdì.']
      ],
      [
        [0, 'Ho provato a farlo. È venuto un mattone. Profumava giusto, però.'],
        [0, 'Mi manca più quel profumo che le persone, certi giorni. È strano?'],
        {
          c: {
            q: '«Che faccio con questa nostalgia?»',
            o: [
              {
                t: '«Chiama tua madre e fatti dettare la ricetta. Al telefono, passo passo.»',
                f: '@a',
                r: [[0, 'Passo passo, con lei che mi sgrida... Sì. Le farà piacere.']]
              },
              {
                t: '«Portalo qui, il tuo mattone. Lo assaggiamo insieme.»',
                f: '@b',
                r: [[0, 'Qui? Davanti a tutti? ...Va bene. Se ridete, ridete con me.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Due ore al telefono con mia madre. Mi ha corretto anche come impastavo, senza vedermi.', '@a'],
        [0, 'Il pane è venuto perfetto. Ho pianto un po’ sopra la prima fetta. Era buono lo stesso.', '@a'],
        [0, 'Il mio mattone l’hanno mangiato tutti. Una signora mi ha dato un consiglio sul lievito.', '@b'],
        [0, 'Venerdì ne porto un altro. Ormai qui c’è chi lo aspetta.', '@b'],
        [0, 'Non è casa. Ma adesso un pezzetto di casa ce l’ho anche qui.']
      ]
    ],
    e: { a: 'ha rifatto il pane di sua madre, al telefono con lei', b: 'ha portato il sapore di casa al locale, ogni venerdì' }
  },
  {
    id: 'treno',
    t: 'Il treno delle 7:12',
    ok: r => r.type === 'fretta' || r.tr.includes('sportivo'),
    b: [
      [
        [0, '*guarda l’orologio*  Ho quattro minuti. Il treno delle 7:12 non aspetta.'],
        [0, 'Lavoro dodici ore al giorno. Mangio in piedi. Dormo con il telefono sul cuscino.'],
        [0, 'Ieri sul treno non mi ricordavo che giorno era.']
      ],
      [
        [0, 'Oggi ho perso il treno. Apposta, credo. Sono rimast{o} ferm{o} sul binario a guardarlo partire.'],
        [0, 'E mi sono sentit{o}... sollevat{o}. Questo mi ha fatto paura.'],
        {
          c: {
            q: '{A} si siede, per la prima volta senza guardare l’orologio.',
            o: [
              {
                t: '«Prenditi una settimana. Il mondo non crolla.»',
                f: '@a',
                r: [[0, 'Una settimana. Non la prendo da tre anni. Chiamo il capo adesso, prima di cambiare idea.']]
              },
              {
                t: '«Parlane con un medico. La stanchezza così è una cosa seria.»',
                f: '@b',
                r: [[0, 'Pensavo fosse normale. Tutti sono stanchi. Ma forse non così. Prendo appuntamento.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Una settimana senza telefono. Il primo giorno ho tremato. Il quarto ho dormito dieci ore.', '@a'],
        [0, 'Sono tornat{o} al lavoro e ho detto: alle sei io stacco. Nessuno è morto.', '@a'],
        [0, 'Il medico mi ha detto che ero al limite. Mi sta aiutando a rallentare. Piano piano.', '@b'],
        [0, 'Ho anche cominciato a parlare con una psicologa. Avrei dovuto farlo prima.', '@b'],
        [0, 'Oggi prendo il treno delle 8:40. E il caffè lo bevo seduto.']
      ]
    ],
    e: { a: 'ha perso apposta il treno e si è ripreso il suo tempo', b: 'ha capito che era al limite e si è fatto aiutare' }
  },
  {
    id: 'cuccia',
    t: 'La cuccia vuota',
    solo: 1,
    ok: r => !r.pet,
    b: [
      [
        [0, 'Il mio cane, Biscotto, è morto la settimana scorsa. Aveva quindici anni.'],
        [0, 'La gente dice «era solo un cane». Non era solo niente.'],
        [0, 'La sera mi giro ancora per vedere se mi segue.']
      ],
      [
        [0, 'La sua cuccia è ancora in corridoio. E il guinzaglio sulla porta.'],
        [0, 'Non so cosa farne. Toglierli mi sembra di dimenticarlo.'],
        {
          c: {
            q: '{A} ti guarda. «Tu cosa faresti?»',
            o: [
              {
                t: '«Pianta un albero dove andavate a passeggiare.»',
                f: '@a',
                r: [[0, 'Un albero al parco, sotto la panchina dove si fermava sempre. Mi piace.']]
              },
              {
                t: '«Porta la cuccia al canile. Qualcun altro ne ha bisogno.»',
                f: '@b',
                r: [[0, 'Così servirebbe ancora a qualcosa. A Biscotto piacerebbe. Era generoso, col cibo degli altri.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Abbiamo piantato un piccolo tiglio. Io e i bambini del palazzo, che lo conoscevano tutti.', '@a'],
        [0, 'Ci ho legato il suo vecchio collare. Ogni mattina passo a salutarlo.', '@a'],
        [0, 'Al canile c’era un cagnolone nero, vecchio, che nessuno vuole. Si è sdraiato subito nella cuccia.', '@b'],
        [0, 'Vado a trovarlo tutti i sabati. Non sostituisce Biscotto. È un amico nuovo, e basta.', '@b'],
        [0, 'Il dolore è ancora qui. Ma adesso ha anche una cosa bella vicino.']
      ]
    ],
    e: { a: 'ha piantato un albero per il suo cane Biscotto', b: 'ha portato la cuccia del suo cane a un amico nuovo, al canile' }
  },
  {
    id: 'respiro',
    t: 'Il respiro',
    solo: 1,
    ok: r => r.type === 'studente' || r.tr.includes('timido'),
    b: [
      [
        [0, 'Giovedì devo parlare davanti a tutta la classe. Venti minuti.'],
        [0, 'L’ultima volta mi è mancata l’aria. Il cuore impazzito. Pensavo di svenire.'],
        [0, 'Mi hanno detto che era un attacco di panico. Che parola brutta.']
      ],
      [
        [0, 'Più si avvicina giovedì, più mi sento stringere qui.  *si tocca il petto*'],
        [0, 'Vorrei sparire. O rimandare. Ma l’ho già rimandato due volte.'],
        {
          c: {
            q: '{A} respira corto. «Come faccio?»',
            o: [
              {
                t: '«Respira con me: dentro in quattro, tieni quattro, fuori in sei.»',
                f: '@a',
                r: [[0, '...dentro... tieni... fuori... Oh. Va un po’ meglio. Davvero.']]
              },
              {
                t: '«Parlane con lo psicologo della scuola. Il panico si cura, sai.»',
                f: '@b',
                r: [[0, 'Si cura? Pensavo di essere fatt{o} male e basta. Vado a chiedere.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Prima di parlare ho fatto il respiro. Quattro, quattro, sei. Tre volte.', '@a'],
        [0, 'Ho tremato per i primi due minuti. Poi niente. Ho finito. Mi hanno applaudito!', '@a'],
        [0, 'Lo psicologo mi ha spiegato cosa succede nel corpo. Adesso, quando arriva, lo riconosco.', '@b'],
        [0, 'Ho parlato. Non è stato perfetto. Ma l’ho fatto io, e il panico è rimasto in fondo all’aula.', '@b'],
        [0, 'La prossima volta avrò paura lo stesso. Ma so che passa.']
      ]
    ],
    e: { a: 'ha imparato a respirare e ha parlato davanti a tutti', b: 'ha chiesto aiuto per il panico, e ce l’ha fatta' }
  },
  {
    id: 'papa',
    t: 'Tre chili e due',
    solo: 1,
    ok: r => !donna(r) && !r.key && (r.type === 'normale' || r.type === 'nottambulo' || r.tr.includes('romantico')),
    b: [
      [
        [0, 'È nato! Martedì alle quattro del mattino. Tre chili e due.'],
        [0, '*mostra una foto sfocata, con la mano che trema*'],
        [0, 'Non dormo da sei giorni. Sono felicissimo. E terrorizzato.']
      ],
      [
        [0, 'Piange tutta la notte. Mia moglie è distrutta, io pure. Ci guardiamo e non sappiamo cosa fare.'],
        [0, 'Tutti dicono «goditelo». Io ho paura di sbagliare tutto.'],
        {
          c: {
            q: '«Un consiglio. Uno solo, che ci tenga a galla.»',
            o: [
              {
                t: '«Fate i turni: uno dorme, l’altro veglia. E accettate ogni aiuto.»',
                f: '@a',
                r: [[0, 'I turni. Come in caserma. Mia suocera si offre da giorni... le dico di sì.']]
              },
              {
                t: '«Cantagli qualcosa. Anche stonato. Riconosce la tua voce.»',
                f: '@b',
                r: [[0, 'Stonato lo sono di sicuro. Ma ci provo. Stanotte.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Turni da quattro ore. Mia suocera fa il bagnetto meglio di tutti. Abbiamo dormito!', '@a'],
        [0, 'Ieri ha sorriso. Mia moglie dice che era aria nella pancia. Io dico che era per me.', '@a'],
        [0, 'Gli canto una canzone di Lucio Dalla, sempre la stessa. Si calma alla seconda strofa.', '@b'],
        [0, 'Stanotte si è addormentato sul mio petto. Non mi sono mosso per due ore.', '@b'],
        [0, 'Sabato lo porto qui. Il suo primo caffè... cioè, il mio. Lui guarda.']
      ]
    ],
    e: { a: 'è diventato papà e ha imparato a chiedere aiuto', b: 'è diventato papà e ha trovato la sua ninna nanna stonata' }
  },
  {
    id: 'pensione',
    t: 'L’ultimo giorno di lavoro',
    solo: 1,
    ok: r => r.type === 'nonno',
    b: [
      [
        [0, 'Venerdì vado in pensione. Quarantun anni in tipografia.'],
        [0, 'Tutti mi dicono «beato te». Io non so cosa farò lunedì mattina.'],
        [0, 'Mi sveglio alle cinque da quarant’anni. Il corpo non lo sa, che è finita.']
      ],
      [
        [0, 'Mi hanno fatto la festa. Una torta, un orologio. Un orologio! Proprio adesso che il tempo non mi serve.'],
        [0, 'Oggi è lunedì. Mi sono alzat{o} alle cinque e non sapevo dove andare. Sono venuto qui.'],
        {
          c: {
            q: '{A} ride, ma sembra perso. «E adesso?»',
            o: [
              {
                t: '«Insegni il mestiere. Ci sono ragazzi che vogliono imparare.»',
                f: '@a',
                r: [[0, 'Insegnare... Il mio maestro me lo diceva sempre: il mestiere va passato. Ci penso.']]
              },
              {
                t: '«Faccia una cosa inutile. Bella e inutile. Se l’è meritata.»',
                f: '@b',
                r: [[0, 'Inutile! Non ho mai fatto niente di inutile. Che bella idea pericolosa.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Due mattine a settimana insegno alla scuola di grafica. I ragazzi mi chiamano «maestro».', '@a'],
        [0, 'Uno di loro ha stampato un manifesto bellissimo. Ho fatto finta di avere un moscerino nell’occhio.', '@a'],
        [0, 'Ho comprato un aquilone. Un aquilone, alla mia età! Lo faccio volare la domenica.', '@b'],
        [0, 'In famiglia dicono che sono ringiovanit{o}. Io dico che ho finalmente tempo di essere giovane.', '@b'],
        [0, 'L’orologio della festa l’ho messo nel cassetto. Adesso guardo la luce, per sapere l’ora.']
      ]
    ],
    e: {
      a: 'è andato in pensione e ora insegna il mestiere ai ragazzi',
      b: 'è andato in pensione e ha imparato a fare cose belle e inutili'
    }
  },
  {
    id: 'alfabeto',
    t: 'Le lettere della nonna',
    solo: 1,
    ok: r => r.type === 'nonno' && donna(r),
    b: [
      [
        [0, '*tiene in mano un biglietto, lo gira e lo rigira*'],
        [0, 'Me l’ha scritto mia nipote. Me l’ha letto il portiere. Io non so leggere bene, sa.'],
        [0, 'Da bambina lavoravo nei campi. La scuola l’ho vista dalla finestra.']
      ],
      [
        [0, 'Vorrei risponderle. Con la mia mano. Ma ho ottant’anni, chi me lo insegna più.'],
        [0, 'E poi mi vergogno. Una vecchia che fa le aste come all’asilo.'],
        {
          c: {
            q: '{A} ti guarda con gli occhi di una bambina.',
            o: [
              {
                t: '«C’è una scuola serale per adulti, qui vicino. Non si è mai troppo grandi.»',
                f: '@a',
                r: [[0, 'Una scuola per vecchi come me? ...Andrò. Con il cappotto buono.']]
              },
              {
                t: '«Una lettera al giorno, qui al tavolo. Gliele scrivo io sul tovagliolo.»',
                f: '@b',
                r: [[0, 'Sul tovagliolo... Come una maestra paziente. Va bene. Cominciamo dalla A.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Siamo in nove, alla scuola serale. Il più giovane ha sessant’anni. Mi chiamano «la secchiona».', '@a'],
        [0, 'Ho scritto la mia prima lettera. Storta, ma mia. Mia nipote l’ha appesa in camera.', '@a'],
        [0, 'Ho una scatola piena di tovaglioli con le lettere. Ventuno. Ne mancano poche.', '@b'],
        [0, 'Ieri ho scritto «Cara Giulia, ti voglio bene». Ci ho messo mezz’ora. È la cosa più bella che ho fatto.', '@b'],
        [0, 'Adesso leggo anche il menù. Il {item} si scrive così? Che nome difficile.']
      ]
    ],
    e: {
      a: 'ha imparato a scrivere alla scuola serale, a ottant’anni',
      b: 'ha imparato a scrivere una lettera al giorno, sui tovaglioli del locale'
    }
  },
  {
    id: 'cruciverba',
    t: 'Il cruciverba',
    ok: r => r.type === 'lettore' || r.type === 'nonno' || r.tr.includes('nerd'),
    b: [
      [
        [0, 'Sette lettere: «La casa dell’espresso». Ci sono sopra da tre giorni.'],
        [0, 'Faccio il cruciverba del sabato da quarant’anni. Non ne ho mai lasciato uno a metà.'],
        [0, '*mordicchia la matita*']
      ],
      [
        [0, 'Ho provato «BANCONE». Sette lettere, ma l’incrocio non torna.'],
        {
          c: {
            q: '«Lei che ci lavora: sette lettere, la casa dell’espresso...»',
            o: [
              { t: '«Guarda cos’hai in mano.»', f: '@a', r: [[0, 'In mano? Ho la... TAZZINA! Sette lettere! Ma come ho fatto?!']] },
              { t: '«Non te lo dico. Te lo godi di più se lo trovi tu.»', f: '@b', r: [[0, 'Crudele! Ma ha ragione. Ancora un giorno.']] }
            ]
          }
        }
      ],
      [
        [0, 'TAZZINA. Ce l’avevo in mano da tre giorni. Ho riso fino alle lacrime.', '@a'],
        [0, 'Il signore del tavolo accanto mi ha chiesto aiuto per il suo. Adesso siamo una squadra.', '@a'],
        [0, 'L’ho trovato alle tre di notte. Mi sono svegliat{o} gridando «TAZZINA!». In casa non hanno gradito.', '@b'],
        [0, 'Ci ho messo quattro giorni. È stato il cruciverba più bello della mia vita.', '@b'],
        [0, 'Il prossimo lo facciamo insieme. Lei ha l’aria di chi sa le capitali.']
      ]
    ],
    e: {
      a: 'ha risolto il cruciverba guardando la tazzina che aveva in mano',
      b: 'ha risolto da solo il cruciverba più difficile del sabato'
    }
  },
  {
    id: 'appuntamento',
    t: 'Il primo appuntamento',
    ok: r => r.tr.includes('romantico') || r.tr.includes('timido') || r.tr.includes('chiacchierone'),
    b: [
      [
        [0, 'Sabato ho un appuntamento con Sam. Il primo da cinque anni.'],
        [0, 'Ci siamo conosciuti in biblioteca. Abbiamo allungato la mano sullo stesso libro.'],
        [0, 'Sembra un film. Io però non so recitare: io sudo.']
      ],
      [
        [0, 'Non so dove andare. Al cinema non si parla. Al ristorante si parla troppo.'],
        {
          c: {
            q: '«Dove la porto?»',
            o: [
              {
                t: '«Qui. Un caffè, un tavolo vicino alla finestra. Se piove, meglio.»',
                f: '@a',
                r: [[0, 'Qui? Così se va male ho almeno un amico al bancone.']]
              },
              {
                t: '«A camminare. Si parla meglio quando non ci si guarda negli occhi.»',
                f: '@b',
                r: [[0, 'Camminare... Sì. Così le mani sanno cosa fare.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Siamo venuti qui! Sam ha preso un {item} come me. Abbiamo parlato tre ore. Ha piovuto tutto il tempo.', '@a'],
        [0, 'Uscendo, Sam ha detto: «Allo stesso tavolo, sabato prossimo?» Allo stesso tavolo!', '@a'],
        [0, 'Abbiamo camminato fino al fiume. Due ore. Sam mi ha preso sottobraccio al ponte.', '@b'],
        [0, 'Al ritorno ci siamo fermati qui sotto la tettoia. Pioveva. Non avevamo fretta.', '@b'],
        [0, 'Cinque anni ad aspettare. Ne è valsa la pena.']
      ]
    ],
    e: {
      a: 'ha avuto il suo primo appuntamento al tavolo vicino alla finestra',
      b: 'ha avuto il suo primo appuntamento camminando fino al fiume'
    }
  },
  {
    id: 'liceo',
    t: 'La band del liceo',
    ok: r => r.type === 'musicista' || r.tr.includes('sognatore'),
    b: [
      [
        [0, 'Vent’anni fa avevo una band. «I Tostapane». Non ridere.'],
        [0, 'Il batterista mi ha scritto. Vuole rimetterci insieme. Una sera sola.'],
        [0, 'Io non tocco la chitarra da quindici anni. Ho i calli di chi fa i conti tutto il giorno.']
      ],
      [
        [0, 'Abbiamo provato in cantina. Il bassista ha mal di schiena, il cantante ha perso la voce. È stato bellissimo.'],
        [0, 'Ora ci serve un posto per suonare. Una sera. Davanti a qualcuno.'],
        {
          c: {
            q: '«Ci fai suonare qui? Promettiamo di non essere troppo forti.»',
            o: [
              {
                t: '«Qui, sabato. Metto io le sedie.»',
                f: '@a',
                r: [[0, 'Davvero?! Devo chiamare tutti. Devo comprare le corde. Devo respirare.']]
              },
              {
                t: '«Suonate per strada, sotto la pioggia. Vi sentirà tutto il quartiere.»',
                f: '@b',
                r: [[0, 'Sotto la pioggia, come i matti. I Tostapane bagnati. Mi piace.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Il locale era pieno! C’erano le nostre famiglie, i figli, perfino la professoressa di musica.', '@a'],
        [0, 'Abbiamo sbagliato tutti gli attacchi. Ci hanno chiesto il bis lo stesso.', '@a'],
        [0, 'Abbiamo suonato sotto la tettoia. La gente si fermava con gli ombrelli. Una signora ballava.', '@b'],
        [0, 'Un bambino ci ha dato una moneta e ha detto «bravi, vecchi». Il complimento più bello della carriera.', '@b'],
        [0, 'I Tostapane sono tornati. Una volta al mese. Fino a quando ci reggono le dita.']
      ]
    ],
    e: {
      a: 'ha riunito la sua band del liceo per una serata al locale',
      b: 'ha riunito la sua band del liceo per un concerto sotto la pioggia'
    }
  },
  {
    id: 'senzafiltri',
    t: 'Senza filtri',
    ok: r => r.type === 'influencer' || r.type === 'turista' || r.tr.includes('chiacchierone'),
    b: [
      [
        [0, '*scatta la foto alla tazza per la dodicesima volta*'],
        [0, 'Scusa, la luce non è giusta. Ho centomila persone che mi guardano. Devo essere perfett{o}.'],
        [0, 'Oggi ho mangiato solo questo caffè. Ma nella foto sembra una colazione.']
      ],
      [
        [0, 'Sono stanc{o} di essere perfett{o}. Ieri ho pianto e poi ho postato una foto sorridente.'],
        [0, 'Se smetto, chi sono? Una persona normale con le occhiaie.'],
        {
          c: {
            q: '{A} guarda il telefono, poi te. «Che faccio?»',
            o: [
              {
                t: '«Posta una foto vera. Occhiaie comprese. Vedi cosa succede.»',
                f: '@a',
                r: [[0, 'Una foto vera... Mi tremano le dita. Ok. La faccio qui, adesso.']]
              },
              {
                t: '«Spegni il telefono per una settimana. Il mondo esiste anche senza foto.»',
                f: '@b',
                r: [[0, 'Una settimana?! ...Va bene. Ma il caffè me lo ricordo, anche senza foto.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Ho postato la foto con le occhiaie. Scritto: «Oggi sono stanc{o}». Migliaia di messaggi.', '@a'],
        [0, 'Tutti dicevano «anche io». Mi sono sentit{o} meno sol{o} che con le foto perfette.', '@a'],
        [0, 'Una settimana senza telefono. Ho letto due libri. Ho chiamato mia nonna. Ho dormito.', '@b'],
        [0, 'Ho perso un po’ di persone che mi seguivano. Ho ritrovato me.', '@b'],
        [0, 'Oggi ho mangiato una brioche. Vera. E nessuno lo saprà.']
      ]
    ],
    e: { a: 'ha postato una foto senza filtri e si è sentita meno sola', b: 'ha spento il telefono per una settimana e si è ritrovata' }
  },
  {
    id: 'videogioco',
    t: 'Il videogioco',
    ok: r => r.tr.includes('nerd') || r.type === 'studente',
    b: [
      [
        [0, 'Sto facendo un videogioco. Da solo, di notte. È ambientato... in un caffè.'],
        [0, 'Un caffè sotto la pioggia, con i clienti che raccontano le loro storie.'],
        [0, 'Non guardarmi così. Mi sono ispirato. Un pochino.']
      ],
      [
        [0, 'È quasi finito. Ma non so come chiamarlo, e non so se pubblicarlo.'],
        [0, 'E se nessuno ci gioca? O peggio: se ci giocano e non piace?'],
        {
          c: {
            q: '«Lo faccio provare a qualcuno, o lo tengo per me?»',
            o: [
              {
                t: '«Fallo provare a persone vere. Guarda dove si bloccano.»',
                f: '@a',
                r: [[0, 'Persone vere... Che paura. Che bella paura. Porto il portatile qui.']]
              },
              {
                t: '«Pubblicalo. Una cosa finita vale più di cento perfette.»',
                f: '@b',
                r: [[0, 'Finita meglio che perfetta. Me lo tatuo. Stanotte lo pubblico.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'L’hanno provato in sei, qui al tavolo. Una signora si è commossa alla storia del nonno.', '@a'],
        [0, 'Ho cambiato tutto il primo livello per colpa loro. Adesso è molto meglio.', '@a'],
        [0, 'L’ho pubblicato. Duecento persone l’hanno scaricato. Una mi ha scritto «mi ha fatto bene».', '@b'],
        [0, 'Duecento persone. Più di quante ne conosco in tutta la vita.', '@b'],
        [0, 'Nel gioco c’è un barista che ascolta tutti. Indovina a chi assomiglia.']
      ]
    ],
    e: { a: 'ha fatto provare il suo videogioco a persone vere', b: 'ha pubblicato il suo videogioco ambientato in un caffè' }
  },
  {
    id: 'ginocchio',
    t: 'Il ginocchio',
    ok: r => r.tr.includes('sportivo'),
    b: [
      [
        [0, '*arriva con le stampelle*'],
        [0, 'Legamento rotto. Sei mesi ferm{o}. Proprio prima della gara della mia vita.'],
        [0, 'Correre era l’unica cosa che mi teneva la testa a posto.']
      ],
      [
        [0, 'Sono due settimane che sto sul divano. Divento cattiv{o}. Ho litigato col gatto.'],
        {
          c: {
            q: '«Cosa faccio per sei mesi, se non posso correre?»',
            o: [
              {
                t: '«Allena chi corre. Dalla panchina si vede tutto.»',
                f: '@a',
                r: [[0, 'L’allenatore dei ragazzini del quartiere cerca aiuto... Ci provo.']]
              },
              {
                t: '«Nuota. In acqua il ginocchio non pesa.»',
                f: '@b',
                r: [[0, 'Io nuoto come un sasso. Ma un sasso felice è meglio di un sasso sul divano.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Alleno dodici ragazzini. Uno corre come un fulmine e non lo sa. Gliel’ho detto io.', '@a'],
        [0, 'Ho imparato più dalla panchina in tre mesi che in dieci anni di corsa.', '@a'],
        [0, 'Nuoto tre volte a settimana. Il ginocchio ringrazia. E la testa pure.', '@b'],
        [0, 'Il fisioterapista dice che sono tornat{o} più forte di prima. Mi sa che ha ragione.', '@b'],
        [0, 'Ho buttato le stampelle. Cioè, le ho riportate. Ma idealmente le ho buttate.']
      ]
    ],
    e: {
      a: 'si è rotto un ginocchio e ha scoperto di essere un ottimo allenatore',
      b: 'si è rotto un ginocchio e si è rimesso in piedi nuotando'
    }
  },
  {
    id: 'vicino',
    t: 'Il vicino rumoroso',
    ok: r => r.tr.includes('brontolone') || r.type === 'nonno',
    b: [
      [
        [0, 'Il vicino nuovo suona la batteria. Alle dieci di sera. Ogni sera.'],
        [0, 'Ho battuto col manico della scopa sul soffitto. Ha suonato più forte.'],
        [0, 'Domani vado su e gliene dico quattro.']
      ],
      [
        [0, 'Sono salito. Ha aperto un ragazzino di diciassette anni con la faccia triste.'],
        [0, 'Mi ha detto che suona perché i genitori litigano. La batteria copre le voci.'],
        {
          c: {
            q: '{A} non sembra più così arrabbiat{o}. «E adesso?»',
            o: [
              {
                t: '«Invitalo a suonare qui, il pomeriggio. Fuori di casa.»',
                f: '@a',
                r: [[0, 'Qui? Che ci suoni pure in faccia a me? ...Ci penso. Forse sì.']]
              },
              {
                t: '«Tu suonavi qualcosa, da giovane? Fate un patto.»',
                f: '@b',
                r: [[0, 'La fisarmonica. Non la tocco da trent’anni. Un patto, eh...']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Il ragazzo viene qui il giovedì pomeriggio. Ha una band, adesso. Io vado a sentirlo.', '@a'],
        [0, 'Non dirlo a nessuno, ma è bravo. Ha un tempo perfetto. Come un orologio arrabbiato.', '@a'],
        [0, 'Il patto: lui suona fino alle nove, poi viene giù da me e suoniamo insieme. Batteria e fisarmonica.', '@b'],
        [0, 'Suoniamo malissimo. I vicini protestano tutti e due adesso. Ci divertiamo un sacco.', '@b'],
        [0, 'Il ragazzo dice che a casa va un po’ meglio. Io dico che la musica aggiusta le cose.']
      ]
    ],
    e: { a: 'ha trasformato il vicino rumoroso in un piccolo musicista', b: 'ha fatto un patto musicale con il vicino rumoroso' }
  },
  {
    id: 'afono',
    t: 'Senza voce',
    ok: r => r.tr.includes('chiacchierone'),
    b: [
      [
        [0, '*scrive su un foglietto: «HO PERSO LA VOCE. LARINGITE. UNA SETTIMANA.»*'],
        [0, '*scrive: «IO! CHE PARLO DALLA MATTINA ALLA SERA!»*'],
        [0, '*indica il menù, poi la tazza, poi fa un pollice in su disperato*']
      ],
      [
        [0, '*scrive: «È DURA. MA STO SCOPRENDO UNA COSA.»*'],
        [0, '*scrive: «LA GENTE MI RACCONTA COSE. PERCHÉ NON LA INTERROMPO.»*'],
        {
          c: {
            q: '{A} ti passa il foglietto: «CHE FACCIO QUANDO TORNA LA VOCE?»',
            o: [
              { t: 'Scrivi: «Continua ad ascoltare. Parla dopo.»', f: '@a', r: [[0, '*scrive: «DIFFICILISSIMO. CI PROVO.»*']] },
              {
                t: 'Scrivi: «Tieni un quaderno delle cose che ti raccontano.»',
                f: '@b',
                r: [[0, '*scrive: «UN QUADERNO. SÌ. COSÌ NON LE PERDO.»*']]
              }
            ]
          }
        }
      ],
      [
        [0, 'È tornata la voce! Ma adesso conto fino a tre prima di parlare. A volte fino a cinque.', '@a'],
        [0, 'Mia sorella mi ha detto: «Sei cambiat{o}. Mi ascolti». Mi sono emozionat{o}, al telefono.', '@a'],
        [0, 'Ho riempito mezzo quaderno. Il fornaio è innamorato. La signora del terzo piano vuole andare in Islanda.', '@b'],
        [0, 'Ora so tante cose belle delle persone. Prima sapevo solo le mie.', '@b'],
        [0, 'Comunque: un {item}, grazie! Che bello poterlo dire.']
      ]
    ],
    e: {
      a: 'ha perso la voce per una settimana e ha imparato ad ascoltare',
      b: 'ha perso la voce e ha cominciato un quaderno delle storie degli altri'
    }
  },
  {
    id: 'karaoke',
    t: 'Il karaoke',
    ok: r => r.tr.includes('timido'),
    b: [
      [
        [0, 'Venerdì in ufficio c’è la festa con il karaoke. Tutti devono cantare. Tutti.'],
        [0, 'Io non canto nemmeno sotto la doccia. Sotto la doccia sto zitto e mi lavo.'],
        [0, 'Sto pensando di darmi malat{o}. Per tre giorni, per sicurezza.']
      ],
      [
        [0, 'Mi hanno messo in lista. Terzo. Dopo il capo, che canta Albano.'],
        {
          c: {
            q: '«Cosa canto, per sopravvivere?»',
            o: [
              {
                t: '«Una canzone che ami davvero. Anche se la stoni, si sente.»',
                f: '@a',
                r: [[0, 'Una che amo... Quella che cantava mio nonno in macchina. Ok.']]
              },
              {
                t: '«Un duetto. Trascina qualcuno con te.»',
                f: '@b',
                r: [[0, 'Un duetto! La collega della contabilità canta sempre a bassa voce... Le chiedo.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Ho cantato la canzone del nonno. Stonatissim{o}. A metà tutti cantavano con me.', '@a'],
        [0, 'Alla fine il capo mi ha abbracciato. Aveva le lacrime. Era la canzone di suo padre, pure.', '@a'],
        [0, 'Io e Teresa della contabilità. Duetto. Abbiamo vinto il premio «più coraggiosi».', '@b'],
        [0, 'Da lunedì pranziamo insieme. Si parla poco. Si sta bene.', '@b'],
        [0, 'Non sono diventat{o} coraggios{o}. Ma una volta lo sono stat{o}. E me lo ricordo.']
      ]
    ],
    e: { a: 'ha cantato al karaoke la canzone di suo nonno', b: 'ha cantato al karaoke in duetto e ha trovato un’amica' }
  },
  {
    id: 'mongolfiera',
    t: 'La mongolfiera',
    ok: r => r.tr.includes('sognatore') || r.type === 'turista',
    b: [
      [
        [0, 'Ho una lista. Le cose da fare prima dei quarant’anni. Ne ho fatte due su trenta.'],
        [0, 'La numero uno è volare in mongolfiera. Ce l’ho dall’età di otto anni.'],
        [0, 'Compio quarant’anni tra un mese. Che dici, faccio in tempo?']
      ],
      [
        [0, 'Ho trovato dove si fa. Ma costa tanto, e soffro di vertigini. Sulla sedia, già.'],
        {
          c: {
            q: '{A} ti mostra la lista spiegazzata. «Ci rinuncio?»',
            o: [
              {
                t: '«Vai. Con le vertigini. Le paure si guardano dall’alto.»',
                f: '@a',
                r: [[0, 'Dall’alto! Ok. Prenoto prima di avere il tempo di pentirmi.']]
              },
              {
                t: '«Riscrivi la lista. Metti cose che vuoi adesso, non a otto anni.»',
                f: '@b',
                r: [[0, 'Una lista nuova... Da quarantenne. Sembra quasi più coraggioso.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Sono salit{o}. Ho urlato i primi dieci minuti. Poi il sole è sorto sulle colline e ho smesso.', '@a'],
        [0, 'Da lassù il mondo è piccolo e gentile. Le paure pure.', '@a'],
        [0, 'La nuova lista ha dieci cose. La prima è «venire qui più spesso». Già fatta!', '@b'],
        [0, 'La mongolfiera c’è ancora, all’ultimo posto. Non ho fretta. La lista è mia, adesso.', '@b'],
        [0, 'Quarant’anni e una lista nuova. Si comincia adesso.']
      ]
    ],
    e: {
      a: 'ha volato in mongolfiera per i suoi quarant’anni, con le vertigini',
      b: 'ha riscritto la sua lista dei sogni per i quarant’anni'
    }
  },
  {
    id: 'patente',
    t: 'La patente',
    ok: r => r.type !== 'nonno',
    b: [
      [
        [0, 'Ho quarantacinque anni e domani ho l’esame di guida. Il terzo.'],
        [0, 'Le prime due volte ho preso il marciapiede. E poi un cestino. Era vuoto, almeno.'],
        [0, 'Mia figlia ha preso la patente prima di me. Mi dà lezioni. Mi sgrida.']
      ],
      [
        [0, 'L’istruttore dice che guido bene, ma all’esame mi blocco. Come una statua al volante.'],
        {
          c: {
            q: '«Come si fa a non bloccarsi?»',
            o: [
              {
                t: '«Immagina di accompagnare qualcuno a cui vuoi bene.»',
                f: '@a',
                r: [[0, 'Mia figlia sul sedile accanto, che mi sgrida... Così sì che guido attento.']]
              },
              {
                t: '«Canticchia. Chi canta non riesce ad avere paura.»',
                f: '@b',
                r: [[0, 'Canticchiare all’esame? L’esaminatore mi boccia per follia. Ma ci provo.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Ho immaginato mia figlia accanto. Ho guidato come un nonno prudente. Promoss{o}!', '@a'],
        [0, 'Mi ha regalato un portachiavi: «Per il genitore più lento della città».', '@a'],
        [0, 'Ho canticchiato per tutto l’esame. Alla fine l’esaminatore canticchiava con me. Promoss{o}!', '@b'],
        [0, 'Mi ha detto: «La prossima volta porti anche la chitarra».', '@b'],
        [0, 'Domenica porto la famiglia al mare. Guido io. Ho già avvisato tutti di allacciarsi bene.']
      ]
    ],
    e: { a: 'ha preso la patente a quarantacinque anni, al terzo tentativo', b: 'ha preso la patente canticchiando, al terzo tentativo' }
  },
  {
    id: 'quaderno',
    t: 'Il quaderno delle ricette',
    solo: 1,
    ok: r => !donna(r) && !r.key && (r.type === 'nonno' || r.type === 'lettore'),
    b: [
      [
        [0, 'Ho trovato il quaderno delle ricette di mia moglie. Scritto a mano, pieno di macchie di sugo.'],
        [0, 'Lei cucinava, io lavavo i piatti. Quarant’anni così.'],
        [0, 'Adesso so lavare i piatti benissimo. E basta.']
      ],
      [
        [0, 'Ho provato a fare il suo ragù. È venuto... diciamo che il cane l’ha apprezzato.'],
        [0, 'Nel quaderno c’è scritto «un po’ di questo, quanto basta di quello». Lei sapeva. Io no.'],
        {
          c: {
            q: '{A} sfoglia il quaderno con le dita grosse. «Lascio perdere?»',
            o: [
              {
                t: '«Fatti aiutare da qualcuno che cucina. Il quaderno lo leggete in due.»',
                f: '@a',
                r: [[0, 'Mia nipote fa la cuoca... Non gliel’ho mai chiesto. Glielo chiedo.']]
              },
              {
                t: '«Sbaglia. Ogni volta un po’ meno. Anche lei, all’inizio, sbagliava.»',
                f: '@b',
                r: [[0, 'Anche lei sbagliava... È vero! Il primo anno il ragù era nero. Me n’ero scordato.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Io e mia nipote cuciniamo il martedì. Lei capisce i «quanto basta». Io lavo i piatti. Come sempre.', '@a'],
        [0, 'Ieri il ragù era quello. Proprio quello. Ci siamo guardati e non abbiamo parlato.', '@a'],
        [0, 'Il settimo ragù era buono. Non come il suo. Ma buono. Il mio.', '@b'],
        [0, 'Ho scritto nel quaderno, sotto la sua ricetta: «Versione mia, un po’ meno sale».', '@b'],
        [0, 'Domenica invito i figli a pranzo. Cucino io. Che spavento, che bellezza.']
      ]
    ],
    e: { a: 'ha ritrovato il ragù di sua moglie cucinando con la nipote', b: 'ha imparato le ricette di sua moglie, un errore alla volta' }
  }
);

FILI2.push(
  {
    id: 'ombrello2',
    t: 'Sotto lo stesso ombrello',
    k: ['conoscenti'],
    b: [
      [
        [0, 'Scusa, quello è il mio ombrello. Credo.'],
        [1, 'Il tuo? È uguale al mio. Blu, con il manico storto.'],
        [0, 'Il mio ha un adesivo a forma di rana dentro. ...Anche il tuo?']
      ],
      [
        [1, 'Ho controllato. Avevamo lo stesso ombrello, comprato nello stesso negozio, lo stesso giorno.'],
        [0, 'Il negozio sotto i portici. Quello che ha chiuso.'],
        {
          c: {
            q: 'Fuori diluvia. Hanno un ombrello in due. Ti guardano.',
            o: [
              {
                t: '«Andate insieme. Uno dei due ha una casa più vicina.»',
                f: '@a',
                r: [
                  [0, 'Io abito in via dei Mille.'],
                  [1, 'Anch’io. Ma certo. Ovviamente.']
                ]
              },
              {
                t: '«Restate qui finché spiove. Offro io.»',
                f: '@b',
                r: [
                  [1, 'Finché spiove... Qui non spiove mai, lo sai?'],
                  [0, 'Allora ci tocca parlare un bel po’.']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Abitiamo a due portoni di distanza. Da sei anni. Mai visti.', '@a'],
        [1, 'Adesso facciamo la strada insieme ogni sera. Un ombrello in due, l’altro lo lasciamo a casa.', '@a'],
        [1, 'Non ha spiovuto per tre ore. Abbiamo parlato di tutto.', '@b'],
        [0, 'Del negozio dei portici, dei nostri nonni, delle rane. Ci siamo scambiati i numeri.', '@b'],
        [0, 'Mia nonna diceva: un ombrello non si presta a chiunque.'],
        [1, 'Allora noi due non siamo chiunque.']
      ]
    ],
    e: {
      a: 'hanno scoperto di avere lo stesso ombrello e di abitare vicini',
      b: 'hanno aspettato insieme che spiovesse, e sono diventati amici'
    },
    fx: 'amici'
  },
  {
    id: 'libro2',
    t: 'Il libro scambiato',
    k: ['conoscenti', 'amici'],
    b: [
      [
        [0, 'Questo libro l’ho trovato sul tavolo, ieri. Con dei segni a matita. Era tuo?'],
        [1, 'Sì! Lo cercavo dappertutto. Hai letto le mie note?'],
        [0, 'Tutte. A pagina cinquanta hai scritto «che idiota». Parlavi del protagonista, spero.']
      ],
      [
        [1, 'Ti ho lasciato una risposta. A matita, sotto la tua.'],
        [0, 'E io ti ho risposto sotto la tua risposta. Il margine è finito.'],
        {
          c: {
            q: '«Che facciamo, finito il margine?»',
            o: [
              {
                t: '«Un quaderno in comune. Lo lasciate qui al bancone.»',
                f: '@a',
                r: [[1, 'Un quaderno al bancone! Lo tieni tu per noi?']]
              },
              {
                t: '«Prendete un altro libro. Lo stesso, tutti e due.»',
                f: '@b',
                r: [[0, 'Lo stesso libro, e ci leggiamo in parallelo... Sì.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Il quaderno al bancone è quasi pieno. Lo legge anche la gente che aspetta il caffè.', '@a'],
        [1, 'Qualcuno ci ha scritto sotto. Adesso è un club. Senza volerlo.', '@a'],
        [1, 'Abbiamo letto lo stesso libro. Abbiamo pianto alla stessa pagina.', '@b'],
        [0, 'La prossima settimana ne cominciamo un altro. Hai già sottolineato la prima riga, vero?', '@b'],
        [1, 'Non si sottolinea la prima riga.'],
        [0, 'Si sottolinea tutto ciò che è bello.']
      ]
    ],
    e: { a: 'hanno cominciato un quaderno di lettori al bancone', b: 'hanno cominciato a leggere gli stessi libri, insieme' },
    fx: 'amici'
  },
  {
    id: 'trasloco',
    t: 'Il trasloco',
    k: ['amici', 'migliori'],
    b: [
      [
        [0, 'Devo dirti una cosa. Mi hanno offerto un lavoro. A Torino.'],
        [1, 'Torino. ...Bella città. Fredda. Lontana.'],
        [0, 'Non ho ancora detto di sì.']
      ],
      [
        [1, 'Ci ho pensato tutta la notte. Devi andare. È il lavoro che sognavi.'],
        [0, 'E noi? I giovedì? Le passeggiate? Questo tavolo?'],
        {
          c: {
            q: 'Si guardano. È la prima volta che nessuno dei due trova una battuta.',
            o: [
              {
                t: '«Un giovedì al mese, uno di voi prende il treno.»',
                f: '@a',
                r: [
                  [1, 'Il primo giovedì vengo io. Porto i gianduiotti... no, quelli li porti tu.'],
                  [0, 'Affare fatto.']
                ]
              },
              {
                t: '«Il giovedì sera, videochiamata. Ognuno col suo caffè.»',
                f: '@b',
                r: [
                  [0, 'Col caffè di qui. Me lo spedisci?'],
                  [1, 'Ti spedisco anche il barista, se serve.']
                ]
              }
            ]
          }
        }
      ],
      [
        [1, 'Primo giovedì del mese: quattro ore di treno e una scatola di gianduiotti enorme.', '@a'],
        [0, 'Tanta strada per un caffè. Ne vale la pena ogni volta.', '@a'],
        [0, 'Ogni giovedì sera ci chiamiamo. {B} qui al tavolo, io in cucina a Torino.', '@b'],
        [1, 'Una sera è caduta la linea e abbiamo continuato a bere in silenzio. Era bello lo stesso.', '@b'],
        [0, 'Le distanze sono solo chilometri.'],
        [1, 'E i chilometri si fanno.']
      ]
    ],
    e: {
      a: 'si vedono un giovedì al mese, anche se ora vivono lontani',
      b: 'si fanno compagnia in videochiamata ogni giovedì, anche da lontano'
    }
  },
  {
    id: 'cammino',
    t: 'Il cammino',
    k: ['amici', 'migliori', 'coppia', 'sposati'],
    b: [
      [
        [0, 'Facciamo il cammino. Trecento chilometri a piedi. Zaino, vesciche, tutto.'],
        [1, 'Tu ti lamenti quando la fermata è a due isolati.'],
        [0, 'Appunto. Voglio scoprire se so smettere di lamentarmi.']
      ],
      [
        [1, 'Scarpe comprate. Zaini pronti. Partiamo lunedì.'],
        [0, 'Il medico dice che con le mie ginocchia è un po’ un azzardo.'],
        {
          c: {
            q: '«Partiamo lo stesso?»',
            o: [
              {
                t: '«Partite. Ma con tappe corte. Arriverete lo stesso.»',
                f: '@a',
                r: [[1, 'Tappe corte. Più tempo per mangiare. Mi piace.']]
              },
              {
                t: '«Fatene metà, ma fatela bene. Il resto l’anno prossimo.»',
                f: '@b',
                r: [[0, 'Metà quest’anno, metà l’anno prossimo. Così abbiamo già un appuntamento.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Trecento chilometri in un mese. Con tappe da tartaruga. Siamo arrivati!', '@a'],
        [1, 'Mi ha detto «basta, non ce la faccio» solo quattrocento volte. Un record.', '@a'],
        [1, 'Centocinquanta chilometri. Le ginocchia hanno retto. Il morale anche.', '@b'],
        [0, 'L’anno prossimo facciamo l’altra metà. Abbiamo già segnato la data sul calendario.', '@b'],
        [0, 'Sai cosa ho scoperto camminando?'],
        [1, 'Che ti lamenti anche a piedi.'],
        [0, 'Che con te mi lamento meno.']
      ]
    ],
    e: {
      a: 'hanno fatto trecento chilometri a piedi, a tappe da tartaruga',
      b: 'hanno fatto metà del cammino, e la seconda metà la faranno l’anno prossimo'
    }
  },
  {
    id: 'culla',
    t: 'La culla',
    k: ['coppia', 'sposati'],
    b: [
      [
        [0, '*appoggia sul tavolo una piccola scarpina di lana*'],
        [1, '...Cos’è questa?'],
        [0, 'È per un piede molto piccolo. Che arriva a primavera.']
      ],
      [
        [1, 'Ho montato la culla. Ci ho messo sei ore. Avanzano tre viti.'],
        [0, 'Dobbiamo scegliere il nome. Io ne voglio uno, tu un altro.'],
        {
          c: {
            q: 'Si girano entrambi verso di te: «Decidi tu, così nessuno dei due ha perso».',
            o: [
              {
                t: '«Il nome della persona a cui volete più bene.»',
                f: '@a',
                r: [[1, 'Quella persona... C’è un nome che abbiamo in comune, in effetti.']]
              },
              {
                t: '«Lo scegliete quando lo vedete in faccia.»',
                f: '@b',
                r: [[0, 'Quando lo vediamo... Mi piace. Il nome ce lo dirà la sua faccia.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'È nata. Le abbiamo dato il nome della nonna che ci ha fatti conoscere.', '@a'],
        [1, 'La nonna ha pianto al telefono per un’ora. Poi ha chiesto quando la portiamo qui.', '@a'],
        [1, 'L’abbiamo guardata e l’abbiamo saputo subito. Si chiama Luce.', '@b'],
        [0, 'Perché quando è nata è uscito il sole. Qui, dove piove sempre.', '@b'],
        [0, 'Le tre viti avanzate le abbiamo messe in una scatolina. Per ricordo.'],
        [1, 'La culla regge. Più o meno. Come noi.']
      ]
    ],
    e: { a: 'hanno avuto una bambina e le hanno dato il nome della nonna', b: 'hanno avuto una bambina, e quando è nata è uscito il sole' },
    fx: 'sposati'
  },
  {
    id: 'genitori',
    t: 'Conoscere i genitori',
    k: ['fidanzati', 'coppia'],
    b: [
      [
        [0, 'Domenica conosci i miei. Non preoccuparti. Mio padre è simpatico.'],
        [1, 'Simpatico quanto?'],
        [0, 'Una volta ha fatto piangere il mio ex. Ma per una partita a carte.']
      ],
      [
        [1, 'Ho studiato. So tutto della sua squadra, del suo orto, della sua moto del ’78.'],
        [0, 'Non parlargli della moto. Mai. È una ferita aperta.'],
        {
          c: {
            q: '«Cosa porto in regalo, per non sbagliare?»',
            o: [
              { t: '«Un dolce fatto da te. Anche se viene brutto.»', f: '@a', r: [[1, 'Brutto verrà di sicuro. Ma fatto da me.']] },
              {
                t: '«Delle sementi per l’orto. I papà con l’orto si conquistano così.»',
                f: '@b',
                r: [[0, 'Le sementi! È geniale. Pomodori antichi. Impazzirà.']]
              }
            ]
          }
        }
      ],
      [
        [1, 'Ho portato la torta. Era storta. Sua madre l’ha messa al centro del tavolo come un trofeo.', '@a'],
        [0, 'Mio padre ne ha mangiate tre fette e ha detto «non male». Da lui è un abbraccio.', '@a'],
        [0, '{B} ha portato i semi di pomodoro antico. Mio padre ha voluto mostrare subito l’orto.', '@b'],
        [1, 'Mi ha fatto zappare per un’ora. Credo sia stato un esame. Credo di averlo passato.', '@b'],
        [1, 'Alla fine mi ha detto: «Torna presto». Poi: «E non parlare della moto».'],
        [0, 'Ce l’hai fatta. Sei di famiglia.']
      ]
    ],
    e: { a: 'si sono presentati ai genitori con una torta storta', b: 'si sono presentati ai genitori con dei semi per l’orto di papà' }
  },
  {
    id: 'playlist',
    t: 'La playlist',
    k: ['cotta'],
    b: [
      [
        [0, '*fa scivolare un biglietto sul tavolo: c’è scritto un link e basta*'],
        [1, 'Cos’è?'],
        [0, 'Niente. Una playlist. Canzoni a caso. Totalmente a caso.']
      ],
      [
        [1, 'L’ho ascoltata tre volte. La quarta canzone... la quarta canzone dice delle cose.'],
        [0, 'È a caso. Te l’ho detto. ...Quali cose?'],
        {
          c: {
            q: '{B} ti guarda, con il telefono in mano. «Rispondo con un’altra playlist?»',
            o: [
              {
                t: '«Sì. E metti come prima canzone la risposta.»',
                f: '@a',
                r: [[1, 'La risposta come prima canzone. Così non devo dire niente ad alta voce.']]
              },
              {
                t: '«No. Diglielo a voce. Le canzoni dopo.»',
                f: '@b',
                r: [[1, 'A voce... Mi tremano le ginocchia. Ma va bene. Adesso, prima di pensarci.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'La prima canzone della sua playlist si chiama «Anche io». L’ho ascoltata cinquanta volte.', '@a'],
        [1, 'Adesso abbiamo una playlist in comune. Ci aggiungiamo una canzone a testa, ogni sera.', '@a'],
        [1, 'Gliel’ho detto. A voce. Male. Ho anche fatto cadere lo zucchero.', '@b'],
        [0, 'È stata la dichiarazione più goffa della storia. E la più bella.', '@b'],
        [0, 'La quarta canzone non era a caso.'],
        [1, 'Lo so. Lo sapevo dalla seconda.']
      ]
    ],
    e: { a: 'si sono dichiarati scambiandosi playlist', b: 'si sono dichiarati a voce, dopo una playlist non proprio a caso' },
    fx: 'coppia'
  },
  {
    id: 'quiz',
    t: 'Il quiz del giovedì',
    k: ['rivali'],
    b: [
      [
        [0, 'Il quiz del giovedì al pub. La mia squadra vince da sei mesi.'],
        [1, 'Fino a ieri. Ieri ha vinto la mia.'],
        [0, 'Per una domanda sulla capitale dell’Australia. Era una domanda scorretta.'],
        [1, 'Era Canberra. Era correttissima.']
      ],
      [
        [0, 'Le nostre squadre si sono sciolte. Tutti in vacanza. Restiamo solo noi due.'],
        [1, 'Il quiz è giovedì. Servono almeno due persone per squadra.'],
        {
          c: {
            q: 'Si guardano come due gatti sullo stesso tetto. «E adesso?»',
            o: [
              {
                t: '«Fate squadra insieme. Nessuno vi batterà.»',
                f: '@a',
                r: [[0, 'Insieme? ...Tu sai la geografia, io la storia. Siamo imbattibili.']]
              },
              {
                t: '«Sfidatevi qui, al tavolo. Le domande le faccio io.»',
                f: '@b',
                r: [[1, 'Qui? Davanti a tutti? Ci sto. Preparati a perdere.']]
              }
            ]
          }
        }
      ],
      [
        [1, 'Squadra «Canberra». Abbiamo vinto con trenta punti di distacco.', '@a'],
        [0, '{B} sapeva tutte le capitali, io tutte le date. Abbiamo litigato solo sulle canzoni degli anni ’80.', '@a'],
        [0, 'Il quiz al tavolo è finito pari. Dodici a dodici. Tutto il locale faceva il tifo.', '@b'],
        [1, 'Abbiamo deciso di rifarlo ogni giovedì. Qui. È più divertente del pub.', '@b'],
        [0, 'Non sei così insopportabile, quando sai le risposte.'],
        [1, 'E tu sei quasi sopportabile, quando le sbagli.']
      ]
    ],
    e: { a: 'da rivali sono diventati la squadra imbattibile del quiz', b: 'si sfidano a quiz al tavolo ogni giovedì, da amici' },
    fx: 'amici'
  },
  {
    id: 'nonna2',
    t: 'La ricetta segreta',
    k: ['famiglia'],
    b: [
      [
        [0, 'La nonna non ci ha mai dato la ricetta dei suoi tortelli. Diceva: «Quando sarete pronti».'],
        [1, 'Abbiamo quarant’anni. Quando, pronti?'],
        [0, 'Domenica ce la insegna. Ha detto che è ora.']
      ],
      [
        [1, 'Abbiamo cucinato sei ore. Lei non misurava niente. «A occhio», diceva. Ma quale occhio?'],
        [0, 'Io ho scritto tutto di nascosto. Ma lei se n’è accorta e ha cambiato le dosi apposta.'],
        {
          c: {
            q: '«Come facciamo a non perderla, la ricetta vera?»',
            o: [
              {
                t: '«Filmatela mentre cucina. Le mani dicono più delle dosi.»',
                f: '@a',
                r: [[1, 'Le sue mani... Sì. Con il suo vestito a fiori e le sue chiacchiere.']]
              },
              {
                t: '«Cucinatela voi, con lei che guarda e corregge. Tante volte.»',
                f: '@b',
                r: [[0, 'Tante volte. Finché le nostre mani non diventano un po’ come le sue.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'L’abbiamo filmata. Venti minuti di tortelli e trenta di storie del paese.', '@a'],
        [1, 'Il video lo guardiamo anche quando non cuciniamo. Per sentire come ride.', '@a'],
        [1, 'Al quinto tentativo ha assaggiato e non ha detto niente. Poi ha detto: «Adesso sì».', '@b'],
        [0, 'Abbiamo pianto sui tortelli. Erano salati lo stesso, ma per un altro motivo.', '@b'],
        [0, 'Un giorno la insegneremo ai nostri figli.'],
        [1, '«Quando saranno pronti».']
      ]
    ],
    e: { a: 'hanno filmato la nonna mentre faceva i tortelli', b: 'hanno imparato i tortelli della nonna, un tentativo alla volta' }
  },
  {
    id: 'scuse',
    t: 'Le scuse',
    k: ['famiglia', 'amici', 'migliori'],
    b: [
      [
        [0, '*arriva, vede chi c’è al tavolo, si ferma*'],
        [1, '...Ciao.'],
        [0, 'Ciao. Non sapevo venissi anche tu qui.'],
        [1, 'Vengo da un anno. Da quando non ci parliamo.']
      ],
      [
        [0, 'Ho pensato tanto a quella sera. A quello che ti ho detto.'],
        [1, 'Anch’io. Ho pensato a quello che non ti ho detto.'],
        {
          c: {
            q: 'Nessuno dei due riesce a cominciare. Il caffè si fredda.',
            o: [
              {
                t: '«Chi chiede scusa per primo non perde. Vince.»',
                f: '@a',
                r: [
                  [0, 'Allora... scusa. Davvero. Scusa.'],
                  [1, 'Scusa anche tu. Cioè, scusa io.']
                ]
              },
              {
                t: 'Porta due biscotti uguali e vai via in silenzio',
                f: '@b',
                r: [
                  [1, '*spinge un biscotto verso l’altro lato del tavolo*'],
                  [0, '*lo prende. Sorride.*']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Ci siamo chiesti scusa tutti e due. Poi abbiamo parlato fino alla chiusura.', '@a'],
        [1, 'Un anno perso per una frase. Non succederà più.', '@a'],
        [1, 'Non abbiamo detto niente, quel giorno. Abbiamo mangiato il biscotto.', '@b'],
        [0, 'Il giorno dopo ci siamo telefonati. Come se niente fosse. Ma era tutto.', '@b'],
        [0, 'Grazie di aver tenuto il nostro tavolo, in quest’anno.'],
        [1, 'Lo sapevi che lo teneva per noi?']
      ]
    ],
    e: { a: 'dopo un anno di silenzio si sono chiesti scusa', b: 'dopo un anno di silenzio hanno fatto pace con un biscotto' }
  }
);
