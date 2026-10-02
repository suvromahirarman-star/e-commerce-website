# AURA Studio Production Deployment Guide

## 1. Supabase Cloud Configuration

### Step 1: Database Provisioning
1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Navigate to **Project Settings** $\to$ **Database** and copy your **Connection String** (`URI` mode).
3. The connection string looks like:
   ```env
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   ```

### Step 2: Run Database Schema Migrations
1. Open the Supabase **SQL Editor**.
2. Copy and execute the contents of [`migrations/001_initial_schema.sql`](../migrations/001_initial_schema.sql).
3. This creates all 14 relational tables, indexes, constraints, and cascades.

### Step 3: Configure Supabase Storage Bucket
1. Navigate to **Storage** in the Supabase Dashboard.
2. Click **New Bucket**:
   * **Name**: `aura-product-images`
   * **Public Bucket**: `ON` (Allows public storefront to read published catalog image CDN links)
3. Set Storage Policy for Authenticated Admin Uploads:
   * **Target Roles**: `service_role` (used by backend)
   * **Allowed Operations**: `SELECT`, `INSERT`, `UPDATE`, `DELETE`

---

## 2. Environment Variables Specification

Create `.env` in the `backend/` directory:

```env
# Application Environment
NODE_ENV=production
PORT=5000
API_PREFIX=/api/v1
INSTANCE_ID=api-node-1
CORS_ORIGIN=https://aurastudio.com,http://localhost:5173

# Cryptographic JWT Keys (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET=your_32_character_minimum_random_secret_key_here
JWT_REFRESH_SECRET=your_different_32_character_random_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Supabase Cloud Database & Storage
DATABASE_URL=postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...[YOUR_SUPABASE_SERVICE_ROLE_KEY]
SUPABASE_STORAGE_BUCKET=aura-product-images

# Traffic Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=500
```

---

## 3. Running Multi-Instance Behind Load Balancer

### Local Multi-Instance Run via Docker Compose
To launch 3 API instances load-balanced by Nginx on port 5000:

```bash
# Build and start all 3 instances + Nginx reverse proxy
docker-compose up -d --build

# View real-time cluster traffic distribution
docker-compose logs -f load-balancer
```

### Direct Node.js Multi-Instance Run (PowerShell / PM2)
Using PM2 in cluster mode on Node 24:

```bash
# Install PM2 globally
npm install -g pm2

# Build TypeScript to dist/
npm run build

# Start cluster with 3 instances
pm2 start dist/server.js -i 3 --name aura-api

# Monitor cluster performance
pm2 status
pm2 logs
```

---

## 4. Production Checklist

- [x] **Zero In-Memory Sessions**: Database-backed refresh token rotation.
- [x] **Zero-Trust Money Calculations**: Stored as `NUMERIC(12, 2)` without floating-point errors.
- [x] **Security Middleware**: Helmet headers, origin-restricted CORS, and rate limiting active.
- [x] **Graceful Shutdown**: Database pool drains cleanly upon `SIGTERM` / `SIGINT`.
- [x] **Health Check Diagnostic**: Live at `/api/v1/health`.
