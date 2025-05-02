// src/schemas/Login.ts
import * as z from "zod";

export const LoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .trim()
      .nonempty({ message: t("auth_login.email_required") })
      .email({ message: t("auth_login.email_invalid") }),
    password: z
      .string()
      .trim()
      .min(1, { message: t("auth_login.password_required") }),
  });
