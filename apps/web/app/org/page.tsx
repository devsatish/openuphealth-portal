"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, Calendar, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Members", value: "47", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Active This Month", value: "32", icon: Activity, color: "bg-accent text-green-700" },
  { label: "Sessions Used", value: "124", icon: Calendar, color: "bg-secondary text-primary" },
  { label: "Utilization Rate", value: "68%", icon: TrendingUp, color: "bg-orange-100 text-orange-700" },
];

const recentActivity = [
  { id: "1", text: "Taylor Brooks enrolled in the EAP program", time: "2 hours ago", type: "enrollment" },
  { id: "2", text: "3 new invites sent to engineering team", time: "5 hours ago", type: "invite" },
  { id: "3", text: "Jordan Rivera activated their account", time: "Yesterday", type: "enrollment" },
  { id: "4", text: "2 pending invites accepted", time: "Yesterday", type: "invite" },
  { id: "5", text: "Monthly utilization report generated", time: "Mar 1", type: "report" },
];

const ACTIVITY_COLORS: Record<string, string> = {
  enrollment: "bg-green-100 text-green-800",
  invite: "bg-blue-100 text-blue-800",
  report: "bg-secondary text-primary",
};

export default function OrgDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Acme Corp</h1>
            <Badge className="bg-primary text-primary-foreground">Professional</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">Employee Assistance Program · 50 seats</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${stat.color}`}><stat.icon className="size-4" /></div>
                <div>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                  <p className="font-bold text-2xl text-foreground">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Badge className={`text-xs ${ACTIVITY_COLORS[item.type]}`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                  <p className="text-sm text-foreground">{item.text}</p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0 ml-3">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
