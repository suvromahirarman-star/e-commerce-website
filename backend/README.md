# AURA Studio — Express 5 & PostgreSQL Backend

Production-grade, stateless e-commerce backend built with **Node.js 24 LTS**, **Express 5**, and **TypeScript**, backed by **PostgreSQL (Supabase)** and **Supabase Storage**.

---

## 🛠 Technology Stack

* **Runtime**: Node.js 24 LTS
* **Framework**: Express 5
* **Language**: TypeScript (Strict Mode)
* **Database**: PostgreSQL (via Supabase or local `pg.Pool`)
* **Image CDN Storage**: Supabase Storage (`aura-product-images` bucket)
* **Authentication**: Stateless JWT in secure `HttpOnly` cookies with database-backed token rotation
* **Validation**: Zod schema validation middleware
* **Security**: Helmet, CORS with credentials, Rate Limiting
* **Logging**: Structured JSON logging via Pino & Pino-Pretty
* **Testing**: Vitest + Supertest integration test suite (81 tests, 100% pass)
* **Deployment**: Docker, Docker Compose, Nginx Load Balancer

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(If no database connection string is provided, the backend automatically activates a relational in-memory persistence layer with pre-seeded products, categories, coupons, and orders).*

### 3. Start Development Server
```bash
npm run dev
```
Server starts on `http://localhost:5000`.  
Health check endpoint: `http://localhost:5000/api/v1/health`

### 4. Run Automated Test Suite
```bash
npm test
```
Executes all 81 unit, integration, security, and end-to-end test scenarios across 8 test suites.

---

## 📁 Project Architecture

```
backend/
├── src/
│   ├── config/          # Zod-validated environment & Supabase clients
│   ├── controllers/     # Request/response handling & ApiResponse wrappers
│   ├── database/        # Connection pool, seed data, and in-memory persistence
│   ├── middleware/      # Auth, upload, rate-limit, validation, and error handlers
│   ├── repositories/    # Parameterized SQL database access layer
│   ├── routes/          # Clean Express route declarations (/api/v1)
│   ├── services/        # Authoritative business logic & transaction controls
│   ├── types/           # Domain TypeScript interfaces
│   ├── utils/           # Structured logging, token helpers, custom error classes
│   ├── validators/      # Zod validation schemas
│   ├── app.ts           # Express application initialization
│   └── server.ts        # Server listener and graceful connection draining
├── migrations/          # Pure PostgreSQL DDL migration scripts
├── docs/                # Architecture, API specification, and Deployment guides
├── tests/               # Vitest integration test suites
├── Dockerfile           # Multi-stage production container build
├── docker-compose.yml   # 3-node cluster orchestration behind Nginx
└── nginx.conf           # Load balancer reverse proxy configuration
```

---

## ⚖️ Multi-Instance Load Balancing

This backend is designed from the ground up to run across multiple instances behind a load balancer:

* **Zero In-Memory Sessions**: Tokens are verified cryptographically; refresh tokens and revocations are persisted to PostgreSQL.
* **Atomic Concurrency**: Inventory updates use transactional atomic checks to prevent overselling across nodes.
* **Instance Tracking**: Every response broadcasts `X-Instance-ID` identifying which worker node served the request.
* **Graceful Draining**: `SIGTERM` / `SIGINT` listeners finish in-flight requests and drain PostgreSQL connection pools before exiting.

To spin up a 3-instance load-balanced cluster locally:
```bash
docker-compose up --build
```

---

## 📚 Documentation Links

* [Complete API Specification](./docs/API_DOCUMENTATION.md)
* [System Architecture & Design](./docs/ARCHITECTURE.md)
* [Production Deployment Guide](./docs/DEPLOYMENT.md)
