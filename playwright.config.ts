import { defineConfig, devices } from '@playwright/test';

const gaMeasurementId = 'G-TEST123456';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4321',
    env: {
      ...process.env,
      PUBLIC_GA_MEASUREMENT_ID: gaMeasurementId,
    },
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
