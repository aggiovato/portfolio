import { expect, test } from '@playwright/test';

/**
 * Multilingual contract (spec §17): default locale without prefix, Spanish under /es/,
 * hreflang between equivalents and a switcher that keeps the reader on the same page.
 */
test.describe('i18n', () => {
  test.skip(({ isMobile }) => isMobile, 'Markup contract; checked once on desktop');

  test('each locale declares its language and links its translation', async ({ page }) => {
    await page.goto('/es/about/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/about\/$/);
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);

    await page.goto('/about/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('the switcher keeps the equivalent page, including case studies', async ({ page }) => {
    await page.goto('/work/');
    const firstCase = page.locator('article.card').first().getByRole('heading').getByRole('link');
    await firstCase.click();
    await expect(page).toHaveURL(/\/work\/([a-z0-9-]+)\/$/);
    const slug = new URL(page.url()).pathname.split('/').filter(Boolean).pop();

    await page.locator('[data-locale-switch="es"]').click();
    await expect(page).toHaveURL(new RegExp(`/es/work/${slug}/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await page.locator('[data-locale-switch="en"]').click();
    await expect(page).toHaveURL(new RegExp(`/work/${slug}/$`));
    await expect(page).not.toHaveURL(/\/es\//);
  });

  test('Spanish pages translate the interface and keep links inside /es/', async ({ page }) => {
    await page.goto('/es/');
    const nav = page.getByRole('navigation', { name: 'Principal' });
    await expect(nav.getByRole('link', { name: 'Proyectos' })).toHaveAttribute('href', '/es/work/');
    await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeAttached();
    await expect(page.getByRole('link', { name: 'Ver mis proyectos' })).toHaveAttribute('href', '/es/work/');
  });

  test('an unknown Spanish case study is a real 404', async ({ page }) => {
    const response = await page.goto('/es/work/this-project-does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});
