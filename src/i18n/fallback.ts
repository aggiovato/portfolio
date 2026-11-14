/**
 * Case studies and notes are written in some locales only; other locales have no page for them (i18n rule:
 * no copies to fill the gap). When a visitor lands on such an address anyway (a shared or typed
 * link), the 404 page uses this to offer the default-locale original instead of a dead end.
 * Kept apart from `index.ts` so the client script does not bundle the dictionaries.
 */
import { defaultLocale, locales, type Locale } from './config';

export interface CaseStudyFallback {
  locale: Locale;
  /** Address of the default-locale original. */
  href: string;
}

/** `/it/work/yrest/` → `{ locale: 'it', href: '/work/yrest/' }` (also notes); anything else → null. */
export function caseStudyFallback(pathname: string): CaseStudyFallback | null {
  const match = /^\/([a-z]{2})\/(work|notes)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(pathname);
  if (!match) return null;
  const [, prefix, section, slug] = match;
  const locale = locales.find((l) => l === prefix && l !== defaultLocale);
  return locale ? { locale, href: `/${section}/${slug}/` } : null;
}
