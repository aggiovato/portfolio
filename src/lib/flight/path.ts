/**
 * Flight geometry for the hero rocket: easings, headings, fallback curves, sampling of a physical
 * trajectory over time, the projects horizon and where the waypoint label goes.
 * Pure functions in hero pixels; the DOM side lives in src/scripts/hero/ (unit-tested on its own).
 */
import type { Vec } from './gravity';

/** A box in hero pixels: left, top, right, bottom. */
export type Rect = { l: number; t: number; r: number; b: number };

/** Rocket position, travelled length along the drawn path and heading, at one instant. */
export type FlightState = { p: Vec; len: number; angle: number };

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeSine = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

/** Smoothstep between e0 and e1, clamped to [0, 1]. */
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Heading in CSS degrees of the segment a → b (0° points up, as the rocket icon does). */
export const headingDeg = (a: Vec, b: Vec) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;

/** Interpolates between two headings the shortest way round. */
export const lerpAngle = (a: number, b: number, k: number) => {
  const d = ((((b - a) % 360) + 540) % 360) - 180;
  return a + d * k;
};

/** Point at t on the cubic Bézier a → b with control points c1, c2. */
export const cubicPoint = (a: Vec, c1: Vec, c2: Vec, b: Vec, t: number): Vec => {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
  };
};

/**
 * Fallback flight curve (SVG path data) when there is no clean physical solution.
 * - 'arc' (clicks): bows upwards, proportional to the distance.
 * - 'rise' (entrance): takes off vertically and arrives horizontally; stays away from the text.
 */
export function curveFor(a: Vec, b: Vec, mode: 'arc' | 'rise' = 'arc'): string {
  if (mode === 'rise') {
    const c1 = { x: a.x, y: a.y - Math.abs(b.y - a.y) * 0.75 };
    const c2 = { x: a.x + (b.x - a.x) * 0.45, y: b.y };
    return `M${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
  }
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bow = Math.min(len * 0.32, 220);
  const c1 = { x: a.x + dx * 0.25 + nx * bow, y: a.y + dy * 0.25 + ny * bow };
  const c2 = { x: a.x + dx * 0.75 + nx * bow * 0.6, y: a.y + dy * 0.75 + ny * bow * 0.6 };
  return `M${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
}

/** SVG path data through simulated points (one decimal is enough on screen). */
export const polylineData = (points: Vec[]) =>
  `M${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')}`;

/** Whether any point falls inside a box grown by `margin` (the entrance must avoid the text). */
export const crossesRects = (points: Vec[], rects: Rect[], margin: number) =>
  points.some((p) =>
    rects.some((r) => p.x > r.l - margin && p.x < r.r + margin && p.y > r.t - margin && p.y < r.b + margin),
  );

/**
 * State along a simulated trajectory at instant u ∈ [0, 1]. Samples are evenly spaced in TIME, so
 * the rocket keeps its real speed (it accelerates near Jupiter); blended 35/65 with a smooth curve
 * so take-off and landing are not jerky. `drawnLength` is the length of the rendered SVG path:
 * travelled length is scaled to it, so the trail mask follows the rocket exactly.
 */
export function timedPath(points: Vec[], drawnLength: number): (u: number) => FlightState {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1]! + Math.hypot(points[i]!.x - points[i - 1]!.x, points[i]!.y - points[i - 1]!.y));
  }
  const scale = drawnLength / (cum[cum.length - 1] || 1);
  const last = points.length - 1;
  return (raw) => {
    const u = Math.min(1, Math.max(0, raw));
    const tau = 0.35 * u + 0.65 * easeSine(u);
    const f = Math.min(last, tau * last);
    const i = Math.min(last - 1, Math.floor(f));
    const k = f - i;
    const a = points[i]!;
    const b = points[i + 1]!;
    return {
      p: { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k },
      len: (cum[i]! + (cum[i + 1]! - cum[i]!) * k) * scale,
      angle: headingDeg(a, b),
    };
  };
}

/**
 * Keeps a landing point inside the hero and above the projects horizon (HorizonArc): a symmetric
 * quadratic with flush edges and its top `depth` px above its box, so the surface at x is
 * top + depth·(1 − 2s)², s = x / width. `margin` leaves room for the rocket and its waypoint.
 */
export function aboveHorizon(
  p: Vec,
  hero: { width: number; height: number },
  horizon: { top: number; depth: number } | null,
  margin: number,
): Vec {
  const s = Math.min(1, Math.max(0, p.x / hero.width));
  const surface = horizon
    ? Math.min(hero.height, horizon.top + horizon.depth * (1 - 2 * s) ** 2)
    : hero.height;
  return {
    x: Math.min(hero.width - margin, Math.max(margin, p.x)),
    y: Math.min(p.y, surface - margin),
  };
}

/**
 * Where the waypoint label goes beside a landing point `p`: on the side opposite the arrival
 * (`from`), so the trail stays visible; the other side when it does not fit or would cover text;
 * as a last resort whichever side fits. `flipped` means it sits on the left.
 */
export function waypointSpot(o: {
  p: Vec;
  from: Vec;
  size: { w: number; h: number };
  gap: number;
  heroWidth: number;
  text: Rect[];
}): { x: number; y: number; flipped: boolean } {
  const { p, from, gap, heroWidth, text } = o;
  const { w, h } = o.size;
  const y = p.y - 30;
  const right = { x: p.x + gap, y };
  const left = { x: p.x - gap - w, y };
  const fitsRight = right.x + w <= heroWidth - 8;
  const fitsLeft = left.x >= 8;
  const hitsText = (b: Vec) => text.some((r) => b.x < r.r && b.x + w > r.l && b.y < r.b && b.y + h > r.t);
  const order = from.x > p.x ? [left, right] : [right, left];
  const ok = (b: Vec) => (b === right ? fitsRight : fitsLeft) && !hitsText(b);
  const spot = order.find(ok) ?? (fitsRight ? right : left);
  return { ...spot, flipped: spot === left };
}

/**
 * The short dotted trail behind a rocket in transit: one dot every two frames from the recorded
 * positions, newest first, at most `count`.
 */
export const trailDots = (history: Vec[], count: number): Vec[] =>
  history
    .filter((_, i) => (history.length - 1 - i) % 2 === 0)
    .slice(-count)
    .reverse();

/** Jupiter in hero pixels: centre and radius of the disc. */
export type Planet = { c: Vec; R: number };

/**
 * How the rocket comes to rest at `p`. On Jupiter (within its disc, plus half a rocket of
 * tolerance) it stands on its pads along the surface normal, pointing away from the centre.
 * In open sky there is no ground: it hovers in its flight pose, `angle` null keeps its heading.
 */
export function landingPose(
  p: Vec,
  planet: Planet | null,
  rocket: number,
): { onPlanet: boolean; angle: number | null } {
  if (planet && Math.hypot(p.x - planet.c.x, p.y - planet.c.y) <= planet.R + rocket / 2) {
    const a = headingDeg(planet.c, p);
    return { onPlanet: true, angle: ((((a + 180) % 360) + 360) % 360) - 180 }; // in [-180, 180)
  }
  return { onPlanet: false, angle: null };
}

/** The point of Jupiter's limb in the direction of `p`, lifted `lift` px off it (pads on the rim). */
export function onLimb(p: Vec, planet: Planet, lift: number): Vec {
  const dx = p.x - planet.c.x;
  const dy = p.y - planet.c.y;
  const n = Math.hypot(dx, dy) || 1;
  return { x: planet.c.x + (dx / n) * (planet.R + lift), y: planet.c.y + (dy / n) * (planet.R + lift) };
}
