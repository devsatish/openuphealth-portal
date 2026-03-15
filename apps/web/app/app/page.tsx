"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MessageSquare, Heart, TrendingUp, Sparkles, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const moodEmojis: Record<number, string> = { 1: "😔", 2: "😟", 3: "😕", 4: "🙁", 5: "😐", 6: "🙂", 7: "😊", 8: "😄", 9: "😁", 10: "🤩" };
const moodColors: Record<string, string> = {
  low: "bg-red-200 text-red-800",
  medium: "bg-yellow-200 text-yellow-800",
  high: "bg-green-200 text-green-800",
};

function getMoodLevel(score: number) {
  if (score <= 3) return "low";
  if (score <= 6) return "medium";
  return "high";
}

const selfCareTips = [
  "Take 5 deep breaths when you feel overwhelmed. Slow breathing activates your parasympathetic nervous system.",
  "Spend 10 minutes outside today — natural light improves mood and helps regulate sleep.",
  "Write down three things you're grateful for. Gratitude practice rewires the brain for positivity.",
  "Drink a glass of water right now. Dehydration can amplify feelings of anxiety.",
  "Send a kind message to someone you care about. Connection is medicine.",
  "Take a 5-minute walk without your phone. Movement and disconnecting reduces cortisol.",
  "Practice the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste.",
];

export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [moods, setMoods] = useState<any[]>([]);
  const todayTip = selfCareTips[new Date().getDay() % selfCareTips.length];

  useEffect(() => {
    const load = async () => {
      try {
        const [apptRes, moodRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/mood"),
        ]);
        if (apptRes.ok) {
          const data = await apptRes.json();
          setAppointments(Array.isArray(data) ? data.slice(0, 3) : []);
        }
        if (moodRes.ok) {
          const data = await moodRes.json();
          setMoods(Array.isArray(data) ? data.slice(0, 7) : []);
        }
      } catch {
        // Use mock data
        setAppointments([
          { id: "1", therapistName: "Dr. Emily Chen", date: "2026-03-12", time: "10:00 AM", modality: "Virtual", status: "CONFIRMED" },
          { id: "2", therapistName: "Dr. Emily Chen", date: "2026-03-26", time: "10:00 AM", modality: "Virtual", status: "CONFIRMED" },
        ]);
        setMoods([
          { id: "1", score: 7, createdAt: "2026-03-07" },
          { id: "2", score: 6, createdAt: "2026-03-06" },
          { id: "3", score: 5, createdAt: "2026-03-05" },
          { id: "4", score: 8, createdAt: "2026-03-04" },
          { id: "5", score: 7, createdAt: "2026-03-03" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const nextAppt = appointments[0];
  const currentStreak = moods.length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Good morning, Sarah</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your mental wellness journey.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : (
          <>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <Calendar className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Next Session</p>
                    <p className="font-semibold text-foreground text-sm">
                      {nextAppt ? `${nextAppt.date} at ${nextAppt.time}` : "No upcoming"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent p-2.5 rounded-lg">
                    <TrendingUp className="size-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Sessions</p>
                    <p className="font-semibold text-foreground text-sm">12 sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary p-2.5 rounded-lg">
                    <Heart className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mood Streak</p>
                    <p className="font-semibold text-foreground text-sm">{currentStreak} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
              <Link href="/app/appointments">
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                  <Plus className="size-3" /> Book New
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No upcoming appointments</p>
                <Link href="/app/appointments" className="text-primary text-sm hover:underline">Book your first session</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {appointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">{appt.therapistName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> {appt.date} at {appt.time}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{appt.modality}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Trend */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Mood</CardTitle>
              <Link href="/app/checkins" className="text-xs text-primary hover:underline">Check in today</Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-20 rounded-lg" />
            ) : moods.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Heart className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No check-ins yet</p>
              </div>
            ) : (
              <div className="flex items-end gap-2 justify-center py-2">
                {moods.slice(0, 7).reverse().map((mood, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-lg" title={`Score: ${mood.score}`}>{moodEmojis[mood.score] || "😐"}</span>
                    <div
                      className={cn("w-8 rounded-t transition-all", moodColors[getMoodLevel(mood.score)])}
                      style={{ height: `${mood.score * 5}px` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {new Date(mood.createdAt).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/app/checkins">
              <Button variant="outline" className="w-full gap-2">
                <Heart className="size-4 text-pink-500" />
                Check In Today
              </Button>
            </Link>
            <Link href="/app/messages">
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare className="size-4 text-primary" />
                Message Therapist
              </Button>
            </Link>
            <Link href="/app/assessments">
              <Button variant="outline" className="w-full gap-2">
                <TrendingUp className="size-4 text-green-600" />
                View Progress
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Self-Care Tip */}
      <Card className="bg-accent/30 border-accent">
        <CardContent className="pt-5">
          <div className="flex gap-3">
            <div className="bg-accent p-2.5 rounded-lg flex-shrink-0">
              <Sparkles className="size-5 text-green-700" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm mb-1">Self-Care Tip of the Day</p>
              <p className="text-sm text-muted-foreground">{todayTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
