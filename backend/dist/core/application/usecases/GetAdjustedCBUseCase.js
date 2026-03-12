"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdjustedCBUseCase = void 0;
class GetAdjustedCBUseCase {
    constructor(complianceRepo, bankRepo) {
        this.complianceRepo = complianceRepo;
        this.bankRepo = bankRepo;
    }
    async execute(shipId, year) {
        const record = await this.complianceRepo.findByShipAndYear(shipId, year);
        if (!record) {
            throw new Error(`No compliance record found for ship "${shipId}" year ${year}. Compute CB first.`);
        }
        // Sum of all bank entries (positive=banked, negative=applied)
        const bankedTotal = await this.bankRepo.sumByShipAndYear(shipId, year);
        return {
            shipId,
            year,
            cbRaw: record.cbGco2eq,
            bankedTotal,
            cbAdjusted: record.cbGco2eq + bankedTotal,
        };
    }
}
exports.GetAdjustedCBUseCase = GetAdjustedCBUseCase;
//# sourceMappingURL=GetAdjustedCBUseCase.js.map