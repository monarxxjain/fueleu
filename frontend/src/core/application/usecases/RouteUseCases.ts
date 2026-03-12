import type { Route } from '../../domain/entities';
import type { IRouteService } from '../../ports/IRouteService';

export class FetchRoutesUseCase {
  constructor(private readonly service: IRouteService) {}

  async execute(): Promise<Route[]> {
    return this.service.getAll();
  }
}

export class SetBaselineUseCase {
  constructor(private readonly service: IRouteService) {}

  async execute(id: string): Promise<Route> {
    return this.service.setBaseline(id);
  }
}
