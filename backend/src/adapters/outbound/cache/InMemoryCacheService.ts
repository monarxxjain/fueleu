import { ICacheService } from '../../../core/ports/outbound/ICacheService';

interface CacheEntry<T> {
  value: T;
  expiresAt: number; // Unix timestamp ms; 0 = never expires
}

/**
 * Bonus: In-memory cache adapter implementing ICacheService.
 * Uses a plain Map — zero dependencies.
 * Can be swapped for a Redis adapter by providing a different ICacheService implementation.
 */
export class InMemoryCacheService implements ICacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== 0 && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 0): Promise<void> {
    const expiresAt = ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
    this.store.set(key, { value, expiresAt });
  }

  async invalidate(key: string): Promise<void> {
    this.store.delete(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const regex = new RegExp(pattern);
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }

  /** Utility for testing — clears all entries */
  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
