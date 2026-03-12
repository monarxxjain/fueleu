import { PrismaClient } from '../../../generated/prisma/client';
import { IComplianceRepository } from '../../../core/ports/outbound/IComplianceRepository';
import { ComplianceBalance } from '../../../core/domain/entities/ComplianceBalance';

export class PrismaComplianceRepository implements IComplianceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByShipAndYear(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance | null> {
    const row = await this.prisma.shipCompliance.findUnique({
      where: { shipId_year: { shipId, year } },
    });
    if (!row) return null;
    return {
      id: row.id,
      shipId: row.shipId,
      year: row.year,
      cbGco2eq: row.cbGco2eq,
      computedAt: row.computedAt,
    };
  }

  async save(
    record: Omit<ComplianceBalance, 'id' | 'computedAt'>
  ): Promise<ComplianceBalance> {
    const row = await this.prisma.shipCompliance.upsert({
      where: { shipId_year: { shipId: record.shipId, year: record.year } },
      update: { cbGco2eq: record.cbGco2eq, computedAt: new Date() },
      create: {
        shipId: record.shipId,
        year: record.year,
        cbGco2eq: record.cbGco2eq,
      },
    });
    return {
      id: row.id,
      shipId: row.shipId,
      year: row.year,
      cbGco2eq: row.cbGco2eq,
      computedAt: row.computedAt,
    };
  }
}
