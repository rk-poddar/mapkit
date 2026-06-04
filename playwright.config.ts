import { defineConfig, devices } from "@playwright/test";

const CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  reporter: CI ? [["github"], ["list"]] : "list",
  use: {
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: [
    {
      command: "pnpm --filter @map-kit/example-next-basic exec next start --port 3101",
      url: "http://127.0.0.1:3101",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @map-kit/example-next-maplibre exec next start --port 3102",
      url: "http://127.0.0.1:3102",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @map-kit/example-next-mapbox exec next start --port 3103",
      url: "http://127.0.0.1:3103",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @map-kit/example-next-google-maps exec next start --port 3104",
      url: "http://127.0.0.1:3104",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @map-kit/docs exec next start --port 3105",
      url: "http://127.0.0.1:3105",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
  ],
});
