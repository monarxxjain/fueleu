import { Pool, PoolMember } from '../../domain/entities/Pool';

export interface IPoolRepository {
  create(year: number): Promise<{ id: string; year: number; createdAt: Date }>;
  addMember(
    poolId: string,
    member: PoolMember
  ): Promise<void>;
  findById(id: string): Promise<Pool | null>;
}
