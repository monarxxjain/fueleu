/** GHG Intensity target for 2025 onward (2% below 2020 baseline of 91.16 gCO₂e/MJ) */
export declare const TARGET_GHG_INTENSITY = 89.3368;
/** Lower Calorific Value conversion factor used for liquid/gaseous fuels (MJ per tonne) */
export declare const ENERGY_CONVERSION_FACTOR = 41000;
/**
 * Compliance Balance formula:
 *   CB = (Target_GHG − Actual_GHG) × FuelConsumption_t × ENERGY_CONVERSION_FACTOR
 *   Positive CB → surplus; Negative CB → deficit
 */
export declare function computeComplianceBalance(ghgIntensity: number, fuelConsumptionTonnes: number): number;
//# sourceMappingURL=constants.d.ts.map