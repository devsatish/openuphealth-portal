import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const result = await withRole("patient", "care_coordinator");
  if (result.error) return result.error;

  const { user } = result;

  const profile = await prisma.patientProfile.findUnique({
    where: { userId: user.id },
    include: {
      intakeForms: {
        orderBy: { completedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: profile.intakeForms[0] || null });
}

export async function POST(request: NextRequest) {
  const result = await withRole("patient");
  if (result.error) return result.error;

  const { user } = result;

  try {
    const body = await request.json();

    let profile = await prisma.patientProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      profile = await prisma.patientProfile.create({
        data: { userId: user.id },
      });
    }

    const intake = await prisma.intakeForm.create({
      data: {
        patientId: profile.id,
        therapyGoals: body.therapyGoals ? JSON.stringify(body.therapyGoals) : null,
        preferredLanguage: body.preferredLanguage,
        specialtyPreferences: body.specialtyPreferences
          ? JSON.stringify(body.specialtyPreferences)
          : null,
        availability: body.availability ? JSON.stringify(body.availability) : null,
        careFormat: body.careFormat,
        paymentPreference: body.paymentPreference,
        additionalNotes: body.additionalNotes,
        completedAt: new Date(),
      },
    });

    await prisma.patientProfile.update({
      where: { id: profile.id },
      data: { intakeCompletedAt: new Date() },
    });

    await logAudit({
      userId: user.id,
      action: "intake.submitted",
      resourceType: "IntakeForm",
      resourceId: intake.id,
    });

    return NextResponse.json({ data: intake }, { status: 201 });
  } catch (error) {
    console.error("Error creating intake:", error);
    return NextResponse.json({ error: "Failed to submit intake form" }, { status: 500 });
  }
}
