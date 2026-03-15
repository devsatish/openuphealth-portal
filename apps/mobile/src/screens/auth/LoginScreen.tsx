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
import { useAuth } from "../../auth/AuthContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
}

const DEMO_ACCOUNTS = [
  { label: "Patient Demo", email: "patient@demo.com", password: "password123" },
  { label: "Therapist Demo", email: "therapist@demo.com", password: "password123" },
];

export function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError("");
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
          {/* Logo / Branding */}
          <View style={styles.brandSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>O</Text>
            </View>
            <Text style={styles.appName}>OpenUpHealth</Text>
            <Text style={styles.tagline}>Mental health care, reimagined.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Sign In</Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <Button onPress={handleLogin} loading={isLoading} fullWidth size="lg">
              Sign In
            </Button>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo Accounts */}
          <TouchableOpacity
            style={styles.demoToggle}
            onPress={() => setShowDemo((v) => !v)}
            activeOpacity={0.7}
          >
            <Text style={styles.demoToggleText}>
              {showDemo ? "▲ Hide" : "▼ Show"} Demo Accounts
            </Text>
          </TouchableOpacity>

          {showDemo && (
            <View style={styles.demoSection}>
              {DEMO_ACCOUNTS.map((acc) => (
                <TouchableOpacity
                  key={acc.email}
                  style={styles.demoItem}
                  onPress={() => fillDemo(acc)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.demoLabel}>{acc.label}</Text>
                  <Text style={styles.demoEmail}>{acc.email}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flexGrow: 1 },
  brandSection: { alignItems: "center", marginTop: spacing.xl, marginBottom: spacing.xl },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  logoText: { color: "#fff", fontSize: 32, fontWeight: fontWeight.bold },
  appName: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: colors.foreground },
  tagline: { fontSize: fontSize.md, color: colors.mutedForeground, marginTop: spacing.xs },
  form: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
    marginBottom: spacing.lg,
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: { color: "#991B1B", fontSize: fontSize.sm },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  signupText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  signupLink: { fontSize: fontSize.sm, color: colors.primary, fontWeight: fontWeight.semibold },
  demoToggle: { alignItems: "center", marginTop: spacing.lg, padding: spacing.sm },
  demoToggleText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  demoSection: {
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  demoItem: {
    backgroundColor: colors.card,
    borderRadius: radii.sm,
    padding: spacing.sm + 4,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: colors.foreground },
  demoEmail: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 2 },
});
