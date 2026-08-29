import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('http://127.0.0.1:1420');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('@claim:rule-management captures, approves, and tests a correction', async ({ page }) => {
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

test('invalid stored and imported data recovers without replacing the current book', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('drb_web_preview_state', '{"version":1,"corrections":[]}'));
  await page.reload();
  await expect(page.getByText(/invalid and has been removed/)).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('drb_web_preview_state'))).toBeNull();

  await page.getByLabel('Application name').fill('VS Code');
  await page.getByRole('button', { name: 'Allow this app' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.locator('#import-json').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{"version":1,"corrections":[]}') });
  await expect(page.getByText(/current book was not changed/)).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByText('VS Code', { exact: true })).toBeVisible();
});

test('@claim:clipboard-on-command reads clipboard text only after the user asks', async ({ page }) => {
  await page.getByLabel('Application name').fill('Notes');
  await page.getByRole('button', { name: 'Allow this app' }).click();
  await page.evaluate(() => {
    sessionStorage.setItem('clipboardReads', '0');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      readText: async () => { sessionStorage.setItem('clipboardReads', String(Number(sessionStorage.getItem('clipboardReads')) + 1)); return 'spoken text'; },
      writeText: async () => undefined
    } });
  });
  expect(await page.evaluate(() => sessionStorage.getItem('clipboardReads'))).toBe('0');
  await page.getByRole('button', { name: 'Paste clipboard' }).first().click();
  await expect(page.getByLabel('What dictation wrote')).toHaveValue('spoken text');
  expect(await page.evaluate(() => sessionStorage.getItem('clipboardReads'))).toBe('1');
});

test('@claim:license-return stores a returned license and removes it from the address bar', async ({ page }) => {
  await page.route('**/api/v1/products/dictation-repair-book/verify?license=*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' }));
  await page.goto('http://127.0.0.1:1420/?license=returned-token');
  await expect(page).toHaveURL('http://127.0.0.1:1420/');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:dictation-repair-book'))).toBe('returned-token');
});
