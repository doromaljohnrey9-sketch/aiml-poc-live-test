import { z } from "zod";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";

const emailSchema = z.email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long");
const nameSchema = z.string().min(2, "Name must be at least 2 characters long");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum([ROLES.ADMIN, ROLES.OPERATOR, ROLES.CONTRIBUTOR], {
    message: "Please select a role",
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
