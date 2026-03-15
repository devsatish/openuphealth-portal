import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

export function CrisisScreen({ navigation }: { navigation: any }) {
  const call = (number: string) => Linking.openURL(`tel:${number}`);
  const sms = (number: string) => Linking.openURL(`sms:${number}`);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow} activeOpacity={0.7}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyTitle}>In Immediate Danger?</Text>
          <TouchableOpacity
            style={styles.call911Button}
            onPress={() => call("911")}
            activeOpacity={0.85}
          >
            <Text style={styles.call911Text}>CALL 911</Text>
          </TouchableOpacity>
          <Text style={styles.emergencyNote}>
            For life-threatening emergencies, always call 911 first.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Crisis Resources</Text>

        {/* 988 Lifeline */}
        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => call("988")}
          activeOpacity={0.85}
        >
          <View style={styles.resourceHeader}>
            <Text style={styles.resourceEmoji}>📞</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.resourceName}>988 Suicide & Crisis Lifeline</Text>
              <Text style={styles.resourceNumber}>Call or text 988</Text>
            </View>
            <Text style={styles.callIndicator}>Call →</Text>
          </View>
          <Text style={styles.resourceDesc}>
            Free, confidential support 24/7 for people in distress, suicidal crisis, or emotional
            distress. Available in English and Spanish.
          </Text>
        </TouchableOpacity>

        {/* Crisis Text Line */}
        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => sms("741741")}
          activeOpacity={0.85}
        >
          <View style={styles.resourceHeader}>
            <Text style={styles.resourceEmoji}>💬</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.resourceName}>Crisis Text Line</Text>
              <Text style={styles.resourceNumber}>Text HOME to 741741</Text>
            </View>
            <Text style={styles.callIndicator}>Text →</Text>
          </View>
          <Text style={styles.resourceDesc}>
            Free crisis counseling available via text message, 24/7. Text HOME to 741741.
          </Text>
        </TouchableOpacity>

        {/* SAMHSA */}
        <TouchableOpacity
          style={styles.resourceCard}
          onPress={() => call("18006624357")}
          activeOpacity={0.85}
        >
          <View style={styles.resourceHeader}>
            <Text style={styles.resourceEmoji}>🏥</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.resourceName}>SAMHSA National Helpline</Text>
              <Text style={styles.resourceNumber}>1-800-662-4357</Text>
            </View>
            <Text style={styles.callIndicator}>Call →</Text>
          </View>
          <Text style={styles.resourceDesc}>
            Free, confidential, 24/7 treatment referral and information service for substance use
            and mental health disorders.
          </Text>
        </TouchableOpacity>

        {/* Calm message */}
        <View style={styles.calmBox}>
          <Text style={styles.calmEmoji}>💙</Text>
          <Text style={styles.calmTitle}>You Are Not Alone</Text>
          <Text style={styles.calmText}>
            OpenUpHealth connects you with licensed therapists, but we are not a crisis service.
            If you are experiencing a mental health emergency, please use one of the resources
            above or go to your nearest emergency room.{"\n\n"}
            Your well-being matters. Help is available right now.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.backToDashboard}
          onPress={() => navigation.navigate("Dashboard")}
          activeOpacity={0.8}
        >
          <Text style={styles.backToDashboardText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  backRow: { marginBottom: spacing.md },
  backText: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  emergencyBanner: {
    backgroundColor: "#DC2626",
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emergencyIcon: { fontSize: 40, marginBottom: spacing.sm },
  emergencyTitle: {
    color: "#fff",
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.md,
  },
  call911Button: {
    backgroundColor: "#fff",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  call911Text: { color: "#DC2626", fontSize: fontSize.xl, fontWeight: fontWeight.bold },
  emergencyNote: { color: "rgba(255,255,255,0.85)", fontSize: fontSize.sm, textAlign: "center" },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.md,
  },
  resourceCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  resourceHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  resourceEmoji: { fontSize: 24 },
  resourceName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.foreground },
  resourceNumber: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  callIndicator: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
  resourceDesc: { fontSize: fontSize.sm, color: colors.mutedForeground, lineHeight: 20 },
  calmBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  calmEmoji: { fontSize: 40, marginBottom: spacing.sm },
  calmTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: "#1E40AF", marginBottom: spacing.sm },
  calmText: { fontSize: fontSize.md, color: "#1E3A8A", lineHeight: 24, textAlign: "center" },
  backToDashboard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  backToDashboardText: { fontSize: fontSize.md, color: colors.primary, fontWeight: fontWeight.semibold },
});
