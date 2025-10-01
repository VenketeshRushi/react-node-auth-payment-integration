import type { ErrorRequestHandler } from 'express';
import { APIError } from '../utils/apiError.js';
import { config } from '@/config/loadEnv.js';
import { sendErrorResponse } from '@/utils/response.utils.js';
import { logger } from '@/config/logger/index.js';

/**
 * @description Global error handling middleware for Express
 */
export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  _next
) => {
  const error =
    err instanceof APIError
      ? err
      : new APIError(
          err.message || 'Internal Server Error',
          500,
          'INTERNAL_SERVER_ERROR'
        );

  const statusCode = error.statusCode;

  const message =
    config.NODE_ENV === 'production' && !error.isOperational
      ? 'Something went wrong'
      : error.message;

  logger.error('API Error', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: error.message,
    stack: error.stack,
    context: error.context || {},
  });

  return sendErrorResponse(res, statusCode, message, {}, error.errorCode);
};
