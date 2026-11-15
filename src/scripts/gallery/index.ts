/**
 * Starts every case study gallery on the page ([data-gallery], ProjectGallery.astro).
 * - Orbit mode (≥768px, motion allowed, more than one image): the system map, with the caption
 *   list as the selector and the preview opening the viewer.
 * - Otherwise the grid: each image opens the viewer directly.
 */
import { createSystem } from './system';
import { createViewer } from './viewer';

export function initGalleries(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((root) => {
    const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-shots] a')];
    const viewer = createViewer(root, links, reduce);
    const orbitMode = window.matchMedia('(min-width: 768px)').matches && !reduce.matches && links.length > 1;
    if (orbitMode) {
      createSystem(root, links, viewer);
      return;
    }
    links.forEach((a, i) =>
      a.addEventListener('click', (e) => {
        e.preventDefault();
        viewer.open(i, a);
      }),
    );
  });
}
