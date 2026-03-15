import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, Shield, Video, Calendar, CheckCircle, Star, Award, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Heart,
    title: "Matched Care",
    description: "Our intelligent matching system pairs you with therapists who specialize in your specific needs and preferences.",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions at times that work for you. Evening and weekend appointments available.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "End-to-end encryption and HIPAA-conscious practices keep your information safe and confidential.",
  },
  {
    icon: Video,
    title: "Evidence-Based",
    description: "All therapists use proven, research-backed approaches to help you achieve lasting results.",
  },
];

const steps = [
  { number: "1", title: "Complete Assessment", description: "Tell us about yourself and your needs through a confidential questionnaire." },
  { number: "2", title: "Get Matched", description: "We'll match you with therapists who specialize in your specific needs." },
  { number: "3", title: "Schedule Session", description: "Book sessions at times that work for you, with flexible scheduling options." },
  { number: "4", title: "Start Healing", description: "Connect via secure video, phone, or messaging from anywhere you feel comfortable." },
];

const testimonials = [
  {
    quote: "OpenUp Health changed my life. My therapist understood me from the very first session, and I finally feel like I have the tools to manage my anxiety.",
    name: "Amanda R.",
    role: "Patient for 8 months",
    rating: 5,
  },
  {
    quote: "The convenience of online therapy made it possible for me to get help while managing a busy work schedule. I cannot recommend it enough.",
    name: "David M.",
    role: "Patient for 1 year",
    rating: 5,
  },
  {
    quote: "As a therapist, this platform gives me the tools to provide the best care possible. The matching system connects me with clients I can truly help.",
    name: "Dr. Sarah L.",
    role: "Licensed Therapist",
    rating: 5,
  },
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
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-foreground leading-tight">
                Your Journey to Better Mental Health Starts Here
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with licensed therapists from the comfort of your home. Get personalized support when you need it most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get Started Today
                    <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Licensed Therapists</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50k+</div>
                  <div className="text-sm text-muted-foreground">People Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">4.9</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/30 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="bg-card rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Video className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Next Session</p>
                        <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-accent rounded-full p-2">
                        <Heart className="size-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Wellness Score</p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: "78%" }}></div>
                          </div>
                          <span className="text-xs font-semibold text-primary">78%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary rounded-full p-2">
                        <Star className="size-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Mood Trend</p>
                        <p className="text-xs text-accent-foreground font-medium">Improving steadily</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose OpenUp Health</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine technology with human connection to deliver personalized mental healthcare
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="bg-primary/10 rounded-full p-4 w-fit mb-4">
                  <feature.icon className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to start your mental health journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Therapists Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Therapists</h2>
            <p className="text-xl text-muted-foreground">All therapists are licensed, experienced, and ready to help</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Emily Chen", title: "Licensed Clinical Psychologist", specialties: ["Anxiety", "Depression", "Trauma"], rating: 4.9, reviews: 156, initials: "EC" },
              { name: "Dr. Marcus Johnson", title: "Licensed Marriage & Family Therapist", specialties: ["Couples", "Family", "Relationships"], rating: 5.0, reviews: 203, initials: "MJ" },
              { name: "Dr. Sarah Williams", title: "Licensed Clinical Social Worker", specialties: ["Stress", "Mindfulness", "Burnout"], rating: 4.8, reviews: 134, initials: "SW" },
            ].map((therapist) => (
              <div key={therapist.name} className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-border">
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 h-48 flex items-center justify-center">
                  <div className="bg-card rounded-full h-24 w-24 flex items-center justify-center shadow-md">
                    <span className="text-2xl font-bold text-primary">{therapist.initials}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{therapist.name}</h3>
                    <Award className="size-5 text-primary" />
                  </div>
                  <p className="text-sm text-primary mb-3">{therapist.title}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="size-4 text-yellow-500" fill="currentColor" />
                    <span className="text-sm font-semibold">{therapist.rating}</span>
                    <span className="text-sm text-muted-foreground">({therapist.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map((s) => (
                      <span key={s} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/app/providers">Browse All Therapists</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What People Are Saying</h2>
            <p className="text-xl text-muted-foreground">Real stories from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6">
                <Quote className="size-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground mb-6 leading-relaxed">{t.quote}</p>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 text-yellow-500" fill="currentColor" />
                  ))}
                </div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Affordable mental healthcare for everyone</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Starter</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">$65</span>
                <span className="text-muted-foreground">/session</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["50-minute video sessions", "Messaging between sessions", "Progress tracking"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-2xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-semibold mb-2">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$199</span>
                <span className="text-primary-foreground/80">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["4 sessions per month", "Unlimited messaging", "Priority scheduling", "Access to workshops"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="size-5 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-primary-foreground text-primary px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors font-medium">
                <Link href="/signup">Get Started</Link>
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold text-foreground mb-2">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Premium", "Dedicated account manager", "Custom integrations"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands who have found support and healing with OpenUp Health.
          </p>
          <Link
            href="/signup"
            className="bg-primary-foreground text-primary px-8 py-4 rounded-lg hover:bg-primary-foreground/90 transition-colors inline-block font-medium"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}
