import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      patient: { select: { id: true, name: true, email: true, image: true } },
      therapist: { select: { id: true, name: true, email: true, image: true } },
    },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const isAdmin = user.role === "super_admin" || user.role === "care_coordinator";
  const isOwner =
    (user.role === "patient" && appointment.patientId === user.id) ||
    (user.role === "therapist" && appointment.therapistId === user.id);
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  return NextResponse.json({ data: appointment });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status, notes, cancelReason } = body;

    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const isAdminRole = user.role === "super_admin" || user.role === "care_coordinator";
    const isOwnerRole =
      (user.role === "patient" && existing.patientId === user.id) ||
      (user.role === "therapist" && existing.therapistId === user.id);
    if (!isAdminRole && !isOwnerRole) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (cancelReason !== undefined) updateData.cancelReason = cancelReason;

    const updated = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        therapist: { select: { id: true, name: true, email: true } },
      },
    });

    await logAudit({
      userId: user.id,
      action: "appointment.updated",
      resourceType: "Appointment",
      resourceId: id,
      metadata: { status, cancelReason },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}
