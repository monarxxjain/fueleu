"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyBankedUseCase = void 0;
class ApplyBankedUseCase {
    constructor(bankRepo, cache) {
        this.bankRepo = bankRepo;
        this.cache = cache;
    }
    async execute(input) {
        if (input.amount <= 0) {
            throw new Error('Amount to apply must be positive');
        }
        const totalBanked = await this.bankRepo.sumByShipAndYear(input.shipId, input.year);
        if (totalBanked <= 0) {
            throw new Error(`No banked surplus available for ship "${input.shipId}" year ${input.year}`);
        }
        if (input.amount > totalBanked) {
            throw new Error(`Cannot apply ${input.amount}; only ${totalBanked.toFixed(2)} gCO₂eq banked`);
        }
        // Store as a negative entry to reduce the banked pool
        const entry = await this.bankRepo.create({
            shipId: input.shipId,
            year: input.year,
            amountGco2eq: -input.amount,
        });
        await this.cache.invalidate(`cb:${input.shipId}:${input.year}`);
        return entry;
    }
}
exports.ApplyBankedUseCase = ApplyBankedUseCase;
//# sourceMappingURL=ApplyBankedUseCase.js.map