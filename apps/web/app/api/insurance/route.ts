import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const result = await withRole("patient", "care_coordinator");
  if (result.error) return result.error;

  const { user } = result;

  if (user.role === "patient") {
    const profile = await prisma.patientProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ data: [] });
    }

    const insurance = await prisma.insuranceInfo.findMany({
      where: { patientId: profile.id },
    });

    return NextResponse.json({ data: insurance });
  }

  const { searchParams } = new URL(request.url);
  const patientProfileId = searchParams.get("patientId");

  if (!patientProfileId) {
    return NextResponse.json({ error: "patientId is required" }, { status: 400 });
  }

  const insurance = await prisma.insuranceInfo.findMany({
    where: { patientId: patientProfileId },
  });

  return NextResponse.json({ data: insurance });
}

export async function POST(request: NextRequest) {
  const result = await withRole("patient");
  if (result.error) return result.error;

  const { user } = result;

  try {
    const body = await request.json();

    const profile = await prisma.patientProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
    }

    const insurance = await prisma.insuranceInfo.create({
      data: {
        patientId: profile.id,
        carrierName: body.carrierName,
        memberId: body.memberId,
        groupNumber: body.groupNumber,
        planName: body.planName,
        frontCardUrl: body.frontCardUrl,
        backCardUrl: body.backCardUrl,
        verificationStatus: "pending",
      },
    });

    await logAudit({
      userId: user.id,
      action: "insurance.submitted",
      resourceType: "InsuranceInfo",
      resourceId: insurance.id,
    });

    return NextResponse.json({ data: insurance }, { status: 201 });
  } catch (error) {
    console.error("Error submitting insurance:", error);
    return NextResponse.json({ error: "Failed to submit insurance info" }, { status: 500 });
  }
}
