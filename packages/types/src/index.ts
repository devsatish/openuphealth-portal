export type Role =
  | "patient"
  | "therapist"
  | "care_coordinator"
  | "org_admin"
  | "super_admin"
  | "billing_admin"
  | "support_agent";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  organizationId?: string | null;
}

export interface TherapistMatch {
  therapistId: string;
  score: number;
  reasons: string[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type InsuranceVerificationStatus = "pending" | "verified" | "rejected" | "needs_info";

export interface SessionSummary {
  appointmentId: string;
  therapistName: string;
  startsAt: string;
  status: "scheduled" | "completed" | "cancelled";
}
