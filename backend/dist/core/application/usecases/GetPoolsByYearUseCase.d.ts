import { Pool } from '../../domain/entities/Pool';
import { IPoolRepository } from '../../ports/outbound/IPoolRepository';
export declare class GetPoolsByYearUseCase {
    private readonly poolRepo;
    constructor(poolRepo: IPoolRepository);
    execute(year: number): Promise<Pool[]>;
}
//# sourceMappingURL=GetPoolsByYearUseCase.d.ts.map