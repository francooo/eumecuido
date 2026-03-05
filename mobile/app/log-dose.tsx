import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";

export default function LogDoseScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState(5);
  const [unit, setUnit] = useState("ml");
  const [selectedTime, setSelectedTime] = useState("now");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={28} color={colors.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Dose</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.medCard}>
          <View style={styles.medCardIcon}>
            <Ionicons name="medical" size={28} color={colors.primary} />
          </View>
          <View style={styles.medCardInfo}>
            <Text style={styles.medCardName}>Ibuprofen</Text>
            <View style={styles.medCardProfile}>
              <Ionicons name="happy-outline" size={14} color={colors.gentleSage} />
              <Text style={styles.medCardProfileText}>For Leo</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dosageSection}>
          <Text style={styles.sectionLabel}>How much?</Text>
          <View style={styles.dosageRow}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setAmount(Math.max(0, amount - 1))}
            >
              <Ionicons name="remove" size={32} color={colors.slate400} />
            </TouchableOpacity>
            <View style={styles.dosageDisplay}>
              <Text style={styles.dosageValue}>{amount}</Text>
              <Text style={styles.dosageUnit}>{unit}</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtnPrimary}
              onPress={() => setAmount(amount + 1)}
            >
              <Ionicons name="add" size={32} color={colors.slate900} />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderTrack}>
            <View
              style={[styles.sliderFill, { width: `${(amount / 15) * 100}%` }]}
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0ml</Text>
            <Text style={styles.sliderLabel}>15ml</Text>
          </View>
        </View>

        <View style={styles.weightSection}>
          <View style={styles.weightHeader}>
            <Text style={styles.sectionLabel}>Current Weight</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified 2d ago</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.weightCard}
            onPress={() => router.push("/weight-check")}
          >
            <View style={styles.weightLeft}>
              <View style={styles.weightIcon}>
                <Ionicons name="scale-outline" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.weightValue}>
                  14 <Text style={styles.weightUnit}>kg</Text>
                </Text>
                <Text style={styles.weightSafe}>Safe dose: 4.5 - 7ml</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.confirmBtn}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.sectionLabel}>Time given</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRow}>
              {[
                { key: "now", label: "Just now", icon: "time-outline" as const },
                { key: "15m", label: "15m ago" },
                { key: "30m", label: "30m ago" },
              ].map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.timeChip,
                    selectedTime === t.key && styles.timeChipActive,
                  ]}
                  onPress={() => setSelectedTime(t.key)}
                >
                  {t.icon && (
                    <Ionicons
                      name={t.icon}
                      size={16}
                      color={selectedTime === t.key ? colors.white : colors.slate500}
                    />
                  )}
                  <Text
                    style={[
                      styles.timeChipText,
                      selectedTime === t.key && styles.timeChipTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.back()}
        >
          <Ionicons name="checkmark-circle" size={22} color={colors.slate900} />
          <Text style={styles.saveText}>Save Log</Text>
        </TouchableOpacity>
        <Text style={styles.nextDoseHint}>Next dose will be in 6 hours</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.slate900 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 180 },
  medCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    gap: 14,
    marginBottom: spacing.xl,
  },
  medCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  medCardInfo: { flex: 1 },
  medCardName: { fontSize: 20, fontWeight: "700", color: colors.slate900 },
  medCardProfile: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  medCardProfileText: { fontSize: 14, fontWeight: "500", color: colors.gentleSage },
  editBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.slate100,
  },
  editBtnText: { fontSize: 14, fontWeight: "600", color: colors.slate900 },
  dosageSection: { marginBottom: 40 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.slate500,
    textAlign: "center",
    marginBottom: 24,
  },
  dosageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  stepperBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnPrimary: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  dosageDisplay: { alignItems: "center" },
  dosageValue: {
    fontSize: 60,
    fontWeight: "700",
    color: colors.slate900,
    lineHeight: 68,
  },
  dosageUnit: { fontSize: 20, fontWeight: "600", color: colors.gentleSage },
  sliderTrack: {
    height: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 6,
    marginTop: 32,
    overflow: "hidden",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabel: { fontSize: 12, color: colors.slate400, fontWeight: "500" },
  weightSection: { marginBottom: 32 },
  weightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  verifiedBadge: {
    backgroundColor: "rgba(43, 238, 186, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  verifiedText: { fontSize: 12, fontWeight: "500", color: colors.gentleSage },
  weightCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(43, 238, 186, 0.08)",
    borderRadius: radii.xxl,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(43, 238, 186, 0.2)",
  },
  weightLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  weightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  weightValue: { fontSize: 24, fontWeight: "700", color: colors.slate900 },
  weightUnit: { fontSize: 16, fontWeight: "500", color: colors.slate500 },
  weightSafe: { fontSize: 12, color: colors.slate500 },
  confirmBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  confirmBtnText: { fontSize: 14, fontWeight: "700", color: colors.slate900 },
  timeSection: { marginBottom: 32 },
  timeRow: { flexDirection: "row", gap: 10 },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: radii.full,
    backgroundColor: colors.backgroundLight,
  },
  timeChipActive: {
    backgroundColor: colors.slate900,
  },
  timeChipText: { fontSize: 14, fontWeight: "700", color: colors.slate500 },
  timeChipTextActive: { color: colors.white },
  bottomAction: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 48,
    backgroundColor: colors.white,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 64,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 5,
  },
  saveText: { fontSize: 18, fontWeight: "700", color: colors.slate900 },
  nextDoseHint: {
    textAlign: "center",
    fontSize: 12,
    color: colors.slate400,
    fontWeight: "500",
    marginTop: 12,
  },
});
