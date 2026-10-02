import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  INSTANCE_ID: z.string().default('instance-1'),
  API_PREFIX: z.string().default('/api/v1'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:3000'),

  JWT_ACCESS_SECRET: z.string().min(16).default('aura_development_jwt_access_secret_super_secure_key_2026'),
  JWT_REFRESH_SECRET: z.string().min(16).default('aura_development_jwt_refresh_secret_super_secure_key_2026'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/aura_db'),
  SUPABASE_URL: z.string().url().default('https://mock.supabase.co'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('mock_service_role_key'),
  SUPABASE_STORAGE_BUCKET: z.string().default('aura-product-images'),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX: z.string().default('500').transform((val) => parseInt(val, 10)),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables configuration:', JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
