# OpenUpHealth - Mental Health Platform

## Overview

OpenUpHealth is a full-stack mental health platform that connects patients with licensed therapists, provides self-guided wellness tools, supports employer-sponsored mental healthcare programs, and equips care coordinators with the tools to manage intake and insurance workflows. It is built as a Turborepo monorepo and ships both a Next.js 15 web application and an Expo React Native mobile application from a shared codebase.

**Tech Stack:**
- Web: Next.js 15 App Router, NextAuth v5, Prisma (SQLite), Stripe, Tailwind CSS, shadcn/ui
- Mobile: Expo (React Native), React Navigation, expo-secure-store
- Shared packages: TypeScript types, Zod validation schemas, API client, domain logic, design tokens, feature flags
- Tooling: Turborepo, pnpm workspaces, Vitest, ESLint

> This is an MVP/demo application. See [SECURITY_NOTES.md](./SECURITY_NOTES.md) for important disclaimers before using with real patient data.

---

## Monorepo Structure

```
openuphealth/
├── apps/
│   ├── web/                    # Next.js 15 App Router (primary platform)
│   │   ├── app/                # Route groups and API routes
│   │   │   ├── (marketing)/    # Public marketing pages
│   │   │   ├── app/            # Patient-facing app (role: patient)
│   │   │   ├── provider/       # Therapist dashboard (role: therapist)
│   │   │   ├── care/           # Care coordinator (role: care_coordinator)
│   │   │   ├── org/            # Employer/org admin (role: org_admin)
│   │   │   ├── admin/          # Platform super admin (role: super_admin)
│   │   │   ├── login/          # Auth pages
│   │   │   ├── signup/
│   │   │   └── api/            # 26 API routes
│   │   ├── components/         # Web-only UI components
│   │   ├── lib/                # Server utilities (auth, rbac, db, stripe, audit)
│   │   ├── prisma/             # Schema + migrations
│   │   └── scripts/            # Seed script
│   └── mobile/                 # Expo React Native
│       └── src/
│           ├── api/            # API client + secure token storage
│           ├── auth/           # Auth context and hooks
│           ├── components/     # React Native components
│           ├── navigation/     # React Navigation setup
│           ├── screens/        # Screen components per role
│           └── theme/          # Design token imports
├── packages/
│   ├── types/                  # Shared TypeScript types and interfaces
│   ├── validation/             # Shared Zod schemas
│   ├── api-client/             # fetch-based API client factory
│   ├── ui/                     # Design tokens (colors, spacing, typography)
│   ├── domain/                 # Shared business logic (matching, RBAC helpers)
│   ├── config/                 # Feature flags, constants, crisis resources
│   ├── eslint-config/          # Shared ESLint configuration
│   └── tsconfig/               # Shared TypeScript configuration
└── figmamakegenerated/         # Reference designs (Figma export)
```

---

## Prerequisites

- **Node.js** 20 or later
- **pnpm** 9 or later (`npm install -g pnpm`)
- **iOS Simulator** via Xcode (for mobile iOS development) — macOS only
- **Android Studio** with Android Emulator (for mobile Android development)
- A **Stripe test account** with test API keys (for billing features)

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example apps/web/.env.local
```

Edit `apps/web/.env.local` and fill in the following values:

```env
# Required
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Stripe (test keys — starts with sk_test_)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database (SQLite default — no change needed for local dev)
DATABASE_URL="file:./dev.db"
```

> Generate a `NEXTAUTH_SECRET` with: `openssl rand -base64 32`

### 3. Initialize the database

```bash
# Run migrations and generate Prisma client
pnpm db:migrate

# Seed the database with test users, therapist profiles, content, etc.
pnpm db:seed
```

### 4. Run the web app

```bash
pnpm dev:web
# Opens at http://localhost:3000
```

### 5. Run the mobile app

```bash
pnpm dev:mobile
# Starts Expo Metro bundler
# Press 'i' for iOS Simulator, 'a' for Android Emulator,
# or scan the QR code with the Expo Go app on a physical device
```

---

## Seeded Test Accounts

All accounts use the password `password123`.

| Email | Role | Access |
|-------|------|--------|
| `patient1@openuphealth.local` | Patient | `/app/*` |
| `patient2@openuphealth.local` | Patient | `/app/*` |
| `therapist1@openuphealth.local` | Therapist | `/provider/*` |
| `therapist2@openuphealth.local` | Therapist | `/provider/*` |
| `care1@openuphealth.local` | Care Coordinator | `/care/*` |
| `orgadmin1@openuphealth.local` | Org Admin | `/org/*` |
| `admin@openuphealth.local` | Super Admin | `/admin/*` + all routes |

---

## Web Routes

### Marketing (public, unauthenticated)
| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/how-it-works` | Platform overview |
| `/for-individuals` | Patient-focused landing |
| `/for-therapists` | Therapist-focused landing |
| `/for-employers` | Employer/B2B landing |
| `/pricing` | Pricing page |
| `/insurance` | Insurance information |
| `/security` | Security and privacy overview |
| `/faq` | Frequently asked questions |
| `/contact` | Contact page |
| `/login` | Sign in |
| `/signup` | Create account |

### Patient App (`/app/*`, role: `patient`)
| Route | Description |
|-------|-------------|
| `/app/dashboard` | Patient home — mood summary, upcoming appointments |
| `/app/intake` | Multi-step intake questionnaire |
| `/app/therapists` | Provider directory with search and filters |
| `/app/therapists/match` | Therapist matching results |
| `/app/appointments` | Upcoming and past appointments |
| `/app/messages` | Secure messaging threads |
| `/app/mood` | Mood check-ins and journal |
| `/app/wellness` | Self-guided content library |
| `/app/assessments` | PHQ-9, GAD-7 assessments |
| `/app/insurance` | Insurance information management |
| `/app/billing` | Invoices and payment methods |
| `/app/crisis` | Crisis resources |
| `/app/profile` | Account settings |

### Provider Dashboard (`/provider/*`, role: `therapist`)
| Route | Description |
|-------|-------------|
| `/provider/dashboard` | Today's schedule, client activity |
| `/provider/schedule` | Calendar and availability management |
| `/provider/clients` | Client roster |
| `/provider/clients/[id]` | Individual client detail and notes |
| `/provider/messages` | Secure messaging |
| `/provider/billing` | Payout overview and invoices |
| `/provider/profile` | Professional profile and credentials |

### Care Coordinator (`/care/*`, role: `care_coordinator`)
| Route | Description |
|-------|-------------|
| `/care/dashboard` | Intake queue and pending tasks |
| `/care/intake` | Intake submission review |
| `/care/matching` | Therapist matching review and override |
| `/care/insurance` | Insurance verification queue |
| `/care/cases` | Support case management |

### Org Admin (`/org/*`, role: `org_admin`)
| Route | Description |
|-------|-------------|
| `/org/dashboard` | Organization overview |
| `/org/members` | Member roster and eligibility |
| `/org/billing` | Organization billing |
| `/org/reports` | Anonymized utilization reporting |

### Platform Admin (`/admin/*`, role: `super_admin`)
| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Platform-wide stats |
| `/admin/users` | User management |
| `/admin/providers` | Provider verification queue |
| `/admin/content` | Content management |
| `/admin/audit-logs` | Audit log viewer |
| `/admin/feature-flags` | Feature flag management |
| `/admin/billing` | Billing oversight |

---

## API Routes

All API routes are under `apps/web/app/api/` and return `{ data, error? }` shaped responses.

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth authentication |
| `/api/users` | GET, POST | User management |
| `/api/users/[id]` | GET, PATCH | Individual user |
| `/api/intake` | GET, POST | Intake questionnaire submissions |
| `/api/therapists` | GET | Provider directory |
| `/api/therapists/[id]` | GET, PATCH | Therapist profile |
| `/api/therapists/match` | POST | Run matching algorithm |
| `/api/appointments` | GET, POST | Appointment booking |
| `/api/appointments/[id]` | GET, PATCH | Appointment detail |
| `/api/availability` | GET, POST | Therapist availability slots |
| `/api/mood` | GET, POST | Mood check-in entries |
| `/api/messages` | GET, POST | Message threads |
| `/api/messages/[threadId]` | GET, POST | Thread messages |
| `/api/billing/invoices` | GET | Invoice list |
| `/api/billing/checkout` | POST | Stripe checkout session |
| `/api/billing/payment-methods` | GET | Payment methods |
| `/api/insurance` | GET, POST | Insurance information |
| `/api/insurance/verify` | POST | Trigger eligibility check (mocked) |
| `/api/assessments` | GET, POST | PHQ-9 / GAD-7 results |
| `/api/content` | GET | Wellness content library |
| `/api/organizations` | GET, POST | Organization management |
| `/api/organizations/[id]/members` | GET, POST | Organization member management |
| `/api/admin/audit-logs` | GET | Audit log access |
| `/api/admin/feature-flags` | GET, PATCH | Feature flag management |
| `/api/admin/stats` | GET | Platform-wide statistics |
| `/api/stripe/webhook` | POST | Stripe webhook handler |

---

## Architecture Overview

The monorepo is designed so that web and mobile share everything except rendering and platform-specific APIs.

```
┌─────────────────────────────────────────────────────┐
│                   Shared Packages                   │
│  @openup/types  @openup/validation  @openup/domain  │
│  @openup/api-client  @openup/config  @openup/ui     │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────┐     ┌─────────────────┐
│  apps/web    │     │  apps/mobile    │
│  Next.js 15  │     │  Expo RN        │
│  Tailwind    │     │  StyleSheet     │
│  shadcn/ui   │     │  React Native   │
│  NextAuth    │     │  SecureStore    │
│  cookies     │     │  JWT Bearer     │
└──────────────┘     └─────────────────┘
```

**Key sharing patterns:**
- `@openup/types` — shared `User`, `Role`, `ApiResponse<T>`, `TherapistMatch`, and other core types
- `@openup/validation` — shared Zod schemas used in both API route validation (web) and form validation (web + mobile)
- `@openup/api-client` — factory function returning a typed fetch wrapper; web passes a cookie-based session check, mobile passes `expo-secure-store` JWT retrieval
- `@openup/domain` — `rankTherapists()` matching algorithm and `canAccessRole()` RBAC helper used on both platforms
- `@openup/config` — `featureFlags`, `crisisResources`, and shared constants
- `@openup/ui` — design tokens (colors, spacing scale, border radii, typography scale) used in Tailwind on web and `StyleSheet` on mobile

---

## Stripe Integration

OpenUpHealth uses Stripe for payment processing. For the MVP, **test mode only** is supported.

**Setup:**
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Copy your test secret key (`sk_test_...`) into `apps/web/.env.local`
3. For webhooks in local development, install the Stripe CLI and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy the webhook signing secret (`whsec_...`) output into `STRIPE_WEBHOOK_SECRET` in `.env.local`

**What is implemented:**
- Checkout session creation (`/api/billing/checkout`)
- Invoice retrieval (`/api/billing/invoices`)
- Payment method listing (`/api/billing/payment-methods`)
- Webhook handler scaffold (`/api/stripe/webhook`) — handles `payment_intent.succeeded` and `customer.subscription.*` events

**What is not yet implemented:**
- Therapist payout via Stripe Connect
- Subscription upgrade/downgrade flows
- Payment failure handling and retry logic

---

## Testing

```bash
# Run all tests across the monorepo
pnpm test

# Run web tests only
pnpm --filter web test

# Run in watch mode
pnpm --filter web exec vitest
```

Tests are located in `apps/web/tests/` and use Vitest. The test suite covers:
- RBAC functions (`hasRole`, `canAccessRoute`)
- Zod validation schemas (`loginSchema`, `intakeSchema`, `appointmentBookingSchema`)
- Domain logic (`rankTherapists`)
- Config (`featureFlags`)

---

## Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in parallel (web + mobile) |
| `pnpm dev:web` | Run Next.js dev server only |
| `pnpm dev:mobile` | Run Expo Metro bundler only |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages and apps |
| `pnpm test` | Run all tests |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed the database with test data |
| `pnpm db:generate` | Regenerate Prisma client after schema changes |

---

## Further Reading

- [SECURITY_NOTES.md](./SECURITY_NOTES.md) — Security posture, disclaimers, and production hardening checklist
- [PRODUCT_SCOPE.md](./PRODUCT_SCOPE.md) — Feature scope, personas, and roadmap
- [MOBILE_ARCHITECTURE.md](./MOBILE_ARCHITECTURE.md) — Mobile app architecture, navigation, and shared packages
- [TODO_PRODUCTION.md](./TODO_PRODUCTION.md) — Detailed checklist for production readiness
