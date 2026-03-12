import { ComplianceBalance } from '../../domain/entities/ComplianceBalance';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { IComplianceRepository } from '../../ports/outbound/IComplianceRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';
import { computeComplianceBalance } from '../../domain/constants';

export interface ComputeCBInput {
  shipId: string; // maps to routeId
  year: number;
}

export class ComputeCBUseCase {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly complianceRepo: IComplianceRepository,
    private readonly cache: ICacheService
  ) {}

  async execute(input: ComputeCBInput): Promise<ComplianceBalance> {
    const cacheKey = `cb:${input.shipId}:${input.year}`;
    const cached = await this.cache.get<ComplianceBalance>(cacheKey);
    if (cached) return cached;

    const route = await this.routeRepo.findByRouteId(input.shipId);
    if (!route) {
      throw new Error(`Route/ship "${input.shipId}" not found`);
    }
    if (route.year !== input.year) {
      throw new Error(
        `Route "${input.shipId}" is for year ${route.year}, not ${input.year}`
      );
    }

    const cbValue = computeComplianceBalance(
      route.ghgIntensity,
      route.fuelConsumption
    );

    const record = await this.complianceRepo.save({
      shipId: input.shipId,
      year: input.year,
      cbGco2eq: cbValue,
    });

    await this.cache.set(cacheKey, record, 120);
    return record;
  }
}
