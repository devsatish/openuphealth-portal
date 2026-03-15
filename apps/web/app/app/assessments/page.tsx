"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck, ChevronRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const assessmentTypes = [
  {
    id: "PHQ9",
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire",
    description: "A validated 9-item tool for screening and measuring the severity of depression.",
    questions: 9,
    time: "~3 minutes",
  },
  {
    id: "GAD7",
    name: "GAD-7",
    fullName: "Generalized Anxiety Disorder",
    description: "A brief 7-item questionnaire that measures anxiety symptoms and severity.",
    questions: 7,
    time: "~2 minutes",
  },
];

const mockHistory = [
  { id: "1", type: "PHQ-9", score: 8, date: "2026-03-01", interpretation: "Mild", trend: "down" },
  { id: "2", type: "GAD-7", score: 10, date: "2026-03-01", interpretation: "Moderate", trend: "same" },
  { id: "3", type: "PHQ-9", score: 12, date: "2026-02-01", interpretation: "Moderate", trend: "up" },
  { id: "4", type: "GAD-7", score: 10, date: "2026-02-01", interpretation: "Moderate", trend: "same" },
  { id: "5", type: "PHQ-9", score: 15, date: "2026-01-05", interpretation: "Moderately Severe", trend: "up" },
];

const interpretationColors: Record<string, string> = {
  Minimal: "bg-green-100 text-green-800",
  Mild: "bg-yellow-100 text-yellow-800",
  Moderate: "bg-orange-100 text-orange-800",
  "Moderately Severe": "bg-red-100 text-red-800",
  Severe: "bg-red-200 text-red-900",
};

export default function AssessmentsPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<typeof mockHistory>([]);
  const [taking, setTaking] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking slowly, or being fidgety or restless",
    "Thoughts that you would be better off dead or of hurting yourself",
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/assessments");
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

  const startAssessment = (id: string) => {
    setTaking(id);
    setQuestionIndex(0);
    setAnswers([]);
  };

  const answerQuestion = (score: number) => {
    const newAnswers = [...answers, score];
    const totalQs = taking === "PHQ9" ? 9 : 7;
    if (newAnswers.length >= totalQs) {
      const total = newAnswers.reduce((a, b) => a + b, 0);
      const type = taking === "PHQ9" ? "PHQ-9" : "GAD-7";
      const getInterp = (s: number, t: string) => {
        if (t === "PHQ-9") {
          if (s <= 4) return "Minimal"; if (s <= 9) return "Mild"; if (s <= 14) return "Moderate"; if (s <= 19) return "Moderately Severe"; return "Severe";
        } else {
          if (s <= 4) return "Minimal"; if (s <= 9) return "Mild"; if (s <= 14) return "Moderate"; return "Severe";
        }
      };
      const newEntry = {
        id: `new-${Date.now()}`,
        type,
        score: total,
        date: new Date().toISOString().split("T")[0],
        interpretation: getInterp(total, type),
        trend: "same",
      };
      setHistory([newEntry, ...history]);
      setTaking(null);
    } else {
      setAnswers(newAnswers);
      setQuestionIndex(newAnswers.length);
    }
  };

  const scoreOptions = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" },
  ];

  if (taking) {
    const questions = taking === "PHQ9" ? phq9Questions : phq9Questions.slice(0, 7);
    const totalQs = questions.length;
    return (
      <div className="p-6 max-w-xl mx-auto space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Question {questionIndex + 1} of {totalQs}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${((questionIndex + 1) / totalQs) * 100}%` }} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{taking === "PHQ9" ? "PHQ-9" : "GAD-7"} Assessment</CardTitle>
            <CardDescription>Over the last 2 weeks, how often have you been bothered by:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-foreground">{questions[questionIndex]}</p>
            <div className="space-y-2">
              {scoreOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => answerQuestion(opt.value)}
                  className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
                >
                  <span className="font-medium text-foreground">{opt.value}</span>
                  <span className="text-muted-foreground ml-2">— {opt.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full" onClick={() => setTaking(null)}>Cancel Assessment</Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assessments</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Track your mental health with validated screening tools</p>
      </div>

      {/* Available Assessments */}
      <div className="space-y-3">
        {assessmentTypes.map((a) => (
          <Card key={a.id}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <ClipboardCheck className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{a.name}</h3>
                    <p className="text-xs text-muted-foreground">{a.fullName}</p>
                    <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                    <div className="flex gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span>{a.questions} questions</span>
                      <span>·</span>
                      <span>{a.time}</span>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="gap-1 flex-shrink-0" onClick={() => startAssessment(a.id)}>
                  Take <ChevronRight className="size-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Assessment History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No assessments completed yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{entry.type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", interpretationColors[entry.interpretation] || "bg-muted")}>
                      {entry.interpretation}
                    </span>
                    <span className="text-sm font-bold text-foreground w-8 text-right">{entry.score}</span>
                    {entry.trend === "down" && <TrendingDown className="size-4 text-green-600" />}
                    {entry.trend === "up" && <TrendingUp className="size-4 text-red-500" />}
                    {entry.trend === "same" && <Minus className="size-4 text-muted-foreground" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> These assessments are screening tools, not diagnostic instruments. Always discuss your results with your therapist. If you&apos;re experiencing a crisis, call{" "}
            <a href="tel:988" className="text-destructive font-bold hover:underline">988</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
