# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **technical leads** (engineering managers, CTOs, senior developers on a hiring loop) who
evaluate how Alejandro Lugo works before contacting or hiring him. They read case studies to judge
architecture, decisions, quality and the real scope of his contribution. When audiences pull in
different directions, this one decides.

Secondary, confirmed in the local spec (`docs/especificacion.md` §2):

- **Recruiters**, who need role, technologies, experience and a contact route quickly.
- **Clients or product owners**, looking for proof that a messy problem becomes a usable product.
- **Developers in the community**, discovering his open tools and their documentation.

## Product Purpose

aggiovato is the personal portfolio of Alejandro Lugo, a full-stack developer focused on frontend
and product. It shows what he can build, how he makes decisions and what he brings to a product,
through case studies with their own URLs rather than a gallery of badges.

Success means: identity and role are clear before scrolling on a phone; a project opens in one
interaction; on a case study the visitor recognises the problem, his part and the outcome without
reading the whole article; contact is always one step away.

## Positioning

He builds developer tools end to end, not only screens: yRest (a YAML-powered REST mock server),
its VS Code extension, their documentation site, tests and release pipelines. The portfolio shows
the whole arc of a tool — product scope, CLI and API design, editor support, docs, CI — with the
reasoning behind each decision.

## Operating Context

- Visitors usually arrive from a link (CV, LinkedIn, GitHub, a message) and decide in minutes
  whether to read a case study or reach out.
- Case studies follow a fixed editorial structure: problem, contribution, solution, technical
  decisions with trade-offs, quality, what's next.
- Content is authored as Markdoc files in Git; Keystatic is a local editor over the same files.
- The site is in English by default, with Spanish, Italian and Japanese interfaces. Case studies
  exist in English and Spanish; the other locales fall back to English. Italian and Japanese are
  personal reach, not target markets.

## Capabilities and Constraints

- Astro 7 static site (prerendered, served from a CDN), TypeScript strict, content collections.
- Main content and navigation must work without JavaScript; JavaScript only enhances.
- Adding a project must not require new components or a hand-made route.
- Projects can be drafts: visible in development, never generated in production.
- Undecided: hosting provider and final domain (`aggiovato.dev` is a placeholder), analytics tool,
  whether a contact form exists (email and verified profiles are enough for the first version).

## Brand Commitments

- Name **aggiovato**, meaning “landed on Jupiter”; tagline “Grounded in code. Built to explore.”
- The A-rocket logo and the Jupiter scene are provisional assets, not final.
- Spatial language appears only in small details; navigation uses plain words (Work, About,
  Contact).
- Voice: curious, competent, close and meticulous. No military imagery, no game-like interfaces,
  no omnipresent neon.

## Evidence on Hand

- Case studies: yRest, yRest for VS Code and UQuiz (`src/content/projects/{en,es}/`), all drafts.
- Real material behind them: the yRest repository, npm package (`@yrest/cli`), documentation site
  and playground; the extension’s repository and Marketplace listing; UQuiz’s repository with
  official screenshots.
- Images in `src/assets/projects/`: real captures and compositions built from that material; the
  VS Code images are reconstructions with the extension’s real grammar and messages, and say so.
- Absent and not to be fabricated: adoption or download statistics, testimonials, client names,
  measured impact. Company work may only appear with authorised material, fictional data and a
  “Private product” status instead of a non-working demo. “Available for hire” is not confirmed.

## Product Principles

1. **Evidence over adjectives.** Every claim of impact separates measured results, qualitative
   observations and goals not yet reached.
2. **Show the reasoning.** A case study is worth its decisions and trade-offs, not its screenshots.
3. **Open in one step, understood in one minute.** Role, projects and contact are never buried.
4. **Character in the details, clarity in the structure.** The space theme adds personality; it
   never replaces conventional navigation or delays reading.
5. **Content scales without craft work.** A new project is a content file, not a new page design.

## Accessibility & Inclusion

Target WCAG 2.2 AA, pending a real audit: semantic structure, one h1 per page, skip link, visible
focus, keyboard-operable menus, `prefers-reduced-motion` respected, decorative imagery hidden from
assistive technology and useful descriptions for project images.
