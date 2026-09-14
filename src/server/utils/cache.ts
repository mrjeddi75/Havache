/**
 * Minimal in-memory TTL cache. Good enough for a single-instance
 * deployment; a multi-instance production deployment would want a
 * shared store (e.g. Redis) instead, but this removes the vast
 * majority of duplicate upstream calls for a demo/small app.
 */
export class TtlCache<T> {
  private store = new Map<string, { value: T; expiresAt: number }>();

  constructor(private ttlMs: number) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    // Opportunistic cleanup so the map doesn't grow unbounded over a long-running process.
    if (this.store.size > 500) {
      const now = Date.now();
      for (const [k, v] of this.store) {
        if (v.expiresAt < now) this.store.delete(k);
      }
    }
  }
}
