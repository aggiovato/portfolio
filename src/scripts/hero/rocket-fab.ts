/**
 * Rocket → «Back to top» FAB (home only; the FAB itself is BackToTop.astro, on every page).
 * Scrolling down (hero < 15 % visible) the rocket leaves the hero, flies with a short dotted trail
 * to the bottom-right corner, straightens up pointing upwards and becomes the FAB. Back at the
 * hero (> 50 % visible) the FAB dissolves and the rocket returns to its last landing point.
 * 15/50 hysteresis so it does not flicker at the threshold.
 * Mobile (no rocket in the hero) or reduced motion: the FAB just appears/disappears.
 * Markup: the `.sky` layer in Hero.astro, whose [data-fab-driver] tells BackToTop to stay out; the
 * FAB is reached only through src/scripts/fab.ts.
 */
import type { Vec } from '../../lib/flight/gravity';
import { cubicPoint, easeInOut, headingDeg, lerpAngle, smoothstep, trailDots } from '../../lib/flight/path';
import { backToTop, findFab, hideFab, showFab } from '../fab';
import { ROCKET, svgEl, type HeroFlight } from './flight';

type FabState = 'hero' | 'descending' | 'fab' | 'returning';

const FAB_ICON = 26 / ROCKET; // rocket scale once it becomes the FAB icon
const DOTS = 16;

export function initRocketFab(flight: HeroFlight): void {
  const { hero, flyer, desktop, reduced } = flight;
  const sky = document.querySelector<HTMLElement>('.sky');
  const skyRocket = sky?.querySelector<HTMLElement>('.sky-rocket');
  const skyTrail = sky?.querySelector<SVGSVGElement>('.sky-trail');
  const fab = findFab();
  if (!sky || !skyRocket || !skyTrail || !fab) return;

  let state: FabState = 'hero';
  let ratio = 1;
  let skyFrame = 0;
  const dots = Array.from({ length: DOTS }, () => {
    const c = svgEl('circle', { r: '1.6' });
    skyTrail.append(c);
    return c;
  });
  let history: Vec[] = [];

  const flies = () => desktop.matches && !reduced.matches;

  const fabCenter = (): Vec => {
    const wasHidden = fab.hidden;
    fab.hidden = false;
    fab.style.visibility = 'hidden';
    const r = fab.getBoundingClientRect();
    fab.style.visibility = '';
    fab.hidden = wasHidden;
    // The icon sits 3 px above the button's centre (BackToTop.astro, its take-off cue).
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 - 3 };
  };

  /** Hero rocket centre in viewport coordinates (follows the scroll). */
  const heroRocketViewport = (): Vec | null => {
    const p = flight.position();
    if (!p) return null;
    const r = hero.getBoundingClientRect();
    return { x: r.left + p.x, y: r.top + p.y };
  };

  const placeSky = (p: Vec, angle: number, scale: number) => {
    skyRocket.style.transform = `translate(${p.x - ROCKET / 2}px, ${p.y - ROCKET / 2}px) rotate(${angle}deg) scale(${scale})`;
  };

  const drawTrail = (p: Vec | null) => {
    if (p) history.push(p);
    if (history.length > DOTS * 2) history = history.slice(-DOTS * 2);
    const pts = trailDots(history, DOTS);
    dots.forEach((c, i) => {
      const pt = pts[i];
      if (!pt) {
        c.setAttribute('opacity', '0');
        return;
      }
      c.setAttribute('cx', pt.x.toFixed(1));
      c.setAttribute('cy', pt.y.toFixed(1));
      c.setAttribute('opacity', (0.55 * (1 - i / DOTS)).toFixed(2));
    });
  };

  const fadeTrail = () => {
    const t0 = performance.now();
    const fade = (now: number) => {
      const k = Math.min(1, (now - t0) / 500);
      skyTrail.style.opacity = String(1 - k);
      if (k < 1) requestAnimationFrame(fade);
      else {
        history = [];
        drawTrail(null);
        skyTrail.style.opacity = '';
      }
    };
    requestAnimationFrame(fade);
  };

  /**
   * Flight on the fixed layer. `to` is evaluated every frame: on the way back the target (the
   * hero) moves with the scroll and the rocket chases it.
   */
  const skyFlight = (o: {
    from: Vec;
    to: () => Vec;
    fromAngle: number;
    toAngle: number;
    fromScale: number;
    toScale: number;
    duration: number;
    lift: number;
    done: () => void;
  }) => {
    cancelAnimationFrame(skyFrame);
    history = [];
    skyRocket.hidden = false;
    const t0 = performance.now();
    let prev = o.from;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / o.duration));
      const e = easeInOut(t);
      const b = o.to();
      const c1 = { x: o.from.x, y: o.from.y - o.lift };
      const c2 = { x: b.x - (b.x - o.from.x) * 0.35, y: b.y - o.lift * 0.6 };
      const p = cubicPoint(o.from, c1, c2, b, e);
      const moving = Math.hypot(p.x - prev.x, p.y - prev.y) > 0.3;
      // Follows the tangent in flight; at start and end it blends with the fixed heading.
      const heading = moving ? headingDeg(prev, p) : o.fromAngle;
      const angle = lerpAngle(
        lerpAngle(o.fromAngle, heading, smoothstep(0, 0.15, t)),
        o.toAngle,
        smoothstep(0.72, 1, t),
      );
      const scale = o.fromScale + (o.toScale - o.fromScale) * smoothstep(0.5, 1, t);
      placeSky(p, angle, scale);
      drawTrail(p);
      prev = p;
      if (t < 1) skyFrame = requestAnimationFrame(tick);
      else o.done();
    };
    skyFrame = requestAnimationFrame(tick);
  };

  const descend = () => {
    const start = flyer.hidden ? null : flyer.getBoundingClientRect();
    if (!flies() || !start || start.width === 0) {
      // No visible rocket to move: the FAB just appears.
      state = 'fab';
      showFab(fab, !reduced.matches);
      return;
    }
    state = 'descending';
    flight.stop(); // a hero flight in progress stops where it is
    flight.clearTrail(); // its trail in the hero goes: only the way down draws one now
    // At 15 % visible the rocket is usually above the screen already: it comes in from just
    // above the top edge, as if it came down to follow the reading.
    const from = { x: start.left + start.width / 2, y: Math.max(start.top + start.height / 2, -ROCKET) };
    flyer.style.visibility = 'hidden';
    const target = fabCenter();
    skyFlight({
      from,
      to: () => target,
      fromAngle: flight.angle(),
      toAngle: 0, // lands pointing up: «back to top»
      fromScale: 1,
      toScale: FAB_ICON,
      duration: 1150,
      lift: 90,
      done: () => {
        skyRocket.hidden = true;
        fadeTrail();
        state = 'fab';
        showFab(fab, false); // the icon already has the same position and size: seamless hand-over
        if (ratio > 0.5) returnHome();
      },
    });
  };

  const returnHome = () => {
    const home = heroRocketViewport();
    hideFab(fab);
    if (!flies() || !home) {
      state = 'hero';
      if (desktop.matches && flight.hasPosition()) flyer.style.visibility = '';
      return;
    }
    state = 'returning';
    skyFlight({
      from: fabCenter(),
      to: () => heroRocketViewport() ?? home,
      fromAngle: 0,
      toAngle: flight.angle(),
      fromScale: FAB_ICON,
      toScale: 1,
      duration: 1000,
      lift: 160,
      done: () => {
        skyRocket.hidden = true;
        fadeTrail();
        flyer.style.visibility = '';
        state = 'hero';
        if (ratio < 0.15) descend();
      },
    });
  };

  new IntersectionObserver(
    ([entry]) => {
      ratio = entry!.intersectionRatio;
      if (ratio < 0.15 && state === 'hero') descend();
      else if (ratio > 0.5 && state === 'fab') returnHome();
    },
    { threshold: [0, 0.1, 0.15, 0.3, 0.5, 0.6, 1] },
  ).observe(hero);

  fab.addEventListener('click', () => backToTop(fab));

  // After a resize the hero rocket is repositioned; if it was away, it stays hidden.
  window.addEventListener('resize', () => {
    window.setTimeout(() => {
      if (state !== 'hero') flyer.style.visibility = 'hidden';
    }, 200);
  });
}
