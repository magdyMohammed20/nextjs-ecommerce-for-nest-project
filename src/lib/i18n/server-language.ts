export type AppLanguage = "en" | "ar";

export const LANGUAGE_COOKIE = "app-language";

export function getServerLanguage(
  cookieValue: string | null,
  acceptLanguage: string | null,
): AppLanguage {
  if (cookieValue === "ar" || cookieValue === "en") return cookieValue;
  if (acceptLanguage?.toLowerCase().startsWith("ar")) return "ar";
  return "en";
}
