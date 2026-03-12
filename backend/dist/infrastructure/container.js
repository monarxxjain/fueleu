"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolController = exports.bankingController = exports.complianceController = exports.routeController = exports.cache = exports.prisma = void 0;
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
const InMemoryCacheService_1 = require("../adapters/outbound/cache/InMemoryCacheService");
// Outbound adapters — Prisma repositories
const PrismaRouteRepository_1 = require("../adapters/outbound/postgres/PrismaRouteRepository");
const PrismaComplianceRepository_1 = require("../adapters/outbound/postgres/PrismaComplianceRepository");
const PrismaBankRepository_1 = require("../adapters/outbound/postgres/PrismaBankRepository");
const PrismaPoolRepository_1 = require("../adapters/outbound/postgres/PrismaPoolRepository");
// Use-cases
const GetRoutesUseCase_1 = require("../core/application/usecases/GetRoutesUseCase");
const SetBaselineUseCase_1 = require("../core/application/usecases/SetBaselineUseCase");
const GetComparisonUseCase_1 = require("../core/application/usecases/GetComparisonUseCase");
const ComputeCBUseCase_1 = require("../core/application/usecases/ComputeCBUseCase");
const GetAdjustedCBUseCase_1 = require("../core/application/usecases/GetAdjustedCBUseCase");
const BankSurplusUseCase_1 = require("../core/application/usecases/BankSurplusUseCase");
const ApplyBankedUseCase_1 = require("../core/application/usecases/ApplyBankedUseCase");
const CreatePoolUseCase_1 = require("../core/application/usecases/CreatePoolUseCase");
// Inbound adapters — controllers
const RouteController_1 = require("../adapters/inbound/http/controllers/RouteController");
const ComplianceController_1 = require("../adapters/inbound/http/controllers/ComplianceController");
const BankingController_1 = require("../adapters/inbound/http/controllers/BankingController");
const PoolController_1 = require("../adapters/inbound/http/controllers/PoolController");
// ── Infrastructure Singletons ───────────────────────────────────────────────
const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
    throw new Error('DATABASE_URL is not configured');
}
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
exports.prisma = new client_1.PrismaClient({ adapter });
exports.cache = new InMemoryCacheService_1.InMemoryCacheService();
// ── Repositories ────────────────────────────────────────────────────────────
const routeRepo = new PrismaRouteRepository_1.PrismaRouteRepository(exports.prisma);
const complianceRepo = new PrismaComplianceRepository_1.PrismaComplianceRepository(exports.prisma);
const bankRepo = new PrismaBankRepository_1.PrismaBankRepository(exports.prisma);
const poolRepo = new PrismaPoolRepository_1.PrismaPoolRepository(exports.prisma);
// ── Use-cases ───────────────────────────────────────────────────────────────
const getRoutesUseCase = new GetRoutesUseCase_1.GetRoutesUseCase(routeRepo, exports.cache);
const setBaselineUseCase = new SetBaselineUseCase_1.SetBaselineUseCase(routeRepo, exports.cache);
const getComparisonUseCase = new GetComparisonUseCase_1.GetComparisonUseCase(routeRepo);
const computeCBUseCase = new ComputeCBUseCase_1.ComputeCBUseCase(routeRepo, complianceRepo, exports.cache);
const getAdjustedCBUseCase = new GetAdjustedCBUseCase_1.GetAdjustedCBUseCase(complianceRepo, bankRepo);
const bankSurplusUseCase = new BankSurplusUseCase_1.BankSurplusUseCase(complianceRepo, bankRepo, exports.cache);
const applyBankedUseCase = new ApplyBankedUseCase_1.ApplyBankedUseCase(bankRepo, exports.cache);
const createPoolUseCase = new CreatePoolUseCase_1.CreatePoolUseCase(complianceRepo, bankRepo, poolRepo);
// ── Controllers ─────────────────────────────────────────────────────────────
exports.routeController = new RouteController_1.RouteController(getRoutesUseCase, setBaselineUseCase, getComparisonUseCase);
exports.complianceController = new ComplianceController_1.ComplianceController(computeCBUseCase, getAdjustedCBUseCase);
exports.bankingController = new BankingController_1.BankingController(bankSurplusUseCase, applyBankedUseCase, bankRepo);
exports.poolController = new PoolController_1.PoolController(createPoolUseCase);
//# sourceMappingURL=container.js.map