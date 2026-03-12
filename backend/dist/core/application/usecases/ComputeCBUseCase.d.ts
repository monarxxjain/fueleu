import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';
export interface ComputeCBInput {
    shipId: string;
    year: number;
}
export declare class ComputeCBUseCase {
    private readonly routeRepo;
    private readonly complianceRepo;
    private readonly cache;
    constructor(routeRepo: IRouteRepository, complianceRepo: IComplianceRepository, cache: ICacheService);
    execute(input: ComputeCBInput): Promise<ComplianceBalance>;
}
//# sourceMappingURL=ComputeCBUseCase.d.ts.map