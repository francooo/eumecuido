# Gentle Care Tracker

A Next.js medication and health tracking app for managing family care, with a React Native/Expo mobile companion app. Fully localized in Brazilian Portuguese (pt-BR).

## Tech Stack

- **Web Framework**: Next.js 16 (App Router) with TypeScript
- **Mobile Framework**: React Native with Expo (SDK 54) + expo-router
- **Database**: Replit built-in PostgreSQL via `pg` (node-postgres) driver
- **ORM**: Drizzle ORM (`drizzle-orm/node-postgres`)
- **Auth**: Email/password with bcrypt hashing, AsyncStorage session persistence
- **Styling**: Tailwind CSS v4 (web), React Native StyleSheet (mobile)

## Project Structure

### Web App (root)
- `src/app/` — Next.js App Router pages
  - `api/` — REST API routes (auth, profiles, medications, logs, seed, family-members, dose-records, weight-records, app-events, member-data)
  - `dashboard/` — Main dashboard
  - `log-dose/` — Medication dose logging
  - `history/` — Dose history
  - `medication-insight/` — Medication insights
  - `medicine-cabinet/` — Medication management
  - `safety-check/` — Safety check feature
  - `weight-check/` — Weight tracking
  - `expo-connect/` — Expo connection helper page
- `src/actions/` — Server actions
- `src/db/` — Database schema (`schema.ts`) and connection (`index.ts`)

### Mobile App (`mobile/`)
- `mobile/app/` — Expo Router screens
  - `(tabs)/` — Tab navigator (dashboard, history, settings)
  - `signup.tsx` — Account creation screen
  - `log-dose.tsx` — Log dose modal
  - `add-family-member.tsx` — Add family member
  - `medicine-cabinet.tsx` — Add medication modal
  - `medication-insight.tsx` — Medication insight modal
  - `safety-check.tsx` — Safety check modal
  - `weight-check.tsx` — Weight check modal
- `mobile/lib/` — API client (`api.ts`), auth helpers (`auth.ts`), theme constants (`theme.ts`)

## Database Tables

- `users` — User accounts
- `profiles` — User health profiles
- `medications` — Medications per profile
- `logs` — General health logs (medication, weight, temp, note)
- `family_members` — Family member records
- `scheduled_doses` — Scheduled medication doses
- `weight_records` — Weight history per member
- `dose_records` — Recorded administered doses
- `family_member_audit` — Audit trail for family member changes
- `user_sessions` — Login session tracking
- `app_events` — App analytics events

## Environment Variables

- `DATABASE_URL` — Replit PostgreSQL connection string (auto-provisioned)
- `EXPO_PUBLIC_API_URL` — Base URL of the Next.js API for mobile app (set in shared env)

## Running the App

```bash
npm run dev          # Web dev server on port 5000
npm run db:push      # Push schema to database
cd mobile && npx expo start --tunnel --port 8080  # Mobile dev server
```

## Workflows

- **Start application** — Next.js web app on port 5000 (webview)
- **Expo Mobile** — Expo dev server on port 8080 with tunnel (console)

## Replit Configuration

- Web server runs on port 5000, bound to 0.0.0.0
- Expo uses tunnel mode for Expo Go access from mobile devices
- Package manager: npm
- Node version: 20
- Database: Replit built-in PostgreSQL (helium), accessed via `DATABASE_URL` secret
