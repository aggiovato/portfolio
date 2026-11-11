import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';
import shiki from '@astrojs/markdoc/shiki';
import codeTheme from './src/styles/code-theme.mjs';

/** Editorial tags available in case studies (§6, §10). Labels are translated in src/i18n/ui. */
export default defineMarkdocConfig({
  // Highlighted at build time (no client JS) with the hero's code palette.
  extends: [shiki({ theme: codeTheme, wrap: false })],
  tags: {
    callout: {
      render: component('./src/components/Callout.astro'),
      attributes: {
        type: { type: String, default: 'note', matches: ['note', 'constraint', 'learning', 'editorial'] },
        title: { type: String },
      },
    },
    decision: {
      render: component('./src/components/DecisionBlock.astro'),
      selfClosing: true,
      attributes: {
        problem: { type: String, required: true },
        decision: { type: String, required: true },
        alternatives: { type: String },
        tradeoff: { type: String },
        evidence: { type: String },
      },
    },
  },
});
