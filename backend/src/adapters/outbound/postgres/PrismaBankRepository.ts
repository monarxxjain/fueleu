import { PrismaClient } from '../../../generated/prisma/client';
import { IBankRepository } from '../../../core/ports/outbound/IBankRepository';
import { BankEntry } from '../../../core/domain/entities/BankEntry';

export class PrismaBankRepository implements IBankRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const rows = await this.prisma.bankEntry.findMany({
      where: { shipId, year },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => ({
      id: r.id,
      shipId: r.shipId,
      year: r.year,
      amountGco2eq: r.amountGco2eq,
      createdAt: r.createdAt,
    }));
  }

  async sumByShipAndYear(shipId: string, year: number): Promise<number> {
    const result = await this.prisma.bankEntry.aggregate({
      where: { shipId, year },
      _sum: { amountGco2eq: true },
    });
    return result._sum.amountGco2eq ?? 0;
  }

  async create(
    entry: Omit<BankEntry, 'id' | 'createdAt'>
  ): Promise<BankEntry> {
    const row = await this.prisma.bankEntry.create({
      data: {
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amountGco2eq,
      },
    });
    return {
      id: row.id,
      shipId: row.shipId,
      year: row.year,
      amountGco2eq: row.amountGco2eq,
      createdAt: row.createdAt,
    };
  }
}
