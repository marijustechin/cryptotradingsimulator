import * as z from "zod";

export const SignupSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(2, { message: "First name must be at least 2 characters long" })
      .max(30, { message: "First name must be at most 30 characters long" })
      .nonempty({ message: "First name is required" }),
    email: z
      .string()
      .trim()
      .email({ message: "Invalid email format" })
      .nonempty({ message: "Email is required" }),
    password: z
      .string()
      .trim()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: "Password must contain at least one letter and one number",
      })
      .nonempty({ message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .nonempty({ message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });
