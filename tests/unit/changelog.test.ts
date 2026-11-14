import { describe, expect, it } from 'vitest';
import { releaseChangelog, sectionBody } from '../../scripts/changelog.mjs';

const log = `# Changelog

## [Unreleased]

### Added

- Notes section.

---

## [1.0.0] — 2026-11-14

### Added

- First release.
`;

describe('sectionBody', () => {
  it('returns a section without its heading and separator', () => {
    expect(sectionBody(log, '1.0.0')).toBe('### Added\n\n- First release.');
    expect(sectionBody(log, 'Unreleased')).toBe('### Added\n\n- Notes section.');
  });

  it('returns null for a missing version', () => {
    expect(sectionBody(log, '9.9.9')).toBeNull();
  });
});

describe('releaseChangelog', () => {
  it('dates the unreleased changes and leaves an empty Unreleased section on top', () => {
    const out = releaseChangelog(log, '1.1.0', '2026-12-01');
    expect(sectionBody(out, '1.1.0')).toBe('### Added\n\n- Notes section.');
    expect(sectionBody(out, 'Unreleased')).toBe('');
    expect(out.indexOf('## [Unreleased]')).toBeLessThan(out.indexOf('## [1.1.0] — 2026-12-01'));
    expect(sectionBody(out, '1.0.0')).toBe('### Added\n\n- First release.');
  });

  it('refuses an empty Unreleased section, a repeated version or a non-semver one', () => {
    const released = releaseChangelog(log, '1.1.0', '2026-12-01');
    expect(() => releaseChangelog(released, '1.2.0', '2026-12-02')).toThrow(/Nothing to release/);
    expect(() => releaseChangelog(log, '1.0.0', '2026-12-02')).toThrow(/already has a section/);
    expect(() => releaseChangelog(log, 'v1.1', '2026-12-02')).toThrow(/semver/);
  });
});
