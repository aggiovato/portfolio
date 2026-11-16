#!/usr/bin/env node
/**
 * Note covers drawn like the notes' diagrams: the notebook background with one marble diagram
 * (src/lib/diagrams/), in the site's fonts. `node scripts/note-covers.mjs` writes
 * src/assets/notes/<note>/cover.webp for each entry of COVERS. 1600 × 840 (≈ the 1.91:1 share
 * card, so the og:image is not letterboxed). The chosen diagrams carry no prose labels: one cover
 * serves every language. Node 24 imports the TypeScript modules directly (type stripping).
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { renderDiagram } from '../src/lib/diagrams/marble.ts';
import { DIAGRAMS } from '../src/lib/diagrams/specs.ts';

const COVERS = [
  { note: 'rxjs-fundamentals', diagram: 'rxjs-fundamentals/map' },
  { note: 'rxjs-mapping-operators', diagram: 'rxjs-mapping-operators/cover' },
  { note: 'rxjs-combining-streams', diagram: 'rxjs-combining-streams/cover' },
];
const W = 1600;
const H = 840;

const root = new URL('../', import.meta.url);
const file = (path) => new URL(path, root).href;

const page = (svg) => `<!doctype html>
<html><head><style>
  @font-face { font-family: 'Manrope Variable'; src: url('${file('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}'); font-weight: 200 800; }
  @font-face { font-family: 'JetBrains Mono Variable'; src: url('${file('node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}'); font-weight: 100 800; }
  :root { --font-sans: 'Manrope Variable'; --font-mono: 'JetBrains Mono Variable'; }
  * { margin: 0; }
  body { width: ${W}px; height: ${H}px; overflow: hidden; display: grid; place-items: center;
    background: #15161e url('${file('src/assets/notes/backgrounds/orbital-log.webp')}') center / cover; }
  svg { width: ${W - 240}px; height: auto; }
</style></head><body>${svg}</body></html>`;

// Same browser choice as playwright.config.ts: the installed Chrome locally, PW_CHANNEL in CI.
const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'chrome' });
const tab = await browser.newPage({ viewport: { width: W, height: H } });
const html = join(mkdtempSync(join(tmpdir(), 'cover-')), 'cover.html');
for (const { note, diagram } of COVERS) {
  writeFileSync(html, page(renderDiagram(DIAGRAMS[diagram], 'en').svg));
  await tab.goto(`file://${html}`);
  await tab.evaluate(() => document.fonts.ready);
  const png = await tab.screenshot({ type: 'png' });
  await sharp(png)
    .webp({ quality: 86 })
    .toFile(new URL(`src/assets/notes/${note}/cover.webp`, root).pathname);
  console.log(`  ✓ src/assets/notes/${note}/cover.webp`);
}
await browser.close();
