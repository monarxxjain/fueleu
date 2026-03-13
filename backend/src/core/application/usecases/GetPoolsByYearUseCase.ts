import { Pool } from '../../domain/entities/Pool';
import { IPoolRepository } from '../../ports/outbound/IPoolRepository';

export class GetPoolsByYearUseCase {
  constructor(private readonly poolRepo: IPoolRepository) {}

  async execute(year: number): Promise<Pool[]> {
    return this.poolRepo.findByYear(year);
  }
}
