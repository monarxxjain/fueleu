export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;   // Positive = banked surplus; Negative = applied to deficit
  createdAt: Date;
}
