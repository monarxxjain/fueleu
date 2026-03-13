import { Router } from 'express';
import { PoolController } from '../controllers/PoolController';

export function createPoolRouter(controller: PoolController): Router {
  const router = Router();

  router.get('/', (req, res) => controller.getByYear(req, res));
  router.post('/', (req, res) => controller.create(req, res));

  return router;
}
