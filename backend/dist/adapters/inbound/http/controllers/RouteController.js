"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteController = void 0;
const v4_1 = require("zod/v4");
const filterSchema = v4_1.z.object({
    vesselType: v4_1.z.string().optional(),
    fuelType: v4_1.z.string().optional(),
    year: v4_1.z.coerce.number().int().optional(),
});
class RouteController {
    constructor(getRoutes, setBaseline, getComparison) {
        this.getRoutes = getRoutes;
        this.setBaseline = setBaseline;
        this.getComparison = getComparison;
    }
    async getAllRoutes(req, res) {
        try {
            const parsed = filterSchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const { vesselType, fuelType, year } = parsed.data;
            let routes = await this.getRoutes.execute();
            if (vesselType)
                routes = routes.filter((r) => r.vesselType === vesselType);
            if (fuelType)
                routes = routes.filter((r) => r.fuelType === fuelType);
            if (year)
                routes = routes.filter((r) => r.year === year);
            res.json(routes);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async setBaselineRoute(req, res) {
        try {
            const id = String(req.params['id'] ?? '');
            if (!id) {
                res.status(400).json({ error: 'Route id is required' });
                return;
            }
            const route = await this.setBaseline.execute(id);
            res.json(route);
        }
        catch (err) {
            const message = err.message;
            if (message.includes('not found')) {
                res.status(404).json({ error: message });
            }
            else {
                res.status(500).json({ error: message });
            }
        }
    }
    async getComparisonData(_req, res) {
        try {
            const result = await this.getComparison.execute();
            res.json(result);
        }
        catch (err) {
            const message = err.message;
            if (message.includes('No baseline')) {
                res.status(400).json({ error: message });
            }
            else {
                res.status(500).json({ error: message });
            }
        }
    }
}
exports.RouteController = RouteController;
//# sourceMappingURL=RouteController.js.map