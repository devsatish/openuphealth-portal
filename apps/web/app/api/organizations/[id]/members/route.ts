import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withRole("org_admin", "super_admin");
  if (result.error) return result.error;

  const { id } = await params;

  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const { user } = result;
  if (user.role !== "super_admin") {
    const membership = await prisma.membership.findUnique({
      where: { userId_organizationId: { userId: user.id, organizationId: id } },
    });
    if (!membership || !["admin", "owner"].includes(membership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }
  }

  const members = await prisma.membership.findMany({
    where: { organizationId: id },
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true, image: true },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  return NextResponse.json({ data: members });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await withRole("org_admin", "super_admin");
  if (result.error) return result.error;

  const { id } = await params;
  const { user } = result;

  try {
    const body = await request.json();
    const { userId, role, eligibleThrough } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({ where: { id } });
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const memberCount = await prisma.membership.count({
      where: { organizationId: id },
    });

    if (memberCount >= org.maxMembers) {
      return NextResponse.json(
        { error: "Organization has reached maximum member limit" },
        { status: 400 }
      );
    }

    const existing = await prisma.membership.findUnique({
      where: { userId_organizationId: { userId, organizationId: id } },
    });

    if (existing) {
      return NextResponse.json({ error: "User is already a member" }, { status: 409 });
    }

    const membership = await prisma.membership.create({
      data: {
        userId,
        organizationId: id,
        role: role || "member",
        eligibleThrough: eligibleThrough ? new Date(eligibleThrough) : undefined,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    await logAudit({
      userId: user.id,
      action: "membership.created",
      resourceType: "Membership",
      resourceId: membership.id,
      metadata: { organizationId: id, addedUserId: userId },
    });

    return NextResponse.json({ data: membership }, { status: 201 });
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}
