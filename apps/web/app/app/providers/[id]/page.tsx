import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Monitor, MapPin, Globe, DollarSign, Shield, Clock } from "lucide-react";

const mockProfile = {
  id: "1",
  name: "Dr. Emily Chen",
  credentials: "Ph.D., LCSW",
  title: "Licensed Clinical Social Worker",
  bio: "Dr. Chen is a compassionate and evidence-based therapist with over 10 years of experience helping individuals navigate anxiety, depression, and life transitions. Her approach blends Cognitive Behavioral Therapy (CBT) with mindfulness practices, creating a warm and structured therapeutic space. She believes in meeting clients where they are and helping them build sustainable tools for lasting change.",
  specialties: ["Anxiety", "CBT", "Depression", "Mindfulness", "Life Transitions", "Stress Management"],
  modalities: ["Virtual", "In-person"],
  languages: ["English", "Mandarin"],
  hourlyRate: 150,
  acceptsInsurance: true,
  insuranceCarriers: ["Aetna", "BCBS", "Cigna", "UnitedHealthcare"],
  availability: [
    { day: "Monday", slots: ["9:00 AM", "11:00 AM", "2:00 PM"] },
    { day: "Tuesday", slots: ["10:00 AM", "1:00 PM"] },
    { day: "Wednesday", slots: ["9:00 AM", "3:00 PM", "5:00 PM"] },
    { day: "Thursday", slots: ["11:00 AM", "2:00 PM"] },
    { day: "Friday", slots: ["9:00 AM", "10:00 AM"] },
  ],
};

export default async function TherapistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // In production, fetch from API
  const profile = { ...mockProfile, id };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/app/providers" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to Therapists
      </Link>

      {/* Hero */}
      <Card>
        <CardContent className="pt-6 pb-5">
          <div className="flex items-start gap-5 flex-wrap">
            <Avatar className="h-20 w-20 flex-shrink-0">
              <AvatarFallback className="bg-secondary text-primary font-bold text-2xl">
                {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
              <p className="text-primary font-medium">{profile.credentials}</p>
              <p className="text-muted-foreground text-sm">{profile.title}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.modalities.map((m) => (
                  <Badge key={m} variant="secondary" className="gap-1">
                    {m === "Virtual" ? <Monitor className="size-3" /> : <MapPin className="size-3" />}
                    {m}
                  </Badge>
                ))}
                {profile.acceptsInsurance && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 gap-1">
                    <Shield className="size-3" /> Accepts Insurance
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href={`/app/appointments?therapistId=${profile.id}`}>
                <Button className="w-full">Book a Session</Button>
              </Link>
              <Link href="/app/messages">
                <Button variant="outline" className="w-full">Send Message</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* About */}
          <Card>
            <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader><CardTitle className="text-base">Specialties</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="size-4" /> Availability</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.availability.map((a) => (
                  <div key={a.day} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground w-24">{a.day}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {a.slots.map((slot) => (
                        <span key={slot} className="text-xs px-2 py-1 bg-accent text-green-800 rounded-md">{slot}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Pricing */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="size-4" /> Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">50-min session</span>
                <span className="font-semibold text-foreground">${profile.hourlyRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Initial consult</span>
                <span className="font-semibold text-green-600">Free (15 min)</span>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="size-4" /> Languages</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((l) => (
                  <Badge key={l} variant="secondary">{l}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insurance */}
          {profile.acceptsInsurance && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="size-4" /> Insurance</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {profile.insuranceCarriers.map((c) => (
                    <div key={c} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {c}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
