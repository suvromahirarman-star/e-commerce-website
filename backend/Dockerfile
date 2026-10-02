# Stage 1: Build & Dependencies
FROM node:24-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source and TypeScript configuration
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript to dist/
RUN npm run build

# Stage 2: Production Runtime
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled assets from builder
COPY --from=builder /app/dist ./dist
COPY migrations/ ./migrations/

# Security: run as non-root user
USER node

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

CMD ["node", "dist/server.js"]
