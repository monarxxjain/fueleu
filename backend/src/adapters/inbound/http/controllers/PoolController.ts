import { Request, Response } from 'express';
import { z } from 'zod/v4';
import { CreatePoolUseCase } from '../../../../core/application/usecases/CreatePoolUseCase';

const memberSchema = z.object({
  shipId: z.string().min(1),
  year: z.number().int().min(2024),
});

const createPoolSchema = z.object({
  year: z.number().int().min(2024),
  members: z.array(memberSchema).min(2),
});

export class PoolController {
  constructor(private readonly createPool: CreatePoolUseCase) {}

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
      } else if (message.includes('Pool is invalid') || message.includes('rule violated')) {
        res.status(422).json({ error: message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  }
}
