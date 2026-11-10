import { getCollection, type CollectionEntry } from 'astro:content';
import { localizePath, locales, type Locale } from '../../i18n';
import {
  assertTranslationParity,
  assertUniqueSlugs,
  byFeaturedOrder,
  byRecency,
  entryLocale,
  inLocale,
  isVisibleStatus,
  translationKey,
  withFallback,
} from './project-utils';

export { getNextProject } from './project-utils';

export type Project = CollectionEntry<'projects'>;

/**
 * Single visibility filter (spec §13 «Security and drafts»).
 * Every route, listing and the sitemap go through here; pages never call getCollection('projects').
 * Development shows drafts (flagged as such) so they can be laid out; the production build only
 * contains published projects. `SHOW_DRAFTS=1` is used only by the e2e build (dist-e2e/), never
 * by a deployment.
 */
const SHOW_DRAFTS = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';

async function getVisibleProjects(): Promise<Project[]> {
  const all = await getCollection('projects', (p) => isVisibleStatus(p.data.publicationStatus, SHOW_DRAFTS));
  assertUniqueSlugs(all);
  assertTranslationParity(all);
  return all.sort(byRecency);
}

/** Projects written in `locale`: the case study routes of that locale. */
export async function getProjectsInLocale(locale: Locale): Promise<Project[]> {
  return inLocale(await getVisibleProjects(), locale);
}

/** Listing for `locale`, with untranslated projects falling back to the default locale. */
export async function getPublicProjects(locale: Locale): Promise<Project[]> {
  return withFallback(await getVisibleProjects(), locale);
}

export async function getFeaturedProjects(locale: Locale, limit = 4): Promise<Project[]> {
  const all = await getPublicProjects(locale);
  return all
    .filter((p) => p.data.featured)
    .sort(byFeaturedOrder)
    .slice(0, limit);
}

export function projectLocale(project: Project): Locale {
  return entryLocale(project.id);
}

/** Public URL of a case study, in the locale its content is written in. */
export function projectPath(project: Project): string {
  return localizePath(`/work/${project.data.slug}/`, projectLocale(project));
}

/** URLs of the same case study in every locale where it exists (hreflang and language switcher). */
export async function getProjectAlternates(project: Project): Promise<Partial<Record<Locale, string>>> {
  const key = translationKey(project.id);
  const all = await getVisibleProjects();
  const entries = locales
    .map((locale) => all.find((p) => projectLocale(p) === locale && translationKey(p.id) === key))
    .filter((p): p is Project => Boolean(p))
    .map((p) => [projectLocale(p), projectPath(p)]);
  return Object.fromEntries(entries);
}
