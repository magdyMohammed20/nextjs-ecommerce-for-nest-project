import { API_URL } from "./env";
import { getToken } from "./auth/client";

export class ApiError extends Error {
  status: number;
  errors?: string[];

  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

type ApiFetchOptions = RequestInit & {
  token?: string;
  skipAuth?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { token = getToken(), skipAuth = false, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (!skipAuth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const messageField = (body as { message?: unknown } | null)?.message;
    const errors = Array.isArray(messageField) ? (messageField as string[]) : undefined;
    const message = errors
      ? errors.join(", ")
      : typeof messageField === "string"
        ? messageField
        : `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, errors);
  }

  return body as T;
}
