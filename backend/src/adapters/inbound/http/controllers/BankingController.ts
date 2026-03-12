import { Request, Response } from 'express';
import { z } from 'zod/v4';
import { BankSurplusUseCase } from '../../../../core/application/usecases/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../../core/application/usecases/ApplyBankedUseCase';
import { IBankRepository } from '../../../../core/ports/outbound/IBankRepository';

const bankSchema = z.object({
  shipId: z.string().min(1),
  year: z.number().int().min(2024),
  amount: z.number().positive(),
});

const querySchema = z.object({
  shipId: z.string().min(1),
  year: z.coerce.number().int(),
});

export class BankingController {
  constructor(
    private readonly bankSurplus: BankSurplusUseCase,
    private readonly applyBanked: ApplyBankedUseCase,
    private readonly bankRepo: IBankRepository
  ) {}

  async getRecords(req: Request, res: Response): Promise<void> {
    try {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const records = await this.bankRepo.findByShipAndYear(
        parsed.data.shipId,
        parsed.data.year
      );
      const total = await this.bankRepo.sumByShipAndYear(
        parsed.data.shipId,
        parsed.data.year
      );
      res.json({ records, totalBanked: total });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async bank(req: Request, res: Response): Promise<void> {
    try {
      const parsed = bankSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const entry = await this.bankSurplus.execute(parsed.data);
      res.status(201).json(entry);
    } catch (err) {
      const message = (err as Error).message;
      res.status(400).json({ error: message });
    }
  }

  async apply(req: Request, res: Response): Promise<void> {
    try {
      const parsed = bankSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const entry = await this.applyBanked.execute(parsed.data);
      res.status(201).json(entry);
    } catch (err) {
      const message = (err as Error).message;
      res.status(400).json({ error: message });
    }
  }
}
