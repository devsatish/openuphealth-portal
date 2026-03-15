"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Calendar, TrendingUp, CheckCircle } from "lucide-react";

const mockStats = { totalUsers: 248, activeTherapists: 34, sessionsThisMonth: 892, mrr: 24500 };

const mockSignups = [
  { name: "Jordan Rivera", email: "jordan@example.com", role: "PATIENT", date: "2026-03-08" },
  { name: "Dr. Priya Patel", email: "priya@example.com", role: "THERAPIST", date: "2026-03-07" },
  { name: "Casey Thomas", email: "casey@example.com", role: "PATIENT", date: "2026-03-07" },
  { name: "Acme Corp (Org)", email: "hr@acme.com", role: "ORG_ADMIN", date: "2026-03-06" },
  { name: "Morgan Lee", email: "morgan@example.com", role: "PATIENT", date: "2026-03-06" },
];

const featureFlags = [
  { key: "ai_matching", description: "AI-powered therapist matching", enabled: true },
  { key: "insurance_verification", description: "Automated insurance verification", enabled: false },
  { key: "group_therapy", description: "Group therapy sessions", enabled: false },
];

const ROLE_CLASSES: Record<string, string> = {
  PATIENT: "bg-blue-100 text-blue-800",
  THERAPIST: "bg-green-100 text-green-800",
  ORG_ADMIN: "bg-purple-100 text-purple-800",
  ADMIN: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          if (data) setStats(data);
        }
      } catch { /* fallback */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Active Therapists", value: stats.activeTherapists.toString(), icon: UserCheck, color: "bg-accent text-green-700" },
    { label: "Sessions This Month", value: stats.sessionsThisMonth.toLocaleString(), icon: Calendar, color: "bg-secondary text-primary" },
    { label: "MRR", value: `$${stats.mrr.toLocaleString()}`, icon: TrendingUp, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Platform overview and system health</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          statCards.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}><stat.icon className="size-4" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                    <p className="font-bold text-xl text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Signups */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Recent Signups</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Name", "Email", "Role", "Date"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockSignups.map((u, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-4 text-sm font-medium text-foreground">{u.name}</td>
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground">{u.email}</td>
                      <td className="py-2.5 pr-4">
                        <Badge className={`text-xs ${ROLE_CLASSES[u.role] ?? "bg-muted"}`}>{u.role.replace("_", " ")}</Badge>
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(u.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* System Health */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">System Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="size-4 text-green-600" />
                <span className="text-sm text-green-800 font-medium">All Systems Operational</span>
              </div>
              {["API", "Database", "Auth", "Storage"].map((sys) => (
                <div key={sys} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{sys}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-600">OK</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Feature Flags</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {featureFlags.map((flag) => (
                <div key={flag.key} className="flex items-center justify-between">
                  <p className="text-xs text-foreground truncate mr-2">{flag.description}</p>
                  <Badge className={flag.enabled ? "bg-green-100 text-green-800 text-xs flex-shrink-0" : "bg-muted text-muted-foreground text-xs flex-shrink-0"}>
                    {flag.enabled ? "ON" : "OFF"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
