import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrations = async () => {
  logger.info('🚀 Starting PostgreSQL database migration...');
  const migrationsDir = path.resolve(__dirname, '../../migrations');

  try {
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
    const client = await pool.connect();

    try {
      for (const file of files) {
        logger.info(`Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(sql);
        logger.info(`✅ Successfully applied: ${file}`);
      }
      logger.info('🎉 All database migrations applied successfully.');
    } finally {
      client.release();
    }
  } catch (err: any) {
    logger.error({ err }, `❌ Database migration failed: ${err.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// If run directly via tsx
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations();
}
