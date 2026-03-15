import Link from "next/link";
import { Building2, TrendingUp, Shield, Users, BarChart3, CheckCircle, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "For Employers" };

const benefits = [
  { icon: TrendingUp, title: "Reduce Absenteeism", description: "Companies using OpenUp Health see a 32% reduction in mental health-related absences." },
  { icon: Users, title: "Improve Retention", description: "Mental health benefits are the #1 requested perk. Show employees you care about their wellbeing." },
  { icon: Shield, title: "Complete Privacy", description: "Employer plans are fully anonymized. You see utilization data, never individual information." },
  { icon: BarChart3, title: "ROI Dashboard", description: "Track program utilization and impact with our employer analytics dashboard." },
  { icon: Heart, title: "Easy Enrollment", description: "Employees can self-enroll in minutes. No complex HR integrations required." },
  { icon: Building2, title: "Scalable Plans", description: "From startups to enterprises, our plans scale with your team." },
];

const plans = [
  { name: "Team", employees: "10-100", price: "$8", features: ["4 sessions/employee/month", "Self-guided resources", "Basic reporting", "Email support"] },
  { name: "Business", employees: "100-1000", price: "$12", features: ["6 sessions/employee/month", "Crisis support line", "Advanced analytics", "Dedicated account manager"], popular: true },
  { name: "Enterprise", employees: "1000+", price: "Custom", features: ["Unlimited sessions", "On-site workshops", "Custom integrations", "24/7 support", "Executive coaching"] },
];

export default function ForEmployersPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Building2 className="size-4" /> For Employers
              </div>
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Invest in Your Team&apos;s Mental Health
              </h1>
              <p className="text-xl text-muted-foreground">
                Provide your employees with access to licensed therapists. Reduce burnout, improve productivity, and build a healthier workplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/contact">
                    Request a Demo
                    <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pricing">View Plans</Link>
                </Button>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <h3 className="text-lg font-semibold text-foreground mb-6">The Business Case for Mental Health</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Reduction in absenteeism</span>
                    <span className="font-bold text-foreground">32%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "32%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Improvement in productivity</span>
                    <span className="font-bold text-foreground">28%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: "28%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">ROI on mental health benefits</span>
                    <span className="font-bold text-foreground">4:1</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: "80%" }}></div>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Employers Choose Us</h2>
            <p className="text-xl text-muted-foreground">A complete mental health solution for your organization</p>
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Employer Plans</h2>
            <p className="text-xl text-muted-foreground">Pricing per employee per month</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 ${plan.popular ? "bg-primary text-primary-foreground shadow-2xl scale-105 relative" : "bg-card border border-border"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-1">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{plan.employees} employees</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>/emp/mo</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 ${plan.popular ? "" : "text-primary"}`} />
                      <span className={plan.popular ? "" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "secondary" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href="/contact">{plan.price === "Custom" ? "Contact Sales" : "Get Started"}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Ready to Support Your Team?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Schedule a demo and see how OpenUp Health can transform your workplace.
          </p>
          <Link
            href="/contact"
            className="bg-primary-foreground text-primary px-8 py-4 rounded-lg hover:bg-primary-foreground/90 transition-colors inline-block font-medium"
          >
            Schedule a Demo
          </Link>
        </div>
      </section>
    </>
  );
}
