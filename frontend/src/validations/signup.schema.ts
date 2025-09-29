import { z } from 'zod';

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'First name is required' })
      .min(2, { message: 'First name must be at least 2 characters' })
      .max(50, { message: 'First name must be less than 50 characters' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'First name can only contain letters and spaces',
      })
      .transform(val => val.trim()),

    lastName: z
      .string()
      .min(1, { message: 'Last name is required' })
      .min(2, { message: 'Last name must be at least 2 characters' })
      .max(50, { message: 'Last name must be less than 50 characters' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Last name can only contain letters and spaces',
      })
      .transform(val => val.trim()),

    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please enter a valid email address' })
      .transform(val => val.trim().toLowerCase()),

    phone: z
      .string()
      .min(1, { message: 'Mobile number is required' })
      .regex(/^\d{10}$/, {
        message: 'Please enter a valid 10-digit mobile number',
      })
      .transform(val => val.replace(/\D/g, '')),

    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
        message:
          'Password must contain uppercase, lowercase, number, and special character',
      }),

    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  emailOtp: z
    .string()
    .min(1, { message: 'Email verification code is required' })
    .regex(/^\d{6}$/, { message: 'Please enter the complete 6-digit code' }),

  mobileOtp: z
    .string()
    .min(1, { message: 'Verification code is required' })
    .regex(/^\d{6}$/, { message: 'Please enter the complete 6-digit code' }),
});

export const step1Schema = signupSchema.omit({ phone: true });
export const phoneSchema = signupSchema.pick({ phone: true });

export type SignupSchema = z.infer<typeof signupSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
