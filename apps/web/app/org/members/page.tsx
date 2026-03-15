"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Search, UserPlus, Download, X } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  status: "active" | "pending" | "inactive";
  enrolled: string;
  sessionsThisMonth: number;
}

const mockMembers: Member[] = [
  { id: "1", name: "Taylor Brooks", email: "taylor@acme.com", status: "active", enrolled: "2026-01-15", sessionsThisMonth: 3 },
  { id: "2", name: "Jordan Rivera", email: "jordan@acme.com", status: "active", enrolled: "2026-01-20", sessionsThisMonth: 2 },
  { id: "3", name: "Alex Chen", email: "alex@acme.com", status: "pending", enrolled: "2026-03-01", sessionsThisMonth: 0 },
  { id: "4", name: "Sam Wilson", email: "sam@acme.com", status: "active", enrolled: "2025-12-10", sessionsThisMonth: 4 },
  { id: "5", name: "Dana Park", email: "dana@acme.com", status: "active", enrolled: "2026-02-05", sessionsThisMonth: 1 },
  { id: "6", name: "Casey Thomas", email: "casey@acme.com", status: "inactive", enrolled: "2025-11-20", sessionsThisMonth: 0 },
  { id: "7", name: "Morgan Lee", email: "morgan@acme.com", status: "active", enrolled: "2026-02-14", sessionsThisMonth: 2 },
];

const STATUS_CLASSES = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  inactive: "bg-muted text-muted-foreground",
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "inactive">("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/organizations/1/members");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setMembers(data); return; }
        }
      } catch { /* fallback */ }
      finally { setMembers(mockMembers); setLoading(false); }
    };
    load();
  }, []);

  const filtered = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInvite = () => {
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInviteModal(false); setInviteEmail(""); }, 1500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Members</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{members.length} total members</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1 text-xs" onClick={() => alert("CSV export coming soon")}>
            <Download className="size-3" /> Export CSV
          </Button>
          <Button className="gap-1 text-xs" onClick={() => setShowInviteModal(true)}>
            <UserPlus className="size-4" /> Invite Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(["all", "active", "pending", "inactive"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${statusFilter === s ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Member", "Status", "Enrolled", "Sessions (Month)", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((member) => (
                    <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-secondary text-primary text-xs font-semibold">
                              {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${STATUS_CLASSES[member.status]}`}>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(member.enrolled).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{member.sessionsThisMonth}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive">Remove</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No members found</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Invite Member</h2>
              <button onClick={() => setShowInviteModal(false)}><X className="size-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-1.5">
              <Label>Work Email</Label>
              <Input type="email" placeholder="colleague@acme.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowInviteModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleInvite} disabled={!inviteEmail || inviteSent} className="flex-1">
                {inviteSent ? "Sent!" : "Send Invite"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
