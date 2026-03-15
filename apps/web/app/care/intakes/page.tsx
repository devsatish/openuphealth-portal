"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X } from "lucide-react";

type IntakeStatus = "new" | "reviewing" | "assigned";

interface Intake {
  id: string;
  name: string;
  email: string;
  submitted: string;
  goals: string;
  paymentType: string;
  status: IntakeStatus;
}

const mockIntakes: Intake[] = [
  { id: "1", name: "Jordan Rivera", email: "jordan@example.com", submitted: "2026-03-08", goals: "Anxiety management, work stress and burnout", paymentType: "Insurance", status: "new" },
  { id: "2", name: "Casey Thomas", email: "casey@example.com", submitted: "2026-03-08", goals: "Depression, relationship issues", paymentType: "Self-Pay", status: "new" },
  { id: "3", name: "Morgan Lee", email: "morgan@example.com", submitted: "2026-03-07", goals: "Grief and loss counseling", paymentType: "EAP", status: "reviewing" },
  { id: "4", name: "Riley Chen", email: "riley@example.com", submitted: "2026-03-07", goals: "PTSD, sleep and anxiety issues", paymentType: "Insurance", status: "reviewing" },
  { id: "5", name: "Avery Brooks", email: "avery@example.com", submitted: "2026-03-06", goals: "Life transitions, career stress", paymentType: "Self-Pay", status: "assigned" },
  { id: "6", name: "Sam Wilson", email: "sam@example.com", submitted: "2026-03-05", goals: "Family conflict, communication", paymentType: "Insurance", status: "assigned" },
];

const mockTherapists = [
  { id: "t1", name: "Dr. Emily Chen", specialties: "Anxiety, CBT" },
  { id: "t2", name: "Dr. Marcus Johnson", specialties: "Depression, DBT" },
  { id: "t3", name: "Dr. Priya Patel", specialties: "Trauma, EMDR" },
  { id: "t4", name: "Dr. Laura Kim", specialties: "Grief, Relationships" },
];

const STATUS_CONFIG: Record<IntakeStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-100 text-blue-800" },
  reviewing: { label: "Reviewing", className: "bg-yellow-100 text-yellow-800" },
  assigned: { label: "Assigned", className: "bg-green-100 text-green-800" },
};

type FilterType = "all" | IntakeStatus;

export default function IntakesPage() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [modalIntake, setModalIntake] = useState<Intake | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/intake");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setIntakes(data); return; }
        }
      } catch { /* fallback */ }
      finally { setIntakes(mockIntakes); setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter === "all" ? intakes : intakes.filter((i) => i.status === filter);

  const handleAssign = () => {
    if (!modalIntake || !selectedTherapist) return;
    setIntakes((prev) => prev.map((i) => i.id === modalIntake.id ? { ...i, status: "assigned" as const } : i));
    setModalIntake(null);
    setSelectedTherapist("");
  };

  const FILTER_TABS: FilterType[] = ["all", "new", "reviewing", "assigned"];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Intake Queue</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review and assign incoming patient intakes</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {FILTER_TABS.map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${filter === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Patient", "Email", "Submitted", "Goals", "Payment", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((intake) => (
                    <tr key={intake.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{intake.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{intake.email}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(intake.submitted).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground max-w-[200px]">
                        <span className="truncate block">{intake.goals}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{intake.paymentType}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${STATUS_CONFIG[intake.status].className}`}>{STATUS_CONFIG[intake.status].label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => setModalIntake(intake)}>
                          Assign Therapist
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No intakes in this category</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Modal */}
      {modalIntake && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Assign Therapist</h2>
              <button onClick={() => setModalIntake(null)} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>
            <p className="text-sm text-muted-foreground">Assigning therapist for <strong>{modalIntake.name}</strong></p>
            <div className="space-y-2">
              {mockTherapists.map((t) => (
                <label key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedTherapist === t.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                  <input type="radio" name="therapist" value={t.id} checked={selectedTherapist === t.id} onChange={() => setSelectedTherapist(t.id)} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.specialties}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalIntake(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleAssign} disabled={!selectedTherapist} className="flex-1">Assign</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
