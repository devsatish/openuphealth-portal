"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Plus, X } from "lucide-react";

interface Carrier {
  id: string;
  name: string;
  status: "active" | "inactive";
}

const mockCarriers: Carrier[] = [
  { id: "1", name: "Blue Cross Blue Shield", status: "active" },
  { id: "2", name: "Aetna", status: "active" },
  { id: "3", name: "United Health", status: "active" },
  { id: "4", name: "Cigna", status: "active" },
  { id: "5", name: "Humana", status: "inactive" },
  { id: "6", name: "Kaiser Permanente", status: "active" },
];

const payerIntegrations = [
  { name: "Availity", status: "Not Connected" },
  { name: "Change Healthcare", status: "Not Connected" },
  { name: "Office Ally", status: "Not Connected" },
];

export default function InsuranceSettingsPage() {
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCarrierName, setNewCarrierName] = useState("");

  const toggleCarrier = (id: string) =>
    setCarriers((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" as const } : c));

  const addCarrier = () => {
    if (!newCarrierName.trim()) return;
    setCarriers((prev) => [...prev, { id: `c${Date.now()}`, name: newCarrierName.trim(), status: "active" }]);
    setNewCarrierName("");
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Insurance Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage accepted carriers and payer integrations</p>
      </div>

      {/* Legal Notice */}
      <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-800">
          Real payer integrations require production setup and legal agreements. This section is for configuration only.
        </p>
      </div>

      {/* Accepted Carriers */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Accepted Carriers</CardTitle>
            <Button size="sm" className="gap-1 text-xs" onClick={() => setShowAddModal(true)}>
              <Plus className="size-3" /> Add Carrier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Carrier Name", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground pb-2 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {carriers.map((carrier) => (
                  <tr key={carrier.id}>
                    <td className="py-3 pr-6 text-sm font-medium text-foreground">{carrier.name}</td>
                    <td className="py-3 pr-6">
                      <Badge className={carrier.status === "active" ? "bg-green-100 text-green-800 text-xs" : "bg-muted text-muted-foreground text-xs"}>
                        {carrier.status.charAt(0).toUpperCase() + carrier.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Button size="sm" variant="ghost" className="text-xs" onClick={() => toggleCarrier(carrier.id)}>
                        {carrier.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payer Integrations */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Payer Integration Status</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {payerIntegrations.map((payer) => (
              <div key={payer.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">{payer.name}</p>
                  <p className="text-xs text-muted-foreground">EDI clearinghouse integration</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-muted-foreground text-xs">{payer.status}</Badge>
                  <Button size="sm" variant="outline" className="text-xs" disabled>Configure</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Carrier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Add Carrier</h2>
              <button onClick={() => setShowAddModal(false)}><X className="size-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-1.5">
              <Label>Carrier Name</Label>
              <Input placeholder="e.g. Anthem, Oscar Health" value={newCarrierName} onChange={(e) => setNewCarrierName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && addCarrier()} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={addCarrier} disabled={!newCarrierName.trim()} className="flex-1">Add Carrier</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
