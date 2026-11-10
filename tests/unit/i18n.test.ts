import { describe, expect, it } from 'vitest';
import {
  alternatesFor,
  interpolate,
  localeParams,
  localizePath,
  resolveLocale,
  stripLocale,
  useTranslations,
} from '../../src/i18n';
import { dictionaries } from '../../src/i18n/ui';

describe('resolveLocale', () => {
  it('keeps a supported locale and falls back to the default otherwise', () => {
    expect(resolveLocale('es')).toBe('es');
    expect(resolveLocale('fr')).toBe('en');
    expect(resolveLocale(undefined)).toBe('en');
  });
});

describe('localizePath', () => {
  it('leaves default-locale paths unprefixed', () => {
    expect(localizePath('/work/', 'en')).toBe('/work/');
    expect(localizePath('/', 'en')).toBe('/');
  });

  it('prefixes other locales and keeps the trailing slash', () => {
    expect(localizePath('/work/yrest/', 'es')).toBe('/es/work/yrest/');
    expect(localizePath('/', 'es')).toBe('/es/');
    expect(localizePath('/about', 'es')).toBe('/es/about/');
  });

  it('switches a path that already carries a locale instead of stacking prefixes', () => {
    expect(localizePath('/es/work/', 'es')).toBe('/es/work/');
    expect(localizePath('/es/work/', 'en')).toBe('/work/');
  });

  it('does not add a slash to files', () => {
    expect(localizePath('/favicon.svg', 'en')).toBe('/favicon.svg');
  });
});

describe('stripLocale', () => {
  it('removes only a non-default locale prefix', () => {
    expect(stripLocale('/es/contact/')).toBe('/contact/');
    expect(stripLocale('/es/')).toBe('/');
    expect(stripLocale('/work/')).toBe('/work/');
    // A first segment that merely looks like a word is not a locale.
    expect(stripLocale('/essays/')).toBe('/essays/');
  });
});

describe('alternatesFor', () => {
  it('lists the same page in every locale', () => {
    expect(alternatesFor('/es/about/')).toEqual({ en: '/about/', es: '/es/about/' });
  });
});

describe('localeParams', () => {
  it('renders the default locale without a path segment', () => {
    expect(localeParams()).toEqual([{ params: { locale: undefined } }, { params: { locale: 'es' } }]);
  });
});

describe('translations', () => {
  it('fills placeholders and leaves unknown ones visible', () => {
    expect(interpolate('Hi {name}, {missing}', { name: 'Ana' })).toBe('Hi Ana, {missing}');
  });

  it('translates through the locale dictionary', () => {
    expect(useTranslations('es')('nav.work')).toBe('Proyectos');
    expect(useTranslations('en')('nav.switchTo', { language: 'Español' })).toBe('Read this page in Español');
  });

  it('has no empty strings and keeps the same placeholders in every locale', () => {
    const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const [locale, dict] of Object.entries(dictionaries)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value.trim(), `${locale}:${key} is empty`).not.toBe('');
        expect(placeholders(value), `${locale}:${key} placeholders`).toEqual(
          placeholders(dictionaries.en[key as keyof typeof dictionaries.en]),
        );
      }
    }
  });
});
