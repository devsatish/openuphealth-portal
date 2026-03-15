import Link from "next/link";
import { Shield, Heart, Calendar, Video, CheckCircle, MessageSquare, BarChart3, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "How It Works" };

const steps = [
  {
    number: "01",
    icon: Shield,
    title: "Complete Your Assessment",
    description: "Take our confidential intake questionnaire designed by clinical psychologists. It takes about 10-15 minutes and helps us understand your unique needs, preferences, and therapy goals.",
    details: ["Personal background and therapy goals", "Communication preferences", "Scheduling availability", "Insurance information (optional)"],
  },
  {
    number: "02",
    icon: Heart,
    title: "Get Matched with Your Therapist",
    description: "Our intelligent matching algorithm considers over 30 factors to pair you with therapists who specialize in your needs. You can review profiles and choose the therapist that feels right.",
    details: ["Specialty and expertise matching", "Language and cultural preferences", "Availability alignment", "Therapy approach compatibility"],
  },
  {
    number: "03",
    icon: Calendar,
    title: "Schedule Your First Session",
    description: "Book your first session at a time that works for you. We offer morning, evening, and weekend slots. Your therapist will be prepared with your assessment results.",
    details: ["Flexible scheduling with easy rescheduling", "Same-week appointments available", "Calendar integration and reminders", "Choose video, phone, or messaging"],
  },
  {
    number: "04",
    icon: Video,
    title: "Begin Your Healing Journey",
    description: "Connect with your therapist through our secure, HIPAA-conscious platform. Between sessions, track your progress, practice exercises, and message your therapist.",
    details: ["Secure, encrypted video sessions", "Progress tracking and mood check-ins", "Between-session messaging", "Access to self-guided wellness resources"],
  },
];

const benefits = [
  { icon: Lock, title: "100% Confidential", description: "Your data is encrypted and never shared without your consent." },
  { icon: MessageSquare, title: "Ongoing Support", description: "Message your therapist between sessions for continuous care." },
  { icon: BarChart3, title: "Track Progress", description: "See your improvement over time with validated assessment tools." },
  { icon: CheckCircle, title: "Evidence-Based", description: "All therapists use scientifically-backed therapeutic approaches." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">How OpenUp Health Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting started with therapy should be simple. We have designed every step to make the process as smooth and comfortable as possible.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.number} className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className="flex-1">
                  <div className="text-sm font-bold text-primary mb-2">STEP {step.number}</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">{step.title}</h2>
                  <p className="text-muted-foreground mb-6 text-lg">{step.description}</p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <CheckCircle className="size-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 max-w-md">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl p-8 flex items-center justify-center aspect-square">
                    <div className="bg-card rounded-2xl p-6 shadow-lg">
                      <step.icon className="size-16 text-primary mx-auto mb-4" />
                      <p className="text-center font-semibold text-foreground">{step.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Built for Your Wellbeing</h2>
            <p className="text-xl text-muted-foreground">Every feature is designed with your mental health in mind</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-4">
                  <b.icon className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Ready to Take the First Step?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Your free assessment takes just 10 minutes. No commitment required.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Start Your Free Assessment</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
