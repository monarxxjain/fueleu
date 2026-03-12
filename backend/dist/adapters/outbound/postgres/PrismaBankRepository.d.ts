import { PrismaClient } from '../../../generated/prisma/client';
import { IBankRepository } from '../../../core/ports/outbound/IBankRepository';
import { BankEntry } from '../../../core/domain/entities/BankEntry';
export declare class PrismaBankRepository implements IBankRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
    sumByShipAndYear(shipId: string, year: number): Promise<number>;
    create(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
}
//# sourceMappingURL=PrismaBankRepository.d.ts.map