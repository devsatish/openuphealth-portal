import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "../../api/hooks";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface AppointmentDetail {
  id: string;
  therapistName: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "completed" | "cancelled";
  modality: string;
  durationMin: number;
  notes?: string;
  meetingLink?: string;
}

type BadgeVariant = "default" | "success" | "danger" | "secondary" | "warning";

const statusVariant: Record<string, BadgeVariant> = {
  scheduled: "default",
  completed: "success",
  cancelled: "danger",
};

export function AppointmentDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { id } = route.params as { id: string };
  const { data: appt, isLoading, error, refetch } = useQuery<AppointmentDetail>(`/appointments/${id}`);
  const { mutate: cancelAppt, isLoading: cancelling } = useMutation(`/appointments/${id}/cancel`);
  const [cancelled, setCancelled] = useState(false);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!appt) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const handleCancel = () => {
    Alert.alert("Cancel Appointment", "Are you sure you want to cancel this appointment?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelAppt({});
            setCancelled(true);
            navigation.goBack();
          } catch {
            Alert.alert("Error", "Failed to cancel appointment. Please try again.");
          }
        },
      },
    ]);
  };

  const currentStatus = cancelled ? "cancelled" : appt.status;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow} activeOpacity={0.7}>
          <Text style={styles.backText}>← Appointments</Text>
        </TouchableOpacity>

        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <Badge variant={statusVariant[currentStatus] ?? "secondary"}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </View>

        {/* Main Card */}
        <Card style={styles.mainCard}>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Therapist</Text>
              <Text style={styles.detailValue}>{appt.therapistName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(appt.startsAt)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>
                {formatTime(appt.startsAt)} – {formatTime(appt.endsAt)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{appt.durationMin} minutes</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Format</Text>
              <Text style={styles.detailValue}>{appt.modality}</Text>
            </View>
          </CardContent>
        </Card>

        {/* Session Notes */}
        {appt.notes && (
          <Card style={styles.notesCard}>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Text style={styles.notesText}>{appt.notes}</Text>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {currentStatus === "scheduled" && (
          <View style={styles.actions}>
            <Button
              onPress={() => Alert.alert("Join Session", "Video session joining is not yet available in the mobile app.")}
              variant="primary"
              size="lg"
              fullWidth
              style={styles.actionButton}
            >
              Join Session
            </Button>
            <Button
              onPress={() => Alert.alert("Reschedule", "Please contact your therapist to reschedule.")}
              variant="outline"
              size="lg"
              fullWidth
              style={styles.actionButton}
            >
              Reschedule
            </Button>
            <Button
              onPress={handleCancel}
              variant="danger"
              size="lg"
              fullWidth
              loading={cancelling}
            >
              Cancel Appointment
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  backRow: { marginBottom: spacing.md },
  backText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  statusBanner: { marginBottom: spacing.md },
  mainCard: { marginBottom: spacing.md },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: { fontSize: fontSize.sm, color: colors.mutedForeground },
  detailValue: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground, flex: 1, textAlign: "right" },
  notesCard: { marginBottom: spacing.md },
  notesText: { fontSize: fontSize.md, color: colors.mutedForeground, lineHeight: 22 },
  actions: { gap: spacing.sm },
  actionButton: { marginBottom: 0 },
});
