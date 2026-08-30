import { test, expect } from './fixtures';
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
  await page.getByRole('link', { name: 'Rules' }).click();
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
  await page.getByLabel('Find a rule').fill('Kuber');
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Delete rule cube or net ease to Kubernetes' }).click();
  await expect(page.getByText('Kubernetes', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Test' }).click();
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
  await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(width.scroll).toBe(width.client);
});

test('web preview identifies its release version without exposing book data', async ({ page }) => {
  await expect(page.getByText('v0.1.5 · local preview', { exact: true })).toBeVisible();
});

test('@claim:native-sample-isolation keeps the native sample away from real vault and license storage', async ({ page }) => {
  await page.addInitScript(() => {
    const realState = { version: 1, apps: [], corrections: [], settings: { theme: 'system' } };
    Object.defineProperty(window, '__TAURI_INTERNALS__', {
      configurable: true,
      value: {
        invoke: async (command: string) => {
          (window as Window & { __nativeCalls?: string[] }).__nativeCalls!.push(command);
          if (command === 'load_state') return realState;
          return undefined;
        }
      }
    });
    (window as Window & { __nativeCalls?: string[] }).__nativeCalls = [];
    localStorage.setItem('sb_license:dictation-repair-book', 'real-license');
    localStorage.setItem('sb_license_verdict:dictation-repair-book', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.goto('http://127.0.0.1:1420');
  await page.getByRole('button', { name: 'Load sample repair book' }).click();
  await page.getByRole('link', { name: 'Settings' }).click();
  await expect(page.getByRole('heading', { name: 'Sample purchases are disabled' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove from device' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset sample data' }).click();
  await page.getByRole('button', { name: 'Start for real' }).click();
  expect(await page.evaluate(() => (window as Window & { __nativeCalls?: string[] }).__nativeCalls)).toEqual(['load_state']);
  expect(await page.evaluate(() => localStorage.getItem('sb_license:dictation-repair-book'))).toBe('real-license');
  expect(await page.evaluate(() => localStorage.getItem('sb_license_verdict:dictation-repair-book'))).toContain('"valid":true');
});

test('invalid stored and imported data recovers without replacing the current book', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('drb_web_preview_state', '{"version":1,"corrections":[]}'));
  await page.reload();
  await expect(page.getByText(/invalid and has been removed/)).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('drb_web_preview_state'))).toBeNull();

  await page.getByLabel('Application name').fill('VS Code');
  await page.getByRole('button', { name: 'Allow this app' }).click();
  await page.getByRole('link', { name: 'Settings' }).click();
  await page.locator('#import-json').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{"version":1,"corrections":[]}') });
  await expect(page.getByText(/current book was not changed/)).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: 'Settings' }).click();
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

test('@claim:revoked-license-locks paid approvals after verification', async ({ page }) => {
  await page.route('**/api/v1/products/dictation-repair-book/verify?license=*', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":false,"reason":"revoked"}' }));
  await page.evaluate(() => {
    localStorage.setItem('sb_license:dictation-repair-book', 'revoked-token');
    localStorage.setItem('sb_license_verdict:dictation-repair-book', JSON.stringify({ valid: true, checkedAt: 0 }));
    localStorage.setItem('drb_web_preview_state', JSON.stringify({
      version: 1,
      apps: [{ id: 'notes', name: 'Notes', enabled: true }],
      corrections: Array.from({ length: 25 }, (_, index) => ({ id: String(index), before: `heard ${index}`, after: `written ${index}`, heard: `heard ${index}`, intended: `written ${index}`, appId: 'notes', createdAt: '2026-08-28T00:00:00.000Z', status: 'approved', hits: 0 })),
      settings: { theme: 'system' }
    }));
  });
  const response = page.waitForResponse((candidate) => candidate.url().includes('/verify?license=') && candidate.status() === 200);
  await page.reload();
  await response;
  await page.getByLabel('What dictation wrote').fill('deploy cube');
  await page.getByLabel('What you meant').fill('deploy kube');
  await page.getByRole('button', { name: /Propose a rule/ }).click();
  await expect(page.getByText('Free book full.')).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sb_license_verdict:dictation-repair-book')!).reason)).toBe('revoked');
});
