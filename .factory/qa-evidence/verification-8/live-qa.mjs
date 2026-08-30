import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const base = 'https://dictation-repair-book.sociobot.in';
const evidence = '.factory/qa-evidence/verification-8';
const report = { base, checkedAt: new Date().toISOString(), routes: {}, desktop: {}, mobile: {}, offline: {}, download: {}, findings: [] };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const serious = (axe) => axe.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''));

const browser = await chromium.launch({ headless: true });

try {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/does-not-exist-verification-8']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page }).analyze();
    const details = {
      status: response?.status(),
      title: await page.title(),
      lang: await page.locator('html').getAttribute('lang'),
      h1: await page.locator('h1').count(),
      main: await page.locator('main').count(),
      missingAlt: await page.locator('img:not([alt])').count(),
      seriousOrCritical: serious(axe).map(({ id, impact, help }) => ({ id, impact, help })),
      errors,
    };
    report.routes[path] = details;
    assert(details.status === (path.includes('does-not-exist') ? 404 : 200), `${path}: unexpected status ${details.status}`);
    assert(details.lang === 'en' && details.h1 === 1 && details.main === 1, `${path}: semantic shell failed`);
    assert(details.missingAlt === 0, `${path}: image missing alt`);
    assert(details.seriousOrCritical.length === 0, `${path}: serious/critical Axe finding`);
    const unexpectedErrors = path.includes('does-not-exist')
      ? details.errors.filter((item) => !/Failed to load resource: the server responded with a status of 404/.test(item))
      : details.errors;
    assert(unexpectedErrors.length === 0, `${path}: browser errors ${unexpectedErrors.join(' | ')}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    page.on('request', (request) => requests.push({ method: request.method(), url: request.url(), type: request.resourceType() }));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    page.on('requestfailed', (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));

    const landingResponse = await page.goto(base, { waitUntil: 'networkidle' });
    const hero = {
      h1: (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim(),
      audience: (await page.locator('.hero-copy > .lede').innerText()).replace(/\s+/g, ' ').trim(),
      actionVisible: await page.getByRole('link', { name: 'Try it with sample data' }).isVisible(),
      resultVisible: await page.getByText('Opens a separate sample repair book. Nothing enters your real book.').isVisible(),
      actionBox: await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox(),
      resultBox: await page.getByText('Opens a separate sample repair book. Nothing enters your real book.').boundingBox(),
    };
    assert(hero.h1 === 'Turn dictation corrections into reusable rules.', `unexpected first-read h1: ${hero.h1}`);
    assert(/dictation users.*names.*medications.*code terms.*workplace jargon/i.test(hero.audience), `audience unclear: ${hero.audience}`);
    assert(hero.actionVisible && hero.resultVisible, 'sample action/result not visible');
    assert(hero.resultBox.y + hero.resultBox.height <= 900, 'sample action result below desktop fold');
    await page.screenshot({ path: `${evidence}/landing-desktop.png`, fullPage: true });

    await page.keyboard.press('Tab');
    assert(await page.getByRole('link', { name: 'Skip to content' }).evaluate((node) => node === document.activeElement), 'skip link is not first focus target');
    const skipOutline = await page.getByRole('link', { name: 'Skip to content' }).evaluate((node) => getComputedStyle(node).outlineWidth);
    await page.keyboard.press('Enter');
    assert(await page.locator('#main').evaluate((node) => node === document.activeElement), 'skip link does not move focus to main');

    await page.getByRole('link', { name: 'Try it with sample data' }).click();
    await page.waitForLoadState('networkidle');
    assert(new URL(page.url()).pathname === '/demo/', `demo action opened ${page.url()}`);
    assert(await page.getByLabel('Demo controls').getByText('Demo', { exact: true }).isVisible(), 'persistent demo banner missing');
    for (const term of ['Kubernetes', 'metoprolol', 'Niamh']) assert(await page.getByText(term, { exact: true }).first().isVisible(), `sample term missing: ${term}`);

    const appNav = page.getByRole('navigation', { name: 'Repair book sections' });
    await appNav.getByRole('link', { name: /^Test/ }).focus();
    const appFocusOutline = await appNav.getByRole('link', { name: /^Test/ }).evaluate((node) => getComputedStyle(node).outlineWidth);
    await page.keyboard.press('Enter');
    assert(await page.getByRole('heading', { name: 'Test your repair book' }).evaluate((node) => node === document.activeElement), 'app route did not focus h1');

    const input = page.getByLabel('Unrepaired transcript');
    await page.getByRole('button', { name: 'Run repair' }).click();
    const emptyValidity = await input.evaluate((node) => ({ valid: node.checkValidity(), message: node.validationMessage }));
    assert(!emptyValidity.valid && emptyValidity.message.length > 0, 'empty required transcript accepted');
    await input.fill('Deploy the cube or net ease service; then call Neem about met a pro lol.');
    await page.getByRole('button', { name: 'Run repair' }).click();
    const repaired = await page.locator('.result-text').innerText();
    assert(repaired === 'Deploy the Kubernetes service; then call Niamh about metoprolol.', `unexpected repair: ${repaired}`);
    assert(await page.getByText('3 rules applied: Kubernetes, metoprolol, Niamh').isVisible(), 'applied-rule feedback is wrong');

    await appNav.getByRole('link', { name: /^Capture/ }).click();
    await page.getByLabel('What dictation wrote').fill('No term changed.');
    await page.getByLabel('What you meant').fill('No term changed.');
    await page.getByRole('button', { name: /Propose a rule/ }).click();
    assert(await page.getByText('I could not isolate a changed term. Include one complete before and after phrase.').isVisible(), 'identical-input recovery message missing');
    await page.getByLabel('What dictation wrote').fill('Restart the ray dis cache.');
    await page.getByLabel('What you meant').fill('Restart the Redis cache.');
    await page.getByRole('button', { name: /Propose a rule/ }).click();
    assert(await page.getByText('ray dis', { exact: true }).isVisible(), 'valid recovery proposal missing');
    await page.getByRole('button', { name: 'Approve rule' }).click();
    assert(await page.getByText(/Rule approved in this local browser preview/).isVisible(), 'approval feedback missing');

    await appNav.getByRole('link', { name: /^Rules/ }).click();
    await page.getByLabel('Find a rule').fill('not-present');
    assert(await page.locator('tbody tr:visible').count() === 0, 'search no-result boundary failed');
    await page.getByLabel('Find a rule').fill('redis');
    assert(await page.getByText('Redis', { exact: true }).isVisible(), 'search recovery failed');
    await page.getByRole('button', { name: 'Delete rule ray dis to Redis' }).click();
    assert(await page.getByRole('button', { name: 'Undo' }).isVisible(), 'delete lacks undo');
    await page.getByRole('button', { name: 'Undo' }).click();
    assert(await page.getByText('Redis', { exact: true }).isVisible(), 'undo did not restore rule');
    const csvEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export CSV' }).click();
    const csv = await csvEvent;
    assert((await csv.suggestedFilename()) === 'dictation-rules.csv', 'CSV filename wrong');

    await appNav.getByRole('link', { name: /^Settings/ }).click();
    await page.locator('#import-json').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from('{not-json') });
    assert(await page.getByText('That file is not a valid Dictation Repair Book backup. Your current book was not changed.').isVisible(), 'invalid import recovery missing');
    await appNav.getByRole('link', { name: /^Rules/ }).click();
    assert(await page.getByText('Redis', { exact: true }).isVisible(), 'invalid import changed current data');

    const demoAxe = await new AxeBuilder({ page }).analyze();
    const foreign = requests.filter((item) => new URL(item.url).origin !== base);
    report.desktop = {
      status: landingResponse?.status(), hero, skipOutline, appFocusOutline, emptyValidity,
      repaired, csvName: await csv.suggestedFilename(),
      seriousOrCritical: serious(demoAxe).map(({ id, impact, help }) => ({ id, impact, help })),
      requestCount: requests.length, foreignRequests: foreign, errors,
    };
    assert(skipOutline === '3px' && appFocusOutline === '3px', `focus outlines are ${skipOutline}/${appFocusOutline}`);
    assert(report.desktop.seriousOrCritical.length === 0, 'demo has serious/critical Axe findings');
    assert(foreign.length === 0, `demo flow sent external requests: ${JSON.stringify(foreign)}`);
    assert(errors.length === 0, `desktop flow errors: ${errors.join(' | ')}`);
    await page.screenshot({ path: `${evidence}/demo-desktop.png`, fullPage: true });
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme: 'dark' });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    await page.goto(base, { waitUntil: 'networkidle' });
    const landingWidth = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    const facts = await page.locator('.first-screen-facts').boundingBox();
    const landingAxe = await new AxeBuilder({ page }).analyze();
    await page.screenshot({ path: `${evidence}/landing-mobile.png`, fullPage: true });
    await page.getByRole('link', { name: 'Try it with sample data' }).click();
    const demoWidth = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    const geometry = await page.evaluate(() => {
      const banner = document.querySelector('.demo-banner').getBoundingClientRect();
      const heading = document.querySelector('.work-header').getBoundingClientRect();
      const targets = [...document.querySelectorAll('a[href], button, input, select, textarea')]
        .filter((node) => { const rect = node.getBoundingClientRect(); const style = getComputedStyle(node); return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden'; })
        .map((node) => { const rect = node.getBoundingClientRect(); return { label: (node.getAttribute('aria-label') || node.textContent || node.tagName).trim().replace(/\s+/g, ' '), width: rect.width, height: rect.height }; });
      return { overlap: banner.top < heading.bottom && heading.top < banner.bottom, undersized: targets.filter((item) => item.width < 44 || item.height < 44), scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
    });
    const demoAxe = await new AxeBuilder({ page }).analyze();
    await page.screenshot({ path: `${evidence}/demo-mobile.png`, fullPage: true });
    report.mobile = { landingWidth, facts, demoWidth, geometry, landingAxe: serious(landingAxe), demoAxe: serious(demoAxe), errors };
    assert(landingWidth.scroll === landingWidth.client && demoWidth.scroll === demoWidth.client, '390px horizontal overflow');
    assert(facts.y + facts.height <= 844, 'mobile first-screen facts are below fold');
    assert(!geometry.overlap, 'demo banner overlaps heading');
    if (geometry.undersized.length) report.findings.push({ severity: 'medium', id: 'mobile-touch-target', details: geometry.undersized });
    assert(geometry.scrollBehavior === 'auto', `reduced-motion scroll behavior is ${geometry.scrollBehavior}`);
    assert(report.mobile.landingAxe.length === 0 && report.mobile.demoAxe.length === 0, 'mobile Axe serious/critical finding');
    assert(errors.length === 0, `mobile errors: ${errors.join(' | ')}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { const registration = await navigator.serviceWorker.ready; await registration.update(); });
    if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) await page.reload({ waitUntil: 'networkidle' });
    const controlled = await page.evaluate(() => Boolean(navigator.serviceWorker.controller));
    await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
    await context.setOffline(true);
    const offlineResponse = await page.goto(`${base}/demo`);
    const termVisible = await page.getByText('Kubernetes', { exact: true }).isVisible();
    const missingResponse = await page.goto(`${base}/missing-offline-verification-8`);
    const missingHeading = await page.getByRole('heading', { name: 'Page not found' }).isVisible();
    report.offline = { controlled, demoStatus: offlineResponse?.status(), termVisible, missingStatus: missingResponse?.status(), missingHeading, errors };
    assert(controlled && offlineResponse?.status() === 200 && termVisible, 'offline demo reload failed');
    assert(missingResponse?.status() === 404 && missingHeading, 'offline unknown route did not retain 404');
    const unexpectedOfflineErrors = errors.filter((item) => !/Failed to load resource: the server responded with a status of 404/.test(item));
    assert(unexpectedOfflineErrors.length === 0, `offline flow errors: ${unexpectedOfflineErrors.join(' | ')}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const requests = [];
    const errors = [];
    page.on('request', (request) => requests.push(request.url()));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    await page.goto(base, { waitUntil: 'networkidle' });
    const before = requests.filter((url) => new URL(url).origin === 'https://api.github.com').length;
    await page.getByRole('link', { name: /download for your computer/i }).click();
    await page.waitForFunction(() => document.querySelector('#platform-download')?.textContent?.startsWith('Download for'));
    const asset = await page.locator('#platform-download').getAttribute('href');
    const after = requests.filter((url) => new URL(url).origin === 'https://api.github.com').length;
    report.download = { before, after, asset, note: await page.locator('#platform-note').innerText(), errors };
    assert(before === 0 && after === 1, `GitHub release lookup count ${before}/${after}`);
    assert(asset?.includes('/releases/download/v0.1.5/'), `download does not target v0.1.5: ${asset}`);
    assert(errors.length === 0, `download flow errors: ${errors.join(' | ')}`);
    await context.close();
  }

  await writeFile(`${evidence}/live-qa.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
