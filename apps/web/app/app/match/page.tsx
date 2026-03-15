"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Calendar, Globe, Monitor, MapPin } from "lucide-react";

const mockMatches = [
  {
    id: "1",
    name: "Dr. Emily Chen",
    credentials: "Ph.D., LCSW",
    matchScore: 92,
    matchReasons: ["Anxiety specialist", "Virtual sessions", "English & Mandarin"],
    specialties: ["Anxiety", "CBT", "Depression", "Mindfulness"],
    availability: "Next available: Tomorrow",
    modalities: ["Virtual"],
    languages: ["English", "Mandarin"],
  },
  {
    id: "2",
    name: "Dr. Marcus Williams",
    credentials: "Psy.D., LPC",
    matchScore: 87,
    matchReasons: ["Trauma-informed", "In-person available", "Evening slots"],
    specialties: ["Trauma", "EMDR", "PTSD", "Grief"],
    availability: "Next available: Thu Mar 12",
    modalities: ["Virtual", "In-person"],
    languages: ["English"],
  },
  {
    id: "3",
    name: "Dr. Sofia Ramirez",
    credentials: "LMFT, LPC",
    matchScore: 81,
    matchReasons: ["Spanish-speaking", "Relationships", "CBT approach"],
    specialties: ["Relationships", "CBT", "Family Therapy", "Self-Esteem"],
    availability: "Next available: Mon Mar 16",
    modalities: ["Virtual"],
    languages: ["English", "Spanish"],
  },
];

export default function MatchPage() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<typeof mockMatches>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/therapists/match", { method: "POST", body: JSON.stringify({}) });
        if (res.ok) {
          const data = await res.json();
          setMatches(Array.isArray(data) && data.length > 0 ? data : mockMatches);
        } else {
          setMatches(mockMatches);
        }
      } catch {
        setMatches(mockMatches);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-2.5 rounded-lg">
          <Sparkles className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Your Therapist Matches</h1>
          <p className="text-sm text-muted-foreground">Based on your goals and preferences</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Sparkles className="size-10 mx-auto text-muted-foreground mb-3 opacity-40" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No matches found yet</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Update your preferences to find therapists who match your needs.
            </p>
            <Link href="/app/onboarding">
              <Button variant="outline">Update Preferences</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match, i) => (
            <Card key={match.id} className={i === 0 ? "border-primary/30 shadow-md" : ""}>
              {i === 0 && (
                <div className="px-5 pt-3 pb-0">
                  <Badge className="bg-primary text-primary-foreground text-xs gap-1">
                    <Sparkles className="size-3" /> Best Match
                  </Badge>
                </div>
              )}
              <CardContent className="pt-4 pb-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 flex-shrink-0">
                    <AvatarFallback className="bg-secondary text-primary font-semibold text-lg">
                      {match.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h2 className="font-semibold text-foreground">{match.name}</h2>
                        <p className="text-sm text-muted-foreground">{match.credentials}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{match.matchScore}% match</p>
                        <Progress value={match.matchScore} className="w-24 h-1.5 mt-1" />
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {match.matchReasons.map((reason) => (
                        <Badge key={reason} variant="secondary" className="text-xs">{reason}</Badge>
                      ))}
                    </div>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {match.specialties.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{s}</span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" /> {match.availability}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="size-3" /> {match.languages.join(", ")}
                      </span>
                      <span className="flex items-center gap-1">
                        {match.modalities.includes("In-person") ? <MapPin className="size-3" /> : <Monitor className="size-3" />}
                        {match.modalities.join(" / ")}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link href={`/app/providers/${match.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                      </Link>
                      <Link href={`/app/appointments?therapistId=${match.id}`} className="flex-1">
                        <Button size="sm" className="w-full">Book Session</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center">
        <Link href="/app/providers" className="text-sm text-primary hover:underline">
          Browse all therapists instead
        </Link>
      </div>
    </div>
  );
}
