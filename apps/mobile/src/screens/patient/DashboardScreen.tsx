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
import { CrisisBanner } from "../../components/CrisisBanner";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface Appointment {
  id: string;
  therapistName: string;
  startsAt: string;
  status: "scheduled" | "completed" | "cancelled";
  modality?: string;
}

interface DashboardData {
  appointments: Appointment[];
  moodStreak: number;
  totalSessions: number;
}

export function DashboardScreen({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useQuery<DashboardData>("/dashboard");

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const upcomingAppts = data?.appointments
    ?.filter((a) => a.status === "scheduled")
    .slice(0, 2) ?? [];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting()}, {user?.name?.split(" ")[0] ?? "there"} 👋
          </Text>
          <Text style={styles.subGreeting}>How are you feeling today?</Text>
        </View>

        <CrisisBanner />

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{upcomingAppts.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data?.moodStreak ?? 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{data?.totalSessions ?? 0}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <Card style={styles.sectionCard}>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingSpinner size="small" />
            ) : upcomingAppts.length === 0 ? (
              <View style={styles.emptyAppt}>
                <Text style={styles.emptyText}>No upcoming appointments</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Appointments")}
                  style={styles.bookLink}
                >
                  <Text style={styles.bookLinkText}>Book a session →</Text>
                </TouchableOpacity>
              </View>
            ) : (
              upcomingAppts.map((appt) => (
                <TouchableOpacity
                  key={appt.id}
                  style={styles.apptRow}
                  onPress={() => navigation.navigate("AppointmentDetail", { id: appt.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.apptIcon}>
                    <Text style={{ fontSize: 20 }}>📅</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.apptName}>{appt.therapistName}</Text>
                    <Text style={styles.apptDate}>
                      {formatDate(appt.startsAt)} · {formatTime(appt.startsAt)}
                    </Text>
                  </View>
                  <Badge variant="default">{appt.modality ?? "Video"}</Badge>
                </TouchableOpacity>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {[
            { icon: "📊", label: "Check In", screen: "Checkins" },
            { icon: "💬", label: "Messages", screen: "Messages" },
            { icon: "📅", label: "Book", screen: "Appointments" },
            { icon: "🆘", label: "Crisis", screen: "Crisis" },
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

        {/* Tip Card */}
        <Card style={styles.tipCard}>
          <CardContent>
            <Text style={styles.tipLabel}>Today's Tip</Text>
            <Text style={styles.tipText}>
              "Taking a few minutes each morning to set an intention can help you feel more
              grounded and present throughout the day."
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.md },
  greeting: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.foreground },
  subGreeting: { fontSize: fontSize.md, color: colors.mutedForeground, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
  sectionCard: { marginBottom: spacing.md },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  emptyAppt: { alignItems: "center", paddingVertical: spacing.md },
  emptyText: { fontSize: fontSize.md, color: colors.mutedForeground },
  bookLink: { marginTop: spacing.xs },
  bookLinkText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  apptRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  apptIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  apptName: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.foreground },
  apptDate: { fontSize: fontSize.sm, color: colors.mutedForeground },
  quickActions: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
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
  tipCard: { backgroundColor: colors.accent, borderColor: "#A7F3D0" },
  tipLabel: { fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: "#065F46", marginBottom: spacing.xs },
  tipText: { fontSize: fontSize.md, color: "#065F46", lineHeight: 22, fontStyle: "italic" },
});
