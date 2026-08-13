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
  const { token = getToken(), skipAuth = false, headers, body, ...rest } = options;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers as Record<string, string> | undefined),
  };

  if (!skipAuth && token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body,
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  let bodyJson: unknown = null;
  try {
    bodyJson = await res.json();
  } catch {
    bodyJson = null;
  }

  if (res.ok && bodyJson === null) {
    throw new ApiError(
      res.status,
      "Unexpected response from the server. Make sure the backend is running.",
    );
  }

  if (!res.ok) {
    const messageField = (bodyJson as { message?: unknown } | null)?.message;
    const errors = Array.isArray(messageField) ? (messageField as string[]) : undefined;
    let message = errors
      ? errors.join(", ")
      : typeof messageField === "string"
        ? messageField
        : `Request failed with status ${res.status}`;

    if (res.status === 429) {
      message = "Too many requests, please wait a moment and try again";
    }

    throw new ApiError(res.status, message, errors);
  }

  // The backend wraps every successful response in { data: ... } via the
  // global TransformInterceptor. Unwrap it so features keep their shapes.
  const unwrapped = (bodyJson as { data?: unknown } | null)?.data;
  return (unwrapped !== undefined ? unwrapped : bodyJson) as T;
}

/**
 * Mutator used by orval-generated API clients. Orval calls it with
 * `(url, options)` like `fetch`, and we route it through our auth-aware apiFetch.
 */
export async function orvalFetch<T>(url: string, options?: RequestInit): Promise<T> {
  return apiFetch<T>(url, options ?? {});
}
