import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .trim()
      .nonempty({ message: "Current password is required" }),

    newPassword: z
      .string()
      .trim()
      .nonempty({ message: "New password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/^[A-Za-z\d]+$/, {
        message: "Password should contain only letters and digits"
      })
      .refine(value => /[A-Za-z]/.test(value) && /\d/.test(value), { message: "Password should contain letters and digits" }),

    repeatPassword: z
      .string()
      .trim()
      .nonempty({ message: "Repeat password is required" }),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match",
  });
