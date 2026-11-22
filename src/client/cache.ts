/**
 * Small TTL cache persisted in localStorage, so repeat visits (and quick
 * city switches) don't hit Open-Meteo again within the TTL. Every access
 * is wrapped in try/catch: storage can be full, disabled, or unavailable
 * (private mode), and the app must keep working without it.
 */
const PREFIX = "havache:cache:";

export class TtlCache<T> {
  constructor(
    private namespace: string,
    private ttlMs: number
  ) {}

  private storageKey(key: string): string {
    return `${PREFIX}${this.namespace}:${key}`;
  }

  get(key: string): T | undefined {
    try {
      const raw = window.localStorage.getItem(this.storageKey(key));
      if (!raw) return undefined;
      const entry = JSON.parse(raw) as { v: T; x: number };
      if (Date.now() > entry.x) {
        window.localStorage.removeItem(this.storageKey(key));
        return undefined;
      }
      return entry.v;
    } catch {
      return undefined;
    }
  }

  set(key: string, value: T): void {
    try {
      window.localStorage.setItem(this.storageKey(key), JSON.stringify({ v: value, x: Date.now() + this.ttlMs }));
    } catch {
      // Storage full or unavailable — caching is best-effort only.
    }
  }
}

/** Drops expired entries so localStorage doesn't slowly fill up over many visits. */
export function pruneExpiredCache(): void {
  try {
    const now = Date.now();
    const stale: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(PREFIX)) continue;
      try {
        const entry = JSON.parse(window.localStorage.getItem(key) ?? "null") as { x?: number } | null;
        if (!entry || typeof entry.x !== "number" || entry.x < now) stale.push(key);
      } catch {
        stale.push(key);
      }
    }
    stale.forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // ignore
  }
}
