"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Organization {
  id: string;
  name: string;
  plan: "Starter" | "Professional" | "Enterprise";
  memberCount: number;
  adminEmail: string;
  created: string;
  status: "active" | "inactive";
}

const mockOrgs: Organization[] = [
  { id: "1", name: "Acme Corp", plan: "Professional", memberCount: 47, adminEmail: "hr@acme.com", created: "2025-12-01", status: "active" },
  { id: "2", name: "TechStart Inc", plan: "Starter", memberCount: 12, adminEmail: "ops@techstart.io", created: "2026-01-15", status: "active" },
  { id: "3", name: "Global Health Co", plan: "Enterprise", memberCount: 150, adminEmail: "benefits@globalhealth.com", created: "2025-10-01", status: "active" },
  { id: "4", name: "Small Biz LLC", plan: "Starter", memberCount: 5, adminEmail: "owner@smallbiz.com", created: "2026-02-20", status: "inactive" },
];

const PLAN_CLASSES: Record<string, string> = {
  Starter: "bg-muted text-muted-foreground",
  Professional: "bg-primary text-primary-foreground",
  Enterprise: "bg-purple-100 text-purple-800",
};

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/organizations");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setOrgs(data); return; }
        }
      } catch { /* fallback */ }
      finally { setOrgs(mockOrgs); setLoading(false); }
    };
    load();
  }, []);

  const deactivate = (id: string) => setOrgs((prev) => prev.map((o) => o.id === id ? { ...o, status: "inactive" as const } : o));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organizations</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{orgs.length} registered organizations</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Organization", "Plan", "Members", "Admin", "Created", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orgs.map((org) => (
                    <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{org.name}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${PLAN_CLASSES[org.plan]}`}>{org.plan}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{org.memberCount}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{org.adminEmail}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(org.created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={org.status === "active" ? "bg-green-100 text-green-800 text-xs" : "bg-muted text-muted-foreground text-xs"}>
                          {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="text-xs">View</Button>
                          <Button size="sm" variant="ghost" className="text-xs">Edit Plan</Button>
                          {org.status === "active" && (
                            <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive" onClick={() => deactivate(org.id)}>Deactivate</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
