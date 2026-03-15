import Link from "next/link";
import { Heart, Shield, Clock, Video, MessageSquare, BarChart3, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "For Individuals" };

const benefits = [
  { icon: Heart, title: "Personalized Matching", description: "Get paired with a therapist who specializes in your needs, speaks your language, and matches your preferences." },
  { icon: Video, title: "Flexible Sessions", description: "Choose between video, phone, or messaging. Sessions available mornings, evenings, and weekends." },
  { icon: Shield, title: "Complete Privacy", description: "Your sessions are encrypted end-to-end. Your information is never shared without your explicit consent." },
  { icon: BarChart3, title: "Track Your Progress", description: "Use validated assessments and mood tracking to see your improvement over time." },
  { icon: MessageSquare, title: "Between-Session Support", description: "Message your therapist between sessions. Get support when you need it, not just during appointments." },
  { icon: Clock, title: "Quick Access", description: "Most patients are matched within 24 hours and can schedule their first session within the week." },
];

const conditions = [
  "Anxiety & Panic Disorders", "Depression", "Stress & Burnout", "Relationship Issues",
  "Trauma & PTSD", "Grief & Loss", "Self-Esteem", "Life Transitions",
  "Sleep Issues", "Work-Life Balance", "ADHD", "OCD",
];

export default function ForIndividualsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="size-4" /> For Individuals
              </div>
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Mental Health Care That Fits Your Life
              </h1>
              <p className="text-xl text-muted-foreground">
                Whether you are dealing with anxiety, depression, relationship challenges, or just need someone to talk to, we connect you with the right therapist.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started Today</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-3xl p-8">
              <div className="space-y-4">
                <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="size-5 text-yellow-500" fill="currentColor" />
                    <span className="font-semibold text-foreground">4.9 out of 5</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Average patient satisfaction rating across 50,000+ sessions</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
                    <div className="text-2xl font-bold text-primary">92%</div>
                    <div className="text-xs text-muted-foreground">Report improvement after 8 sessions</div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
                    <div className="text-2xl font-bold text-primary">24h</div>
                    <div className="text-xs text-muted-foreground">Average time to therapist match</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">Comprehensive mental health support designed around you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
                  <b.icon className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">We Can Help With</h2>
            <p className="text-xl text-muted-foreground">Our therapists specialize in a wide range of conditions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {conditions.map((c) => (
              <div key={c} className="flex items-center gap-2 bg-card border border-border rounded-lg p-4">
                <CheckCircle className="size-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Start Your Healing Journey Today</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Take the first step. Your future self will thank you.
          </p>
          <Link
            href="/signup"
            className="bg-primary-foreground text-primary px-8 py-4 rounded-lg hover:bg-primary-foreground/90 transition-colors inline-block font-medium"
          >
            Get Matched with a Therapist
          </Link>
        </div>
      </section>
    </>
  );
}
