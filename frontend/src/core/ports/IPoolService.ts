import type { PoolResult } from '../domain/entities';

export interface PoolMemberInput {
  shipId: string;
  year: number;
}

export interface IPoolService {
  getPools(year: number): Promise<PoolResult[]>;
  createPool(year: number, members: PoolMemberInput[]): Promise<PoolResult>;
}
