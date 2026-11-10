import type { UiDictionary } from './index';

/** Spanish interface strings. The type forces the exact key set of `en.ts`. */
export const es: UiDictionary = {
  // Site-wide
  'site.role': 'Desarrollador full-stack',
  'site.focus': 'Frontend y producto',
  'site.tagline': 'Interfaces cuidadas. Sistemas fiables. Ideas hechas realidad.',
  'site.description':
    'Alejandro Lugo es desarrollador full-stack centrado en frontend y producto: interfaces cuidadas, sistemas fiables e ideas hechas realidad.',
  'site.defaultTitle': '{person} — {role} · {brand}',

  // Layout and navigation
  'a11y.skipToContent': 'Saltar al contenido',
  'nav.label': 'Principal',
  'nav.menu': 'Menú',
  'nav.home': '{brand} — inicio',
  'nav.work': 'Proyectos',
  'nav.about': 'Sobre mí',
  'nav.contact': 'Contacto',
  'nav.language': 'Idioma',
  'nav.switchTo': 'Leer esta página en {language}',
  'footer.label': 'Pie de página',
  'footer.meaning': 'significa «aterrizado en Júpiter».',
  'footer.builtBy': 'Hecho por {person} con Astro.',

  // Home
  'hero.titleLine1': 'Anclado en el código.',
  'hero.titleLine2': 'Hecho para',
  'hero.titleHighlight': 'explorar.',
  'hero.identity': '{role}, centrado en {focus}.',
  'hero.primaryCta': 'Ver mis proyectos',
  'hero.secondaryCta': 'Hablemos',
  'hero.backToTop': 'Volver arriba',
  'hero.arrivalPoint': 'Punto de llegada',
  'home.workTitle': 'Cosas que he lanzado.',
  'home.seeAllProjects': 'Ver todos los proyectos',
  'home.workEmpty': 'Estoy escribiendo los casos de estudio. Mientras tanto, el código está en',
  'home.processTitle': 'Cómo trabajo.',
  'home.process1Title': 'Entender el problema',
  'home.process1Body':
    'Hablar con quien hace el trabajo, mapear el flujo actual y encontrar dónde falla de verdad antes de proponer pantallas.',
  'home.process2Title': 'Diseñar la solución',
  'home.process2Body':
    'Esbozar el flujo principal, acordar pronto los contratos de datos y decidir qué se queda fuera de la primera versión.',
  'home.process3Title': 'Construir e iterar',
  'home.process3Body':
    'Entregar una parte usable, observar cómo se usa y refinar. Interfaces y APIs evolucionan juntas.',
  'home.aboutTitle': 'Mentalidad de producto, frontend primero.',
  'home.aboutBody':
    'Soy {person}, desarrollador full-stack. Paso la mayor parte del tiempo donde las decisiones de producto se encuentran con la interfaz. Me gusta convertir flujos de trabajo caóticos en herramientas que se usan sin manual, y me importan igual los sistemas que hay detrás: contratos claros, datos predecibles y código que la siguiente persona pueda leer.',
  'home.coreStack': 'Stack principal',
  'home.moreAboutMe': 'Más sobre mí',

  // Carousel and cards
  'carousel.label': 'Proyectos seleccionados',
  'carousel.previous': 'Proyectos anteriores',
  'carousel.next': 'Proyectos siguientes',
  'card.viewProject': 'Ver proyecto',
  'card.categories': 'Categorías',
  'card.screenshotPending': 'Captura pendiente',
  'card.draft': 'Borrador',
  'card.draftDevOnly': 'Borrador · sólo visible en desarrollo',
  'card.inDefaultLanguage': 'En inglés',

  // Work
  'work.title': 'Proyectos',
  'work.description': 'Casos de estudio: el problema, mi parte, las decisiones y lo que aprendí.',
  'work.intro':
    'Cada proyecto explica el problema, mi papel, las decisiones que lo sostienen y qué haría de otra manera.',
  'work.empty': 'Los casos de estudio están en camino.',

  // Case study
  'project.liveDemo': 'Demo en vivo',
  'project.sourceCode': 'Código fuente',
  'project.documentation': 'Documentación',
  'project.tryItLive': 'Pruébalo en vivo →',
  'project.onThisPage': 'En esta página',
  'project.stack': 'Stack',
  'project.gallery': 'Galería',
  'project.next': 'Siguiente proyecto',
  'project.meta.type': 'Tipo',
  'project.meta.period': 'Periodo',
  'project.meta.status': 'Estado',
  'project.meta.role': 'Rol',
  'project.meta.context': 'Contexto',
  'project.privateProduct': 'Producto privado',
  'project.type.personal': 'Proyecto personal',
  'project.type.open-source': 'Código abierto',
  'project.type.professional': 'Trabajo profesional',
  'project.status.active': 'Activo',
  'project.status.completed': 'Completado',
  'project.status.prototype': 'Prototipo',
  'project.status.paused': 'En pausa',
  'stack.layer': 'Capa',
  'stack.technology': 'Tecnología',
  'stack.why': 'Por qué',
  'stack.layer.interface': 'Interfaz',
  'stack.layer.api': 'API',
  'stack.layer.data': 'Datos',
  'stack.layer.runtime': 'Ejecución',
  'stack.layer.quality': 'Calidad',
  'stack.layer.infrastructure': 'Infraestructura',
  'stack.layer.tooling': 'Herramientas',
  'stack.usage.production': 'Producción',
  'stack.usage.prototype': 'Prototipo',
  'stack.usage.exploration': 'Exploración',

  // Markdoc tags
  'callout.note': 'Nota',
  'callout.constraint': 'Restricción',
  'callout.learning': 'Aprendizaje',
  'callout.editorial': 'Nota editorial',
  'decision.label': 'Decisión: {decision}',
  'decision.problem': 'Problema',
  'decision.decision': 'Decisión',
  'decision.alternatives': 'Alternativas',
  'decision.tradeoff': 'Compromiso',
  'decision.evidence': 'Evidencia',

  // About
  'about.title': 'Sobre mí',
  'about.description': 'Sobre {person}: {role} centrado en {focus}.',
  'about.lead':
    'Soy {person}. Construyo productos web de principio a fin, con la mayor parte de mi atención en la interfaz y en las decisiones de producto que hay detrás.',
  'about.nameBefore': 'El nombre',
  'about.nameAfter':
    'significa «aterrizado en Júpiter»: un recordatorio de seguir explorando, pero con los pies en el suelo. En la práctica, curiosidad por las herramientas nuevas y una preferencia testaruda por lo que está probado, documentado y es fácil de cambiar.',
  'about.workWith': 'Con qué trabajo',
  'about.experience': 'Experiencia',
  'about.experienceSoon': 'La trayectoria profesional llegará pronto.',

  // Contact
  'contact.title': 'Contacto',
  'contact.heading': 'Hablemos.',
  'contact.description': 'Cómo contactar con {person}.',
  'contact.intro': 'Cuéntame qué estás construyendo y dónde te has atascado. Suelo responder en pocos días.',
  'contact.email': 'Email',
  'cta.title': '¿Tienes un producto que merece construirse? Hablemos.',
  'cta.email': 'Escríbeme',
  'cta.otherWays': 'Otras formas de contactar',

  // 404
  'notFound.title': 'Página no encontrada',
  'notFound.heading': 'Esta órbita está vacía.',
  'notFound.body':
    'La página que buscas no existe o se ha movido. Revisa la dirección o vuelve a terreno conocido.',
  'notFound.home': 'Ir al inicio',
  'notFound.projects': 'Ver proyectos',
};
