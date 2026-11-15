import { describe, expect, it } from 'vitest';
import {
  landingTrail,
  moonLook,
  nextSpeed,
  planRings,
  ringOrbit,
  slotAngles,
} from '../../src/lib/gallery/layout';
import {
  initialView,
  MAX_ZOOM,
  MIN_ZOOM,
  panned,
  rotated,
  viewTransform,
  wrapIndex,
  zoomed,
} from '../../src/lib/gallery/viewer';

describe('rings', () => {
  it('keeps up to four moons on one ring', () => {
    expect(planRings(4)).toEqual([{ moons: [0, 1, 2, 3], period: 150_000, rotation: 0 }]);
  });

  it('splits more moons into a faster inner ring and an outer one, staggered', () => {
    expect(planRings(7)).toEqual([
      { moons: [0, 1, 2], period: 90_000, rotation: 0 },
      { moons: [3, 4, 5, 6], period: 150_000, rotation: 0.6 },
    ]);
  });

  it('spaces moons evenly, the first of each ring at the front (π/2)', () => {
    const rings = planRings(6);
    const slots = slotAngles(rings, 6);
    expect(slots[0]).toBeCloseTo(Math.PI / 2);
    expect(slots[3]).toBeCloseTo(Math.PI / 2);
    expect(slots[1]! - slots[0]!).toBeCloseTo((2 * Math.PI) / 3);
  });

  it('sizes orbits to the stage, flattened as seen from above', () => {
    expect(ringOrbit(1000, 500, 0, 1)).toEqual({ cx: 500, cy: 250, rx: 420, ry: 500 * 0.42 * 0.62 });
    const inner = ringOrbit(1000, 500, 0, 2);
    const outer = ringOrbit(1000, 500, 1, 2);
    expect(inner.rx).toBeLessThan(outer.rx);
  });
});

describe('moon look and motion', () => {
  it('puts front moons above the planet and back ones behind it, smaller and dimmer', () => {
    expect(moonLook(1)).toEqual({ zIndex: 5, dim: 0, scale: 1 });
    expect(moonLook(0)).toEqual({ zIndex: 2, dim: 1, scale: 0.6 });
    expect(moonLook(0.5).zIndex).toBe(5);
  });

  it('eases the orbit to a stop and back, never past its targets', () => {
    expect(nextSpeed(1, true, 130)).toBeCloseTo(0.5);
    expect(nextSpeed(1, true, 1000)).toBe(0);
    expect(nextSpeed(0, false, 1000)).toBe(1);
  });

  it('draws the landing trail as a curve that rises above both ends', () => {
    expect(landingTrail({ x: 0, y: 100 }, { x: 200, y: 80 })).toBe('M0.0 100.0 Q 100.0 40.0 200.0 80.0');
  });
});

describe('viewer state', () => {
  it('zooms within its limits and recentres at or below 1×', () => {
    expect(zoomed(initialView(), 100).scale).toBe(MAX_ZOOM);
    expect(zoomed(initialView(), 0.01).scale).toBe(MIN_ZOOM);
    const pannedIn = { scale: 3, rot: 0, x: 40, y: -20 };
    expect(zoomed(pannedIn, 1.4)).toMatchObject({ x: 40, y: -20 });
    const out = zoomed(pannedIn, 0.2);
    expect(out.scale).toBeCloseTo(0.6);
    expect(out).toMatchObject({ x: 0, y: 0 });
  });

  it('pans only while zoomed in', () => {
    expect(panned(initialView(), 10, 10)).toEqual(initialView());
    expect(panned({ scale: 2, rot: 0, x: 0, y: 0 }, 10, -5)).toMatchObject({ x: 10, y: -5 });
  });

  it('rotates in quarter turns and writes the CSS transform', () => {
    expect(rotated({ ...initialView(), rot: 270 }).rot).toBe(0);
    expect(viewTransform({ scale: 2, rot: 90, x: 5, y: 6 })).toBe(
      'translate(5px, 6px) scale(2) rotate(90deg)',
    );
  });

  it('wraps previous and next around the ends', () => {
    expect(wrapIndex(-1, 5)).toBe(4);
    expect(wrapIndex(5, 5)).toBe(0);
    expect(wrapIndex(2, 5)).toBe(2);
  });
});
