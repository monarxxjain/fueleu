"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePoolUseCase = void 0;
class CreatePoolUseCase {
    constructor(complianceRepo, bankRepo, poolRepo) {
        this.complianceRepo = complianceRepo;
        this.bankRepo = bankRepo;
        this.poolRepo = poolRepo;
    }
    async execute(input) {
        if (input.members.length < 2) {
            throw new Error('A pool must have at least 2 members');
        }
        const requestedShipIds = [...new Set(input.members.map((m) => m.shipId))];
        if (requestedShipIds.length !== input.members.length) {
            throw new Error('A ship cannot appear more than once in the same pool request');
        }
        const alreadyAssigned = await this.poolRepo.findAssignedShipIds(input.year, requestedShipIds);
        if (alreadyAssigned.length > 0) {
            throw new Error(`Ship(s) already assigned to a pool for ${input.year}: ${alreadyAssigned.join(', ')}`);
        }
        // Gather adjusted CB for each member
        const memberData = [];
        for (const m of input.members) {
            const record = await this.complianceRepo.findByShipAndYear(m.shipId, m.year);
            if (!record) {
                throw new Error(`No compliance record for ship "${m.shipId}" year ${m.year}. Compute CB first.`);
            }
            const banked = await this.bankRepo.sumByShipAndYear(m.shipId, m.year);
            memberData.push({ shipId: m.shipId, adjustedCB: record.cbGco2eq + banked });
        }
        // Rule: sum of all adjusted CBs must be ≥ 0
        const totalCB = memberData.reduce((sum, m) => sum + m.adjustedCB, 0);
        if (totalCB < 0) {
            throw new Error(`Pool is invalid: total adjusted CB = ${totalCB.toFixed(2)} gCO₂eq (must be ≥ 0)`);
        }
        // Greedy allocation: sort desc by CB, transfer surplus to deficits
        const sorted = [...memberData].sort((a, b) => b.adjustedCB - a.adjustedCB);
        const cbValues = sorted.map((m) => ({ ...m, cbAfter: m.adjustedCB }));
        for (let i = 0; i < cbValues.length; i++) {
            for (let j = cbValues.length - 1; j > i; j--) {
                if (cbValues[i].cbAfter > 0 && cbValues[j].cbAfter < 0) {
                    const transfer = Math.min(cbValues[i].cbAfter, -cbValues[j].cbAfter);
                    cbValues[i].cbAfter -= transfer;
                    cbValues[j].cbAfter += transfer;
                }
            }
        }
        // Validate post-allocation rules
        for (const m of cbValues) {
            const original = memberData.find((x) => x.shipId === m.shipId);
            if (original.adjustedCB < 0 && m.cbAfter < original.adjustedCB) {
                throw new Error(`Pooling rule violated: deficit ship "${m.shipId}" exits worse than it entered`);
            }
            if (original.adjustedCB >= 0 && m.cbAfter < 0) {
                throw new Error(`Pooling rule violated: surplus ship "${m.shipId}" cannot exit negative`);
            }
        }
        // Persist
        const pool = await this.poolRepo.create(input.year);
        const finalMembers = [];
        for (const m of cbValues) {
            const original = memberData.find((x) => x.shipId === m.shipId);
            const member = {
                shipId: m.shipId,
                cbBefore: original.adjustedCB,
                cbAfter: m.cbAfter,
            };
            await this.poolRepo.addMember(pool.id, input.year, member);
            finalMembers.push(member);
        }
        return {
            id: pool.id,
            year: pool.year,
            members: finalMembers,
            createdAt: pool.createdAt,
        };
    }
}
exports.CreatePoolUseCase = CreatePoolUseCase;
//# sourceMappingURL=CreatePoolUseCase.js.map