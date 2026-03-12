import type { Route, ComparisonResult } from '../../core/domain/entities';
import type { IRouteService } from '../../core/ports/IRouteService';
import { apiFetch } from './apiClient';

export class RouteApiAdapter implements IRouteService {
  async getAll(): Promise<Route[]> {
    return apiFetch<Route[]>('/routes');
  }

  async setBaseline(id: string): Promise<Route> {
    return apiFetch<Route>(`/routes/${id}/baseline`, { method: 'POST' });
  }

  async getComparison(): Promise<ComparisonResult> {
    return apiFetch<ComparisonResult>('/routes/comparison');
  }
}
