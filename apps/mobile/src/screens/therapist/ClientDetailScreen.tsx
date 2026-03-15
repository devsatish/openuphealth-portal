import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface ClientDetail {
  id: string;
  name: string;
  email: string;
  goals: string[];
  assessmentScores: { name: string; score: number; date: string }[];
  sessionHistory: {
    id: string;
    date: string;
    status: "completed" | "cancelled";
    notes?: string;
  }[];
  status: string;
}

export function ClientDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { id, name } = route.params as { id: string; name?: string };
  const { data: client, isLoading, error, refetch } = useQuery<ClientDetail>(`/therapist/clients/${id}`);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!client) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow} activeOpacity={0.7}>
          <Text style={styles.backText}>← Clients</Text>
        </TouchableOpacity>

        {/* Patient Header */}
        <View style={styles.patientHeader}>
          <Avatar name={client.name} size="lg" />
          <Text style={styles.patientName}>{client.name}</Text>
          <Text style={styles.patientEmail}>{client.email}</Text>
          <Badge variant={client.status === "active" ? "success" : "secondary"}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            onPress={() =>
              navigation.navigate("TherapistMessages")
            }
            variant="outline"
            size="sm"
            style={{ flex: 1, marginRight: spacing.sm }}
          >
            💬 Message
          </Button>
          <Button
            onPress={() => navigation.navigate("Schedule")}
            size="sm"
            style={{ flex: 1 }}
          >
            📅 Schedule
          </Button>
        </View>

        {/* Goals */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Intake Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {client.goals.length === 0 ? (
              <Text style={styles.emptyText}>No goals recorded.</Text>
            ) : (
              client.goals.map((goal, idx) => (
                <View key={idx} style={styles.goalRow}>
                  <Text style={styles.goalBullet}>•</Text>
                  <Text style={styles.goalText}>{goal}</Text>
                </View>
              ))
            )}
          </CardContent>
        </Card>

        {/* Assessment Scores */}
        {client.assessmentScores.length > 0 && (
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Assessment Scores</CardTitle>
            </CardHeader>
            <CardContent>
              {client.assessmentScores.map((assessment) => (
                <View key={assessment.name} style={styles.assessmentRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.assessmentName}>{assessment.name}</Text>
                    <Text style={styles.assessmentDate}>{formatDate(assessment.date)}</Text>
                  </View>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scoreText}>{assessment.score}</Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Session History */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
          </CardHeader>
          <CardContent>
            {client.sessionHistory.length === 0 ? (
              <Text style={styles.emptyText}>No sessions recorded.</Text>
            ) : (
              client.sessionHistory.map((session) => (
                <View key={session.id} style={styles.sessionRow}>
                  <View style={styles.sessionLeft}>
                    <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                    {session.notes && (
                      <Text style={styles.sessionNotes} numberOfLines={2}>
                        {session.notes}
                      </Text>
                    )}
                  </View>
                  <Badge variant={session.status === "completed" ? "success" : "danger"}>
                    {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                  </Badge>
                </View>
              ))
            )}
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  backRow: { marginBottom: spacing.md },
  backText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  patientHeader: { alignItems: "center", marginBottom: spacing.lg, gap: spacing.xs },
  patientName: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground },
  patientEmail: { fontSize: fontSize.sm, color: colors.mutedForeground },
  actions: { flexDirection: "row", marginBottom: spacing.md },
  card: { marginBottom: spacing.md },
  emptyText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  goalRow: { flexDirection: "row", gap: spacing.sm, paddingVertical: spacing.xs },
  goalBullet: { color: colors.primary, fontWeight: fontWeight.bold, fontSize: fontSize.md },
  goalText: { flex: 1, fontSize: fontSize.md, color: colors.foreground },
  assessmentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  assessmentName: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.foreground },
  assessmentDate: { fontSize: fontSize.xs, color: colors.mutedForeground },
  scoreCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: colors.primary },
  sessionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  sessionLeft: { flex: 1 },
  sessionDate: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground },
  sessionNotes: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
});
