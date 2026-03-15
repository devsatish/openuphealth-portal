"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does OpenUpHealth work?",
    answer:
      "OpenUpHealth connects you with licensed therapists through a personalized matching process. After completing a brief intake questionnaire about your therapy goals and preferences, our system suggests therapists who align with your needs. You can then browse profiles, book a session, and meet virtually or in person — all through one secure platform.",
  },
  {
    question: "Is my information kept private?",
    answer:
      "Absolutely. We take privacy seriously and are fully HIPAA-compliant. Your health information is encrypted at rest and in transit, and is never shared with employers, insurers, or third parties without your explicit consent. Our platform undergoes regular security audits to ensure your data stays protected.",
  },
  {
    question: "Does OpenUpHealth accept insurance?",
    answer:
      "Yes. We work with many major insurance carriers including Aetna, Cigna, Blue Cross Blue Shield, UnitedHealthcare, and others. During onboarding, you can add your insurance details and we'll verify your coverage. Copays and out-of-pocket costs depend on your specific plan.",
  },
  {
    question: "What if I don't have insurance?",
    answer:
      "No insurance? No problem. We offer competitive self-pay rates starting at $80 per session. We also offer sliding scale options for those who qualify based on financial need. Contact our care team to learn more about financial assistance options.",
  },
  {
    question: "How are therapists vetted?",
    answer:
      "Every therapist on OpenUpHealth is a licensed mental health professional — including LCSWs, LPCs, psychologists, and MFTs. We verify licenses, credentials, and malpractice insurance before any therapist can see patients. We also conduct background checks and ongoing compliance reviews.",
  },
  {
    question: "Can I switch therapists?",
    answer:
      "Yes, you can switch therapists at any time, no questions asked. We understand that the therapeutic relationship is personal, and finding the right fit is essential. Simply contact our care team or use the app to request a new match.",
  },
  {
    question: "How do I cancel or reschedule an appointment?",
    answer:
      "You can cancel or reschedule appointments directly in the app up to 24 hours before your session without any charge. Cancellations within 24 hours may incur a late cancellation fee per your therapist's policy. We always recommend communicating with your therapist if plans change.",
  },
  {
    question: "What types of therapy are available?",
    answer:
      "Our network includes therapists specializing in CBT, DBT, EMDR, psychodynamic therapy, mindfulness-based therapy, family therapy, couples counseling, and more. You can filter by specialty during the matching process to find someone who fits your specific needs.",
  },
  {
    question: "Is OpenUpHealth appropriate for crisis situations?",
    answer:
      "OpenUpHealth is designed for ongoing mental health support, not emergency crisis intervention. If you are in immediate danger, please call 911. For mental health crises, call or text 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line). These services are available 24/7.",
  },
  {
    question: "Can my employer see my therapy sessions?",
    answer:
      "No. If your employer sponsors your access to OpenUpHealth, they only receive aggregate, anonymized utilization data (e.g., how many employees used the benefit) — never individual names, diagnoses, session content, or any identifying information. Your privacy is fully protected.",
  },
  {
    question: "Do you offer couples or family therapy?",
    answer:
      "Yes. Several therapists in our network specialize in couples counseling and family therapy. When completing your intake, you can indicate if you're seeking therapy for a couple or family, and we'll match you with providers who have relevant experience.",
  },
  {
    question: "What technology do I need for virtual sessions?",
    answer:
      "All you need is a device with a camera and microphone (smartphone, tablet, or computer) and a stable internet connection. Our video sessions run in the browser — no special app download required. We recommend a private, quiet space for your sessions.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about OpenUpHealth. Can&apos;t find what you&apos;re looking for?{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact us
            </a>
            .
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-border rounded-lg bg-card overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="size-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="size-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/20 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Still have questions?</h2>
          <p className="text-muted-foreground mb-4">
            Our care team is here to help. Reach out and we&apos;ll get back to you within one business day.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
