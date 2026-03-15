"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, X } from "lucide-react";

type ContentType = "Article" | "Exercise" | "Meditation" | "Video";

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  category: string;
  published: boolean;
  created: string;
}

const mockContent: ContentItem[] = [
  { id: "1", title: "Understanding Cognitive Behavioral Therapy", type: "Article", category: "Education", published: true, created: "2026-02-15" },
  { id: "2", title: "5-Minute Breathing Exercise", type: "Exercise", category: "Anxiety", published: true, created: "2026-02-10" },
  { id: "3", title: "Body Scan Meditation", type: "Meditation", category: "Mindfulness", published: true, created: "2026-02-08" },
  { id: "4", title: "Intro to DBT Skills", type: "Video", category: "DBT", published: false, created: "2026-03-01" },
  { id: "5", title: "Grounding Techniques for Anxiety", type: "Exercise", category: "Anxiety", published: true, created: "2026-01-20" },
];

const TYPE_CLASSES: Record<ContentType, string> = {
  Article: "bg-blue-100 text-blue-800",
  Exercise: "bg-green-100 text-green-800",
  Meditation: "bg-purple-100 text-purple-800",
  Video: "bg-orange-100 text-orange-800",
};

export default function ContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", type: "Article" as ContentType, category: "", body: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) { setContent(data); return; }
        }
      } catch { /* fallback */ }
      finally { setContent(mockContent); setLoading(false); }
    };
    load();
  }, []);

  const togglePublished = (id: string) => setContent((prev) => prev.map((c) => c.id === id ? { ...c, published: !c.published } : c));
  const deleteItem = (id: string) => setContent((prev) => prev.filter((c) => c.id !== id));

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const newItem: ContentItem = {
      id: `c${Date.now()}`,
      title: form.title,
      type: form.type,
      category: form.category || "General",
      published: false,
      created: new Date().toISOString().split("T")[0],
    };
    setContent((prev) => [newItem, ...prev]);
    setForm({ title: "", type: "Article", category: "", body: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{content.length} content items</p>
        </div>
        <Button className="gap-1" onClick={() => setShowModal(true)}>
          <Plus className="size-4" /> Create Content
        </Button>
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
                    {["Title", "Type", "Category", "Published", "Created", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {content.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground max-w-[200px]">
                        <span className="truncate block">{item.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${TYPE_CLASSES[item.type]}`}>{item.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{item.category}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublished(item.id)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.published ? "bg-primary" : "bg-muted"}`}>
                          <span className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${item.published ? "translate-x-4" : "translate-x-0.5"}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="text-xs">Edit</Button>
                          <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                            <Trash2 className="size-3.5" />
                          </button>
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

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Create Content</h2>
              <button onClick={() => setShowModal(false)}><X className="size-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="Content title..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ContentType })}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none">
                  {(["Article", "Exercise", "Meditation", "Video"] as ContentType[]).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input placeholder="e.g. Anxiety, CBT..." value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea rows={4} placeholder="Write your content..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleCreate} disabled={!form.title.trim()} className="flex-1">Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
