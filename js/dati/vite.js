// Vite degli habitué: storie personali in tre visite (FILI) e vite a due (FILI2).

// Ogni habitué affezionato può vivere una piccola storia personale in tre visite.
// Nella seconda visita scegli tu cosa dirgli: la terza visita e il finale cambiano.
// Quando una storia finisce, dopo qualche giorno ne può iniziare un'altra: non finiscono mai.
const FILI = [
  {
    id: 'esame',
    t: "L'esame",
    ok: r => r.type === 'studente' || r.tr.includes('nerd'),
    b: [
      [
        [0, "Tra una settimana ho l'esame più difficile del corso."],
        [0, '*sfoglia appunti pieni di evidenziatore*'],
        [0, "Se non lo passo, rifaccio tutto l'anno."]
      ],
      [
        [0, 'Domani è il giorno. Non ho ancora finito di ripassare.'],
        [0, "*le mani tremano un po' sulla tazza*"],
        {
          c: {
            q: '{A} ti guarda con gli occhi stanchi. «Che faccio, ripasso tutta la notte?»',
            o: [
              { t: '«Vai a dormire. Sai già tutto.»', f: '@a', r: [[0, '...Forse hai ragione. Il cervello ha bisogno di riposo.']] },
              { t: '«Un ultimo ripasso. Il caffè lo offro io.»', f: '@b', r: [[0, 'Grazie. Allora resto fino alla chiusura.']] }
            ]
          }
        }
      ],
      [
        [0, 'Ho dormito otto ore. E stamattina ricordavo TUTTO.', '@a'],
        [0, 'Trenta. Trenta e lode!', '@a'],
        [0, 'Ho ripassato fino alle tre. Ho visto le domande e... le sapevo!', '@b'],
        [0, "Ventotto. E un'occhiaia per occhio.", '@b'],
        [0, 'Questo {item} è il più buono della mia vita.']
      ]
    ],
    e: { a: 'ha dormito bene e preso trenta e lode', b: 'ha ripassato tutta la notte e preso ventotto' }
  },
  {
    id: 'cane',
    t: 'Il cane bagnato',
    ok: r => true,
    b: [
      [
        [0, "Fuori c'è un cane sotto la pensilina. Fradicio."],
        [0, 'Ha gli occhi più tristi del mondo.'],
        [0, '*guarda la porta ogni due minuti*']
      ],
      [
        [0, 'È ancora lì. Gli ho portato un cornetto.'],
        [0, 'Non ha la medaglietta, ma ha il collare.'],
        {
          c: {
            q: '«Che dici, me lo porto a casa?»',
            o: [
              { t: '«Portalo a casa. Ti ha già scelto.»', f: '@a', r: [[0, 'Ha scodinzolato. Lo prendo come un sì.']] },
              { t: '«Ha un collare: cerchiamo chi lo ha perso.»', f: '@b', r: [[0, 'Hai ragione. Attacco un cartello qui fuori.']] }
            ]
          }
        }
      ],
      [
        [0, 'Si chiama Chicco. Come i chicchi di caffè.', '@a'],
        [0, 'Dorme ai piedi del letto e russa.', '@a'],
        [0, "L'ha riconosciuto una signora anziana. Piangeva di gioia.", '@b'],
        [0, 'Mi ha invitato a pranzo domenica. Anche il cane.', '@b'],
        [0, 'Questo posto porta fortuna, sai?']
      ]
    ],
    e: { a: "ha adottato un cane e l'ha chiamato Chicco", b: "ha riportato il cane alla sua padrona, e ha trovato un'amica" }
  },
  {
    id: 'colloquio',
    t: 'Il colloquio',
    ok: r => ['normale', 'fretta', 'nottambulo'].includes(r.type),
    b: [
      [
        [0, 'Mi hanno chiamato per un colloquio. Il lavoro dei miei sogni.'],
        [0, 'Studio di architettura. Finestre enormi.'],
        [0, 'Ok. Respira.']
      ],
      [
        [0, 'Domani alle nove. Ho provato il discorso allo specchio.'],
        [0, 'Lo specchio non era convinto.'],
        {
          c: {
            q: '«Un consiglio? Uno solo.»',
            o: [
              { t: '«Sii te stesso. Funziona sempre.»', f: '@a', r: [[0, 'Me stesso. Con la camicia stirata, però.']] },
              { t: '«Porta i tuoi disegni. Parlano meglio di te.»', f: '@b', r: [[0, 'I disegni! Sono in una cartellina sotto il letto.']] }
            ]
          }
        }
      ],
      [
        [0, 'Mi hanno chiesto cosa mi rende felice.', '@a'],
        [0, 'Ho detto: un caffè sotto la pioggia. Hanno riso. Poi mi hanno preso!', '@a'],
        [0, 'Hanno sfogliato i disegni in silenzio per dieci minuti.', '@b'],
        [0, 'Poi hanno detto: «Quando inizia?»', '@b'],
        [0, 'Da lunedì passo qui prima del lavoro. Tutti i giorni.']
      ]
    ],
    e: { a: 'ha ottenuto il lavoro dei sogni essendo se stesso', b: 'ha ottenuto il lavoro dei sogni grazie ai suoi disegni' }
  },
  {
    id: 'canzone',
    t: 'La canzone',
    ok: r => ['musicista', 'artista'].includes(r.type) || r.tr.includes('sognatore') || r.tr.includes('artista'),
    b: [
      [
        [0, '*canticchia qualcosa sottovoce*'],
        [0, 'Scusa. Sto scrivendo una canzone.'],
        [0, 'Ho la melodia. Mi mancano le parole.']
      ],
      [
        [0, 'Sabato suono a una serata. La prima volta da solo.'],
        [0, 'Ho due testi e non so quale scegliere.'],
        {
          c: {
            q: "«Uno parla della pioggia, l'altro di questo posto. Quale?»",
            o: [
              { t: '«La pioggia. Tutti la capiscono.»', f: '@a', r: [[0, '«Gocce che bussano». Sì, suona bene.']] },
              { t: '«Questo posto. Scrivi di noi.»', f: '@b', r: [[0, 'Di noi... e di chi fa il caffè. Mi piace.']] }
            ]
          }
        }
      ],
      [
        [0, 'Al ritornello cantavano tutti. Anche il fonico.', '@a'],
        [0, 'Mi hanno chiesto di tornare il mese prossimo.', '@a'],
        [0, 'Ho detto il nome del locale dal palco.', '@b'],
        [0, 'Quindi se stasera entra gente strana, è colpa mia.', '@b'],
        [0, 'Ti dedico il prossimo disco. Promesso.']
      ]
    ],
    e: { a: 'ha cantato la canzone della pioggia e lo hanno richiamato', b: 'ha cantato una canzone su questo locale, davanti a tutti' }
  },
  {
    id: 'lettera',
    t: 'La lettera',
    ok: r => r.tr.includes('romantico') || r.tr.includes('timido'),
    b: [
      [
        [0, '*scrive, cancella, riscrive*'],
        [0, 'È una lettera. Per qualcuno che non sento da dieci anni.'],
        [0, 'Non so neanche se abita ancora lì.']
      ],
      [
        [0, "L'ho finita. Tre pagine."],
        [0, 'Ma forse è meglio lasciar perdere. Che figura ci faccio?'],
        {
          c: {
            q: '{A} tiene la busta sospesa sopra la borsa.',
            o: [
              {
                t: '«Spediscila. Adesso, prima di pentirti.»',
                f: '@a',
                r: [
                  [0, '*corre fuori fino alla buca delle lettere*'],
                  [0, 'Fatto! Oddio. Fatto.']
                ]
              },
              {
                t: '«Leggimela. Ti dico io.»',
                f: '@b',
                r: [
                  [0, '*legge sottovoce, la voce che trema*'],
                  [0, '...Grazie per avermi ascoltato. Mi è servito.']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Mi ha risposto. Quattro pagine.', '@a'],
        [0, 'Sabato ci vediamo. Qui, se per te va bene.', '@a'],
        [0, "Alla fine non l'ho spedita. Ma leggerla ad alta voce...", '@b'],
        [0, '...mi ha liberato. Come chiudere una porta piano piano.', '@b'],
        [0, 'Grazie. Sul serio.']
      ]
    ],
    e: { a: 'ha spedito la lettera, e ha ricevuto una risposta', b: 'ha letto la lettera ad alta voce e si è sentito libero' }
  },
  {
    id: 'maratona',
    t: 'La maratona',
    ok: r => r.tr.includes('sportivo') || r.type === 'fretta',
    b: [
      [
        [0, 'Mi sono iscritto alla maratona. Quarantadue chilometri.'],
        [0, 'Non ho mai corso più di cinque.'],
        [0, 'Ma ho tre mesi. E questo {item}.']
      ],
      [
        [0, 'Mi fa male il ginocchio. Ma la gara è vicina.'],
        {
          c: {
            q: '«Che faccio, stringo i denti?»',
            o: [
              { t: '«Rallenta. Arrivare è già vincere.»', f: '@a', r: [[0, 'Arrivare. Ok. Camminando, se serve.']] },
              { t: '«Spingi! Ce la puoi fare!»', f: '@b', r: [[0, 'SÌ. Ghiaccio e allenamento!']] }
            ]
          }
        }
      ],
      [
        [0, 'Quattro ore e cinquanta. Ultimo del mio gruppo.', '@a'],
        [0, 'Ma al traguardo ho pianto come un bambino. Felice.', '@a'],
        [0, 'Tre ore e cinquantanove! Sotto le quattro ore!', '@b'],
        [0, 'Il ginocchio mi odia. Ma ne valeva la pena.', '@b'],
        [0, 'Ho la medaglia in tasca. Posso tenerla sul tavolo?']
      ]
    ],
    e: { a: 'ha finito la maratona con calma, e ha pianto di gioia', b: 'ha corso la maratona sotto le quattro ore' }
  },
  {
    id: 'foto',
    t: 'La vecchia foto',
    ok: r => r.type === 'nonno' || r.type === 'lettore',
    b: [
      [
        [0, "Sa che questo locale, sessant'anni fa, era un forno?"],
        [0, 'Ci venivo da bambino. Profumava di pane.'],
        [0, 'Devo avere una foto, da qualche parte.']
      ],
      [
        [0, 'Eccola! Guardi: io sono quello senza un dente.'],
        [0, '*appoggia una foto in bianco e nero sul tavolo*'],
        {
          c: {
            q: '«Che ne faccio di questa foto?»',
            o: [
              { t: '«La appendiamo qui, vicino alla porta.»', f: '@a', r: [[0, 'Davvero? Allora il forno torna a casa.']] },
              { t: '«La tenga lei. Ma ce la racconti ogni volta.»', f: '@b', r: [[0, 'Ogni volta! Si annoierà di me.']] }
            ]
          }
        }
      ],
      [
        [0, 'Ho portato mio nipote a vedere la foto appesa.', '@a'],
        [0, 'Ha detto: «Nonno, eri carino». Che sfacciato.', '@a'],
        [0, 'Mi sono ricordato il nome del fornaio: Settimio.', '@b'],
        [0, 'Ogni mattina mi regalava un panino caldo. Adesso lo regalo io a lei: il racconto.', '@b'],
        [0, 'Grazie per avermi ascoltato, ragazzo mio.']
      ]
    ],
    e: { a: 'ha appeso nel locale la foto di quando era un forno', b: 'ha raccontato la storia del vecchio forno e di Settimio' }
  },
  {
    id: 'sorriso',
    t: 'Il brontolone',
    ok: r => r.tr.includes('brontolone'),
    b: [
      [
        [0, 'Il caffè è troppo caldo. La sedia è troppo bassa.'],
        [0, 'E piove. Piove sempre.'],
        [0, '*brontola qualcosa sottovoce*']
      ],
      [
        [0, 'Mia figlia dice che non sorrido mai.'],
        [0, 'Che sciocchezza. Io sorrido. Dentro.'],
        {
          c: {
            q: '{A} fissa la tazza, accigliato.',
            o: [
              {
                t: '«Le offro un biscotto. Per sorridere fuori.»',
                f: '@a',
                r: [
                  [0, '*mangia il biscotto, molto serio*'],
                  [0, '...Mh. Non è male.']
                ]
              },
              {
                t: '«Le racconto una barzelletta.»',
                f: '@b',
                r: [
                  [0, 'Una barzelletta? A me?'],
                  [0, "...*sbuffa una risatina* Pessima. Me ne racconti un'altra domani."]
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Oggi ho sorriso alla vicina. È svenuta.', '@a'],
        [0, 'Scherzo. Ma era molto sorpresa.', '@a'],
        [0, 'Ho raccontato la sua barzelletta a mia figlia.', '@b'],
        [0, 'Ha riso così tanto che le è andato il tè di traverso.', '@b'],
        [0, 'Va bene. Il caffè non è troppo caldo. È perfetto.']
      ]
    ],
    e: { a: 'ha imparato a sorridere grazie a un biscotto', b: 'ha fatto ridere sua figlia con una barzelletta pessima' }
  },
  {
    id: 'mostra',
    t: 'La mostra',
    ok: r => r.type === 'artista' || r.tr.includes('artista'),
    b: [
      [
        [0, 'Dipingo la città vista dalle vetrine dei bar.'],
        [0, 'Questo è il ventesimo bar. Il più bello, finora.'],
        [0, '*mescola un blu e un rosa sulla tavolozza*']
      ],
      [
        [0, 'Ho finito il quadro di questo posto. Una galleria me lo vuole comprare.'],
        {
          c: {
            q: '«Lo vendo o lo tengo?»',
            o: [
              { t: "«Vendilo! È l'inizio della tua carriera.»", f: '@a', r: [[0, 'Hai ragione. I quadri devono viaggiare.']] },
              { t: '«Appendilo qui. Lo vedranno tutti i giorni.»', f: '@b', r: [[0, 'Qui? Sopra quel tavolo, con la luce giusta...']] }
            ]
          }
        }
      ],
      [
        [0, 'La galleria ha venduto tutto in due giorni!', '@a'],
        [0, 'Ora mi chiedono altri venti bar. Ci vorranno anni.', '@a'],
        [0, "Ieri un signore l'ha fissato per un'ora. Poi ha ordinato un {item}.", '@b'],
        [0, "È questo il successo, no? Un'ora davanti a un quadro.", '@b'],
        [0, 'La prossima tela la comincio qui. Come sempre.']
      ]
    ],
    e: { a: 'ha venduto il quadro del locale e ha iniziato la sua carriera', b: 'ha regalato al locale il quadro che lo ritrae' }
  },
  {
    id: 'poesie',
    t: 'Le poesie della notte',
    ok: r => r.type === 'nottambulo' || r.tr.includes('sognatore'),
    b: [
      [
        [0, 'Di notte non dormo. Scrivo poesie sui tovaglioli.'],
        [0, 'Questo è il numero centoquattro.'],
        [0, '«La città russa, io no».']
      ],
      [
        [0, 'Un piccolo editore vuole pubblicarle. Ma solo cinquanta.'],
        {
          c: {
            q: '«Come scelgo le cinquanta giuste?»',
            o: [
              {
                t: '«Scegli quelle scritte sotto la pioggia.»',
                f: '@a',
                r: [[0, 'Sono quasi tutte scritte sotto la pioggia. Questo aiuta.']]
              },
              { t: '«Scegli quelle che ti fanno paura.»', f: '@b', r: [[0, 'Paura... sì. Quelle vere.']] }
            ]
          }
        }
      ],
      [
        [0, 'Il libro si chiama «Gocce». Copertina blu.', '@a'],
        [0, 'Ne ho lasciata una copia sul bancone. Per chi non dorme.', '@a'],
        [0, 'Il libro si chiama «Quello che non dico».', '@b'],
        [0, 'Una lettrice mi ha scritto: «Mi ha fatto sentire meno sola».', '@b'],
        [0, 'Stanotte forse dormo. Forse.']
      ]
    ],
    e: { a: 'ha pubblicato «Gocce», poesie scritte sotto la pioggia', b: 'ha pubblicato «Quello che non dico», le poesie più vere' }
  },
  {
    id: 'furgone',
    t: 'Il furgoncino',
    ok: r => r.tr.includes('sognatore') || r.tr.includes('chiacchierone'),
    b: [
      [
        [0, 'Ho comprato un furgoncino scassato. Ci voglio fare un chiosco di crêpe.'],
        [0, 'Per ora fa solo fumo nero.'],
        [0, 'Ma è giallo! È bellissimo.']
      ],
      [
        [0, 'Il meccanico dice che serve un motore nuovo. O un miracolo.'],
        {
          c: {
            q: '«Aggiusto il motore o cambio piano?»',
            o: [
              { t: '«Aggiustalo. I sogni non si rottamano.»', f: '@a', r: [[0, 'Ok. Vendo la moto. Addio moto.']] },
              { t: '«Parcheggialo e apri lì il chiosco. Fermo.»', f: '@b', r: [[0, 'Un chiosco fermo... in piazza... geniale!']] }
            ]
          }
        }
      ],
      [
        [0, 'Il furgone va! Domenica ero al mercato del porto.', '@a'],
        [0, "Finite tutte le crêpe in un'ora.", '@a'],
        [0, 'Il furgone fermo in piazza ora ha una coda ogni sera.', '@b'],
        [0, 'Lo chiamano «il furgone che non parte». Pubblicità gratis.', '@b'],
        [0, 'Prima crêpe della giornata: la porto sempre a te.']
      ]
    ],
    e: { a: 'ha aggiustato il furgoncino e vende crêpe in giro', b: 'ha trasformato un furgone rotto in un chiosco famoso' }
  },
  {
    id: 'ombrello',
    t: "L'ombrello giallo",
    ok: r => r.tr.includes('chiacchierone') || r.type === 'lettore' || r.tr.includes('nerd'),
    b: [
      [
        [0, "Hai notato la persona con l'ombrello giallo?"],
        [0, 'Passa davanti alla vetrina ogni sera alle undici. Non entra mai.'],
        [0, 'Un mistero. Adoro i misteri.']
      ],
      [
        [0, "L'ho visto di nuovo! Si è fermato a guardare l'insegna."],
        {
          c: {
            q: '«Gli vado a parlare?»',
            o: [
              {
                t: '«Sì! Invitalo a entrare.»',
                f: '@a',
                r: [
                  [0, '*esce di corsa sotto la pioggia*'],
                  [0, '...È scappato. Ma domani ci riprovo.']
                ]
              },
              { t: '«Lascia stare. Ognuno ha i suoi segreti.»', f: '@b', r: [[0, 'Hai ragione. Però guardo lo stesso.']] }
            ]
          }
        }
      ],
      [
        [0, 'Era il vecchio proprietario del locale! Prima che fosse tuo.', '@a'],
        [0, 'Passava ogni sera per vedere se le luci erano accese. Ora entra.', '@a'],
        [0, 'Stasera ha lasciato un biglietto sotto la porta.', '@b'],
        [0, '«Grazie per aver riacceso le luci». Firmato: un ombrello giallo.', '@b'],
        [0, 'Che città strana e bellissima.']
      ]
    ],
    e: {
      a: "ha scoperto che l'ombrello giallo era il vecchio proprietario",
      b: "ha lasciato il mistero dell'ombrello giallo com'era, e ha trovato un biglietto"
    }
  }
];
/* ----- altre vite: generiche, intrecciate alle storie, dei personaggi chiave, seguiti ----- */
FILI.push(
  {
    id: 'cuccioli',
    p: 1,
    t: 'I cuccioli di Chicco',
    ok: r => r.pet && r.pet.n === 'Chicco',
    b: [
      [
        [0, 'Chicco è strano. Mangia per tre e dorme tutto il giorno.'],
        [0, '*accarezza Chicco sotto il tavolo*'],
        [0, 'Ho preso appuntamento dalla veterinaria. Nora, quella del gattino.']
      ],
      [
        [0, 'Chicco non è un lui. È una lei. E aspetta cinque cuccioli.'],
        [0, 'Nora ha riso per dieci minuti.'],
        {
          c: {
            q: '«Cinque cuccioli! Che faccio, li tengo tutti?»',
            o: [
              {
                t: '«Tienine uno. Gli altri ai clienti del locale.»',
                f: '@a',
                r: [[0, 'Ai clienti... Così li vedo tutti i giorni. Geniale.']]
              },
              {
                t: '«Tienili tutti. Casa piena, cuore pieno.»',
                f: '@b',
                r: [
                  [0, 'Tutti?! Il mio appartamento è di quaranta metri.'],
                  [0, '...Ok. Tutti.']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Nonna Rosa ne ha preso uno. Lo ha chiamato Brodo.', '@a'],
        [0, 'Il professore un altro. Dice che gli detta le frasi.', '@a'],
        [0, 'Ho una casa piena di cuccioli e di pipì. Sono felicissimo.', '@b'],
        [0, 'Ho dovuto comprare un divano nuovo. Lo hanno già mangiato.', '@b'],
        [0, 'Grazie per quella pioggia. Mi ha portato Chicco. E Chicco mi ha portato tutto il resto.']
      ]
    ],
    e: { a: 'ha regalato i cuccioli di Chicco ai clienti del locale', b: 'ha tenuto tutti e cinque i cuccioli di Chicco' }
  },
  {
    id: 'scacchiera',
    t: 'La scacchiera',
    ok: r => arcDone('scacchi'),
    b: [
      [
        [0, 'Guardo sempre i due signori che giocano a scacchi. Dario ed Elio.'],
        [0, 'Non ho mai capito come si muove il cavallo.'],
        [0, '*imita una L con le dita*']
      ],
      [
        [0, 'Ho chiesto a Dario di insegnarmi. Mi ha guardato come un pedone.'],
        [0, 'Poi Elio ha detto: «Insegniamo insieme». Ora litigano su cosa insegnarmi.'],
        {
          c: {
            q: '«Chi dei due ascolto?»',
            o: [
              { t: '«Dario: attacca sempre.»', f: '@a', r: [[0, 'Attacco sempre. Mi piace. Anche se perdo.']] },
              { t: "«Elio: aspetta l'errore dell'altro.»", f: '@b', r: [[0, 'Pazienza. Non è il mio forte. Proverò.']] }
            ]
          }
        }
      ],
      [
        [0, 'Ho battuto un ragazzo al torneo! In dodici mosse, attaccando come un matto.', '@a'],
        [0, 'Dario ha urlato di gioia. Elio ha detto che ho avuto fortuna.', '@a'],
        [0, "Ho aspettato quaranta mosse. Poi l'altro ha sbagliato. Scacco!", '@b'],
        [0, 'Elio mi ha stretto la mano. Dario ha detto che mi annoio a guardarmi.', '@b'],
        [0, 'Ora ho due maestri che litigano su di me. È bellissimo.']
      ]
    ],
    e: { a: 'ha imparato gli scacchi da Dario, attaccando sempre', b: 'ha imparato gli scacchi da Elio, con pazienza' }
  },
  {
    id: 'ricetta',
    t: 'La ricetta di Nonna Rosa',
    ok: r => arcDone('consegne'),
    b: [
      [
        [0, 'Ho mangiato il ramen di Kenji. Ho pianto. Non so perché.'],
        [0, 'Voglio imparare a farlo. Per mia madre, che è lontana.'],
        [0, 'Ma la ricetta è segreta. Di Nonna Rosa.']
      ],
      [
        [0, 'Ho chiesto a Nonna Rosa la ricetta.'],
        [0, 'Mi ha chiesto se mangio abbastanza. Poi mi ha dato un biscotto. Poi niente ricetta.'],
        {
          c: {
            q: '«Come convinco una nonna?»',
            o: [
              { t: '«Portale tu qualcosa che hai cucinato.»', f: '@a', r: [[0, 'Cucinare per lei? Ho paura. Ma va bene.']] },
              { t: '«Chiedi a Kenji di intercedere.»', f: '@b', r: [[0, 'Kenji? Lui la chiama nonna. Ci provo.']] }
            ]
          }
        }
      ],
      [
        [0, 'Le ho portato le mie polpette. Ha detto «troppo sale».', '@a'],
        [0, 'Poi me ne ha chieste altre tre. E mi ha dato la ricetta. Scritta a mano.', '@a'],
        [0, 'Kenji ha parlato con lei. Lei ha detto: «Solo se viene a cucinare da me la domenica».', '@b'],
        [0, 'Ora la domenica cucino con Nonna Rosa. La ricetta me la dice un pezzetto alla volta.', '@b'],
        [0, 'Stasera la cucino per mia madre, in videochiamata. Piangeremo insieme.']
      ]
    ],
    e: { a: 'ha conquistato la ricetta di Nonna Rosa con le sue polpette', b: 'cucina con Nonna Rosa ogni domenica' }
  },
  {
    id: 'personaggio',
    t: 'Dentro il romanzo',
    ok: r => arcDone('romanzo'),
    b: [
      [
        [0, 'Ho letto il libro del professore. «Il caffè sotto la pioggia».'],
        [0, "Al capitolo sette c'è un cliente che ordina sempre {item}."],
        [0, '...Io ordino sempre {item}.']
      ],
      [
        [0, 'Ne sono sicuro: il cliente del capitolo sette sono io.'],
        [0, 'Ha la mia sciarpa. E il mio modo di guardare fuori.'],
        {
          c: {
            q: '«Glielo chiedo, al professore?»',
            o: [
              {
                t: '«Chiediglielo. Gli farà piacere.»',
                f: '@a',
                r: [
                  [0, 'E se dice di no? Che figura...'],
                  [0, 'Va bene. Lo chiedo.']
                ]
              },
              { t: '«Non chiedere. Tieniti il mistero.»', f: '@b', r: [[0, 'Il mistero... Sì. È più bello.']] }
            ]
          }
        }
      ],
      [
        [0, 'Il professore ha detto: «Ovviamente è lei. Si è riconosciuto dalla sciarpa?»', '@a'],
        [0, 'Mi ha firmato la copia. «Al cliente del capitolo sette».', '@a'],
        [0, "Non l'ho chiesto. Ma ieri il professore mi ha guardato e ha sorriso.", '@b'],
        [0, "E nel nuovo capitolo il cliente del sette... trova l'amore. Che dice, è un segno?", '@b'],
        [0, 'Non ero mai stato un personaggio. È una bella sensazione.']
      ]
    ],
    e: {
      a: 'ha scoperto di essere un personaggio del romanzo del professore',
      b: 'ha tenuto il mistero del capitolo sette, e il professore gli ha scritto un lieto fine'
    }
  },
  {
    id: 'concerto',
    t: 'Il primo concerto',
    ok: r => arcDone('band'),
    b: [
      [
        [0, 'Ho sentito suonare quel gruppo, qui. Il chitarrista e quello delle pentole.'],
        [0, 'Da piccolo suonavo il violino. Poi ho smesso.'],
        [0, '*muove le dita sul tavolo, come sulle corde*']
      ],
      [
        [0, 'Luca mi ha chiesto se voglio fare un pezzo con loro. Con il violino.'],
        [0, 'Non suono da quindici anni.'],
        {
          c: {
            q: '«Accetto? E se sbaglio davanti a tutti?»',
            o: [
              { t: '«Accetta. Sbagliare qui è permesso.»', f: '@a', r: [[0, 'Permesso... Ok. Ripasso tutte le sere.']] },
              {
                t: '«Prima suona per noi, a locale vuoto.»',
                f: '@b',
                r: [[0, 'A locale vuoto. Solo per il barista e il gatto. Si può fare.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Ho sbagliato una nota. Tommy ha fatto una battuta. Hanno riso tutti. Anche io.', '@a'],
        [0, 'Ora sono il violinista ufficiale. Dice Luca.', '@a'],
        [0, 'Quella sera a locale vuoto il gatto non è scappato. Ho preso coraggio.', '@b'],
        [0, 'Poi ho suonato al concerto. Senza sbagliare. Quasi.', '@b'],
        [0, 'Ho ritrovato una cosa che avevo perso. Qui dentro.']
      ]
    ],
    e: { a: 'è diventato il violinista della band del bancone', b: 'ha ritrovato il violino, suonando prima solo per il gatto del locale' }
  },
  {
    id: 'giardino',
    t: 'Il giardino sul tetto',
    ok: r => true,
    b: [
      [
        [0, "Ho scoperto che il tetto del mio palazzo è libero. Pieno di sole, quando c'è."],
        [0, 'Voglio farci un orto. Pomodori, basilico, menta.'],
        [0, 'Non ho mai coltivato niente. Nemmeno un cactus.']
      ],
      [
        [0, 'I pomodori stanno morendo. Il basilico è già morto.'],
        [0, 'La menta invece ha invaso tutto. Anche il vaso del vicino.'],
        {
          c: {
            q: '«Mollo tutto o ci riprovo?»',
            o: [
              { t: '«Ci riprovi. Con la menta per il tè.»', f: '@a', r: [[0, 'Tè alla menta... Almeno qualcosa cresce.']] },
              { t: '«Chiedi aiuto ai vicini.»', f: '@b', r: [[0, 'Ai vicini? Non conosco nessuno. Ma ok.']] }
            ]
          }
        }
      ],
      [
        [0, 'Ti ho portato la menta. Ne ho tantissima. Fatti il tè, offre il tetto.', '@a'],
        [0, "I pomodori quest'anno sono venuti. Tre. Piccoli. Perfetti.", '@a'],
        [0, 'Ho bussato a tutte le porte. Adesso il tetto è di tutto il palazzo.', '@b'],
        [0, 'Domenica facciamo una cena lassù. Venti persone che non si conoscevano.', '@b'],
        [0, "Chi l'avrebbe detto. Una piantina di menta."]
      ]
    ],
    e: { a: 'ha fatto crescere un orto sul tetto, e regala menta a tutti', b: 'ha trasformato il tetto in un giardino di tutto il palazzo' }
  },
  {
    id: 'bici',
    t: 'Due ruote',
    ok: r => r.type !== 'nonno',
    b: [
      [
        [0, "Ho trent'anni e non so andare in bicicletta. Ecco, l'ho detto."],
        [0, 'Da bambino avevo paura. Poi è diventato tardi.'],
        [0, 'Ma la città è piena di bici. E io cammino sotto la pioggia.']
      ],
      [
        [0, "Ho comprato una bici. Usata. Rosa. Era l'unica."],
        [0, 'Sono caduto tre volte nel cortile. Il portiere ride.'],
        {
          c: {
            q: '«Come si fa a non avere paura di cadere?»',
            o: [
              { t: '«Si cade. E ci si rialza. Tutto qui.»', f: '@a', r: [[0, 'Tutto qui. Detto così sembra facile.']] },
              { t: '«Chiedi a qualcuno di tenerti il sellino.»', f: '@b', r: [[0, "A trent'anni? Che vergogna. ...Ok."]] }
            ]
          }
        }
      ],
      [
        [0, 'Sono venuto qui in bici! Senza cadere! Quasi.', '@a'],
        [0, 'Ho un livido enorme e sono felicissimo.', '@a'],
        [0, 'Mi ha tenuto il sellino un bambino di sei anni. Mi ha insegnato lui.', '@b'],
        [0, 'Ora pedaliamo insieme la domenica. Lui è più bravo.', '@b'],
        [0, 'La bici rosa è parcheggiata qui fuori. Bellissima.']
      ]
    ],
    e: { a: 'ha imparato ad andare in bici cadendo e rialzandosi', b: 'ha imparato ad andare in bici grazie a un bambino di sei anni' }
  },
  {
    id: 'giapponese',
    t: 'Lezioni di giapponese',
    ok: r => arcDone('tokyo') || arcDone('consegne'),
    b: [
      [
        [0, 'Sto imparando il giapponese. Tre parole al giorno.'],
        [0, 'Oggi: «ame». Vuol dire pioggia.'],
        [0, 'Mi sembra giusto iniziare da qui.']
      ],
      [
        [0, 'Kenji mi corregge la pronuncia. Ride come un matto.'],
        [0, 'Voglio andare a Tokyo in primavera. Da solo.'],
        {
          c: {
            q: '«Vado da solo o aspetto qualcuno?»',
            o: [
              { t: '«Vai. Le avventure non aspettano.»', f: '@a', r: [[0, 'Da solo. Con il dizionario e il coraggio.']] },
              {
                t: '«Chiedi a Marta e Gio di ospitarti.»',
                f: '@b',
                r: [
                  [0, 'Marta e Gio? Quelli delle cartoline? Mi conoscono appena!'],
                  [0, '...Ma Ugo dice che sono gentilissimi.']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Tokyo è enorme. Mi sono perso diciotto volte. Ogni volta qualcuno mi ha aiutato.', '@a'],
        [0, "Ho detto «ame» al tassista. Ha sorriso e ha aperto l'ombrello per me.", '@a'],
        [0, 'Marta e Gio mi hanno portato al caffè col gatto. Il gatto odia anche me.', '@b'],
        [0, 'Gio ha detto: «Allora sei dei nostri».', '@b'],
        [0, 'Ti ho portato un regalo. Una tazza col gatto. Ti odia anche lei.']
      ]
    ],
    e: { a: 'è andato a Tokyo da solo, perdendosi diciotto volte', b: 'è andato a Tokyo da Marta e Gio, e il gatto del caffè lo odia' }
  },
  {
    id: 'compleanno',
    t: 'La festa a sorpresa',
    ok: r => r.type !== 'nonno',
    b: [
      [
        [0, "Mia madre compie settant'anni. Voglio farle una festa a sorpresa."],
        [0, 'Qui. Le piacerebbe tantissimo. Lei ama la pioggia.'],
        [0, 'Ma è impossibile farle una sorpresa. Scopre sempre tutto.']
      ],
      [
        [0, 'Ha già scoperto tutto. Le ho detto che era per un collega.'],
        [0, 'Mi ha chiesto il nome del collega. Ho detto il primo che mi veniva: Gennaro.'],
        {
          c: {
            q: '«Ora devo inventarmi Gennaro. Aiuto!»',
            o: [
              {
                t: '«Gennaro esiste. Lo fa Tommy, il comico.»',
                f: '@a',
                r: [[0, 'Tommy che fa Gennaro? È perfetto. È terribile. È perfetto.']]
              },
              {
                t: "«Dille la verità. La sorpresa sarà un'altra.»",
                f: '@b',
                r: [[0, 'La verità... e la sorpresa vera la tengo per la festa. Sì.']]
              }
            ]
          }
        }
      ],
      [
        [0, "Tommy è venuto vestito da Gennaro. Ha parlato con mia madre per un'ora.", '@a'],
        [0, 'Lei ha capito tutto al secondo minuto. Ma ha retto il gioco. Ha pianto dal ridere.', '@a'],
        [0, 'Lo sapeva della festa. Ma non sapeva che sarebbe venuta sua sorella, dalla Sicilia.', '@b'],
        [0, "Non si vedevano da vent'anni. Si sono abbracciate qui, davanti alla vetrina.", '@b'],
        [0, "Settant'anni e la festa più bella della sua vita. Nel tuo locale."]
      ]
    ],
    e: { a: 'ha festeggiato la madre con Tommy travestito da Gennaro', b: "ha fatto ritrovare la madre e la zia dopo vent'anni" }
  },
  {
    id: 'temporali',
    t: 'Paura dei temporali',
    ok: r => r.tr.includes('timido') || r.type === 'lettore' || r.type === 'studente',
    b: [
      [
        [0, '*sobbalza a ogni tuono*'],
        [0, 'Scusa. Ho paura dei temporali. Da sempre.'],
        [0, 'Ridicolo, vero? In una città dove piove sempre.']
      ],
      [
        [0, "Stanotte c'era un temporale. Sono venuto qui. Mi sentivo meno solo."],
        [0, 'Qui la gente non ha paura. Mi tranquillizza.'],
        {
          c: {
            q: '«Come si smette di avere paura?»',
            o: [
              { t: '«Conta i secondi tra il lampo e il tuono.»', f: '@a', r: [[0, 'Contare... così so quanto è lontano. Ok.']] },
              { t: '«Non si smette. Si resta in buona compagnia.»', f: '@b', r: [[0, 'In buona compagnia. Allora vengo qui ogni volta.']] }
            ]
          }
        }
      ],
      [
        [0, 'Ieri ho contato fino a dieci. Il temporale era lontano. Ho sorriso!', '@a'],
        [0, 'Ora lo faccio sempre. Sono diventato un esperto di temporali.', '@a'],
        [0, "Durante l'ultimo temporale la signora del tavolo accanto mi ha raccontato di sua figlia.", '@b'],
        [0, 'Non ho sentito un solo tuono. Era troppo bella la storia.', '@b'],
        [0, "Ho ancora un po' paura. Ma solo un po'."]
      ]
    ],
    e: { a: 'ha vinto la paura dei temporali contando i secondi', b: 'ha scoperto che i temporali fanno meno paura in compagnia' }
  }
);
// vite dei personaggi chiave (hanno la precedenza sulle altre)
FILI.push(
  {
    id: 'k_mia',
    p: 1,
    t: 'La prima mostra',
    ok: r => r.key === 'mia',
    b: [
      [
        [0, 'Una galleria vuole i miei disegni. Tutti quelli fatti qui.'],
        [0, 'Duecento persone sconosciute, disegnate a questo tavolo.'],
        [0, 'E se si riconoscono e si arrabbiano?']
      ],
      [
        [0, 'Ho bisogno di un titolo per la mostra.'],
        {
          c: {
            q: 'Mia ti mostra due cartellini scritti a mano.',
            o: [
              { t: '«Clienti abituali.»', f: '@a', r: [[0, 'Clienti abituali... Sembra una cosa da bar. Perfetto.']] },
              { t: '«Chi entra quando piove.»', f: '@b', r: [[0, 'Chi entra quando piove. Mi vengono i brividi. Sì.']] }
            ]
          }
        }
      ],
      [
        [0, '«Clienti abituali». La gente leggeva il cartellino e rideva. Poi cercava la propria faccia.', '@a'],
        [0, '«Chi entra quando piove». Una signora ha pianto davanti al ritratto di suo marito.', '@b'],
        [0, 'Si sono riconosciuti tutti. Nessuno si è arrabbiato. Anzi.'],
        [0, 'Nonna Rosa ha comprato il suo ritratto. E quello di Kenji.'],
        [0, "Luca ha suonato all'inaugurazione. Doveva fare tre pezzi, ne ha fatti undici."],
        [0, "Il titolo è piaciuto tantissimo. Era un po' tuo."]
      ]
    ],
    e: { a: 'ha fatto la sua prima mostra: «Clienti abituali»', b: 'ha fatto la sua prima mostra: «Chi entra quando piove»' }
  },
  {
    id: 'k_luca',
    p: 1,
    t: "L'album",
    ok: r => r.key === 'luca',
    b: [
      [
        [0, 'Ci hanno proposto di registrare un album. Un album vero.'],
        [0, 'Ma vogliono che cambiamo le canzoni. Più «radiofoniche».'],
        [0, 'Non so neanche cosa voglia dire.']
      ],
      [
        [0, 'Il produttore vuole togliere «Tavolo vicino alla finestra». Dice che è troppo lenta.'],
        {
          c: {
            q: 'Luca ha gli occhi stanchi. «Cedo o rischio di perdere tutto?»',
            o: [
              {
                t: '«Quella canzone resta. Senza discussioni.»',
                f: '@a',
                r: [[0, 'Senza discussioni. Hai ragione. È il motivo per cui suono.']]
              },
              { t: '«Registrala da solo, qui, a locale chiuso.»', f: '@b', r: [[0, 'Qui... con il rumore della pioggia vera. Ci sto.']] }
            ]
          }
        }
      ],
      [
        [0, 'Il produttore ha ceduto. «Tavolo vicino alla finestra» è il primo singolo.', '@a'],
        [0, "La passano alla radio. Mia l'ha sentita in taxi e ha fatto fermare la macchina.", '@a'],
        [0, "L'ho registrata qui, a mezzanotte. Si sente la macchina del caffè e la pioggia.", '@b'],
        [0, "L'abbiamo messa in fondo all'album. Traccia nascosta. La preferita di tutti.", '@b'],
        [0, 'Ti ho messo nei ringraziamenti. «Al bancone».']
      ]
    ],
    e: { a: 'ha difeso la sua canzone, che è diventata il primo singolo', b: 'ha registrato la sua canzone al locale, con la pioggia vera' }
  },
  {
    id: 'k_kenji',
    p: 1,
    t: 'Il piatto nuovo',
    ok: r => r.key === 'kenji',
    b: [
      [
        [0, 'Voglio inventare un piatto nuovo. Tutto mio. Non di mia madre, non di nonna Rosa.'],
        [0, 'Ma ogni volta che provo, viene fuori il ramen.'],
        [0, "*fissa la tazza, cercando un'idea*"]
      ],
      [
        [0, 'Ho due idee. Tutte e due strane.'],
        {
          c: {
            q: '«Ramen al caffè o gnocchi giapponesi?»',
            o: [
              { t: '«Ramen al caffè. È folle.»', f: '@a', r: [[0, 'Folle. Come questo posto. Lo provo stanotte.']] },
              {
                t: '«Gnocchi giapponesi. Le tue due case.»',
                f: '@b',
                r: [[0, 'Le mie due case... Nonna Rosa e mia madre nello stesso piatto.']]
              }
            ]
          }
        }
      ],
      [
        [0, 'Il ramen al caffè... è terribile. Terribile!', '@a'],
        [0, "Ma Tommy l'ha assaggiato e ha detto che è il piatto più divertente del mondo. Lo teniamo come scherzo per gli amici.", '@a'],
        [0, 'Gli gnocchi giapponesi! Nonna Rosa ne ha mangiati due piatti. Ha pianto. Ha detto che era il fumo.', '@b'],
        [0, 'Li ho chiamati «Due nonne». Sono in menù da lunedì.', '@b'],
        [0, 'Ho capito una cosa: un piatto tuo nasce dalle persone che ami.']
      ]
    ],
    e: { a: 'ha inventato il ramen al caffè: un disastro bellissimo', b: 'ha inventato gli gnocchi «Due nonne»' }
  },
  {
    id: 'k_rosa',
    p: 1,
    t: 'Il telefonino',
    ok: r => r.key === 'rosa',
    b: [
      [
        [0, 'I nipoti mi hanno regalato un telefonino. Di quelli con lo schermo.'],
        [0, 'Ho chiamato Kenji sei volte per sbaglio. Con la guancia.'],
        [0, '*tiene il telefono lontanissimo dagli occhi*']
      ],
      [
        [0, 'Voglio imparare a fare le videochiamate. Per vedere i nipoti a Milano.'],
        {
          c: {
            q: 'Rosa ti porge il telefono. «Chi me lo insegna?»',
            o: [
              {
                t: '«Giada. È paziente e disegna anche le istruzioni.»',
                f: '@a',
                r: [[0, 'La nipote di Aldo? Che cara. Le porterò la torta.']]
              },
              { t: '«Kenji. Così lo vedi più spesso.»', f: '@b', r: [[0, 'Kenji! Così controllo anche se mangia. Due piccioni.']] }
            ]
          }
        }
      ],
      [
        [0, 'Giada mi ha fatto un libretto disegnato. Con le frecce e i gattini.', '@a'],
        [0, 'Ieri ho visto i nipoti. Avevano tutti la faccia sporca di cioccolato.', '@a'],
        [0, 'Kenji mi ha insegnato. Ora lo chiamo ogni sera in video.', '@b'],
        [0, 'Gli guardo il piatto. Se è vuoto, sono contenta.', '@b'],
        [0, 'Alla mia età, la tecnologia. Ma è solo un modo nuovo di voler bene.']
      ]
    ],
    e: { a: 'ha imparato le videochiamate grazie al libretto disegnato da Giada', b: 'controlla ogni sera in video che Kenji mangi' }
  },
  {
    id: 'k_tommy',
    p: 1,
    t: 'Il provino',
    ok: r => r.key === 'tommy',
    b: [
      [
        [0, 'Mi hanno chiamato per un provino. In televisione. TELEVISIONE.'],
        [0, 'Devo portare cinque minuti dei miei pezzi migliori.'],
        [0, 'Ho cinque minuti di pezzi. Totali.']
      ],
      [
        [0, 'Ho scritto due pezzi nuovi. Uno sul bar, uno su di me.'],
        {
          c: {
            q: '«Quale porto al provino?»',
            o: [
              {
                t: '«Quello su questo bar. È il tuo pubblico.»',
                f: '@a',
                r: [[0, 'Il gatto, il barista, il caffè finito... Sì. È casa.']]
              },
              { t: '«Quello su di te. È il più vero.»', f: '@b', r: [[0, 'Su di me... quello dove racconto che nessuno rideva mai. Ok.']] }
            ]
          }
        }
      ],
      [
        [0, "Ho fatto il pezzo sul bar. Il giudice ha chiesto l'indirizzo. Vuole venire!", '@a'],
        [0, 'Non mi hanno preso. Ma il giudice è diventato un cliente. È qui ogni sabato.', '@a'],
        [0, 'Ho raccontato di quando nessuno rideva. Poi ho detto: «Poi ho conosciuto Irene».', '@b'],
        [0, 'Hanno riso tutti. Mi hanno richiamato per la seconda puntata!', '@b'],
        [0, 'Qualunque cosa succeda, il mio palco preferito è il vostro.']
      ]
    ],
    e: {
      a: 'ha portato il bar al provino, e il giudice è diventato un cliente',
      b: 'ha raccontato se stesso al provino ed è passato alla seconda puntata'
    }
  },
  {
    id: 'k_vittoria',
    p: 1,
    t: 'Troppo lavoro',
    ok: r => r.key === 'vittoria',
    b: [
      [
        [0, 'Il mio locale va benissimo. Lavoro diciotto ore al giorno.'],
        [0, 'Non dormo. Non mangio. Non mi siedo mai. Tranne qui.'],
        [0, '*appoggia la testa sul tavolo, per un attimo*']
      ],
      [
        [0, 'Vogliono che apra un secondo locale. Più grande.'],
        {
          c: {
            q: 'Vittoria ti guarda, stanchissima. «Dico sì?»',
            o: [
              { t: '«Dì di no. Ti meriti di vivere.»', f: '@a', r: [[0, "No. Non l'ho mai detto. Proviamo."]] },
              { t: '«Dì sì, ma assumi qualcuno di cui fidarti.»', f: '@b', r: [[0, 'Fidarmi... è la cosa più difficile. Ci provo.']] }
            ]
          }
        }
      ],
      [
        [0, 'Ho detto di no. E ho preso un giorno libero alla settimana.', '@a'],
        [0, 'Il mercoledì vado al mare. Anche se piove. Soprattutto se piove.', '@a'],
        [0, 'Ho aperto il secondo locale. Ma lo gestisce una ragazza bravissima.', '@b'],
        [0, "È una che ha lavorato qui, da voi. Me l'avete insegnata voi, la fiducia.", '@b'],
        [0, 'Adesso ordino il caffè e lo bevo seduta. Rivoluzionario.']
      ]
    ],
    e: { a: 'ha detto di no a un secondo locale, e ora si riposa il mercoledì', b: 'ha aperto un secondo locale, imparando a fidarsi' }
  },
  {
    id: 'k_ugo',
    p: 1,
    t: 'La lettera mai consegnata',
    ok: r => r.key === 'ugo',
    b: [
      [
        [0, "In trent'anni ho consegnato tutte le lettere. Tutte tranne una."],
        [0, 'Nel 1998. Indirizzo sbagliato, nessun mittente.'],
        [0, "Ce l'ho ancora. Non sono mai riuscito a buttarla."]
      ],
      [
        [0, 'Ho trovato un indizio. La calligrafia è la stessa di un biglietto sul muro delle cartoline.'],
        {
          c: {
            q: '«La apro, per capire a chi era?»',
            o: [
              { t: "«No. Cerca chi l'ha scritta.»", f: '@a', r: [[0, 'Hai ragione. Un postino non apre le lettere. Mai.']] },
              {
                t: '«Mostrala al professore. Lui legge le persone.»',
                f: '@b',
                r: [[0, 'Il professore! Lui capisce le storie dalle virgole.']]
              }
            ]
          }
        }
      ],
      [
        [0, "L'ha scritta la signora del quarto piano, quella col cane bianco. A un ragazzo partito per l'America.", '@a'],
        [0, "Gliel'ho riportata. Ha riso e pianto. «Ormai siamo sposati da vent'anni», ha detto. «Si chiamava ritorno».", '@a'],
        [0, 'Il professore ha guardato la busta e ha detto: «È di Nonna Rosa. Riconosco quelle R».', '@b'],
        [0, "Rosa l'aveva scritta a un pasticcere. Mai spedita, poi persa. «Meglio così», ha detto. «Era il pasticcere sbagliato».", '@b'],
        [0, 'Adesso le ho consegnate tutte. Posso andare in pensione davvero.']
      ]
    ],
    e: {
      a: 'ha consegnato la sua ultima lettera, dopo venticinque anni',
      b: "ha scoperto che l'ultima lettera mai consegnata era di Nonna Rosa"
    }
  },
  {
    id: 'k_sara',
    p: 1,
    t: 'Le ferie',
    ok: r => r.key === 'sara',
    b: [
      [
        [0, 'Il reparto mi obbliga a prendere le ferie. Tre settimane.'],
        [0, 'Non faccio ferie da sei anni. Non so cosa si fa.'],
        [0, '*fissa il calendario come se fosse un paziente grave*']
      ],
      [
        [0, 'Ho due idee per le ferie. Una è il mare.'],
        [0, "L'altra è restare in città e dormire. Solo dormire."],
        {
          c: {
            q: '«Cosa faccio?»',
            o: [
              { t: '«Il mare. Da sola, con un libro.»', f: '@a', r: [[0, 'Il libro del professore. Lo rileggo sulla sabbia.']] },
              {
                t: '«Resta. E vieni qui ogni giorno di giorno, per una volta.»',
                f: '@b',
                r: [[0, "Di giorno! Non l'ho mai visto di giorno, questo posto."]]
              }
            ]
          }
        }
      ],
      [
        [0, 'Sono stata al mare. Ho dormito sulla sabbia dodici ore.', '@a'],
        [0, 'Un bagnino mi ha chiesto se stavo bene. Gli ho misurato la pressione per abitudine.', '@a'],
        [0, 'Di giorno qui è tutto diverso. Ci sono i nonni, gli studenti, il sole.', '@b'],
        [0, 'Ho visto il gatto sveglio, per la prima volta. Ha gli occhi gialli!', '@b'],
        [0, 'Torno in reparto riposata. Pietro ha già fatto tre errori senza di me. Mi sono mancati.']
      ]
    ],
    e: { a: 'ha fatto le prime ferie in sei anni, al mare', b: 'ha scoperto il locale di giorno, durante le ferie' }
  },
  {
    id: 'k_giada',
    p: 1,
    t: "L'accademia",
    ok: r => r.key === 'giada',
    b: [
      [
        [0, "C'è un concorso per l'accademia di belle arti. Serve un portfolio."],
        [0, 'Ho solo disegni fatti qui. Del nonno, della pioggia, dei clienti.'],
        [0, 'Non so se bastano.']
      ],
      [
        [0, 'Ho preparato tutto. Ma il nonno vuole che studi legge, come suo fratello.'],
        {
          c: {
            q: 'Giada stringe la cartellina. «Glielo dico, del concorso?»',
            o: [
              { t: '«Diglielo. Il nonno ti capirà.»', f: '@a', r: [[0, 'Hai ragione. Il nonno capisce tutto. Prima o poi.']] },
              { t: '«Fai il concorso. Gli dirai dopo.»', f: '@b', r: [[0, 'Una sorpresa... Il nonno odia le sorprese. Ma ok.']] }
            ]
          }
        }
      ],
      [
        [0, "Gliel'ho detto. Ha guardato i disegni per un'ora. Poi ha detto: «Anche Lidia disegnava».", '@a'],
        [0, 'Mi ha accompagnato al concorso. Ha aspettato fuori quattro ore. Sono entrata!', '@a'],
        [0, "Sono entrata all'accademia! L'ho detto al nonno solo dopo.", '@b'],
        [0, 'Si è arrabbiato tre secondi. Poi mi ha regalato la scatola di matite della nonna.', '@b'],
        [0, "Il primo disegno dell'accademia sarà questo locale."]
      ]
    ],
    e: {
      a: "è entrata all'accademia di belle arti, col nonno che aspettava fuori",
      b: "è entrata all'accademia e ha ricevuto le matite della nonna"
    }
  }
);
/* ----- vite a due: coppie, amici, rivali, famiglie ----- */
const FILI2 = [
  {
    id: 'casa',
    t: 'Una casa per due',
    k: ['coppia', 'fidanzati'],
    b: [
      [
        [0, 'Ho visto un appartamento. Due stanze, un balcone, vista sui tetti.'],
        [1, 'E il tuo?'],
        [0, 'Il mio ha la muffa. E il tuo ha il vicino col trombone.'],
        [1, '...Stai dicendo quello che penso?']
      ],
      [
        [1, 'Abbiamo un problema. Tu vuoi il balcone, io voglio la vasca.'],
        [0, 'La vasca è inutile. Il balcone è vita.'],
        {
          c: {
            q: '{A} e {B} si girano verso il bancone: «Decidi tu. Balcone o vasca?»',
            o: [
              {
                t: '«Il balcone. Per guardare la pioggia.»',
                f: '@a',
                r: [
                  [0, 'HA! Il barista ha parlato.'],
                  [1, 'Va bene. Ma la doccia la scelgo io.']
                ]
              },
              {
                t: '«La vasca. Per scaldarsi dopo la pioggia.»',
                f: '@b',
                r: [
                  [1, 'Visto? Lo sa anche il barista.'],
                  [0, 'Va bene. Ma ci metto le piante, nel bagno.']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Abbiamo messo due sedie sul balcone. Guardiamo i tetti sotto la pioggia.', '@a'],
        [1, 'E litighiamo su chi prepara il caffè. Nessuno dei due lo fa bene come qui.', '@a'],
        [1, 'La vasca è il posto più bello della casa. Ci leggo per ore.', '@b'],
        [0, "Io ci ho messo le piante. Adesso sembra una giungla con l'acqua calda.", '@b'],
        [0, 'Casa nostra. Che parole strane.'],
        [1, 'Strane e belle.']
      ]
    ],
    e: { a: 'sono andati a vivere insieme, in una casa col balcone', b: 'sono andati a vivere insieme, in una casa con la vasca' }
  },
  {
    id: 'gattino',
    t: 'Il gattino',
    k: ['coppia', 'fidanzati', 'sposati'],
    b: [
      [
        [0, 'Hai visto i gatti del canile? Sul sito di Nora.'],
        [1, 'Ne ho visti trentadue. Li ho guardati tutti. Due volte.'],
        [0, "Ce n'è uno arancione con un orecchio piegato."],
        [1, 'Lo sapevo. Lo sapevo che avresti scelto quello.']
      ],
      [
        [1, 'Siamo andati a vederlo. Mi ha morso.'],
        [0, 'Era affetto.'],
        [1, 'Era un morso.'],
        {
          c: {
            q: '{A} ti guarda supplicante. {B} si massaggia la mano. «Lo prendiamo?»',
            o: [
              {
                t: '«Prendetelo. Chi morde, ama.»',
                f: '@a',
                r: [
                  [0, 'Visto?!'],
                  [1, '...Va bene. Ma se mi morde ancora, dorme con te.']
                ]
              },
              {
                t: '«Prendetene due. Così si mordono tra loro.»',
                f: '@b',
                r: [
                  [1, 'DUE?'],
                  [0, 'Il barista è un genio.']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Si chiama Ciambella. Dorme in mezzo a noi due. Ogni notte.', '@a'],
        [1, 'Mi morde ancora. Ogni mattina. Credo sia il suo modo di dire buongiorno.', '@a'],
        [1, 'Si chiamano Zucchero e Cannella. Si mordono tra loro, come avevi detto.', '@b'],
        [0, 'E noi due finalmente dormiamo in pace. A volte.', '@b'],
        [0, 'Grazie. La nostra casa adesso fa le fusa.']
      ]
    ],
    e: { a: 'hanno adottato un gattino arancione che morde', b: 'hanno adottato due gattini che si mordono tra loro' }
  },
  {
    id: 'promessa',
    t: 'La promessa',
    k: ['fidanzati'],
    b: [
      [
        [0, 'Abbiamo deciso la data. Ma non il posto.'],
        [1, 'Io vorrei una chiesa piccola, in montagna.'],
        [0, 'Io vorrei... qui. Dove ci siamo conosciuti.']
      ],
      [
        [1, 'Abbiamo litigato tutta la settimana. Montagna o bar.'],
        [0, 'Mia madre dice montagna. Tua madre dice bar.'],
        {
          c: {
            q: '«Diccelo tu, una volta per tutte. Dove ci sposiamo?»',
            o: [
              {
                t: '«Qui. Vi presto il locale per una sera.»',
                f: '@a',
                r: [
                  [0, 'DAVVERO?'],
                  [1, '...Ok. Ok! Mia madre sverrà.']
                ]
              },
              {
                t: '«In montagna. Ma la torta la facciamo noi.»',
                f: '@b',
                r: [
                  [1, 'La torta del bar in montagna! Perfetto.'],
                  [0, 'Va bene. Ma la prima notte di nozze passiamo di qui per un caffè.']
                ]
              }
            ]
          }
        }
      ],
      [
        [0, 'Il locale pieno di fiori. Il gatto col fiocco. Il barista commosso.', '@a'],
        [1, 'E tutti i clienti in piedi ad applaudire. Anche quelli che non conoscevamo.', '@a'],
        [1, 'La chiesa in montagna, la neve, e la vostra torta nel portabagagli.', '@b'],
        [0, 'Due ore di curve. È arrivata intera. È un miracolo.', '@b'],
        [0, 'Siamo sposati. Che parola enorme.'],
        [1, 'Mettiamola nel caffè. Con due cucchiaini.']
      ]
    ],
    e: { a: 'si sono sposati nel locale, tra i fiori e gli applausi', b: 'si sono sposati in montagna, con la torta del locale' },
    fx: 'sposati'
  },
  {
    id: 'biglietto',
    t: 'Il biglietto',
    k: ['cotta'],
    b: [
      [
        [0, '*scrive qualcosa su un tovagliolo, lo cancella, lo riscrive*'],
        [1, 'Cosa scrivi?'],
        [0, 'Niente! La lista della spesa.'],
        [1, 'Con i cuoricini?']
      ],
      [
        [0, 'Ho scritto un biglietto. Per te. Ma non riesco a dartelo.'],
        [1, 'Sono qui. Davanti a te.'],
        [0, 'Appunto. È il posto più difficile del mondo.'],
        {
          c: {
            q: '{A} stringe il tovagliolo. {B} aspetta. Ti guardano entrambi.',
            o: [
              {
                t: '«Leggilo ad alta voce. Adesso.»',
                f: '@a',
                r: [
                  [0, '«Ogni volta che entri, la pioggia smette di fare rumore».'],
                  [1, '...'],
                  [1, 'Scrivimene un altro. Domani.']
                ]
              },
              {
                t: '«Lascialo sul tavolo e vai a prendere un caffè.»',
                f: '@b',
                r: [
                  [0, '*appoggia il tovagliolo e scappa al bancone*'],
                  [1, '*lo legge. Arrossisce fino alle orecchie*']
                ]
              }
            ]
          }
        }
      ],
      [
        [1, 'Ho tenuto il tovagliolo. È nel mio portafoglio.'],
        [0, 'Davvero?'],
        [1, 'Ti va di uscire? Non per un caffè. Per una cena vera.', '@a'],
        [0, 'Una cena vera! Mi metto la camicia.', '@a'],
        [1, "La risposta l'ho scritta anch'io. Su un tovagliolo. Tieni.", '@b'],
        [0, '«Sì»... con tre punti esclamativi.', '@b']
      ]
    ],
    e: { a: 'si sono dichiarati con un biglietto letto ad alta voce', b: 'si sono dichiarati con due tovaglioli' },
    fx: 'coppia'
  },
  {
    id: 'tatuaggio',
    t: 'Il tatuaggio',
    k: ['amici', 'migliori'],
    b: [
      [
        [0, 'Facciamo un tatuaggio uguale. Per la nostra amicizia.'],
        [1, 'Tu hai paura degli aghi.'],
        [0, 'Ho paura di tutto. Ma questo lo voglio.']
      ],
      [
        [1, 'Ho prenotato. Sabato alle cinque.'],
        [0, 'Ma cosa ci tatuiamo?'],
        {
          c: {
            q: '«Decidi tu. Ci fidiamo.»',
            o: [
              { t: '«Una tazzina. Piccola.»', f: '@a', r: [[0, 'Una tazzina. Per tutti i caffè presi insieme.']] },
              { t: '«Una goccia di pioggia.»', f: '@b', r: [[1, 'Una goccia. Il giorno che ci siamo conosciuti pioveva.']] }
            ]
          }
        }
      ],
      [
        [0, 'Guarda! Una tazzina sul polso. Sono svenuto solo una volta.', '@a'],
        [1, 'Due. Sei svenuto due volte. Io ho le foto.', '@a'],
        [1, "La goccia è venuta benissimo. La sua è un po' storta.", '@b'],
        [0, 'È storta perché ho riso. Mi hai fatto ridere apposta.', '@b'],
        [0, "Ora siamo amici per sempre. Ufficialmente. Con l'inchiostro."]
      ]
    ],
    e: { a: 'si sono tatuati due tazzine uguali', b: 'si sono tatuati due gocce di pioggia' }
  },
  {
    id: 'bancarella',
    t: 'La bancarella',
    k: ['amici', 'migliori'],
    b: [
      [
        [0, "Ho un'idea. Una bancarella al mercato della domenica."],
        [1, 'Di cosa?'],
        [0, 'Non lo so ancora. Ma insieme. Tu sei bravo a parlare, io a fare cose.']
      ],
      [
        [1, 'Ho fatto i conti. Possiamo vendere solo una cosa.'],
        {
          c: {
            q: '«Biscotti fatti in casa o piante in vaso?»',
            o: [
              { t: '«Biscotti. Con la ricetta di qualcuno qui.»', f: '@a', r: [[0, 'Nonna Rosa! Glielo chiediamo con tanta gentilezza.']] },
              {
                t: '«Piante. Tutte con un nome scritto sul vaso.»',
                f: '@b',
                r: [[1, 'Piante con un nome... La gente si affeziona. Geniale.']]
              }
            ]
          }
        }
      ],
      [
        [0, "I biscotti sono finiti in un'ora. Nonna Rosa vuole il venti per cento.", '@a'],
        [1, 'Le abbiamo dato il trenta. Ci ha fatto paura.', '@a'],
        [1, 'Abbiamo venduto «Gustavo» il cactus a un bambino. Ha pianto di gioia.', '@b'],
        [0, 'Ogni domenica la gente torna a dirci come stanno le piante. Come parenti.', '@b'],
        [0, 'Siamo soci. Che bella parola, detta da amici.']
      ]
    ],
    e: { a: 'hanno aperto una bancarella di biscotti al mercato', b: 'hanno aperto una bancarella di piante con un nome' }
  },
  {
    id: 'litigio',
    t: 'Il litigio',
    k: ['amici', 'migliori'],
    b: [
      [
        [0, '...'],
        [1, '...'],
        [0, 'Non mi hai restituito il libro. Da sei mesi.'],
        [1, 'E tu non mi hai mai chiesto scusa per il compleanno.'],
        [0, 'Quale compleanno?'],
        [1, 'APPUNTO.']
      ],
      [
        [0, "*si siede lontano, ma guarda verso l'altro tavolo*"],
        [1, '*fa finta di leggere il menù da dieci minuti*'],
        {
          c: {
            q: 'Si guardano di nascosto, tutti e due. Poi guardano te.',
            o: [
              {
                t: 'Porta due caffè allo stesso tavolo',
                f: '@a',
                r: [
                  [1, '...Non li ho ordinati.'],
                  [0, 'Nemmeno io. Ma visto che ci sono...']
                ]
              },
              {
                t: "«Ognuno dica una cosa bella dell'altro.»",
                f: '@b',
                r: [
                  [0, 'Una cosa bella? Ehm... ride in un modo stupido. Stupido bello.'],
                  [1, 'E lui ricorda sempre come prendo il caffè. Sempre.']
                ]
              }
            ]
          }
        }
      ],
      [
        [1, 'Ti ho portato il libro. Con dentro un biglietto.'],
        [0, 'E io ti ho portato un regalo. In ritardo di sei mesi.'],
        [1, 'Quei due caffè, quel giorno... sono stati il miglior regalo.', '@a'],
        [0, 'Due caffè e una tregua. Il barista sa il fatto suo.', '@a'],
        [0, 'Ripensavo a quella cosa bella che hai detto. Ridi davvero in modo stupido.', '@b'],
        [1, 'Stupido bello. Hai detto stupido bello.', '@b']
      ]
    ],
    e: { a: 'hanno fatto pace davanti a due caffè non ordinati', b: 'hanno fatto pace dicendosi una cosa bella' }
  },
  {
    id: 'gara',
    t: 'La gara delle torte',
    k: ['rivali'],
    b: [
      [
        [0, 'La mia torta di mele è la migliore del quartiere.'],
        [1, 'La mia è la migliore della città.'],
        [0, 'Allora gara. Sabato. Qui.'],
        [1, 'Ci sto. Porta i fazzoletti.']
      ],
      [
        [0, '*appoggia una torta enorme sul tavolo*'],
        [1, '*appoggia una torta ancora più enorme*'],
        {
          c: {
            q: 'Due torte, due forchette, tutti ti guardano. «Chi ha vinto?»',
            o: [
              {
                t: '«{A}. Ma per un soffio.»',
                f: '@a',
                r: [
                  [1, 'Per un soffio?! Voglio la rivincita!'],
                  [0, '*sorride, per la prima volta senza cattiveria*']
                ]
              },
              {
                t: '«Pareggio. Fatene una insieme.»',
                f: '@b',
                r: [
                  [0, 'Insieme? Con lui?'],
                  [1, 'Con lei? ...Sabato prossimo. Porto io le mele.']
                ]
              }
            ]
          }
        }
      ],
      [
        [1, 'Ho perso la gara. Ma ho chiesto la tua ricetta.', '@a'],
        [0, "Te l'ho data. Con un errore apposta. Poi ti ho detto quale.", '@a'],
        [0, 'La torta fatta insieme è venuta... strana.', '@b'],
        [1, 'Strana e buonissima. Come noi due.', '@b'],
        [0, 'Non sei così male, sai?'],
        [1, 'Neanche tu. Non dirlo a nessuno.']
      ]
    ],
    e: { a: 'si sono sfidati con le torte, e il perdente ha chiesto la ricetta', b: 'hanno pareggiato la gara e fatto una torta insieme' },
    fx: 'amici'
  },
  {
    id: 'album',
    t: "L'album di famiglia",
    k: ['famiglia'],
    b: [
      [
        [0, 'Ho trovato un album di fotografie. Vecchio, con la copertina di velluto.'],
        [1, 'Fammi vedere! Chi è questa?'],
        [0, 'Questa è... non me lo ricordo più.']
      ],
      [
        [1, "Ho portato l'album. Mancano tante foto, ci sono solo gli angoli."],
        [0, 'Le abbiamo perse in un trasloco. Tanti anni fa.'],
        {
          c: {
            q: '«Come lo riempiamo, adesso?»',
            o: [
              { t: '«Con foto nuove. Fatte qui.»', f: '@a', r: [[1, 'Foto nuove! Una ogni volta che veniamo.']] },
              { t: '«Con disegni dei ricordi.»', f: '@b', r: [[0, 'Disegni... tu racconti, io disegno. O tu disegni e io racconto.']] }
            ]
          }
        }
      ],
      [
        [0, "L'album è pieno di foto fatte a questo tavolo.", '@a'],
        [1, "In ognuna c'è una tazza diversa. Le abbiamo contate: quarantadue.", '@a'],
        [1, 'Abbiamo disegnato tutti i ricordi che mancavano. Alcuni li abbiamo inventati.', '@b'],
        [0, 'Quelli inventati sono i più veri, sai?', '@b'],
        [0, 'Un album nuovo, per una famiglia vecchia.'],
        [1, 'Per una famiglia che continua.']
      ]
    ],
    e: { a: 'hanno riempito un vecchio album con foto fatte al locale', b: 'hanno riempito un vecchio album con disegni dei ricordi' }
  }
];
