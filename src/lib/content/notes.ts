import { getCollection, type CollectionEntry } from 'astro:content';
import { localizePath, locales, type Locale } from '../../i18n';
import {
  assertTranslationParity,
  assertUniqueSlugs,
  byRecency,
  entryLocale,
  inLocale,
  isVisibleStatus,
  translationKey,
  withFallback,
} from './project-utils';

export type Note = CollectionEntry<'notes'>;

/**
 * Single visibility filter for notes, as `projects.ts` is for case studies (spec §13). Pages never
 * call getCollection('notes'). Drafts are visible in dev and in the e2e build (`SHOW_DRAFTS=1`).
 */
const SHOW_DRAFTS = import.meta.env.DEV || process.env.SHOW_DRAFTS === '1';

async function getVisibleNotes(): Promise<Note[]> {
  const all = await getCollection('notes', (n) => isVisibleStatus(n.data.publicationStatus, SHOW_DRAFTS));
  assertUniqueSlugs(all);
  assertTranslationParity(all);
  return all.sort(byRecency);
}

/** Notes written in `locale`: the article routes of that locale. */
export async function getNotesInLocale(locale: Locale): Promise<Note[]> {
  return inLocale(await getVisibleNotes(), locale);
}

/** Index for `locale`, with untranslated notes falling back to the English original. */
export async function getPublicNotes(locale: Locale): Promise<Note[]> {
  return withFallback(await getVisibleNotes(), locale);
}

/** Whether the section exists at all: §7, no empty sections in the menu. */
export async function hasNotes(): Promise<boolean> {
  return (await getVisibleNotes()).length > 0;
}

export function noteLocale(note: Note): Locale {
  return entryLocale(note.id);
}

/** Public URL of a note, in the locale its content is written in. */
export function notePath(note: Note): string {
  return localizePath(`/notes/${note.data.slug}/`, noteLocale(note));
}

/** URLs of the same note in every locale where it exists (hreflang and language switcher). */
export async function getNoteAlternates(note: Note): Promise<Partial<Record<Locale, string>>> {
  const key = translationKey(note.id);
  const all = await getVisibleNotes();
  const entries = locales
    .map((locale) => all.find((n) => noteLocale(n) === locale && translationKey(n.id) === key))
    .filter((n): n is Note => Boolean(n))
    .map((n) => [noteLocale(n), notePath(n)]);
  return Object.fromEntries(entries);
}
