/**
 * Pure note logic (no `astro:content` import, so Vitest covers it directly).
 */

/** Words per minute for technical reading: slower than prose, code and diagrams are read twice. */
const WORDS_PER_MINUTE = 200;

/** Whole minutes to read a Markdoc body, at least one. Tag syntax ({% … %}) is not counted. */
export function readingMinutes(body: string): number {
  const words = body.replace(/\{%[\s\S]*?%\}/g, ' ').match(/[\p{L}\p{N}][\p{L}\p{N}'’_-]*/gu) ?? [];
  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}

export interface FeedItem {
  title: string;
  summary: string;
  /** Absolute URL. */
  url: string;
  publishedAt: Date;
  /** BCP 47 language of the item, set when it differs from the feed's (an untranslated note). */
  language?: string;
}

export interface Feed {
  title: string;
  description: string;
  /** Absolute URL of the notes index. */
  link: string;
  /** Absolute URL of the feed itself (atom:link rel="self"). */
  self: string;
  language: string;
  items: FeedItem[];
}

function escapeXml(text: string): string {
  return text.replace(
    /[<>&'"]/g,
    (c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`,
  );
}

/** RSS 2.0 document. Hand-written: a dozen lines do not justify a dependency (coding guidelines §2). */
export function buildFeed(feed: Feed): string {
  const items = feed.items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.summary)}</description>
      <pubDate>${item.publishedAt.toUTCString()}</pubDate>${item.language ? `\n      <dc:language>${item.language}</dc:language>` : ''}
    </item>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${escapeXml(feed.link)}</link>
    <description>${escapeXml(feed.description)}</description>
    <language>${feed.language}</language>
    <atom:link href="${escapeXml(feed.self)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}
