import * as z from 'zod';
import { TFunction } from 'i18next';

export const UpdateUserSchema = (t: TFunction) =>
  z.object({
    first_name: z
      .string({ message: t('form_error_first_name_required') })
      .trim()
      .nonempty({ message: t('form_error_first_name_required') })
      .min(2, { message: t('form_error_first_name_min') })
      .max(30, { message: t('form_error_first_name_max') })
      .regex(/^[\p{L}'-]+(?: [\p{L}'-]+)*$/u, {
        message: t('form_error_first_name_regex'),
      }),

    last_name: z
      .string({ message: t('form_error_last_name_required') })
      .trim()
      .nonempty({ message: t('form_error_last_name_required') })
      .min(2, { message: t('form_error_last_name_min') })
      .max(30, { message: t('form_error_last_name_max') })
      .regex(/^[\p{L}'-]+(?: [\p{L}'-]+)*$/u, {
        message: t('form_error_last_name_regex'),
      }),

    address: z
      .string({ message: t('form_error_address_required') })
      .trim()
      .min(3, { message: t('form_error_address_required') }),

    phone_number: z
      .string({ message: t('form_error_phone_required') })
      .trim()
      .nonempty({ message: t('form_error_phone_required') })
      .min(11, { message: t('form_error_phone_minmax') })
      .max(11, { message: t('form_error_phone_minmax') })
      .regex(/^\d+$/, { message: t('form_error_phone_digits') }),

    email: z
      .string({ message: t('form_error_email_required') })
      .trim()
      .nonempty({ message: t('form_error_email_required') })
      .email({ message: t('form_error_email_invalid') }),
  });
