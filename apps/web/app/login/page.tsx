"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

const demoAccounts = [
  { role: "Patient", email: "patient@demo.com", password: "demo1234", color: "bg-accent" },
  { role: "Therapist", email: "therapist@demo.com", password: "demo1234", color: "bg-secondary" },
  { role: "Care Coordinator", email: "care@demo.com", password: "demo1234", color: "bg-primary/10" },
  { role: "Org Admin", email: "org@demo.com", password: "demo1234", color: "bg-muted" },
  { role: "Admin", email: "admin@demo.com", password: "demo1234", color: "bg-destructive/10" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/app");
      router.refresh();
    }
  };

  const fillDemo = (acc: (typeof demoAccounts)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-primary rounded-2xl p-3">
            <Heart className="size-8 text-primary-foreground" fill="currentColor" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">OpenUpHealth</h1>
            <p className="text-muted-foreground text-sm">Mental health support, on your terms</p>
          </div>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                  <AlertCircle className="size-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Demo Accounts (for testing)</span>
              {showDemo ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {showDemo && (
              <div className="mt-3 space-y-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => fillDemo(acc)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${acc.color}`} />
                      <span className="text-sm font-medium text-foreground">{acc.role}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{acc.email}</span>
                  </button>
                ))}
                <p className="text-xs text-muted-foreground pt-1 text-center">
                  Click any row to autofill credentials
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
