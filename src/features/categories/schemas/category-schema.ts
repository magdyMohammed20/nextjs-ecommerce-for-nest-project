import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(120, "Slug must be at most 120 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  sortOrder: z
    .number({ message: "Sort order must be a number" })
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative"),
  icon: z.string().max(50, "Icon key is too long").optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
