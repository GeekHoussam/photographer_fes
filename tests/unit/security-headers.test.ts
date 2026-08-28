import { describe, expect, it } from "vitest";
import { createSecurityHeaders } from "@/config/security-headers";

describe("security response headers", () => {
  it("restricts framing and content sources without breaking static hydration", () => {
    const headers = Object.fromEntries(
      createSecurityHeaders(false, true).map(({ key, value }) => [key, value]),
    );
    expect(headers["Content-Security-Policy"]).toContain(
      "frame-ancestors 'none'",
    );
    expect(headers["Content-Security-Policy"]).toContain(
      "frame-src https://www.youtube-nocookie.com",
    );
    expect(headers["Content-Security-Policy"]).toContain("base-uri 'none'");
    expect(headers["Content-Security-Policy"]).not.toContain("unsafe-eval");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Strict-Transport-Security"]).toBe("max-age=31536000");
  });
  it("does not force HTTPS on a local HTTP server", () => {
    const headers = createSecurityHeaders(true, false);
    expect(headers.some(({ key }) => key === "Strict-Transport-Security")).toBe(
      false,
    );
    expect(headers[0].value).not.toContain("upgrade-insecure-requests");
  });
});
