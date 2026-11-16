import { describe, expect, it } from 'vitest';
import { diagramSource, inlineSvg } from '../../src/lib/diagrams/source';

describe('diagram source', () => {
  it('takes a marble diagram by id or a file by path', () => {
    expect(diagramSource({ id: 'rxjs-fundamentals/map' })).toEqual({
      kind: 'marble',
      id: 'rxjs-fundamentals/map',
    });
    expect(diagramSource({ src: './my-note/flow.svg' })).toEqual({ kind: 'svg', path: 'my-note/flow.svg' });
    expect(diagramSource({ src: 'my-note/shot.webp' })).toEqual({ kind: 'image', path: 'my-note/shot.webp' });
  });

  it('fails clearly with both, neither, a path outside the notes or an unknown type', () => {
    expect(() => diagramSource({ id: 'a', src: 'b.svg' })).toThrow(/not both/);
    expect(() => diagramSource({})).toThrow(/needs `id`/);
    expect(() => diagramSource({ src: '../secret.svg' })).toThrow(/inside src\/assets\/notes/);
    expect(() => diagramSource({ src: 'my-note/flow.pdf' })).toThrow(/must be an \.svg/);
  });
});

describe('inline SVG', () => {
  const file =
    '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" onload="x()"><script>alert(1)</script><rect width="10" height="10"/></svg>';

  it('drops the prolog, its own size, scripts and handlers, and names it with the alt', () => {
    const svg = inlineSvg(file, 'A "flow"', 'my-note/flow.svg');
    expect(svg.startsWith('<svg role="img" aria-label="A &quot;flow&quot;"')).toBe(true);
    expect(svg).not.toContain('<?xml');
    expect(svg).not.toMatch(/<svg[^>]*\swidth="800"/);
    expect(svg).not.toContain('<script');
    expect(svg).not.toContain('onload');
    expect(svg).toContain('<rect width="10" height="10"/>');
  });

  it('needs a viewBox to scale to the column', () => {
    expect(() => inlineSvg('<svg width="10" height="10"></svg>', 'x', 'a.svg')).toThrow(/viewBox/);
  });
});
