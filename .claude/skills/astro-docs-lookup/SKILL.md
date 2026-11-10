---
name: astro-docs-lookup
description: >
  Verify an Astro API, config option or behaviour against the installed version before using it.
  Use for any version-sensitive Astro question (i18n, content collections, loaders, astro:assets,
  Container API, view transitions, adapters, upgrade), when an online example may come from another
  major, or when `astro check` reports a deprecation.
---

# Astro docs lookup

Inspired by incluud/astro-agent-skills `docs-lookup`, adapted to check the installed version.

1. **Installed version:** `node -p "require('astro/package.json').version"` (and the integration's
   `package.json` for `@astrojs/*`). Astro 7 = Vite 8 + Rust compiler.
2. **Types are the ground truth:** search the declarations before the web, e.g.
   - config options: `node_modules/astro/dist/types/public/config.d.ts`
   - Container API: `node_modules/astro/dist/container/index.d.ts`
   - content loaders: `node_modules/astro/dist/content/loaders/*.d.ts`
3. **Official docs:** https://docs.astro.build (English pages are the most up to date). Narrow
   queries: the exact config key, the module (`astro:i18n`, `astro:content`) or the error name.
   For a major upgrade read `/en/guides/upgrade-to/v<major>/` first.
4. **Answer** with: short answer, minimal snippet for this repo, caveats (experimental, deprecated,
   differs from older majors) and the doc link. If the docs and the types disagree, trust the types
   and say so. If it cannot be verified, say that instead of guessing.
5. Blogs and third-party guides are hints only; confirm against steps 2–3.
