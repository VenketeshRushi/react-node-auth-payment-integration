import type { Request, Response, NextFunction } from 'express';
import { sendErrorResponse, sendSuccessResponse } from '@/utils/http.js';
import {
  GetMachineIdResponse,
  RegisterTempUserParams,
  RegisterTempUserResponse,
  ResendOTPRequest,
  ResendOTPResponse,
  TempUserData,
  VerificationType,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '@/types/auth.types.js';
import { generateOTP, generateUUID } from '@/utils/crypto.js';
import {
  checkMachineIdExists,
  clearRegistrationData,
  storeMachineId,
  storeMultipleOTPs,
  storeTempUser,
  getTempUser,
  updateTempUser,
  deleteTempUser,
  getOTP,
  deleteOTP,
} from './auth.repository.js';
import { ApiResponse } from '@/types/api.response.js';
import { logger } from '@/config/logger/index.js';
import { checkUserExists, createUser } from '../user/user.repository.js';
import { APIError } from '@/utils/apiError.js';
import { hashPassword } from '@/utils/auth.utils.js';
import { CreateUserData } from '@/types/user.types.js';
import {
  sendResendNotifications,
  sendVerificationNotifications,
} from '@/services/notifications/notification.helper.js';

export const AUTH_CONFIG = {
  TEMP_USER_TTL: 15 * 60, // 15 minutes
  OTP_TTL: 5 * 60, // 5 minutes
  MAX_OTP_ATTEMPTS: 3,
  MACHINE_ID_TTL: 365 * 24 * 60 * 60, // 365 days
  OTP_LENGTH: 6,
  OTP_RESEND_COOLDOWN: 60, // 1 minute
  MAX_REGISTRATION_ATTEMPTS: 5,
  LOGIN_OTP_TTL: 5 * 60, // 5 minutes for login OTP
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_TIME: 30 * 60, // 30 minutes
  REFRESH_TOKEN_TTL: 30 * 24 * 60 * 60, // 30 days
} as const;

// Check if cooldown period has passed
const isCooldownActive = (
  lastSent: number
): { active: boolean; remainingTime: number } => {
  const now = Date.now();
  const elapsed = now - lastSent;
  const cooldownMs = AUTH_CONFIG.OTP_RESEND_COOLDOWN * 1000;

  if (elapsed < cooldownMs) {
    return {
      active: true,
      remainingTime: Math.ceil((cooldownMs - elapsed) / 1000),
    };
  }

  return { active: false, remainingTime: 0 };
};

export const machineIdController = async (
  req: Request,
  res: Response<ApiResponse<GetMachineIdResponse>>
): Promise<Response<ApiResponse<GetMachineIdResponse>> | void> => {
  try {
    let machineId = req.headers['x-machine-id'] as string | undefined;

    if (machineId) {
      const exists = await checkMachineIdExists(machineId);
      if (exists) {
        logger.info('Existing machine ID validated', {
          machineId: machineId,
        });

        return sendSuccessResponse<GetMachineIdResponse>(
          res,
          200,
          'Machine ID retrieved successfully',
          { machineId }
        );
      }
    }

    machineId = generateUUID();
    await storeMachineId(machineId, AUTH_CONFIG.MACHINE_ID_TTL);

    logger.info('New machine ID created', { machineId });

    return sendSuccessResponse<GetMachineIdResponse>(
      res,
      200,
      'Machine ID retrieved successfully',
      { machineId }
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      500,
      'Failed to fetch machine ID',
      {},
      'MACHINE_ID_ERROR'
    );
  }
};

/**
 * Register temporary user and initiate verification process
 */
export const registerTempController = async (
  req: Request<{}, {}, RegisterTempUserParams>,
  res: Response<ApiResponse<RegisterTempUserResponse>>,
  next: NextFunction
): Promise<Response<ApiResponse<RegisterTempUserResponse>> | void> => {
  try {
    const { name, email, mobile_no, password } = req.body;

    const cleanName = name.trim();
    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile_no.trim();

    logger.info('User registration attempt', {
      email: cleanEmail,
      mobile: cleanMobile,
    });

    const userCheck = await checkUserExists({
      email: cleanEmail,
      mobile_no: cleanMobile,
    });

    if (userCheck.exists) {
      logger.warn('Registration conflict detected', {
        conflictField: userCheck.conflictField,
        email: cleanEmail,
      });
      throw new APIError('User registration failed.', 409, 'USER_EXISTS');
    }

    await clearRegistrationData(cleanEmail, cleanMobile);

    const hashedPassword = await hashPassword(password);
    const currentTime = Date.now();

    const userData: TempUserData = {
      name: cleanName,
      email: cleanEmail,
      mobile_no: cleanMobile,
      password: hashedPassword,
      email_verified: false,
      mobile_verified: false,
      email_otp_attempts: 0,
      mobile_otp_attempts: 0,
      created_at: currentTime,
    };

    const emailOTP = generateOTP();
    const mobileOTP = generateOTP();

    await storeTempUser(cleanEmail, userData, AUTH_CONFIG.TEMP_USER_TTL);
    await storeMultipleOTPs([
      {
        type: VerificationType.EMAIL,
        identifier: cleanEmail,
        otp: emailOTP,
        ttl: AUTH_CONFIG.OTP_TTL,
      },
      {
        type: VerificationType.MOBILE,
        identifier: cleanMobile,
        otp: mobileOTP,
        ttl: AUTH_CONFIG.OTP_TTL,
      },
    ]);

    sendVerificationNotifications(
      cleanEmail,
      cleanMobile,
      cleanName,
      emailOTP,
      mobileOTP
    );

    logger.info('Temp user registration successful', {
      email: cleanEmail,
      mobile: cleanMobile,
    });

    return sendSuccessResponse<RegisterTempUserResponse>(
      res,
      201,
      'Registration initiated successfully. Please verify your email and mobile number.',
      {
        email: cleanEmail,
        mobile_no: cleanMobile,
        next_step: 'verify_otp',
        verification_required: ['email', 'mobile'],
        otp_validity: '5 minutes',
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP for email or mobile number
 */
export const verifyOTPController = async (
  req: Request<{}, {}, VerifyOTPRequest>,
  res: Response<ApiResponse<VerifyOTPResponse>>,
  next: NextFunction
): Promise<Response<ApiResponse<VerifyOTPResponse>> | void> => {
  try {
    const { email, mobile_no, type, otp } = req.body;

    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile_no.trim();
    const cleanOTP = otp.trim();

    // Validate verification type
    if (!Object.values(VerificationType).includes(type)) {
      throw new APIError('Invalid verification type', 400);
    }

    // Fetch temp user
    const tempUser = await getTempUser(cleanEmail);
    if (!tempUser) {
      throw new APIError('Registration session not found or expired', 404);
    }

    // Verify mobile matches temp user
    if (tempUser.mobile_no !== cleanMobile) {
      throw new APIError('Email and mobile number do not match', 400);
    }

    // Check if already verified
    if (type === VerificationType.EMAIL && tempUser.email_verified) {
      throw new APIError('Email already verified', 400);
    }
    if (type === VerificationType.MOBILE && tempUser.mobile_verified) {
      throw new APIError('Mobile already verified', 400);
    }

    const identifier =
      type === VerificationType.EMAIL ? cleanEmail : cleanMobile;
    const storedOTP = await getOTP(type, identifier);

    if (!storedOTP) {
      throw new APIError('OTP expired or not found', 404);
    }

    const attemptField =
      type === VerificationType.EMAIL
        ? 'email_otp_attempts'
        : 'mobile_otp_attempts';
    const attempts = tempUser[attemptField] || 0;

    if (attempts >= AUTH_CONFIG.MAX_OTP_ATTEMPTS) {
      throw new APIError('Maximum OTP attempts exceeded', 429);
    }

    // Verify OTP
    if (storedOTP !== cleanOTP) {
      tempUser[attemptField] = attempts + 1;
      await updateTempUser(cleanEmail, tempUser, AUTH_CONFIG.TEMP_USER_TTL);
      throw new APIError('Invalid OTP', 400);
    }

    // Successful verification
    if (type === VerificationType.EMAIL) tempUser.email_verified = true;
    if (type === VerificationType.MOBILE) tempUser.mobile_verified = true;
    tempUser[attemptField] = 0;

    // Delete used OTP
    await deleteOTP(type, identifier);

    // If both verified, create permanent user
    if (tempUser.email_verified && tempUser.mobile_verified) {
      const userData: CreateUserData = {
        name: tempUser.name,
        email: tempUser.email,
        mobile_no: tempUser.mobile_no,
        password: tempUser.password,
      };

      const newUser = await createUser(userData);

      // Cleanup temp user
      await deleteTempUser(cleanEmail);

      // Return complete registration response
      return sendSuccessResponse<VerifyOTPResponse>(
        res,
        200,
        'Registration completed successfully',
        {
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            mobile_no: newUser.mobile_no,
            role: newUser.role,
            created_at: newUser.created_at.toISOString(),
          },
          message: 'Registration completed successfully',
          isComplete: true,
        }
      );
    }

    // Partial verification response - update temp user
    await updateTempUser(cleanEmail, tempUser, AUTH_CONFIG.TEMP_USER_TTL);

    return sendSuccessResponse<VerifyOTPResponse>(
      res,
      200,
      `${type} verification successful`,
      {
        email: tempUser.email,
        mobile_no: tempUser.mobile_no,
        verifiedType: type,
        email_verified: tempUser.email_verified,
        mobile_verified: tempUser.mobile_verified,
        message: `${type} verified successfully`,
        isComplete: false,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Resend OTP for unverified channels
 */
export const resendOTPController = async (
  req: Request<{}, {}, ResendOTPRequest>,
  res: Response<ApiResponse<ResendOTPResponse>>,
  next: NextFunction
): Promise<Response<ApiResponse<ResendOTPResponse>> | void> => {
  try {
    const { email, mobile_no } = req.body;

    const cleanEmail = email.toLowerCase().trim();
    const cleanMobile = mobile_no.trim();

    // Get temp user data
    const tempUser = await getTempUser(cleanEmail);
    if (!tempUser) {
      throw new APIError('Registration session not found or expired', 404);
    }

    // Validate that the provided mobile matches the registered mobile
    if (tempUser.mobile_no !== cleanMobile) {
      throw new APIError('Email and mobile number do not match', 400);
    }

    if (tempUser.email_verified && tempUser.mobile_verified) {
      throw new APIError('User already verified', 400);
    }

    // Check cooldown period
    if (tempUser.last_otp_sent) {
      const cooldown = isCooldownActive(tempUser.last_otp_sent);
      if (cooldown.active) {
        throw new APIError(
          `Please wait ${cooldown.remainingTime} seconds before resending OTP`,
          429
        );
      }
    }

    // Generate new OTPs only for unverified channels
    const emailOTP = !tempUser.email_verified ? generateOTP() : null;
    const mobileOTP = !tempUser.mobile_verified ? generateOTP() : null;

    // Update temp user with new timestamp
    tempUser.last_otp_sent = Date.now();
    await updateTempUser(cleanEmail, tempUser, AUTH_CONFIG.TEMP_USER_TTL);

    // Store new OTPs
    const otpsToStore = [];
    if (emailOTP) {
      otpsToStore.push({
        type: VerificationType.EMAIL,
        identifier: cleanEmail,
        otp: emailOTP,
        ttl: AUTH_CONFIG.OTP_TTL,
      });
    }
    if (mobileOTP) {
      otpsToStore.push({
        type: VerificationType.MOBILE,
        identifier: cleanMobile,
        otp: mobileOTP,
        ttl: AUTH_CONFIG.OTP_TTL,
      });
    }

    if (otpsToStore.length > 0) {
      await storeMultipleOTPs(otpsToStore);
    }

    // Send notifications
    await sendResendNotifications(
      cleanEmail,
      cleanMobile,
      tempUser.name,
      emailOTP,
      mobileOTP
    );

    return sendSuccessResponse<ResendOTPResponse>(
      res,
      200,
      'OTP resent successfully',
      {
        email: cleanEmail,
        mobile_no: cleanMobile,
        otp_validity: '5 minutes',
        resend_cooldown: '60 seconds',
      }
    );
  } catch (error) {
    next(error);
  }
};
