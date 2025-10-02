import { APIError } from '@/utils/apiError.js';
import { delKey, getKey, pipeline, setKey } from '@/services/redis/utils.js';
import { logger } from '@/config/logger/index.js';
import { TempUserData, VerificationType } from '@/types/auth.types.js';

/**
 * Store machine ID in Redis
 */
export const storeMachineId = async (
  machineId: string,
  ttl: number
): Promise<void> => {
  try {
    await setKey(`x-machine-id:${machineId}`, '1', ttl);
    logger.info('Machine ID stored successfully', { machineId });
  } catch (error) {
    logger.error('Failed to store machine ID:', {
      error: error instanceof Error ? error.message : error,
      machineId,
    });
    throw new APIError('Failed to store machine ID', 500, 'REDIS_ERROR');
  }
};

/**
 * Check if machine ID exists in Redis
 */
export const checkMachineIdExists = async (
  machineId: string
): Promise<boolean> => {
  try {
    const exists = await getKey(`x-machine-id:${machineId}`);
    return !!exists;
  } catch (error) {
    logger.error('Failed to check machine ID existence:', {
      error: error instanceof Error ? error.message : error,
      machineId,
    });
    throw new APIError('Failed to check machine ID', 500, 'REDIS_ERROR');
  }
};

/**
 * Store temporary user data in Redis
 */
export const storeTempUser = async (
  email: string,
  userData: TempUserData,
  ttl: number
): Promise<void> => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    await setKey(`temp_user:${cleanEmail}`, JSON.stringify(userData), ttl);
    logger.info('Temp user data stored successfully', { email: cleanEmail });
  } catch (error) {
    logger.error('Failed to store temp user data:', {
      error: error instanceof Error ? error.message : error,
      email: email.toLowerCase().trim(),
    });
    throw new APIError('Failed to store user data', 500, 'REDIS_ERROR');
  }
};

/**
 * Get temporary user data from Redis
 */
export const getTempUser = async (
  email: string
): Promise<TempUserData | null> => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const tempUserStr = await getKey(`temp_user:${cleanEmail}`);

    if (!tempUserStr) {
      return null;
    }

    return JSON.parse(tempUserStr) as TempUserData;
  } catch (error) {
    logger.error('Failed to get temp user data:', {
      error: error instanceof Error ? error.message : error,
      email: email.toLowerCase().trim(),
    });
    throw new APIError('Failed to retrieve user data', 500, 'REDIS_ERROR');
  }
};

/**
 * Update temporary user data in Redis
 */
export const updateTempUser = async (
  email: string,
  userData: TempUserData,
  ttl: number
): Promise<void> => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    await setKey(`temp_user:${cleanEmail}`, JSON.stringify(userData), ttl);
    logger.info('Temp user data updated successfully', { email: cleanEmail });
  } catch (error) {
    logger.error('Failed to update temp user data:', {
      error: error instanceof Error ? error.message : error,
      email: email.toLowerCase().trim(),
    });
    throw new APIError('Failed to update user data', 500, 'REDIS_ERROR');
  }
};

/**
 * Delete temporary user data from Redis
 */
export const deleteTempUser = async (email: string): Promise<void> => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    await delKey(`temp_user:${cleanEmail}`);
    logger.info('Temp user data deleted successfully', { email: cleanEmail });
  } catch (error) {
    logger.warn('Failed to delete temp user data:', {
      error: error instanceof Error ? error.message : error,
      email: email.toLowerCase().trim(),
    });
    // Don't throw error for cleanup operations
  }
};

/**
 * Store OTP in Redis
 */
export const storeOTP = async (
  type: VerificationType,
  identifier: string,
  otp: string,
  ttl: number
): Promise<void> => {
  try {
    const cleanIdentifier = identifier.toLowerCase().trim();
    await setKey(`otp:${type}:${cleanIdentifier}`, otp, ttl);
    logger.info('OTP stored successfully', {
      type,
      identifier: cleanIdentifier,
    });
  } catch (error) {
    logger.error('Failed to store OTP:', {
      error: error instanceof Error ? error.message : error,
      type,
      identifier: identifier.toLowerCase().trim(),
    });
    throw new APIError('Failed to store OTP', 500, 'REDIS_ERROR');
  }
};

/**
 * Get OTP from Redis
 */
export const getOTP = async (
  type: VerificationType,
  identifier: string
): Promise<string | null> => {
  try {
    const cleanIdentifier = identifier.toLowerCase().trim();
    const otp = await getKey(`otp:${type}:${cleanIdentifier}`);
    return otp ? otp.trim() : null;
  } catch (error) {
    logger.error('Failed to get OTP:', {
      error: error instanceof Error ? error.message : error,
      type,
      identifier: identifier.toLowerCase().trim(),
    });
    throw new APIError('Failed to retrieve OTP', 500, 'REDIS_ERROR');
  }
};

/**
 * Delete OTP from Redis
 */
export const deleteOTP = async (
  type: VerificationType,
  identifier: string
): Promise<void> => {
  try {
    const cleanIdentifier = identifier.toLowerCase().trim();
    await delKey(`otp:${type}:${cleanIdentifier}`);
    logger.info('OTP deleted successfully', {
      type,
      identifier: cleanIdentifier,
    });
  } catch (error) {
    logger.warn('Failed to delete OTP:', {
      error: error instanceof Error ? error.message : error,
      type,
      identifier: identifier.toLowerCase().trim(),
    });
    // Don't throw error for cleanup operations
  }
};

/**
 * Clear all registration data for a user (temp user + OTPs)
 */
export const clearRegistrationData = async (
  email: string,
  mobile: string
): Promise<void> => {
  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile.trim();

    const pipe = pipeline();
    pipe.del(`temp_user:${cleanEmail}`);
    pipe.del(`otp:${VerificationType.EMAIL}:${cleanEmail}`);
    pipe.del(`otp:${VerificationType.MOBILE}:${cleanMobile}`);
    await pipe.exec();

    logger.info('Registration data cleared successfully', {
      email: cleanEmail,
      mobile: '****',
    });
  } catch (error) {
    logger.warn('Failed to clear registration data:', {
      error: error instanceof Error ? error.message : error,
      email: email.toLowerCase().trim(),
    });
    // Don't throw error for cleanup operations
  }
};

/**
 * Store multiple OTPs in a single pipeline operation
 */
export const storeMultipleOTPs = async (
  otps: Array<{
    type: VerificationType;
    identifier: string;
    otp: string;
    ttl: number;
  }>
): Promise<void> => {
  try {
    const pipe = pipeline();

    for (const { type, identifier, otp, ttl } of otps) {
      const cleanIdentifier = identifier.toLowerCase().trim();
      pipe.setex(`otp:${type}:${cleanIdentifier}`, ttl, otp);
    }

    await pipe.exec();

    logger.info('Multiple OTPs stored successfully', {
      count: otps.length,
      types: otps.map(o => o.type),
    });
  } catch (error) {
    logger.error('Failed to store multiple OTPs:', {
      error: error instanceof Error ? error.message : error,
      count: otps.length,
    });
    throw new APIError('Failed to store OTPs', 500, 'REDIS_ERROR');
  }
};

/**
 * Check if user has exceeded maximum attempts for a specific operation
 */
export const checkAttemptLimit = async (
  key: string,
  maxAttempts: number,
  ttl: number
): Promise<{ exceeded: boolean; attempts: number }> => {
  try {
    const currentAttempts = await getKey(key);
    const attempts = currentAttempts ? parseInt(currentAttempts) : 0;

    if (attempts >= maxAttempts) {
      return { exceeded: true, attempts };
    }

    // Increment attempts
    await setKey(key, (attempts + 1).toString(), ttl);

    return { exceeded: false, attempts: attempts + 1 };
  } catch (error) {
    logger.error('Failed to check attempt limit:', {
      error: error instanceof Error ? error.message : error,
      key,
    });
    throw new APIError('Failed to check attempt limit', 500, 'REDIS_ERROR');
  }
};

/**
 * Reset attempt counter
 */
export const resetAttempts = async (key: string): Promise<void> => {
  try {
    await delKey(key);
    logger.info('Attempts reset successfully', { key });
  } catch (error) {
    logger.warn('Failed to reset attempts:', {
      error: error instanceof Error ? error.message : error,
      key,
    });
    // Don't throw error for cleanup operations
  }
};
