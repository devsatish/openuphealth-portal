"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

type DateRange = "month" | "quarter" | "ytd";

const overviewKpis = [
  { label: "Total Users", value: "248", change: "+18", positive: true },
  { label: "Active Therapists", value: "34", change: "+3", positive: true },
  { label: "Sessions This Month", value: "892", change: "+12%", positive: true },
  { label: "MRR", value: "$24,500", change: "+8%", positive: true },
];

const userGrowthData = [42, 65, 88, 112, 145, 178, 210, 248];
const sessionData = [320, 415, 502, 618, 721, 810, 875, 892];
const revenueData = [12000, 14500, 16200, 18000, 20100, 22000, 23400, 24500];

function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className={`w-full ${color} rounded-t-sm transition-all`} style={{ height: `${(val / max) * 100}%` }} />
          <p className="text-xs text-muted-foreground">M{i + 1}</p>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>("month");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Comprehensive platform performance metrics</p>
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

      {/* Analytics Note */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 border border-border rounded-lg">
        <Info className="size-4 text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">Full analytics integration requires production observability setup (e.g., Mixpanel, Segment, or custom dashboards).</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewKpis.map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                  <Badge className={`mt-1 text-xs ${kpi.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{kpi.change}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">User Growth (8 months)</CardTitle></CardHeader>
              <CardContent><BarChart data={userGrowthData} color="bg-primary/70" /></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Revenue ($K)</CardTitle></CardHeader>
              <CardContent><BarChart data={revenueData.map((v) => v / 1000)} color="bg-green-500/70" /></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "Total Users", value: "248" }, { label: "New This Month", value: "38" }, { label: "Monthly Active", value: "187" }].map((kpi) => (
              <Card key={kpi.label}><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p></CardContent></Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">User Signups Per Month</CardTitle></CardHeader>
            <CardContent><BarChart data={[12, 18, 22, 28, 32, 35, 38, 38]} color="bg-primary/70" /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "This Month", value: "892" }, { label: "Avg/Day", value: "~30" }, { label: "Completion Rate", value: "94%" }].map((kpi) => (
              <Card key={kpi.label}><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p></CardContent></Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Sessions Per Month</CardTitle></CardHeader>
            <CardContent><BarChart data={sessionData} color="bg-accent-foreground/30" /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "MRR", value: "$24,500" }, { label: "ARR", value: "$294K" }, { label: "ARPU", value: "$99" }].map((kpi) => (
              <Card key={kpi.label}><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p></CardContent></Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Revenue Growth ($K)</CardTitle></CardHeader>
            <CardContent><BarChart data={revenueData.map((v) => v / 1000)} color="bg-green-500/70" /></CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
