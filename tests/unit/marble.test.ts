import { describe, expect, it } from 'vitest';
import {
  MARBLE,
  renderDiagram,
  renderMarble,
  textIn,
  type DiagramSpec,
  type MarbleSpec,
  type TimelineSpec,
} from '../../src/lib/diagrams/marble';
import { DIAGRAMS } from '../../src/lib/diagrams/specs';

const twoLanes: MarbleSpec = {
  duration: 4,
  lanes: [
    { name: 'input$', marbles: [{ t: 1, label: '10' }], complete: 3 },
    {
      name: 'output$',
      marbles: [],
      notes: [{ t: 1, text: { en: 'no emission', es: 'sin emisión', it: 'nessuna emissione' } }],
    },
  ],
  operator: 'filter(n => n >= 20)',
  links: [{ t: 1, drop: true }],
};

describe('marble diagrams', () => {
  it('draws lanes, marbles, the operator and the completion bar in a fixed-width viewBox', () => {
    const { svg, width, height } = renderMarble(twoLanes, 'en');
    expect(width).toBe(MARBLE.width);
    expect(svg).toContain(`viewBox="0 0 ${MARBLE.width} ${height}"`);
    expect(svg).toContain('>input$<');
    expect(svg).toContain('>output$<');
    expect(svg.match(/<circle/g)).toHaveLength(1);
    // Code is escaped and written as typed, with ligatures off so => and >= are not redrawn.
    expect(svg).toContain('filter(n =&gt; n &gt;= 20)');
    expect(svg).toContain('font-variant-ligatures:none');
  });

  it('translates prose labels and leaves code alone', () => {
    expect(renderMarble(twoLanes, 'es').svg).toContain('>sin emisión<');
    expect(renderMarble(twoLanes, 'it').svg).toContain('>nessuna emissione<');
    expect(textIn('log: 20', 'es')).toBe('log: 20');
  });

  it('stops a dropped value at the operator instead of reaching the output lane', () => {
    const { svg } = renderMarble(twoLanes, 'en');
    const link = svg.match(/<line x1="([\d.]+)" y1="([\d.]+)" x2="\1" y2="([\d.]+)" stroke="rgb\(198/);
    expect(link).not.toBeNull();
    const [, , y1, y2] = link!;
    expect(Number(y2)).toBeGreaterThan(Number(y1));
    expect(Number(y2)).toBeLessThan(40 + MARBLE.laneGap - MARBLE.r);
  });

  it('every diagram of the notes renders in every language', () => {
    for (const spec of Object.values(DIAGRAMS) as DiagramSpec[]) {
      for (const lang of ['en', 'es', 'it'] as const) {
        const { svg, height } = renderDiagram(spec, lang);
        expect(height).toBeGreaterThan(80);
        expect(svg).not.toContain('undefined');
      }
    }
  });
});

describe('timelines', () => {
  const spec: TimelineSpec = {
    kind: 'timeline',
    ticks: 9,
    lanes: [
      { name: 'In', type: 'events', items: [{ t: 0, label: 'A', hue: 'a' }] },
      {
        name: 'B',
        type: 'bars',
        hue: 'b',
        segments: [
          { from: 1, to: 5, queued: true, label: { en: 'queued', es: 'en cola', it: 'in coda' } },
          { from: 5, to: 8 },
        ],
        end: { t: 8, kind: 'complete' },
      },
      {
        name: 'C',
        type: 'bars',
        hue: 'c',
        ignored: { t: 2, label: { en: 'ignored', es: 'ignorado', it: 'ignorato' } },
      },
    ],
  };

  it('draws a seconds axis, queued waits as dots and the end of each subscription', () => {
    const { svg } = renderDiagram(spec, 'en');
    for (let s = 0; s <= 9; s++) expect(svg).toContain(`>${s}</text>`);
    expect(svg).toContain('stroke-dasharray="0.1 6"');
    expect(svg).toContain('>queued<');
    expect(svg).toContain('>ignored<');
  });

  it('translates the lane notes, not the names', () => {
    const { svg } = renderDiagram(spec, 'es');
    expect(svg).toContain('>en cola<');
    expect(svg).toContain('>ignorado<');
    expect(svg).toContain('>In<');
  });

  it('keeps one colour per item across lanes', () => {
    const { svg } = renderDiagram(spec, 'en');
    expect(svg).toContain('fill="#c6a5ff"');
    expect(svg).toContain('stroke="#e8ae91"');
  });

  it('draws combined results as dots with their pair, above or below the output lane', () => {
    const { svg } = renderDiagram(
      {
        kind: 'timeline',
        ticks: 8,
        lanes: [
          { name: 'A', type: 'events', items: [{ t: 1, label: 'A1', hue: 'a' }], complete: 6 },
          {
            name: 'Out',
            type: 'pairs',
            gapBefore: true,
            items: [
              { t: 2, label: '[A1,B1]' },
              { t: 4, label: '[A2,B1]', above: true },
            ],
            complete: 7,
          },
        ],
      },
      'en',
    );
    expect(svg).toContain('>[A1,B1]<');
    expect(svg).toContain('>[A2,B1]<');
    expect(svg.match(/r="6"/g)).toHaveLength(2);
  });
});
