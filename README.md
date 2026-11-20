# Griddle Club — Mackay Design concept

An independent, fictional restaurant experience created by Mackay Design. No real orders, payments, restaurant account access, or customer submissions.

## Run locally

Requires Node.js 20.9+ (tested with Node 22).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. To use another port: `npm run dev -- --port 3001`.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The development and production servers bind to loopback by default. Stop development before using `npm start` on the same port. The project is prepared for Netlify's Next.js runtime and requires server support for its assistant route; it is not a static export. Fonts are fetched at build time by Next.js and self-hosted thereafter.

## Implemented

- Responsive cinematic homepage, fictional storytelling and visible concept notices.
- Twenty typed sample products across six categories, search, filters, empty state, product detail dialogs, modifiers, quantities and dynamic CAD prices.
- A browser-only `/admin` demonstration for editing, adding, duplicating, hiding, reordering, importing, exporting, and resetting fictional menu data. Changes immediately affect the homepage, menu, customization, cart totals, and checkout on the same browser.
- Context-based cart with validated localStorage hydration, separate customized lines, removal, integer-cent pricing, configurable illustrative tax, empty state and native modal focus management.
- Simulated checkout with fictional name, pickup preference and instructions. Fields remain in page memory; `src/lib/demo-checkout.ts` accepts no customer data and performs no network requests. Confirmation explicitly states nothing is available to pick up.
- Floating assistant with session conversation display, suggested questions, loading/error states, minimize/close, and clickable customization cards. Replies are independent per turn; this is not conversational long-term memory.
- Optional server-side Cohere integration; deterministic matching works without a key. Only locally matched product IDs and catalog data reach Cohere, never raw visitor messages or checkout details. Model-returned IDs must match the allowed set. All displayed descriptions/prices are rendered from the catalog. Allergy and operational questions use fixed responses.
- Motion transitions and reduced-motion support, keyboard focus, skip link, accessible labels, native dialog focus trapping/Escape, Next Image, self-hosted optimized fonts, noindex concept metadata, loading and error boundaries.

## Configuration

Copy `.env.example` to `.env.local` only when needed. The project runs without credentials.

- `COHERE_API_KEY`: server-only optional key. Never use a `NEXT_PUBLIC_` prefix.
- `COHERE_MODEL`: configurable Cohere model; default `command-a-03-2025`. Verify model availability for your account before use.
- `NEXT_PUBLIC_DEMO_TAX_RATE`: illustrative fraction, defaults to 0.15, validated between 0 and 1. This is not tax advice or verified seller tax configuration. Rebuild after changing it.
- `SITE_URL`: eventual origin for Open Graph resolution; localhost until deployment.

The API rejects invalid/oversized inputs and falls back on network failures, invalid model data, and timeouts. Live Cohere credentials were not used or verified. The integration follows https://docs.cohere.com/v2/docs/structured-outputs. Before public deployment with a paid API key, add deployment-level request-body limits, distributed rate limiting, quotas, monitoring and a privacy review.

## Project map

- `src/data/demo-menu.ts`: canonical demo catalog and disclaimer.
- `src/components/`: homepage, shared shell, dialogs, product controls, cart and assistant.
- `src/store/cart.tsx`: cart state and localStorage persistence.
- `src/lib/pricing.ts`: validated restored cart and integer-cent totals.
- `src/lib/demo-checkout.ts`: isolated browser-only checkout simulation.
- `src/lib/cohere/assistant.ts`: deterministic intent matching and catalog-grounded copy.
- `src/app/api/assistant/route.ts`: optional provider selection, validation and fallback.
- `src/lib/square/contracts.ts`: interface boundaries only, no operational adapter.
- `tests/`: pricing, storage validation, assistant guards and route/provider-contract tests.
- `public/images/`: original generated WebP demonstration food assets. See `IMAGERY.md`.

## Future Square architecture — not implemented

1. Obtain explicit seller authorization; select sandbox credentials and location before development. Use OAuth scopes appropriate to catalog/orders/payments. Keep tokens encrypted on the server with rotation and revocation.
2. Implement `CatalogGateway`: synchronize Catalog items, variations, modifier lists, images and availability; map IDs/versioning to application products. Replace all fictional catalog content with approved seller content and licensed images.
3. Extend order inputs for seller-approved pickup fulfillment, validated times, contact handling, modifiers and order notes. Server must reload catalog prices, validate quantities/availability and apply seller tax/service-charge configuration. Never trust browser totals.
4. Implement `OrderGateway` with persistent idempotency keys, retries and authoritative status. Create and validate Square orders server-side.
5. Use Square Web Payments SDK only for browser tokenization; send tokens to the server. Implement `PaymentGateway` with matching currency/amount/order identity and unique idempotency keys. Show paid confirmation only after authoritative payment success; handle decline, timeout, duplicate requests, refunds and reconciliation.
6. Implement webhook raw-body signature verification using Square's documented HMAC procedure, configured notification URL and signing key. Verify before parsing/processing, deduplicate event IDs, reject replay, and reconcile authoritative order/payment state. The contract contains no pretend verifier or webhook endpoint.
7. Add durable storage, observability, access controls, privacy/retention controls, secure headers and production integration tests before any real transactions. No Square account or integration is currently connected.

## Verification and remaining scope

Lint, strict TypeScript, unit/API contract tests and production build are the required checks. Browser QA exercised desktop 1440px and mobile 390px: filtering, empty results/reset, customized cart/tax, refresh persistence, checkout/clear, assistant selection/allergy refusal, mobile navigation and horizontal overflow. No runtime page errors were recorded. Native keyboard interactions use dialog semantics; a full manual screen-reader audit and real-device Safari testing remain future QA.

This is a usable demonstration, not an operational restaurant service. Production Square adapters, real seller content, live Cohere account verification, public hosting and production abuse controls are intentionally not complete. Next improvements: approved restaurant branding/menu, dedicated Heat Seeker imagery, richer multi-turn assistant intent handling, and real-device accessibility/performance testing.

The admin route is deliberately a presentation prototype. Browser storage is not shared publishing, authentication, authorization, a database, an audit log, or a backup. Do not use it to manage a real restaurant menu without replacing it with a secure server-backed system or an authorized Square Catalog workflow.

Reference checks: the Square reference returned no readable menu text and Facebook was inaccessible. No restaurant address, hours, phone, history, pricing or food-safety claims were inferred.

## Deploy on Netlify

The repository includes `netlify.toml` and `.nvmrc`. Netlify's current Next.js adapter supports the App Router, route handlers and `next/image`, so the assistant API can remain server-backed.

Recommended route:

1. Put this project in a GitHub, GitLab or Bitbucket repository.
2. In Netlify, choose **Add new project** and **Import an existing project**.
3. Select the repository. Netlify should detect Next.js and read the committed settings: `npm run build` and `.next`.
4. Deploy without adding a Cohere key; the local menu-matching assistant will work immediately.
5. After Netlify assigns the first URL, set `SITE_URL` to that full `https://...netlify.app` address under **Project configuration → Environment variables**, then redeploy so social-preview URLs use the live origin.
6. If you later add Cohere, set `COHERE_API_KEY` and optionally `COHERE_MODEL` in Netlify's environment-variable settings. Never commit the key.
7. Change the generated Netlify site name under the site's domain settings before sharing it. A short option is `griddle-club-concept`, subject to availability.

Do not use a plain static drag-and-drop export for this project: the assistant is implemented as a Next.js route handler. Import from Git or use the Netlify CLI so Netlify can provision the serverless route.
