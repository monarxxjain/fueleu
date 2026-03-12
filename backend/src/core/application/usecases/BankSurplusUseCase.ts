import { BankEntry } from '../../domain/entities/BankEntry';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';

export interface BankSurplusInput {
  shipId: string;
  year: number;
  amount: number; // must be > 0 and ≤ available CB
}

export class BankSurplusUseCase {
  constructor(
    private readonly complianceRepo: IComplianceRepository,
    private readonly bankRepo: IBankRepository,
    private readonly cache: ICacheService
  ) {}

  async execute(input: BankSurplusInput): Promise<BankEntry> {
    if (input.amount <= 0) {
      throw new Error('Amount to bank must be positive');
    }

    const record = await this.complianceRepo.findByShipAndYear(
      input.shipId,
      input.year
    );
    if (!record) {
      throw new Error(
        `No compliance record for ship "${input.shipId}" year ${input.year}. Compute CB first.`
      );
    }

    const alreadyBanked = await this.bankRepo.sumByShipAndYear(
      input.shipId,
      input.year
    );
    const availableCB = record.cbGco2eq + alreadyBanked;

    if (availableCB <= 0) {
      throw new Error(
        `Ship "${input.shipId}" has no surplus to bank (adjusted CB = ${availableCB.toFixed(2)})`
      );
    }
    if (input.amount > availableCB) {
      throw new Error(
        `Cannot bank ${input.amount}; only ${availableCB.toFixed(2)} gCO₂eq available`
      );
    }

    const entry = await this.bankRepo.create({
      shipId: input.shipId,
      year: input.year,
      amountGco2eq: input.amount,
    });

    await this.cache.invalidate(`cb:${input.shipId}:${input.year}`);
    return entry;
  }
}
