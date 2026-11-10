// @ts-check
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import { defaultLocale, locales } from './src/i18n/config.ts';

// TODO: replace with the final domain before deploying.
const SITE_URL = 'https://aggiovato.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  i18n: {
    locales: [...locales],
    defaultLocale,
    // Default locale without prefix: the existing English URLs (/work/…) stay stable.
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    markdoc(),
    // Only generated pages end up in the sitemap, so drafts are never listed in production.
    sitemap({
      i18n: {
        defaultLocale,
        // Same hreflang codes as the <link rel="alternate"> tags in BaseLayout.
        locales: Object.fromEntries(locales.map((l) => [l, l])),
      },
    }),
  ],
});
