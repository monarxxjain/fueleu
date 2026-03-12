import type { BankRecord } from '../../domain/entities';
import type { IBankingService, BankPayload } from '../../ports/IBankingService';

export class FetchBankRecordsUseCase {
  constructor(private readonly service: IBankingService) {}

  async execute(shipId: string, year: number): Promise<BankRecord[]> {
    return this.service.getRecords(shipId, year);
  }
}

export class BankSurplusUseCase {
  constructor(private readonly service: IBankingService) {}

  async execute(payload: BankPayload): Promise<BankRecord> {
    if (payload.amount <= 0) throw new Error('Amount must be positive');
    return this.service.bank(payload);
  }
}

export class ApplyBankedUseCase {
  constructor(private readonly service: IBankingService) {}

  async execute(payload: BankPayload): Promise<BankRecord> {
    if (payload.amount <= 0) throw new Error('Amount must be positive');
    return this.service.apply(payload);
  }
}
