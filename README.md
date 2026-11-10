# aggiovato — portfolio

Personal portfolio of Alejandro Lugo, built with Astro 7, TypeScript and Markdoc. Static output,
English and Spanish (`/es/`).

## Getting started

Requires Node ≥ 22.23.4 (`.nvmrc` pins Node 24).

```sh
nvm use
npm install
npm run assets:placeholders  # placeholders for images that are kept out of the repo
npm run dev                  # http://localhost:4321 (drafts visible)
```

## Scripts

| Command                 | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `npm run check`         | Type-check and validate content schemas          |
| `npm run lint`          | ESLint                                           |
| `npm test`              | Unit and component tests (Vitest)                |
| `npm run test:e2e`      | Playwright on a production build (incl. a11y)    |
| `npm run build`         | Production build (published projects only)       |
| `npm run verify:drafts` | Fail if a draft leaked into the build or sitemap |

`task preflight` runs everything in CI order.

## Content

Case studies live in `src/content/projects/<locale>/<name>.mdoc`, one file per language with the same
name and `slug`. Use `publicationStatus: draft` while writing; drafts never reach production.
