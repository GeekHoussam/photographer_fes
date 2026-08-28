// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("CONTACT_RATE_LIMIT_IP_HEADER", "");
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("contact rate limiting", () => {
  it("does not trust arbitrary forwarding headers by default", async () => {
    const { getContactRateLimitKey } =
      await import("@/features/contact/rate-limit");
    expect(
      getContactRateLimitKey(new Headers({ "x-forwarded-for": "192.0.2.1" })),
    ).toBe("local");
    vi.stubEnv("NODE_ENV", "production");
    expect(() =>
      getContactRateLimitKey(new Headers({ "x-forwarded-for": "192.0.2.2" })),
    ).toThrow();
  });

  it("uses only the explicitly trusted header without retaining raw IPs", async () => {
    const { getContactRateLimitKey } =
      await import("@/features/contact/rate-limit");
    vi.stubEnv("CONTACT_RATE_LIMIT_IP_HEADER", "x-real-ip");
    const headers = new Headers({
      "x-real-ip": "192.0.2.1",
      "x-forwarded-for": "198.51.100.1",
    });
    const key = getContactRateLimitKey(headers);
    headers.set("x-forwarded-for", "198.51.100.2");
    expect(getContactRateLimitKey(headers)).toBe(key);
    expect(key).toMatch(/^[a-f0-9]{64}$/);
    headers.set("x-real-ip", "192.0.2.1, 192.0.2.2");
    expect(() => getContactRateLimitKey(headers)).toThrow();
  });

  it("normalizes equivalent IPv6 addresses", async () => {
    const { getContactRateLimitKey } =
      await import("@/features/contact/rate-limit");
    vi.stubEnv("CONTACT_RATE_LIMIT_IP_HEADER", "x-real-ip");
    expect(
      getContactRateLimitKey(new Headers({ "x-real-ip": "2001:db8::1" })),
    ).toBe(
      getContactRateLimitKey(
        new Headers({ "x-real-ip": "2001:0db8:0:0:0:0:0:1" }),
      ),
    );
  });

  it("allows five local attempts and expires them after 15 minutes", async () => {
    vi.useFakeTimers();
    const { checkContactRateLimit } =
      await import("@/features/contact/rate-limit");
    for (let i = 0; i < 5; i++)
      expect(await checkContactRateLimit("one")).toBe(true);
    expect(await checkContactRateLimit("one")).toBe(false);
    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(await checkContactRateLimit("one")).toBe(true);
  });

  it("bounds the local map and reclaims expired entries", async () => {
    vi.useFakeTimers();
    const { checkContactRateLimit } =
      await import("@/features/contact/rate-limit");
    for (let i = 0; i < 1000; i++)
      expect(await checkContactRateLimit(String(i))).toBe(true);
    expect(await checkContactRateLimit("overflow")).toBe(false);
    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(await checkContactRateLimit("overflow")).toBe(true);
  });

  it("never falls back to process memory in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const { checkContactRateLimit } =
      await import("@/features/contact/rate-limit");
    await expect(checkContactRateLimit("one")).rejects.toThrow();
  });

  it("uses atomic Redis EVAL with expiry, timeout and no redirects", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://test.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-only-token");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ result: 5 }))
      .mockResolvedValueOnce(Response.json({ result: 6 }));
    vi.stubGlobal("fetch", fetchMock);
    const { checkContactRateLimit } =
      await import("@/features/contact/rate-limit");
    expect(await checkContactRateLimit("one")).toBe(true);
    expect(await checkContactRateLimit("one")).toBe(false);
    const options = fetchMock.mock.calls[0][1];
    const command = JSON.parse(options.body);
    expect(command[0]).toBe("EVAL");
    expect(command[1]).toContain("PEXPIRE");
    expect(command.slice(2)).toEqual(["1", "contact:one", "900000"]);
    expect(options.redirect).toBe("error");
    expect(options.cache).toBe("no-store");
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it.each([
    { error: "private storage detail" },
    { result: "1" },
    { result: null },
    { result: -1 },
    null,
  ])("fails closed on an invalid Redis response: %j", async (result) => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://test.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-only-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(result)));
    const { checkContactRateLimit } =
      await import("@/features/contact/rate-limit");
    await expect(checkContactRateLimit("one")).rejects.toThrow();
  });

  it.each([
    "http://test.upstash.io",
    "https://attacker.test",
    "https://test.upstash.io.attacker.test",
  ])(
    "does not send a storage token to an invalid endpoint: %s",
    async (url) => {
      vi.stubEnv("UPSTASH_REDIS_REST_URL", url);
      vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-only-token");
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const { checkContactRateLimit } =
        await import("@/features/contact/rate-limit");
      await expect(checkContactRateLimit("one")).rejects.toThrow();
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});
