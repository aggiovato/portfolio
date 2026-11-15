import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SkillTree from '../../src/components/SkillTree.astro';
import type { SkillTree as Tree } from '../../src/lib/content/skill-utils';

const tree: Tree = {
  intro: 'Open a technology.',
  groups: [
    {
      id: 'frontend',
      title: 'Frontend',
      nodes: [
        {
          id: 'angular',
          name: 'Angular',
          summary: 'Main framework.',
          branches: [
            { name: 'Routing', when: 'Lazy routes per feature.' },
            { name: 'RxJS', when: 'Anything over time.' },
          ],
        },
      ],
    },
  ],
};

describe('SkillTree', () => {
  it('renders each technology as a closed disclosure with its branches and when they are used', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SkillTree, { props: { tree } });
    expect(html).toContain('Open a technology.');
    expect(html).toMatch(/<h3[^>]*id="skills-frontend"[^>]*>\s*Frontend/);
    expect(html).toMatch(/<details[^>]*class="node"[^>]*>/);
    expect(html).not.toMatch(/<details[^>]*\sopen/);
    expect(html).toMatch(/<summary[^>]*>[\s\S]*Angular[\s\S]*Main framework\.[\s\S]*<\/summary>/);
    const terms = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)].map((m) => m[1]);
    expect(terms).toEqual(['Routing', 'RxJS']);
    expect(html).toContain('Lazy routes per feature.');
  });
});
