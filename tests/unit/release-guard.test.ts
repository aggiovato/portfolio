import { describe, expect, it } from 'vitest';
import { releaseProblems } from '../../scripts/release-guard.mjs';

describe('release guard', () => {
  it('allows a release from an up-to-date main', () => {
    expect(releaseProblems({ branch: 'main', behind: 0 })).toEqual([]);
  });

  it('stops a release from another branch, as happened with v1.4.0', () => {
    const [problem] = releaseProblems({ branch: 'fix/content-accuracy', behind: 0 });
    expect(problem).toMatch(/fix\/content-accuracy/);
    expect(problem).toMatch(/git checkout main/);
  });

  it('stops a release from a main that is behind origin', () => {
    expect(releaseProblems({ branch: 'main', behind: 3 })).toEqual([
      'main is 3 commit(s) behind origin/main. Run: git pull',
    ]);
  });

  it('reports every reason at once', () => {
    expect(releaseProblems({ branch: '(detached HEAD)', behind: 1 })).toHaveLength(2);
  });
});
