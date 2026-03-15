import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface ContentItem {
  id: string;
  title: string;
  category: "article" | "exercise" | "meditation";
  readingTimeMin: number;
  description: string;
  emoji: string;
}

const CATEGORY_TABS = [
  { key: "all", label: "All" },
  { key: "article", label: "📰 Articles" },
  { key: "exercise", label: "🧘 Exercises" },
  { key: "meditation", label: "🌊 Meditations" },
];

export function WellnessScreen() {
  const { data, isLoading, error, refetch } = useQuery<ContentItem[]>("/wellness/content");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = (data ?? []).filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Wellness Library</Text>
        <Text style={styles.subtitle}>Resources for your mental health journey</Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {CATEGORY_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <EmptyState icon="📚" title="No content yet" description="Check back soon for wellness resources." />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <Text style={styles.cardCategory}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardMeta}>{item.readingTimeMin} min read</Text>
            <Text style={styles.cardDesc} numberOfLines={3}>
              {item.description}
            </Text>
          </TouchableOpacity>
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
  tabs: { padding: spacing.md, gap: spacing.xs },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.xl,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  tabActive: { backgroundColor: colors.secondary, borderColor: colors.primary },
  tabText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  tabTextActive: { color: colors.primary, fontWeight: fontWeight.semibold },
  list: { padding: spacing.sm, paddingBottom: spacing.xxl },
  columnWrapper: { gap: spacing.sm, marginBottom: spacing.sm },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardEmoji: { fontSize: 28, marginBottom: spacing.xs },
  cardCategory: {
    fontSize: fontSize.xs,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  cardMeta: { fontSize: fontSize.xs, color: colors.mutedForeground, marginBottom: spacing.xs },
  cardDesc: { fontSize: fontSize.xs, color: colors.mutedForeground, lineHeight: 16 },
});
