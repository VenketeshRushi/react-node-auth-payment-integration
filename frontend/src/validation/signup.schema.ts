import { z } from 'zod';

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),

    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),

    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),

    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number')
      .transform(val => val.replace(/\D/g, '')),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpSchema = z.object({
  emailOtp: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit email OTP'),
  mobileOtp: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit mobile OTP'),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type OtpSchema = z.infer<typeof otpSchema>;
