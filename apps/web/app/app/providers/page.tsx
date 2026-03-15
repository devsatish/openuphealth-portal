"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Monitor, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

const mockTherapists = [
  { id: "1", name: "Dr. Emily Chen", credentials: "Ph.D., LCSW", specialties: ["Anxiety", "CBT", "Depression"], modalities: ["Virtual"], languages: ["English", "Mandarin"], hourlyRate: 150, acceptsInsurance: true },
  { id: "2", name: "Dr. Marcus Williams", credentials: "Psy.D., LPC", specialties: ["Trauma", "EMDR", "PTSD", "Grief"], modalities: ["Virtual", "In-person"], languages: ["English"], hourlyRate: 175, acceptsInsurance: true },
  { id: "3", name: "Dr. Sofia Ramirez", credentials: "LMFT, LPC", specialties: ["Relationships", "CBT", "Family Therapy"], modalities: ["Virtual"], languages: ["English", "Spanish"], hourlyRate: 130, acceptsInsurance: false },
  { id: "4", name: "Dr. James Park", credentials: "Ph.D., LP", specialties: ["Mindfulness", "Stress", "Life Transitions"], modalities: ["In-person"], languages: ["English", "Korean"], hourlyRate: 160, acceptsInsurance: true },
  { id: "5", name: "Dr. Aisha Johnson", credentials: "LCSW", specialties: ["Self-Esteem", "DBT", "Anxiety"], modalities: ["Virtual", "In-person"], languages: ["English"], hourlyRate: 120, acceptsInsurance: true },
  { id: "6", name: "Dr. Rachel Torres", credentials: "Psy.D.", specialties: ["LGBTQ+ Support", "Depression", "Trauma"], modalities: ["Virtual"], languages: ["English", "Spanish"], hourlyRate: 140, acceptsInsurance: false },
];

const allSpecialties = ["Anxiety", "CBT", "DBT", "Depression", "EMDR", "Family Therapy", "Grief", "LGBTQ+ Support", "Life Transitions", "Mindfulness", "PTSD", "Relationships", "Self-Esteem", "Stress", "Trauma"];

export default function ProvidersPage() {
  const [loading, setLoading] = useState(true);
  const [therapists, setTherapists] = useState<typeof mockTherapists>([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [modality, setModality] = useState("All");
  const [insuranceOnly, setInsuranceOnly] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/therapists");
        if (res.ok) {
          const data = await res.json();
          setTherapists(Array.isArray(data) && data.length > 0 ? data : mockTherapists);
        } else {
          setTherapists(mockTherapists);
        }
      } catch {
        setTherapists(mockTherapists);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = therapists.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()))) return false;
    if (selectedSpecialties.length > 0 && !selectedSpecialties.some((s) => t.specialties.includes(s))) return false;
    if (modality !== "All" && !t.modalities.includes(modality)) return false;
    if (insuranceOnly && !t.acceptsInsurance) return false;
    return true;
  });

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Find a Therapist</h1>
        <p className="text-muted-foreground mt-1">Browse our network of licensed mental health professionals</p>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <aside className="w-56 flex-shrink-0 space-y-5">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Modality</p>
            <div className="space-y-1">
              {["All", "Virtual", "In-person"].map((m) => (
                <button
                  key={m}
                  onClick={() => setModality(m)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                    modality === m ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Specialties</p>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {allSpecialties.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer px-1">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    checked={selectedSpecialties.includes(s)}
                    onChange={() => toggleSpecialty(s)}
                  />
                  <span className="text-sm text-muted-foreground">{s}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                checked={insuranceOnly}
                onChange={(e) => setInsuranceOnly(e.target.checked)}
              />
              <span className="text-sm font-medium text-foreground">Accepts Insurance</span>
            </label>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="text-sm text-muted-foreground">{filtered.length} therapist{filtered.length !== 1 ? "s" : ""} found</p>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">No therapists match your filters.</p>
                <Button variant="outline" className="mt-3" onClick={() => { setSearch(""); setSelectedSpecialties([]); setModality("All"); setInsuranceOnly(false); }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((t) => (
                <Card key={t.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarFallback className="bg-secondary text-primary font-semibold">
                          {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm">{t.name}</h3>
                        <p className="text-xs text-muted-foreground">{t.credentials}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {t.specialties.slice(0, 3).map((s) => (
                            <span key={s} className="text-xs px-1.5 py-0.5 bg-secondary text-primary rounded-full">{s}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            {t.modalities.includes("Virtual") ? <Monitor className="size-3" /> : <MapPin className="size-3" />}
                            {t.modalities.join(" / ")}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <DollarSign className="size-3" />{t.hourlyRate}/hr
                          </span>
                          {t.acceptsInsurance && <Badge variant="outline" className="text-xs py-0">Insurance</Badge>}
                        </div>
                      </div>
                    </div>
                    <Link href={`/app/providers/${t.id}`} className="block mt-3">
                      <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
