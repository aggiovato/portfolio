---
paths:
  - 'tests/**'
  - 'src/**'
  - 'vitest.config.ts'
  - 'playwright.config.ts'
  - '.github/workflows/**'
---

# Testing layers

Tests proportional to risk (§21): validate content, cover logic, smoke-test what a visitor does.
Do not write tests that only repeat CSS classes or tokens.

| Layer     | Tool                               | Location           | Covers                                                            | Command                 |
| --------- | ---------------------------------- | ------------------ | ----------------------------------------------------------------- | ----------------------- |
| Static    | Prettier, ESLint, `astro check`    | —                  | Formatting, lint, types of `.astro`/`.ts`, **content schemas**    | `task check` / `lint`   |
| Unit      | Vitest (node)                      | `tests/unit/`      | Pure logic in `src/lib/` and `src/i18n/`                          | `npm test`              |
| Component | Vitest + Container API             | `tests/component/` | `.astro` components with logic (rows, labels, conditional output) | `npm test`              |
| Build     | `astro build` + `verify-drafts.sh` | `scripts/`         | Production output: routes, sitemap, no draft leaks                | `npm run verify:drafts` |
| E2E       | Playwright (+ axe) on a prod build | `tests/e2e/`       | Navigation, i18n, menu, carousel, transitions, overflow, a11y     | `npm run test:e2e`      |

`task preflight` runs all of them in CI order. CI (`.github/workflows/ci.yml`) runs the same gates on
every PR and push to `main`.

## When a test is required

| Change                                                     | Test                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| Pure function in `src/lib/` or `src/i18n/`                 | **Always** a unit test: inputs → outputs, edge cases      |
| Component with logic (conditional rows, labels, fallbacks) | Component test asserting the rendered contract            |
| New page or route                                          | Add it to `navigation`, `responsive` and `a11y` e2e lists |
| Interactive enhancement (`<script>`)                       | E2E for the behaviour, keyboard path and no-JS fallback   |
| New UI string                                              | Nothing extra: types + the dictionary unit test cover it  |
| Bug fix                                                    | A test that fails without the fix                         |
| Pure markup/CSS tweak, content text                        | None; `astro check` + a visual check                      |

## Unit and component tests

- Import from `src/` with relative paths; logic that needs `astro:content` is split into a pure
  module first (`projects.ts` → `project-utils.ts`).
- Fixtures are factories with complete valid objects, patched per test (`aProject(id, patch)`).
- Component tests render with `experimental_AstroContainer` and assert visible text/attributes, not
  class names. `Astro.currentLocale` is undefined in the container, so they render the default
  locale; locale behaviour is covered by unit and e2e tests.
- No snapshot tests of whole pages: they break on every copy change and review nothing.

## E2E tests

- Playwright builds `dist-e2e/` with `SHOW_DRAFTS=1` and serves it with `astro preview` on :4322;
  never point it at `astro dev`. Projects: `desktop` and `mobile` (Pixel 7). Use `test.skip` with a
  reason for viewport-specific behaviour.
- Selectors: role and accessible name first (`getByRole('link', { name })`), then `data-*` hooks.
  Avoid CSS classes unless the class is the contract (e.g. `.pcard` count).
- No `waitForTimeout`. Wait on locators, URLs or `expect.poll` (events such as `pagereveal` can fire
  after the URL commits).
- Spanish pages are tested through `/es/…` with Spanish names; i18n rules live in `i18n.spec.ts`.
- axe runs in `a11y.spec.ts` with WCAG A/AA tags; a violation is a bug, not a snapshot to update.
- Locally the browser is the installed Chrome (`PW_CHANNEL` defaults to `chrome`); CI uses
  `PW_CHANNEL=chromium` after `npx playwright install --with-deps chromium`.

## Checklist

- [ ] New logic has its unit/component test in the same change
- [ ] New pages are in the e2e page lists (navigation, responsive, a11y) for both locales
- [ ] No `waitForTimeout`, no class-only selectors, no whole-page snapshots
- [ ] `npm test` and, for visible changes, `npm run test:e2e` pass
