---
name: publish-note
description: >
  Write, translate and publish a note (a /notes/ article) so it reaches the site and the newsletter.
  Use when the user says "new note", "write a post", "publish a note", "nueva nota", "turn this
  LinkedIn post / PDF into a note", or asks why a note was not emailed.
---

# Publish a note

Standards: `.claude/rules/content.md` (notes contract, figures) and `.claude/rules/i18n.md`
(translations). This skill is the procedure, from the file to the subscribers' inbox.

## 1. Write the English original

1. `src/content/notes/en/<slug>.mdoc`, copying the closest existing note. Frontmatter: `slug`
   (kebab-case, same in every language), `title`, `summary` (≤ 220), `tags` (≤ 4, as named:
   RxJS, Angular), `cover`, `publicationStatus: draft`.
2. `##` sections feed the index (three or more show it). Keep the author's claims and wording when
   the source is his (a post, a PDF); do not add facts.
3. Images: `src/assets/notes/<slug>/`. Cover in the frontmatter (`src`, `alt`, optional
   `caption`); inline figures as `![alt](../../../assets/notes/<slug>/<file>.webp "Caption")`.
   Diagrams from a PDF: render with `pdftoppm -r 240`, crop to the panel interior (no paper margin
   or second frame), WebP ≤ 1600px. Every image needs an `alt` in the note's language.

## 2. Translate

Spanish and Italian with the same file name and slug (`translate-content`). Translate `alt` and
captions too. AI translations stay `draft` until the author reviews them, unless he asks to publish.

## 3. Publish (the date decides the newsletter)

1. In every language: `publicationStatus: published` and `publishedAt: <the day of the release>`.
2. Brevo's RSS integrations (one per language, daily at 23:30 Europe/Madrid) email the notes whose
   date falls since the previous run. The feed dates are the day at 00:00 UTC, so:
   - `publishedAt` must be the day `task release:minor` runs, and
   - the release must be live before 22:30 that day (Brevo asks for one hour of margin).
     A note dated another day, or released after 22:30, is never emailed.
3. Verify: `npm run check`, `npm test`, `npm run test:e2e`, then open `/notes/`, `/es/notes/`,
   `/it/notes/` in `npm run dev`.
4. PR → merge → `task release:minor` → `git push --follow-tags` (see CLAUDE.md, CI).

## 4. Check the email

The feed carries each note's cover as an `<enclosure>`; Brevo shows it in the email. If a note was
not sent, check in order: its `publishedAt` against the release day, the time of the release, the
feed in production (`/notes/rss.xml` lists it with its date), and the integration in Brevo
(automatic sending on, list of that language).
