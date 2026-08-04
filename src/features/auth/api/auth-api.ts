import { apiFetch } from "@/lib/api-client";
import { getToken } from "@/lib/auth/client";
import { API_URL } from "@/lib/env";
import {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
} from "../types/auth-types";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  avatarUrl?: string;
}

export interface UploadAvatarResponse {
  url: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    apiFetch<LoginResponse>("/user/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  register: (data: RegisterPayload) =>
    apiFetch<AuthUser>("/user/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () =>
    apiFetch<{ message: string }>("/user/logout", {
      method: "POST",
      skipAuth: true,
    }),
  me: () => apiFetch<AuthUser>("/user/me", { method: "GET" }),
  updateMe: (data: UpdateProfilePayload) =>
    apiFetch<AuthUser>("/user/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/user/avatar/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      let message = `Upload failed with status ${res.status}`;
      try {
        const body = await res.json();
        const field = body?.message;
        message = Array.isArray(field) ? field.join(", ") : (field ?? message);
      } catch {
        // keep default message
      }
      throw new Error(message);
    }

    return (await res.json()) as UploadAvatarResponse;
  },
};
