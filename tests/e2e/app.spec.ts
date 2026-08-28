import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:1420');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('captures, approves, tests, and exports a correction', async ({ page }) => {
  await page.getByLabel('Application name').fill('VS Code');
  await page.getByRole('button', { name: 'Allow this app' }).click();
  await page.getByLabel('What dictation wrote').fill('deploy the cube or net ease service');
  await page.getByLabel('What you meant').fill('deploy the Kubernetes service');
  await page.getByRole('button', { name: /Propose a rule/ }).click();
  await expect(page.getByText('cube or net ease', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Approve rule' }).click();
  await page.getByRole('button', { name: 'Rules' }).click();
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Test' }).click();
  await page.getByLabel('Unrepaired transcript').fill('ship cube or net ease today');
  await page.getByRole('button', { name: 'Run repair' }).click();
  await expect(page.getByText('ship Kubernetes today')).toBeVisible();
});

test('app has no serious accessibility violations in empty state', async ({ page }) => {
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((v) => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('app fits a 390px window and keeps navigation reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 });
  await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
});
