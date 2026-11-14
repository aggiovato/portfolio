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

    const switchTo = async (locale: string) => {
      await page.locator('[data-lang-menu] summary').click();
      await page.locator(`[data-locale-switch="${locale}"]`).click();
    };

    await switchTo('es');
    await expect(page).toHaveURL(new RegExp(`/es/work/${slug}/$`));
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await switchTo('en');
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

  test('switching language on a case study keeps the reader on the same case study', async ({ page }) => {
    await page.goto('/work/yrest/');
    await page.locator('[data-lang-menu] summary').click();
    await page.locator('[data-locale-switch="it"]').click();
    await expect(page).toHaveURL(/\/it\/work\/yrest\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');
    await expect(page.getByRole('heading', { level: 2, name: 'Problema' })).toBeVisible();
  });

  test('an unknown Spanish case study is a real 404', async ({ page }) => {
    const response = await page.goto('/es/work/this-project-does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});

test.describe('language menu', () => {
  test.skip(({ isMobile }) => isMobile, 'Same disclosure on phones, inside the menu panel');

  test('lists every language, marks the current one and closes like a popover', async ({ page }) => {
    await page.goto('/about/');
    const menu = page.locator('[data-lang-menu]');
    const summary = menu.locator('summary');

    await summary.click();
    await expect(menu).toHaveAttribute('open', '');
    await expect(menu.locator('[data-locale-switch]')).toHaveCount(3);
    await expect(menu.locator('[aria-current="true"]')).toHaveAttribute('data-locale-switch', 'en');
    await expect(menu.locator('[data-locale-switch="it"]')).toHaveAttribute('href', '/it/about/');

    await page.keyboard.press('Escape');
    await expect(menu).not.toHaveAttribute('open', '');
    await expect(summary).toBeFocused();

    await summary.click();
    await page.locator('main').click({ position: { x: 5, y: 5 } });
    await expect(menu).not.toHaveAttribute('open', '');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the native disclosure still opens and switches language', async ({ page }) => {
      await page.goto('/about/');
      await page.locator('[data-lang-menu] summary').click();
      await page.locator('[data-locale-switch="it"]').click();
      await expect(page).toHaveURL(/\/it\/about\/$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'it');
    });
  });
});

test.describe('404 in another locale', () => {
  test.skip(({ isMobile }) => isMobile, 'Same page; checked once on desktop');

  // Every case study and note is translated today, so the English-only offer has no live case;
  // caseStudyFallback() is covered by unit tests.
  test('a mistyped slug stays a plain 404', async ({ page }) => {
    await page.goto('/it/work/does-not-exist/');
    await expect(page.locator('[data-english-only]')).toBeHidden();
  });
});

test.describe('translated notes', () => {
  test.skip(({ isMobile }) => isMobile, 'Same markup; checked once on desktop');

  test('the Spanish index links to the Spanish article', async ({ page }) => {
    await page.goto('/es/notes/');
    await expect(page.locator('h1')).toHaveText('Notas');
    const link = page.getByRole('link', { name: '¿switchMap, concatMap, mergeMap o exhaustMap?' });
    await expect(link).toHaveAttribute('href', '/es/notes/rxjs-mapping-operators/');
    await link.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { level: 2, name: 'El experimento' })).toBeVisible();
    await expect(page.getByRole('img', { name: /Línea de tiempo de switchMap/ })).toBeVisible();
  });
});
