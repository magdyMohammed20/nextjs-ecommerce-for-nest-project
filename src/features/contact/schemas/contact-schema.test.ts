import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact-schema";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Order issue",
  message: "My order has not arrived yet.",
  honeypot: "",
};

describe("contactSchema", () => {
  it("accepts valid contact data", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a missing honeypot", () => {
    const rest = { ...valid } as Partial<typeof valid>;
    delete rest.honeypot;
    expect(contactSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects a filled honeypot (spam)", () => {
    expect(contactSchema.safeParse({ ...valid, honeypot: "x" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });

  it("rejects a short message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "short" }).success).toBe(false);
  });

  it("trims whitespace before validating name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "  " }).success).toBe(false);
  });
});
