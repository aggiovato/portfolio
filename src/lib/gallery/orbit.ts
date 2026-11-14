/**
 * Pure maths for the orbital gallery (ProjectGallery.astro): positions on a tilted elliptical
 * orbit, depth for the 3D effect, and the elastic drag borrowed from the yRest docs home
 * (a damped spring that pulls a dragged item back and a ring that bends towards it).
 * No DOM here, so Vitest covers it directly.
 */

export interface Point {
  x: number;
  y: number;
}

export interface Orbit {
  /** Centre of the ellipse. */
  cx: number;
  cy: number;
  /** Horizontal and vertical radii; ry < rx reads as an orbit seen from slightly above. */
  rx: number;
  ry: number;
}

const TAU = Math.PI * 2;

/** Point on the orbit at `angle` (radians). Angle π/2 is the front (closest to the viewer). */
export function orbitPoint(orbit: Orbit, angle: number): Point {
  return { x: orbit.cx + orbit.rx * Math.cos(angle), y: orbit.cy + orbit.ry * Math.sin(angle) };
}

/** Depth in [0, 1]: 1 at the front of the orbit (angle π/2), 0 at the back (angle 3π/2). */
export function depthOf(angle: number): number {
  return (Math.sin(angle) + 1) / 2;
}

/** Linear interpolation, used to map depth to scale and brightness. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Evenly spaced start angles for `count` items, the first one at the front. */
export function startAngles(count: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.PI / 2 + (i * TAU) / Math.max(count, 1));
}

/** Smallest signed difference a − b, in (−π, π]. */
export function angleDelta(a: number, b: number): number {
  const d = (((a - b) % TAU) + TAU) % TAU;
  return d > Math.PI ? d - TAU : d;
}

/** Limits a drag offset to `max` pixels, keeping its direction. */
export function clampDrag(offset: Point, max: number): Point {
  const dist = Math.hypot(offset.x, offset.y);
  if (dist <= max || dist === 0) return offset;
  const f = max / dist;
  return { x: offset.x * f, y: offset.y * f };
}

export interface SpringState {
  offset: Point;
  velocity: Point;
}

/**
 * One frame of the spring that returns a released item to its orbit slot (offset → 0).
 * Same constants as the yRest docs: stiffness 0.12, damping 0.8 per frame.
 */
export function springStep(state: SpringState, stiffness = 0.12, damping = 0.8): SpringState {
  const vx = (state.velocity.x - state.offset.x * stiffness) * damping;
  const vy = (state.velocity.y - state.offset.y * stiffness) * damping;
  return { offset: { x: state.offset.x + vx, y: state.offset.y + vy }, velocity: { x: vx, y: vy } };
}

/** True once the spring has settled (both offset and velocity below `epsilon` px). */
export function isAtRest(state: SpringState, epsilon = 0.1): boolean {
  return (
    Math.hypot(state.offset.x, state.offset.y) < epsilon &&
    Math.hypot(state.velocity.x, state.velocity.y) < epsilon
  );
}

/**
 * Samples the orbit as a closed polyline, bending it towards a dragged item: each sample moves
 * by the drag offset weighted by a smooth falloff of its angular distance to the item (1 at the
 * item, 0 beyond `span` radians). That is what makes the ring look elastic.
 */
export function deformedRing(
  orbit: Orbit,
  samples: number,
  pull?: { angle: number; offset: Point; span?: number },
): Point[] {
  const span = pull?.span ?? Math.PI / 2.5;
  return Array.from({ length: samples }, (_, i) => {
    const angle = (i / samples) * TAU;
    const p = orbitPoint(orbit, angle);
    if (!pull) return p;
    const d = Math.abs(angleDelta(angle, pull.angle));
    if (d >= span) return p;
    // Cosine falloff: smooth at both ends, so the bend has no kinks.
    const w = (1 + Math.cos((d / span) * Math.PI)) / 2;
    return { x: p.x + pull.offset.x * w, y: p.y + pull.offset.y * w };
  });
}

/** SVG path data for a polyline, closed by default (the whole ring) or open (half of it). */
export function toPath(points: Point[], closed = true): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  const d = `M${first.x.toFixed(1)} ${first.y.toFixed(1)}${rest.map((p) => `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')}`;
  return closed ? `${d}Z` : d;
}
