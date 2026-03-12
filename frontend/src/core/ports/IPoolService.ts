import type { PoolResult } from '../domain/entities';

export interface PoolMemberInput {
  shipId: string;
  year: number;
}

export interface IPoolService {
  createPool(year: number, members: PoolMemberInput[]): Promise<PoolResult>;
}
