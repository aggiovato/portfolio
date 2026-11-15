/**
 * State of the gallery's image viewer (zoom, rotation, pan) and its navigation. Pure; the dialog
 * and its gestures are src/scripts/gallery/viewer.ts.
 */

export interface View {
  scale: number;
  /** Rotation in degrees, a multiple of 90. */
  rot: number;
  x: number;
  y: number;
}

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 6;

export const initialView = (): View => ({ scale: 1, rot: 0, x: 0, y: 0 });

/** Zooms by `factor` within [MIN_ZOOM, MAX_ZOOM]; at or below 1× the image is centred again. */
export function zoomed(view: View, factor: number): View {
  const scale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.scale * factor));
  return scale <= 1 ? { ...view, scale, x: 0, y: 0 } : { ...view, scale };
}

/** A quarter turn clockwise. */
export const rotated = (view: View): View => ({ ...view, rot: (view.rot + 90) % 360 });

/** Moves the image by a pointer delta; only while zoomed in, as there is nothing to pan otherwise. */
export const panned = (view: View, dx: number, dy: number): View =>
  view.scale > 1 ? { ...view, x: view.x + dx, y: view.y + dy } : view;

/** CSS transform for a view. */
export const viewTransform = (v: View) =>
  `translate(${v.x}px, ${v.y}px) scale(${v.scale}) rotate(${v.rot}deg)`;

/** Index `i` wrapped into [0, count): previous from the first is the last, next from the last the first. */
export const wrapIndex = (i: number, count: number) => ((i % count) + count) % count;
