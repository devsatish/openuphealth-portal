# Production TODO - OpenUpHealth

This document is a structured checklist of everything that must be done to move OpenUpHealth from an MVP/demo state to a production-ready platform handling real patient data. Items are grouped by domain and roughly ordered by priority within each group.

---

## Database Migration

- [ ] **Replace SQLite with PostgreSQL**: change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma` and update `DATABASE_URL` to a PostgreSQL connection string
- [ ] **Run `prisma migrate deploy`** in production CI/CD pipeline (not `migrate dev`)
- [ ] **Set up connection pooling**: use PgBouncer, Prisma Accelerate, or the hosting provider's built-in pooler to handle concurrent connections from serverless functions
- [ ] **Configure automated database backups**: daily full backups with point-in-time recovery (PITR) enabled; test restoration procedure
- [ ] **Enable encryption at rest**: use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, Neon, Supabase) with encryption at rest enabled by default
- [ ] **Implement database read replicas** for reporting/analytics queries to avoid impacting production write performance
- [ ] **Set up database monitoring**: query performance alerts, connection pool saturation alerts, disk usage alerts
- [ ] **Audit and enforce row-level security (RLS)** if using Supabase or direct PostgreSQL access from client-side

---

## Authentication Hardening

- [ ] **Email verification on signup**: send a verification link via transactional email; block login until email is confirmed
- [ ] **Forgot password / password reset flow**: time-limited single-use reset tokens stored in the database (or as signed JWTs); invalidate after use
- [ ] **Account lockout after failed attempts**: lock account after 5 consecutive failed login attempts; require email unlock or time-based cooldown (15 minutes)
- [ ] **Rate limiting on `/api/auth/*` routes**: max 10 attempts per IP per 5 minutes; return 429 with Retry-After header
- [ ] **MFA for elevated roles**: enforce TOTP (Google Authenticator/Authy) or hardware key (WebAuthn) for `therapist`, `care_coordinator`, `org_admin`, and `super_admin` roles
- [ ] **Session timeout policy**: expire inactive sessions after 30 minutes; provide 5-minute warning; configurable per role
- [ ] **Refresh token rotation**: implement sliding expiry with secure refresh token rotation; revoke all tokens on password change
- [ ] **Concurrent session management**: allow users to view and revoke active sessions from their profile
- [ ] **Login audit logging**: log every successful and failed login attempt with IP address, user agent, and timestamp (no PHI in logs)
- [ ] **CSRF protection review**: verify NextAuth defaults are sufficient or add custom CSRF token handling for non-NextAuth POST routes

---

## Real Integrations

### Insurance Eligibility

- [ ] Select and contract with a healthcare clearinghouse (Availity, Change Healthcare, Office Ally, or payer-direct APIs)
- [ ] Implement real eligibility request/response using X12 270/271 EDI or the clearinghouse's REST API
- [ ] Replace the mocked `/api/insurance/verify` response with the real API call
- [ ] Handle eligibility response parsing: coverage status, copay, deductible, out-of-pocket max
- [ ] Store eligibility check results with timestamp; re-verify on configurable schedule
- [ ] Sign BAA with the clearinghouse

### Video Sessions

- [ ] Select a HIPAA-compliant video provider: Twilio Programmable Video, Daily.co (HIPAA BAA available), or Zoom Healthcare
- [ ] Sign BAA with the chosen video provider
- [ ] Implement server-side room token generation: create a room per appointment, generate access tokens for both patient and therapist
- [ ] Build the video call UI (web + mobile): camera/mic controls, screen share (therapist), recording disclaimer
- [ ] Handle session end and post-session workflows: session summary, note entry prompt for therapist
- [ ] Enforce session duration limits and billing time tracking

### Email Notifications

- [ ] Select and configure a transactional email provider (SendGrid, Postmark, AWS SES)
- [ ] Sign BAA with the email provider (required if any PHI appears in email body — ideally keep emails PHI-free)
- [ ] Implement email templates for:
  - [ ] Welcome email on signup
  - [ ] Email verification on signup
  - [ ] Password reset
  - [ ] Appointment confirmation (patient and therapist)
  - [ ] Appointment reminder (24h and 1h before)
  - [ ] Appointment cancellation notice
  - [ ] New message notification (no message content in email body — just a notification to check the platform)
  - [ ] Care team assignment notification
  - [ ] Insurance verification status update
- [ ] Set up DKIM and SPF DNS records for the sending domain

### SMS Notifications

- [ ] Integrate Twilio SMS (or AWS SNS) for appointment reminders and critical alerts
- [ ] Implement phone number verification on user profile
- [ ] Get explicit opt-in consent for SMS before sending (required by TCPA)
- [ ] Allow SMS opt-out and honor immediately

### Push Notifications

- [ ] Wire Expo Push Notifications service or Firebase Cloud Messaging (FCM)
- [ ] Implement push token registration on mobile login via `POST /api/device-registration`
- [ ] Implement push token cleanup on logout and on token refresh
- [ ] Build server-side push notification sender service
- [ ] Handle APNs certificate (iOS) and FCM server key (Android) configuration in production environment
- [ ] Test notification delivery across foreground, background, and killed app states

### File Storage

- [ ] Set up AWS S3 bucket (or equivalent) with private ACL — no public object access
- [ ] Implement pre-signed URL generation for insurance card uploads (15-minute expiry)
- [ ] Replace `frontCardUrl`/`backCardUrl` placeholder fields with actual S3-backed upload flow
- [ ] Enable S3 server-side encryption (SSE-KMS)
- [ ] Implement file deletion when user deletes their account
- [ ] Sign BAA with AWS (covered under AWS HIPAA Eligible Services)

### Calendar Integration

- [ ] Implement iCalendar (.ics) file generation for appointment downloads
- [ ] Build Google Calendar OAuth integration (add/update/remove appointments in patient's Google Calendar)
- [ ] Build Outlook Calendar integration via Microsoft Graph API
- [ ] Implement calendar sync for therapists' availability management

---

## Stripe Production

- [ ] **Replace test mode keys** with live Stripe secret key (`sk_live_...`) and live webhook secret
- [ ] **Complete webhook handler** for all required event types:
  - `payment_intent.succeeded` — mark invoice as paid
  - `payment_intent.payment_failed` — notify patient, retry logic
  - `customer.subscription.created` — activate plan
  - `customer.subscription.updated` — handle plan changes
  - `customer.subscription.deleted` — deactivate plan, notify patient
  - `invoice.payment_failed` — dunning flow
- [ ] **Implement Stripe Connect** for therapist payouts: Express onboarding, split payment routing, payout scheduling
- [ ] **Handle subscription upgrade/downgrade flows**: proration, immediate vs. end-of-period changes
- [ ] **Implement dunning**: retry failed payments, pause access after N failures, send payment failure emails
- [ ] **Add tax handling**: use Stripe Tax or implement manual tax collection where required by state/country
- [ ] **Implement refund flow**: admin UI for processing full and partial refunds
- [ ] **PCI compliance review**: confirm no card data ever touches OpenUpHealth servers; Stripe Elements handles card data in an iframe
- [ ] **Stripe radar rules review**: configure fraud prevention rules appropriate for healthcare payments

---

## HIPAA / Legal / Security

- [ ] Engage a qualified **HIPAA Security Officer** or consulting firm to conduct a formal Security Risk Assessment
- [ ] Conduct a **penetration test** by a third-party security firm; address all critical and high findings
- [ ] **Sign Business Associate Agreements (BAAs)** with all vendors:
  - [ ] Hosting provider (Vercel, AWS, GCP, Azure)
  - [ ] Database provider (if managed — Neon, Supabase, AWS RDS)
  - [ ] Stripe
  - [ ] Email provider (SendGrid, Postmark)
  - [ ] SMS/video provider (Twilio, Daily.co)
  - [ ] Error tracking (Sentry)
  - [ ] Log management provider
  - [ ] File storage (AWS S3)
- [ ] Implement **audit log retention policy**: retain audit logs for minimum 6 years; archive to cold storage after 90 days
- [ ] Implement **data encryption at rest**: verify database and file storage encryption; document encryption key management
- [ ] Implement **data encryption in transit**: enforce TLS 1.2+ on all endpoints; configure HSTS headers
- [ ] Draft and publish **Privacy Policy**: must include HIPAA Notice of Privacy Practices (NPP) content; legal review required
- [ ] Draft and publish **Terms of Service**: mental health platform-specific terms; legal review required
- [ ] Conduct **state-by-state mental health privacy law review**: some states have stricter protections than federal HIPAA
- [ ] Conduct **GDPR/CCPA compliance review** if serving EU or California users
- [ ] Review **42 CFR Part 2** applicability if substance use disorder treatment is offered
- [ ] Establish **incident response plan**: detection, containment, notification procedures; HIPAA breach notification is required within 60 days
- [ ] Establish **workforce training program**: all staff with access to PHI must complete HIPAA training annually
- [ ] Implement **minimum necessary standard**: ensure API responses and logging include only the minimum PHI required for the operation

---

## Observability

- [ ] **Structured logging**: implement JSON-structured logs; ensure no PHI (names, emails, diagnosis info) appears in any log line
- [ ] **Error tracking**: integrate Sentry (confirm BAA available); set up alerting for error rate spikes
- [ ] **Application Performance Monitoring (APM)**: integrate DataDog, New Relic, or equivalent; track p50/p95/p99 latency per endpoint
- [ ] **Uptime monitoring**: configure external uptime checks (Pingdom, BetterUptime, or similar) with alerting to on-call
- [ ] **Database query monitoring**: identify slow queries; set up alerts for queries exceeding threshold
- [ ] **Real User Monitoring (RUM)**: track core web vitals for the web app
- [ ] **Custom dashboards**: build operational dashboards for API error rates, appointment booking rates, active sessions, and billing metrics
- [ ] **On-call runbooks**: write runbooks for common incidents (database down, payment failure spike, auth outage)
- [ ] **Alerting escalation policy**: define PagerDuty or equivalent on-call rotation and escalation paths

---

## Infrastructure

- [ ] **CI/CD pipeline**: set up GitHub Actions (or equivalent) with:
  - [ ] Lint and type check on every PR
  - [ ] Test suite on every PR
  - [ ] Staging deployment on merge to `main`
  - [ ] Production deployment via manual approval gate or tagged release
  - [ ] Automated dependency vulnerability scanning (Dependabot, Snyk)
- [ ] **Docker containerization**: containerize the Next.js app for consistent builds and deployments
- [ ] **Managed hosting**: deploy to Vercel (easiest for Next.js), AWS ECS, or Google Cloud Run
- [ ] **CDN for static assets**: configure CDN caching for public images, fonts, and JavaScript bundles
- [ ] **Load balancing and auto-scaling**: configure horizontal scaling rules based on CPU/memory/request rate
- [ ] **Multi-region deployment consideration**: if serving patients across the US, evaluate multi-region for latency; consider data residency implications
- [ ] **Staging environment**: full parity with production (same database type, same env vars shape, separate Stripe test account)
- [ ] **Feature branch preview deployments**: automatic preview URLs for PRs (Vercel provides this out of the box)
- [ ] **Secrets management**: migrate from `.env` files to a secrets manager (AWS Secrets Manager, HashiCorp Vault, or platform-native secrets)

---

## Mobile App Store

- [ ] **Apple Developer Program**: enroll ($99/year); set up the organization account, not personal
- [ ] **Google Play Developer Account**: register ($25 one-time fee)
- [ ] **iOS App Signing**: create distribution certificate, App ID, and provisioning profile via Xcode or Apple Developer portal
- [ ] **Android Keystore**: generate release keystore; store securely; never commit to version control
- [ ] **Expo EAS Build**: configure `eas.json` with build profiles for development, preview, and production; run `eas build` for production binaries
- [ ] **Expo EAS Submit**: configure `eas.json` for App Store Connect and Google Play submission; use `eas submit`
- [ ] **App Store Connect metadata**:
  - [ ] App name, subtitle, description, keywords
  - [ ] Screenshots: 6.5" (iPhone 14 Pro Max), 5.5" (iPhone 8 Plus), 12.9" iPad Pro
  - [ ] App icon: 1024x1024 PNG
  - [ ] Support URL and marketing URL
  - [ ] Privacy Policy URL (required for healthcare apps)
  - [ ] Age rating: complete App Store Connect questionnaire
- [ ] **Google Play Store metadata**:
  - [ ] Short description (80 chars) and full description
  - [ ] Feature graphic (1024x500)
  - [ ] Screenshots: phone, 7-inch tablet, 10-inch tablet
  - [ ] Content rating: complete IARC questionnaire
  - [ ] Data Safety section: accurately declare all data collected and shared
- [ ] **Mental health app review compliance**:
  - Apple App Store §1.4.2: include disclaimer that app is not a substitute for professional mental health treatment
  - Google Play: review Sensitive Apps policy for mental health category
- [ ] **App Transport Security**: ensure all ATS exceptions used in development (cleartext localhost) are removed from release builds
- [ ] **Deep linking**: configure universal links (iOS `apple-app-site-association`) and App Links (Android `assetlinks.json`) for notification tap-through
- [ ] **User data deletion**: implement in-app account deletion per App Store requirement; PHI must be fully deleted within a defined timeframe
