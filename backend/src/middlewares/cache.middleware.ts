import type { Request, Response, NextFunction } from 'express';
import { delKey, getKey, setKey } from '../config/redis/redis.utils.js';
import { sendSuccessResponse } from '../utils/http/responses.utils.js';
import { logger } from '../config/index.js';

interface CacheOptions {
  prefix: string; // Prefix to group cache keys
  ttl?: number; // Time-to-live in seconds
  keyBuilder?: (req: Request) => string; // Custom cache key generator
}

/**
 * @description Middleware to cache GET requests using Redis
 * Automatically returns cached responses and saves new responses to cache
 */
export const cacheMiddleware = (options: CacheOptions) => {
  const { prefix, ttl = 60, keyBuilder } = options;

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      // 1. Generate cache key
      const cacheKey = `${prefix}:${
        keyBuilder ? keyBuilder(req) : req.originalUrl
      }`;

      // 2. Check if response is already cached
      const cachedData = await getKey(cacheKey);
      if (cachedData) {
        logger.info(`Cache hit: ${cacheKey}`);
        return sendSuccessResponse(
          res,
          200,
          'Data fetched from cache',
          JSON.parse(cachedData)
        );
      }

      logger.info(`Cache miss: ${cacheKey}`);

      /**
       * 3. Monkey-patch res.sendSuccessResponse so it also caches the response
       */
      const originalSend = sendSuccessResponse;
      (res as any).sendSuccessResponse = (
        statusCode = 200,
        message = 'Request successful',
        data = {}
      ) => {
        // Save to cache (fire and forget)
        setKey(cacheKey, JSON.stringify(data), ttl).catch(err =>
          logger.error('Cache save failed:', err)
        );

        return originalSend(res, statusCode, message, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next(); // Fail-open
    }
  };
};

/**
 * @description Utility to clear cache by prefix and key
 */
export const clearCache = async (
  prefix: string,
  key: string
): Promise<void> => {
  const fullKey = `${prefix}:${key}`;
  await delKey(fullKey);
  logger.info(`Cache cleared: ${fullKey}`);
};
