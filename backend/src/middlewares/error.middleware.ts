import type { ErrorRequestHandler } from 'express';
import { APIError } from '../utils/apiError.js';
import { config, logger } from '../config/index.js';
import { sendErrorResponse } from '../utils/http/responses.utils.js';

/**
 * @description Global error handling middleware for Express
 * Catches all errors and formats them into a standardized response
 */
export const errorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  _next
) => {
  // Normalize error to APIError
  const error =
    err instanceof APIError
      ? err
      : new APIError(
          err.message || 'Internal Server Error',
          500,
          'INTERNAL_SERVER_ERROR'
        );

  const statusCode = error.statusCode;

  // Hide internal errors in production
  const message =
    config.NODE_ENV === 'production' && !error.isOperational
      ? 'Something went wrong'
      : error.message;

  // Centralized logging
  logger.error('API Error', {
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: error.message,
    stack: error.stack,
    context: error.context || {},
  });

  // Send standardized error response
  return sendErrorResponse(res, statusCode, message, {}, error.errorCode);
};
