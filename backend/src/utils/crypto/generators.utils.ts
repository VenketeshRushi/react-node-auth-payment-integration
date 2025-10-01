import crypto from 'crypto';
import { APIError } from '../apiError.js';
import { logger } from '../../config/index.js';

// Generate UUID v4
export const generateUUID = (): string => {
  try {
    return crypto.randomUUID();
  } catch (error) {
    logger.error('UUID generation failed:', error);
    throw new APIError('Failed to generate UUID', 500);
  }
};

// Generate secure random string
export const generateSecureRandom = (length = 32): string => {
  try {
    return crypto.randomBytes(length).toString('hex');
  } catch (error) {
    logger.error('Secure random generation failed:', error);
    throw new APIError('Failed to generate secure random string', 500);
  }
};

// Generate OTP
export const generateOTP = (length = 6, numeric = true): string => {
  try {
    const chars = numeric
      ? '0123456789'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      otp += chars[randomIndex];
    }
    return otp;
  } catch (error: any) {
    logger.error('OTP generation failed:', error?.message ?? error);
    throw new APIError('Failed to generate OTP', 500);
  }
};
