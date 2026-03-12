import { PrismaClient } from '../../../generated/prisma/client';
import { IRouteRepository } from '../../../core/ports/outbound/IRouteRepository';
import { Route } from '../../../core/domain/entities/Route';

function toEntity(r: {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}): Route {
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

export class PrismaRouteRepository implements IRouteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Route[]> {
    const rows = await this.prisma.route.findMany({ orderBy: { routeId: 'asc' } });
    return rows.map(toEntity);
  }

  async findById(id: string): Promise<Route | null> {
    const row = await this.prisma.route.findUnique({ where: { id } });
    return row ? toEntity(row) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const row = await this.prisma.route.findUnique({ where: { routeId } });
    return row ? toEntity(row) : null;
  }

  async findBaseline(): Promise<Route | null> {
    const row = await this.prisma.route.findFirst({
      where: { isBaseline: true },
    });
    return row ? toEntity(row) : null;
  }

  async setBaseline(id: string): Promise<Route> {
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
