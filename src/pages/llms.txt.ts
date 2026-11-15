import type { APIRoute } from 'astro';
import { getProjectsInLocale, projectPath } from '../lib/content/projects';
import { getNotesInLocale, hasNotes, notePath } from '../lib/content/notes';
import { buildLlms } from '../lib/llms';
import { site } from '../data/site';
import { defaultLocale, localeNames, locales, localizePath, useTranslations } from '../i18n';

/**
 * /llms.txt (llmstxt.org): the site summarised in Markdown for AI assistants, in English, built
 * from the published case studies and notes (src/lib/llms.ts). One file per site, like robots.txt.
 * Markdown inside, served as text/plain: a static file's type comes from its extension.
 */
export const GET: APIRoute = async ({ site: siteUrl }) => {
  const t = useTranslations(defaultLocale);
  const absolute = (path: string) => new URL(path, siteUrl).href;
  const languageName = new Intl.DisplayNames(['en'], { type: 'language' });
  const projects = await getProjectsInLocale(defaultLocale);
  const notes = (await hasNotes()) ? await getNotesInLocale(defaultLocale) : [];

  const body = buildLlms({
    title: `${site.person} — ${site.brand}`,
    description: t('site.description'),
    about: [t('about.lead', { person: site.person }), t('about.approach'), t('about.background')],
    coreStack: site.coreStack,
    projects: projects.map((p) => ({
      title: p.data.title,
      url: absolute(projectPath(p)),
      summary: p.data.summary,
    })),
    notes: notes.map((n) => ({ title: n.data.title, url: absolute(notePath(n)), summary: n.data.summary })),
    contact: [
      { title: 'About', url: absolute('/about/'), summary: 'background, way of working and stack' },
      { title: 'Contact', url: absolute('/contact/') },
      { title: 'Email', url: `mailto:${site.email}` },
      { title: 'GitHub', url: site.links.github },
      { title: 'LinkedIn', url: site.links.linkedin },
    ],
    optional: [
      ...locales
        .filter((l) => l !== defaultLocale)
        .map((l) => ({
          title: localeNames[l],
          url: absolute(localizePath('/', l)),
          summary: `the whole site in ${languageName.of(l)}`,
        })),
      ...(notes.length ? [{ title: 'Notes feed (RSS)', url: absolute('/notes/rss.xml') }] : []),
      { title: 'Sitemap', url: absolute('/sitemap-index.xml') },
    ],
  });

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
