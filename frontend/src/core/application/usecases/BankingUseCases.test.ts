import { describe, it, expect, vi } from 'vitest';
import { BankSurplusUseCase, ApplyBankedUseCase } from '../../../core/application/usecases/BankingUseCases';
import type { IBankingService } from '../../../core/ports/IBankingService';
import type { BankRecord } from '../../../core/domain/entities';

const mockRecord: BankRecord = {
  id: 'b1',
  shipId: 'R002',
  year: 2024,
  amountGco2eq: 1000,
  createdAt: new Date().toISOString(),
};

function makeService(overrides: Partial<IBankingService> = {}): IBankingService {
  return {
    getRecords: vi.fn().mockResolvedValue([mockRecord]),
    bank: vi.fn().mockResolvedValue(mockRecord),
    apply: vi.fn().mockResolvedValue({ ...mockRecord, amountGco2eq: -500 }),
    ...overrides,
  };
}

describe('BankSurplusUseCase', () => {
  it('calls bank on the service', async () => {
    const service = makeService();
    const result = await new BankSurplusUseCase(service).execute({ shipId: 'R002', year: 2024, amount: 1000 });
    expect(service.bank).toHaveBeenCalledWith({ shipId: 'R002', year: 2024, amount: 1000 });
    expect(result.amountGco2eq).toBe(1000);
  });

  it('throws when amount is not positive', async () => {
    const service = makeService();
    await expect(
      new BankSurplusUseCase(service).execute({ shipId: 'R002', year: 2024, amount: 0 })
    ).rejects.toThrow('Amount must be positive');
  });
});

describe('ApplyBankedUseCase', () => {
  it('calls apply on the service', async () => {
    const service = makeService();
    const result = await new ApplyBankedUseCase(service).execute({ shipId: 'R002', year: 2024, amount: 500 });
    expect(service.apply).toHaveBeenCalledWith({ shipId: 'R002', year: 2024, amount: 500 });
    expect(result.amountGco2eq).toBe(-500);
  });

  it('throws when apply amount is zero', async () => {
    const service = makeService();
    await expect(
      new ApplyBankedUseCase(service).execute({ shipId: 'R002', year: 2024, amount: 0 })
    ).rejects.toThrow('Amount must be positive');
  });
});
