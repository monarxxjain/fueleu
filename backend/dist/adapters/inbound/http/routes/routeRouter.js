"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouteRouter = createRouteRouter;
const express_1 = require("express");
function createRouteRouter(controller) {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => controller.getAllRoutes(req, res));
    router.get('/comparison', (req, res) => controller.getComparisonData(req, res));
    router.post('/:id/baseline', (req, res) => controller.setBaselineRoute(req, res));
    return router;
}
//# sourceMappingURL=routeRouter.js.map