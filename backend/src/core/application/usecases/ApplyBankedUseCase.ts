import { BankEntry } from '../../domain/entities/BankEntry';
import { IBankRepository } from '../../ports/outbound/IBankRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';

export interface ApplyBankedInput {
  shipId: string;
  year: number;
  amount: number; // positive number representing amount to apply (will be stored negative)
}

export class ApplyBankedUseCase {
  constructor(
    private readonly bankRepo: IBankRepository,
    private readonly cache: ICacheService
  ) {}

  async execute(input: ApplyBankedInput): Promise<BankEntry> {
    if (input.amount <= 0) {
      throw new Error('Amount to apply must be positive');
    }

    const totalBanked = await this.bankRepo.sumByShipAndYear(
      input.shipId,
      input.year
    );

    if (totalBanked <= 0) {
      throw new Error(
        `No banked surplus available for ship "${input.shipId}" year ${input.year}`
      );
    }
    if (input.amount > totalBanked) {
      throw new Error(
        `Cannot apply ${input.amount}; only ${totalBanked.toFixed(2)} gCO₂eq banked`
      );
    }

    // Store as a negative entry to reduce the banked pool
    const entry = await this.bankRepo.create({
      shipId: input.shipId,
      year: input.year,
      amountGco2eq: -input.amount,
    });

    await this.cache.invalidate(`cb:${input.shipId}:${input.year}`);
    return entry;
  }
}
