"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Monitor, MapPin, Plus, Video } from "lucide-react";

const mockAppointments = [
  { id: "1", therapistName: "Dr. Emily Chen", date: "2026-03-12", time: "10:00 AM", modality: "Virtual", status: "CONFIRMED" },
  { id: "2", therapistName: "Dr. Emily Chen", date: "2026-03-26", time: "10:00 AM", modality: "Virtual", status: "CONFIRMED" },
  { id: "3", therapistName: "Dr. Emily Chen", date: "2026-02-26", time: "10:00 AM", modality: "Virtual", status: "COMPLETED" },
  { id: "4", therapistName: "Dr. Emily Chen", date: "2026-02-12", time: "10:00 AM", modality: "In-person", status: "COMPLETED" },
  { id: "5", therapistName: "Dr. Marcus Williams", date: "2026-01-30", time: "2:00 PM", modality: "Virtual", status: "CANCELLED" },
];

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export default function AppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<typeof mockAppointments>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/appointments");
        if (res.ok) {
          const data = await res.json();
          setAppointments(Array.isArray(data) && data.length > 0 ? data : mockAppointments);
        } else {
          setAppointments(mockAppointments);
        }
      } catch {
        setAppointments(mockAppointments);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const upcoming = appointments.filter((a) => a.status === "CONFIRMED" || a.status === "PENDING");
  const past = appointments.filter((a) => a.status === "COMPLETED");
  const cancelled = appointments.filter((a) => a.status === "CANCELLED");

  const AppointmentCard = ({ appt }: { appt: (typeof mockAppointments)[0] }) => (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Calendar className="size-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{appt.therapistName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="size-3" /> {appt.date} at {appt.time}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge variant="outline" className="text-xs gap-1 py-0">
              {appt.modality === "Virtual" ? <Monitor className="size-3" /> : <MapPin className="size-3" />}
              {appt.modality}
            </Badge>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[appt.status]}`}>
              {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {appt.status === "CONFIRMED" && (
          <>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Video className="size-3" /> Join
            </Button>
            <Link href={`/app/appointments/${appt.id}`}>
              <Button size="sm" variant="ghost" className="text-xs">Details</Button>
            </Link>
          </>
        )}
        {appt.status === "COMPLETED" && (
          <Link href={`/app/appointments/${appt.id}`}>
            <Button size="sm" variant="ghost" className="text-xs">View Notes</Button>
          </Link>
        )}
      </div>
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12 text-muted-foreground">
      <Calendar className="size-10 mx-auto mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your therapy sessions</p>
        </div>
        <Link href="/app/providers">
          <Button className="gap-2">
            <Plus className="size-4" /> Book New
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Tabs defaultValue="upcoming">
            <TabsList className="w-full">
              <TabsTrigger value="upcoming" className="flex-1">
                Upcoming {upcoming.length > 0 && <span className="ml-1 text-xs">({upcoming.length})</span>}
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1">
                Past {past.length > 0 && <span className="ml-1 text-xs">({past.length})</span>}
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex-1">
                Cancelled
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
                </div>
              ) : (
                <>
                  <TabsContent value="upcoming" className="space-y-3 mt-0">
                    {upcoming.length === 0 ? <EmptyState message="No upcoming appointments. Book a session to get started." /> : upcoming.map((a) => <AppointmentCard key={a.id} appt={a} />)}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-3 mt-0">
                    {past.length === 0 ? <EmptyState message="No past appointments yet." /> : past.map((a) => <AppointmentCard key={a.id} appt={a} />)}
                  </TabsContent>

                  <TabsContent value="cancelled" className="space-y-3 mt-0">
                    {cancelled.length === 0 ? <EmptyState message="No cancelled appointments." /> : cancelled.map((a) => <AppointmentCard key={a.id} appt={a} />)}
                  </TabsContent>
                </>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
