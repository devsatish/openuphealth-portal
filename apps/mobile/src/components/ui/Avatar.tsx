import React from "react";
import { View, Text, Image, StyleSheet, ViewStyle } from "react-native";
import { colors, fontSize, fontWeight } from "../../theme";

type AvatarSize = "sm" | "md" | "lg";

const sizeMap: Record<AvatarSize, number> = { sm: 32, md: 40, lg: 56 };
const fontSizeMap: Record<AvatarSize, number> = { sm: 12, md: 15, lg: 20 };

interface AvatarProps {
  name?: string;
  imageUri?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name?: string): string {
  const avatarColors = [
    "#4F46E5", "#7C3AED", "#DB2777", "#DC2626",
    "#D97706", "#059669", "#0891B2", "#2563EB",
  ];
  if (!name) return avatarColors[0];
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

export function Avatar({ name, imageUri, size = "md", style }: AvatarProps) {
  const dim = sizeMap[size];
  const fs = fontSizeMap[size];
  const bg = getColorFromName(name);

  const containerStyle: ViewStyle = {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    backgroundColor: bg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  return (
    <View style={[containerStyle, style]}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      ) : (
        <Text style={{ color: "#fff", fontSize: fs, fontWeight: fontWeight.semibold }}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}
