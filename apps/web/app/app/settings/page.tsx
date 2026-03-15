"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle } from "lucide-react";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [saved, setSaved] = useState<string | null>(null);
  const [profile, setProfile] = useState({ name: "Sarah Johnson", email: "sarah@example.com", phone: "(555) 123-4567", dob: "1990-05-15" });
  const [notifs, setNotifs] = useState({ emailAppt: true, emailMessage: true, smsAppt: false, smsReminder: true, pushAll: true });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [passError, setPassError] = useState("");

  const save = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  const handlePasswordChange = () => {
    if (passwords.newPass !== passwords.confirm) { setPassError("Passwords do not match."); return; }
    if (passwords.newPass.length < 8) { setPassError("Password must be at least 8 characters."); return; }
    setPassError("");
    setPasswords({ current: "", newPass: "", confirm: "" });
    save("security");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
          <TabsTrigger value="privacy" className="flex-1">Privacy</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {saved === "profile" && <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="size-4" /> Profile saved successfully.</div>}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <Label>Full Name</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
                </div>
              </div>
              <Button onClick={() => save("profile")}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {saved === "notifs" && <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="size-4" /> Preferences saved.</div>}
              {[
                { key: "emailAppt", label: "Email: Appointment reminders", sub: "24 hours before your session" },
                { key: "emailMessage", label: "Email: New messages", sub: "When your therapist sends a message" },
                { key: "smsAppt", label: "SMS: Appointment reminders", sub: "Text message 1 hour before" },
                { key: "smsReminder", label: "SMS: Mood check-in reminder", sub: "Daily reminder to check in" },
                { key: "pushAll", label: "Push: All notifications", sub: "In-app and browser notifications" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                  <Toggle
                    checked={notifs[item.key as keyof typeof notifs]}
                    onChange={() => setNotifs({ ...notifs, [item.key]: !notifs[item.key as keyof typeof notifs] })}
                  />
                </div>
              ))}
              <Button onClick={() => save("notifs")}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {saved === "security" && <div className="flex items-center gap-2 text-sm text-green-600"><CheckCircle className="size-4" /> Password updated successfully.</div>}
              {passError && <p className="text-sm text-destructive">{passError}</p>}
              <div className="space-y-1.5">
                <Label>Current Password</Label>
                <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>New Password</Label>
                <Input type="password" placeholder="Minimum 8 characters" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Confirm New Password</Label>
                <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
              </div>
              <Button onClick={handlePasswordChange}>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Privacy & Data</CardTitle>
              <CardDescription>Manage your personal data and account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/40 rounded-lg space-y-2">
                <h3 className="font-medium text-foreground text-sm">Export Your Data</h3>
                <p className="text-xs text-muted-foreground">Download a copy of all your health data including session notes, mood logs, and assessments.</p>
                <Button variant="outline" size="sm">Request Data Export</Button>
              </div>

              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg space-y-2">
                <h3 className="font-medium text-destructive text-sm">Delete Account</h3>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10">
                  Request Account Deletion
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
