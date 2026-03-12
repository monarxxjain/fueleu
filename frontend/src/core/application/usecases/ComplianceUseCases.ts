import type { CBResult, AdjustedCBResult } from '../../domain/entities';
import type { IComplianceService } from '../../ports/IComplianceService';

export class FetchCBUseCase {
  constructor(private readonly service: IComplianceService) {}

  async execute(shipId: string, year: number): Promise<CBResult> {
    return this.service.getCB(shipId, year);
  }
}

export class FetchAdjustedCBUseCase {
  constructor(private readonly service: IComplianceService) {}

  async execute(shipId: string, year: number): Promise<AdjustedCBResult> {
    return this.service.getAdjustedCB(shipId, year);
  }
}
