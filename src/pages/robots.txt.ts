import type { APIRoute } from 'astro';

/**
 * robots.txt: everything public may be crawled; the sitemap lists every generated page (drafts are
 * never generated in production). Lives outside [...locale] because it is one file per site.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
