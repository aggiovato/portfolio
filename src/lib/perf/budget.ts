/**
 * Performance budget (spec §16, roadmap C2): what a built page loads up front, so CI can fail when a
 * page grows past its budget. Pure parsing and checks; scripts/perf-budget.mjs reads dist/ and
 * measures. Counted: the page's scripts and every module they import statically, its stylesheets
 * and inline styles. Not counted: modules loaded later with import() (they are not on the first
 * load) and non-script data blocks (JSON-LD, speculation rules).
 */

export interface PageAssets {
  /** Same-origin script URLs (`<script src>`). */
  scripts: string[];
  /** Bodies of inline JavaScript `<script>`s. */
  inlineScripts: string[];
  /** Same-origin stylesheet URLs. */
  stylesheets: string[];
  /** Bodies of inline `<style>`s. */
  inlineStyles: string[];
}

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}=["']?([^"'\\s>]+)`, 'i'))?.[1];

/** Script types that the browser does not run as JavaScript. */
const isDataScript = (type: string | undefined) =>
  type !== undefined && !['module', 'text/javascript', 'application/javascript'].includes(type.toLowerCase());

export function pageAssets(html: string): PageAssets {
  const assets: PageAssets = { scripts: [], inlineScripts: [], stylesheets: [], inlineStyles: [] };
  for (const [, open, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (isDataScript(attr(open, 'type'))) continue;
    const src = attr(open, 'src');
    if (src) assets.scripts.push(src);
    else if (body.trim()) assets.inlineScripts.push(body);
  }
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const href = attr(tag, 'href');
    if (href && attr(tag, 'rel')?.toLowerCase() === 'stylesheet') assets.stylesheets.push(href);
  }
  for (const [, body] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) assets.inlineStyles.push(body);
  return assets;
}

/** Specifiers a module imports statically (`import … from "x"`, `import "x"`, `export … from "x"`). */
export function staticImports(code: string): string[] {
  const found = new Set<string>();
  const patterns = [
    /\bimport\s*(?:[\w$*{}\s,]+?\s*from\s*)?["']([^"']+)["']/g,
    /\bexport\s*(?:\*|\{[^}]*\})\s*from\s*["']([^"']+)["']/g,
  ];
  for (const pattern of patterns) for (const [, specifier] of code.matchAll(pattern)) found.add(specifier);
  return [...found];
}

export interface PageWeight {
  page: string;
  /** Bytes after gzip. */
  js: number;
  css: number;
}

export interface Budget {
  /** Page path prefix, e.g. `/` (every page) or `/work/`; the longest match wins. */
  match: string;
  js: number;
  css: number;
}

export interface Overrun {
  page: string;
  kind: 'js' | 'css';
  bytes: number;
  limit: number;
}

/** The budget for a page: the one whose `match` is the longest prefix, or an exact `match` for `/`. */
export function budgetFor(page: string, budgets: Budget[]): Budget | undefined {
  const exact = budgets.find((b) => b.match === page);
  if (exact) return exact;
  return (
    budgets
      .filter((b) => b.match !== '/' && page.startsWith(b.match))
      .sort((a, b) => b.match.length - a.match.length)[0] ?? budgets.find((b) => b.match === '*')
  );
}

export function overruns(weights: PageWeight[], budgets: Budget[]): Overrun[] {
  const out: Overrun[] = [];
  for (const w of weights) {
    const budget = budgetFor(w.page, budgets);
    if (!budget) continue;
    if (w.js > budget.js) out.push({ page: w.page, kind: 'js', bytes: w.js, limit: budget.js });
    if (w.css > budget.css) out.push({ page: w.page, kind: 'css', bytes: w.css, limit: budget.css });
  }
  return out;
}
