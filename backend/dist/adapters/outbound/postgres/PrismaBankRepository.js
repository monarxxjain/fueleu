"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaBankRepository = void 0;
class PrismaBankRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByShipAndYear(shipId, year) {
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
    async sumByShipAndYear(shipId, year) {
        const result = await this.prisma.bankEntry.aggregate({
            where: { shipId, year },
            _sum: { amountGco2eq: true },
        });
        return result._sum.amountGco2eq ?? 0;
    }
    async create(entry) {
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
exports.PrismaBankRepository = PrismaBankRepository;
//# sourceMappingURL=PrismaBankRepository.js.map