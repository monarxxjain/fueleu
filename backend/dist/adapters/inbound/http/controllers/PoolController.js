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
class PoolController {
    constructor(createPool) {
        this.createPool = createPool;
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