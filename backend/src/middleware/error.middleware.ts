import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const isAppError = err instanceof AppError;
  const isSyntaxError = err instanceof SyntaxError && ('body' in err || (err as any).status === 400);

  let statusCode = isAppError ? err.statusCode : isSyntaxError ? 400 : 500;
  let message = isAppError ? err.message : isSyntaxError ? 'Invalid JSON format in request body' : 'Internal Server Error';
  const details = isAppError ? err.details : undefined;

  if (statusCode >= 500) {
    logger.error(
      {
        err,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        body: req.body,
      },
      'Unhandled Server Error'
    );
  } else {
    logger.warn(
      {
        statusCode,
        message,
        path: req.originalUrl,
        method: req.method,
        details,
      },
      'Client / Operational Error'
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
    ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
};
