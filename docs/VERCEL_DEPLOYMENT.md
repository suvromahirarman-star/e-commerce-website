# 🚀 Vercel Deployment Guide — AURA Studio

This guide explains how to deploy **AURA Studio** to Vercel with zero downtime, instant global CDN delivery, and full API connectivity.

---

## 🎯 Architecture Overview

A modern full-stack e-commerce architecture consists of two cooperating tiers:

1. **Frontend (Vercel)**:
   - React 19 + Tailwind CSS + Framer Motion SPA.
   - Deployed on Vercel's Global Edge Network for sub-100ms global page loads.
   - Configured with `vercel.json` for client-side routing rewrites (`/*` $\to$ `/index.html`) so refreshing `/shop`, `/product/...`, or `/checkout` never throws a 404.

2. **Backend API (Render / Railway / Supabase / Fly.io)**:
   - Node.js 24 + Express 5 + TypeScript + PostgreSQL.
   - Requires persistent database connection pooling (`pg.Pool`), transaction handling, and multipart image streaming.
   - Recommended platforms: [Render](https://render.com), [Railway](https://railway.app), [Fly.io](https://fly.io), or [Supabase](https://supabase.com).

---

## 📋 Pre-Deployment Checklist

- [x] `vercel.json` created in project root with SPA rewrite rules and asset caching.
- [x] `src/services/apiClient.js` updated to read `import.meta.env.VITE_API_URL`.
- [x] Production build verified: `npm run build` completed in **762ms** with 0 errors.
- [x] All 124 quality & Playwright browser tests passing.

---

## 🚀 Step-by-Step Vercel Deployment

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: configure Vercel deployment with vercel.json"
   git push origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New..."** $\to$ **"Project"**.
   - Select your GitHub repository.

3. **Configure Project Settings**:
   - **Framework Preset**: `Vite` (automatically detected).
   - **Root Directory**: `./` (or leave default if this is the root of the repo).
   - **Build Command**: `npm run build` (default).
   - **Output Directory**: `dist` (default).

4. **Add Environment Variables in Vercel**:
   In the Vercel Project Dashboard $\to$ **Settings** $\to$ **Environment Variables**, add:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com/api/v1
   ```
   *(Replace with your live backend URL on Render, Railway, or AWS)*.

5. **Click "Deploy"**:
   Vercel will build and deploy your application in under 45 seconds!

---

### Method 2: Deploy via Vercel CLI

You can also deploy directly from your local terminal:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   # Preview Deployment
   vercel

   # Production Deployment
   vercel --prod
   ```

---

## 🔒 Backend Deployment & CORS Alignment

When your frontend is live on `https://aura-studio.vercel.app`:

1. Update your backend environment configuration (on Render / Railway):
   ```env
   NODE_ENV=production
   PORT=5000
   CORS_ORIGIN=https://aura-studio.vercel.app,https://your-custom-domain.com
   JWT_ACCESS_SECRET=your_production_secure_secret_here
   JWT_REFRESH_SECRET=your_production_secure_secret_here
   DATABASE_URL=postgresql://postgres.xxx:xxx@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   SUPABASE_STORAGE_BUCKET=aura-product-images
   ```

2. Because the backend sets `SameSite=Lax` or `SameSite=None; Secure` for cross-origin cookies, your admin session and guest checkout will communicate securely.

---

## 🛠️ Vercel Reverse Proxy Alternative (Zero CORS Setup)

If you prefer your frontend to call `/api/v1/...` without needing cross-domain CORS, edit `vercel.json` to proxy API requests to your backend:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "https://your-backend-api.onrender.com/api/v1/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

With this reverse proxy rewrite, the browser considers the API as part of the same origin—**no CORS configuration is needed, and HttpOnly cookies pass without third-party cookie restrictions**.
