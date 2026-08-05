import { z } from "zod";

export const faqSchema = z.object({
  questionEn: z
    .string()
    .min(2, "Question (EN) must be at least 2 characters")
    .max(500, "Question (EN) must be at most 500 characters"),
  questionAr: z
    .string()
    .min(2, "Question (AR) must be at least 2 characters")
    .max(500, "Question (AR) must be at most 500 characters"),
  answerEn: z
    .string()
    .min(2, "Answer (EN) must be at least 2 characters")
    .max(500, "Answer (EN) must be at most 500 characters"),
  answerAr: z
    .string()
    .min(2, "Answer (AR) must be at least 2 characters")
    .max(500, "Answer (AR) must be at most 500 characters"),
  sortOrder: z
    .number({ message: "Sort order must be a number" })
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative"),
  isActive: z.boolean(),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
