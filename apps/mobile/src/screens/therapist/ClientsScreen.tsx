import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
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

interface Client {
  id: string;
  name: string;
  email: string;
  lastSession?: string;
  status: "active" | "inactive" | "new";
  imageUrl?: string;
}

type BadgeVariant = "default" | "success" | "secondary" | "warning";

const clientStatusVariant: Record<string, BadgeVariant> = {
  active: "success",
  inactive: "secondary",
  new: "default",
};

export function ClientsScreen({ navigation }: { navigation: any }) {
  const { data, isLoading, error, refetch } = useQuery<Client[]>("/therapist/clients");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      (data ?? []).filter(
        (c) =>
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const formatDate = (iso?: string) => {
    if (!iso) return "No sessions yet";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Clients</Text>
        <Text style={styles.count}>{(data ?? []).length} total</Text>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search clients..."
          placeholderTextColor={colors.mutedForeground}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="👥"
            title="No clients found"
            description={search ? "Try a different search term." : "You have no active clients yet."}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.clientRow}
            onPress={() => navigation.navigate("ClientDetail", { id: item.id, name: item.name })}
            activeOpacity={0.85}
          >
            <Avatar name={item.name} imageUri={item.imageUrl} size="md" />
            <View style={styles.clientInfo}>
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.lastSession}>Last session: {formatDate(item.lastSession)}</Text>
            </View>
            <Badge variant={clientStatusVariant[item.status] ?? "secondary"}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground },
  count: { fontSize: fontSize.sm, color: colors.mutedForeground },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    margin: spacing.md,
    marginBottom: 0,
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
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
  },
  clientInfo: { flex: 1 },
  clientName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.foreground },
  lastSession: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
  separator: { height: 1, backgroundColor: colors.border },
});
