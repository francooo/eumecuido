import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const profiles = [
  {
    name: "Leo",
    active: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB900wM7OC9J0Ps93Sq6a3Sd9bHXVmE3jkz01hEaxD3gUfWfsLHPZp3Ny3EAkDD4FRN0h2Quh0MrU4gqv-zKwl-ZmLmgdmhWLM6wE9mePEwOWQztzFkc1MGKSITwPsVXdexLG00gS6zh9TiaTOQiX-m26EXJw7VAxrBJplEBzO0Bbtmv2caPf1gVw-pt2W-4hkM1t7p1R2QeaGNUwWsVSD-rjOn8bdgViKQ262hFgU5RhEmQoIziSYz1MN_yz0NH0gH7pmHm21gLe8",
    id: 1,
  },
  {
    name: "Dad",
    active: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDR_Wq-UMVzFIU5p0zE65G3Rciq4GNtPnN5RcQdYJ6gDZnFtNbjcvZ8pCDdsx7IjdYXs6ihBZp61pkfA7gBDdjlF1d0kwxIs9wWSczJDqolFUadeSxkA4MaA3ZdvPbStd8bLRee-3R3IhplsGOdul5afJqrdDWL_fYECCUWL3D7v8047Uvqz23y_5MqCeie90EgVCp3hDs1yxZhY26v2rmBdpCKL1IVlbnY5qiqQwLnzvAVh7XOwHusac8Vzo3PqTldu1QfdrYFEZA",
    id: 2,
  },
  {
    name: "Mom",
    active: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcKNA23u0sDrd-3sJ0asySVT72JSNw7f3YNh6cb8oi_uy0br9-WJOP5jqzaSci8cImuggDpD3rSm5NlpSN7o6UoHEo4_xEC22XM_6AW39hqZrftSuPpuOshJkwNtPa-7_JGyb8t96NAdMGDbyeyNqODdSlYzdpzUbyo1PGnvf4prJxBEawDGxfvIu61rGpaVS37JtAzT0ZkbTQ9ziQFv9qJ-wSg2LDZyyf8a1xR4sNOFi1NkGZBO0Te2Kkr228KLaC0ar90ScSCqI",
    id: 3,
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [familyMembers, setFamilyMembers] = useState(profiles);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null); // MELHORIA 1
  const [memberData, setMemberData] = useState<any>(null); // MELHORIA 1
  const [refreshing, setRefreshing] = useState(false); // MELHORIA 1

  // Extrair primeiro nome
  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  // Data dinâmica usando API nativa do JavaScript
  const hoje = new Date();
  const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const diasSemana = ['DOMINGO', 'SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO'];
  
  const mes = meses[hoje.getMonth()];
  const dia = hoje.getDate();
  const diaSemana = diasSemana[hoje.getDay()];
  const dataFormatada = `${mes} ${dia} • ${diaSemana}`;

  // Registrar evento de carregamento
  useEffect(() => {
    if (user) {
      api.logEvent({
        eventType: 'home_date_rendered',
        eventData: { date_shown: dataFormatada, locale: 'pt-BR' },
        deviceTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).catch(console.error);
    }
  }, [user, dataFormatada]);

  // Carregar membros da família
  useEffect(() => {
    loadFamilyMembers();
  }, [user]);

  // Carregar dados do membro selecionado (MELHORIA 1)
  useEffect(() => {
    if (selectedMemberId) {
      loadMemberData(selectedMemberId);
    }
  }, [selectedMemberId]);

  async function loadFamilyMembers() {
    if (!user) return;
    try {
      const response = await api.getFamilyMembers(user.id.toString());
      if (response.members && response.members.length > 0) {
        const membersWithState = response.members.map((m: any, index: number) => ({
          name: m.name,
          active: index === 0, // Primeiro membro ativo por padrão
          avatar: m.photoUrl || 'https://via.placeholder.com/60',
          id: m.id,
          weight: m.currentWeightKg,
        }));
        setFamilyMembers(membersWithState);
        
        // Selecionar automaticamente o primeiro membro (MELHORIA 1)
        if (!selectedMemberId) {
          setSelectedMemberId(membersWithState[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading family members:', error);
    }
  }

  // Carregar dados completos do membro (MELHORIA 1)
  async function loadMemberData(memberId: number) {
    try {
      const response = await api.getMemberData(memberId.toString());
      setMemberData(response);
    } catch (error) {
      console.error('Error loading member data:', error);
      setMemberData(null);
    }
  }

  // Handler para selecionar membro (MELHORIA 1)
  const handleSelectMember = (memberId: number) => {
    setSelectedMemberId(memberId);
    // Atualizar estado de ativo/inativo
    setFamilyMembers(prev => prev.map(m => ({
      ...m,
      active: m.id === memberId,
    })));
  };

  // Refresh (MELHORIA 1)
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFamilyMembers();
    if (selectedMemberId) {
      await loadMemberData(selectedMemberId);
    }
    setRefreshing(false);
  };

  const handleAddMember = () => {
    router.push("/add-family-member");
  };

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.profileScroll}
        contentContainerStyle={styles.profileScrollContent}
      >
        {familyMembers.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => handleSelectMember(p.id)}
            activeOpacity={0.7}
          >
            <View style={styles.profileItem}>
              <View style={[styles.avatarRing, p.active && styles.avatarRingActive]}>
                <Image source={{ uri: p.avatar }} style={styles.avatar} />
                {p.active && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color={colors.primaryContent} />
                  </View>
                )}
              </View>
              <Text style={[styles.profileName, p.active && styles.profileNameActive]}>
                {p.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.profileItem}>
          <TouchableOpacity onPress={handleAddMember} activeOpacity={0.7}>
            <View style={styles.addProfileCircle}>
              <Ionicons name="add" size={24} color={colors.lavender} />
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>Adicionar</Text>
        </View>
      </ScrollView>

      <ScrollView
        style={styles.feed}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.doseCard}
          onPress={() => router.push("/log-dose")}
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
                  <Text style={styles.medName}>Amoxicillin</Text>
                  <Text style={styles.medDetail}>5ml • Líquido</Text>
                </View>
              </View>
              <View style={styles.dueBadge}>
                <Ionicons name="time-outline" size={12} color={colors.alertRose} />
                <Text style={styles.dueText}>Às 9:00</Text>
              </View>
            </View>
            <View style={styles.doseCardBottom}>
              <TouchableOpacity
                style={styles.logNowButton}
                onPress={() => router.push("/log-dose")}
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
            onPress={() => router.push("/weight-check")}
            activeOpacity={0.8}
          >
            <View style={styles.widgetHeader}>
              <View>
                <Text style={styles.widgetLabel}>Peso</Text>
                <Text style={styles.widgetValue}>
                  14.2<Text style={styles.widgetUnit}>kg</Text>
                </Text>
              </View>
              <View style={styles.widgetIconBg}>
                <Ionicons name="scale-outline" size={18} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.widgetFooter}>+0.4kg desde a última verificação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.widget}
            onPress={() => router.push("/medication-insight")}
            activeOpacity={0.8}
          >
            <View style={styles.widgetHeader}>
              <View>
                <Text style={styles.widgetLabel}>Próximos</Text>
                <Text style={styles.widgetValueSm}>Ibuprofen</Text>
                <Text style={styles.widgetSub}>Comprimido • 200mg</Text>
              </View>
              <View style={[styles.widgetIconBg, { backgroundColor: colors.lavenderLight }]}>
                <Ionicons name="calendar-outline" size={18} color={colors.lavender} />
              </View>
            </View>
            <View style={styles.widgetTimeRow}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={styles.widgetTimeText}>2:00 PM</Text>
            </View>
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
                <Text style={styles.yesterdayTitle}>Todas as Doses Registradas</Text>
                <Text style={styles.yesterdaySubtitle}>Leo teve um bom dia</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.lavender} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/log-dose")}
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
  widgetFooter: { fontSize: 10, color: colors.textMuted, marginTop: "auto" },
  widgetTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: "auto",
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
});
