import { expect, test } from '@playwright/test';

// Widths required by §21: no horizontal overflow.
const WIDTHS = [320, 375, 768, 1024, 1440];
const PATHS = ['/', '/work/', '/about/', '/contact/', '/es/', '/es/work/'];

test.describe('no horizontal overflow', () => {
  test.skip(({ isMobile }) => isMobile, 'Viewport set explicitly; runs once on desktop');

  for (const width of WIDTHS) {
    test(`at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of PATHS) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe('mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile only');

  test('opens, closes with Escape and returns focus to the toggle', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    const nav = page.getByRole('navigation', { name: 'Main' });

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav.getByRole('link', { name: 'Work' })).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: 'Work' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('opens over the content without moving it, and closes from the scrim', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    const main = page.locator('main');
    const before = await main.boundingBox();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // Overlay, not a push-down: the header keeps its height and the content stays put.
    expect(await main.boundingBox()).toEqual(before);
    // The page behind is inert while the menu is open.
    await expect(main).toHaveJSProperty('inert', true);

    // Tap the scrim, below the panel.
    const viewport = page.viewportSize()!;
    await page.mouse.click(viewport.width / 2, viewport.height - 20);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(main).toHaveJSProperty('inert', false);
  });

  test('the close icon is centred in its button', async ({ browser }) => {
    // Reduced motion: no transition to wait for before measuring the final X.
    const ctx = await browser.newContext({ ...test.info().project.use, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Menu' });
    await toggle.click();

    const offsets = await toggle.evaluate((button) => {
      const centre = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      };
      const b = centre(button);
      return [...button.querySelectorAll('path')].map((p) => {
        const c = centre(p);
        return Math.hypot(c.x - b.x, c.y - b.y);
      });
    });
    for (const offset of offsets) expect(offset).toBeLessThan(0.5);
    await ctx.close();
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('navigation and project links stay available', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav.getByRole('link', { name: 'Work' })).toBeVisible();
    await expect(page.locator('.pcard').first()).toBeVisible();
  });
});
