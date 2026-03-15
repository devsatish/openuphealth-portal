"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Dumbbell, Music, Video, Clock, ChevronRight, Sparkles } from "lucide-react";

const mockContent = [
  { id: "1", title: "Understanding Anxiety: A Beginner's Guide", type: "Article", category: "Anxiety", description: "Learn the science behind anxiety and practical coping strategies you can start using today.", readTime: "8 min read", featured: true },
  { id: "2", title: "5-Minute Morning Breathing Exercise", type: "Exercise", category: "Stress", description: "Start your day grounded with this simple diaphragmatic breathing routine.", readTime: "5 min" },
  { id: "3", title: "Body Scan Meditation for Beginners", type: "Meditation", category: "Mindfulness", description: "A calming 10-minute body scan to release tension and reconnect with your body.", readTime: "10 min" },
  { id: "4", title: "How Sleep Affects Mental Health", type: "Article", category: "Wellness", description: "The connection between sleep quality and emotional regulation is profound. Here's what the research says.", readTime: "6 min read" },
  { id: "5", title: "Grounding Techniques for Panic Attacks", type: "Exercise", category: "Anxiety", description: "The 5-4-3-2-1 technique and other science-backed grounding tools for moments of overwhelm.", readTime: "4 min" },
  { id: "6", title: "Intro to Cognitive Behavioral Therapy", type: "Video", category: "CBT", description: "An approachable overview of how CBT works and why it's so effective for anxiety and depression.", readTime: "12 min" },
  { id: "7", title: "Journaling Prompts for Emotional Processing", type: "Exercise", category: "Self-Esteem", description: "15 powerful prompts to help you explore your emotions, patterns, and growth.", readTime: "7 min" },
  { id: "8", title: "Loving-Kindness Meditation", type: "Meditation", category: "Mindfulness", description: "Cultivate compassion for yourself and others with this classic Buddhist meditation practice.", readTime: "8 min" },
];

const typeIcons: Record<string, React.ReactNode> = {
  Article: <BookOpen className="size-4" />,
  Exercise: <Dumbbell className="size-4" />,
  Meditation: <Music className="size-4" />,
  Video: <Video className="size-4" />,
};

const typeBadgeColors: Record<string, string> = {
  Article: "bg-blue-100 text-blue-800",
  Exercise: "bg-orange-100 text-orange-800",
  Meditation: "bg-purple-100 text-purple-800",
  Video: "bg-red-100 text-red-800",
};

export default function WellnessPage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<typeof mockContent>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/content");
        if (res.ok) {
          const data = await res.json();
          setContent(Array.isArray(data) && data.length > 0 ? data : mockContent);
        } else {
          setContent(mockContent);
        }
      } catch {
        setContent(mockContent);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featured = content.find((c) => c.featured);
  const filterByType = (type: string) => type === "All" ? content : content.filter((c) => c.type === type);

  const ContentCard = ({ item }: { item: (typeof mockContent)[0] }) => (
    <Card className="hover:shadow-md transition-shadow group cursor-pointer">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${typeBadgeColors[item.type] || "bg-muted text-muted-foreground"}`}>
            {typeIcons[item.type]}
            {item.type}
          </span>
          <Badge variant="outline" className="text-xs py-0">{item.category}</Badge>
        </div>
        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3" /> {item.readTime}
          </span>
          <Button size="sm" variant="ghost" className="text-xs gap-1 h-7 px-2 text-primary">
            Read More <ChevronRight className="size-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wellness Library</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Self-guided resources to support your mental health journey</p>
      </div>

      {/* Featured */}
      {!loading && featured && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary border-primary/20">
          <CardContent className="pt-6 pb-5">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-xl">
                <Sparkles className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <Badge className="bg-primary text-primary-foreground text-xs mb-2">Featured Resource</Badge>
                <h2 className="text-lg font-bold text-foreground mb-1">{featured.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">{featured.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" /> {featured.readTime}
                  </span>
                  <Button size="sm" className="gap-1">
                    Read Now <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="All">
        <TabsList>
          {["All", "Articles", "Exercises", "Meditations", "Videos"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
          ))}
        </TabsList>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        ) : (
          <>
            {["All", "Articles", "Exercises", "Meditations", "Videos"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                {filterByType(tab === "Articles" ? "Article" : tab === "Exercises" ? "Exercise" : tab === "Meditations" ? "Meditation" : tab === "Videos" ? "Video" : "All").length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="size-10 mx-auto mb-3 opacity-40" />
                    <p>No content in this category yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterByType(tab === "Articles" ? "Article" : tab === "Exercises" ? "Exercise" : tab === "Meditations" ? "Meditation" : tab === "Videos" ? "Video" : "All").map((item) => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  );
}
