import { z } from 'zod';

export const emailSigninSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const mobileSigninSchema = z.object({
  mobile: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .transform(val => val.replace(/\D/g, '')),

  otp: z
    .string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

export type EmailFormData = z.infer<typeof emailSigninSchema>;
export type MobileFormData = z.infer<typeof mobileSigninSchema>;
