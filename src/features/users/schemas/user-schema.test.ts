import { describe, expect, it } from "vitest";
import { createUserSchema, editUserSchema } from "./user-schema";

const validCreate = {
  name: "Jane Doe",
  email: "jane@example.com",
  password: "Abcd1234!",
  role: "user",
};

describe("createUserSchema", () => {
  it("accepts a valid user", () => {
    expect(createUserSchema.safeParse(validCreate).success).toBe(true);
  });

  it("accepts admin role", () => {
    expect(createUserSchema.safeParse({ ...validCreate, role: "admin" }).success).toBe(true);
  });

  it("rejects an invalid role", () => {
    const result = createUserSchema.safeParse({ ...validCreate, role: "moderator" });
    expect(result.success).toBe(false);
  });
});

describe("editUserSchema", () => {
  const base = {
    name: "Jane Doe",
    email: "jane@example.com",
    password: "",
    role: "user",
    status: "active",
  };

  it("accepts valid data with an empty password", () => {
    expect(editUserSchema.safeParse(base).success).toBe(true);
  });

  it("accepts a new password", () => {
    expect(editUserSchema.safeParse({ ...base, password: "Abcd1234!" }).success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = editUserSchema.safeParse({ ...base, status: "banned" });
    expect(result.success).toBe(false);
  });

  it("rejects a short name", () => {
    expect(editUserSchema.safeParse({ ...base, name: "A" }).success).toBe(false);
  });
});
