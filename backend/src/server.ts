import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`✨ AURA Studio API server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`🔗 Base URL: http://localhost:${env.PORT}${env.API_PREFIX}`);
  logger.info(`🏥 Health Check: http://localhost:${env.PORT}${env.API_PREFIX}/health`);
});

import { pool } from './config/database.js';

// Graceful shutdown handling
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Gracefully terminating AURA API server...`);
  server.close(async () => {
    try {
      await pool.end();
      logger.info('Database pool drained successfully.');
    } catch (e) {
      logger.warn({ error: e }, 'Error closing database pool');
    }
    logger.info('HTTP server closed successfully. Process exiting.');
    process.exit(0);
  });

  // Force close after 10s if connections remain open
  setTimeout(() => {
    logger.error('Forced shutdown due to timed-out active connections.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
