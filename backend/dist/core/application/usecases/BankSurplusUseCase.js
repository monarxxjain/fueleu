"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankSurplusUseCase = void 0;
class BankSurplusUseCase {
    constructor(complianceRepo, bankRepo, cache) {
        this.complianceRepo = complianceRepo;
        this.bankRepo = bankRepo;
        this.cache = cache;
    }
    async execute(input) {
        if (input.amount <= 0) {
            throw new Error('Amount to bank must be positive');
        }
        const record = await this.complianceRepo.findByShipAndYear(input.shipId, input.year);
        if (!record) {
            throw new Error(`No compliance record for ship "${input.shipId}" year ${input.year}. Compute CB first.`);
        }
        const alreadyBanked = await this.bankRepo.sumByShipAndYear(input.shipId, input.year);
        const availableCB = record.cbGco2eq + alreadyBanked;
        if (availableCB <= 0) {
            throw new Error(`Ship "${input.shipId}" has no surplus to bank (adjusted CB = ${availableCB.toFixed(2)})`);
        }
        if (input.amount > availableCB) {
            throw new Error(`Cannot bank ${input.amount}; only ${availableCB.toFixed(2)} gCO₂eq available`);
        }
        const entry = await this.bankRepo.create({
            shipId: input.shipId,
            year: input.year,
            amountGco2eq: input.amount,
        });
        await this.cache.invalidate(`cb:${input.shipId}:${input.year}`);
        return entry;
    }
}
exports.BankSurplusUseCase = BankSurplusUseCase;
//# sourceMappingURL=BankSurplusUseCase.js.map