// Novità del gioco raccontate da Nonna Rosa, quando il giocatore riapre il gioco.
// Una riga per ogni aggiornamento che interessa al giocatore (non le cose tecniche nostre).
// In fondo le più nuove. L'id non va mai cambiato: serve a ricordare cosa il giocatore ha già sentito.
const NOVITA = [
  {
    id: 'regia',
    t: 'Ho chiesto ai clienti di raccontarti una cosa alla volta. Quando qualcuno vuole parlarti, vedrai una stellina sopra la sua testa: toccalo quando sei pronta, e il locale ti aspetta.'
  },
  {
    id: 'vite',
    t: 'Ho conosciuto tanta gente nuova, con tante storie da raccontare. E ognuno ha la sua, sai? Nessuno vive la vita di un altro.'
  },
  {
    id: 'calendario',
    t: 'Adesso il caffè ha il suo calendario: le stagioni, le feste, i compleanni dei tuoi habitué. Dai un’occhiata al pannello «Giorno», ci trovi anche chi festeggia domani.'
  },
  {
    id: 'comodita',
    t: 'Nelle impostazioni ora puoi regolare la musica, gli effetti e la pioggia, uno per uno. E anche la velocità del testo, o farlo più grande. Per i miei occhi è una benedizione.'
  },
  {
    id: 'alice',
    t: 'Uno di questi giorni passerà una ragazza con un basco azzurro. Ha attraversato un periodo difficile. Falla stare, se ne ha bisogno.'
  },
  {
    id: 'leo',
    t: 'C’è un ragazzo che ha perso da poco il suo nonno. Quando Aldo sarà di casa, prima o poi lo vedrai vicino al tavolo degli scacchi. Trattamelo bene.'
  },
  {
    id: 'tema',
    t: 'Ho rimesso a nuovo un po’ di cose: le icone nei pannelli, le monete col chicco di caffè, e una ghirlanda lungo i muri che cambia con le stagioni. D’inverno si accendono le lucine!'
  },
  {
    id: 'diario',
    t: 'Quando torni dopo un po’, ti racconto io cosa è successo al caffè mentre non c’eri. Ma le storie aspettano te: quelle succedono solo quando ci sei.'
  },
  {
    id: 'mente',
    t: 'Ho notato una cosa, cara: i tuoi clienti hanno ognuno il suo carattere. Si ricordano le cose, si raccontano le novità, ogni tanto bisticciano e poi fanno pace. Ascoltali: non dicono mai due volte la stessa cosa. E nel Diario c’è scritto com’è fatto ognuno.'
  },
  {
    id: 'aggiornamenti',
    t: 'Da oggi, quando sistemo qualcosa, lo trovi subito: il caffè si rinfresca da solo, in un momento tranquillo, senza perdere niente. Io poi ti racconto cosa è cambiato.'
  },
  {
    id: 'mondo',
    t: 'Sai, cara, il quartiere ormai vive da solo. Ognuno insegue un suo sogno, a volte ti chiederanno un parere, e succedono storie che nessuno ha scritto: amici in pensiero, cotte da confessare, vecchi rivali allo stesso tavolo. Le trovi nel Diario, alla voce Vite.'
  },
  {
    id: 'cortesie',
    t: 'E hanno imparato la gentilezza: si offrono il caffè, si cedono il posto, si prestano l’ombrello. Chi riceve, di solito ricambia. Chi non ricambia mai... beh, se lo ricordano.'
  },
  {
    id: 'corrado',
    t: 'Ti ricordi della vecchia Gazzetta del Quartiere? Ha chiuso. Il suo giornalista, Corrado, gira con un taccuino e non sa più a chi raccontare le cose. Se passa, fallo sedere. E chiedigli cosa scrive.'
  },
  {
    id: 'parole',
    t: 'Ho l’impressione che i tuoi clienti abbiano sempre qualcosa di nuovo da dire. Pensieri, chiacchiere, perfino le dicerie sul giornale: non ne senti mai due uguali. Come al mercato, cara.'
  }
];

// Il diario della notte: piccole cose successe mentre il gioco era chiuso.
// Solo cose leggere, senza effetti sul gioco: le storie e le vite succedono solo davanti al giocatore.
// {n} = un habitué, {A} e {B} = una coppia, {fav} = cosa ordina di solito, {o} = accordo maschile/femminile.
const NOTTE = {
  sempre: [
    'Stanotte ha piovuto senza smettere. Davanti alla porta c’è una pozzanghera a forma di cuore.',
    'Un gatto randagio ha dormito sotto la tettoia. Stamattina se n’è andato, ma ha lasciato le impronte sul vetro.',
    'Qualcuno ha lasciato un mazzo di margherite sulla soglia. Senza biglietto.',
    'Il lampione davanti al locale ha tremolato tutta la notte, come se volesse dire qualcosa.',
    'Il fornaio dell’angolo ha lasciato due cornetti avvolti nella carta, appesi alla maniglia.',
    'Un bambino ha disegnato col dito una tazza sul vetro appannato.',
    'Il vento ha portato una cartolina da chissà dove. C’è scritto solo «Ci vediamo presto».'
  ],
  gatto: [
    'Il gatto ha dormito tutta la notte sul bancone, sopra il registratore di cassa.',
    'Il gatto ha fatto la guardia alla porta. Ha catturato una foglia.'
  ],
  habitue: [
    '{n} è passat{o}, ha trovato chiuso e ha lasciato un biglietto sotto la porta: «Torno domani. Tienimi il tavolo».',
    '{n} è passat{o} di qui sotto la pioggia e ha salutato la vetrina con la mano.',
    '{n} ha lasciato un biglietto: «Mi è mancato il mio {fav}».',
    '{n} si è fermat{o} sotto la tettoia ad aspettare che spiovesse, guardando dentro il locale buio.'
  ],
  coppia: [
    '{A} e {B} si sono riparati sotto la tettoia, abbracciati, finché non ha smesso di piovere.',
    '{A} e {B} sono passati di qui tenendosi per mano. Hanno indicato il loro tavolo, ridendo.'
  ],
  // una cosa tutta loro, per i personaggi che sono di casa
  chiave: {
    rosa: 'Nonna Rosa ha annaffiato le piante del locale dalla finestra di sopra. Dice che avevano sete.',
    mia: 'Mia ha disegnato qualcosa sul vetro appannato: un cuore e una tazza.',
    luca: 'Qualcuno ha suonato la chitarra sotto la tettoia, piano piano. Sembrava Luca.',
    aldo: 'Aldo ha lasciato sul tavolo del giovedì un biglietto: «Due cucchiaini, come sempre».',
    leo: 'Leo è passato con la scacchiera sotto il braccio. Ha aspettato un po’, poi è andato a casa.',
    alice: 'Alice ha lasciato un disegno di uno dei suoi bambini infilato nella porta: un sole con le gambe.',
    davide: 'Davide è passato a piedi, fischiettando. Lo ha visto il fornaio.',
    giada: 'Giada ha fatto uno schizzo della vetrina al buio. Dice che te lo porta domani.',
    kenji: 'Kenji ha lasciato davanti alla porta un piccolo pacchetto: biscotti al tè verde.',
    tommy: 'Tommy ha provato una battuta nuova alla vetrina. La vetrina non ha riso.',
    yusuf: 'Yusuf è passato all’alba, dopo il turno al forno. Ha lasciato un cornetto ancora caldo.',
    sara: 'Sara è passata dopo il turno di notte, ha guardato dentro, e ha sorriso.'
  }
};
