import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT || 3100);
const baseURL = `http://127.0.0.1:${port}`;
const channel = process.env.PLAYWRIGHT_CHANNEL;

export default defineConfig({
   testDir: "./tests/browser",
   workers: 1,
   timeout: 45_000,
   use: { baseURL, trace: "retain-on-failure" },
   projects: [
      { name: "desktop", use: { ...devices["Desktop Chrome"], channel } },
      { name: "mobile", use: { ...devices["Pixel 7"], channel } },
      ...(process.env.PLAYWRIGHT_ALL_BROWSERS === "1" ? [
         { name: "firefox", use: { ...devices["Desktop Firefox"] } },
         { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
      ] : []),
   ],
   webServer: {
      command: `npm run start -- --port ${port}`,
      env: {
         NEXT_PUBLIC_SITE_ENV: "local", NEXT_TELEMETRY_DISABLED: "1",
         // Match Vercel's CommonJS loader, which rejects require() of ESM dependencies.
         NODE_OPTIONS: [process.env.NODE_OPTIONS, "--no-experimental-require-module"].filter(Boolean).join(" "),
      },
      url: baseURL,
      timeout: 60_000,
   },
});
