import type { BankRecord } from '../../core/domain/entities';
import type { IBankingService, BankPayload } from '../../core/ports/IBankingService';
import { apiFetch } from './apiClient';

interface BankRecordsResponse {
  records: BankRecord[];
  totalBanked: number;
}

export class BankingApiAdapter implements IBankingService {
  async getRecords(shipId: string, year: number): Promise<BankRecord[]> {
    const response = await apiFetch<BankRecord[] | BankRecordsResponse>(
      `/banking/records?shipId=${shipId}&year=${year}`
    );

    // Support both legacy array response and current object response.
    return Array.isArray(response) ? response : response.records;
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
