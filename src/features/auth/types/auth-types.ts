export type UserRole = "admin" | "user";

export type UserStatus = "pending" | "active" | "rejected";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse extends AuthUser {
  message: string;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
