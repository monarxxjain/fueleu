import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreatePoolUseCase } from '../../src/core/application/usecases/CreatePoolUseCase';
import { IComplianceRepository } from '../../src/core/ports/outbound/IComplianceRepository';
import { IBankRepository } from '../../src/core/ports/outbound/IBankRepository';
import { IPoolRepository } from '../../src/core/ports/outbound/IPoolRepository';

function makeRepos(cbMap: Record<string, number>, bankedMap: Record<string, number> = {}) {
  const complianceRepo: IComplianceRepository = {
    findByShipAndYear: vi.fn().mockImplementation(async (shipId: string) => {
      const cb = cbMap[shipId];
      if (cb === undefined) return null;
      return { id: shipId, shipId, year: 2024, cbGco2eq: cb, computedAt: new Date() };
    }),
    save: vi.fn(),
  };
  const bankRepo: IBankRepository = {
    findByShipAndYear: vi.fn().mockResolvedValue([]),
    sumByShipAndYear: vi.fn().mockImplementation(async (shipId: string) =>
      bankedMap[shipId] ?? 0
    ),
    create: vi.fn(),
  };
  const poolRepo: IPoolRepository = {
    create: vi.fn().mockResolvedValue({ id: 'pool-uuid', year: 2024, createdAt: new Date() }),
    findAssignedShipIds: vi.fn().mockResolvedValue([]),
    findByYear: vi.fn().mockResolvedValue([]),
    addMember: vi.fn(),
    findById: vi.fn(),
  };
  return { complianceRepo, bankRepo, poolRepo };
}

describe('CreatePoolUseCase', () => {
  it('creates a valid pool and transfers surplus to deficit', async () => {
    const { complianceRepo, bankRepo, poolRepo } = makeRepos({
      R002: 1_000_000,  // surplus
      R003: -500_000,   // deficit
    });
    const uc = new CreatePoolUseCase(complianceRepo, bankRepo, poolRepo);
    const pool = await uc.execute({
      year: 2024,
      members: [
        { shipId: 'R002', year: 2024 },
        { shipId: 'R003', year: 2024 },
      ],
    });

    expect(pool.members).toHaveLength(2);
    const surplus = pool.members.find((m) => m.shipId === 'R002')!;
    const deficit = pool.members.find((m) => m.shipId === 'R003')!;
    expect(surplus.cbAfter).toBe(500_000);  // gave 500k to deficit
    expect(deficit.cbAfter).toBe(0);         // deficit covered
  });

  it('rejects pool when total CB < 0', async () => {
    const { complianceRepo, bankRepo, poolRepo } = makeRepos({
      R002: -100_000,
      R003: -200_000,
    });
    const uc = new CreatePoolUseCase(complianceRepo, bankRepo, poolRepo);
    await expect(
      uc.execute({
        year: 2024,
        members: [
          { shipId: 'R002', year: 2024 },
          { shipId: 'R003', year: 2024 },
        ],
      })
    ).rejects.toThrow('invalid');
  });

  it('rejects pool with fewer than 2 members', async () => {
    const { complianceRepo, bankRepo, poolRepo } = makeRepos({ R002: 500_000 });
    const uc = new CreatePoolUseCase(complianceRepo, bankRepo, poolRepo);
    await expect(
      uc.execute({ year: 2024, members: [{ shipId: 'R002', year: 2024 }] })
    ).rejects.toThrow('at least 2');
  });

  it('throws when compliance record is missing for a member', async () => {
    const { complianceRepo, bankRepo, poolRepo } = makeRepos({ R002: 500_000 });
    const uc = new CreatePoolUseCase(complianceRepo, bankRepo, poolRepo);
    await expect(
      uc.execute({
        year: 2024,
        members: [
          { shipId: 'R002', year: 2024 },
          { shipId: 'R999', year: 2024 }, // missing
        ],
      })
    ).rejects.toThrow('No compliance record');
  });

  it('rejects when a ship is already assigned to a pool for the same year', async () => {
    const { complianceRepo, bankRepo, poolRepo } = makeRepos({
      R002: 500_000,
      R003: 200_000,
    });
    (poolRepo.findAssignedShipIds as ReturnType<typeof vi.fn>).mockResolvedValue(['R002']);

    const uc = new CreatePoolUseCase(complianceRepo, bankRepo, poolRepo);
    await expect(
      uc.execute({
        year: 2024,
        members: [
          { shipId: 'R002', year: 2024 },
          { shipId: 'R003', year: 2024 },
        ],
      })
    ).rejects.toThrow('already assigned to a pool');
  });
});
