import { BankEntry } from '../../domain/entities/BankEntry';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';
export interface ApplyBankedInput {
    shipId: string;
    year: number;
    amount: number;
}
export declare class ApplyBankedUseCase {
    private readonly bankRepo;
    private readonly cache;
    constructor(bankRepo: IBankRepository, cache: ICacheService);
    execute(input: ApplyBankedInput): Promise<BankEntry>;
}
//# sourceMappingURL=ApplyBankedUseCase.d.ts.map