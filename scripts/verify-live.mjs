import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const [base, evidence] = process.argv.slice(2);
if (!base || !evidence) throw new Error('Usage: node scripts/verify-live.mjs <https-url> <evidence-directory>');

const origin = new URL(base).origin;
const report = { base: origin, checkedAt: new Date().toISOString(), routes: {}, desktop: {}, mobile: {}, offline: {} };
const serious = (results) => results.violations
  .filter((item) => ['serious', 'critical'].includes(item.impact || ''))
  .map(({ id, impact, help }) => ({ id, impact, help }));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const normal = (text) => text.replace(/\s+/g, ' ').trim();

await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/polish-four-missing-page']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page }).analyze();
    const details = {
      status: response?.status(), title: await page.title(), lang: await page.locator('html').getAttribute('lang'),
      h1: await page.locator('h1').count(), main: await page.locator('main').count(),
      missingAlt: await page.locator('img:not([alt])').count(), seriousOrCritical: serious(axe), errors
    };
    report.routes[path] = details;
    const expectedStatus = path.includes('missing') ? 404 : 200;
    assert(details.status === expectedStatus, `${path} returned ${details.status}, not ${expectedStatus}`);
    assert(details.lang === 'en' && details.h1 === 1 && details.main === 1, `${path} has an incomplete semantic shell`);
    assert(details.missingAlt === 0 && details.seriousOrCritical.length === 0, `${path} has an accessibility regression`);
    const unexpected = errors.filter((error) => !path.includes('missing') || !/404/.test(error));
    assert(unexpected.length === 0, `${path} logged ${unexpected.join(' | ')}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    const requests = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(origin, { waitUntil: 'networkidle' });
    const hero = {
      h1: normal(await page.locator('h1').innerText()),
      audience: normal(await page.locator('.hero-copy > .lede').innerText()),
      action: await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox(),
      result: await page.getByText('Opens a separate sample repair book. Nothing enters your real book.').boundingBox(),
      facts: await page.locator('.first-screen-facts').boundingBox()
    };
    assert(hero.h1 === 'Turn dictation corrections into reusable rules.', `unexpected headline: ${hero.h1}`);
    assert(hero.audience === 'For dictation users with uncommon names, medications, code terms, or workplace jargon, this turns explicit corrections into reusable rules.', `unexpected audience: ${hero.audience}`);
    assert(hero.action && hero.result && hero.facts && hero.facts.y + hero.facts.height <= 900, 'first screen is incomplete on desktop');
    assert(await page.getByText('The app finds the changed words.').isVisible(), 'proposal wording regressed');
    assert(await page.getByText('The native app encrypts the repair-book file before saving it on your device.').isVisible(), 'privacy fact regressed');
    assert(!await page.getByText(/Hero artwork is original AI-generated/i).count(), 'removed provenance claim is still public');
    await page.locator('.hero-art img').evaluate((image) => image.decode());
    for (const image of await page.locator('.walkthrough-frames img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((node) => node.decode());
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${evidence}/live-landing-desktop.png`, fullPage: true });

    await page.keyboard.press('Tab');
    assert(await page.getByRole('link', { name: 'Skip to content' }).evaluate((node) => node === document.activeElement), 'skip link is not first');
    await page.keyboard.press('Enter');
    assert(await page.locator('#main').evaluate((node) => node === document.activeElement), 'skip link does not focus main');

    const sentinel = JSON.stringify({ version: 1, apps: [], corrections: [{ heard: 'real sentinel' }], settings: { theme: 'system' } });
    await page.evaluate((value) => localStorage.setItem('drb_web_preview_state', value), sentinel);
    await page.goto(`${origin}/?demo=1`, { waitUntil: 'networkidle' });
    assert(new URL(page.url()).pathname === '/demo/' && new URL(page.url()).search === '?demo=1', `demo alias opened ${page.url()}`);
    assert(await page.getByLabel('Demo controls').getByText('Demo', { exact: true }).isVisible(), 'demo banner is missing');
    for (const term of ['Kubernetes', 'metoprolol', 'Niamh']) assert(await page.getByText(term, { exact: true }).first().isVisible(), `sample ${term} is missing`);
    assert(await page.evaluate(() => localStorage.getItem('drb_web_preview_state')) === sentinel, 'demo read real preview storage');
    const foreignDemoRequests = requests.filter((url) => new URL(url).origin !== origin);
    assert(foreignDemoRequests.length === 0, `demo made external requests: ${foreignDemoRequests.join(', ')}`);
    await page.screenshot({ path: `${evidence}/live-demo-desktop.png`, fullPage: true });

    await page.getByRole('link', { name: 'Test' }).click();
    assert(new URL(page.url()).search === '?demo=1&view=test', `Test opened ${page.url()}`);
    await page.goBack();
    const defaultRulesHeading = page.getByRole('heading', { name: 'Approved rules' });
    await page.waitForFunction(() => document.activeElement?.tagName === 'H1' && document.activeElement.textContent?.includes('Approved rules'));
    const backState = {
      url: page.url(),
      heading: await defaultRulesHeading.innerText(),
      focused: await defaultRulesHeading.evaluate((node) => node === document.activeElement),
      announcement: await page.locator('#route-announcement').innerText()
    };
    assert(new URL(backState.url).search === '?demo=1', `Back restored ${backState.url}, not the default demo URL`);
    assert(backState.focused, 'Back did not focus the default Rules heading');
    assert(backState.announcement === 'Approved rules', 'Back did not announce the default Rules view');
    await page.goForward();
    const forwardTestHeading = page.getByRole('heading', { name: 'Test your repair book' });
    await page.waitForFunction(() => document.activeElement?.tagName === 'H1' && document.activeElement.textContent?.includes('Test your repair book'));
    const forwardState = {
      url: page.url(),
      heading: await forwardTestHeading.innerText(),
      focused: await forwardTestHeading.evaluate((node) => node === document.activeElement),
      announcement: await page.locator('#route-announcement').innerText()
    };
    assert(new URL(forwardState.url).search === '?demo=1&view=test', `Forward restored ${forwardState.url}, not Test`);
    assert(forwardState.focused, 'Forward did not focus the Test heading');
    assert(forwardState.announcement === 'Test your repair book', 'Forward did not announce Test');

    await page.goto(`${origin}/demo/?view=test`, { waitUntil: 'networkidle' });
    const testHeading = page.getByRole('heading', { name: 'Test your repair book' });
    assert(await testHeading.evaluate((node) => node === document.activeElement), 'direct demo view did not focus its h1');
    await page.getByLabel('Unrepaired transcript').fill('Deploy the cube or net ease service.');
    await page.getByRole('button', { name: 'Run repair' }).click();
    assert(await page.getByText('Deploy the Kubernetes service.').isVisible(), 'demo rule did not repair text locally');
    await page.getByRole('link', { name: 'Settings' }).click();
    await page.goBack({ waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.activeElement?.tagName === 'H1' && document.activeElement.textContent?.includes('Test your repair book'));
    assert(await testHeading.evaluate((node) => node === document.activeElement), 'Back did not restore the demo view focus');

    await page.goto(`${origin}/demo/?demo=1`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('demo:drb_web_preview_state', JSON.stringify({ version: 1, apps: [], corrections: [], settings: { theme: 'system' } })));
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Reset demo' }).click();
    assert(await page.getByText('Kubernetes', { exact: true }).isVisible(), 'Reset demo did not restore shipped data');
    await page.getByRole('link', { name: 'Start for real' }).click();
    assert(await page.evaluate(() => localStorage.getItem('demo:drb_web_preview_state')) === null, 'Start for real retained demo data');
    assert(await page.evaluate(() => localStorage.getItem('drb_web_preview_state')) === sentinel, 'Start for real changed real preview data');
    report.desktop = { hero, history: { back: backState, forward: forwardState }, foreignDemoRequests, errors, finalUrl: page.url() };
    assert(errors.length === 0, `desktop flow logged ${errors.join(' | ')}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 621, height: 844 } });
    const page = await context.newPage();
    const widths = {};
    for (const width of [621, 640, 700, 800]) {
      await page.setViewportSize({ width, height: 844 });
      widths[width] = {};
      for (const view of ['capture', 'rules', 'test', 'settings']) {
        await page.goto(`${origin}/demo/?demo=1&view=${view}`, { waitUntil: 'networkidle' });
        const layout = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
        widths[width][view] = layout;
        assert(layout[0] === layout[1], `${width}px ${view} demo route overflows`);
      }
    }
    report.intermediateWidths = widths;
    await page.screenshot({ path: `${evidence}/live-demo-settings-640.png`, fullPage: true });
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme: 'dark' });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(origin, { waitUntil: 'networkidle' });
    const landing = {
      width: await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]),
      facts: await page.locator('.first-screen-facts').boundingBox(),
      axe: serious(await new AxeBuilder({ page }).analyze())
    };
    assert(landing.width[0] === landing.width[1] && landing.facts && landing.facts.y + landing.facts.height <= 844, 'mobile landing layout regressed');
    assert(landing.axe.length === 0, 'mobile landing has serious/critical Axe findings');
    await page.screenshot({ path: `${evidence}/live-landing-390.png`, fullPage: true });
    await page.goto(`${origin}/demo/?demo=1`, { waitUntil: 'networkidle' });
    const demo = await page.evaluate(() => {
      const box = (selector) => document.querySelector(selector)?.getBoundingClientRect();
      const banner = box('.demo-banner');
      const heading = box('.work-header');
      return {
        width: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
        overlap: !!banner && !!heading && banner.top < heading.bottom && heading.top < banner.bottom,
        reducedScroll: getComputedStyle(document.documentElement).scrollBehavior
      };
    });
    const demoAxe = serious(await new AxeBuilder({ page }).analyze());
    assert(demo.width[0] === demo.width[1] && !demo.overlap && demo.reducedScroll === 'auto', 'mobile demo layout or reduced motion regressed');
    assert(demoAxe.length === 0, 'mobile demo has serious/critical Axe findings');
    await page.screenshot({ path: `${evidence}/live-demo-390.png`, fullPage: true });
    report.mobile = { landing, demo, demoAxe, errors };
    assert(errors.length === 0, `mobile flow logged ${errors.join(' | ')}`);
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(origin, { waitUntil: 'networkidle' });
    if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) await page.reload({ waitUntil: 'networkidle' });
    assert(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), 'service worker did not control the returning page');
    await context.setOffline(true);
    const demo = await page.goto(`${origin}/demo`);
    assert(demo?.status() === 200 && await page.getByText('Kubernetes', { exact: true }).isVisible(), 'offline demo did not open');
    const missing = await page.goto(`${origin}/polish-four-offline-missing`);
    assert(missing?.status() === 404 && await page.getByRole('heading', { name: 'Page not found' }).isVisible(), 'offline missing route lost its 404');
    report.offline = { demoStatus: demo?.status(), missingStatus: missing?.status() };
    await context.close();
  }

  await writeFile(`${evidence}/live-route-check.json`, `${JSON.stringify(report.routes, null, 2)}\n`);
  await writeFile(`${evidence}/live-a11y.json`, `${JSON.stringify(Object.fromEntries(Object.entries(report.routes).map(([path, route]) => [path, route.seriousOrCritical])), null, 2)}\n`);
  await writeFile(`${evidence}/live-recheck.json`, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
