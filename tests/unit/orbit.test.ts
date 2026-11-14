import { describe, expect, it } from 'vitest';
import {
  angleDelta,
  clampDrag,
  deformedRing,
  depthOf,
  isAtRest,
  orbitPoint,
  springStep,
  startAngles,
  toPath,
  type SpringState,
} from '../../src/lib/gallery/orbit';

const orbit = { cx: 100, cy: 50, rx: 80, ry: 20 };

describe('orbit geometry', () => {
  it('places angle π/2 at the front (bottom of the ellipse) and 0 at the right', () => {
    expect(orbitPoint(orbit, 0)).toEqual({ x: 180, y: 50 });
    const front = orbitPoint(orbit, Math.PI / 2);
    expect(front.x).toBeCloseTo(100);
    expect(front.y).toBeCloseTo(70);
  });

  it('maps the front to depth 1 and the back to depth 0', () => {
    expect(depthOf(Math.PI / 2)).toBeCloseTo(1);
    expect(depthOf((3 * Math.PI) / 2)).toBeCloseTo(0);
    expect(depthOf(0)).toBeCloseTo(0.5);
  });

  it('spreads items evenly with the first one at the front', () => {
    const a = startAngles(4);
    expect(a[0]).toBeCloseTo(Math.PI / 2);
    expect(a[1] - a[0]).toBeCloseTo(Math.PI / 2);
    expect(startAngles(0)).toEqual([]);
  });

  it('measures the shortest signed angle between two angles', () => {
    expect(angleDelta(0.1, 2 * Math.PI - 0.1)).toBeCloseTo(0.2);
    expect(angleDelta(2 * Math.PI - 0.1, 0.1)).toBeCloseTo(-0.2);
    expect(angleDelta(Math.PI, 0)).toBeCloseTo(Math.PI);
  });
});

describe('elastic drag', () => {
  it('clamps a drag to the maximum distance, keeping its direction', () => {
    expect(clampDrag({ x: 30, y: 40 }, 100)).toEqual({ x: 30, y: 40 });
    const c = clampDrag({ x: 300, y: 400 }, 100);
    expect(Math.hypot(c.x, c.y)).toBeCloseTo(100);
    expect(c.x / c.y).toBeCloseTo(0.75);
  });

  it('springs a released item back to its slot and settles', () => {
    let s: SpringState = { offset: { x: 60, y: -40 }, velocity: { x: 0, y: 0 } };
    s = springStep(s);
    // The first step already moves it towards the slot.
    expect(Math.abs(s.offset.x)).toBeLessThan(60);
    for (let i = 0; i < 200 && !isAtRest(s); i++) s = springStep(s);
    expect(isAtRest(s)).toBe(true);
  });

  it('bends the ring only around the dragged item', () => {
    const plain = deformedRing(orbit, 8);
    const bent = deformedRing(orbit, 8, { angle: 0, offset: { x: 10, y: 0 }, span: Math.PI / 4 });
    // Sample 0 is at angle 0, right on the item: full pull.
    expect(bent[0].x).toBeCloseTo(plain[0].x + 10);
    // Sample 4 is on the opposite side: untouched.
    expect(bent[4]).toEqual(plain[4]);
  });

  it('serialises a closed SVG path', () => {
    expect(
      toPath([
        { x: 0, y: 0 },
        { x: 1, y: 2 },
      ]),
    ).toBe('M0.0 0.0L1.0 2.0Z');
    expect(toPath([{ x: 0, y: 0 }], false)).toBe('M0.0 0.0');
    expect(toPath([])).toBe('');
  });
});
