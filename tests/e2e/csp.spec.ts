import { expect, test } from '@playwright/test';

/**
 * Content Security Policy (astro.config.mjs `security.csp`): every page carries one, and nothing the
 * site does trips it: the rocket flight, the orbital gallery and its viewer, note diagrams, code,
 * the quiz, the newsletter form. A violation here means a script, style or resource that the policy
 * (or Astro's hashes) does not cover.
 */
const PAGES = [
  '/',
  '/work/',
  '/work/yrest/',
  '/about/',
  '/contact/',
  '/notes/',
  '/notes/rxjs-fundamentals/',
  '/notes/rxjs-mapping-operators/',
  '/es/notes/where-state-lives/',
  '/newsletter/pending/',
];

test.describe('content security policy', () => {
  for (const path of PAGES) {
    test(`${path} has a CSP and no violations`, async ({ page }) => {
      // Collected from the first byte, before any script of the page runs.
      await page.addInitScript(() => {
        const store: string[] = [];
        (window as unknown as { __csp: string[] }).__csp = store;
        document.addEventListener('securitypolicyviolation', (e) =>
          store.push(
            `${e.violatedDirective} ← ${e.blockedURI || 'inline'} (${e.sourceFile}:${e.lineNumber})`,
          ),
        );
      });
      await page.goto(path);
      await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);

      // Scroll through, so lazy images, observers and in-view effects run too.
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
        }
      });
      const quizOption = page.getByRole('radio').first();
      if (await quizOption.count()) await quizOption.check();

      const violations = await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp);
      expect(violations).toEqual([]);
    });
  }
});
