import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
export interface AdjustedCBResult {
    shipId: string;
    year: number;
    cbRaw: number;
    bankedTotal: number;
    cbAdjusted: number;
}
export declare class GetAdjustedCBUseCase {
    private readonly complianceRepo;
    private readonly bankRepo;
    constructor(complianceRepo: IComplianceRepository, bankRepo: IBankRepository);
    execute(shipId: string, year: number): Promise<AdjustedCBResult>;
}
//# sourceMappingURL=GetAdjustedCBUseCase.d.ts.map