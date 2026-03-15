import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get("specialty");
  const modality = searchParams.get("modality");
  const language = searchParams.get("language");
  const acceptsInsurance = searchParams.get("acceptsInsurance");
  const isAccepting = searchParams.get("isAccepting");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};

  if (acceptsInsurance === "true") where.acceptsInsurance = true;
  if (isAccepting !== "false") where.isAcceptingPatients = true;

  const therapists = await prisma.therapistProfile.findMany({
    where,
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
    skip: (page - 1) * limit,
    take: limit,
  });

  let filtered = therapists;

  if (specialty) {
    filtered = filtered.filter((t) => {
      const specs = t.specialties ? JSON.parse(t.specialties) : [];
      return specs.includes(specialty);
    });
  }

  if (modality) {
    filtered = filtered.filter((t) => {
      const mods = t.modalities ? JSON.parse(t.modalities) : [];
      return mods.includes(modality);
    });
  }

  if (language) {
    filtered = filtered.filter((t) => {
      const langs = t.languages ? JSON.parse(t.languages) : [];
      return langs.includes(language);
    });
  }

  const total = await prisma.therapistProfile.count({ where });

  return NextResponse.json({ data: filtered, total, page, limit });
}
