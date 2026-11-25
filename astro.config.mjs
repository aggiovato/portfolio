// @ts-check
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { defaultLocale, locales } from './src/i18n/config.ts';

// Keystatic (§13) is a local editor: mounted only in `astro dev`, so production stays static,
// ships no React and needs no adapter for its on-demand /keystatic and /api/keystatic routes.
const isDev = process.argv.includes('dev');

/**
 * Keystatic's UI calls /api/keystatic/tree (and navigates /keystatic/…) without a trailing slash,
 * which `trailingSlash: 'always'` answers with 404. Append the slash for those routes only, so the
 * rest of the site keeps the strict rule in dev too.
 * Astro unshifts its trailing-slash check to the front of the stack in its post hook, so this one
 * runs as a post plugin (after Astro's) and unshifts itself in front of it.
 * @type {import('vite').Plugin}
 */
const keystaticTrailingSlash = {
  name: 'keystatic-trailing-slash',
  enforce: 'post',
  configureServer(server) {
    /** @type {import('vite').Connect.NextHandleFunction} */
    const addSlash = (req, _res, next) => {
      const [pathname = '', query] = (req.url ?? '').split('?');
      if (/^\/(api\/)?keystatic(\/|$)/.test(pathname) && !pathname.endsWith('/')) {
        req.url = `${pathname}/${query ? `?${query}` : ''}`;
      }
      next();
    };
    return () => {
      server.middlewares.stack.unshift({ route: '', handle: addSlash });
    };
  },
};

// Production URL: canonical links, hreflang, sitemap, share images and the notes feeds are built
// from it. Change it here (and in Cloudflare) when a custom domain is added.
const SITE_URL = 'https://portfolio.aggiovato.workers.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  // Content Security Policy (spec §16, roadmap C1): Astro hashes the scripts and <style>s it emits
  // into a <meta> per page; these directives close everything else. A <meta> CSP cannot set
  // frame-ancestors: X-Frame-Options in public/_headers covers framing.
  // Stylesheets as files, never inlined: Astro does not hash the inline <style> of components that
  // Markdoc renders (callout, decision, figure…), which the CSP would then block. 'self' covers files.
  build: { inlineStylesheets: 'never' },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        // Vite inlines the two smallest font subsets as data: URIs.
        "font-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        // The newsletter form posts straight to Brevo (src/data/site.ts).
        "form-action 'self' https://*.sibforms.com",
      ],
      styleDirective: {
        // 'self' for the bundled stylesheets; then style *attributes* only: Shiki colours code with
        // them and the inline diagram SVGs set their fonts with them. <style> elements stay hashed.
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  i18n: {
    locales: [...locales],
    defaultLocale,
    // Default locale without prefix: the existing English URLs (/work/…) stay stable.
    routing: { prefixDefaultLocale: false },
  },
  vite: isDev
    ? {
        plugins: [keystaticTrailingSlash],
        // Keystatic's page is injected, so Vite's dep scan misses React's CJS entry points and serves
        // react-dom/client unbundled (no `createRoot` export). Pre-bundle them explicitly.
        optimizeDeps: {
          include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
        },
      }
    : {},
  integrations: [
    markdoc(),
    ...(isDev ? [react(), keystatic()] : []),
    // Only generated pages end up in the sitemap, so drafts are never listed in production.
    sitemap({
      // The newsletter's confirmation steps are noindex: keep them out of the sitemap too.
      filter: (page) => !page.includes('/newsletter/'),
      i18n: {
        defaultLocale,
        // Same hreflang codes as the <link rel="alternate"> tags in BaseLayout.
        locales: Object.fromEntries(locales.map((l) => [l, l])),
      },
    }),
  ],
});
