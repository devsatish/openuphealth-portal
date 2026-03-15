import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/rbac";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;

  const therapist = await prisma.therapistProfile.findFirst({
    where: { userId: id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
      availabilitySlots: true,
    },
  });

  if (!therapist) {
    return NextResponse.json({ error: "Therapist not found" }, { status: 404 });
  }

  return NextResponse.json({
    data: {
      ...therapist,
      specialties: therapist.specialties ? JSON.parse(therapist.specialties) : [],
      modalities: therapist.modalities ? JSON.parse(therapist.modalities) : [],
      languages: therapist.languages ? JSON.parse(therapist.languages) : [],
      populations: therapist.populations ? JSON.parse(therapist.populations) : [],
    },
  });
}
