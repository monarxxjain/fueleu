import { Request, Response } from 'express';
import { z } from 'zod/v4';
import { CreatePoolUseCase } from '../../../../core/application/usecases/CreatePoolUseCase';
import { GetPoolsByYearUseCase } from '../../../../core/application/usecases/GetPoolsByYearUseCase';

const memberSchema = z.object({
  shipId: z.string().min(1),
  year: z.number().int().min(2024),
});

const createPoolSchema = z.object({
  year: z.number().int().min(2024),
  members: z.array(memberSchema).min(2),
});

const getPoolsSchema = z.object({
  year: z.coerce.number().int().min(2024),
});

export class PoolController {
  constructor(
    private readonly createPool: CreatePoolUseCase,
    private readonly getPoolsByYear: GetPoolsByYearUseCase
  ) {}

  async getByYear(req: Request, res: Response): Promise<void> {
    try {
      const parsed = getPoolsSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }

      const pools = await this.getPoolsByYear.execute(parsed.data.year);
      res.json(pools);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const parsed = createPoolSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const pool = await this.createPool.execute(parsed.data);
      res.status(201).json(pool);
    } catch (err) {
      const message = (err as Error).message;
      if (
        message.includes('No compliance') ||
        message.includes('not found')
      ) {
        res.status(400).json({ error: message });
      } else if (
        message.includes('already assigned to a pool') ||
        message.includes('cannot appear more than once')
      ) {
        res.status(409).json({ error: message });
      } else if (message.includes('Pool is invalid') || message.includes('rule violated')) {
        res.status(422).json({ error: message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  }
}
