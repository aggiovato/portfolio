import { describe, expect, it } from 'vitest';
import { budgetFor, overruns, pageAssets, staticImports } from '../../src/lib/perf/budget';

describe('performance budget', () => {
  it('reads scripts and styles a page loads, skipping data blocks', () => {
    const html = `<head>
      <script>document.documentElement.classList.add('js');</script>
      <script type="speculationrules">{"prerender":[]}</script>
      <script type="application/ld+json">{"@type":"Person"}</script>
      <link rel="stylesheet" href="/_astro/a.css"><link rel="icon" href="/favicon.svg">
      <style>.x{color:red}</style>
    </head><body><script type="module" src="/_astro/page.js"></script></body>`;
    expect(pageAssets(html)).toEqual({
      scripts: ['/_astro/page.js'],
      inlineScripts: ["document.documentElement.classList.add('js');"],
      stylesheets: ['/_astro/a.css'],
      inlineStyles: ['.x{color:red}'],
    });
  });

  it('follows static imports only, not import()', () => {
    const code = `import{a as b}from"./chunk.A1.js";import"./side.js";export{c}from"./re.js";
      const lazy=()=>import("./planet-gl.js");`;
    expect(staticImports(code).sort()).toEqual(['./chunk.A1.js', './re.js', './side.js']);
  });

  it('picks the most specific budget and reports what goes over', () => {
    const budgets = [
      { match: '/', js: 50, css: 30 },
      { match: '*', js: 60, css: 30 },
      { match: '/work/', js: 80, css: 30 },
    ];
    expect(budgetFor('/', budgets)?.js).toBe(50);
    expect(budgetFor('/work/yrest/', budgets)?.js).toBe(80);
    expect(budgetFor('/notes/', budgets)?.js).toBe(60);
    expect(
      overruns(
        [
          { page: '/', js: 51, css: 10 },
          { page: '/work/yrest/', js: 70, css: 31 },
        ],
        budgets,
      ),
    ).toEqual([
      { page: '/', kind: 'js', bytes: 51, limit: 50 },
      { page: '/work/yrest/', kind: 'css', bytes: 31, limit: 30 },
    ]);
  });
});
