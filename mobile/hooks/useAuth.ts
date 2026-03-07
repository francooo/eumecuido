import { useState, useEffect } from 'react';
import { getStoredUser, clearUser } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const storedUser = await getStoredUser();
      setUser(storedUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await clearUser();
    setUser(null);
  }

  return { user, loading, logout, refreshUser: loadUser };
}
