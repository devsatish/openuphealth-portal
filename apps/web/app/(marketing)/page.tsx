import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Heart, Shield, Video, Calendar, CheckCircle, Star,
  ArrowRight, Quote, Sparkles, Users, Clock, Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Heart,
    color: "bg-rose-100 text-rose-600",
    title: "Matched Care",
    description: "Our intelligent matching system pairs you with therapists who truly specialize in your needs — not just availability.",
  },
  {
    icon: Calendar,
    color: "bg-amber-100 text-amber-600",
    title: "Flexible Scheduling",
    description: "Evening and weekend appointments available. Book sessions around your life, not the other way around.",
  },
  {
    icon: Shield,
    color: "bg-teal-100 text-teal-700",
    title: "Private & Secure",
    description: "End-to-end encryption and HIPAA-conscious practices. What you share stays between you and your therapist.",
  },
  {
    icon: Leaf,
    color: "bg-green-100 text-green-700",
    title: "Evidence-Based",
    description: "All therapists use proven, research-backed approaches — CBT, DBT, mindfulness, and more.",
  },
];

const steps = [
  { number: "01", title: "Share Your Story", description: "Tell us about yourself through a short, confidential questionnaire. No judgment, no pressure." },
  { number: "02", title: "Meet Your Match", description: "We recommend therapists who specialise in what you're going through." },
  { number: "03", title: "Book a Session", description: "Pick a time that suits you — including evenings and weekends." },
  { number: "04", title: "Begin Healing", description: "Connect securely by video, phone, or messaging from wherever feels comfortable." },
];

const testimonials = [
  {
    quote: "I finally found a therapist who truly gets me. For the first time in years I feel hopeful and equipped to manage my anxiety.",
    name: "Amanda R.",
    role: "Patient for 8 months",
    rating: 5,
    avatar: "AR",
    avatarColor: "bg-rose-100 text-rose-700",
  },
  {
    quote: "As a busy professional I thought therapy wasn't possible for me. OpenUp Health made it happen — on my schedule, from my couch.",
    name: "David M.",
    role: "Patient for 1 year",
    rating: 5,
    avatar: "DM",
    avatarColor: "bg-amber-100 text-amber-700",
  },
  {
    quote: "This platform lets me focus entirely on my clients. The matching system is thoughtful — I'm connected with people I can genuinely help.",
    name: "Dr. Sarah L.",
    role: "Licensed Therapist",
    rating: 5,
    avatar: "SL",
    avatarColor: "bg-teal-100 text-teal-700",
  },
];

const therapists = [
  { name: "Dr. Emily Chen", title: "Licensed Clinical Psychologist", specialties: ["Anxiety", "Depression", "Trauma"], rating: 4.9, reviews: 156, initials: "EC", color: "bg-rose-100 text-rose-700" },
  { name: "Dr. Marcus Johnson", title: "Marriage & Family Therapist", specialties: ["Couples", "Family", "Relationships"], rating: 5.0, reviews: 203, initials: "MJ", color: "bg-amber-100 text-amber-700" },
  { name: "Dr. Sarah Williams", title: "Licensed Clinical Social Worker", specialties: ["Stress", "Mindfulness", "Burnout"], rating: 4.8, reviews: 134, initials: "SW", color: "bg-teal-100 text-teal-700" },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    const role = session.user.role;
    if (role === "therapist") redirect("/provider");
    if (role === "care_coordinator") redirect("/care");
    if (role === "org_admin") redirect("/org");
    if (role === "super_admin") redirect("/admin");
    redirect("/app");
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FDF6EE] via-[#FEF0E2] to-[#FDF6EE] py-20 lg:py-28">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 text-sm text-muted-foreground shadow-sm">
                <Sparkles className="size-4 text-primary" />
                Trusted by 50,000+ people across the US
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                You deserve to feel{" "}
                <span className="text-primary">well</span>.
                <br />
                We&apos;re here to help.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Connect with a licensed therapist from the comfort of your home.
                Real support, real progress — on your terms.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="text-base px-7 py-6 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all" asChild>
                  <Link href="/signup">
                    Start Your Journey
                    <ArrowRight className="size-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-7 py-6 rounded-xl border-border bg-white hover:bg-secondary" asChild>
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </div>
              <div className="flex items-center gap-10 pt-2">
                <div>
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Licensed Therapists</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-foreground">50k+</div>
                  <div className="text-sm text-muted-foreground mt-0.5">People Helped</div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold text-foreground">4.9★</div>
                  <div className="text-sm text-muted-foreground mt-0.5">Average Rating</div>
                </div>
              </div>
            </div>

            {/* Hero card cluster */}
            <div className="relative flex flex-col gap-4 max-w-sm mx-auto lg:mx-0 lg:ml-auto">
              <div className="bg-white rounded-2xl shadow-xl border border-border p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-rose-100 rounded-full p-3">
                    <Video className="size-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Next Session</p>
                    <p className="text-xs text-muted-foreground">Tomorrow · 2:00 PM with Dr. Chen</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Confirmed</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">This Week&apos;s Mood</p>
                  <span className="text-xs text-accent font-medium">↑ Improving</span>
                </div>
                <div className="flex items-end gap-1.5 h-12">
                  {[40, 55, 48, 65, 72, 68, 80].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-primary/20" style={{ height: `${h}%` }}>
                      {i === 6 && <div className="w-full h-full bg-primary rounded-sm" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className="text-xs text-muted-foreground flex-1 text-center">{d}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-border p-5">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 rounded-full p-3">
                    <Heart className="size-5 text-amber-600" fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Wellness Score</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: "78%" }} />
                      </div>
                      <span className="text-xs font-bold text-primary">78%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border border-border rounded-2xl shadow-lg p-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["AR", "DM", "SL"].map((i) => (
                    <div key={i} className="size-7 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-xs font-bold text-primary">{i[0]}</div>
                  ))}
                </div>
                <p className="text-xs font-medium text-foreground pr-1">+2,400 this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-y border-border py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Shield className="size-4 text-primary" /> HIPAA Compliant</div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2"><CheckCircle className="size-4 text-accent" /> Licensed & Verified Therapists</div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2"><Clock className="size-4 text-primary" /> Same-Week Appointments</div>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2"><Users className="size-4 text-accent" /> 50,000+ Helped</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#FDF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Why OpenUp Health</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Care that actually fits your life</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine thoughtful technology with genuine human connection to make mental healthcare accessible for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-7 border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`${feature.color} rounded-xl p-3.5 w-fit mb-5`}>
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Getting started is easy</h2>
            <p className="text-xl text-muted-foreground">Four steps to the support you deserve</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative text-center">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-border z-0" />
                )}
                <div className="relative z-10 inline-flex items-center justify-center size-16 bg-secondary border-2 border-primary/20 rounded-full text-primary font-bold text-lg mb-5">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="rounded-xl px-8 py-6 text-base shadow-md shadow-primary/20" asChild>
              <Link href="/signup">Start Today — It&apos;s Free <ArrowRight className="size-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Therapists */}
      <section className="py-24 bg-[#FDF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Our Therapists</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet the people in your corner</h2>
            <p className="text-xl text-muted-foreground">Every therapist is licensed, verified, and ready to meet you where you are</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {therapists.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-200 group">
                <div className="h-40 bg-gradient-to-br from-secondary to-[#FEF0E2] flex items-center justify-center">
                  <div className={`${t.color} rounded-full h-20 w-20 flex items-center justify-center shadow-md text-2xl font-bold`}>
                    {t.initials}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{t.name}</h3>
                  <p className="text-sm text-primary mb-3 font-medium">{t.title}</p>
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="size-4 text-amber-400" fill="currentColor" />
                    <span className="text-sm font-semibold text-foreground">{t.rating}</span>
                    <span className="text-xs text-muted-foreground">({t.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {t.specialties.map((s) => (
                      <span key={s} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-xl px-8 py-6 text-base border-border bg-white hover:bg-secondary" asChild>
              <Link href="/app/providers">Browse All Therapists →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Stories</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Real people, real change</h2>
            <p className="text-xl text-muted-foreground">Hear from those who took the first step</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#FDF6EE] border border-border rounded-2xl p-7 flex flex-col">
                <Quote className="size-8 text-primary/25 mb-4" />
                <p className="text-foreground leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`${t.avatarColor} size-10 rounded-full flex items-center justify-center font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-[#FDF6EE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Starter */}
            <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-1">Starter</h3>
              <p className="text-sm text-muted-foreground mb-5">Pay as you go</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$65</span>
                <span className="text-muted-foreground text-sm">/session</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["50-min video sessions", "Secure messaging", "Progress tracking"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="size-4 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-xl border-border hover:bg-secondary" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Premium — featured */}
            <div className="relative bg-primary text-primary-foreground rounded-2xl p-8 shadow-2xl shadow-primary/20 scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold mb-1">Premium</h3>
              <p className="text-sm text-primary-foreground/70 mb-5">Best value</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$199</span>
                <span className="text-primary-foreground/70 text-sm">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["4 sessions per month", "Unlimited messaging", "Priority scheduling", "Wellness workshops"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-primary-foreground/90">
                    <CheckCircle className="size-4 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary-foreground/90 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-foreground mb-1">Enterprise</h3>
              <p className="text-sm text-muted-foreground mb-5">For organisations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Premium", "Dedicated account manager", "Team analytics", "Custom integrations"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle className="size-4 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-xl border-border hover:bg-secondary" asChild>
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary to-[#A8522A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            Your first step starts here.
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Join thousands of people who found the support they needed.
            It only takes a few minutes to get matched.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors text-lg shadow-xl"
            >
              Get Matched Today <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-lg"
            >
              Learn More
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/60">No credit card required · Cancel anytime</p>
        </div>
      </section>
    </>
  );
}
