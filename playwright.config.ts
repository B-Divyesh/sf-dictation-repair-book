import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  // The Chromium shell has previously crashed after a long shared CI session.
  // CI therefore executes serially; e2e/fixtures.ts creates a new browser and
  // context for every test, so no browser state or crash can spill into the
  // last test in the run.
  fullyParallel: false,
  workers: process.env.CI ? 1 : undefined,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: [
    {
      command: 'npm run build:site && exec ./node_modules/.bin/vite preview --config vite.site.config.ts --host 127.0.0.1 --port 4173 --strictPort',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: false,
      timeout: 120_000,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 }
    },
    {
      command: 'exec ./node_modules/.bin/vite --host 127.0.0.1 --port 1420 --strictPort',
      url: 'http://127.0.0.1:1420',
      reuseExistingServer: false,
      timeout: 120_000,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5_000 }
    }
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
