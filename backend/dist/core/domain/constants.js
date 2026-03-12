"use strict";
// Core domain constants — FuelEU Maritime Regulation (EU) 2023/1805
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENERGY_CONVERSION_FACTOR = exports.TARGET_GHG_INTENSITY = void 0;
exports.computeComplianceBalance = computeComplianceBalance;
/** GHG Intensity target for 2025 onward (2% below 2020 baseline of 91.16 gCO₂e/MJ) */
exports.TARGET_GHG_INTENSITY = 89.3368; // gCO₂e/MJ
/** Lower Calorific Value conversion factor used for liquid/gaseous fuels (MJ per tonne) */
exports.ENERGY_CONVERSION_FACTOR = 41000; // MJ/t
/**
 * Compliance Balance formula:
 *   CB = (Target_GHG − Actual_GHG) × FuelConsumption_t × ENERGY_CONVERSION_FACTOR
 *   Positive CB → surplus; Negative CB → deficit
 */
function computeComplianceBalance(ghgIntensity, fuelConsumptionTonnes) {
    const energyMJ = fuelConsumptionTonnes * exports.ENERGY_CONVERSION_FACTOR;
    return (exports.TARGET_GHG_INTENSITY - ghgIntensity) * energyMJ;
}
//# sourceMappingURL=constants.js.map