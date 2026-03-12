import { describe, it, expect, vi } from 'vitest';
import { FetchRoutesUseCase, SetBaselineUseCase } from '../../../core/application/usecases/RouteUseCases';
import type { IRouteService } from '../../../core/ports/IRouteService';
import type { Route } from '../../../core/domain/entities';

const mockRoute: Route = {
  id: '1',
  routeId: 'R001',
  vesselType: 'Container',
  fuelType: 'HFO',
  year: 2024,
  ghgIntensity: 91.0,
  fuelConsumption: 5000,
  distance: 12000,
  totalEmissions: 4500,
  isBaseline: false,
};

function makeService(overrides: Partial<IRouteService> = {}): IRouteService {
  return {
    getAll: vi.fn().mockResolvedValue([mockRoute]),
    setBaseline: vi.fn().mockResolvedValue({ ...mockRoute, isBaseline: true }),
    getComparison: vi.fn().mockResolvedValue({ baseline: { routeId: 'R001', ghgIntensity: 91 }, target: 89.3368, rows: [] }),
    ...overrides,
  };
}

describe('FetchRoutesUseCase', () => {
  it('returns routes from the service', async () => {
    const service = makeService();
    const routes = await new FetchRoutesUseCase(service).execute();
    expect(routes).toHaveLength(1);
    expect(routes[0].routeId).toBe('R001');
  });
});

describe('SetBaselineUseCase', () => {
  it('calls setBaseline on the service with the given id', async () => {
    const service = makeService();
    const result = await new SetBaselineUseCase(service).execute('1');
    expect(service.setBaseline).toHaveBeenCalledWith('1');
    expect(result.isBaseline).toBe(true);
  });
});
