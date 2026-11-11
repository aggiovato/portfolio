/**
 * Shiki theme for case study code blocks, in the colours of the hero's `mission` object (§3):
 * keywords and keys lavender, strings peach, values green, comments subtle.
 * Every colour is a CSS variable (defined in tokens.css), so the palette lives with the other
 * tokens. Same shape as Shiki's createCssVariablesTheme, written out because `shiki` is only a
 * transitive dependency of Astro.
 */
const v = (name) => `var(--code-${name})`;

export default {
  name: 'aggiovato',
  type: 'dark',
  colors: {
    'editor.foreground': v('text'),
    'editor.background': v('bg'),
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: v('comment') } },
    {
      scope: ['string', 'string.quoted', 'string.template', 'string.unquoted.plain.out.yaml'],
      settings: { foreground: v('string') },
    },
    {
      scope: [
        'constant.numeric',
        'constant.language',
        'constant.other',
        'variable.other.constant',
        'support.constant',
      ],
      settings: { foreground: v('value') },
    },
    {
      scope: [
        'keyword',
        'storage',
        'entity.name.tag.yaml',
        'support.type.property-name',
        'meta.object-literal.key',
        'variable.other.property',
      ],
      settings: { foreground: v('keyword') },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call', 'entity.name.type'],
      settings: { foreground: v('text') },
    },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: v('punctuation') } },
  ],
};
