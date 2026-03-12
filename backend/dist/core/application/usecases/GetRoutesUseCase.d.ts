import { Route } from '../../domain/entities/Route';
import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { ICacheService } from '../../ports/outbound/ICacheService';
export declare class GetRoutesUseCase {
    private readonly routeRepo;
    private readonly cache;
    constructor(routeRepo: IRouteRepository, cache: ICacheService);
    execute(): Promise<Route[]>;
}
//# sourceMappingURL=GetRoutesUseCase.d.ts.map