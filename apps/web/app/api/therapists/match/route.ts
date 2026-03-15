import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";

export async function POST(request: NextRequest) {
  const result = await withRole("patient", "care_coordinator");
  if (result.error) return result.error;

  try {
    const body = await request.json();
    const {
      specialtyPreferences = [],
      preferredLanguage,
      careFormat,
      paymentPreference,
    } = body;

    const allTherapists = await prisma.therapistProfile.findMany({
      where: { isAcceptingPatients: true },
      include: {
        user: {
          select: { id: true, email: true, name: true, image: true },
        },
        availabilitySlots: true,
      },
    });

    const scored = allTherapists.map((therapist) => {
      let score = 0;

      const specs = therapist.specialties ? JSON.parse(therapist.specialties) : [];
      const langs = therapist.languages ? JSON.parse(therapist.languages) : [];
      const mods = therapist.modalities ? JSON.parse(therapist.modalities) : [];

      for (const pref of specialtyPreferences) {
        if (specs.includes(pref)) score += 3;
      }

      if (preferredLanguage && langs.includes(preferredLanguage)) {
        score += 2;
      }

      if (careFormat && mods.includes(careFormat)) {
        score += 1;
      }

      if (paymentPreference === "insurance" && therapist.acceptsInsurance) {
        score += 2;
      }

      if (therapist.availabilitySlots.length > 0) {
        score += 1;
      }

      return {
        therapist: {
          ...therapist,
          specialties: specs,
          modalities: mods,
          languages: langs,
          populations: therapist.populations ? JSON.parse(therapist.populations) : [],
        },
        matchScore: score,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    const topMatches = scored.slice(0, 5);

    return NextResponse.json({ data: topMatches });
  } catch (error) {
    console.error("Error matching therapists:", error);
    return NextResponse.json({ error: "Failed to match therapists" }, { status: 500 });
  }
}
