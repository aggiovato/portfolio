/**
 * i18n helpers: pure functions, no Astro virtual modules, so they run in Vitest as they are.
 * Routing contract (must match `i18n` in astro.config.mjs): default locale without prefix,
 * the rest under `/<locale>/`, and `trailingSlash: 'always'`.
 */
import { defaultLocale, isLocale, locales, type Locale } from './config';
import { dictionaries, type UiKey } from './ui';

export { defaultLocale, localeNames, locales, ogLocales, type Locale } from './config';
export type { UiKey } from './ui';

type Vars = Record<string, string | number>;

/** Locale of the current render. `Astro.currentLocale` is undefined outside i18n routes (e.g. Container API). */
export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function interpolate(template: string, vars: Vars = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale];
  return function t(key: UiKey, vars?: Vars): string {
    return interpolate(dict[key], vars);
  };
}

/** Locale-less path (`/es/work/` → `/work/`). Always starts and ends with `/`. */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  const path = isLocale(first) && first !== defaultLocale ? `/${rest.join('/')}` : pathname;
  return ensureSlashes(path);
}

/** Public URL path of `path` (written for the default locale) in `locale`. */
export function localizePath(path: string, locale: Locale): string {
  const clean = stripLocale(path);
  return locale === defaultLocale ? clean : ensureSlashes(`/${locale}${clean}`);
}

/** Static path params for `src/pages/[...locale]/` routes: `undefined` renders the unprefixed default locale. */
export function localeParams(): { params: { locale: string | undefined } }[] {
  return locales.map((locale) => ({ params: { locale: locale === defaultLocale ? undefined : locale } }));
}

/** Same page in every locale. Pages whose content may be missing in a locale pass their own list. */
export function alternatesFor(pathname: string): Partial<Record<Locale, string>> {
  return Object.fromEntries(locales.map((locale) => [locale, localizePath(pathname, locale)]));
}

function ensureSlashes(path: string): string {
  let out = path.startsWith('/') ? path : `/${path}`;
  // Files (sitemap.xml, favicon.svg) and fragments keep their shape.
  if (!out.endsWith('/') && !/\.[a-z0-9]+$/i.test(out) && !out.includes('#')) out += '/';
  return out.replace(/\/{2,}/g, '/');
}
