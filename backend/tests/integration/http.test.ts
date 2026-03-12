import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/infrastructure/server/app';
import { cache, prisma } from '../../src/infrastructure/container';
import { computeComplianceBalance } from '../../src/core/domain/constants';

const app = createApp();

async function resetDatabase() {
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();
  cache.clear();
}

async function seedRoutes() {
  const positive = await prisma.route.create({
    data: {
      routeId: 'TEST-POS',
      vesselType: 'Container',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 12000,
      totalEmissions: 4200,
      isBaseline: true,
    },
  });

  const negative = await prisma.route.create({
    data: {
      routeId: 'TEST-NEG',
      vesselType: 'Tanker',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 93.5,
      fuelConsumption: 5100,
      distance: 12500,
      totalEmissions: 4700,
      isBaseline: false,
    },
  });

  const poolSurplus = await prisma.route.create({
    data: {
      routeId: 'TEST-POOL',
      vesselType: 'RoRo',
      fuelType: 'Methanol',
      year: 2024,
      ghgIntensity: 80.0,
      fuelConsumption: 6000,
      distance: 13000,
      totalEmissions: 3900,
      isBaseline: false,
    },
  });

  return { positive, negative, poolSurplus };
}

describe('HTTP integration', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await prisma.$disconnect();
  });

  it('returns health status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('returns routes, supports filtering, and updates the baseline route', async () => {
    const { positive, negative } = await seedRoutes();

    const allRoutes = await request(app).get('/routes');
    expect(allRoutes.status).toBe(200);
    expect(allRoutes.body).toHaveLength(3);

    const filtered = await request(app).get('/routes').query({ fuelType: 'HFO' });
    expect(filtered.status).toBe(200);
    expect(filtered.body).toHaveLength(1);
    expect(filtered.body[0].routeId).toBe('TEST-NEG');

    const baselineUpdate = await request(app).post(`/routes/${negative.id}/baseline`);
    expect(baselineUpdate.status).toBe(200);
    expect(baselineUpdate.body.id).toBe(negative.id);
    expect(baselineUpdate.body.isBaseline).toBe(true);

    const refreshedPositive = await prisma.route.findUniqueOrThrow({ where: { id: positive.id } });
    const refreshedNegative = await prisma.route.findUniqueOrThrow({ where: { id: negative.id } });
    expect(refreshedPositive.isBaseline).toBe(false);
    expect(refreshedNegative.isBaseline).toBe(true);
  });

  it('returns comparison data using the configured baseline', async () => {
    await seedRoutes();

    const response = await request(app).get('/routes/comparison');

    expect(response.status).toBe(200);
    expect(response.body.baseline.routeId).toBe('TEST-POS');
    expect(response.body.target).toBe(89.3368);
    expect(response.body.rows).toHaveLength(3);
    expect(response.body.rows.some((row: { routeId: string }) => row.routeId === 'TEST-NEG')).toBe(true);
  });

  it('computes CB, banks surplus, applies banked surplus, and returns adjusted CB', async () => {
    await seedRoutes();

    const expectedCb = computeComplianceBalance(88.0, 4800);

    const cbResponse = await request(app)
      .get('/compliance/cb')
      .query({ shipId: 'TEST-POS', year: 2024 });
    expect(cbResponse.status).toBe(200);
    expect(cbResponse.body.shipId).toBe('TEST-POS');
    expect(cbResponse.body.cbGco2eq).toBeCloseTo(expectedCb, 5);

    const bankResponse = await request(app)
      .post('/banking/bank')
      .send({ shipId: 'TEST-POS', year: 2024, amount: 50000 });
    expect(bankResponse.status).toBe(201);
    expect(bankResponse.body.amountGco2eq).toBe(50000);

    const recordsResponse = await request(app)
      .get('/banking/records')
      .query({ shipId: 'TEST-POS', year: 2024 });
    expect(recordsResponse.status).toBe(200);
    expect(recordsResponse.body.records).toHaveLength(1);
    expect(recordsResponse.body.totalBanked).toBe(50000);

    const applyResponse = await request(app)
      .post('/banking/apply')
      .send({ shipId: 'TEST-POS', year: 2024, amount: 20000 });
    expect(applyResponse.status).toBe(201);
    expect(applyResponse.body.amountGco2eq).toBe(-20000);

    const adjustedResponse = await request(app)
      .get('/compliance/adjusted-cb')
      .query({ shipId: 'TEST-POS', year: 2024 });
    expect(adjustedResponse.status).toBe(200);
    expect(adjustedResponse.body.cbRaw).toBeCloseTo(expectedCb, 5);
    expect(adjustedResponse.body.bankedTotal).toBe(30000);
    expect(adjustedResponse.body.cbAdjusted).toBeCloseTo(expectedCb + 30000, 5);
  });

  it('creates a valid pool after compliance records exist', async () => {
    await seedRoutes();

    await request(app).get('/compliance/cb').query({ shipId: 'TEST-NEG', year: 2024 });
    await request(app).get('/compliance/cb').query({ shipId: 'TEST-POOL', year: 2024 });

    const response = await request(app)
      .post('/pools')
      .send({
        year: 2024,
        members: [
          { shipId: 'TEST-NEG', year: 2024 },
          { shipId: 'TEST-POOL', year: 2024 },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.year).toBe(2024);
    expect(response.body.members).toHaveLength(2);
    expect(response.body.members.every((member: { shipId: string }) => ['TEST-NEG', 'TEST-POOL'].includes(member.shipId))).toBe(true);

    const persistedPool = await prisma.pool.findUnique({
      where: { id: response.body.id },
      include: { members: true },
    });
    expect(persistedPool).not.toBeNull();
    expect(persistedPool?.members).toHaveLength(2);
  });
});