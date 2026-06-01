type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, RateLimitRecord>();

export type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
};

export function checkRateLimit(options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const current = memoryStore.get(options.key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + options.windowMs;
    memoryStore.set(options.key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      limit: options.limit,
      remaining: Math.max(options.limit - 1, 0),
      resetAt: new Date(resetAt),
    };
  }

  current.count += 1;
  memoryStore.set(options.key, current);

  const allowed = current.count <= options.limit;

  return {
    allowed,
    limit: options.limit,
    remaining: Math.max(options.limit - current.count, 0),
    resetAt: new Date(current.resetAt),
  };
}

export function createRateLimitKey(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(":");
}

export const RATE_LIMITS = {
  DEMO_ACCESS: {
    limit: 60,
    windowMs: 60 * 1000,
  },
  LOGIN_ATTEMPT: {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  },
  TOKEN_TEST: {
    limit: 20,
    windowMs: 60 * 1000,
  },
} as const;

export function cleanupRateLimitStore() {
  const now = Date.now();

  for (const [key, value] of memoryStore.entries()) {
    if (value.resetAt <= now) {
      memoryStore.delete(key);
    }
  }
}
