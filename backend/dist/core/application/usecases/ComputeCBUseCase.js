"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeCBUseCase = void 0;
const constants_1 = require("../../domain/constants");
class ComputeCBUseCase {
    constructor(routeRepo, complianceRepo, cache) {
        this.routeRepo = routeRepo;
        this.complianceRepo = complianceRepo;
        this.cache = cache;
    }
    async execute(input) {
        const cacheKey = `cb:${input.shipId}:${input.year}`;
        const cached = await this.cache.get(cacheKey);
        if (cached)
            return cached;
        const route = await this.routeRepo.findByRouteId(input.shipId);
        if (!route) {
            throw new Error(`Route/ship "${input.shipId}" not found`);
        }
        if (route.year !== input.year) {
            throw new Error(`Route "${input.shipId}" is for year ${route.year}, not ${input.year}`);
        }
        const cbValue = (0, constants_1.computeComplianceBalance)(route.ghgIntensity, route.fuelConsumption);
        const record = await this.complianceRepo.save({
            shipId: input.shipId,
            year: input.year,
            cbGco2eq: cbValue,
        });
        await this.cache.set(cacheKey, record, 120);
        return record;
    }
}
exports.ComputeCBUseCase = ComputeCBUseCase;
//# sourceMappingURL=ComputeCBUseCase.js.map