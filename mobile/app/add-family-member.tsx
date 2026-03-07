import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radii } from "@/lib/theme";
import { getStoredUser } from "@/lib/auth";
import { api } from "@/lib/api";

const RELATIONS = [
  'Filho(a)',
  'Cônjuge',
  'Pai/Mãe',
  'Avô(ó)',
  'Irmão(ã)',
  'Outro',
];

export default function AddFamilyMemberScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [weight, setWeight] = useState(""); // MELHORIA 2
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "É preciso permitir acesso às fotos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Nome é obrigatório.");
      return;
    }
    if (!relation) {
      Alert.alert("Atenção", "Selecione a relação familiar.");
      return;
    }
    // Validação do peso (MELHORIA 2)
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0 || parseFloat(weight) > 650) {
      Alert.alert("Atenção", "Peso deve ser entre 0 e 650 kg.");
      return;
    }

    setLoading(true);
    try {
      const user = await getStoredUser();
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      // AGORA: Não precisa mais de familyId - o backend usa o userId
      await api.createFamilyMember({
        createdByUserId: user.id,
        name: name.trim(),
        relation,
        photoUrl: photoUrl || undefined,
        currentWeightKg: weight, // MELHORIA 2
      });

      Alert.alert("Sucesso", "Membro adicionado com sucesso!");
      
      // Voltar e recarregar a lista
      router.push("/(tabs)/dashboard");
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível adicionar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.slate800} />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Membro</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity onPress={pickImage} style={styles.photoButton}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={40} color={colors.lavender} />
              <Text style={styles.photoText}>Toque para adicionar foto</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Maria Silva"
              placeholderTextColor={colors.slate400}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Relação familiar *</Text>
            <View style={styles.relationGrid}>
              {RELATIONS.map((rel) => (
                <TouchableOpacity
                  key={rel}
                  style={[
                    styles.relationButton,
                    relation === rel && styles.relationButtonActive,
                  ]}
                  onPress={() => setRelation(rel)}
                >
                  <Text
                    style={[
                      styles.relationText,
                      relation === rel && styles.relationTextActive,
                    ]}
                  >
                    {rel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Campo de Peso - MELHORIA 2 */}
          <View style={styles.field}>
            <Text style={styles.inputGroupLabel}>Peso atual (kg) *</Text>
            <View style={styles.inputWithSuffix}>
              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={setWeight}
                placeholder="Ex: 14.2"
                keyboardType="decimal-pad"
                placeholderTextColor={colors.slate400}
              />
              <Text style={styles.suffix}>kg</Text>
            </View>
            <Text style={styles.helperText}>Usado para calcular doses seguras</Text>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.slate900} />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Salvar</Text>
                <Ionicons name="checkmark-circle" size={20} color={colors.slate900} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.slate800,
  },
  content: {
    padding: spacing.lg,
  },
  photoButton: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lavenderLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.lavender,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  photoText: {
    fontSize: 11,
    color: colors.lavender,
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.slate800,
  },
  input: {
    height: 52,
    backgroundColor: colors.mintSoft,
    borderRadius: radii.full,
    paddingHorizontal: 18,
    fontSize: 16,
    color: colors.slate900,
  },
  relationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  relationButton: {
    flex: 1,
    minWidth: "45%",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.lg,
    alignItems: "center",
  },
  relationButtonActive: {
    backgroundColor: colors.primary,
  },
  relationText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.slate600,
  },
  relationTextActive: {
    fontWeight: "700",
    color: colors.slate900,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    gap: 8,
    marginTop: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
  },
  // MELHORIA 2 - Estilos do campo de peso
  field: {
    marginBottom: spacing.lg,
  },
  inputGroupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.slate800,
    marginBottom: spacing.sm,
  },
  inputWithSuffix: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.slate200,
    paddingHorizontal: spacing.md,
  },
  weightInput: {
    flex: 1,
    fontSize: 16,
    color: colors.slate900,
    paddingVertical: spacing.md,
  },
  suffix: {
    fontSize: 16,
    color: colors.slate500,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: colors.slate500,
    marginTop: spacing.xs,
  },
});
