"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolController = void 0;
const v4_1 = require("zod/v4");
const memberSchema = v4_1.z.object({
    shipId: v4_1.z.string().min(1),
    year: v4_1.z.number().int().min(2024),
});
const createPoolSchema = v4_1.z.object({
    year: v4_1.z.number().int().min(2024),
    members: v4_1.z.array(memberSchema).min(2),
});
const getPoolsSchema = v4_1.z.object({
    year: v4_1.z.coerce.number().int().min(2024),
});
class PoolController {
    constructor(createPool, getPoolsByYear) {
        this.createPool = createPool;
        this.getPoolsByYear = getPoolsByYear;
    }
    async getByYear(req, res) {
        try {
            const parsed = getPoolsSchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const pools = await this.getPoolsByYear.execute(parsed.data.year);
            res.json(pools);
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async create(req, res) {
        try {
            const parsed = createPoolSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const pool = await this.createPool.execute(parsed.data);
            res.status(201).json(pool);
        }
        catch (err) {
            const message = err.message;
            if (message.includes('No compliance') ||
                message.includes('not found')) {
                res.status(400).json({ error: message });
            }
            else if (message.includes('already assigned to a pool') ||
                message.includes('cannot appear more than once')) {
                res.status(409).json({ error: message });
            }
            else if (message.includes('Pool is invalid') || message.includes('rule violated')) {
                res.status(422).json({ error: message });
            }
            else {
                res.status(500).json({ error: message });
            }
        }
    }
}
exports.PoolController = PoolController;
//# sourceMappingURL=PoolController.js.map