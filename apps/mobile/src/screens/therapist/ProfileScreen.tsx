import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../auth/AuthContext";
import { Avatar } from "../../components/ui/Avatar";
import { Card, CardContent } from "../../components/ui/Card";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

const mockSpecialties = ["Anxiety", "Depression", "Trauma/PTSD", "CBT", "DBT"];
const mockBio = "Licensed clinical social worker specializing in anxiety and trauma-informed care. Over 8 years of experience helping individuals build resilience and coping skills.";
const mockCredentials = "LCSW, EMDR Certified";

interface SettingItem {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export function TherapistProfileScreen({ navigation }: { navigation: any }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout },
    ]);
  };

  const settings: SettingItem[] = [
    { icon: "✏️", label: "Edit Profile", onPress: () => Alert.alert("Edit Profile", "Profile editing coming soon.") },
    { icon: "📅", label: "Availability", onPress: () => navigation.navigate("ScheduleTab") },
    { icon: "🛡️", label: "Compliance", onPress: () => Alert.alert("Compliance", "Compliance section coming soon.") },
    { icon: "🔔", label: "Notifications", onPress: () => Alert.alert("Notifications", "Notification settings coming soon.") },
    { icon: "❓", label: "Help & Support", onPress: () => Alert.alert("Help", "Help center coming soon.") },
  ];

  const displayName = user?.name ?? "Dr. Emily Chen";
  const initials = displayName.replace("Dr. ", "").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.credentials}>{mockCredentials}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: "Active Clients", value: "24" },
            { label: "This Week", value: "11 sessions" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Bio */}
        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{mockBio}</Text>
          </CardContent>
        </Card>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Specialties</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {mockSpecialties.map((s) => (
              <View key={s} style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Settings */}
        <Card style={styles.card}>
          <CardContent style={{ padding: 0 }}>
            {settings.map((item, idx) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity style={styles.settingRow} onPress={item.onPress} activeOpacity={0.8}>
                  <Text style={styles.settingIcon}>{item.icon}</Text>
                  <Text style={[styles.settingLabel, item.destructive && { color: colors.danger }]}>{item.label}</Text>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
                {idx < settings.length - 1 && <View style={styles.rowDivider} />}
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>🚪 Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>OpenUpHealth v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  avatarSection: { alignItems: "center", marginBottom: spacing.lg, paddingTop: spacing.md },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarInitials: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.primary },
  name: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground },
  credentials: { fontSize: fontSize.sm, color: colors.mutedForeground, marginTop: spacing.xs },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: colors.primary },
  statLabel: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: spacing.xs, textAlign: "center" },
  card: { marginBottom: spacing.md },
  section: { marginBottom: spacing.md },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  bioText: { fontSize: fontSize.sm, color: colors.foreground, lineHeight: 20 },
  chipsRow: { flexDirection: "row", gap: spacing.sm, paddingRight: spacing.md },
  chip: {
    backgroundColor: colors.secondary,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  settingIcon: { fontSize: 18, marginRight: spacing.md, width: 24 },
  settingLabel: { flex: 1, fontSize: fontSize.md, color: colors.foreground },
  chevron: { fontSize: 20, color: colors.mutedForeground },
  rowDivider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 24 + spacing.md },
  logoutButton: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  logoutText: { fontSize: fontSize.md, color: colors.danger, fontWeight: fontWeight.semibold },
  version: { textAlign: "center", fontSize: fontSize.xs, color: colors.mutedForeground },
});
