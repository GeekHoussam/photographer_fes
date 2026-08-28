// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { checkContactRateLimit } from "@/features/contact/rate-limit";
import { sendContactEmails } from "@/lib/email/send-contact-emails";

vi.mock("server-only", () => ({}));

vi.mock("@/features/contact/rate-limit", () => ({
  checkContactRateLimit: vi.fn(),
  getContactRateLimitKey: vi.fn(() => "test-client"),
}));
vi.mock("@/lib/email/send-contact-emails", () => ({
  sendContactEmails: vi.fn(),
}));

const valid = {
  name: "Example Person",
  email: "person@example.com",
  projectType: "wedding",
  location: "Fès",
  message: "A sufficiently detailed project enquiry.",
  consent: true,
  website: "",
};

function request(body: string = JSON.stringify(valid), headers = {}) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://portfolio.example",
      ...headers,
    },
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");
  vi.mocked(checkContactRateLimit).mockResolvedValue(true);
  vi.mocked(sendContactEmails).mockResolvedValue({ id: "test-delivery" });
});
afterEach(() => vi.unstubAllEnvs());

describe("contact endpoint", () => {
  it("delivers a valid same-origin enquiry without caching personal data", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(sendContactEmails).toHaveBeenCalledWith(valid);
  });

  it.each([
    "https://other.example",
    "null",
    "https://portfolio.example.attacker.test",
  ])("rejects the foreign origin %s before delivery", async (origin) => {
    expect((await POST(request(undefined, { Origin: origin }))).status).toBe(
      403,
    );
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("rejects a missing Origin", async () => {
    const req = request();
    req.headers.delete("origin");
    expect((await POST(req)).status).toBe(403);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it.each(["text/plain", "application/x-www-form-urlencoded"])(
    "rejects simple cross-site form content type %s",
    async (contentType) => {
      expect(
        (await POST(request(undefined, { "Content-Type": contentType })))
          .status,
      ).toBe(415);
      expect(sendContactEmails).not.toHaveBeenCalled();
    },
  );

  it("accepts JSON with a charset", async () => {
    expect(
      (
        await POST(
          request(undefined, {
            "Content-Type": "application/json; charset=utf-8",
          }),
        )
      ).status,
    ).toBe(200);
  });

  it("limits declared request length before reading", async () => {
    expect(
      (await POST(request(undefined, { "Content-Length": "20000" }))).status,
    ).toBe(413);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("limits actual bytes even when the declared length lies", async () => {
    const body = JSON.stringify({ ...valid, extra: "x".repeat(20000) });
    expect((await POST(request(body, { "Content-Length": "1" }))).status).toBe(
      413,
    );
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("bounds a chunked stream and cancels unread data", async () => {
    const cancel = vi.fn();
    const stream = new ReadableStream({
      pull(controller) {
        controller.enqueue(new Uint8Array(8192));
      },
      cancel,
    });
    const req = request();
    Object.defineProperty(req, "body", { value: stream });
    expect((await POST(req)).status).toBe(413);
    expect(cancel).toHaveBeenCalled();
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    expect((await POST(request("{"))).status).toBe(400);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("rejects invalid fields and honeypot submissions", async () => {
    expect(
      (await POST(request(JSON.stringify({ ...valid, website: "spam" }))))
        .status,
    ).toBe(400);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("returns a retry interval when the quota is exhausted", async () => {
    vi.mocked(checkContactRateLimit).mockResolvedValue(false);
    const response = await POST(request());
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("900");
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("fails closed when rate-limit storage is unavailable", async () => {
    vi.mocked(checkContactRateLimit).mockRejectedValue(
      new Error("private storage detail"),
    );
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: "unavailable" });
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("does not expose delivery errors", async () => {
    vi.mocked(sendContactEmails).mockRejectedValue(
      new Error("private provider detail"),
    );
    const response = await POST(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: "delivery" });
  });
});
