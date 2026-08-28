import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";

type Entry = { count: number; resetAt: number };
const attempts = new Map<string, Entry>();
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 5;
const MAX_LOCAL_KEYS = 1000;

// The hosting proxy MUST overwrite this header and prevent direct origin access.
// Never infer trust from the mere presence of x-forwarded-for.
export function getContactRateLimitKey(headers: Headers) {
  const header = process.env.CONTACT_RATE_LIMIT_IP_HEADER;
  if (!header) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Trusted contact client IP header is not configured");
    }
    return "local";
  }
  const ip = headers.get(header)?.trim();
  if (!ip || ip.length > 64 || !isIP(ip)) {
    throw new Error("Trusted contact client IP is unavailable");
  }
  const canonical = isIP(ip) === 6 ? new URL(`http://[${ip}]`).hostname : ip;
  return createHash("sha256").update(canonical).digest("hex");
}

// Increment and expiry are one atomic operation, including concurrent workers.
const RATE_LIMIT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return count
`;

export async function checkContactRateLimit(key: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const endpoint = new URL(url);
    if (
      endpoint.protocol !== "https:" ||
      !endpoint.hostname.endsWith(".upstash.io") ||
      endpoint.username ||
      endpoint.password ||
      endpoint.port ||
      endpoint.search ||
      endpoint.hash ||
      endpoint.pathname !== "/"
    ) {
      throw new Error("Invalid rate-limit endpoint");
    }
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        RATE_LIMIT_SCRIPT,
        "1",
        `contact:${key}`,
        String(WINDOW_MS),
      ]),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error("Rate-limit storage unavailable");
    const data: unknown = await response.json();
    if (
      !data ||
      typeof data !== "object" ||
      !("result" in data) ||
      "error" in data ||
      typeof data.result !== "number" ||
      !Number.isSafeInteger(data.result) ||
      data.result < 1
    ) {
      throw new Error("Invalid rate-limit result");
    }
    return data.result <= LIMIT;
  }
  if (process.env.NODE_ENV === "production" || url || token) {
    throw new Error("Distributed contact rate limiting is not configured");
  }

  // This fallback is only for local development/tests, never production.
  const now = Date.now();
  for (const [existingKey, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(existingKey);
  }
  const current = attempts.get(key);
  if (!current) {
    if (attempts.size >= MAX_LOCAL_KEYS) return false;
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= LIMIT) return false;
  current.count += 1;
  return true;
}
