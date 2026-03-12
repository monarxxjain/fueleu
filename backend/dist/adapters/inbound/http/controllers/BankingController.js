"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingController = void 0;
const v4_1 = require("zod/v4");
const bankSchema = v4_1.z.object({
    shipId: v4_1.z.string().min(1),
    year: v4_1.z.number().int().min(2024),
    amount: v4_1.z.number().positive(),
});
const querySchema = v4_1.z.object({
    shipId: v4_1.z.string().min(1),
    year: v4_1.z.coerce.number().int(),
});
class BankingController {
    constructor(bankSurplus, applyBanked, bankRepo) {
        this.bankSurplus = bankSurplus;
        this.applyBanked = applyBanked;
        this.bankRepo = bankRepo;
    }
    async getRecords(req, res) {
        try {
            const parsed = querySchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const records = await this.bankRepo.findByShipAndYear(parsed.data.shipId, parsed.data.year);
            const total = await this.bankRepo.sumByShipAndYear(parsed.data.shipId, parsed.data.year);
            res.json({ records, totalBanked: total });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    async bank(req, res) {
        try {
            const parsed = bankSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const entry = await this.bankSurplus.execute(parsed.data);
            res.status(201).json(entry);
        }
        catch (err) {
            const message = err.message;
            res.status(400).json({ error: message });
        }
    }
    async apply(req, res) {
        try {
            const parsed = bankSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: parsed.error.flatten() });
                return;
            }
            const entry = await this.applyBanked.execute(parsed.data);
            res.status(201).json(entry);
        }
        catch (err) {
            const message = err.message;
            res.status(400).json({ error: message });
        }
    }
}
exports.BankingController = BankingController;
//# sourceMappingURL=BankingController.js.map