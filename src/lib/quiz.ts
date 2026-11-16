/**
 * Self-check quizzes at the end of a note (`{% quiz %}` / `{% question %}`, Quiz.astro and
 * Question.astro). Nothing is stored or sent: the reader checks themselves. Pure, for Vitest.
 */

export interface QuizQuestion {
  text: string;
  options: string[];
  /** The right option, counted from 1 as written in the note. */
  answer: number;
  explanation?: string;
}

/** Fails the build on a malformed question, naming it, instead of shipping an impossible one. */
export function checkQuestion(q: QuizQuestion): void {
  const where = `Quiz question «${q.text?.slice(0, 60) ?? ''}»`;
  if (!q.text?.trim()) throw new Error('A quiz question needs its text.');
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6)
    throw new Error(`${where} needs between 2 and 6 options.`);
  if (q.options.some((o) => !String(o).trim())) throw new Error(`${where} has an empty option.`);
  if (!Number.isInteger(q.answer) || q.answer < 1 || q.answer > q.options.length)
    throw new Error(
      `${where}: answer must be the number of one of its ${q.options.length} options (from 1).`,
    );
}

/** A stable id for a question (its radio group name), from its text: same build, same names. */
export function questionId(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `q-${(h >>> 0).toString(36)}`;
}

/** How many questions are answered, and how many of those are right. `null` = not answered yet. */
export function score(picked: (number | null)[], answers: number[]): { answered: number; correct: number } {
  let answered = 0;
  let correct = 0;
  picked.forEach((p, i) => {
    if (p === null) return;
    answered++;
    if (p === answers[i]) correct++;
  });
  return { answered, correct };
}

/** Text with `backticks` split into plain and code pieces, so attribute strings can carry inline code. */
export function inlineCode(text: string): { code: boolean; text: string }[] {
  return text
    .split(/(`[^`]+`)/)
    .filter(Boolean)
    .map((part) =>
      part.length > 2 && part.startsWith('`') && part.endsWith('`')
        ? { code: true, text: part.slice(1, -1) }
        : { code: false, text: part },
    );
}
