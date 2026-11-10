/**
 * Interface strings in the default locale. This file is the source of truth for the key set:
 * every other locale must provide exactly these keys (enforced by the type in ui/index.ts).
 * Placeholders use `{name}` and are filled by `t(key, { name })`.
 */
export const en = {
  // Site-wide
  'site.role': 'Full-stack developer',
  'site.focus': 'Frontend and product',
  'site.tagline': 'Thoughtful interfaces. Reliable systems. Ideas brought to life.',
  'site.description':
    'Alejandro Lugo is a full-stack developer focused on frontend and product: thoughtful interfaces, reliable systems and ideas brought to life.',
  'site.defaultTitle': '{person} — {role} · {brand}',

  // Layout and navigation
  'a11y.skipToContent': 'Skip to content',
  'nav.label': 'Main',
  'nav.menu': 'Menu',
  'nav.home': '{brand} — home',
  'nav.work': 'Work',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.language': 'Language',
  'nav.switchTo': 'Read this page in {language}',
  'footer.label': 'Footer',
  'footer.meaning': 'means landed on Jupiter.',
  'footer.builtBy': 'Built by {person} with Astro.',

  // Home
  'hero.titleLine1': 'Grounded in code.',
  'hero.titleLine2': 'Built to',
  'hero.titleHighlight': 'explore.',
  'hero.identity': '{role}, focused on {focus}.',
  'hero.primaryCta': 'Explore my work',
  'hero.secondaryCta': 'Let’s talk',
  'hero.backToTop': 'Back to top',
  'hero.arrivalPoint': 'Arrival point',
  'home.workTitle': 'Things I’ve shipped.',
  'home.seeAllProjects': 'See all projects',
  'home.workEmpty': 'Case studies are being written. Meanwhile, the code lives on',
  'home.processTitle': 'How I work.',
  'home.process1Title': 'Understand the problem',
  'home.process1Body':
    'Talk to the people doing the work, map the current flow and find where it actually breaks before proposing screens.',
  'home.process2Title': 'Design the solution',
  'home.process2Body':
    'Sketch the main flow, agree on data contracts early and decide what to leave out of the first version.',
  'home.process3Title': 'Build and iterate',
  'home.process3Body':
    'Ship a usable slice, watch how it is used and refine. Interfaces and APIs evolve together.',
  'home.aboutTitle': 'Product-minded, frontend-first.',
  'home.aboutBody':
    'I’m {person}, a full-stack developer who spends most of his time where product decisions meet the interface. I like turning messy workflows into tools people can use without a manual, and I care just as much about the systems behind them: clear contracts, predictable data and code the next person can read.',
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
  'work.title': 'Work',
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
  'project.next': 'Next project',
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

  // About
  'about.title': 'About',
  'about.description': 'About {person}: {role} focused on {focus}.',
  'about.lead':
    'I’m {person}. I build web products end to end, with most of my attention on the interface and on the product decisions behind it.',
  'about.nameBefore': 'The name',
  'about.nameAfter':
    'means “landed on Jupiter”: a reminder to keep exploring, but to do it on solid ground. In practice that means curiosity about new tools and a stubborn preference for things that are tested, documented and easy to change.',
  'about.workWith': 'What I work with',
  'about.experience': 'Experience',
  'about.experienceSoon': 'Experience timeline coming soon.',

  // Contact
  'contact.title': 'Contact',
  'contact.heading': 'Let’s talk.',
  'contact.description': 'How to reach {person}.',
  'contact.intro': 'Tell me what you’re building and where you’re stuck. I usually reply within a few days.',
  'contact.email': 'Email',
  'cta.title': 'Have a product worth building? Let’s talk.',
  'cta.email': 'Email me',
  'cta.otherWays': 'Other ways to reach me',

  // 404
  'notFound.title': 'Page not found',
  'notFound.heading': 'This orbit is empty.',
  'notFound.body':
    'The page you’re looking for doesn’t exist or has moved. Check the address, or go back to familiar ground.',
  'notFound.home': 'Go to home',
  'notFound.projects': 'See projects',
} as const;
