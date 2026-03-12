import type { BankRecord } from '../domain/entities';

export interface BankPayload {
  shipId: string;
  year: number;
  amount: number;
}

export interface IBankingService {
  getRecords(shipId: string, year: number): Promise<BankRecord[]>;
  bank(payload: BankPayload): Promise<BankRecord>;
  apply(payload: BankPayload): Promise<BankRecord>;
}
