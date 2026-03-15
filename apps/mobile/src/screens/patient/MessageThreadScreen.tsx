import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { Avatar } from "../../components/ui/Avatar";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../auth/AuthContext";
import { apiClient } from "../../api/client";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export function MessageThreadScreen({ route, navigation }: { route: any; navigation: any }) {
  const { threadId, participantName } = route.params as {
    threadId: string;
    participantName: string;
  };
  const { user } = useAuth();
  const { data, isLoading, refetch } = useQuery<Message[]>(`/messages/threads/${threadId}`);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const listRef = useRef<FlatList>(null);

  const allMessages = [...(data ?? []), ...localMessages];

  useEffect(() => {
    navigation.setOptions({ title: participantName });
  }, [participantName, navigation]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    setSending(true);
    const optimistic: Message = {
      id: `local_${Date.now()}`,
      senderId: user?.id ?? "",
      senderName: user?.name ?? "",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, optimistic]);
    try {
      await apiClient.post(`/messages/threads/${threadId}`, { content: text });
      await refetch();
      setLocalMessages([]);
    } catch {
      // Keep optimistic message visible but mark error (omitted for simplicity)
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={88}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Avatar name={participantName} size="sm" />
          <Text style={styles.headerName}>{participantName}</Text>
        </View>

        <FlatList
          ref={listRef}
          data={allMessages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isOwn = item.senderId === user?.id;
            return (
              <View style={[styles.messageRow, isOwn && styles.messageRowOwn]}>
                {!isOwn && <Avatar name={item.senderName} size="sm" style={{ marginRight: spacing.xs }} />}
                <View style={[styles.bubble, isOwn && styles.bubbleOwn]}>
                  <Text style={[styles.bubbleText, isOwn && styles.bubbleTextOwn]}>
                    {item.content}
                  </Text>
                  <Text style={[styles.timestamp, isOwn && styles.timestampOwn]}>
                    {formatTime(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <Text style={styles.emptyText}>
                Say hello to {participantName}!
              </Text>
            </View>
          }
        />

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={1000}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!draft.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!draft.trim() || sending}
            activeOpacity={0.8}
          >
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  backButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 20, color: colors.primary },
  headerName: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.foreground },
  messageList: { padding: spacing.md, gap: spacing.sm },
  messageRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: spacing.sm },
  messageRowOwn: { flexDirection: "row-reverse" },
  bubble: {
    maxWidth: "75%",
    backgroundColor: colors.muted,
    borderRadius: radii.lg,
    borderBottomLeftRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radii.lg,
    borderBottomRightRadius: 4,
    marginRight: spacing.xs,
  },
  bubbleText: { fontSize: fontSize.md, color: colors.foreground, lineHeight: 22 },
  bubbleTextOwn: { color: "#fff" },
  timestamp: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 4, textAlign: "right" },
  timestampOwn: { color: "rgba(255,255,255,0.7)" },
  emptyMessages: { flex: 1, alignItems: "center", paddingTop: spacing.xl },
  emptyText: { fontSize: fontSize.md, color: colors.mutedForeground },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.muted,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.foreground,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: { backgroundColor: colors.border },
  sendIcon: { color: "#fff", fontSize: 16 },
});
