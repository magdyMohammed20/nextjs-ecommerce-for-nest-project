import { act, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/features/auth/context/auth-provider";
import i18n from "@/lib/i18n";

export interface RenderWithProvidersOptions {
  lang?: "en" | "ar";
}

export async function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  void options;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, refetchOnWindowFocus: false },
    },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </I18nextProvider>
      </QueryClientProvider>
    );
  }

  const result = render(ui, { wrapper: Wrapper });
  await act(async () => {});
  return result;
}

export function makeToken(payload: Record<string, unknown> = {}) {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(
    JSON.stringify({ iat: 1, exp: 9999999999, ...payload }),
  );
  return `${header}.${body}.signature`;
}

export function setAuthToken(
  role: "admin" | "user" = "admin",
  id = 1,
) {
  document.cookie = `auth_token=${makeToken({ id, role })}; path=/;`;
}

export function clearAuthToken() {
  document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export { i18n };
