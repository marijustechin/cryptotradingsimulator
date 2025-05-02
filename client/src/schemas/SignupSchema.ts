// src/schemas/SignupSchema.ts
import * as z from 'zod';

export const SignupSchema = (t: (key: string) => string) =>
  z
    .object({
      first_name: z
        .string({
          required_error: t('auth_register.first_name_required'),
        })
        .trim()
        .nonempty({ message: t('auth_register.first_name_required') })
        .min(2, { message: t('auth_register.first_name_min') })
        .max(30, { message: t('auth_register.first_name_max') })
        .regex(/^[\p{L}](?!.*['-]{2})[\p{L}'-]*$/u, {
          message: t('auth_register.first_name_invalid'),
        }),

      email: z
        .string()
        .trim()
        .nonempty({ message: t('auth_register.email_required') })
        .email({ message: t('auth_register.email_invalid') }),

      password: z
        .string()
        .trim()
        .nonempty({ message: t('auth_register.password_required') })
        .min(6, { message: t('auth_register.password_min') })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
          message: t('auth_register.password_invalid'),
        }),

      confirmPassword: z
        .string()
        .trim()
        .nonempty({ message: t('auth_register.confirm_password_required') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('auth_register.passwords_do_not_match'),
    });
