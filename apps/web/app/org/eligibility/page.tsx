"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle } from "lucide-react";

export default function EligibilityPage() {
  const [saved, setSaved] = useState(false);
  const [rules, setRules] = useState({
    sessionsPerYear: "12",
    waitingPeriodDays: "0",
    enrollmentStart: "2026-01-01",
    enrollmentEnd: "2026-12-31",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const coveredServices = [
    "Individual Therapy (50 min)",
    "Group Therapy Sessions",
    "Couples Counseling",
    "Crisis Support (24/7)",
    "Mental Health Assessments",
    "Care Coordination",
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Eligibility Management</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Configure EAP benefits and manage member enrollment</p>
      </div>

      {/* Enrollment Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Enrolled", value: "47", color: "bg-green-100 text-green-800" },
          { label: "Pending", value: "12", color: "bg-yellow-100 text-yellow-800" },
          { label: "Inactive", value: "3", color: "bg-muted text-muted-foreground" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <Badge className={`mt-1 text-xs ${stat.color}`}>{stat.label}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Current Plan Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">Professional EAP Plan</p>
                <p className="text-xs text-muted-foreground">50 seats · Annual billing</p>
              </div>
              <Badge className="bg-primary text-primary-foreground">Active</Badge>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Covered Services</p>
              <ul className="space-y-1.5">
                {coveredServices.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="size-3.5 text-green-600 flex-shrink-0" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Rules */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Eligibility Rules</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Sessions Per Year</Label>
              <Input type="number" value={rules.sessionsPerYear} onChange={(e) => setRules({ ...rules, sessionsPerYear: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Waiting Period (days)</Label>
              <Input type="number" value={rules.waitingPeriodDays} onChange={(e) => setRules({ ...rules, waitingPeriodDays: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Enrollment Start</Label>
                <Input type="date" value={rules.enrollmentStart} onChange={(e) => setRules({ ...rules, enrollmentStart: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Enrollment End</Label>
                <Input type="date" value={rules.enrollmentEnd} onChange={(e) => setRules({ ...rules, enrollmentEnd: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>{saved ? "Saved!" : "Save Rules"}</Button>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Upload */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Bulk Member Upload</CardTitle></CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <Upload className="size-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-1">Upload employee list</p>
            <p className="text-xs text-muted-foreground mb-4">CSV format: name, email, department. Max 500 rows.</p>
            <label className="cursor-pointer">
              <input type="file" accept=".csv" className="hidden" />
              <Button variant="outline" asChild><span>Choose CSV File</span></Button>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
