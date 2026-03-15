import Link from "next/link";
import { CheckCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pricing" };

const plans = [
  {
    name: "Self-Pay",
    price: "$65",
    period: "/session",
    description: "Pay as you go with no commitment",
    features: ["50-minute video or phone sessions", "Secure messaging between sessions", "Progress tracking tools", "Mood check-ins & journaling", "Self-guided wellness library"],
    cta: "Get Started",
    ctaHref: "/signup",
  },
  {
    name: "Premium",
    price: "$199",
    period: "/month",
    description: "Best value for regular therapy",
    popular: true,
    features: ["4 sessions per month (save 23%)", "Unlimited secure messaging", "Priority scheduling", "Access to group workshops", "Advanced progress analytics", "Crisis support access"],
    cta: "Get Started",
    ctaHref: "/signup",
  },
  {
    name: "Insurance",
    price: "Co-pay",
    period: "varies",
    description: "Use your health insurance",
    features: ["In-network with 40+ plans", "We handle claims & billing", "Typical co-pay: $20-$50", "All Premium features included", "Pre-authorization support", "Out-of-network options available"],
    cta: "Check Coverage",
    ctaHref: "/insurance",
  },
];

const faqs = [
  { q: "Can I cancel anytime?", a: "Yes. There are no long-term contracts. You can cancel your subscription at any time." },
  { q: "What insurance do you accept?", a: "We accept most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, United Healthcare, and more. Check our insurance page for the full list." },
  { q: "What if I am not satisfied with my therapist?", a: "We offer free therapist switching at any time. If your first match is not the right fit, we will help you find someone better suited to your needs." },
  { q: "Are sessions really confidential?", a: "Absolutely. All sessions are encrypted end-to-end and we follow HIPAA-conscious practices. Your therapist is bound by professional confidentiality." },
  { q: "Do you offer sliding scale pricing?", a: "Yes. We offer reduced rates for those with financial need. Contact us to discuss options." },
];

export default function PricingPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Quality mental healthcare should be accessible to everyone. Choose the plan that works for you.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-primary text-primary-foreground shadow-2xl transform scale-105 relative"
                    : "bg-card border border-border hover:shadow-xl transition-shadow"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={plan.popular ? "text-primary-foreground/80" : "text-muted-foreground"}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle className={`size-5 flex-shrink-0 mt-0.5 ${plan.popular ? "" : "text-primary"}`} />
                      <span className={plan.popular ? "" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.popular ? (
                  <Link
                    href={plan.ctaHref}
                    className="block w-full bg-primary-foreground text-primary px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors text-center font-medium"
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={plan.ctaHref}>{plan.cta}</Link>
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Looking for employer plans?{" "}
              <Link href="/for-employers" className="text-primary hover:underline">
                View employer pricing
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="size-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
