const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://YOUR_REPLIT_URL";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
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
