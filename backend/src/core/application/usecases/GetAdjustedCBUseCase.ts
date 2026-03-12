import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../ports/outbound/IBankRepository';

export interface AdjustedCBResult {
  shipId: string;
  year: number;
  cbRaw: number;
  bankedTotal: number;
  cbAdjusted: number;
}

export class GetAdjustedCBUseCase {
  constructor(
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankRepo: IBankRepository
  ) {}

  async execute(shipId: string, year: number): Promise<AdjustedCBResult> {
    const record = await this.complianceRepo.findByShipAndYear(shipId, year);
    if (!record) {
      throw new Error(
        `No compliance record found for ship "${shipId}" year ${year}. Compute CB first.`
      );
    }

    // Sum of all bank entries (positive=banked, negative=applied)
    const bankedTotal = await this.bankRepo.sumByShipAndYear(shipId, year);

    return {
      shipId,
      year,
      cbRaw: record.cbGco2eq,
      bankedTotal,
      cbAdjusted: record.cbGco2eq + bankedTotal,
    };
  }
}
