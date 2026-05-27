class MemoryCache {
  private store: Map<string, { value: string; expiresAt: number }> = new Map();

  get(key: string): string | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: string, expirationSeconds?: number): void {
    const expiresAt = expirationSeconds ? Date.now() + expirationSeconds * 1000 : 0;
    this.store.set(key, { value, expiresAt });
    if (this.store.size > 1000) this.evict();
  }

  del(key: string): void {
    this.store.delete(key);
  }

  exists(key: string): boolean {
    return this.get(key) !== null;
  }

  private evict(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (entry.expiresAt > 0 && now > entry.expiresAt) this.store.delete(key);
    }
  }
}

export const cache = new MemoryCache();

// Cache keys
export const cacheKeys = {
  user:             (id: string) => `user:${id}`,
  studentProgress:  (id: string) => `progress:student:${id}`,
  parentProgress:   (id: string) => `progress:parent:${id}`,
};

// TTLs in seconds
export const cacheTTL = {
  user:     60,
  progress: 30,
};
