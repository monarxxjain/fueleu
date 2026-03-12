// Core domain constants — FuelEU Maritime Regulation (EU) 2023/1805

/** GHG Intensity target for 2025 onward (2% below 2020 baseline of 91.16 gCO₂e/MJ) */
export const TARGET_GHG_INTENSITY = 89.3368; // gCO₂e/MJ

/** Lower Calorific Value conversion factor used for liquid/gaseous fuels (MJ per tonne) */
export const ENERGY_CONVERSION_FACTOR = 41_000; // MJ/t

/**
 * Compliance Balance formula:
 *   CB = (Target_GHG − Actual_GHG) × FuelConsumption_t × ENERGY_CONVERSION_FACTOR
 *   Positive CB → surplus; Negative CB → deficit
 */
export function computeComplianceBalance(
  ghgIntensity: number,
  fuelConsumptionTonnes: number
): number {
  const energyMJ = fuelConsumptionTonnes * ENERGY_CONVERSION_FACTOR;
  return (TARGET_GHG_INTENSITY - ghgIntensity) * energyMJ;
}
