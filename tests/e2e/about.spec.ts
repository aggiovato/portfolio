import { expect, test } from '@playwright/test';

/** «What I work with»: technologies open into their branches, by mouse, keyboard or without JS. */
test.describe('skill tree', () => {
  test('a technology opens with the keyboard and shows when each branch is used', async ({ page }) => {
    await page.goto('/about/');
    const angular = page.locator('summary', { hasText: 'Angular' });
    const branch = page.getByText('Lazy-loaded routes per feature');
    await expect(branch).toBeHidden();

    await angular.focus();
    await page.keyboard.press('Enter');
    await expect(branch).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(branch).toBeHidden();
  });

  test('the Spanish page shows the Spanish tree', async ({ page }) => {
    await page.goto('/es/about/');
    await page.locator('summary', { hasText: 'Git y control de versiones' }).click();
    await expect(page.getByText('Versionado semántico')).toBeVisible();
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the native disclosures still open', async ({ page }) => {
      await page.goto('/about/');
      await page.locator('summary', { hasText: 'Git and versioning' }).click();
      await expect(page.getByText('Semantic versioning')).toBeVisible();
    });
  });
});
