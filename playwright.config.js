const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/specs',
  fullyParallel: true,
  retries: 1,
  workers: undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:8000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
