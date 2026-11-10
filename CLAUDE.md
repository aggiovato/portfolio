# aggiovato — portfolio

Personal portfolio of Alejandro Lugo. Astro 7 · TypeScript strict · Content Collections + Markdoc ·
CSS tokens · static output · English (default) + Spanish (`/es/`).

- **Spec:** `docs/especificacion.md` (Spanish, **local only**, gitignored like all of `docs/`). Design and
  content decisions come from it; cite sections (§n). Never commit it.
- **Language:** site copy in English and Spanish via `src/i18n/`; **all code comments in English**;
  `.claude/` and README in English; the local spec in Spanish.
- Logo and planet are provisional assets; do not treat them as final.
- Non-final images (`docs/referencias/` design references, `src/assets/projects/` example screenshots)
  are gitignored and exist only locally; CI runs `npm run assets:placeholders`. Never commit them
  until they are final. Jupiter (`src/assets/hero/`) and the logo are versioned.

## Environment

- Node 24 via nvm (`source ~/.nvm/nvm.sh && nvm use`); Astro 7 does not start on Node 22.22.
- Dev server in the background: `npx astro dev --background` (`astro dev stop|status|logs`). Drafts are visible in dev.
- Git: remote `git@github-aggiovato:aggiovato/portfolio.git` (SSH alias for the **aggiovato** key),
  local identity `Aggiovato <aggiovato@gmail.com>`. Never use the global (work) identity here.
  Commit or push only when asked.

## Commands

| Task                      | npm                                      | Task (go-task)                    |
| ------------------------- | ---------------------------------------- | --------------------------------- |
| Types + content schemas   | `npm run check`                          | `task check`                      |
| Lint / format check       | `npm run lint` / `npm run format:check`  | `task lint` / `task format:check` |
| Unit + component tests    | `npm test`                               | `task test`                       |
| E2E (prod build + drafts) | `npm run test:e2e`                       | `task test:e2e`                   |
| Build + draft leak check  | `npm run build && npm run verify:drafts` | `task verify:drafts`              |
| Everything, CI order      | —                                        | `task preflight`                  |

CI: `.github/workflows/ci.yml` (quality → build → e2e) on PRs and pushes to `main`.

## Key invariants

- Projects are read only through `src/lib/content/projects.ts` (draft filter). Never `getCollection('projects')` in pages.
- Pages live in `src/pages/[...locale]/` and use `localeParams()`; no hard-coded copy or internal links.
- Case study translations share file name and `slug` across `src/content/projects/<locale>/`.
- Verify Astro APIs against the installed version (types in `node_modules/astro`, docs.astro.build).

## Rules (`.claude/rules/`)

| Rule                | Scope                          | Purpose                                                                    |
| ------------------- | ------------------------------ | -------------------------------------------------------------------------- |
| `coding-guidelines` | always                         | Simplicity, surgical changes, English comments, TS strict, done criteria   |
| `astro`             | `src/**`, configs              | Layers, zero-JS, scripts, Astro 7 specifics, images, budgets, SEO          |
| `i18n`              | `src/**`, `tests/**`           | Routing, `t()`, `localizePath`, hreflang, content translations, new locale |
| `content`           | content, config, `lib/content` | Schema contract, ids/slugs, drafts, Markdoc tags, case study structure     |
| `styling`           | `.astro`, `src/styles`         | Tokens, scoped CSS, colour roles, breakpoints, motion                      |
| `accessibility`     | `.astro`, styles, UI strings   | WCAG 2.2 AA rules, axe in e2e, manual checks                               |
| `testing`           | `tests/**`, `src/**`, CI       | Five layers, when a test is required, unit/component/e2e conventions       |
| `skill-authoring`   | `.claude/**`                   | Rules vs skills vs agents                                                  |

## Skills and agents

| Name                      | Use it to                                                           |
| ------------------------- | ------------------------------------------------------------------- |
| `new-case-study`          | Add a project (frontmatter, images, Markdoc, translation, publish)  |
| `translate-content`       | Translate a case study or UI strings; add a locale                  |
| `astro-docs-lookup`       | Check an Astro API against the installed version                    |
| `code-simplifier` (agent) | Clarity pass over recently changed files, without behaviour changes |
