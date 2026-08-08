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
import { mergeGuestCart } from "@/features/cart/lib/guest-cart";
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

function safeNextPath(): string | null {
  if (typeof window === "undefined") return null;
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

function resolveAuthTarget(role: AuthUser["role"]): string {
  return safeNextPath() ?? (role === "admin" ? "/dashboard" : "/my-dashboard");
}

function navigateAfterAuth(
  router: ReturnType<typeof useRouter>,
  target: string,
): void {
  router.replace(target);
  // Defensive fallback: if the client router fails to leave /login (stale
  // tab, cached bundle, middleware race), force a full navigation so the
  // login always completes and lands on the target page.
  window.setTimeout(() => {
    if (window.location.pathname.startsWith("/login")) {
      window.location.assign(target);
    }
  }, 3000);
}

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
      // Merge before navigating so the landing page's cart fetch already sees
      // the guest items (avoids an empty-cart flash / stale fetch race).
      await mergeGuestCart();
      navigateAfterAuth(router, resolveAuthTarget(res.role));
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
      await mergeGuestCart();
      navigateAfterAuth(router, resolveAuthTarget(loaded.role));
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // token is cleared locally regardless
    }
    clearToken();
    setUser(null);
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
