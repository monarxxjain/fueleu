import { PrismaClient } from '../../../generated/prisma/client';
import { IPoolRepository } from '../../../core/ports/outbound/IPoolRepository';
import { Pool, PoolMember } from '../../../core/domain/entities/Pool';

export class PrismaPoolRepository implements IPoolRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(year: number): Promise<{ id: string; year: number; createdAt: Date }> {
    const pool = await this.prisma.pool.create({ data: { year } });
    return { id: pool.id, year: pool.year, createdAt: pool.createdAt };
  }

  async findAssignedShipIds(year: number, shipIds: string[]): Promise<string[]> {
    if (shipIds.length === 0) return [];

    const rows = await this.prisma.poolMember.findMany({
      where: {
        year,
        shipId: { in: shipIds },
      },
      select: { shipId: true },
    });

    return [...new Set(rows.map((r) => r.shipId))];
  }

  async addMember(poolId: string, year: number, member: PoolMember): Promise<void> {
    await this.prisma.poolMember.create({
      data: {
        poolId,
        year,
        shipId: member.shipId,
        cbBefore: member.cbBefore,
        cbAfter: member.cbAfter,
      },
    });
  }

  async findByYear(year: number): Promise<Pool[]> {
    const pools = await this.prisma.pool.findMany({
      where: { year },
      include: { members: true },
      orderBy: { createdAt: 'desc' },
    });

    return pools.map((pool) => ({
      id: pool.id,
      year: pool.year,
      createdAt: pool.createdAt,
      members: pool.members.map((m) => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
    }));
  }

  async findById(id: string): Promise<Pool | null> {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!pool) return null;
    return {
      id: pool.id,
      year: pool.year,
      createdAt: pool.createdAt,
      members: pool.members.map((m) => ({
        shipId: m.shipId,
        cbBefore: m.cbBefore,
        cbAfter: m.cbAfter,
      })),
    };
  }
}
