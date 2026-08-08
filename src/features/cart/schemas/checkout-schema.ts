import { z } from "zod";

export const checkoutSchema = z.object({
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 characters")
    .max(30, "Phone number must be at most 30 characters"),
  street: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address must be at most 200 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters"),
  state: z
    .string()
    .min(1, "State / Province is required")
    .max(100, "State / Province must be at most 100 characters"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code must be at most 20 characters"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must be at most 100 characters"),
  notes: z
    .string()
    .max(500, "Notes must be at most 500 characters")
    .optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
