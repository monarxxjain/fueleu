import { describe, it, expect } from 'vitest';
import { computeComplianceBalance, TARGET_GHG_INTENSITY, ENERGY_CONVERSION_FACTOR } from '../../src/core/domain/constants';

describe('computeComplianceBalance', () => {
  it('returns positive CB for compliant route (ghg < target)', () => {
    const ghg = 88.0;
    const fuel = 4800;
    const cb = computeComplianceBalance(ghg, fuel);
    const expected = (TARGET_GHG_INTENSITY - ghg) * fuel * ENERGY_CONVERSION_FACTOR;
    expect(cb).toBeCloseTo(expected, 2);
    expect(cb).toBeGreaterThan(0);
  });

  it('returns negative CB for non-compliant route (ghg > target)', () => {
    const ghg = 91.0;
    const fuel = 5000;
    const cb = computeComplianceBalance(ghg, fuel);
    expect(cb).toBeLessThan(0);
  });

  it('returns zero CB when ghg exactly equals target', () => {
    const cb = computeComplianceBalance(TARGET_GHG_INTENSITY, 5000);
    expect(cb).toBe(0);
  });

  it('R002: ghg=88.0, fuel=4800 → surplus', () => {
    const cb = computeComplianceBalance(88.0, 4800);
    // (89.3368 - 88.0) * 4800 * 41000 = 1.3368 * 4800 * 41000 = 263,082,240
    expect(cb).toBeCloseTo(263_082_240, -2);
  });

  it('R003: ghg=93.5, fuel=5100 → deficit', () => {
    const cb = computeComplianceBalance(93.5, 5100);
    expect(cb).toBeLessThan(0);
  });
});
