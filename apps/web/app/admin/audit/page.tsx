"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";

type ActionType = "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "EXPORT";

interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  action: ActionType;
  resource: string;
  resourceId: string;
  ipAddress: string;
}

const mockLogs: AuditLog[] = [
  { id: "1", timestamp: "2026-03-08T09:15:23Z", userEmail: "admin@openuphealth.com", action: "LOGIN", resource: "Session", resourceId: "ses_001", ipAddress: "192.168.1.1" },
  { id: "2", timestamp: "2026-03-08T09:20:11Z", userEmail: "admin@openuphealth.com", action: "VIEW", resource: "User", resourceId: "usr_248", ipAddress: "192.168.1.1" },
  { id: "3", timestamp: "2026-03-08T09:22:40Z", userEmail: "admin@openuphealth.com", action: "UPDATE", resource: "User", resourceId: "usr_248", ipAddress: "192.168.1.1" },
  { id: "4", timestamp: "2026-03-08T10:05:00Z", userEmail: "emily@example.com", action: "CREATE", resource: "Appointment", resourceId: "appt_892", ipAddress: "10.0.0.5" },
  { id: "5", timestamp: "2026-03-08T10:30:00Z", userEmail: "care@example.com", action: "UPDATE", resource: "Case", resourceId: "case_112", ipAddress: "10.0.0.8" },
  { id: "6", timestamp: "2026-03-07T14:15:00Z", userEmail: "admin@openuphealth.com", action: "DELETE", resource: "Content", resourceId: "cnt_007", ipAddress: "192.168.1.1" },
  { id: "7", timestamp: "2026-03-07T13:00:00Z", userEmail: "marcus@example.com", action: "VIEW", resource: "Patient", resourceId: "pat_089", ipAddress: "10.0.0.12" },
  { id: "8", timestamp: "2026-03-07T11:45:00Z", userEmail: "admin@openuphealth.com", action: "EXPORT", resource: "Report", resourceId: "rpt_march", ipAddress: "192.168.1.1" },
  { id: "9", timestamp: "2026-03-07T09:00:00Z", userEmail: "emily@example.com", action: "LOGIN", resource: "Session", resourceId: "ses_099", ipAddress: "10.0.0.5" },
  { id: "10", timestamp: "2026-03-06T16:00:00Z", userEmail: "care@example.com", action: "CREATE", resource: "Note", resourceId: "note_044", ipAddress: "10.0.0.8" },
];

const ACTION_CLASSES: Record<ActionType, string> = {
  LOGIN: "bg-blue-100 text-blue-800",
  LOGOUT: "bg-muted text-muted-foreground",
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
  VIEW: "bg-secondary text-primary",
  EXPORT: "bg-purple-100 text-purple-800",
};

const PAGE_SIZE = 7;

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionType | "ALL">("ALL");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/audit-logs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setLogs(data); return; }
        }
      } catch { /* fallback */ }
      finally { setLogs(mockLogs); setLoading(false); }
    };
    load();
  }, []);

  const filtered = logs.filter((l) => {
    const matchUser = l.userEmail.toLowerCase().includes(userSearch.toLowerCase());
    const matchAction = actionFilter === "ALL" || l.action === actionFilter;
    return matchUser && matchAction;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground text-sm mt-0.5">All platform activity with user attribution</p>
        </div>
        <Button variant="outline" className="gap-1 text-xs" onClick={() => alert("Export coming soon")}>
          <Download className="size-3" /> Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Filter by user email..." value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setPage(0); }} className="max-w-xs" />
        <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value as ActionType | "ALL"); setPage(0); }}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none">
          <option value="ALL">All Actions</option>
          {(["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "VIEW", "EXPORT"] as ActionType[]).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Timestamp", "User", "Action", "Resource", "ID", "IP"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{log.userEmail}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${ACTION_CLASSES[log.action]}`}>{log.action}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-foreground">{log.resource}</td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{log.resourceId}</td>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginated.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No logs match filters</p>}
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
