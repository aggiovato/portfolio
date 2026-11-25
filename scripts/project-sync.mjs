#!/usr/bin/env node
/**
 * Records a project's release in src/data/releases/<slug>.json (.github/workflows/project-sync.yml).
 * The payload is the `project` object another repository's pipeline sent
 * (.github/workflows/project-release.yml); it is validated again here, never trusted.
 *
 *   node scripts/project-sync.mjs <payload.json>
 *
 * Writes `changed`, `slug` and `version` to $GITHUB_OUTPUT when it is set. Exits 1 only for an
 * invalid payload: a project without a case study, or the same facts again, end without changes.
 * Node runs the TypeScript schema module directly (type stripping, Node ≥ 22.18).
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { planSync } from '../src/lib/content/release.ts';

const RELEASES = 'src/data/releases';

const [file] = process.argv.slice(2);
if (!file) {
  console.error('Usage: node scripts/project-sync.mjs <payload.json>');
  process.exit(2);
}

let payload;
try {
  payload = JSON.parse(readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`::error::The payload is not JSON: ${error.message}`);
  process.exit(1);
}

const slug = typeof payload?.slug === 'string' ? payload.slug : '';
const target = `${RELEASES}/${slug}.json`;
const plan = planSync(payload, {
  hasCaseStudy: (s) => existsSync(`src/content/projects/en/${s}.mdoc`),
  current: slug && existsSync(target) ? readFileSync(target, 'utf8') : undefined,
});

/** @param {Record<string, string>} values */
function output(values) {
  if (!process.env.GITHUB_OUTPUT) return;
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(values)
      .map(([k, v]) => `${k}=${v}\n`)
      .join(''),
  );
}

switch (plan.action) {
  case 'invalid':
    for (const e of plan.errors) console.error(`::error::${e}`);
    process.exit(1);
  case 'skip':
    console.log(`::notice::Nothing recorded: ${plan.reason}. Write the case study first (new-case-study).`);
    output({ changed: 'false', slug: plan.slug, version: '' });
    break;
  case 'unchanged':
    console.log(`${plan.slug} v${plan.version} is already recorded; nothing to do.`);
    output({ changed: 'false', slug: plan.slug, version: plan.version });
    break;
  case 'write':
    mkdirSync(RELEASES, { recursive: true });
    writeFileSync(`${RELEASES}/${plan.slug}.json`, plan.content);
    console.log(`Recorded ${plan.slug} v${plan.version} in ${RELEASES}/${plan.slug}.json`);
    output({ changed: 'true', slug: plan.slug, version: plan.version });
    break;
}
