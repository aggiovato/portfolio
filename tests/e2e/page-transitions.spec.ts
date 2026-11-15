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
    let slug = '';
    // Under heavy CPU load (the full suite in parallel) Chrome skips a cross-document transition
    // when the new page is not ready in time: measured ~3–17 % with 12–14 workers, 0 of 60 with
    // one. The site is not at fault (the old page does start it), so the navigation is retried:
    // a site that stopped transitioning still fails every attempt.
    await expect(async () => {
      await page.goto('/');
      const link = page.locator('.pcard').first().locator('.stretched');
      slug = (await link.getAttribute('href')) ?? '';
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${slug}$`));
      // `pagereveal` can fire after the URL commits: wait for it instead of reading it once.
      await expect
        .poll(() => page.evaluate(() => (window as unknown as { __vt: boolean | null }).__vt))
        .not.toBeNull();
      expect(await page.evaluate(() => (window as unknown as { __vt: boolean }).__vt)).toBe(true);
    }).toPass({ intervals: [0], timeout: 30_000 });

    const name = slug.split('/').filter(Boolean).pop();
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
