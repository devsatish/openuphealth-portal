import { StyleSheet } from "react-native";
import { colors, spacing, radii, fontSize, fontWeight } from "./index";

export const commonStyles = StyleSheet.create({
  flex1: { flex: 1 },
  flexRow: { flexDirection: "row" },
  flexRowCenter: { flexDirection: "row", alignItems: "center" },
  flexCenter: { alignItems: "center", justifyContent: "center" },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontSize: fontSize.md,
    color: colors.foreground,
  },
  mutedText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.xl,
    backgroundColor: colors.muted,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: fontWeight.medium,
  },
});
