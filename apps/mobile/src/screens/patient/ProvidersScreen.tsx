import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface Therapist {
  id: string;
  name: string;
  specialties: string[];
  modality: string;
  rate: number;
  languages: string[];
  imageUrl?: string;
  yearsExperience: number;
}

const SPECIALTY_FILTERS = ["All", "Anxiety", "Depression", "Trauma", "CBT", "DBT", "Mindfulness"];
const LANGUAGE_FILTERS = ["All", "English", "Spanish", "Mandarin", "French"];

export function ProvidersScreen({ navigation }: { navigation: any }) {
  const { data, isLoading, error, refetch } = useQuery<Therapist[]>("/therapists");
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((t) => {
      const matchesSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesSpecialty =
        selectedSpecialty === "All" ||
        t.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
      const matchesLanguage =
        selectedLanguage === "All" ||
        t.languages.some((l) => l.toLowerCase().includes(selectedLanguage.toLowerCase()));
      return matchesSearch && matchesSpecialty && matchesLanguage;
    });
  }, [data, search, selectedSpecialty, selectedLanguage]);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search therapists..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Specialty Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {SPECIALTY_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, selectedSpecialty === f && styles.filterChipActive]}
            onPress={() => setSelectedSpecialty(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, selectedSpecialty === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
        {LANGUAGE_FILTERS.filter((l) => l !== "All").map((l) => (
          <TouchableOpacity
            key={`lang_${l}`}
            style={[styles.filterChip, selectedLanguage === l && styles.filterChipActive]}
            onPress={() => setSelectedLanguage(selectedLanguage === l ? "All" : l)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, selectedLanguage === l && styles.filterTextActive]}>
              🌐 {l}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="👩‍⚕️"
            title="No providers found"
            description="Try adjusting your search or filters."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Avatar name={item.name} imageUri={item.imageUrl} size="lg" />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.modality}>{item.modality} · {item.yearsExperience} yrs</Text>
                <Text style={styles.rate}>${item.rate}/session</Text>
              </View>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => navigation.navigate("ProviderDetail", { id: item.id })}
                activeOpacity={0.8}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.specialtiesRow}>
              {item.specialties.slice(0, 3).map((s) => (
                <View key={s} style={styles.chip}>
                  <Text style={styles.chipText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    margin: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.xs },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: fontSize.md,
    color: colors.foreground,
  },
  filterRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.xs },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.xl,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  filterChipActive: { backgroundColor: colors.secondary, borderColor: colors.primary },
  filterText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  filterTextActive: { color: colors.primary, fontWeight: fontWeight.semibold },
  list: { padding: spacing.md, gap: spacing.sm },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm },
  info: { flex: 1 },
  name: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.foreground },
  modality: { fontSize: fontSize.sm, color: colors.mutedForeground },
  rate: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  viewButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.md,
  },
  viewButtonText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
  specialtiesRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    backgroundColor: colors.muted,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  chipText: { fontSize: fontSize.xs, color: colors.mutedForeground },
});
