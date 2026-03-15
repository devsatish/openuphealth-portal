# Mobile Architecture - OpenUpHealth

## Overview

The OpenUpHealth mobile app is built with Expo (React Native) and is designed to share as much code as possible with the web app. Business logic, data types, input validation, the API client, feature flags, and design tokens all live in shared workspace packages — only rendering, navigation, and platform-specific APIs differ between web and mobile.

This document covers what is shared, what is platform-specific, how navigation is structured, how authentication works on mobile, and the roadmap for App Store deployment.

---

## What is Shared (Web + Mobile)

| Package | Purpose | What's Shared |
|---------|---------|---------------|
| `@openup/types` | Core TypeScript types | `User`, `Role`, `ApiResponse<T>`, `TherapistMatch`, `SessionSummary`, `InsuranceVerificationStatus` and all other shared interfaces |
| `@openup/validation` | Zod schemas | `loginSchema`, `intakeSchema`, `appointmentBookingSchema`, `moodCheckinSchema`, `insuranceSubmissionSchema`, `signupSchema`, `messageSchema`, `profileUpdateSchema`, `therapistProfileSchema` |
| `@openup/api-client` | HTTP client factory | `createApiClient()` — fetch-based with Bearer token injection; used identically on web (server-side) and mobile (client-side) |
| `@openup/domain` | Business logic | `rankTherapists()` matching algorithm, `canAccessRole()` RBAC helper |
| `@openup/config` | App configuration | `featureFlags`, `crisisResources`, `APP_NAME` constants |
| `@openup/ui` | Design tokens | Color palette, spacing scale, border radius scale, typography scale — consumed by Tailwind on web and `StyleSheet` on mobile |

### How Shared Packages Work in Practice

The `@openup/api-client` package exports a factory function `createApiClient(options)`. The mobile app instantiates it once in `src/api/client.ts`:

```ts
// apps/mobile/src/api/client.ts
import { createApiClient } from "@openup/api-client";
import { getToken } from "./tokenStorage";

export const apiClient = createApiClient({
  baseUrl: "http://localhost:3000/api",  // dev; replace with production URL
  getToken,
});
```

The `getToken` function reads from `expo-secure-store`. The same `createApiClient` factory on the web side is called with a `getToken` that reads from the NextAuth session. The underlying fetch logic, error handling, and response shape parsing is identical.

Zod schemas from `@openup/validation` are used to validate form inputs on both platforms before submitting to the API, ensuring that the same business rules apply everywhere.

---

## What is Platform-Specific

### Web (Next.js)

- React DOM components (`div`, `button`, `input`, etc.)
- Tailwind CSS utility classes and CSS variables for theming
- shadcn/ui component library (Radix UI primitives)
- Next.js App Router for file-system routing, layouts, and Server Components
- Server Actions and React Server Components for data fetching
- NextAuth v5 cookie-based session management
- `next/image`, `next/link`, `next/navigation` APIs

### Mobile (Expo / React Native)

- React Native core components (`View`, `Text`, `TextInput`, `TouchableOpacity`, `ScrollView`, `FlatList`, `Image`, etc.)
- `StyleSheet.create` for styling (no CSS; design tokens from `@openup/ui` provide the values)
- React Navigation for stack, tab, and modal navigation
- `expo-secure-store` for encrypted token storage
- `expo-font`, `expo-splash-screen`, `expo-status-bar` for native app chrome
- Native device APIs (camera for insurance card capture, notifications scaffold)
- Bottom tab navigation as the primary navigation pattern for authenticated users
- `Authorization: Bearer <token>` header for all API calls (no cookies)

---

## Navigation Structure

The navigation tree below shows the intended structure. The navigator conditionally renders based on the authenticated user's role.

```
RootNavigator
├── AuthStack  (unauthenticated — no session token)
│   ├── LoginScreen
│   └── SignupScreen
│
├── PatientNavigator  (role: patient)
│   └── BottomTabNavigator
│       ├── HomeTab
│       │   └── PatientDashboardScreen
│       │       └── (nested) AppointmentDetailScreen
│       │       └── (nested) CrisisResourcesScreen
│       ├── AppointmentsTab
│       │   └── AppointmentsListScreen
│       │       └── (nested) AppointmentDetailScreen
│       │       └── (nested) BookAppointmentScreen
│       │           └── TherapistPickerScreen
│       │           └── SlotPickerScreen
│       ├── MessagesTab
│       │   └── MessageThreadsScreen
│       │       └── (nested) ThreadDetailScreen
│       ├── WellnessTab
│       │   └── WellnessDashboardScreen
│       │       └── (nested) ContentDetailScreen
│       │       └── (nested) MoodCheckinScreen
│       │       └── (nested) AssessmentScreen
│       └── ProfileTab
│           └── PatientProfileScreen
│               └── (nested) InsuranceScreen
│               └── (nested) BillingScreen
│               └── (nested) SettingsScreen
│
└── TherapistNavigator  (role: therapist)
    └── BottomTabNavigator
        ├── TodayTab
        │   └── TherapistDashboardScreen
        ├── ScheduleTab
        │   └── ScheduleScreen
        │       └── (nested) AppointmentDetailScreen
        ├── ClientsTab
        │   └── ClientListScreen
        │       └── (nested) ClientDetailScreen
        └── ProfileTab
            └── TherapistProfileScreen
                └── (nested) AvailabilityScreen
                └── (nested) SettingsScreen
```

**Design pattern:** Each top-level tab is its own nested stack navigator so that deep navigation (e.g., tapping an appointment from the dashboard) remains within the correct tab context without resetting the tab state.

---

## Authentication and Session Approach

The mobile app uses a stateless JWT Bearer token pattern rather than the cookie-based sessions used on web. Both approaches are supported by the same NextAuth backend via the credentials provider.

### Login Flow

```
1. User enters email + password in LoginScreen
2. App calls POST /api/auth/signin with { email, password }
3. NextAuth validates credentials, returns a JWT in the response body
4. App stores JWT in expo-secure-store via setToken(jwt)
5. AuthContext updates — root navigator renders PatientNavigator or TherapistNavigator
6. All subsequent API calls attach: Authorization: Bearer <token>
```

### App Restart / Token Persistence

```
1. App starts → SplashScreen shown
2. AuthContext calls getToken() from expo-secure-store
3. If token exists and is not expired → navigate to role-appropriate home screen
4. If token is missing or expired → navigate to AuthStack (LoginScreen)
5. SplashScreen dismissed
```

### Logout Flow

```
1. User taps "Sign out" in ProfileTab
2. App calls clearToken() from expo-secure-store
3. AuthContext clears user state
4. Root navigator re-renders → AuthStack shown
```

### Token Storage

Tokens are stored using `expo-secure-store`, which maps to:
- **iOS**: Keychain Services (hardware-backed on devices with Secure Enclave)
- **Android**: Android Keystore System (hardware-backed on supported devices)

Tokens are **never** stored in `AsyncStorage`, cookies, or any unencrypted local storage.

### Key Files

| File | Purpose |
|------|---------|
| `apps/mobile/src/api/tokenStorage.ts` | `setToken`, `getToken`, `clearToken` wrappers over expo-secure-store |
| `apps/mobile/src/api/client.ts` | `apiClient` singleton instantiated with `getToken` |
| `apps/mobile/src/auth/` | `AuthContext` provider, `useAuth()` hook |
| `apps/mobile/src/navigation/` | Root navigator with conditional role-based rendering |

---

## API Integration

All mobile API calls go through the shared `@openup/api-client` instance:

```ts
// Example: fetch upcoming appointments
const appointments = await apiClient.get<Appointment[]>("/appointments");

// Example: submit mood check-in
const result = await apiClient.post<MoodCheckin>("/mood", {
  moodScore: 7,
  journalText: "Feeling better today.",
});
```

**Error handling:** `createApiClient` throws a typed `Error` with a user-friendly message on non-2xx responses or when `payload.error` is set. Screen components should catch this in a try/catch and display the error to the user.

**Base URL configuration:**
- Development: `http://localhost:3000/api` (requires local Next.js server running)
- Production: Update to `https://api.openuphealth.com/api` (or your production domain) before App Store submission

---

## Push Notification Scaffold

The database and API scaffolding for push notifications is in place but not fully wired:

**Database model:**
```prisma
model DeviceRegistration {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  platform  String   // "ios" | "android"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Registration:** On login, the mobile app should call `POST /api/device-registration` with the Expo push token:

```ts
import * as Notifications from "expo-notifications";

const token = await Notifications.getExpoPushTokenAsync();
await apiClient.post("/device-registration", {
  token: token.data,
  platform: Platform.OS,
});
```

**Planned notification types:**
- Appointment reminder: 24 hours before, 1 hour before
- New message: when a therapist sends a message to the patient
- Care team update: when a care coordinator updates a case
- Assessment due: periodic reminders to complete PHQ-9 / GAD-7

**Production path:** Use the Expo Push Notifications service (no custom server required for MVP) or Firebase Cloud Messaging (FCM) for more control.

---

## Design Token Usage

Design tokens from `@openup/ui` provide the single source of truth for visual design across both platforms.

**Web (Tailwind):** Tokens are mapped into `tailwind.config.ts` as custom colors, spacing, and border radius values.

**Mobile (StyleSheet):**

```ts
// apps/mobile/src/theme/index.ts
import { colors, spacing, radii, typography } from "@openup/ui";

export const theme = {
  colors,
  spacing,
  radii,
  typography,
};

// Usage in a screen component:
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing[4],
    borderRadius: theme.radii.md,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.foreground,
  },
});
```

This ensures that the same color values, spacing scale, and typography scale are used on both web and mobile without duplication.

---

## Future: App Store Production Steps

The following steps are required before submitting the mobile app to the iOS App Store or Google Play Store:

1. **Replace localhost API URL** with the production endpoint in `apps/mobile/src/api/client.ts`
2. **App signing**: configure iOS distribution certificate and provisioning profile (requires Apple Developer Program membership); configure Android release keystore
3. **Set up Expo Application Services (EAS)**: use `eas build` for cloud builds and `eas submit` for store submission
4. **Configure deep linking**: set up universal links (iOS) and App Links (Android) so push notification taps open the correct screen
5. **Add certificate pinning**: prevent MITM attacks in production builds
6. **Remove dev test account hints**: any hardcoded test email suggestions or dev-only UI must be removed from release builds
7. **App Store metadata**: screenshots (6.5", 5.5" for iOS; multiple densities for Android), app icon, description, keywords, support URL, privacy policy URL
8. **Mental health content guidelines compliance**:
   - Apple App Store Review Guidelines §1.4.2 requires apps offering medical/mental health functionality to include a disclaimer that the app is not a substitute for professional medical advice
   - Google Play requires content rating questionnaire completion; mental health apps may require additional review
9. **HIPAA-aware data deletion**: implement user account deletion (and associated PHI deletion) to comply with platform guidelines and GDPR/CCPA right-to-erasure requirements
10. **Privacy nutrition labels**: iOS App Store Privacy Labels and Google Play Data Safety section must accurately reflect all data collected and shared
11. **Accessibility**: test with VoiceOver (iOS) and TalkBack (Android); ensure all interactive elements have accessible labels
