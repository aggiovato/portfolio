---
paths:
  - 'src/**/*.astro'
  - 'src/styles/**'
  - 'src/i18n/ui/**'
---

# Accessibility

Target WCAG 2.2 AA (§16), pending a real audit. Adapted from the zt-backoffice rule for a static
Astro site: native HTML does most of the work.

## Core rules

1. **Semantic HTML first:** `a` navigates, `button` acts, landmarks (`header`, `nav`, `main`,
   `footer`), lists for lists, `dl` for term/value data, `table` with `th scope` for tabular data.
2. **One `h1` per page** and a logical heading order. Section headings use `SectionHeading`.
3. **Accessible names everywhere:** icon-only controls get `aria-label` (translated); decorative SVG
   and images get `aria-hidden="true"` / `alt=""`. When a visible label exists, the accessible name
   contains it (WCAG 2.5.3; see the language switcher).
4. **Language:** `<html lang>` per locale; content in another language than the page gets `lang`
   (fallback cards) and links to another language get `hreflang`.
5. **Keyboard:** everything works with Tab/Shift+Tab, Enter/Space and Escape where it applies; no
   positive `tabindex`; focus never lands on hidden content. The mobile menu returns focus to its
   toggle; the back-to-top FAB moves focus to `#main`.
6. **Focus visible** at all times (`:focus-visible` in `global.css`).
7. **No essential information only on hover, in tooltips or behind animation.** Content renders
   before any effect and without JS.
8. **ARIA only when HTML cannot express it** (`aria-expanded`, `aria-controls`, `aria-current`,
   `aria-live`). Never `role="button"` on a `div`.
9. **Reduced motion and zoom:** respect `prefers-reduced-motion`; usable at 200 % zoom and 320 px.

## Verification

- Automated: `tests/e2e/a11y.spec.ts` runs axe (WCAG 2.0/2.1/2.2 A and AA tags) on every page in both
  locales and on a case study. New pages are added to its `PAGES` list. Exclusions need a narrow
  selector and a reason in the test.
- Manual, for visible changes: keyboard-only pass, screen reader smoke test (headings, landmarks,
  names), 200 % zoom, `prefers-reduced-motion: reduce`.

## Hard failures

Click handlers on non-interactive elements · removed focus outline · positive `tabindex` ·
icon-only control without a name · `aria-hidden` on focusable content · an axe violation merged
without a documented exception.
