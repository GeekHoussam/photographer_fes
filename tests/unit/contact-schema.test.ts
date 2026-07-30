import { describe, expect, it } from "vitest";
import { contactSchema } from "@/features/contact/schema";

const valid = {
  name: "Example Person",
  email: "person@example.com",
  phone: "",
  projectType: "wedding",
  preferredDate: "",
  location: "Fès",
  budget: "",
  message: "A sufficiently detailed project enquiry.",
  consent: true,
  website: "",
} as const;

describe("contactSchema", () => {
  it("accepts a complete enquiry", () =>
    expect(contactSchema.safeParse(valid).success).toBe(true));
  it("rejects a honeypot value", () =>
    expect(contactSchema.safeParse({ ...valid, website: "spam" }).success).toBe(
      false,
    ));
  it("requires consent and a meaningful message", () =>
    expect(
      contactSchema.safeParse({ ...valid, consent: false, message: "short" })
        .success,
    ).toBe(false));
});
