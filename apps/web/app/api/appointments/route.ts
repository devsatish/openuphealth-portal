import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};

  if (user.role === "patient") {
    where.patientId = user.id;
  } else if (user.role === "therapist") {
    where.therapistId = user.id;
  }

  if (status) where.status = status;

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        patient: { select: { id: true, name: true, email: true, image: true } },
        therapist: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { startsAt: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  return NextResponse.json({ data: appointments, total, page, limit });
}

export async function POST(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { therapistId, startsAt, endsAt, modality, notes } = body;

    if (!therapistId || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: "therapistId, startsAt, and endsAt are required" },
        { status: 400 }
      );
    }

    const therapist = await prisma.therapistProfile.findUnique({
      where: { userId: therapistId },
    });

    if (!therapist) {
      return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
    }

    const patientId = user.role === "patient" ? user.id : body.patientId;
    if (!patientId) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }

    const conflicting = await prisma.appointment.findFirst({
      where: {
        therapistId,
        status: { in: ["scheduled", "confirmed"] },
        startsAt: { lt: new Date(endsAt) },
        endsAt: { gt: new Date(startsAt) },
      },
    });

    if (conflicting) {
      return NextResponse.json(
        { error: "Time slot conflicts with an existing appointment" },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        therapistId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        modality: modality || "video",
        notes,
        status: "scheduled",
      },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        therapist: { select: { id: true, name: true, email: true } },
      },
    });

    await logAudit({
      userId: user.id,
      action: "appointment.created",
      resourceType: "Appointment",
      resourceId: appointment.id,
      metadata: { therapistId, patientId, startsAt },
    });

    return NextResponse.json({ data: appointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
