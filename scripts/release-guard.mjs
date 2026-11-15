#!/usr/bin/env node
/**
 * Release guard, run by npm's `preversion` hook before `task release:*` bumps and tags.
 * A release is cut from `main` only, and never from a `main` that is behind `origin/main`:
 * the version commit and its tag must land on the branch that is deployed (v1.4.0 was tagged on a
 * pull request branch and its version commit never reached main).
 *
 *   node scripts/release-guard.mjs     exits 1 with the reasons when the release must not happen
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const RELEASE_BRANCH = 'main';

/** Why a release must not happen from this state; empty when it may. */
export function releaseProblems({ branch, behind }) {
  const problems = [];
  if (branch !== RELEASE_BRANCH) {
    problems.push(
      `You are on «${branch}». Release from ${RELEASE_BRANCH}: git checkout ${RELEASE_BRANCH} && git pull`,
    );
  }
  if (behind > 0) {
    problems.push(`${RELEASE_BRANCH} is ${behind} commit(s) behind origin/${RELEASE_BRANCH}. Run: git pull`);
  }
  return problems;
}

function main() {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  const branch = git('branch', '--show-current') || '(detached HEAD)';
  let behind = 0;
  if (branch === RELEASE_BRANCH) {
    git('fetch', '--quiet', 'origin', RELEASE_BRANCH);
    behind = Number(git('rev-list', '--count', `HEAD..origin/${RELEASE_BRANCH}`));
  }
  const problems = releaseProblems({ branch, behind });
  if (problems.length > 0) {
    console.error(`Release stopped:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
