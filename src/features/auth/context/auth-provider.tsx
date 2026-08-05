"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "../api/auth-api";
import {
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth-types";
import { clearToken, getToken, setToken } from "@/lib/auth/client";
import { decodeToken } from "@/lib/auth/token";
import i18n from "@/lib/i18n";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    Promise.resolve()
      .then(() => {
        const token = getToken();
        if (!token || !decodeToken(token)) {
          if (token) clearToken();
          return null;
        }
        return authApi.me();
      })
      .then((loadedUser) => {
        if (ignore) return;
        setUser(loadedUser);
        setIsLoading(false);
      })
      .catch(() => {
        if (!ignore) {
          clearToken();
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(
    async (data: LoginPayload) => {
      const res = await authApi.login(data);
      setToken(res.token);
      setUser({
        id: res.id,
        name: res.name,
        email: res.email,
        role: res.role,
        status: res.status,
        avatarUrl: res.avatarUrl,
      });
      toast.success(i18n.t("toasts.welcomeBack", { name: res.name }));
      router.replace(res.role === "admin" ? "/dashboard" : "/my-dashboard");
    },
    [router],
  );

  const register = useCallback(
    async (data: RegisterPayload) => {
      const created = await authApi.register(data);
      toast.success(i18n.t("toasts.accountPendingApproval", { name: created.name }));
      router.replace("/login?pending=1");
    },
    [router],
  );

  const signInWithToken = useCallback(
    async (token: string) => {
      setToken(token);
      const loaded = await authApi.me();
      setUser(loaded);
      toast.success(i18n.t("toasts.welcomeBack", { name: loaded.name }));
      router.replace(loaded.role === "admin" ? "/dashboard" : "/my-dashboard");
    },
    [router],
  );

  const logout = useCallback(async () => {
    clearToken();
    setUser(null);
    try {
      await authApi.logout();
    } catch {
      // token already removed locally
    }
    router.replace("/login");
  }, [router]);

  const updateUser = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      signInWithToken,
      logout,
      updateUser,
    }),
    [user, isLoading, login, register, signInWithToken, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
