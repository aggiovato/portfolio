/**
 * Pure project logic, with no `astro:content` import, so Vitest covers it directly.
 * `projects.ts` wires these functions to the collection.
 *
 * Translations: one file per locale, matched by file name (`en/yrest.mdoc` ↔ `es/yrest.mdoc`).
 * The entry id carries the locale as its first segment (`es/yrest`).
 */
import { defaultLocale, isLocale, type Locale } from '../../i18n/config';

export type PublicationStatus = 'draft' | 'published' | 'archived';

/** Minimal shape these helpers need; `CollectionEntry<'projects'>` satisfies it. */
export interface ProjectLike {
  id: string;
  data: {
    slug: string;
    publicationStatus: PublicationStatus;
    publishedAt?: Date;
    featured: boolean;
    featuredOrder?: number;
  };
}

/** Spec §13: published is always public; drafts only where explicitly allowed (dev, e2e build). */
export function isVisibleStatus(status: PublicationStatus, showDrafts: boolean): boolean {
  if (status === 'published') return true;
  return showDrafts && status === 'draft';
}

/** Locale of an entry, from the first segment of its id. */
export function entryLocale(id: string): Locale {
  const [first] = id.split('/');
  if (!isLocale(first)) {
    throw new Error(`Project "${id}" is not inside a locale folder (src/content/projects/<locale>/)`);
  }
  return first;
}

/** Translation key shared by every locale of a project: the file name without the locale folder. */
export function translationKey(id: string): string {
  return id.split('/').slice(1).join('/');
}

export function byRecency(a: ProjectLike, b: ProjectLike): number {
  return (b.data.publishedAt?.getTime() ?? 0) - (a.data.publishedAt?.getTime() ?? 0);
}

export function byFeaturedOrder(a: ProjectLike, b: ProjectLike): number {
  return (a.data.featuredOrder ?? 99) - (b.data.featuredOrder ?? 99);
}

/** A duplicated slug inside one locale blocks the build (§21). */
export function assertUniqueSlugs(list: ProjectLike[]): void {
  const seen = new Set<string>();
  for (const p of list) {
    const key = `${entryLocale(p.id)}:${p.data.slug}`;
    if (seen.has(key)) throw new Error(`Duplicated project slug "${p.data.slug}" in ${entryLocale(p.id)}`);
    seen.add(key);
  }
}

/**
 * Every translation has its default-locale original and keeps its slug, so switching language
 * lands on the same project (spec §17: stable ids across translations).
 */
export function assertTranslationParity(list: ProjectLike[]): void {
  const originals = new Map(
    list.filter((p) => entryLocale(p.id) === defaultLocale).map((p) => [translationKey(p.id), p]),
  );
  for (const p of list) {
    if (entryLocale(p.id) === defaultLocale) continue;
    const original = originals.get(translationKey(p.id));
    if (!original) {
      throw new Error(`Translation "${p.id}" has no ${defaultLocale} original with the same file name`);
    }
    if (original.data.slug !== p.data.slug) {
      throw new Error(
        `Translation "${p.id}" uses slug "${p.data.slug}"; the original uses "${original.data.slug}"`,
      );
    }
  }
}

/** Entries written in `locale`. Case study routes are generated only from these. */
export function inLocale<T extends ProjectLike>(list: T[], locale: Locale): T[] {
  return list.filter((p) => entryLocale(p.id) === locale);
}

/**
 * Listing for `locale`: its own entries plus the default-locale originals that are not translated
 * yet. Fallbacks keep their own locale, so cards link to the original URL and mark the language.
 */
export function withFallback<T extends ProjectLike>(list: T[], locale: Locale): T[] {
  const own = inLocale(list, locale);
  if (locale === defaultLocale) return own;
  const translated = new Set(own.map((p) => translationKey(p.id)));
  const fallback = inLocale(list, defaultLocale).filter((p) => !translated.has(translationKey(p.id)));
  return [...own, ...fallback];
}

export function getNextProject<T extends ProjectLike>(current: T, list: T[]): T | undefined {
  if (list.length < 2) return undefined;
  const i = list.findIndex((p) => p.id === current.id);
  return list[(i + 1) % list.length];
}
