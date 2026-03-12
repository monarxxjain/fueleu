"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./infrastructure/server/app");
const container_1 = require("./infrastructure/container");
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
async function start() {
    // Verify DB connection before accepting traffic
    await container_1.prisma.$connect();
    console.log('✅ Database connected');
    const app = (0, app_1.createApp)();
    app.listen(PORT, () => {
        console.log(`🚀 FuelEU backend running on http://localhost:${PORT}`);
    });
}
start().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map