---
paths:
  - 'src/**/*.astro'
  - 'src/styles/**'
---

# Styling

Plain CSS with design tokens (§5, §6). No Tailwind, no CSS-in-JS, no UI kit.

- **Tokens first:** colours, spacing, type scale, radii, durations and easing come from
  `src/styles/tokens.css` (`var(--color-*)`, `--space-*`, `--text-*`, `--radius-*`, `--duration-*`).
  A new value that repeats becomes a token; a one-off decorative value (a glow, a gradient stop)
  may stay local with a comment.
- **Scoped by default:** each component styles itself in its `<style>`. `:global()` only to reach
  children rendered by another component (`<Image>`, slots) or JS-created nodes. Shared utilities
  (`.container`, `.btn`, `.chip`, `.link-underline`, `.path-label`, `.visually-hidden`) live in
  `global.css`; add one only when three or more components need it.
- **Colour roles (§5):** mostly neutral surfaces; lavender (`--color-accent`) only for actions and
  focus points; peach (`--color-jupiter`) as a small warm accent. Primary buttons use dark text on
  lavender. Verify contrast for every state (hover, focus, disabled), especially over images.
- **Responsive (§9):** mobile first. Breakpoints in use: 360, 640, 768, 900, 1024, 1100 px; prefer
  container queries for cards (`container-type: inline-size`). No horizontal overflow at 320, 375,
  768, 1024 and 1440 px (`responsive.spec.ts`). Touch targets ≥ 44 px.
- **Motion (§15):** wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`;
  `global.css` also neutralises durations under `reduce`. No scroll hijacking, no infinite motion
  without a way to stop it, no expensive filters animated over large areas.
- **States:** keep `:focus-visible` outlines (`--color-focus`); never remove them without an equally
  visible replacement. Hover is an enhancement, not the only way to reveal information.
- Logical properties (`margin-inline`, `padding-block`) for new code; `env(safe-area-inset-*)` on
  fixed elements.
- Prettier formats CSS; do not hand-align.
