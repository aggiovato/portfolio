---
name: translate-content
description: >
  Translate portfolio content or interface strings into another locale, or add a new locale. Use
  when the user says "translate this case study", "add the Spanish version", "traducir", "add a
  language", "missing translation", or when a new UI key needs values in every dictionary.
---

# Translate content

Standard: `.claude/rules/i18n.md`. Locales: `src/i18n/config.ts`.

## Interface strings

1. Add the key to `src/i18n/ui/en.ts` (source of truth), grouped with its feature prefix
   (`hero.*`, `project.*`, `nav.*`…).
2. Add the same key to every other dictionary (`es.ts`…). `astro check` fails until all exist.
3. Keep the same `{placeholders}`; the unit test `tests/unit/i18n.test.ts` checks them.
4. Tone: Spanish uses «tú», short sentences, no anglicisms when a common Spanish word exists
   (but keep technical terms like _frontend_, _stack_, _deploy_ when that is how developers say it).
   Typographic quotes «» in Spanish, “” in English.

## A case study

1. Copy `src/content/projects/en/<name>.mdoc` to `src/content/projects/<locale>/<name>.mdoc`
   (same file name).
2. Translate: `title` only if it is not a product name, `summary` (≤ 220), `tagline` (≤ 70),
   `role`, `periodLabel`, `categories`, `stack[].rationale`, every `alt` and `caption`, the body and
   the string attributes of Markdoc tags.
3. Keep identical: `slug`, image `src`, `links`, `stack[].name` and `layer`, `projectType`,
   `projectStatus`, `featured`, `featuredOrder`, dates. Code blocks stay as they are.
4. Keep `publicationStatus: draft` until the author has reviewed the translation, even if the
   original is published. Tell the user which files need review.
5. Verify: `npm run check` (lengths), `npm test` (parity), then open `/es/work/<slug>/` and use the
   language switcher both ways.

## A new locale

Follow "Adding a locale" in `.claude/rules/i18n.md`, then run the full `task preflight`.
