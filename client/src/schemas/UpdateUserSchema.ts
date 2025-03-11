import * as z from 'zod';

export const UpdateUserSchema = z.object({
  first_name: z
    .string({
      required_error: 'First name is required',
    })
    .trim()
    .nonempty({ message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters long' })
    .max(30, { message: 'First name must be at most 30 characters long' })
    .regex(/^[\p{L}'-]+(?: [\p{L}'-]+)*$/u, {
      message: 'First name contains excessive stacked characters',
    }),
  last_name: z
    .string({
      required_error: 'Last name is required',
    })
    .trim()
    .nonempty({ message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .max(30, { message: 'Last name must be at most 30 characters long' })
    .regex(/^[\p{L}'-]+(?: [\p{L}'-]+)*$/u, {
      message: 'Last name contains excessive stacked characters',
    }),
  address: z.string().trim(),
  phone_number: z
    .string()
    .trim()
    .nonempty({ message: 'Phone number is required' })
    .min(11, {
      message: 'Phone number consists of 11 digits omiting plus "+" sign',
    })
    .max(11, {
      message: 'Phone number consists of 11 digits omiting plus "+" sign',
    })
    .regex(/^\d+$/, { message: 'Only digits allowed' }),
  email: z
    .string()
    .trim()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
});
