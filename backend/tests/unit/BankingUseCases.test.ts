import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BankSurplusUseCase } from '../../src/core/application/usecases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../src/core/application/usecases/ApplyBankedUseCase';
import { IComplianceRepository } from '../../src/core/ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../src/core/ports/outbound/IBankRepository';
import { ICacheService } from '../../src/core/ports/outbound/ICacheService';

const mockCBRecord = {
  id: 'cb-uuid',
  shipId: 'R002',
  year: 2024,
  cbGco2eq: 263_255_040,
  computedAt: new Date(),
};

function makeMocks(cbGco2eq = 263_255_040, bankedSum = 0) {
  const complianceRepo: IComplianceRepository = {
    findByShipAndYear: vi.fn().mockResolvedValue({ ...mockCBRecord, cbGco2eq }),
    save: vi.fn(),
  };
  const bankRepo: IBankRepository = {
    findByShipAndYear: vi.fn().mockResolvedValue([]),
    sumByShipAndYear: vi.fn().mockResolvedValue(bankedSum),
    create: vi.fn().mockImplementation(async (e) => ({
      id: 'entry-uuid',
      ...e,
      createdAt: new Date(),
    })),
  };
  const cache: ICacheService = {
    get: vi.fn(),
    set: vi.fn(),
    invalidate: vi.fn(),
    invalidatePattern: vi.fn(),
  };
  return { complianceRepo, bankRepo, cache };
}

describe('BankSurplusUseCase', () => {
  it('banks a valid positive amount', async () => {
    const { complianceRepo, bankRepo, cache } = makeMocks();
    const uc = new BankSurplusUseCase(complianceRepo, bankRepo, cache);
    const entry = await uc.execute({
      shipId: 'R002',
      year: 2024,
      amount: 1_000_000,
    });
    expect(entry.amountGco2eq).toBe(1_000_000);
    expect(bankRepo.create).toHaveBeenCalledOnce();
  });

  it('throws when amount is zero or negative', async () => {
    const { complianceRepo, bankRepo, cache } = makeMocks();
    const uc = new BankSurplusUseCase(complianceRepo, bankRepo, cache);
    await expect(
      uc.execute({ shipId: 'R002', year: 2024, amount: 0 })
    ).rejects.toThrow('positive');
  });

  it('throws when CB is negative (deficit ship cannot bank)', async () => {
    const { complianceRepo, bankRepo, cache } = makeMocks(-50_000);
    const uc = new BankSurplusUseCase(complianceRepo, bankRepo, cache);
    await expect(
      uc.execute({ shipId: 'R002', year: 2024, amount: 10_000 })
    ).rejects.toThrow('no surplus');
  });

  it('throws when amount exceeds available CB', async () => {
    const { complianceRepo, bankRepo, cache } = makeMocks(100);
    const uc = new BankSurplusUseCase(complianceRepo, bankRepo, cache);
    await expect(
      uc.execute({ shipId: 'R002', year: 2024, amount: 999 })
    ).rejects.toThrow('Cannot bank');
  });

  it('throws when no compliance record', async () => {
    const { complianceRepo, bankRepo, cache } = makeMocks();
    vi.mocked(complianceRepo.findByShipAndYear).mockResolvedValue(null);
    const uc = new BankSurplusUseCase(complianceRepo, bankRepo, cache);
    await expect(
      uc.execute({ shipId: 'R002', year: 2024, amount: 100 })
    ).rejects.toThrow();
  });
});

describe('ApplyBankedUseCase', () => {
  it('applies a valid amount from banked pool', async () => {
    const { bankRepo, cache } = makeMocks(0, 500_000);
    const uc = new ApplyBankedUseCase(bankRepo, cache);
    const entry = await uc.execute({ shipId: 'R002', year: 2024, amount: 200_000 });
    expect(entry.amountGco2eq).toBe(-200_000);
  });

  it('throws when no banked surplus exists', async () => {
    const { bankRepo, cache } = makeMocks(0, 0);
    const uc = new ApplyBankedUseCase(bankRepo, cache);
    await expect(
      uc.execute({ shipId: 'R002', year: 2024, amount: 100 })
    ).rejects.toThrow('No banked surplus');
  });

  it('throws on over-apply', async () => {
    const { bankRepo, cache } = makeMocks(0, 100);
    const uc = new ApplyBankedUseCase(bankRepo, cache);
    await expect(
      uc.execute({ shipId: 'R002', year: 2024, amount: 999 })
    ).rejects.toThrow('Cannot apply');
  });
});
