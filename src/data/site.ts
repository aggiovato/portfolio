/**
 * Locale-independent site data (siteSettings, spec §12). Translatable copy (role, tagline,
 * description) lives in `src/i18n/ui/`.
 * It stays in TypeScript for the MVP; it moves to a collection when Keystatic comes in.
 * TODO: confirm the real email, GitHub and LinkedIn before publishing.
 */
import type { Locale, UiKey } from '../i18n';

export const site = {
  brand: 'aggiovato',
  person: 'Alejandro Lugo',
  email: 'aggiovato@gmail.com',
  links: {
    github: 'https://github.com/aggiovato' as string,
    linkedin: 'https://www.linkedin.com/in/aggiovato' as string,
  },
  coreStack: ['Angular', 'React', 'TypeScript', 'Spring Boot', 'Node.js', 'PostgreSQL'],
} as const;

/**
 * Newsletter: one Brevo subscription form per language (list «Notes EN/ES/IT», double opt-in).
 * These are the public `action` URLs of their «HTML simple» embed; Brevo's RSS integrations send
 * each new note of that language's feed to its list. A language without a form shows no form.
 */
export const newsletter: Partial<Record<Locale, string>> = {
  en: 'https://7a409500.sibforms.com/serve/MUIFALXKV1TJm7K-5Q2K0lk_CBOPvzGjoimsT5Rdh7LrFIJXUnRfqQ23hYhudov6IJ5QGIHxj62WgVptKM6yBeNV1XbLdYDjYi_Ew1f7V3dZ9LrArXlxSC-rk1v52Sy0ZjxSBIvsHOStV7bKfSNhkZCnSUx_ExFSzXTf3B6o9cqdGev4OVG2WmtxF_ZJlkpwIll01R3_MvwdAEqZcw==',
  es: 'https://7a409500.sibforms.com/serve/MUIFANFdGqAZRS-L3Y3YGzpQwFkcHRI6zYZ6DcvGz4BwDrT11xoIoDGt07KBsoK9y7h7ijZ3z3--ym30FzYNpnbzVLbsHN74Up3yCBMtDZSA5achjVEN3G_BjyYPRvziHDzKyQx2SW-4VqxFE0j8Sa47d7uJ-e26xiPQWLh3iG_9XUrb6Fgjkv2Xyg1zepZM1W3cI-UbrnMA1VqIIQ==',
  it: 'https://7a409500.sibforms.com/serve/MUIFAN96ZKMT8HQoxwHXGWJrwlbeVMGR0VjtdVBcRC8XrITw9XAaOrUP3fgsNrSXXBd3caC0hc8cyVnO52HOVl4fxME0zYRbe1QAsqJE9nSJguOHkRWzjeBnU0c6ktVNZnAHblN8YrIhNPRQihaTHFZ1IALlx42xE2ogr4d3LpBa_JNKlo-Xuq5sHnyvIbIzXWjd1k415JtHtCZUKg==',
};

/**
 * Main navigation, written for the default locale (`localizePath` adds the prefix). Sections that
 * may be empty name what they need (`requires`) and stay out of the menu until it exists (§7); Lab
 * stays out until it has content.
 */
export const nav = [
  { href: '/work/', label: 'nav.work' },
  { href: '/notes/', label: 'nav.notes', requires: 'notes' },
  { href: '/about/', label: 'nav.about' },
  { href: '/contact/', label: 'nav.contact' },
] as const satisfies readonly { href: string; label: UiKey; requires?: 'notes' }[];

export type NavItem = (typeof nav)[number];
