import { describe, expect, it } from "vitest";
import { categorySchema } from "./category-schema";

const valid = {
  name: "Electronics",
  slug: "electronics",
  sortOrder: 1,
  icon: "zap",
};

describe("categorySchema", () => {
  it("accepts a valid category", () => {
    expect(categorySchema.safeParse(valid).success).toBe(true);
  });

  it("accepts multi-word slugs", () => {
    expect(categorySchema.safeParse({ ...valid, slug: "home-appliances" }).success).toBe(true);
  });

  it("rejects uppercase / space / invalid slugs", () => {
    expect(categorySchema.safeParse({ ...valid, slug: "Electronics" }).success).toBe(false);
    expect(categorySchema.safeParse({ ...valid, slug: "my category" }).success).toBe(false);
    expect(categorySchema.safeParse({ ...valid, slug: "a--b" }).success).toBe(false);
  });

  it("rejects a negative sortOrder", () => {
    expect(categorySchema.safeParse({ ...valid, sortOrder: -1 }).success).toBe(false);
  });

  it("rejects a fractional sortOrder", () => {
    expect(categorySchema.safeParse({ ...valid, sortOrder: 1.5 }).success).toBe(false);
  });

  it("rejects a short name", () => {
    expect(categorySchema.safeParse({ ...valid, name: "E" }).success).toBe(false);
  });
});
