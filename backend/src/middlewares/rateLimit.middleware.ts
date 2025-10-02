import type { Request, Response, NextFunction } from 'express';
import { getKey, incrKey, setKey } from '@/services/redis/utils.js';
import { sendErrorResponse } from '@/utils/http.js';
import { logger } from '@/config/logger/index.js';

interface RateLimitOptions {
  /** Maximum number of requests allowed within the window */
  limit?: number;
  /** Time window in seconds */
  window?: number;
  /** Redis key prefix for rate limit storage */
  prefix?: string;
  /** Header key to extract machine ID from */
  headerKey?: string;
  /** Whether to require machine ID or allow fallback to IP */
  requireMachineId?: boolean;
  /** Skip rate limiting entirely */
  bypass?: boolean;
  /** Fail closed (reject) or fail open (allow) on Redis errors */
  failClosed?: boolean;
}

/**
 * @description Middleware to enforce API rate limiting per machine/user
 * Supports customizable limit, window, headers, and fail-open/fail-closed modes
 * Can optionally require machine ID or fall back to IP-based limiting
 */
export const rateLimitMiddleware =
  (options: RateLimitOptions = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      limit = 5,
      window = 60, // in seconds
      prefix = 'rate_limit',
      requireMachineId = true,
      bypass = false,
      failClosed = false,
    } = options;

    if (bypass) return next();

    try {
      const machineId = req.headers['x-machine-id'] as string | undefined;

      // Handle missing machine ID based on requireMachineId setting
      if (!machineId && requireMachineId) {
        return sendErrorResponse(
          res,
          400,
          'Missing machine ID in headers',
          {},
          'MACHINE_ID_MISSING'
        );
      }

      // Generate rate limit key
      let rateLimitKey: string;
      if (machineId) {
        // Use machine ID if available
        rateLimitKey = `${prefix}:machineId:${machineId}:${req.path}`;
      } else {
        // Fall back to IP-based limiting when machine ID not required/available
        const clientIp = req.ip || req.socket.remoteAddress;
        rateLimitKey = `${prefix}:ip:${clientIp}:${req.path}`;
      }

      const current = await getKey(rateLimitKey);

      if (!current) {
        await setKey(rateLimitKey, 1, window);
        return next();
      }

      const currentCount = parseInt(current, 10);
      if (currentCount < limit) {
        await incrKey(rateLimitKey, window);
        return next();
      }

      // Rate limit exceeded
      logger.warn('Rate limit exceeded', {
        ip: req.ip || req.socket.remoteAddress,
        machineId: req.headers['x-machine-id'] || null,
        path: req.path,
        limit,
        current: currentCount,
      });

      return sendErrorResponse(
        res,
        429,
        'API rate limit exceeded. Try again later.',
        {
          retryAfter: window,
          limit,
          remaining: 0,
        },
        'RATE_LIMIT_EXCEEDED'
      );
    } catch (err) {
      logger.error('Rate limit middleware error', err);

      if (failClosed) {
        return sendErrorResponse(
          res,
          500,
          'Rate limit check failed. Please try again later.',
          {},
          'RATE_LIMIT_ERROR'
        );
      } else {
        return next(); // fail-open
      }
    }
  };
