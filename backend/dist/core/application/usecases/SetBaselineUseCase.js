"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetBaselineUseCase = void 0;
class SetBaselineUseCase {
    constructor(routeRepo, cache) {
        this.routeRepo = routeRepo;
        this.cache = cache;
    }
    async execute(id) {
        const existing = await this.routeRepo.findById(id);
        if (!existing) {
            throw new Error(`Route with id "${id}" not found`);
        }
        const updated = await this.routeRepo.setBaseline(id);
        // Invalidate routes cache so next fetch reflects the new baseline
        await this.cache.invalidate('routes:all');
        return updated;
    }
}
exports.SetBaselineUseCase = SetBaselineUseCase;
//# sourceMappingURL=SetBaselineUseCase.js.map