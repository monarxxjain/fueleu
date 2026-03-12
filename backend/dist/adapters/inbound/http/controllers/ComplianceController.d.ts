import { Request, Response } from 'express';
import { ComputeCBUseCase } from '../../../../core/application/usecases/ComputeCBUseCase';
import { GetAdjustedCBUseCase } from '../../../../core/application/usecases/GetAdjustedCBUseCase';
export declare class ComplianceController {
    private readonly computeCB;
    private readonly getAdjustedCB;
    constructor(computeCB: ComputeCBUseCase, getAdjustedCB: GetAdjustedCBUseCase);
    getCB(req: Request, res: Response): Promise<void>;
    getAdjustedCBHandler(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ComplianceController.d.ts.map