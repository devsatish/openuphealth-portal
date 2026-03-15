"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, MapPin } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

const mockAppointments: Record<string, { id: string; patientName: string; time: string; modality: string }[]> = {
  Mon: [
    { id: "1", patientName: "Sarah Johnson", time: "10:00 AM", modality: "Virtual" },
    { id: "2", patientName: "Alex Kim", time: "2:00 PM", modality: "In-person" },
  ],
  Tue: [{ id: "3", patientName: "Maria Garcia", time: "11:00 AM", modality: "Virtual" }],
  Wed: [
    { id: "4", patientName: "David Lee", time: "9:00 AM", modality: "Virtual" },
    { id: "5", patientName: "Emma Wilson", time: "3:00 PM", modality: "In-person" },
  ],
  Thu: [{ id: "6", patientName: "James Brown", time: "1:00 PM", modality: "Virtual" }],
  Fri: [{ id: "7", patientName: "Sofia Martinez", time: "10:00 AM", modality: "Virtual" }],
  Sat: [],
  Sun: [],
};

const defaultAvailability: Record<string, string[]> = {
  Mon: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"],
  Tue: ["9:00 AM", "11:00 AM", "1:00 PM"],
  Wed: ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
  Thu: ["10:00 AM", "1:00 PM", "4:00 PM"],
  Fri: ["9:00 AM", "10:00 AM", "11:00 AM"],
  Sat: [],
  Sun: [],
};

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [appointments, setAppointments] = useState(mockAppointments);
  const [availability, setAvailability] = useState(defaultAvailability);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [apptRes, availRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/availability"),
        ]);
        if (apptRes.ok) {
          const data = await apptRes.json();
          if (data && typeof data === "object") setAppointments(data);
        }
        if (availRes.ok) {
          const data = await availRes.json();
          if (data && typeof data === "object") setAvailability(data);
        }
      } catch {
        // use mock
      }
    };
    load();
  }, []);

  const toggleSlot = (slot: string) => {
    setAvailability((prev) => {
      const current = prev[selectedDay] ?? [];
      const next = current.includes(slot) ? current.filter((s) => s !== slot) : [...current, slot];
      return { ...prev, [selectedDay]: next };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });
    } catch {
      // ignore
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const dayAppointments = appointments[selectedDay] ?? [];
  const dayAvailability = availability[selectedDay] ?? [];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your weekly appointments and availability</p>
      </div>

      {/* Day Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedDay === day
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {day}
            {(appointments[day]?.length ?? 0) > 0 && (
              <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                {appointments[day].length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Appointments — {selectedDay}</CardTitle>
          </CardHeader>
          <CardContent>
            {dayAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No appointments on {selectedDay}</p>
            ) : (
              <div className="space-y-2">
                {dayAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{appt.patientName}</p>
                      <p className="text-xs text-muted-foreground">{appt.time}</p>
                    </div>
                    <Badge variant="outline" className="gap-1 text-xs">
                      {appt.modality === "Virtual" ? <Monitor className="size-3" /> : <MapPin className="size-3" />}
                      {appt.modality}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">My Availability — {selectedDay}</CardTitle>
              <Button size="sm" onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-600" : ""}>
                {saved ? "Saved!" : "Update Availability"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isAvailable = dayAvailability.includes(slot);
                return (
                  <label key={slot} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={() => toggleSlot(slot)}
                      className="rounded border-border accent-primary"
                    />
                    <span className="text-sm text-foreground">{slot}</span>
                  </label>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
