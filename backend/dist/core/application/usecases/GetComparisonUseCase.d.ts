import { IRouteRepository } from '../../ports/outbound/IRouteRepository';
export interface ComparisonRow {
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    baselineGhgIntensity: number;
    percentDiff: number;
    compliant: boolean;
}
export interface ComparisonResult {
    baseline: {
        routeId: string;
        ghgIntensity: number;
    };
    target: number;
    rows: ComparisonRow[];
}
export declare class GetComparisonUseCase {
    private readonly routeRepo;
    constructor(routeRepo: IRouteRepository);
    execute(): Promise<ComparisonResult>;
}
//# sourceMappingURL=GetComparisonUseCase.d.ts.map