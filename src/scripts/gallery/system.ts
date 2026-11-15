/**
 * Orbit mode of the gallery: Jupiter at the centre and one moon per image on one or two tilted
 * rings. The selection changes only when the visitor chooses (a moon, or a caption in the list);
 * the orbit keeps turning slowly and pauses with its toggle, under the pointer, off-screen, while
 * the viewer is open or the tab is hidden (WCAG 2.2.2). Dragging a moon bends its ring and a
 * spring brings it back. Markup and styles: ProjectGallery.astro; maths: src/lib/gallery/.
 */
import {
  landingTrail,
  moonLook,
  nextSpeed,
  planRings,
  ringOrbit,
  slotAngles,
  type RingPlan,
} from '../../lib/gallery/layout';
import {
  clampDrag,
  deformedRing,
  depthOf,
  isAtRest,
  orbitPoint,
  springStep,
  toPath,
  type Orbit,
  type Point,
  type SpringState,
} from '../../lib/gallery/orbit';
import type { Viewer } from './viewer';

const TAU = Math.PI * 2;
const MAX_DRAG = 60;
const DRAG_THRESHOLD = 5;

interface Ring extends RingPlan {
  orbit: Orbit;
  backPath: SVGPathElement;
  frontPath: SVGPathElement;
}

export function createSystem(root: HTMLElement, links: HTMLAnchorElement[], viewer: Viewer): void {
  const system = root.querySelector<HTMLElement>('[data-system]')!;
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const moons = [...root.querySelectorAll<HTMLElement>('[data-moon]')];
  const backSvg = root.querySelector<SVGSVGElement>('[data-rings-back]')!;
  const frontSvg = root.querySelector<SVGSVGElement>('[data-rings-front]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-orbit-toggle]')!;
  const preview = root.querySelector<HTMLElement>('[data-preview]')!;
  const previewOpen = root.querySelector<HTMLButtonElement>('[data-preview-open]')!;
  const previewImg = root.querySelector<HTMLImageElement>('[data-preview-img]')!;
  const previewCaption = root.querySelector<HTMLElement>('[data-preview-caption]')!;
  const trail = root.querySelector<SVGSVGElement>('[data-landing-trail]')!;
  const trailPath = trail.querySelector('path')!;

  root.classList.add('is-orbit');
  system.hidden = false;
  preview.hidden = false;

  const svgPath = (svg: SVGSVGElement) => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.append(p);
    return p;
  };
  const rings: Ring[] = planRings(moons.length).map((plan) => ({
    ...plan,
    orbit: { cx: 0, cy: 0, rx: 0, ry: 0 },
    backPath: svgPath(backSvg),
    frontPath: svgPath(frontSvg),
  }));
  const slotOf = slotAngles(rings, moons.length);
  const springs: SpringState[] = moons.map(() => ({ offset: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } }));

  const measure = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    rings.forEach((ring, r) => (ring.orbit = ringOrbit(w, h, r, rings.length)));
    [backSvg, frontSvg].forEach((s) => s.setAttribute('viewBox', `0 0 ${w} ${h}`));
    const box = root.getBoundingClientRect();
    trail.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
  };
  new ResizeObserver(measure).observe(root);
  measure();

  /* ---- Selection: changes only when the visitor chooses ---- */
  let selected = -1;
  const select = (i: number) => {
    if (i === selected) return;
    selected = i;
    const a = links[i]!;
    links.forEach((l, k) =>
      k === i ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current'),
    );
    moons.forEach((m, k) => m.classList.toggle('is-active', k === i));
    preview.classList.remove('is-in');
    previewImg.src = a.dataset.previewSrc!;
    previewImg.alt = a.querySelector('img')?.alt ?? '';
    previewCaption.textContent = a.dataset.caption ?? '';
    previewOpen.setAttribute('aria-label', a.dataset.openLabel ?? '');
    previewImg
      .decode?.()
      .catch(() => {})
      .finally(() => preview.classList.add('is-in'));
  };
  links.forEach((a, i) => {
    a.setAttribute('aria-label', a.dataset.showLabel ?? '');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      select(i);
    });
  });
  previewOpen.addEventListener('click', () => viewer.open(selected, previewOpen));
  select(0);

  /* ---- Motion control ---- */
  let paused = false;
  let hovered = false;
  let visible = true;
  let speed = 1;
  let dragged = -1;
  let last = performance.now();
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
  });
  stage.addEventListener('pointerenter', () => (hovered = true));
  stage.addEventListener('pointerleave', () => (hovered = false));
  new IntersectionObserver(([e]) => (visible = e!.isIntersecting)).observe(stage);

  // A moon: click selects it, drag bends its ring (a press that moves is a drag, not a click).
  moons.forEach((moon, i) => {
    let start: Point | null = null;
    moon.addEventListener('pointerdown', (e) => {
      start = { x: e.clientX, y: e.clientY };
      moon.setPointerCapture(e.pointerId);
    });
    moon.addEventListener('pointermove', (e) => {
      if (!start) return;
      const raw = { x: e.clientX - start.x, y: e.clientY - start.y };
      if (dragged !== i && Math.hypot(raw.x, raw.y) < DRAG_THRESHOLD) return;
      dragged = i;
      moon.classList.add('is-dragged');
      springs[i] = { offset: clampDrag(raw, MAX_DRAG), velocity: { x: 0, y: 0 } };
    });
    moon.addEventListener('pointerup', () => {
      if (start && dragged !== i) select(i);
      start = null;
      if (dragged === i) {
        dragged = -1;
        moon.classList.remove('is-dragged');
      }
    });
    moon.addEventListener('pointercancel', () => {
      start = null;
      dragged = -1;
      moon.classList.remove('is-dragged');
    });
  });

  /* ---- Frame ---- */
  const frame = (now: number) => {
    const dt = Math.min(now - last, 64);
    last = now;
    const still = paused || hovered || dragged >= 0 || !visible || viewer.isOpen() || document.hidden;
    speed = nextSpeed(speed, still, dt);

    const stageBox = stage.getBoundingClientRect();
    const rootBox = root.getBoundingClientRect();
    let active: Point | null = null;

    rings.forEach((ring, r) => {
      ring.rotation = (ring.rotation + speed * (dt / ring.period) * TAU) % TAU;
      let pull: { angle: number; offset: Point } | undefined;
      ring.moons.forEach((i) => {
        if (dragged !== i && !isAtRest(springs[i]!)) springs[i] = springStep(springs[i]!);
        const angle = slotOf[i]! + ring.rotation;
        const p = orbitPoint(ring.orbit, angle);
        const look = moonLook(depthOf(angle));
        const { offset } = springs[i]!;
        if (dragged === i || Math.hypot(offset.x, offset.y) > 0.5) pull = { angle, offset };
        const x = p.x + offset.x;
        const y = p.y + offset.y;
        const moon = moons[i]!;
        moon.style.zIndex = String(look.zIndex);
        moon.style.setProperty('--dim', look.dim.toFixed(3));
        moon.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${look.scale.toFixed(3)})`;
        if (i === selected)
          active = { x: stageBox.left - rootBox.left + x, y: stageBox.top - rootBox.top + y };
      });
      // Samples 0–60 span angles 0…π (front half); 60–120 the back half.
      const points = deformedRing(ring.orbit, 120, pull);
      ring.frontPath.setAttribute('d', toPath(points.slice(0, 61), false));
      ring.backPath.setAttribute('d', toPath([...points.slice(60), points[0]!], false));
      if (r === 0) stage.dataset.rotation = ring.rotation.toFixed(4);
    });

    // Landing trail: from the selected moon to the preview's left edge (side-by-side layout only).
    const pBox = previewImg.getBoundingClientRect();
    if (active && pBox.width && pBox.left > stageBox.right - 8) {
      const b = { x: pBox.left - rootBox.left - 10, y: pBox.top - rootBox.top + pBox.height / 2 };
      trailPath.setAttribute('d', landingTrail(active, b));
    } else {
      trailPath.removeAttribute('d');
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
