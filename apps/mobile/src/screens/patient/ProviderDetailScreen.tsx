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
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { Button } from "../../components/ui/Button";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface TherapistDetail {
  id: string;
  name: string;
  credentials: string;
  bio: string;
  specialties: string[];
  modalities: string[];
  languages: string[];
  yearsExperience: number;
  rate: number;
  imageUrl?: string;
}

export function ProviderDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { id } = route.params as { id: string };
  const { data: therapist, isLoading, error, refetch } = useQuery<TherapistDetail>(`/therapists/${id}`);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!therapist) return null;

  const initials = therapist.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header area */}
        <View style={styles.heroSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.name}>{therapist.name}</Text>
          <Text style={styles.credentials}>{therapist.credentials}</Text>
          <Text style={styles.experience}>{therapist.yearsExperience} years of experience</Text>
          <Text style={styles.rate}>${therapist.rate} / session</Text>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{therapist.bio}</Text>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.chipRow}>
            {therapist.specialties.map((s) => (
              <View key={s} style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Modalities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Formats</Text>
          <View style={styles.chipRow}>
            {therapist.modalities.map((m) => (
              <View key={m} style={[styles.chip, styles.modalityChip]}>
                <Text style={styles.modalityChipText}>{m}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.chipRow}>
            {therapist.languages.map((l) => (
              <View key={l} style={styles.chip}>
                <Text style={styles.chipText}>🌐 {l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom padding for sticky button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Sticky Book Button */}
      <View style={styles.stickyFooter}>
        <Button
          onPress={() => navigation.navigate("Appointments")}
          size="lg"
          fullWidth
        >
          Book a Session
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl },
  heroSection: {
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingTop: spacing.xl + 32,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: { color: "#fff", fontSize: 20 },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarInitials: { color: "#fff", fontSize: fontSize.xxl, fontWeight: fontWeight.bold },
  name: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: "#fff", textAlign: "center" },
  credentials: { fontSize: fontSize.md, color: "rgba(255,255,255,0.85)", marginTop: 4 },
  experience: { fontSize: fontSize.sm, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  rate: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.accent, marginTop: spacing.sm },
  section: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
    marginBottom: spacing.xs,
  },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.foreground, marginBottom: spacing.sm },
  bioText: { fontSize: fontSize.md, color: colors.mutedForeground, lineHeight: 24 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    backgroundColor: colors.muted,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
  },
  chipText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  modalityChip: { backgroundColor: colors.secondary },
  modalityChipText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  stickyFooter: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
