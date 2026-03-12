"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComplianceRouter = createComplianceRouter;
const express_1 = require("express");
function createComplianceRouter(controller) {
    const router = (0, express_1.Router)();
    router.get('/cb', (req, res) => controller.getCB(req, res));
    router.get('/adjusted-cb', (req, res) => controller.getAdjustedCBHandler(req, res));
    return router;
}
//# sourceMappingURL=complianceRouter.js.map