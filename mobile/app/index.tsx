import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radii } from "@/lib/theme";
import { login, getStoredUser } from "@/lib/auth";

export default function WelcomeScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getStoredUser().then((user) => {
      if (user) {
        router.replace("/(tabs)/dashboard");
      } else {
        setCheckingAuth(false);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Atenção", "Por favor, insira seu email.");
      return;
    }
    if (!password) {
      Alert.alert("Atenção", "Por favor, insira sua senha.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      Alert.alert(
        "Erro ao entrar",
        error.message || "Email ou senha incorretos."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        keyboardShouldPersistTaps="handled"
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
          <Text style={styles.subtitle}>Acompanhamento de saúde, simplificado.</Text>
        </View>

        <View style={styles.actionsSection}>
          <View style={styles.inputGroup}>
            <View style={styles.emailRow}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.slate400}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.emailInput}
                placeholder="seu@email.com"
                placeholderTextColor={colors.slate400}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.emailRow}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.slate400}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.emailInput}
                placeholder="Senha"
                placeholderTextColor={colors.slate400}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.slate400}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.slate900} />
            ) : (
              <>
                <Text style={styles.loginText}>Entrar</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.slate900}
                />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupText}>
              Novo aqui?{" "}
              <Text style={styles.signupLink}>Criar uma conta</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
  },
  illustrationArea: {
    height: 260,
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
    height: 220,
    marginBottom: 16,
  },
  brandSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 12,
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
  inputGroup: {
    marginBottom: 12,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: colors.mintSoft,
    borderRadius: radii.full,
    paddingHorizontal: 20,
  },
  inputIcon: {
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
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
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
