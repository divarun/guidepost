import { createClient, RedisClientType } from 'redis';

class Cache {
  private client: RedisClientType | null = null;
  private memoryCache: Map<string, { value: string; expiresAt: number }> = new Map();
  private useRedis: boolean = false;

  async connect(): Promise<void> {
    if (process.env.REDIS_URL) {
      try {
        this.client = createClient({
          url: process.env.REDIS_URL,
        });

        this.client.on('error', (err) => {
          console.error('Redis Client Error:', err);
          this.useRedis = false;
        });

        await this.client.connect();
        this.useRedis = true;
        console.log('✅ Connected to Redis');
      } catch (error) {
        console.warn('⚠️  Failed to connect to Redis, using in-memory cache:', error);
        this.useRedis = false;
      }
    } else {
      console.log('ℹ️  No REDIS_URL provided, using in-memory cache');
      this.useRedis = false;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.useRedis && this.client) {
      try {
        return await this.client.get(key);
      } catch (error) {
        console.error('Redis GET error:', error);
        return this.getFromMemory(key);
      }
    }
    return this.getFromMemory(key);
  }

  async set(key: string, value: string, expirationSeconds?: number): Promise<void> {
    if (this.useRedis && this.client) {
      try {
        if (expirationSeconds) {
          await this.client.setEx(key, expirationSeconds, value);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (error) {
        console.error('Redis SET error:', error);
      }
    }
    this.setInMemory(key, value, expirationSeconds);
  }

  async del(key: string): Promise<void> {
    if (this.useRedis && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (error) {
        console.error('Redis DEL error:', error);
      }
    }
    this.memoryCache.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    if (this.useRedis && this.client) {
      try {
        const result = await this.client.exists(key);
        return result === 1;
      } catch (error) {
        console.error('Redis EXISTS error:', error);
      }
    }
    const cached = this.memoryCache.get(key);
    if (!cached) return false;
    if (cached.expiresAt > 0 && Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return false;
    }
    return true;
  }

  private getFromMemory(key: string): string | null {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    if (cached.expiresAt > 0 && Date.now() > cached.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    return cached.value;
  }

  private setInMemory(key: string, value: string, expirationSeconds?: number): void {
    const expiresAt = expirationSeconds
      ? Date.now() + expirationSeconds * 1000
      : 0;

    this.memoryCache.set(key, { value, expiresAt });

    // Clean up expired entries periodically
    if (this.memoryCache.size > 1000) {
      this.cleanupMemoryCache();
    }
  }

  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, cached] of this.memoryCache.entries()) {
      if (cached.expiresAt > 0 && now > cached.expiresAt) {
        this.memoryCache.delete(key);
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
    }
  }
}

export const cache = new Cache();

// Initialize cache connection
if (typeof window === 'undefined') {
  cache.connect().catch(console.error);
}