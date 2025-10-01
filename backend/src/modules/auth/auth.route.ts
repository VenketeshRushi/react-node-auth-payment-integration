import { Router } from 'express';
import {
  machineIdSchema,
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
} from './auth.schema.js';
import {
  machineIdController,
  registerTempController,
  resendOTPController,
  verifyOTPController,
} from './auth.controller.js';
import { rateLimitMiddleware } from '@/middlewares/rateLimit.middleware.js';
import { validateSchemas } from '@/middlewares/validation.middleware.js';
import { validateMachineIdMiddleware } from '@/middlewares/validateMachineID.middleware.js';

const authRouter = Router();

// Get or create machine ID
authRouter.get(
  '/machine-id',
  rateLimitMiddleware({ limit: 10, window: 60, requireMachineId: false }),
  validateSchemas({ headers: machineIdSchema }),
  machineIdController
);

// Register new user (temporary)
authRouter.post(
  '/register',
  validateMachineIdMiddleware,
  rateLimitMiddleware({ limit: 3, window: 300 }),
  validateSchemas({ body: registerSchema }),
  registerTempController
);

// Verify OTP for email or mobile
authRouter.post(
  '/verify-otp',
  validateMachineIdMiddleware,
  rateLimitMiddleware({ limit: 5, window: 300 }),
  validateSchemas({ body: verifyOTPSchema }),
  verifyOTPController
);

// Resend OTP for email and mobile
authRouter.post(
  '/resend-otp',
  validateMachineIdMiddleware,
  rateLimitMiddleware({ limit: 3, window: 180 }),
  validateSchemas({ body: resendOTPSchema }),
  resendOTPController
);

export default authRouter;
