#!/usr/bin/env node
/**
 * Renders the default share image (Open Graph, 1200×630) for each locale into
 * src/assets/og/default-<locale>.png, with the site's own fonts and Jupiter, through Playwright's
 * Chrome. Pages without a cover of their own (home, about, contact, indexes) use it.
 *
 * Run it again after changing the copy below, the brand or the planet:
 *   node scripts/og-default.mjs
 * The copy mirrors `site.role`, `site.focus` and `hero.title*` in src/i18n/ui (kept here because
 * this script runs outside Astro and cannot import the TypeScript dictionaries).
 */
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const root = new URL('../', import.meta.url);
const file = (path) => new URL(path, root).href;
const copy = {
  en: {
    role: 'Full-stack developer · ideas into products that scale',
    line1: 'Grounded in code.',
    line2: 'Built to',
    accent: 'explore.',
  },
  es: {
    role: 'Desarrollador full-stack · ideas a productos que escalan',
    line1: 'Anclado en el código.',
    line2: 'Hecho para',
    accent: 'explorar.',
  },
  it: {
    role: 'Sviluppatore full-stack · idee in prodotti che crescono',
    line1: 'Radicato nel codice.',
    line2: 'Fatto per',
    accent: 'esplorare.',
  },
};
const logo = readFileSync(new URL('public/favicon.svg', root), 'utf8').replace(/<!--[\s\S]*?-->/, '');

const page = (c) => `<!doctype html>
<html><head><style>
  @font-face { font-family: Manrope; src: url('${file('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}'); font-weight: 200 800; }
  @font-face { font-family: Mono; src: url('${file('node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}'); font-weight: 100 800; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: Manrope;
    background: radial-gradient(120% 90% at 85% 50%, #211b2e 0%, #15161e 62%); color: #f5f1fa; }
  .planet { position: absolute; right: -170px; top: 50%; width: 620px; height: 620px; transform: translateY(-50%);
    border-radius: 50%; box-shadow: 0 0 120px -10px rgb(121 80 232 / 0.55); }
  .planet img { width: 100%; height: 100%; border-radius: 50%; filter: saturate(0.9); }
  .text { position: absolute; left: 80px; top: 78px; bottom: 78px; width: 660px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 700; }
  .brand svg { width: 64px; height: 52px; }
  h1 { margin-top: auto; font-size: 66px; font-weight: 750; line-height: 1.06; letter-spacing: -0.025em; }
  h1 em { font-style: normal; color: #c6a5ff; }
  .role { margin-top: 8px; font-family: Mono; font-size: 20px; color: #bcb5ca; white-space: nowrap; }
  .who { margin-top: 34px; font-size: 28px; font-weight: 650; color: #f5f1fa; }
</style></head><body>
  <div class="planet"><img src="${file('src/assets/hero/jupiter.png')}" alt=""></div>
  <div class="text">
    <div class="brand">${logo}<span>aggiovato</span></div>
    <h1>${c.line1}<br>${c.line2} <em>${c.accent}</em></h1>
    <p class="who">Heber Alejandro Lugo</p>
    <p class="role">${c.role}</p>
  </div>
</body></html>`;

mkdirSync(new URL('src/assets/og/', root), { recursive: true });
// Same browser choice as playwright.config.ts: the installed Chrome locally, PW_CHANNEL in CI.
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
// Loaded from a file (not setContent) so the page may read the local fonts and the planet.
const html = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.html');
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [locale, c] of Object.entries(copy)) {
  writeFileSync(html, page(c));
  await tab.goto(`file://${html}`, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  const out = new URL(`src/assets/og/default-${locale}.png`, root);
  await tab.screenshot({ path: out.pathname });
  console.log(`  ✓ ${out.pathname.replace(root.pathname, '')}`);
}
await browser.close();
