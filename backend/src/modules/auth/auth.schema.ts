import { validateIndianMobile } from '@/utils/ext.js';
import { z } from 'zod';

const mobileSchema = z.string().refine(val => validateIndianMobile(val), {
  message: 'Invalid mobile number format',
});

export const machineIdSchema = z.object({
  'x-machine-id': z
    .string()
    .uuid({ version: 'v4', message: 'Invalid machine ID format' })
    .optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be at most 100 characters' })
    .refine(str => /^[\p{L}\p{M}\s.'-]+$/u.test(str), {
      message: 'Name contains invalid characters',
    }),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email too long' }),
  mobile_no: mobileSchema,
  password: z
    .string()
    .min(8, { message: 'Password must be between 8 and 128 characters' })
    .max(128, { message: 'Password must be between 8 and 128 characters' })
    .refine(
      str => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(str),
      {
        message:
          'Password must contain uppercase, lowercase, number, and special character',
      }
    ),
});

export const verifyOTPSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email too long' }),
  mobile_no: mobileSchema,
  type: z.enum(['email', 'mobile'], {
    message: "Type must be 'email' or 'mobile'",
  }),
  otp: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 digits' })
    .refine(str => /^\d{6}$/.test(str), {
      message: 'OTP must consist of 6 digits',
    }),
});

export const resendOTPSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  mobile_no: mobileSchema,
});

export const loginWithPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email too long' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(128, { message: 'Password is too long' }),
});

export const sendMobileOTPSchema = z.object({
  mobile_no: mobileSchema,
});

export const loginWithMobileOTPSchema = z.object({
  mobile_no: mobileSchema,
  otp: z
    .string()
    .length(6, { message: 'OTP must be exactly 6 digits' })
    .refine(str => /^\d{6}$/.test(str), {
      message: 'OTP must consist of 6 digits',
    }),
});
