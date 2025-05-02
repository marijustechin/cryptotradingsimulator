// src/schemas/ChangePassword.ts
import { z } from "zod";

export const ChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z
        .string()
        .trim()
        .nonempty({ message: t("change_password.current_required") }),

      newPassword: z
        .string()
        .trim()
        .nonempty({ message: t("change_password.new_required") })
        .min(6, { message: t("change_password.min_length") })
        .regex(/^[A-Za-z\d]+$/, {
          message: t("change_password.letters_digits_only")
        })
        .refine(
          (value) => /[A-Za-z]/.test(value) && /\d/.test(value),
          {
            message: t("change_password.must_include_both")
          }
        ),

      repeatPassword: z
        .string()
        .trim()
        .nonempty({ message: t("change_password.repeat_required") }),
    })
    .refine((data) => data.newPassword === data.repeatPassword, {
      path: ["repeatPassword"],
      message: t("change_password.mismatch"),
    });
