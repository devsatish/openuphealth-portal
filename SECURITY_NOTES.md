# Security Notes - OpenUpHealth

## Important Disclaimer

This is an MVP/demo application built to demonstrate the architecture and feature set of a mental health platform. It has **NOT** been audited, certified, or verified for HIPAA compliance, HITECH compliance, or any other healthcare regulatory framework.

**Do not use this application to store, process, or transmit real patient data without first completing a full security and legal review, engaging a qualified HIPAA security officer, and obtaining all required Business Associate Agreements.**

---

## What IS Implemented

### Authentication

- **NextAuth.js v5** with the credentials provider handles all authentication flows
- Passwords are hashed with **bcryptjs** (salt rounds: 12) before storage — plain-text passwords are never persisted
- Sessions are managed as **JWT tokens** with server-side validation on every protected request
- Role information is embedded in the session token and re-validated server-side on each API call
- Middleware enforces route-level protection: unauthenticated users are redirected to `/login` before any route handler executes

### Authorization (RBAC)

- Every API route performs server-side role validation via `withRole()` from `lib/rbac.ts`
- There is no client-side-only authorization — the browser UI gating is cosmetic; real enforcement happens on the server
- Role hierarchy is enforced: `super_admin` can access all routes; lower roles are restricted to their designated route prefixes
- Role-to-route mapping is centralized in `roleConfig` in `lib/rbac.ts`, making it easy to audit
- `canAccessRoute()` checks pathname prefixes; `hasRole()` checks role level numerically

**Role hierarchy (lowest to highest):**
```
patient (0) < therapist (1) < care_coordinator (2) < org_admin (3) < super_admin (4)
```

### Data Handling

- Passwords are hashed with bcryptjs and never returned in API responses
- The `passwordHash` field is excluded from all API response serialization
- Sensitive configuration (API keys, secrets, database URL) is stored in `.env` files that are excluded from version control via `.gitignore`
- An audit log table (`AuditLog`) captures sensitive actions including authentication events, admin operations, and data modifications

### Input Validation

- All API route inputs are validated with **Zod schemas** from `@openup/validation` before any database interaction
- TypeScript is used throughout the codebase, providing compile-time type safety
- Validation errors return structured 400 responses; no raw error messages from the database are exposed to clients

### Mobile Security

- Auth tokens on the mobile app are stored exclusively in **expo-secure-store**, which uses the device's encrypted keychain (iOS Keychain / Android Keystore) — tokens are never written to AsyncStorage or any unencrypted storage
- All API calls from the mobile app use HTTPS in production configurations
- The mobile app sends the JWT as an `Authorization: Bearer` header, not as a cookie, and the backend validates this on each request

---

## What is MOCK / DEMO Only

The following features exist as scaffolding or simulated responses and must be replaced with real implementations before any production use:

| Feature | Current State |
|---------|--------------|
| Insurance eligibility verification | Returns mocked `verified` responses; no real payer API is called |
| Email notifications | Not implemented; no emails are sent at any point |
| SMS notifications | Not implemented |
| File storage for insurance card images | URL fields exist in the schema; no actual file upload or storage is wired |
| Video therapy sessions | Placeholder UI only; no video SDK is integrated |
| Two-factor authentication (MFA) | Not implemented |
| Rate limiting on auth / API endpoints | Not implemented |
| CSRF protection | Relies on NextAuth default behavior; no custom CSRF headers enforced |
| Content Security Policy headers | Not configured in `next.config.ts` |
| Push notifications | `DeviceRegistration` model exists; Expo push service is not wired |
| Password reset / forgot password flow | Not implemented |
| Email verification on signup | Not implemented |

---

## What MUST Be Done Before Production

### Critical Security Requirements

1. **Full penetration testing and security audit** by a qualified third party with healthcare experience
2. **HIPAA Security Risk Assessment** (required by HIPAA Security Rule §164.308(a)(1))
3. **Business Associate Agreements (BAAs)** with every vendor that touches PHI:
   - Hosting provider (Vercel, AWS, GCP, etc.)
   - Stripe
   - Email/SMS provider (SendGrid, Twilio, etc.)
   - Video provider (Twilio, Daily.co, Zoom, etc.)
   - Error tracking service (Sentry, Datadog, etc.)
4. **Encryption at rest**: Migrate from SQLite to PostgreSQL (or another database) with encryption at rest enabled. SQLite files on disk are not encrypted
5. **TLS/HTTPS** enforced on all traffic; HSTS headers configured
6. **Proper file storage** with access controls: replace URL placeholders with AWS S3 (or equivalent) with private ACLs, signed URLs, and server-side encryption
7. **Secret rotation policy**: establish a process for rotating `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, and database credentials
8. **Rate limiting** on `/api/auth/*` and all API endpoints to prevent brute force and enumeration attacks
9. **Automated dependency vulnerability scanning** (e.g., GitHub Dependabot, Snyk) on a recurring basis
10. **SOC 2 Type II audit** if the platform will handle Protected Health Information (PHI) at scale

### Authentication Hardening

- Email verification on account creation — prevent registration with fake/uncontrolled email addresses
- Forgot password / password reset flow with time-limited, single-use tokens
- Session timeout policies: sessions should expire after a reasonable period of inactivity
- Account lockout after N consecutive failed login attempts, with cooldown or CAPTCHA
- MFA (TOTP or hardware key) enforced for all therapist, care coordinator, org admin, and super admin accounts
- Audit all active sessions and provide users the ability to revoke sessions

### Mobile-Specific Requirements

- **Certificate pinning**: prevent MITM attacks by pinning to the production TLS certificate or public key
- **Jailbreak/root detection**: prevent running the app on compromised devices (use a library such as `react-native-jail-monkey`)
- **Screenshot prevention** on screens displaying PHI (appointment notes, messages, assessments)
- **Biometric authentication** (Face ID / fingerprint) as a secondary lock layer when resuming the app
- **App Transport Security (ATS)**: ensure all network calls enforce HTTPS; disable any ATS exceptions used in development before App Store submission
- Respect iOS/Android background data and app refresh policies for sensitive content

### Logging and Monitoring

- **Centralized, structured logging** — no PHI should appear in any log line
- **Error tracking** with a tool like Sentry (ensure Sentry's BAA is signed if capturing error context that may include PHI)
- **Anomaly detection**: alert on unusual login patterns, bulk data exports, or unexpected role escalation
- **Audit log retention**: HIPAA requires audit log retention for a minimum of 6 years; implement a log archival and retention policy
- **Security incident response plan**: documented process for detecting, containing, and reporting breaches, including HIPAA breach notification requirements (60-day window for notifications to affected individuals)

### Legal and Compliance

- **Privacy Policy**: must be drafted and reviewed by a healthcare attorney; must comply with HIPAA Notice of Privacy Practices requirements
- **Terms of Service**: legal review required; must address mental health-specific considerations
- **State-specific mental health privacy laws**: some states (e.g., California, Texas, New York) have stricter mental health privacy protections than federal HIPAA — a state-by-state review is required
- **GDPR/CCPA compliance review** if any users are located in the EU or California
- **42 CFR Part 2**: if substance use disorder treatment records are involved, additional federal protections apply beyond standard HIPAA
- **Minors**: if the platform will serve users under 18, additional COPPA and state minor consent laws apply
- **Telehealth regulations**: therapist licensure is state-specific; the platform must enforce cross-state practice compliance

---

## Environment Variables Security Checklist

| Variable | Notes |
|----------|-------|
| `NEXTAUTH_SECRET` | Must be a cryptographically random 32+ byte value; rotate periodically |
| `DATABASE_URL` | In production, use a managed database with IAM or credential-based auth; do not use file:// |
| `STRIPE_SECRET_KEY` | Never expose to the browser; server-side only; use restricted keys with minimum required permissions |
| `STRIPE_WEBHOOK_SECRET` | Required for webhook signature verification; do not skip verification in production |

All `.env*` files are listed in `.gitignore`. Never commit secrets to version control. Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, Vercel environment variables) in production.

---

## Responsible Disclosure

If you discover a security vulnerability in this codebase, please report it responsibly. Do not create a public GitHub issue. Contact the project maintainers directly with a description of the vulnerability and steps to reproduce it.
