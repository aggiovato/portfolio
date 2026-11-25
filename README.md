# aggiovato — portfolio

[![CI](https://github.com/aggiovato/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/aggiovato/portfolio/actions/workflows/ci.yml)

Personal portfolio of Heber Alejandro Lugo, built with Astro 7, TypeScript and Markdoc. Static output in
English, Spanish (`/es/`) and Italian (`/it/`).

## Getting started

Requires Node ≥ 22.23.4 (`.nvmrc` pins Node 24).

```sh
nvm use
npm install
npm run assets:placeholders  # placeholders for any referenced image that is missing
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

## Project releases

Each project's own pipeline keeps its case study current: when one of its versions reaches
production, it calls [`project-release.yml`](.github/workflows/project-release.yml), which sends
the facts in the project's `portfolio.yml` (status, links) plus the version and its day. The
portfolio records them in `src/data/releases/<slug>.json` and deploys the last release with them
([`project-sync.yml`](.github/workflows/project-sync.yml)), without a new site version. The case
study shows the latest version; its prose stays hand-written. Setup for a project is in the header
of `project-release.yml`.
