import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
import { TARGET_GHG_INTENSITY } from '../../domain/constants';

export interface ComparisonRow {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  baselineGhgIntensity: number;
  percentDiff: number;        // vs baseline
  compliant: boolean;          // vs target (89.3368)
}

export interface ComparisonResult {
  baseline: {
    routeId: string;
    ghgIntensity: number;
  };
  target: number;
  rows: ComparisonRow[];
}

export class GetComparisonUseCase {
  constructor(private readonly routeRepo: IRouteRepository) {}

  async execute(): Promise<ComparisonResult> {
    const baseline = await this.routeRepo.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route set. Please set a baseline first.');
    }

    const all = await this.routeRepo.findAll();

    const rows: ComparisonRow[] = all.map((route) => {
      const percentDiff =
        ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const compliant = route.ghgIntensity <= TARGET_GHG_INTENSITY;
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
      target: TARGET_GHG_INTENSITY,
      rows,
    };
  }
}
