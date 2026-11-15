import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import LogoMark from '../../src/components/LogoMark.astro';

const render = async (props: Record<string, unknown> = {}) =>
  (await AstroContainer.create()).renderToString(LogoMark, { props });

describe('LogoMark', () => {
  it('is decorative by default and square at its size', async () => {
    const html = await render({ size: 44 });
    expect(html).toMatch(/<svg[^>]*width="44"[^>]*height="44"/);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
  });

  it('is an image with a name when given a title', async () => {
    const html = await render({ title: 'aggiovato' });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="aggiovato"');
  });

  it('draws pads and flames in the full mark, neither in the micro one', async () => {
    const full = await render();
    expect(full).toContain('class="accent pads"');
    expect(full).toContain('class="accent flames"');
    const micro = await render({ variant: 'micro' });
    expect(micro).not.toContain('pads');
    expect(micro).not.toContain('flames');
  });

  it('marks a rocket that is always in flight', async () => {
    expect(await render({ flying: true })).toMatch(/class="[^"]*is-flying/);
    expect(await render()).not.toContain('is-flying');
  });
});
