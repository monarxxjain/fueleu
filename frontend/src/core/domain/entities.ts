export interface Route {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

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
  baseline: { routeId: string; ghgIntensity: number };
  target: number;
  rows: ComparisonRow[];
}

export interface CBResult {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
  computedAt: string;
}

export interface AdjustedCBResult {
  shipId: string;
  year: number;
  cbRaw: number;
  bankedTotal: number;
  cbAdjusted: number;
}

export interface BankRecord {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt: string;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolResult {
  id: string;
  year: number;
  members: PoolMember[];
  createdAt: string;
}
