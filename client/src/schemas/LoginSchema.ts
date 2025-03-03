import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().trim().email({ message: "Invalid email format" }),
    password: z.string().trim().min(1, { message: "Don't forget to enter your password" }),
  });