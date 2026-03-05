import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";

const AUTH_KEY = "gentle_care_user";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export async function getStoredUser(): Promise<AuthUser | null> {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function storeUser(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const result = await api.login(email, password);
  await storeUser(result.user);
  return result.user;
}

export async function register(name: string, email: string, password: string): Promise<AuthUser> {
  const result = await api.register(name, email, password);
  await storeUser(result.user);
  return result.user;
}

export async function logout(): Promise<void> {
  await clearUser();
}
