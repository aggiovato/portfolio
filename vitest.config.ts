/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

/**
 * Unit and component layers (see .claude/rules/testing.md).
 * - tests/unit:      pure TypeScript from src/lib and src/i18n, no Astro runtime.
 * - tests/component: .astro components rendered with the Container API.
 * E2E lives in tests/e2e and runs with Playwright against a production build.
 * getViteConfig loads astro.config.mjs, so `.astro` imports and `astro:*` modules resolve as in the app.
 */
export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/component/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/lib/**', 'src/i18n/**'],
      reporter: ['text', 'html'],
    },
  },
});
