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

test.describe('notes', () => {
  test('the menu links to notes and a note opens its own URL with an index', async ({ page, isMobile }) => {
    await page.goto('/notes/');
    await expect(page.locator('h1')).toHaveText('Notes, drawn as I understand them.');
    if (!isMobile) {
      await expect(
        page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Notes' }),
      ).toHaveAttribute('aria-current', 'page');
    }
    await page.getByRole('link', { name: 'switchMap, concatMap, mergeMap or exhaustMap?' }).click();
    await expect(page).toHaveURL(/\/notes\/rxjs-mapping-operators\/$/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByText(/\d+ min read/)).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
    await expect(page.locator('table').first()).toBeVisible();
  });

  test('pages announce the feed in the head, not with a visible link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
      'href',
      /\/notes\/rss\.xml$/,
    );
    await page.goto('/notes/');
    await expect(page.getByRole('link', { name: 'RSS feed' })).toHaveCount(0);
  });

  test('the RSS feed lists the notes with absolute links', async ({ request }) => {
    const response = await request.get('/notes/rss.xml');
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('xml');
    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toMatch(/<channel>[\s\S]*<title>Notes — aggiovato<\/title>/);
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

test.describe('contact call to action', () => {
  test('reads as one still sentence and rests on its first word after the cycle', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: 'Have a product worth building? Let’s talk.' });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    // The cycle runs once (five words, under five seconds) and comes back to the resting word.
    await expect(page.locator('[data-cta-word]')).toHaveText('a product', { timeout: 8000 });
  });
});

test.describe('back to top', () => {
  test('every page offers the rocket FAB once the reader scrolls, and it returns to the top', async ({
    page,
  }) => {
    await page.goto('/about/');
    const fab = page.getByRole('button', { name: 'Back to top' });
    await expect(fab).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(fab).toBeVisible();
    await fab.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator('#main')).toBeFocused();
  });
});
