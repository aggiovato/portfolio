import { describe, expect, it } from 'vitest';
import {
  aboveHorizon,
  crossesRects,
  cubicPoint,
  curveFor,
  easeInOut,
  easeSine,
  headingDeg,
  landingPose,
  lerpAngle,
  onLimb,
  polylineData,
  smoothstep,
  timedPath,
  trailDots,
  waypointSpot,
} from '../../src/lib/flight/path';

describe('easings', () => {
  it('start at 0, end at 1 and pass through the middle', () => {
    for (const ease of [easeInOut, easeSine]) {
      expect(ease(0)).toBe(0);
      expect(ease(1)).toBeCloseTo(1);
      expect(ease(0.5)).toBeCloseTo(0.5);
    }
  });

  it('smoothstep clamps outside its edges', () => {
    expect(smoothstep(0.2, 0.8, 0)).toBe(0);
    expect(smoothstep(0.2, 0.8, 1)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBe(0.5);
  });
});

describe('headings', () => {
  it('measure CSS degrees with 0° pointing up, like the rocket icon', () => {
    expect(headingDeg({ x: 0, y: 0 }, { x: 0, y: -10 })).toBeCloseTo(0);
    expect(headingDeg({ x: 0, y: 0 }, { x: 10, y: 0 })).toBeCloseTo(90);
    expect(headingDeg({ x: 0, y: 0 }, { x: 0, y: 10 })).toBeCloseTo(180);
  });

  it('interpolate the shortest way round', () => {
    expect(lerpAngle(350, 10, 0.5)).toBeCloseTo(360);
    expect(lerpAngle(10, 350, 0.5)).toBeCloseTo(0);
    expect(lerpAngle(0, 90, 1)).toBeCloseTo(90);
  });
});

describe('curves', () => {
  it('a cubic Bézier starts and ends at its endpoints', () => {
    const a = { x: 0, y: 0 };
    const b = { x: 100, y: 50 };
    expect(cubicPoint(a, { x: 10, y: -40 }, { x: 80, y: -20 }, b, 0)).toEqual(a);
    expect(cubicPoint(a, { x: 10, y: -40 }, { x: 80, y: -20 }, b, 1)).toEqual(b);
  });

  it('the click arc bows upwards whichever way it flies', () => {
    const controlYs = (d: string) => [...d.matchAll(/C ([\d.-]+) ([\d.-]+), ([\d.-]+) ([\d.-]+)/g)][0]!;
    for (const [a, b] of [
      [
        { x: 0, y: 100 },
        { x: 300, y: 100 },
      ],
      [
        { x: 300, y: 100 },
        { x: 0, y: 100 },
      ],
    ] as const) {
      const d = curveFor(a, b, 'arc');
      expect(d.startsWith(`M${a.x} ${a.y}`)).toBe(true);
      expect(d.endsWith(`${b.x} ${b.y}`)).toBe(true);
      const m = controlYs(d);
      expect(Number(m[2])).toBeLessThan(100);
      expect(Number(m[4])).toBeLessThan(100);
    }
  });

  it('the entrance rises vertically from its start', () => {
    const d = curveFor({ x: 50, y: 400 }, { x: 600, y: 200 }, 'rise');
    expect(d).toBe('M50 400 C 50 250, 297.5 200, 600 200');
  });

  it('polyline data keeps one decimal', () => {
    expect(
      polylineData([
        { x: 1, y: 2 },
        { x: 3.456, y: 4 },
      ]),
    ).toBe('M1.0 2.0 L3.5 4.0');
  });
});

describe('timedPath', () => {
  const points = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 20, y: 0 },
    { x: 30, y: 0 },
  ];

  it('starts at the first point and ends at the last, with the drawn length', () => {
    const at = timedPath(points, 60); // drawn twice as long as the sampled points: scaled
    expect(at(0)).toEqual({ p: { x: 0, y: 0 }, len: 0, angle: 90 });
    expect(at(1).p).toEqual({ x: 30, y: 0 });
    expect(at(1).len).toBeCloseTo(60);
  });

  it('clamps instants outside [0, 1]', () => {
    const at = timedPath(points, 30);
    expect(at(-1)).toEqual(at(0));
    expect(at(2)).toEqual(at(1));
  });
});

describe('aboveHorizon', () => {
  const hero = { width: 1000, height: 800 };

  it('keeps the point inside the hero', () => {
    expect(aboveHorizon({ x: -50, y: 100 }, hero, null, 36)).toEqual({ x: 36, y: 100 });
    expect(aboveHorizon({ x: 2000, y: 900 }, hero, null, 36)).toEqual({ x: 964, y: 764 });
  });

  it('lifts it above the arc, highest in the centre and flush at the edges', () => {
    const horizon = { top: 700, depth: 80 };
    // Centre: the arc top is at 700; edges: at 780.
    expect(aboveHorizon({ x: 500, y: 790 }, hero, horizon, 36).y).toBe(664);
    expect(aboveHorizon({ x: 40, y: 790 }, hero, horizon, 36).y).toBeCloseTo(
      780 - 36 - 80 * (1 - (1 - 0.08) ** 2),
      5,
    );
    expect(aboveHorizon({ x: 500, y: 300 }, hero, horizon, 36).y).toBe(300);
  });
});

describe('waypointSpot', () => {
  const base = { size: { w: 120, h: 40 }, gap: 36, heroWidth: 1000, text: [] };

  it('sits on the side opposite the arrival', () => {
    expect(waypointSpot({ ...base, p: { x: 500, y: 300 }, from: { x: 100, y: 300 } })).toEqual({
      x: 536,
      y: 270,
      flipped: false,
    });
    expect(waypointSpot({ ...base, p: { x: 500, y: 300 }, from: { x: 900, y: 300 } }).flipped).toBe(true);
  });

  it('moves to the other side when it does not fit', () => {
    const spot = waypointSpot({ ...base, p: { x: 900, y: 300 }, from: { x: 100, y: 300 } });
    expect(spot).toEqual({ x: 900 - 36 - 120, y: 270, flipped: true });
  });

  it('never covers the text when the other side is free', () => {
    const text = [{ l: 520, t: 250, r: 700, b: 320 }];
    expect(waypointSpot({ ...base, text, p: { x: 500, y: 300 }, from: { x: 100, y: 300 } }).flipped).toBe(
      true,
    );
  });
});

describe('crossesRects and trailDots', () => {
  it('detect a point inside a box grown by the margin', () => {
    const rects = [{ l: 100, t: 100, r: 200, b: 200 }];
    expect(crossesRects([{ x: 95, y: 150 }], rects, 10)).toBe(true);
    expect(crossesRects([{ x: 80, y: 150 }], rects, 10)).toBe(false);
  });

  it('take one dot every two frames, newest first', () => {
    const history = Array.from({ length: 7 }, (_, i) => ({ x: i, y: 0 }));
    expect(trailDots(history, 3).map((p) => p.x)).toEqual([6, 4, 2]);
    expect(trailDots([], 3)).toEqual([]);
  });
});

describe('landing', () => {
  const planet = { c: { x: 500, y: 500 }, R: 200 };

  it('stands on Jupiter along the surface normal', () => {
    expect(landingPose({ x: 500, y: 290 }, planet, 40)).toEqual({ onPlanet: true, angle: 0 });
    const left = landingPose({ x: 300, y: 500 }, planet, 40);
    expect(left.onPlanet).toBe(true);
    expect(left.angle).toBeCloseTo(-90);
  });

  it('hovers in open sky, keeping its heading', () => {
    expect(landingPose({ x: 100, y: 100 }, planet, 40)).toEqual({ onPlanet: false, angle: null });
    expect(landingPose({ x: 100, y: 100 }, null, 40)).toEqual({ onPlanet: false, angle: null });
  });

  it('puts the arrival point on the limb, lifted off it', () => {
    const p = onLimb({ x: 450, y: 500 }, planet, 18);
    expect(p.x).toBeCloseTo(282);
    expect(p.y).toBeCloseTo(500);
  });
});
