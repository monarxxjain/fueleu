# FuelEU Maritime — Compliance Platform

> A full-stack implementation of FuelEU Maritime compliance tools (EU Regulation 2023/1805), featuring a four-tab React dashboard backed by a hexagonal Node.js API.

---

## Overview

The platform enables shipping companies to:

- **Monitor** route-level GHG emissions against the legal target (89.3368 gCO₂e/MJ)
- **Compare** routes using a configurable baseline
- **Bank** surplus Compliance Balance (CB) for future use (Article 20)
- **Pool** CB across ships to share surplus with deficit vessels (Article 21)

---

## Architecture — Hexagonal (Ports & Adapters)

Both frontend and backend follow the same hexagonal pattern:

```
        ┌──────────────────────────────┐
        │         CORE (pure TS)       │
        │  domain entities / constants │
        │  use-cases (business logic)  │
        │  ports (interfaces)          │
        └────────────┬─────────────────┘
                     │ depends only on ports
        ┌────────────┴──────────────────────────────┐
        │              ADAPTERS                     │
        │  Inbound:  Express controllers / React     │
        │            hooks                          │
        │  Outbound: Prisma repositories / Fetch    │
        │            API adapters / In-memory cache │
        └───────────────────────────────────────────┘
```

**Key principle**: The `core/` folder has zero imports from Express, Prisma, React, or any infrastructure library. Everything is wired through interfaces (ports) using manual constructor injection.

### Backend folder structure

```
backend/src/
  core/
    domain/
      entities/        ← Route, ComplianceBalance, BankEntry, Pool
      constants.ts     ← TARGET_GHG, ENERGY_FACTOR, computeComplianceBalance()
    ports/
      outbound/        ← IRouteRepository, IComplianceRepository, IBankRepository,
                          IPoolRepository, ICacheService
    application/
      usecases/        ← GetRoutesUseCase, ComputeCBUseCase, BankSurplusUseCase,
                          CreatePoolUseCase, …
  adapters/
    inbound/http/
      controllers/     ← RouteController, ComplianceController, BankingController, PoolController
      routes/          ← Express routers
    outbound/
      postgres/        ← PrismaRouteRepository, PrismaComplianceRepository, …
      cache/           ← InMemoryCacheService (ICacheService adapter)
  infrastructure/
    container.ts       ← Manual DI wiring
    server/app.ts      ← Express app factory
  server.ts            ← Entry point
```

### Frontend folder structure

```
frontend/src/
  core/
    domain/entities.ts      ← TypeScript interfaces
    ports/                  ← IRouteService, IComplianceService, IBankingService, IPoolService
    application/usecases/   ← FetchRoutesUseCase, BankSurplusUseCase, CreatePoolUseCase, …
  adapters/
    infrastructure/         ← RouteApiAdapter, BankingApiAdapter, container.ts (DI)
    ui/
      hooks/                ← useRoutes, useBanking, usePooling, useDarkMode (inbound adapters)
      components/           ← RoutesTab, CompareTab, BankingTab, PoolingTab, AppLayout, KPICard, …
```

---

## Core Formula

```
Energy in scope (MJ) = fuelConsumption_tonnes × 41,000
Compliance Balance   = (89.3368 − ghgIntensity) × energyMJ

Positive CB  →  Surplus  ✅
Negative CB  →  Deficit  ❌
```

---

## Setup & Run

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally (default: `postgres:postgres@localhost:5432`)

### 1. Backend

```bash
cd backend

# Install dependencies
npm install

# Configure your PostgreSQL URL
# Edit .env → DATABASE_URL="postgresql://USER:PASS@localhost:5432/fueleu?schema=public"

# Generate Prisma client
npm run db:generate     # or: npx prisma generate

# Run migrations
npm run db:migrate      # creates the fueleu database and all tables

# Seed the 5 sample routes
npm run db:seed

# Start dev server (port 3001)
npm run dev
```

### 2. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Running Tests

```bash
# Backend (21 unit tests)
cd backend && npm run test

# Frontend (8 unit tests)
cd frontend && npm run test
```

---

## Bonus Features

### Dark Mode

Toggle via the switch in the top-right of the navbar. Preference persists in `localStorage`. Implemented using the `useDarkMode` hook (inbound adapter) and Tailwind v4 `@custom-variant dark`.

### In-Memory Cache

`InMemoryCacheService` implements the `ICacheService` port using a `Map<string, {value, expiresAt}>`. Routes and CB results are cached with TTL expiry. To swap to Redis, provide a `RedisCacheService` implementing the same port — zero core changes needed.

### Animated KPI Cards

`KPICard.tsx` uses framer-motion `useSpring` + `useTransform` to animate numeric values when CB data updates.

---

## API Reference

| Method | Path                                  | Description                |
| ------ | ------------------------------------- | -------------------------- |
| GET    | `/routes`                             | All routes                 |
| POST   | `/routes/:id/baseline`                | Set as baseline            |
| GET    | `/routes/comparison`                  | Baseline vs all comparison |
| GET    | `/compliance/cb?shipId&year`          | Compute & return CB        |
| GET    | `/compliance/adjusted-cb?shipId&year` | CB after banking           |
| GET    | `/banking/records?shipId&year`        | Bank transaction history   |
| POST   | `/banking/bank`                       | Bank positive CB           |
| POST   | `/banking/apply`                      | Apply banked surplus       |
| POST   | `/pools`                              | Create compliance pool     |
| GET    | `/health`                             | Health check               |

---

## Sample API Requests

```bash
# Get all routes
curl http://localhost:3001/routes

# Compute CB for R002 in 2024
curl "http://localhost:3001/compliance/cb?shipId=R002&year=2024"

# Bank 50,000 gCO₂eq for R002
curl -X POST http://localhost:3001/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"shipId":"R002","year":2024,"amount":50000}'

# Create a pool
curl -X POST http://localhost:3001/pools \
  -H "Content-Type: application/json" \
  -d '{"year":2024,"members":[{"shipId":"R002","year":2024},{"shipId":"R001","year":2024}]}'
```
