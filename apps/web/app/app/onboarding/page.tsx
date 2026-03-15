"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;

const therapyGoals = ["Anxiety", "Depression", "Stress", "Relationships", "Trauma", "Grief", "Self-Esteem", "Life Transitions", "LGBTQ+ Support", "Other"];
const specialties = ["Anxiety", "CBT", "DBT", "EMDR", "Family Therapy", "Mindfulness"];
const availabilityOptions = ["Morning", "Afternoon", "Evening", "Weekends"];

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (val: string[]) => void }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            "px-3 py-1.5 rounded-full border text-sm font-medium transition-colors",
            selected.includes(opt)
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function RadioGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 py-1.5 rounded-md border text-sm font-medium transition-colors",
            value === opt
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Step 1
  const [goals, setGoals] = useState<string[]>([]);

  // Step 2
  const [genderPref, setGenderPref] = useState("Any");
  const [language, setLanguage] = useState("English");
  const [sessionFormat, setSessionFormat] = useState("Either");
  const [availability, setAvailability] = useState<string[]>([]);
  const [specialtyPrefs, setSpecialtyPrefs] = useState<string[]>([]);

  // Step 3
  const [paymentType, setPaymentType] = useState<"insurance" | "self-pay">("insurance");
  const [carrier, setCarrier] = useState("");
  const [memberId, setMemberId] = useState("");
  const [groupNumber, setGroupNumber] = useState("");

  // Step 4
  const [privacyAck, setPrivacyAck] = useState(false);
  const [termsAck, setTermsAck] = useState(false);
  const [crisisAck, setCrisisAck] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals,
          genderPreference: genderPref,
          language,
          sessionFormat,
          availability,
          specialtyPreferences: specialtyPrefs,
          paymentType,
          insuranceCarrier: carrier,
          memberId,
          groupNumber,
        }),
      });
    } catch {
      // continue even if API fails
    }
    setDone(true);
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="bg-accent p-4 rounded-full">
              <CheckCircle className="size-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You&apos;re all set!</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;re matching you with therapists based on your preferences. This usually takes less than a minute.
          </p>
          <Button onClick={() => router.push("/app/match")} className="w-full">
            View My Matches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-xl p-2">
            <Heart className="size-5 text-primary-foreground" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Getting Started</h1>
            <p className="text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
          </div>
        </div>

        <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />

        <Card>
          {/* Step 1 */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>What brings you here?</CardTitle>
                <CardDescription>Select all the areas you&apos;d like to work on. You can update these anytime.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CheckboxGroup options={therapyGoals} selected={goals} onChange={setGoals} />
              </CardContent>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
                <CardDescription>Help us find the right therapist for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Therapist Gender Preference</Label>
                  <RadioGroup options={["Any", "Female", "Male", "Non-binary"]} value={genderPref} onChange={setGenderPref} />
                </div>
                <div className="space-y-2">
                  <Label>Preferred Language</Label>
                  <RadioGroup options={["English", "Spanish", "French", "Mandarin", "Other"]} value={language} onChange={setLanguage} />
                </div>
                <div className="space-y-2">
                  <Label>Session Format</Label>
                  <RadioGroup options={["Virtual", "In-person", "Either"]} value={sessionFormat} onChange={setSessionFormat} />
                </div>
                <div className="space-y-2">
                  <Label>Availability</Label>
                  <CheckboxGroup options={availabilityOptions} selected={availability} onChange={setAvailability} />
                </div>
                <div className="space-y-2">
                  <Label>Specialty Preferences</Label>
                  <CheckboxGroup options={specialties} selected={specialtyPrefs} onChange={setSpecialtyPrefs} />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Insurance & Payment</CardTitle>
                <CardDescription>How would you like to pay for sessions?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType("insurance")}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-colors",
                      paymentType === "insurance" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    )}
                  >
                    Use Insurance
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("self-pay")}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium transition-colors",
                      paymentType === "self-pay" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    )}
                  >
                    Self-Pay
                  </button>
                </div>

                {paymentType === "insurance" && (
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="carrier">Insurance Carrier</Label>
                      <Input id="carrier" placeholder="e.g. Aetna, BCBS, Cigna" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="memberId">Member ID</Label>
                      <Input id="memberId" placeholder="Found on your insurance card" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="groupNumber">Group Number</Label>
                      <Input id="groupNumber" placeholder="Found on your insurance card" value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} />
                    </div>
                  </div>
                )}

                {paymentType === "self-pay" && (
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <p className="font-medium text-foreground text-sm">Self-Pay Rates</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Initial consultation: <strong className="text-foreground">Free (15 min)</strong></li>
                      <li>• 50-minute session: <strong className="text-foreground">from $80</strong></li>
                      <li>• Sliding scale available for qualifying individuals</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Consent & Privacy</CardTitle>
                <CardDescription>Please review and acknowledge the following before we begin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4" checked={privacyAck} onChange={(e) => setPrivacyAck(e.target.checked)} />
                  <span className="text-sm text-muted-foreground">
                    I have read and agree to the <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>. I understand how my health data is collected, stored, and protected in compliance with HIPAA.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4" checked={termsAck} onChange={(e) => setTermsAck(e.target.checked)} />
                  <span className="text-sm text-muted-foreground">
                    I agree to the <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>, including the cancellation policy and session guidelines.
                  </span>
                </label>

                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 h-4 w-4" checked={crisisAck} onChange={(e) => setCrisisAck(e.target.checked)} />
                    <span className="text-sm text-muted-foreground">
                      <strong className="text-destructive">Important:</strong> I understand that OpenUpHealth is NOT an emergency service. If I am in immediate danger or crisis, I will call{" "}
                      <strong>911</strong> or the{" "}
                      <strong>988 Suicide &amp; Crisis Lifeline</strong> (call or text 988).
                    </span>
                  </label>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!privacyAck || !termsAck || !crisisAck || submitting}
            >
              {submitting ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
