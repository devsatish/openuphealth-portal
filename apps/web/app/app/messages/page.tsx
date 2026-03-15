"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Plus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const mockThreads = [
  {
    id: "1",
    participantName: "Dr. Emily Chen",
    lastMessage: "See you Thursday at 10am! Let me know if anything comes up.",
    timestamp: "2:34 PM",
    unread: 1,
    messages: [
      { id: "m1", sender: "them", text: "Hi Sarah, how have you been since our last session?", time: "10:02 AM" },
      { id: "m2", sender: "me", text: "Hi Dr. Chen! I've been practicing the breathing exercises you suggested. They really help.", time: "10:15 AM" },
      { id: "m3", sender: "them", text: "That's wonderful to hear! Keep it up. Are you feeling ready for Thursday?", time: "10:18 AM" },
      { id: "m4", sender: "me", text: "Yes, definitely. I have some things I want to discuss.", time: "2:30 PM" },
      { id: "m5", sender: "them", text: "See you Thursday at 10am! Let me know if anything comes up.", time: "2:34 PM" },
    ],
  },
  {
    id: "2",
    participantName: "Care Team",
    lastMessage: "Your insurance has been verified. You're all set!",
    timestamp: "Yesterday",
    unread: 0,
    messages: [
      { id: "m6", sender: "them", text: "Hello! We wanted to let you know that your intake form has been received.", time: "Mon 9:00 AM" },
      { id: "m7", sender: "them", text: "Your insurance has been verified. You're all set!", time: "Mon 2:00 PM" },
    ],
  },
];

export default function MessagesPage() {
  const [threads, setThreads] = useState<typeof mockThreads>([]);
  const [selectedThread, setSelectedThread] = useState<(typeof mockThreads)[0] | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "thread">("list");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/messages");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setThreads(data);
            setSelectedThread(data[0]);
          } else {
            setThreads(mockThreads);
            setSelectedThread(mockThreads[0]);
          }
        } else {
          setThreads(mockThreads);
          setSelectedThread(mockThreads[0]);
        }
      } catch {
        setThreads(mockThreads);
        setSelectedThread(mockThreads[0]);
      }
    };
    load();
  }, []);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedThread) return;
    const msg = { id: `m${Date.now()}`, sender: "me" as const, text: newMessage.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const updated = threads.map((t) =>
      t.id === selectedThread.id
        ? { ...t, messages: [...t.messages, msg], lastMessage: newMessage.trim() }
        : t
    );
    setThreads(updated);
    const updatedThread = updated.find((t) => t.id === selectedThread.id)!;
    setSelectedThread(updatedThread);
    setNewMessage("");
  };

  const handleSelectThread = (thread: (typeof mockThreads)[0]) => {
    setSelectedThread(thread);
    setMobileView("thread");
    // Mark as read
    setThreads((prev) => prev.map((t) => t.id === thread.id ? { ...t, unread: 0 } : t));
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex border border-border rounded-xl overflow-hidden m-4">
      {/* Thread List */}
      <div className={cn(
        "w-72 flex-shrink-0 border-r border-border flex flex-col bg-card",
        "hidden md:flex",
        mobileView === "list" ? "flex w-full md:w-72" : "hidden md:flex"
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Messages</h2>
          <Button size="icon" variant="outline" className="size-8">
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => handleSelectThread(thread)}
              className={cn(
                "w-full flex items-start gap-3 p-4 border-b border-border hover:bg-muted/50 transition-colors text-left",
                selectedThread?.id === thread.id && "bg-primary/5 border-l-2 border-l-primary"
              )}
            >
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarFallback className="bg-secondary text-primary font-semibold text-sm">
                  {thread.participantName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">{thread.participantName}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">{thread.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage}</p>
              </div>
              {thread.unread > 0 && (
                <Badge className="flex-shrink-0 h-5 min-w-5 text-xs">{thread.unread}</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message Thread */}
      <div className={cn(
        "flex-1 flex flex-col bg-background",
        mobileView === "list" ? "hidden md:flex" : "flex"
      )}>
        {selectedThread ? (
          <>
            <div className="p-4 border-b border-border flex items-center gap-3">
              <button onClick={() => setMobileView("list")} className="md:hidden p-1 rounded-md hover:bg-muted">
                <ArrowLeft className="size-5 text-muted-foreground" />
              </button>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-secondary text-primary font-semibold text-sm">
                  {selectedThread.participantName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground text-sm">{selectedThread.participantName}</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selectedThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm",
                      msg.sender === "me"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}
                  >
                    <p>{msg.text}</p>
                    <p className={cn("text-xs mt-1 text-right", msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6">
            <div className="text-muted-foreground">
              <Send className="size-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Select a conversation</p>
              <p className="text-sm">Choose a thread from the left to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
