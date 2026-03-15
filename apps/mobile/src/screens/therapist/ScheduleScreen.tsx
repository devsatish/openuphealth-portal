import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ScheduleEntry {
  id: string;
  patientName?: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "available" | "completed" | "blocked";
  modality?: string;
}

const statusVariant: Record<string, "default" | "success" | "secondary" | "warning"> = {
  scheduled: "default",
  available: "success",
  completed: "secondary",
  blocked: "warning",
};

export function ScheduleScreen({ navigation }: { navigation: any }) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const [selectedDay, setSelectedDay] = useState(dayOfWeek === 0 ? 6 : dayOfWeek - 1);

  const selectedDate = new Date(today);
  selectedDate.setDate(today.getDate() + mondayOffset + selectedDay);
  const dateStr = selectedDate.toISOString().split("T")[0];

  const { data, isLoading, refetch } = useQuery<ScheduleEntry[]>(`/therapist/schedule?date=${dateStr}`);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const dayDates = DAYS.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d.getDate();
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <Text style={styles.month}>
          {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </Text>
      </View>

      {/* Day Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayTabs}
      >
        {DAYS.map((day, idx) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayTab, selectedDay === idx && styles.dayTabActive]}
            onPress={() => setSelectedDay(idx)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dayName, selectedDay === idx && styles.dayNameActive]}>{day}</Text>
            <Text style={[styles.dayDate, selectedDay === idx && styles.dayDateActive]}>
              {dayDates[idx]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="📅"
              title="No sessions"
              description="You have no sessions or availability set for this day."
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.slotCard,
                item.status === "available" && styles.slotAvailable,
                item.status === "blocked" && styles.slotBlocked,
              ]}
              onPress={() => item.patientName && navigation.navigate("ClientDetail", { id: item.id })}
              activeOpacity={item.patientName ? 0.85 : 1}
            >
              <View style={styles.slotTime}>
                <Text style={styles.slotTimeText}>{formatTime(item.startsAt)}</Text>
                <Text style={styles.slotDuration}>—</Text>
                <Text style={styles.slotTimeText}>{formatTime(item.endsAt)}</Text>
              </View>
              <View style={styles.slotInfo}>
                <Text style={styles.slotName}>
                  {item.patientName ?? (item.status === "available" ? "Available" : "Blocked")}
                </Text>
                {item.modality && (
                  <Text style={styles.slotModality}>{item.modality}</Text>
                )}
              </View>
              <Badge variant={statusVariant[item.status] ?? "secondary"}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground },
  month: { fontSize: fontSize.sm, color: colors.mutedForeground },
  dayTabs: { padding: spacing.sm, gap: spacing.xs, backgroundColor: colors.card },
  dayTab: {
    width: 52,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    alignItems: "center",
    backgroundColor: colors.muted,
    marginRight: spacing.xs,
  },
  dayTabActive: { backgroundColor: colors.primary },
  dayName: { fontSize: fontSize.xs, color: colors.mutedForeground, fontWeight: fontWeight.medium },
  dayNameActive: { color: "#fff" },
  dayDate: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.foreground, marginTop: 2 },
  dayDateActive: { color: "#fff" },
  list: { padding: spacing.md, gap: spacing.sm },
  slotCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  slotAvailable: { borderColor: "#A7F3D0", backgroundColor: "#ECFDF5" },
  slotBlocked: { borderColor: colors.border, backgroundColor: colors.muted },
  slotTime: { alignItems: "center", minWidth: 56 },
  slotTimeText: { fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: colors.foreground },
  slotDuration: { color: colors.mutedForeground, fontSize: fontSize.xs },
  slotInfo: { flex: 1 },
  slotName: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.foreground },
  slotModality: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
});
