import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicPaths = [
  "/",
  "/login",
  "/signup",
  "/api/auth",
];

const marketingPaths = [
  "/about",
  "/pricing",
  "/contact",
  "/blog",
  "/faq",
  "/terms",
  "/privacy",
  "/how-it-works",
  "/for-individuals",
  "/for-therapists",
  "/for-employers",
  "/insurance",
  "/security",
];

const roleRouteMap: Record<string, string[]> = {
  patient: ["/app"],
  therapist: ["/provider"],
  care_coordinator: ["/care"],
  org_admin: ["/org"],
  super_admin: ["/admin", "/app", "/provider", "/care", "/org"],
};

function isPublicPath(pathname: string): boolean {
  if (marketingPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return true;
  }
  return publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function canAccessPath(role: string, pathname: string): boolean {
  if (pathname.startsWith("/api/")) return true;

  const allowed = roleRouteMap[role];
  if (!allowed) return false;

  return allowed.some((prefix) => pathname.startsWith(prefix));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const user = req.auth?.user;

  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (user as { role?: string }).role || "patient";

  if (!canAccessPath(role, pathname)) {
    const defaultPaths: Record<string, string> = {
      patient: "/app",
      therapist: "/provider",
      care_coordinator: "/care",
      org_admin: "/org",
      super_admin: "/admin",
    };

    const redirectTo = defaultPaths[role] || "/login";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
