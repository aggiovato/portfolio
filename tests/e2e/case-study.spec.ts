import { expect, test } from '@playwright/test';

/** Desktop index as a trajectory: the section being read is marked; without JS it is a plain list. */
test.describe('case study index', () => {
  test.skip(({ isMobile }) => isMobile, 'The trajectory index is desktop only; phones get the dropdown');

  test('marks the section being read', async ({ page }) => {
    await page.goto('/work/yrest/');
    const trail = page.locator('[data-toc-trail]');
    const first = trail.getByRole('link').first();
    const second = trail.getByRole('link').nth(1);

    // Bring the second section's heading to the top of the viewport.
    const target = (await second.getAttribute('href'))!;
    await page.locator(target).evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(second).toHaveAttribute('aria-current', 'location');
    await expect(first).not.toHaveAttribute('aria-current', 'location');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the index is still a list of working anchors', async ({ page }) => {
      await page.goto('/work/yrest/');
      const links = page.locator('[data-toc-trail]').getByRole('link');
      await expect(links.first()).toBeVisible();
      await expect(page.locator('[data-toc-trail] [aria-current]')).toHaveCount(0);
    });
  });
});

/** Gallery as a system map, and its viewer (ProjectGallery.astro). */
test.describe('case study gallery', () => {
  test.skip(({ isMobile }) => isMobile, 'Phones get the grid; the system map is checked on desktop');

  test('selects from the caption list, opens the preview and returns focus on Escape', async ({ page }) => {
    await page.goto('/work/yrest/');
    const gallery = page.locator('[data-gallery]');
    await expect(gallery).toHaveClass(/is-orbit/);

    const pause = gallery.getByRole('button', { name: 'Pause orbit' });
    await pause.click();
    await expect(pause).toHaveAttribute('aria-pressed', 'true');

    // The first image is selected on load; choosing another updates the preview.
    await expect(gallery.getByRole('link', { name: /^Show image 1 of 4/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
    const second = gallery.getByRole('link', { name: /^Show image 2 of 4/ });
    await second.focus();
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('aria-current', 'true');

    const open = gallery.getByRole('button', { name: /^Open image 2 of 4/ });
    await open.click();
    const viewer = page.getByRole('dialog', { name: 'Image viewer' });
    await expect(viewer).toBeVisible();
    await expect(viewer.locator('[data-counter]')).toHaveText('2 / 4');

    await viewer.getByRole('button', { name: 'Next image' }).click();
    await expect(viewer.locator('[data-counter]')).toHaveText('3 / 4');
    await viewer.getByRole('button', { name: 'Zoom in' }).click();
    await expect(viewer.locator('[data-viewer-img]')).toHaveAttribute('style', /scale\(1\.4\)/);
    await viewer.getByRole('button', { name: 'Rotate 90°' }).click();
    await expect(viewer.locator('[data-viewer-img]')).toHaveAttribute('style', /rotate\(90deg\)/);

    await page.keyboard.press('Escape');
    await expect(viewer).toBeHidden();
    await expect(open).toBeFocused();
  });

  test('the preview changes only when the visitor chooses, while the orbit keeps turning', async ({
    page,
  }) => {
    await page.goto('/work/yrest/');
    const gallery = page.locator('[data-gallery]');
    await gallery.locator('[data-stage]').scrollIntoViewIfNeeded();
    await page.mouse.move(2, 2);
    const caption = gallery.locator('[data-preview] figcaption');
    const first = await caption.textContent();

    const stage = gallery.locator('[data-stage]');
    const rotation = async () => Number(await stage.getAttribute('data-rotation'));
    const start = await rotation();
    await expect.poll(async () => (await rotation()) - start, { timeout: 6000 }).toBeGreaterThan(0.05);
    await expect(caption).toHaveText(first ?? '');
  });

  test('reduced motion keeps a grid of real images, and the viewer still works', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/work/yrest/');
    const gallery = page.locator('[data-gallery]');
    await expect(gallery).not.toHaveClass(/is-orbit/);
    await gallery.getByRole('link', { name: /^Open image 2 of 4/ }).click();
    await expect(page.getByRole('dialog', { name: 'Image viewer' })).toBeVisible();
    await ctx.close();
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('each image links to its full-resolution version', async ({ page }) => {
      await page.goto('/work/yrest/');
      const links = page.locator('[data-gallery] [data-shots] a');
      await expect(links).toHaveCount(4);
      await expect(links.first()).toHaveAttribute('href', /\/_astro\/.+\.webp$/);
    });
  });
});
