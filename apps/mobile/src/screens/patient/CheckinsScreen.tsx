import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "../../api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface Checkin {
  id: string;
  mood: number;
  journal?: string;
  createdAt: string;
}

const MOOD_EMOJIS = ["", "😰", "😟", "😕", "😐", "🙂", "😊", "😄", "😁", "🤩", "🥳"];

const MOOD_COLORS = [
  colors.danger,
  colors.danger,
  "#F97316",
  "#F59E0B",
  colors.warning,
  "#84CC16",
  colors.success,
  colors.success,
  "#059669",
  "#047857",
  "#065F46",
];

export function CheckinsScreen() {
  const { data, isLoading, refetch } = useQuery<Checkin[]>("/checkins");
  const { mutate: submitCheckin, isLoading: submitting } = useMutation<Checkin, { mood: number; journal: string }>("/checkins");

  const [mood, setMood] = useState(5);
  const [journal, setJournal] = useState("");

  const handleSubmit = async () => {
    try {
      await submitCheckin({ mood, journal });
      setJournal("");
      setMood(5);
      await refetch();
      Alert.alert("Check-in Saved", "Great job taking care of yourself! 🌟");
    } catch {
      Alert.alert("Error", "Failed to save check-in. Please try again.");
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Mood Check-in</Text>

        {/* Mood Form */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>How are you feeling?</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.moodCenter}>
              <Text style={styles.moodEmoji}>{MOOD_EMOJIS[mood]}</Text>
              <Text style={[styles.moodScore, { color: MOOD_COLORS[mood] }]}>{mood}/10</Text>
            </View>

            {/* Slider */}
            <View style={styles.sliderRow}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    styles.sliderDot,
                    { backgroundColor: v <= mood ? MOOD_COLORS[mood] : colors.border },
                    v === mood && styles.sliderDotActive,
                  ]}
                  onPress={() => setMood(v)}
                  activeOpacity={0.8}
                />
              ))}
            </View>

            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Very Bad</Text>
              <Text style={styles.sliderLabel}>Excellent</Text>
            </View>

            {/* Journal */}
            <Text style={styles.journalLabel}>How's your day going? (optional)</Text>
            <TextInput
              style={styles.journalInput}
              value={journal}
              onChangeText={setJournal}
              placeholder="Write about your thoughts, feelings, or experiences..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Button onPress={handleSubmit} loading={submitting} fullWidth size="lg">
              Save Check-in
            </Button>
          </CardContent>
        </Card>

        {/* Recent Check-ins */}
        <Text style={styles.sectionTitle}>Recent Check-ins</Text>

        {isLoading ? (
          <LoadingSpinner size="small" />
        ) : (
          <>
            {/* Mood Trend */}
            {(data ?? []).length > 0 && (
              <View style={styles.trendRow}>
                {(data ?? []).slice(0, 14).reverse().map((c) => (
                  <View
                    key={c.id}
                    style={[
                      styles.trendBlock,
                      { backgroundColor: MOOD_COLORS[c.mood] ?? colors.muted },
                    ]}
                  >
                    <Text style={styles.trendText}>{c.mood}</Text>
                  </View>
                ))}
              </View>
            )}

            {(data ?? []).map((checkin) => (
              <Card key={checkin.id} style={styles.checkinCard}>
                <CardContent>
                  <View style={styles.checkinRow}>
                    <Text style={styles.checkinEmoji}>{MOOD_EMOJIS[checkin.mood]}</Text>
                    <View style={{ flex: 1 }}>
                      <View style={styles.checkinScoreRow}>
                        <Text style={[styles.checkinScore, { color: MOOD_COLORS[checkin.mood] }]}>
                          Mood: {checkin.mood}/10
                        </Text>
                        <Text style={styles.checkinDate}>{formatDate(checkin.createdAt)}</Text>
                      </View>
                      {checkin.journal ? (
                        <Text style={styles.checkinJournal} numberOfLines={3}>
                          {checkin.journal}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground, marginBottom: spacing.md },
  card: { marginBottom: spacing.lg },
  moodCenter: { alignItems: "center", marginBottom: spacing.md },
  moodEmoji: { fontSize: 56 },
  moodScore: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, marginTop: spacing.xs },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  sliderDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderDotActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sliderLabel: { fontSize: fontSize.xs, color: colors.mutedForeground },
  journalLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  journalInput: {
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.foreground,
    minHeight: 100,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  trendRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: spacing.md,
    flexWrap: "wrap",
  },
  trendBlock: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  trendText: { color: "#fff", fontSize: 10, fontWeight: fontWeight.bold },
  checkinCard: { marginBottom: spacing.sm },
  checkinRow: { flexDirection: "row", gap: spacing.md, alignItems: "flex-start" },
  checkinEmoji: { fontSize: 32 },
  checkinScoreRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  checkinScore: { fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  checkinDate: { fontSize: fontSize.xs, color: colors.mutedForeground },
  checkinJournal: { fontSize: fontSize.sm, color: colors.mutedForeground, marginTop: spacing.xs, lineHeight: 18 },
});
