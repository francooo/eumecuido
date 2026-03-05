# Gentle Care Tracker

A Next.js medication and health tracking app for managing family care.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Database**: Neon PostgreSQL (serverless) via `@neondatabase/serverless`
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS v4

## Project Structure

- `src/app/` — Next.js App Router pages
  - `dashboard/` — Main dashboard
  - `log-dose/` — Medication dose logging
  - `history/` — Dose history
  - `medication-insight/` — Medication insights
  - `medicine-cabinet/` — Medication management
  - `safety-check/` — Safety check feature
  - `weight-check/` — Weight tracking
- `src/actions/` — Server actions
- `src/db/` — Database schema and connection (Drizzle ORM)

## Environment Variables

- `DATABASE_URL` — Neon PostgreSQL connection string (required, set as secret)

## Running the App

```bash
npm run dev      # Development server on port 5000
npm run build    # Production build
npm run start    # Production server on port 5000
npm run db:push  # Push schema to database
```

## Replit Configuration

- Dev server runs on port 5000, bound to 0.0.0.0 (required for Replit web preview)
- Package manager: npm
- Node version: 20
