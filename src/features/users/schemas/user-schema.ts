import { z } from "zod";
import { passwordRegex } from "@/features/auth/schemas/auth-schemas";

export const editUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .max(100)
    .optional()
    .or(z.literal(""))
    .describe("Leave blank to keep the current password"),
  role: z.enum(["admin", "user"], { message: "Role is required" }),
  status: z.enum(["pending", "active", "rejected"], {
    message: "Status is required",
  }),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;

export const createUserSchema = z.object({
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
  role: z.enum(["admin", "user"], { message: "Role is required" }),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
