import * as z from 'zod';

export const SignupSchema = z
  .object({
    first_name: z
      .string({
        required_error: 'First name is required',
      })
      .trim()
      .nonempty({ message: 'First name is required' })
      .min(2, { message: 'First name must be at least 2 characters' })
      .max(30, { message: 'First name must be at most 30 characters' })
      .regex(/^[\p{L}](?!.*['-]{2})[\p{L}'-]*$/u, {
        message: 'First name contains excessive stacked characters',
      }),
    email: z
      .string()
      .trim()
      .nonempty({ message: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    password: z
      .string()
      .trim()
      .nonempty({ message: 'Password is required' })
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: 'Password should contain letters and digits',
      }),
    confirmPassword: z
      .string()
      .trim()
      .nonempty({ message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
