import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  subject: z
    .string()
    .trim()
    .min(2, "Subject must be at least 2 characters")
    .max(200, "Subject must be at most 200 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
  honeypot: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
