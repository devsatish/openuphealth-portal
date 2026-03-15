"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Trash2 } from "lucide-react";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function OrgSettingsPage() {
  const [org, setOrg] = useState({ name: "Acme Corp", contactEmail: "hr@acme.com", website: "https://acme.com" });
  const [admins, setAdmins] = useState<Admin[]>([
    { id: "1", name: "Jennifer Walsh", email: "jen@acme.com", role: "Owner" },
    { id: "2", name: "Marcus Chen", email: "marcus@acme.com", role: "Admin" },
  ]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim()) return;
    const newAdmin: Admin = {
      id: `a${Date.now()}`,
      name: newAdminEmail.split("@")[0],
      email: newAdminEmail.trim(),
      role: "Admin",
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setNewAdminEmail("");
    setShowAddAdmin(false);
  };

  const removeAdmin = (id: string) => setAdmins((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organization Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your organization profile and team</p>
      </div>

      <Tabs defaultValue="org">
        <TabsList className="grid grid-cols-2 w-fit">
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="org">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-1.5">
                <Label>Organization Name</Label>
                <Input value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact Email</Label>
                <Input type="email" value={org.contactEmail} onChange={(e) => setOrg({ ...org, contactEmail: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Website</Label>
                <Input type="url" value={org.website} onChange={(e) => setOrg({ ...org, website: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg border border-border flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{org.name.charAt(0)}</span>
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" />
                    <Button variant="outline" className="gap-1 text-xs" asChild>
                      <span><Upload className="size-3" /> Upload Logo</span>
                    </Button>
                  </label>
                </div>
              </div>
              <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>{saved ? "Saved!" : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{admins.length} admins</p>
                <Button size="sm" className="gap-1 text-xs" onClick={() => setShowAddAdmin(true)}>
                  <Plus className="size-3" /> Add Admin
                </Button>
              </div>

              {showAddAdmin && (
                <div className="flex gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                  <Input
                    type="email"
                    placeholder="admin@acme.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="flex-1"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleAddAdmin()}
                  />
                  <Button size="sm" onClick={handleAddAdmin} disabled={!newAdminEmail.trim()}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setShowAddAdmin(false); setNewAdminEmail(""); }}>Cancel</Button>
                </div>
              )}

              <div className="space-y-2">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-secondary text-primary text-xs font-semibold">
                          {admin.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{admin.name}</p>
                        <p className="text-xs text-muted-foreground">{admin.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{admin.role}</Badge>
                      {admin.role !== "Owner" && (
                        <button onClick={() => removeAdmin(admin.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
