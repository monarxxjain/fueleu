import type { Route, ComparisonResult } from '../domain/entities';

export interface IRouteService {
  getAll(): Promise<Route[]>;
  setBaseline(id: string): Promise<Route>;
  getComparison(): Promise<ComparisonResult>;
}
