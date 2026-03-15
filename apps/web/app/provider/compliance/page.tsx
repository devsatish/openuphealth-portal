"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Upload, CheckCircle, Clock, FileX } from "lucide-react";

interface LicenseInfo {
  licenseNumber: string;
  state: string;
  expiryDate: string;
  npiNumber: string;
}

const docStatus = [
  { label: "License Copy", status: "verified" as const, lastUpdated: "2026-01-15" },
  { label: "Malpractice Insurance", status: "pending" as const, lastUpdated: "2026-02-20" },
  { label: "Credentialing Docs", status: "not_uploaded" as const, lastUpdated: null },
];

function StatusBadge({ status }: { status: "verified" | "pending" | "not_uploaded" }) {
  if (status === "verified") return <Badge className="bg-green-100 text-green-800 gap-1"><CheckCircle className="size-3" /> Verified</Badge>;
  if (status === "pending") return <Badge className="bg-yellow-100 text-yellow-800 gap-1"><Clock className="size-3" /> Pending</Badge>;
  return <Badge variant="outline" className="text-muted-foreground gap-1"><FileX className="size-3" /> Not Uploaded</Badge>;
}

export default function CompliancePage() {
  const [license, setLicense] = useState<LicenseInfo>({
    licenseNumber: "LCSW-78412",
    state: "CA",
    expiryDate: "2027-06-30",
    npiNumber: "1234567890",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your license, NPI, and required documentation</p>
      </div>

      {/* Legal Notice */}
      <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          This section requires legal review before production use. All compliance information must be verified by our credentialing team.
        </p>
      </div>

      {/* License Info */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">License Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input id="licenseNumber" value={license.licenseNumber} onChange={(e) => setLicense({ ...license, licenseNumber: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">License State</Label>
              <Input id="state" value={license.state} onChange={(e) => setLicense({ ...license, state: e.target.value })} placeholder="e.g. CA" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expiry">License Expiry Date</Label>
              <Input id="expiry" type="date" value={license.expiryDate} onChange={(e) => setLicense({ ...license, expiryDate: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="npi">NPI Number</Label>
              <Input id="npi" value={license.npiNumber} readOnly className="bg-muted text-muted-foreground" />
            </div>
          </div>
          <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>
            {saved ? "Saved!" : "Save License Info"}
          </Button>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Required Documents</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {docStatus.map((doc) => (
            <div key={doc.label} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">{doc.label}</p>
                {doc.lastUpdated && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Last updated: {new Date(doc.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={doc.status} />
                <label className="cursor-pointer">
                  <input type="file" className="hidden" accept=".pdf,.jpg,.png" />
                  <Button size="sm" variant="outline" className="gap-1 text-xs" asChild>
                    <span><Upload className="size-3" /> Upload</span>
                  </Button>
                </label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
