import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "../../api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EmptyState } from "../../components/ui/EmptyState";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

interface BillingData {
  plan: {
    name: string;
    status: "active" | "inactive";
    renewalDate: string;
    amount: number;
  };
  paymentMethods: {
    id: string;
    type: string;
    last4: string;
    expiresAt: string;
    isDefault: boolean;
  }[];
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: "paid" | "pending" | "failed";
    description: string;
  }[];
}

type BadgeVariant = "default" | "success" | "danger" | "secondary" | "warning";

const invoiceVariant: Record<string, BadgeVariant> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

export function BillingScreen() {
  const { data, isLoading, error, refetch } = useQuery<BillingData>("/billing");

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return <EmptyState icon="💳" title="No billing information" />;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Billing</Text>

        {/* Plan Summary */}
        <Card style={styles.card}>
          <CardHeader>
            <View style={styles.planHeader}>
              <CardTitle>Current Plan</CardTitle>
              <Badge variant={data.plan.status === "active" ? "success" : "danger"}>
                {data.plan.status.charAt(0).toUpperCase() + data.plan.status.slice(1)}
              </Badge>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.planName}>{data.plan.name}</Text>
            <View style={styles.planDetails}>
              <View style={styles.planDetail}>
                <Text style={styles.detailLabel}>Monthly Cost</Text>
                <Text style={styles.detailValue}>${data.plan.amount}/mo</Text>
              </View>
              <View style={styles.planDetail}>
                <Text style={styles.detailLabel}>Next Renewal</Text>
                <Text style={styles.detailValue}>{formatDate(data.plan.renewalDate)}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            {data.paymentMethods.length === 0 ? (
              <Text style={styles.emptyText}>No payment methods on file.</Text>
            ) : (
              data.paymentMethods.map((pm) => (
                <View key={pm.id} style={styles.paymentRow}>
                  <Text style={styles.paymentIcon}>
                    {pm.type === "visa" ? "💳" : pm.type === "mastercard" ? "💳" : "💳"}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.paymentLabel}>
                      {pm.type.charAt(0).toUpperCase() + pm.type.slice(1)} •••• {pm.last4}
                    </Text>
                    <Text style={styles.paymentExpiry}>Expires {pm.expiresAt}</Text>
                  </View>
                  {pm.isDefault && <Badge variant="secondary">Default</Badge>}
                </View>
              ))
            )}
            <Button
              onPress={() => {}}
              variant="outline"
              size="sm"
              fullWidth
              style={{ marginTop: spacing.md }}
            >
              + Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
          </CardHeader>
          <CardContent>
            {data.invoices.length === 0 ? (
              <Text style={styles.emptyText}>No invoices yet.</Text>
            ) : (
              data.invoices.map((inv) => (
                <TouchableOpacity key={inv.id} style={styles.invoiceRow} activeOpacity={0.8}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invoiceDesc}>{inv.description}</Text>
                    <Text style={styles.invoiceDate}>{formatDate(inv.date)}</Text>
                  </View>
                  <View style={styles.invoiceRight}>
                    <Text style={styles.invoiceAmount}>${inv.amount}</Text>
                    <Badge variant={invoiceVariant[inv.status] ?? "secondary"}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </Badge>
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  card: { marginBottom: spacing.md },
  planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planName: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: colors.foreground, marginBottom: spacing.md },
  planDetails: { flexDirection: "row", gap: spacing.md },
  planDetail: { flex: 1 },
  detailLabel: { fontSize: fontSize.xs, color: colors.mutedForeground },
  detailValue: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.foreground, marginTop: 2 },
  emptyText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  paymentIcon: { fontSize: 24 },
  paymentLabel: { fontSize: fontSize.md, color: colors.foreground },
  paymentExpiry: { fontSize: fontSize.xs, color: colors.mutedForeground },
  invoiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  invoiceDesc: { fontSize: fontSize.sm, color: colors.foreground, fontWeight: fontWeight.medium },
  invoiceDate: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
  invoiceRight: { alignItems: "flex-end", gap: spacing.xs },
  invoiceAmount: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: colors.foreground },
});
