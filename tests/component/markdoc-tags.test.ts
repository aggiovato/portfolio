import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Callout from '../../src/components/Callout.astro';
import DecisionBlock from '../../src/components/DecisionBlock.astro';
import ProjectMeta from '../../src/components/ProjectMeta.astro';

/**
 * Component layer: renders .astro components to HTML with the Container API (experimental in Astro 7)
 * and asserts the contract a reader sees, not the CSS. Outside an i18n route Astro.currentLocale is
 * undefined, so components render in the default locale; locale switching is covered by unit
 * tests (src/i18n) and e2e (tests/e2e/i18n.spec.ts).
 */
let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('DecisionBlock', () => {
  it('renders only the rows that have content, in the narrative order', async () => {
    const html = await container.renderToString(DecisionBlock, {
      props: { problem: 'Slow start', decision: 'Use Fastify', tradeoff: 'Less structure' },
    });
    const terms = [...html.matchAll(/<dt[^>]*>([^<]+)<\/dt>/g)].map((m) => m[1]);
    expect(terms).toEqual(['Problem', 'Decision', 'Trade-off']);
    expect(html).toContain('aria-label="Decision: Use Fastify"');
  });
});

describe('Callout', () => {
  it('uses the default title of its type when none is given', async () => {
    const html = await container.renderToString(Callout, {
      props: { type: 'constraint' },
      slots: { default: '<p>Body</p>' },
    });
    expect(html).toContain('Constraint');
    expect(html).toContain('<p>Body</p>');
  });

  it('prefers an explicit title', async () => {
    const html = await container.renderToString(Callout, { props: { title: 'Limits' } });
    expect(html).toContain('Limits');
    expect(html).not.toContain('>Note<');
  });
});

describe('ProjectMeta', () => {
  const base = {
    projectType: 'open-source',
    projectStatus: 'active',
    periodLabel: 'June 2026',
    role: ['Development', 'Documentation'],
    links: {},
  } as const;

  it('lists type, period, status and role', async () => {
    const html = await container.renderToString(ProjectMeta, { props: { data: base } });
    expect(html).toContain('Open source');
    // One chip per role.
    expect(html).toMatch(/<li class="chip"[^>]*>Development<\/li>/);
    expect(html).toMatch(/<li class="chip"[^>]*>Documentation<\/li>/);
    expect(html).not.toContain('Context');
  });

  it('marks professional work without a demo as a private product', async () => {
    const html = await container.renderToString(ProjectMeta, {
      props: { data: { ...base, projectType: 'professional', team: 'Team of 4' } },
    });
    expect(html).toContain('Active · Private product');
    expect(html).toContain('Team of 4');
  });
});
