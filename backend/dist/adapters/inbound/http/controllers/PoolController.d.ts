import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../../core/application/usecases/CreatePoolUseCase';
export declare class PoolController {
    private readonly createPool;
    constructor(createPool: CreatePoolUseCase);
    create(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PoolController.d.ts.map