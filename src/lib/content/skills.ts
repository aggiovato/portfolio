import { getEntry } from 'astro:content';
import { defaultLocale, type Locale } from '../../i18n';
import { assertSkillParity, type SkillTree } from './skill-utils';

/**
 * The About page's skill tree in `locale`, falling back to English when there is no translation.
 * A translation must keep the English shape (same areas, technologies and branch counts).
 */
export async function getSkillTree(locale: Locale): Promise<SkillTree | undefined> {
  const original = (await getEntry('skills', defaultLocale))?.data;
  const translated = locale === defaultLocale ? undefined : (await getEntry('skills', locale))?.data;
  if (original && translated) assertSkillParity(original, translated, locale);
  return translated ?? original;
}
