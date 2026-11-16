import { expect, test } from '@playwright/test';

/**
 * The self-check at the end of a note (Quiz.astro, Question.astro). Picking an option reveals the
 * verdict and the explanation with CSS alone; JS only adds the running score. Keyboard and no-JS paths too.
 */
const NOTE = '/notes/rxjs-mapping-operators/';

test.describe('note quiz', () => {
  test('reveals the verdict and keeps a score that «Try again» resets', async ({ page }) => {
    await page.goto(NOTE);
    const quiz = page.getByRole('region', { name: 'Check yourself' });
    const first = quiz.getByRole('group').first();
    await expect(first.getByText('Correct', { exact: true })).toBeHidden();

    await first.getByRole('radio', { name: 'switchMap' }).check();
    await expect(first.getByText('Correct', { exact: true })).toBeVisible();
    await expect(first.getByText(/unsubscribes from the previous request/)).toBeVisible();

    const second = quiz.getByRole('group').nth(1);
    await second.getByRole('radio', { name: 'mergeMap' }).check();
    await expect(second.getByText('Not quite').filter({ visible: true })).toBeVisible();
    await expect(second.getByText('Correct', { exact: true })).toBeVisible();
    await expect(quiz.getByText('1 of 5 correct')).toBeVisible();

    await quiz.getByRole('button', { name: 'Try again' }).click();
    await expect(first.getByRole('radio', { name: 'switchMap' })).not.toBeChecked();
    await expect(quiz.getByText('1 of 5 correct')).toBeHidden();
  });

  test('answers with the keyboard', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Keyboard path on desktop only.');
    await page.goto(NOTE);
    const first = page.getByRole('region', { name: 'Check yourself' }).getByRole('group').first();
    await first.getByRole('radio', { name: 'switchMap' }).focus();
    await page.keyboard.press('Space');
    await expect(first.getByRole('radio', { name: 'switchMap' })).toBeChecked();
    await expect(first.getByText('Correct', { exact: true })).toBeVisible();
  });

  test('works without JavaScript, in Spanish', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`/es${NOTE}`);
    const first = page.getByRole('region', { name: 'Ponte a prueba' }).getByRole('group').first();
    await first.getByRole('radio', { name: 'concatMap' }).check();
    await expect(first.getByText('No exactamente').filter({ visible: true })).toBeVisible();
    await expect(first.getByText('Correcta', { exact: true })).toBeVisible();
    await context.close();
  });
});
