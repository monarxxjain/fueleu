export interface ComplianceBalance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;   // Positive = surplus, Negative = deficit
  computedAt: Date;
}
