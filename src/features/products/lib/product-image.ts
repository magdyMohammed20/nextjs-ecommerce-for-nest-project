import { API_URL } from "@/lib/env";

const UPLOAD_PREFIX = "/uploads/";

export function getProductImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith(UPLOAD_PREFIX)) {
    return `${API_URL}${url}`;
  }
  return url;
}
