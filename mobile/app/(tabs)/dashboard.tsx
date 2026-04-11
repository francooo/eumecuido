import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

// Formata horário para exibição (ex: "Às 9:00" ou "2:00 PM")
function formatScheduledTime(isoString: string | undefined): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  const h = d.getHours();
  const m = d.getMinutes();
  if (h < 12) return `Às ${h}:${m.toString().padStart(2, "0")}`;
  const pm = h === 12 ? 12 : h - 12;
  return `${pm}:${m.toString().padStart(2, "0")} PM`;
}

// Formata data relativa para "Último registro" (ex: "2 semanas atrás")
function formatWeightLastRecord(isoString: string | undefined, weightKg: number | null): string {
  if (weightKg == null || !isoString) return "";
  const then = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return `Último registro: ${Number(weightKg).toFixed(1)}kg (hoje)`;
  if (diffDays === 1) return `Último registro: ${Number(weightKg).toFixed(1)}kg (1 dia atrás)`;
  if (diffDays < 7) return `Último registro: ${Number(weightKg).toFixed(1)}kg (${diffDays} dias atrás)`;
  const weeks = Math.floor(diffDays / 7);
  if (weeks === 1) return `Último registro: ${Number(weightKg).toFixed(1)}kg (1 semana atrás)`;
  if (weeks < 5) return `Último registro: ${Number(weightKg).toFixed(1)}kg (${weeks} semanas atrás)`;
  const months = Math.floor(diffDays / 30);
  if (months === 1) return `Último registro: ${Number(weightKg).toFixed(1)}kg (1 mês atrás)`;
  return `Último registro: ${Number(weightKg).toFixed(1)}kg (${months} meses atrás)`;
}

// Formata data do último preenchimento para exibição no bloco Peso (ex: "07/03/2025 às 14:30")
function formatWeightUpdatedAt(isoString: string | undefined): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<Array<{
    id: number;
    name: string;
    active: boolean;
    avatar: string;
    weight?: string;
  }>>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [memberData, setMemberData] = useState<{
    member: { id: number; name: string; currentWeight: number | null; weightVariation: number | null; weightLastLoggedAt?: string | null; updatedAt?: string | null };
    todayDoses: Array<{ id?: number; medicationId?: number | null; name: string; dosage: string; unit: string; scheduledTime: string }>;
    nextDoses: Array<{ id?: number; medicationId?: number | null; name: string; dosage: string; unit: string; scheduledTime: string }>;
    yesterdayDoses: Array<unknown>;
  } | null>(null);
  const [memberDataLoading, setMemberDataLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [memberToDeleteId, setMemberToDeleteId] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weightModalInput, setWeightModalInput] = useState("");
  const lastTapRef = useRef<{ id: number; time: number } | null>(null);

  const selectedMemberName = familyMembers.find(m => m.id === selectedMemberId)?.name ?? memberData?.member?.name ?? "";

  const firstName = user?.name?.split(" ")[0] || "Usuário";

  const hoje = new Date();
  const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
  const diasSemana = ["DOMINGO", "SEGUNDA-FEIRA", "TERÇA-FEIRA", "QUARTA-FEIRA", "QUINTA-FEIRA", "SEXTA-FEIRA", "SÁBADO"];
  const mes = meses[hoje.getMonth()];
  const dia = hoje.getDate();
  const diaSemana = diasSemana[hoje.getDay()];
  const dataFormatada = `${mes} ${dia} • ${diaSemana}`;

  useEffect(() => {
    if (user) {
      api.logEvent({
        eventType: "home_date_rendered",
        eventData: { date_shown: dataFormatada, locale: "pt-BR" },
        deviceTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).catch(() => { /* evento opcional; falha silenciosa */ });
    }
  }, [user, dataFormatada]);

  useEffect(() => {
    loadFamilyMembers();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) loadFamilyMembers();
    }, [user])
  );

  useEffect(() => {
    if (selectedMemberId != null) {
      setMemberData(null);
      setMemberDataLoading(true);
      loadMemberData(selectedMemberId).finally(() => setMemberDataLoading(false));
    } else {
      setMemberData(null);
    }
  }, [selectedMemberId]);

  async function loadFamilyMembers() {
    if (!user) return;
    setConnectionError(null);
    try {
      const response = await api.getFamilyMembers(user.id.toString());
      if (response.members && response.members.length > 0) {
        const membersWithState = response.members.map((m: { id: number; name: string; photoUrl?: string; currentWeightKg?: string }, index: number) => ({
          name: m.name,
          active: index === 0,
          avatar: m.photoUrl || "https://via.placeholder.com/60",
          id: m.id,
          weight: m.currentWeightKg,
        }));
        setFamilyMembers(membersWithState);
        setSelectedMemberId((prev) => (prev != null ? prev : membersWithState[0].id));
      } else {
        setFamilyMembers([]);
        setSelectedMemberId(null);
      }
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("conexão") || msg.includes("Network") || msg.includes("servidor")) {
        setConnectionError(msg);
        setFamilyMembers([]);
        setSelectedMemberId(null);
      }
    }
  }

  async function loadMemberData(memberId: number) {
    try {
      const response = await api.getMemberData(memberId.toString());
      setMemberData(response);
    } catch {
      setMemberData(null);
    }
  }

  const handleSelectMember = (memberId: number) => {
    setSelectedMemberId(memberId);
    setFamilyMembers((prev) =>
      prev.map((m) => ({ ...m, active: m.id === memberId }))
    );
  };

  const handleAvatarPress = (p: { id: number; name: string }) => {
    const now = Date.now();
    const last = lastTapRef.current;
    if (last && last.id === p.id && now - last.time < 400) {
      lastTapRef.current = null;
      setMemberToDeleteId(p.id);
      return;
    }
    lastTapRef.current = { id: p.id, time: now };
    handleSelectMember(p.id);
  };

  const handleConfirmDeleteMember = () => {
    const id = memberToDeleteId;
    const name = familyMembers.find((m) => m.id === id)?.name;
    if (!id || !user) return;
    Alert.alert(
      "Excluir membro",
      `Excluir ${name ?? "este membro"}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel", onPress: () => setMemberToDeleteId(null) },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setMemberToDeleteId(null);
            try {
              await api.deleteFamilyMember(String(id), String(user.id));
              await loadFamilyMembers();
              if (selectedMemberId === id) {
                setSelectedMemberId(null);
                setMemberData(null);
              }
            } catch (e: any) {
              Alert.alert("Erro", e?.message ?? "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFamilyMembers();
    if (selectedMemberId != null) {
      await loadMemberData(selectedMemberId);
    }
    setRefreshing(false);
  };

  const handleAddMember = () => {
    router.push("/add-family-member");
  };

  const openWeightModal = () => {
    if (selectedMemberId == null) return;
    const w = memberData?.member?.currentWeight;
    setWeightModalInput(w != null ? String(w) : "");
    setWeightModalVisible(true);
  };

  const adjustWeightModal = (delta: number) => {
    const current = parseFloat(weightModalInput) || 0;
    setWeightModalInput(Math.max(0, current + delta).toFixed(1));
  };

  const handleSaveWeightModal = async () => {
    const raw = weightModalInput.replace(",", ".");
    const value = parseFloat(raw);
    if (Number.isNaN(value) || value <= 0 || value > 650) {
      Alert.alert("Atenção", "Informe um peso válido (0 a 650 kg).");
      return;
    }
    if (selectedMemberId == null || !user) return;
    try {
      await api.createWeightRecord({
        memberId: selectedMemberId,
        weightKg: value.toFixed(1),
        recordedBy: user.id,
      });
      setWeightModalVisible(false);
      await loadMemberData(selectedMemberId);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar o peso.");
    }
  };

  const firstTodayDose = memberData?.todayDoses?.[0];
  const firstNextDose = memberData?.nextDoses?.[0];
  const hasYesterdayDoses = (memberData?.yesterdayDoses?.length ?? 0) > 0;

  function logDoseParams(dose?: { id?: number; medicationId?: number | null; name?: string; dosage?: string; unit?: string } | null) {
    const params: Record<string, string> = {
      id_membro: String(selectedMemberId ?? ""),
      nome_membro: selectedMemberName || "—",
    };
    if (dose) {
      if (dose.id != null) params.id_dose_agendada = String(dose.id);
      if (dose.medicationId != null) params.id_medicamento = String(dose.medicationId);
      if (dose.name) params.nome_medicamento = dose.name;
      if (dose.dosage) params.dosagem = dose.dosage;
      if (dose.unit) params.unidade = dose.unit;
    }
    return params;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bom Dia, {firstName}</Text>
          <Text style={styles.date}>{dataFormatada}</Text>
        </View>
        <TouchableOpacity style={styles.notifButton}>
          <Ionicons name="notifications-outline" size={26} color={colors.textMuted} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {connectionError ? (
        <View style={styles.connectionErrorCard}>
          <Ionicons name="cloud-offline-outline" size={32} color={colors.textMuted} />
          <Text style={styles.connectionErrorTitle}>Sem conexão com o servidor</Text>
          <Text style={styles.connectionErrorText}>
            Verifique: (1) Backend rodando no PC com npm run dev. (2) Celular na mesma rede Wi‑Fi do PC. (3) Firewall do Windows liberando a porta 5000.
          </Text>
          <TouchableOpacity style={styles.connectionErrorButton} onPress={() => loadFamilyMembers()}>
            <Text style={styles.connectionErrorButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.profileScroll}
        contentContainerStyle={styles.profileScrollContent}
      >
        {familyMembers.map((p) => {
          const isSelected = selectedMemberId === p.id;
          return (
          <TouchableOpacity
            key={p.id}
            onPress={() => handleAvatarPress(p)}
            activeOpacity={0.7}
          >
            <View style={styles.profileItem}>
              <View style={[styles.avatarRing, isSelected && styles.avatarRingActive]}>
                <Image source={{ uri: p.avatar }} style={styles.avatar} />
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color={colors.primaryContent} />
                  </View>
                )}
              </View>
              <Text style={[styles.profileName, isSelected && styles.profileNameActive]}>
                {p.name}
              </Text>
            </View>
          </TouchableOpacity>
          );
        })}
        <View style={styles.profileItem}>
          <TouchableOpacity onPress={handleAddMember} activeOpacity={0.7}>
            <View style={styles.addProfileCircle}>
              <Ionicons name="add" size={24} color={colors.lavender} />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>Adicionar</Text>
        </View>
      </ScrollView>

      {memberToDeleteId != null && (
        <View style={styles.deleteBar}>
          <Text style={styles.deleteBarText}>
            Excluir {familyMembers.find((m) => m.id === memberToDeleteId)?.name}?
          </Text>
          <View style={styles.deleteBarButtons}>
            <TouchableOpacity style={styles.deleteBarCancel} onPress={() => setMemberToDeleteId(null)}>
              <Text style={styles.deleteBarCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBarConfirm} onPress={handleConfirmDeleteMember}>
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.deleteBarConfirmText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedMemberId == null ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateText}>Selecione um membro acima para ver os dados.</Text>
          </View>
        ) : memberDataLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingCardText}>Carregando dados...</Text>
          </View>
        ) : (
          <>
        <TouchableOpacity
          style={styles.doseCard}
          onPress={() => router.push({ pathname: "/log-dose", params: logDoseParams(firstTodayDose) })}
          activeOpacity={0.9}
        >
          <View style={styles.doseCardAccent} />
          <View style={styles.doseCardContent}>
            <View style={styles.doseCardTop}>
              <View style={styles.doseCardInfo}>
                <View style={styles.pillIcon}>
                  <Ionicons name="medical" size={22} color={colors.lavender} />
                </View>
                <View>
                  {firstTodayDose ? (
                    <>
                      <Text style={styles.medName}>{firstTodayDose.name}</Text>
                      <Text style={styles.medDetail}>
                        {firstTodayDose.dosage}
                        {firstTodayDose.unit ? ` ${firstTodayDose.unit}` : ""} • {firstTodayDose.unit === "ml" ? "Líquido" : firstTodayDose.unit === "mg" ? "Comprimido" : "Medicamento"}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.medName}>Nenhuma dose agendada</Text>
                      <Text style={styles.medDetail}>Para hoje</Text>
                    </>
                  )}
                </View>
              </View>
              {firstTodayDose && (
                <View style={styles.dueBadge}>
                  <Ionicons name="time-outline" size={12} color={colors.alertRose} />
                  <Text style={styles.dueText}>{formatScheduledTime(firstTodayDose.scheduledTime)}</Text>
                </View>
              )}
            </View>
            <View style={styles.doseCardBottom}>
              <TouchableOpacity
                style={styles.logNowButton}
                onPress={() => router.push({ pathname: "/log-dose", params: logDoseParams(firstTodayDose) })}
              >
                <Ionicons name="checkmark" size={18} color={colors.primaryContent} />
                <Text style={styles.logNowText}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.widgetRow}>
          <TouchableOpacity
            style={styles.widget}
            onPress={selectedMemberId != null ? openWeightModal : undefined}
            activeOpacity={0.8}
          >
            <View style={styles.widgetHeader}>
              <View>
                <Text style={styles.widgetLabel}>Peso</Text>
                {memberData?.member?.currentWeight != null ? (
                  <>
                    <Text style={styles.widgetValue}>
                      {Number(memberData.member.currentWeight).toFixed(1)}
                      <Text style={styles.widgetUnit}>kg</Text>
                    </Text>
                  </>
                ) : (
                  <Text style={styles.widgetValue}>—</Text>
                )}
              </View>
              <View style={styles.widgetIconBg}>
                <Ionicons name="scale-outline" size={18} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.widgetFooter}>
              {memberData?.member?.currentWeight == null
                ? "Peso não informado"
                : memberData?.member?.updatedAt
                  ? formatWeightUpdatedAt(memberData.member.updatedAt)
                  : memberData?.member?.weightLastLoggedAt
                    ? formatWeightUpdatedAt(memberData.member.weightLastLoggedAt)
                    : "Último peso registrado"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.widget}
            onPress={() => router.push("/medication-insight")}
            activeOpacity={0.8}
          >
            <View style={styles.widgetHeader}>
              <View>
                <Text style={styles.widgetLabel}>Próximos</Text>
                {firstNextDose ? (
                  <>
                    <Text style={styles.widgetValueSm}>{firstNextDose.name}</Text>
                    <Text style={styles.widgetSub}>
                      {firstNextDose.unit === "ml" ? "Líquido" : "Comprimido"} • {firstNextDose.dosage}
                      {firstNextDose.unit ? firstNextDose.unit : ""}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.widgetValueSm}>—</Text>
                    <Text style={styles.widgetSub}>Nenhuma dose agendada</Text>
                  </>
                )}
              </View>
              <View style={[styles.widgetIconBg, { backgroundColor: colors.lavenderLight }]}>
                <Ionicons name="calendar-outline" size={18} color={colors.lavender} />
              </View>
            </View>
            {firstNextDose && (
              <View style={styles.widgetTimeRow}>
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text style={styles.widgetTimeText}>{formatScheduledTime(firstNextDose.scheduledTime)}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.yesterdaySection}>
          <Text style={styles.sectionTitle}>Ontem</Text>
          <TouchableOpacity style={styles.yesterdayCard} activeOpacity={0.8}>
            <View style={styles.yesterdayLeft}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
              </View>
              <View>
                <Text style={styles.yesterdayTitle}>
                  {hasYesterdayDoses ? "Todas as Doses Registradas" : "Nenhuma dose registrada ontem"}
                </Text>
                <Text style={styles.yesterdaySubtitle}>
                  {selectedMemberName ? `${selectedMemberName} teve um bom dia` : "Selecione um membro"}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.lavender} />
          </TouchableOpacity>
        </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={weightModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWeightModalVisible(false)}
      >
        <View style={styles.weightModalOverlay}>
          <View style={styles.weightModalCard}>
            <View style={styles.weightModalCloseRow}>
              <TouchableOpacity onPress={() => setWeightModalVisible(false)} style={styles.weightModalCloseBtn}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.weightModalHeaderSection}>
              <Text style={styles.weightModalTitle}>Vamos ser precisos</Text>
              <Text style={styles.weightModalSubtitle}>
                Qual é o peso atual de {selectedMemberName || "este membro"}?
              </Text>
            </View>
            <View style={styles.weightModalWeightSection}>
              <View style={styles.weightModalWeightRow}>
                <TouchableOpacity style={styles.weightModalStepperBtn} onPress={() => adjustWeightModal(-0.1)}>
                  <Ionicons name="remove" size={22} color={colors.textMuted} />
                </TouchableOpacity>
                <View style={styles.weightModalInputWrapper}>
                  <TextInput
                    style={styles.weightModalInput}
                    value={weightModalInput}
                    onChangeText={setWeightModalInput}
                    keyboardType="decimal-pad"
                    textAlign="center"
                    placeholder="0"
                    placeholderTextColor={colors.textMuted}
                  />
                  <Text style={styles.weightModalUnit}>kg</Text>
                </View>
                <TouchableOpacity style={styles.weightModalStepperBtn} onPress={() => adjustWeightModal(0.1)}>
                  <Ionicons name="add" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              {memberData?.member?.currentWeight != null && memberData?.member?.weightLastLoggedAt && (
                <View style={styles.weightModalLastLogged}>
                  <Ionicons name="time-outline" size={14} color={colors.primary} />
                  <Text style={styles.weightModalLastLoggedText}>
                    {formatWeightLastRecord(
                      memberData.member.weightLastLoggedAt,
                      memberData.member.currentWeight
                    )}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.weightModalDisclaimer}>
              <Ionicons name="information-circle" size={18} color="#ef4444" />
              <Text style={styles.weightModalDisclaimerText}>
                Segurança em primeiro lugar: A dosagem será calculada com base neste valor. Verifique se está atualizado.
              </Text>
            </View>
            <TouchableOpacity style={styles.weightModalCalcButton} onPress={handleSaveWeightModal}>
              <Text style={styles.weightModalCalcButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: "/log-dose", params: logDoseParams(firstTodayDose ?? firstNextDose ?? undefined) })}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color={colors.primaryContent} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: { fontSize: 22, fontWeight: "700", color: colors.textMain },
  date: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.lavender,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  notifButton: { position: "relative", padding: 4 },
  notifDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.alertRose,
    borderWidth: 2,
    borderColor: colors.backgroundLight,
  },
  profileScroll: { maxHeight: 110, paddingLeft: spacing.lg },
  profileScrollContent: { gap: 16, paddingRight: spacing.lg, paddingVertical: 8 },
  profileItem: { alignItems: "center", gap: 6 },
  deleteBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.softRose,
    borderBottomWidth: 1,
    borderBottomColor: colors.alertRoseLight,
  },
  deleteBarText: { fontSize: 14, fontWeight: "600", color: colors.textMain },
  deleteBarButtons: { flexDirection: "row", gap: 12 },
  deleteBarCancel: { paddingVertical: 8, paddingHorizontal: 16 },
  deleteBarCancelText: { fontSize: 14, fontWeight: "600", color: colors.slate500 },
  deleteBarConfirm: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.textRose,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radii.full,
  },
  deleteBarConfirmText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  connectionErrorCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.softRose,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.alertRoseLight,
    alignItems: "center",
    gap: 10,
  },
  connectionErrorTitle: { fontSize: 16, fontWeight: "700", color: colors.textMain },
  connectionErrorText: { fontSize: 13, color: colors.textMuted, textAlign: "center", lineHeight: 20 },
  connectionErrorButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.full,
    marginTop: 4,
  },
  connectionErrorButtonText: { fontSize: 14, fontWeight: "600", color: colors.primaryContent },
  avatarRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarRingActive: { borderColor: colors.primary },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  checkBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.backgroundLight,
  },
  profileName: { fontSize: 13, fontWeight: "500", color: colors.textMuted },
  profileNameActive: { fontWeight: "700", color: colors.primary },
  addProfileCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.lavender,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(232, 232, 245, 0.3)",
  },
  feed: { flex: 1 },
  feedContent: { paddingHorizontal: spacing.lg, paddingBottom: 100, gap: spacing.lg },
  doseCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.xl,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  doseCardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: colors.lavender,
  },
  doseCardContent: { padding: 20, gap: 16 },
  doseCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  doseCardInfo: { flexDirection: "row", gap: 12, alignItems: "center" },
  pillIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lavenderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  medName: { fontSize: 18, fontWeight: "700", color: colors.textMain },
  medDetail: { fontSize: 14, fontWeight: "500", color: colors.textMuted },
  dueBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.alertRoseLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  dueText: { fontSize: 11, fontWeight: "700", color: colors.alertRose },
  doseCardBottom: { flexDirection: "row", justifyContent: "flex-end" },
  logNowButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radii.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  logNowText: { fontSize: 14, fontWeight: "700", color: colors.primaryContent },
  widgetRow: { flexDirection: "row", gap: 16 },
  widget: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.xl,
    padding: spacing.md,
    justifyContent: "space-between",
    height: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  widgetLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.lavender,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  widgetValue: { fontSize: 26, fontWeight: "700", color: colors.textMain, marginTop: 4 },
  widgetUnit: { fontSize: 13, fontWeight: "400", color: colors.textMuted },
  widgetValueSm: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textMain,
    marginTop: 4,
  },
  widgetSub: { fontSize: 12, color: colors.textMuted },
  widgetIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(43, 238, 186, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  widgetFooter: { fontSize: 10, color: colors.textMuted },
  widgetTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  widgetTimeText: { fontSize: 13, color: colors.textMuted },
  yesterdaySection: { marginTop: 8 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.lavender,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  yesterdayCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.xl,
    padding: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  yesterdayLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  yesterdayTitle: { fontSize: 14, fontWeight: "700", color: colors.textMain },
  yesterdaySubtitle: { fontSize: 12, color: colors.textMuted },
  emptyStateCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  emptyStateText: { fontSize: 14, color: colors.textMuted, textAlign: "center" },
  loadingCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.xl,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 120,
  },
  loadingCardText: { fontSize: 14, color: colors.textMuted },
  fab: {
    position: "absolute",
    bottom: 100,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  weightModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(246, 248, 247, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  weightModalCard: {
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
  weightModalCloseRow: { alignItems: "flex-end" },
  weightModalCloseBtn: { padding: 8, borderRadius: 20 },
  weightModalHeaderSection: { alignItems: "center", gap: 8 },
  weightModalTitle: { fontSize: 28, fontWeight: "700", color: colors.textMain },
  weightModalSubtitle: { fontSize: 18, fontWeight: "500", color: colors.textMuted },
  weightModalWeightSection: { alignItems: "center", gap: 24 },
  weightModalWeightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  weightModalStepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },
  weightModalInputWrapper: { flexDirection: "row", alignItems: "baseline" },
  weightModalInput: {
    fontSize: 56,
    fontWeight: "700",
    color: colors.textMain,
    minWidth: 140,
  },
  weightModalUnit: { fontSize: 22, fontWeight: "600", color: colors.textMuted, marginLeft: 4 },
  weightModalLastLogged: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(43, 238, 186, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  weightModalLastLoggedText: { fontSize: 14, fontWeight: "500", color: colors.textMuted },
  weightModalDisclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    padding: 16,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.1)",
  },
  weightModalDisclaimerText: {
    flex: 1,
    fontSize: 14,
    color: "#991b1b",
    lineHeight: 20,
  },
  weightModalCalcButton: {
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
  weightModalCalcButtonText: { fontSize: 18, fontWeight: "700", color: colors.primaryContent },
});
