"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoutesUseCase = void 0;
const CACHE_KEY = 'routes:all';
const CACHE_TTL = 60; // 60 seconds
class GetRoutesUseCase {
    constructor(routeRepo, cache) {
        this.routeRepo = routeRepo;
        this.cache = cache;
    }
    async execute() {
        const cached = await this.cache.get(CACHE_KEY);
        if (cached)
            return cached;
        const routes = await this.routeRepo.findAll();
        await this.cache.set(CACHE_KEY, routes, CACHE_TTL);
        return routes;
    }
}
exports.GetRoutesUseCase = GetRoutesUseCase;
//# sourceMappingURL=GetRoutesUseCase.js.map