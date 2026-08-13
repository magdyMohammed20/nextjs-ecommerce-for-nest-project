import { describe, expect, it } from "vitest";
import { productSchema } from "./product-schema";

const valid = {
  name: "Wireless Mouse",
  price: 24.99,
  description: "A great mouse",
  quantity: 10,
  categoryId: 2,
  imageUrl: "/uploads/mouse.png",
};

describe("productSchema", () => {
  it("accepts a valid product", () => {
    expect(productSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts empty description and imageUrl", () => {
    expect(
      productSchema.safeParse({ ...valid, description: "", imageUrl: "" }).success,
    ).toBe(true);
  });

  it("accepts optional categoryId being undefined", () => {
    const rest = { ...valid } as Partial<typeof valid>;
    delete rest.categoryId;
    expect(productSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects a price of zero or negative", () => {
    expect(productSchema.safeParse({ ...valid, price: 0 }).success).toBe(false);
    expect(productSchema.safeParse({ ...valid, price: -5 }).success).toBe(false);
  });

  it("rejects a price above 500", () => {
    expect(productSchema.safeParse({ ...valid, price: 501 }).success).toBe(false);
  });

  it("rejects a fractional quantity", () => {
    expect(productSchema.safeParse({ ...valid, quantity: 2.5 }).success).toBe(false);
  });

  it("rejects a negative quantity", () => {
    expect(productSchema.safeParse({ ...valid, quantity: -1 }).success).toBe(false);
  });

  it("rejects a short name", () => {
    expect(productSchema.safeParse({ ...valid, name: "M" }).success).toBe(false);
  });

  it("rejects an invalid image URL", () => {
    expect(productSchema.safeParse({ ...valid, imageUrl: "javascript:alert(1)" }).success).toBe(
      false,
    );
  });
});
