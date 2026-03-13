"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPoolRepository = void 0;
class PrismaPoolRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(year) {
        const pool = await this.prisma.pool.create({ data: { year } });
        return { id: pool.id, year: pool.year, createdAt: pool.createdAt };
    }
    async findAssignedShipIds(year, shipIds) {
        if (shipIds.length === 0)
            return [];
        const rows = await this.prisma.poolMember.findMany({
            where: {
                year,
                shipId: { in: shipIds },
            },
            select: { shipId: true },
        });
        return [...new Set(rows.map((r) => r.shipId))];
    }
    async addMember(poolId, year, member) {
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
    async findByYear(year) {
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
    async findById(id) {
        const pool = await this.prisma.pool.findUnique({
            where: { id },
            include: { members: true },
        });
        if (!pool)
            return null;
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
exports.PrismaPoolRepository = PrismaPoolRepository;
//# sourceMappingURL=PrismaPoolRepository.js.map