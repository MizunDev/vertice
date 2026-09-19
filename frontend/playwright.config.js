import { defineConfig } from '@playwright/test';

// This suite creates fixtures. It must only target an explicitly disposable stack.
if (!process.env.SMOKE_BASE_URL || process.env.SMOKE_DISPOSABLE !== '1') {
  throw new Error('E2E requires SMOKE_BASE_URL and SMOKE_DISPOSABLE=1 for a disposable database.');
}

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  retries: 0,
  timeout: 90_000,
  globalTimeout: 180_000,
  expect: { timeout: 10_000 },
  reporter: 'line',
  use: {
    baseURL: process.env.SMOKE_BASE_URL,
    browserName: 'chromium',
    viewport: { width: 1440, height: 1000 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
