import { PrismaClient } from '../../../generated/prisma/client';
import { IRouteRepository } from '../../../core/ports/outbound/IRouteRepository';
import { Route } from '../../../core/domain/entities/Route';
export declare class PrismaRouteRepository implements IRouteRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findAll(): Promise<Route[]>;
    findById(id: string): Promise<Route | null>;
    findByRouteId(routeId: string): Promise<Route | null>;
    findBaseline(): Promise<Route | null>;
    setBaseline(id: string): Promise<Route>;
}
//# sourceMappingURL=PrismaRouteRepository.d.ts.map