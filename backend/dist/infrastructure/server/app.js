"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routeRouter_1 = require("../../adapters/inbound/http/routes/routeRouter");
const complianceRouter_1 = require("../../adapters/inbound/http/routes/complianceRouter");
const bankingRouter_1 = require("../../adapters/inbound/http/routes/bankingRouter");
const poolRouter_1 = require("../../adapters/inbound/http/routes/poolRouter");
const container_1 = require("../container");
function createApp() {
    const app = (0, express_1.default)();
    // ── Middleware ─────────────────────────────────────────────────────────────
    app.use((0, cors_1.default)({ origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173' }));
    app.use(express_1.default.json());
    // ── Health check ───────────────────────────────────────────────────────────
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // ── API routes ─────────────────────────────────────────────────────────────
    app.use('/routes', (0, routeRouter_1.createRouteRouter)(container_1.routeController));
    app.use('/compliance', (0, complianceRouter_1.createComplianceRouter)(container_1.complianceController));
    app.use('/banking', (0, bankingRouter_1.createBankingRouter)(container_1.bankingController));
    app.use('/pools', (0, poolRouter_1.createPoolRouter)(container_1.poolController));
    // ── 404 catch-all ─────────────────────────────────────────────────────────
    app.use((_req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
    return app;
}
//# sourceMappingURL=app.js.map