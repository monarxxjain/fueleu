"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
const v4_1 = require("zod/v4");
const querySchema = v4_1.z.object({
    shipId: v4_1.z.string().min(1),
    year: v4_1.z.coerce.number().int().min(2024).max(2030),
});
class ComplianceController {
    constructor(computeCB, getAdjustedCB) {
        this.computeCB = computeCB;
        this.getAdjustedCB = getAdjustedCB;
    }
    async getCB(req, res) {
        try {
            const parsed = querySchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const result = await this.computeCB.execute(parsed.data);
            res.json(result);
        }
        catch (err) {
            const message = err.message;
            if (message.includes('not found')) {
                res.status(404).json({ error: message });
            }
            else {
                res.status(400).json({ error: message });
            }
        }
    }
    async getAdjustedCBHandler(req, res) {
        try {
            const parsed = querySchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const result = await this.getAdjustedCB.execute(parsed.data.shipId, parsed.data.year);
            res.json(result);
        }
        catch (err) {
            const message = err.message;
            if (message.includes('not found') || message.includes('No compliance')) {
                res.status(404).json({ error: message });
            }
            else {
                res.status(400).json({ error: message });
            }
        }
    }
}
exports.ComplianceController = ComplianceController;
//# sourceMappingURL=ComplianceController.js.map