import { test, expect } from './fixtures';
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
  for (const link of await page.locator('footer a').all()) {
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
});

test('@claim:demo-sandbox demo uses sample data in a separate namespace and can reset', async ({ page }) => {
  await page.goto('/');
  const realState = JSON.stringify({ version: 1, apps: [], corrections: [{ heard: 'private rule' }], settings: { theme: 'system' } });
  await page.evaluate((value) => localStorage.setItem('drb_web_preview_state', value), realState);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveTitle('Approved vocabulary — Demo — Dictation Repair Book');
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
  expect(await page.evaluate(() => localStorage.getItem('drb_web_preview_state'))).toBe(realState);
  await page.evaluate(() => {
    const current = JSON.parse(localStorage.getItem('demo:drb_web_preview_state')!);
    current.corrections.push({ ...current.corrections[0], id: 'demo-change', heard: 'post grass', intended: 'Postgres' });
    localStorage.setItem('demo:drb_web_preview_state', JSON.stringify(current));
  });
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:drb_web_preview_state'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:sb_license:dictation-repair-book'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('demo:sb_license_verdict:dictation-repair-book'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('drb_web_preview_state'))).toBe(realState);
});

test('@claim:no-account opens and uses the sample repair book without sign-in', async ({ page }) => {
  await page.goto('/demo/');
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
  await expect(page.locator('input[type="password"], [name*="email" i], [name*="user" i]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Test' }).click();
  await page.getByLabel('Unrepaired transcript').fill('met a pro lol');
  await page.getByRole('button', { name: 'Run repair' }).click();
  await expect(page.getByText('metoprolol', { exact: true })).toBeVisible();
});

test('the landing ?demo=1 alias opens the isolated sample path in one navigation', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await expect(page.getByText('Demo', { exact: true })).toBeVisible();
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
});

test('demo sections deep-link, restore with history, announce, and focus their h1', async ({ page }) => {
  await page.goto('/demo/#test');
  await expect(page.getByRole('heading', { name: 'Test your repair book' })).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Test your repair book');
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page).toHaveURL(/\/demo\/#settings$/);
  await expect(page.getByRole('heading', { name: 'Settings & data' })).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/demo\/#test$/);
  await expect(page.getByRole('heading', { name: 'Test your repair book' })).toBeFocused();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Settings & data' })).toBeFocused();
});

test('demo banner does not cover the active heading on a 390px phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo/');
  const rectangles = await page.evaluate(() => {
    const banner = document.querySelector('.demo-banner')!.getBoundingClientRect();
    const heading = document.querySelector('.work-header')!.getBoundingClientRect();
    return { overlap: banner.top < heading.bottom && heading.top < banner.bottom };
  });
  expect(rectangles.overlap).toBe(false);
});

test('@claim:portable-exports CSV uses the visible source name and exports remain available in demo', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Settings' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Remove Engineering notes' }).click();
  await page.getByRole('button', { name: 'Rules' }).click();
  await expect(page.getByText('Engineering notes', { exact: true }).first()).toBeVisible();
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

test('@claim:json-roundtrip exports and restores a complete repair book', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Settings' }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Back up JSON' }).click();
  const download = await downloadEvent;
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.locator('#import-json').setInputFiles(await download.path() as string);
  await expect(page.getByText(/imported into this local browser preview/)).toBeVisible();
  await page.getByRole('button', { name: 'Rules' }).click();
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
});

test('@claim:whisper-export copies unique intended terms', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'http://127.0.0.1:4173' });
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Copy Whisper prompt' }).click();
  await expect(page.getByText('Whisper vocabulary copied to the clipboard.')).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('metoprolol, Kubernetes, Niamh');
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
  await expect(page.getByText(/\$24 once/)).toBeVisible();
  await page.evaluate(() => {
    localStorage.setItem('sb_license:dictation-repair-book', 'valid-license');
    localStorage.setItem('sb_license_verdict:dictation-repair-book', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await page.getByLabel('What dictation wrote').fill('deploy cube');
  await page.getByLabel('What you meant').fill('deploy kube');
  await page.getByRole('button', { name: /Propose a rule/ }).click();
  await page.getByRole('button', { name: 'Approve rule' }).click();
  await page.getByRole('button', { name: 'Rules' }).click();
  await expect(page.getByText('kube', { exact: true })).toBeVisible();
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
  await page.evaluate(() => {
    localStorage.setItem('sb_license:dictation-repair-book', 'private-license');
    localStorage.setItem('sb_license_verdict:dictation-repair-book', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.getByRole('button', { name: 'Settings' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Erase all local data' }).click();
  await expect(page.getByText('Choose where corrections come from.')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('drb_web_preview_state'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:dictation-repair-book'))).toBeNull();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license_verdict:dictation-repair-book'))).toBeNull();
});

test('@claim:license-daily-cache verifies a cached valid license at most once per day', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/v1/products/dictation-repair-book/verify?license=*', async (route) => { calls++; await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true,"reason":"ok"}' }); });
  await page.goto('http://127.0.0.1:1420');
  await page.evaluate(() => {
    localStorage.setItem('sb_license:dictation-repair-book', 'cached-license');
    localStorage.setItem('sb_license_verdict:dictation-repair-book', JSON.stringify({ valid: true, checkedAt: Date.now() }));
  });
  await page.reload();
  await page.reload();
  expect(calls).toBe(0);
});

test('@claim:license-request-privacy sends only the license token for verification', async ({ page }) => {
  const requests: { url: string; body: string | null; headers: Record<string, string> }[] = [];
  await page.route('**/api/v1/products/dictation-repair-book/verify?license=*', async (route) => {
    requests.push({ url: route.request().url(), body: route.request().postData(), headers: route.request().headers() });
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":false,"reason":"invalid"}' });
  });
  await page.goto('http://127.0.0.1:1420');
  await page.evaluate(() => {
    localStorage.setItem('drb_web_preview_state', JSON.stringify({ version: 1, apps: [{ id: 'notes', name: 'Notes', enabled: true }], corrections: [{ id: 'private', before: 'met a pro lol', after: 'metoprolol', heard: 'met a pro lol', intended: 'metoprolol', appId: 'notes', createdAt: '2026-08-28T00:00:00.000Z', status: 'approved', hits: 0 }], settings: { theme: 'system' } }));
    localStorage.setItem('sb_license:dictation-repair-book', 'only-this-token');
    localStorage.setItem('sb_license_verdict:dictation-repair-book', JSON.stringify({ valid: false, checkedAt: 0 }));
  });
  await page.reload();
  await expect.poll(() => requests.length).toBe(1);
  const request = requests[0];
  const url = new URL(request.url);
  expect(url.origin).toBe('https://api.sociobot.in');
  expect([...url.searchParams.keys()]).toEqual(['license']);
  expect(url.searchParams.get('license')).toBe('only-this-token');
  expect(request.body).toBeNull();
  expect(JSON.stringify(request.headers)).not.toContain('metoprolol');
});

test('@claim:offline-demo opens the complete sample repair book offline after one visit', async ({ page, context }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.goto('/demo/');
  await expect(page.getByText('Kubernetes', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('service-worker controlled unknown routes keep their 404 status online and offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const online = await page.goto('/missing-after-service-worker');
  expect(online?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await context.setOffline(true);
  const offline = await page.goto('/missing-after-service-worker-offline');
  expect(offline?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('demo Rules and Settings fit 390px and primary touch targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/demo/');
  for (const name of ['Rules', 'Settings']) {
    await page.getByRole('button', { name }).click();
    const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(width.scroll, `${name} overflow`).toBe(width.client);
  }
  for (const name of ['Reset demo', 'Start for real']) {
    const box = await page.getByRole(name === 'Reset demo' ? 'button' : 'link', { name }).boundingBox();
    expect(box!.height, `${name} height`).toBeGreaterThanOrEqual(44);
    expect(box!.width, `${name} width`).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('keyboard navigation operates app sections and shows focus', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Settings' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Settings & data' })).toBeVisible();
  await page.keyboard.press('Alt+2');
  await expect(page.getByRole('heading', { name: 'Approved vocabulary' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete rule cube or net ease to Kubernetes' }).focus();
  expect(await page.getByRole('button', { name: 'Delete rule cube or net ease to Kubernetes' }).evaluate((element) => getComputedStyle(element).outlineWidth)).toBe('3px');
});

test('privacy and terms pages exist', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }
});

test('every public route has complete metadata and one semantic page heading', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.jpg$/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  }
});

test('@claim:website-privacy loads no third-party scripts, fonts, or analytics', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.route('**/api.github.com/**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"tag_name":"v0.1.2","assets":[]}' }));
  await page.goto('/');
  expect(requests.filter((url) => !['http://127.0.0.1:4173', 'https://api.github.com'].includes(new URL(url).origin))).toEqual([]);
  expect(requests.some((url) => /google-analytics|fonts\.google|segment|plausible/i.test(url))).toBe(false);
});

test('keyboard skip link moves focus into the landing main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});
