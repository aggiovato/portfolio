/**
 * The gallery's image viewer: a native <dialog> with zoom (wheel, pinch, buttons, double-click),
 * pan, 90° rotation and previous/next. Keys: ← → + − R 0. It opens growing from the thumbnail
 * (FLIP) unless motion is reduced, and gives focus back to whatever opened it.
 * Markup and styles: ProjectGallery.astro; view state: src/lib/gallery/viewer.ts.
 */
import type { Point } from '../../lib/gallery/orbit';
import {
  initialView,
  panned,
  rotated,
  viewTransform,
  wrapIndex,
  zoomed,
  type View,
} from '../../lib/gallery/viewer';

export interface Viewer {
  /** Opens image `i`; focus returns to `from` on close; it grows from the image inside `origin`. */
  open(i: number, from: HTMLElement, origin?: HTMLElement): void;
  isOpen(): boolean;
}

export function createViewer(root: HTMLElement, links: HTMLAnchorElement[], reduce: MediaQueryList): Viewer {
  const dlg = root.querySelector<HTMLDialogElement>('[data-viewer]')!;
  const img = dlg.querySelector<HTMLImageElement>('[data-viewer-img]')!;
  const canvas = dlg.querySelector<HTMLElement>('[data-canvas]')!;
  const counter = dlg.querySelector<HTMLElement>('[data-counter]')!;
  const caption = dlg.querySelector<HTMLElement>('[data-caption]')!;
  let index = 0;
  let opener: HTMLElement | null = null;
  let view: View = initialView();

  const apply = (next: View) => {
    view = next;
    img.style.transform = viewTransform(view);
    canvas.classList.toggle('is-zoomed', view.scale > 1);
  };
  const reset = () => apply(initialView());
  const zoom = (factor: number) => apply(zoomed(view, factor));
  const rotate = () => apply(rotated(view));

  const show = (i: number) => {
    index = wrapIndex(i, links.length);
    const a = links[index]!;
    const thumb = a.querySelector('img');
    // Thumbnail first (already loaded, so the viewer is never empty), then the full image.
    img.src = thumb?.currentSrc || a.dataset.full!;
    img.alt = thumb?.alt ?? '';
    const fullSrc = a.dataset.full!;
    const pre = new Image();
    pre.onload = () => {
      if (links[index] === a) img.src = fullSrc;
    };
    pre.src = fullSrc;
    counter.textContent = `${index + 1} / ${links.length}`;
    caption.textContent = a.dataset.caption ?? '';
    reset();
  };

  const open = (i: number, from: HTMLElement, origin: HTMLElement = from) => {
    opener = from;
    show(i);
    dlg.showModal();
    // Grow from the thumbnail (FLIP) unless motion is reduced.
    const thumb = origin.querySelector('img');
    if (!thumb || reduce.matches) return;
    const a = thumb.getBoundingClientRect();
    const b = img.getBoundingClientRect();
    if (!b.width) return;
    img.animate(
      [
        {
          transform: `translate(${a.left + a.width / 2 - (b.left + b.width / 2)}px, ${a.top + a.height / 2 - (b.top + b.height / 2)}px) scale(${a.width / b.width})`,
          opacity: 0.6,
        },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  };

  dlg.addEventListener('close', () => opener?.focus());
  // A click on the dimmed area around the image closes the viewer.
  canvas.addEventListener('click', (e) => {
    if (e.target === canvas && view.scale <= 1) dlg.close();
  });

  const actions: Record<string, () => void> = {
    prev: () => show(index - 1),
    next: () => show(index + 1),
    'zoom-in': () => zoom(1.4),
    'zoom-out': () => zoom(1 / 1.4),
    rotate,
    reset,
    close: () => dlg.close(),
  };
  dlg
    .querySelectorAll<HTMLButtonElement>('[data-act]')
    .forEach((b) => b.addEventListener('click', () => actions[b.dataset.act ?? '']?.()));

  const keys: Record<string, () => void> = {
    ArrowLeft: actions.prev!,
    ArrowRight: actions.next!,
    '+': actions['zoom-in']!,
    '=': actions['zoom-in']!,
    '-': actions['zoom-out']!,
    r: rotate,
    '0': reset,
  };
  dlg.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLButtonElement && (e.key === 'Enter' || e.key === ' ')) return;
    const run = keys[e.key] ?? keys[e.key.toLowerCase()];
    if (run) {
      e.preventDefault();
      run();
    }
  });

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15);
    },
    { passive: false },
  );
  canvas.addEventListener('dblclick', () => (view.scale > 1 ? reset() : zoom(2.5)));

  // Pan with one pointer, pinch-zoom with two.
  const pointers = new Map<number, Point>();
  let pinch = 0;
  canvas.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId);
    if (pointers.size === 2) {
      const [p, q] = [...pointers.values()] as [Point, Point];
      pinch = Math.hypot(p.x - q.x, p.y - q.y);
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const now = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, now);
    if (pointers.size === 2) {
      const [p, q] = [...pointers.values()] as [Point, Point];
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (pinch) zoom(d / pinch);
      pinch = d;
    } else if (view.scale > 1) {
      apply(panned(view, now.x - prev.x, now.y - prev.y));
    }
  });
  const lift = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = 0;
  };
  canvas.addEventListener('pointerup', lift);
  canvas.addEventListener('pointercancel', lift);

  return { open, isOpen: () => dlg.open };
}
