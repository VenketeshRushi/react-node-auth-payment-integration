import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { extractIpAddress } from '../utils/http/ip.utils.js';
import { parseUserAgent } from '../utils/http/request.utils.js';

/**
 * HTTP Logger Middleware
 * Logs incoming HTTP requests with IP, user agent, status code, duration, and origin.
 */
export const httpLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

    const clientIp = extractIpAddress(req);
    const device = parseUserAgent(req.headers['user-agent'] || '');
    const origin = req.headers.origin || 'Unknown';

    const logMessage = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: clientIp,
      device,
      origin,
      durationMs: Number(elapsedMs.toFixed(2)),
    };

    logger.http(JSON.stringify(logMessage), 2, null);
  });

  next();
};
