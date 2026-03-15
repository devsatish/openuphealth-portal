"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, Users, TrendingDown, Download } from "lucide-react";

const mockSubscriptions = [
  { id: "1", name: "Acme Corp", plan: "Professional", status: "active", nextBilling: "2026-04-01", amount: 2450 },
  { id: "2", name: "TechStart Inc", plan: "Starter", status: "active", nextBilling: "2026-04-01", amount: 490 },
  { id: "3", name: "Global Health Co", plan: "Enterprise", status: "active", nextBilling: "2026-04-01", amount: 7350 },
  { id: "4", name: "Sarah Johnson (Patient)", plan: "Individual", status: "active", nextBilling: "N/A", amount: 150 },
  { id: "5", name: "Alex Kim (Patient)", plan: "Individual", status: "active", nextBilling: "N/A", amount: 150 },
];

const mockRecentInvoices = [
  { id: "inv1", entity: "Acme Corp", amount: 2450, date: "2026-03-01", status: "paid" },
  { id: "inv2", entity: "TechStart Inc", amount: 490, date: "2026-03-01", status: "paid" },
  { id: "inv3", entity: "Global Health Co", amount: 7350, date: "2026-03-01", status: "paid" },
  { id: "inv4", entity: "Small Biz LLC", amount: 245, date: "2026-03-01", status: "overdue" },
];

export default function AdminBillingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "MRR", value: "$24,500", icon: DollarSign, color: "bg-primary/10 text-primary", sub: "+12% this month" },
    { label: "ARR", value: "$294,000", icon: TrendingUp, color: "bg-accent text-green-700", sub: "Projected" },
    { label: "Active Subscriptions", value: "48", icon: Users, color: "bg-secondary text-primary", sub: "Orgs + individuals" },
    { label: "Churn Rate", value: "2.1%", icon: TrendingDown, color: "bg-red-100 text-red-700", sub: "Last 30 days" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing Oversight</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Platform revenue and subscription management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.color}`}><stat.icon className="size-4" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-xl text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.sub}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Active Subscriptions</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Entity", "Plan", "Status", "Next Billing", "Amount"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground pb-2 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockSubscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="py-3 pr-6 text-sm font-medium text-foreground">{sub.name}</td>
                    <td className="py-3 pr-6"><Badge variant="outline" className="text-xs">{sub.plan}</Badge></td>
                    <td className="py-3 pr-6"><Badge className="bg-green-100 text-green-800 text-xs">Active</Badge></td>
                    <td className="py-3 pr-6 text-xs text-muted-foreground">{sub.nextBilling}</td>
                    <td className="py-3 font-semibold text-foreground">${sub.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Invoices</CardTitle>
            <Button size="sm" variant="outline" className="gap-1 text-xs"><Download className="size-3" /> Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockRecentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.entity}</p>
                  <p className="text-xs text-muted-foreground">{new Date(inv.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={inv.status === "paid" ? "bg-green-100 text-green-800 text-xs" : "bg-red-100 text-red-800 text-xs"}>
                    {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </Badge>
                  <span className="font-semibold text-foreground text-sm">${inv.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
