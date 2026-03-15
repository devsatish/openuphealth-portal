"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type UserRole = "PATIENT" | "THERAPIST" | "ORG_ADMIN" | "CARE_COORDINATOR" | "ADMIN";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
  status: "active" | "inactive";
}

const mockUsers: User[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", role: "PATIENT", joined: "2026-01-15", status: "active" },
  { id: "2", name: "Dr. Emily Chen", email: "emily@example.com", role: "THERAPIST", joined: "2025-12-01", status: "active" },
  { id: "3", name: "Alex Kim", email: "alex@example.com", role: "PATIENT", joined: "2026-02-10", status: "active" },
  { id: "4", name: "Jennifer Walsh", email: "jen@acme.com", role: "ORG_ADMIN", joined: "2026-01-20", status: "active" },
  { id: "5", name: "Maria Garcia", email: "maria@example.com", role: "PATIENT", joined: "2026-02-22", status: "active" },
  { id: "6", name: "Dr. Marcus Johnson", email: "marcus@example.com", role: "THERAPIST", joined: "2026-01-05", status: "active" },
  { id: "7", name: "Emma Wilson", email: "emma@example.com", role: "PATIENT", joined: "2025-11-30", status: "inactive" },
  { id: "8", name: "Care Team", email: "care@example.com", role: "CARE_COORDINATOR", joined: "2025-10-01", status: "active" },
  { id: "9", name: "Super Admin", email: "admin@openuphealth.com", role: "ADMIN", joined: "2025-09-01", status: "active" },
];

const ROLE_CLASSES: Record<UserRole, string> = {
  PATIENT: "bg-blue-100 text-blue-800",
  THERAPIST: "bg-green-100 text-green-800",
  ORG_ADMIN: "bg-purple-100 text-purple-800",
  CARE_COORDINATOR: "bg-orange-100 text-orange-800",
  ADMIN: "bg-red-100 text-red-800",
};

const PAGE_SIZE = 6;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setUsers(data); return; }
        }
      } catch { /* fallback */ }
      finally { setUsers(mockUsers); setLoading(false); }
    };
    load();
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const updateRole = (id: string, role: UserRole) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));
  const deactivate = (id: string) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: "inactive" as const } : u));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{users.length} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9" />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as UserRole | "ALL"); setPage(0); }}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">All Roles</option>
          {(["PATIENT", "THERAPIST", "ORG_ADMIN", "CARE_COORDINATOR", "ADMIN"] as UserRole[]).map((r) => (
            <option key={r} value={r}>{r.replace("_", " ")}</option>
          ))}
        </select>
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
                    {["User", "Role", "Joined", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-secondary text-primary text-xs font-semibold">
                              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value as UserRole)}
                          className="text-xs border border-border rounded px-2 py-1 bg-card focus:outline-none"
                        >
                          {(["PATIENT", "THERAPIST", "ORG_ADMIN", "CARE_COORDINATOR", "ADMIN"] as UserRole[]).map((r) => (
                            <option key={r} value={r}>{r.replace("_", " ")}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(user.joined).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={user.status === "active" ? "bg-green-100 text-green-800 text-xs" : "bg-muted text-muted-foreground text-xs"}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {user.status === "active" && (
                          <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive" onClick={() => deactivate(user.id)}>
                            Deactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginated.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No users found</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage(page - 1)} disabled={page === 0} className="gap-1">
              <ChevronLeft className="size-3" /> Prev
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="gap-1">
              Next <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
