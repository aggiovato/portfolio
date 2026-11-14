import { describe, expect, it } from 'vitest';
import { buildFeed, readingMinutes } from '../../src/lib/content/note-utils';

describe('readingMinutes', () => {
  it('rounds up at 200 words a minute, with a minimum of one', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('word '.repeat(200))).toBe(1);
    expect(readingMinutes('word '.repeat(201))).toBe(2);
  });

  it('does not count Markdoc tag syntax', () => {
    const tag = '{% callout type="note" title="A long title with many words in it" %}';
    expect(readingMinutes(`${tag}\n${'word '.repeat(200)}\n{% /callout %}`)).toBe(1);
  });
});

describe('buildFeed', () => {
  const feed = {
    title: 'Notes — aggiovato',
    description: 'Short notes',
    link: 'https://example.com/notes/',
    self: 'https://example.com/notes/rss.xml',
    language: 'en',
    items: [
      {
        title: 'switchMap & friends <four operators>',
        summary: 'One "new" event',
        url: 'https://example.com/notes/rxjs/',
        publishedAt: new Date('2026-11-14T00:00:00Z'),
      },
    ],
  };

  it('escapes text and dates items in RFC 822', () => {
    const xml = buildFeed(feed);
    expect(xml).toContain('<title>switchMap &amp; friends &lt;four operators&gt;</title>');
    expect(xml).toContain('<description>One &quot;new&quot; event</description>');
    expect(xml).toContain('<pubDate>Sat, 14 Nov 2026 00:00:00 GMT</pubDate>');
    expect(xml).toContain('<guid isPermaLink="true">https://example.com/notes/rxjs/</guid>');
  });

  it('marks the language of an untranslated item only', () => {
    expect(buildFeed(feed)).not.toContain('dc:language>');
    const es = { ...feed, language: 'es', items: [{ ...feed.items[0], language: 'en' }] };
    expect(buildFeed(es)).toContain('<dc:language>en</dc:language>');
  });
});
