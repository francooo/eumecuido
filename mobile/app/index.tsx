import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radii } from "@/lib/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      bounces={false}
    >
      <View style={styles.illustrationArea}>
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-gvMLXig3vT7-FfWnqwJddVl-AzTVzew6zDVN6seImiHYpMeja0kVPiAD83aApGad-7TPVmozB2vBhe-JPIdcUMrbiVFaaJJOrjfnsM8YMywnDHjN1gJ0_MiXDrV4U_B3XjaOGRzkDPXvV3goL5u5LgfG3pUnGaMwmahk-jBZnXMKb1iau6VT3aEVw48_EtgLTZdDF_gDx1ImhGsvclkTXcm0BiIOcSpiv_AOqrSvj7X0h7kXuglcI-3dNOJrg2RanNrdiL7duL0",
          }}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.brandSection}>
        <View style={styles.iconCircle}>
          <Ionicons name="leaf" size={28} color={colors.primary} />
        </View>
        <Text style={styles.title}>Gentle Care</Text>
        <Text style={styles.subtitle}>Health tracking, simplified.</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => router.replace("/(tabs)/dashboard")}
        >
          <Ionicons name="logo-google" size={20} color={colors.slate800} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR LOGIN WITH EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.emailRow}>
          <Ionicons
            name="mail-outline"
            size={20}
            color={colors.slate400}
            style={styles.emailIcon}
          />
          <TextInput
            style={styles.emailInput}
            placeholder="hello@email.com"
            placeholderTextColor={colors.slate400}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.replace("/(tabs)/dashboard")}
        >
          <Text style={styles.loginText}>Step Inside</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.slate900} />
        </TouchableOpacity>

        <Text style={styles.signupText}>
          New here?{" "}
          <Text style={styles.signupLink}>Create an account</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    flexGrow: 1,
  },
  illustrationArea: {
    height: 300,
    backgroundColor: "#e8f5f1",
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  blob1: {
    position: "absolute",
    top: 40,
    right: 40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(43, 238, 186, 0.1)",
  },
  blob2: {
    position: "absolute",
    top: 80,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(184, 184, 209, 0.2)",
  },
  illustration: {
    width: "80%",
    height: 240,
    marginBottom: 16,
  },
  brandSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.slate900,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: colors.slate500,
    fontWeight: "500",
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    backgroundColor: colors.white,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.slate100,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.slate800,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.slate200,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 10,
    fontWeight: "700",
    color: colors.slate400,
    letterSpacing: 1.5,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: colors.mintSoft,
    borderRadius: radii.full,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  emailIcon: {
    marginRight: 12,
  },
  emailInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: colors.slate900,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
  },
  signupText: {
    textAlign: "center",
    color: colors.slate500,
    fontSize: 14,
    marginTop: 20,
  },
  signupLink: {
    color: colors.primaryDark,
    fontWeight: "700",
  },
});
