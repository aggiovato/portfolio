import type { APIRoute, GetStaticPaths } from 'astro';
import { getPublicNotes, hasNotes, notePath, noteLocale } from '../../../lib/content/notes';
import { buildFeed } from '../../../lib/content/note-utils';
import { site } from '../../../data/site';
import { localeParams, localizePath, resolveLocale, useTranslations } from '../../../i18n';

// One feed per locale (its notes plus untranslated originals), only once notes exist (§7).
export const getStaticPaths = (async () =>
  (await hasNotes()) ? localeParams() : []) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ currentLocale, site: siteUrl }) => {
  const locale = resolveLocale(currentLocale);
  const t = useTranslations(locale);
  const absolute = (path: string) => new URL(path, siteUrl).href;
  const notes = await getPublicNotes(locale);
  const xml = buildFeed({
    title: `${t('notes.title')} — ${site.brand}`,
    description: t('notes.description'),
    link: absolute(localizePath('/notes/', locale)),
    self: absolute(localizePath('/notes/rss.xml', locale)),
    language: locale,
    // Drafts (dev and e2e builds only) may have no date yet: the feed lists dated notes.
    items: notes.flatMap((n) => {
      const publishedAt = n.data.publishedAt;
      const language = noteLocale(n);
      if (!publishedAt) return [];
      return [
        {
          title: n.data.title,
          summary: n.data.summary,
          url: absolute(notePath(n)),
          publishedAt,
          language: language === locale ? undefined : language,
        },
      ];
    }),
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
