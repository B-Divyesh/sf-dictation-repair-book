import { test as base, expect, type BrowserContext, type Page } from '@playwright/test';

type IsolatedFixtures = {
  context: BrowserContext;
  page: Page;
};

/**
 * Chromium can occasionally terminate after a long shared browser session in
 * this Linux container. A browser and its context are deliberately test
 * scoped: test storage, service workers, and a crashed browser cannot leak
 * into any later accessibility or keyboard assertion.
 */
export const test = base.extend<IsolatedFixtures>({
  context: async ({ browserName, playwright }, use, testInfo) => {
    const browser = await playwright[browserName].launch();
    const projectUse = testInfo.project.use;
    const context = await browser.newContext({
      acceptDownloads: true,
      baseURL: typeof projectUse.baseURL === 'string' ? projectUse.baseURL : undefined,
      deviceScaleFactor: typeof projectUse.deviceScaleFactor === 'number' ? projectUse.deviceScaleFactor : undefined,
      hasTouch: typeof projectUse.hasTouch === 'boolean' ? projectUse.hasTouch : undefined,
      isMobile: typeof projectUse.isMobile === 'boolean' ? projectUse.isMobile : undefined,
      userAgent: typeof projectUse.userAgent === 'string' ? projectUse.userAgent : undefined,
      viewport: projectUse.viewport ?? undefined
    });

    try {
      await use(context);
    } finally {
      await context.close();
      await browser.close();
    }
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    try {
      await use(page);
    } finally {
      await page.close();
    }
  }
});

export { expect };
