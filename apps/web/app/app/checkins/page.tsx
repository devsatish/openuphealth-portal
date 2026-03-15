"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const moodEmojis = ["", "😔", "😟", "😕", "🙁", "😐", "🙂", "😊", "😄", "😁", "🤩"];
const moodLabels = ["", "Very Low", "Low", "Below Avg", "Below Avg", "Neutral", "Okay", "Good", "Great", "Very Good", "Excellent"];

function getMoodColor(score: number) {
  if (score <= 3) return "bg-red-100 text-red-800";
  if (score <= 5) return "bg-yellow-100 text-yellow-800";
  if (score <= 7) return "bg-blue-100 text-blue-800";
  return "bg-green-100 text-green-800";
}

const mockHistory = [
  { id: "1", score: 7, journal: "Had a productive day at work. Still a little anxious about the presentation, but breathing exercises helped.", createdAt: "2026-03-07" },
  { id: "2", score: 6, journal: "Feeling okay. Called a friend which lifted my mood.", createdAt: "2026-03-06" },
  { id: "3", score: 5, journal: "Struggled a bit in the morning but got better as the day went on.", createdAt: "2026-03-05" },
  { id: "4", score: 8, journal: "Really good day! Went for a long walk and felt very present.", createdAt: "2026-03-04" },
  { id: "5", score: 7, journal: "", createdAt: "2026-03-03" },
  { id: "6", score: 6, journal: "A bit overwhelmed with tasks.", createdAt: "2026-03-02" },
  { id: "7", score: 9, journal: "Excellent session with Dr. Chen today. Feeling hopeful.", createdAt: "2026-03-01" },
];

export default function CheckinsPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<typeof mockHistory>([]);
  const [moodScore, setMoodScore] = useState(5);
  const [journal, setJournal] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/mood");
        if (res.ok) {
          const data = await res.json();
          setHistory(Array.isArray(data) && data.length > 0 ? data : mockHistory);
        } else {
          setHistory(mockHistory);
        }
      } catch {
        setHistory(mockHistory);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: moodScore, notes: journal }),
      });
    } catch {}
    const newEntry = {
      id: `new-${Date.now()}`,
      score: moodScore,
      journal,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setHistory([newEntry, ...history]);
    setSubmitting(false);
    setSubmitted(true);
    setJournal("");
    setMoodScore(5);
  };

  const last7 = history.slice(0, 7).reverse();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mood Check-In</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Track your emotional wellbeing day by day</p>
      </div>

      {/* Today's Check-in */}
      {submitted ? (
        <Card className="bg-accent/30 border-accent">
          <CardContent className="pt-6 pb-5 text-center">
            <CheckCircle className="size-10 mx-auto text-green-600 mb-2" />
            <h2 className="font-semibold text-foreground">Check-in complete!</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Your mood has been recorded for today.</p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>Check in again</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Mood Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{moodEmojis[moodScore]}</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">{moodScore}</span>
                  <span className="text-muted-foreground text-sm">/10</span>
                  <p className="text-sm text-muted-foreground">{moodLabels[moodScore]}</p>
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={moodScore}
                onChange={(e) => setMoodScore(Number(e.target.value))}
                className="w-full accent-primary h-2 rounded-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>😔 Very Low</span>
                <span>😐 Neutral</span>
                <span>🤩 Excellent</span>
              </div>
            </div>

            {/* Journal */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Journal (optional)</label>
              <Textarea
                placeholder="What's on your mind? How did today go? What are you grateful for?"
                rows={3}
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmit} disabled={submitting} className="w-full">
              {submitting ? "Saving..." : "Submit Check-In"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mood Trend */}
      {!loading && last7.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-4" /> Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-20">
              {last7.map((entry, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={cn("w-full rounded-t transition-all", getMoodColor(entry.score).split(" ")[0])}
                    style={{ height: `${entry.score * 7}px` }}
                    title={`${entry.score}/10`}
                  />
                  <span className="text-xs text-muted-foreground">{entry.score}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Check-Ins</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No check-ins yet. Start tracking your mood above.</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg">
                  <span className="text-2xl">{moodEmojis[entry.score] || "😐"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getMoodColor(entry.score)}`}>
                        {entry.score}/10
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    {entry.journal && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.journal}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
