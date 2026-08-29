import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: [
    { command: 'npm run build:site && npm run preview:site', url: 'http://127.0.0.1:4173', reuseExistingServer: true, timeout: 120_000 },
    { command: 'npm run dev', url: 'http://127.0.0.1:1420', reuseExistingServer: true, timeout: 120_000 }
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
