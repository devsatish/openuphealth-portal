import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const result = await withRole("super_admin");
  if (result.error) return result.error;

  const flags = await prisma.featureFlag.findMany({
    orderBy: { key: "asc" },
  });

  return NextResponse.json({ data: flags });
}

export async function PATCH(request: NextRequest) {
  const result = await withRole("super_admin");
  if (result.error) return result.error;

  const { user } = result;

  try {
    const body = await request.json();
    const { key, enabled, description } = body;

    if (!key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    const flag = await prisma.featureFlag.upsert({
      where: { key },
      update: {
        ...(enabled !== undefined && { enabled }),
        ...(description !== undefined && { description }),
      },
      create: {
        key,
        enabled: enabled ?? false,
        description,
      },
    });

    await logAudit({
      userId: user.id,
      action: "feature_flag.updated",
      resourceType: "FeatureFlag",
      resourceId: flag.id,
      metadata: { key, enabled },
    });

    return NextResponse.json({ data: flag });
  } catch (error) {
    console.error("Error updating feature flag:", error);
    return NextResponse.json({ error: "Failed to update feature flag" }, { status: 500 });
  }
}
