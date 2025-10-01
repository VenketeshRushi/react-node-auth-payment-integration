import { type Request, type Response, type NextFunction } from 'express';
import { logger } from '@/config/logger/index.js';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  const originalEnd = res.end;

  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    const duration = Date.now() - start;

    logger.http('HTTP Request', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
    });

    return originalEnd.call(this, chunk, encoding, callback);
  };

  next();
};
