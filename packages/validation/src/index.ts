import { z } from "zod";

export const roleSchema = z.enum([
  "patient",
  "therapist",
  "care_coordinator",
  "org_admin",
  "super_admin",
  "billing_admin",
  "support_agent",
]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const intakeSchema = z.object({
  therapyGoals: z.array(z.string()).min(1),
  language: z.string().min(2),
  specialties: z.array(z.string()).min(1),
  availability: z.array(z.string()).min(1),
  careFormat: z.enum(["virtual", "in_person", "either"]),
  paymentPreference: z.enum(["insurance", "self_pay", "either"]),
  consentAccepted: z.boolean().refine(Boolean, "Consent is required"),
});

export const appointmentBookingSchema = z.object({
  therapistId: z.string().min(1),
  startAt: z.string().datetime(),
  modality: z.enum(["video", "in_person"]),
  notes: z.string().max(1000).optional(),
});

export const moodCheckinSchema = z.object({
  moodScore: z.number().min(1).max(10),
  journalText: z.string().max(2000).optional(),
});

export const insuranceSubmissionSchema = z.object({
  carrierName: z.string().min(2),
  memberId: z.string().min(4),
  groupNumber: z.string().optional(),
  frontCardUrl: z.string().url().optional(),
  backCardUrl: z.string().url().optional(),
});

export type IntakeInput = z.infer<typeof intakeSchema>;
export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;
