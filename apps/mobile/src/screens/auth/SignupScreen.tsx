import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Signup">;
}

type Role = "patient" | "therapist";

export function SignupScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [consented, setConsented] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Please enter your full name.";
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!consented) return "Please accept the terms to continue.";
    return null;
  };

  const handleSignup = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });
      const payload = await res.json();
      if (!res.ok || payload.error) {
        throw new Error(payload.error || "Signup failed");
      }
      navigation.navigate("Login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join OpenUpHealth today</Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Jane Smith"
              autoComplete="name"
              returnKeyType="next"
            />

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="jane@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Min 8 characters"
              secureTextEntry
              returnKeyType="next"
            />

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat password"
              secureTextEntry
              returnKeyType="done"
            />

            {/* Role Selector */}
            <Text style={styles.roleLabel}>I am a...</Text>
            <View style={styles.roleRow}>
              {(["patient", "therapist"] as Role[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleOption, role === r && styles.roleOptionActive]}
                  onPress={() => setRole(r)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>{r === "patient" ? "🙋" : "🩺"}</Text>
                  <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Consent */}
            <TouchableOpacity
              style={styles.consentRow}
              onPress={() => setConsented((v) => !v)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, consented && styles.checkboxActive]}>
                {consented && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.consentText}>
                I agree to the Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>

            <Button onPress={handleSignup} loading={isLoading} fullWidth size="lg">
              Create Account
            </Button>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flexGrow: 1 },
  header: { marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.foreground },
  subtitle: { fontSize: fontSize.md, color: colors.mutedForeground, marginTop: spacing.xs },
  form: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: { color: "#991B1B", fontSize: fontSize.sm },
  roleLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
    marginBottom: spacing.sm,
  },
  roleRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  roleOption: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.muted,
  },
  roleOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.secondary,
  },
  roleEmoji: { fontSize: 24, marginBottom: spacing.xs },
  roleText: { fontSize: fontSize.md, fontWeight: fontWeight.medium, color: colors.mutedForeground },
  roleTextActive: { color: colors.primary },
  consentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: fontWeight.bold },
  consentText: { flex: 1, fontSize: fontSize.sm, color: colors.mutedForeground, lineHeight: 18 },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  loginText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  loginLink: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
});
