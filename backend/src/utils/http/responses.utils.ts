import type { Response } from 'express';
import type { ApiResponse } from '../../types/api.types.js';

export const sendSuccessResponse = <T = Record<string, any>>(
  res: Response,
  statusCode = 200,
  message = 'Request successful',
  data: T = {} as T
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = <T = Record<string, any>>(
  res: Response,
  statusCode = 500,
  message = 'Something went wrong',
  data: T = {} as T,
  errorCode?: string
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
    errorCode,
  });
};
