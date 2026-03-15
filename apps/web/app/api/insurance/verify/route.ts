import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const result = await withRole("care_coordinator", "super_admin");
  if (result.error) return result.error;

  const { user } = result;

  try {
    const body = await request.json();
    const { insuranceId, status, notes } = body;

    if (!insuranceId) {
      return NextResponse.json({ error: "insuranceId is required" }, { status: 400 });
    }

    const validStatuses = ["pending", "verified", "denied", "expired"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const insurance = await prisma.insuranceInfo.findUnique({
      where: { id: insuranceId },
    });

    if (!insurance) {
      return NextResponse.json({ error: "Insurance info not found" }, { status: 404 });
    }

    const updated = await prisma.insuranceInfo.update({
      where: { id: insuranceId },
      data: {
        verificationStatus: status || "verified",
        verifiedAt: status === "verified" ? new Date() : undefined,
        notes: notes || undefined,
      },
    });

    await logAudit({
      userId: user.id,
      action: "insurance.verified",
      resourceType: "InsuranceInfo",
      resourceId: insuranceId,
      metadata: { status: status || "verified" },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error verifying insurance:", error);
    return NextResponse.json({ error: "Failed to verify insurance" }, { status: 500 });
  }
}
