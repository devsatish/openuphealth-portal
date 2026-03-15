import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface Appointment {
  id: string;
  therapistName: string;
  startsAt: string;
  status: "scheduled" | "completed" | "cancelled";
  modality: string;
  durationMin: number;
}

type BadgeVariant = "default" | "success" | "danger" | "secondary" | "warning";

const statusVariant: Record<string, BadgeVariant> = {
  scheduled: "default",
  completed: "success",
  cancelled: "danger",
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };
}

export function AppointmentsScreen({ navigation }: { navigation: any }) {
  const { data, isLoading, error, refetch } = useQuery<Appointment[]>("/appointments");

  const upcoming = (data ?? []).filter((a) => a.status === "scheduled");
  const past = (data ?? []).filter((a) => a.status !== "scheduled");

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const renderItem = ({ item }: { item: Appointment }) => {
    const { date, time } = formatDateTime(item.startsAt);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AppointmentDetail", { id: item.id })}
        activeOpacity={0.85}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.therapistName}>{item.therapistName}</Text>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{time} · {item.durationMin} min</Text>
        </View>
        <View style={styles.cardRight}>
          <Badge variant={statusVariant[item.status] ?? "secondary"}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
          <View style={styles.modalityBadge}>
            <Text style={styles.modalityText}>{item.modality}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={[...upcoming, ...past]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListHeaderComponent={
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Appointments</Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate("Match")}
              activeOpacity={0.8}
            >
              <Text style={styles.bookButtonText}>+ Book</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="📅"
            title="No appointments yet"
            description="Book your first session with a therapist."
            actionLabel="Find a Therapist"
            onAction={() => navigation.navigate("Match")}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  pageTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.md,
  },
  bookButtonText: { color: "#fff", fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardLeft: { flex: 1 },
  therapistName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.foreground },
  date: { fontSize: fontSize.sm, color: colors.mutedForeground, marginTop: 2 },
  time: { fontSize: fontSize.sm, color: colors.mutedForeground, marginTop: 1 },
  cardRight: { alignItems: "flex-end", gap: spacing.xs },
  modalityBadge: {
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.xs + 4,
    paddingVertical: 2,
  },
  modalityText: { fontSize: fontSize.xs, color: colors.mutedForeground },
});
