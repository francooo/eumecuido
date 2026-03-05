import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radii } from "@/lib/theme";

export default function SafetyCheckScreen() {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.slate400} />
        </TouchableOpacity>

        <View style={styles.iconSection}>
          <View style={styles.iconGlow} />
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={48} color={colors.alertRose} />
          </View>
        </View>

        <Text style={styles.title}>Just a moment</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            You logged{" "}
            <Text style={styles.infoBold}>Ibuprofen</Text> 2 hours ago.
          </Text>
          <View style={styles.warningRow}>
            <Ionicons name="information-circle" size={18} color={colors.alertRose} />
            <Text style={styles.warningText}>
              This medication usually requires a{" "}
              <Text style={styles.warningHighlight}>6-hour gap</Text> between
              doses to be safe.
            </Text>
          </View>
        </View>

        <Text style={styles.confirmText}>
          Are you sure you want to proceed?
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryAction}
            onPress={() => router.back()}
          >
            <Ionicons name="close-circle" size={20} color={colors.primaryContent} />
            <Text style={styles.primaryActionText}>Cancel & Wait</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction}>
            <Text style={styles.secondaryActionText}>Log Anyway</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accentBar}>
          <View style={styles.accentBarFill} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(246, 248, 247, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.xxl + 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  iconSection: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
    position: "relative",
  },
  iconGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(232, 157, 157, 0.2)",
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.alertRoseLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textMain,
    textAlign: "center",
    marginBottom: 16,
  },
  infoBox: {
    marginHorizontal: 32,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.slate100,
  },
  infoText: {
    fontSize: 16,
    color: colors.slate800,
    lineHeight: 24,
  },
  infoBold: { fontWeight: "600", color: colors.slate900 },
  warningRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.slate500,
    lineHeight: 20,
  },
  warningHighlight: { fontWeight: "600", color: colors.alertRose },
  confirmText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.slate500,
    textAlign: "center",
    marginBottom: 24,
  },
  actions: {
    paddingHorizontal: 32,
    gap: 8,
    marginBottom: 24,
  },
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryContent,
  },
  secondaryAction: {
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: radii.full,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.slate400,
  },
  accentBar: {
    height: 6,
    backgroundColor: colors.slate100,
  },
  accentBarFill: {
    height: "100%",
    width: "33%",
    backgroundColor: colors.alertRose,
    borderRadius: 3,
    alignSelf: "center",
    opacity: 0.5,
  },
});
