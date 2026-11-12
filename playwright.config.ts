import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";
const channel = process.env.PLAYWRIGHT_CHANNEL;

export default defineConfig({
   testDir: "./tests/browser",
   workers: 1,
   timeout: 45_000,
   use: { baseURL, channel, trace: "retain-on-failure" },
   projects: [
      { name: "desktop", use: { ...devices["Desktop Chrome"] } },
      { name: "mobile", use: { ...devices["Pixel 7"] } },
   ],
   webServer: {
      command: "npm run start -- --port 3100",
      env: { NEXT_PUBLIC_SITE_ENV: "local", NEXT_TELEMETRY_DISABLED: "1" },
      url: baseURL,
      timeout: 60_000,
   },
});
