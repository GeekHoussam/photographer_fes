import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/contact-form";

vi.mock("next-intl", () => ({ useLocale: () => "en" }));
vi.mock("@/i18n/navigation", () => ({ Link: "a" }));

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_CONTACT_EMAIL", ""));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function fillForm() {
  const user = userEvent.setup();
  await user.type(
    screen.getByLabelText("Name", { exact: true }),
    "Example Person",
  );
  await user.type(
    screen.getByLabelText("Email", { exact: true }),
    "person@example.com",
  );
  await user.type(screen.getByLabelText("Location", { exact: true }), "Fez");
  await user.type(
    screen.getByLabelText("Your message", { exact: true }),
    "A sufficiently detailed project enquiry.",
  );
  await user.click(screen.getByRole("checkbox"));
  return user;
}

describe("contact form delivery state", () => {
  it.each(["offline", "server-error"])(
    "shows a retryable message for %s",
    async (failure) => {
      const fetchMock = vi.fn();
      if (failure === "offline")
        fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
      else fetchMock.mockResolvedValueOnce({ ok: false });
      fetchMock.mockResolvedValueOnce({ ok: true });
      vi.stubGlobal("fetch", fetchMock);
      render(<ContactForm />);
      const user = await fillForm();
      await user.click(screen.getByRole("button", { name: "Send enquiry" }));
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Sending failed",
      );
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Name", { exact: true })).toHaveValue(
        "Example Person",
      );
      await user.click(screen.getByRole("button", { name: "Send enquiry" }));
      expect(await screen.findByRole("status")).toHaveTextContent(
        "Your enquiry has been sent",
      );
    },
  );
});
