# Daya Muneton

The portfolio, art shop, community, and emotional education guides share the Next.js Pages Router. Public pages, account screens, and admin share the navy layout, navigation, and loading feedback.

## Run locally

Use Node.js 24, npm, and Java 21 or newer. After `npm ci`, open two terminals in this directory.

```sh
npm run firebase:local
```

```sh
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). The app uses Auth, Firestore, and Storage on loopback for the `demo-dayamuneton` project. Its database starts empty. With the emulators running, use `npm run seed:local` to add sample artwork and guides for reviewing the collection and detail pages. Checkout and email are simulated and MailerLite is disabled. No service credentials are needed.

To review the optimized build locally, use `npm run build:local` followed by `npm start`. The optimized local build uses its own output directory.

## Verify

```sh
npm run check
npx playwright install chromium
npm run test:local
```

Stop any standalone emulator or preview before running `test:local`. It builds the local app, starts all three emulators, and runs browser tests at desktop and mobile widths. Tests cover the public route families, cart and sign-in, catalog editing, Storage uploads, and simulated checkout and email. You can set `PLAYWRIGHT_CHANNEL=msedge` to use an installed Edge browser.

For the cross-browser run, install Firefox and WebKit with `npx playwright install firefox webkit`, then set `PLAYWRIGHT_ALL_BROWSERS=1`. Set `PLAYWRIGHT_PORT` to use a different local test port. With the demo emulators already running, use `npm run build:local` and `npm run test:browser`.

Set `NEXT_PUBLIC_REPORT_VITALS=1` in `.env.local` to log Web Vitals in the browser console. The reports are local and have no analytics vendor or paid service dependency.

## Artwork

The original artwork stays in `public/`. The bundled gallery assets use prebuilt responsive WebP images with JPEG or PNG fallbacks. Image URLs are versioned so browsers can reuse cached copies. Product photos added through Firebase still use Next.js image optimization.

Run `npm run artwork:generate` after changing a bundled artwork source. Commit the updated image variants in `public/artwork/` and the manifest in `lib/artwork/variants.json` together. The generator runs locally.

## Code layout

- `pages/` contains routes and API entry points.
- `features/home/` contains the homepage gallery and support flow.
- `features/catalog/` contains collection data access and shared product UI.
- `features/admin/` contains catalog management and editors.
- `features/account/` contains the sign-in and registration form.
- `components/` contains shared UI, with checkout and navigation components grouped by purpose.
- `integrations/` contains Firebase, Stripe, and email platform adapters. `handlers/` contains order workflows.
- `tests/` contains unit tests, browser tests, and rules for the demo emulators.

## Vercel Preview

Vercel builds Preview deployments with the sample artwork and guides from the local seed. Preview checkout and email are simulated, and sign-in and admin are available in the local emulator build. A Preview needs no Firebase or payment credentials.

To reproduce the Preview build locally, set `VERCEL_ENV=preview` and run `npm run build`, then `npx next start`.

## Production handoff

Production requires an explicit `NEXT_PUBLIC_SITE_ENV=production` in the deployment environment. The repository does not contain live service credentials or production Firebase rules. Review the existing Firestore and Storage rules, server-side catalog price verification, and payment fulfillment against the owner's configuration before releasing. The tests use test doubles for Stripe, Gmail, and MailerLite, so they do not verify the live integrations.

Configure MailerLite on the server with `MAILERLITE_API_KEY` and optionally `MAILERLITE_SUBSCRIBERS_API_URL`. Replace any key previously exposed by a `NEXT_PUBLIC_MAILERLITE_API_KEY` build. Keep live credentials in the hosting environment.
