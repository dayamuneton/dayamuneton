# Daya Muneton

The portfolio, art shop, community, and emotional education guides use the Next.js Pages Router. Public pages, account screens, and admin share base styles, navigation, and loading feedback.

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

The browser test server disables native `require()` of ES modules to catch Vercel function-loader incompatibilities. The build bundles the sanitizer and Firebase Auth dependency chains while keeping Firestore's filesystem-dependent transport external. Production and local builds both use webpack.

For the cross-browser run, install Firefox and WebKit with `npx playwright install firefox webkit`, then set `PLAYWRIGHT_ALL_BROWSERS=1`. Set `PLAYWRIGHT_PORT` to use a different local test port. With the demo emulators already running, use `npm run build:local` and `npm run test:browser`.

Set `NEXT_PUBLIC_REPORT_VITALS=1` in `.env.local` to log Web Vitals in the browser console. The reports are local and have no analytics vendor or paid service dependency.

## Artwork

The original artwork stays in `public/`. The bundled gallery assets use prebuilt responsive WebP images with JPEG or PNG fallbacks. Image URLs are versioned so browsers can reuse cached copies. Product photos added through Firebase still use Next.js image optimization.

Run `npm run artwork:generate` after changing a bundled artwork source. Commit the updated image variants in `public/artwork/` and the manifest in `lib/artwork/variants.json` together. The generator runs locally.

## Code layout

- `pages/` contains routes and API entry points.
- `features/home/` contains the homepage gallery and support flow.
- `features/catalog/` contains catalog types, data access, and shared product UI.
- `features/admin/` contains catalog management and editors.
- `features/account/` contains the sign-in and registration form.
- `components/` contains shared UI, with checkout and navigation components grouped by purpose.
- `integrations/` contains Firebase, Stripe, and email platform adapters. `handlers/` contains order workflows.
- `tests/` contains unit tests, browser tests, and rules for the demo emulators.

### Common edits

| To change | Start here |
| --- | --- |
| Brand colors, button colors, text sizes, spacing, or motion timings | [Theme](styles/theme.css). The `--color-brand-*` tokens control artwork accents and gradients. `--color-accent`, `--color-accent-hover`, `--color-on-accent`, and `--color-focus` control interactive states. |
| The mobile-to-desktop switch | [Theme](styles/theme.css). `--breakpoint-navigation` sets both the navigation layout and the support dropdown breakpoint. |
| Public page layouts or shared components | [Public pages](styles/original-design.css), [shared styles](styles/portfolio.css), and [support styles](styles/support.css). |
| Email, social profiles, portrait, or default site URL | [Site config](config/site.ts). |
| Shop or education categories | [Catalog categories](features/catalog/categories.ts). |

## Vercel Preview

Vercel builds Preview deployments with the sample artwork and guides from the local seed. Preview checkout and email are simulated, and sign-in and admin are available in the local emulator build. A Preview needs no Firebase or payment credentials.

Vercel deployments without an explicit production flag also use this demo mode. This keeps the personal repository's mirror separate from the owner's live data and services.

To reproduce the Preview build locally, set `VERCEL_ENV=preview` and run `npm run build -- --webpack`, then `npx next start`.

## Production handoff

Production requires an explicit `NEXT_PUBLIC_SITE_ENV=production` in the deployment environment. Keep `FIREBASE_SERVICE_ACCOUNT_JSON` in Production secrets, using a dedicated service account for the configured Firebase project with Cloud Datastore User access. Server checkout validates catalog prices, reserves original artwork, verifies paid Stripe sessions, and fulfills orders idempotently. Stripe must deliver `checkout.session.completed` and `checkout.session.expired` to `/api/stripe/webhook`.

`firestore.rules` and `storage.rules` contain the production access rules; `firebase.json` references them. Public catalog reads are allowed; catalog writes require an existing admin record, carts belong to their customer, and order writes happen only on the server. Review and publish these rules in the owner's Firebase project when deploying. The separate `firebase.local.json` uses disposable emulator fixtures.

With the emulators running, `npm run test:security` checks access denial, cart ownership, artwork reservations, and payment fulfillment. Browser checkout and email use test doubles, so they do not verify live Stripe payments or email delivery. Configure `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SIGNING_SECRET`, the existing Gmail OAuth variables, and optionally `SMTP_TRANSPORT_USER` (defaults to the site email).

Configure MailerLite on the server with `MAILERLITE_API_KEY` and optionally `MAILERLITE_SUBSCRIBERS_API_URL`. Replace any key previously exposed by a `NEXT_PUBLIC_MAILERLITE_API_KEY` build. Keep live credentials in the hosting environment.
