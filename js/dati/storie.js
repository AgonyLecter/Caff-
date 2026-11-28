// Le storie principali (ARCS) e il testo del filmato iniziale.

const ARCS = [
  {
    id: 'pioggia',
    t: 'Pioggia condivisa',
    d: "Un'illustratrice e uno studente di musica, lo stesso tavolo per caso.",
    who: ['mia', 'luca'],
    perk: 'finestra',
    pt: 'Le coppie lasciano mance più alte',
    ch: [
      {
        t: 'Posto libero?',
        r: 0,
        l: [
          [1, 'Scusa... è libero? Fuori diluvia.'],
          [0, 'Certo. Attento al quaderno.'],
          [1, 'Disegni la città?'],
          [0, 'Disegno le persone che entrano qui.'],
          [1, 'Anche me?'],
          [0, '...Forse.']
        ]
      },
      {
        t: 'Lo schizzo',
        r: 9,
        l: [
          [0, 'Ti ho disegnato. Con le cuffie.'],
          [1, 'Sembro più figo che dal vero.'],
          [0, "Ho barato un po'."],
          [1, 'Allora ti scrivo una canzone.'],
          [1, "E baro anch'io."],
          {
            c: {
              q: 'Mia si alza per pagare. Luca ti lancia uno sguardo disperato: «Che faccio?»',
              o: [
                {
                  t: '«Chiedile di uscire. Adesso.»',
                  f: 'pioggia=adesso',
                  r: [
                    [1, 'Mia! Aspetta. Sabato... ti va un caffè? Non qui. Cioè, anche qui.'],
                    [0, '*ride* Sabato. Qui. Alle cinque.']
                  ]
                },
                {
                  t: '«Prima finisci quella canzone.»',
                  f: 'pioggia=canzone',
                  r: [
                    [1, '*apre il quaderno e scrive un titolo*'],
                    [1, '«Tavolo vicino alla finestra». Ci lavoro stanotte.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'La canzone',
        r: 24,
        l: [
          [0, 'Sabato è stato bellissimo. Anche se hai rovesciato lo zucchero ovunque.', 'pioggia=adesso'],
          [1, 'Ero nervoso. Ma stanotte ho finito una cosa.', 'pioggia=adesso'],
          [1, 'Ci ho messo tre notti. Ma ho finito una cosa.', 'pioggia=canzone'],
          [0, 'Tre notti per me?', 'pioggia=canzone'],
          [1, "L'ho finita. Si chiama «Tavolo vicino alla finestra»."],
          [0, 'Fammela sentire.'],
          [1, '*le passa un auricolare*'],
          [0, '...è bellissima.'],
          [1, 'Sabato suono in un locale. Vieni?'],
          [0, 'Solo se dopo torniamo qui.']
        ]
      },
      {
        t: 'Un anno dopo',
        r: 46,
        l: [
          [0, 'Un anno fa ti ho detto «attento al quaderno».'],
          [1, 'E io ci ho rovesciato sopra il caffè.'],
          [0, 'Il disastro più bello della mia vita.'],
          [1, "Stesso tavolo l'anno prossimo?"],
          [0, 'Stesso tavolo per sempre.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Il solito?'],
        [1, 'Il solito. E il solito tavolo.']
      ],
      [
        [1, '*canticchia*'],
        [0, '*lo disegna mentre canticchia*']
      ],
      [
        [0, 'Piove ancora.'],
        [1, 'Meglio. Restiamo di più.']
      ]
    ]
  },
  {
    id: 'valigie',
    t: 'Valigie',
    d: "Marta e Gio, e un lavoro dall'altra parte del mondo.",
    who: ['marta', 'gio'],
    perk: 'valigie',
    pt: 'Una cartolina da Tokyo in vetrina (+2 Atmosfera)',
    end: {
      'valigie=vai': { n: 'Insieme a Tokyo', perk: 'valigie', pt: 'Una cartolina da Tokyo in vetrina (+2 Atmosfera)' },
      'valigie=resta': { n: 'Un anno di calendario', perk: 'calendario', pt: 'Il calendario di Gio dietro il bancone (+3 Atmosfera)' }
    },
    ch: [
      {
        t: 'Il litigio',
        r: 5,
        l: [
          [0, 'Mi hanno offerto il lavoro. A Tokyo.'],
          [1, "E me lo dici così? Tra un cappuccino e l'altro?"],
          [0, 'Te lo sto dicendo adesso!'],
          [1, 'Io qui ho tutto, Marta.'],
          [0, "Anch'io. Per questo è difficile."],
          [1, "...Vado a prendere un'altra cosa."]
        ]
      },
      {
        t: 'Tu cosa faresti?',
        r: 18,
        l: [
          [1, '...'],
          [0, '...'],
          [0, '*si gira verso il bancone*'],
          [0, 'Scusa. Tu cosa faresti, al posto nostro?'],
          {
            c: {
              q: 'Marta ti guarda, Gio fa finta di niente. Cosa rispondi?',
              o: [
                {
                  t: '«Partirei. Insieme.»',
                  f: 'valigie=vai',
                  r: [
                    [1, '...Insieme. Detto così sembra facile.'],
                    [0, 'Forse lo è.']
                  ]
                },
                {
                  t: '«Resterei. Ma la aspetterei.»',
                  f: 'valigie=resta',
                  r: [
                    [1, 'Aspettare. Ci ho pensato anche io.'],
                    [0, 'Un anno solo, Gio. Un anno.']
                  ]
                }
              ]
            }
          },
          [1, "Stanotte ho cercato «caffè a Tokyo». Ce n'è uno con un gatto."],
          [0, '*sorride per la prima volta*']
        ]
      },
      {
        t: 'Due biglietti',
        r: 38,
        l: [
          [0, 'Allora?'],
          [1, 'Due biglietti. Ho chiesto il trasferimento.', 'valigie=vai'],
          [0, 'Gio... sei sicuro?', 'valigie=vai'],
          [1, 'No. Ma sono sicuro di te.', 'valigie=vai'],
          [1, 'Un biglietto. E un calendario.', 'valigie=resta'],
          [1, 'Ci ho segnato tutti i giorni fino al tuo ritorno.', 'valigie=resta'],
          [0, 'Sono tantissimi.', 'valigie=resta'],
          [1, 'Ognuno con un caffè qui. Te li conto io.', 'valigie=resta'],
          [0, 'Promettimi che torniamo qui ogni Natale.', 'valigie=vai'],
          [1, 'Promesso. Magari ci fanno lo sconto.', 'valigie=vai'],
          [0, 'Promettimi che non smetti di venire qui.', 'valigie=resta'],
          [1, 'Ogni mattina. Così quando torni il barista sa già tutto.', 'valigie=resta']
        ]
      }
    ],
    rt: [
      [
        [0, 'Ultimo caffè prima del volo.'],
        [1, 'Ultimo per ora.']
      ],
      [
        [1, 'Lì il cappuccino costa il triplo.'],
        [0, 'Allora ne prendiamo due qui.']
      ]
    ]
  },
  {
    id: 'romanzo',
    t: 'Il romanzo',
    d: 'Un vecchio professore scrive ogni notte allo stesso tavolo.',
    who: ['bruni'],
    perk: 'libro',
    pt: 'Il libro sul bancone (+5 Atmosfera)',
    ch: [
      {
        t: 'Pagina bianca',
        r: 0,
        l: [
          [0, 'Capitolo uno...'],
          [0, 'No.'],
          [0, '*cancella*'],
          [0, 'Capitolo uno. Pioveva.'],
          [0, '...Molto meglio.']
        ]
      },
      {
        t: 'Un personaggio',
        r: 12,
        l: [
          [0, 'Mi serve un personaggio che non dorme mai.'],
          [0, '*guarda verso il bancone*'],
          {
            c: {
              q: 'Il professore ti indica con la penna. «Lei. Posso metterla nel romanzo?»',
              o: [
                {
                  t: '«Solo se mi fa simpatico.»',
                  f: 'romanzo=eroe',
                  r: [[0, 'Simpatico, insonne e con un ottimo espresso. Affare fatto.']]
                },
                {
                  t: '«Preferisco restare dietro al bancone.»',
                  f: 'romanzo=quinte',
                  r: [[0, 'Il personaggio che non si vede mai, ma tiene in piedi la storia. Ancora meglio.']]
                }
              ]
            }
          },
          [0, 'Perfetto.']
        ]
      },
      {
        t: "L'infermiera",
        r: 28,
        who: ['bruni', 'sara'],
        l: [
          [1, 'Scusi... sta scrivendo di noi clienti?'],
          [0, 'Colpito. Lei chi sarebbe, nel romanzo?'],
          [1, 'Quella che arriva alle tre di notte, dopo il turno.'],
          [0, "L'eroina, allora."],
          [1, 'Mi metta almeno un lieto fine.']
        ]
      },
      {
        t: 'Pubblicato',
        r: 52,
        who: ['bruni', 'sara'],
        l: [
          [0, 'È uscito. «Il caffè sotto la pioggia».'],
          [1, "C'è il mio lieto fine?"],
          [0, 'Legga la dedica.'],
          [1, '«A chi resta sveglio, e a chi gli fa il caffè.»'],
          [0, "Il barista del romanzo, tra l'altro, è il personaggio preferito dei lettori.", 'romanzo=eroe'],
          [1, 'Lo sapevo. Ha le battute migliori.', 'romanzo=eroe'],
          [0, "Nel libro c'è qualcuno che non compare mai. Ma senza di lui non succederebbe niente.", 'romanzo=quinte'],
          [1, '*guarda verso il bancone e sorride*', 'romanzo=quinte'],
          [0, 'Una copia la lascio sul bancone.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Sto scrivendo il seguito.'],
        [1, 'Stavolta voglio un cane.']
      ],
      [
        [1, 'Turno lunghissimo.'],
        [0, 'Allora le leggo un capitolo.']
      ]
    ]
  },
  {
    id: 'consegne',
    t: 'Consegne',
    d: 'Kenji porta cibo a tutta la città. Sogna di cucinarlo.',
    who: ['kenji'],
    perk: 'ramen',
    pt: 'Ricetta di Nonna Rosa: il ramen vale il 50% in più',
    end: {
      'consegne=qui': { n: 'Ai nostri fornelli', perk: 'ramen', pt: 'Kenji cucina da te: il ramen vale il 50% in più' },
      'consegne=suo': { n: 'Ramen di Nonna Rosa', perk: 'kenjiShop', pt: 'Il locale di Kenji ti manda clienti: +25% clienti la sera' }
    },
    ch: [
      {
        t: 'Fradicio',
        r: 7,
        l: [
          [0, 'Ultima consegna... e sono zuppo.'],
          [0, 'Due minuti di caffè caldo. Me li merito.'],
          [0, 'Questo posto profuma di casa.']
        ]
      },
      {
        t: 'La signora Rosa',
        r: 26,
        who: ['kenji', 'rosa'],
        l: [
          [1, 'Ragazzo, sei tutto bagnato. Mangia qualcosa.'],
          [0, 'Grazie signora... un giorno vorrei aprire un posto mio.'],
          [1, 'E cosa cucineresti?'],
          [0, 'Il ramen di mia madre.'],
          [1, 'Allora portamelo. Ti dirò se è buono.']
        ]
      },
      {
        t: 'Il verdetto',
        r: 48,
        who: ['kenji', 'rosa'],
        l: [
          [0, 'Eccolo. Il ramen.'],
          [1, '*assaggia in silenzio*'],
          [1, '...Troppo sale.'],
          [0, 'Oh.'],
          [1, 'Scherzo. Piangerei, se non fossi così vecchia.'],
          [0, 'Posso chiamarlo «Ramen di Nonna Rosa»?'],
          [1, 'Solo se il primo lo offri a me.'],
          {
            c: {
              q: 'Kenji si gira verso di te, il mestolo ancora in mano. «E adesso... dove lo cucino?»',
              o: [
                {
                  t: '«Qui, nella nostra cucina.»',
                  f: 'consegne=qui',
                  r: [
                    [0, 'Qui? Davvero? Con il grembiule e tutto?'],
                    [1, 'Ti presto il mio. Ha visto più brodo di te.'],
                    [0, 'Allora domani niente consegne. Domani si cucina.']
                  ]
                },
                {
                  t: '«Nel tuo locale. È ora.»',
                  f: 'consegne=suo',
                  r: [
                    [0, 'Il mio locale... Ho paura. Ma lo sogno da quando sono bambino.'],
                    [1, 'La paura si cura col brodo. Vengo ad aiutarti il primo giorno.'],
                    [0, "E ai miei clienti dirò: per il caffè, in città c'è un posto solo."]
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    rt: [
      [
        [1, 'Hai mangiato?'],
        [0, 'Sì, nonna.'],
        [1, 'Bugiardo.']
      ],
      [
        [0, 'Stasera il brodo è venuto meglio del solito.'],
        [1, 'Merito mio. Ti ho guardato mentre lo facevi.']
      ]
    ]
  },
  {
    id: 'scacchi',
    t: 'Scacco',
    d: 'Due pensionati, una scacchiera, nessuna voglia di perdere.',
    who: ['dario', 'elio'],
    perk: 'scacchi',
    pt: 'Una scacchiera fissa su un tavolo (+3 Atmosfera)',
    end: {
      'scacchi=torneo': { n: 'Il torneo', perk: 'torneo', pt: 'Torneo di scacchi ogni mese: più pensionati e +3 Atmosfera' },
      'scacchi=tavolo': { n: 'La targhetta', perk: 'targa', pt: 'Il tavolo di Dario ed Elio, con la targhetta (+7 Atmosfera)' }
    },
    ch: [
      {
        t: 'Rivali',
        r: 14,
        l: [
          [0, 'Quello è il MIO tavolo.'],
          [1, "Non c'è scritto il tuo nome."],
          [0, '...Giochi a scacchi?'],
          [1, 'Meglio di te, sicuro.'],
          [0, 'Vedremo.']
        ]
      },
      {
        t: 'Rivincita',
        r: 32,
        l: [
          [1, 'Scacco.'],
          [0, 'Hai barato.'],
          [1, 'Agli scacchi non si può barare.'],
          [0, 'Stesso giorno, settimana prossima.'],
          [1, 'Porta i fazzoletti.']
        ]
      },
      {
        t: 'Martedì',
        r: 58,
        l: [
          [0, 'Martedì scorso non sei venuto.'],
          [1, 'Ero in ospedale. Niente di grave.'],
          [0, 'Potevi avvisare. Ho giocato da solo come un idiota.'],
          [1, 'Ti sono mancato?'],
          [0, '...Muovi, vecchio.'],
          {
            c: {
              q: 'Dario finge di studiare la scacchiera, ma guarda te. «Diglielo tu che è un testardo.»',
              o: [
                {
                  t: '«E se faceste un torneo qui, ogni mese?»',
                  f: 'scacchi=torneo',
                  r: [
                    [1, 'Un torneo? Così lo batto davanti a tutti.'],
                    [0, 'Così ti batto davanti a tutti, vorrai dire.']
                  ]
                },
                {
                  t: '«Il martedì questo tavolo è vostro. Per sempre.»',
                  f: 'scacchi=tavolo',
                  r: [
                    [0, '...Per sempre è tanto, alla nostra età.'],
                    [1, 'Allora sbrighiamoci a giocare.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Ultima mossa',
        r: 76,
        l: [
          [0, 'Primo torneo del bar. Diciotto iscritti!', 'scacchi=torneo'],
          [1, 'E una bambina di nove anni che mi ha già battuto.', 'scacchi=torneo'],
          [0, "L'ho vista. Quando vince fa la tua stessa faccia: nessuna.", 'scacchi=torneo'],
          [1, 'Hai visto? Hanno messo una targhetta sul tavolo.', 'scacchi=tavolo'],
          [0, '«Riservato a Dario ed Elio. Il martedì, e quando vogliono.»', 'scacchi=tavolo'],
          [1, 'Adesso è ufficiale. Non posso andarmene prima di averti battuto mille volte.', 'scacchi=tavolo'],
          [0, 'Elio.'],
          [1, 'Mh?'],
          [0, 'Grazie di essere tornato, martedì.'],
          [1, '...Muovi, vecchio.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Cavallo in e5.'],
        [1, 'Prevedibile.']
      ],
      [
        [1, 'Patta?'],
        [0, 'Mai.']
      ],
      [
        [0, 'Stesso tavolo?'],
        [1, 'Stesso tavolo.']
      ]
    ]
  },
  {
    id: 'sposa',
    t: 'La sposa in fuga',
    d: 'Una notte di pioggia entra una ragazza in abito da sposa.',
    who: ['bianca'],
    perk: 'bianca',
    pt: 'Bianca lavora al bancone (+1 livello barista)',
    ch: [
      {
        t: 'Abito bagnato',
        r: 6,
        l: [
          [0, '*entra fradicia, in abito da sposa*'],
          [0, 'Un caffè. Doppio. Non fate domande.'],
          [0, '...'],
          {
            c: {
              q: 'Bianca fissa la tazza. Il trucco le cola sulle guance.',
              o: [
                { t: '«Offre la casa.»', f: 'sposa=gentile', r: [[0, '...Grazie. Davvero.']] },
                { t: '«Bel vestito.»', f: 'sposa=ironia', r: [[0, '*ride tra le lacrime* Vero? Costava una fortuna.']] }
              ]
            }
          },
          [0, 'Ok. Una domanda potete farla.']
        ]
      },
      {
        t: '47 chiamate',
        r: 20,
        l: [
          [0, '*il telefono vibra: 47 chiamate perse*'],
          [0, 'Non lo amavo. Lo sapevo da mesi.'],
          [0, 'Sono scappata prima del «sì».'],
          [0, 'Grazie per il caffè offerto, quella sera.', 'sposa=gentile'],
          [0, 'Grazie per avermi fatta ridere, quella sera.', 'sposa=ironia'],
          [0, 'Ora mi serve un lavoro. E una casa. E un senso.']
        ]
      },
      {
        t: 'Grembiule',
        r: 40,
        l: [
          [0, 'Ehi... cercate per caso qualcuno?'],
          [0, 'So fare il caffè. Più o meno.'],
          [0, 'E so scappare molto velocemente, se serve.'],
          [0, '*indossa il grembiule*'],
          [0, 'Mi sta meglio del vestito, eh?']
        ]
      }
    ],
    rt: []
  },
  {
    id: 'tazze',
    t: 'Due tazze',
    d: 'Un signore anziano ordina sempre due caffè. Uno resta lì, intatto.',
    who: ['aldo'],
    perk: 'giovedi',
    pt: 'Il giovedì dei nonni (+4 Atmosfera, recensioni migliori)',
    ch: [
      {
        t: 'Due caffè',
        r: 3,
        l: [
          [0, 'Due caffè, per favore. Uno lo lasci lì, di fronte a me.'],
          [0, '*mescola lo zucchero nella tazza vuota di fronte*'],
          [0, 'Lei lo prendeva sempre con due cucchiaini.']
        ]
      },
      {
        t: 'Nel 1974',
        r: 16,
        l: [
          [0, 'Ci siamo conosciuti in un caffè come questo. Nel 1974.'],
          [0, 'Lei rovesciò il latte sui miei pantaloni nuovi.'],
          {
            c: {
              q: 'Aldo resta in silenzio, guardando la tazza di fronte.',
              o: [
                {
                  t: 'Siediti un attimo con lui',
                  f: 'tazze=siedi',
                  r: [[0, 'Grazie, ragazzo. Ti sei seduto proprio dove si sedeva lei.']]
                },
                { t: 'Portagli un biscotto', f: 'tazze=biscotto', r: [[0, 'Il suo preferito. Come facevi a saperlo?']] }
              ]
            }
          },
          [0, 'Si chiamava Lidia.']
        ]
      },
      {
        t: 'Giada',
        r: 34,
        who: ['aldo', 'giada'],
        l: [
          [1, 'Nonno! Ti cercavo ovunque.'],
          [0, "Giada. Siediti. Lì c'è posto."],
          [1, '...Quella era la tazza della nonna.'],
          [0, 'Ora è tua. Te la offro io.']
        ]
      },
      {
        t: 'Una tazza',
        r: 54,
        who: ['aldo', 'giada'],
        l: [
          [0, 'Un caffè solo, oggi.'],
          [1, 'Solo uno, nonno?'],
          [0, 'Lidia mi ha detto di smettere di aspettarla. In sogno.'],
          [0, 'E di venire qui con te, il giovedì.'],
          [1, 'Ogni giovedì. Promesso.'],
          [1, '*verso il bancone* Nonno dice che quella sera ti sei seduto con lui. Grazie.', 'tazze=siedi'],
          [1, '*verso il bancone* Nonno dice che quel biscotto era il preferito della nonna. Ce ne porti due?', 'tazze=biscotto']
        ]
      }
    ],
    rt: [
      [
        [1, "Allora, nonno, com'era il 1974?"],
        [0, 'Pieno di latte rovesciato.']
      ],
      [
        [0, 'Due cucchiaini, come lei.'],
        [1, 'Come lei.']
      ]
    ]
  },
  {
    id: 'comico',
    t: 'Una risata',
    d: 'Un aspirante comico prova le battute sulla cliente più seria del locale.',
    who: ['tommy', 'irene'],
    perk: 'openmic',
    pt: 'Serate comiche con Tommy (evento)',
    ch: [
      {
        t: 'Prova microfono',
        r: 10,
        l: [
          [0, 'Scusa, posso provare una battuta su di te?'],
          [1, 'No.'],
          [0, 'Perché il caffè è andato dalla polizia?'],
          [1, '...'],
          [0, 'Perché era stato... macinato.'],
          [1, '*beve in silenzio*']
        ]
      },
      {
        t: 'Il pubblico peggiore',
        r: 30,
        l: [
          [0, 'Ok, nuova battuta.'],
          [1, 'Ti prego, no.'],
          [0, 'Cosa dice un chicco di caffè innamorato?'],
          [1, '...Cosa?'],
          [0, '«Sei la mia tazza preferita.»'],
          [1, '*sbuffa una risata*'],
          [0, 'HA RISO! HA RISO!'],
          [1, 'Era un colpo di tosse.']
        ]
      },
      {
        t: 'Open mic',
        r: 50,
        l: [
          [1, 'Ho prenotato la sala per venerdì. Serata comica.'],
          [0, 'Per... me?'],
          [1, 'Se fai schifo, almeno lo fai qui.'],
          [0, 'È la cosa più dolce che mi abbiano mai detto.'],
          {
            c: {
              q: 'Tommy ti raggiunge al bancone, nel panico. «Con quale battuta chiudo venerdì?»',
              o: [
                {
                  t: "«Dedica l'ultima a Irene.»",
                  f: 'comico=irene',
                  r: [
                    [0, 'A lei? E se non ride?'],
                    [1, '*dal tavolo, senza alzare gli occhi* Riderò. Forse.']
                  ]
                },
                {
                  t: '«Racconta di questo bar.»',
                  f: 'comico=bar',
                  r: [
                    [0, "Il bar! La pioggia, i clienti strani, il gatto... Ho materiale per un'ora."],
                    [1, 'Stai sotto i dieci minuti. Ti prego.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Venerdì',
        r: 68,
        l: [
          [0, '*al microfono* Buonasera! Il locale è pieno. Anche di gente che è qui per sbaglio.'],
          [0, "...e l'ultima la dedico a una persona che non ride mai.", 'comico=irene'],
          [0, 'Irene, vuoi venire a cena con me? Questa non è una battuta.', 'comico=irene'],
          [1, '*silenzio in sala*', 'comico=irene'],
          [1, 'Sì. Ma se fai una battuta sul menù, me ne vado.', 'comico=irene'],
          [0, 'Ragazzi, HA DETTO SÌ!', 'comico=irene'],
          [0, '...e alle tre di notte il barista mi guarda e dice: «Il caffè è finito.» In un BAR!', 'comico=bar'],
          [1, '*ride. Forte, davanti a tutti*', 'comico=bar'],
          [0, 'Irene... hai riso. In pubblico.', 'comico=bar'],
          [1, 'È stata la pioggia. Mi ha fatto il solletico.', 'comico=bar'],
          [1, 'Comunque sei stato bravo.'],
          [0, 'Puoi ripeterlo al microfono?'],
          [1, 'No.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Nuova battuta!'],
        [1, 'Sento già il mal di testa.'],
        [1, '*sorride*']
      ],
      [
        [1, 'Il pubblico di venerdì ti adorava.'],
        [0, 'E tu?'],
        [1, '...Io pure. Un pochino.']
      ]
    ]
  },
  {
    id: 'randagio',
    t: 'Il gattino del vicolo',
    d: 'Una veterinaria di turno di notte e un fattorino con una scatola che miagola.',
    who: ['nora', 'kenji'],
    perk: 'veterinaria',
    pt: 'Nora visita i gatti di quartiere (+6 Atmosfera)',
    ch: [
      {
        t: 'La scatola',
        r: 20,
        who: ['kenji', 'nora'],
        l: [
          [0, 'Scusate... qualcuno sa curare un gatto?'],
          [1, 'Io. Sono veterinaria. Fammi vedere.'],
          [0, "L'ho trovato in un vicolo, sotto la pioggia."],
          [1, 'È solo spaventato. E affamato.'],
          [0, 'Come me alle tre di notte.']
        ]
      },
      {
        t: 'Un nome',
        r: 36,
        who: ['kenji', 'nora'],
        l: [
          [1, 'Sta benissimo. Ma gli serve un nome.'],
          {
            c: {
              q: 'Kenji e Nora si girano verso il bancone. «Scegli tu.»',
              o: [
                { t: '«Espresso.»', f: 'randagio=espresso', r: [[0, 'Piccolo e nervoso. Perfetto.']] },
                { t: '«Pioggia.»', f: 'randagio=pioggia', r: [[1, "L'hai trovato sotto la pioggia. Ha senso."]] }
              ]
            }
          },
          [0, 'Posso tenerlo io? Abito sopra il ristorante.'],
          [1, 'Solo se me lo porti per i controlli.'],
          [0, '...Anche senza controlli, se vuoi.']
        ]
      },
      {
        t: 'Controllo',
        r: 60,
        who: ['kenji', 'nora'],
        l: [
          [1, 'Espresso è cresciuto un sacco.', 'randagio=espresso'],
          [1, 'Pioggia è cresciuto un sacco.', 'randagio=pioggia'],
          [0, 'Dorme sulle mie ricette. Le rovina tutte.'],
          [1, 'Allora cucina per me, così non servono ricette.'],
          [0, 'È un invito a cena?'],
          [1, 'È una prescrizione medica.']
        ]
      }
    ],
    rt: [
      [
        [1, 'Come sta il micio?'],
        [0, 'Meglio di me. Lui dorme.']
      ],
      [
        [0, 'Ti ho portato il ramen.'],
        [1, 'Prescrizione rispettata.']
      ]
    ]
  },
  {
    id: 'band',
    t: 'La band del bancone',
    d: 'Luca ha bisogno di un batterista. Tommy ha bisogno di musica per i suoi spettacoli.',
    who: ['luca', 'tommy'],
    req: 'pioggia',
    perk: 'band',
    pt: 'Concerti nel locale più spesso (+5 Atmosfera)',
    ch: [
      {
        t: 'Audizione',
        r: 30,
        l: [
          [0, 'Cerco qualcuno che suoni la batteria.'],
          [1, 'Io suono... le pentole. Benissimo.'],
          [0, '...'],
          [1, '*tamburella sul tavolo con due cucchiaini*'],
          [0, 'Ok, non è male. Per niente male.']
        ]
      },
      {
        t: 'Il nome',
        r: 48,
        l: [
          [1, 'Ci serve un nome. «I Macinati»?'],
          [0, 'Assolutamente no. «Doppio Ristretto».'],
          [1, 'Noioso.'],
          [0, 'Elegante.'],
          {
            c: {
              q: 'Luca e Tommy si girano verso di te. «Decidi tu. Sei imparziale.»',
              o: [
                {
                  t: '«Doppio Ristretto.»',
                  f: 'band=doppio',
                  r: [
                    [0, 'Visto? Elegante.'],
                    [1, 'Suona come un ordine al bancone. Ok, mi piace.']
                  ]
                },
                {
                  t: '«I Macinati.»',
                  f: 'band=macinati',
                  r: [
                    [1, 'HA! Il pubblico ha parlato!'],
                    [0, 'Il pubblico è una persona sola, Tommy.']
                  ]
                }
              ]
            }
          },
          [1, 'Mia ha già disegnato il logo. È una tazza con gli occhiali da sole.']
        ]
      },
      {
        t: 'Prima serata',
        r: 70,
        l: [
          [0, 'Stasera suonano i Doppio Ristretto. Cioè noi. Primo concerto.', 'band=doppio'],
          [0, 'Stasera suonano... I Macinati. Non riesco a dirlo serio.', 'band=macinati'],
          [1, 'Lo dirò io al microfono. Con fierezza.', 'band=macinati'],
          [1, "Io faccio le battute tra una canzone e l'altra."],
          [0, 'Solo due battute.'],
          [1, 'Tre.'],
          [0, 'Due.'],
          [1, '*sorride* Grazie di avermi preso nella band.']
        ]
      }
    ],
    rt: [
      [
        [1, 'Il pubblico ha chiesto il bis!'],
        [0, 'Era tua madre, Tommy.']
      ],
      [
        [0, 'Nuova canzone. Parla di questo bancone.'],
        [1, 'Il bancone sarà commosso.']
      ]
    ]
  },
  {
    id: 'lettere',
    t: 'Lettere da Tokyo',
    d: 'Gio aspetta Marta. Ugo, il postino, porta le lettere fin qui.',
    who: ['gio', 'ugo'],
    req: 'valigie=resta',
    perk: 'cartoline',
    pt: 'Muro delle cartoline (+4 Atmosfera)',
    ch: [
      {
        t: 'Posta per te',
        r: 24,
        l: [
          [1, 'Gio? Mi hanno detto che ti trovavo qui. Una lettera dal Giappone.'],
          [0, 'Da Marta!'],
          [1, 'Ha messo il francobollo storto. Si vede che aveva fretta.'],
          [0, 'Ha sempre fretta. È la cosa che mi manca di più.']
        ]
      },
      {
        t: 'La risposta',
        r: 42,
        l: [
          [0, "Ugo, come si scrive una lettera d'amore senza sembrare ridicoli?"],
          [1, "Non si può. Sono trent'anni che le consegno."],
          [1, 'Quelle ridicole sono le più belle.'],
          [0, 'Allora la mia sarà bellissima.']
        ]
      },
      {
        t: 'Ultima lettera',
        r: 64,
        l: [
          [1, 'Questa non ha il francobollo.'],
          [0, 'Come...?'],
          [1, "L'ha consegnata a mano. È qui fuori, sotto la pioggia."],
          [0, '*corre fuori senza giacca*'],
          [1, '*rivolto al bancone* Due cappuccini caldi. Tra poco saranno in tre.']
        ]
      }
    ],
    rt: [
      [
        [1, 'Niente lettere oggi.'],
        [0, 'Non servono più. È tornata!']
      ],
      [
        [0, 'Un caffè anche per te, Ugo.'],
        [1, 'Lo accetto. Ho camminato tanto.']
      ]
    ]
  },
  {
    id: 'tokyo',
    t: 'Cartoline da Tokyo',
    d: 'Marta e Gio sono partiti. Ugo, il postino, porta le loro cartoline al bancone.',
    who: ['ugo'],
    req: 'valigie=vai',
    perk: 'cartoline',
    pt: 'Muro delle cartoline (+4 Atmosfera)',
    ch: [
      {
        t: 'Francobollo storto',
        r: 24,
        l: [
          [0, 'Posta per il bancone! Una cartolina dal Giappone.'],
          [0, '«Qui piove sempre, come da voi. Ci sentiamo a casa.»'],
          [0, '«Gio ha già sbagliato treno tre volte. Marta.»'],
          [0, '*ride* La appendo qui, vicino alla macchina del caffè?']
        ]
      },
      {
        t: 'Il caffè col gatto',
        r: 42,
        l: [
          [0, "Un'altra! Questa l'ha scritta Gio."],
          [0, '«Abbiamo trovato il caffè col gatto. Il gatto mi odia.»'],
          [0, '«Marta dice che il vostro cappuccino è più buono. Io dico che è uguale. Mento: è più buono.»'],
          [0, "Trent'anni che consegno posta. Le cartoline felici si riconoscono dal peso."]
        ]
      },
      {
        t: 'A Natale',
        r: 64,
        who: ['marta', 'gio'],
        l: [
          [0, "*entra scrollando l'ombrello* Sorpresa!"],
          [1, 'Ugo ci ha detto che hai appeso tutte le cartoline.'],
          [0, 'Sono ancora lì. Anche quella del gatto che ti odia.'],
          [1, 'Mi odia ancora. Ci sono tornato tutte le settimane.'],
          [0, 'Due cappuccini. Come la prima volta, ma senza litigare.'],
          [1, '...Quasi senza litigare.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Siamo tornati per le feste.'],
        [1, 'E per il cappuccino. Soprattutto.']
      ],
      [
        [1, 'Il gatto di Tokyo ti saluta.'],
        [0, 'Bugiardo. Ti ha graffiato.']
      ]
    ]
  },
  {
    id: 'rivale',
    t: 'Il caffè di fronte',
    d: "Vittoria ha aperto un locale elegante dall'altra parte della strada. Viene a spiare.",
    who: ['vittoria'],
    perk: 'alleanza',
    pt: 'Alleanza con Vittoria: tutti i prezzi +10%',
    ch: [
      {
        t: 'Ispezione',
        r: 16,
        l: [
          [0, '*occhiali da sole, anche se piove*'],
          [0, 'Un espresso. E il nome del vostro fornitore.'],
          [0, '...Non si dice? Peccato.'],
          [0, '*scrive qualcosa su un taccuino*']
        ]
      },
      {
        t: 'Confessione',
        r: 38,
        l: [
          [0, 'Ok. Lo ammetto. Il vostro caffè è più buono del mio.'],
          [0, 'Il mio locale è bellissimo. Ed è vuoto.'],
          {
            c: {
              q: 'Vittoria fissa la tazza, nervosa.',
              o: [
                { t: '«Il segreto è la gente, non le tazze.»', f: 'rivale=gente', r: [[0, '...La gente. Non ci avevo mai pensato.']] },
                { t: '«Il segreto è la pioggia.»', f: 'rivale=pioggia', r: [[0, '*ride* Allora prego per un temporale.']] }
              ]
            }
          }
        ]
      },
      {
        t: 'Alleanza',
        r: 58,
        who: ['vittoria', 'bianca'],
        l: [
          [0, 'Ho seguito il vostro consiglio: tavoli grandi, dove la gente si siede vicina.', 'rivale=gente'],
          [0, 'Ho pregato per un temporale. È arrivato, e il mio locale si è riempito di ombrelli.', 'rivale=pioggia'],
          [0, "Ho un'idea. Facciamo una festa di quartiere. I due locali insieme."],
          [1, 'Tu porti le tovaglie eleganti, noi la musica.'],
          [0, 'E il caffè lo fate voi. È meglio.'],
          [1, 'Sei diventata simpatica, sai?'],
          [0, 'Non dirlo a nessuno.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Il mio locale si è riempito, grazie al vostro consiglio.'],
        [0, 'Ma qui ci torno lo stesso.']
      ]
    ]
  },
  {
    id: 'cucina',
    t: 'Ramen e grembiule',
    d: "Lei al bancone, lui ai fornelli. Tra un turno e l'altro, ogni sera un po' più vicini.",
    who: ['bianca', 'kenji'],
    req: ['sposa', 'consegne'],
    perk: 'cucina',
    pt: 'Kenji aiuta in cucina: piatti più veloci del 30%',
    ch: [
      {
        t: 'Assaggio',
        r: 34,
        l: [
          [1, 'Bianca, assaggia. È la nuova versione.'],
          [0, '*soffia sul cucchiaio*'],
          [0, '...Kenji. È buonissimo.'],
          [1, 'Lo dici solo perché sei stanca.'],
          [0, 'Lo dico perché è vero. E perché sono stanca.']
        ]
      },
      {
        t: 'Due minuti di pausa',
        r: 52,
        l: [
          [0, 'Ogni tanto penso a quel giorno. Al vestito.'],
          [1, 'Ti penti?'],
          [0, 'Mai. Se non fossi scappata non sarei qui.'],
          [1, 'Allora sono contento che tu corra veloce.']
        ]
      },
      {
        t: 'Menu a quattro mani',
        r: 74,
        l: [
          [1, "Ho scritto un nuovo menu. C'è un piatto con il tuo nome."],
          [0, '«Fuga di mezzanotte»?'],
          [1, 'Ramen, uovo e un pizzico di follia.'],
          [0, 'Sembra me.'],
          [1, "È per questo che l'ho inventato."],
          [0, '*gli ruba il cappello da cuoco e scappa ridendo*']
        ]
      }
    ],
    rt: [
      [
        [0, 'Due ramen per il tavolo tre!'],
        [1, 'Due ramen e un sorriso, arrivano.']
      ]
    ]
  },
  {
    id: 'notturno',
    t: 'Turno di notte',
    d: 'Un ragazzo che lavora al pronto soccorso e Sara, che lo ha formato.',
    who: ['sara', 'pietro'],
    req: 'romanzo',
    perk: 'notturni',
    pt: 'Dopo mezzanotte i clienti lasciano mance doppie',
    ch: [
      {
        t: 'Il primo turno',
        r: 26,
        l: [
          [1, 'Sara... come fai? Io tremo ancora.'],
          [0, 'Il primo turno è il peggiore. Bevi.'],
          [1, 'È caffè?'],
          [0, "È caffè. E un po' di coraggio."]
        ]
      },
      {
        t: 'Una notte difficile',
        r: 46,
        l: [
          [1, '*non dice niente, fissa il tavolo*'],
          [0, 'Non si salvano tutti, Pietro.'],
          [0, "Ma stanotte ne hai salvati tre. Io c'ero."],
          [1, '...Tre.'],
          [0, 'Tre. Ricordati quelli.'],
          {
            c: {
              q: 'Pietro stringe la tazza con le mani che tremano ancora.',
              o: [
                {
                  t: '«Stanotte offre la casa. Resta quanto vuoi.»',
                  f: 'notturno=resta',
                  r: [
                    [1, '...Grazie. Solo dieci minuti.'],
                    [0, "*mezz'ora dopo Pietro dorme sul tavolo. Sara gli mette la sua giacca sulle spalle*"]
                  ]
                },
                {
                  t: '«Domani torni là dentro. Ce la fai.»',
                  f: 'notturno=coraggio',
                  r: [
                    [1, 'Domani. Sì.'],
                    [0, 'Hai sentito? Lo dice anche il barista. E il barista non sbaglia mai.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il capitolo nuovo',
        r: 66,
        who: ['sara', 'bruni'],
        l: [
          [1, 'Signora Sara! Ho saputo che forma i nuovi infermieri.'],
          [0, 'Professore, non mi dica che ci scrive un altro libro.'],
          [1, 'Il seguito. «Chi resta sveglio».'],
          [0, 'Allora ci metta il ragazzo che si è addormentato qui, quella notte. Ora è il più bravo del reparto.', 'notturno=resta'],
          [0, 'Allora ci metta Pietro. È tornato in reparto il giorno dopo, e quello dopo ancora.', 'notturno=coraggio'],
          [1, "C'è già. È il capitolo più bello."]
        ]
      }
    ],
    rt: [
      [
        [1, 'Turno tranquillo, oggi.'],
        [0, 'Non dirlo ad alta voce!']
      ],
      [
        [0, 'Caffè?'],
        [1, 'Doppio. E coraggio.']
      ]
    ]
  },
  {
    id: 'cuore',
    t: 'Un cuore, due grembiuli',
    d: 'Kenji ha invitato a cena Nora. E cucina ogni sera con Bianca. Prima o poi le due si incontreranno.',
    who: ['nora', 'bianca'],
    req: ['randagio', 'cucina'],
    perk: 'cuore',
    pt: 'Il quartiere ha una coppia in più (+4 Atmosfera)',
    end: {
      'cuore=nora': { n: 'La prescrizione', perk: 'cuore', pt: 'Nora e Kenji, la coppia del ramen (+4 Atmosfera)' },
      'cuore=bianca': { n: 'Due grembiuli', perk: 'cuore', pt: 'Bianca e Kenji, la coppia della cucina (+4 Atmosfera)' }
    },
    ch: [
      {
        t: 'Due inviti',
        r: 60,
        l: [
          [0, 'Tu sei Bianca, vero? Quella del bancone.'],
          [1, 'E tu sei la veterinaria. Kenji parla sempre di te.'],
          [0, 'Davvero? A me parla sempre di te.'],
          [1, '...'],
          [0, '...'],
          [1, 'Mi sa che abbiamo un problema. Alto così, col cappello da cuoco.'],
          [0, '*ride, ma si vede che non ha voglia di ridere*']
        ]
      },
      {
        t: 'Il mestolo che trema',
        r: 72,
        who: ['kenji', 'rosa'],
        l: [
          [1, 'Ragazzo, hai la faccia di chi ha bruciato il brodo.'],
          [0, 'Peggio, nonna. Mi piacciono due persone.'],
          [1, 'Ah. Il brodo era più semplice.'],
          [0, 'Nora mi fa ridere fino alle lacrime. Bianca mi fa sentire a casa.'],
          [1, "E tu? Cosa senti quando piove e non c'è nessuna delle due?"],
          [0, '...Non lo so.'],
          {
            c: {
              q: 'Nonna Rosa ti fa un cenno: «Diglielo tu, che vedi tutto da dietro quel bancone.»',
              o: [
                {
                  t: '«Nora. Ti ha prescritto una cena, ricordi?»',
                  f: 'cuore=nora',
                  r: [
                    [0, "La prescrizione... Ce l'ho ancora nel portafoglio."],
                    [1, 'Allora è deciso. Il cuore tiene le ricevute.']
                  ]
                },
                {
                  t: '«Bianca. Cucinate già insieme ogni sera.»',
                  f: 'cuore=bianca',
                  r: [
                    [0, 'Ogni sera. Anche quando il turno è finito, restiamo.'],
                    [1, 'Se resti quando potresti andare, ragazzo mio, è amore.']
                  ]
                }
              ]
            }
          },
          [1, 'Ora vai. E sii gentile con tutte e due.']
        ]
      },
      {
        t: 'Amiche',
        r: 84,
        l: [
          [1, 'Mi ha detto tutto. Va bene così, sai?', 'cuore=nora'],
          [0, 'Sei sicura? Cucinavate insieme ogni sera.', 'cuore=nora'],
          [1, "Io ho un debole per chi scappa. Lui invece resta. Siete fatti uno per l'altra.", 'cuore=nora'],
          [0, 'Ha scelto te. Ed era ora.', 'cuore=bianca'],
          [1, 'Mi dispiace, Nora. Davvero.', 'cuore=bianca'],
          [0, 'Non dispiacerti. Io curo i gatti, non i cuoci-ramen indecisi.', 'cuore=bianca'],
          [0, 'Allora... amiche?'],
          [1, 'Amiche. Ma il prossimo ramen lo paga lui.'],
          [0, 'Il prossimo e quello dopo.'],
          [1, '*brindano con due cappuccini*']
        ]
      }
    ],
    rt: [
      [
        [0, 'Come va col bancone?'],
        [1, 'Benissimo. Come va coi gatti?'],
        [0, 'Meglio dei cuochi.']
      ],
      [
        [1, 'Kenji ha bruciato il brodo, oggi.'],
        [0, 'Allora era innamorato.']
      ]
    ]
  },
  {
    id: 'festa',
    t: 'La festa di quartiere',
    d: 'Vittoria vuole una festa in strada. Luca e Tommy vogliono suonarci. Il quartiere vuole solo ballare.',
    who: ['vittoria', 'tommy'],
    req: ['rivale', 'band'],
    perk: 'festa',
    pt: 'Una festa di quartiere ogni tanto (+6 Atmosfera)',
    ch: [
      {
        t: 'Il volantino',
        r: 62,
        l: [
          [0, 'Festa di quartiere. Sabato. Tra il mio locale e questo.'],
          [1, 'Serve un presentatore?'],
          [0, 'Serve qualcuno serio.'],
          [1, 'Sono serissimo. Guarda: *faccia seria*'],
          [0, '...Va bene. Ma niente battute sul mio locale.'],
          [1, 'Solo una. Piccola. Affettuosa.']
        ]
      },
      {
        t: 'Le prove',
        r: 74,
        who: ['luca', 'tommy'],
        l: [
          [0, 'Apriamo la festa. Davanti a tutto il quartiere.'],
          [1, 'Io sono pronto. Ho comprato una camicia con le palme.'],
          [0, 'Per una festa sotto la pioggia?'],
          [1, 'Le palme portano il sole. È scienza.'],
          {
            c: {
              q: 'Luca accorda la chitarra e ti guarda: «Con cosa apriamo?»',
              o: [
                {
                  t: '«Con la canzone del tavolo vicino alla finestra.»',
                  f: 'festa=canzone',
                  r: [
                    [0, 'Quella è di Mia. Se la suono davanti a tutti piange.'],
                    [1, 'E noi con lei.']
                  ]
                },
                {
                  t: '«Con qualcosa da ballare. Forte.»',
                  f: 'festa=ballo',
                  r: [
                    [1, 'SÌ! Faccio partire il tamburo delle pentole!'],
                    [0, 'Le pentole di Kenji? Lui lo sa?'],
                    [1, 'Lo saprà sabato.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Sabato',
        r: 88,
        who: ['vittoria', 'luca'],
        l: [
          [0, 'Hai visto? La strada piena. Anche sotto la pioggia.'],
          [1, 'Quando ho suonato la canzone del tavolo, Mia è salita sul palco.', 'festa=canzone'],
          [0, "E metà del quartiere si è messa a piangere. L'altra metà a cantare.", 'festa=canzone'],
          [1, 'Le pentole di Kenji non saranno mai più le stesse.', 'festa=ballo'],
          [0, 'Ho visto Dario ed Elio ballare. Insieme. Non lo dirò a nessuno.', 'festa=ballo'],
          [0, 'Grazie. Per anni ho pensato che questo fosse il bar nemico.'],
          [1, 'E invece?'],
          [0, 'Invece è il bar di fronte al mio. È diverso.']
        ]
      }
    ],
    rt: [
      [
        [0, 'La rifacciamo, la festa?'],
        [1, 'Solo se Tommy non porta la camicia con le palme.']
      ],
      [
        [1, 'Ho una canzone nuova per la prossima festa.'],
        [0, 'Io ho già prenotato il sole. Speriamo arrivi.']
      ]
    ]
  },
  {
    id: 'nozze',
    t: 'Stesso tavolo per sempre',
    d: "Luca ha un anello in tasca da tre settimane. Gli serve il consiglio di un'esperta di matrimoni. Anche di quelli finiti male.",
    who: ['luca', 'bianca'],
    req: ['pioggia', 'sposa'],
    perk: 'nozze',
    pt: 'Una foto delle nozze sulla parete (+5 Atmosfera)',
    ch: [
      {
        t: "L'anello",
        r: 56,
        l: [
          [0, 'Bianca, posso chiederti una cosa? Tu sei... esperta di matrimoni.'],
          [1, 'Sono esperta di fughe dai matrimoni. È diverso.'],
          [0, '*apre una scatolina*'],
          [1, 'Oh. OH. Per Mia?'],
          [0, "Ce l'ho in tasca da tre settimane. Non trovo il momento."],
          {
            c: {
              q: 'Bianca si gira verso di te: «Aiutalo tu, io col momento giusto ho un pessimo passato.»',
              o: [
                {
                  t: '«Chiediglielo con una canzone.»',
                  f: 'nozze=canzone',
                  r: [
                    [0, 'Una canzone... Ne ho una a metà. Si chiama «Per sempre è tanto».'],
                    [1, 'Finiscila. Io scappo solo dai matrimoni sbagliati.']
                  ]
                },
                {
                  t: '«Disegnalo nel suo quaderno.»',
                  f: 'nozze=disegno',
                  r: [
                    [0, 'Nel quaderno! Io non so disegnare. Sarà un disastro.'],
                    [1, 'Appunto. Sarà bellissimo.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'La domanda',
        r: 70,
        who: ['mia', 'luca'],
        l: [
          [1, "Ti ho scritto una canzone. L'ultima strofa è una domanda.", 'nozze=canzone'],
          [0, "*ascolta con l'auricolare, poi si toglie le cuffie piano*", 'nozze=canzone'],
          [1, 'Ho fatto un disegno nel tuo quaderno. Non ridere.', 'nozze=disegno'],
          [0, 'È... un omino con un anello? E una tazza gigante?', 'nozze=disegno'],
          [1, 'Mia. Vuoi sposarmi?'],
          [0, 'Stesso tavolo per sempre, avevamo detto.'],
          [1, 'Quindi è un sì?'],
          [0, 'È un sì. Ma il caffè dopo lo paghi tu.']
        ]
      },
      {
        t: 'Il velo',
        r: 86,
        who: ['mia', 'rosa'],
        l: [
          [1, 'Ferma, cara. Il velo è storto.'],
          [0, 'Nonna Rosa, ho le mani che tremano.'],
          [1, "Tremavano anche a me. Sessant'anni fa. Ed è andata benissimo."],
          [0, 'Bianca ha promesso di non far scappare nessuno.'],
          [1, 'E il barista ha promesso il caffè per tutti.'],
          [0, 'Allora andiamo. Fuori piove.'],
          [1, 'Sposa bagnata, sposa fortunata. Quella era vera.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Te lo ricordi il giorno del velo?'],
        [1, 'Mi ricordo che pioveva. E che eri bellissima.']
      ],
      [
        [1, "Luca stanotte ha suonato fino all'alba."],
        [0, 'Lo so. Gli ho fatto il ritratto mentre dormiva in piedi.']
      ]
    ]
  },
  {
    id: 'lezioni',
    t: 'Il quaderno di Giada',
    d: "Giada disegna di nascosto, il giovedì, mentre il nonno sorseggia il caffè. Mia l'ha notato.",
    who: ['giada', 'mia'],
    req: ['tazze', 'pioggia'],
    perk: 'lezioni',
    pt: 'I disegni di Giada alle pareti (+3 Atmosfera)',
    ch: [
      {
        t: 'Di nascosto',
        r: 40,
        l: [
          [1, 'Scusa... quello è un disegno di questo locale?'],
          [0, '*chiude il quaderno di scatto*'],
          [0, 'È brutto. Non guardare.'],
          [1, 'Le linee della pioggia sono perfette. Io ci ho messo anni.'],
          [0, '...Davvero?'],
          [1, 'Davvero. Io sono Mia. Disegno qui da sempre.']
        ]
      },
      {
        t: 'Prima lezione',
        r: 58,
        l: [
          [1, 'Regola numero uno: disegna quello che ami. Il resto viene dopo.'],
          [0, 'E se non so cosa amo?'],
          [1, 'Allora guarda fuori. O guarda chi hai accanto.'],
          {
            c: {
              q: 'Giada ti guarda, la matita sospesa: «Tu cosa disegneresti?»',
              o: [
                {
                  t: '«Tuo nonno, il giovedì.»',
                  f: 'lezioni=nonno',
                  r: [
                    [0, 'Il nonno... con le due tazze. Come prima.'],
                    [1, "Con tutto quello che c'è stato. Si può."]
                  ]
                },
                {
                  t: '«La pioggia sul vetro.»',
                  f: 'lezioni=pioggia',
                  r: [
                    [0, 'La pioggia è difficile. Si muove sempre.'],
                    [1, 'Come tutto quello che vale la pena disegnare.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il regalo',
        r: 78,
        who: ['giada', 'aldo'],
        l: [
          [0, "Nonno, ho una cosa per te. L'ho fatta io."],
          [1, '*apre il foglio piano, con le mani che tremano*'],
          [1, "Sono io. Al nostro tavolo. E di fronte... c'è Lidia.", 'lezioni=nonno'],
          [0, "Me l'ha insegnato Mia. Disegna quello che ami.", 'lezioni=nonno'],
          [1, 'È la nostra finestra. Con la pioggia.', 'lezioni=pioggia'],
          [0, 'La nonna diceva che la pioggia lava via i pensieri brutti.', 'lezioni=pioggia'],
          [1, 'Lo appendiamo qui. Sopra il nostro tavolo.'],
          [0, 'Nonno, piangi?'],
          [1, 'È il caffè. È troppo caldo.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Nonno, oggi disegno te.'],
        [1, 'Fammi più giovane. E più alto.']
      ],
      [
        [1, 'La tua maestra Mia come sta?'],
        [0, 'Dice che tra poco la supero.']
      ]
    ]
  },
  {
    id: 'club',
    t: 'Il terzo alfiere',
    d: "Elio è dal dottore. Dario non sa con chi giocare. Al tavolo accanto c'è Aldo, con il suo caffè del giovedì.",
    who: ['dario', 'aldo'],
    req: ['tazze', 'scacchi'],
    perk: 'club',
    pt: 'Il club degli scacchi del giovedì (+3 Atmosfera)',
    ch: [
      {
        t: 'Il terzo incomodo',
        r: 50,
        l: [
          [0, 'Lei. Sì, lei. Sa giocare a scacchi?'],
          [1, 'Mia moglie sapeva. Io guardavo.'],
          [0, 'Meglio. Chi guarda impara senza saperlo.'],
          [1, '*sposta un pedone di due caselle*'],
          [0, '...Hm. Non male, per uno che guardava.']
        ]
      },
      {
        t: 'Tre vecchi e una scacchiera',
        r: 66,
        who: ['elio', 'aldo'],
        l: [
          [0, 'Dario mi ha detto che ha trovato un sostituto. Sono offeso.'],
          [1, 'Sono solo un alfiere di riserva.'],
          [0, 'Lidia giocava?'],
          [1, 'Mi batteva sempre. Poi rideva coprendosi la bocca.'],
          [0, 'Allora siamo in tre. Tre è un club.'],
          {
            c: {
              q: 'Elio si rivolge al bancone: «Un club ha bisogno di un nome. Sentiamo.»',
              o: [
                {
                  t: '«Il club del giovedì.»',
                  f: 'club=giovedi',
                  r: [
                    [1, 'Il giovedì. Il giorno di Lidia. E di Giada.'],
                    [0, 'E adesso anche il nostro.']
                  ]
                },
                {
                  t: '«I tre alfieri.»',
                  f: 'club=alfieri',
                  r: [
                    [0, 'Gli alfieri vanno in diagonale. Come le nostre vite.'],
                    [1, 'Lei è un poeta, Elio.'],
                    [0, 'Sono un pensionato. È lo stesso.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Patta',
        r: 82,
        who: ['dario', 'elio'],
        l: [
          [0, 'Ieri Aldo mi ha battuto.'],
          [1, "L'ho visto. Hai fatto la faccia del 1982."],
          [0, 'Il club del giovedì ha un nuovo campione. Mi rovinerà la reputazione.', 'club=giovedi'],
          [1, "Sui tre alfieri c'è scritto anche il suo nome, ormai. In fondo alla lista.", 'club=alfieri'],
          [0, 'Sai cosa mi ha detto, dopo lo scacco?'],
          [1, 'Cosa?'],
          [0, '«Lidia avrebbe riso coprendosi la bocca».'],
          [1, '...Muovi, vecchio.'],
          [0, 'Muovi tu. Io mi sto commuovendo.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Aldo arriva tardi. Come sempre.'],
        [1, 'Aspettiamolo. Il club è il club.']
      ],
      [
        [1, 'Partita a tre?'],
        [0, 'Gli scacchi si giocano in due.'],
        [1, 'I nostri no.']
      ]
    ]
  },
  {
    id: 'postino',
    t: "L'ultimo giro di Ugo",
    d: "Ugo va in pensione dopo trent'anni di lettere. Nonna Rosa non sa chi le porterà le bollette. O forse sì.",
    who: ['ugo', 'rosa'],
    req: ['consegne', 'lettere|tokyo'],
    perk: 'postino',
    pt: "La borsa di Ugo appesa all'ingresso (+4 Atmosfera)",
    ch: [
      {
        t: "Trent'anni",
        r: 52,
        l: [
          [0, 'Signora Rosa, il mese prossimo vado in pensione.'],
          [1, 'E chi mi porterà le bollette? E le cartoline dei nipoti?'],
          [0, 'Un ragazzo nuovo. Corre tantissimo. Non saluta mai.'],
          [1, 'Allora ti farò aspettare sulla porta a parlare. Come sempre.'],
          [0, 'Ho sempre pensato che fosse il giro più lungo della città. Per colpa sua.'],
          [1, 'Per merito mio, vorrai dire.']
        ]
      },
      {
        t: 'Senza francobollo',
        r: 68,
        l: [
          [0, 'Ultimo giorno di lavoro. Ultima lettera.'],
          [1, "Per me? Non c'è il francobollo."],
          [0, "L'ho scritta io. Trent'anni di lettere degli altri. Volevo scriverne una."],
          {
            c: {
              q: 'Rosa gira la busta tra le dita, senza aprirla. Ti guarda come per chiederti il permesso.',
              o: [
                {
                  t: '«La apra adesso, Rosa.»',
                  f: 'postino=subito',
                  r: [
                    [1, '*legge, si toglie gli occhiali, li pulisce, li rimette*'],
                    [1, 'Ugo... alla mia età?']
                  ]
                },
                {
                  t: '«La legga a casa, con calma.»',
                  f: 'postino=casa',
                  r: [
                    [1, 'A casa. Con il tè. Come le cose importanti.'],
                    [0, '*diventa rosso fino alle orecchie*']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il giro più lungo',
        r: 85,
        l: [
          [1, "L'ho letta davanti a tutti. Che vergogna. Che bellezza.", 'postino=subito'],
          [0, 'Hai detto «alla mia età». Non hai detto no.', 'postino=subito'],
          [1, "L'ho letta tre volte, col tè. Poi ancora, senza tè.", 'postino=casa'],
          [0, 'E allora?', 'postino=casa'],
          [1, 'Allora domani passi a prendermi. Facciamo il tuo vecchio giro. A piedi.'],
          [0, 'È lunghissimo.'],
          [1, 'Appunto. Abbiamo tempo, adesso.'],
          [0, '*le porge il braccio, come un cavaliere*']
        ]
      }
    ],
    rt: [
      [
        [0, 'Oggi niente posta.'],
        [1, 'Ci sei tu. È meglio.']
      ],
      [
        [1, 'Ugo, hai mangiato?'],
        [0, 'Sì, Rosa.'],
        [1, 'Bugiardo. Come Kenji.']
      ]
    ]
  },
  {
    id: 'seguito',
    t: 'Chi resta sveglio',
    d: 'Il professore scrive il seguito del romanzo. Gli servono illustrazioni. E la ragazza col quaderno disegna tutti quelli che entrano.',
    who: ['bruni', 'mia'],
    req: ['romanzo', 'pioggia'],
    perk: 'seguito',
    pt: 'Il secondo libro accanto al primo (+4 Atmosfera)',
    ch: [
      {
        t: 'Le figure',
        r: 44,
        l: [
          [0, 'Signorina. Ho visto i suoi disegni. Lei disegna i miei personaggi.'],
          [1, 'I suoi personaggi?'],
          [0, 'Le persone di questo locale. Sono tutti nel mio libro. Il seguito.'],
          [1, 'Allora siamo colleghi. Lei li scrive, io li disegno.'],
          [0, 'Mi farebbe le illustrazioni?'],
          [1, "Solo se c'è anche il gatto del bancone."]
        ]
      },
      {
        t: 'La copertina',
        r: 62,
        l: [
          [1, 'Ho fatto due bozze per la copertina.'],
          [0, 'Io ne vorrei una sola. Ma non so quale.'],
          {
            c: {
              q: 'Il professore e Mia appoggiano due fogli sul bancone, davanti a te.',
              o: [
                {
                  t: '«Il locale di notte, con le luci accese.»',
                  f: 'seguito=notte',
                  r: [[0, 'Chi resta sveglio... vede le luci accese. Perfetto.']]
                },
                {
                  t: '«Due mani attorno a una tazza.»',
                  f: 'seguito=mani',
                  r: [
                    [1, "Le mani sono di Luca. Ha posato un'ora. Si lamentava."],
                    [0, 'Si vede. Sono mani pazienti.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'La presentazione',
        r: 80,
        who: ['bruni', 'sara'],
        l: [
          [1, "Professore, c'è la fila fuori. Per un libro!"],
          [0, "C'è la fila per la copertina. Le luci del locale di notte, con la pioggia.", 'seguito=notte'],
          [0, "C'è la fila per la copertina. Due mani attorno a una tazza. Tutti pensano siano le loro.", 'seguito=mani'],
          [1, 'Ho letto il capitolo su di me. E quello su Pietro.'],
          [0, 'E?'],
          [1, 'E ho pianto in reparto. Davanti a un paziente. Che mi ha consolata.'],
          [0, 'Allora il libro funziona.'],
          [1, 'Ci firma una copia? «A chi fa il caffè», come il primo.'],
          [0, 'Come il primo. Alcune cose non si cambiano.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Sto pensando al terzo libro.'],
        [1, 'Allora mi metta in vacanza, finalmente.']
      ],
      [
        [1, 'Mia ha disegnato anche me?'],
        [0, 'Con il camice e il caffè. Come sempre.']
      ]
    ]
  },
  {
    id: 'davide',
    t: 'Il caffè più semplice',
    d: 'Un uomo entra senza ombrello e ordina il caffè più semplice. Non lo beve.',
    nota: "Questa storia parla di depressione e di pensieri suicidi. Se ti riconosci in quello che prova Davide, o sei preoccupato per qualcuno, parlane: non serve avere le parole giuste. In Italia puoi chiamare Telefono Amico (02 2327 2327) o Samaritans (06 77208977); se c'è un pericolo immediato, il 112.",
    who: ['davide'],
    rand: { from: 3, p: 0.4 },
    gap: 1,
    perk: 'davide',
    pt: 'Il tavolo di Davide, vicino alla finestra',
    end: {
      'davide=salvo': { n: 'La domanda giusta', perk: 'davide', pt: 'Il tavolo di Davide, vicino alla finestra (+3 Atmosfera)' },
      'davide=fragile': { n: 'Un giorno alla volta', perk: 'davide', pt: 'Il tavolo di Davide, vicino alla finestra (+3 Atmosfera)' },
      'davide=crisi': { n: 'Il tavolo vuoto', perk: 'davide', pt: 'Il tavolo di Davide aspetta che torni' }
    },
    ch: [
      {
        t: 'Il caffè più semplice',
        r: 0,
        l: [
          [0, '*entra senza ombrello, fradicio, e non sembra accorgersene*'],
          [0, 'Un caffè. Il più semplice che avete.'],
          [0, '*si siede vicino alla finestra e fissa la tazza senza berla*'],
          [0, "*guarda l'orologio, come se avesse un posto dove andare*"],
          [0, 'Scusi. È che... ventisette anni. E una lettera di due righe.'],
          {
            c: {
              q: 'Davide guarda la pioggia. Il caffè si sta raffreddando.',
              o: [
                {
                  t: '«Questo lo offre la casa. Torni quando vuole.»',
                  f: 'davide1=caldo',
                  r: [
                    [0, "...Grazie. Non me l'aspettavo."],
                    [0, 'Davide. Mi chiamo Davide.']
                  ]
                },
                {
                  t: '«Ventisette anni di cosa? Le va di raccontare?»',
                  f: 'davide1=domanda',
                  r: [
                    [0, 'Tipografia. Stampavamo libri, manifesti, menù come il vostro.'],
                    [0, 'Ha chiuso. Le macchine le hanno vendute a peso. Io pure, credo.']
                  ]
                },
                {
                  t: 'Lasciarlo tranquillo con il suo caffè',
                  f: 'davide1=nulla',
                  r: [[0, '*beve il caffè freddo in un sorso, lascia le monete sul tavolo ed esce*']]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Le otto e mezza',
        r: 0,
        l: [
          [0, 'Buongiorno. Il caffè semplice, grazie.'],
          [0, 'Ogni mattina esco di casa alle otto, con la borsa del pranzo.'],
          [0, 'Mia moglie crede che vada al lavoro. Anche mia figlia.'],
          [0, 'Sono quattro mesi che vengo qui, o al parco, o in biblioteca. Fino alle cinque.'],
          [0, 'Ho mandato quaranta curriculum. A cinquantadue anni sei un costo, non una persona.'],
          {
            c: {
              q: 'Davide si rigira la fede al dito. «Non so più chi sono, se non stampo.»',
              o: [
                {
                  t: '«Lo dica a sua moglie. Non deve portarlo da solo.»',
                  f: 'davide2=parla',
                  r: [
                    [0, 'E come glielo dico? Che le ho mentito per quattro mesi?'],
                    [0, '...Forse ha ragione. Forse il peso è il segreto, non il lavoro.']
                  ]
                },
                {
                  t: '«Mi aiuterebbe a rifare la lavagna del menù? Mi serve una mano esperta.»',
                  f: 'davide2=lavagna',
                  r: [
                    [0, 'La lavagna? Da giovane facevo i caratteri a mano.'],
                    [0, '*prende il gesso. Per dieci minuti le mani non gli tremano*']
                  ]
                },
                {
                  t: '«Vedrà che qualcosa troverà. Su, coraggio!»',
                  f: 'davide2=coraggio',
                  r: [
                    [0, 'Sì. Certo. Lo dicono tutti.'],
                    [0, '*sorride, ma solo con la bocca*']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Le lettere',
        r: 0,
        l: [
          [0, '*non ordina niente. Si siede e basta*'],
          [0, 'Ho provato a dirlo a mia moglie. Mi si è chiusa la gola.', 'davide2=parla'],
          [0, "Con la lavagna mi sono sentito utile, l'altra volta. È stato bello. Ma è durato poco.", 'davide2=lavagna'],
          [0, 'Non ho detto niente a nessuno. Non ci riesco.', 'davide2=coraggio'],
          [0, "Stanotte ho controllato l'assicurazione. Se non ci fossi, il mutuo sarebbe pagato."],
          [0, 'Ho scritto delle lettere. Per mia moglie, per Elena. Così, nel caso.'],
          [0, 'Forse varrei di più così. Almeno i conti tornerebbero.'],
          {
            c: {
              q: 'Davide parla piano, senza guardarti. Le sue parole ti restano addosso.',
              o: [
                {
                  t: '«Davide, glielo chiedo apertamente: sta pensando di togliersi la vita? Se è così, restiamo qui e chiamiamo qualcuno insieme.»',
                  f: 'davide3=chiedi',
                  r: [
                    [0, '...'],
                    [0, 'Sì. Ci penso. Tutte le notti.'],
                    [0, "Nessuno me l'aveva mai chiesto. Pensavo che dirlo l'avrebbe reso vero."],
                    [0, 'Invece è come togliersi uno zaino pieno di sassi.'],
                    [0, 'Va bene. Chiamiamo. Ma resta qui, mentre parlo?']
                  ]
                },
                {
                  t: '«Non dica così! Ha una famiglia, ha tanto per cui vivere.»',
                  f: 'davide3=rassicura',
                  r: [
                    [0, 'Lo so. È proprio per loro che...'],
                    [0, 'Lasci stare. Ha ragione lei. Scusi lo sfogo.']
                  ]
                },
                {
                  t: '«Le porto un altro caffè? Oggi i cornetti sono buonissimi.»',
                  f: 'davide3=evita',
                  r: [
                    [0, '*ti guarda un momento, come se aspettasse altro*'],
                    [0, 'No, grazie. Va bene così.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Dopo',
        r: 0,
        gap: 3,
        who: ['elena', 'davide'],
        whoBy: { 'davide=crisi': ['elena'] },
        calc: {
          flag: 'davide',
          values: ['salvo', 'fragile', 'crisi'],
          fn: () => {
            const f = k => st.flags[k];
            const s = (['caldo', 'domanda'].includes(f('davide1')) ? 1 : 0) + (['parla', 'lavagna'].includes(f('davide2')) ? 1 : 0);
            if (f('davide3') === 'chiedi') return s >= 1 ? 'salvo' : 'fragile';
            if (f('davide3') === 'rassicura' && s >= 2) return 'fragile';
            return 'crisi';
          }
        },
        l: [
          [1, 'Sono tornato. E stavolta non sto fingendo di andare al lavoro.', 'davide=salvo'],
          [0, 'Papà ci ha detto tutto. A cena. Abbiamo pianto tutti e tre. Anche il cane, credo.', 'davide=salvo'],
          [1, 'Vado da una dottoressa, il giovedì. Parlo. Pensavo fosse una cosa da deboli.', 'davide=salvo'],
          [0, 'È la cosa più coraggiosa che gli abbia mai visto fare.', 'davide=salvo'],
          [1, 'E ho trovato un lavoro. Insegno ai ragazzi del centro professionale a usare le vecchie macchine da stampa.', 'davide=salvo'],
          [
            1,
            'Quella sera qualcuno mi ha fatto la domanda che nessuno aveva il coraggio di farmi. Me lo ricorderò sempre.',
            'davide=salvo'
          ],
          [1, 'Ci sono giorni brutti. Oggi è un giorno così così.', 'davide=fragile'],
          [0, "L'ho trovato in cucina alle quattro, una notte. Abbiamo parlato fino all'alba. Ora va da un medico.", 'davide=fragile'],
          [1, 'Non è finita. Ma non sono più solo, là dentro.', 'davide=fragile'],
          [0, 'Gli tenga il suo tavolo, va bene? Gli fa bene sapere che qualcuno lo aspetta.', 'davide=fragile'],
          [0, 'Lei è il barista? Mio padre è Davide. Il signore del caffè semplice.', 'davide=crisi'],
          [0, "Due settimane fa ha avuto una crisi. Una notte. L'abbiamo trovato in tempo.", 'davide=crisi'],
          [0, 'Adesso è in un reparto, lo seguono. Starà meglio, dicono. Ci vuole tempo.', 'davide=crisi'],
          [0, 'Fingeva di andare al lavoro da quattro mesi. Non se ne era accorto nessuno. Nemmeno io.', 'davide=crisi'],
          [0, "Parlava di questo posto. Diceva che era l'unico dove non doveva fingere.", 'davide=crisi'],
          [0, 'Quando torna... gli tenga il suo tavolo. Ci tiene.', 'davide=crisi']
        ]
      }
    ],
    rt: []
  },
  {
    id: 'yusuf',
    t: 'Farina e sale',
    d: 'Un ragazzo con la farina sulle maniche analizza i cornetti come un critico. Fa il turno di notte in pasticceria.',
    who: ['yusuf'],
    perk: 'yusuf',
    pt: 'I dolci di Yusuf in vetrina (+4 Atmosfera)',
    end: {
      'yusuf=difendi': { n: 'Casa', perk: 'yusuf', pt: 'I dolci di Yusuf in vetrina (+4 Atmosfera)' },
      'yusuf=lascia': { n: 'Il permesso', perk: 'yusuf', pt: 'I dolci di Yusuf in vetrina (+4 Atmosfera)' }
    },
    ch: [
      {
        t: 'Sfoglia',
        r: 22,
        l: [
          [0, '*spezza il cornetto e lo guarda controluce*'],
          [0, 'Burro vero. Ventisette strati, forse ventotto. Bravi.'],
          [0, 'Scusate, deformazione professionale. Faccio cornetti dalle tre di notte, in una pasticceria qui dietro.'],
          [
            0,
            'Sono arrivato in Italia su una barca. Avevo sedici anni. Il primo cornetto della mia vita me lo ha dato un volontario, sul molo.'
          ],
          [0, 'Era secco. Ma era il cibo più buono del mondo.'],
          {
            c: {
              q: 'Yusuf ti porge metà cornetto, serissimo: «Assaggia. Dimmi cosa senti.»',
              o: [
                {
                  t: '«Cosa sogni di fare, Yusuf?»',
                  f: 'yusuf1=sogno',
                  r: [[0, 'Una pasticceria mia. Metà gambiana, metà napoletana. La gente penserà che sono pazzo.']]
                },
                {
                  t: '«Ti va di assaggiare i nostri dolci e darci i voti?»',
                  f: 'yusuf1=assaggio',
                  r: [
                    [0, 'Davvero? Guarda che sono severo.'],
                    [0, '*assaggia la cheesecake* Sette. Troppa vaniglia. Ma la mangio tutta.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'La voce di mamma',
        r: 40,
        who: ['yusuf', 'rosa'],
        l: [
          [0, "*ascolta un messaggio vocale con il telefono attaccato all'orecchio*"],
          [0, '*sorride, poi si asciuga gli occhi con la manica infarinata*'],
          [1, 'Ragazzo, tutto bene?'],
          [0, 'È mia madre. Mi manda un vocale ogni mattina. Le galline, il mercato, mia sorella che si sposa.'],
          [0, 'Non la vedo da tre anni.'],
          [1, 'Mio figlio è partito per la Germania nel 1970. Con una valigia di cartone.'],
          [1, 'Ogni domenica aspettavo la sua telefonata dal posto pubblico. Tre minuti, poi cadeva la linea.'],
          [0, "E lui com'era, là?"],
          [1, "Solo, all'inizio. Poi qualcuno gli ha offerto un caffè. Così si comincia."],
          [0, 'Sogno una pasticceria mia. Metà gambiana, metà napoletana.', 'yusuf1=sogno'],
          [1, 'Allora la prima sfogliatella la assaggio io.', 'yusuf1=sogno'],
          [0, 'Qui il barista mi fa assaggiare i dolci e io do i voti. Sono severo.', 'yusuf1=assaggio'],
          [1, 'Bravo. I baristi vanno tenuti in riga.', 'yusuf1=assaggio']
        ]
      },
      {
        t: 'Il cliente',
        r: 58,
        l: [
          [0, 'Oggi un signore, qui al bancone, ha detto che rubo il lavoro agli italiani.'],
          [0, 'Ad alta voce. Tutti hanno guardato il pavimento.'],
          [0, 'Io lavoro dalle tre di notte. Faccio i cornetti che lui mangia a colazione.'],
          [0, 'E il permesso di soggiorno scade tra un mese. Se non mi rinnovano il contratto...'],
          {
            c: {
              q: 'Yusuf stringe il bicchiere. Nel locale tutti fanno finta di non ascoltare.',
              o: [
                {
                  t: '«Qui sei a casa. Chi non lo capisce, il caffè può prenderlo altrove.»',
                  f: 'yusuf=difendi',
                  r: [
                    [0, '*alza gli occhi, sorpreso*'],
                    [0, "L'hai detto forte. Ti hanno sentito tutti."],
                    [0, '...Grazie.']
                  ]
                },
                {
                  t: '«Lascia perdere. Non vale la pena arrabbiarsi.»',
                  f: 'yusuf=lascia',
                  r: [
                    [0, 'Lo so. Lascio sempre perdere. Sono bravissimo a lasciar perdere.'],
                    [0, '*abbassa la testa sul bicchiere*']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il permesso',
        r: 76,
        who: ['yusuf', 'rosa'],
        l: [
          [0, 'Signora Rosa! Il permesso! Rinnovato, due anni!'],
          [1, "Lo sapevo. Ho acceso una candela a Sant'Antonio. E una al tuo santo, qualunque sia."],
          [0, 'Quel giorno al bancone qualcuno ha detto che questa è casa mia. Ci ho creduto.', 'yusuf=difendi'],
          [1, "E quel signore non si è più visto. Il caffè l'ha trovato altrove.", 'yusuf=difendi'],
          [0, 'Quel giorno ho lasciato perdere. Ma la notte ci pensavo.', 'yusuf=lascia'],
          [1, 'La prossima volta non lasci perdere. Adesso ci siamo noi.', 'yusuf=lascia'],
          [0, 'Il capo mi ha fatto il contratto fisso. Primo pasticcere del turno di notte.'],
          [0, 'I miei dolci li porto qui. Nella vostra vetrina, se volete.'],
          [1, 'E mandiamo una foto a tua madre. Con tutti noi dietro.'],
          [0, '*registra un vocale ridendo, mentre Rosa saluta in dialetto*']
        ]
      }
    ],
    rt: [
      [
        [0, 'Assaggi questo, signora. Ricetta nuova.'],
        [1, 'Troppo zucchero. Dammene un altro.']
      ],
      [
        [1, 'Hai chiamato tua madre?'],
        [0, 'Stamattina. Ti saluta. Dice che sei la mia nonna italiana.']
      ]
    ]
  },
  {
    id: 'alice',
    t: 'Ricominciare',
    d: 'Una ragazza con un basco entra da sola. È la prima volta da otto mesi.',
    nota: 'Questa storia parla di una malattia grave, un tumore, e di quello che viene dopo le cure: la stanchezza, la paura dei controlli, il sentirsi diversi, le amicizie che cambiano. Se lo stai vivendo tu o una persona che ami, non devi farcela da solo: oltre ai medici che ti seguono, in molti ospedali c’è un servizio di psico-oncologia. In Italia puoi chiamare SOS LILT al numero verde 800 998877, o il servizio di ascolto di AIMaC (840 503579).',
    who: ['alice'],
    rand: { from: 6, p: 0.35 },
    gap: 1,
    perk: 'alice',
    pt: 'Il quaderno dei «prima» e dei «dopo» sul bancone (+4 Atmosfera)',
    end: {
      'alice2=scuola': { n: 'La maestra col basco', perk: 'alice', pt: 'Il quaderno dei «prima» e dei «dopo» sul bancone (+4 Atmosfera)' },
      'alice2=piccolo': { n: 'Una cosa alla volta', perk: 'alice', pt: 'Il quaderno dei «prima» e dei «dopo» sul bancone (+4 Atmosfera)' }
    },
    ch: [
      {
        t: 'Il basco',
        r: 15,
        l: [
          [0, '*entra piano, si guarda intorno, si sistema il basco sulla testa*'],
          [0, 'Una cioccolata, per favore. Calda. Molto calda.'],
          [0, '*si siede nell’angolo, con le spalle al muro, e tiene il cappotto addosso*'],
          [0, 'Scusi se la fisso. È che è la prima volta che esco da sola. Da otto mesi.'],
          [0, 'Ho finito le cure tre settimane fa. Tutti mi dicono: «Adesso sei guarita, festeggia!»'],
          [0, 'Io non mi ricordo più come si fa a stare in mezzo alla gente senza che mi guardino la testa.'],
          {
            c: {
              q: 'Alice stringe la tazza con tutte e due le mani. Fuori piove piano.',
              o: [
                {
                  t: '«Qui non deve festeggiare niente. Può anche solo stare.»',
                  f: 'alice1=stare',
                  r: [
                    [0, '...Solo stare. Mi piace.'],
                    [0, '*si toglie il cappotto, finalmente*'],
                    [0, 'Mi chiamo Alice.']
                  ]
                },
                {
                  t: '«Cosa le piaceva fare, prima?»',
                  f: 'alice1=prima',
                  r: [
                    [0, 'Prima... Studiavo per fare la maestra. Ero al tirocinio, in una prima elementare.'],
                    [0, 'Nessuno me l’aveva più chiesto. Mi chiedono tutti come sto. Mai cosa mi piace.'],
                    [0, 'Mi chiamo Alice.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il quaderno dei «prima»',
        r: 30,
        l: [
          [0, 'Ciao! Sono tornata. Con un quaderno.'],
          [0, '*lo apre: due colonne. Una dice «prima», l’altra è vuota*'],
          [0, 'Prima: nuotavo, ballavo in cucina, insegnavo le vocali a ventidue bambini. Mangiavo la pizza senza pensarci.'],
          [0, 'La colonna del «dopo» non riesco a riempirla. Ho paura di scrivere una cosa e poi perderla di nuovo.', 'alice1=stare'],
          [0, 'Mi hai chiesto cosa mi piaceva. Ci ho pensato tutta la settimana. Ecco la lista.', 'alice1=prima'],
          [0, 'E poi c’è il controllo. Fra dieci giorni. Ogni tre mesi, per anni. Ogni volta è come aspettare una sentenza.'],
          {
            c: {
              q: 'Alice guarda la colonna vuota. «Da dove ricomincio?»',
              o: [
                {
                  t: '«Dal tirocinio. Ai bambini interessa la maestra, non i capelli.»',
                  f: 'alice2=scuola',
                  r: [
                    [0, 'La maestra Elsa mi ha scritto che i bambini chiedono di me. Ogni lunedì.'],
                    [0, 'Va bene. Le scrivo. Prima di cambiare idea.']
                  ]
                },
                {
                  t: '«Da una cosa piccola, solo per lei. Il resto arriva dopo.»',
                  f: 'alice2=piccolo',
                  r: [
                    [0, 'Una cosa piccola... Nuotare. Anche solo due vasche. La domenica mattina, quando non c’è nessuno.'],
                    [0, '*scrive nella colonna del «dopo»: «nuotare». Con la penna, non a matita.*']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il giorno prima',
        r: 45,
        who: ['alice', 'sara'],
        l: [
          [0, '*non ha toccato la cioccolata. Fissa il telefono*'],
          [1, 'Scusa... ma tu sei Alice? Day hospital, terzo piano. Il tè alla menta che non bevevi mai.'],
          [0, 'Sara! L’infermiera che canticchiava. Non ti avevo riconosciuta senza la divisa.'],
          [1, 'Neanch’io ti avevo riconosciuta. Hai un colore, sulle guance. L’ultima volta eri bianca come il lenzuolo.'],
          [0, 'Domani ho il controllo. Non dormo da tre notti. Mi sembra che il pavimento si muova.'],
          [1, 'È normale. Tutti, la notte prima, hanno il pavimento che si muove. Anche chi va benissimo.'],
          {
            c: {
              q: 'Alice si torce le mani. Sara guarda te, come a dire: «Aiutami».',
              o: [
                {
                  t: '«Sara, domani potrebbe accompagnarla?»',
                  f: 'alice3=sara',
                  r: [
                    [1, 'Domani attacco alle due. Il controllo è alle dieci? Allora ti aspetto all’ingresso.'],
                    [0, 'Davvero? ...Grazie. Non volevo andare con mia madre. Piange più lei di me.']
                  ]
                },
                {
                  t: '«Domani, comunque vada, venga qui. Il tavolo è suo.»',
                  f: 'alice3=tavolo',
                  r: [
                    [0, 'Comunque vada. Sì. Avere un posto dove andare dopo... aiuta.'],
                    [1, 'Io passo di qui verso le sei. Se vuoi, ci vediamo.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'I risultati',
        r: 55,
        who: ['alice', 'sara'],
        whoBy: { 'alice3=tavolo': ['alice'] }, // Sara c'è solo se l'ha accompagnata
        l: [
          [0, '*entra di corsa, fradicia, senza ombrello, e ride*'],
          [0, 'Puliti. Gli esami sono puliti.'],
          [1, 'Te l’avevo detto, che il pavimento si muove per tutti.', 'alice3=sara'],
          [
            0,
            'Sara mi ha aspettata all’ingresso. Mi ha tenuto la mano anche quando il medico ha detto «bene». Non ci credevo.',
            'alice3=sara'
          ],
          [0, 'Sono venuta qui subito. Prima ancora di chiamare mia madre. Non diteglielo.', 'alice3=tavolo'],
          [0, 'Non è finita per sempre, lo so. Ma per tre mesi posso respirare.'],
          [0, '*poi tira fuori il telefono, e il sorriso si fa piccolo*'],
          [0, 'Mi ha scritto Giorgia. La mia migliore amica. Durante le cure è sparita. Neanche un messaggio, per otto mesi.'],
          [0, 'Adesso scrive: «Scusami. Non sapevo cosa dirti, e allora non ti ho detto niente».'],
          {
            c: {
              q: 'Alice ti mostra il messaggio. «Le rispondo?»',
              o: [
                {
                  t: '«Rispondile. A volte le persone spariscono per paura, non per cattiveria.»',
                  f: 'alice4=amica',
                  r: [[0, 'Per paura... Anche io avrei avuto paura, al posto suo. Le scrivo: «Vieni a prendere un caffè».']]
                },
                {
                  t: '«Scegli tu chi tenere vicino. Non devi niente a nessuno.»',
                  f: 'alice4=nuovi',
                  r: [[0, 'Non devo niente a nessuno... Le scriverò, forse. Ma quando lo decido io. Intanto mi tengo chi c’è stato.']]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il primo giorno',
        r: 65,
        l: [
          [0, '*entra con un mazzo di disegni sotto il braccio*', 'alice2=scuola'],
          [0, 'Sono tornata a scuola. Il primo giorno un bambino mi ha chiesto perché avevo i capelli così corti.', 'alice2=scuola'],
          [
            0,
            'Gli ho detto: «Sono stata malata, e adesso sto guarendo. Come le piante quando le poti». Lui ha detto: «Ah, ok». E basta.',
            'alice2=scuola'
          ],
          [0, 'Alla fine della mattina mi hanno regalato tutti un disegno. Ventidue fiori. Uno ha anche le gambe.', 'alice2=scuola'],
          [0, '*entra con i capelli umidi e le guance rosse*', 'alice2=piccolo'],
          [0, 'Stamattina venti vasche. Venti! La prima domenica ne ho fatte due e poi ho pianto nello spogliatoio.', 'alice2=piccolo'],
          [0, 'In acqua il corpo non mi sembra più un nemico. Mi sembra quello che mi ha portata fino a qui.', 'alice2=piccolo'],
          [0, 'E a settembre torno al tirocinio. Con calma. Una cosa alla volta.', 'alice2=piccolo'],
          [0, 'Giorgia è venuta con me, ieri. Abbiamo parlato tre ore. Abbiamo pianto. Poi abbiamo ordinato due pizze.', 'alice4=amica'],
          [0, 'Sara mi ha portata a una cena con le sue amiche. Gente nuova, che mi conosce adesso, non com’ero prima.', 'alice4=nuovi'],
          [0, '*apre il quaderno: la colonna del «dopo» è piena, e continua sulla pagina dopo*'],
          [0, 'Sai cosa ho scritto per ultimo? «Togliere il basco».'],
          [0, '*si toglie il basco. I capelli sono corti, ricci, nuovi*'],
          [0, 'Ecco. Sono io. Quella di adesso.']
        ]
      }
    ],
    rt: [
      [
        [0, 'Oggi una giornata normale. Le giornate normali sono bellissime.'],
        [0, '*scrive qualcosa nel quaderno del «dopo»*']
      ],
      [
        [0, 'I capelli mi arrivano alle orecchie. Mia madre dice che sembro un carciofo. Io dico un carciofo felice.'],
        [0, '*ride*']
      ]
    ]
  },
  {
    id: 'leo',
    t: 'Un nonno in prestito',
    d: 'Un ragazzo con le cuffie si siede sempre vicino a chi gioca a scacchi. Non gioca. Guarda.',
    nota: 'Questa storia parla del lutto, vissuto da un ragazzo. Il dolore per la perdita di una persona cara non ha tempi giusti o sbagliati, e non si «supera» da soli: si impara, piano piano, a portarlo. Se stai vivendo una perdita, parlane con qualcuno di cui ti fidi: un familiare, un insegnante, lo psicologo della scuola. Se sei giovane e hai bisogno di parlare con qualcuno, Telefono Azzurro risponde al 19696, anche in chat.',
    who: ['leo'],
    req: ['tazze'],
    rand: { from: 8, p: 0.4 },
    gap: 1,
    perk: 'leo',
    pt: 'La scacchiera di nonno Nino (+3 Atmosfera)',
    end: {
      'leo4=qui': { n: 'Il tavolo del giovedì', perk: 'leo', pt: 'La scacchiera di nonno Nino, sul tavolo del giovedì (+3 Atmosfera)' },
      'leo4=mamma': { n: 'La scacchiera di casa', perk: 'leo', pt: 'La scacchiera di nonno Nino (+3 Atmosfera)' }
    },
    ch: [
      {
        t: 'Le cuffie',
        r: 25,
        l: [
          [0, '*entra con le cuffie in testa e il cappuccio alzato. Si siede e non ordina niente*'],
          [0, '*dopo un po’ si toglie una cuffia. Non c’era nessuna musica*'],
          [0, 'Una cioccolata. Con la panna. ...Lui la prendeva sempre con la panna.'],
          [0, 'Mio nonno. È morto tre settimane fa.'],
          [0, 'Tutti mi dicono che devo andare avanti. Avanti dove? Non c’è un avanti. C’è solo un posto vuoto a tavola.'],
          {
            c: {
              q: 'Leo fissa la panna che si scioglie. Ha quindici anni e la faccia di chi non dorme.',
              o: [
                {
                  t: '«Oggi non devi andare da nessuna parte. Puoi restare qui.»',
                  f: 'leo1=resta',
                  r: [
                    [0, '...Ok.'],
                    [0, '*si toglie anche l’altra cuffia. Resta lì fino alla chiusura, senza dire niente. Ma resta*']
                  ]
                },
                {
                  t: '«Com’era, tuo nonno?»',
                  f: 'leo1=nonno',
                  r: [
                    [0, 'Nonno Nino. Faceva il falegname. Aveva le mani piene di tagli e sapeva di segatura.'],
                    [0, 'Mi ha insegnato gli scacchi. Su una scacchiera fatta da lui. Ogni domenica, da quando avevo sei anni.'],
                    [0, '*sorride, una volta sola, poi si ricorda e smette*']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'La scacchiera',
        r: 40,
        who: ['leo', 'aldo'],
        l: [
          [1, '*ha una scacchiera davanti e gioca da solo, borbottando*'],
          [0, '*si è seduto al tavolo accanto. Guarda la scacchiera di Aldo da dieci minuti*'],
          [1, 'Allora: il cavallo qui, e il re è salvo.'],
          [0, '...Se muove il cavallo, perde la regina in due mosse.'],
          [1, 'Ah sì? Sto imparando, sai. Gioco malissimo. Allora siediti e fammi vedere, giovanotto.'],
          [0, '*si alza di scatto, poi si blocca*  No. Io... non gioco più.'],
          {
            c: {
              q: 'Leo è in piedi a metà strada tra la porta e la scacchiera. Aldo aspetta, senza fretta.',
              o: [
                {
                  t: '«Fagli vedere, Leo. Solo una mossa.»',
                  f: 'leo2=mossa',
                  r: [
                    [0, '*si siede. Prende la regina. Le mani gli tremano*'],
                    [0, 'Così. Vede? Adesso è lei che minaccia il re.'],
                    [1, 'Accidenti. Chi ti ha insegnato?'],
                    [0, '...Mio nonno.']
                  ]
                },
                {
                  t: '«Aldo, gli racconti chi aspettava, quando ordinava due caffè?»',
                  f: 'leo2=lidia',
                  r: [
                    [1, 'Ah. Due caffè, sì. Per un anno ne ho ordinati due. Uno per mia moglie, Lidia. Che non c’era più.'],
                    [0, 'E... adesso?'],
                    [1, 'Adesso uno. Ma non perché l’ho dimenticata. Perché ho imparato a portarla con me invece di aspettarla.'],
                    [0, '*si siede, piano, di fronte a lui*']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'La rabbia',
        r: 55,
        who: ['leo'],
        l: [
          [0, '*sbatte lo zaino sulla sedia*'],
          [0, 'A scuola la prof mi ha detto: «Dovresti averlo superato, ormai». Un mese. Un mese, e dovrei averlo superato.'],
          [0, 'A casa nessuno nomina il nonno. Mia madre piange in bagno con l’acqua aperta, così non si sente. Ma si sente.'],
          [0, '*poi, più piano*  Sa qual è la cosa peggiore? L’ultima volta che l’ho visto, ero al telefono.'],
          [0, 'Lui mi parlava della scacchiera nuova che stava facendo. Io dicevo «sì, sì, nonno», senza alzare gli occhi.'],
          [0, 'Non gli ho neanche detto ciao, per bene.'],
          {
            c: {
              q: 'Leo ha gli occhi lucidi e la mascella stretta. Si vergogna di piangere qui.',
              o: [
                {
                  t: '«Non è colpa tua. Lui lo sapeva, che gli volevi bene. Lo sanno sempre.»',
                  f: 'leo3=colpa',
                  r: [
                    [0, 'Come fa a saperlo?'],
                    [0, '...Mi aveva lasciato la scacchiera sul letto, con un biglietto. «Per Leo, quando vuoi.» Lo sapeva, vero?']
                  ]
                },
                {
                  t: '«Scrivigli quello che non gli hai detto. Anche adesso conta.»',
                  f: 'leo3=lettera',
                  r: [
                    [0, 'Una lettera? A uno che non può leggerla?'],
                    [0, '...Forse serve a me, non a lui. Va bene. Ci provo stasera.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il giovedì',
        r: 65,
        who: ['leo', 'aldo'],
        l: [
          [0, '*appoggia sul tavolo una scacchiera di legno chiaro, un po’ storta, con i pezzi intagliati a mano*'],
          [1, 'Questa l’ha fatta lui?'],
          [0, 'Sì. La regina ha il naso un po’ storto. Diceva che era uguale a mia nonna. Lei si arrabbiava tantissimo.'],
          [1, '*ride*  Lidia mi diceva che giocavo a scacchi come guidavo: male e convinto.'],
          [0, '*ride anche lui. Poi si ferma, sorpreso di aver riso*'],
          [
            0,
            'Gli ho scritto la lettera. L’ho letta al cimitero, piano, così nessuno sentiva. Gli ho detto ciao. Per bene.',
            'leo3=lettera'
          ],
          [0, 'Ho riletto il biglietto. «Per Leo, quando vuoi.» Credo che volesse dire: quando sei pronto.', 'leo3=colpa'],
          [1, 'Scacco. ...No, aspetta. Scacco a me. Accidenti, ragazzo.'],
          [0, 'Posso... posso tornare anche giovedì prossimo?'],
          {
            c: {
              q: 'La scacchiera di nonno Nino è sul tavolo tra loro due. «E questa, dove la teniamo?»',
              o: [
                {
                  t: '«Lasciatela qui, sul vostro tavolo. Ve la custodisco io.»',
                  f: 'leo4=qui',
                  r: [
                    [1, 'Il tavolo del giovedì. Mi piace come suona.'],
                    [0, 'Così ogni giovedì la ritrovo qui. Come se mi aspettasse.']
                  ]
                },
                {
                  t: '«Portala a casa. Insegna a giocare a tua madre.»',
                  f: 'leo4=mamma',
                  r: [
                    [0, 'A mia madre? Lei non sa neanche come si muove il cavallo.'],
                    [0, '...Però era suo padre. Forse le farebbe bene toccarla. Ci provo.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Il nonno in prestito',
        r: 75,
        who: ['leo', 'aldo'],
        l: [
          [0, '*entra senza cuffie. Saluta il bancone con la mano*'],
          [0, 'Il giovedì lo tengo sempre libero. I miei amici lo chiamano «il giorno del nonno».', 'leo4=qui'],
          [1, 'E io ho preso dieci scacco matto di fila sulla scacchiera di Nino. Credo che lui se la rida, da qualche parte.', 'leo4=qui'],
          [
            0,
            'Ho insegnato gli scacchi alla mamma. È negata. Ma la sera giochiamo, e parliamo del nonno. Prima non ci riuscivamo.',
            'leo4=mamma'
          ],
          [0, 'L’altra sera ha riso così forte che è venuto il vicino a vedere. Era una risata da nonno Nino.', 'leo4=mamma'],
          [0, 'Mi manca ancora. Tantissimo. Certi giorni di più.'],
          [1, 'E così sarà sempre. Ma il posto vuoto, piano piano, diventa un posto che tieni per qualcuno.'],
          [1, 'Senti, Leo. Io non sono tuo nonno. Nessuno può esserlo. Ma se vuoi, il giovedì, faccio il nonno in prestito.'],
          [0, '*lo guarda a lungo*'],
          [0, 'Nonno Nino diceva che le scacchiere servono a far parlare la gente che non sa come cominciare.'],
          [0, 'Va bene. Nonno in prestito. Ma la regina col naso storto la muovo io.'],
          [1, '*gli passa una mano tra i capelli, come si fa con i nipoti*']
        ]
      }
    ],
    rt: [
      [
        [1, 'Scacco!'],
        [0, 'Nonno Aldo, quello è il mio re. Il tuo è quello lì, sotto la tazza.']
      ],
      [
        [0, 'Oggi a scuola ho preso otto in storia. Ho pensato: devo dirlo al nonno.'],
        [1, 'E l’hai detto. Sono qui.']
      ]
    ]
  },
  {
    id: 'corrado',
    t: 'L’ultima edizione',
    d: 'Un signore con la barba grigia scrive su un taccuino a ogni tavolo dove si siede. Non lo rilegge mai.',
    who: ['corrado'],
    req: ['davide'],
    rand: { from: 10, p: 0.4 },
    gap: 1,
    perk: 'corrado',
    pt: 'Il giornale del caffè (+3 Atmosfera)',
    end: {
      'corrado4=pioggia': {
        n: 'La Gazzetta della Pioggia',
        perk: 'corrado',
        pt: 'Il giornale del caffè: «La Gazzetta della Pioggia» (+3 Atmosfera)'
      },
      'corrado4=bancone': { n: 'Il Bancone', perk: 'corrado', pt: 'Il giornale del caffè: «Il Bancone» (+3 Atmosfera)' },
      'corrado4=tazzina': { n: 'La Tazzina', perk: 'corrado', pt: 'Il giornale del caffè: «La Tazzina» (+3 Atmosfera)' }
    },
    ch: [
      {
        t: 'Il taccuino',
        r: 30,
        l: [
          [0, '*si siede, apre un taccuino consumato e comincia a scrivere senza ordinare*'],
          [0, 'Un caffè lungo, grazie. Lungo come questa giornata.'],
          [0, '*scrive ancora: «ore 18, la pioggia batte di traverso, al tavolo due una ragazza ride da sola al telefono»*'],
          [0, 'Scusi. È un vizio. Ho fatto il giornalista per trentacinque anni. Le mani continuano anche se il giornale non c’è più.'],
          {
            c: {
              q: 'Corrado chiude il taccuino, come se si vergognasse.',
              o: [
                {
                  t: '«Cosa scrive, se posso chiedere?»',
                  f: 'corrado1=leggi',
                  r: [
                    [0, 'Quello che vedo. Le persone, il tempo, chi entra e chi esce. Una volta lo chiamavano «cronaca».'],
                    [0, 'Adesso lo chiamano «quello strano col taccuino».']
                  ]
                },
                {
                  t: '«Scriva pure. Qui nessuno la disturba.»',
                  f: 'corrado1=lascia',
                  r: [[0, 'Grazie. *riapre il taccuino* Non sa quanto è raro un posto dove si può guardare senza dare fastidio.']]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'La Gazzetta del Quartiere',
        r: 34,
        l: [
          [0, '*tira fuori dal cappotto una pagina di giornale piegata in quattro, ingiallita*'],
          [0, '«La Gazzetta del Quartiere». Ultimo numero. Quarant’anni di storia, chiusa in una mattina con una mail.'],
          [0, 'Ho scritto io la prima pagina, quel giorno. Il titolo era «Grazie a tutti». Non sapevo cos’altro dire.'],
          [0, 'Sa qual è la cosa peggiore? Non è il lavoro. È che le cose succedono lo stesso, e nessuno le racconta più.'],
          {
            c: {
              q: 'Corrado liscia la pagina sul tavolo con il palmo, piano.',
              o: [
                {
                  t: '«Le cose belle che succedono qui meriterebbero qualcuno che le racconti.»',
                  f: 'corrado2=meritano',
                  r: [
                    [0, '*alza gli occhi, sorpreso* ...Lo pensa davvero? Qui? In un bar?'],
                    [0, 'Scusi. In un caffè. È diverso, lo so.']
                  ]
                },
                {
                  t: '«Le manca molto, vero?»',
                  f: 'corrado2=manca',
                  r: [
                    [0, 'Come una mano. Ogni mattina mi alzo e la cerco. Poi mi ricordo.'],
                    [0, 'Ma grazie di averlo chiesto. Mia moglie dice che ne parlo troppo. Lei è la prima che non ha sbuffato.']
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        t: 'Nonna Rosa',
        r: 38,
        who: ['corrado', 'rosa'],
        l: [
          [1, 'Corrado! Corrado della Gazzetta! Sei proprio tu?'],
          [0, 'Rosa... non ci posso credere. Sei rimasta uguale.'],
          [
            1,
            'Bugiardo, come tutti i giornalisti. Nel settantanove mi hai fatto un’intervista per la festa della via. Avevi i capelli fino alle spalle.'
          ],
          [0, 'E tu mi hai fatto assaggiare otto torte prima di rispondere a una domanda.'],
          [1, 'Mi hanno detto che la Gazzetta ha chiuso. E tu che fai, adesso?'],
          [0, 'Niente. Guardo. Scrivo su un taccuino che non legge nessuno.'],
          {
            c: {
              q: 'Nonna Rosa ti lancia un’occhiata complice. Vuole il tuo aiuto per convincerlo a qualcosa.',
              o: [
                {
                  t: '«E se scrivesse del caffè? Delle persone che vengono qui?»',
                  f: 'corrado3=caffe',
                  r: [
                    [1, 'Ecco. L’ha detto meglio di me.'],
                    [0, 'Un giornale... di un caffè? Ma chi lo leggerebbe?'],
                    [1, 'Tutti, Corrado. Qui dentro succede più che in tutta la città.']
                  ]
                },
                {
                  t: '«Il quartiere ha ancora bisogno di qualcuno che lo racconti.»',
                  f: 'corrado3=quartiere',
                  r: [
                    [1, 'Senti cosa dice? Il quartiere, Corrado. Non sei tu che hai chiuso.'],
                    [0, '*resta in silenzio a lungo, girando il cucchiaino*']
                  ]
                }
              ]
            }
          },
          [1, 'Pensaci. Io intanto ti porto una fetta di torta. Una sola, stavolta.']
        ]
      },
      {
        t: 'La prima copia',
        r: 42,
        who: ['corrado', 'davide'],
        l: [
          [0, '*entra con una cartellina sotto il braccio e un sorriso nuovo*'],
          [0, 'Ho scritto. Tre pagine. Le notizie del caffè, quello che sento al bancone, una curiosità, il meteo.'],
          [1, 'Scusate se mi intrometto. Facevo l’impaginatore, prima. Posso vedere?'],
          [0, 'Prego. È un disastro, lo so. Senza un grafico le pagine sembrano lettere della banca.'],
          [
            1,
            '*sposta i fogli, li allinea, prende una penna* Il titolo qui. La notizia grossa sopra. Le dicerie in un riquadro. Così respira.'
          ],
          [0, 'Così... è un giornale. Un giornale vero.'],
          [1, 'Manca solo il nome.'],
          {
            c: {
              q: 'Corrado e Davide ti guardano: il nome del giornale lo devi scegliere tu.',
              o: [
                {
                  t: '«La Gazzetta della Pioggia»',
                  f: 'corrado4=pioggia',
                  r: [[0, 'La Gazzetta della Pioggia. Un po’ come la vecchia, un po’ come questo posto. Mi piace.']]
                },
                { t: '«Il Bancone»', f: 'corrado4=bancone', r: [[1, 'Il Bancone. Corto, si ricorda. Da impaginatore approvo.']] },
                { t: '«La Tazzina»', f: 'corrado4=tazzina', r: [[0, 'La Tazzina. Piccolo, caldo, si legge in un sorso. Perfetto.']] }
              ]
            }
          }
        ]
      },
      {
        t: 'Il primo numero',
        r: 46,
        who: ['corrado', 'davide'],
        l: [
          [0, '*appende al bancone un foglio stampato, con il titolo grande in cima*'],
          [0, 'Numero uno. Venti copie. Le ho lasciate qui sul bancone: chi vuole le prende.'],
          [1, '«La Gazzetta della Pioggia». Il titolo l’ho disegnato io, con le gocce che scendono dalle lettere.', 'corrado4=pioggia'],
          [1, '«Il Bancone». Titolo grosso, nero, in alto. Come i giornali di una volta.', 'corrado4=bancone'],
          [1, '«La Tazzina». Ci ho messo una tazzina al posto della i. Non dirmi niente, lo so che è bellissima.', 'corrado4=tazzina'],
          [1, 'Ne sono rimaste tre. In un’ora. Un signore ne ha prese due: una per la sorella.'],
          [
            0,
            'Una ragazza mi ha fermato: «È vero che i due del tavolo vicino alla finestra stanno insieme?». Le ho detto: «Leggi il prossimo numero».'
          ],
          [0, 'Quarant’anni di Gazzetta e non mi ero mai divertito così.', 'corrado2=meritano'],
          [0, 'Sai, avevi ragione tu. Le cose succedono anche qui. Forse soprattutto qui.', 'corrado2=meritano'],
          [0, 'Mi mancava come una mano, ricordi? Ecco, l’ho ritrovata. Era in un caffè.', 'corrado2=manca'],
          [1, 'Ogni quanto esce?'],
          [0, 'Ogni tre giorni. Notizie, curiosità, dicerie, annunci. Chi vuole mi lascia un biglietto nel barattolo delle mance.'],
          [0, 'E il primo annuncio lo pubblico gratis: «Cercasi lettori. Nessuna esperienza richiesta».']
        ]
      }
    ],
    rt: [
      [
        [0, 'Hai letto il pezzo sulla nebbia di martedì? Davide dice che è il migliore che ho scritto.'],
        [1, 'Ho detto che era il meglio impaginato. È diverso.']
      ],
      [
        [1, 'Il prossimo numero lo facciamo a due colonne. Fidati.'],
        [0, 'Mi fido. Ma le dicerie restano in fondo. Sono il dolce.']
      ]
    ]
  }
];
const CINE = [
  { d: 5.5, txt: 'Una città che non dorme mai. E non smette mai di piovere.' },
  { d: 5.5, txt: 'In una via laterale, una vetrina chiusa da anni.' },
  { d: 6.5, txt: 'Finché qualcuno decide di riaccendere le luci.' },
  { d: 5.8, txt: 'Un caffè alla volta. Una storia alla volta.' }
];
