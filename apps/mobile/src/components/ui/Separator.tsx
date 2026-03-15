import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, spacing } from "../../theme";

interface SeparatorProps {
  vertical?: boolean;
  margin?: number;
}

export function Separator({ vertical = false, margin = spacing.md }: SeparatorProps) {
  if (vertical) {
    return (
      <View
        style={{
          width: 1,
          backgroundColor: colors.border,
          marginHorizontal: margin,
          alignSelf: "stretch",
        }}
      />
    );
  }
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.border,
        marginVertical: margin,
      }}
    />
  );
}
