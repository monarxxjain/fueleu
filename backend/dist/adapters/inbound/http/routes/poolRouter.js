"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoolRouter = createPoolRouter;
const express_1 = require("express");
function createPoolRouter(controller) {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => controller.getByYear(req, res));
    router.post('/', (req, res) => controller.create(req, res));
    return router;
}
//# sourceMappingURL=poolRouter.js.map