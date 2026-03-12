import { Router } from 'express';
import { RouteController } from '../controllers/RouteController';

export function createRouteRouter(controller: RouteController): Router {
  const router = Router();

  router.get('/', (req, res) => controller.getAllRoutes(req, res));
  router.get('/comparison', (req, res) => controller.getComparisonData(req, res));
  router.post('/:id/baseline', (req, res) => controller.setBaselineRoute(req, res));

  return router;
}
