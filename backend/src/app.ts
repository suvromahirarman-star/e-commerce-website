import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { apiRouter } from './routes/index.js';

export const createApp = (): Express => {
  const app = express();

  // Basic security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS configuration
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body and cookie parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // HTTP Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Load Balancer Diagnostic / Instance Identifier Header
  app.use((_req, res, next) => {
    res.setHeader('X-Instance-ID', env.INSTANCE_ID);
    next();
  });

  // Rate Limiting
  app.use(globalRateLimiter);

  // Mount API Router under prefix (e.g. /api/v1)
  app.use(env.API_PREFIX, apiRouter);

  // Root welcome route
  app.get('/', (_req, res) => {
    res.json({
      name: 'AURA Studio Backend API',
      version: '1.0.0',
      apiDocs: `${env.API_PREFIX}/health`,
      status: 'online',
    });
  });

  // Catch 404s
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
