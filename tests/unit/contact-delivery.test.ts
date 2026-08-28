// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactEmails } from "@/lib/email/send-contact-emails";
import type { ContactInput } from "@/features/contact/schema";

vi.mock("server-only", () => ({}));
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const input: ContactInput = {
  name: '<img src=x onerror="alert(1)">',
  email: "person@example.com",
  projectType: "wedding",
  location: "Fès",
  message: "A sufficiently detailed enquiry.\n<script>alert(1)</script>",
  consent: true,
};

beforeEach(() => {
  send.mockReset();
  vi.stubEnv("RESEND_API_KEY", "test-only-token");
  vi.stubEnv("CONTACT_FROM_EMAIL", "sender@example.com");
  vi.stubEnv("CONTACT_TO_EMAIL", "business@example.com");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("contact email delivery", () => {
  it("escapes enquiry text and keeps the business recipient and subject fixed", async () => {
    send.mockResolvedValue({ data: { id: "delivered" }, error: null });
    await sendContactEmails(input);
    const email = send.mock.calls[0][0];
    expect(email.to).toBe("business@example.com");
    expect(email.subject).toBe("New portfolio enquiry — wedding");
    expect(email.replyTo).toBe("person@example.com");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).not.toContain("<img");
    expect(send.mock.calls[1][0].html).not.toContain("<img");
  });

  it("does not acknowledge a failed business notification", async () => {
    send.mockResolvedValue({
      data: null,
      error: { message: "private detail" },
    });
    await expect(sendContactEmails(input)).rejects.toThrow(
      "Business notification failed",
    );
    expect(send).toHaveBeenCalledTimes(1);
  });

  it.each(["provider-error", "network-error"])(
    "does not report an already-delivered enquiry as failed after %s on its receipt",
    async (failure) => {
      vi.spyOn(console, "warn").mockImplementation(() => undefined);
      send.mockResolvedValueOnce({ data: { id: "delivered" }, error: null });
      if (failure === "provider-error")
        send.mockResolvedValueOnce({ error: { message: "private detail" } });
      else send.mockRejectedValueOnce(new Error("private detail"));
      await expect(sendContactEmails(input)).resolves.toEqual({
        id: "delivered",
      });
      expect(console.warn).toHaveBeenCalledWith(
        "Contact acknowledgement failed",
      );
    },
  );

  it("does not pretend to deliver without production mail credentials", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(sendContactEmails(input)).rejects.toThrow();
    expect(send).not.toHaveBeenCalled();
  });
});
