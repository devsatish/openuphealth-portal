import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@openup/types";
import { setToken, getToken, clearToken } from "../api/tokenStorage";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const storedToken = await getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      // Validate the token by fetching the current user
      const res = await fetch("http://localhost:3000/api/users/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const payload = await res.json();
        setTokenState(storedToken);
        setUser(payload.data as User);
      } else {
        // Token is invalid, clear it
        await clearToken();
      }
    } catch {
      // Network error or server down - clear stale token
      await clearToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("http://localhost:3000/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await res.json();
    if (!res.ok || payload.error) {
      throw new Error(payload.error || "Login failed");
    }
    const { token: newToken, user: newUser } = payload.data as { token: string; user: User };
    await setToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await clearToken();
    setTokenState(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
