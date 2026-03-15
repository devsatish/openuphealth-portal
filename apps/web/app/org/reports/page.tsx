"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

type DateRange = "month" | "quarter" | "ytd";

const kpis = { utilization: 68, avgSessions: 2.6, topConcern: "Anxiety", activeMembersUsing: 32 };

const categoryData = [
  { label: "Anxiety", count: 18, pct: 56 },
  { label: "Depression", count: 12, pct: 38 },
  { label: "Stress/Burnout", count: 10, pct: 31 },
  { label: "Relationships", count: 7, pct: 22 },
  { label: "Grief", count: 4, pct: 13 },
  { label: "Other", count: 6, pct: 19 },
];

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>("month");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Utilization Reports</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Anonymized usage analytics for your organization</p>
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(["month", "quarter", "ytd"] as const).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {r === "month" ? "This Month" : r === "quarter" ? "Last 3 Months" : "YTD"}
            </button>
          ))}
        </div>
      </div>

      {/* Anonymized Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-accent border border-green-200 rounded-lg">
        <ShieldCheck className="size-4 text-green-700 flex-shrink-0" />
        <p className="text-sm text-green-800">All reports are anonymized — no individual patient data is included.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Utilization Rate", value: `${kpis.utilization}%`, sub: "of enrolled members" },
          { label: "Avg Sessions/Member", value: kpis.avgSessions.toString(), sub: "this period" },
          { label: "Top Concern", value: kpis.topConcern, sub: "most common" },
          { label: "Members Using", value: kpis.activeMembersUsing.toString(), sub: "out of 47 enrolled" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Breakdown with CSS Bar Chart */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Category Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Category", "Members", "Utilization", ""].map((h) => (
                    <th key={h} className={`text-xs font-medium text-muted-foreground pb-2 ${h === "" ? "w-48" : "text-left pr-6"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categoryData.map((cat) => (
                  <tr key={cat.label}>
                    <td className="py-3 pr-6 text-sm font-medium text-foreground">{cat.label}</td>
                    <td className="py-3 pr-6 text-sm text-muted-foreground">{cat.count}</td>
                    <td className="py-3 pr-6 text-sm text-foreground">{cat.pct}%</td>
                    <td className="py-3 w-48">
                      <div className="bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${cat.pct}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Trend - CSS bar chart */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Sessions Per Week</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32 pt-4">
            {[12, 18, 15, 22, 19, 24, 21, 16].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary/80 rounded-t-sm transition-all" style={{ height: `${(val / 24) * 100}%` }} />
                <p className="text-xs text-muted-foreground">W{i + 1}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Last 8 weeks — anonymized session counts</p>
        </CardContent>
      </Card>
    </div>
  );
}
