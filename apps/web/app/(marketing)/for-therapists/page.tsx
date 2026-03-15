import Link from "next/link";
import { Users, Calendar, DollarSign, Shield, BarChart3, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "For Therapists" };

const benefits = [
  { icon: Users, title: "Steady Client Flow", description: "We handle marketing and matching, so you can focus on what you do best: helping people." },
  { icon: Calendar, title: "Flexible Schedule", description: "Set your own hours and availability. Work from anywhere with our secure telehealth platform." },
  { icon: DollarSign, title: "Competitive Pay", description: "Earn competitive rates with transparent payouts. No hidden fees or surprise deductions." },
  { icon: Shield, title: "Credentialing Support", description: "We help with insurance credentialing and handle billing so you do not have to." },
  { icon: BarChart3, title: "Clinical Tools", description: "Access validated assessments, progress tracking, and session notes built into the platform." },
  { icon: Briefcase, title: "Professional Growth", description: "Continuing education credits, peer consultation groups, and professional development resources." },
];

const requirements = [
  "Active, unrestricted license (LCSW, LMFT, LPC, PsyD, PhD, MD)",
  "Minimum 3 years post-licensure clinical experience",
  "Malpractice insurance",
  "Reliable internet connection and private practice space",
  "Commitment to evidence-based practices",
  "Comfort with telehealth technology",
];

export default function ForTherapistsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Briefcase className="size-4" /> For Therapists
              </div>
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Grow Your Practice. Help More People.
              </h1>
              <p className="text-xl text-muted-foreground">
                Join our network of 500+ licensed therapists providing quality mental healthcare. We handle the business side so you can focus on clinical work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Apply to Join
                    <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Schedule a Call</Link>
                </Button>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-6">By the Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary">$85-120</div>
                  <div className="text-sm text-muted-foreground">Per session rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Therapists in network</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">40+</div>
                  <div className="text-sm text-muted-foreground">Insurance plans accepted</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Therapist satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Therapists Love OpenUp Health</h2>
            <p className="text-xl text-muted-foreground">We take care of the business so you can take care of patients</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">How to Join</h2>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Submit Application", desc: "Complete our online application with your credentials and experience." },
                  { step: "2", title: "Credential Review", desc: "Our team verifies your license, experience, and references." },
                  { step: "3", title: "Onboarding", desc: "Complete platform training and set up your profile and availability." },
                  { step: "4", title: "Start Seeing Clients", desc: "Begin receiving matched client referrals and grow your practice." },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{s.title}</h3>
                      <p className="text-muted-foreground text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">Requirements</h3>
              <ul className="space-y-4">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle className="size-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Ready to Join Our Network?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Applications are reviewed within 5 business days. Most therapists are onboarded within 2 weeks.
          </p>
          <Link
            href="/signup"
            className="bg-primary-foreground text-primary px-8 py-4 rounded-lg hover:bg-primary-foreground/90 transition-colors inline-block font-medium"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </>
  );
}
