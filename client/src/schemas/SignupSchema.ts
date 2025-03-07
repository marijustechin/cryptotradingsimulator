import * as z from "zod";

export const SignupSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .nonempty({ message: "First name is required" })
      .min(2, { message: "First name must be at least 2 characters long" })
      .max(30, { message: "First name must be at most 30 characters long" })
      .regex(/^[\p{L}'-]+(?: [\p{L}'-]+)*$/u, {
        message: "First name contains excessive stacked characters",
      }),
    email: z
      .string()
      .trim()
      .nonempty({ message: "Email is required" })
      .email({ message: "Invalid email format" }),
    password: z
      .string()
      .trim()
      .nonempty({ message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: "Password must contain at least one letter and one number",
      }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Please confirm your password" })
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
