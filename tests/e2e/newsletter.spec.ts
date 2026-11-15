import { expect, test } from '@playwright/test';

/** Newsletter form (NewsletterForm.astro): a plain form posted to Brevo, no request is sent here. */
test.describe('newsletter', () => {
  test('a note ends with a subscription form that posts to Brevo', async ({ page }) => {
    await page.goto('/notes/rxjs-fundamentals/');
    const form = page.getByRole('region', { name: 'Get new notes by email' }).locator('form');
    await expect(form).toHaveAttribute('method', 'post');
    await expect(form).toHaveAttribute('action', /^https:\/\/[a-z0-9]+\.sibforms\.com\/serve\//);
    const email = form.getByRole('textbox', { name: 'Email address' });
    await expect(email).toHaveAttribute('name', 'EMAIL');
    await expect(email).toHaveAttribute('required', '');
    await expect(form.getByRole('button', { name: 'Subscribe' })).toBeVisible();
    // Brevo's anti-spam trap stays out of reach of people and assistive technology.
    await expect(form.locator('input[name="email_address_check"]')).toHaveAttribute('tabindex', '-1');
  });

  test('the footer offers the compact form on every page', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.getByRole('region', { name: 'New notes by email' })).toBeVisible();
  });

  test('the confirmation steps exist in every language and stay out of search', async ({ page }) => {
    for (const path of ['/newsletter/pending/', '/es/newsletter/confirmed/', '/it/newsletter/pending/']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    }
  });

  test('the language select points the form at that language’s list', async ({ page }) => {
    await page.goto('/es/notes/rxjs-fundamentals/');
    const form = page.locator('[aria-labelledby="note-newsletter-title"] form');
    const spanish = await form.getAttribute('action');
    await expect(form.locator('input[name="locale"]:checked')).toHaveValue('es');
    const group = form.getByRole('group', { name: 'Idioma' });
    await expect(group.getByRole('radio', { name: /Español/ })).toBeChecked();
    await group.getByRole('radio', { name: /Italiano/ }).check();
    await expect(form.locator('input[name="locale"]:checked')).toHaveValue('it');
    await expect(form).not.toHaveAttribute('action', spanish ?? '');
    await expect(form).toHaveAttribute('action', /sibforms\.com/);
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the form still submits to the page language’s list, without a language select', async ({
      page,
    }) => {
      await page.goto('/notes/rxjs-fundamentals/');
      await expect(page.locator('[data-newsletter-lang]').first()).toBeHidden();
      const form = page.locator('[aria-labelledby="note-newsletter-title"] form');
      await expect(form).toHaveAttribute('action', /sibforms\.com/);
      await expect(form.locator('input[name="locale"]:checked')).toHaveValue('en');
    });
  });
});
