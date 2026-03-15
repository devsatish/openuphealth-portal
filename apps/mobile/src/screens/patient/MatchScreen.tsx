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
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface MatchedTherapist {
  therapistId: string;
  name: string;
  score: number;
  reasons: string[];
  specialties: string[];
  modality: string;
  yearsExperience: number;
  imageUrl?: string;
}

export function MatchScreen({ navigation }: { navigation: any }) {
  const { data, isLoading, error, refetch } = useQuery<MatchedTherapist[]>("/therapists/match");

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Matches</Text>
        <Text style={styles.subtitle}>Personalized therapist recommendations</Text>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.therapistId}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="No matches yet"
            description="Complete your onboarding to get personalized therapist matches."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Avatar name={item.name} imageUri={item.imageUrl} size="lg" />
              <View style={styles.cardInfo}>
                <Text style={styles.therapistName}>{item.name}</Text>
                <Text style={styles.experience}>{item.yearsExperience} yrs experience</Text>
                <Badge variant="success">{Math.round(item.score * 100)}% match</Badge>
              </View>
            </View>

            {item.reasons.length > 0 && (
              <View style={styles.reasonsRow}>
                {item.reasons.slice(0, 2).map((r, i) => (
                  <View key={i} style={styles.reason}>
                    <Text style={styles.reasonText}>✓ {r}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.specialtiesRow}>
              {item.specialties.slice(0, 3).map((s) => (
                <View key={s} style={styles.specialtyChip}>
                  <Text style={styles.specialtyText}>{s}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardActions}>
              <Button
                onPress={() => navigation.navigate("ProviderDetail", { id: item.therapistId })}
                variant="outline"
                size="sm"
                style={{ flex: 1, marginRight: spacing.sm }}
              >
                View Profile
              </Button>
              <Button
                onPress={() => navigation.navigate("Appointments")}
                size="sm"
                style={{ flex: 1 }}
              >
                Book Session
              </Button>
            </View>
          </View>
        )}
      />
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
  subtitle: { fontSize: fontSize.sm, color: colors.mutedForeground, marginTop: 2 },
  list: { padding: spacing.md, gap: spacing.md },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  cardInfo: { flex: 1, justifyContent: "center", gap: spacing.xs },
  therapistName: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.foreground },
  experience: { fontSize: fontSize.sm, color: colors.mutedForeground },
  reasonsRow: { gap: spacing.xs, marginBottom: spacing.sm },
  reason: {},
  reasonText: { fontSize: fontSize.sm, color: colors.success, fontWeight: fontWeight.medium },
  specialtiesRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md },
  specialtyChip: {
    backgroundColor: colors.muted,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  specialtyText: { fontSize: fontSize.xs, color: colors.mutedForeground },
  cardActions: { flexDirection: "row" },
});
