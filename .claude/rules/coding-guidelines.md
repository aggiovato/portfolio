# Coding Guidelines

Always apply when generating, reviewing or modifying code in this repository.
Adapted from the zt-backoffice frontend rules; framework-specific parts live in `astro.md`.

## Goal

Code that is correct, simple, focused, consistent with the codebase, easy to verify and easy for
the next person to maintain. This is a small editorial site: prefer boring, readable solutions.

---

## 1. Think before coding

- State assumptions explicitly. If a request is ambiguous, ask before implementing.
- If there is more than one valid interpretation, present the options and recommend one.
- Design and content decisions come from `docs/especificacion.md` (cite the section, e.g. §15).
  It is local only (gitignored); never commit it or copy long passages into versioned files.
  If a request contradicts the spec, say so before doing it.

## 2. Prefer the simplest solution

- Do only what was requested. No configurability, abstraction or pattern for one-time use.
- No helpers or normalizers before checking native solutions (`Intl`, `URL`, `Array` methods)
  and what `src/lib/` and `src/i18n/` already provide.
- No new dependency when a few lines of TypeScript or CSS do the job (§11: no global store,
  no animation libraries, no UI kit). Adding a dependency is a decision to surface, not to make silently.

Self-check: "Is this the simplest solution a senior engineer would accept?"

## 3. Make surgical changes

- Change only what the task needs. Do not reformat or refactor adjacent code.
- If you notice unrelated dead code or a bug, mention it; do not fix it in the same change.
- Remove only the unused imports/variables your change created.

Every changed line should trace back to the request.

## 4. Work from verifiable goals

| Request        | Verifiable goal                                                |
| -------------- | -------------------------------------------------------------- |
| Add a feature  | It works in both locales, with and without JS where it applies |
| Fix a bug      | Reproduce it first (ideally in a test), then prove it is gone  |
| Refactor       | Same HTML output and same test results before and after        |
| Content change | `astro check` passes and the page renders in `npm run dev`     |

## 5. Investigate before changing

- Read the file before editing it, and look for how the same problem is solved elsewhere.
- Verify Astro APIs against the **installed** version (Astro 7, Zod 4), not memory: types in
  `node_modules/astro/dist/**/*.d.ts` and https://docs.astro.build. Use the `astro-docs-lookup` skill.

## 6. One change, one purpose

Do not mix features, refactors, content edits and dependency updates in one change.

## 7. Comments

- **All code comments are in English** (`.ts`, `.astro`, `.css`, `.mjs`, YAML, shell, tests).
  Site copy lives in `src/i18n/ui/` and `src/content/`, never in comments.
- Explain **why**, not what: constraints, invariants, browser quirks, links to spec sections.
- Reusable components start with a short `/** … */` block saying what they are for and any
  non-obvious contract (e.g. "must match the media query in Hero.astro").
- No commented-out code. No `TODO` without a reason; prefer `TODO: <what> (§section)`.

## 8. TypeScript

- Strict mode (`astro/tsconfigs/strict`). Never `any`; use `unknown` plus a guard.
- `interface Props` in every component that takes props; literal unions for variants.
- `as const` / `satisfies` for static data (`nav`, dictionaries) so keys are checked.
- Avoid deprecated APIs; when the checker flags one (`ts(6385/6387)`), replace it or say why not.

## 9. Execute clearly

When the task is clear: investigate, implement, verify, report. Before reporting done run at least
`npm run check` and the tests of the layer you touched (`testing.md`). For anything visible, run the
e2e suite or explain why not.

- Never commit or push unless asked. The repo pushes as the **aggiovato** account (see CLAUDE.md).

## Hard failures

- `any`, or `@ts-ignore` without a reason
- Hard-coded user-visible strings in components or pages (see `i18n.md`)
- `getCollection('projects')` outside `src/lib/content/projects.ts`
- Shipping client JS for something HTML/CSS can do
- Unrelated refactors inside a focused change
- Comments in a language other than English

## Definition of done

- Matches the request exactly, in every locale
- Follows existing patterns; no unnecessary code or dependency
- `npm run check`, `npm run lint`, `npm run format:check` and the relevant tests pass
- No deprecated API introduced
