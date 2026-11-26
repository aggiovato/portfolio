/**
 * The marble diagrams used in the notes, by id (`<note>/<figure>`). The `{% diagram id="…" %}`
 * tag (Diagram.astro) draws them; its `alt` and `caption` live in each note's translation.
 */
import type { DiagramSpec, TimelineLane } from './marble';

// Mapping operators: three events (0s, 1s, 2s) whose requests take 5s, 3s and 1s.
const IN: TimelineLane = {
  name: 'In',
  type: 'events',
  items: [
    { t: 0, label: 'A', hue: 'a' },
    { t: 1, label: 'B', hue: 'b' },
    { t: 2, label: 'C', hue: 'c' },
  ],
};
const QUEUED = { en: 'queued', es: 'en cola', it: 'in coda' };
const IGNORED = { en: 'ignored', es: 'ignorado', it: 'ignorato' };
const out = (items: [number, 'A' | 'B' | 'C'][]): TimelineLane => ({
  name: 'Out',
  type: 'events',
  gapBefore: true,
  items: items.map(([t, label]) => ({ t, label, hue: label === 'A' ? 'a' : label === 'B' ? 'b' : 'c' })),
});

// Combining streams: A emits at 1s and 4s and completes at 6s; B at 2s and 5s, completes at 7s.
const A: TimelineLane = {
  name: 'A',
  type: 'events',
  items: [
    { t: 1, label: 'A1', hue: 'a' },
    { t: 4, label: 'A2', hue: 'a' },
  ],
  complete: 6,
};
const B: TimelineLane = {
  name: 'B',
  type: 'events',
  items: [
    { t: 2, label: 'B1', hue: 'b' },
    { t: 5, label: 'B2', hue: 'b' },
  ],
  complete: 7,
};
const pairs = (items: { t: number; label: string; above?: boolean }[], complete: number): TimelineLane => ({
  name: 'Out',
  type: 'pairs',
  gapBefore: true,
  items,
  complete,
});

export const DIAGRAMS = {
  'rxjs-fundamentals/reading': {
    duration: 4,
    lanes: [
      {
        name: 'source$',
        marbles: [
          { t: 0.8, label: 'A' },
          { t: 2.1, label: 'B' },
        ],
        complete: 3.3,
        notes: [
          { t: 0.8, text: 'next(A)', tone: 'code' },
          { t: 2.1, text: 'next(B)', tone: 'code' },
          { t: 3.3, text: 'complete', tone: 'code' },
        ],
      },
    ],
    axis: {
      from: { en: 'earlier', es: 'antes', it: 'prima' },
      to: { en: 'later', es: 'después', it: 'dopo' },
    },
  },
  'rxjs-fundamentals/unsubscribe': {
    duration: 4,
    lanes: [
      {
        name: 'source$',
        marbles: [
          { t: 0.8, label: 'A' },
          { t: 2, label: 'B' },
        ],
        unsubscribe: 2.9,
        notes: [
          { t: 0.8, text: 'next(A)', tone: 'code' },
          { t: 2, text: 'next(B)', tone: 'code' },
          { t: 3.25, text: 'unsubscribe()', tone: 'warm' },
        ],
      },
    ],
    axis: {
      from: { en: 'earlier', es: 'antes', it: 'prima' },
      to: { en: 'later', es: 'después', it: 'dopo' },
    },
  },
  'rxjs-fundamentals/map': {
    duration: 4,
    lanes: [
      {
        name: 'input$',
        marbles: [
          { t: 0.6, label: '1' },
          { t: 1.8, label: '2' },
          { t: 3, label: '3' },
        ],
        complete: 3.7,
      },
      {
        name: 'output$',
        marbles: [
          { t: 0.6, label: '10', tone: 'out' },
          { t: 1.8, label: '20', tone: 'out' },
          { t: 3, label: '30', tone: 'out' },
        ],
        complete: 3.7,
      },
    ],
    operator: 'map(n => n * 10)',
    links: [{ t: 0.6 }, { t: 1.8 }, { t: 3 }],
  },
  'rxjs-fundamentals/filter': {
    duration: 4,
    lanes: [
      {
        name: 'input$',
        marbles: [
          { t: 0.6, label: '10' },
          { t: 1.8, label: '20' },
          { t: 3, label: '30' },
        ],
        complete: 3.7,
      },
      {
        name: 'output$',
        marbles: [
          { t: 1.8, label: '20', tone: 'same' },
          { t: 3, label: '30', tone: 'same' },
        ],
        complete: 3.7,
        notes: [{ t: 0.6, text: { en: 'no emission', es: 'sin emisión', it: 'nessuna emissione' } }],
      },
    ],
    operator: 'filter(n => n >= 20)',
    links: [{ t: 0.6, drop: true }, { t: 1.8 }, { t: 3 }],
  },
  'rxjs-fundamentals/tap': {
    duration: 4,
    lanes: [
      {
        name: 'input$',
        marbles: [
          { t: 1.1, label: '20' },
          { t: 2.7, label: '30' },
        ],
        complete: 3.7,
      },
      {
        name: 'output$',
        marbles: [
          { t: 1.1, label: '20', tone: 'same' },
          { t: 2.7, label: '30', tone: 'same' },
        ],
        complete: 3.7,
        notes: [
          { t: 1.1, text: 'log: 20', tone: 'warm' },
          { t: 2.7, text: 'log: 30', tone: 'warm' },
        ],
      },
    ],
    operator: 'tap(n => console.log(n))',
    links: [{ t: 1.1 }, { t: 2.7 }],
  },
  'rxjs-mapping-operators/switchmap': {
    kind: 'timeline',
    ticks: 9,
    lanes: [
      IN,
      { name: 'A', type: 'bars', hue: 'a', segments: [{ from: 0, to: 1 }], end: { t: 1, kind: 'cancel' } },
      { name: 'B', type: 'bars', hue: 'b', segments: [{ from: 1, to: 2 }], end: { t: 2, kind: 'cancel' } },
      { name: 'C', type: 'bars', hue: 'c', segments: [{ from: 2, to: 3 }], end: { t: 3, kind: 'complete' } },
      out([[3, 'C']]),
    ],
  },
  'rxjs-mapping-operators/concatmap': {
    kind: 'timeline',
    ticks: 9,
    lanes: [
      IN,
      { name: 'A', type: 'bars', hue: 'a', segments: [{ from: 0, to: 5 }], end: { t: 5, kind: 'complete' } },
      {
        name: 'B',
        type: 'bars',
        hue: 'b',
        segments: [
          { from: 1, to: 5, queued: true, label: QUEUED },
          { from: 5, to: 8 },
        ],
        end: { t: 8, kind: 'complete' },
      },
      {
        name: 'C',
        type: 'bars',
        hue: 'c',
        segments: [
          { from: 2, to: 8, queued: true, label: QUEUED },
          { from: 8, to: 9 },
        ],
        end: { t: 9, kind: 'complete' },
      },
      out([
        [5, 'A'],
        [8, 'B'],
        [9, 'C'],
      ]),
    ],
  },
  'rxjs-mapping-operators/mergemap': {
    kind: 'timeline',
    ticks: 9,
    lanes: [
      IN,
      { name: 'A', type: 'bars', hue: 'a', segments: [{ from: 0, to: 5 }], end: { t: 5, kind: 'complete' } },
      { name: 'B', type: 'bars', hue: 'b', segments: [{ from: 1, to: 4 }], end: { t: 4, kind: 'complete' } },
      { name: 'C', type: 'bars', hue: 'c', segments: [{ from: 2, to: 3 }], end: { t: 3, kind: 'complete' } },
      out([
        [3, 'C'],
        [4, 'B'],
        [5, 'A'],
      ]),
    ],
  },
  'rxjs-mapping-operators/exhaustmap': {
    kind: 'timeline',
    ticks: 9,
    lanes: [
      IN,
      { name: 'A', type: 'bars', hue: 'a', segments: [{ from: 0, to: 5 }], end: { t: 5, kind: 'complete' } },
      { name: 'B', type: 'bars', hue: 'b', ignored: { t: 1, label: IGNORED } },
      { name: 'C', type: 'bars', hue: 'c', ignored: { t: 2, label: IGNORED } },
      out([[5, 'A']]),
    ],
  },
  'rxjs-combining-streams/experiment': { kind: 'timeline', ticks: 8, lanes: [A, B] },
  'rxjs-combining-streams/combinelatest': {
    kind: 'timeline',
    ticks: 8,
    lanes: [
      A,
      B,
      pairs(
        [
          { t: 2, label: '[A1,B1]' },
          { t: 4, label: '[A2,B1]', above: true },
          { t: 5, label: '[A2,B2]' },
        ],
        7,
      ),
    ],
  },
  'rxjs-combining-streams/withlatestfrom': {
    kind: 'timeline',
    ticks: 8,
    lanes: [A, B, pairs([{ t: 4, label: '[A2,B1]', above: true }], 6)],
  },
  'rxjs-combining-streams/zip': {
    kind: 'timeline',
    ticks: 8,
    lanes: [
      A,
      B,
      pairs(
        [
          { t: 2, label: '[A1,B1]' },
          { t: 5, label: '[A2,B2]' },
        ],
        6,
      ),
    ],
  },
  'rxjs-combining-streams/forkjoin': {
    kind: 'timeline',
    ticks: 8,
    lanes: [A, B, pairs([{ t: 7, label: '[A2,B2]' }], 7)],
  },
  // Covers: the four outcomes side by side (scripts/note-covers.mjs). Code and data only, so one
  // image serves every language.
  'rxjs-mapping-operators/cover': {
    kind: 'timeline',
    ticks: 9,
    labelWidth: 128,
    lanes: [
      { name: 'switchMap', code: true, type: 'events', items: [{ t: 3, label: 'C', hue: 'c' }] },
      {
        name: 'concatMap',
        code: true,
        type: 'events',
        items: [
          { t: 5, label: 'A', hue: 'a' },
          { t: 8, label: 'B', hue: 'b' },
          { t: 9, label: 'C', hue: 'c' },
        ],
      },
      {
        name: 'mergeMap',
        code: true,
        type: 'events',
        items: [
          { t: 3, label: 'C', hue: 'c' },
          { t: 4, label: 'B', hue: 'b' },
          { t: 5, label: 'A', hue: 'a' },
        ],
      },
      { name: 'exhaustMap', code: true, type: 'events', items: [{ t: 5, label: 'A', hue: 'a' }] },
    ],
  },
  'rxjs-combining-streams/cover': {
    kind: 'timeline',
    ticks: 7,
    labelWidth: 150,
    lanes: [
      {
        name: 'combineLatest',
        code: true,
        type: 'pairs',
        pills: true,
        items: [
          { t: 2, label: 'A1,B1' },
          { t: 4, label: 'A2,B1' },
          { t: 5, label: 'A2,B2' },
        ],
      },
      { name: 'withLatestFrom', code: true, type: 'pairs', pills: true, items: [{ t: 4, label: 'A2,B1' }] },
      {
        name: 'zip',
        code: true,
        type: 'pairs',
        pills: true,
        items: [
          { t: 2, label: 'A1,B1' },
          { t: 5, label: 'A2,B2' },
        ],
      },
      { name: 'forkJoin', code: true, type: 'pairs', pills: true, items: [{ t: 7, label: 'A2,B2' }] },
    ],
  },
} satisfies Record<string, DiagramSpec>;

export type DiagramId = keyof typeof DIAGRAMS;
export const isDiagramId = (id: string): id is DiagramId => id in DIAGRAMS;
