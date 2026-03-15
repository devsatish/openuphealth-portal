import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, radii, fontSize, fontWeight } from "../../theme";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "secondary";

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ children, variant = "default", style }: BadgeProps) {
  return (
    <View style={[styles.base, styles[`variant_${variant}`] as ViewStyle, style]}>
      <Text style={[styles.text, styles[`text_${variant}`] as object]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.xl,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  variant_default: { backgroundColor: colors.secondary },
  variant_success: { backgroundColor: "#D1FAE5" },
  variant_warning: { backgroundColor: "#FEF3C7" },
  variant_danger: { backgroundColor: "#FEE2E2" },
  variant_secondary: { backgroundColor: colors.muted },

  text_default: { color: colors.primary },
  text_success: { color: "#065F46" },
  text_warning: { color: "#92400E" },
  text_danger: { color: "#991B1B" },
  text_secondary: { color: colors.mutedForeground },
});
