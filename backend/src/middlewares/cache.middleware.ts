import type { Request, Response, NextFunction } from 'express';
import { delKey, getKey, setKey } from '@/services/redis/utils.js';
import { logger } from '@/config/logger/index.js';
import { sendSuccessResponse } from '@/utils/response.utils.js';

interface CacheOptions {
  prefix: string;
  ttl?: number;
  keyBuilder?: (req: Request) => string;
}

export const cacheMiddleware = (options: CacheOptions) => {
  const { prefix, ttl = 60, keyBuilder } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();

    const cacheKey = `${prefix}:${keyBuilder ? keyBuilder(req) : req.originalUrl}`;

    try {
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

      // Patch res.json to cache the response
      const originalJson = res.json.bind(res);

      res.json = (body: any) => {
        setKey(cacheKey, JSON.stringify(body), ttl).catch(err =>
          logger.error(`Failed to cache response for key ${cacheKey}:`, err)
        );
        return originalJson(body);
      };

      // Patch sendSuccessResponse to cache automatically
      const originalSendSuccess = sendSuccessResponse.bind(null, res);
      (res as any).sendSuccessResponse = <T = Record<string, any>>(
        statusCode?: number,
        message?: string,
        data?: T
      ) => {
        setKey(cacheKey, JSON.stringify(data), ttl).catch(err =>
          logger.error(`Failed to cache response for key ${cacheKey}:`, err)
        );
        return originalSendSuccess(statusCode, message, data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next(); // Fail-open
    }
  };
};

// Clear cache by prefix:key
export const clearCache = async (
  prefix: string,
  key: string
): Promise<void> => {
  const fullKey = `${prefix}:${key}`;
  await delKey(fullKey);
  logger.info(`Cache cleared: ${fullKey}`);
};
