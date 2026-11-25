import { describe, expect, it } from 'vitest';
import { confirmEmail, copy, notesEmail } from '../../scripts/emails.mjs';

const locales = Object.keys(copy) as (keyof typeof copy)[];

describe('newsletter emails', () => {
  it.each(locales)('the %s notes email loops over the feed and can always be unsubscribed', (locale) => {
    const html = notesEmail(locale);
    expect(html).toContain(`<html lang="${locale}"`);
    expect(html).toContain('{% for item in params.items %}');
    expect(html).toContain('{% endfor %}');
    for (const field of ['TITLE', 'LINK', 'DESCRIPTION', 'ENCLOSURE'])
      expect(html).toContain(`item.${field}`);
    expect(html).toContain('{{ unsubscribe }}');
    expect(html).toContain(copy[locale].read);
  });

  it.each(locales)('the %s notes email features the first note and lists the rest below', (locale) => {
    const html = notesEmail(locale);
    expect(html).toContain('{% if forloop.First %}');
    expect(html).toContain('{% if forloop.Counter == 2 %}');
    expect(html).toContain(copy[locale].also);
    // Brevo's tags stay inside table cells, never between rows.
    expect(html).not.toMatch(/<\/tr>\s*\{%/);
  });

  it.each(locales)('the %s emails use fixed image URLs that survive rebuilds', (locale) => {
    for (const html of [notesEmail(locale), confirmEmail(locale)]) {
      expect(html).toContain('https://portfolio.aggiovato.workers.dev/email/jupiter.png');
      expect(html).toContain('https://portfolio.aggiovato.workers.dev/email/lockup.png');
      expect(html).not.toContain('/_astro/');
      expect(html).toContain('https://www.linkedin.com/in/heberlugo');
    }
  });

  it.each(locales)('the %s confirmation email links to the double opt-in', (locale) => {
    const html = confirmEmail(locale);
    expect(html).toContain('href="{{ doubleoptin }}"');
    expect(html).toContain(copy[locale].confirmTitle);
  });
});
