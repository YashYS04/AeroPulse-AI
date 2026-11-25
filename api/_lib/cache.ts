// ============================================================
// api/_lib/cache.ts
// In-memory SHA-256 LRU Cache for sub-10ms GenAI responses
// ============================================================

import crypto from 'node:crypto';

interface CacheEntry<T> {
  data: T;
  createdAt: number;
}

/**
 * Bounded in-memory LRU cache keyed by deterministic 16-char SHA-256 digests.
 */
export class Sha256LruCache<T> {
  private map = new Map<string, CacheEntry<T>>();
  private readonly maxEntries: number;
  private readonly ttlMs: number;

  constructor(maxEntries = 100, ttlMs = 15 * 60 * 1000) {
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
  }

  /** Computes a deterministic 16-hex-character SHA-256 cache key. */
  public hashKey(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex').slice(0, 16);
  }

  /** Retrieves a fresh cached value and promotes it as most recently used. */
  public get(key: string): T | null {
    const entry = this.map.get(key);
    if (!entry) return null;

    if (Date.now() - entry.createdAt > this.ttlMs) {
      this.map.delete(key);
      return null;
    }

    this.map.delete(key);
    this.map.set(key, entry);
    return entry.data;
  }

  /** Inserts an entry, evicting the oldest item if capacity is reached. */
  public set(key: string, data: T): void {
    if (this.map.size >= this.maxEntries) {
      const oldestKey = this.map.keys().next().value;
      if (oldestKey) this.map.delete(oldestKey);
    }
    this.map.set(key, { data, createdAt: Date.now() });
  }

  /** Clears all entries from the cache. */
  public clear(): void {
    this.map.clear();
  }

  /** Returns the current number of cached entries. */
  public size(): number {
    return this.map.size;
  }
}

export const aiResponseCache = new Sha256LruCache<unknown>(200, 10 * 60 * 1000);
