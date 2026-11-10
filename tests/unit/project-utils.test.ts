import { describe, expect, it } from 'vitest';
import {
  assertTranslationParity,
  assertUniqueSlugs,
  byFeaturedOrder,
  byRecency,
  entryLocale,
  getNextProject,
  inLocale,
  isVisibleStatus,
  translationKey,
  withFallback,
  withoutEmptyMedia,
  type ProjectLike,
} from '../../src/lib/content/project-utils';

/** Complete, valid project; tests patch only what they are about. */
function aProject(id: string, patch: Partial<ProjectLike['data']> = {}): ProjectLike {
  return {
    id,
    data: {
      slug: id.split('/').pop()!,
      publicationStatus: 'published',
      publishedAt: new Date('2026-06-01'),
      featured: false,
      ...patch,
    },
  };
}

describe('isVisibleStatus', () => {
  it('always shows published projects and never archived ones', () => {
    expect(isVisibleStatus('published', false)).toBe(true);
    expect(isVisibleStatus('archived', true)).toBe(false);
  });

  it('shows drafts only when drafts are allowed', () => {
    expect(isVisibleStatus('draft', false)).toBe(false);
    expect(isVisibleStatus('draft', true)).toBe(true);
  });
});

describe('entry ids', () => {
  it('reads the locale and the translation key from the path', () => {
    expect(entryLocale('es/yrest')).toBe('es');
    expect(translationKey('es/yrest')).toBe('yrest');
  });

  it('rejects entries outside a locale folder', () => {
    expect(() => entryLocale('yrest')).toThrow(/locale folder/);
  });
});

describe('assertUniqueSlugs', () => {
  it('allows the same slug in different locales', () => {
    expect(() => assertUniqueSlugs([aProject('en/a'), aProject('es/a')])).not.toThrow();
  });

  it('blocks a duplicated slug inside one locale', () => {
    expect(() => assertUniqueSlugs([aProject('en/a'), aProject('en/b', { slug: 'a' })])).toThrow(
      /Duplicated project slug "a" in en/,
    );
  });
});

describe('assertTranslationParity', () => {
  it('accepts a translation with its original and the same slug', () => {
    expect(() => assertTranslationParity([aProject('en/a'), aProject('es/a')])).not.toThrow();
  });

  it('rejects a translation without an original', () => {
    expect(() => assertTranslationParity([aProject('es/a')])).toThrow(/has no en original/);
  });

  it('rejects a translation that changes the slug', () => {
    expect(() => assertTranslationParity([aProject('en/a'), aProject('es/a', { slug: 'a-es' })])).toThrow(
      /uses slug "a-es"/,
    );
  });
});

describe('locale listings', () => {
  const list = [aProject('en/a'), aProject('en/b'), aProject('es/a')];

  it('inLocale keeps only entries written in that locale', () => {
    expect(inLocale(list, 'es').map((p) => p.id)).toEqual(['es/a']);
  });

  it('withFallback adds untranslated originals after the translations', () => {
    expect(withFallback(list, 'es').map((p) => p.id)).toEqual(['es/a', 'en/b']);
  });

  it('withFallback in the default locale is just its own entries', () => {
    expect(withFallback(list, 'en').map((p) => p.id)).toEqual(['en/a', 'en/b']);
  });
});

describe('ordering', () => {
  it('sorts by most recent publication, undated last', () => {
    const old = aProject('en/old', { publishedAt: new Date('2025-01-01') });
    const recent = aProject('en/recent', { publishedAt: new Date('2026-09-01') });
    const undated = aProject('en/undated', { publishedAt: undefined });
    expect([old, undated, recent].sort(byRecency).map((p) => p.id)).toEqual([
      'en/recent',
      'en/old',
      'en/undated',
    ]);
  });

  it('sorts featured projects by featuredOrder, unordered last', () => {
    const second = aProject('en/second', { featuredOrder: 2 });
    const first = aProject('en/first', { featuredOrder: 1 });
    const loose = aProject('en/loose');
    expect([loose, second, first].sort(byFeaturedOrder).map((p) => p.id)).toEqual([
      'en/first',
      'en/second',
      'en/loose',
    ]);
  });
});

describe('getNextProject', () => {
  const [a, b, c] = [aProject('en/a'), aProject('en/b'), aProject('en/c')];

  it('returns the following project and wraps around', () => {
    expect(getNextProject(a, [a, b, c])).toBe(b);
    expect(getNextProject(c, [a, b, c])).toBe(a);
  });

  it('returns nothing when there is no other project', () => {
    expect(getNextProject(a, [a])).toBeUndefined();
  });
});

describe('withoutEmptyMedia', () => {
  it('turns an image object without src into undefined (Keystatic empty cover)', () => {
    expect(withoutEmptyMedia({})).toBeUndefined();
    expect(withoutEmptyMedia({ alt: 'alt text' })).toBeUndefined();
  });

  it('keeps an object with src for the schema to validate', () => {
    const media = { src: './cover.png', alt: '' };
    expect(withoutEmptyMedia(media)).toBe(media);
  });

  it('leaves non-objects untouched', () => {
    expect(withoutEmptyMedia(undefined)).toBeUndefined();
    expect(withoutEmptyMedia('x')).toBe('x');
  });
});
