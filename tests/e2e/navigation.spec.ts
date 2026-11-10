import { expect, test } from '@playwright/test';

test.describe('home', () => {
  test('shows identity, role and primary actions above the fold', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /Grounded in code\.\s*Built to explore\./,
    );
    await expect(page.getByText('Alejandro Lugo').first()).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Explore my work' })).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Let’s talk' })).toBeVisible();
  });

  test('has exactly one h1 and a working skip link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe('work', () => {
  test('a project card opens its own stable URL', async ({ page }) => {
    await page.goto('/work/');
    const firstTitle = page.locator('article.card').first().getByRole('heading').getByRole('link');
    const name = (await firstTitle.textContent())?.trim() ?? '';
    await firstTitle.click();
    await expect(page).toHaveURL(/\/work\/[a-z0-9-]+\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(name);

    await page.goBack();
    await expect(page).toHaveURL(/\/work\/$/);
  });

  test('an unknown slug returns a real 404', async ({ page }) => {
    const response = await page.goto('/work/this-project-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('link', { name: 'Go to home' })).toBeVisible();
  });
});

test.describe('static pages', () => {
  for (const path of ['/about/', '/contact/']) {
    test(`${path} renders with a single h1`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});
