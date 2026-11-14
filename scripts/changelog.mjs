#!/usr/bin/env node
/**
 * CHANGELOG.md helpers for the release flow (Keep a Changelog, same convention as yRest).
 *
 *   node scripts/changelog.mjs release [version]   moves «## [Unreleased]» under «## [<version>] — <date>»;
 *                                                  defaults to package.json's version (npm's `version`
 *                                                  hook, which runs after the bump; see `task release:*`)
 *   node scripts/changelog.mjs notes <version>     prints that version's section (CI: release notes)
 *   node scripts/changelog.mjs check <version>     exits 1 if the section is missing or empty (CI gate)
 *
 * Entries are written by hand under «## [Unreleased]»; the release only renames and dates them.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const UNRELEASED = '## [Unreleased]';

/** Body of a `## [<name>]` section, without its heading and trailing `---` separator. */
export function sectionBody(text, name) {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## [${name}]`));
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## [') || l.trim() === '---');
  return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
}

/**
 * Turns the Unreleased section into `## [<version>] — <date>` and leaves a fresh empty
 * Unreleased section above it. Throws when there is nothing to release.
 */
export function releaseChangelog(text, version, date) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error(`Not a semver version: ${version}`);
  if (sectionBody(text, version) !== null) throw new Error(`CHANGELOG already has a section for ${version}`);
  const body = sectionBody(text, 'Unreleased');
  if (!body) throw new Error('Nothing to release: write the changes under «## [Unreleased]» first');
  return text.replace(UNRELEASED, `${UNRELEASED}\n\n---\n\n## [${version}] — ${date}`);
}

function main([command, version]) {
  const path = new URL('../CHANGELOG.md', import.meta.url);
  const text = readFileSync(path, 'utf8');
  if (command === 'release') {
    version ??= JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version;
    const date = new Date().toISOString().slice(0, 10);
    writeFileSync(path, releaseChangelog(text, version, date));
    return;
  }
  const body = sectionBody(text, version);
  if (command === 'notes') {
    process.stdout.write(`${body ?? ''}\n`);
    return;
  }
  if (command === 'check') {
    if (!body) {
      console.error(`CHANGELOG.md has no entries for ${version}.`);
      process.exit(1);
    }
    return;
  }
  console.error('Usage: changelog.mjs <release|notes|check> <version>');
  process.exit(2);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
