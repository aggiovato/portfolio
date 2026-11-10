import { expect, test } from '@playwright/test';

/**
 * Rocket → «Back to top» FAB. On desktop the rocket flies to the corner; on mobile (or with reduced
 * motion) the FAB just appears. The visible contract is the same in both.
 */
test.describe('back to top', () => {
  test('appears after scrolling past the hero and takes you back to the top', async ({ page }) => {
    await page.goto('/');
    const fab = page.getByRole('button', { name: 'Back to top' });
    await expect(fab).toBeHidden();

    // Scroll until the hero is out (the FAB appears with < 15 % of the hero visible).
    await page.evaluate(() => {
      const hero = document.querySelector<HTMLElement>('[data-launchpad]');
      window.scrollTo(0, (hero?.offsetHeight ?? 800) + 200);
    });
    await expect(fab).toBeVisible({ timeout: 4000 });

    await fab.click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBe(0);
    await expect(page.locator('#main')).toBeFocused();
    await expect(fab).toBeHidden({ timeout: 4000 });
  });

  test('is keyboard operable', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    const fab = page.getByRole('button', { name: 'Back to top' });
    await expect(fab).toBeVisible({ timeout: 4000 });

    await fab.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBe(0);
  });

  test('desktop: the hero rocket flies into the corner and back home', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop-only flight');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('[data-launchpad] .waypoint-note')).toHaveText('// arrival point');

    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(page.locator('.sky-rocket')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back to top' })).toBeVisible({ timeout: 4000 });
    await expect(page.locator('.sky-rocket')).toBeHidden();

    await page.getByRole('button', { name: 'Back to top' }).click();
    await expect(page.locator('[data-launchpad] .flyer')).toHaveCSS('visibility', 'visible', {
      timeout: 5000,
    });
  });
});
