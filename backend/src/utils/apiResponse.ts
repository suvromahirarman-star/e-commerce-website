import { Response } from 'express';

export interface ApiResponseOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiResponse {
  static success<T>(res: Response, options: ApiResponseOptions<T>) {
    const { statusCode = 200, message = 'Success', data, meta } = options;
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      timestamp: new Date().toISOString(),
    });
  }

  static created<T>(res: Response, data: T, message = 'Created', meta?: Record<string, unknown>) {
    return this.success(res, { statusCode: 201, message, data, meta });
  }

  static error(res: Response, statusCode = 500, message = 'Internal Server Error', errors?: unknown) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}

