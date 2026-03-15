import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type Role = "patient" | "therapist" | "care_coordinator" | "org_admin" | "super_admin";

export const roleConfig: Record<Role, string[]> = {
  patient: ["/app", "/api/intake", "/api/mood", "/api/messages", "/api/appointments", "/api/assessments", "/api/insurance", "/api/billing", "/api/therapists", "/api/content", "/api/availability"],
  therapist: ["/provider", "/api/appointments", "/api/availability", "/api/messages", "/api/therapists", "/api/content"],
  care_coordinator: ["/care", "/api/appointments", "/api/messages", "/api/users", "/api/assessments", "/api/intake", "/api/content"],
  org_admin: ["/org", "/api/organizations", "/api/users", "/api/billing", "/api/content"],
  super_admin: ["/admin", "/app", "/provider", "/care", "/org", "/api"],
};

const roleHierarchy: Record<Role, number> = {
  patient: 0,
  therapist: 1,
  care_coordinator: 2,
  org_admin: 3,
  super_admin: 4,
};

export function hasRole(userRole: string, requiredRole: Role): boolean {
  const userLevel = roleHierarchy[userRole as Role] ?? -1;
  const requiredLevel = roleHierarchy[requiredRole] ?? 999;
  return userLevel >= requiredLevel;
}

export function canAccessRoute(userRole: string, pathname: string): boolean {
  if (userRole === "super_admin") return true;

  const allowedPrefixes = roleConfig[userRole as Role];
  if (!allowedPrefixes) return false;

  return allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
}

export async function withAuth(): Promise<AuthenticatedUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
  };
}

export async function withRole(
  ...allowedRoles: Role[]
): Promise<
  | { user: AuthenticatedUser; error?: never }
  | { user?: never; error: NextResponse }
> {
  const user = await withAuth();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const isAllowed =
    user.role === "super_admin" ||
    allowedRoles.includes(user.role as Role);

  if (!isAllowed) {
    return {
      error: NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      ),
    };
  }

  return { user };
}
