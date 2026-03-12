"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBankingRouter = createBankingRouter;
const express_1 = require("express");
function createBankingRouter(controller) {
    const router = (0, express_1.Router)();
    router.get('/records', (req, res) => controller.getRecords(req, res));
    router.post('/bank', (req, res) => controller.bank(req, res));
    router.post('/apply', (req, res) => controller.apply(req, res));
    return router;
}
//# sourceMappingURL=bankingRouter.js.map