import { describe, expect, it } from 'vitest';
import { buildLlms, type LlmsInput } from '../../src/lib/llms';

const input = (patch: Partial<LlmsInput> = {}): LlmsInput => ({
  title: 'Heber Alejandro Lugo — aggiovato',
  description: 'Full-stack developer.',
  about: ['First paragraph.', 'Second paragraph.'],
  coreStack: ['Angular', 'React'],
  projects: [{ title: 'yRest', url: 'https://x.dev/work/yrest/', summary: 'A YAML mock API.' }],
  notes: [{ title: 'RxJS', url: 'https://x.dev/notes/rxjs/', summary: 'Streams.' }],
  contact: [{ title: 'Email', url: 'mailto:a@b.c' }],
  optional: [{ title: 'Sitemap', url: 'https://x.dev/sitemap-index.xml' }],
  ...patch,
});

describe('llms.txt', () => {
  it('follows the llmstxt.org shape: H1, blockquote, prose, then link sections', () => {
    const text = buildLlms(input());
    expect(
      text.startsWith('# Heber Alejandro Lugo — aggiovato\n\n> Full-stack developer.\n\nFirst paragraph.'),
    ).toBe(true);
    expect(text).toContain('Core stack: Angular, React.');
    expect(text).toContain('## Case studies\n\n- [yRest](https://x.dev/work/yrest/): A YAML mock API.');
    expect(text).toContain('## Notes\n\n- [RxJS](https://x.dev/notes/rxjs/): Streams.');
    expect(text).toContain('- [Email](mailto:a@b.c)\n');
    expect(text.indexOf('## Optional')).toBeGreaterThan(text.indexOf('## About and contact'));
    expect(text.endsWith('\n')).toBe(true);
    expect(text.endsWith('\n\n')).toBe(false);
  });

  it('leaves out a section with nothing in it', () => {
    expect(buildLlms(input({ notes: [] }))).not.toContain('## Notes');
  });
});
