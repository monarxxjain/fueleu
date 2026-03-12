import 'dotenv/config';
import { createApp } from './infrastructure/server/app';
import { prisma } from './infrastructure/container';

const PORT = parseInt(process.env['PORT'] ?? '3001', 10);

async function start(): Promise<void> {
  // Verify DB connection before accepting traffic
  await prisma.$connect();
  console.log('✅ Database connected');

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`🚀 FuelEU backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
