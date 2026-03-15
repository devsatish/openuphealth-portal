# Product Scope - OpenUpHealth

## Vision

OpenUpHealth is a comprehensive mental health platform that makes quality mental healthcare more accessible by connecting patients with licensed therapists, providing self-guided wellness tools, enabling employer-sponsored mental healthcare programs, and giving care coordinators the operational tools they need to manage intake, insurance, and client care workflows efficiently.

The platform is designed with five distinct user personas, each with a tailored experience, and a shared infrastructure that allows the business to scale across individuals, employers, and provider networks.

---

## MVP Scope (This Build)

### User Personas

| Persona | Role Value | Primary Entry Point |
|---------|-----------|---------------------|
| Patient / Member | `patient` | `/app/*` |
| Therapist / Provider | `therapist` | `/provider/*` |
| Care Coordinator | `care_coordinator` | `/care/*` |
| Employer / Org Admin | `org_admin` | `/org/*` |
| Platform Super Admin | `super_admin` | `/admin/*` |

---

### Core Features Built

#### Patient Experience

- [x] Registration and authentication (email + password, role assignment at signup)
- [x] Multi-step intake questionnaire (therapy goals, language, specialties, availability, care format, payment preference, consent)
- [x] Therapist matching algorithm (specialty overlap, language match, care format compatibility — weighted scoring via `rankTherapists()`)
- [x] Provider directory with search and filter (specialty, language, modality, availability)
- [x] Therapist profile pages (bio, credentials, specialties, modalities, languages, rates)
- [x] Appointment booking (select therapist, date/time slot, modality: video or in-person)
- [x] Appointment management (view upcoming/past, cancel, reschedule)
- [x] Secure messaging (message threads between patient and therapist)
- [x] Mood check-ins (1–10 score + optional journal text, stored over time)
- [x] Journaling (freeform entries attached to mood check-ins)
- [x] PHQ-9 depression assessment (Patient Health Questionnaire — 9 items)
- [x] GAD-7 anxiety assessment (Generalized Anxiety Disorder — 7 items)
- [x] Assessment history and trend visualization
- [x] Self-guided wellness content library (articles, exercises, guided meditations)
- [x] Insurance information management (carrier, member ID, group number, card upload placeholder)
- [x] Insurance eligibility verification (mocked response)
- [x] Invoices and billing history
- [x] Stripe checkout session for payments
- [x] Payment method management
- [x] Crisis support resources (988 Suicide & Crisis Lifeline, emergency information)
- [x] Profile and account settings

#### Therapist Experience

- [x] Professional profile management (bio, specialties, modalities, languages, education, certifications)
- [x] Appointment schedule management (view upcoming sessions by day/week)
- [x] Availability configuration (set available time slots by day of week)
- [x] Client roster (list of active patients with summary info)
- [x] Client detail view (patient profile, appointment history, assessment scores)
- [x] Secure messaging (respond to patient messages)
- [x] Billing and payout overview (earnings summary, invoice list)
- [x] Compliance document tracking (license info, credential expiry)

#### Care Coordinator Experience

- [x] Intake review queue (incoming intake submissions awaiting assignment)
- [x] Therapist matching review (view algorithm results, override or confirm match)
- [x] Insurance verification queue (review submitted insurance and trigger eligibility check)
- [x] Support case management (create and manage care support cases)
- [x] Messaging access (view and respond to escalated patient messages)

#### Employer / Org Admin Experience

- [x] Member roster management (add, remove, and update employee members)
- [x] Eligibility configuration (define plan eligibility rules for the organization)
- [x] Anonymized utilization reporting (session counts, assessment completion rates — no individual PHI exposed)
- [x] Organization billing management (view invoices, manage payment methods)

#### Platform Super Admin Experience

- [x] User management (search, view, update, deactivate any user account)
- [x] Provider verification queue (review therapist credentials before activating profiles)
- [x] Content management (create, update, publish wellness content articles)
- [x] Audit log viewer (filterable log of all system actions with user, timestamp, resource)
- [x] Feature flag management (enable/disable platform features without deployment)
- [x] Platform statistics dashboard (total users, appointments, assessments, revenue)
- [x] Organization management (create and manage employer organizations)

---

### Out of Scope for MVP

- [ ] **Live video sessions** — placeholder UI exists; no video SDK (Twilio, Daily.co, Zoom) is integrated
- [ ] **Real insurance eligibility API integration** — eligibility checks return mocked responses; no Availity, Change Healthcare, or payer API is connected
- [ ] **Email notifications** — no transactional emails (appointment confirmations, reminders, intake confirmation) are sent
- [ ] **SMS notifications** — no SMS via Twilio or similar
- [ ] **Mobile push notifications** — `DeviceRegistration` model exists in the database and the registration API route is scaffolded, but the Expo Push Notification service is not wired
- [ ] **Therapist payout via Stripe Connect** — billing scaffold exists but Stripe Connect onboarding and payouts are not implemented
- [ ] **EHR / EMR integration** — no integration with Epic, Athenahealth, or any electronic health record system
- [ ] **HIPAA compliance certification** — this build has not been reviewed or certified
- [ ] **Multi-language support** — the UI is English-only
- [ ] **Group therapy sessions** — the appointment model supports only 1:1 sessions
- [ ] **Prescription management** — out of scope; the platform does not involve medication or prescribing
- [ ] **Peer support or community features** — no forums, support groups, or community boards
- [ ] **Supervisor / clinical oversight workflows** — no supervision assignments for trainee therapists

---

## Near-Production Features (Next Phase)

The following capabilities need to be built or completed to move from MVP to a production-ready platform:

### Tier 1 — Required for Any Real Users

1. **Email verification on signup** — prevent fake registrations; required before any clinical use
2. **Password reset flow** — users must be able to recover accounts without contacting support
3. **Transactional email** — appointment confirmation, reminder (24h before), cancellation, welcome email via SendGrid or Postmark
4. **Real insurance eligibility verification** — integrate with a clearinghouse (Availity or Change Healthcare) using real member data
5. **PostgreSQL migration** — replace SQLite with a managed PostgreSQL instance (encryption at rest, backups, connection pooling)
6. **Environment-specific configuration** — staging and production environment configs separated from development

### Tier 2 — Required for Business Operations

7. **Live video sessions** — integrate Twilio Programmable Video or Daily.co; generate room tokens server-side; enforce session duration
8. **Push notifications** — appointment reminders, new message alerts, care team updates via Expo Push + FCM/APNs
9. **Therapist Stripe Connect onboarding** — therapists need to be able to receive payouts; implement Connect Express onboarding
10. **SMS reminders** — appointment reminders and verification codes via Twilio SMS
11. **Calendar sync** — Google Calendar and iCalendar export for appointment data
12. **File storage** — replace insurance card URL placeholders with S3-backed upload with pre-signed URLs and private ACLs

### Tier 3 — Scale and Compliance

13. **Rate limiting** — implement token bucket or sliding window rate limiting on all auth and API endpoints
14. **HIPAA security audit** — engage a qualified firm; address all findings before handling real PHI
15. **Audit log retention policy** — archive audit logs to cold storage; enforce 6-year retention
16. **Multi-state therapist licensure enforcement** — ensure therapist profiles capture licensed states and restrict patient matching to valid cross-state combinations
17. **Privacy Policy and Terms of Service** — legal review required before public launch
18. **Accessibility audit** — WCAG 2.1 AA compliance review for the web app

---

## Data Model Summary

The Prisma schema defines 26 models covering:

| Domain | Models |
|--------|--------|
| Identity | `User`, `Account`, `Session`, `VerificationToken` |
| Clinical | `IntakeSubmission`, `Appointment`, `MoodCheckin`, `Assessment`, `AssessmentResponse` |
| Messaging | `MessageThread`, `Message` |
| Provider | `TherapistProfile`, `Availability` |
| Insurance | `Insurance` |
| Billing | `Invoice`, `PaymentMethod` |
| Organization | `Organization`, `OrganizationMember` |
| Content | `ContentResource` |
| Care | `SupportCase` |
| Device | `DeviceRegistration` |
| Platform | `AuditLog`, `FeatureFlag` |
