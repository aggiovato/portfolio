/**
 * Locale-independent site data (siteSettings, spec §12). Translatable copy (role, tagline,
 * description) lives in `src/i18n/ui/`.
 * It stays in TypeScript for the MVP; it moves to a collection when Keystatic comes in.
 * TODO: confirm the real email, GitHub and LinkedIn before publishing.
 */
import type { UiKey } from '../i18n';

export const site = {
  brand: 'aggiovato',
  person: 'Alejandro Lugo',
  email: 'aggiovato@gmail.com',
  links: {
    github: 'https://github.com/aggiovato' as string,
    linkedin: 'https://www.linkedin.com/in/aggiovato' as string,
  },
  coreStack: ['Angular', 'React', 'TypeScript', 'Spring Boot', 'PostgreSQL'],
} as const;

/** Main navigation, written for the default locale (`localizePath` adds the prefix). Lab stays hidden until it has content (§7). */
export const nav = [
  { href: '/work/', label: 'nav.work' },
  { href: '/about/', label: 'nav.about' },
  { href: '/contact/', label: 'nav.contact' },
] as const satisfies readonly { href: string; label: UiKey }[];
