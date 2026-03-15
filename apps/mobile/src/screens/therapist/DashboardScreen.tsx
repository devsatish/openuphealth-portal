import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/AuthContext";
import { useQuery } from "../../api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface TherapistDashboard {
  todayAppointments: {
    id: string;
    patientName: string;
    startsAt: string;
    status: string;
    modality: string;
  }[];
  stats: {
    activeClients: number;
    sessionsTodayCount: number;
    unreadMessages: number;
  };
}

export function TherapistDashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useQuery<TherapistDashboard>("/therapist/dashboard");

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting()}, Dr. {user?.name?.split(" ").slice(-1)[0] ?? "there"}
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: "Active Clients", value: data?.stats.activeClients ?? 0, icon: "👥" },
            { label: "Sessions Today", value: data?.stats.sessionsTodayCount ?? 0, icon: "📅" },
            { label: "Messages", value: data?.stats.unreadMessages ?? 0, icon: "💬" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Today's Schedule */}
        <Card style={styles.card}>
          <CardHeader>
            <View style={styles.cardHeaderRow}>
              <CardTitle>Today's Schedule</CardTitle>
              <TouchableOpacity onPress={() => navigation.navigate("Schedule")} activeOpacity={0.7}>
                <Text style={styles.viewAll}>View all →</Text>
              </TouchableOpacity>
            </View>
          </CardHeader>
          <CardContent>
            {(data?.todayAppointments ?? []).length === 0 ? (
              <View style={styles.emptySchedule}>
                <Text style={styles.emptyIcon}>🌅</Text>
                <Text style={styles.emptyText}>No sessions scheduled for today.</Text>
              </View>
            ) : (
              data?.todayAppointments.map((appt) => (
                <View key={appt.id} style={styles.apptRow}>
                  <View style={styles.apptTime}>
                    <Text style={styles.apptTimeText}>{formatTime(appt.startsAt)}</Text>
                  </View>
                  <View style={styles.apptInfo}>
                    <Avatar name={appt.patientName} size="sm" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.patientName}>{appt.patientName}</Text>
                      <Text style={styles.apptModality}>{appt.modality}</Text>
                    </View>
                    <Badge variant={appt.status === "scheduled" ? "default" : "success"}>
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </Badge>
                  </View>
                </View>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {[
            { icon: "📅", label: "Schedule", screen: "Schedule" },
            { icon: "👥", label: "Clients", screen: "Clients" },
            { icon: "💬", label: "Messages", screen: "Messages" },
            { icon: "⚙️", label: "Profile", screen: "TherapistProfile" },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.md },
  greeting: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.foreground },
  date: { fontSize: fontSize.md, color: colors.mutedForeground, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.mutedForeground, textAlign: "center", marginTop: 2 },
  card: { marginBottom: spacing.md },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  viewAll: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  emptySchedule: { alignItems: "center", paddingVertical: spacing.md },
  emptyIcon: { fontSize: 32, marginBottom: spacing.xs },
  emptyText: { fontSize: fontSize.md, color: colors.mutedForeground },
  apptRow: { marginBottom: spacing.sm },
  apptTime: { marginBottom: spacing.xs },
  apptTimeText: { fontSize: fontSize.xs, color: colors.mutedForeground, fontWeight: fontWeight.semibold },
  apptInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
    padding: spacing.sm,
  },
  patientName: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground },
  apptModality: { fontSize: fontSize.xs, color: colors.mutedForeground },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.foreground, marginBottom: spacing.sm },
  quickActions: { flexDirection: "row", gap: spacing.sm },
  quickAction: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionIcon: { fontSize: 24, marginBottom: spacing.xs },
  quickActionLabel: { fontSize: fontSize.xs, color: colors.foreground, fontWeight: fontWeight.medium },
});
