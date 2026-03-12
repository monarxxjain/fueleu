import { PrismaClient } from '../../../generated/prisma/client';
import { IComplianceRepository } from '../../../core/ports/outbound/IComplianceRepository';
import { ComplianceBalance } from '../../../core/domain/entities/ComplianceBalance';
export declare class PrismaComplianceRepository implements IComplianceRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
    save(record: Omit<ComplianceBalance, 'id' | 'computedAt'>): Promise<ComplianceBalance>;
}
//# sourceMappingURL=PrismaComplianceRepository.d.ts.map