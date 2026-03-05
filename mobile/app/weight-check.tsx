import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radii } from "@/lib/theme";

export default function WeightCheckScreen() {
  const router = useRouter();
  const [weight, setWeight] = useState("14.2");

  const adjustWeight = (delta: number) => {
    const current = parseFloat(weight) || 0;
    setWeight(Math.max(0, current + delta).toFixed(1));
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.glowOrb} />

      <View style={styles.card}>
        <View style={styles.closeRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Vamos ser precisos</Text>
          <Text style={styles.subtitle}>Qual é o peso atual de Leo?</Text>
        </View>

        <View style={styles.weightSection}>
          <View style={styles.weightRow}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => adjustWeight(-0.1)}
            >
              <Ionicons name="remove" size={22} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.weightInputWrapper}>
              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                textAlign="center"
              />
              <Text style={styles.weightUnit}>kg</Text>
            </View>

            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => adjustWeight(0.1)}
            >
              <Ionicons name="add" size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.lastLogged}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.lastLoggedText}>
              Último registro: 14.0kg (2 semanas atrás)
            </Text>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={18} color="#ef4444" />
          <Text style={styles.disclaimerText}>
            Segurança em primeiro lugar: A dosagem será calculada com base neste
            valor. Verifique se está atualizado.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.calcButton}
          onPress={() => router.back()}
        >
          <Text style={styles.calcButtonText}>Calcular Dose Segura</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.primaryContent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(246, 248, 247, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  glowOrb: {
    position: "absolute",
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: "rgba(43, 238, 186, 0.15)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  closeRow: { alignItems: "flex-end" },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerSection: { alignItems: "center", gap: 8 },
  title: { fontSize: 28, fontWeight: "700", color: colors.textMain },
  subtitle: { fontSize: 18, fontWeight: "500", color: colors.textMuted },
  weightSection: { alignItems: "center", gap: 24 },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },
  weightInputWrapper: { flexDirection: "row", alignItems: "baseline" },
  weightInput: {
    fontSize: 56,
    fontWeight: "700",
    color: colors.textMain,
    minWidth: 140,
  },
  weightUnit: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textMuted,
    marginLeft: 4,
  },
  lastLogged: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(43, 238, 186, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  lastLoggedText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textMuted,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    padding: 16,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.1)",
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: "#991b1b",
    lineHeight: 20,
  },
  calcButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  calcButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primaryContent,
  },
});
