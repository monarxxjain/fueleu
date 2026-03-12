import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { InMemoryCacheService } from '../adapters/outbound/cache/InMemoryCacheService';

// Outbound adapters — Prisma repositories
import { PrismaRouteRepository } from '../adapters/outbound/postgres/PrismaRouteRepository';
import { PrismaComplianceRepository } from '../adapters/outbound/postgres/PrismaComplianceRepository';
import { PrismaBankRepository } from '../adapters/outbound/postgres/PrismaBankRepository';
import { PrismaPoolRepository } from '../adapters/outbound/postgres/PrismaPoolRepository';

// Use-cases
import { GetRoutesUseCase } from '../core/application/usecases/GetRoutesUseCase';
import { SetBaselineUseCase } from '../core/application/usecases/SetBaselineUseCase';
import { GetComparisonUseCase } from '../core/application/usecases/GetComparisonUseCase';
import { ComputeCBUseCase } from '../core/application/usecases/ComputeCBUseCase';
import { GetAdjustedCBUseCase } from '../core/application/usecases/GetAdjustedCBUseCase';
import { BankSurplusUseCase } from '../core/application/usecases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../core/application/usecases/ApplyBankedUseCase';
import { CreatePoolUseCase } from '../core/application/usecases/CreatePoolUseCase';

// Inbound adapters — controllers
import { RouteController } from '../adapters/inbound/http/controllers/RouteController';
import { ComplianceController } from '../adapters/inbound/http/controllers/ComplianceController';
import { BankingController } from '../adapters/inbound/http/controllers/BankingController';
import { PoolController } from '../adapters/inbound/http/controllers/PoolController';

// ── Infrastructure Singletons ───────────────────────────────────────────────
const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('DATABASE_URL is not configured');
}

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
export const cache = new InMemoryCacheService();

// ── Repositories ────────────────────────────────────────────────────────────
const routeRepo = new PrismaRouteRepository(prisma);
const complianceRepo = new PrismaComplianceRepository(prisma);
const bankRepo = new PrismaBankRepository(prisma);
const poolRepo = new PrismaPoolRepository(prisma);

// ── Use-cases ───────────────────────────────────────────────────────────────
const getRoutesUseCase = new GetRoutesUseCase(routeRepo, cache);
const setBaselineUseCase = new SetBaselineUseCase(routeRepo, cache);
const getComparisonUseCase = new GetComparisonUseCase(routeRepo);
const computeCBUseCase = new ComputeCBUseCase(routeRepo, complianceRepo, cache);
const getAdjustedCBUseCase = new GetAdjustedCBUseCase(complianceRepo, bankRepo);
const bankSurplusUseCase = new BankSurplusUseCase(complianceRepo, bankRepo, cache);
const applyBankedUseCase = new ApplyBankedUseCase(bankRepo, cache);
const createPoolUseCase = new CreatePoolUseCase(complianceRepo, bankRepo, poolRepo);

// ── Controllers ─────────────────────────────────────────────────────────────
export const routeController = new RouteController(
  getRoutesUseCase,
  setBaselineUseCase,
  getComparisonUseCase
);

export const complianceController = new ComplianceController(
  computeCBUseCase,
  getAdjustedCBUseCase
);

export const bankingController = new BankingController(
  bankSurplusUseCase,
  applyBankedUseCase,
  bankRepo
);

export const poolController = new PoolController(createPoolUseCase);
