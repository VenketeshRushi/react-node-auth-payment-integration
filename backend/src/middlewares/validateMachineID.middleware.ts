import type { Request, Response, NextFunction } from 'express';
import { APIError } from '../utils/apiError.js';

/**
 * @description Middleware to validate presence of 'x-machine-id' header
 * Returns 400 Bad Request if missing
 */
export const validateMachineIdMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const machineId = req.headers['x-machine-id'] as string | undefined;

  if (!machineId) {
    return next(
      new APIError('Missing x-machine-id header', 400, 'MACHINE_ID_MISSING')
    );
  }

  next();
};
