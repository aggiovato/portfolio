/**
 * Layout of the orbital gallery (ProjectGallery.astro): which ring each moon is on, how big the
 * rings are on the stage, how a moon looks at a given depth, how the orbit eases to a stop and the
 * trail from the selected moon to the preview. Pure; the DOM side is src/scripts/gallery/.
 */
import { lerp, startAngles, type Orbit, type Point } from './orbit';

export interface RingPlan {
  /** Indexes of the moons on this ring. */
  moons: number[];
  /** Milliseconds per turn: inner rings turn faster, as real moons do. */
  period: number;
  /** Initial rotation, staggered so moons on different rings do not line up. */
  rotation: number;
}

/** One ring up to four moons; beyond that an inner and an outer ring (half and half). */
export function planRings(count: number): RingPlan[] {
  const ids = Array.from({ length: count }, (_, i) => i);
  const split = count > 4 ? Math.floor(count / 2) : 0;
  const groups = split ? [ids.slice(0, split), ids.slice(split)] : [ids];
  return groups.map((moons, r) => ({
    moons,
    period: groups.length > 1 && r === 0 ? 90_000 : 150_000,
    rotation: r * 0.6,
  }));
}

/** Each moon's slot on its ring: evenly spaced, the first one of every ring at the front. */
export function slotAngles(rings: RingPlan[], count: number): number[] {
  const slots = new Array<number>(count).fill(0);
  for (const ring of rings) {
    const angles = startAngles(ring.moons.length);
    ring.moons.forEach((moon, k) => (slots[moon] = angles[k]!));
  }
  return slots;
}

/** Ring `index` of `total` on a stage of `width` × `height`; seen from slightly above (ry < rx). */
export function ringOrbit(width: number, height: number, index: number, total: number): Orbit {
  const scale = (total > 1 ? [0.3, 0.46] : [0.42])[index] ?? 0.42;
  return { cx: width / 2, cy: height / 2, rx: width * scale, ry: height * scale * 0.62 };
}

/**
 * How a moon looks at `depth` (0 back, 1 front). Layers: back rings 1 < back moons 2 < planet 3 <
 * front rings 4 < front moons 5, so back moons pass behind the planet.
 */
export function moonLook(depth: number): { zIndex: number; dim: number; scale: number } {
  return { zIndex: depth >= 0.5 ? 5 : 2, dim: 1 - depth, scale: lerp(0.6, 1, depth) };
}

/** Orbit speed for the next frame: eases towards 0 while it must stay still, back to 1 after. */
export const nextSpeed = (speed: number, still: boolean, dt: number) =>
  speed + ((still ? 0 : 1) - speed) * Math.min(1, dt / 260);

/** The dotted trail from the selected moon `a` to the preview `b`: a quadratic that rises 40 px. */
export function landingTrail(a: Point, b: Point): string {
  const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - 40 };
  const f = (n: number) => n.toFixed(1);
  return `M${f(a.x)} ${f(a.y)} Q ${f(c.x)} ${f(c.y)} ${f(b.x)} ${f(b.y)}`;
}
