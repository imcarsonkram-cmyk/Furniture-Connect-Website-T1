# Drop & Log Furniture Diversion MVP

This repository contains a monorepo-ready, offline-friendly implementation of the "Drop & Log" furniture diversion MVP. The project simulates a Next.js + Prisma stack using TypeScript modules so that the product specification can be validated without external package downloads.

> **Why this approach?** The execution environment blocks access to npm registries. To keep the feature surface measurable we implemented a lightweight serverless-style layer that mirrors Next.js API routes and app router pages. Business rules, Prisma schema, and automated tests mirror the original specification.

## Features

- Accountless student workflow for logging abandoned furniture/appliances
- Org discovery feed with filters, confidence signals, and route builder
- Drop spot directory with QR-ready links and campus acceptance rules
- Listing management signals ("still there" / "gone" / "not permitted") with one-shot notifications
- Admin utilities for drop spot creation and acceptance overrides
- Prisma schema, SQL migration stub, and seed script for a sample campus
- Node-based unit tests for critical API flows and smoke tests that render `/log` and `/orgs`

## Project structure

```
├── src/
│   ├── app/               # Next.js-style app router pages and API handlers
│   ├── lib/               # In-memory database, utilities, env parsing, bootstrap helpers
│   ├── testing/           # Static renderer used by smoke tests
│   └── app/globals.css    # Global styles mirroring Tailwind tokens
├── prisma/
│   ├── schema.prisma      # Database schema matching the specification
│   ├── migrations/        # SQL stub for the initial migration
│   └── seed.ts            # Sample data seeding helper
├── tests/
│   ├── api/               # Unit tests that exercise API endpoints directly
│   └── playwright/         # Playwright-inspired smoke tests (Node-based)
├── storage/               # Local bucket used by the storage stub
└── README.md
```

## Local development

1. Ensure Node.js ≥ 18 is installed. The template relies solely on the standard library and does not require `npm install`.
2. Clone the repository and run the TypeScript build:

   ```bash
   npm run build
   ```

3. Execute the test suites:

   ```bash
   npm test
   ```

4. To experiment with the HTML output, open the compiled files under `dist/` or use the renderer:

   ```bash
   node -e "const { renderDocument } = require('./dist/src/testing/render-app.js'); console.log(renderDocument('/orgs'));"
   ```

### Environment variables

These keys align with the original product brief. Populate them in a `.env.local` file when deploying to a full Next.js environment.

```
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=https://localhost:3000
STORAGE_BUCKET_URL=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
POSTMARK_SERVER_TOKEN=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
ADMIN_BEARER_TOKEN=
GOOGLE_MAPS_API_KEY=
```

### Simulated services

| Concern            | Implementation detail |
|--------------------|------------------------|
| Database           | In-memory Prisma-like client (`src/lib/database.ts`)
| Image storage      | Writes to `storage/` using Node FS APIs (`src/lib/storage.ts`)
| Notifications      | Logged to memory (`src/lib/notifications.ts`)
| Captcha            | Stubbed validator (`src/lib/captcha.ts`)
| Routing            | Google Maps URL builder + CSV data URL (`src/lib/routes.ts`)

When porting to a full Next.js deployment you can swap these utilities with Prisma, S3/Supabase, and live notification SDKs while keeping API handlers intact.

## Running migrations and seeds

The offline template ships with schema and SQL files to assist database provisioning:

```bash
# Preview the schema
cat prisma/schema.prisma

# Apply the SQL migration manually (example for Postgres)
psql $DATABASE_URL -f prisma/migrations/0001_init/migration.sql

# Seed sample data using the TypeScript helper
node dist/prisma/seed.js
```

## Testing strategy

- **API unit tests** (`tests/api/listings.test.ts`): Validate listing creation, deduplication, signal handling, and route generation.
- **Playwright-style smoke tests** (`tests/playwright/log-orgs.test.ts`): Render `/log` and `/orgs` and assert key call-to-action content.

Run all suites with:

```bash
npm test
```

## Deploying to Vercel

To deploy a fully fledged Next.js version:

1. Scaffold a new Next.js 14 project with TailwindCSS and Prisma.
2. Copy the business logic from `src/lib`, `src/app/api`, and UI templates into the new project.
3. Replace the in-memory database with Prisma Client connected to Neon/Supabase.
4. Swap the storage and notification stubs with AWS SDK/Postmark/Twilio integrations.
5. Configure environment variables in Vercel and set the project to use the Node 18+ runtime.
6. Add Cloudflare Turnstile site keys to the `/log` form and wire the verification in `verifyCaptcha`.

## QR signage

Each drop spot automatically receives a stable `qrCodeId`. Generate signage by linking to `/log?spot={id}` and include allowed/not-allowed rules from `/api/config/acceptance`. The admin page template demonstrates the content blocks for printable signage.

## Accessibility and performance notes

- Semantic headings and ARIA live regions are included in the templates.
- Large tap targets and high-contrast colors follow WCAG AA guidance.
- Images are stored with hashed keys and limited to three per listing to preserve bandwidth.

## Limitations

- The current build is optimized for offline evaluation; it does not provide a live Next.js runtime or React hydration.
- Rate limiting and captcha verification are simplified in the absence of remote services.
- Notifications are recorded in-memory instead of being dispatched via Postmark/Twilio.

Despite these constraints, the repository captures the full domain model, API surface, and workflow logic required to launch the MVP once a networked environment is available.
# Furniture-Connect-Website-T1
First test of website creatiion for my drop off- log of furniture.
