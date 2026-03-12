import { BankEntry } from '../../domain/entities/BankEntry';
export interface IBankRepository {
    findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
    sumByShipAndYear(shipId: string, year: number): Promise<number>;
    create(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
}
//# sourceMappingURL=IBankRepository.d.ts.map