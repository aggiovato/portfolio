---
paths:
  - 'src/content/**'
  - 'src/i18n/ui/**'
  - 'src/components/Highlight.astro'
  - 'src/components/HighlightedTitle.astro'
---

# Highlighting (the lavender shine)

The site has one emphasis colour for words: lavender with a soft glow, the same signal as «explore.»
in the hero (DESIGN.md, The One Signal Rule). It marks the word to remember. Used everywhere it is
needed, and nowhere else, so it keeps meaning something.

## Where it goes

| Case                                                         | Do                                                                                                         |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Code in a section heading** (operator, function, API, CLI) | **Always** highlight each code term: `## {% highlight %}tap{% /highlight %} observes without transforming` |
| A list or summary that names those same terms                | Highlight them too, so the reader links them to their section                                              |
| A key word in running text the reader must take away         | Highlight it; at most one idea per paragraph                                                               |
| Page titles and the call to action                           | One shining word per title, via `HighlightedTitle` and a `{word}` placeholder in `src/i18n/ui`             |

## How

- Notes and case studies (Markdoc): `{% highlight %}term{% /highlight %}`, inline, also inside headings;
  in Keystatic, the «Highlight» button. Wrap inline code inside it when the term is code:
  `{% highlight %}`pipe()`{% /highlight %}` (the code chip takes the lavender).
- Interface copy: `HighlightedTitle text={t('x.heading')} word={t('x.headingWord')}`; never hard-code
  the word or split a sentence by hand.
- Every translation highlights the same terms (they are usually the same code names).

## Don't

- Highlight whole sentences, links or buttons (links already carry lavender), or use it as bold.
- Highlight more than one idea in a paragraph, or decorate a heading that has no code or key term.
- Use another colour or a raw `<mark>`/`<em>` with custom styles for emphasis.
