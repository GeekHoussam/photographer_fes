type Entry = { count: number; resetAt: number };
const attempts = new Map<string, Entry>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 5;

export async function checkContactRateLimit(key: string): Promise<boolean> {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= LIMIT) return false;
  current.count += 1;
  return true;
}
