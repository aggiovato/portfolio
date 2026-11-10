import { expect, test } from '@playwright/test';

/**
 * Native cross-document transitions (@view-transition). The `pagereveal` event tells whether the
 * new page came in with a transition. Chrome supports them; elsewhere normal navigation is valid.
 */
test.describe('page transitions', () => {
  test.skip(({ isMobile }) => isMobile, 'Same behaviour; checked once on desktop');

  const recordReveal = () => {
    (window as unknown as { __vt: boolean | null }).__vt = null;
    addEventListener('pagereveal', (e) => {
      (window as unknown as { __vt: boolean }).__vt = !!(e as Event & { viewTransition?: unknown })
        .viewTransition;
    });
  };

  test('card → case study animates, shares names and works with back', async ({ page }) => {
    await page.addInitScript(recordReveal);
    await page.goto('/');
    const card = page.locator('.pcard').first();
    const slug = await card.locator('.stretched').getAttribute('href');
    await card.locator('.stretched').click();
    await expect(page).toHaveURL(new RegExp(`${slug}$`));

    // `pagereveal` can fire after the URL commits: wait for it instead of reading it once.
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __vt: boolean | null }).__vt))
      .toBe(true);
    const name = slug!.split('/').filter(Boolean).pop();
    await expect(page.locator('h1')).toHaveCSS('view-transition-name', `title-${name}`);
    await expect(page.locator('figure.cover img')).toHaveCSS('view-transition-name', `cover-${name}`);

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.pcard').first()).toBeVisible();
  });

  test('reduced motion: no transition', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.addInitScript(recordReveal);
    await page.goto('/');
    await page.locator('.pcard .stretched').first().click();
    await expect(page).toHaveURL(/\/work\//);
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { __vt: boolean | null }).__vt))
      .toBe(false);
    await ctx.close();
  });
});
