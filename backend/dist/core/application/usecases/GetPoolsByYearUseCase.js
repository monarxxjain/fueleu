"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPoolsByYearUseCase = void 0;
class GetPoolsByYearUseCase {
    constructor(poolRepo) {
        this.poolRepo = poolRepo;
    }
    async execute(year) {
        return this.poolRepo.findByYear(year);
    }
}
exports.GetPoolsByYearUseCase = GetPoolsByYearUseCase;
//# sourceMappingURL=GetPoolsByYearUseCase.js.map