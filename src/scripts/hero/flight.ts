/**
 * Rocket flight in the hero (progressive enhancement, desktop with a fine pointer only).
 * - Trajectory under Jupiter's gravity (src/lib/flight/gravity.ts): the curve comes from
 *   simulating a = GM/r² and solving the initial velocity that lands on the point; the rocket
 *   speeds up near the planet and slows down away from it. Without a clean physical solution,
 *   a fallback Bézier is used (src/lib/flight/path.ts).
 * - Entrance: on load it takes off next to the `mission` block and lands on the planet's limb.
 * - Click on the hero → flies to the point; solid trail that turns dotted; the rocket stays
 *   pointing in its arrival direction; waypoint with coordinates; `mission` is rewritten.
 * Without JS, or outside desktop, the static JupiterScene composition stays.
 * Markup and styles: Hero.astro.
 */
import { solveTrajectory, type Vec } from '../../lib/flight/gravity';
import {
  aboveHorizon,
  crossesRects,
  curveFor,
  easeInOut,
  headingDeg,
  polylineData,
  timedPath,
  waypointSpot,
  type FlightState,
  type Rect,
} from '../../lib/flight/path';

/** Size of the rocket icon, in px. */
export const ROCKET = 52;
const TAIL = 140; // px of solid trail behind the rocket
const SVG_NS = 'http://www.w3.org/2000/svg';

// Decorative code: it stays in English in every locale.
const NOTES = [
  '// works on my planet',
  '// TODO: land softly',
  '// fix: gravity off by one',
  '// feat: new waypoint',
  '// LGTM, ship it',
  '// refactor later, promise',
  '// 0 bugs found (so far)',
  '// deploy: green',
];
const CRAFTS = [
  'products',
  'design systems',
  'reliable APIs',
  'product decisions',
  'developer tools',
  'clean interfaces',
];

type LaunchOptions = { from?: Vec; instant?: boolean; note?: string; entrance?: boolean };

/** What the rocket → FAB hand-over (rocket-fab.ts) needs from the hero flight. */
export interface HeroFlight {
  hero: HTMLElement;
  flyer: HTMLElement;
  waypoint: HTMLElement;
  /** Must match the media query that hides the static rocket in JupiterScene. */
  desktop: MediaQueryList;
  reduced: MediaQueryList;
  /** Rocket centre in hero pixels: its last position, or the arrival point before any flight. */
  position(): Vec | null;
  /** Whether the rocket has a position of its own (it has flown at least once since the reset). */
  hasPosition(): boolean;
  /** Current heading in degrees. */
  angle(): number;
  /** Stops a flight in progress where it is. */
  stop(): void;
}

export const svgEl = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string>) => {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
};

export function initHeroFlight(): HeroFlight | null {
  const hero = document.querySelector<HTMLElement>('[data-launchpad]');
  const layer = hero?.querySelector<SVGSVGElement>('.flight-layer');
  const flyer = hero?.querySelector<HTMLElement>('.flyer');
  const waypoint = hero?.querySelector<HTMLElement>('.waypoint');
  const mission = hero?.querySelector<HTMLElement>('.mission');
  if (!hero || !layer || !flyer || !waypoint) return null;

  const desktop = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let rocket: Vec | null = null; // current rocket centre, in hero coordinates
  let rocketAngle = 0; // current heading (for the return flight)
  let frame = 0;
  let flights = 0;
  let noteIndex = Math.floor(Math.random() * NOTES.length);
  let craftIndex = 0;
  const typers = new Map<Element, number>();

  const heroPoint = (clientX: number, clientY: number): Vec => {
    const r = hero.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  /** Initial arrival point: the (hidden) static rocket on the planet's limb. */
  const arrivalPoint = (): Vec | null => {
    const el = hero.querySelector<HTMLElement>('[data-arrival]');
    if (!el || el.offsetParent === null) return null;
    const r = el.getBoundingClientRect();
    return heroPoint(r.left + r.width / 2, r.top + r.height / 2);
  };

  /** Bounds of the text itself (Range), not of its box, which spans the whole column. */
  const textBounds = (n: Element) => {
    const range = document.createRange();
    range.selectNodeContents(n);
    return range.getBoundingClientRect();
  };

  /**
   * Entrance take-off: above the top-right corner of the `mission` block, but never left of
   * where the text ends (when `mission` wraps below the CTAs, at ~1024 px).
   */
  const launchPoint = (): Vec | null => {
    if (!mission || mission.offsetParent === null) return null;
    const r = mission.getBoundingClientRect();
    const textRight = Math.max(
      ...[...hero.querySelectorAll('h1 span, .identity, .identity > *, .tagline')].map(
        (n) => textBounds(n).right,
      ),
    );
    return heroPoint(Math.max(r.right - 24, textRight + 32), r.top - 18);
  };

  /** Jupiter in hero coordinates: the disc fills the whole image box. */
  const planetBody = () => {
    const el = hero.querySelector<HTMLElement>('.scene .planet');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { c: heroPoint(r.left + r.width / 2, r.top + r.height / 2), R: r.width / 2 };
  };

  /** Text areas in hero coordinates, with 6 px of vertical tolerance for the line height. */
  const textRects = (): Rect[] => {
    const hr = hero.getBoundingClientRect();
    return [
      ...[...hero.querySelectorAll('.path-label, h1 span, .identity > *, .tagline')].map(textBounds),
      ...[...hero.querySelectorAll('.actions > *, .mission')].map((n) => n.getBoundingClientRect()),
    ].map((r) => ({
      l: r.left - hr.left,
      t: r.top - hr.top + 6,
      r: r.right - hr.left,
      b: r.bottom - hr.top - 6,
    }));
  };

  const placeFlyer = (p: Vec, angle: number) => {
    flyer.style.transform = `translate(${p.x - ROCKET / 2}px, ${p.y - ROCKET / 2}px)`;
    flyer.style.setProperty('--angle', `${angle}deg`);
    rocketAngle = angle;
  };

  /** Writes a value of the `mission` object as if it were being typed. */
  const typeField = (field: string, text: string) => {
    const node = mission?.querySelector(`[data-field="${field}"]`);
    if (!node || node.textContent === text) return;
    window.clearInterval(typers.get(node));
    if (reduced.matches) {
      node.textContent = text;
      return;
    }
    let i = 0;
    node.textContent = '';
    node.classList.add('is-typing');
    const id = window.setInterval(() => {
      i++;
      node.textContent = text.slice(0, i);
      if (i >= text.length) {
        window.clearInterval(id);
        node.classList.remove('is-typing');
      }
    }, 24);
    typers.set(node, id);
  };

  /** Fades out previous trails. */
  const fadeOldTrails = (now = false) => {
    layer.querySelectorAll<SVGGElement>('g.trail-group').forEach((g) => {
      g.classList.add('is-leaving');
      window.setTimeout(() => g.remove(), now ? 0 : 900);
    });
    layer.querySelectorAll('defs mask').forEach((m) => window.setTimeout(() => m.remove(), now ? 0 : 900));
  };

  const showWaypoint = (p: Vec, from: Vec, note: string) => {
    const coords = waypoint.querySelector('.waypoint-coords');
    const noteEl = waypoint.querySelector('.waypoint-note');
    if (coords) coords.textContent = `x: ${Math.round(p.x)}  y: ${Math.round(p.y)}`;
    if (noteEl) noteEl.textContent = note;
    waypoint.classList.remove('is-visible', 'is-flipped');
    waypoint.hidden = false; // shown at opacity 0 so it can be measured
    const spot = waypointSpot({
      p,
      from,
      size: { w: waypoint.offsetWidth, h: waypoint.offsetHeight },
      gap: ROCKET / 2 + 10,
      heroWidth: hero.clientWidth,
      text: textRects(), // never on top of the text
    });
    waypoint.classList.toggle('is-flipped', spot.flipped);
    waypoint.style.transform = `translate(${spot.x}px, ${spot.y}px)`;
    waypoint.classList.add('is-visible');
  };

  /**
   * Physical trajectory towards `target`. On entrance it must also avoid the text (otherwise the
   * 'rise' curve is used, which takes off vertically away from the reading column).
   */
  const physicsPath = (start: Vec, target: Vec, entrance: boolean): Vec[] | null => {
    const body = planetBody();
    if (!body) return null;
    const traj = solveTrajectory(start, target, body);
    if (!traj) return null;
    if (entrance && crossesRects(traj.points, textRects(), 10)) return null;
    return traj.points;
  };

  const launch = (target: Vec, opts: LaunchOptions = {}) => {
    const start = opts.from ?? rocket ?? arrivalPoint();
    if (!start) return;
    cancelAnimationFrame(frame);

    flyer.hidden = false;
    flights++;
    layer.setAttribute('viewBox', `0 0 ${hero.clientWidth} ${hero.clientHeight}`);
    waypoint.classList.remove('is-visible');
    fadeOldTrails(opts.instant);

    const tx = Math.round(target.x);
    const ty = Math.round(target.y);
    const note = opts.note ?? NOTES[noteIndex++ % NOTES.length]!;
    if (!opts.entrance) typeField('craft', `'${CRAFTS[++craftIndex % CRAFTS.length]}'`);
    typeField('target', `{ x: ${tx}, y: ${ty} }`);

    const points = physicsPath(start, target, !!opts.entrance);
    const d = points ? polylineData(points) : curveFor(start, target, opts.entrance ? 'rise' : 'arc');

    const id = `reveal-${flights}`;
    const maskPath = svgEl('path', { d, class: 'mask-path' });
    const mask = svgEl('mask', { id, maskUnits: 'userSpaceOnUse' });
    mask.append(maskPath);
    layer.querySelector('defs')?.append(mask);

    const group = svgEl('g', { class: 'trail-group' });
    const dots = svgEl('path', { d, class: 'flight-dots', mask: `url(#${id})` });
    const solid = svgEl('path', { d, class: 'flight-solid' });
    group.append(dots, solid);
    layer.append(group);

    const total = solid.getTotalLength();
    const setProgress = (head: number, tail: number) => {
      maskPath.style.strokeDasharray = `${head} ${total + 1}`;
      solid.style.strokeDasharray = `${tail} ${total + 1}`;
      solid.style.strokeDashoffset = `${-(head - tail)}`;
    };
    setProgress(0, 0);

    // Physics: sampled in time (timedPath). Fallback Bézier: progress by length with easeInOut.
    let stateAt: (u: number) => FlightState;
    let approach: Vec = start; // where it arrives from, to put the waypoint on the opposite side
    if (points) {
      stateAt = timedPath(points, total);
      approach = points[Math.max(0, points.length - 1 - 12)]!;
    } else {
      const angleAtLen = (len: number) =>
        headingDeg(
          solid.getPointAtLength(Math.max(0, len - 1)),
          solid.getPointAtLength(Math.min(total, len + 1)),
        );
      stateAt = (u) => {
        const len = total * easeInOut(u);
        const pt = solid.getPointAtLength(len);
        return { p: { x: pt.x, y: pt.y }, len, angle: angleAtLen(len) };
      };
    }

    const finalAngle = stateAt(1).angle;

    const land = () => {
      rocket = target;
      placeFlyer(target, finalAngle); // keeps pointing in the flight direction
      showWaypoint(target, approach, note);
      typeField('status', "'landed'");
    };

    if (opts.instant || reduced.matches) {
      setProgress(total, 0);
      land();
      return;
    }

    typeField('status', "'in flight'");
    placeFlyer(start, stateAt(0).angle);
    const duration = Math.min(2000, Math.max(800, total * 1.35));
    const settle = 1100; // time for the solid trail to finish turning dotted
    const t0 = performance.now();
    let arrived = false;

    const tick = (now: number) => {
      // The rAF timestamp can precede t0 on the first frame: clamp to 0.
      const t = Math.min(1, Math.max(0, (now - t0) / duration));
      if (t < 1) {
        const st = stateAt(t);
        setProgress(st.len, Math.min(st.len, TAIL));
        rocket = st.p;
        placeFlyer(st.p, st.angle);
        frame = requestAnimationFrame(tick);
        return;
      }
      if (!arrived) {
        arrived = true;
        land();
      }
      const s = Math.min(1, (now - t0 - duration) / settle);
      setProgress(total, Math.min(total, TAIL) * (1 - s));
      if (s < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };

  /** Entrance flight: same engine as clicks, from the `mission` block to the limb. */
  const entrance = (instant = false) => {
    const to = arrivalPoint();
    const from = launchPoint();
    if (!to || !from) return;
    rocket = null;
    launch(to, { from, instant, entrance: true, note: '// arrival point' });
  };

  const reset = () => {
    cancelAnimationFrame(frame);
    rocket = null;
    flyer.hidden = true;
    waypoint.hidden = true;
    layer.querySelectorAll('g.trail-group, defs mask').forEach((n) => n.remove());
  };

  /** The landing point lifted above the projects horizon (HorizonArc), measured, not assumed. */
  const clampAboveHorizon = (p: Vec): Vec => {
    // First sibling section after the hero (Astro may insert a <script> between them).
    let next = hero.nextElementSibling;
    while (next && next.tagName !== 'SECTION') next = next.nextElementSibling;
    const el = next?.querySelector<HTMLElement>('.horizon');
    const horizon = el
      ? { top: el.getBoundingClientRect().top - hero.getBoundingClientRect().top, depth: el.offsetHeight }
      : null;
    return aboveHorizon(p, { width: hero.clientWidth, height: hero.clientHeight }, horizon, ROCKET / 2 + 10);
  };

  hero.addEventListener('click', (event) => {
    if (!desktop.matches) return;
    const target = event.target as Element;
    if (target.closest('a, button, input, textarea, select, summary')) return;
    // Text is for reading: a click on it (to focus, to select) never launches. Empty space in the
    // text column is still sky.
    if (target.closest('h1, p, pre, .actions, .log')) return;
    if (window.getSelection()?.toString()) return; // do not interfere with text selection
    launch(clampAboveHorizon(heroPoint(event.clientX, event.clientY)));
  });

  // Coordinates are hero pixels: on resize everything is repositioned without animation.
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      reset();
      if (desktop.matches) entrance(true);
    }, 150);
  });

  if (desktop.matches) {
    // Short pause so the first paint is the text, not the animation (§15).
    const start = () => window.setTimeout(() => entrance(), 450);
    // A prerendered page (speculation rules) runs scripts while hidden: fly once it is shown.
    // `prerendering` is not in TypeScript's DOM lib yet.
    const { prerendering } = document as Document & { prerendering?: boolean };
    if (prerendering) document.addEventListener('prerenderingchange', start, { once: true });
    else start();
  }

  return {
    hero,
    flyer,
    waypoint,
    desktop,
    reduced,
    position: () => rocket ?? arrivalPoint(),
    hasPosition: () => rocket !== null,
    angle: () => rocketAngle,
    stop: () => cancelAnimationFrame(frame),
  };
}
