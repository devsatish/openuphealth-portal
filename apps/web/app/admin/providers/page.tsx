"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type VerificationStatus = "verified" | "pending" | "rejected";

interface Provider {
  id: string;
  name: string;
  email: string;
  licenseState: string;
  specialties: string[];
  verificationStatus: VerificationStatus;
}

const mockProviders: Provider[] = [
  { id: "1", name: "Dr. Emily Chen", email: "emily@example.com", licenseState: "CA", specialties: ["Anxiety", "CBT", "Trauma"], verificationStatus: "verified" },
  { id: "2", name: "Dr. Marcus Johnson", email: "marcus@example.com", licenseState: "NY", specialties: ["Depression", "DBT", "Grief"], verificationStatus: "verified" },
  { id: "3", name: "Dr. Priya Patel", email: "priya@example.com", licenseState: "TX", specialties: ["PTSD", "EMDR", "Anxiety"], verificationStatus: "pending" },
  { id: "4", name: "Dr. Laura Kim", email: "laura@example.com", licenseState: "CA", specialties: ["Relationships", "Grief", "CBT"], verificationStatus: "pending" },
  { id: "5", name: "Dr. James Torres", email: "james@example.com", licenseState: "FL", specialties: ["Addiction", "Trauma"], verificationStatus: "rejected" },
];

const STATUS_CONFIG: Record<VerificationStatus, { label: string; className: string }> = {
  verified: { label: "Verified", className: "bg-green-100 text-green-800" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
};

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VerificationStatus | "all">("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/therapists");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setProviders(data); return; }
        }
      } catch { /* fallback */ }
      finally { setProviders(mockProviders); setLoading(false); }
    };
    load();
  }, []);

  const updateStatus = (id: string, status: VerificationStatus) =>
    setProviders((prev) => prev.map((p) => p.id === id ? { ...p, verificationStatus: status } : p));

  const filtered = filter === "all" ? providers : providers.filter((p) => p.verificationStatus === filter);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Provider Management</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{providers.length} registered providers</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {(["all", "verified", "pending", "rejected"] as const).map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${filter === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab}
          </button>
        ))}
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
                    {["Provider", "License State", "Specialties", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((provider) => (
                    <tr key={provider.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-secondary text-primary text-xs font-semibold">
                              {provider.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{provider.name}</p>
                            <p className="text-xs text-muted-foreground">{provider.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">{provider.licenseState}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">{provider.specialties.join(", ")}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${STATUS_CONFIG[provider.verificationStatus].className}`}>
                          {STATUS_CONFIG[provider.verificationStatus].label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {provider.verificationStatus === "pending" && (
                            <>
                              <Button size="sm" variant="outline" className="text-xs" onClick={() => updateStatus(provider.id, "verified")}>Approve</Button>
                              <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive" onClick={() => updateStatus(provider.id, "rejected")}>Reject</Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost" className="text-xs">View Profile</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No providers in this category</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
