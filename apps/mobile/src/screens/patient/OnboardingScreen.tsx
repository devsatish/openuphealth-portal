import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { colors, spacing, fontSize, fontWeight, radii } from "../../theme";

const GOALS = [
  "Manage anxiety",
  "Overcome depression",
  "Improve relationships",
  "Process grief",
  "Build self-esteem",
  "Stress management",
  "Trauma recovery",
  "Life transitions",
];

const SPECIALTIES = [
  "Cognitive Behavioral Therapy (CBT)",
  "Dialectical Behavior Therapy (DBT)",
  "EMDR",
  "Mindfulness-Based",
  "Psychodynamic",
  "Solution-Focused",
];

const MODALITIES = ["Video", "Phone", "In-Person"];
const LANGUAGES = ["English", "Spanish", "Mandarin", "French", "Hindi"];

interface IntakeData {
  goals: string[];
  preferredSpecialties: string[];
  preferredModality: string;
  preferredLanguage: string;
  insuranceCarrier: string;
  memberId: string;
  consentGiven: boolean;
}

const TOTAL_STEPS = 4;

export function OnboardingScreen({ navigation }: { navigation: any }) {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState<IntakeData>({
    goals: [],
    preferredSpecialties: [],
    preferredModality: "Video",
    preferredLanguage: "English",
    insuranceCarrier: "",
    memberId: "",
    consentGiven: false,
  });

  const toggleGoal = (g: string) =>
    setData((d) => ({
      ...d,
      goals: d.goals.includes(g) ? d.goals.filter((x) => x !== g) : [...d.goals, g],
    }));

  const toggleSpecialty = (s: string) =>
    setData((d) => ({
      ...d,
      preferredSpecialties: d.preferredSpecialties.includes(s)
        ? d.preferredSpecialties.filter((x) => x !== s)
        : [...d.preferredSpecialties, s],
    }));

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!data.consentGiven) {
      setError("Please give your consent to continue.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit intake form");
      navigation.replace("PatientTabs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  const stepTitles = ["Your Goals", "Preferences", "Insurance", "Consent"];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <Text style={styles.stepLabel}>
            Step {step + 1} of {TOTAL_STEPS} · {stepTitles[step]}
          </Text>
          <View style={styles.progressBar}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View
                key={i}
                style={[styles.progressSegment, i <= step && styles.progressSegmentActive]}
              />
            ))}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {step === 0 && (
            <View>
              <Text style={styles.sectionTitle}>What brings you here?</Text>
              <Text style={styles.sectionSubtitle}>Select all that apply</Text>
              <View style={styles.chipGrid}>
                {GOALS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, data.goals.includes(g) && styles.chipActive]}
                    onPress={() => toggleGoal(g)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, data.goals.includes(g) && styles.chipTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text style={styles.sectionTitle}>Your Preferences</Text>

              <Text style={styles.fieldLabel}>Therapy Approach</Text>
              <View style={styles.chipGrid}>
                {SPECIALTIES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, data.preferredSpecialties.includes(s) && styles.chipActive]}
                    onPress={() => toggleSpecialty(s)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        data.preferredSpecialties.includes(s) && styles.chipTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Session Format</Text>
              <View style={styles.radioGroup}>
                {MODALITIES.map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.radio, data.preferredModality === m && styles.radioActive]}
                    onPress={() => setData((d) => ({ ...d, preferredModality: m }))}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.radioText, data.preferredModality === m && styles.radioTextActive]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Preferred Language</Text>
              <View style={styles.radioGroup}>
                {LANGUAGES.map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.radio, data.preferredLanguage === l && styles.radioActive]}
                    onPress={() => setData((d) => ({ ...d, preferredLanguage: l }))}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.radioText, data.preferredLanguage === l && styles.radioTextActive]}>
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 2 && (
            <View>
              <Text style={styles.sectionTitle}>Insurance Information</Text>
              <Text style={styles.sectionSubtitle}>Optional — skip if self-pay</Text>
              <Input
                label="Insurance Carrier"
                value={data.insuranceCarrier}
                onChangeText={(v) => setData((d) => ({ ...d, insuranceCarrier: v }))}
                placeholder="e.g. Aetna, Blue Cross"
              />
              <Input
                label="Member ID"
                value={data.memberId}
                onChangeText={(v) => setData((d) => ({ ...d, memberId: v }))}
                placeholder="Your member ID"
              />
            </View>
          )}

          {step === 3 && (
            <View>
              <Text style={styles.sectionTitle}>Consent & Agreement</Text>
              <View style={styles.consentBox}>
                <Text style={styles.consentText}>
                  By using OpenUpHealth, you acknowledge that this platform facilitates connections
                  with licensed therapists but is not itself a healthcare provider. In case of
                  emergency, please call 911 or the 988 Lifeline.
                  {"\n\n"}
                  Your data is encrypted and handled in accordance with HIPAA standards. You can
                  request deletion of your data at any time.
                </Text>
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.consentRow}
                onPress={() => setData((d) => ({ ...d, consentGiven: !d.consentGiven }))}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, data.consentGiven && styles.checkboxActive]}>
                  {data.consentGiven && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.consentLabel}>
                  I have read and agree to the Terms of Service, Privacy Policy, and Informed
                  Consent
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          {step > 0 ? (
            <Button onPress={goBack} variant="outline" size="lg" style={{ flex: 1, marginRight: spacing.sm }}>
              Back
            </Button>
          ) : (
            <View style={{ flex: 1, marginRight: spacing.sm }} />
          )}
          {step < TOTAL_STEPS - 1 ? (
            <Button onPress={goNext} size="lg" style={{ flex: 1 }}>
              Continue
            </Button>
          ) : (
            <Button onPress={handleSubmit} loading={isLoading} size="lg" style={{ flex: 1 }}>
              Get Started
            </Button>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  progressHeader: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.card },
  stepLabel: { fontSize: fontSize.sm, color: colors.mutedForeground, marginBottom: spacing.sm },
  progressBar: { flexDirection: "row", gap: spacing.xs },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.muted,
  },
  progressSegmentActive: { backgroundColor: colors.primary },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  sectionTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: colors.foreground, marginBottom: spacing.xs },
  sectionSubtitle: { fontSize: fontSize.sm, color: colors.mutedForeground, marginBottom: spacing.lg },
  fieldLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: colors.foreground, marginBottom: spacing.sm, marginTop: spacing.md },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.secondary },
  chipText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  chipTextActive: { color: colors.primary, fontWeight: fontWeight.semibold },
  radioGroup: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  radio: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  radioActive: { borderColor: colors.primary, backgroundColor: colors.secondary },
  radioText: { fontSize: fontSize.sm, color: colors.mutedForeground },
  radioTextActive: { color: colors.primary, fontWeight: fontWeight.semibold },
  consentBox: {
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  consentText: { fontSize: fontSize.sm, color: colors.mutedForeground, lineHeight: 20 },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorText: { color: "#991B1B", fontSize: fontSize.sm },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.md,
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
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: fontWeight.bold },
  consentLabel: { flex: 1, fontSize: fontSize.sm, color: colors.foreground, lineHeight: 20 },
  navRow: {
    flexDirection: "row",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
});
