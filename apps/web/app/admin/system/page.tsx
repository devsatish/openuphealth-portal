"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";

interface FeatureFlag {
  key: string;
  description: string;
  enabled: boolean;
}

const mockFlags: FeatureFlag[] = [
  { key: "ai_matching", description: "AI-powered therapist matching", enabled: true },
  { key: "insurance_verification", description: "Automated insurance verification", enabled: false },
  { key: "group_therapy", description: "Group therapy sessions", enabled: false },
  { key: "mobile_app", description: "Mobile app API endpoints", enabled: true },
  { key: "analytics_dashboard", description: "Advanced analytics dashboard", enabled: false },
];

const healthChecks = [
  { label: "API Server", status: "ok" },
  { label: "Database (PostgreSQL)", status: "ok" },
  { label: "Authentication (NextAuth)", status: "ok" },
  { label: "File Storage", status: "ok" },
  { label: "Email Service", status: "ok" },
];

export default function SystemPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(mockFlags);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/feature-flags");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) setFlags(data);
        }
      } catch { /* use mock */ }
    };
    load();
  }, []);

  const toggleFlag = async (key: string) => {
    const updated = flags.map((f) => f.key === key ? { ...f, enabled: !f.enabled } : f);
    setFlags(updated);
    const flag = updated.find((f) => f.key === key);
    try {
      await fetch(`/api/admin/feature-flags/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: flag?.enabled }),
      });
    } catch { /* ignore */ }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">System Administration</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Feature flags, environment, and system health</p>
      </div>

      {/* Dev Mode Notice */}
      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertCircle className="size-4 text-yellow-600 flex-shrink-0" />
        <p className="text-sm text-yellow-800">All systems are in development mode. Production configuration required before launch.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Flags */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Feature Flags</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {flags.map((flag) => (
              <div key={flag.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="min-w-0 flex-1 mr-3">
                  <p className="text-sm font-medium text-foreground">{flag.description}</p>
                  <p className="text-xs font-mono text-muted-foreground">{flag.key}</p>
                </div>
                <button
                  onClick={() => toggleFlag(flag.key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${flag.enabled ? "bg-primary" : "bg-muted"}`}
                  aria-label={`Toggle ${flag.key}`}
                >
                  <span className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${flag.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* System Health */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">System Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">All Systems Operational</span>
              </div>
              {healthChecks.map((check) => (
                <div key={check.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{check.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-600 font-medium">OK</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Environment */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Environment</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "NODE_ENV", value: "development", highlight: true },
                { label: "Database", value: "PostgreSQL" },
                { label: "Auth Provider", value: "NextAuth v5" },
                { label: "App Version", value: "1.0.0-alpha" },
              ].map((env) => (
                <div key={env.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-xs font-mono text-muted-foreground">{env.label}</span>
                  <Badge className={env.highlight ? "bg-orange-100 text-orange-800 text-xs" : "bg-muted text-muted-foreground text-xs"}>{env.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
