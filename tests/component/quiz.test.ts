import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Question from '../../src/components/Question.astro';
import Quiz from '../../src/components/Quiz.astro';

/**
 * The `{% quiz %}` and `{% question %}` tags: the contract a reader (and a screen reader) gets
 * without JS. Rendered in the default locale (see markdoc-tags.test.ts).
 */
let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

const props = {
  text: 'Which operator keeps only the `latest` query?',
  options: ['`switchMap`', 'Queue them all'],
  answer: 1,
  explanation: 'It unsubscribes from the previous request.',
};

describe('Question', () => {
  it('is a named group of real radio buttons, one name per question', async () => {
    const html = await container.renderToString(Question, { props });
    expect(html).toMatch(/<fieldset[^>]*data-answer="1"/);
    expect(html).toMatch(/<legend[^>]*>[\s\S]*Which operator keeps only the/);
    const names = [...html.matchAll(/type="radio" name="([^"]+)" value="(\d)"/g)];
    expect(names.map((m) => m[2])).toEqual(['1', '2']);
    expect(new Set(names.map((m) => m[1])).size).toBe(1);
  });

  it('marks the right option and renders backticks as inline code', async () => {
    const html = await container.renderToString(Question, { props });
    expect(html).toMatch(/<label[^>]*data-correct[^>]*>[\s\S]*?<code[^>]*>switchMap<\/code>/);
    expect(html).toMatch(/<code[^>]*>latest<\/code>/);
    expect(html).toMatch(/data-code-only/);
    expect(html).toContain('Correct');
    expect(html).toContain('Not quite');
    expect(html).toContain('It unsubscribes from the previous request.');
  });

  it('fails the build on an impossible answer', async () => {
    await expect(container.renderToString(Question, { props: { ...props, answer: 3 } })).rejects.toThrow(
      /answer must be the number of one of its 2 options/,
    );
  });
});

describe('Quiz', () => {
  it('is a titled region with a form, a live score and a reset button', async () => {
    const html = await container.renderToString(Quiz, {
      slots: { default: '<fieldset data-question></fieldset>' },
    });
    expect(html).toMatch(/<section[^>]*aria-labelledby="quiz-title"/);
    expect(html).toMatch(/<h2[^>]*id="quiz-title"[^>]*>Check yourself<\/h2>/);
    expect(html).toMatch(/aria-live="polite"[^>]*data-quiz-score/);
    expect(html).toMatch(/<button[^>]*type="reset"[^>]*>\s*Try again\s*<\/button>/);
    expect(html).toContain('<fieldset data-question>');
  });
});
