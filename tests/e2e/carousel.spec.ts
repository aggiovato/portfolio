import { expect, test } from '@playwright/test';

test.describe('selected work carousel', () => {
  test('tablet: arrows and counter move through the projects', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Carousel controls only from 768 px');
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto('/');

    const prev = page.getByRole('button', { name: 'Previous projects' });
    const next = page.getByRole('button', { name: 'Next projects' });
    const count = page.locator('[data-current]');
    await expect(next).toBeVisible();
    await expect(prev).toBeDisabled();
    await expect(count).toHaveText('01');

    await next.click();
    await expect(count).toHaveText('02');
    await expect(prev).toBeEnabled();

    // Advance to the end, waiting for each smooth scroll to finish (the counter moves) before the
    // next click; at the end «next» is disabled.
    const total = await page.locator('.pcard').count();
    for (let i = 3; i <= total && (await next.isEnabled()); i++) {
      await next.click();
      await expect(count).toHaveText(String(i).padStart(2, '0'));
    }
    await expect(next).toBeDisabled();
  });

  test('desktop: controls appear only when projects overflow', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop layout');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const overflows = await page.locator('.track').evaluate((t) => t.scrollWidth - t.clientWidth > 4);
    const next = page.getByRole('button', { name: 'Next projects' });
    if (overflows) await expect(next).toBeVisible();
    else await expect(next).toBeHidden();
  });

  test('mobile: one column without carousel controls', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile layout');
    await page.goto('/');
    const cards = page.locator('.pcard');
    expect(await cards.count()).toBeGreaterThanOrEqual(2);
    const [a, b] = [await cards.nth(0).boundingBox(), await cards.nth(1).boundingBox()];
    expect(b!.y).toBeGreaterThan(a!.y + a!.height);
    await expect(page.getByRole('button', { name: 'Next projects' })).toBeHidden();
  });

  test('the whole card opens the case study', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('.pcard').first();
    const box = await card.locator('.media').boundingBox();
    await card.locator('.media').scrollIntoViewIfNeeded();
    await page.mouse.click(box!.x + box!.width / 2, (await card.locator('.media').boundingBox())!.y + 20);
    await expect(page).toHaveURL(/\/work\/[a-z0-9-]+\/$/);
  });
});
