import { cache } from './cache';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minute
};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get current count
    const countStr = await cache.get(key);
    const currentCount = countStr ? parseInt(countStr) : 0;

    if (currentCount >= this.config.maxRequests) {
      const ttl = this.config.windowMs / 1000;
      return {
        allowed: false,
        remaining: 0,
        resetAt: now + this.config.windowMs,
      };
    }

    // Increment count
    const newCount = currentCount + 1;
    await cache.set(key, newCount.toString(), Math.ceil(this.config.windowMs / 1000));

    return {
      allowed: true,
      remaining: this.config.maxRequests - newCount,
      resetAt: now + this.config.windowMs,
    };
  }

  async resetLimit(identifier: string): Promise<void> {
    const key = `ratelimit:${identifier}`;
    await cache.del(key);
  }
}

export const rateLimiter = new RateLimiter();

// AI-specific rate limiter (more restrictive)
export const aiRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000, // 10 requests per minute
});

export function getRateLimitIdentifier(request: Request): string {
  // In production, you'd use the IP address or user ID
  // For now, we'll use a combination of user-agent and a simple hash
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

  return `${ip}:${userAgent.substring(0, 50)}`;
}