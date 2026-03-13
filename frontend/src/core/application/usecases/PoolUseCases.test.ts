import { describe, it, expect, vi } from 'vitest';
import { CreatePoolUseCase, FetchPoolsByYearUseCase } from '../../../core/application/usecases/PoolUseCases';
import type { IPoolService } from '../../../core/ports/IPoolService';
import type { PoolResult } from '../../../core/domain/entities';

const mockResult: PoolResult = {
  id: 'pool1',
  year: 2024,
  members: [
    { shipId: 'R002', cbBefore: 5000, cbAfter: 0 },
    { shipId: 'R001', cbBefore: -3000, cbAfter: 0 },
  ],
  createdAt: new Date().toISOString(),
};

function makeService(): IPoolService {
  return {
    getPools: vi.fn().mockResolvedValue([mockResult]),
    createPool: vi.fn().mockResolvedValue(mockResult),
  };
}

describe('CreatePoolUseCase', () => {
  it('creates a pool with valid members', async () => {
    const service = makeService();
    const result = await new CreatePoolUseCase(service).execute(2024, [
      { shipId: 'R002', year: 2024 },
      { shipId: 'R001', year: 2024 },
    ]);
    expect(service.createPool).toHaveBeenCalled();
    expect(result.members).toHaveLength(2);
  });

  it('throws when fewer than 2 members provided', async () => {
    const service = makeService();
    await expect(
      new CreatePoolUseCase(service).execute(2024, [{ shipId: 'R002', year: 2024 }])
    ).rejects.toThrow('at least 2 members');
  });

  it('fetches existing pools by year', async () => {
    const service = makeService();
    const result = await new FetchPoolsByYearUseCase(service).execute(2024);
    expect(service.getPools).toHaveBeenCalledWith(2024);
    expect(result).toHaveLength(1);
  });
});
