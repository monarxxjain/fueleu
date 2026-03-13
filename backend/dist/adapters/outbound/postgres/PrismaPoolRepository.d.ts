import { PrismaClient } from '../../../generated/prisma/client';
import { IPoolRepository } from '../../../core/ports/outbound/IPoolRepository';
import { Pool, PoolMember } from '../../../core/domain/entities/Pool';
export declare class PrismaPoolRepository implements IPoolRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(year: number): Promise<{
        id: string;
        year: number;
        createdAt: Date;
    }>;
    findAssignedShipIds(year: number, shipIds: string[]): Promise<string[]>;
    addMember(poolId: string, year: number, member: PoolMember): Promise<void>;
    findByYear(year: number): Promise<Pool[]>;
    findById(id: string): Promise<Pool | null>;
}
//# sourceMappingURL=PrismaPoolRepository.d.ts.map