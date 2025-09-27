import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { ZodError } from 'zod';
import { sendErrorResponse } from '../utils/http/responses.utils.js';

type SchemaMap = {
  body?: ZodType<any, any>;
  headers?: ZodType<any, any>;
  query?: ZodType<any, any>;
  params?: ZodType<any, any>;
};

/**
 * Middleware generator to validate request parts using Zod schemas.
 */
export function validateSchemas(schemas: SchemaMap) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.headers) {
        // Parse headers (you might use .passthrough() to allow extras)
        schemas.headers.parse(req.headers);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map(issue => ({
          field: issue.path.length > 0 ? issue.path.join('.') : '(root)',
          message: issue.message,
        }));
        return sendErrorResponse(
          res,
          400,
          'Validation failed',
          { errors: formattedErrors },
          'VALIDATION_ERROR'
        );
      }
      return next(err);
    }
  };
}
