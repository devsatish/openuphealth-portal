import type { TherapistMatch } from "@openup/types";
import type { IntakeInput } from "@openup/validation";

export interface TherapistCandidate {
  id: string;
  specialties: string[];
  languages: string[];
  careFormats: Array<"virtual" | "in_person">;
}

export function rankTherapists(intake: IntakeInput, candidates: TherapistCandidate[]): TherapistMatch[] {
  return candidates
    .map((candidate) => {
      let score = 0;
      const reasons: string[] = [];

      const specialtyHits = candidate.specialties.filter((s) => intake.specialties.includes(s));
      score += specialtyHits.length * 25;
      if (specialtyHits.length) reasons.push(`Specialty match: ${specialtyHits.join(", ")}`);

      if (candidate.languages.includes(intake.language)) {
        score += 20;
        reasons.push(`Language match: ${intake.language}`);
      }

      if (intake.careFormat === "either" || candidate.careFormats.includes(intake.careFormat)) {
        score += 15;
        reasons.push("Preferred care format supported");
      }

      score += 10;
      return { therapistId: candidate.id, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export function canAccessRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}
