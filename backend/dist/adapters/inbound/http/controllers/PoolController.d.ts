import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../../core/application/usecases/CreatePoolUseCase';
import { GetPoolsByYearUseCase } from '../../../../core/application/usecases/GetPoolsByYearUseCase';
export declare class PoolController {
    private readonly createPool;
    private readonly getPoolsByYear;
    constructor(createPool: CreatePoolUseCase, getPoolsByYear: GetPoolsByYearUseCase);
    getByYear(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PoolController.d.ts.map