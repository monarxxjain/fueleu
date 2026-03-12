"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetComparisonUseCase = void 0;
const constants_1 = require("../../domain/constants");
class GetComparisonUseCase {
    constructor(routeRepo) {
        this.routeRepo = routeRepo;
    }
    async execute() {
        const baseline = await this.routeRepo.findBaseline();
        if (!baseline) {
            throw new Error('No baseline route set. Please set a baseline first.');
        }
        const all = await this.routeRepo.findAll();
        const rows = all.map((route) => {
            const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
            const compliant = route.ghgIntensity <= constants_1.TARGET_GHG_INTENSITY;
            return {
                routeId: route.routeId,
                vesselType: route.vesselType,
                fuelType: route.fuelType,
                year: route.year,
                ghgIntensity: route.ghgIntensity,
                baselineGhgIntensity: baseline.ghgIntensity,
                percentDiff: Math.round(percentDiff * 100) / 100,
                compliant,
            };
        });
        return {
            baseline: {
                routeId: baseline.routeId,
                ghgIntensity: baseline.ghgIntensity,
            },
            target: constants_1.TARGET_GHG_INTENSITY,
            rows,
        };
    }
}
exports.GetComparisonUseCase = GetComparisonUseCase;
//# sourceMappingURL=GetComparisonUseCase.js.map