import { Request, Response } from 'express';
import { GetRoutesUseCase } from '../../../../core/application/usecases/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../../core/application/usecases/SetBaselineUseCase';
import { GetComparisonUseCase } from '../../../../core/application/usecases/GetComparisonUseCase';
export declare class RouteController {
    private readonly getRoutes;
    private readonly setBaseline;
    private readonly getComparison;
    constructor(getRoutes: GetRoutesUseCase, setBaseline: SetBaselineUseCase, getComparison: GetComparisonUseCase);
    getAllRoutes(req: Request, res: Response): Promise<void>;
    setBaselineRoute(req: Request, res: Response): Promise<void>;
    getComparisonData(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=RouteController.d.ts.map