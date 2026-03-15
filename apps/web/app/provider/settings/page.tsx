"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SPECIALTIES = ["Anxiety", "Depression", "Trauma/PTSD", "Relationships", "Grief", "Life Transitions", "Self-Esteem", "Stress Management"];
const MODALITIES = ["CBT", "DBT", "EMDR", "Mindfulness", "Family Therapy", "Psychodynamic", "ACT", "Solution-Focused"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PERIODS = ["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)"];

export default function ProviderSettingsPage() {
  const [profile, setProfile] = useState({ name: "Dr. Emily Chen", bio: "Licensed clinical social worker specializing in anxiety and trauma-informed care.", credentials: "LCSW, EMDR Certified", npi: "1234567890", licenseNumber: "LCSW-78412", licenseState: "CA" });
  const [specialties, setSpecialties] = useState<string[]>(["Anxiety", "Depression", "Trauma/PTSD"]);
  const [modalities, setModalities] = useState<string[]>(["CBT", "DBT", "EMDR"]);
  const [availability, setAvailability] = useState<Record<string, string[]>>({ Mon: ["Morning (8am–12pm)", "Afternoon (12pm–5pm)"], Tue: ["Morning (8am–12pm)"], Wed: ["Afternoon (12pm–5pm)"], Thu: ["Morning (8am–12pm)", "Afternoon (12pm–5pm)"], Fri: ["Morning (8am–12pm)"] });
  const [rate, setRate] = useState("150");
  const [acceptsInsurance, setAcceptsInsurance] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const toggleAvail = (day: string, period: string) => {
    setAvailability((prev) => {
      const current = prev[day] ?? [];
      return { ...prev, [day]: current.includes(period) ? current.filter((p) => p !== period) : [...current, period] };
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your profile, specialties, and availability</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="specialties">Specialties</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="rates">Rates</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Full Name</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Bio</Label>
                  <Textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Credentials</Label>
                  <Input value={profile.credentials} onChange={(e) => setProfile({ ...profile, credentials: e.target.value })} placeholder="e.g. LCSW, PhD" />
                </div>
                <div className="space-y-1.5">
                  <Label>NPI Number</Label>
                  <Input value={profile.npi} onChange={(e) => setProfile({ ...profile, npi: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>License Number</Label>
                  <Input value={profile.licenseNumber} onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>License State</Label>
                  <Input value={profile.licenseState} onChange={(e) => setProfile({ ...profile, licenseState: e.target.value })} placeholder="e.g. CA" />
                </div>
              </div>
              <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>{saved ? "Saved!" : "Save Profile"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specialties Tab */}
        <TabsContent value="specialties">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Specialties</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPECIALTIES.map((s) => (
                    <label key={s} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <input type="checkbox" checked={specialties.includes(s)} onChange={() => toggle(specialties, setSpecialties, s)} className="accent-primary" />
                      <span className="text-sm">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">Therapeutic Modalities</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MODALITIES.map((m) => (
                    <label key={m} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <input type="checkbox" checked={modalities.includes(m)} onChange={() => toggle(modalities, setModalities, m)} className="accent-primary" />
                      <span className="text-sm">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>{saved ? "Saved!" : "Save Specialties"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">Set your recurring weekly availability</p>
              {DAYS.map((day) => (
                <div key={day} className="flex items-start gap-4">
                  <span className="text-sm font-medium text-foreground w-8 mt-2">{day}</span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {PERIODS.map((period) => {
                      const active = (availability[day] ?? []).includes(period);
                      return (
                        <button key={period} onClick={() => toggleAvail(day, period)}
                          className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                          {period.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>{saved ? "Saved!" : "Save Availability"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rates Tab */}
        <TabsContent value="rates">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-1.5 max-w-xs">
                <Label>Hourly Rate (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input value={rate} onChange={(e) => setRate(e.target.value)} className="pl-7" type="number" min="0" />
                </div>
                <p className="text-xs text-muted-foreground">Per 50-minute session</p>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border rounded-lg max-w-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={acceptsInsurance} onChange={(e) => setAcceptsInsurance(e.target.checked)} className="accent-primary" />
                  <span className="text-sm text-foreground">Accepts Insurance</span>
                </label>
              </div>
              <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>{saved ? "Saved!" : "Save Rates"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
