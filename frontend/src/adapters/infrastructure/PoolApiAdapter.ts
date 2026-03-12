import type { PoolResult } from '../../core/domain/entities';
import type { IPoolService, PoolMemberInput } from '../../core/ports/IPoolService';
import { apiFetch } from './apiClient';

export class PoolApiAdapter implements IPoolService {
  async createPool(year: number, members: PoolMemberInput[]): Promise<PoolResult> {
    return apiFetch<PoolResult>('/pools', {
      method: 'POST',
      body: JSON.stringify({ year, members }),
    });
  }
}
