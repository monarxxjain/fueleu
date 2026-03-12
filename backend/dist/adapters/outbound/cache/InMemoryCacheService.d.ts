import { ICacheService } from '../../../core/ports/outbound/ICacheService';
/**
 * Bonus: In-memory cache adapter implementing ICacheService.
 * Uses a plain Map — zero dependencies.
 * Can be swapped for a Redis adapter by providing a different ICacheService implementation.
 */
export declare class InMemoryCacheService implements ICacheService {
    private readonly store;
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    invalidate(key: string): Promise<void>;
    invalidatePattern(pattern: string): Promise<void>;
    /** Utility for testing — clears all entries */
    clear(): void;
    get size(): number;
}
//# sourceMappingURL=InMemoryCacheService.d.ts.map