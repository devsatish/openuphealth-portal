import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const result = await withRole("org_admin", "super_admin");
  if (result.error) return result.error;

  const { user } = result;

  if (user.role === "super_admin") {
    const orgs = await prisma.organization.findMany({
      include: { _count: { select: { memberships: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: orgs });
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id, role: { in: ["admin", "owner"] } },
    include: {
      organization: {
        include: { _count: { select: { memberships: true } } },
      },
    },
  });

  const orgs = memberships.map((m) => m.organization);
  return NextResponse.json({ data: orgs });
}

export async function POST(request: NextRequest) {
  const result = await withRole("org_admin", "super_admin");
  if (result.error) return result.error;

  const { user } = result;

  try {
    const body = await request.json();
    const { name, slug, type, contactEmail, plan, maxMembers } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
    }

    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        type,
        contactEmail,
        plan: plan || "starter",
        maxMembers: maxMembers || 50,
      },
    });

    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: "owner",
      },
    });

    await logAudit({
      userId: user.id,
      action: "organization.created",
      resourceType: "Organization",
      resourceId: org.id,
      metadata: { name, slug },
    });

    return NextResponse.json({ data: org }, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}
