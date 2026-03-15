"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MessageSquare, UserCircle } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  lastSessionDate: string;
  sessionCount: number;
  status: "active" | "inactive";
}

const mockClients: Client[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", lastSessionDate: "2026-03-07", sessionCount: 12, status: "active" },
  { id: "2", name: "Alex Kim", email: "alex@example.com", lastSessionDate: "2026-03-06", sessionCount: 8, status: "active" },
  { id: "3", name: "Maria Garcia", email: "maria@example.com", lastSessionDate: "2026-03-05", sessionCount: 5, status: "active" },
  { id: "4", name: "David Lee", email: "david@example.com", lastSessionDate: "2026-02-20", sessionCount: 15, status: "active" },
  { id: "5", name: "Emma Wilson", email: "emma@example.com", lastSessionDate: "2026-01-30", sessionCount: 3, status: "inactive" },
  { id: "6", name: "James Brown", email: "james@example.com", lastSessionDate: "2026-03-01", sessionCount: 7, status: "active" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/users?role=patient");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setClients(data);
            return;
          }
        }
      } catch {
        // fallback
      } finally {
        setClients(mockClients);
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{clients.length} total clients</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Client List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <UserCircle className="size-10 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No clients found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Client</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Last Session</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Sessions</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((client) => (
                    <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-secondary text-primary text-xs font-semibold">
                              {client.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{client.name}</p>
                            <p className="text-xs text-muted-foreground">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(client.lastSessionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{client.sessionCount}</td>
                      <td className="px-4 py-3">
                        <Badge className={client.status === "active" ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/provider/clients/${client.id}`}>
                            <Button size="sm" variant="outline" className="text-xs gap-1">
                              <UserCircle className="size-3" /> View
                            </Button>
                          </Link>
                          <Link href="/provider/messages">
                            <Button size="sm" variant="ghost" className="text-xs gap-1">
                              <MessageSquare className="size-3" /> Message
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
