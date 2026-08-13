import { describe, expect, it } from "vitest";
import {
  loginSchema,
  registerSchema,
  passwordRegex,
  updateProfileSchema,
  profileImageUrlSchema,
} from "./auth-schemas";

describe("loginSchema", () => {
  it("accepts a valid email + password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "nope", password: "x" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Enter a valid email address");
    }
  });

  it("rejects a missing password", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "Abcd1234!",
  };

  it("accepts a strong password", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a short name", () => {
    const result = registerSchema.safeParse({ ...valid, name: "Jo" });
    expect(result.success).toBe(false);
  });

  it("rejects a weak password", () => {
    const result = registerSchema.safeParse({ ...valid, password: "abcd" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (i) => i.code === "invalid_string" && i.validation === "regex",
        ),
      ).toBe(true);
    }
  });

  it("password regex requires upper, lower, digit, and special char", () => {
    expect(passwordRegex.test("Abcd1234!")).toBe(true);
    expect(passwordRegex.test("abcd1234!")).toBe(false);
    expect(passwordRegex.test("ABCD1234!")).toBe(false);
    expect(passwordRegex.test("AbcdEFGh!")).toBe(false);
    expect(passwordRegex.test("Abcd1234")).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  const base = {
    name: "Jane Doe",
    email: "jane@example.com",
    avatarUrl: "",
  };

  it("accepts valid data with no password", () => {
    expect(updateProfileSchema.safeParse(base).success).toBe(true);
  });

  it("accepts a matching password + confirmPassword", () => {
    expect(
      updateProfileSchema.safeParse({ ...base, password: "Abcd1234!", confirmPassword: "Abcd1234!" })
        .success,
    ).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = updateProfileSchema.safeParse({
      ...base,
      password: "Abcd1234!",
      confirmPassword: "Different1!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a weak new password", () => {
    const result = updateProfileSchema.safeParse({
      ...base,
      password: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });

  it("ignores empty-string password", () => {
    expect(
      updateProfileSchema.safeParse({ ...base, password: "", confirmPassword: "" }).success,
    ).toBe(true);
  });
});

describe("profileImageUrlSchema", () => {
  it("accepts empty, /uploads/, and http(s) URLs", () => {
    expect(profileImageUrlSchema.safeParse("").success).toBe(true);
    expect(profileImageUrlSchema.safeParse("/uploads/avatar.jpg").success).toBe(true);
    expect(profileImageUrlSchema.safeParse("https://cdn.example.com/a.png").success).toBe(true);
  });

  it("rejects garbage", () => {
    expect(profileImageUrlSchema.safeParse("not a url").success).toBe(false);
    expect(profileImageUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });
});
