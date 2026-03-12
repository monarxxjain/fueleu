import type { BankRecord } from '../../core/domain/entities';
import type { IBankingService, BankPayload } from '../../core/ports/IBankingService';
import { apiFetch } from './apiClient';

export class BankingApiAdapter implements IBankingService {
  async getRecords(shipId: string, year: number): Promise<BankRecord[]> {
    return apiFetch<BankRecord[]>(
      `/banking/records?shipId=${shipId}&year=${year}`
    );
  }

  async bank(payload: BankPayload): Promise<BankRecord> {
    return apiFetch<BankRecord>('/banking/bank', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async apply(payload: BankPayload): Promise<BankRecord> {
    return apiFetch<BankRecord>('/banking/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}
