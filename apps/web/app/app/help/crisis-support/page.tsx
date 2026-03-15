import Link from "next/link";
import { Phone, MessageSquare, Globe, Heart, AlertTriangle, ArrowRight } from "lucide-react";

export default function CrisisSupportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Banner */}
      <div className="bg-destructive text-destructive-foreground py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <AlertTriangle className="size-6 flex-shrink-0" />
          <div>
            <p className="font-bold text-lg">Immediate danger? Call 911 now.</p>
            <p className="text-destructive-foreground/90 text-sm">If you or someone else is in immediate physical danger, please call emergency services.</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Heart className="size-8 text-primary" fill="currentColor" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">You&apos;re Not Alone</h1>
          <p className="text-muted-foreground mt-2 text-lg">Help is available right now, 24 hours a day, 7 days a week.</p>
        </div>

        {/* 988 */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary p-3 rounded-xl flex-shrink-0">
              <Phone className="size-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-1">988 Suicide &amp; Crisis Lifeline</h2>
              <p className="text-muted-foreground mb-4">Free, confidential support 24/7 from trained crisis counselors. Available in English and Spanish.</p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:988" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors">
                  <Phone className="size-5" /> Call 988
                </a>
                <a href="sms:988" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl font-bold text-lg hover:bg-primary/5 transition-colors">
                  <MessageSquare className="size-5" /> Text 988
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Crisis Text Line */}
        <div className="bg-accent/30 border border-accent rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-green-600 p-3 rounded-xl flex-shrink-0">
              <MessageSquare className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Crisis Text Line</h2>
              <p className="text-muted-foreground mb-3">Prefer texting? Connect with a trained crisis counselor via text message.</p>
              <div className="bg-white border border-border rounded-lg px-4 py-3 inline-block">
                <p className="font-mono text-lg font-bold text-foreground">Text <span className="text-primary">HOME</span> to <span className="text-primary">741741</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* International Resources */}
        <div className="border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">International Resources</h2>
          </div>
          <div className="space-y-3">
            {[
              { country: "Canada", resource: "Crisis Services Canada", contact: "1-833-456-4566" },
              { country: "UK", resource: "Samaritans", contact: "116 123" },
              { country: "Australia", resource: "Lifeline Australia", contact: "13 11 14" },
              { country: "India", resource: "Vandrevala Foundation", contact: "1860-2662-345" },
              { country: "Global", resource: "Find A Helpline", contact: "findahelpline.com" },
            ].map((r) => (
              <div key={r.country} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <span className="font-medium text-foreground text-sm">{r.country}</span>
                  <span className="text-muted-foreground text-sm mx-2">·</span>
                  <span className="text-muted-foreground text-sm">{r.resource}</span>
                </div>
                <span className="font-mono text-sm font-medium text-primary">{r.contact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Talking to Someone */}
        <div className="border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">How to Talk to Someone You Trust</h2>
          <div className="space-y-3">
            {[
              { step: "1", text: "Choose someone you feel safe with — a friend, family member, or mentor." },
              { step: "2", text: 'Start with "I\'ve been struggling and I need to talk to someone. Do you have time?"' },
              { step: "3", text: "Be honest about how you're feeling, even if it's hard. You don't have to explain everything at once." },
              { step: "4", text: "Ask them to just listen — you don't always need advice, just presence." },
              { step: "5", text: "If they react badly, it says more about them than you. Try someone else." },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <span className="bg-primary/10 text-primary text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">{item.step}</span>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Now */}
        <div className="border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Self-Care for Right Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Take 5 slow, deep breaths — in through your nose, out through your mouth",
              "Place both feet flat on the floor and feel the ground beneath you",
              "Name 5 things you can see around you right now",
              "Hold something cold, like ice or a cool glass of water",
              "Text a friend or family member \"Hey, I'm having a hard time\"",
              "Step outside or open a window for fresh air",
            ].map((tip, i) => (
              <div key={i} className="flex gap-2 p-3 bg-muted/40 rounded-lg">
                <Heart className="size-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message Therapist */}
        <div className="bg-secondary/50 rounded-2xl p-6 text-center">
          <h2 className="font-bold text-foreground mb-2">Connect with your therapist</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Your therapist is here to support you. Send them a message — even between sessions.
          </p>
          <Link
            href="/app/messages"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Message My Therapist <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
