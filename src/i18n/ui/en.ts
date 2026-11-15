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
    'Alejandro Lugo is a full-stack developer who turns ideas into products that scale: from the first conversation to the release.',
  'site.defaultTitle': '{person} — {role} · {brand}',

  // Layout and navigation
  'og.defaultAlt':
    'Alejandro Lugo, full-stack developer: “Grounded in code. Built to explore.” beside the planet Jupiter.',
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
  'hero.latest': 'Latest project:',
  'hero.backToTop': 'Back to top',
  'hero.arrivalPoint': 'Arrival point',
  'home.workTitle': 'Things I’ve shipped.',
  'home.seeAllProjects': 'See all projects',
  'home.workEmpty': 'Case studies are being written. Meanwhile, the code lives on',
  'home.processTitle': 'How I work.',
  'home.process1Title': 'Understand the problem',
  'home.process1Body':
    'Talk to the people doing the work, map the current flow and find where it actually breaks before proposing screens.',
  'home.process1Example':
    'frontend work blocked on APIs that did not exist yet, and json-server fell short for real screens.',
  'home.process2Title': 'Design the solution',
  'home.process2Body':
    'Sketch the main flow, agree on data contracts early and decide what to leave out of the first version.',
  'home.process2Example': 'the scoring and the timers were formulas on paper before they were code.',
  'home.process3Title': 'Build and iterate',
  'home.process3Body':
    'Ship a usable slice, watch how it is used and refine. Interfaces and APIs evolve together.',
  'home.process3Example': 'false positives in the first release led to diagnostics scoped to their section.',
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
  'glance.outcome': 'Outcome',
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
    'I’m {person}, a full-stack developer. Before any screen or endpoint, I want to understand the business: how the work is organised, who does what, and what the person behind it is trying to build.',
  'about.approach':
    'Good tools are the natural expression of that order. So the first job is to line up the ideas, the founder’s and the team’s, into a clear structure; the software grows out of it, and it is designed from the start to scale with the business instead of being rebuilt every time it grows.',
  'about.nameBefore': 'The name',
  'about.nameAfter':
    'means “landed on Jupiter”: a reminder to keep exploring, but to do it on solid ground. In practice that means curiosity about new tools and a stubborn preference for things that are tested, documented and easy to change.',
  'about.workWith': 'What I work with',

  // Contact
  'contact.title': 'Contact',
  'contact.heading': 'Let’s {word}.',
  'contact.headingWord': 'talk',
  'contact.description': 'How to reach {person}.',
  'contact.intro': 'Tell me what you’re building and where you’re stuck. I usually reply within a few days.',
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
