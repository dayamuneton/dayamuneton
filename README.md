# Daya Muneton

The portfolio, art shop, community, and emotional education guides share the Next.js Pages Router. The original artwork is in `public/`. The shared styles retain the original palette and gradient interpolation.

## Run locally

Use Node.js 24, npm, and Java 21 or newer. After `npm ci`, open two terminals in this directory.

```sh
npm run firebase:local
```

```sh
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The app uses Auth, Firestore, and Storage on loopback for the `demo-dayamuneton` project. Its database starts empty. Checkout and email are simulated and MailerLite is disabled. No service credentials are needed.

To review the optimized build locally, use `npm run build:local` followed by `npm start`. The optimized local build uses its own output directory.

## Verify

```sh
npm run check
npx playwright install chromium
npm run test:local
```

Stop any standalone emulator or preview before running `test:local`. It builds the local app, starts all three emulators, and runs browser tests at desktop and mobile widths. Tests insert synthetic artwork, create a demo account, and exercise Storage and the simulated APIs. You can set `PLAYWRIGHT_CHANNEL=msedge` to use an installed Edge browser.

Set `NEXT_PUBLIC_REPORT_VITALS=1` in `.env.local` to log Web Vitals in the browser console. The reports are local and have no analytics vendor or paid service dependency.

## Code layout

- `pages/` contains routes and API entry points.
- `features/home/` contains the homepage gallery navigation.
- `components/` contains shared UI, with admin, checkout, and navigation components grouped by purpose.
- `integrations/` contains Firebase, Stripe, and email platform adapters. `handlers/` contains order workflows.
- `tests/` contains unit tests, browser tests, and rules for the demo emulators.

## Production handoff

Production requires an explicit `NEXT_PUBLIC_SITE_ENV=production` in the deployment environment. The repository does not contain live service credentials or production Firebase rules. Review the existing Firestore and Storage rules, server-side catalog price verification, and payment fulfillment against the owner's configuration before releasing. The tests use test doubles for Stripe, Gmail, and MailerLite, so they do not verify the live integrations.

Configure MailerLite on the server with `MAILERLITE_API_KEY` and optionally `MAILERLITE_SUBSCRIBERS_API_URL`. Replace any key previously exposed by a `NEXT_PUBLIC_MAILERLITE_API_KEY` build. Keep live credentials in the hosting environment.
