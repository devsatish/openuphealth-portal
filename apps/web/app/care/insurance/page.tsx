"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type InsuranceStatus = "pending" | "verified" | "rejected" | "needs_info";

interface InsuranceClaim {
  id: string;
  patient: string;
  carrier: string;
  memberId: string;
  submitted: string;
  status: InsuranceStatus;
}

const mockClaims: InsuranceClaim[] = [
  { id: "1", patient: "Jordan Rivera", carrier: "Blue Cross", memberId: "BCB123456", submitted: "2026-03-07", status: "pending" },
  { id: "2", patient: "Casey Thomas", carrier: "Aetna", memberId: "AET789012", submitted: "2026-03-07", status: "needs_info" },
  { id: "3", patient: "Morgan Lee", carrier: "United Health", memberId: "UHC345678", submitted: "2026-03-06", status: "verified" },
  { id: "4", patient: "Riley Chen", carrier: "Cigna", memberId: "CGN901234", submitted: "2026-03-06", status: "pending" },
  { id: "5", patient: "Avery Brooks", carrier: "Blue Shield", memberId: "BSC567890", submitted: "2026-03-05", status: "rejected" },
  { id: "6", patient: "Sam Wilson", carrier: "Humana", memberId: "HUM123789", submitted: "2026-03-04", status: "verified" },
  { id: "7", patient: "Dana Park", carrier: "Kaiser", memberId: "KAI456012", submitted: "2026-03-03", status: "pending" },
];

const STATUS_CONFIG: Record<InsuranceStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  verified: { label: "Verified", className: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800" },
  needs_info: { label: "Needs Info", className: "bg-orange-100 text-orange-800" },
};

export default function InsurancePage() {
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InsuranceStatus | "all">("all");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/insurance");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setClaims(data); return; }
        }
      } catch { /* fallback */ }
      finally { setClaims(mockClaims); setLoading(false); }
    };
    load();
  }, []);

  const filtered = filter === "all" ? claims : claims.filter((c) => c.status === filter);

  const updateStatus = (id: string, status: InsuranceStatus) => {
    setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insurance Verification</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Review and verify patient insurance coverage</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit flex-wrap">
        {(["all", "pending", "verified", "rejected", "needs_info"] as const).map((tab) => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab === "all" ? "All" : tab === "needs_info" ? "Needs Info" : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
                    {["Patient", "Carrier", "Member ID", "Submitted", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((claim) => (
                    <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{claim.patient}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{claim.carrier}</td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{claim.memberId}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(claim.submitted).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${STATUS_CONFIG[claim.status].className}`}>{STATUS_CONFIG[claim.status].label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {claim.status !== "verified" && (
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => updateStatus(claim.id, "verified")}>Verify</Button>
                          )}
                          {claim.status === "pending" && (
                            <Button size="sm" variant="ghost" className="text-xs" onClick={() => updateStatus(claim.id, "needs_info")}>Req. Info</Button>
                          )}
                          {claim.status !== "rejected" && claim.status !== "verified" && (
                            <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive" onClick={() => updateStatus(claim.id, "rejected")}>Reject</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No claims in this category</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
