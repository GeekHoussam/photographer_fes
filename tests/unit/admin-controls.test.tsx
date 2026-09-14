import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";
import { MarkMessageRead } from "@/features/admin/ui/controls";
import { adminRequest } from "@/features/admin/ui/api-client";

const { refresh } = vi.hoisted(() => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));
vi.mock("next-intl", () => ({
  useTranslations: () =>
    Object.assign((key: string) => key, { has: () => true }),
  useLocale: () => "en",
}));
vi.mock("@/features/admin/ui/api-client", () => ({
  adminRequest: vi.fn().mockResolvedValue({ ok: true }),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe("opening messages", () => {
  it("acknowledges an unread message once", async () => {
    const view = render(<MarkMessageRead id="message" isRead={false} />);
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    view.rerender(<MarkMessageRead id="message" isRead />);
    view.rerender(<MarkMessageRead id="message" isRead={false} />);
    expect(adminRequest).toHaveBeenCalledTimes(1);
  });
  it("does not undo a manual unread action on an already-read message", () => {
    const view = render(<MarkMessageRead id="message" isRead />);
    view.rerender(<MarkMessageRead id="message" isRead={false} />);
    expect(adminRequest).not.toHaveBeenCalled();
  });
});
