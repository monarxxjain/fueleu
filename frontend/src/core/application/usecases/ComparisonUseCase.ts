import type { ComparisonResult } from '../../domain/entities';
import type { IRouteService } from '../../ports/IRouteService';

export class FetchComparisonUseCase {
  constructor(private readonly service: IRouteService) {}

  async execute(): Promise<ComparisonResult> {
    return this.service.getComparison();
  }
}
