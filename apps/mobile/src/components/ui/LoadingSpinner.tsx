import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../theme";

interface LoadingSpinnerProps {
  color?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
}

export function LoadingSpinner({
  color = colors.primary,
  size = "large",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator color={color} size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  fullScreen: {
    flex: 1,
  },
});
