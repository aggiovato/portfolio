import type { UiDictionary } from './index';

/** Italian interface strings. The type forces the exact key set of `en.ts`. */
export const it: UiDictionary = {
  // Site-wide
  'site.role': 'Sviluppatore full-stack',
  'site.focus': 'trasformare idee in prodotti che crescono',
  'site.tagline':
    'Dalla prima conversazione al rilascio: prodotto, interfaccia, backend e gli strumenti che lo tengono in piedi.',
  'site.description':
    'Heber Alejandro Lugo è uno sviluppatore full-stack che trasforma idee in prodotti che crescono: dalla prima conversazione al rilascio.',
  'site.defaultTitle': '{person} · {brand}',

  // Layout and navigation
  'og.defaultAlt':
    'Heber Alejandro Lugo, sviluppatore full-stack: «Radicato nel codice. Fatto per esplorare.» accanto al pianeta Giove.',
  'a11y.newTab': '(si apre in una nuova scheda)',
  'a11y.skipToContent': 'Vai al contenuto',
  'nav.label': 'Principale',
  'nav.menu': 'Menu',
  'nav.home': '{brand} — home',
  'nav.work': 'Progetti',
  'nav.notes': 'Note',
  'nav.about': 'Chi sono',
  'nav.contact': 'Contatti',
  'nav.language': 'Lingua',
  'nav.switchTo': 'Leggi questa pagina in {language}',
  'footer.label': 'Piè di pagina',

  // Home
  'hero.titleLine1': 'Radicato nel codice.',
  'hero.titleLine2': 'Fatto per',
  'hero.titleHighlight': 'esplorare.',
  'hero.identity': '{role}: mi occupo di {focus}.',
  'hero.primaryCta': 'Esplora i miei progetti',
  'hero.secondaryCta': 'Parliamone',
  'hero.latest': 'Progetto in evidenza:',
  'hero.backToTop': 'Torna su',
  'hero.arrivalPoint': 'Punto di arrivo',
  'home.workTitle': 'Cose che ho realizzato.',
  'home.seeAllProjects': 'Vedi tutti i progetti',
  'home.workEmpty': 'I casi di studio sono in lavorazione. Nel frattempo, il codice è su',
  'home.processTitle': 'Come lavoro.',
  'home.process1Title': 'Capire il bisogno',
  'home.process1Body':
    'Parlare con chi fa il lavoro o ha l’idea, mappare il flusso attuale o quello desiderato e trovare i punti deboli, i guasti e le occasioni di crescita prima di progettare qualsiasi cosa.',
  'home.process2Title': 'Delimitare la prima versione',
  'home.process2Body':
    'Trasformare quella mappa in un proof of concept e in un MVP che risolvano il bisogno immediato, senza perdere di vista la crescita emersa al passo 01: è lì che inizia la scalabilità.',
  'home.process3Title': 'Costruire, misurare, crescere',
  'home.process3Body':
    'Consegnare una parte usabile, osservare come viene usata davvero e far evolvere il prodotto a piccoli passi, interfaccia e backend insieme, su una base che non vada rifatta per crescere.',
  'home.aboutTitle': 'Prima il prodotto. Strumenti che crescono insieme.',
  'home.aboutBody':
    'Sono {person}, sviluppatore full-stack. Parto dal business e dal prodotto: come è organizzato il lavoro e cosa vuole costruire la persona che c’è dietro. Gli strumenti dovrebbero essere l’espressione naturale di quell’ordine, quindi prima allineiamo le idee e poi costruisco su una base che possa crescere. La scalabilità non è un ripensamento: fa parte del primo progetto.',
  'home.coreStack': 'Stack principale',
  'home.moreAboutMe': 'Di più su di me',

  // Carousel and cards
  'carousel.label': 'Progetti selezionati',
  'carousel.previous': 'Progetti precedenti',
  'carousel.next': 'Progetti successivi',
  'card.viewProject': 'Vedi il progetto',
  'card.categories': 'Categorie',
  'card.screenshotPending': 'Screenshot in arrivo',
  'card.draft': 'Bozza',
  'card.draftDevOnly': 'Bozza · visibile solo in sviluppo',
  'card.inDefaultLanguage': 'In inglese',

  // Work
  'notes.title': 'Note',
  'notes.heading': 'Note, {word} come le capisco.',
  'notes.headingWord': 'disegnate',
  'notes.description': 'Brevi note tecniche: come funziona qualcosa, un valore alla volta.',
  'notes.intro':
    'Brevi note tecniche su ciò che uso ogni giorno, con diagrammi da seguire un valore alla volta.',
  'notes.feed': 'Feed RSS',
  'note.published': 'Pubblicata il {date}',
  'note.updated': 'Aggiornata il {date}',
  'note.readingTime': '{minutes} min di lettura',
  'note.all': 'Tutte le note',
  'note.tags': 'Argomenti',
  'quiz.title': 'Mettiti alla prova',
  'quiz.intro': 'Scegli una risposta per vedere se è giusta, e perché.',
  'quiz.correct': 'Corretta',
  'quiz.incorrect': 'Non proprio',
  'quiz.score': '{correct} su {total} corrette',
  'quiz.retry': 'Riprova',
  'newsletter.title': 'Ricevi le nuove note via email',
  'newsletter.text':
    'Un’email quando pubblico una nota, nella lingua che scegli. Puoi disiscriverti da qualsiasi email.',
  'newsletter.footer': 'Nuove note via email',
  'newsletter.email': 'Indirizzo email',
  'newsletter.language': 'Lingua',
  'newsletter.submit': 'Iscriviti',
  'newsletter.consent':
    'Prima riceverai un’email di conferma. Il tuo indirizzo è custodito da Brevo, il servizio che invia le note, e utilizzato esclusivamente per inviarti le nuove note.',
  'newsletter.pendingTitle': 'Controlla la posta',
  'newsletter.pendingBody':
    'Ti ho inviato un’email per confermare l’iscrizione. Aprila e clicca sul link; fino ad allora non riceverai altro.',
  'newsletter.confirmedTitle': 'Iscrizione completata',
  'newsletter.confirmedBody':
    'Ogni nuova nota arriverà nella tua casella. Ogni email ha un link per disiscriverti.',
  'newsletter.backToNotes': 'Torna alle note',
  'work.title': 'Progetti',
  'work.heading': 'Cose che ho {word}.',
  'work.headingWord': 'realizzato',
  'work.description': 'Casi di studio: il problema, il mio ruolo, le decisioni e cosa ho imparato.',
  'work.intro':
    'Ogni progetto spiega il problema, il mio ruolo, le decisioni prese e cosa farei diversamente.',
  'work.empty': 'I casi di studio sono in arrivo.',

  // Case study
  'project.liveDemo': 'Demo dal vivo',
  'project.playground': 'Esplora il playground',
  'project.install': 'Vedi sul Marketplace',
  'project.sourceCode': 'Codice sorgente',
  'project.documentation': 'Documentazione',
  'project.tryItLive': 'Provalo dal vivo →',
  'project.onThisPage': 'In questa pagina',
  'project.stack': 'Stack',
  'project.gallery': 'Galleria',
  'gallery.label': 'Galleria del progetto',
  'gallery.open': 'Apri l’immagine {n} di {total}: {caption}',
  'gallery.show': 'Mostra l’immagine {n} di {total}: {caption}',
  'gallery.pause': 'Metti in pausa l’orbita',
  'viewer.label': 'Visualizzatore di immagini',
  'viewer.close': 'Chiudi',
  'viewer.previous': 'Immagine precedente',
  'viewer.next': 'Immagine successiva',
  'viewer.zoomIn': 'Ingrandisci',
  'viewer.zoomOut': 'Riduci',
  'viewer.rotate': 'Ruota di 90°',
  'viewer.reset': 'Ripristina vista',
  'viewer.counter': '{n} / {total}',
  'viewer.hint': 'Usa la rotella o pizzica per lo zoom; trascina per spostare.',
  'project.next': 'Progetto successivo',
  'glance.label': 'In breve',
  'glance.problem': 'Problema',
  'glance.contribution': 'Il mio ruolo',
  'glance.outcome': 'Cosa ho consegnato',
  'project.meta.type': 'Tipo',
  'project.meta.period': 'Periodo',
  'project.meta.status': 'Stato',
  'project.meta.release': 'Ultima versione',
  'project.meta.role': 'Ruolo',
  'project.meta.context': 'Contesto',
  'project.privateProduct': 'Prodotto privato',
  'project.type.personal': 'Progetto personale',
  'project.type.open-source': 'Open source',
  'project.type.professional': 'Lavoro professionale',
  'project.status.active': 'Attivo',
  'project.status.completed': 'Completato',
  'project.status.prototype': 'Prototipo',
  'project.status.paused': 'In pausa',
  'stack.layer': 'Livello',
  'stack.technology': 'Tecnologia',
  'stack.why': 'Perché',
  'stack.layer.interface': 'Interfaccia',
  'stack.layer.api': 'API',
  'stack.layer.data': 'Dati',
  'stack.layer.runtime': 'Runtime',
  'stack.layer.quality': 'Qualità',
  'stack.layer.infrastructure': 'Infrastruttura',
  'stack.layer.tooling': 'Strumenti',
  'stack.usage.production': 'Produzione',
  'stack.usage.prototype': 'Prototipo',
  'stack.usage.exploration': 'Esplorazione',

  // Markdoc tags
  'callout.note': 'Nota',
  'callout.constraint': 'Vincolo',
  'callout.learning': 'Imparato',
  'callout.editorial': 'Nota editoriale',
  'decision.label': 'Decisione: {decision}',
  'decision.problem': 'Problema',
  'decision.decision': 'Decisione',
  'decision.alternatives': 'Alternative',
  'decision.tradeoff': 'Compromesso',
  'decision.evidence': 'Evidenze',
  'decision.outlook': 'Prospettiva',

  // About
  'about.title': 'Chi sono',
  'about.heading': 'Prima il {word}.',
  'about.headingWord': 'prodotto',
  'about.description': 'Chi è {person}: {role}, si occupa di {focus}.',
  'about.lead':
    'Sono {person}, sviluppatore full-stack con un focus su frontend e prodotto. Prima di progettare una schermata o costruire un’API, voglio capire le persone che la useranno: come lavorano, cosa le ostacola e cosa devono ottenere.',
  'about.approach':
    'Il mio lavoro unisce sviluppo, analisi funzionale e responsabilità di prodotto. Trasformo le esigenze di business in flussi, interfacce e decisioni tecniche chiare, decidendo cosa entra nella prima versione e cosa può aspettare. Cerco di costruire software che risolva il problema di oggi e resti facile da cambiare man mano che il prodotto evolve.',
  'about.background':
    'La mia formazione è in ingegneria delle telecomunicazioni e dell’elettronica. Ho iniziato a programmare vicino all’hardware prima di passare allo sviluppo multipiattaforma e web. Quell’esperienza ha plasmato il mio modo di affrontare il software: capire come si incastrano le parti, seguire un problema attraverso i livelli e bilanciare le scelte tecniche con i vincoli reali.',
  'about.today':
    'Oggi lavoro soprattutto con Angular e React sul frontend, insieme a Spring Boot e Node.js sul backend. Ciò che mi interessa di più è collegare l’intero processo: dal capire un problema al mettere uno strumento utile nelle mani di qualcuno.',
  'about.workWith': 'Con cosa lavoro',

  // Contact
  'contact.title': 'Contatti',
  'contact.heading': '{word}.',
  'contact.headingWord': 'Parliamone',
  'contact.description': 'Come contattare {person}.',
  'contact.intro':
    'Stai costruendo un prodotto, migliorando uno strumento interno, cerchi una collaborazione tecnica o qualcuno per il tuo team: raccontami il contesto e cosa ti serve risolvere. Di solito rispondo in pochi giorni.',
  'contact.email': 'Email',
  'cta.titleBefore': 'Hai',
  'cta.words': 'un prodotto|un’idea|un progetto|un’attività',
  'cta.titleAfter': 'in mente? Parliamone.',
  'cta.body':
    'Un’idea scritta su un tovagliolo, un processo che rallenta il tuo team, un prodotto che ha bisogno di altre mani: raccontamelo. Leggo ogni messaggio e rispondo con domande sincere, non con un discorso di vendita.',
  'cta.email': 'Scrivimi',
  'cta.otherWays': 'Altri modi per contattarmi',

  // 404
  'notFound.title': 'Pagina non trovata',
  'notFound.heading': 'Quest’orbita è vuota.',
  'notFound.body':
    'La pagina che cerchi non esiste o è stata spostata. Controlla l’indirizzo o torna su un terreno conosciuto.',
  'notFound.englishOnly': 'Questa pagina è disponibile solo in inglese.',
  'notFound.readInEnglish': 'Leggilo in inglese',
  'notFound.home': 'Vai alla home',
  'notFound.projects': 'Vedi i progetti',
};
