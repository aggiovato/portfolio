---
paths:
  - 'src/content/**'
  - 'src/content.config.ts'
  - 'src/lib/content/**'
  - 'markdoc.config.mjs'
---

# Content collections and case studies

Case studies are the core of the site (§10, §12). Content is Markdoc in Git, validated at build
time; Keystatic will edit the same files later (§13), so keep the format editor-friendly.

## Contract

- Schema: `src/content.config.ts` (Zod 4 via `astro/zod`). Publication rules are `refine`s:
  `published` requires `publishedAt` and `cover`. Fix content to satisfy the schema; do not loosen
  the schema to fit content without a spec reason.
- Entry id = path without extension (`en/yrest`), set by `generateId`. The default id would be the
  `slug` field, which repeats across locales.
- `slug` is the public URL and must be unique per locale (`assertUniqueSlugs`). Changing a published
  slug needs a permanent redirect (§7).
- `summary` ≤ 220 chars, `tagline` ≤ 70, `categories` ≤ 3: they are card constraints, keep them in
  translations too.

## Access

- Pages and components get projects only from `src/lib/content/projects.ts`
  (`getPublicProjects`, `getProjectsInLocale`, `getFeaturedProjects`, `projectPath`,
  `getProjectAlternates`). Never `getCollection('projects')` elsewhere: it would bypass the draft filter.
- Logic that does not need `astro:content` goes to `project-utils.ts` with a unit test.
- Notes (`src/content/notes/<locale>/`) follow the same model: English original, optional
  translations with the same file name and slug, read only through `src/lib/content/notes.ts`
  (`getPublicNotes`, `getNotesInLocale`, `notePath`, `getNoteAlternates`, `hasNotes`). Published
  notes need `publishedAt`. `verify:drafts` also fails if `/notes/` ships without a published note.
- The skill tree (About) is a data collection, `src/content/skills/<locale>.yaml`, read only through
  `src/lib/content/skills.ts`. Each branch says when it is used; translations keep the same group
  and node ids and branch counts (`assertSkillParity`), and a missing locale falls back to English.
- Highlight key terms with `{% highlight %}term{% /highlight %}`; code in a section heading is
  always highlighted. When and how: `highlighting.md`.
- Images in Markdoc (notes and case studies): `![alt](path "Caption")` renders an optimised figure
  with the title as its caption (`Figure.astro`). Images live in `src/assets/<collection>/<slug>/`.
- Figures on the notebook background (notes): `{% diagram … alt="…" caption="…" /%}` with
  `id="<note>/<figure>"` for a marble diagram or a timeline of subscriptions (src/lib/diagrams/specs.ts, drawn by marble.ts in the
  page's language) or `src="<note>/<file>"` for any SVG or image in src/assets/notes/. An SVG is
  inlined: give it a viewBox, and set text with `font-family: var(--font-sans | --font-mono)` (or
  outline it) so it matches the site. Prefer a drawing to a picture of a diagram. An SVG with prose
  needs one file per language (`places.en.svg`, `places.es.svg`…); a cover carries no prose (one
  image for every language). Covers from a marble drawing or a cover SVG: `node scripts/note-covers.mjs`.
- Self-check (notes, optional): one `{% quiz %}` before the sources, with 2–6 questions as
  `{% question text="…" options=["…", "…"] answer=2 explanation="…" /%}` (`answer` counts from 1;
  a bad one fails the build; `backticks` are inline code; a code sample goes in the tag's body). Ask about what the note shows, not trivia; every option plausible;
  the explanation says why, citing the note. Translate text, options and explanation; keep `answer`.
- A note's `publishedAt` is the day it is released: the newsletter emails notes by that date
  (`publish-note` skill).

## Drafts (§13, §21)

- `draft` is visible in `npm run dev` (with a "Draft" badge) and in the e2e build (`SHOW_DRAFTS=1`,
  `dist-e2e/` only). Production builds never generate routes, listings or sitemap entries for drafts.
- `npm run verify:drafts` (CI `build` job) fails if a draft of any locale leaks into `dist/`.
- A draft in a public repository is still readable in Git: do not put private material in drafts.

## Markdoc

- Tags: `{% callout type="note|constraint|learning|editorial" title="…" %}` and
  `{% decision problem=… decision=… alternatives=… tradeoff=… evidence=… /%}`, mapped to components in
  `markdoc.config.mjs`. Their labels are translated through `src/i18n/ui`.
- A new tag needs a repeatable editorial need (§6), a component that receives data through props
  and a component test.
- Headings: `##` sections feed the table of contents; keep a logical order (no skipped levels).

## Writing case studies (§10)

Problem → contribution (separate yours from the team's) → solution → decisions with trade-offs →
quality → results/learnings. Impact claims distinguish measured results, qualitative observations and
goals (§2). Screenshots must be real; reconstructions are labelled as such. Images need useful `alt`.

Use the `new-case-study` skill to add one.
