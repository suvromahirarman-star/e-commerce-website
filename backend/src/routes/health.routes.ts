import { Router, Request, Response } from 'express';
import os from 'os';
import { ApiResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  return ApiResponse.success(res, {
    message: 'AURA Studio API is running smoothly',
    data: {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      instance: {
        pid: process.pid,
        hostname: os.hostname(),
        platform: os.platform(),
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
      },
    },
  });
});

export const healthRoutes = router;
