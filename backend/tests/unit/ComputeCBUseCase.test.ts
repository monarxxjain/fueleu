import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComputeCBUseCase } from '../../src/core/application/usecases/ComputeCBUseCase';
import { IRouteRepository } from '../../src/core/ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../../src/core/ports/outbound/IComplianceRepository';
import { ICacheService } from '../../src/core/ports/outbound/ICacheService';
import { Route } from '../../src/core/domain/entities/Route';
import { TARGET_GHG_INTENSITY, ENERGY_CONVERSION_FACTOR } from '../../src/core/domain/constants';

const mockRoute: Route = {
  id: 'uuid-1',
  routeId: 'R002',
  vesselType: 'BulkCarrier',
  fuelType: 'LNG',
  year: 2024,
  ghgIntensity: 88.0,
  fuelConsumption: 4800,
  distance: 11500,
  totalEmissions: 4200,
  isBaseline: true,
};

function makeRepos() {
  const routeRepo: IRouteRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByRouteId: vi.fn().mockResolvedValue(mockRoute),
    findBaseline: vi.fn(),
    setBaseline: vi.fn(),
  };

  const complianceRepo: IComplianceRepository = {
    findByShipAndYear: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockImplementation(async (data) => ({
      id: 'cb-uuid',
      ...data,
      computedAt: new Date(),
    })),
  };

  const cache: ICacheService = {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn(),
    invalidate: vi.fn(),
    invalidatePattern: vi.fn(),
  };

  return { routeRepo, complianceRepo, cache };
}

describe('ComputeCBUseCase', () => {
  let useCase: ComputeCBUseCase;
  let repos: ReturnType<typeof makeRepos>;

  beforeEach(() => {
    repos = makeRepos();
    useCase = new ComputeCBUseCase(repos.routeRepo, repos.complianceRepo, repos.cache);
  });

  it('computes and saves CB for a valid route', async () => {
    const result = await useCase.execute({ shipId: 'R002', year: 2024 });

    const expectedCB =
      (TARGET_GHG_INTENSITY - 88.0) * 4800 * ENERGY_CONVERSION_FACTOR;
    expect(result.cbGco2eq).toBeCloseTo(expectedCB, 2);
    expect(repos.complianceRepo.save).toHaveBeenCalledOnce();
    expect(repos.cache.set).toHaveBeenCalledOnce();
  });

  it('returns cached value without hitting DB', async () => {
    const cachedRecord = {
      id: 'cached-uuid',
      shipId: 'R002',
      year: 2024,
      cbGco2eq: 999,
      computedAt: new Date(),
    };
    vi.mocked(repos.cache.get).mockResolvedValueOnce(cachedRecord);

    const result = await useCase.execute({ shipId: 'R002', year: 2024 });

    expect(result.cbGco2eq).toBe(999);
    expect(repos.routeRepo.findByRouteId).not.toHaveBeenCalled();
  });

  it('throws when route not found', async () => {
    vi.mocked(repos.routeRepo.findByRouteId).mockResolvedValue(null);
    await expect(
      useCase.execute({ shipId: 'UNKNOWN', year: 2024 })
    ).rejects.toThrow('not found');
  });

  it('throws when year does not match route year', async () => {
    await expect(
      useCase.execute({ shipId: 'R002', year: 2025 })
    ).rejects.toThrow('not 2025');
  });
});
