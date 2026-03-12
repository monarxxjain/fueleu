import 'dotenv/config';
import { InMemoryCacheService } from '../adapters/outbound/cache/InMemoryCacheService';
import { RouteController } from '../adapters/inbound/http/controllers/RouteController';
import { ComplianceController } from '../adapters/inbound/http/controllers/ComplianceController';
import { BankingController } from '../adapters/inbound/http/controllers/BankingController';
import { PoolController } from '../adapters/inbound/http/controllers/PoolController';
export declare const prisma: import("../generated/prisma/internal/class").PrismaClient<never, import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined, import("@prisma/client/runtime/client").DefaultArgs>;
export declare const cache: InMemoryCacheService;
export declare const routeController: RouteController;
export declare const complianceController: ComplianceController;
export declare const bankingController: BankingController;
export declare const poolController: PoolController;
//# sourceMappingURL=container.d.ts.map