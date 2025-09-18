const store = new Map<string, number[]>();

export const globalRateLimiter = {
  check(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const arr = store.get(key) || [];
    const windowStart = now - windowMs;
    const filtered = arr.filter((t) => t > windowStart);
    if (filtered.length >= limit) return false;
    filtered.push(now);
    store.set(key, filtered);
    return true;
  }
};
