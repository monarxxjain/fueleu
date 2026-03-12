"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRouteRepository = void 0;
function toEntity(r) {
    return {
        id: r.id,
        routeId: r.routeId,
        vesselType: r.vesselType,
        fuelType: r.fuelType,
        year: r.year,
        ghgIntensity: r.ghgIntensity,
        fuelConsumption: r.fuelConsumption,
        distance: r.distance,
        totalEmissions: r.totalEmissions,
        isBaseline: r.isBaseline,
    };
}
class PrismaRouteRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const rows = await this.prisma.route.findMany({ orderBy: { routeId: 'asc' } });
        return rows.map(toEntity);
    }
    async findById(id) {
        const row = await this.prisma.route.findUnique({ where: { id } });
        return row ? toEntity(row) : null;
    }
    async findByRouteId(routeId) {
        const row = await this.prisma.route.findUnique({ where: { routeId } });
        return row ? toEntity(row) : null;
    }
    async findBaseline() {
        const row = await this.prisma.route.findFirst({
            where: { isBaseline: true },
        });
        return row ? toEntity(row) : null;
    }
    async setBaseline(id) {
        // Clear any existing baseline then set the new one — in a transaction
        await this.prisma.$transaction([
            this.prisma.route.updateMany({
                where: { isBaseline: true },
                data: { isBaseline: false },
            }),
            this.prisma.route.update({
                where: { id },
                data: { isBaseline: true },
            }),
        ]);
        const updated = await this.prisma.route.findUniqueOrThrow({ where: { id } });
        return toEntity(updated);
    }
}
exports.PrismaRouteRepository = PrismaRouteRepository;
//# sourceMappingURL=PrismaRouteRepository.js.map