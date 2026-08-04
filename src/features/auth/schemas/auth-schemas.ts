import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const profileImageUrlSchema = z.string().refine(
  (value) => {
    if (value === "") return true;
    if (value.startsWith("/uploads/")) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Enter a valid image URL" },
);

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    avatarUrl: profileImageUrlSchema,
    password: z
      .union([
        z.literal(""),
        z
          .string()
          .min(8, "Password must be at least 8 characters")
          .max(100, "Password must be at most 100 characters")
          .regex(
            passwordRegex,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          ),
      ])
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password) {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    }
  });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
