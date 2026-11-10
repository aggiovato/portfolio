import { describe, expect, it } from 'vitest';
import { GRAVITY, simulate, solveTrajectory, type Body } from '../../src/lib/flight/gravity';

const planet: Body = { c: { x: 1000, y: 600 }, R: 300 };
const gm = GRAVITY.strength * planet.R * GRAVITY.refSpeed ** 2;

describe('simulate', () => {
  it('returns steps + 1 points starting at the start position', () => {
    const points = simulate({ x: 0, y: 0 }, { x: 100, y: 0 }, 1, planet, gm, 50);
    expect(points).toHaveLength(51);
    expect(points[0]).toEqual({ x: 0, y: 0 });
  });

  it('bends the path towards the planet', () => {
    const points = simulate({ x: 0, y: 0 }, { x: 600, y: 0 }, 1, planet, gm);
    // The planet sits below the straight line y = 0, so gravity pulls the path downwards.
    expect(points[points.length - 1].y).toBeGreaterThan(0);
  });
});

describe('solveTrajectory', () => {
  it('lands exactly on the target', () => {
    const target = { x: 400, y: 100 };
    const traj = solveTrajectory({ x: 100, y: 400 }, target, planet);
    expect(traj).not.toBeNull();
    expect(traj!.points[traj!.points.length - 1]).toEqual(target);
  });

  it('keeps the flight time within the configured range', () => {
    const traj = solveTrajectory({ x: 100, y: 400 }, { x: 400, y: 100 }, planet);
    expect(traj!.duration).toBeGreaterThan(0);
    expect(traj!.duration).toBeLessThanOrEqual(GRAVITY.maxDuration);
  });

  it('never crosses the planet when the target is outside it', () => {
    const traj = solveTrajectory({ x: 500, y: 600 }, { x: 1500, y: 600 }, planet);
    if (!traj) return; // No clean solution is a valid answer: the caller falls back to a Bézier.
    const crossesDisc = traj.points.some(
      (p) => Math.hypot(p.x - planet.c.x, p.y - planet.c.y) < planet.R * 0.98,
    );
    expect(crossesDisc).toBe(false);
  });
});
