import Link from "next/link";
import { Shield, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Insurance" };

const carriers = [
  "Aetna", "Blue Cross Blue Shield", "Cigna", "United Healthcare", "Humana",
  "Kaiser Permanente", "Anthem", "Molina Healthcare", "Centene", "Magellan Health",
  "Optum", "Tricare",
];

const steps = [
  { title: "Check Your Coverage", description: "Enter your insurance details on our verification page or call the number on your card." },
  { title: "Get Verified", description: "We verify your benefits within 24 hours, including co-pay, deductible, and session limits." },
  { title: "Start Therapy", description: "Once verified, you pay only your co-pay. We handle all claims and billing." },
];

export default function InsurancePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-secondary/30 to-background py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary/10 rounded-full p-4 w-fit mx-auto mb-6">
            <Shield className="size-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">Insurance & Coverage</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We accept most major insurance plans. Check your coverage in minutes and start therapy with minimal out-of-pocket costs.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/signup">
                Verify Your Coverage
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Accepted Insurance Carriers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {carriers.map((carrier) => (
              <div key={carrier} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                <CheckCircle className="size-5 text-primary flex-shrink-0" />
                <span className="font-medium text-foreground text-sm">{carrier}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6 text-sm">
            Do not see your plan? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> -- we may still be able to help with out-of-network benefits.
          </p>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How Insurance Works with OpenUp Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What is my typical co-pay?", a: "Most in-network co-pays range from $20-$50 per session, depending on your plan. We will verify your exact co-pay before your first session." },
              { q: "What if I have a deductible?", a: "If you have not met your deductible, you may pay the full session rate until it is met. We will inform you of your deductible status during verification." },
              { q: "Can I use out-of-network benefits?", a: "Yes. If we are not in-network with your plan, we can provide superbills for you to submit for out-of-network reimbursement." },
              { q: "How long does verification take?", a: "Most verifications are completed within 24 hours. In some cases, it may take up to 48 hours." },
            ].map((faq) => (
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
