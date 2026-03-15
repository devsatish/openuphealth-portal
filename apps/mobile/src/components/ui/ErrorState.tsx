import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "./Button";
import { colors, spacing, fontSize, fontWeight } from "../../theme";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Error</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <View style={styles.retryContainer}>
          <Button onPress={onRetry} variant="outline" size="sm">
            Try Again
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  icon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  retryContainer: {
    marginTop: spacing.md,
  },
});
