import { defineMarkdocConfig, component, nodes } from '@astrojs/markdoc/config';
import shiki from '@astrojs/markdoc/shiki';
import codeTheme from './src/styles/code-theme.mjs';

/** Editorial tags available in case studies (§6, §10). Labels are translated in src/i18n/ui. */
export default defineMarkdocConfig({
  // Highlighted at build time (no client JS) with the hero's code palette.
  extends: [shiki({ theme: codeTheme, wrap: false })],
  nodes: {
    // ![alt](./image.webp "Caption") becomes an optimised figure with a caption (notes, case studies).
    image: {
      ...nodes.image,
      render: component('./src/components/Figure.astro'),
    },
  },
  tags: {
    // Inline: {% highlight %}pipe(){% /highlight %} → the key term in lavender (Highlight.astro).
    highlight: {
      render: component('./src/components/Highlight.astro'),
      inline: true,
    },
    callout: {
      render: component('./src/components/Callout.astro'),
      attributes: {
        type: { type: String, default: 'note', matches: ['note', 'constraint', 'learning', 'editorial'] },
        title: { type: String },
      },
    },
    // A figure on the notebook background (Diagram.astro): a marble diagram by `id`
    // (src/lib/diagrams/specs.ts) or any SVG/image under src/assets/notes/ by `src`.
    diagram: {
      render: component('./src/components/Diagram.astro'),
      selfClosing: true,
      attributes: {
        id: { type: String },
        src: { type: String },
        alt: { type: String, required: true },
        caption: { type: String },
      },
    },
    // Self-check at the end of a note: {% quiz %} around {% question … /%} (Quiz.astro, Question.astro).
    quiz: {
      render: component('./src/components/Quiz.astro'),
      children: ['tag'],
    },
    question: {
      render: component('./src/components/Question.astro'),
      attributes: {
        text: { type: String, required: true },
        options: { type: Array, required: true },
        answer: { type: Number, required: true },
        explanation: { type: String },
      },
    },
    decision: {
      render: component('./src/components/DecisionBlock.astro'),
      selfClosing: true,
      attributes: {
        title: { type: String },
        problem: { type: String, required: true },
        decision: { type: String, required: true },
        alternatives: { type: String },
        tradeoff: { type: String },
        evidence: { type: String },
        outlook: { type: String },
      },
    },
  },
});
