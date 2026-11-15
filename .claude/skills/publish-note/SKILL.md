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
2. `##` sections feed the index (three or more show it). Code in a section heading is always
   highlighted (`.claude/rules/highlighting.md`). Keep the author's claims and wording when
   the source is his (a post, a PDF); do not add facts.
3. Images: `src/assets/notes/<slug>/`. Cover in the frontmatter (`src`, `alt`, optional
   `caption`); inline figures as `![alt](../../../assets/notes/<slug>/<file>.webp "Caption")`.
   Diagrams go on the notebook background with `{% diagram … alt="…" caption="…" /%}`:
   `src="<slug>/<file>.svg"` for a drawing made anywhere (Figma, Excalidraw, a diagram tool;
   it needs a viewBox, text in the site's fonts or outlined), or `id="<slug>/<figure>"` for a
   marble diagram described in `src/lib/diagrams/specs.ts` (labels translated). An SVG with prose:
   one file per language. Covers (no prose, one for every language) from a marble diagram or a
   cover SVG: `node scripts/note-covers.mjs`.
   Only when a drawing is not possible, crop from the PDF: `pdftoppm -r 240`, the panel interior
   (no paper margin or second frame), WebP ≤ 1600px. Every image needs an `alt` in the note's
   language.

4. Optional self-check: a `{% quiz %}` of 3–4 `{% question %}` before the sources
   (`.claude/rules/content.md`). Questions about what the note shows; draft them for the author
   to review.

## 2. Translate

Spanish and Italian with the same file name and slug (`translate-content`). Translate `alt` and
captions too. AI translations stay `draft` until the author reviews them, unless he asks to publish.

## 3. Publish (the date decides the newsletter)

1. In every language: `publicationStatus: published` and `publishedAt: <the day of the release>`.
2. Brevo's RSS integrations (one per language) run on Monday, Wednesday and Friday at 00:30
   Europe/Madrid and email the notes dated since the previous run (window: previous run day 00:00
   to this run day 00:00). Feed dates are the day at 00:00 UTC (01:00 Madrid), so:
   - `publishedAt` is the day `task release:minor` runs; the note goes out in the next run,
   - the release must be live by 23:30 the night before that run (Brevo asks for one hour), and
   - a note dated on a run day itself (Mon, Wed, Fri) falls after that night's window and waits
     for the following run. A date in a window that has already been sent is never emailed.
3. Verify: `npm run check`, `npm test`, `npm run test:e2e`, then open `/notes/`, `/es/notes/`,
   `/it/notes/` in `npm run dev`.
4. PR → merge → `task release:minor` → `git push --follow-tags` (see CLAUDE.md, CI).

## 4. Check the email

The feed carries each note's cover as an `<enclosure>`; Brevo shows it in the email. If a note was
not sent, check in order: its `publishedAt` against the release day, the time of the release, the
feed in production (`/notes/rss.xml` lists it with its date), and the integration in Brevo
(automatic sending on, list of that language).
