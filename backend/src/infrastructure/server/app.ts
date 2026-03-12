import express from 'express';
import cors from 'cors';
import { createRouteRouter } from '../../adapters/inbound/http/routes/routeRouter';
import { createComplianceRouter } from '../../adapters/inbound/http/routes/complianceRouter';
import { createBankingRouter } from '../../adapters/inbound/http/routes/bankingRouter';
import { createPoolRouter } from '../../adapters/inbound/http/routes/poolRouter';
import {
  routeController,
  complianceController,
  bankingController,
  poolController,
} from '../container';

export function createApp(): express.Application {
  const app = express();

  // ── Middleware ─────────────────────────────────────────────────────────────
  app.use(cors({ origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173' }));
  app.use(express.json());

  // ── Health check ───────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── API routes ─────────────────────────────────────────────────────────────
  app.use('/routes', createRouteRouter(routeController));
  app.use('/compliance', createComplianceRouter(complianceController));
  app.use('/banking', createBankingRouter(bankingController));
  app.use('/pools', createPoolRouter(poolController));

  // ── 404 catch-all ─────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
