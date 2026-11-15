import { describe, expect, it } from 'vitest';
import { checkQuestion, inlineCode, questionId, score } from '../../src/lib/quiz';

const q = { text: 'Which operator keeps only the latest?', options: ['switchMap', 'concatMap'], answer: 1 };

describe('quiz questions', () => {
  it('accepts a well-formed question', () => {
    expect(() => checkQuestion(q)).not.toThrow();
  });

  it('fails the build on an impossible question, naming it', () => {
    expect(() => checkQuestion({ ...q, answer: 3 })).toThrow(
      /answer must be the number of one of its 2 options/,
    );
    expect(() => checkQuestion({ ...q, answer: 0 })).toThrow(/Which operator/);
    expect(() => checkQuestion({ ...q, options: ['only one'] })).toThrow(/between 2 and 6/);
    expect(() => checkQuestion({ ...q, options: ['a', ' '] })).toThrow(/empty option/);
    expect(() => checkQuestion({ ...q, text: '' })).toThrow(/needs its text/);
  });

  it('gives each question a stable, distinct id', () => {
    expect(questionId(q.text)).toBe(questionId(q.text));
    expect(questionId(q.text)).not.toBe(questionId('Another question'));
    expect(questionId(q.text)).toMatch(/^q-[a-z0-9]+$/);
  });

  it('counts answered and correct questions, ignoring the unanswered', () => {
    expect(score([1, 3, null, 2], [1, 2, 4, 2])).toEqual({ answered: 3, correct: 2 });
    expect(score([null, null], [1, 2])).toEqual({ answered: 0, correct: 0 });
  });

  it('splits `backticks` into inline code pieces', () => {
    expect(inlineCode('Use `switchMap` or `concatMap`.')).toEqual([
      { code: false, text: 'Use ' },
      { code: true, text: 'switchMap' },
      { code: false, text: ' or ' },
      { code: true, text: 'concatMap' },
      { code: false, text: '.' },
    ]);
    expect(inlineCode('`mergeMap`')).toEqual([{ code: true, text: 'mergeMap' }]);
    expect(inlineCode('no code, a lone ` tick')).toEqual([{ code: false, text: 'no code, a lone ` tick' }]);
  });
});
