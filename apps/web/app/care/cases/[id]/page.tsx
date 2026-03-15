"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, FileText, AlertTriangle, CheckCircle, UserCircle, Clock } from "lucide-react";

interface TimelineEvent {
  id: string;
  type: "note" | "assignment" | "status" | "insurance" | "alert";
  text: string;
  author: string;
  timestamp: string;
}

const mockTimeline: TimelineEvent[] = [
  { id: "e1", type: "alert", text: "Case flagged for priority review — patient reported elevated distress.", author: "System", timestamp: "2026-03-08T09:00:00Z" },
  { id: "e2", type: "note", text: "Spoke with patient via phone. Safety plan reviewed and updated.", author: "Care Team", timestamp: "2026-03-08T10:30:00Z" },
  { id: "e3", type: "assignment", text: "Assigned to Dr. Emily Chen. Match score: 92%.", author: "Coordinator", timestamp: "2026-03-07T14:00:00Z" },
  { id: "e4", type: "insurance", text: "Insurance verification submitted to Blue Cross.", author: "Insurance Team", timestamp: "2026-03-07T11:00:00Z" },
  { id: "e5", type: "status", text: "Intake form completed. All required fields submitted.", author: "System", timestamp: "2026-03-07T09:00:00Z" },
  { id: "e6", type: "note", text: "Welcome email sent and onboarding resources shared.", author: "Care Team", timestamp: "2026-03-07T09:05:00Z" },
];

const EVENT_ICONS: Record<TimelineEvent["type"], React.ElementType> = {
  note: MessageSquare,
  assignment: UserCircle,
  status: CheckCircle,
  insurance: FileText,
  alert: AlertTriangle,
};

const EVENT_COLORS: Record<TimelineEvent["type"], string> = {
  note: "bg-blue-100 text-blue-700",
  assignment: "bg-purple-100 text-purple-700",
  status: "bg-green-100 text-green-700",
  insurance: "bg-secondary text-primary",
  alert: "bg-red-100 text-red-700",
};

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [timeline, setTimeline] = useState<TimelineEvent[]>(mockTimeline);
  const [noteText, setNoteText] = useState("");

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newEvent: TimelineEvent = {
      id: `e${Date.now()}`,
      type: "note",
      text: noteText.trim(),
      author: "You",
      timestamp: new Date().toISOString(),
    };
    setTimeline((prev) => [newEvent, ...prev]);
    setNoteText("");
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/care/intakes">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground mb-2">
          <ArrowLeft className="size-4" /> Back to Cases
        </Button>
      </Link>

      {/* Case Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Jordan Rivera</h1>
            <Badge className="bg-red-100 text-red-800">High Priority</Badge>
            <Badge variant="outline">In Progress</Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">Case ID: CASE-{id?.toUpperCase() ?? "001"} · Opened Mar 7, 2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {/* Add Note */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Add Note</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add a case note, follow-up action, or update..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>Submit Note</Button>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Case Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-5">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
                {timeline.map((event) => {
                  const Icon = EVENT_ICONS[event.type];
                  return (
                    <div key={event.id} className="relative">
                      <div className={`absolute -left-4 p-1 rounded-full ${EVENT_COLORS[event.type]}`}>
                        <Icon className="size-3" />
                      </div>
                      <div className="pl-2">
                        <p className="text-sm text-foreground">{event.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="size-3" /> {formatTime(event.timestamp)} · {event.author}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Patient Info</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><p className="text-xs text-muted-foreground">Email</p><p className="text-foreground">jordan@example.com</p></div>
              <div><p className="text-xs text-muted-foreground">Goals</p><p className="text-foreground">Anxiety management, work stress</p></div>
              <div><p className="text-xs text-muted-foreground">Payment</p><p className="text-foreground">Insurance (Blue Cross)</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Insurance</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div><p className="text-xs text-muted-foreground">Carrier</p><p className="text-foreground">Blue Cross</p></div>
              <div><p className="text-xs text-muted-foreground">Member ID</p><p className="text-foreground font-mono">BCB123456</p></div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending Verification</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Assigned Coordinator</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p className="text-foreground font-medium">Care Team</p>
              <p className="text-xs text-muted-foreground">care@openuphealth.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
