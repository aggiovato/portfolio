import { expect, test } from '@playwright/test';

test.describe('hero rocket flight', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop-only enhancement');

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
  });

  test('entrance flight lands on the planet and updates the mission object', async ({ page }) => {
    const waypoint = page.locator('[data-launchpad] .waypoint');
    await expect(waypoint.locator('.waypoint-note')).toHaveText('// arrival point');
    await expect(page.locator('[data-field="status"]')).toHaveText("'landed'");
    await expect(page.locator('[data-field="target"]')).toHaveText(/\{ x: \d+, y: \d+ \}/);
  });

  test('clicking empty hero space flies the rocket to that point', async ({ page }) => {
    const hero = page.locator('[data-launchpad]');
    await expect(hero.locator('.waypoint-note')).toHaveText('// arrival point');

    const box = await hero.boundingBox();
    if (!box) throw new Error('hero not rendered');
    const x = Math.round(box.width * 0.5);
    const y = 60;
    await page.mouse.click(box.x + x, box.y + y);

    await expect(hero.locator('.waypoint-coords')).toHaveText(new RegExp(`x: ${x}\\s+y: ${y}`));
    await expect(hero.locator('.waypoint-note')).not.toHaveText('// arrival point');
    await expect(page.locator('[data-field="target"]')).toHaveText(`{ x: ${x}, y: ${y} }`);
    await expect(page.locator('[data-field="status"]')).toHaveText("'landed'");
  });

  test('a click near the bottom lands above the projects horizon', async ({ page }) => {
    const hero = page.locator('[data-launchpad]');
    await expect(hero.locator('.waypoint-note')).toHaveText('// arrival point');
    const box = await hero.boundingBox();
    if (!box) throw new Error('hero not rendered');
    await page.mouse.click(box.x + box.width * 0.25, box.y + box.height - 4);
    await expect(page.locator('[data-field="status"]')).toHaveText("'landed'");

    const flyer = await hero.locator('.flyer').boundingBox();
    const horizon = await page.locator('.work .horizon').boundingBox();
    if (!flyer || !horizon) throw new Error('missing flyer or horizon');
    // At x = 25 % the arc is 0.75·D above the section: the rocket must stay above it.
    const surfaceY = horizon.y + horizon.height * 0.25;
    expect(flyer.y + flyer.height).toBeLessThanOrEqual(surfaceY);
  });

  test('clicking a link navigates instead of launching', async ({ page }) => {
    await page.getByRole('link', { name: 'Let’s talk' }).click();
    await expect(page).toHaveURL(/\/contact\/$/);
  });
});
