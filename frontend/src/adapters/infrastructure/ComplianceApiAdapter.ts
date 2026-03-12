import type { CBResult, AdjustedCBResult } from '../../core/domain/entities';
import type { IComplianceService } from '../../core/ports/IComplianceService';
import { apiFetch } from './apiClient';

export class ComplianceApiAdapter implements IComplianceService {
  async getCB(shipId: string, year: number): Promise<CBResult> {
    return apiFetch<CBResult>(`/compliance/cb?shipId=${shipId}&year=${year}`);
  }

  async getAdjustedCB(shipId: string, year: number): Promise<AdjustedCBResult> {
    return apiFetch<AdjustedCBResult>(
      `/compliance/adjusted-cb?shipId=${shipId}&year=${year}`
    );
  }
}
