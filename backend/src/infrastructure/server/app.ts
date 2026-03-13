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

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, '');
}

function getAllowedOrigins(): Set<string> {
  const configured = [process.env['FRONTEND_URL'], process.env['FRONTEND_URLS']]
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(','))
    .map(normalizeOrigin)
    .filter(Boolean);

  // Keep local development working even when env vars are not set.
  configured.push('http://localhost:5173');
  configured.push('http://127.0.0.1:5173');

  return new Set(configured);
}

function isTrustedVercelPreview(origin: string): boolean {
  // Allow Vercel preview URLs for this project naming pattern.
  return /^https:\/\/fueleu-[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

export function createApp(): express.Application {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  // ── Middleware ─────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser or same-origin requests with no Origin header.
        if (!origin) {
          callback(null, true);
          return;
        }

        const normalized = normalizeOrigin(origin);
        if (allowedOrigins.has(normalized) || isTrustedVercelPreview(normalized)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
      },
    })
  );
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
