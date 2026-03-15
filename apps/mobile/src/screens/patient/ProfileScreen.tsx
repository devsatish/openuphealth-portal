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
import { Separator } from "../../components/ui/Separator";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface SettingItem {
  icon: string;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export function ProfileScreen({ navigation }: { navigation: any }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const sections: { title: string; items: SettingItem[] }[] = [
    {
      title: "Account",
      items: [
        {
          icon: "✏️",
          label: "Edit Profile",
          onPress: () => Alert.alert("Edit Profile", "Profile editing coming soon."),
        },
        {
          icon: "🔔",
          label: "Notifications",
          onPress: () => Alert.alert("Notifications", "Notification settings coming soon."),
        },
      ],
    },
    {
      title: "Security & Privacy",
      items: [
        {
          icon: "🔐",
          label: "Security",
          onPress: () => Alert.alert("Security", "Security settings coming soon."),
        },
        {
          icon: "🛡️",
          label: "Privacy",
          onPress: () => Alert.alert("Privacy", "Privacy settings coming soon."),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: "❓",
          label: "Help & FAQ",
          onPress: () => Alert.alert("Help", "Help center coming soon."),
        },
        {
          icon: "📋",
          label: "Terms & Privacy Policy",
          onPress: () => Alert.alert("Terms", "Please visit our website for terms."),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Header */}
        <View style={styles.userHeader}>
          <Avatar name={user?.name} size="lg" />
          <Text style={styles.userName}>{user?.name ?? "Unknown User"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === "patient" ? "🙋 Patient" : "🩺 Therapist"}
            </Text>
          </View>
        </View>

        {/* Settings Sections */}
        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card>
              <CardContent style={{ padding: 0 }}>
                {section.items.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    <TouchableOpacity
                      style={styles.settingRow}
                      onPress={item.onPress}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.settingIcon}>{item.icon}</Text>
                      <Text style={[styles.settingLabel, item.destructive && styles.destructiveText]}>
                        {item.label}
                      </Text>
                      <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                    {idx < section.items.length - 1 && (
                      <View style={styles.rowDivider} />
                    )}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </View>
        ))}

        {/* Log Out */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutText}>🚪 Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>OpenUpHealth v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  userHeader: { alignItems: "center", marginBottom: spacing.lg, paddingVertical: spacing.md },
  userName: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground, marginTop: spacing.md },
  userEmail: { fontSize: fontSize.sm, color: colors.mutedForeground, marginTop: spacing.xs },
  roleBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.xl,
  },
  roleText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  section: { marginBottom: spacing.md },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  settingIcon: { fontSize: 18, marginRight: spacing.md, width: 24 },
  settingLabel: { flex: 1, fontSize: fontSize.md, color: colors.foreground },
  destructiveText: { color: colors.danger },
  chevron: { fontSize: 20, color: colors.mutedForeground },
  rowDivider: { height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 24 + spacing.md },
  logoutSection: { marginTop: spacing.md, marginBottom: spacing.md },
  logoutButton: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.md,
    alignItems: "center",
  },
  logoutText: { fontSize: fontSize.md, color: colors.danger, fontWeight: fontWeight.semibold },
  version: { textAlign: "center", fontSize: fontSize.xs, color: colors.mutedForeground },
});
