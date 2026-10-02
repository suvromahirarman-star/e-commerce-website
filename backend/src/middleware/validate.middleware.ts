import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../utils/errors.js';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed values safely in Express 5
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) {
        for (const key of Object.keys(parsed.query)) {
          (req.query as any)[key] = parsed.query[key];
        }
      }
      if (parsed.params) {
        for (const key of Object.keys(parsed.params)) {
          (req.params as any)[key] = parsed.params[key];
        }
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.errors.map((err) => ({
          field: err.path.join('.').replace(/^(body|query|params)\./, ''),
          message: err.message,
        }));
        next(new BadRequestError('Validation error', issues));
      } else {
        next(error);
      }
    }
  };
};

export const validate = validateRequest;
