import { defineConfig, devices } from '@playwright/test';

/**
 * E2E layer (spec §21 «tests proportional to risk»; see .claude/rules/testing.md).
 * Runs against a production build in dist-e2e/ that includes drafts (SHOW_DRAFTS=1), served with
 * `astro preview`. Astro 7 allows a single `astro dev` per project, so it never clashes with the
 * dev server. The real exclusion of drafts is checked by `npm run verify:drafts`.
 * PW_CHANNEL: `chrome` locally (installed Chrome), `chromium` in CI (Playwright's own build).
 */
const PORT = 4322;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL ?? 'chrome' },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], channel: process.env.PW_CHANNEL ?? 'chrome' },
    },
  ],
  webServer: {
    command: `SHOW_DRAFTS=1 npx astro build --outDir dist-e2e && npx astro preview --outDir dist-e2e --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}`,
    // Always a fresh build: reusing an earlier preview would test stale HTML.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
