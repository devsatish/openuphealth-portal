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
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface Thread {
  id: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  imageUrl?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function MessagesScreen({ navigation }: { navigation: any }) {
  const { data, isLoading, error, refetch } = useQuery<Thread[]>("/messages/threads");

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={styles.composeButton}
          onPress={() => navigation.navigate("ClientsTab")}
          activeOpacity={0.8}
        >
          <Text style={styles.composeIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="💬"
            title="No messages yet"
            description="Conversations with your clients will appear here."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.threadRow}
            onPress={() =>
              navigation.navigate("MessageThread", {
                threadId: item.id,
                participantName: item.participantName,
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.avatarContainer}>
              <Avatar name={item.participantName} imageUri={item.imageUrl} size="md" />
              {item.unreadCount > 0 && (
                <View style={styles.unreadDot}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
            <View style={styles.threadContent}>
              <View style={styles.threadTopRow}>
                <Text style={[styles.participantName, item.unreadCount > 0 && styles.unread]}>
                  {item.participantName}
                </Text>
                <Text style={styles.timestamp}>{timeAgo(item.lastMessageAt)}</Text>
              </View>
              <Text style={styles.role}>{item.participantRole}</Text>
              <Text
                style={[styles.lastMessage, item.unreadCount > 0 && styles.unreadMessage]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>
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
  composeButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  composeIcon: { fontSize: 20 },
  threadRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.card,
    gap: spacing.md,
  },
  avatarContainer: { position: "relative" },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.card,
  },
  unreadText: { color: "#fff", fontSize: 9, fontWeight: fontWeight.bold },
  threadContent: { flex: 1 },
  threadTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  participantName: { fontSize: fontSize.md, color: colors.foreground },
  unread: { fontWeight: fontWeight.bold },
  timestamp: { fontSize: fontSize.xs, color: colors.mutedForeground },
  role: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 1 },
  lastMessage: { fontSize: fontSize.sm, color: colors.mutedForeground, marginTop: 2 },
  unreadMessage: { color: colors.foreground, fontWeight: fontWeight.medium },
  separator: { height: 1, backgroundColor: colors.border },
});
