import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
export interface IComplianceRepository {
    findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
    save(record: Omit<ComplianceBalance, 'id' | 'computedAt'>): Promise<ComplianceBalance>;
}
//# sourceMappingURL=IComplianceRepository.d.ts.map