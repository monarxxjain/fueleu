"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComplianceRepository = void 0;
class PrismaComplianceRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByShipAndYear(shipId, year) {
        const row = await this.prisma.shipCompliance.findUnique({
            where: { shipId_year: { shipId, year } },
        });
        if (!row)
            return null;
        return {
            id: row.id,
            shipId: row.shipId,
            year: row.year,
            cbGco2eq: row.cbGco2eq,
            computedAt: row.computedAt,
        };
    }
    async save(record) {
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
exports.PrismaComplianceRepository = PrismaComplianceRepository;
//# sourceMappingURL=PrismaComplianceRepository.js.map