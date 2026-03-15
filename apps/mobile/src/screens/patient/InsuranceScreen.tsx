import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";
import type { InsuranceVerificationStatus } from "@openup/types";

interface InsuranceData {
  carrier: string;
  memberId: string;
  groupNumber?: string;
  verificationStatus: InsuranceVerificationStatus;
  verificationMessage?: string;
}

type BadgeVariant = "default" | "success" | "danger" | "secondary" | "warning";

const statusVariant: Record<InsuranceVerificationStatus, BadgeVariant> = {
  pending: "warning",
  verified: "success",
  rejected: "danger",
  needs_info: "warning",
};

const statusMessage: Record<InsuranceVerificationStatus, string> = {
  pending: "We are verifying your insurance. This typically takes 1–2 business days.",
  verified: "Your insurance has been verified. You are covered for in-network sessions.",
  rejected: "Your insurance could not be verified. Please check your details or contact support.",
  needs_info: "Additional information is needed to verify your insurance. Please update your details.",
};

export function InsuranceScreen() {
  const { data, isLoading, error, refetch } = useQuery<InsuranceData>("/insurance");
  const [isEditing, setIsEditing] = useState(false);
  const [carrier, setCarrier] = useState("");
  const [memberId, setMemberId] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [saving, setSaving] = useState(false);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const startEdit = () => {
    setCarrier(data?.carrier ?? "");
    setMemberId(data?.memberId ?? "");
    setGroupNumber(data?.groupNumber ?? "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:3000/api/insurance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrier, memberId, groupNumber }),
      });
      if (!res.ok) throw new Error("Save failed");
      await refetch();
      setIsEditing(false);
      Alert.alert("Saved", "Insurance information updated.");
    } catch {
      Alert.alert("Error", "Failed to save insurance info.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Insurance</Text>

        {/* Insurance Card Display */}
        {data && (
          <View style={styles.insuranceCard}>
            <View style={styles.cardBrand}>
              <Text style={styles.cardLogo}>🏥</Text>
              <Text style={styles.cardBrandName}>OpenUpHealth</Text>
            </View>
            <Text style={styles.carrierName}>{data.carrier || "No carrier on file"}</Text>
            <View style={styles.cardRow}>
              <View>
                <Text style={styles.cardFieldLabel}>Member ID</Text>
                <Text style={styles.cardFieldValue}>{data.memberId || "—"}</Text>
              </View>
              {data.groupNumber && (
                <View>
                  <Text style={styles.cardFieldLabel}>Group #</Text>
                  <Text style={styles.cardFieldValue}>{data.groupNumber}</Text>
                </View>
              )}
            </View>
            <View style={styles.verificationRow}>
              <Badge variant={statusVariant[data.verificationStatus]}>
                {data.verificationStatus.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </Badge>
            </View>
          </View>
        )}

        {/* Verification Status */}
        {data && (
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={styles.statusIcon}>
                <Text style={{ fontSize: 32 }}>
                  {data.verificationStatus === "verified"
                    ? "✅"
                    : data.verificationStatus === "rejected"
                    ? "❌"
                    : "⏳"}
                </Text>
              </View>
              <Text style={styles.statusMessage}>
                {statusMessage[data.verificationStatus]}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Edit Section */}
        <Card style={styles.card}>
          <CardHeader>
            <View style={styles.editHeader}>
              <CardTitle>Insurance Details</CardTitle>
              {!isEditing && (
                <TouchableOpacity onPress={startEdit} activeOpacity={0.7}>
                  <Text style={styles.editLink}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <>
                <Input label="Insurance Carrier" value={carrier} onChangeText={setCarrier} placeholder="e.g. Aetna" />
                <Input label="Member ID" value={memberId} onChangeText={setMemberId} placeholder="Member ID" />
                <Input label="Group Number (optional)" value={groupNumber} onChangeText={setGroupNumber} placeholder="Group number" />
                <View style={styles.editActions}>
                  <Button onPress={() => setIsEditing(false)} variant="outline" size="sm" style={{ flex: 1, marginRight: spacing.sm }}>
                    Cancel
                  </Button>
                  <Button onPress={handleSave} loading={saving} size="sm" style={{ flex: 1 }}>
                    Save
                  </Button>
                </View>
              </>
            ) : (
              <View style={styles.readonlyFields}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Carrier</Text>
                  <Text style={styles.fieldValue}>{data?.carrier || "Not provided"}</Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Member ID</Text>
                  <Text style={styles.fieldValue}>{data?.memberId || "Not provided"}</Text>
                </View>
                {data?.groupNumber && (
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Group Number</Text>
                    <Text style={styles.fieldValue}>{data.groupNumber}</Text>
                  </View>
                )}
              </View>
            )}
          </CardContent>
        </Card>

        {/* Upload Card */}
        <Card style={styles.card}>
          <CardContent>
            <Button
              onPress={() => Alert.alert("Upload Insurance Card", "Image picker will be available in a future update.")}
              variant="outline"
              fullWidth
              size="md"
            >
              📷 Upload Insurance Card Photo
            </Button>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  pageTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground, marginBottom: spacing.md },
  insuranceCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardBrand: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.md },
  cardLogo: { fontSize: 20 },
  cardBrandName: { color: "rgba(255,255,255,0.8)", fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  carrierName: { color: "#fff", fontSize: fontSize.xl, fontWeight: fontWeight.bold, marginBottom: spacing.md },
  cardRow: { flexDirection: "row", gap: spacing.xl, marginBottom: spacing.md },
  cardFieldLabel: { color: "rgba(255,255,255,0.7)", fontSize: fontSize.xs },
  cardFieldValue: { color: "#fff", fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginTop: 2 },
  verificationRow: { alignItems: "flex-start" },
  card: { marginBottom: spacing.md },
  statusIcon: { alignItems: "center", marginBottom: spacing.sm },
  statusMessage: { fontSize: fontSize.md, color: colors.mutedForeground, textAlign: "center", lineHeight: 22 },
  editHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  editLink: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.medium },
  editActions: { flexDirection: "row" },
  readonlyFields: { gap: spacing.sm },
  field: {},
  fieldLabel: { fontSize: fontSize.xs, color: colors.mutedForeground },
  fieldValue: { fontSize: fontSize.md, color: colors.foreground, fontWeight: fontWeight.medium, marginTop: 2 },
});
