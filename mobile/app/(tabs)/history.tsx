import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";

type LogEntry = {
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  title: string;
  detail: string;
  time: string;
  dot?: string;
};

const todayLogs: LogEntry[] = [
  {
    icon: "medical",
    iconBg: "rgba(43, 238, 186, 0.1)",
    iconColor: colors.primary,
    title: "Ibuprofen",
    detail: "5ml • Leo",
    time: "08:30 AM",
    dot: colors.primary,
  },
  {
    icon: "scale-outline",
    iconBg: "rgba(59, 130, 246, 0.08)",
    iconColor: "#3b82f6",
    title: "Weight Check",
    detail: "14.2kg • Leo",
    time: "08:15 AM",
  },
];

const yesterdayLogs: LogEntry[] = [
  {
    icon: "medkit",
    iconBg: "rgba(43, 238, 186, 0.1)",
    iconColor: colors.primary,
    title: "Amoxicillin",
    detail: "5ml • Leo",
    time: "08:00 PM",
  },
  {
    icon: "thermometer-outline",
    iconBg: "rgba(232, 157, 157, 0.1)",
    iconColor: colors.alertRose,
    title: "Temperature",
    detail: "38.5°C • Leo",
    time: "07:45 PM",
    dot: colors.alertRose,
  },
  {
    icon: "document-text-outline",
    iconBg: "rgba(251, 146, 60, 0.1)",
    iconColor: "#fb923c",
    title: "Doctor Note",
    detail: '"Drink plenty of water"',
    time: "10:00 AM",
  },
];

function LogCard({ entry }: { entry: LogEntry }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.cardIcon, { backgroundColor: entry.iconBg }]}>
          <Ionicons name={entry.icon} size={22} color={entry.iconColor} />
        </View>
        <View>
          <Text style={styles.cardTitle}>{entry.title}</Text>
          <Text style={styles.cardDetail}>{entry.detail}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardTime}>{entry.time}</Text>
        {entry.dot && (
          <View style={[styles.cardDot, { backgroundColor: entry.dot }]} />
        )}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const filters = ["All", "Leo", "Dad", "Mom"];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.slate800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History Log</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="filter" size={22} color={colors.slate800} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((f, i) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, i === 0 && styles.filterChipActive]}
          >
            <Text
              style={[styles.filterText, i === 0 && styles.filterTextActive]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.group}>
          <Text style={styles.groupTitle}>Today</Text>
          {todayLogs.map((e, i) => (
            <LogCard key={i} entry={e} />
          ))}
        </View>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Yesterday</Text>
          {yesterdayLogs.map((e, i) => (
            <LogCard key={i} entry={e} />
          ))}
        </View>

        <View style={styles.endMarker}>
          <Text style={styles.endText}>End of history for this week</Text>
        </View>
      </ScrollView>

      <View style={styles.shareContainer}>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={20} color={colors.white} />
          <Text style={styles.shareText}>Share with Doctor</Text>
        </TouchableOpacity>
      </View>
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.slate100,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: colors.slate900 },
  filterScroll: { maxHeight: 50, paddingLeft: spacing.lg },
  filterContent: { gap: 10, paddingRight: spacing.lg },
  filterChip: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.slate100,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { fontSize: 14, fontWeight: "500", color: colors.slate800 },
  filterTextActive: { fontWeight: "700", color: colors.slate900 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  group: { marginBottom: spacing.lg },
  groupTitle: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: colors.slate400,
    marginBottom: 12,
    paddingLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.slate800 },
  cardDetail: { fontSize: 14, fontWeight: "500", color: colors.slate500 },
  cardRight: { alignItems: "flex-end", gap: 6 },
  cardTime: { fontSize: 12, fontWeight: "600", color: colors.slate400 },
  cardDot: { width: 8, height: 8, borderRadius: 4 },
  endMarker: { alignItems: "center", paddingVertical: 24 },
  endText: { fontSize: 12, color: colors.slate400, fontStyle: "italic" },
  shareContainer: {
    position: "absolute",
    bottom: 96,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.slate900,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: radii.full,
    width: "100%",
    shadowColor: colors.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  shareText: { fontSize: 16, fontWeight: "700", color: colors.white },
});
