/**
 * OpenUpHealth – Core Unit Tests
 *
 * Tests cover:
 *  1. RBAC functions from lib/rbac (hasRole, canAccessRoute)
 *  2. Domain helper from @openup/domain (canAccessRole, rankTherapists)
 *  3. Validation schemas from @openup/validation (loginSchema, intakeSchema, appointmentBookingSchema)
 *  4. Config from @openup/config (featureFlags, crisisResources)
 */

import { describe, it, expect } from "vitest";

// ---------------------------------------------------------------------------
// 1. RBAC — lib/rbac.ts
// ---------------------------------------------------------------------------

import { hasRole, canAccessRoute } from "../lib/rbac";

describe("hasRole()", () => {
  it("returns true when user role exactly matches required role", () => {
    expect(hasRole("patient", "patient")).toBe(true);
    expect(hasRole("therapist", "therapist")).toBe(true);
    expect(hasRole("super_admin", "super_admin")).toBe(true);
  });

  it("returns true when user role is higher than required role", () => {
    // super_admin (4) >= care_coordinator (2)
    expect(hasRole("super_admin", "care_coordinator")).toBe(true);
    // org_admin (3) >= therapist (1)
    expect(hasRole("org_admin", "therapist")).toBe(true);
    // care_coordinator (2) >= patient (0)
    expect(hasRole("care_coordinator", "patient")).toBe(true);
  });

  it("returns false when user role is lower than required role", () => {
    // patient (0) < therapist (1)
    expect(hasRole("patient", "therapist")).toBe(false);
    // therapist (1) < care_coordinator (2)
    expect(hasRole("therapist", "care_coordinator")).toBe(false);
    // care_coordinator (2) < super_admin (4)
    expect(hasRole("care_coordinator", "super_admin")).toBe(false);
  });

  it("returns false for an unrecognised role string", () => {
    expect(hasRole("unknown_role", "patient")).toBe(false);
  });
});

describe("canAccessRoute()", () => {
  it("allows patient to access /app/* routes", () => {
    expect(canAccessRoute("patient", "/app/dashboard")).toBe(true);
    expect(canAccessRoute("patient", "/app/appointments")).toBe(true);
    expect(canAccessRoute("patient", "/app/messages")).toBe(true);
  });

  it("denies patient access to /provider/* routes", () => {
    expect(canAccessRoute("patient", "/provider/dashboard")).toBe(false);
  });

  it("denies patient access to /admin/* routes", () => {
    expect(canAccessRoute("patient", "/admin/users")).toBe(false);
  });

  it("allows therapist to access /provider/* routes", () => {
    expect(canAccessRoute("therapist", "/provider/schedule")).toBe(true);
    expect(canAccessRoute("therapist", "/provider/clients")).toBe(true);
  });

  it("denies therapist access to /admin/* routes", () => {
    expect(canAccessRoute("therapist", "/admin/users")).toBe(false);
  });

  it("allows care_coordinator to access /care/* routes", () => {
    expect(canAccessRoute("care_coordinator", "/care/intake")).toBe(true);
    expect(canAccessRoute("care_coordinator", "/care/insurance")).toBe(true);
  });

  it("allows org_admin to access /org/* routes", () => {
    expect(canAccessRoute("org_admin", "/org/members")).toBe(true);
    expect(canAccessRoute("org_admin", "/org/billing")).toBe(true);
  });

  it("allows super_admin to access all routes", () => {
    expect(canAccessRoute("super_admin", "/admin/users")).toBe(true);
    expect(canAccessRoute("super_admin", "/app/dashboard")).toBe(true);
    expect(canAccessRoute("super_admin", "/provider/schedule")).toBe(true);
    expect(canAccessRoute("super_admin", "/care/intake")).toBe(true);
    expect(canAccessRoute("super_admin", "/org/members")).toBe(true);
    expect(canAccessRoute("super_admin", "/api/admin/audit-logs")).toBe(true);
  });

  it("returns false for an unrecognised role", () => {
    expect(canAccessRoute("ghost_role", "/app/dashboard")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 2. Domain — @openup/domain
// ---------------------------------------------------------------------------

import { canAccessRole, rankTherapists } from "@openup/domain";
import type { TherapistCandidate } from "@openup/domain";

describe("canAccessRole() — @openup/domain", () => {
  it("returns true when user role is in the allowed list", () => {
    expect(canAccessRole("patient", ["patient", "therapist"])).toBe(true);
    expect(canAccessRole("super_admin", ["super_admin"])).toBe(true);
    expect(canAccessRole("care_coordinator", ["care_coordinator", "org_admin"])).toBe(true);
  });

  it("returns false when user role is not in the allowed list", () => {
    expect(canAccessRole("patient", ["therapist", "super_admin"])).toBe(false);
    expect(canAccessRole("therapist", ["patient"])).toBe(false);
  });

  it("returns false for an empty allowed list", () => {
    expect(canAccessRole("super_admin", [])).toBe(false);
  });
});

describe("rankTherapists() — @openup/domain", () => {
  const baseCandidates: TherapistCandidate[] = [
    {
      id: "therapist-a",
      specialties: ["anxiety", "depression"],
      languages: ["English"],
      careFormats: ["virtual"],
    },
    {
      id: "therapist-b",
      specialties: ["trauma", "grief"],
      languages: ["Spanish"],
      careFormats: ["in_person"],
    },
    {
      id: "therapist-c",
      specialties: ["anxiety"],
      languages: ["English", "Spanish"],
      careFormats: ["virtual", "in_person"],
    },
  ];

  it("returns an array with the same number of entries as candidates", () => {
    const result = rankTherapists(
      {
        therapyGoals: ["reduce anxiety"],
        language: "English",
        specialties: ["anxiety"],
        availability: ["weekday_morning"],
        careFormat: "virtual",
        paymentPreference: "insurance",
        consentAccepted: true,
      },
      baseCandidates
    );
    expect(result).toHaveLength(baseCandidates.length);
  });

  it("ranks a therapist with specialty+language+format match highest", () => {
    const result = rankTherapists(
      {
        therapyGoals: ["reduce anxiety"],
        language: "English",
        specialties: ["anxiety"],
        availability: ["weekday_evening"],
        careFormat: "virtual",
        paymentPreference: "self_pay",
        consentAccepted: true,
      },
      baseCandidates
    );

    // therapist-a: specialty match (anxiety) +25, language (English) +20, format (virtual) +15, base +10 = 70
    // therapist-c: specialty match (anxiety) +25, language (English) +20, format (virtual) +15, base +10 = 70
    // therapist-b: no specialty match, no language match, no format match, base +10 = 10
    expect(result[result.length - 1].therapistId).toBe("therapist-b");
    expect(result[result.length - 1].score).toBe(10);
  });

  it("includes reasons in the result for each match factor", () => {
    const result = rankTherapists(
      {
        therapyGoals: ["trauma healing"],
        language: "Spanish",
        specialties: ["trauma"],
        availability: ["weekend"],
        careFormat: "in_person",
        paymentPreference: "insurance",
        consentAccepted: true,
      },
      baseCandidates
    );

    const therapistB = result.find((r) => r.therapistId === "therapist-b");
    expect(therapistB).toBeDefined();
    expect(therapistB!.reasons.some((r) => r.includes("trauma"))).toBe(true);
    expect(therapistB!.reasons.some((r) => r.toLowerCase().includes("language"))).toBe(true);
  });

  it("returns an empty array when no candidates are provided", () => {
    const result = rankTherapists(
      {
        therapyGoals: ["general wellness"],
        language: "English",
        specialties: ["anxiety"],
        availability: ["weekday_morning"],
        careFormat: "either",
        paymentPreference: "either",
        consentAccepted: true,
      },
      []
    );
    expect(result).toEqual([]);
  });

  it("gives every candidate at least the base score of 10", () => {
    const result = rankTherapists(
      {
        therapyGoals: ["general wellness"],
        language: "Mandarin",
        specialties: ["eating_disorders"],
        availability: ["weekday_morning"],
        careFormat: "virtual",
        paymentPreference: "insurance",
        consentAccepted: true,
      },
      baseCandidates
    );

    // No matches for any candidate on specialties or language,
    // but "either" care format would not apply here since we specified "virtual"
    // and therapist-b is in_person only. Still, base score of 10 always added.
    result.forEach((match) => {
      expect(match.score).toBeGreaterThanOrEqual(10);
    });
  });

  it("scores careFormat:'either' as a match for any candidate format", () => {
    const result = rankTherapists(
      {
        therapyGoals: ["reduce stress"],
        language: "Unknown",
        specialties: ["unmatched_specialty"],
        availability: ["weekday_morning"],
        careFormat: "either",
        paymentPreference: "either",
        consentAccepted: true,
      },
      baseCandidates
    );

    // All candidates should get the format match bonus (+15) since careFormat is "either"
    result.forEach((match) => {
      expect(match.score).toBeGreaterThanOrEqual(25); // base 10 + format 15
      expect(match.reasons.some((r) => r.toLowerCase().includes("care format"))).toBe(true);
    });
  });

  it("results are sorted in descending score order", () => {
    const result = rankTherapists(
      {
        therapyGoals: ["reduce anxiety"],
        language: "English",
        specialties: ["anxiety", "depression"],
        availability: ["weekday_morning"],
        careFormat: "virtual",
        paymentPreference: "insurance",
        consentAccepted: true,
      },
      baseCandidates
    );

    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. Validation Schemas — @openup/validation
// ---------------------------------------------------------------------------

import {
  loginSchema,
  intakeSchema,
  appointmentBookingSchema,
  moodCheckinSchema,
  insuranceSubmissionSchema,
} from "@openup/validation";

describe("loginSchema", () => {
  it("passes with a valid email and password (>= 8 chars)", () => {
    const result = loginSchema.safeParse({
      email: "patient1@openuphealth.local",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails with an invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails with a password shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "patient1@openuphealth.local",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("fails when email is missing", () => {
    const result = loginSchema.safeParse({ password: "password123" });
    expect(result.success).toBe(false);
  });

  it("fails when password is missing", () => {
    const result = loginSchema.safeParse({ email: "patient1@openuphealth.local" });
    expect(result.success).toBe(false);
  });
});

describe("intakeSchema", () => {
  const validIntake = {
    therapyGoals: ["reduce anxiety", "improve sleep"],
    language: "English",
    specialties: ["anxiety"],
    availability: ["weekday_morning"],
    careFormat: "virtual" as const,
    paymentPreference: "insurance" as const,
    consentAccepted: true,
  };

  it("passes with all required fields provided and valid", () => {
    expect(intakeSchema.safeParse(validIntake).success).toBe(true);
  });

  it("fails when therapyGoals is an empty array", () => {
    const result = intakeSchema.safeParse({ ...validIntake, therapyGoals: [] });
    expect(result.success).toBe(false);
  });

  it("fails when specialties is an empty array", () => {
    const result = intakeSchema.safeParse({ ...validIntake, specialties: [] });
    expect(result.success).toBe(false);
  });

  it("fails when availability is an empty array", () => {
    const result = intakeSchema.safeParse({ ...validIntake, availability: [] });
    expect(result.success).toBe(false);
  });

  it("fails when careFormat is not one of the allowed values", () => {
    const result = intakeSchema.safeParse({ ...validIntake, careFormat: "phone" });
    expect(result.success).toBe(false);
  });

  it("fails when paymentPreference is not one of the allowed values", () => {
    const result = intakeSchema.safeParse({ ...validIntake, paymentPreference: "barter" });
    expect(result.success).toBe(false);
  });

  it("fails when consentAccepted is false", () => {
    const result = intakeSchema.safeParse({ ...validIntake, consentAccepted: false });
    expect(result.success).toBe(false);
  });

  it("accepts 'either' as valid careFormat and paymentPreference", () => {
    const result = intakeSchema.safeParse({
      ...validIntake,
      careFormat: "either",
      paymentPreference: "either",
    });
    expect(result.success).toBe(true);
  });

  it("fails when language is shorter than 2 characters", () => {
    const result = intakeSchema.safeParse({ ...validIntake, language: "E" });
    expect(result.success).toBe(false);
  });
});

describe("appointmentBookingSchema", () => {
  const validBooking = {
    therapistId: "therapist-cuid-123",
    startAt: new Date().toISOString(),
    modality: "video" as const,
    notes: "First appointment",
  };

  it("passes with a valid booking including optional notes", () => {
    expect(appointmentBookingSchema.safeParse(validBooking).success).toBe(true);
  });

  it("passes without optional notes field", () => {
    const { notes, ...withoutNotes } = validBooking;
    expect(appointmentBookingSchema.safeParse(withoutNotes).success).toBe(true);
  });

  it("fails when therapistId is an empty string", () => {
    const result = appointmentBookingSchema.safeParse({ ...validBooking, therapistId: "" });
    expect(result.success).toBe(false);
  });

  it("fails when startAt is not a valid ISO datetime string", () => {
    const result = appointmentBookingSchema.safeParse({
      ...validBooking,
      startAt: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("fails when modality is not video or in_person", () => {
    const result = appointmentBookingSchema.safeParse({ ...validBooking, modality: "phone" });
    expect(result.success).toBe(false);
  });

  it("accepts 'in_person' as a valid modality", () => {
    const result = appointmentBookingSchema.safeParse({ ...validBooking, modality: "in_person" });
    expect(result.success).toBe(true);
  });

  it("fails when notes exceeds 1000 characters", () => {
    const result = appointmentBookingSchema.safeParse({
      ...validBooking,
      notes: "a".repeat(1001),
    });
    expect(result.success).toBe(false);
  });

  it("passes when notes is exactly 1000 characters", () => {
    const result = appointmentBookingSchema.safeParse({
      ...validBooking,
      notes: "a".repeat(1000),
    });
    expect(result.success).toBe(true);
  });
});

describe("moodCheckinSchema", () => {
  it("passes with a valid mood score and optional journal text", () => {
    const result = moodCheckinSchema.safeParse({ moodScore: 7, journalText: "Feeling okay." });
    expect(result.success).toBe(true);
  });

  it("passes with only a mood score (journalText is optional)", () => {
    const result = moodCheckinSchema.safeParse({ moodScore: 5 });
    expect(result.success).toBe(true);
  });

  it("fails when moodScore is below 1", () => {
    const result = moodCheckinSchema.safeParse({ moodScore: 0 });
    expect(result.success).toBe(false);
  });

  it("fails when moodScore is above 10", () => {
    const result = moodCheckinSchema.safeParse({ moodScore: 11 });
    expect(result.success).toBe(false);
  });

  it("passes for boundary values 1 and 10", () => {
    expect(moodCheckinSchema.safeParse({ moodScore: 1 }).success).toBe(true);
    expect(moodCheckinSchema.safeParse({ moodScore: 10 }).success).toBe(true);
  });

  it("fails when journalText exceeds 2000 characters", () => {
    const result = moodCheckinSchema.safeParse({
      moodScore: 5,
      journalText: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("passes when journalText is exactly 2000 characters", () => {
    const result = moodCheckinSchema.safeParse({
      moodScore: 5,
      journalText: "a".repeat(2000),
    });
    expect(result.success).toBe(true);
  });
});

describe("insuranceSubmissionSchema", () => {
  const validInsurance = {
    carrierName: "Blue Cross Blue Shield",
    memberId: "XYZ12345",
    groupNumber: "GRP-001",
    frontCardUrl: "https://storage.example.com/front.jpg",
    backCardUrl: "https://storage.example.com/back.jpg",
  };

  it("passes with all fields provided and valid", () => {
    expect(insuranceSubmissionSchema.safeParse(validInsurance).success).toBe(true);
  });

  it("passes with only required fields (no optional fields)", () => {
    const result = insuranceSubmissionSchema.safeParse({
      carrierName: "Aetna",
      memberId: "AET98765",
    });
    expect(result.success).toBe(true);
  });

  it("fails when carrierName is shorter than 2 characters", () => {
    const result = insuranceSubmissionSchema.safeParse({ ...validInsurance, carrierName: "A" });
    expect(result.success).toBe(false);
  });

  it("fails when memberId is shorter than 4 characters", () => {
    const result = insuranceSubmissionSchema.safeParse({ ...validInsurance, memberId: "AB" });
    expect(result.success).toBe(false);
  });

  it("fails when frontCardUrl is not a valid URL", () => {
    const result = insuranceSubmissionSchema.safeParse({
      ...validInsurance,
      frontCardUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. Config — @openup/config
// ---------------------------------------------------------------------------

import { featureFlags, crisisResources, APP_NAME } from "@openup/config";

describe("featureFlags — @openup/config", () => {
  it("exports a featureFlags object", () => {
    expect(featureFlags).toBeDefined();
    expect(typeof featureFlags).toBe("object");
  });

  it("has a billingEnabled flag", () => {
    expect(typeof featureFlags.billingEnabled).toBe("boolean");
  });

  it("has an insuranceMockEnabled flag", () => {
    expect(typeof featureFlags.insuranceMockEnabled).toBe("boolean");
  });

  it("has a crisisSupportBanner flag", () => {
    expect(typeof featureFlags.crisisSupportBanner).toBe("boolean");
  });

  it("has a mobilePushScaffold flag", () => {
    expect(typeof featureFlags.mobilePushScaffold).toBe("boolean");
  });

  it("billingEnabled is true in the MVP config", () => {
    expect(featureFlags.billingEnabled).toBe(true);
  });

  it("insuranceMockEnabled is true in the MVP config", () => {
    expect(featureFlags.insuranceMockEnabled).toBe(true);
  });
});

describe("crisisResources — @openup/config", () => {
  it("exports a crisisResources object", () => {
    expect(crisisResources).toBeDefined();
    expect(typeof crisisResources).toBe("object");
  });

  it("includes the 988 crisis line reference", () => {
    expect(crisisResources.us988).toBeDefined();
    expect(crisisResources.us988).toContain("988");
  });

  it("includes emergency services reference", () => {
    expect(crisisResources.emergency).toBeDefined();
    expect(crisisResources.emergency.toLowerCase()).toContain("911");
  });
});

describe("APP_NAME — @openup/config", () => {
  it("exports APP_NAME as a non-empty string", () => {
    expect(typeof APP_NAME).toBe("string");
    expect(APP_NAME.length).toBeGreaterThan(0);
  });

  it("APP_NAME is OpenUpHealth", () => {
    expect(APP_NAME).toBe("OpenUpHealth");
  });
});
