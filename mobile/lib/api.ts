// Use environment variable or default to local development server
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://192.168.18.149:5000";

async function apiFetch(path: string, options?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `API error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error: any) {
    // Handle network errors specifically
    if (error.message.includes("Network request failed") || error.name === "TypeError") {
      console.error("Network error - check if backend is running at:", API_BASE);
      throw new Error(`Erro de conexão. Verifique se o servidor está rodando em ${API_BASE}`);
    }
    throw error;
  }
}

export const api = {
  login: (email: string, password: string) =>
    apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getProfiles: () => apiFetch("/api/profiles"),
  getMedications: (profileId?: number) =>
    apiFetch(profileId ? `/api/medications?profileId=${profileId}` : "/api/medications"),
  getLogs: (profileId?: number) =>
    apiFetch(profileId ? `/api/logs?profileId=${profileId}` : "/api/logs"),
  createLog: (data: {
    profileId: number;
    medicationId?: number;
    type: string;
    amount?: string;
    unit?: string;
    value?: string;
    notes?: string;
  }) => apiFetch("/api/logs", { method: "POST", body: JSON.stringify(data) }),
  seed: () => apiFetch("/api/seed", { method: "POST" }),
};
