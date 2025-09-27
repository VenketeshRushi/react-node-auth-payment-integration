import { Router } from 'express';
import {
  machineIdSchema,
  registerSchema,
  verifyOTPSchema,
  resendOTPSchema,
} from '../../../validators/auth.validator.js';
import {
  machineIdController,
  registerTempController,
  resendOTPController,
  verifyOTPController,
} from '../controllers/auth.controller.js';
import { rateLimitMiddleware } from '../../../middlewares/rateLimit.middleware.js';
import { validateMachineIdMiddleware } from '../../../middlewares/validateMachineID.middleware.js';
import { validateSchemas } from '../../../middlewares/validation.middleware.js';

const router = Router();

// Get or create machine ID
router.get(
  '/machine-id',
  rateLimitMiddleware({ limit: 10, window: 60, requireMachineId: false }),
  validateSchemas({ headers: machineIdSchema }),
  machineIdController
);

// Register new user (temporary)
router.post(
  '/register',
  validateMachineIdMiddleware,
  rateLimitMiddleware({ limit: 3, window: 300 }),
  validateSchemas({ body: registerSchema }),
  registerTempController
);

// Verify OTP for email or mobile
router.post(
  '/verify-otp',
  validateMachineIdMiddleware,
  rateLimitMiddleware({ limit: 5, window: 300 }),
  validateSchemas({ body: verifyOTPSchema }),
  verifyOTPController
);

// Resend OTP for email and mobile
router.post(
  '/resend-otp',
  validateMachineIdMiddleware,
  rateLimitMiddleware({ limit: 3, window: 180 }),
  validateSchemas({ body: resendOTPSchema }),
  resendOTPController
);

export default router;
