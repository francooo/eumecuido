import React from "react";
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

const profiles = [
  {
    name: "Leo",
    active: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB900wM7OC9J0Ps93Sq6a3Sd9bHXVmE3jkz01hEaxD3gUfWfsLHPZp3Ny3EAkDD4FRN0h2Quh0MrU4gqv-zKwl-ZmLmgdmhWLM6wE9mePEwOWQztzFkc1MGKSITwPsVXdexLG00gS6zh9TiaTOQiX-m26EXJw7VAxrBJplEBzO0Bbtmv2caPf1gVw-pt2W-4hkM1t7p1R2QeaGNUwWsVSD-rjOn8bdgViKQ262hFgU5RhEmQoIziSYz1MN_yz0NH0gH7pmHm21gLe8",
  },
  {
    name: "Dad",
    active: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDR_Wq-UMVzFIU5p0zE65G3Rciq4GNtPnN5RcQdYJ6gDZnFtNbjcvZ8pCDdsx7IjdYXs6ihBZp61pkfA7gBDdjlF1d0kwxIs9wWSczJDqolFUadeSxkA4MaA3ZdvPbStd8bLRee-3R3IhplsGOdul5afJqrdDWL_fYECCUWL3D7v8047Uvqz23y_5MqCeie90EgVCp3hDs1yxZhY26v2rmBdpCKL1IVlbnY5qiqQwLnzvAVh7XOwHusac8Vzo3PqTldu1QfdrYFEZA",
  },
  {
    name: "Mom",
    active: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcKNA23u0sDrd-3sJ0asySVT72JSNw7f3YNh6cb8oi_uy0br9-WJOP5jqzaSci8cImuggDpD3rSm5NlpSN7o6UoHEo4_xEC22XM_6AW39hqZrftSuPpuOshJkwNtPa-7_JGyb8t96NAdMGDbyeyNqODdSlYzdpzUbyo1PGnvf4prJxBEawDGxfvIu61rGpaVS37JtAzT0ZkbTQ9ziQFv9qJ-wSg2LDZyyf8a1xR4sNOFi1NkGZBO0Te2Kkr228KLaC0ar90ScSCqI",
  },
];

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, Sarah</Text>
          <Text style={styles.date}>OCT 24 • THURSDAY</Text>
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
        {profiles.map((p) => (
          <View key={p.name} style={styles.profileItem}>
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
        ))}
        <View style={styles.profileItem}>
          <View style={styles.addProfileCircle}>
            <Ionicons name="add" size={24} color={colors.lavender} />
          </View>
          <Text style={styles.profileName}>Add</Text>
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
                  <Text style={styles.medDetail}>5ml • Liquid</Text>
                </View>
              </View>
              <View style={styles.dueBadge}>
                <Ionicons name="time-outline" size={12} color={colors.alertRose} />
                <Text style={styles.dueText}>Due 9:00 AM</Text>
              </View>
            </View>
            <View style={styles.doseCardBottom}>
              <TouchableOpacity
                style={styles.logNowButton}
                onPress={() => router.push("/log-dose")}
              >
                <Ionicons name="checkmark" size={18} color={colors.primaryContent} />
                <Text style={styles.logNowText}>Log Now</Text>
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
                <Text style={styles.widgetLabel}>Weight</Text>
                <Text style={styles.widgetValue}>
                  14.2<Text style={styles.widgetUnit}>kg</Text>
                </Text>
              </View>
              <View style={styles.widgetIconBg}>
                <Ionicons name="scale-outline" size={18} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.widgetFooter}>+0.4kg since last check</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.widget}
            onPress={() => router.push("/medication-insight")}
            activeOpacity={0.8}
          >
            <View style={styles.widgetHeader}>
              <View>
                <Text style={styles.widgetLabel}>Upcoming</Text>
                <Text style={styles.widgetValueSm}>Ibuprofen</Text>
                <Text style={styles.widgetSub}>Tablet • 200mg</Text>
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
          <Text style={styles.sectionTitle}>Yesterday</Text>
          <TouchableOpacity style={styles.yesterdayCard} activeOpacity={0.8}>
            <View style={styles.yesterdayLeft}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
              </View>
              <View>
                <Text style={styles.yesterdayTitle}>All Doses Logged</Text>
                <Text style={styles.yesterdaySubtitle}>Leo had a good day</Text>
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
