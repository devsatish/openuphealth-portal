import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors, spacing, radii, fontSize, fontWeight } from "../../theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  onPress,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`size_${size}`] as ViewStyle,
    styles[`variant_${variant}`] as ViewStyle,
    fullWidth ? styles.fullWidth : {},
    isDisabled ? styles.disabled : {},
    style || {},
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${size}`] as TextStyle,
    styles[`textVariant_${variant}`] as TextStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={containerStyle}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? colors.primary : colors.primaryForeground}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: fontWeight.semibold,
  },

  // Sizes
  size_sm: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs + 2, minHeight: 32 },
  size_md: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2, minHeight: 44 },
  size_lg: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md - 2, minHeight: 52 },

  text_sm: { fontSize: fontSize.sm },
  text_md: { fontSize: fontSize.md },
  text_lg: { fontSize: fontSize.lg },

  // Variants
  variant_primary: { backgroundColor: colors.primary },
  variant_secondary: { backgroundColor: colors.secondary },
  variant_outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variant_ghost: { backgroundColor: "transparent" },
  variant_danger: { backgroundColor: colors.danger },

  textVariant_primary: { color: colors.primaryForeground },
  textVariant_secondary: { color: colors.primary },
  textVariant_outline: { color: colors.primary },
  textVariant_ghost: { color: colors.primary },
  textVariant_danger: { color: colors.primaryForeground },
});
