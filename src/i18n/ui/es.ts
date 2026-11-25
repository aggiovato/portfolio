import type { UiDictionary } from './index';

/** Spanish interface strings. The type forces the exact key set of `en.ts`. */
export const es: UiDictionary = {
  // Site-wide
  'site.role': 'Desarrollador full-stack',
  'site.focus': 'convertir ideas en productos que escalan',
  'site.tagline':
    'De la primera conversación al lanzamiento: producto, interfaz, backend y las herramientas que lo mantienen en marcha.',
  'site.description':
    'Heber Alejandro Lugo es desarrollador full-stack y convierte ideas en productos que escalan: de la primera conversación al lanzamiento.',
  'site.defaultTitle': '{person} · {brand}',

  // Layout and navigation
  'og.defaultAlt':
    'Heber Alejandro Lugo, desarrollador full-stack: «Anclado en el código. Hecho para explorar.» junto al planeta Júpiter.',
  'a11y.newTab': '(se abre en una pestaña nueva)',
  'a11y.skipToContent': 'Saltar al contenido',
  'nav.label': 'Principal',
  'nav.menu': 'Menú',
  'nav.home': '{brand} — inicio',
  'nav.work': 'Proyectos',
  'nav.notes': 'Notas',
  'nav.about': 'Sobre mí',
  'nav.contact': 'Contacto',
  'nav.language': 'Idioma',
  'nav.switchTo': 'Leer esta página en {language}',
  'footer.label': 'Pie de página',

  // Home
  'hero.titleLine1': 'Anclado en el código.',
  'hero.titleLine2': 'Hecho para',
  'hero.titleHighlight': 'explorar.',
  'hero.identity': '{role}, centrado en {focus}.',
  'hero.primaryCta': 'Ver mis proyectos',
  'hero.secondaryCta': 'Hablemos',
  'hero.latest': 'Proyecto destacado:',
  'hero.backToTop': 'Volver arriba',
  'hero.arrivalPoint': 'Punto de llegada',
  'home.workTitle': 'Cosas que he lanzado.',
  'home.seeAllProjects': 'Ver todos los proyectos',
  'home.workEmpty': 'Estoy escribiendo los casos de estudio. Mientras tanto, el código está en',
  'home.processTitle': 'Cómo trabajo.',
  'home.process1Title': 'Entender la necesidad',
  'home.process1Body':
    'Hablar con quien hace el trabajo o tiene la idea, mapear el flujo actual o el que se desea, y encontrar los puntos débiles, los fallos y las oportunidades de crecer antes de diseñar nada.',
  'home.process2Title': 'Acotar la primera versión',
  'home.process2Body':
    'Convertir ese mapa en una prueba de concepto y un MVP que resuelvan la necesidad inmediata, sin perder de vista el crecimiento que salió del paso 01: ahí empieza la escalabilidad.',
  'home.process3Title': 'Construir, medir, crecer',
  'home.process3Body':
    'Entregar una parte usable, ver cómo se usa de verdad y hacer evolucionar el producto en pasos pequeños, interfaz y backend a la vez, sobre una base que no haya que rehacer para crecer.',
  'home.aboutTitle': 'Primero el producto. Herramientas que crecen con él.',
  'home.aboutBody':
    'Soy {person}, desarrollador full-stack. Empiezo por el negocio y el producto: cómo se organiza el trabajo y qué quiere construir la persona que está detrás. Las herramientas deberían ser la expresión natural de ese orden, así que primero alineamos las ideas y después construyo sobre una base que pueda crecer. La escalabilidad no es un añadido final: forma parte del primer diseño.',
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
  'notes.title': 'Notas',
  'notes.heading': 'Notas, {word} como las entiendo.',
  'notes.headingWord': 'dibujadas',
  'notes.description': 'Notas técnicas breves: cómo funciona algo, un valor cada vez.',
  'notes.intro':
    'Notas técnicas breves sobre lo que uso a diario, con diagramas que se siguen valor a valor.',
  'notes.feed': 'Feed RSS',
  'note.published': 'Publicada el {date}',
  'note.updated': 'Actualizada el {date}',
  'note.readingTime': '{minutes} min de lectura',
  'note.all': 'Todas las notas',
  'note.tags': 'Temas',
  'quiz.title': 'Ponte a prueba',
  'quiz.intro': 'Elige una respuesta para ver si es correcta, y por qué.',
  'quiz.correct': 'Correcta',
  'quiz.incorrect': 'No exactamente',
  'quiz.score': '{correct} de {total} correctas',
  'quiz.retry': 'Volver a intentarlo',
  'newsletter.title': 'Recibe las notas nuevas por correo',
  'newsletter.text':
    'Un correo cuando publico una nota, en el idioma que elijas. Puedes darte de baja desde cualquier correo.',
  'newsletter.footer': 'Notas nuevas por correo',
  'newsletter.email': 'Correo electrónico',
  'newsletter.language': 'Idioma',
  'newsletter.submit': 'Suscribirme',
  'newsletter.consent':
    'Primero recibirás un correo para confirmar. Tu dirección la guarda Brevo, el servicio que envía las notas, y solo se usa para ellas.',
  'newsletter.pendingTitle': 'Revisa tu correo',
  'newsletter.pendingBody':
    'Te he enviado un correo para confirmar la suscripción. Ábrelo y pulsa el enlace; hasta entonces no recibirás nada más.',
  'newsletter.confirmedTitle': 'Ya estás suscrito',
  'newsletter.confirmedBody':
    'Cada nota nueva llegará a tu correo. Todos los correos tienen un enlace para darte de baja.',
  'newsletter.backToNotes': 'Volver a las notas',
  'work.title': 'Proyectos',
  'work.heading': 'Cosas que he {word}.',
  'work.headingWord': 'lanzado',
  'work.description': 'Casos de estudio: el problema, mi parte, las decisiones y lo que aprendí.',
  'work.intro':
    'Cada proyecto explica el problema, mi papel, las decisiones que lo sostienen y qué haría de otra manera.',
  'work.empty': 'Los casos de estudio están en camino.',

  // Case study
  'project.liveDemo': 'Demo en vivo',
  'project.playground': 'Explorar el playground',
  'project.install': 'Ver en el Marketplace',
  'project.sourceCode': 'Código fuente',
  'project.documentation': 'Documentación',
  'project.tryItLive': 'Pruébalo en vivo →',
  'project.onThisPage': 'En esta página',
  'project.stack': 'Stack',
  'project.gallery': 'Galería',
  'gallery.label': 'Galería del proyecto',
  'gallery.open': 'Abrir la imagen {n} de {total}: {caption}',
  'gallery.show': 'Mostrar la imagen {n} de {total}: {caption}',
  'gallery.pause': 'Pausar la órbita',
  'viewer.label': 'Visor de imágenes',
  'viewer.close': 'Cerrar',
  'viewer.previous': 'Imagen anterior',
  'viewer.next': 'Imagen siguiente',
  'viewer.zoomIn': 'Acercar',
  'viewer.zoomOut': 'Alejar',
  'viewer.rotate': 'Girar 90°',
  'viewer.reset': 'Restablecer vista',
  'viewer.counter': '{n} / {total}',
  'viewer.hint': 'Usa la rueda o pellizca para hacer zoom; arrastra para mover.',
  'project.next': 'Siguiente proyecto',
  'glance.label': 'De un vistazo',
  'glance.problem': 'Problema',
  'glance.contribution': 'Mi parte',
  'glance.outcome': 'Qué entregué',
  'project.meta.type': 'Tipo',
  'project.meta.period': 'Periodo',
  'project.meta.status': 'Estado',
  'project.meta.release': 'Última versión',
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
  'decision.outlook': 'Perspectiva',

  // About
  'about.title': 'Sobre mí',
  'about.heading': 'Primero el {word}.',
  'about.headingWord': 'producto',
  'about.description': 'Sobre {person}: {role} centrado en {focus}.',
  'about.lead':
    'Soy {person}, desarrollador full-stack con foco en frontend y producto. Antes de diseñar una pantalla o construir una API, quiero entender a las personas que la van a usar: cómo trabajan, qué se lo complica y qué necesitan conseguir.',
  'about.approach':
    'Mi trabajo combina desarrollo, análisis funcional y responsabilidad de producto. Convierto necesidades de negocio en flujos, interfaces y decisiones técnicas claras, y decido qué entra en la primera versión y qué puede esperar. Busco construir software que resuelva el problema de hoy y siga siendo fácil de cambiar a medida que el producto evoluciona.',
  'about.background':
    'Mi formación es de ingeniero en telecomunicaciones y electrónica. Empecé programando cerca del hardware antes de pasar al desarrollo multiplataforma y web. Esa experiencia marcó mi forma de abordar el software: entender cómo encajan las piezas, seguir un problema a través de las capas y equilibrar las decisiones técnicas con las limitaciones reales.',
  'about.today':
    'Hoy trabajo sobre todo con Angular y React en el frontend, y con Spring Boot y Node.js en el backend. Lo que más me interesa es conectar todo el proceso: desde entender un problema hasta poner una herramienta útil en manos de alguien.',
  'about.workWith': 'Con qué trabajo',

  // Contact
  'contact.title': 'Contacto',
  'contact.heading': '{word}.',
  'contact.headingWord': 'Hablemos',
  'contact.description': 'Cómo contactar con {person}.',
  'contact.intro':
    'Si estás construyendo un producto, mejorando una herramienta interna, buscas colaboración técnica o a alguien para tu equipo: cuéntame el contexto y qué necesitas resolver. Suelo responder en pocos días.',
  'contact.email': 'Email',
  'cta.titleBefore': '¿Tienes',
  'cta.words': 'un producto|una idea|un proyecto|un negocio',
  'cta.titleAfter': 'en mente? Hablemos.',
  'cta.body':
    'Una idea apuntada en una servilleta, un proceso que frena a tu equipo, un producto que necesita otras manos: cuéntamelo. Leo cada mensaje y respondo con preguntas honestas, no con un discurso de ventas.',
  'cta.email': 'Escríbeme',
  'cta.otherWays': 'Otras formas de contactar',

  // 404
  'notFound.title': 'Página no encontrada',
  'notFound.heading': 'Esta órbita está vacía.',
  'notFound.body':
    'La página que buscas no existe o se ha movido. Revisa la dirección o vuelve a terreno conocido.',
  'notFound.englishOnly': 'Esta página solo está disponible en inglés.',
  'notFound.readInEnglish': 'Leerlo en inglés',
  'notFound.home': 'Ir al inicio',
  'notFound.projects': 'Ver proyectos',
};
