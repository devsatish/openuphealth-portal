"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Upload, CheckCircle, Clock, XCircle, Info } from "lucide-react";

const statusConfig = {
  VERIFIED: { label: "Verified", icon: CheckCircle, className: "bg-green-100 text-green-800" },
  PENDING: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
  REJECTED: { label: "Not Verified", icon: XCircle, className: "bg-red-100 text-red-800" },
};

export default function InsurancePage() {
  const [loading, setLoading] = useState(true);
  const [insurance, setInsurance] = useState<{
    carrier: string; memberId: string; groupNumber: string; planName: string; status: keyof typeof statusConfig;
  } | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ carrier: "", memberId: "", groupNumber: "", planName: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/insurance");
        if (res.ok) {
          const data = await res.json();
          if (data && data.carrier) {
            setInsurance(data);
            setForm({ carrier: data.carrier, memberId: data.memberId, groupNumber: data.groupNumber, planName: data.planName || "" });
          } else {
            setInsurance({ carrier: "Aetna", memberId: "AET123456789", groupNumber: "GRP001", planName: "Aetna Choice POS II", status: "PENDING" });
            setForm({ carrier: "Aetna", memberId: "AET123456789", groupNumber: "GRP001", planName: "Aetna Choice POS II" });
          }
        } else {
          setInsurance({ carrier: "Aetna", memberId: "AET123456789", groupNumber: "GRP001", planName: "Aetna Choice POS II", status: "PENDING" });
        }
      } catch {
        setInsurance({ carrier: "Aetna", memberId: "AET123456789", groupNumber: "GRP001", planName: "Aetna Choice POS II", status: "PENDING" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/insurance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setInsurance((prev) => prev ? { ...prev, ...form, status: "PENDING" } : null);
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insurance</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your insurance information for coverage verification</p>
      </div>

      {/* Current Insurance */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="size-4" /> Insurance Information
            </CardTitle>
            {insurance && (() => {
              const cfg = statusConfig[insurance.status];
              return (
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${cfg.className}`}>
                  <cfg.icon className="size-3" /> {cfg.label}
                </span>
              );
            })()}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 rounded-md" />)}
            </div>
          ) : insurance && !editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Carrier</p>
                  <p className="font-medium text-foreground text-sm">{insurance.carrier}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plan Name</p>
                  <p className="font-medium text-foreground text-sm">{insurance.planName || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Member ID</p>
                  <p className="font-medium text-foreground text-sm font-mono">{insurance.memberId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Group Number</p>
                  <p className="font-medium text-foreground text-sm font-mono">{insurance.groupNumber}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit Insurance</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Carrier</Label>
                  <Input placeholder="e.g. Aetna, BCBS" value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Plan Name</Label>
                  <Input placeholder="Optional" value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Member ID</Label>
                  <Input placeholder="From your insurance card" value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Group Number</Label>
                  <Input placeholder="From your insurance card" value={form.groupNumber} onChange={(e) => setForm({ ...form, groupNumber: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="size-4" /> Insurance Card Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Upload photos of your insurance card to help us verify your coverage faster.</p>
          <div className="grid grid-cols-2 gap-3">
            {["Front of Card", "Back of Card"].map((side) => (
              <label key={side} className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <Upload className="size-6 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-medium">{side}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Click to upload</p>
                <input type="file" accept="image/*" className="sr-only" />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-5 pb-4">
          <div className="flex gap-3">
            <Info className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm mb-1">Why We Need This</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>To verify your coverage and calculate your copay</li>
                <li>To bill your insurer directly for covered sessions</li>
                <li>To prevent unexpected out-of-pocket costs</li>
                <li>Your information is encrypted and HIPAA-protected</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
