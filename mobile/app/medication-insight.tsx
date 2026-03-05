import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";

export default function MedicationInsightScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.dragHandle} />

      <View style={styles.header}>
        <View>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={14} color={colors.lavender} />
            <Text style={styles.aiBadgeText}>Resumo IA</Text>
          </View>
          <Text style={styles.title}>Amoxicillin</Text>
          <Text style={styles.subtitle}>Suspensão Oral • 250mg/5ml</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={24} color={colors.slate400} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.doseCard}>
          <View style={styles.doseCardDecor1} />
          <View style={styles.doseCardDecor2} />

          <View style={styles.doseCardInner}>
            <View style={styles.doseCalcHeader}>
              <Ionicons name="calculator-outline" size={18} color={colors.primaryContent} />
              <Text style={styles.doseCalcLabel}>Dose Segura Calculada</Text>
            </View>

            <View style={styles.doseRange}>
              <View style={styles.doseRangeBox}>
                <Text style={styles.doseRangeValue}>4.5</Text>
                <Text style={styles.doseRangeSep}>-</Text>
                <Text style={styles.doseRangeValue}>5</Text>
                <Text style={styles.doseRangeUnit}>ml</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="time-outline" size={20} color={colors.slate900} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Frequência</Text>
                  <Text style={styles.infoValue}>A cada 8 horas</Text>
                </View>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar-outline" size={20} color={colors.slate900} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Duração</Text>
                  <Text style={styles.infoValue}>5 Dias</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.watchOutSection}>
          <View style={styles.watchOutHeader}>
            <Ionicons name="warning-outline" size={22} color={colors.textRose} />
            <Text style={styles.watchOutTitle}>Atenção</Text>
          </View>
          <View style={styles.watchOutCard}>
            <View style={styles.watchOutItem}>
              <View style={styles.watchOutIcon}>
                <Ionicons name="restaurant-outline" size={14} color={colors.textRose} />
              </View>
              <View style={styles.watchOutText}>
                <Text style={styles.watchOutItemTitle}>Tomar com alimento</Text>
                <Text style={styles.watchOutItemDesc}>
                  Para evitar dor de barriga, dê esta dose logo após uma refeição ou lanche.
                </Text>
              </View>
            </View>
            <View style={styles.watchOutItem}>
              <View style={styles.watchOutIcon}>
                <Ionicons name="moon-outline" size={14} color={colors.textRose} />
              </View>
              <View style={styles.watchOutText}>
                <Text style={styles.watchOutItemTitle}>Pode causar sonolência</Text>
                <Text style={styles.watchOutItemDesc}>
                  Leo pode ficar um pouco mais sonolento que o normal. Monitore durante as brincadeiras.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.leafletBtn}>
          <Ionicons name="document-text-outline" size={18} color={colors.slate400} />
          <Text style={styles.leafletText}>Ler bula oficial (PDF)</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity
          style={styles.gotItButton}
          onPress={() => router.back()}
        >
          <Ionicons name="checkmark-circle" size={22} color={colors.white} />
          <Text style={styles.gotItText}>Entendi, Obrigado</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  dragHandle: {
    width: 64,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.slate200,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(184, 184, 209, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.lavender,
  },
  title: { fontSize: 28, fontWeight: "700", color: colors.slate900 },
  subtitle: { fontSize: 14, color: colors.slate500, marginTop: 4 },
  closeBtn: {
    padding: 8,
    borderRadius: 20,
  },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 140 },
  doseCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    overflow: "hidden",
    position: "relative",
  },
  doseCardDecor1: {
    position: "absolute",
    right: -32,
    top: -32,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  doseCardDecor2: {
    position: "absolute",
    left: -32,
    bottom: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  doseCardInner: { position: "relative" },
  doseCalcHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    opacity: 0.9,
    marginBottom: 16,
  },
  doseCalcLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.primaryContent,
  },
  doseRange: { marginBottom: 20 },
  doseRangeBox: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.lg,
    alignSelf: "flex-start",
  },
  doseRangeValue: {
    fontSize: 44,
    fontWeight: "700",
    color: colors.slate900,
  },
  doseRangeSep: {
    fontSize: 24,
    fontWeight: "700",
    color: "rgba(15, 23, 42, 0.4)",
    marginHorizontal: 8,
  },
  doseRangeUnit: {
    fontSize: 20,
    fontWeight: "600",
    color: "rgba(15, 23, 42, 0.6)",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: radii.lg,
    padding: 16,
  },
  infoItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: colors.primaryContent,
  },
  infoValue: { fontSize: 14, fontWeight: "700", color: colors.slate900 },
  infoDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(15, 23, 42, 0.1)",
    marginHorizontal: 8,
  },
  watchOutSection: { marginBottom: spacing.xl },
  watchOutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  watchOutTitle: { fontSize: 18, fontWeight: "700", color: colors.slate900 },
  watchOutCard: {
    backgroundColor: colors.softRose,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    gap: 20,
    borderWidth: 1,
    borderColor: "rgba(232, 157, 157, 0.2)",
  },
  watchOutItem: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  watchOutIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  watchOutText: { flex: 1 },
  watchOutItemTitle: { fontSize: 15, fontWeight: "600", color: colors.slate800 },
  watchOutItemDesc: {
    fontSize: 13,
    color: colors.slate500,
    lineHeight: 20,
    marginTop: 4,
  },
  leafletBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  leafletText: { fontSize: 14, fontWeight: "500", color: colors.slate400 },
  bottomAction: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: 48,
    backgroundColor: colors.backgroundLight,
  },
  gotItButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    backgroundColor: colors.slate900,
    borderRadius: radii.full,
    shadowColor: colors.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  gotItText: { fontSize: 18, fontWeight: "700", color: colors.white },
});
