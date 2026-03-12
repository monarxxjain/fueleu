import { Request, Response } from 'express';
import { z } from 'zod/v4';
import { ComputeCBUseCase } from '../../../../core/application/usecases/ComputeCBUseCase';
import { GetAdjustedCBUseCase } from '../../../../core/application/usecases/GetAdjustedCBUseCase';

const querySchema = z.object({
  shipId: z.string().min(1),
  year: z.coerce.number().int().min(2024).max(2030),
});

export class ComplianceController {
  constructor(
    private readonly computeCB: ComputeCBUseCase,
    private readonly getAdjustedCB: GetAdjustedCBUseCase
  ) {}

  async getCB(req: Request, res: Response): Promise<void> {
    try {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const result = await this.computeCB.execute(parsed.data);
      res.json(result);
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes('not found')) {
        res.status(404).json({ error: message });
      } else {
        res.status(400).json({ error: message });
      }
    }
  }

  async getAdjustedCBHandler(req: Request, res: Response): Promise<void> {
    try {
      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const result = await this.getAdjustedCB.execute(
        parsed.data.shipId,
        parsed.data.year
      );
      res.json(result);
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes('not found') || message.includes('No compliance')) {
        res.status(404).json({ error: message });
      } else {
        res.status(400).json({ error: message });
      }
    }
  }
}
