import { expect, test } from '@playwright/test';

/** Search and sharing metadata (BaseLayout): share card, structured data, robots. */
test.describe('seo', () => {
  test.skip(({ isMobile }) => isMobile, 'Head markup is the same on every viewport');

  const jsonLd = async (page: import('@playwright/test').Page) =>
    JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}') as {
      '@graph': { '@type': string; headline?: string; datePublished?: string }[];
    };

  test('every page has a 1200×630 share image and describes the site and its author', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/.+\.jpg$/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      /Heber Alejandro Lugo/,
    );
    const types = (await jsonLd(page))['@graph'].map((n) => n['@type']);
    expect(types).toEqual(['WebSite', 'Person']);
  });

  test('a note is an article with its date, topics and BlogPosting data', async ({ page }) => {
    await page.goto('/notes/rxjs-mapping-operators/');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="article:tag"]').first()).toHaveAttribute('content', 'RxJS');
    const post = (await jsonLd(page))['@graph'].find((n) => n['@type'] === 'BlogPosting');
    expect(post?.headline).toBe('switchMap, concatMap, mergeMap or exhaustMap?');
    expect(post?.datePublished).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('llms.txt summarises the site in Markdown with links to the case studies', async ({ request }) => {
    const res = await request.get('/llms.txt');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('text/plain');
    const body = await res.text();
    expect(body).toMatch(/^# Heber Alejandro Lugo — aggiovato\n\n> /);
    expect(body).toContain('## Case studies\n\n- [');
    expect(body).toMatch(/- \[yRest\]\(https?:\/\/[^)]+\/work\/yrest\/\): /);
    expect(body).toContain('## Notes');
  });

  test('robots.txt allows crawling and points to the sitemap', async ({ request }) => {
    const body = await (await request.get('/robots.txt')).text();
    expect(body).toContain('Allow: /');
    expect(body).toMatch(/Sitemap: https:\/\/.+\/sitemap-index\.xml/);
  });
});
