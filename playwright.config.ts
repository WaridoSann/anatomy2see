import { defineConfig, devices } from '@playwright/test';

/** Browser scenarios are separate from Vitest. Install Playwright browsers in a permitted QA environment. */
export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 20_000 },
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run dev -- --port 5173',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
  },
});
