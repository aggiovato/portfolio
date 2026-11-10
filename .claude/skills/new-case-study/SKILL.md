---
name: new-case-study
description: >
  Add a new project case study to the portfolio (Markdoc file, images, translations). Use when the
  user says "add a project", "new case study", "publish <project>", "create the page for <repo>",
  or provides a repository/README to turn into a portfolio entry.
---

# New case study

Standards: `.claude/rules/content.md` (contract, drafts, Markdoc) and `.claude/rules/i18n.md`
(translations). This skill is the procedure.

## 1. Gather facts first

- Read the project's README, repo and any notes the user gives. Do not invent metrics, users,
  team size or results (§2: distinguish measured, qualitative and goals). Unknowns become questions
  or `TODO` notes, never filler.
- Ask for: the user's role vs the team's, period, status, public links, and real screenshots.

## 2. Create the English original

1. Copy the closest existing file in `src/content/projects/en/` to `en/<name>.mdoc`
   (`<name>` = the slug, kebab-case).
2. Fill the frontmatter: `slug`, `title`, `summary` (≤ 220), `tagline` (≤ 70), `projectStatus`,
   `projectType`, `categories` (≤ 3), `role`, `periodLabel`, `stack` (name, layer, rationale),
   `links`. Start with `publicationStatus: draft`.
3. Images: put them in `src/assets/projects/<name>/` and reference them as
   `../../../assets/projects/<name>/<file>` with a descriptive `alt` (what the screenshot shows,
   not "screenshot of"). `cover` is required to publish. `src/assets/projects/` is gitignored while
   images are provisional: they stay local and CI uses placeholders (`npm run assets:placeholders`).
4. Body (§10): `## Problem`, `## My contribution`, `## Solution`, `## Technical decisions`
   (`{% decision … /%}` blocks with real alternatives and trade-offs), `## Quality`,
   `## What I learned` / `## What's next`. Use `{% callout %}` for constraints and limits.
5. Featured on the home? `featured: true` + `featuredOrder`.

## 3. Translate (optional but recommended)

Use the `translate-content` skill to create `src/content/projects/es/<name>.mdoc` with the same file
name and slug. Without it, `/es/work/` lists the English original marked "In English".

## 4. Verify

```bash
npm run check            # schema: lengths, required fields, publication rules
npm test                 # parity and slug rules
npx astro dev --background   # review /work/<slug>/ and /es/work/<slug>/ (drafts visible)
```

## 5. Publish (only when the user confirms the content is final)

Set `publicationStatus: published` and `publishedAt` in **every** locale file, then
`npm run build && npm run verify:drafts` and `npm run test:e2e`.
