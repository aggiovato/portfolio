import { describe, expect, it } from 'vitest';
import { confirmEmail, copy, notesEmail } from '../../scripts/emails.mjs';

const locales = Object.keys(copy) as (keyof typeof copy)[];

describe('newsletter emails', () => {
  it.each(locales)('the %s notes email loops over the feed and can always be unsubscribed', (locale) => {
    const html = notesEmail(locale);
    expect(html).toContain(`<html lang="${locale}">`);
    expect(html).toContain('{% for item in params.items %}');
    expect(html).toContain('{% endfor %}');
    for (const field of ['TITLE', 'LINK', 'DESCRIPTION', 'ENCLOSURE'])
      expect(html).toContain(`item.${field}`);
    expect(html).toContain('{{ unsubscribe }}');
    expect(html).toContain(copy[locale].read);
  });

  it.each(locales)('the %s confirmation email links to the double opt-in', (locale) => {
    const html = confirmEmail(locale);
    expect(html).toContain('href="{{ doubleoptin }}"');
    expect(html).toContain(copy[locale].confirmTitle);
  });
});
