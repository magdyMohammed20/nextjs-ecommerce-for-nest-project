export type UserRole = "admin" | "user";

export const TOKEN_COOKIE = "auth_token";

export interface TokenPayload {
  id: number;
  role: UserRole;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const part = token.split(".")[1];
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
}
