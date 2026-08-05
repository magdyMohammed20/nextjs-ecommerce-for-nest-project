import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  price: z
    .number({ message: "Price must be a number" })
    .min(0.01, "Price must be greater than 0")
    .max(500, "Price must not exceed 500"),
  description: z.string().max(500).optional().or(z.literal("")),
  quantity: z
    .number({ message: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative"),
  categoryId: z
    .number({ message: "Category must be a number" })
    .int("Category must be a whole number")
    .min(1, "Category is invalid")
    .optional(),
  imageUrl: z
    .string()
    .max(500)
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("/uploads/") ||
        /^https?:\/\/.+/i.test(value),
      "Enter a valid image URL or use the upload button",
    )
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
