import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { spacing, fontSize, fontWeight, radii } from "../theme";

export function CrisisBanner() {
  const call988 = () => {
    Linking.openURL("tel:988");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🆘</Text>
      <Text style={styles.text}>In crisis? You are not alone.</Text>
      <TouchableOpacity onPress={call988} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Call 988</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: radii.md,
    padding: spacing.sm + 4,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  text: {
    flex: 1,
    fontSize: fontSize.sm,
    color: "#92400E",
    fontWeight: fontWeight.medium,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radii.sm,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
});
