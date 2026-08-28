import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('landing page is accessible and keeps a usable download fallback', async ({ page }) => {
  await page.route('**/repos/B-Divyesh/sf-dictation-repair-book/releases/latest', (route) => route.abort());
  await page.goto('/');
  await expect(page).toHaveTitle(/Dictation Repair Book/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('link', { name: /available downloads/i })).toHaveAttribute('href', /releases\/latest/);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('landing page fits a 390px phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('privacy and terms pages exist', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) { await page.goto(path); await expect(page.locator('main h1')).toHaveCount(1); }
});
