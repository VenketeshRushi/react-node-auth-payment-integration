import { z } from 'zod';

export const userStatusQuerySchema = z.object({
  email: z
    .string()
    .transform(str => str.trim())
    .refine(str => str.length > 0, { message: 'Email is required' })
    .transform(str => str.toLowerCase())
    .refine(str => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str), {
      message: 'Invalid email format',
    })
    .refine(str => str.length <= 255, { message: 'Email too long' }),
});
