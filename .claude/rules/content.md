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
