"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, Download, Building2 } from "lucide-react";
import Link from "next/link";

const earningsSummary = [
  { label: "This Month", amount: "$3,600", icon: DollarSign, color: "bg-primary/10 text-primary" },
  { label: "Last Month", amount: "$4,050", icon: TrendingUp, color: "bg-accent text-green-700" },
  { label: "Year to Date", amount: "$9,450", icon: Calendar, color: "bg-secondary text-primary" },
];

const sessionEarnings = [
  { date: "2026-03-07", patient: "Sarah Johnson", amount: 150, type: "Individual" },
  { date: "2026-03-06", patient: "Alex Kim", amount: 150, type: "Individual" },
  { date: "2026-03-05", patient: "Maria Garcia", amount: 150, type: "Individual" },
  { date: "2026-03-04", patient: "David Lee", amount: 150, type: "Individual" },
  { date: "2026-03-01", patient: "James Brown", amount: 150, type: "Individual" },
  { date: "2026-02-28", patient: "Emma Wilson", amount: 150, type: "Individual" },
  { date: "2026-02-27", patient: "Sarah Johnson", amount: 150, type: "Individual" },
  { date: "2026-02-26", patient: "Alex Kim", amount: 150, type: "Individual" },
];

export default function ProviderBillingPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Earnings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Track your session income and payout details</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {earningsSummary.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}>
                  <stat.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-bold text-2xl text-foreground">{stat.amount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Session Earnings Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Session Earnings</CardTitle>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Download className="size-3" /> Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2">Patient</th>
                  <th className="text-left text-xs font-medium text-muted-foreground pb-2">Type</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-2">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sessionEarnings.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(row.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3 text-foreground font-medium">{row.patient}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">{row.type}</Badge>
                    </td>
                    <td className="py-3 text-right font-semibold text-foreground">${row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payout Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="size-4" /> Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Bank Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Direct deposit setup required</p>
            </div>
            <Badge variant="outline" className="text-muted-foreground">Coming Soon</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Payouts are processed bi-weekly. Full bank account management will be available in a future release.{" "}
            <Link href="/provider/billing/invoices" className="text-primary underline-offset-4 hover:underline">View invoices</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
