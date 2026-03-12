import { BankEntry } from '../../domain/entities/BankEntry';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';
export interface BankSurplusInput {
    shipId: string;
    year: number;
    amount: number;
}
export declare class BankSurplusUseCase {
    private readonly complianceRepo;
    private readonly bankRepo;
    private readonly cache;
    constructor(complianceRepo: IComplianceRepository, bankRepo: IBankRepository, cache: ICacheService);
    execute(input: BankSurplusInput): Promise<BankEntry>;
}
//# sourceMappingURL=BankSurplusUseCase.d.ts.map