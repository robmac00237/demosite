# Between the Buns Website Concept
## Proposed Technical Standards and Integration Readiness

Prepared by Mackay Design on November 20, 2026.

## Status and assumptions

This document describes standards for a possible production website. It is not a statement that Mackay Design has been retained, that the demonstration reflects the restaurant's current menu, or that any Square integration is active.

The current Griddle Club demonstration is an independent concept. It uses fictional products, sample CAD prices, generated food photography, simulated checkout, a local menu assistant, and a browser-only admin demonstration. It does not place orders, collect payments, access restaurant data, or connect to a Square seller account.

The public restaurant website appears to use a Square-hosted domain. This document therefore assumes, for planning purposes only, that Square may be used for online ordering or payment processing. That assumption must be confirmed with the restaurant. Any production integration requires the restaurant's explicit authorization, discovery of its actual Square products and locations, and implementation in Square Sandbox before production access.

## Experience standards

- Mobile-first layouts, including practical use at 320 CSS pixels and above.
- Semantic page structure, descriptive labels, keyboard operation, visible focus, sufficient contrast, reduced-motion support, and WCAG 2.2 AA as the accessibility target.
- Clear distinction between official content, sample content, unavailable products, and service errors.
- Prices displayed in Canadian dollars, with the server or authorized commerce platform as the source of truth.
- Responsive, optimized images with documented rights or written permission for all production photography.
- No misleading claims about ingredients, allergens, availability, hours, delivery areas, or restaurant policy.
- Search, categories, modifiers, quantity controls, cart totals, and checkout states that work with keyboard and touch input.

## Menu and administration standards

The demonstration `/admin` page shows the intended editing experience, but it stores changes only in one browser. It is not production authentication or shared publishing.

A production admin should include:

- Unique staff accounts with multi-factor authentication where supported.
- Role-based permissions for owners, managers, and content editors.
- Shared database or an authorized Square Catalog source rather than browser storage.
- Draft, preview, publish, rollback, and scheduled-change workflows.
- Add, edit, hide, duplicate, reorder, and archive operations for products and categories.
- Structured variations, modifier sets, taxes, images, price schedules, and location-specific availability.
- Audit history showing who changed a record, when, and what changed.
- Image upload validation, file-size limits, generated thumbnails, and safe file types.
- Backups, restore testing, and export in a documented format.
- Conflict handling so concurrent edits do not silently overwrite each other.

If Square already owns the restaurant's catalog, Square should normally be evaluated as the menu source of truth. A separate database should not duplicate authoritative prices or availability without a defined synchronization and reconciliation process.

## Proposed application architecture

**Public experience:** Next.js App Router pages for the homepage, menu, product details, cart, and checkout.

**Hosting:** Netlify using its current Next.js adapter for route handlers, server rendering where required, and image optimization.

**Admin:** Protected server-backed routes with authorization checked on every read and write operation. Hiding the page in navigation is not access control.

**Data:** A shared production database or Square Catalog, with validation at API boundaries and integer minor units for money.

**Images:** Managed object storage or an approved media service, with optimized derivatives and alternative text.

**Integration layer:** Separate adapters for catalog synchronization, order creation, payment processing, fulfillment state, and webhooks. The website should not embed provider credentials in client code.

**Observability:** Structured logs, error reporting, uptime checks, deployment history, and alerts for failed ordering or webhook operations.

## Square integration path

Square's official documentation supports a potential restaurant order-ahead architecture using Catalog, Orders, Payments, the Web Payments SDK, OAuth, and webhooks. The exact product set should be chosen only after discovery.

1. **Confirm the operating model.** Determine whether the restaurant uses Square Online, Square Point of Sale, Square for Restaurants, or another provider; identify locations, pickup workflows, taxes, discounts, modifiers, inventory practices, refunds, and order notifications.
2. **Obtain seller authorization.** Use Square OAuth with the smallest required permissions. Access and refresh tokens must be encrypted, rotated, revocable, and restricted to server-side code. No credentials should be requested through ordinary email or stored in the repository.
3. **Map the catalog.** Read approved categories, items, variations, modifiers, taxes, images, and location availability from Square Catalog. Preserve Square object IDs and versions. Define whether updates occur in Square only, through the custom admin, or by controlled two-way synchronization.
4. **Build authoritative carts and orders.** Reload current product data server-side, reject unavailable items or invalid modifiers, and calculate or verify price adjustments using seller-approved Square configuration. Do not trust totals sent by the browser.
5. **Create pickup fulfillment.** Use the Orders API with the authorized location, itemization, customer-provided pickup details, expected pickup time, taxes, discounts, and source information. Confirm how paid orders appear to staff before launch.
6. **Tokenize and charge payments.** Use the client-side Web Payments SDK for secure payment tokenization and call the Payments API from the server. The website must never request raw card details through ordinary form fields or store card numbers.
7. **Prevent duplicate operations.** Generate and persist unique idempotency keys for order and payment operations. Retry only with the same key and same request when the outcome is uncertain.
8. **Process trusted webhooks.** Validate Square's signature against the exact raw request body, signature key, signature header, and configured notification URL. Reject unverified requests, record processed event IDs, and make handlers idempotent.
9. **Reconcile state.** Treat Square as authoritative for order and payment status. Handle declined payments, abandoned checkouts, timeouts, refunds, cancellations, partial failures, and delayed webhook delivery.
10. **Launch through Sandbox and controlled production testing.** Use test seller data, documented acceptance cases, limited production verification, monitoring, and a rollback plan.

## Security and privacy standards

- Use HTTPS everywhere and secure, HTTP-only, same-site cookies for authenticated sessions.
- Keep secrets in managed environment variables; never expose seller tokens or API secrets to the browser.
- Apply least privilege, server-side authorization, session expiry, login throttling, and account recovery controls.
- Validate and bound every request; encode untrusted output; use parameterized database operations.
- Apply content security policy, clickjacking protection, secure referrer policy, and other appropriate response headers.
- Follow OWASP ASVS 5.0 as a verification framework for production security controls.
- Collect only customer information required for fulfillment, document retention, and limit staff access.
- Publish appropriate privacy, terms, refund, cancellation, accessibility, and contact information after restaurant review.
- Keep payment data within Square's supported tokenization flow. A final PCI responsibility assessment should be completed for the chosen integration and business process.
- Maintain dependency updates, vulnerability review, backups, incident procedures, and access revocation.

## Performance, SEO, and operational standards

- Set performance budgets for JavaScript, images, fonts, and third-party scripts; measure representative mobile devices and networks.
- Optimize responsive images, preload only critical assets, minimize layout shift, and respect reduced motion.
- Use accurate metadata and search indexing only after the restaurant approves the official brand, address, hours, contact details, and images.
- Do not publish restaurant structured data until factual business details are confirmed.
- Use preview deployments and production deployment history. Require automated linting, strict type checking, unit tests, production builds, and browser flows before release.
- Test keyboard navigation, screen readers, touch interactions, major browsers, checkout errors, slow networks, unavailable products, and recovery from failed external calls.
- Monitor uptime, error rate, checkout completion, payment failures, webhook failures, and catalog synchronization health without logging secrets or unnecessary personal data.

## Delivery stages

**Discovery:** Confirm ownership, brand assets, menu source, operating hours, locations, fulfillment process, policies, Square products, and success criteria.

**Approved design:** Replace fictional content with licensed photography and restaurant-approved copy. Review responsive layouts and accessibility before integration.

**Production admin and data:** Implement authentication, permissions, shared data, audit history, image management, backups, and editorial workflow - or establish Square Catalog as the editing source.

**Square Sandbox:** Implement only the authorized APIs, test catalog mapping, orders, pickup fulfillment, tokenized payments, refunds, webhooks, and reconciliation.

**Acceptance:** Restaurant staff verify menu accuracy, modifiers, prices, taxes, order notifications, pickup timing, accessibility, policies, and failure handling.

**Launch and support:** Configure the approved domain, production credentials, monitoring, backups, analytics consent where applicable, rollback, documentation, and staff training.

## Acceptance gates

No production order or payment capability should be described as operational until all of the following are evidenced:

- Written seller authorization and confirmed Square products and locations.
- Approved official menu, pricing, modifiers, taxes, images, and policies.
- Successful Sandbox tests for order, payment, fulfillment, refund, and webhook scenarios.
- Server-side total validation and idempotency verified under retry conditions.
- Webhook signature verification and duplicate-event handling verified.
- Accessibility and responsive browser testing completed.
- Privacy, security, backup, incident, and support responsibilities assigned.
- Restaurant staff have completed acceptance testing and approved launch.

## References

- Square Catalog API: https://developer.squareup.com/docs/catalog-api/what-it-does
- Square Orders API: https://developer.squareup.com/docs/orders-api/what-it-does
- Square Payments API: https://developer.squareup.com/docs/payments-refunds
- Square order-ahead use case: https://developer.squareup.com/docs/orders-api/order-ahead-usecase
- Square OAuth API: https://developer.squareup.com/docs/oauth-api/overview
- Square idempotency: https://developer.squareup.com/docs/build-basics/common-api-patterns/idempotency
- Square webhook validation: https://developer.squareup.com/docs/webhooks/step3validate
- Netlify Next.js support: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- OWASP ASVS 5.0: https://asvs.owasp.org/

