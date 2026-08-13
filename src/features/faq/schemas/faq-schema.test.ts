import { describe, expect, it } from "vitest";
import { faqSchema } from "./faq-schema";

const valid = {
  questionEn: "How do I return an item?",
  questionAr: "كيف أرجع منتجاً؟",
  answerEn: "Contact support within 14 days.",
  answerAr: "تواصل مع الدعم خلال 14 يوماً.",
  sortOrder: 3,
  isActive: true,
};

describe("faqSchema", () => {
  it("accepts valid FAQ data", () => {
    expect(faqSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts isActive false", () => {
    expect(faqSchema.safeParse({ ...valid, isActive: false }).success).toBe(true);
  });

  it("rejects missing bilingual content", () => {
    expect(faqSchema.safeParse({ ...valid, questionAr: "" }).success).toBe(false);
    expect(faqSchema.safeParse({ ...valid, answerEn: "" }).success).toBe(false);
  });

  it("rejects a negative sortOrder", () => {
    expect(faqSchema.safeParse({ ...valid, sortOrder: -1 }).success).toBe(false);
  });
});
