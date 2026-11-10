#!/usr/bin/env node
/**
 * Creates neutral placeholder images for every local image the site references but that is not on
 * disk. The case study screenshots are gitignored until the final ones exist, so a fresh clone or
 * CI would otherwise fail: `astro:assets` imports and the `image()` fields of the content schema
 * need real files.
 *
 * Never overwrites an existing file, so running it locally with the real images is a no-op.
 * Usage: node scripts/placeholder-assets.mjs
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
// sharp ships with Astro (image service); no extra dependency.
import sharp from 'sharp';

const ROOT = resolve(import.meta.dirname, '..');
const IMAGE = /\.(png|jpe?g|webp|avif)$/i;
const CARD = '#2a2339';
const BORDER = '#443653';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/** Image paths referenced from content frontmatter (`src: ../../…`) and from code imports. */
function referencedImages() {
  const found = new Set();
  for (const file of walk(join(ROOT, 'src'))) {
    if (!/\.(mdoc|md|astro|ts|mjs)$/.test(file)) continue;
    const text = readFileSync(file, 'utf8');
    const patterns = [/^\s*-?\s*src:\s*(\.{1,2}\/\S+)\s*$/gm, /from\s+['"](\.{1,2}\/[^'"]+)['"]/g];
    for (const pattern of patterns) {
      for (const [, ref] of text.matchAll(pattern)) {
        if (IMAGE.test(ref)) found.add(resolve(dirname(file), ref));
      }
    }
  }
  return [...found];
}

function placeholderSvg(path) {
  // The hero planet is a disc; everything else is a 16:10 screenshot-shaped card.
  if (/hero\//.test(path)) {
    return { width: 1100, height: 1100, svg: `<circle cx="550" cy="550" r="546" fill="${CARD}"/>` };
  }
  const grid = Array.from({ length: 24 }, (_, i) => {
    const x = i * 70;
    return `<path d="M${x} 0V1000M0 ${x}H1600" stroke="${BORDER}" stroke-width="2"/>`;
  }).join('');
  return { width: 1600, height: 1000, svg: `<rect width="1600" height="1000" fill="${CARD}"/>${grid}` };
}

let created = 0;
for (const path of referencedImages()) {
  if (existsSync(path)) continue;
  const { width, height, svg } = placeholderSvg(path);
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${svg}</svg>`;
  mkdirSync(dirname(path), { recursive: true });
  await sharp(Buffer.from(doc)).toFile(path);
  console.log(`  placeholder: ${relative(ROOT, path)}`);
  created++;
}
console.log(created ? `Created ${created} placeholder image(s).` : 'All referenced images exist.');
