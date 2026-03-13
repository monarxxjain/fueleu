import { config } from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

config({ path: '.env' });

async function main(): Promise<void> {
  const url = process.env['DATABASE_URL'];
  if (!url) {
    throw new Error('DATABASE_URL missing in backend/.env');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });

  try {
    const host = new URL(url).host;
    const routes = await prisma.route.count();
    const compliance = await prisma.shipCompliance.count();
    const banks = await prisma.bankEntry.count();
    const pools = await prisma.pool.count();
    const members = await prisma.poolMember.count();

    console.log(
      JSON.stringify(
        { host, routes, compliance, banks, pools, members },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
