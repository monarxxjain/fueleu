import { Route } from '../../domain/entities/Route';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';

export class SetBaselineUseCase {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly cache: ICacheService
  ) {}

  async execute(id: string): Promise<Route> {
    const existing = await this.routeRepo.findById(id);
    if (!existing) {
      throw new Error(`Route with id "${id}" not found`);
    }

    const updated = await this.routeRepo.setBaseline(id);

    // Invalidate routes cache so next fetch reflects the new baseline
    await this.cache.invalidate('routes:all');

    return updated;
  }
}
