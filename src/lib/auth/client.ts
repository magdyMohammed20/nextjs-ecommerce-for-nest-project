import { TOKEN_COOKIE } from "./token";

export function getToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
  return match ? match.split("=").slice(1).join("=") : "";
}

export function setToken(token: string): void {
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=86400; samesite=lax`;
}

export function clearToken(): void {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
