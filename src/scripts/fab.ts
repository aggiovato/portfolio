/**
 * The «Back to top» FAB (BackToTop.astro) as a small API, so whoever drives it does not reach into
 * its markup or classes: BackToTop's own scroll script on every page, or the hero's rocket on the
 * home (src/scripts/hero/rocket-fab.ts), which becomes the FAB as the reader scrolls.
 *
 * Contract: an element with [data-fab-driver] on the page means «this page shows and hides the
 * FAB itself»; BackToTop's scroll script then stays out.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const findFab = () => document.querySelector<HTMLButtonElement>('[data-fab]');

/** Whether something else on this page drives the FAB ([data-fab-driver]). */
export const fabIsDriven = () => document.querySelector('[data-fab-driver]') !== null;

/** Shows the FAB, with its short entrance when `animate` (callers pass false under reduced motion). */
export function showFab(fab: HTMLButtonElement, animate: boolean): void {
  fab.hidden = false;
  fab.classList.remove('is-launching', 'is-entering');
  if (animate) {
    void fab.offsetWidth; // restart the entrance animation
    fab.classList.add('is-entering');
  }
}

/** Hides the FAB without dropping keyboard focus on <body>: focus moves to #main first. */
export function hideFab(fab: HTMLButtonElement): void {
  if (document.activeElement === fab) document.getElementById('main')?.focus({ preventScroll: true });
  fab.hidden = true;
}

/**
 * Scrolls to the top and sends focus to the start of the content (like the skip link).
 * `liftOff`: the rocket rises out of the button as the page scrolls (not under reduced motion).
 */
export function backToTop(fab: HTMLButtonElement, { liftOff = false } = {}): void {
  const instant = reduced();
  if (liftOff && !instant) fab.classList.add('is-launching');
  window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
  document.getElementById('main')?.focus({ preventScroll: true });
}
