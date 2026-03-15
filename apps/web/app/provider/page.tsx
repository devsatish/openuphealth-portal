"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Users, MessageSquare, Clock, Monitor, MapPin } from "lucide-react";

const todaySchedule = [
  { id: "1", patientName: "Sarah Johnson", time: "10:00 AM", duration: "50 min", modality: "Virtual" },
  { id: "2", patientName: "Alex Kim", time: "1:00 PM", duration: "50 min", modality: "In-person" },
  { id: "3", patientName: "Maria Garcia", time: "3:30 PM", duration: "50 min", modality: "Virtual" },
];

const recentPatients = [
  { id: "1", name: "Sarah Johnson", lastSession: "2026-03-07", totalSessions: 12 },
  { id: "2", name: "Alex Kim", lastSession: "2026-03-06", totalSessions: 8 },
  { id: "3", name: "Maria Garcia", lastSession: "2026-03-05", totalSessions: 5 },
];

export default function ProviderDashboard() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good morning, Dr. Chen</h1>
        <p className="text-muted-foreground text-sm mt-0.5">You have {todaySchedule.length} sessions today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-lg"><Users className="size-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Active Clients</p>
                <p className="font-bold text-2xl text-foreground">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent p-2.5 rounded-lg"><Calendar className="size-5 text-green-700" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Sessions This Week</p>
                <p className="font-bold text-2xl text-foreground">11</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary p-2.5 rounded-lg"><MessageSquare className="size-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Unread Messages</p>
                <p className="font-bold text-2xl text-foreground">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
              <Link href="/provider/schedule">
                <Button size="sm" variant="outline" className="text-xs">Full Schedule</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {todaySchedule.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No sessions today</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todaySchedule.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1.5 rounded-md">
                        <Clock className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{session.patientName}</p>
                        <p className="text-xs text-muted-foreground">{session.time} · {session.duration}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1 text-xs">
                      {session.modality === "Virtual" ? <Monitor className="size-3" /> : <MapPin className="size-3" />}
                      {session.modality}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Patients</CardTitle>
              <Link href="/provider/clients">
                <Button size="sm" variant="outline" className="text-xs">All Clients</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentPatients.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-primary text-xs font-semibold">
                        {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Last session: {new Date(p.lastSession).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{p.totalSessions} sessions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/provider/schedule">
              <Button variant="outline" className="w-full gap-2"><Calendar className="size-4" /> View Schedule</Button>
            </Link>
            <Link href="/provider/messages">
              <Button variant="outline" className="w-full gap-2"><MessageSquare className="size-4" /> Message Patient</Button>
            </Link>
            <Link href="/provider/settings">
              <Button variant="outline" className="w-full gap-2"><Clock className="size-4" /> Update Availability</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
