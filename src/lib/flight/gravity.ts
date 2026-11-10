/**
 * Rocket flight physics: single-body Newtonian gravity (Jupiter).
 *
 *   a = GM · (c − p) / (|c − p|² + ε²)^(3/2)
 *
 * - ε (softening) keeps the acceleration from blowing up near the surface.
 * - Semi-implicit Euler integration (velocity, then position): stable and cheap.
 * - To land EXACTLY on the requested point it solves a boundary value problem by «shooting»:
 *   simulate, measure the error at the target and correct the initial velocity
 *   (v += error / T) until the error is < 0.75 px. With moderate gravity it converges in a few
 *   iterations; if it does not, or the trajectory hits the planet, it tries faster
 *   (less flight time = less deflection) and, as a last resort, returns null.
 *
 * Everything in pixels and simulation seconds; no DOM dependencies (unit-tested on its own).
 */

export type Vec = { x: number; y: number };
export type Body = { c: Vec; R: number };
export type Trajectory = { points: Vec[]; duration: number };

export const GRAVITY = {
  /** GM = strength · R · refSpeed². Scales with the planet size on screen. */
  strength: 1,
  refSpeed: 700,
  /** ε as a fraction of the radius. */
  softening: 0.35,
  steps: 180,
  /** Cruise px/s used to estimate the base flight time. */
  cruise: 600,
  minDuration: 1.05,
  maxDuration: 1.9,
} as const;

const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

export function simulate(
  start: Vec,
  v0: Vec,
  duration: number,
  body: Body,
  gm: number,
  steps: number = GRAVITY.steps,
): Vec[] {
  const dt = duration / steps;
  const eps2 = (body.R * GRAVITY.softening) ** 2;
  let { x, y } = start;
  let vx = v0.x;
  let vy = v0.y;
  const points: Vec[] = [{ x, y }];
  for (let i = 0; i < steps; i++) {
    const dx = body.c.x - x;
    const dy = body.c.y - y;
    const r2 = dx * dx + dy * dy + eps2;
    const k = gm / (r2 * Math.sqrt(r2));
    vx += dx * k * dt;
    vy += dy * k * dt;
    x += vx * dt;
    y += vy * dt;
    points.push({ x, y });
  }
  return points;
}

/** Does it enter the disc after having been outside? (taking off from the surface does not count). */
function crashes(points: Vec[], body: Body): boolean {
  let wasOutside = false;
  for (const p of points) {
    const d = dist(p, body.c);
    if (d >= body.R) wasOutside = true;
    else if (wasOutside && d < body.R * 0.98) return true;
  }
  return false;
}

export function solveTrajectory(start: Vec, target: Vec, body: Body): Trajectory | null {
  const gm = GRAVITY.strength * body.R * GRAVITY.refSpeed ** 2;
  const base = Math.min(
    GRAVITY.maxDuration,
    Math.max(GRAVITY.minDuration, dist(start, target) / GRAVITY.cruise),
  );
  const targetOnPlanet = dist(target, body.c) < body.R;

  // Faster = less time under gravity = less curved trajectory.
  for (const factor of [1, 0.75, 0.55, 0.4]) {
    const T = base * factor;
    const v = { x: (target.x - start.x) / T, y: (target.y - start.y) / T };
    let points: Vec[] = [];
    let error = Infinity;

    for (let k = 0; k < 60; k++) {
      points = simulate(start, v, T, body, gm);
      const end = points[points.length - 1];
      const ex = target.x - end.x;
      const ey = target.y - end.y;
      error = Math.hypot(ex, ey);
      if (!Number.isFinite(error)) break;
      if (error < 0.75) break;
      v.x += ex / T;
      v.y += ey / T;
    }

    if (!(error < 2)) continue;
    if (!targetOnPlanet && crashes(points, body)) continue;
    points[points.length - 1] = { ...target }; // exact closure (error < 2 px)
    return { points, duration: T };
  }
  return null;
}
