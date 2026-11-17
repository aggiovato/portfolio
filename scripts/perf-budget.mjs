#!/usr/bin/env node
/**
 * Performance budget (spec §16, roadmap C2): measures what every page in dist/ loads up front
 * (JavaScript with its static imports, and CSS), gzipped, and fails when a page goes over its
 * budget. Run after `npm run build`; CI runs it in the build job and writes the table to the job
 * summary. The parsing and the checks live in src/lib/perf/budget.ts (Node 24 strips the types).
 *
 *   node scripts/perf-budget.mjs           check against BUDGETS
 *   node scripts/perf-budget.mjs --report  only print the table
 */
import { appendFileSync, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
import { overruns, pageAssets, staticImports } from '../src/lib/perf/budget.ts';

/**
 * Bytes after gzip. The home follows astro.md («own JS on the home ≲ 50 KB compressed»). Other
 * pages load ~2–6 KB of JS today: 30 KB leaves room for a small island (an interactive diagram)
 * but not for a framework or a dependency slipping in unnoticed. CSS is ~11–17 KB everywhere.
 * Raise a budget on purpose, in the same change that needs it.
 */
const KB = 1024;
const BUDGETS = [
  { match: '/', js: 50 * KB, css: 25 * KB },
  { match: '*', js: 30 * KB, css: 25 * KB },
];

const DIST = resolve(new URL('../dist/', import.meta.url).pathname);
const reportOnly = process.argv.includes('--report');

if (!existsSync(DIST)) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

const gzipped = new Map();
const gz = (text) => gzipSync(text, { level: 9 }).length;
const fileGz = (path) => {
  if (!gzipped.has(path)) gzipped.set(path, gz(readFileSync(path)));
  return gzipped.get(path);
};

/** A same-origin URL or import specifier as a file in dist/ (null for external ones). */
const toFile = (specifier, fromDir) => {
  if (/^(https?:)?\/\//.test(specifier) || specifier.startsWith('data:')) return null;
  const clean = specifier.split(/[?#]/)[0];
  const file = clean.startsWith('/') ? join(DIST, clean) : resolve(fromDir, clean);
  return existsSync(file) ? file : null;
};

/** Every module a set of entry modules pulls in statically, each counted once. */
const moduleClosure = (entries) => {
  const seen = new Set();
  const visit = (file) => {
    if (!file || seen.has(file)) return;
    seen.add(file);
    for (const spec of staticImports(readFileSync(file, 'utf8'))) visit(toFile(spec, dirname(file)));
  };
  entries.forEach(visit);
  return seen;
};

const pages = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pages(path);
    return name.endsWith('.html') ? [path] : [];
  });

const weights = pages(DIST)
  .map((file) => {
    const html = readFileSync(file, 'utf8');
    const assets = pageAssets(html);
    const pageDir = dirname(file);
    // Inline modules can import chunks too.
    const inlineImports = assets.inlineScripts.flatMap((code) => staticImports(code));
    const modules = moduleClosure([...assets.scripts, ...inlineImports].map((s) => toFile(s, pageDir)));
    const js =
      [...modules].reduce((sum, f) => sum + fileGz(f), 0) +
      assets.inlineScripts.reduce((sum, code) => sum + gz(code), 0);
    const css =
      assets.stylesheets.map((s) => toFile(s, pageDir)).reduce((sum, f) => sum + (f ? fileGz(f) : 0), 0) +
      assets.inlineStyles.reduce((sum, code) => sum + gz(code), 0);
    const rel = relative(DIST, file)
      .replace(/(^|\/)index\.html$/, '$1')
      .replace(/\.html$/, '/');
    return { page: `/${rel}`, js, css };
  })
  .sort((a, b) => b.js - a.js || a.page.localeCompare(b.page));

// One row per distinct weight: locales and sibling pages usually load the same assets.
const kb = (bytes) => `${(bytes / KB).toFixed(1)} KB`;
const groups = new Map();
for (const w of weights) {
  const key = `${w.js}|${w.css}`;
  groups.set(key, [...(groups.get(key) ?? []), w.page]);
}
const rows = [...groups.entries()].map(([key, list]) => {
  const [js, css] = key.split('|').map(Number);
  const sample = list.slice(0, 3).join(', ') + (list.length > 3 ? ` … (+${list.length - 3})` : '');
  return { js, css, sample };
});

console.log(`\n  JS (gz)    CSS (gz)   pages`);
for (const r of rows) console.log(`  ${kb(r.js).padStart(8)}  ${kb(r.css).padStart(9)}   ${r.sample}`);

const failures = reportOnly ? [] : overruns(weights, BUDGETS);
const summary = [
  '### Performance budget',
  '',
  `Home: JS ≤ ${kb(BUDGETS[0].js)}, CSS ≤ ${kb(BUDGETS[0].css)} · other pages: JS ≤ ${kb(BUDGETS[1].js)}, CSS ≤ ${kb(BUDGETS[1].css)} (gzip).`,
  '',
  '| JS (gz) | CSS (gz) | Pages |',
  '| ---: | ---: | --- |',
  ...rows.map((r) => `| ${kb(r.js)} | ${kb(r.css)} | ${r.sample} |`),
  '',
  failures.length
    ? `**Over budget:** ${failures.map((f) => `${f.page} ${f.kind} ${kb(f.bytes)} > ${kb(f.limit)}`).join('; ')}`
    : '✓ Every page within budget.',
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);

if (failures.length) {
  console.error(`\n  ✗ Over budget:`);
  for (const f of failures) console.error(`    ${f.page}  ${f.kind}  ${kb(f.bytes)} > ${kb(f.limit)}`);
  process.exit(1);
}
console.log(reportOnly ? '' : `\n  ✓ ${weights.length} pages within budget.`);
