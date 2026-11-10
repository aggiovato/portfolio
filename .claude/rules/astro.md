---
paths:
  - 'src/**'
  - 'astro.config.mjs'
  - 'markdoc.config.mjs'
---

# Astro architecture and practices

Astro 7 (Vite 8, Rust compiler), static output, TypeScript strict. Check every API against the
installed version (`astro-docs-lookup` skill); guides online often show other majors.

## Layers

| Layer          | Location                         | Rule                                                                                   |
| -------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| Routes         | `src/pages/[...locale]/`         | Thin: load data, pick a layout, compose components. No business logic.                 |
| Layout         | `src/layouts/BaseLayout.astro`   | `<html lang>`, SEO/OG, hreflang, skip link, header/footer. One layout for now.         |
| Components     | `src/components/*.astro`         | Receive data through `Props`; no data fetching, no per-project special cases (§6).     |
| Content access | `src/lib/content/projects.ts`    | The **only** caller of `getCollection('projects')` (draft filter, §13).                |
| Pure logic     | `src/lib/**/*.ts`, `src/i18n/`   | No `astro:*` imports, so Vitest covers it directly (`project-utils.ts`, `gravity.ts`). |
| Content        | `src/content/projects/<locale>/` | Markdoc case studies validated by `src/content.config.ts`.                             |
| Site data      | `src/data/site.ts`               | Locale-independent data only (name, email, links). Copy goes to `src/i18n/ui/`.        |
| Tokens         | `src/styles/tokens.css`          | Every colour, size, radius and duration (see `styling.md`).                            |

A new page is a file under `src/pages/[...locale]/` exporting
`getStaticPaths = (() => localeParams()) satisfies GetStaticPaths` (see `i18n.md`). Only `404.astro`
lives outside, because static hosts serve a single `/404.html`.

## Rendering and JavaScript

- Everything is prerendered (`output: 'static'`). Adding on-demand rendering needs an adapter and a
  reason from the spec (editor, previews; §1, §13), not convenience.
- **Zero JS by default.** Content and navigation work without JavaScript (§21); JS is progressive
  enhancement. Check the no-JS path (`responsive.spec.ts` has a `javaScriptEnabled: false` test).
- Client behaviour goes in a component `<script>` (bundled, TypeScript, deduplicated, `type=module`).
  Use `<script is:inline>` only for code that must run before paint (the `js` class in the layout).
- Scripts find their elements through `data-*` hooks (`[data-carousel]`, `[data-launchpad]`) and
  must support several instances when the component can repeat.
- No UI framework islands today. React is allowed only for real interactive tools (§11: playground,
  complex search), as a small leaf with the lightest directive (`client:visible` > `client:idle` >
  `client:load`); never hydrate layout regions.
- Page transitions are native cross-document View Transitions in CSS (`@view-transition`), not
  `<ClientRouter />`. Scripts therefore run on every full page load; do not add router lifecycle code.
  Shared elements use `view-transition-name: cover-<slug>` / `title-<slug>`; names must be unique per page.

## Astro 7 specifics

- The Rust compiler rejects unclosed tags and no longer fixes invalid nesting (e.g. `<div>` inside
  `<p>`). Write valid HTML.
- `compressHTML` defaults to `'jsx'` (JSX whitespace rules): whitespace that spans a line break
  between elements can disappear. When two inline pieces need a space, keep them on one line or add
  `{' '}`, and check the rendered text.
- Markdown uses the Sätteri processor by default; remark/rehype plugins would need `unified()` and
  `@astrojs/markdown-remark`. Case studies use Markdoc, which is unaffected.
- The Container API is still `experimental_AstroContainer` (used by `tests/component/`).

## Images and assets

- Images in `src/assets/` through `astro:assets` (`<Image>` / `<Picture>`) with `widths` and `sizes`.
  `public/` only for files that need a fixed URL (favicon).
- Decorative images: `alt=""` and `aria-hidden` on the wrapper. Content images: a useful `alt`.
- Only the LCP image gets `loading="eager"` + `fetchpriority="high"`; everything else is lazy.
- Reserve space (aspect-ratio or intrinsic size) so nothing shifts (CLS ≤ 0.1).

## Performance budget (§16)

Own JS on the home ≲ 50 KB compressed · hero image ≈ 100–180 KB mobile / 200–350 KB desktop ·
LCP ≤ 2.5 s · CLS ≤ 0.1. Fonts are self-hosted variable WOFF2 (`@fontsource-variable/*`); do not add
families or weights without a reason.

## SEO

`BaseLayout` sets title, description, canonical, OG and hreflang. Pages pass `title`/`description`
translated; case studies pass `alternates` and `noindex` for drafts. The sitemap only lists
generated pages, so drafts never appear in production (`npm run verify:drafts`).

## Checklist

- [ ] Works without JS; JS only enhances
- [ ] No hard-coded copy (`i18n.md`), valid HTML for the Rust compiler
- [ ] Data comes from `src/lib/content/projects.ts` or props
- [ ] Images via `astro:assets` with `alt`, sizes and lazy loading
- [ ] `npm run check` and the relevant tests pass
