import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, radii } from "@/lib/theme";
import { getStoredUser, logout, AuthUser } from "@/lib/auth";

type SettingsItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  action?: () => void;
};

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    getStoredUser().then(setUser);
  }, []);

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  const settingsItems: SettingsItem[] = [
    { icon: "people-outline", label: "Gerenciar Perfis" },
    { icon: "notifications-outline", label: "Notificações" },
    { icon: "shield-checkmark-outline", label: "Privacidade" },
    { icon: "color-palette-outline", label: "Aparência" },
    { icon: "help-circle-outline", label: "Ajuda" },
    {
      icon: "log-out-outline",
      label: "Sair",
      color: colors.alertRose,
      action: handleLogout,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name || "Usuário"}</Text>
            <Text style={styles.profileEmail}>{user?.email || ""}</Text>
          </View>
        </View>

        <View style={styles.section}>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.row}
              onPress={item.action}
            >
              <View style={styles.rowLeft}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.color || colors.textMain}
                />
                <Text
                  style={[
                    styles.rowLabel,
                    item.color ? { color: item.color } : null,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.slate400}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>Gentle Care v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: colors.slate900 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 20,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mintSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: { fontSize: 18, fontWeight: "700", color: colors.slate900 },
  profileEmail: { fontSize: 14, color: colors.slate500 },
  section: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    overflow: "hidden",
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate100,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  rowLabel: { fontSize: 16, fontWeight: "500", color: colors.textMain },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: colors.slate400,
    marginTop: spacing.sm,
  },
});
