/**
 * Marble diagrams for the notes, drawn as SVG from a small description (src/lib/diagrams/specs.ts)
 * instead of pictures of diagrams: they stay sharp, use the site's fonts and translate. Sized for
 * the reading column (560 units wide, labels ≥ 15): legible at 640 px and still readable on phones.
 * Pure: returns markup, so Vitest covers it and scripts (note covers) can reuse it.
 * Code (lane names, operators, `log: 20`) stays as written; prose labels carry one text per locale.
 */

export type Lang = 'en' | 'es' | 'it';
/** A label: code or a word that never changes, or one text per language. */
export type Text = string | Record<Lang, string>;
/** in: a source value (lavender) · out: a new value (peach) · same: the source value unchanged. */
export type Tone = 'in' | 'out' | 'same';

export interface Lane {
  /** Stream name, as code: `input$`. */
  name: string;
  marbles: { t: number; label: string; tone?: Tone }[];
  /** Time of completion (vertical bar), if the stream completes in the picture. */
  complete?: number;
  /**
   * Time the subscriber unsubscribes: a dashed mark, and the line fades after it. It is an action
   * on the subscription, not a notification, so it must not look like complete (|) or error (X).
   */
  unsubscribe?: number;
  /** Small labels under the lane: `next(A)`, «no emission», `log: 20`. */
  notes?: { t: number; text: Text; tone?: 'code' | 'muted' | 'warm' }[];
}

export interface MarbleSpec {
  kind?: 'marble';
  /** Time span of the track, in the spec's own units. */
  duration: number;
  /** One lane, or two with an operator between them. */
  lanes: [Lane] | [Lane, Lane];
  /** The operator box between the two lanes, as code. */
  operator?: string;
  /** Vertical links from the first lane to the second; `drop` stops at the operator. */
  links?: { t: number; drop?: boolean }[];
  /** An arrow under the lanes with its two ends named (earlier → later). */
  axis?: { from: Text; to: Text };
}

/** Geometry, in viewBox units. */
export const MARBLE = { width: 560, trackStart: 112, trackEnd: 544, r: 17, laneGap: 108 } as const;

// Colours from src/styles/tokens.css, inline so the markup also renders outside the site (covers).
const C = {
  line: 'rgb(245 241 250 / 0.3)',
  text: '#f5f1fa',
  muted: '#bcb5ca',
  lavender: '#c6a5ff',
  peach: '#e8ae91',
  ink: '#21152f',
  box: '#1f1a2c', // opaque: links passing under the operator stay hidden
  boxStroke: 'rgb(198 165 255 / 0.5)',
  link: 'rgb(198 165 255 / 0.6)',
};
const SANS = "font-family:var(--font-sans, 'Manrope Variable', Manrope, sans-serif)";
// No ligatures: code must read as typed (`=>`, `>=`), not as ⇒ or ≥.
const MONO =
  "font-family:var(--font-mono, 'JetBrains Mono Variable', 'JetBrains Mono', monospace);font-variant-ligatures:none";

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const textIn = (t: Text, lang: Lang) => (typeof t === 'string' ? t : (t[lang] ?? t.en));

export function renderMarble(spec: MarbleSpec, lang: Lang): { svg: string; width: number; height: number } {
  const { width, trackStart, trackEnd, r, laneGap } = MARBLE;
  const span = trackEnd - trackStart - 2 * r;
  const x = (t: number) => trackStart + r + (t / spec.duration) * span;
  const [first, second] = spec.lanes;
  const y0 = 40;
  const y1 = second ? y0 + laneGap : y0;
  const noteY = (y: number) => y + r + 22;
  const hasNotes = (l?: Lane) => !!l?.notes?.length;
  let bottom = (second ? y1 : y0) + r + (hasNotes(second ?? first) ? 32 : 14);
  const out: string[] = [];

  const lane = (l: Lane, y: number) => {
    const lineEnd = l.unsubscribe === undefined ? trackEnd : x(l.unsubscribe);
    out.push(
      `<line x1="${trackStart}" y1="${y}" x2="${lineEnd}" y2="${y}" stroke="${C.line}" stroke-width="1.5"/>`,
    );
    out.push(
      `<text x="12" y="${y + 5}" fill="${C.muted}" font-size="15" style="${MONO}">${esc(l.name)}</text>`,
    );
    if (l.unsubscribe !== undefined) {
      // Past this point the source may go on, but nobody is listening.
      out.push(
        `<line x1="${lineEnd}" y1="${y}" x2="${trackEnd}" y2="${y}" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="3 6" opacity="0.6"/>`,
      );
      out.push(
        `<line x1="${lineEnd}" y1="${y - 16}" x2="${lineEnd}" y2="${y + 16}" stroke="${C.peach}" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>`,
      );
    }
    if (l.complete !== undefined) {
      const cx = x(l.complete);
      out.push(
        `<line x1="${cx}" y1="${y - 14}" x2="${cx}" y2="${y + 14}" stroke="${C.text}" stroke-width="2.5" stroke-linecap="round"/>`,
      );
    }
  };
  const marbles = (l: Lane, y: number) => {
    for (const m of l.marbles) {
      const fill = m.tone === 'out' ? C.peach : C.lavender;
      out.push(`<circle cx="${x(m.t)}" cy="${y}" r="${r}" fill="${fill}"/>`);
      out.push(
        `<text x="${x(m.t)}" y="${y + 5}" text-anchor="middle" fill="${C.ink}" font-size="14" font-weight="750" style="${SANS}">${esc(m.label)}</text>`,
      );
    }
    for (const n of l.notes ?? []) {
      const fill = n.tone === 'warm' ? C.peach : n.tone === 'code' ? C.lavender : C.muted;
      out.push(
        `<text x="${x(n.t)}" y="${noteY(y)}" text-anchor="middle" fill="${fill}" font-size="13" style="${MONO}">${esc(textIn(n.text, lang))}</text>`,
      );
    }
  };

  lane(first, y0);
  if (second) {
    lane(second, y1);
    // Links first, so the operator box covers them where they cross it.
    const boxTop = y0 + r + 16;
    const boxBottom = y1 - r - 16;
    for (const l of spec.links ?? []) {
      const end = l.drop ? (boxTop + boxBottom) / 2 : y1 - r;
      out.push(
        `<line x1="${x(l.t)}" y1="${y0 + r}" x2="${x(l.t)}" y2="${end}" stroke="${C.link}" stroke-width="1.5"/>`,
      );
    }
    if (spec.operator) {
      const bx = trackStart + 40;
      const bw = trackEnd - trackStart - 80;
      out.push(
        `<rect x="${bx}" y="${boxTop}" width="${bw}" height="${boxBottom - boxTop}" rx="8" fill="${C.box}" stroke="${C.boxStroke}"/>`,
      );
      out.push(
        `<text x="${bx + bw / 2}" y="${(boxTop + boxBottom) / 2 + 5}" text-anchor="middle" fill="${C.lavender}" font-size="15" style="${MONO}">${esc(spec.operator)}</text>`,
      );
    }
    marbles(second, y1);
  }
  marbles(first, y0);

  if (spec.axis) {
    const ay = bottom + 6;
    const a = trackStart + r;
    const b = trackEnd - r;
    out.push(`<line x1="${a}" y1="${ay}" x2="${b}" y2="${ay}" stroke="${C.muted}" stroke-width="1.5"/>`);
    out.push(
      `<path d="M${b - 8} ${ay - 5} L${b} ${ay} L${b - 8} ${ay + 5}" fill="none" stroke="${C.muted}" stroke-width="1.5"/>`,
    );
    out.push(
      `<text x="${a}" y="${ay + 22}" fill="${C.muted}" font-size="13" style="${MONO}">${esc(textIn(spec.axis.from, lang))}</text>`,
    );
    out.push(
      `<text x="${b}" y="${ay + 22}" text-anchor="end" fill="${C.muted}" font-size="13" style="${MONO}">${esc(textIn(spec.axis.to, lang))}</text>`,
    );
    bottom = ay + 36;
  }

  const height = Math.round(bottom + 8);
  return {
    width,
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${out.join('')}</svg>`,
  };
}

/* ---------- Timelines: events, inner subscriptions and responses over seconds ---------- */

/** The three tracked items keep one colour across lanes: the hero's code palette. */
export type Hue = 'a' | 'b' | 'c';
const HUE: Record<Hue, string> = { a: '#c6a5ff', b: '#e8ae91', c: '#9dddbb' };

export type TimelineLane = (
  | {
      type: 'events';
      items: { t: number; label: string; hue: Hue }[];
      /** The stream completes (|). */
      complete?: number;
    }
  | {
      /** Combined results: a small dot with its value, e.g. `[A2,B1]`, above or below the lane. */
      type: 'pairs';
      items: { t: number; label: string; above?: boolean }[];
      complete?: number;
      /** Each pair as a pill on the lane (compact comparisons) instead of a dot with a label. */
      pills?: boolean;
    }
  | {
      type: 'bars';
      hue: Hue;
      /** Active subscription (solid) or waiting in a queue (dotted, with an optional label). */
      segments?: { from: number; to: number; queued?: boolean; label?: Text }[];
      /** How the inner subscription ends: it completes (|) or is cancelled (×). */
      end?: { t: number; kind: 'complete' | 'cancel' };
      /** The event never starts an inner subscription. */
      ignored?: { t: number; label: Text };
    }
) & {
  name: string;
  /** The name is code (an operator), set in lavender. */
  code?: boolean;
  /** Extra space above the lane: the output, set apart from what produces it. */
  gapBefore?: boolean;
};

export interface TimelineSpec {
  kind: 'timeline';
  /** Seconds on the axis, 0…ticks. */
  ticks: number;
  lanes: TimelineLane[];
  /** Width of the name column (long names such as operators); the track starts after it. */
  labelWidth?: number;
}

export const TIMELINE = { width: 560, trackStart: 64, trackEnd: 544, top: 26, laneGap: 46, r: 14 } as const;

export function renderTimeline(
  spec: TimelineSpec,
  lang: Lang,
): { svg: string; width: number; height: number } {
  const { width, trackEnd, top, laneGap, r } = TIMELINE;
  const trackStart = spec.labelWidth ?? TIMELINE.trackStart;
  const x = (t: number) => trackStart + r + (t / spec.ticks) * (trackEnd - trackStart - 2 * r);
  const out: string[] = [];
  // Lane positions: a fixed gap, plus a third of it before a lane set apart (the output).
  let y = top + 34 - laneGap;
  const ys = spec.lanes.map((l) => (y += laneGap + (l.gapBefore ? laneGap / 3 : 0)));
  const last = spec.lanes.at(-1);
  const bottom = y + (last?.type === 'pairs' && last.items.some((i) => !i.above) ? 34 : laneGap / 3);
  // Axis: one tick per second, faint guides down the lanes.
  for (let s = 0; s <= spec.ticks; s++) {
    out.push(
      `<line x1="${x(s)}" y1="${top + 10}" x2="${x(s)}" y2="${bottom}" stroke="rgb(245 241 250 / 0.06)"/>`,
    );
    out.push(
      `<text x="${x(s)}" y="${top}" text-anchor="middle" fill="${C.muted}" font-size="12" style="${MONO}">${s}</text>`,
    );
  }
  out.push(`<text x="${trackEnd + 6}" y="${top}" fill="${C.muted}" font-size="12" style="${MONO}">s</text>`);

  const completeBar = (t: number, y: number, color: string) => {
    const ex = x(t);
    out.push(
      `<line x1="${ex}" y1="${y - 10}" x2="${ex}" y2="${y + 10}" stroke="${color}" stroke-width="3"/>`,
    );
  };

  spec.lanes.forEach((lane, i) => {
    const y = ys[i]!;
    out.push(
      `<line x1="${trackStart}" y1="${y}" x2="${trackEnd}" y2="${y}" stroke="${C.line}" stroke-width="1.2"/>`,
    );
    out.push(
      `<text x="12" y="${y + 5}" fill="${lane.code ? C.lavender : C.muted}" font-size="15" style="${MONO}">${esc(lane.name)}</text>`,
    );
    if (lane.type === 'events') {
      if (lane.complete !== undefined) completeBar(lane.complete, y, C.text);
      for (const it of lane.items) {
        out.push(`<circle cx="${x(it.t)}" cy="${y}" r="${r}" fill="${HUE[it.hue]}"/>`);
        out.push(
          `<text x="${x(it.t)}" y="${y + 5}" text-anchor="middle" fill="${C.ink}" font-size="13" font-weight="750" style="${SANS}">${esc(it.label)}</text>`,
        );
      }
      return;
    }
    if (lane.type === 'pairs') {
      if (lane.complete !== undefined) completeBar(lane.complete, y, C.text);
      for (const it of lane.items) {
        if (lane.pills) {
          const w = it.label.length * 6.8 + 10;
          out.push(
            `<rect x="${x(it.t) - w / 2}" y="${y - 11}" width="${w}" height="22" rx="11" fill="${C.lavender}"/>`,
          );
          out.push(
            `<text x="${x(it.t)}" y="${y + 4.5}" text-anchor="middle" fill="${C.ink}" font-size="11.5" font-weight="700" style="${MONO}">${esc(it.label)}</text>`,
          );
          continue;
        }
        out.push(`<circle cx="${x(it.t)}" cy="${y}" r="6" fill="${C.lavender}"/>`);
        out.push(
          `<text x="${x(it.t)}" y="${it.above ? y - 14 : y + 26}" text-anchor="middle" fill="${C.lavender}" font-size="13" style="${MONO}">${esc(it.label)}</text>`,
        );
      }
      return;
    }
    const color = HUE[lane.hue];
    for (const s of lane.segments ?? []) {
      if (s.queued) {
        out.push(
          `<line x1="${x(s.from)}" y1="${y}" x2="${x(s.to)}" y2="${y}" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.1 6"/>`,
        );
        if (s.label)
          out.push(
            `<text x="${(x(s.from) + x(s.to)) / 2}" y="${y - 10}" text-anchor="middle" fill="${C.muted}" font-size="12" style="${MONO}">${esc(textIn(s.label, lang))}</text>`,
          );
      } else {
        out.push(
          `<line x1="${x(s.from)}" y1="${y}" x2="${x(s.to)}" y2="${y}" stroke="${color}" stroke-width="6"/>`,
        );
        out.push(
          `<line x1="${x(s.from)}" y1="${y - 8}" x2="${x(s.from)}" y2="${y + 8}" stroke="${color}" stroke-width="1.5"/>`,
        );
      }
    }
    if (lane.end?.kind === 'complete') completeBar(lane.end.t, y, color);
    else if (lane.end?.kind === 'cancel') {
      const ex = x(lane.end.t);
      out.push(
        `<path d="M${ex - 6} ${y - 6} L${ex + 6} ${y + 6} M${ex + 6} ${y - 6} L${ex - 6} ${y + 6}" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>`,
      );
    }
    if (lane.ignored) {
      const ix = x(lane.ignored.t);
      out.push(
        `<path d="M${ix - 6} ${y - 6} L${ix + 6} ${y + 6} M${ix + 6} ${y - 6} L${ix - 6} ${y + 6}" stroke="${C.muted}" stroke-width="2" stroke-linecap="round"/>`,
      );
      out.push(
        `<text x="${ix + 14}" y="${y + 5}" fill="${C.muted}" font-size="13" style="${MONO}">${esc(textIn(lane.ignored.label, lang))}</text>`,
      );
    }
  });

  const height = Math.round(bottom + 14);
  return {
    width,
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${out.join('')}</svg>`,
  };
}

export type DiagramSpec = MarbleSpec | TimelineSpec;

/** Draws any diagram of src/lib/diagrams/specs.ts, by its kind (marble by default). */
export const renderDiagram = (spec: DiagramSpec, lang: Lang) =>
  'kind' in spec && spec.kind === 'timeline'
    ? renderTimeline(spec, lang)
    : renderMarble(spec as MarbleSpec, lang);
