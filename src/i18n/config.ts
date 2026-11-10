/**
 * Locale contract shared by astro.config.mjs, routing and the UI dictionaries.
 * The default locale has no URL prefix (`/work/`); every other locale does (`/es/work/`).
 * Adding a locale: append it here, add `src/i18n/ui/<locale>.ts` and register it in `ui/index.ts`.
 */
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Language names in their own language, as the switcher shows them. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

/** Open Graph locale codes (`og:locale`). */
export const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
