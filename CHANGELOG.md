# Changelog

All notable changes to this site are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html): a new page, section or feature is a
minor version, a fix is a patch, and a change to the public URLs is a major one.

Write entries under «Unreleased» as you work; `task release:patch|minor|major` dates them.

---

## [Unreleased]

---

## [1.3.0] — 2026-11-15

### Added

- **Back to top everywhere:** the rocket button now appears on every page once you scroll, and lifts off when it takes you up.
- **Highlighted terms in notes and case studies:** key words can shine in the site's lavender, like `pipe()` and `subscribe()` in the RxJS fundamentals note.

### Changed

- **One world on every page:** Work, Notes, About, Contact and the 404 carry the home's night sky, and their titles have one shining word, like “explore.” on the home.
- **Contact call to action:** “Have a product in mind?”: the word cycles once through an idea, a project and a business before landing on “a product”, on its own line so nothing else moves, with a launch blueprint behind it and a short invitation to write.
- **About:** the home section and the About page now say how I work: product first, tools as the expression of that order, and scalability from the first design. The “experience coming soon” placeholder is gone.
- **Home, clearer about the work:** the hero says what I do from the first conversation to the release and links the latest project; each “How I work” step shows where it happened, with a link to that case study; the featured projects sit side by side as a still grid with the screenshot on top (controls appear only when there are more than fit); every section starts on the same edge as the hero's text.
- **One main action at the end:** “Email me” is the only filled button; the footer's subscribe button is outlined, and the back-to-top button steps aside instead of covering an action.
- **Hero:** the rocket launches from the sky, not from the text column, so clicking to read or select never launches it. On phones the header is opaque.
- **Reading:** notes and case studies read in a wider column with slightly larger text; the subscription box matches it.
- **How I work:** the step numbers are larger, over a rocket lifting off its pad.

---

## [1.2.0] — 2026-11-15

### Added

- **Newsletter:** a subscription form at the end of every note and in the footer. Each language has its own list in Brevo, with an email to confirm, and every new note is emailed to its language's subscribers.

---

## [1.1.0] — 2026-11-14

### Added

- **Notes:** a blog of short technical articles at `/notes/`, with covers, figures with captions, a reading index, reading time, topics and an RSS feed per language. Two RxJS notes, in English, Spanish and Italian.
- **Italian case studies:** yRest, yRest for VS Code and UQuiz are now written in Italian too.

### Changed

- **SEO and sharing:** the site uses its real address (aggiovato.netlify.app) for canonical links, the sitemap and feeds; every page has a 1200×630 share image (a branded card per language, or the cover); notes and case studies are marked as articles with dates and topics; structured data describes the site, its author and each article; `robots.txt` points to the sitemap.
- **CI:** faster runs (e2e in parallel with the other checks, cached browser); documentation-only changes and the release commit skip the pipeline, and every job has a time limit.
- Long-form reading has more line height and paragraph space, and the case study's Stack heading aligns with the text column.

### Removed

- **Japanese:** the interface was a test and is gone; `/ja/` addresses no longer exist.

---

## [1.0.0] — 2026-11-14

First public version of the portfolio.

### Added

- **Case studies** for yRest, yRest for VS Code and UQuiz, each with its own URL: an at-a-glance layer (problem, part, outcome), technical decisions with alternatives and trade-offs, stack and gallery.
- **Orbital gallery:** project images as moons around Jupiter, a preview of the selected one and a full-screen viewer with zoom, pan and rotation. Phones, reduced motion and no JavaScript get a grid of real images.
- **Four languages:** English, Spanish, Italian and Japanese, with a language menu. Case studies are written in English and Spanish; an untranslated address offers the English original.
- **Home** with the Jupiter scene and the rocket's flight, a projects carousel, about and contact pages, and a 404 page.
- **Navigation:** a glass overlay menu on phones, sequential page transitions and prerendering of internal links.
- **Keystatic** as a local content editor in development.

### Infrastructure

- CI on every pull request: formatting, lint, types, unit and component tests, production build with a draft leak check, and end-to-end tests with accessibility checks.
- Deploys to Netlify only after the pipeline passes: a preview per pull request, production for each version tag.
