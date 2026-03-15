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

  if (user.id !== id && user.role !== "super_admin" && user.role !== "care_coordinator") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  const found = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      image: true,
      organizationId: true,
      createdAt: true,
      patientProfile: true,
      therapistProfile: true,
    },
  });

  if (!found) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ data: found });
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

  if (user.id !== id && user.role !== "super_admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, image, phone, dateOfBirth, bio, specialties } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (phone !== undefined || dateOfBirth !== undefined) {
      await prisma.patientProfile.upsert({
        where: { userId: id },
        update: {
          ...(phone !== undefined && { phone }),
          ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
        },
        create: {
          userId: id,
          phone,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        },
      });
    }

    if (bio !== undefined || specialties !== undefined) {
      await prisma.therapistProfile.upsert({
        where: { userId: id },
        update: {
          ...(bio !== undefined && { bio }),
          ...(specialties !== undefined && { specialties: JSON.stringify(specialties) }),
        },
        create: {
          userId: id,
          bio,
          specialties: specialties ? JSON.stringify(specialties) : undefined,
        },
      });
    }

    await logAudit({
      userId: user.id,
      action: "user.updated",
      resourceType: "User",
      resourceId: id,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
