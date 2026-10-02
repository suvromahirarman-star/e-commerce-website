import pg from 'pg';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl:
    env.NODE_ENV === 'production' || env.DATABASE_URL.includes('supabase.com')
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected error on idle PostgreSQL client');
});

export const testDbConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      logger.info('🐘 PostgreSQL database connected successfully.');
      return true;
    } finally {
      client.release();
    }
  } catch (err: any) {
    logger.warn(`PostgreSQL connection failed (${err.message}). Activating in-memory persistence layer.`);
    return false;
  }
};
