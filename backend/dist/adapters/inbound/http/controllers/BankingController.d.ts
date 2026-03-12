import { Request, Response } from 'express';
import { BankSurplusUseCase } from '../../../../core/application/usecases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../../core/application/usecases/ApplyBankedUseCase';
import { IBankRepository } from '../../../../core/ports/outbound/IBankRepository';
export declare class BankingController {
    private readonly bankSurplus;
    private readonly applyBanked;
    private readonly bankRepo;
    constructor(bankSurplus: BankSurplusUseCase, applyBanked: ApplyBankedUseCase, bankRepo: IBankRepository);
    getRecords(req: Request, res: Response): Promise<void>;
    bank(req: Request, res: Response): Promise<void>;
    apply(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=BankingController.d.ts.map