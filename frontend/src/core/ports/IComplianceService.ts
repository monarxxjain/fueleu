import type { CBResult, AdjustedCBResult } from '../domain/entities';

export interface IComplianceService {
  getCB(shipId: string, year: number): Promise<CBResult>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedCBResult>;
}
