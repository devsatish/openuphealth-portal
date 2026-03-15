"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Users, AlertTriangle, Shield } from "lucide-react";

const mockStats = { newIntakes: 12, pendingMatches: 8, flaggedCases: 3, insuranceQueue: 15 };

const mockIntakes = [
  { id: "1", name: "Jordan Rivera", submitted: "2026-03-08", goals: "Anxiety management, work stress", paymentType: "Insurance" },
  { id: "2", name: "Casey Thomas", submitted: "2026-03-08", goals: "Depression, relationship issues", paymentType: "Self-Pay" },
  { id: "3", name: "Morgan Lee", submitted: "2026-03-07", goals: "Grief and loss", paymentType: "EAP" },
  { id: "4", name: "Riley Chen", submitted: "2026-03-07", goals: "PTSD, sleep issues", paymentType: "Insurance" },
];

const mockEscalations = [
  { id: "1", patient: "Sam Wilson", issue: "Crisis response needed", priority: "high" },
  { id: "2", patient: "Dana Park", issue: "Insurance denied — needs review", priority: "medium" },
  { id: "3", patient: "Avery Brooks", issue: "No match found in 2 weeks", priority: "medium" },
];

export default function CareDashboard() {
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
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { label: "New Intakes Today", value: stats.newIntakes, icon: ClipboardList, color: "bg-primary/10 text-primary" },
    { label: "Pending Matches", value: stats.pendingMatches, icon: Users, color: "bg-accent text-green-700" },
    { label: "Flagged Cases", value: stats.flaggedCases, icon: AlertTriangle, color: "bg-red-100 text-red-700" },
    { label: "Insurance Queue", value: stats.insuranceQueue, icon: Shield, color: "bg-secondary text-primary" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Care Coordinator Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage intakes, matches, and patient support</p>
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
                    <p className="font-bold text-2xl text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Intakes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">New Intakes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockIntakes.map((intake) => (
                  <div key={intake.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{intake.name}</p>
                        <Badge variant="outline" className={`text-xs ${intake.paymentType === "Insurance" ? "text-blue-700 border-blue-200" : intake.paymentType === "EAP" ? "text-purple-700 border-purple-200" : ""}`}>
                          {intake.paymentType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{intake.goals}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs ml-3 flex-shrink-0">Assign</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Escalations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Escalations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockEscalations.map((esc) => (
              <div key={esc.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{esc.patient}</p>
                  <Badge className={esc.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}>
                    {esc.priority.charAt(0).toUpperCase() + esc.priority.slice(1)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{esc.issue}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
