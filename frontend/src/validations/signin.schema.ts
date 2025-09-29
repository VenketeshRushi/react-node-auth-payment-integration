import { z } from 'zod';

export const emailSigninSchema = z.object({
  email: z
    .string()
    .min(1, { error: 'Email is required' })
    .transform(val => val.trim())
    .refine(val => z.email().safeParse(val).success, {
      message: 'Please enter a valid email address',
    }),

  password: z
    .string()
    .min(1, { error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters' }),
});

export const mobileSigninSchema = z.object({
  mobile: z
    .string()
    .min(1, { error: 'Mobile number is required' })
    .regex(/^[6-9]\d{9}$/, {
      message: 'Please enter a valid 10-digit mobile number',
    })
    .transform(val => val.replace(/\D/g, '')),

  otp: z
    .string()
    .min(1, { error: 'OTP is required' })
    .length(6, { error: 'OTP must be exactly 6 digits' })
    .regex(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
});

export type EmailFormData = z.infer<typeof emailSigninSchema>;
export type MobileFormData = z.infer<typeof mobileSigninSchema>;
