"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCacheService = void 0;
/**
 * Bonus: In-memory cache adapter implementing ICacheService.
 * Uses a plain Map — zero dependencies.
 * Can be swapped for a Redis adapter by providing a different ICacheService implementation.
 */
class InMemoryCacheService {
    constructor() {
        this.store = new Map();
    }
    async get(key) {
        const entry = this.store.get(key);
        if (!entry)
            return null;
        if (entry.expiresAt !== 0 && Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.value;
    }
    async set(key, value, ttlSeconds = 0) {
        const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
        this.store.set(key, { value, expiresAt });
    }
    async invalidate(key) {
        this.store.delete(key);
    }
    async invalidatePattern(pattern) {
        const regex = new RegExp(pattern);
        for (const key of this.store.keys()) {
            if (regex.test(key)) {
                this.store.delete(key);
            }
        }
    }
    /** Utility for testing — clears all entries */
    clear() {
        this.store.clear();
    }
    get size() {
        return this.store.size;
    }
}
exports.InMemoryCacheService = InMemoryCacheService;
//# sourceMappingURL=InMemoryCacheService.js.map