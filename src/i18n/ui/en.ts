/**
 * Interface strings in the default locale. This file is the source of truth for the key set:
 * every other locale must provide exactly these keys (enforced by the type in ui/index.ts).
 * Placeholders use `{name}` and are filled by `t(key, { name })`.
 */
export const en = {
  // Site-wide
  'site.role': 'Full-stack developer',
  'site.focus': 'turning ideas into products that scale',
  'site.tagline':
    'From the first conversation to the release: product, interface, backend and the tooling that keeps it running.',
  'site.description':
    'Heber Alejandro Lugo is a full-stack developer who turns ideas into products that scale: from the first conversation to the release.',
  'site.defaultTitle': '{person} · {brand}',

  // Layout and navigation
  'og.defaultAlt':
    'Heber Alejandro Lugo, full-stack developer: “Grounded in code. Built to explore.” beside the planet Jupiter.',
  'a11y.newTab': '(opens in a new tab)',
  'a11y.skipToContent': 'Skip to content',
  'nav.label': 'Main',
  'nav.menu': 'Menu',
  'nav.home': '{brand} — home',
  'nav.work': 'Work',
  'nav.notes': 'Notes',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.language': 'Language',
  'nav.switchTo': 'Read this page in {language}',
  'footer.label': 'Footer',

  // Home
  'hero.titleLine1': 'Grounded in code.',
  'hero.titleLine2': 'Built to',
  'hero.titleHighlight': 'explore.',
  'hero.identity': '{role}, focused on {focus}.',
  'hero.primaryCta': 'Explore my work',
  'hero.secondaryCta': 'Let’s talk',
  'hero.latest': 'Featured project:',
  'hero.backToTop': 'Back to top',
  'hero.arrivalPoint': 'Arrival point',
  'home.workTitle': 'Things I’ve shipped.',
  'home.seeAllProjects': 'See all projects',
  'home.workEmpty': 'Case studies are being written. Meanwhile, the code lives on',
  'home.processTitle': 'How I work.',
  'home.process1Title': 'Understand the need',
  'home.process1Body':
    'Talk to whoever does the work or has the idea, map the current flow or the one they want, and find the weak points, the failures and the room to grow before designing anything.',
  'home.process2Title': 'Scope the first version',
  'home.process2Body':
    'Turn that map into a proof of concept and an MVP that solve the immediate need, without losing sight of the growth found in step 01: that is where scalability starts.',
  'home.process3Title': 'Build, measure, grow',
  'home.process3Body':
    'Ship a usable slice, watch how it is really used and let the product evolve in small steps, interface and backend together, on a base that does not need to be rewritten to grow.',
  'home.aboutTitle': 'Product first. Tools that grow with it.',
  'home.aboutBody':
    'I’m {person}, a full-stack developer. I start with the business and the product: how the work is organised and what the person behind it wants to build. The tools should be the natural expression of that order, so first we line up the ideas, then I build on a base that can grow. Scalability isn’t an afterthought; it’s part of the first design.',
  'home.coreStack': 'Core stack',
  'home.moreAboutMe': 'More about me',

  // Carousel and cards
  'carousel.label': 'Selected projects',
  'carousel.previous': 'Previous projects',
  'carousel.next': 'Next projects',
  'card.viewProject': 'View project',
  'card.categories': 'Categories',
  'card.screenshotPending': 'Screenshot pending',
  'card.draft': 'Draft',
  'card.draftDevOnly': 'Draft · visible only in development',
  'card.inDefaultLanguage': 'In English',

  // Work
  'notes.title': 'Notes',
  'notes.heading': 'Notes, {word} as I understand them.',
  'notes.headingWord': 'drawn',
  'notes.description': 'Short technical notes: how something works, read one value at a time.',
  'notes.intro':
    'Short technical notes on what I use every day, with diagrams you can follow one value at a time.',
  'notes.feed': 'RSS feed',
  'note.published': 'Published {date}',
  'note.updated': 'Updated {date}',
  'note.readingTime': '{minutes} min read',
  'note.all': 'All notes',
  'note.tags': 'Topics',
  'newsletter.title': 'Get new notes by email',
  'newsletter.text':
    'One email when a note is published, in the language you choose. Unsubscribe from any email.',
  'newsletter.footer': 'New notes by email',
  'newsletter.email': 'Email address',
  'newsletter.language': 'Language',
  'newsletter.submit': 'Subscribe',
  'newsletter.consent':
    'You’ll get an email to confirm first. Your address is kept by Brevo, the service that sends the notes, and used only for them.',
  'newsletter.pendingTitle': 'Check your inbox',
  'newsletter.pendingBody':
    'I’ve sent you an email to confirm the subscription. Open it and click the link; nothing else arrives until you do.',
  'newsletter.confirmedTitle': 'You’re subscribed',
  'newsletter.confirmedBody': 'Each new note will reach your inbox. Every email has a link to unsubscribe.',
  'newsletter.backToNotes': 'Back to the notes',
  'work.title': 'Work',
  'work.heading': 'Things I’ve {word}.',
  'work.headingWord': 'shipped',
  'work.description': 'Case studies: the problem, my part, the decisions and what I learned.',
  'work.intro':
    'Each project explains the problem, my part in it, the decisions behind it and what I’d do differently.',
  'work.empty': 'Case studies are on their way.',

  // Case study
  'project.liveDemo': 'Live demo',
  'project.playground': 'Explore the playground',
  'project.install': 'View on the Marketplace',
  'project.sourceCode': 'Source code',
  'project.documentation': 'Documentation',
  'project.tryItLive': 'Try it live →',
  'project.onThisPage': 'On this page',
  'project.stack': 'Stack',
  'project.gallery': 'Gallery',
  'gallery.label': 'Project gallery',
  'gallery.open': 'Open image {n} of {total}: {caption}',
  'gallery.show': 'Show image {n} of {total}: {caption}',
  'gallery.pause': 'Pause orbit',
  'viewer.label': 'Image viewer',
  'viewer.close': 'Close',
  'viewer.previous': 'Previous image',
  'viewer.next': 'Next image',
  'viewer.zoomIn': 'Zoom in',
  'viewer.zoomOut': 'Zoom out',
  'viewer.rotate': 'Rotate 90°',
  'viewer.reset': 'Reset view',
  'viewer.counter': '{n} / {total}',
  'viewer.hint': 'Scroll or pinch to zoom, drag to move.',
  'project.next': 'Next project',
  'glance.label': 'At a glance',
  'glance.problem': 'Problem',
  'glance.contribution': 'My part',
  'glance.outcome': 'What I delivered',
  'project.meta.type': 'Type',
  'project.meta.period': 'Period',
  'project.meta.status': 'Status',
  'project.meta.role': 'Role',
  'project.meta.context': 'Context',
  'project.privateProduct': 'Private product',
  'project.type.personal': 'Personal project',
  'project.type.open-source': 'Open source',
  'project.type.professional': 'Professional work',
  'project.status.active': 'Active',
  'project.status.completed': 'Completed',
  'project.status.prototype': 'Prototype',
  'project.status.paused': 'Paused',
  'stack.layer': 'Layer',
  'stack.technology': 'Technology',
  'stack.why': 'Why',
  'stack.layer.interface': 'Interface',
  'stack.layer.api': 'API',
  'stack.layer.data': 'Data',
  'stack.layer.runtime': 'Runtime',
  'stack.layer.quality': 'Quality',
  'stack.layer.infrastructure': 'Infrastructure',
  'stack.layer.tooling': 'Tooling',
  'stack.usage.production': 'Production',
  'stack.usage.prototype': 'Prototype',
  'stack.usage.exploration': 'Exploration',

  // Markdoc tags
  'callout.note': 'Note',
  'callout.constraint': 'Constraint',
  'callout.learning': 'Learned',
  'callout.editorial': 'Editorial note',
  'decision.label': 'Decision: {decision}',
  'decision.problem': 'Problem',
  'decision.decision': 'Decision',
  'decision.alternatives': 'Alternatives',
  'decision.tradeoff': 'Trade-off',
  'decision.evidence': 'Evidence',
  'decision.outlook': 'Outlook',

  // About
  'about.title': 'About',
  'about.heading': 'Product {word}.',
  'about.headingWord': 'first',
  'about.description': 'About {person}: {role} focused on {focus}.',
  'about.lead':
    'I’m {person}, a full-stack developer with a focus on frontend and product. Before designing a screen or building an API, I want to understand the people who will use it: how they work, what gets in their way, and what they need to achieve.',
  'about.approach':
    'My work combines development, functional analysis and product ownership. I turn business needs into clear workflows, interfaces and technical decisions, working through what belongs in the first version and what can wait. I aim to build software that solves today’s problem and remains easy to change as the product evolves.',
  'about.background':
    'My background is in telecommunications and electronics engineering. I started programming close to the hardware before moving into cross-platform and web development. That experience shaped how I approach software: understanding how the parts fit together, tracing problems across layers, and balancing technical choices with practical constraints.',
  'about.today':
    'Today, I work primarily with Angular and React on the frontend, alongside Spring Boot and Node.js on the backend. What interests me most is connecting the whole process, from understanding a problem to putting a useful tool in someone’s hands.',
  'about.workWith': 'What I work with',

  // Contact
  'contact.title': 'Contact',
  'contact.heading': 'Let’s {word}.',
  'contact.headingWord': 'talk',
  'contact.description': 'How to reach {person}.',
  'contact.intro':
    'Building a product, improving an internal tool, looking for technical collaboration or for someone to join your team: tell me the context and what you need to solve. I usually reply within a few days.',
  'contact.email': 'Email',
  'cta.titleBefore': 'Have',
  'cta.words': 'a product|an idea|a project|a business',
  'cta.titleAfter': 'in mind? Let’s talk.',
  'cta.body':
    'An idea on a napkin, a process that slows your team down, a product that needs another pair of hands: tell me about it. I read every message and answer with honest questions, not a sales pitch.',
  'cta.email': 'Email me',
  'cta.otherWays': 'Other ways to reach me',

  // 404
  'notFound.title': 'Page not found',
  'notFound.heading': 'This orbit is empty.',
  'notFound.body':
    'The page you’re looking for doesn’t exist or has moved. Check the address, or go back to familiar ground.',
  'notFound.englishOnly': 'This page is only available in English.',
  'notFound.readInEnglish': 'Read it in English',
  'notFound.home': 'Go to home',
  'notFound.projects': 'See projects',
} as const;
