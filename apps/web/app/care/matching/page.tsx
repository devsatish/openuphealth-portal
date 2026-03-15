"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Check, RefreshCw } from "lucide-react";

interface Match {
  id: string;
  patientName: string;
  therapistName: string;
  matchScore: number;
  reasons: string[];
  status: "pending" | "confirmed" | "reassigned";
}

const mockMatches: Match[] = [
  { id: "1", patientName: "Jordan Rivera", therapistName: "Dr. Emily Chen", matchScore: 92, reasons: ["CBT specialty matches goals", "Availability overlap Mon/Wed", "Insurance in-network"], status: "pending" },
  { id: "2", patientName: "Casey Thomas", therapistName: "Dr. Marcus Johnson", matchScore: 87, reasons: ["DBT expertise for depression", "Self-pay rate matches budget", "Evening availability"], status: "pending" },
  { id: "3", patientName: "Morgan Lee", therapistName: "Dr. Laura Kim", matchScore: 95, reasons: ["Grief specialization", "Flexible schedule", "Strong patient ratings"], status: "confirmed" },
  { id: "4", patientName: "Riley Chen", therapistName: "Dr. Priya Patel", matchScore: 89, reasons: ["EMDR certified for PTSD", "Insurance verified", "High match preference"], status: "pending" },
];

const alternateTherapists = [
  { id: "t1", name: "Dr. Emily Chen", specialties: "Anxiety, CBT" },
  { id: "t2", name: "Dr. Marcus Johnson", specialties: "Depression, DBT" },
  { id: "t3", name: "Dr. Priya Patel", specialties: "Trauma, EMDR" },
  { id: "t4", name: "Dr. Laura Kim", specialties: "Grief, Relationships" },
];

export default function MatchingPage() {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [reassignModal, setReassignModal] = useState<Match | null>(null);
  const [selectedAlt, setSelectedAlt] = useState("");

  const confirm = (id: string) => setMatches((prev) => prev.map((m) => m.id === id ? { ...m, status: "confirmed" } : m));
  const handleReassign = () => {
    if (!reassignModal) return;
    const therapist = alternateTherapists.find((t) => t.id === selectedAlt);
    if (!therapist) return;
    setMatches((prev) => prev.map((m) => m.id === reassignModal.id ? { ...m, therapistName: therapist.name, status: "pending", matchScore: Math.floor(70 + Math.random() * 20) } : m));
    setReassignModal(null);
    setSelectedAlt("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Matching Review</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review and confirm AI-suggested therapist matches</p>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className={match.status === "confirmed" ? "border-green-200 bg-green-50/30" : ""}>
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Patient + Therapist */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-center">
                    <Avatar className="h-10 w-10 mx-auto">
                      <AvatarFallback className="bg-secondary text-primary text-xs font-semibold">
                        {match.patientName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-0.5 w-20 truncate">{match.patientName.split(" ")[0]}</p>
                  </div>
                  <div className="text-muted-foreground text-sm font-bold px-2">→</div>
                  <div className="text-center">
                    <Avatar className="h-10 w-10 mx-auto">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {match.therapistName.replace("Dr. ", "").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-0.5 w-20 truncate">{match.therapistName.replace("Dr. ", "")}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                  <p className="text-xs text-muted-foreground">Match Score</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${match.matchScore}%` }} />
                  </div>
                  <p className="text-sm font-bold text-primary">{match.matchScore}%</p>
                </div>

                {/* Reasons */}
                <div className="flex-1 min-w-0">
                  <ul className="space-y-0.5">
                    {match.reasons.map((r, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-green-600 mt-0.5">✓</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {match.status === "confirmed" ? (
                    <Badge className="bg-green-100 text-green-800 gap-1"><Check className="size-3" /> Confirmed</Badge>
                  ) : (
                    <>
                      <Button size="sm" className="gap-1" onClick={() => confirm(match.id)}>
                        <Check className="size-3" /> Confirm
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => setReassignModal(match)}>
                        <RefreshCw className="size-3" /> Reassign
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reassign Modal */}
      {reassignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Reassign Therapist</h2>
              <button onClick={() => setReassignModal(null)}><X className="size-5 text-muted-foreground" /></button>
            </div>
            <p className="text-sm text-muted-foreground">Select a new therapist for <strong>{reassignModal.patientName}</strong></p>
            <div className="space-y-2">
              {alternateTherapists.map((t) => (
                <label key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedAlt === t.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                  <input type="radio" name="alt" value={t.id} checked={selectedAlt === t.id} onChange={() => setSelectedAlt(t.id)} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.specialties}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setReassignModal(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleReassign} disabled={!selectedAlt} className="flex-1">Reassign</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
