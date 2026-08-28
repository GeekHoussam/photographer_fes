// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import {
  readContactJson,
  validateContactRequest,
} from "@/features/contact/request-policy";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

it("times out a stalled body and cancels the stream", async () => {
  vi.useFakeTimers();
  const cancel = vi.fn();
  const request = new Request("https://portfolio.example/api/contact");
  Object.defineProperty(request, "body", {
    value: new ReadableStream({ cancel }),
  });
  const assertion = expect(readContactJson(request)).rejects.toMatchObject({
    status: 408,
  });
  await vi.advanceTimersByTimeAsync(10000);
  await assertion;
  expect(cancel).toHaveBeenCalled();
});

it("rejects malformed UTF-8 instead of silently replacing bytes", async () => {
  const request = new Request("https://portfolio.example/api/contact", {
    method: "POST",
    body: new Uint8Array([0xff]),
  });
  await expect(readContactJson(request)).rejects.toMatchObject({ status: 400 });
});

it("requires an explicit public origin in production", () => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  expect(() =>
    validateContactRequest(new Request("https://attacker.test/api/contact")),
  ).toThrow("unavailable");
});
