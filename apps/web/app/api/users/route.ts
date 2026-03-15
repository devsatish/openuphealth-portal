import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const result = await withRole("super_admin", "care_coordinator", "org_admin");
  if (result.error) return result.error;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = role ? { role } : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        image: true,
        organizationId: true,
        createdAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ data: users, total, page, limit });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role || "patient",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (user.role === "patient") {
      await prisma.patientProfile.create({
        data: { userId: user.id },
      });
    } else if (user.role === "therapist") {
      await prisma.therapistProfile.create({
        data: { userId: user.id },
      });
    }

    await logAudit({
      action: "user.created",
      resourceType: "User",
      resourceId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
