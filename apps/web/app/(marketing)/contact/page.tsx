"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    inquiryType: "individual",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <CheckCircle className="size-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Message Received!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for reaching out. Our team will get back to you within one business day.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization (optional)</Label>
                    <Input
                      id="company"
                      placeholder="Acme Corp"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>I am inquiring as *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { value: "individual", label: "Individual" },
                        { value: "therapist", label: "Therapist" },
                        { value: "employer", label: "Employer" },
                        { value: "other", label: "Other" },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center justify-center px-3 py-2 rounded-md border cursor-pointer text-sm font-medium transition-colors ${
                            form.inquiryType === opt.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="inquiryType"
                            value={opt.value}
                            className="sr-only"
                            checked={form.inquiryType === opt.value}
                            onChange={() => setForm({ ...form, inquiryType: opt.value })}
                          />
                          {opt.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-5">
            <Card>
              <CardContent className="pt-6 space-y-5">
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Email</p>
                    <a href="mailto:hello@openuphealth.com" className="text-sm text-muted-foreground hover:text-primary">
                      hello@openuphealth.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Phone</p>
                    <a href="tel:+18005550123" className="text-sm text-muted-foreground hover:text-primary">
                      1-800-555-0123
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Mon–Fri, 9am–6pm EST</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg flex-shrink-0">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Headquarters</p>
                    <p className="text-sm text-muted-foreground">San Francisco, CA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-destructive/5 border-destructive/20">
              <CardContent className="pt-6">
                <p className="text-sm font-semibold text-destructive mb-1">Mental Health Crisis?</p>
                <p className="text-sm text-muted-foreground mb-3">
                  If you or someone you know is in immediate danger, please reach out to emergency services.
                </p>
                <p className="text-sm font-medium text-foreground">
                  Call or text <span className="text-destructive font-bold">988</span> (Crisis Lifeline)
                </p>
                <p className="text-sm text-muted-foreground">Available 24/7, free and confidential</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
