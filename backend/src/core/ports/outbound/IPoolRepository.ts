import { Pool, PoolMember } from '../../domain/entities/Pool';

export interface IPoolRepository {
  create(year: number): Promise<{ id: string; year: number; createdAt: Date }>;
  findAssignedShipIds(year: number, shipIds: string[]): Promise<string[]>;
  findByYear(year: number): Promise<Pool[]>;
  addMember(
    poolId: string,
    year: number,
    member: PoolMember
  ): Promise<void>;
  findById(id: string): Promise<Pool | null>;
}
