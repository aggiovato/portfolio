import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Automated accessibility audit (spec §16, WCAG 2.2 AA target). axe catches roughly a third of
 * the issues; keyboard and screen reader checks stay manual (.claude/rules/accessibility.md).
 * Exceptions go through `exclude` with a reason, never by disabling a whole rule.
 */
const PAGES = ['/', '/work/', '/about/', '/contact/', '/es/', '/es/work/', '/404/'];

test.describe('accessibility (axe)', () => {
  test.skip(({ isMobile }) => isMobile, 'Same markup on mobile; audited once on desktop');

  for (const path of PAGES) {
    test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
      );
      expect(summary, summary.join('\n')).toEqual([]);
    });
  }

  test('a case study has no WCAG A/AA violations', async ({ page }) => {
    await page.goto('/work/');
    await page.locator('article.card').first().getByRole('heading').getByRole('link').click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
