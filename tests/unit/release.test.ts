import { describe, expect, it } from 'vitest';
import { applyRelease, planSync, type Release, type ReleasableData } from '../../src/lib/content/release';

/** Complete, valid payload as project-release.yml sends it; tests patch only what they are about. */
function aRelease(patch: Partial<Release> = {}): Release {
  return {
    slug: 'yrest',
    status: 'active',
    version: '0.15.0',
    releasedAt: '2026-11-25',
    links: { install: 'https://www.npmjs.com/package/@yrest/cli' },
    source: {
      repository: 'aggiovato/yRest',
      commit: '3f9c2a1',
      run: 'https://github.com/aggiovato/yRest/actions/runs/1',
    },
    ...patch,
  };
}

const frontmatter: ReleasableData = {
  projectStatus: 'prototype',
  links: { code: 'https://github.com/aggiovato/yRest', docs: 'https://old.example.com' },
  updatedAt: new Date('2026-11-14'),
};

describe('applyRelease', () => {
  it('leaves the frontmatter alone when the project sent no release', () => {
    expect(applyRelease(frontmatter)).toEqual(frontmatter);
  });

  it('adds the version and takes the release status', () => {
    const data = applyRelease(frontmatter, aRelease());
    expect(data.version).toBe('0.15.0');
    expect(data.projectStatus).toBe('active');
  });

  it('keeps the frontmatter status when the release has none', () => {
    expect(applyRelease(frontmatter, aRelease({ status: undefined })).projectStatus).toBe('prototype');
  });

  it('merges links: the release wins, links only the frontmatter has stay', () => {
    const data = applyRelease(frontmatter, aRelease({ links: { docs: 'https://yrest-docs.netlify.app' } }));
    expect(data.links).toEqual({
      code: 'https://github.com/aggiovato/yRest',
      docs: 'https://yrest-docs.netlify.app',
    });
  });

  it('moves updatedAt to the release day only when it is later', () => {
    expect(applyRelease(frontmatter, aRelease()).updatedAt).toEqual(new Date('2026-11-25'));
    const editedLater = { ...frontmatter, updatedAt: new Date('2026-12-01') };
    expect(applyRelease(editedLater, aRelease()).updatedAt).toEqual(new Date('2026-12-01'));
    expect(applyRelease({ ...frontmatter, updatedAt: undefined }, aRelease()).updatedAt).toEqual(
      new Date('2026-11-25'),
    );
  });
});

describe('planSync', () => {
  const always = { hasCaseStudy: () => true };

  it('writes a valid release as formatted JSON', () => {
    const plan = planSync(aRelease(), always);
    expect(plan).toMatchObject({ action: 'write', slug: 'yrest', version: '0.15.0' });
    if (plan.action === 'write') {
      expect(JSON.parse(plan.content)).toEqual(aRelease());
      expect(plan.content.endsWith('}\n')).toBe(true);
    }
  });

  it('does nothing when the same facts arrive again (a re-run)', () => {
    const first = planSync(aRelease(), always);
    const current = first.action === 'write' ? first.content : undefined;
    expect(planSync(aRelease(), { ...always, current })).toMatchObject({ action: 'unchanged' });
  });

  it('skips a project that has no case study yet', () => {
    const plan = planSync(aRelease({ slug: 'super-3t' }), { hasCaseStudy: () => false });
    expect(plan).toMatchObject({ action: 'skip', slug: 'super-3t' });
  });

  it.each([
    ['a pre-release', { version: '1.0.0-beta.1' }],
    ['a leading v', { version: 'v0.15.0' }],
    ['a date that is not a day', { releasedAt: '25/11/2026' }],
    ['a link that is not a URL', { links: { demo: 'super-3t' } }],
    ['an unknown status', { status: 'shipped' }],
  ])('rejects %s', (_, patch) => {
    expect(planSync({ ...aRelease(), ...patch }, always).action).toBe('invalid');
  });

  it('rejects fields it does not know, so a typo in a manifest is not lost silently', () => {
    const plan = planSync({ ...aRelease(), lnks: {} }, always);
    expect(plan.action).toBe('invalid');
    if (plan.action === 'invalid') expect(plan.errors.join()).toContain('lnks');
  });
});
