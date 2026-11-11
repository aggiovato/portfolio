import { expect, test } from '@playwright/test';

/** Desktop index as a trajectory: the section being read is marked; without JS it is a plain list. */
test.describe('case study index', () => {
  test.skip(({ isMobile }) => isMobile, 'The trajectory index is desktop only; phones get the dropdown');

  test('marks the section being read', async ({ page }) => {
    await page.goto('/work/yrest/');
    const trail = page.locator('[data-toc-trail]');
    const first = trail.getByRole('link').first();
    const second = trail.getByRole('link').nth(1);

    // Bring the second section's heading to the top of the viewport.
    const target = (await second.getAttribute('href'))!;
    await page.locator(target).evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(second).toHaveAttribute('aria-current', 'location');
    await expect(first).not.toHaveAttribute('aria-current', 'location');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the index is still a list of working anchors', async ({ page }) => {
      await page.goto('/work/yrest/');
      const links = page.locator('[data-toc-trail]').getByRole('link');
      await expect(links.first()).toBeVisible();
      await expect(page.locator('[data-toc-trail] [aria-current]')).toHaveCount(0);
    });
  });
});
