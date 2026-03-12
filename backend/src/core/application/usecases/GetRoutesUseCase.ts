import { Route } from '../../domain/entities/Route';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';

const CACHE_KEY = 'routes:all';
const CACHE_TTL = 60; // 60 seconds

export class GetRoutesUseCase {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly cache: ICacheService
  ) {}

  async execute(): Promise<Route[]> {
    const cached = await this.cache.get<Route[]>(CACHE_KEY);
    if (cached) return cached;

    const routes = await this.routeRepo.findAll();
    await this.cache.set(CACHE_KEY, routes, CACHE_TTL);
    return routes;
  }
}
