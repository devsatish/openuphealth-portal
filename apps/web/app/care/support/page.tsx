"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Priority = "high" | "medium" | "low";
type TicketStatus = "open" | "in_progress" | "resolved";
type Category = "Billing" | "Technical" | "Clinical" | "Insurance";

interface Ticket {
  id: string;
  patient: string;
  category: Category;
  priority: Priority;
  status: TicketStatus;
  created: string;
  subject: string;
}

const mockTickets: Ticket[] = [
  { id: "TKT-001", patient: "Sarah Johnson", category: "Billing", priority: "high", status: "open", created: "2026-03-08", subject: "Charge dispute for Feb 12 session" },
  { id: "TKT-002", patient: "Alex Kim", category: "Insurance", priority: "high", status: "in_progress", created: "2026-03-08", subject: "Insurance claim denied — needs appeal" },
  { id: "TKT-003", patient: "Maria Garcia", category: "Technical", priority: "medium", status: "open", created: "2026-03-07", subject: "Unable to join video session" },
  { id: "TKT-004", patient: "David Lee", category: "Clinical", priority: "medium", status: "in_progress", created: "2026-03-07", subject: "Request to change therapist" },
  { id: "TKT-005", patient: "Emma Wilson", category: "Billing", priority: "low", status: "open", created: "2026-03-06", subject: "Question about superbill format" },
  { id: "TKT-006", patient: "James Brown", category: "Technical", priority: "low", status: "resolved", created: "2026-03-05", subject: "Password reset not received" },
  { id: "TKT-007", patient: "Sofia Martinez", category: "Insurance", priority: "medium", status: "open", created: "2026-03-05", subject: "Out-of-network benefit question" },
  { id: "TKT-008", patient: "Jordan Rivera", category: "Clinical", priority: "high", status: "open", created: "2026-03-04", subject: "Crisis safety plan request" },
  { id: "TKT-009", patient: "Casey Thomas", category: "Billing", priority: "low", status: "resolved", created: "2026-03-03", subject: "Receipt copy needed for HSA" },
];

const PRIORITY_CONFIG: Record<Priority, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-muted text-muted-foreground",
};

const CATEGORY_CONFIG: Record<Category, string> = {
  Billing: "bg-blue-100 text-blue-800",
  Technical: "bg-purple-100 text-purple-800",
  Clinical: "bg-green-100 text-green-800",
  Insurance: "bg-orange-100 text-orange-800",
};

const STATUS_CONFIG: Record<TicketStatus, string> = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

export default function SupportPage() {
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  const filtered = mockTickets.filter((t) => {
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support Queue</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{mockTickets.filter((t) => t.status !== "resolved").length} open tickets</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(["all", "high", "medium", "low"] as const).map((p) => (
            <button key={p} onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${priorityFilter === p ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {p === "all" ? "All Priority" : p}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(["all", "open", "in_progress", "resolved"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === s ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {s === "all" ? "All Status" : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "Patient", "Subject", "Category", "Priority", "Status", "Created", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{ticket.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{ticket.patient}</td>
                    <td className="px-4 py-3 text-sm text-foreground max-w-[180px]">
                      <span className="truncate block">{ticket.subject}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${CATEGORY_CONFIG[ticket.category]}`}>{ticket.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${PRIORITY_CONFIG[ticket.priority]}`}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${STATUS_CONFIG[ticket.status]}`}>
                        {ticket.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(ticket.created).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="outline" className="text-xs">View Case</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-12">No tickets match the selected filters</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
