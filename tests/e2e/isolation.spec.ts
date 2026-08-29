import { test, expect } from './fixtures';

test.describe.serial('Chromium lifecycle regression', () => {
  test('stores a marker only inside this browser context', async ({ context, page }) => {
    expect(context.browser()?.contexts()).toHaveLength(1);
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('e2e-context-marker', 'only-this-test'));
    expect(await page.evaluate(() => localStorage.getItem('e2e-context-marker'))).toBe('only-this-test');
  });

  test('starts the following test in a new empty browser context', async ({ context, page }) => {
    expect(context.browser()?.contexts()).toHaveLength(1);
    await page.goto('/');
    expect(await page.evaluate(() => localStorage.getItem('e2e-context-marker'))).toBeNull();
  });
});
