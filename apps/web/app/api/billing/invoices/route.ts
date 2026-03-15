import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};

  if (user.role === "patient" || user.role === "therapist") {
    where.userId = user.id;
  } else if (user.role === "org_admin") {
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id, role: { in: ["admin", "owner"] } },
      select: { organizationId: true },
    });
    const orgIds = memberships.map((m) => m.organizationId);
    where.organizationId = { in: orgIds };
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.invoice.count({ where }),
  ]);

  return NextResponse.json({ data: invoices, total, page, limit });
}
