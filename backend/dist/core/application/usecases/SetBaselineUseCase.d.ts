import { Route } from '../../domain/entities/Route';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';
export declare class SetBaselineUseCase {
    private readonly routeRepo;
    private readonly cache;
    constructor(routeRepo: IRouteRepository, cache: ICacheService);
    execute(id: string): Promise<Route>;
}
//# sourceMappingURL=SetBaselineUseCase.d.ts.map