# Changelog

All notable changes to this site are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html): a new page, section or feature is a
minor version, a fix is a patch, and a change to the public URLs is a major one.

Write entries under «Unreleased» as you work; `task release:patch|minor|major` dates them.

---

## [Unreleased]

---

## [1.9.0] — 2026-11-18

### Added

- Note «Does my frontend need a store?»: deciding where each piece of state lives before choosing
  a library, with a flight-booking example, diagrams, the same Angular form with and without a
  SignalStore, and a self-check; in English, Spanish and Italian.

### Changed

- Home: «See all projects» sits on the cards' edge, the process step numbers are grey like the
  hero's line numbers, and the footer's logo lines up with its links over a full-width rule.
- Mobile menu: sections at a calmer size, GitHub and the language (now shown by name) as one
  secondary row, and a link closes the panel before the next page instead of leaving it over it.

### Fixed

- The web app manifest is served as `application/manifest+json` instead of a generic binary
  type.
- On the 404 page, the language switcher led to pages that do not exist (`/es/404/`, `/it/404/`);
  it now leads to each language's home.
- The local editor (Keystatic) opens notes whose quiz questions carry a code sample.

### Security

- A Content Security Policy on every page: only the site's own scripts (by their hashes), styles,
  images and fonts load, and forms can only post to the site or the newsletter.

### Infrastructure

- Performance budget in CI: every page's JavaScript and CSS (gzip) is measured after the build, and
  the build fails when a page goes over (home ≤ 50 KB of JS, other pages ≤ 30 KB, CSS ≤ 25 KB).
- Weekly link check: every link of the built site, external and internal, is checked on Mondays;
  broken ones open an issue.

---

## [1.8.0] — 2026-11-16

### Added

- «Check yourself» at the end of the three RxJS notes: a few questions on real cases, some with a
  short code sample, that show the answer and why as soon as you pick one. Works without
  JavaScript; nothing is stored or sent. New `{% quiz %}` and `{% question %}` tags.

### Changed

- The diagrams of the three RxJS notes (fundamentals, mapping operators, combining streams) are
  drawn as SVG over a notebook background, in the site's fonts and each note's language, and legible
  on phones; their covers are drawn the same way. New `{% diagram %}` tag for notes: a
  marble diagram or a timeline by id, or any SVG or image on the same notebook background.

---

## [1.7.1] — 2026-11-16

### Fixed

- Newsletter emails showed each note's summary wrapped in `<description>` tags; they now show
  the summary alone.
- Newsletter emails show the full logo with its wordmark, and no gap opens between the masthead
  rows in mail apps that drop the email's styles.

---

## [1.7.0] — 2026-11-15

### Added

- Note «combineLatest, withLatestFrom, zip or forkJoin?», the third of the RxJS series, in
  English, Spanish and Italian.

---

## [1.6.0] — 2026-11-15

### Added

- `/llms.txt`: the site summarised in Markdown for AI assistants (who, how, case studies, notes,
  contact), built from the published content.
- `/sitemap.xml` redirects to the sitemap Astro generates (`/sitemap-index.xml`).

### Changed

- New logo, «Soft Ascent»: an A that is also a rocket, with nozzles, a peach horizon and landing
  pads that turn into flames in flight. Used in the header, footer, hero rocket, back-to-top button,
  share cards and newsletter; new favicon (SVG and ICO), Apple and 512 px icons and a web manifest.
- The hero rocket lands on Jupiter's limb standing on its pads, hovers with its engines on in open
  sky, and its old trail fades when it descends into the back-to-top button, which now shows a
  small take-off trail. The watermark rockets are the new mark.

### Fixed

- The hero sky launches from any blank space, also beside short lines of text; only the letters
  themselves and the controls are kept for reading and clicking.

---

## [1.5.0] — 2026-11-15

### Changed

- Newsletter emails redesigned as «Orbital Journal»: a night masthead with Jupiter over a light
  paper body, the first note featured and any others listed below, in the three languages.

---

## [1.4.1] — 2026-11-15

### Changed

- Releases can only be cut from an up-to-date `main`; the release task stops otherwise.

---

## [1.4.0] — 2026-11-15

### Added

- A watermark drawing on Work, Notes, About and Contact, like the home sections.
- About rewritten: frontend and product focus, functional analysis and product ownership, an
  engineering background and the current stack (Node.js joins the core stack).
- Contact: icons for each channel and the real LinkedIn profile.
- About: «What I work with» is now a tree; each technology opens into branches (routing, state,
  patterns, versioning…) with when I reach for each one.

### Changed

- Content accuracy pass (all locales): «Featured project» follows the featured order; «What I
  delivered» instead of «Outcome»; yRest explained by its needs, without the port anecdote, and with
  simulated login named as such; links read «Explore the playground» and «View on the Marketplace»;
  UQuiz caption, ranking and learning reworded, and its unpublished APK stated.
- RxJS notes: when a Promise and `pipe()`/`subscribe()` start work, mapping operators as projection
  plus concurrency policy, and linked official sources.
- How I work: steps rewritten around need, MVP scope and growth, without project examples.
- Notes no longer repeat the subscription form in the footer.
- Decision blocks use one smaller text size; the decision stands out by surface, weight and a
  lavender label.

### Fixed

- The hero no longer shifts while the rocket flies, and empty space beside the text is sky again.
- The article index marks sections whose titles have accents, and the last sections at the end of
  the page.

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
