/**
 * Vitest setup file for the OpenUpHealth web app test suite.
 *
 * This file runs before each test file. Add global mocks,
 * environment variable defaults, and any global test utilities here.
 */

import { vi } from "vitest";

// ---------------------------------------------------------------------------
// Environment variables required by the app modules under test
// ---------------------------------------------------------------------------

process.env.NEXTAUTH_SECRET = "test-secret-for-vitest-only";
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.DATABASE_URL = "file:./test.db";
process.env.STRIPE_SECRET_KEY = "sk_test_vitest_placeholder";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_vitest_placeholder";

// ---------------------------------------------------------------------------
// Mock next-auth so tests that import lib/auth.ts don't need a real DB
// ---------------------------------------------------------------------------

vi.mock("next-auth", () => ({
  default: vi.fn(),
}));

vi.mock("next-auth/providers/credentials", () => ({
  default: vi.fn(() => ({ id: "credentials", type: "credentials" })),
}));

// ---------------------------------------------------------------------------
// Mock the Prisma client — tests should not hit a real database
// ---------------------------------------------------------------------------

vi.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    therapistProfile: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    appointment: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    moodCheckin: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// ---------------------------------------------------------------------------
// Mock next/server for tests that import route handlers
// ---------------------------------------------------------------------------

vi.mock("next/server", async () => {
  const actual = await vi.importActual<typeof import("next/server")>("next/server");
  return {
    ...actual,
    NextResponse: {
      json: vi.fn((body: unknown, init?: ResponseInit) => ({
        body,
        status: init?.status ?? 200,
        ok: (init?.status ?? 200) < 400,
        json: async () => body,
      })),
      redirect: vi.fn((url: string) => ({ url, status: 302 })),
      next: vi.fn(() => ({ status: 200 })),
    },
  };
});

// ---------------------------------------------------------------------------
// Mock lib/auth so withAuth() and withRole() can be controlled in tests
// ---------------------------------------------------------------------------

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => null),
}));
