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

test('@claim:demo-sandbox demo uses sample data in a separate namespace and can reset', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('drb_web_preview_state', JSON.stringify({ apps: [], corrections: [{ heard: 'private rule' }] })));
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveTitle('Demo — Dictation Repair Book');
  await expect(page.getByText('Demo', { exact: true })).toBeVisible();
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
  await expect(page.getByText('private rule', { exact: true })).toHaveCount(0);
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
  await page.evaluate(() => localStorage.setItem('demo:drb_web_preview_state', JSON.stringify({ version: 1, apps: [], corrections: [], settings: { theme: 'system' } })));
  await page.reload();
  await expect(page.getByText('No approved rules yet.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
});

test('@claim:portable-exports CSV uses the visible source name and exports remain available in demo', async ({ page }) => {
  await page.goto('/demo/');
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const csv = await csvDownload;
  const csvText = await csv.path().then(async (path) => (await import('node:fs/promises')).readFile(path!, 'utf8'));
  expect(csvText).toContain('"Engineering notes"');
  expect(csvText).not.toContain('sample-engineering-notes');
  await page.getByRole('button', { name: 'Settings' }).click();
  const jsonDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up JSON' }).click();
  const json = await jsonDownload;
  expect(await json.suggestedFilename()).toBe('dictation-repair-book.json');
});

test('@claim:local-repair applies a shipped sample correction locally', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Test' }).click();
  await page.getByLabel('Unrepaired transcript').fill('Deploy the cube or net ease service.');
  await page.getByRole('button', { name: 'Run repair' }).click();
  await expect(page.getByText('Deploy the Kubernetes service.')).toBeVisible();
});

test('@claim:private-demo no network request leaves the product origin during the sample flow', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Test' }).click();
  await page.getByLabel('Unrepaired transcript').fill('met a pro lol');
  await page.getByRole('button', { name: 'Run repair' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:free-book keeps the first 25 approved rules free', async ({ page }) => {
  await page.goto('http://127.0.0.1:1420');
  await page.evaluate(() => localStorage.setItem('drb_web_preview_state', JSON.stringify({
    version: 1,
    apps: [{ id: 'notes', name: 'Notes', enabled: true }],
    corrections: Array.from({ length: 25 }, (_, index) => ({ id: String(index), before: `heard ${index}`, after: `written ${index}`, heard: `heard ${index}`, intended: `written ${index}`, appId: 'notes', createdAt: '2026-08-28T00:00:00.000Z', status: 'approved', hits: 0 })),
    settings: { theme: 'system' }
  })));
  await page.reload();
  await page.getByLabel('What dictation wrote').fill('deploy cube');
  await page.getByLabel('What you meant').fill('deploy kube');
  await page.getByRole('button', { name: /Propose a rule/ }).click();
  await expect(page.getByText('Free book full.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Unlock unlimited' })).toBeVisible();
});

test('@claim:license-backoff respects Retry-After without retrying', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/v1/products/dictation-repair-book/verify?license=*', async (route) => {
    calls++;
    await route.fulfill({ status: 429, headers: { 'Retry-After': '60' }, body: '{}' });
  });
  await page.goto('http://127.0.0.1:1420');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByLabel('Have a license? Paste it').fill('test-license');
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByText(/Verification is busy/)).toBeVisible();
  await page.getByLabel('Have a license? Paste it').fill('test-license');
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByText(/Verification is busy/)).toBeVisible();
  expect(calls).toBe(1);
});

test('@claim:erase-local-book removes browser-preview data after confirmation', async ({ page }) => {
  await page.goto('http://127.0.0.1:1420');
  await page.evaluate(() => localStorage.setItem('drb_web_preview_state', JSON.stringify({
    version: 1,
    apps: [{ id: 'notes', name: 'Notes', enabled: true }],
    corrections: [{ id: 'one', before: 'met a pro lol', after: 'metoprolol', heard: 'met a pro lol', intended: 'metoprolol', appId: 'notes', createdAt: '2026-08-28T00:00:00.000Z', status: 'approved', hits: 0 }],
    settings: { theme: 'system' }
  })));
  await page.reload();
  await page.getByRole('button', { name: 'Settings' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Erase all local data' }).click();
  await expect(page.getByText('Choose where corrections come from.')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('drb_web_preview_state'))).toBeNull();
});

test('privacy and terms pages exist', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) { await page.goto(path); await expect(page.locator('main h1')).toHaveCount(1); }
});

test('keyboard skip link moves focus into the landing main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});
