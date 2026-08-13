import { describe, expect, it } from "vitest";
import { checkoutSchema } from "./checkout-schema";

const valid = {
  phone: "01012345678",
  street: "1 Main St",
  city: "Cairo",
  state: "Cairo",
  postalCode: "12345",
  country: "Egypt",
  notes: "",
};

describe("checkoutSchema", () => {
  it("accepts valid checkout data", () => {
    expect(checkoutSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts optional notes", () => {
    const rest = { ...valid } as Partial<typeof valid>;
    delete rest.notes;
    expect(checkoutSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects a too-short phone", () => {
    expect(checkoutSchema.safeParse({ ...valid, phone: "123" }).success).toBe(false);
  });

  it("rejects missing required fields", () => {
    expect(checkoutSchema.safeParse({ ...valid, street: "" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, city: "" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, country: "" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, postalCode: "" }).success).toBe(false);
  });
});
