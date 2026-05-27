import { cache } from './cache';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const defaultConfig: RateLimitConfig = {
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = { ...defaultConfig, ...config };
  }

  checkLimit(identifier: string): { allowed: boolean; remaining: number; resetAt: number } {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();

    const stored = cache.get(key);
    let currentCount = 0;
    let windowExpiry = now + this.config.windowMs;

    if (stored) {
      const sep = stored.indexOf(':');
      currentCount = parseInt(stored.slice(0, sep), 10);
      windowExpiry = parseInt(stored.slice(sep + 1), 10);
    }

    if (currentCount >= this.config.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: windowExpiry };
    }

    const newCount = currentCount + 1;
    const remainingSeconds = Math.max(1, Math.ceil((windowExpiry - now) / 1000));
    cache.set(key, `${newCount}:${windowExpiry}`, remainingSeconds);

    return {
      allowed: true,
      remaining: this.config.maxRequests - newCount,
      resetAt: windowExpiry,
    };
  }

  resetLimit(identifier: string): void {
    cache.del(`ratelimit:${identifier}`);
  }
}

export const rateLimiter = new RateLimiter();

export const aiRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000,
});

export function getRateLimitIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  const ua = (request.headers.get('user-agent') || '').substring(0, 50);
  return `${ip}:${ua}`;
}
