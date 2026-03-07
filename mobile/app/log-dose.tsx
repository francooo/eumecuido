import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const MAX_MED_NAME_LENGTH = 200;
const WEIGHT_MIN = 0.1;
const WEIGHT_MAX = 650;
const TIME_OPTIONS = [
  { key: "now", label: "Agora", icon: "time-outline" as const },
  { key: "15m_ago", label: "15m atrás" },
  { key: "30m_ago", label: "30m atrás" },
];

const UNIT_OPTIONS = [
  { key: "ml", label: "ml" },
  { key: "mg", label: "mg" },
  { key: "comprimido(s)", label: "comprimido(s)" },
];

function formatVerifiedAt(isoString: string | undefined): string {
  if (!isoString) return "Verificado há —";
  const then = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffHoras = diffMs / (1000 * 60 * 60);
  if (diffHoras < 24) return `Verificado há ${Math.round(diffHoras)}h`;
  if (diffHoras < 168) return `Verificado há ${Math.floor(diffHoras / 24)}d`;
  return `Verificado há ${Math.floor(diffHoras / 168)}sem`;
}

function computeAppliedAt(timeOption: string): Date {
  const d = new Date();
  if (timeOption === "15m_ago") d.setMinutes(d.getMinutes() - 15);
  else if (timeOption === "30m_ago") d.setMinutes(d.getMinutes() - 30);
  return d;
}

export default function LogDoseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id_membro?: string;
    nome_membro?: string;
    id_medicamento?: string;
    id_dose_agendada?: string;
    nome_medicamento?: string;
    dosagem?: string;
    unidade?: string;
  }>();
  const { user } = useAuth();

  const idMembro = params.id_membro ? parseInt(params.id_membro, 10) : undefined;
  const nomeMembro = params.nome_membro ?? "—";
  const idMedicamento = params.id_medicamento ? parseInt(params.id_medicamento, 10) : undefined;
  const idDoseAgendada = params.id_dose_agendada ? parseInt(params.id_dose_agendada, 10) : undefined;
  const initialMedName = (params.nome_medicamento || "").trim().slice(0, MAX_MED_NAME_LENGTH) || "";
  const initialDosage = params.dosagem ? String(params.dosagem) : "5";
  const initialUnit = (params.unidade || "ml").toLowerCase();

  const [medicationName, setMedicationName] = useState(initialMedName);
  const [medNameEditing, setMedNameEditing] = useState(false);
  const [amount, setAmount] = useState(initialDosage);
  const [unit, setUnit] = useState(initialUnit);
  const [selectedTime, setSelectedTime] = useState("now");
  const [weightInput, setWeightInput] = useState("");
  const [weightVerifiedAt, setWeightVerifiedAt] = useState<string | undefined>();
  const [weightConfirmed, setWeightConfirmed] = useState<string | null>(null);
  const [nextDoseTime, setNextDoseTime] = useState<{ hours: number; minutes: number } | null>(null);
  const [nextDosePickerVisible, setNextDosePickerVisible] = useState(false);
  const [nextDoseHourInput, setNextDoseHourInput] = useState("12");
  const [nextDoseMinuteInput, setNextDoseMinuteInput] = useState("0");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const sliderMax = 15;
  const amountNum = parseFloat(amount) || 0;

  // Carregar peso atual do membro
  useEffect(() => {
    if (!idMembro) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api.getMemberData(String(idMembro));
        if (cancelled) return;
        const w = data?.member?.currentWeight;
        const lastAt = (data?.member as { weightLastLoggedAt?: string })?.weightLastLoggedAt;
        if (w != null) {
          setWeightInput(String(w));
          setWeightConfirmed(String(w));
        }
        if (lastAt) setWeightVerifiedAt(lastAt);
      } catch {
        if (!cancelled) setWeightVerifiedAt(undefined);
      }
    })();
    return () => { cancelled = true; };
  }, [idMembro]);

  const handleCloseMedNameEdit = () => {
    const trimmed = medicationName.trim();
    if (!trimmed) {
      setMedicationName(initialMedName || "Medicamento");
    } else {
      setMedicationName(trimmed.slice(0, MAX_MED_NAME_LENGTH));
    }
    setMedNameEditing(false);
  };

  const handleConfirmWeight = async () => {
    const raw = weightInput.replace(",", ".");
    const num = parseFloat(raw);
    if (Number.isNaN(num) || num < WEIGHT_MIN || num > WEIGHT_MAX) {
      Alert.alert("Peso inválido", `Informe um valor entre ${WEIGHT_MIN} e ${WEIGHT_MAX} kg (até 1 casa decimal).`);
      return;
    }
    const value = Math.round(num * 10) / 10;
    const valueStr = value.toFixed(1);
    setWeightConfirmed(valueStr);
    setWeightInput(valueStr);
    if (idMembro && user && valueStr !== weightConfirmed) {
      try {
        await api.createWeightRecord({
          memberId: idMembro,
          weightKg: valueStr,
          recordedBy: user.id,
        });
        setWeightVerifiedAt(new Date().toISOString());
      } catch (e) {
        console.error("Error saving weight:", e);
      }
    }
  };

  const handleOpenNextDosePicker = () => {
    if (nextDoseTime) {
      setNextDoseHourInput(String(nextDoseTime.hours));
      setNextDoseMinuteInput(String(nextDoseTime.minutes));
    }
    setNextDosePickerVisible(true);
  };

  const handleConfirmNextDoseTime = () => {
    const h = Math.min(23, Math.max(0, parseInt(nextDoseHourInput, 10) || 0));
    const m = Math.min(59, Math.max(0, parseInt(nextDoseMinuteInput, 10) || 0));
    setNextDoseTime({ hours: h, minutes: m });
    setNextDoseHourInput(String(h));
    setNextDoseMinuteInput(String(m));
    setNextDosePickerVisible(false);
  };

  const handleSave = async () => {
    if (!idMembro) {
      setSaveError("Selecione um membro no dashboard.");
      return;
    }
    const nameToSave = (medicationName.trim() || initialMedName || "Medicamento").slice(0, MAX_MED_NAME_LENGTH);
    const dosageStr = String(amount).trim() || "0";
    const dosageNum = parseFloat(dosageStr);
    if (Number.isNaN(dosageNum) || dosageNum < 0) {
      setSaveError("Informe uma quantidade válida.");
      return;
    }

    setSaveError(null);
    setSaving(true);

    const appliedAt = computeAppliedAt(selectedTime);
    let nextDoseScheduledAt: string | undefined;
    if (nextDoseTime) {
      const d = new Date();
      d.setHours(nextDoseTime.hours, nextDoseTime.minutes, 0, 0);
      const now = new Date();
      if (d <= now) d.setDate(d.getDate() + 1);
      nextDoseScheduledAt = d.toISOString();
    }

    try {
      await api.registerDose({
        memberId: idMembro,
        scheduledDoseId: idDoseAgendada,
        medicationId: idMedicamento,
        medicationNameApplied: nameToSave,
        appliedDosage: dosageStr,
        appliedUnit: unit,
        appliedAt: appliedAt.toISOString(),
        timeOption: selectedTime,
        weightKgAtMoment: weightConfirmed || undefined,
        nextDoseScheduledAt: nextDoseScheduledAt || undefined,
        recordedBy: user?.id,
      });
      setSaving(false);
      Alert.alert("Sucesso", `Dose registrada para ${nomeMembro}!`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      setSaveError(e?.message || "Erro ao salvar. Tente novamente.");
      setSaving(false);
    }
  };

  const nextDoseLabel = nextDoseTime
    ? `${String(nextDoseTime.hours).padStart(2, "0")}:${String(nextDoseTime.minutes).padStart(2, "0")}`
    : "--:--";

  const safeDoseHint = weightConfirmed
    ? (() => {
        const w = parseFloat(weightConfirmed);
        if (Number.isNaN(w) || w <= 0) return "";
        const min = (w * 0.3).toFixed(1);
        const max = (w * 0.5).toFixed(1);
        return `Dose segura: ${min} - ${max}${unit}`;
      })()
    : "Informe e confirme o peso";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color={colors.slate900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar Dose</Text>
        <View style={{ width: 40 }} />
      </View>

      {saveError ? (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.errorBannerText}>{saveError}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.medCard}>
          <View style={styles.medCardIcon}>
            <Ionicons name="medical" size={28} color={colors.primary} />
          </View>
          <View style={styles.medCardInfo}>
            {medNameEditing ? (
              <View>
                <TextInput
                  style={styles.medNameInput}
                  value={medicationName}
                  onChangeText={(t) => setMedicationName(t.slice(0, MAX_MED_NAME_LENGTH))}
                  placeholder="Nome do medicamento"
                  placeholderTextColor={colors.slate400}
                  autoFocus
                  maxLength={MAX_MED_NAME_LENGTH}
                />
                <View style={styles.medCardProfile}>
                  <Ionicons name="happy-outline" size={14} color={colors.gentleSage} />
                  <Text style={styles.medCardProfileText}>Para {nomeMembro}</Text>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.medCardName}>{medicationName || "—"}</Text>
                <View style={styles.medCardProfile}>
                  <Ionicons name="happy-outline" size={14} color={colors.gentleSage} />
                  <Text style={styles.medCardProfileText}>Para {nomeMembro}</Text>
                </View>
              </View>
            )}
          </View>
          {medNameEditing ? (
            <TouchableOpacity style={styles.editBtn} onPress={handleCloseMedNameEdit}>
              <Text style={styles.editBtnText}>OK</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.editBtn} onPress={() => setMedNameEditing(true)}>
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dosageSection}>
          <Text style={styles.sectionLabel}>Quanto?</Text>
          <View style={styles.dosageRow}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setAmount(String(Math.max(0, amountNum - 1)))}
            >
              <Ionicons name="remove" size={32} color={colors.slate400} />
            </TouchableOpacity>
            <View style={styles.dosageDisplay}>
              <Text style={styles.dosageValue}>{amount}</Text>
              <Text style={styles.dosageUnit}>{unit}</Text>
            </View>
            <TouchableOpacity
              style={styles.stepperBtnPrimary}
              onPress={() => setAmount(String(amountNum + 1))}
            >
              <Ionicons name="add" size={32} color={colors.slate900} />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderFill,
                { width: `${Math.min(100, (amountNum / sliderMax) * 100)}%` },
              ]}
            />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0{unit}</Text>
            <Text style={styles.sliderLabel}>{sliderMax}{unit}</Text>
          </View>
          <View style={styles.unitRow}>
            {UNIT_OPTIONS.map((u) => (
              <TouchableOpacity
                key={u.key}
                style={[styles.unitChip, unit === u.key && styles.unitChipActive]}
                onPress={() => setUnit(u.key)}
              >
                <Text style={[styles.unitChipText, unit === u.key && styles.unitChipTextActive]}>{u.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.weightSection}>
          <View style={styles.weightHeader}>
            <Text style={styles.sectionLabel}>Peso Atual</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>{formatVerifiedAt(weightVerifiedAt)}</Text>
            </View>
          </View>
          <View style={styles.weightCard}>
            <View style={styles.weightLeft}>
              <View style={styles.weightIcon}>
                <Ionicons name="scale-outline" size={22} color={colors.primary} />
              </View>
              <View>
                <TextInput
                  style={styles.weightValueInput}
                  value={weightInput}
                  onChangeText={setWeightInput}
                  placeholder="—"
                  placeholderTextColor={colors.slate400}
                  keyboardType="decimal-pad"
                  maxLength={6}
                />
                <Text style={styles.weightUnit}> kg</Text>
                <Text style={styles.weightSafe}>{safeDoseHint}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmWeight}>
              <Text style={styles.confirmBtnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.sectionLabel}>Horário</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeRow}>
              {TIME_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.timeChip, selectedTime === t.key && styles.timeChipActive]}
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
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.slate900} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color={colors.slate900} />
              <Text style={styles.saveText}>Salvar Registro</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextDoseTouchable} onPress={handleOpenNextDosePicker}>
          <Text style={styles.nextDoseHint}>Próxima dose em </Text>
          <Text style={styles.nextDoseValue}>{nextDoseLabel}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={nextDosePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNextDosePickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setNextDosePickerVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Próxima dose</Text>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Hora</Text>
              <TextInput
                style={styles.modalInput}
                value={nextDoseHourInput}
                onChangeText={setNextDoseHourInput}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="0-23"
              />
              <Text style={styles.modalLabel}>Min</Text>
              <TextInput
                style={styles.modalInput}
                value={nextDoseMinuteInput}
                onChangeText={setNextDoseMinuteInput}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="0-59"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setNextDosePickerVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnOk} onPress={handleConfirmNextDoseTime}>
                <Text style={styles.modalBtnOkText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.textRose,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  errorBannerText: { color: "#fff", fontSize: 14, fontWeight: "600" },
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
  medNameInput: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radii.sm,
    paddingHorizontal: 8,
  },
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
  unitRow: { flexDirection: "row", gap: 8, marginTop: 16, flexWrap: "wrap" },
  unitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: colors.backgroundLight,
  },
  unitChipActive: { backgroundColor: colors.slate900 },
  unitChipText: { fontSize: 13, fontWeight: "600", color: colors.slate500 },
  unitChipTextActive: { color: colors.white },
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
  weightValueInput: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.slate900,
    padding: 0,
    minWidth: 48,
  },
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
  timeChipActive: { backgroundColor: colors.slate900 },
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
  saveButtonDisabled: { opacity: 0.7 },
  saveText: { fontSize: 18, fontWeight: "700", color: colors.slate900 },
  nextDoseTouchable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  nextDoseHint: { fontSize: 12, color: colors.slate400, fontWeight: "500" },
  nextDoseValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xl,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: colors.slate900, marginBottom: 16 },
  modalRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  modalLabel: { fontSize: 14, fontWeight: "600", color: colors.slate500 },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minWidth: 56,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  modalBtnCancel: { paddingVertical: 10, paddingHorizontal: 16 },
  modalBtnCancelText: { fontSize: 14, color: colors.slate500 },
  modalBtnOk: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.full,
  },
  modalBtnOkText: { fontSize: 14, fontWeight: "700", color: colors.slate900 },
});
