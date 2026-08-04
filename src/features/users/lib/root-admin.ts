export const ROOT_ADMIN_EMAIL = "admin@example.com";

export function isRootAdmin(email: string | undefined | null) {
  return email?.toLowerCase() === ROOT_ADMIN_EMAIL;
}
