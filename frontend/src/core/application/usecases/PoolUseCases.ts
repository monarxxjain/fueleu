import type { PoolResult } from '../../domain/entities';
import type { IPoolService, PoolMemberInput } from '../../ports/IPoolService';

export class CreatePoolUseCase {
  constructor(private readonly service: IPoolService) {}

  async execute(year: number, members: PoolMemberInput[]): Promise<PoolResult> {
    if (members.length < 2) {
      throw new Error('A pool must have at least 2 members');
    }
    return this.service.createPool(year, members);
  }
}
