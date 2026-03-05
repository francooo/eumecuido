import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";

export default function MedicineCabinetScreen() {
  const router = useRouter();
  const [medType, setMedType] = useState("liquid");

  const types = [
    { key: "liquid", label: "Líquido", icon: "water-outline" as const },
    { key: "tablet", label: "Comprimido", icon: "medical-outline" as const },
    { key: "other", label: "Outro", icon: "medkit-outline" as const },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Medicamento</Text>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contextBanner}>
          <Ionicons name="happy-outline" size={16} color={colors.primary} />
          <Text style={styles.contextText}>
            Adicionando para <Text style={{ fontWeight: "700" }}>Leo</Text>{" "}
            <Text style={styles.contextWeight}>(14kg)</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.scanArea} activeOpacity={0.9}>
          <View style={styles.scanIcon}>
            <Ionicons name="camera-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.scanTitle}>Escanear Rótulo</Text>
          <Text style={styles.scanSubtitle}>
            Tire uma foto da caixa para preencher os detalhes automaticamente.
          </Text>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>IA Habilitada</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.formSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Nome do Medicamento</Text>
            <View style={styles.inputRow}>
              <Ionicons
                name="medical"
                size={20}
                color={colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="ex. Ibuprofeno"
                placeholderTextColor={colors.slate400}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tipo</Text>
            <View style={styles.typeRow}>
              {types.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.typeChip,
                    medType === t.key && styles.typeChipActive,
                  ]}
                  onPress={() => setMedType(t.key)}
                >
                  <Ionicons
                    name={t.icon}
                    size={18}
                    color={
                      medType === t.key ? colors.slate900 : colors.textMuted
                    }
                  />
                  <Text
                    style={[
                      styles.typeChipText,
                      medType === t.key && styles.typeChipTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Dosagem / Concentração</Text>
            <View style={styles.strengthRow}>
              <View style={[styles.inputRow, { flex: 1 }]}>
                <Ionicons
                  name="flask-outline"
                  size={20}
                  color={colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="ex. 100"
                  placeholderTextColor={colors.slate400}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.unitPicker}>
                <Text style={styles.unitText}>mg</Text>
                <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Instruções / Observações</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Tomar com alimento, manter refrigerado..."
              placeholderTextColor={colors.slate400}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cancelText: { fontSize: 14, fontWeight: "500", color: colors.textMuted },
  headerTitle: { fontSize: 18, fontWeight: "700", color: colors.textMain },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: colors.slate900 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  contextBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.mintSoft,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.full,
    alignSelf: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(43, 238, 186, 0.1)",
  },
  contextText: { fontSize: 14, fontWeight: "500", color: colors.textMain },
  contextWeight: { fontSize: 12, color: colors.textMuted },
  scanArea: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mintSoft,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(43, 238, 186, 0.4)",
    padding: 32,
    marginBottom: spacing.xl,
  },
  scanIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  scanTitle: { fontSize: 18, fontWeight: "700", color: colors.textMain, marginBottom: 4 },
  scanSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 220,
    lineHeight: 20,
    marginBottom: 12,
  },
  aiBadge: {
    backgroundColor: "rgba(43, 238, 186, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  formSection: { gap: 24 },
  fieldGroup: {},
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.textMain,
  },
  typeRow: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radii.full,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  typeChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: radii.full,
  },
  typeChipActive: { backgroundColor: colors.primary },
  typeChipText: { fontSize: 14, fontWeight: "500", color: colors.textMuted },
  typeChipTextActive: { fontWeight: "700", color: colors.slate900 },
  strengthRow: { flexDirection: "row", gap: 8 },
  unitPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: 16,
    height: 56,
    width: 100,
    justifyContent: "center",
  },
  unitText: { fontSize: 16, fontWeight: "700", color: colors.textMain },
  textarea: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 16,
    fontSize: 16,
    fontWeight: "400",
    color: colors.textMain,
    minHeight: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
});
