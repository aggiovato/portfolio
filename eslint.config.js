// @ts-check
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'test-results/',
      'dist-e2e/',
      'playwright-report/',
      'coverage/',
    ],
  },
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
);
