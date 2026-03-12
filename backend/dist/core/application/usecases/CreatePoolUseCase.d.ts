import { Pool } from '../../domain/entities/Pool';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { IPoolRepository } from '../../ports/outbound/IPoolRepository';
export interface PoolMemberInput {
    shipId: string;
    year: number;
}
export interface CreatePoolInput {
    year: number;
    members: PoolMemberInput[];
}
export declare class CreatePoolUseCase {
    private readonly complianceRepo;
    private readonly bankRepo;
    private readonly poolRepo;
    constructor(complianceRepo: IComplianceRepository, bankRepo: IBankRepository, poolRepo: IPoolRepository);
    execute(input: CreatePoolInput): Promise<Pool>;
}
//# sourceMappingURL=CreatePoolUseCase.d.ts.map