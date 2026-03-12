import { Request, Response } from 'express';
import { z } from 'zod/v4';
import { GetRoutesUseCase } from '../../../../core/application/usecases/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../../core/application/usecases/SetBaselineUseCase';
import { GetComparisonUseCase } from '../../../../core/application/usecases/GetComparisonUseCase';

const filterSchema = z.object({
  vesselType: z.string().optional(),
  fuelType: z.string().optional(),
  year: z.coerce.number().int().optional(),
});

export class RouteController {
  constructor(
    private readonly getRoutes: GetRoutesUseCase,
    private readonly setBaseline: SetBaselineUseCase,
    private readonly getComparison: GetComparisonUseCase
  ) {}

  async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const parsed = filterSchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
      }
      const { vesselType, fuelType, year } = parsed.data;

      let routes = await this.getRoutes.execute();

      if (vesselType) routes = routes.filter((r) => r.vesselType === vesselType);
      if (fuelType) routes = routes.filter((r) => r.fuelType === fuelType);
      if (year) routes = routes.filter((r) => r.year === year);

      res.json(routes);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }

  async setBaselineRoute(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params['id'] ?? '');
      if (!id) {
        res.status(400).json({ error: 'Route id is required' });
        return;
      }
      const route = await this.setBaseline.execute(id);
      res.json(route);
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes('not found')) {
        res.status(404).json({ error: message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  }

  async getComparisonData(_req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getComparison.execute();
      res.json(result);
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes('No baseline')) {
        res.status(400).json({ error: message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  }
}
